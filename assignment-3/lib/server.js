
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
 const handlers = require('./handler');
 const helpers = require('./helpers');
 const _data = require('./data');


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
    const queryStringObject = parsedUrl.query;
   
    // Get the method 
    const method = req.method.toLowerCase();

    // Obtain the header
    const headers = req.headers;

    // Obtain the payload if there is any 
    const decoder = new stringDecoder('utf-8');

    let buffer = '';

    // Listen and collect the data
    req.on('data', (data)=> {
        buffer += decoder.write(data);
    });

    req.on('end', () => {

        buffer += decoder.end();


        // Choose the handler in which the request should go to
        let chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

        // If the request is within the pubic directory please handle 
        chosenHandler  =  trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler
        
        // construct the data object that needs to go to th data handler
        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload: helpers.parseJsonToObject(buffer)
            //payload: buffer 
        }


        
        chosenHandler(data, (statusCode, payload, contentType) => {

            // Detemine the content type (fallback to JSON)
            contentType = typeof(contentType) === 'string' ? contentType : 'json';

            // Call the statuscode from the handler or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;



            let payloadString = '';

            if(contentType === 'json'){
               res.setHeader('content-type', 'application/json');
               payload = typeof(payload) === 'object' ? payload : {};
               payloadString = JSON.stringify(payload);
            }

            if(contentType === 'html'){
                res.setHeader('content-type', 'text/html');
                payloadString = typeof(payload) === 'string' ? payload : '';
            

            }

            if(contentType ==='css'){
                res.setHeader('content-type', 'text/css');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
        
            }

            if(contentType === 'jpg'){
                res.setHeader('content-type', 'image/jpeg');
               payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }

            if(contentType === 'plain'){
                res.setHeader('content-type', 'plain');
                payloadString= typeof(payload) !== 'undefined' ? payload : '';
            }

            if(contentType === 'favicon'){
                res.setHeader('content-type', 'image/x-icon');
                payloadString= typeof(payload) !== 'undefined' ? payload : '';
            }

            if(contentType === 'png'){
                res.setHeader('content-type', 'image/png');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }




    

            // Send back response to the user 
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log(`Returning this response ${statusCode} ${payloadString}`)
        });

    });

 });

 // Define a server router
 server.router = {
     '': handlers.index,
     'account/create': handlers.accountCreate,
     'account/edit':handlers.accountEdit,
     'account/delete': handlers.accountDelete,
     'menu': handlers.menuList,
     'session/create': handlers.sessionCreate,
     'session/delete': handlers.sessionDelete,
     'api/users' : handlers.users,
     'api/tokens' : handlers.tokens,
     'api/orders': handlers.orders,
     'api/menu': handlers.menu,
     'api/orders': handlers.orders,
     'api/shoppingcart': handlers.shoppingcart,
     'public': handlers.public   

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