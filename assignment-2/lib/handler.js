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

                const hashedPassword = helpers.hash(password);

                // Create user object
                const userObject = { userName, firstName, lastName, email, phone, hashedPassword, address}


                if(hashedPassword){
                    // Create new user
                    _data.create('users', userName, userObject, (err) => {
                        if (!err) return callback(200);
                        callback(500, {
                            Error: 'Could not create new user'
                        });
                    });
                } else {
                    callback(500, {Error : `Could not has user's password`})
                }
                    

            } else{
                callback(500, {Error: 'Could not create new user'});
            }

        })

    } else {
        callback(403, {Error: 'Missing required fields'})
    }
 });


 // Create GET request
 //@TODO add token verification and hashed password
 handlers._users.get = ((data, callback) =>{

    // Check if user is valid
    const { username } = data.queryStringObject;

    const userName = typeof(username) === 'string' && username.trim().length > 0 ? username : false;

    // if query string is valid continue otherwise return an Error
    if(userName){
        _data.read('users', userName, (err, data) => {
            if(!err && data){

                // Ensure password is not returned to user
                delete data.password;
                callback(200, data);
            } else {
                callback(404)
            }
        })
    }
 });




 // Delete User
 // Required info username

 handlers._users.delete = ((data, callback) => {
    
    // Validate query string
    const { username } = data.queryStringObject;

    const userName = typeof(username) === 'string' && username.trim().length > 0 ? username : false;


    if(userName){
        // Look up user
        _data.read('users', userName,(err, userData) => {

            if(!err && userData){
                
                // Delete user
                _data.delete('users', userName, (err, userData) => {
                    console.log(userName)
                    if(!err){
                        callback(200)
                    } else {
                        callback(500, {Error: 'user could not be deleted'})
                    }

                });
                
            } else {
                 callback(500, {Error: 'Could not find user'});
            }

        });

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
          
            // Look up the user 
            _data.read('users', userName, (err, userData) => {

                if(!err && userData){

                    // Update the necessary fields
                    if(firstName) {
                        userData.firstName = firstName
                    }

                    if(lastName) {
                        userData.lastName = lastName
                    }

                    if(email) {
                        userData.email = email
                    }

                    if(phone) {
                        userData.phone = phone
                    }

                    if(password) {
                        userData.hashedPassword = helpers.hash(password)
                    }

                    if(address) {
                        userData.address = address
                    }

                    
                    // Store the new updates
                    _data.update('users', userName, userData, (err) => {
                        if(!err) return callback(200);
                          callback(500, {'Error': 'Could not update the user'});

                    });
                }

            });

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
    console.log({userName, password})

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
 handlers._tokens.verifyToken =((id, userName, callback) => {
    
    // Look up the token
    _data.read('tokens', id, (err, tokenData) => {
        
        if(!err && tokenData){
            if(token.userName == userName && token.expires > Date.now()){

                callback(true);
            } else {
                callback(false);
            }

        } else {
            callback(false);
        }
    })
 });




 module.exports = handlers;
