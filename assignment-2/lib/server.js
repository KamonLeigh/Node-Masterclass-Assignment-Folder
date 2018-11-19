
/*
 *
 * Server-related tasks
 * 
 */


 // Dependencies
 const http = require('http');
 const https = require('https');
 const fs = require('fs');
 const path = require('path');
 const url = require('url');
 const stringDecoder = require('string_decoder').StringDecoder;
 const config = require('./config');
 const handlers = require('./handler')


 // Declare server
 const server = {};


 // Keys for the HTTPS key
 server.httpsServerOptions = {
     key: fs.readFileSync(path.join(__dirname,'./../https/key.pem')),
     cert: fs.readFileSync(path.join(__dirname,'./../https/cert.pem'))
 }



 // Instantiate the HTTP server
 server.httpServer = http.createServer((req, res) => {
    server.unifiedServer(req, res);
 });

 // Instantiate the HTTPS server
 server.httpsServer = https.createServer(server.httpsServerOptions,(req, res) => {
    server.unifiedServer(req, res);
 });


 // All the logic for both of the servers
 server.unifiedServer = ((req, res) => {

    // Get the URL and parse
    const parsedUrl = url.parse(req.url, true);

    // Get the pathname 
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Obtain the query string 
    const queryStringObject = parsedUrl.queryString;

    // Get the method 
    const method = req.method.toLowerCase();

    // Obtain the header
    const headers = req.headers;

    // Obtain the payload if there is any 
    const decoder = new stringDecoder('uft8');

    let buffer = '';

    // Listen and collect the data
    req.on('data', (data)=> {
        buffer += decoder.write(data);
    });

    req.on('end', () => {

        buffer += decoder.end();


        // Choose the handler in which the request should go to

        const chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmendPath] : handlers.notFound;

        // construct the data object that needs to go to th data handler
        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload: buffer
        }

        chosenHandler(data, (statusCode, payload) => {

            // Call the statuscode from the handler or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // call the payload otherwise default to empty object
            payload = typeof(payload) == 'object' ? payload : {};

            // Convert the payload to a string
            const payloadString = JSON.stringify(payload);

            // Send back response to the user 
            res.sendHeader('Content-type', 'application/json')
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log(`Returning this response ${statusCode} ${payloadString}`)
        });

    });

 });


 // Define a server router
 server.router ={
     users : handlers.users
 }


 server.init = () => {

    // Start HTTP server
    server.httpServer.listen(config.httpPort, () => {
        console.log(`The server is listening on port ${config.httpPort} in ${config.envName} mode`);
    });

    // Start HTTPS Server
    server.httpsServer.listen(config.httpsPort,() => {
        console.log(`The server is listening on port ${config.httpsPort} in ${config.envName} mode`);
    });
 }

 // Export the Server
 module.exports = server;