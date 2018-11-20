/*
 *
 * Helpers for various tasks
 * 
 */

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




 module.exports = helpers;
