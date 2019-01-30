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
 const _data = require('./data');
 const os = require('os');
 const v8 = require('v8');

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
            'stats'

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
    cli.responders.moreInfoOrder(str);
});

e.on('orders', () => {
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


e.on('stats', () => {
    cli.responders.stats();
})




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
         'stats': 'Information about the hardware'


    }

    // Show a header for the help page that is as wide as the screen
     cli.horizontalLine();
     cli.centered('CLI MANUAL');
     cli.horizontalLine();
     cli.verticalSpace(2);

    // Show each command, followed by its explanation, in white and yellow respectively
    for (const key in commands) {
        if(commands.hasOwnProperty(key)){
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

// Create the vertical line
  cli.verticalSpace = (lines)  => {
      lines = typeof(lines) === 'number' && lines > 0 ? lines : 1;
      
      for(let i = 0; i < lines; i++){
          console.log('');
      }

  }

// Create a horizontal line 
cli.horizontalLine = () => {

    // Get the width of the current terminal
    const width = process.stdout.columns;

    // Create variable to store dashes 
    let line = ''

    for(let i = 0; i < width; i++){
        line += '-';
    }

    console.log(line);
}

// Create a centered text on the screen
 cli.centered = (str) => {
     str = typeof(str) === 'string' && str.trim().length > 0 ?  str.trim() : ''

     const width = process.stdout.columns;

     const leftPadding = Math.floor((width - str.length) / 2);

     // Loop through to create left padding
    let line = '';
    for(let i = 0; i < leftPadding; i++){
        line += ' ';

    }

    line += str;

    console.log(line);
 }

  cli.responders.menu = () => {
   _data.read('menu', 'menu',(err, menuItems) => {

    if(!err && menuItems){
        cli.horizontalLine();
        cli.centered('Menu');
        cli.horizontalLine();
        cli.verticalSpace(2);

        menuItems.menu.forEach( item => {
            const { name, price } = item;
            const line = `Name: ${name}     price: £${price}.00`
            console.log(line);
            cli.verticalSpace();
            
        });

        cli.horizontalLine();

    }

   })
 }


 /* Functions that run to log information to the terminal   */

  cli.responders.listUsers = () => {
      _data.list('users', (err, userIds) => {
         
          if(!err && userIds && userIds.length > 0) {
             cli.verticalSpace();
            userIds.forEach(userId => {
                _data.read('users', userId, (err, user) =>{
                  
                    if(!err && user){
                        const { userName, firstName, lastName, email, address, userOrders, phone } = user
                        let line = ` User:${userName} Name: ${firstName} ${lastName} Phone: ${phone} Email: ${email} Address: ${address} ShoppigCartsTotal:`
                        const noOfShoppingCarts = typeof(userOrders) === 'object' && userOrders instanceof Array && userOrders.length > 0 ? userOrders.length : 0;

                        line += noOfShoppingCarts;

                        console.log(line);
                        cli.verticalSpace();
                    }
                })
            })
          }
      })
      
  }

 cli.responders.orders = () => {


    // Calculate 24 hours in ms
    const day = Date.now() - (24 * 60 * 60 * 1000);

    _data.list('order', (err, orderList) => {

        if(!err && orderList){


            // orderlist is an array filter througn and check order has been made within time frame

            orderList.filter( order => {

                _data.read('order', order, (err, orderPayload) => {

                    if(!err && orderPayload){

    

                        if(orderPayload.date >= day){

                            const { orderNumber, email, userName } = orderPayload;

                            console.log(`Email: ${email} User name: ${userName} Ordernumber: ${orderNumber}`);
                            cli.verticalSpace();
                            return 
                        }
                    }
                });

            });



        }
    
    });

    
 }

 cli.responders.moreInfoUser = (str) => {
     const arr = str.split('--');
     

     const user = typeof(arr[1]) === 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;

     
     if(user){
         _data.read('users', user, (err, userData) => {

            if(!err && userData){

                delete userData.hashedPassword;

                cli.verticalSpace();
                console.dir(userData, {'colors': true});
                cli.verticalSpace();
            }

         });
     }
 }

cli.responders.moreInfoOrder = (str) => {
     const arr = str.split('--');
    
     const order = typeof(arr[1]) === 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;

     if(order){
        _data.read('order', order, (err, orderData) => {

            if(!err && orderData){

                cli.verticalSpace();
                console.dir(orderData, {'colors' : true});
                cli.verticalSpace();
            }

        });

     }
}


 cli.responders.signUp = () => {
   
   // Calculate time in ms 24 hours before function is called 
   const day =  Date.now() - (24 * 60 * 60 * 1000);


    _data.list('users', (err, userIds) => {
        if(!err && userIds ){

        
             userIds.filter((userId) => {

                _data.read('users', userId, (err, userData) =>{

                    if(!err && userData){


                        if(userData.createdAt >= day ){
                            
                            const { firstName, lastName,  email,  createdAt, userName} = userData;
                            console.log(`Name: ${firstName} ${lastName} Email: ${email} User name: ${userName}`)
                            cli.verticalSpace()
                            return 
                            
                        }
                    }

                });

            });


           
        }


    });

 }



 cli.responders.stats = () => {
    // Compile an object of stats
    const stats = {
        'Load Average': os.loadavg().join(' '),
        'CPU Count': os.cpus().length,
        'Free Memory': os.freemem(),
        'Currect Malloced Memory':v8.getHeapStatistics().malloced_memory,
        'Peak Malloced Memory':v8.getHeapStatistics().peak_malloced_memory,
        'Allocated Heap Used (%)': Math.round((v8.getHeapStatistics().used_heap_size/ v8.getHeapStatistics().total_heap_size) * 100),
        'Available Heap Allocated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
        'Uptime':os.uptime() + ' Seconds'
    } 

    // Creat the header for the stats
     cli.horizontalLine();
     cli.centered('SYSTEM STATS');
     cli.horizontalLine();
     cli.verticalSpace(2);



     for (const key in stats) {
         if (stats.hasOwnProperty(key)) {
             const value = stats[key];
             let line = '\x1b[33m' + key + '\x1b[0m';
             let padding = 60 - line.length;

             for (let i = 0; i < padding; i++) {
                 line += ' ';

             }
             line += value;
             console.log(line);
             cli.verticalSpace()

         }

     }
     cli.verticalSpace(1);

     // End wiht another horizontal line
     cli.horizontalLine();
     


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