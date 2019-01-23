/*
 *  This is assignment no 2 for the NODE Masterclass
 *  Building an API for Pizza-delivery Company
 * 
 * author Byron Dunkley
 * 
 * 
 */



const server = require('./lib/server');
const cli = require('./lib/cli');

 // Declare app
const app = {};

app.init = () => {

    // Start Server
    server.init();

    // Start the CLI, but make sure it is last
    setTimeout(() => {
        cli.init();
    }, 50)

};



// Start app
app.init()

// Export app 
module.exports = app;