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

                // Create user object
                const userObject = { userName, firstName, lastName, email, phone, password, address}

                // Create new user
                _data.create('users', userName, userObject, (err) => {
                    if(!err) return callback(200);
                    callback(500,{Error:'Could not create new user'});
                });

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
                        userData.password = password
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


 module.exports = handlers;
