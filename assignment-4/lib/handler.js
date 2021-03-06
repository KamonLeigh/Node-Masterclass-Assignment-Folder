/*
 *
 * Request handlers
 * 
 */

 // Dependencies
 const _data = require('./data');
 const config = require('./config');
 const helpers = require('./helpers');

 // Handler factory
 const handlers = {};



 /*
 * Frontend 
 *
 */

 handlers.index = (data, callback) => {

    if(data.method === 'get'){
        
        // Preare data for interpolation
        const templateData = {
            'head.title':' Pizza Delivery- Made easy',
            'head.description':'A Simple straightforward service!!!',
            'body.class': 'index'
        };


        // Return the template as a string
        helpers.getTemplate('index', templateData, (err, str) => {

            if(!err && str){

              // Add the universal header and footer to the string 
              helpers.addUniversalTemplates(str, templateData, (err, strData) => {

                if(!err && strData){


                    // Return the page as html
                    callback(200, strData, 'html')
                } else {

                    callback(500, undefined, 'html')
                }


              })
            } else {
                callback(500, undefined, 'html');
            }

        })


    } else {
        callback(405, undefined, 'html');
    }
    
 }


 

 // Create account
 handlers.accountCreate = (data, callback) => {
  
    // Rehect request that is not a GET
    if(data.method == 'get'){
       
        // Prepare data for interpolation
        const templateData = {
            'head.title' : 'Create an Account',
            'head.description': 'Signup is easy and only takes a few seconds.',
            'body.class': 'accountCreate'
        }

        helpers.getTemplate('accountCreate', templateData, (err, str) => {

            if(!err && str){
                // Add the header and footer to html 
                helpers.addUniversalTemplates(str, templateData, (err, str) => {

                    if(!err && str){
                        // return html back to user
                        callback(200, str, 'html');
                    } else {

                        callback(500, undefined, 'html');
                    }
                })

            } else {
                callback(500, undefined, 'html')
            }
        })

    } else {
        callback(405, undefined, 'html')
    }

 }


 // Session Create
 handlers.sessionCreate = (data, callback ) => {

    // Only procedd if method is a GET method
    if(data.method === 'get') {

        // Prepare data for intepolation
        const templateData = {

            'head.title': 'Login into your account',
            'head.description': 'Please enter your User Name and Password to access your account.',
            'body.class': 'sessionCreate'
        }

        helpers.getTemplate('sessionCreate', templateData, (err, str) => {
            
            if(!err && str){
                // Add the header to the html file
                helpers.addUniversalTemplates(str, templateData, (err, str) => {

                    if(!err && str) {

                        // Send html file back to user 
                        callback(200, str, 'html')

                    } else {
                        callback(500, undefined, 'html');
                    }
                });

            } else {
                callback(500, undefined, 'html')
            }


        });

    } else {
        callback(405, undefined, 'html')
    }

 }

// Session Delete
 handlers.sessionDelete = (data, callback) => {

     // Only procedd if method is a GET method
     if (data.method === 'get') {

         // Prepare data for intepolation
         const templateData = {

             'head.title': 'Logged Out',
             'head.description': 'You have been logged out of youraccount',
             'body.class': 'sessionDeleted'
         }

         helpers.getTemplate('sessionDelete', templateData, (err, str) => {

             if (!err && str) {
                 // Add the header to the html file
                 helpers.addUniversalTemplates(str, templateData, (err, str) => {

                     if (!err && str) {

                         // Send html file back to user 
                         callback(200, str, 'html')

                     } else {
                         callback(500, undefined, 'html');
                     }
                 });

             } else {
                 callback(500, undefined, 'html')
             }


         });

     } else {
         callback(405, undefined, 'html')
     }

 }


// Session showing list of pizzas
handlers.sessionMenu = (data, callback) => {

    // Only procedd if method is a GET method
    if (data.method === 'get') {

        // Prepare data for intepolation
        const templateData = {

            'head.title': 'These are the pizzas we have on offer',
            'head.description': 'Please check out the pizzas we have on offer.',
            'body.class': 'sessionMenu'
        }

        helpers.getTemplate('sessionMenu', templateData, (err, str) => {

            if (!err && str) {
                // Add the header to the html file
                helpers.addUniversalTemplates(str, templateData, (err, str) => {

                    if (!err && str) {

                        // Send html file back to user 
                        callback(200, str, 'html')

                    } else {
                        callback(500, undefined, 'html');
                    }
                });

            } else {
                callback(500, undefined, 'html')
            }


        });

    } else {
        callback(405, undefined, 'html')
    }

}


