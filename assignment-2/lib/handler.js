/*
 *
 * Request handlers
 * 
 */


 // Handler factory
 const handlers = {};

 handlers.user = (data, callback) => {
     callback(200);
 };



 //ping handler
 handlers.ping = (data, callback) => {
     callback(200);
 };

 // Path for not found
 handlers.notFound = (data, callback) => {
    callback(403);
 };



 // Container for the user submethods
 handlers._users = {};

 // Helper to pick submethod from user handler

 handlers.user = (( data , callback) => {
    const acceptableMethods = ['post', 'get', 'delete', 'put'];
    if(acceptableMethods.includes(data.method)) return handlers._users[data.method](data, callback);
    callback(405);
 });


   


 module.exports = handlers;
