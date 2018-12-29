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
    let requestUrl = path+'?';
    let counter = 0;

      for(const queryKey in queryStringObject){
         if(queryStringObject.hasOwnProperty(queryKey)){
            counter++;
            // if at least one query string parameter has already been added, prepend new one with &

            if(counter > 1){
               requestUrl+='&'
            }

            // Add the key value
            requestUrl += queryKey + '=' + queryStringObject[queryKey];

         }
      }

      // Form the http request as a JSON type
      const xhr = new XMLHttpRequest();

      xhr.open(method, requestUrl, true);
      xhr.setRequestHeader("Content-Type", "application/json");

      // For each header sent add it to the request
      for(const headerKey in headers){
        if(headers.hasOwnProperty(headerKey)){
           xhr.setRequestHeader(headerKey, headers[headerKey])
        }
      }

      // If there is a current session token set, add that as a header
      if(app.config.sessionToken){
         xhr.setRequestHeader("token", app.config.sessionToken.id);
      }

      // When the request comes handle the response 
      xhr.onreadystatechange = () => {
         if(xhr.readyState == XMLHttpRequest.DONE){
             var statusCode = xhr.status;
            var  responseReturned = xhr.responseText;
         }

         // callback if requested

         if(callback){
            try{
               const parsedResponse = JSON.parse(responseReturned)
               callback(statusCode, parsedResponse);

            } catch(e){
               callback(statusCode, false);

            }
         }
      }


      // Send the payload as string
     var payloadString = JSON.stringify(payload);

      xhr.send(payloadString);
 }


 // Bind forms 

 

 // config

 app.config = {
    'sessionToken' : false
 }



