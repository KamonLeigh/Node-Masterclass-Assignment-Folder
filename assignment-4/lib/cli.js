/*
 * CLI related tasks
 *
 */
 
 // Dependencies
 const readline = require('readline');
 const util = require('util');
 const debug = util.debuglog('cli');
 const events = require('events');
 class _events extends events{};
 const e = new _events;

 // Instantiate the cli module object
 const cli = {}


// Init Script

cli.init = () => {
    // Send a message to the console in dark blue
    console.log('\x1b[34m%s\x1b[0m', "The CLI is running ");

    // Start the interface
    let _interface = readline.createInterface({
        input: process.stdin,
        output:process.stdout,
        prompt:''
    });

}









// Export the module 
 module.exports = cli;