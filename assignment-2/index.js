/*
 *  This is assignment no 2 for the NODE Masterclass
 *  Building an API for Pizza-delivery Company
 * 
 * author Byron Dunkley
 * 
 * 
 */



const server = require('./lib/server');

 // Declare app
const app = {};

app.init = () => {

    // Start Server
    server.init();

};



// Start app
app.init()

// Export app 
module.exports = app;