// Edit your account
// Session Create
handlers.accountEdit = (data, callback) => {

    // Only procedd if method is a GET method
    if (data.method === 'get') {

        // Prepare data for intepolation
        const templateData = {

            'head.title': 'Account Settings',
            'body.class': 'accountEdit'
        }

        helpers.getTemplate('sessionEdit', templateData, (err, str) => {

            if (!err && str) {
                // Add the header to the html file
                helpers.addUniversalTemplates(str, templateData, (err, str) => {

                    if (!err && str) {

                        // Send html file back to user 
                        callback(200, str, 'html')

                    } else {
                        callback(500, undefined, 'html');
                    }
                });

            } else {
                callback(500, undefined, 'html')
            }


        });

    } else {
        callback(405, undefined, 'html')
    }

}


// account delete
handlers.accountDelete = (data, callback) => {

    // Only procedd if method is a GET method
    if (data.method === 'get') {

        // Prepare data for intepolation
        const templateData = {

            'head.title': 'Account Deleted',
            'head.description': 'Your account has been deleted',
            'body.class': 'accountDelete'
        }

        helpers.getTemplate('accountDelete', templateData, (err, str) => {

            if (!err && str) {
                // Add the header to the html file
                helpers.addUniversalTemplates(str, templateData, (err, str) => {

                    if (!err && str) {

                        // Send html file back to user 
                        callback(200, str, 'html')

                    } else {
                        callback(500, undefined, 'html');
                    }
                });

            } else {
                callback(500, undefined, 'html')
            }


        });

    } else {
        callback(405, undefined, 'html')
    }

}


