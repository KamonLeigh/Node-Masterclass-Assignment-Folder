/*
 *
 * Helpers for various tasks
 * 
 */

 // Dependencies
 const config = require('./config');
 const crypto = require('crypto');
 const https = require('https');
 const querystring = require('querystring');
 const stringDecoder = require('string_decoder').StringDecoder;
 const path = require('path');
 const fs = require('fs');


 // Container for all the helps
 const helpers = {};





// Parse a JSON to a string in all cases 
helpers.parseJsonToObject = (str) => {
    try {
        return JSON.parse(str);
    } catch(e){
        return {}
    }
}

// Create funtion to hash string sha256
helpers.hash = (str) => {
    if(typeof(str) === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', config.secret).update(str).digest('hex');

        return hash                   

    } else {
        return false 
    }

}

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function (strLength) {
    strLength = typeof (strLength) == 'number' && strLength > 0 ? strLength : false;

    if (strLength) {
        // Define all the possible chracters that could go into a string
        const possibleCharacters = 'abcdefghijklmopqrstuvwxyz0123456789';

        // Start the final string
        let str = '';
        for (i = 1; i <= strLength; i++) {
            // Get a random charactor form the possibleCharacters string

            var randomCharater = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))
            // Append this character to the final string
            str += randomCharater;

        }

        // Return the final string

        return str;


    } else {
        return false;
    }
}

// Send an email via mailgun
helpers.sendEmail = (email, orderId, total, callback) => {
    

    // validate variables in function
    email = typeof(email) === 'string' && email.trim().length > 0 ?  email : false;
    orderId = typeof(orderId) === 'string' && orderId.trim().length > 0 ? orderId : false;
    total = typeof(total) ==='number' && total > 0 ? total : false;

    // Check if all the information provided is valid and then proceed 
    if(email && orderId && total) {

        // Message send to the customer
        const text = `Your order for ${orderId} for £${total} is been successfully charged to your credit card`

        // configure the payload 
        payload = {
            from: config.mailgun.email, 
            to: email,
            subject:`Bill for order: ${orderId}`,
            text,
        }


        debugger
        // Stringfy the payload 
        const stringfyPayload = querystring.stringify(payload);

        // Configure the payload to be send 
        const requestDetails = {
            protocol: 'https:',
            hostname: 'api.mailgun.net',
            method:'POST',
            path: `/v3/${config.mailgun.domain}`,
            auth:config.mailgun.apiKey,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringfyPayload)

            }
        }

        console.log(requestDetails);

        debugger
        const req = https.request(requestDetails, (res) => {

            // Grab the the status code from the request
                const statusCode = res.statusCode

               debugger

            // Callback statusCode 
            if(statusCode === 200 || statusCode === 201){
                
                debugger
                callback(false)
            
            } else {
                callback('Status code returned was ' + statusCode)
            }

        })

            // Bind the error so it does not get thrown
            req.on('error', (e) => {

               
                callback(e);
            })

            // Add the payload
            req.write(stringfyPayload);

           
            // End request
            req.end();

            



    } else {
        callback('Given parameters are missing or invalid')
    }

}

// Charge the customer using stripe 
helpers.chargeCustomer = (email, totalPrice, orderId, callback) => {

    // console.log(typeof())
    // validate the varibles in the function 

    email = typeof(email) == 'string' && email.trim().length > 0 ? email : false;
    totalPrice = typeof(totalPrice) == 'number' && totalPrice > 0 ? totalPrice : false,
    orderId = typeof (orderId) === 'string' && orderId.trim().length > 0 ? orderId : false;

   
    if(email && totalPrice && orderId){

        // configure the payload
        const payload = {
            amount: totalPrice * 100,
            currency: 'gbp',
            source: 'tok_visa_debit',
            description: `Charge ${email} id ${orderId} total: ${totalPrice}`
        }

       

        console.log(payload)
        const stringfyPayload = querystring.stringify(payload);

        // Convert the payload to a string
        const requestDetails ={
            protocol: 'https:',
            method: 'POST',
            hostname: 'api.stripe.com',
            path:'/v1/charges',
            auth: config.stripe.apiKey,
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringfyPayload)
            }

        }

       
        const req = https.request(requestDetails, (res) => {

            // debugger
            // const status = res.statusCode;

            // debugger

            // if(status == 200 || status == 201){
            //     callback(false)
            // } else {
            //      callback('Status code returned was ' + status);
            // }
           
            res.setEncoding('utf8');
            res.on('data', (data) => {
                const responseObject = helpers.parseJsonToObject(data);
            
                if(responseObject.id){
                    callback(false)
                } else {
                    callback(true, {Error: 'paymenthas not been made'})

                }
            })
        });


       
        req.on('error', (e) => {
            callback(e);
        });

       

        req.write(stringfyPayload);

       
        req.end();

       
    
} else {
        callback('Given parameters are missing or invalid');

}


}


