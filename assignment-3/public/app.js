/*
 * Frontend Logic for the application
 *
 */

 // Container for the frontend appliocation

 const app = {};

 // AJAX client ( for RESTful API)
 app.client = {}

 // config
 app.config = {
    'sessionToken' : false
 }

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

 // Bind the menu button 
 app.bindMenuButton = () => {
    document.querySelector('.menu a').addEventListener('click', (e) => {
   
    // Stop page from redirecting anywhere
    e.preventDefault();



    // load data from menu api
    app.menuLoad();

    });
 };


 // Click button to redirect user to the correcty page with menu data

 app.menuLoad = () => {
    
   // Make an api call to menu api

   app.client.request(undefined, 'api/menu', 'GET', undefined, undefined, (statusCode, responsePayload) => {

      // map throw the array and generate html
      if(statusCode === 200 && responsePayload){

         const table = document.querySelector('.table-list');

         const menuItems = responsePayload.menu;

         let menuList = '';
         
         menuItems.forEach((menuItem) => {
            const item = `<tr>
            <td>${menuItem.name}</td>
            <td>£${menuItem.price}</td>
            </tr>`
            
            menuList +=item;
         });

        table.innerHTML = menuList;
      
      }
     


   });
 }

// Bind the logout Button 
 app.bindLogoutButton = () => {
    document.getElementById("logoutButton").addEventListener('click', (e) => {

      // Stop it from redirecting anywhere
      e.preventDefault();

      // Log the user out
      app.logUserOut();

    });
 };

 // Log the user out then  redirect them 
 app.logUserOut = () => {
    // Get the current token id
    const tokenId = typeof(app.config.sessionToken.id) == 'string' ? app.config.sessionToken.id : false;

    // Send the current string as a query string
    const queryStringObject = {
       id: tokenId
    }

    // Make the api call to the delete endpoint 
    app.client.request( undefined, 'api/tokens', 'DELETE', queryStringObject, undefined ,(statusCode, responsePayload) => {

      // set the app.config.token to false;
      app.setSessionToken(false);

      // redirect to the home page
      window.location = 'session/delete';

    });
 }

 // Bind forms 
 app.bindForms = () => {

   if(document.querySelector('form')) {

      document.querySelector("form").addEventListener("submit", function(e){
         
         // Prevent form from submiting
         e.preventDefault();
         const formId = this.id;
         const path = this.action;
         const method = this.method.toUpperCase();
         
         // Hide error message if mesaage is shown from previous actions
         document.querySelector("#"+formId+" .formError").display = "hidden";
         
         // Turn the inputs into the payload 
         var payload = {};
         var elements = this.elements;
         
         
         for(let i = 0; i < elements.length; i++){
            if(elements[i].type !== "submit"){
               const valueOfElements = elements[i].type == "checkbox" ? elements[i].checked : elements[i].value;
               payload[elements[i].name] = valueOfElements;
               
            }
         }
         
           
         
         // Call api
         app.client.request(undefined, path, method, undefined, payload, (statusCode, resposePayload) => {
            
            console.log(statusCode);
            // Display sn error on the form if needed 
            if(statusCode !== 200){
               
               console.log('running');
               // Try and get the error from responsePayload otherwise stick to default
               const error = typeof(resposePayload.Error) === 'string' ? responsePayload.Error : 'An Error has occured please try again';
               
               // Append to the error block
               document.querySelector("#"+formId+" .formError").innerHTML = error;
               
               // Change display to block inorder to show message to the user 
               document.querySelector("#"+formId+" .formError").style.display = 'block';
               
            } else {
               console.log('also runniing')
               // If api call was sucessful, send to form response processor
               app.formResponseProcessor(formId, payload, resposePayload);
            }
         })
         
         
      })
   }
 }

