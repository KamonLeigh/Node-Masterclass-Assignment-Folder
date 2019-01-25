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
    str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;

    // Only process the string if user wrote something
    if(str){
        
        // Codify the list of commands
        const uniqueInputs = [
            'man',
            'help',
            'menu',
            'list users',
            'more info order',
            'orders',
            'more info user',
            'exit',
            'sign up',
            'sign in',

        ];

        // Loop through the arry when match is found emit an event
        let matchFound = false;
        let counter = 0;

        uniqueInputs.some( input => {

            //if(input.includes(str.toLowerCase()))
            
            if(str.toLowerCase().indexOf(input) > -1){
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

e.on('more info order', (str) => {
    cli.responders.moreInfoOrder();
});

e.on('orders', (str) => {
    cli.responders.orders();
});

e.on('more info user', (str) => {
    cli.responders.moreInfoUser(str);
});

e.on('exit', (str) => {
    cli.responders.exit();
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

cli.responders.help = () => {
    
    //Make the template 
    const commands = {
         'man': 'Show this help page',
         'help': 'Alias of the "man" ',
         'menu':'List pizzas currently on the menu',
         'list users': 'List all the registered users',
         'more info order -{ordernumber}':'Show details of the specifed order',
         'orders': 'list orders made in the last 24 hours',
         'more info user --{username}': 'Show details of the specified user',
         'exit':'Kill the cli (including the rest of the application)',
         'sign up':'List all the users who has signed up in the last 24 hours',
         'sign in':'List all the users who have signed in in the last 24 hours',


    }

    // Show a header for the help page that is as wide as the screen
     cli.horizontalLine();
     cli.centered('CLI MANUAL');
     cli.horizontalLine();
     cli.verticalSpace(2);

    // Show each command, followed by its explanation, in white and yellow respectively
    for (const key in commands) {
        if(commands.hasProperty(key)){
            const value = commands[key];
            let line = '\x1b[33m'+key+'\x1b[0m';
            let padding = 60 - line.length;

            for(let i = 0; i < padding; i++){
                line += ' ';

            }
            line+=value;
            console.log(line);
            cli.verticalSpace()

        }

    }
    cli.verticalSpace(1);

    // End wiht another horizontal line
    cli.horizontalLine();
}


  cli.responders.menu = () => {
    console.log('You asked for menu');
 }

  cli.responders.listUsers = () => {
      console.log('You asked for listUsers');
  }

 cli.responders.recentOrders = () => {
     console.log('You asked for recent orders');
 }

 cli.responders.moreInfoUser = (str) => {
     console.log('You asked for specific user', str)
 }

cli.responders.orders = () => {
     console.log('You asked for orders');
}


 cli.responders.signIn = () => {
     console.log('You asked for sign in');
 }

 cli.responders.signUp = () => {
     console.log('You asked for sign up');
 }

 cli.responders.stats = (str) => {
     console.log('You asked for stats', str)
 }


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