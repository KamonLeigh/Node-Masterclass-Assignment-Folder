/*
 * Frontend Logic for the application
 *
 */

 // Container for the frontend appliocation

 const app = {};

 // AJAX client ( for RESTful API)
 app.client = {}

 // Interface for making API calls
 app.client.request = (headers, path, method, queryStringObject, payload, callback) => {

    // Set defaults
    headers = typeof(headers) === 'object' && headers !== null ? headers : null;
    path = typeof(path) === 'string' ? path : '/';
    method = typeof(method) === 'string' && ['POST', 'GET', 'DELETE', 'PUT'].indexOf(method.toUpperCase()) > -1 ? method : 'GET';
    queryStringObject = typeof(queryStringObject) === 'object' && queryStringObject !== null ? queryStringObject : {};
    payload = typeof(payload) === 'object' && payload !== null ? payload : {};
    callback = typeof(callback) == 'function' ? callback : false;

    // For each query string parametter sent, add it to the path
 }