// Form response processor
app.formResponseProcessor = (formId, requestPayload, responsePayload) => {
   let functionToCall = false;

   if(formId == 'accountCreate'){
     // Take the phone and password, and use it to log the user in 
    const newPayload = {
       userName : requestPayload.userName,
       password: requestPayload.password
    }

    
    app.client.request(undefined, 'api/tokens', 'POST', undefined ,newPayload, (newStatusCode, newResponseePayLoad) => {


      console.log(newStatusCode);
      // Display an errot on the form id needed
      if(newStatusCode !== 200){

         // set thr formError field with the error text
         document.querySelector("#"+formId+" .formError").innerHTML = 'Sorry, an error has occured. Please try again.';

         // change the display error on the form to block
          document.querySelector("#" + formId + " .formError").style.display = 'block';

      } else {
         // If sucessful, set the token and redirest the user 
         app.setSessionToken(newResponseePayLoad);
         window.location = '/menu'
      }

    
   });

   }

   if(formId == 'sessionCreate'){
      app.setSessionToken(responsePayload);
      window.location = '/menu';
   }


};


// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = (add) => {
   const token = document.querySelector('body');

   if(add){
      token.classList.add('loggedIn');
   } else {
      token.classList.remove('loggedIn');

   }
}

// Get the session token from the localstorage and set it in the app.config object
app.getSessionToken = () => {
   const tokenString = localStorage.getItem('token');

   if(typeof(tokenString) === 'string'){

      try{
         const token = JSON.parse(tokenString);
         if(typeof(token) === 'object'){
            app.setLoggedInClass(true);
         } else {
            app.setLoggedInClass(false);
         }

      } catch(e){
         app.config.sessionToken = false;
         app.setLoggedInClass(true);
      }
   }
}

//  set session in the app.config and local storage
app.setSessionToken = (token) => {
  app.config.sessionToken = token;
  const tokenString = JSON.stringify(token);
  localStorage.setItem('token', tokenString);

  if(typeof(token) == 'object'){
     app.setLoggedInClass(true);
  } else {
     app.setLoggedInClass(false);
  }
}

// Renew the token
app.renewToken = (callback) => {
   const currentToken = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
   if(currentToken){
      // Update the token with a expirattion 
      const payload ={
         id: currentToken.id,
         extend: true
      };

      app.client.request(undefined, 'api/tokens', 'PUT', undefined, payload, (statusCode, responsePayload) => {
         // Display an error on the form if needed 

         if(statusCode == 200){
            // Get the new tokem details
            const queryStringObject = { id : currentToken.id};
            app.client.request(undefined, 'api/tokens', 'GET', queryStringObject, undefined, (statusCode, responsePayload) => {
               if(statusCode == 200){
                  app.setSessionToken(responsePayload);
                  callback(false)

               } else {
                  app.setSessionToken(false);
                  callback(true)
               }
            })


         } else {
            app.setSessionToken(false);
            callback(true)
         }
      });
   } else {
      app.setSessionToken(false);
      callback(true);
   }

}

// Loop to renew token often
app.tokenRenewalLoop = () => {
   setInterval(() => {
      app.renewToken((err) => {
         if (!err) {
            console.log("Token renewed successfully @ " + Date.now());
         }
      });
   }, 1000 * 60);
};

// Load data on page
app.loadDataOnPage = () => {

   // Get the current page from the body class 
   const bodyClasses = document.querySelector('body').classList;
   const primayClass = typeof(bodyClasses[0]) == 'string' ? bodyClasses[0] : false;


   if(primayClass == 'accountEdit'){
      app.loadAccountEditData();
   }


}

app.loadAccountEditData = () => {
   // Get the user data from the token otherwise logout
   const userName = typeof(app.config.sessionToken.userName) == 'string' ? app.config.sessionToken.config : false;

   if(userName){

   } else {
      // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
      app.logUserOut()
   }
}


// Init (bootstrapping)
app.init = () => {
   // Bind all form submissions
   app.bindForms();

   // Get the token from localStorage
   app.getSessionToken();

   // Renew Token
   app.tokenRenewalLoop();

   // Bind logout button
   app.bindLogoutButton();

   // Bind menu button
   app.menuLoad();

   // Load Data on page 
   app.loadDataOnPage();
}

 

 // Call the init function after the window loads 
 window.onload = () => {
    app.init();
 }



