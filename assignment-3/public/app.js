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
    headers = typeof(headers) === 'object' && headers !== null ? headers : {};
    path = typeof(path) === 'string' ? path : '/';
    method = typeof(method) === 'string' && ['POST', 'GET', 'DELETE', 'PUT'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
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
            requestUrl +=queryKey+'='+queryStringObject[queryKey];

         }
      }

      // Form the http request as a JSON type
      const xhr = new XMLHttpRequest();

      xhr.open(method, requestUrl, true);
      xhr.setRequestHeader("Content-type", "application/json");

      // For each header sent add it to the request
      for(const headerKey in headers){
        if(headers.hasOwnProperty(headerKey)){
           xhr.setRequestHeader(headerKey, headers[headerKey])
        }
      }

      // If there is a current session token set, add that as a header
      if(app.config.sessionToken){
         xhr.setRequestHeader("token", app.config.sessionToken.tokenId);
      }

      // When the request comes handle the response 
      xhr.onreadystatechange = () => {
         if(xhr.readyState == XMLHttpRequest.DONE){
             var statusCode = xhr.status;
            var  responseReturned = xhr.responseText;
         

         // callback if requested
         if(callback){

            try {
               var parsedResponse = JSON.parse(responseReturned);
               callback(statusCode, parsedResponse);
            } catch (e) {
               callback(statusCode, false);
            }  
            
           }
         }
      }


     // Send the payload as JSON
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


    const tokenId = typeof(app.config.sessionToken.tokenId) == 'string' ? app.config.sessionToken.tokenId : false;


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

      const allForms = document.querySelectorAll('form');

      for(let i = 0; i < allForms.length; i++){

         
         allForms[i].addEventListener("submit", function(e){
            
            // Prevent form from submiting
            e.preventDefault();
            var formId = this.id;
            var path = this.action;
            var method = this.method.toUpperCase();
            
            // Hide error message if mesaage is shown from previous actions
            document.querySelector("#"+formId+" .formError").style.display = "none";
            
            // Hide message from previoud success
            if(document.querySelector("#"+formId+" .formSuccess")){
               document.querySelector("#"+formId+" .formSuccess").style.display = "none";
            }
            
            // Turn the inputs into the payload 
            var payload = {};
            var elements = this.elements;

              

            
            

               for(let i = 0; i < elements.length; i++){
                  if(elements[i].type !== "submit"){
                     const valueOfElements = elements[i].type == "checkbox" ? elements[i].checked : elements[i].value;
                     if(elements[i].name =='_method'){
                        method = valueOfElements;
                     } else {
                        payload[elements[i].name] = valueOfElements;
                     }
                     
                  }
               }
               
            
            // if method is delete payload should be querystring instead 
            // If the method is DELETE, the payload should be a queryStringObject instead
             const  queryStringObject = method == 'DELETE' ? payload : {};


             // Handle adding username to payload if required

             if(path.includes('shopping')){
                payload.userName = app.config.sessionToken.userName;
             }
            
            
            // Call api
            app.client.request(undefined, path, method, queryStringObject, payload, (statusCode, responsePayload) => {
               
               // Display sn error on the form if needed 
               if(statusCode !== 200 ){
                  
                  if(statusCode == 403) {
                     // log the user out
                     app.logUserOut();
                  } else {
                        
                     // Try and get the error from responsePayload otherwise stick to default
                     const error = typeof(responsePayload.Error) === 'string' ? responsePayload.Error : 'An Error has occured please try again';
                     
                     // Append to the error block
                     document.querySelector("#"+formId+" .formError").innerHTML = error;
                     
                     // Change display to block inorder to show message to the user 
                     document.querySelector("#"+formId+" .formError").style.display = 'block';
                  }
                  
               } else {
                  // If api call was sucessful, send to form response processor
                  app.formResponseProcessor(formId, payload, responsePayload);
               }
            })
            
            
         })
      }
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

    
    app.client.request(undefined, 'api/tokens', 'POST', undefined ,newPayload, (newStatusCode, newResponsePayload) => {


      // Display an errot on the form id needed
      if(newStatusCode !== 200){

         // set thr formError field with the error text
         document.querySelector("#"+formId+" .formError").innerHTML = 'Sorry, an error has occured. Please try again.';

         // change the display error on the form to block
          document.querySelector("#" + formId + " .formError").style.display = 'block';

      } else {
         
         // If sucessful, set the token and redirest the user 
         app.setSessionToken(newResponsePayload);
         window.location = 'session/menu'
      }

    
   });

   }

   if(formId == 'sessionCreate'){
      app.setSessionToken(responsePayload);
      window.location = 'session/menu';
   }

   // If form saved successfully and they have messages 
   const formsWithSuccessMessages = ['accountEdit1', 'accountEdit2'];
   if(formsWithSuccessMessages.indexOf(formId) > -1){
      document.querySelector("#"+formId+" .formSuccess").style.display = 'block';
   }

   // If user deleted their account redirect them to the delete
   if(formId=="accountEdit3"){
      app.logUserOut(false);
      window.location = '/account/delete';
   }


   // If the user order reaches the shopping cart redirecr user to that page 
   if(formId =="orderCreate"){

      window.location = '/';

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
         app.config.sessionToken = token;
            app.setLoggedInClass(true);
         } else {
            app.setLoggedInClass(false);
         }

      } catch(e){
         app.config.sessionToken = false;
         app.setLoggedInClass(false);
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
         id: currentToken.tokenId,
         extend: true
      };


      app.client.request(undefined, 'api/tokens', 'PUT', undefined, payload, (statusCode, responsePayload) => {
         // Display an error on the form if needed 

         if(statusCode == 200){
            // Get the new tokem details
            const queryStringObject = { id : currentToken.tokenId};
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
   const primaryClass = typeof(bodyClasses[0]) == 'string' ? bodyClasses[0] : false;


   if(primaryClass == 'accountEdit'){
      app.loadAccountEditData();
   }

   if (primaryClass == 'sessionMenu'){
      // Bind menu button
      app.menuLoad();
   }

   if(primaryClass == 'Index'){
      window.location = "/";
   }

   if (primaryClass == 'shoppingCart'){
      app.loadShoppingCartPage();
   }


}

app.loadAccountEditData = () => {
   // Get the user data from the token otherwise logout
   const userName = typeof(app.config.sessionToken.userName) == 'string' ? app.config.sessionToken.userName : false;

   if(userName){
      // Fetch the user 
      const queryStringObject = {
         username: userName
      }

      // Make the app call and obtain the user information
      app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, (statusCode, responsePayload) => {
      
         if(statusCode == 200) {

            // Put the data into the form
            document.querySelector('#accountEdit1 .firstNameInput').value = responsePayload.firstName;
            document.querySelector('#accountEdit1 .lastNameInput').value = responsePayload.lastName;
            document.querySelector('#accountEdit1 .emailInput').value = responsePayload.email;
            document.querySelector('#accountEdit1 .phoneInput').value = responsePayload.phone
            document.querySelector('#accountEdit1 .addressInput').value = responsePayload.address;

            // Put the hidden username into both forms
            const hiddenUserNameInputs = document.querySelectorAll('input.hiddenUserName');

            for(let i = 0; i < hiddenUserNameInputs.length; i++){
               hiddenUserNameInputs[i].value = responsePayload.userName;
            }
         } else {
            // If the request comes back with somrthing other than  200 we log the user out
            app.logUserOut();
         }
      });

   } else {
      // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
      app.logUserOut()
   }
};


// Load the order page

app.loadShoppingCartPage = () => {
   // Get the userName from the token

   const userName = typeof(app.config.sessionToken.userName) === 'string' ? app.config.sessionToken.userName : false;

   if(userName) {
      // fetch the user data
      const queryStringObject ={
         username: userName
      }

      app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, (statusCode, responsePayload) => {
         if(statusCode == 200){

            const allOrders = typeof(responsePayload.userOrders) === 'object' && responsePayload.userOrders instanceof Array && responsePayload.userOrders.length > 0 ? responsePayload.userOrders : [];

            if(allOrders.length > 0){

               //Loop through all the elements in the array and display in the table
               allOrders.forEach((order) => {

                  console.log(order)

                  // Contruct the querystring object to be sent off
                  const newQueryStringObject = { ordernumber: order }

                  app.client.request(undefined, 'api/shoppingcart', 'GET', newQueryStringObject, undefined, (statusCode, responsePayload) => {

                     if(statusCode == 200) {

                     let table = document.querySelector('#shoppingCartTable');
                     let tr = table.insertRow(-1);
                     tr.classList.add('checkRow');
                     let td0 = tr.insertCell(0);
                     let td1 = tr.insertCell(1);
                     let td2= tr.insertCell(2);
                     td0.innerHTML = responsePayload.orderNumber;
                     td1.innerHTML = "£" + responsePayload.subTotal;
                     td2.innerHTML = '<a href="/shoppingcart/edit?ordernumber=' + responsePayload.orderNumber + '">View / Edit / Delete</a>';


                     } else {
                        console.log("Error trying to load shopping cart", order);
                     }
                  
                  });

               });

               if(allOrders.length < 3){
                  // Show the create 
                  document.querySelector("#createOrder").display = 'block';
               }

            } else {

               // Show that 'you have made an order'
               document.querySelector("#noOrdersMessage").display = 'table-row';
   
               document.querySelector("#createOrder").display = 'block';

            }

         } else {

            // If we receive a user request othet than 200 assume that our end point is down and log the user out
            app.logUserOut();
         }
      });

   } else {
      app.logUserOut();
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


   // Load Data on page 
   app.loadDataOnPage();
}

 

 // Call the init function after the window loads 
 window.onload = () => {
    app.init();
 }