// Read files from static files 
helpers.getStaticAssets = (fileName, callback) => {
 fileName = typeof(fileName) === 'string' && fileName.length > 0 ? fileName : false;

 if(fileName) {
     const publicDir =  path.join(__dirname, './../public/');

     fs.readFile(publicDir+fileName, (err, data) => {
         if(!err && data){
             callback(200, data)
         } else {
             callback('No file could be found')
         }
     })

 } else {
     callback('A valid filename was not specified')
 }

}

// Get the string data from the template 
helpers.getTemplate = (templateName, data, callback) => {

    // check the data types 
    templateName = typeof(templateName) === 'string' && templateName.length > 0 ? templateName : false;
    data = typeof(data) === 'object' && data ? data : {};

    if(templateName){
        const templateDir = path.join(__dirname, './../templates/');

        // Read file from chosen directory
        fs.readFile(templateDir+templateName+'.html', 'utf8', (err, str) => {

            // Validate data from file 
            if(!err && str && str.length > 0){
                

                const finalString = helpers.interpolate(str, data);

                callback(false, finalString);

            } else {

                callback('No template could be found')
            }

        })


    } else {
        callback('A valid template name was not specifie');
    }

}


// helper function to rea static files 
helpers.getStaticAssets = (fileName, callback) => {

    // Get path to files in public directory
    const publicDir = path.join(__dirname, '../public/');
    fileName = typeof(fileName) === 'string' && fileName.length > 0 ? fileName :  false;

    if(fileName){
         // Read file from public directory
        fs.readFile(publicDir + fileName, (err, data) => {

            if (!err && data) {

                callback(false, data)
            } else {

                callback('File could not be found ')
            }

        })

    } else {
        callback('A valid file name was not specifieds')
    }   

}


// Take a given string and data object, and find/replace all the keys within it 
helpers.interpolate = (str, data) => {
    str = typeof(str) == 'string' && str.length > 0 ? str : '';
    data = typeof(data) == 'object' && data !== null ? data : {};




    // Add the templateGlobals to the data object
    for(const keyName in config.templateGlobals){
        data[`global.${keyName}`] = config.templateGlobals[keyName];
    }

   

    // For each key in the str replace the placeholder with the corresponding value 

    for(const key in data){
        if(data.hasOwnProperty(key) && typeof(data[key]) === 'string'){
            const replace = data[key];
            const find = '{'+key+'}';
            console.log({replace, find});

            // Swap out the appropaite values 
            str = str.replace(find, replace);
        }
    }

    return str;
 
};

// Add the universal header and footer to a string, and pass the provided data object to the header and footer for interpolation
helpers.addUniversalTemplates = (str, data, callback) => {
    str = typeof(str) === 'string' && str.length > 0 ? str : '';
    data = typeof(data) === 'object' && data !== null ? data : {};

    // Get the header string
    helpers.getTemplate('_header', data, (err,  headerString) => {

        if(!err && headerString){

            // Get the footer string 
            helpers.getTemplate('_footer', data, (err, footerString) => {

                if(!err && footerString){
                    // Add all of the strings together 

                    const finalString = headerString + str + footerString;
                    callback(false, finalString);
                } else {

                    callback('Could not find the footer ')
                }

            })

        } else {

            callback('Could not find the header')
        }


    })


};


 module.exports = helpers;
