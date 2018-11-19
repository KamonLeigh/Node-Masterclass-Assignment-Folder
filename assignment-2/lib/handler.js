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




 module.exports = handlers;
