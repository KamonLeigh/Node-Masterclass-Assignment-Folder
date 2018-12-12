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
    
    console.log({email, orderId, total})

    // validate variables in function
    email = typeof(email) === 'string' && email.trim().length > 0 ?  email : false;
    orderId = typeof(orderId) === 'string' && orderId.trim().length > 0 ? orderId : false;
    total = typeof(total) ==='number' && total > 0 ? total : false;

    // Check if all the information provided is valid and then proceed 
    if(email && orderId && total) {

        // Message send to the customer
        const text = 'Your order for ${orderID} for £${total} is been successfully chraged to your credit card'

        // configure the payload 
        payload = {
            from: '',
            to: email,
            subject:`Bill for order: ${orderId}`,
            text,
        }

        // Stringfy the payload 
        const stringfyPayload = querystring.stringify(payload);

        // Configure the payload to be send 
        const requestDetails = {
            protocol: 'https:',
            hostname: 'api.mailgun.net',
            method:'POST',
            path: `/v3/${config.mailgun.domain}/messages`,
            auth:`api:${config.mailgun.apikey}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringfyPayload)
            }
        }

        console.log(requestDetails);

        const req = https.request(requestDetails, (res) => {

            // Grab the the status code from the request
                const statusCode = res.statusCode

               

            // Callback statusCode 
            if(statusCode === 200 || statusCode === 201){
                callback(false)
            } else {
                callback('Status code returned was ' + status)
            }

            // Bind the error so it does not get thrown
            req.on(error, (e) => {
                callback(e);
            })

            // Add the payload
            req.write(stringfyPayload);

            // End request
            req.end();

        })

        callback(false);
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
            amount: totalPrice,
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
            auth: config.stripe.apikey,
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringfyPayload)
            }
        }

        const req = https.request(requestDetails, (res) => {

            // Grab the status code 
            const statusCode = res.statusCode;

            // Handle the data stream
            const decoder = new stringDecoder('utf-8');

            let buffer = '';

            req.on('data', (data) => {

                buffer += decoder.write(data);

            });

            req.on('end', () => {
                buffer += decoder.end();

                const data = helpers.parseJsonToObject(buffer);

                if(statusCode === 200 || statusCode === 201 && data){

                    callback(false, data.id);

                } else {
                    callback('Payment not successful')
                }

            });


            // Bind the error so it does not get thrown
            req.on('error',(err) => {
                callback(err)
            })

            req.write(stringfyPayload);

            // End Request
            req.end();
            
        })


        callback(false)

    } else {
        callback()
    }

};



 module.exports = helpers;
