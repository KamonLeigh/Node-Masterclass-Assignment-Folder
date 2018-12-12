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

 handlers.users = (data, callback) => {
     callback(200);
 };



 //ping handler
 handlers.ping = (data, callback) => {

    callback(200);
 };

 // Path for not found
 handlers.notFound = (data, callback) => {
    console.log('hfhhfh')
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
    let { userName, firstName, lastName ,email, phone, password, address } = data.payload;
    userName = typeof(userName) === 'string' && userName.trim().length > 0 ? userName : false;
    firstName = typeof (firstName) === 'string' && firstName.trim().length > 0 ? firstName : false;
    lastName = typeof (lastName) === 'string' && lastName.trim().length > 0 ? lastName : false;
    email = typeof(email) === 'string' && email.trim().length > 3 ? email: false;
    phone = typeof(phone) === 'string' && phone.trim().length > 10 ? phone : false;
    password = typeof(password) === 'string' && password.trim().length > 0 ? password : false;
    address = typeof(address) === 'string' && address.trim().length > 3 ? address : false;
    

    if(userName && firstName && lastName && email && phone && password && address){
    
    
        // Make sure that user is unique
        _data.read('users', userName, (err, data) => {

            if(err){
                // returns error meaning user is unique

                // Hash password
                const hashedPassword = helpers.hash(password);



                if(hashedPassword){

                      // Create user object
                     const userObject = {
                         userName,
                         firstName,
                         lastName,
                         email,
                         phone,
                         hashedPassword,
                         address
                     }
                                   
                    // Create new user
                    _data.create('users', userName, userObject, (err) => {
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
    const { username } = data.queryStringObject;

    const userName = typeof(username) === 'string' && username.trim().length > 0 ? username : false;

    // if query string is valid continue otherwise return an Error
    if(userName){

        // Verify that user is valid using the token 
        const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
        console.log(token)
        // Validate user
        handlers._tokens.verifyToken(token, userName, (tokenIsValid) => {

            if(tokenIsValid){
                _data.read('users', userName, (err, data) => {
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
    const { username } = data.queryStringObject;

    const userName = typeof(username) === 'string' && username.trim().length > 0 ? username : false;


    if(userName){

        // Get the token form the user
        const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

        token._tokens.verifyToken(token, userName  ,(tokenIsValid) => {

            if(tokenIsValid){

                // Look up user
                _data.read('users', userName, (err, userData) => {

                    if (!err && userData) {

                        // Delete user
                        _data.delete('users', userName, (err, userData) => {
                            
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
    let { userName, firstName, lastName, email, phone, password, address } = data.payload;

    // Check for the required
    userName = typeof(userName) === 'string' && userName.trim().length > 0 ? userName : false;

    // Check the optional data
    firstName = typeof(firstName) === 'string' && firstName.trim().length > 0 ? firstName : false;
    lastName = typeof (lastName) === 'string' && lastName.trim().length > 0 ? lastName : false;
    email = typeof (email) === 'string' && email.trim().length > 3 ? email : false;
    phone = typeof (phone) === 'string' && phone.trim().length > 10 ? phone : false;
    password = typeof (password) === 'string' && password.trim().length > 0 ? password : false;
    address = typeof (address) === 'string' && address.trim().length > 3 ? address : false;

    // Error if the phone number is invalid 
    if(userName){


        // Error if optional data is invalid 
        if(firstName || lastName || email || phone || password || address){
          
            // verify that the token is valid
            const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

            handlers._tokens.verifyToken(token, userName, (tokenIsValid) =>{

                if(tokenIsValid){

                     // Look up the user 
                     _data.read('users', userName, (err, userData) => {

                         if (!err && userData) {

                             // Update the necessary fields
                             if (firstName) {
                                 userData.firstName = firstName
                             }

                             if (lastName) {
                                 userData.lastName = lastName
                             }

                             if (email) {
                                 userData.email = email
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
                             _data.update('users', userName, userData, (err) => {
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
    let { userName, password } = data.payload;
   

    userName = typeof(userName) === 'string' && userName.trim().length > 0 ? userName : false;
    password = typeof(password) === 'string' && password.trim().length > 0 ? password : false;
    
    // Check if user provided data and proceed
    if(userName && password){

        // Look up user with respect to the userName 
        _data.read('users', userName, (err, userData) => {

            if(err) return callback(400, {Error: 'Could not find user'})

            // Hash password provided by the user and compare to the hashed on file
            const hashedPassword = helpers.hash(password);

            if(hashedPassword === userData.hashedPassword) {
                
                // Create token with valid id and set expiration date for one hour
                const tokenId = helpers.createRandomString(20);
                const expires = Date.now() + 1000 * 60 * 60;

                // Create token object
                const tokenObject = {
                    userName: userData.userName,
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
 handlers._tokens.verifyToken =  (id, userName, callback) =>{
     // Lookup the token
     _data.read('tokens', id,  (err, tokenData) => {
         if (!err && tokenData) {
             // Check that the token is for the given user and has not expired
             if (tokenData.userName == userName && tokenData.expires > Date.now()) {
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
    let { margherita, pepperoni, meatball, aubergine, userName }  = data.payload;

    userName = typeof(userName) === 'string' && userName.trim().length > 0 ? userName : false;

    margherita = typeof(margherita) === 'number' && margherita > 0 ? margherita : false;
    pepperoni = typeof(pepperoni) === 'number' && pepperoni > 0  ? pepperoni : false;
    meatball = typeof(meatball) === 'number' && meatball > 0 ? meatball : false;
    aubergine = typeof(aubergine) === 'number' && aubergine > 0 ? aubergine : false;

    if(userName){

        // proceed if at least one is true
        if (margherita || pepperoni || meatball || aubergine) {

    

            // verify that the token is valid
            const token = typeof (data.headers.token) === 'string' ? data.headers.token : false;

            //autheticate user 
            handlers._tokens.verifyToken(token, userName, (tokenIsValid) => {

                if(tokenIsValid){
                   
                    // Look up the user 
                    _data.read('users', userName,(err, userData) =>{
                        
                        if(!err && userData){
                            

                            // get the menu 
                            _data.read('menu', 'menu', (err, menuData) => {

                            if(!err && menuData){
                                
                                const order = [];

                                const menu = menuData.menu

                                console.log(menu);

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
                                const orderNumber = helpers.createRandomString(20)

                                

                                    const orderObject = {
                                        orderNumber,
                                        userName: userData.userName,
                                        email: userData.email,
                                        subTotal,
                                        order
                                    }

                                    // Write order to file 
                                    _data.create('shoppingcart', orderNumber, orderObject,(err) =>{

                                         if (err) return callback(500, {
                                             Error: 'Could not create the new token'
                                         });
                                         callback(200, orderObject);
                                    })

                                    
                                    
                                    } else {

                                       callback(500, {Error: 'Sytem error unable to complete order'})
                                    }
                                })

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
        callback(400, {Error: 'Ensure username is sent with order'})
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
                handlers._tokens.verifyToken(token, shoppingcartData.userName, (tokenData) => {

                    if(tokenData){

                        // Delete the order in the shopping card 
                        _data.delete('shoppingcart', orderNumber, (err) => {

                            if(!err) {
                                callback(200)
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
                handlers._tokens.verifyToken(token, shoppingcartData.userName, (tokenIsValid) => {

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
            
               

              const { email, subTotal, userName } = shoppingcartData;
    
            handlers._tokens.verifyToken(token, userName, (tokenData) => {

                console.log({tokenData})
                if(tokenData){


                    helpers.chargeCustomer(email, subTotal, ordernumber, (err) => {
                        console.log({err})
                    
                        if(!err){

                            helpers.sendEmail(email, orderNumber , subTotal, (err) => {
                                console.log(err)
                                if(!err){
                                    callback(200)
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



 module.exports = handlers;
