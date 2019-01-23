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


// Input processor
cli.processInput = (str) => {
    str = typeof(str) == 'string' && str.trim().lengh > 0 ? str.trim() : false;

    // Only process the string if user wrote something
    if(str){
        
        // Codify the list of commands
        const uniqueInputs = [
            'man',
            'help',
            'menu',
            'list users',
            'recent orders',
            'orders',
            'specifc user',
            'exit',
            'stats',
            'sign up',
            'sign in',

        ];

        // Loop through the arry when match is found emit an event
        let matchFound = false;
        let counter = 0;

        uniqueInputs.some( input => {

            if(input.includes(str.toLowerCase())) {
                matchFound = true;

                // Emit the input along with the string 
                e.emit(input, str);

                // Add try to break out of the loop
                return true;
            }

        });

        if(!matchFound){
            console.log('Sorry please try again');
        }

    }
}





// Create Event Listener for cli input 
e.on('man', (str) => {
    cli.responders.help();
})

e.on('help', (str) => {
    cli.responders.help();
});

e.on('menu', (str) => {
    cli.responders.menu();
});

e.on('list users', (str) => {
    cli.responders.listUsers();
});

e.on('recent orders', (str) => {
    cli.responders.recentOrders();
});

e.on('orders', (str) => {
    cli.responders.orders();
});

e.on('specific user', (str) => {
    cli.responders.specificUser(str);
});

e.on('exit', (str) => {
    cli.responders.exit();
});

e.on('stats', () => {
    cli.responders.stats();
});

e.on('sign up', () => {
    cli.responders.signUp();
});

e.on('sign in', () => {
    cli.responders.signIn()
});




// Responce handlers
cli.responders = {};



cli.responders.exit = () => {
    process.exit(0);
};

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

    // Create an intial prompt
    _interface.prompt();

    // Handle each line of input separately
    _interface.on('line',(str) => {
        // send to the input processor
        cli.processInput(str);

        // Restart the prompt
        _interface.prompt();


    });

    // If the user stops the cli kill the asscoiated process
    _interface.on('close', () => {
        process.exit(0)
    });

}


// Export the module 
 module.exports = cli;