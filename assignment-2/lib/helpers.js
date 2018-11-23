/*
 *
 * Helpers for various tasks
 * 
 */

 // Dependencies
 const config = require('./config');
 const crypto = require('crypto')

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









 module.exports = helpers;