// Create a new order
handlers.orderCreate = (data, callback) => {
  // Only procedd if method is a GET method
  if (data.method === "get") {
    // Prepare data for intepolation
    const templateData = {
      "head.title": "Order Pizza",
      "body.class": "orderCreate"
    };

    helpers.getTemplate("orderCreate", templateData, (err, str) => {
      if (!err && str) {
        // Add the header to the html file
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if (!err && str) {
            // Send html file back to user
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};



 handlers.orderEdit = (data, callback) => {

     // Only procedd if method is a GET method
     if (data.method === 'get') {

         // Prepare data for intepolation
         const templateData = {

             'head.title': 'View Order',
             'body.class': 'orderEdit'
         }

         helpers.getTemplate('orderEdit', templateData, (err, str) => {

             if (!err && str) {
                 // Add the header to the html file
                 helpers.addUniversalTemplates(str, templateData, (err, str) => {

                     if (!err && str) {

                         // Send html file back to user 
                         callback(200, str, 'html')

                     } else {
                         callback(500, undefined, 'html');
                     }
                 });

             } else {
                 callback(500, undefined, 'html')
             }


         });

     } else {
         callback(405, undefined, 'html')
     }

 }

// Order Complete form
 handlers.orderComplete = (data, callback) => {

     // Only procedd if method is a GET method
     if (data.method === 'get') {

         // Prepare data for intepolation
         const templateData = {

             'head.title': 'Order Completion',
             'body.class': 'orderComplete'
         }

         helpers.getTemplate('orderComplete', templateData, (err, str) => {

             if (!err && str) {
                 // Add the header to the html file
                 helpers.addUniversalTemplates(str, templateData, (err, str) => {

                     if (!err && str) {

                         // Send html file back to user 
                         callback(200, str, 'html')

                     } else {
                         callback(500, undefined, 'html');
                     }
                 });

             } else {
                 callback(500, undefined, 'html')
             }


         });

     } else {
         callback(405, undefined, 'html')
     }

 }



// Serve public asserts
handlers.public = (data, callback) => {

    // Reject any call that is not get
    if(data.method === 'get'){
        // Get the file name being requested 
        const trimmedAssetName = data.trimmedPath.replace('public/', '').trim();

        if(trimmedAssetName.length > 0){
            // Read in the asserts data
            helpers.getStaticAssets(trimmedAssetName, (err, data) => {
                if(!err && data){

                    // Determine the content type (defaulr to plain text)
                    let contentType = 'plain';

                    if(trimmedAssetName.indexOf('.css') > -1){
                        contentType = 'css';
                    }

                    if (trimmedAssetName.indexOf('.png') > -1) {
                        contentType = 'png';
                    }

                    if (trimmedAssetName.indexOf('.jpg') > -1) {
                        contentType = 'jpg';
                    }

                    if (trimmedAssetName.indexOf('.ico') > -1) {
                        contentType = 'favicon';
                    }


                    // Callback the data
                    callback(200, data, contentType);

                } else {

                    callback(404);
                }
            });

        } else {

            callback(404);
        }

    } else {
        callback(405)
    }

}



// Display contents from shopping cart
handlers.shoppingCart = (data, callback) => {

    // Only procedd if method is a GET method
    if (data.method === 'get') {

        // Prepare data for intepolation
        const templateData = {

            'head.title': 'Orders are displayed below',
            'body.class': 'shoppingCart'
        }

        helpers.getTemplate('shoppingCart', templateData, (err, str) => {

            if (!err && str) {
                // Add the header to the html file
                helpers.addUniversalTemplates(str, templateData, (err, str) => {

                    if (!err && str) {

                        // Send html file back to user 
                        callback(200, str, 'html')

                    } else {
                        callback(500, undefined, 'html');
                    }
                });

            } else {
                callback(500, undefined, 'html')
            }


        });

    } else {
        callback(405, undefined, 'html')
    }

}


/*
 * JSON API
 *
 */

 handlers.users = (data, callback) => {
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
 handlers.users = (( data , callback) => {
    const acceptableMethods = ['post', 'get', 'delete', 'put'];
    if(acceptableMethods.includes(data.method)) return handlers._users[data.method](data, callback);
    callback(405);
 });


 // Users Create POST request
 handlers._users.post = (( data, callback) => {

    // Deconstruct variables from payload and check all fields are filled
    let { firstName, lastName ,email, phone, password, address } = data.payload;
    firstName = typeof (firstName) === 'string' && firstName.trim().length > 0 ? firstName : false;
    lastName = typeof (lastName) === 'string' && lastName.trim().length > 0 ? lastName : false;
    email = typeof(email) === 'string' && email.trim().length > 3 ? email: false;
    phone = typeof(phone) === 'string' && phone.trim().length > 9 ? phone : false;
    password = typeof(password) === 'string' && password.trim().length > 0 ? password : false;
    address = typeof(address) === 'string' && address.trim().length > 3 ? address : false;
    

    if(firstName && lastName && email && phone && password && address){
    
    
        // Make sure that user is unique
        _data.read('users', email, (err, data) => {

            if(err){
                // returns error meaning user is unique

                // Hash password
                const hashedPassword = helpers.hash(password);



                if(hashedPassword){

                      // Create user object
                     const userObject = {
                         firstName,
                         lastName,
                         email,
                         phone,
                         hashedPassword,
                         address,
                         createdAt: Date.now()
                     }
                                   
                    // Create new user
                    _data.create('users', email, userObject, (err) => {
                        if (!err) {
                            callback(200);
                        } else {

                            callback(500, {
                                Error: 'Could not create new user'
                            });

                        }
                        
                    });
                } else {
                    callback(500, {Error : `Could not has user's password`})
                }
                    

            } else{
                callback(400, {Error: 'User already exists'});
            }

        })

    } else {
        callback(400, {Error: 'Missing required fields'})
    }
 });


 // Create GET request

 handlers._users.get = ((data, callback) =>{

    // Check if user is valid
   let { email } = data.queryStringObject;

     email = typeof(email) === 'string' && email.trim().length > 0 ? email : false;

    // if query string is valid continue otherwise return an Error
    if(email){

        // Verify that user is valid using the token 
        const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
      
        // Validate user
        handlers._tokens.verifyToken(token, email, (tokenIsValid) => {

            if(tokenIsValid){
                _data.read('users', email, (err, data) => {
                    if (!err && data) {

                    
                        // Ensure password is not returned to user
                        delete data.hashedPassword;
                        callback(200, data);
                    } else {
                        callback(404)
                    }
                })

            } else {

                callback(403, {Error: 'Missing token in header, or token is not valid'})     
            }

        })    
    } else {

        callback(400, {'Error': 'Missing required field'})

    }
 });




 // Delete User
 // Required info username

 handlers._users.delete = ((data, callback) => {
    
    // Validate query string
    let { email } = data.queryStringObject;

     email= typeof(email) === 'string' && email.trim().length > 0 ? email : false;


    if(email){

        // Get the token form the user
        const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

        token._tokens.verifyToken(token, email  ,(tokenIsValid) => {

            if(tokenIsValid){

                // Look up user
                _data.read('users', userName, (err, userData) => {

                    if (!err && userData) {

                        // Delete user
                        _data.delete('users', email, (err, userData) => {
                            
                            if (!err) {
                                callback(200)
                            } else {
                                callback(500, {
                                    Error: 'user could not be deleted'
                                })
                            }

                        });

                    } else {
                        callback(500, {
                            Error: 'Could not find user'
                        });
                    }

                });
            } else {
                 callback(403, {Error: 'Missing token in header, or token is not valid'})
            }

        })

    } else {
         callback(400, {'Error': 'Missing required field'})
    }


 });

 // Required data : user
 // Optional data: firstName, lastNsme, password etc  (at least one must be specified)
 handlers._users.put =((data, callback) => {

    // Obtain the fields 
    let { firstName, lastName, email, phone, password, address } = data.payload;

    // Check for the required
    email = typeof(email) === 'string' && email.trim().length > 0 ? email : false;

    // Check the optional data
    firstName = typeof(firstName) === 'string' && firstName.trim().length > 0 ? firstName : false;
    lastName = typeof (lastName) === 'string' && lastName.trim().length > 0 ? lastName : false;
    phone = typeof (phone) === 'string' && phone.trim().length > 10 ? phone : false;
    password = typeof (password) === 'string' && password.trim().length > 0 ? password : false;
    address = typeof (address) === 'string' && address.trim().length > 3 ? address : false;

    // Error if the phone number is invalid 
    if(email){


        // Error if optional data is invalid 
        if(firstName || lastName || phone || password || address){
          
            // verify that the token is valid
            const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

            handlers._tokens.verifyToken(token, email, (tokenIsValid) =>{

                if(tokenIsValid){

                     // Look up the user 
                     _data.read('users', email, (err, userData) => {

                         if (!err && userData) {

                             // Update the necessary fields
                             if (firstName) {
                                 userData.firstName = firstName
                             }

                             if (lastName) {
                                 userData.lastName = lastName
                             }


                             if (phone) {
                                 userData.phone = phone
                             }

                             if (password) {
                                 userData.hashedPassword = helpers.hash(password)
                             }

                             if (address) {
                                 userData.address = address
                             }


                             // Store the new updates
                             _data.update('users', email, userData, (err) => {
                                 if (!err) return callback(200);
                                 callback(500, {
                                     'Error': 'Could not update the user'
                                 });

                             });
                         } else {
                             callback(403, {Error: 'User could not be found'})
                         }

                     });

                } else {

                 callback(403, {Error: 'Missing token in header, or token is not valid'});

                }

            })

        } else {
             callback(400,{'Error':'Missing required field'})
        }

    } else { 
        callback(400,{'Error':'Missing required field'})
    } 

 });


 /*Token*/

 // Container for token submethods 
 handlers._tokens = {};
 

 // Helper to pick submethod from user handler
 handlers.tokens = ((data, callback) => {
     const acceptableMethods = ['post', 'get', 'delete', 'put'];
     if (acceptableMethods.includes(data.method)) return handlers._tokens[data.method](data, callback);
     callback(405);
 });


 // Tokens POST
 // options username and password 
 handlers._tokens.post = ((data, callback) => {
    
    // Check the optional data
    let { email, password } = data.payload;
   

  
    email = typeof(email) === 'string' && email.trim().length > 0 ? email : false;
    password = typeof(password) === 'string' && password.trim().length > 0 ? password : false;
    

    // Check if user provided data and proceed
    if(email && password){

        // Look up user with respect to the userName 
        _data.read('users', email, (err, userData) => {

            if(err) return callback(400, {Error: 'Could not find user'})

            // Hash password provided by the user and compare to the hashed on file
            const hashedPassword = helpers.hash(password);



            if(hashedPassword === userData.hashedPassword) {
                
                // Create token with valid id and set expiration date for one hour
                const tokenId = helpers.createRandomString(20);
                const expires = Date.now() + 1000 * 60 * 60;

                // Create token object
                const tokenObject = {
                    email: userData.email,
                    tokenId,
                    expires 
                }

                // Write token to file
                _data.create('tokens', tokenId, tokenObject,(err) => {

                    if(err) return callback(500, {Error : 'Could not create the new token'});
                    callback(200, tokenObject);
                });

            } else {
                callback(400, { Error:'Password did not match the specified user\'s stored password'})
            }
            
        });

    } else {
       callback(400, {Error: 'Missing required fields(s)'})
    }
 
});
 // Token GET
 // Use querystring
 handlers._tokens.get = ((data, callback) => {

    // Check to see id sent is valid
    let { id } = data.queryStringObject;
   

    id = typeof(id) === 'string' && id.trim().length == 20 ? id : false;

    if(id){
        
        // Look up token
        _data.read('tokens', id, (err, tokenData) => {

            if(err) return callback(404);

            callback(200, tokenData);

        })


    } else {
        callback(400, {Error: 'Missing required field'});
    }

 });

 // Token Delete 
 // Use querystring to get the user 

 handlers._tokens.delete = ((data, callback) => {

    // Check to see if id sent is valid
    let { id } = data.queryStringObject;

    id = typeof(id) === 'string' && id.trim().length == 20 ? id : false;

    if(id){
        // Look up the user
        _data.read('tokens', id, (err, userData) => {
            if(err) return callback(400, {Error: 'Could not find the specified user'});

            _data.delete('tokens', id, (err) => {
                if(err) return callback(500, {Error: 'Error deleting file'})

                callback(200);

            });
        });

    } else {
         callback(400, {Error: 'Missing required field'});
    }

 });

 // Token put 
 // required data and boolean 

 handlers._tokens.put = ((data, callback) => {

    let { id, extend } = data.payload;

    id = typeof(id) === 'string' && id.trim().length > 0 ? id : false;
    extend = typeof(extend) === 'boolean' && extend == true ? true : false;
 
    // Check if user provides the information to extend the lifespan of the token
    if(id && extend){
        
        // Look up the token 
        _data.read('tokens', id, (err, tokenData) => {

            if(!err && tokenData) {

                // Check to see whethet current token has expired
                if(tokenData.expires > Date.now()){

                    // Extend the lifespan of the token
                    tokenData.expires = Date.now() + 1000 * 60 * 60;

                    _data.update('tokens', id, tokenData, (err) => {
                        if(err) return   callback(500, {Error: `Could not update the token's expiration`});
                        callback(200)
                    });

                } else {
                    callback(400, {Error: 'The token has already expired, and cannot be extended'})
                }
 
            } else {
                
                callback(400, {Error: 'Specified token does not exist'})

            }

        })

    } else {
         callback(400, {Error: 'Missing required field(s) or field(s) are invalid '})
    }

 });

 // Verify that giveb User's token is valid 
 handlers._tokens.verifyToken =  (id, email, callback) =>{
     // Lookup the token
     _data.read('tokens', id,  (err, tokenData) => {
         if (!err && tokenData) {
             // Check that the token is for the given user and has not expired
             if (tokenData.email == email && tokenData.expires > Date.now()) {
                 callback(true);

             } else {

                 callback(false);
             }

         } else {
             callback(false)
         }
     });
 };


 // Container for menu submethod
 handlers._menu = {}


 handlers.menu = ((data, callback) => {
    //list accepted methods 
     if(data.method === 'get'){

        handlers._menu.get(data,callback)

     } else {
         callback(405)
     }
 })


 // Send menu to the user upon request
 handlers._menu.get = ((undefined, callback) => {

    _data.read('menu', 'menu', (err, menuData) => {

        if(!err && menuData) {
        
            callback(200, menuData);
        } else {

            callback(400, {Error: 'Menu could not be found'})
        }
    })
 })

 // Container containing order submethods
 handlers._shoppingcart = {};

 handlers.shoppingcart = ((data, callback) => {
    
    // List all the accepted methods
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(!acceptableMethods.includes(data.method)) return callback(405);
    handlers._shoppingcart[data.method](data, callback)

 });

 // Create post request for order
 handlers._shoppingcart.post = ((data, callback) => {

    // destruct and check for the required keys 
    let { margherita, pepperoni, meatball, aubergine, email }  = data.payload;

    email = typeof(email) === 'string' && email.trim().length > 0 ? email : false;

    margherita = typeof (parseInt(margherita) == NaN ? 0 : parseInt(margherita)) === 'number' && margherita > 0 ? margherita : false;
    pepperoni = typeof (parseInt(pepperoni) == NaN ? 0 : parseInt(margherita)) === 'number' && pepperoni > 0 ? pepperoni : false;
    meatball = typeof (parseInt(meatball) == NaN ? 0 : parseInt(margherita)) === 'number' && meatball > 0 ? meatball : false;
    aubergine = typeof (parseInt(aubergine) == NaN ? 0 : parseInt(margherita)) === 'number' && aubergine > 0 ? aubergine : false;

    if(email){

          

        // proceed if at least one is true
        if (margherita || pepperoni || meatball || aubergine) {

    
              
            // verify that the token is valid
            const token = typeof (data.headers.token) === 'string' ? data.headers.token : false;

            //autheticate user 
            handlers._tokens.verifyToken(token, email, (tokenIsValid) => {

                if(tokenIsValid){
                   
                      
                    // Look up the user 
                    _data.read('users', email, (err, userData) =>{
                        
                        if(!err && userData){

                            const userOrders = typeof(userData.userOrders) === 'object' && userData.userOrders instanceof Array ? userData.userOrders : [];

                           
                            // Verify the user has less than three oders
                            if(userOrders.length < config.maxOrders){

                                
                               
                                // Create an array of orders
                                
                                // get the menu 
                                _data.read('menu', 'menu', (err, menuData) => {
                                    
                                    if(!err && menuData){
                                          
                                        const order = [];
                                        
                                        const menu = menuData.menu
                                        
                                        
                                        
                                        const shoppingcart = {
                                            margherita,
                                            pepperoni,
                                            aubergine,
                                            meatball
                                        }
                                        
                                        
                                        menu.forEach((pizza) => {
                                            
                                            if(shoppingcart[pizza.name]){
                                                
                                                const total = pizza.price * shoppingcart[pizza.name];
                                                
                                                // Make object and push into order array
                                                const pizzaTotal = {
                                                    pizza: pizza.name,
                                                    total
                                                }
                                                
                                                order.push(pizzaTotal);
                                            }
                                            
                                            
                                        })
                                        
                                        // Use reduce to get the total
                                        const subTotal  = order.reduce((total, pizza) => {
                                            
                                            return total += pizza.total
                                        }, 0);
                                          
                                        // generate order number
                                        const orderNumber = helpers.createRandomString(20);
                                        
                                        // Push the orderNumber to the order array in user object
                                        
                                          
                                        
                                        const orderObject = {
                                            orderNumber,
                                            email: userData.email,
                                            subTotal,
                                            order
                                        }
                                          
                                    
                                        
                                        // Write order to file 
                                        _data.create('shoppingcart', orderNumber, orderObject,(err) =>{
                                              
                                            if (err) return callback(500, {Error: 'Could not create the new token'});
                                             // Update user object
                                             userData.userOrders = userOrders;
                                             userData.userOrders.push(orderNumber);

                                            

                                             // Save the new user data
                                             _data.update('users', email, userData, (err) =>{
                                                 if(!err){
                                                     
                                                     // Return the data about the new order
                                                     callback(200, orderObject);
                                                 } else {
                                                     callback(500, {Error: 'Could not update user with the new order'})
                                                 }

                                             });
                                        })
                                        
                                    
                                    } else {
                                          
                                        callback(500, {Error: 'Sytem error unable to complete order'})
                                    }
                                })
                            } else {
                                callback(500, 'Could not create order')
                                  
                            }

                            } else {
                                callback(400, {Error: 'Specified user does not exist'})
                            }
                    
                        })

                    } else {

                         callback(403, {Error: 'Missing token in header, token is not valid or token is not valid for the user'});

                }

            });
       
        } else {

            callback(400, {Error: 'Missing order, order syntax is invalid'})

        }
    } else {
        callback(400, {Error: 'Ensure email is sent with order'})
    }  
 });      

 // Delete the shoppin card
 handlers._shoppingcart.delete = ((data, callback) => {

    // Obtain order number from the query string 
    const ordernumber = data.queryStringObject.ordernumber;

    // Emsure the strings fits criteria 
    const orderNumber = typeof(ordernumber) === 'string' && ordernumber.trim().length  === 20 ? ordernumber : false;

    if(orderNumber){

        // Look up the order
        _data.read('shoppingcart', orderNumber, (err, shoppingcartData) => {

            if(!err && shoppingcartData){


                // Verify the user using the tokens 
                const token = typeof(data.headers.token) === 'string' && data.headers.token.trim().length == 20 ? data.headers.token : false;

    
                // Check to see whether user is logged in  
                handlers._tokens.verifyToken(token, shoppingcartData.email, (tokenData) => {

                    if(tokenData){

                        
                        // Delete the order in the shopping card 
                        _data.delete('shoppingcart', orderNumber, (err) => {

                            if(!err) {

                                _data.read('users', shoppingcartData.email, (err, userData) => {

                                    if(!err, userData){

                                   

                                        // Update order array
                                        const newUserOrders = userData.userOrders.filter((userOrder) => {

                                            return userOrder !== orderNumber;
                                        });

                    
                                        userData.userOrders = newUserOrders;

                                    



                                        // Update user
                                        _data.update('users', shoppingcartData.email, userData, (err) => {
                                    
                                            
                                            if(!err) {
                                            
                                                callback(200)
                                            } else {
                                            
                                                callback(500, {Error: 'could not updata user profile'})
                                            }
                                        })

                                    } else {

                                        callback(500, {Error: 'could not delete order'})
                                    }


                                });
                            } else {

                                callback(500, {Error: 'could not delete order'})
                            }
                        })


                    } else {

                        callback(403);
                    }

                });

            } else {

              callback(400, {'Error' : 'Order does not exist'});
            }

        })
    }

 });

 // User can retieve shopping cart upon request 
 handlers._shoppingcart.get = (data, callback) => {

    // Obtain order number from query string
    const ordernumber  = data.queryStringObject.ordernumber;

    // Ensure string fits criteria
    const orderNumber = typeof(ordernumber) === 'string' && ordernumber.trim().length === 20 ? ordernumber : false;

    if(orderNumber){

        // Look up the order
        _data.read('shoppingcart', orderNumber,(err, shoppingcartData) => {

            if(!err && shoppingcartData){

                // check if user has valid token and we can send back the data
                const token = typeof(data.headers.token) === 'string' && data.headers.token.trim().length == 20 ? data.headers.token : false;

            
                // Check if the user is logged in 
                handlers._tokens.verifyToken(token, shoppingcartData.email, (tokenIsValid) => {

                    if(tokenIsValid){

                        callback(200, shoppingcartData);

                    } else {

                        callback(403);

                    }

                })

            } else {

                callback(400, {'Error' : 'Order does not exist'});

            }

        })

    } else {
    callback(400, {'Error': 'Missing required field.'});
    }


 }

 handlers._shoppingcart.put = (data, callback) => {

     // Obtain order number from the query string 
     const ordernumber = data.queryStringObject.ordernumber;

     // Emsure the strings fits criteria 
     const orderNumber = typeof (ordernumber) === 'string' && ordernumber.trim().length === 20 ? ordernumber : false;

     // destruct and check for the required keys 
    let { margherita, pepperoni, meatball, aubergine, email }  = data.payload;

    email = typeof(email) === 'string' && email.trim().length > 0 ? email : false;

    margherita = typeof (parseInt(margherita) == NaN ? 0 : parseInt(margherita)) === 'number' && margherita > 0 ? margherita : false;
    pepperoni = typeof (parseInt(pepperoni) == NaN ? 0 : parseInt(margherita)) === 'number' && pepperoni > 0 ? pepperoni : false;
    meatball = typeof (parseInt(meatball) == NaN ? 0 : parseInt(margherita)) === 'number' && meatball > 0 ? meatball : false;
    aubergine = typeof (parseInt(aubergine) == NaN ? 0 : parseInt(margherita)) === 'number' && aubergine > 0 ? aubergine : false;


    if(orderNumber) {

        if(margherita || pepperoni || meatball || aubergine){

         // check if user has valid token and we can send back the data
         const token = typeof (data.headers.token) === 'string' && data.headers.token.trim().length == 20 ? data.headers.token : false;
        
         // Look up user using ordernumber

         _data.read('shoppingcart', orderNumber, (err, cartData) => {

            if(!err && cartData) {

                handlers._tokens.verifyToken(token, cartData.email, (tokenData) => {

                    if(tokenData){

                        // Get the menu an contruct the updated cart
                        _data.read('menu', 'menu', (err, menuData) => {

                            if(!err && menuData){

                                const order = [];

                                const menu = menuData.menu;
                               

                                const shoppingCart = {
                                    margherita,
                                    pepperoni,
                                    meatball,
                                    aubergine
                                }



                               
                                menu.forEach((pizza) => {

                                    if(shoppingCart[pizza.name]){

                                        const total = shoppingCart[pizza.name] * pizza.price;

                                        const pizzaTotal = {
                                            pizza : pizza.name,
                                            total
                                        }

                                        order.push(pizzaTotal);
                                    }



                                });

    
                                // Calculate total
                                const subTotal = order.reduce((total, pizza) => {
                                    return total +=  pizza.total;
                                }, 0)

                                // Constrct the new order object
                                const newOrderObject = {
                                    order,
                                    subTotal
                                }

                                // Update cardData
                                cartData.subTotal = newOrderObject.subTotal;
                                cartData.order = newOrderObject.order;



                                // Write updata back to file;
                                _data.update('shoppingcart', cartData.orderNumber, cartData, (err) => {
                                    
                                    if(!err){
                                        callback(200);
                                    } else {
                                        callback(500, {Error: 'Could not up date order'});
                                    }

                                });

                            } else {

                                callback(500, {Error: 'Could not create order'})
                            }


                        });

                    } else {

                        callback(403);
                    }

                });

            } else {

                callback(403);

            }
         });

        } else {

            callback(400, {'Error': 'Order could not be updated'})
        }

    } else {

       callback(400, {'Error': 'Missing required field.'});

    }



 }


 // container containing submethods 
 handlers._orders = {};

 handlers.orders = ((data, callback) => {

    if(data.method == 'get') {

    handlers._orders[data.method](data, callback);
    } else {

        callback(405)
    }
 });


handlers._orders.get  = ( (data, callback) => {

     // Obtain order number from query string
    const ordernumber  = data.queryStringObject.ordernumber;

    // Ensure string fits criteria
    const orderNumber = typeof(ordernumber) === 'string' && ordernumber.trim().length === 20 ? ordernumber : false;
   
    if(orderNumber){

        // Look up order
        _data.read('shoppingcart', orderNumber, (err, shoppingcartData) => {

           
            if(!err && shoppingcartData){

             const token = typeof (data.headers.token) === 'string' && data.headers.token.trim().length == 20 ? data.headers.token : false;
            
               

              const { email, subTotal } = shoppingcartData;
    
            handlers._tokens.verifyToken(token, email, (tokenData) => {

                
                if(tokenData){


                    helpers.chargeCustomer(email, subTotal, ordernumber, (err) => {
                        
                       
                        if(!err){

                
                            helpers.sendEmail(email, orderNumber , subTotal, (err) => {
                            
                                if(!err){

                                    shoppingcartData.date =  Date.now();
                                
                                    _data.create('order', orderNumber, shoppingcartData, (err) =>{

                                        if(!err){

                                           
                                            // Delete order from shoppingcart file 
                                            _data.delete('shoppingcart', orderNumber, (err) => {

                                                if(!err){

                    

                                                 
                                                    _data.read('users', shoppingcartData.email, (err, userData) => {

                                                        if(!err, userData){

                                                    

                                                            // Update order array
                                                            const newUserOrders = userData.userOrders.filter((userOrder) => {

                                                                return userOrder !== orderNumber;
                                                            });

                                        
                                                            userData.userOrders = newUserOrders;

                                                        
                                                            // Update user
                                                            _data.update('users', shoppingcartData.email, userData, (err) => {
                                                        
                                                                
                                                                if(!err) {
                                                                
                                                                    callback(200)
                                                                } else {
                                                                
                                                                    callback(500, {Error: 'could not updata user profile'})
                                                                }
                                                            })

                                                        } else {

                                                            callback(500, {Error: 'could not delete order'});
                                                        }

                                                    });

                                                } else {

                                                    callback(500, {Error: 'could not delete order'});
                            
                                                }

                                            })

                                            
                                        } else {

                                            callback(500, {Error: 'Unable to update shoppingcart'})
                                        }

                                    })


                                } else {

                                   callback(500, {Error: 'Payment could not be made or invalid email'})
                                }

                            })
                            
                        } else {

                            callback(500, {Error: 'Payment could not be made'})
                        }
                    })

                } else {

                     callback(403);
                }

            })

            } else {

                callback(400, {'Error' : 'Order does not exist'});  
            }
        })




    } else {

        callback(400, {'Error': 'Missing required field.'});
    }


});


// Obtain complete order
handlers._complete = {};

handlers.complete = ((data, callback) => {

  if(data.method === 'get') {

    handlers._complete[data.method](data, callback);

  } else {
      callback(405)
  }
});

// Make a GET request inorder to comfirm file.

handlers._complete.get = ((data, callback) => {

    const ordernumber = data.queryStringObject.ordernumber;

    const orderNumber = typeof (ordernumber) == 'string' && ordernumber.trim().length == 20 ? ordernumber.trim() : false;

    if(orderNumber){

        _data.read('order', orderNumber, (err, payloadData) => {

            if(!err){

                callback(200)

            } else {

                callback(500, {Error: 'plesae contact us'})
            }

        })

    } else {

        callback(400, {'Error' : 'Order does not exist'}); 
    }


});





 module.exports = handlers;
