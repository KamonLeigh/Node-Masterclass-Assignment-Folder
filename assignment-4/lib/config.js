/*
 *
 * Create a config environment for the server
 * 
 * 
 */



 // Set up object for config object
 const environments = {};


 environments.staging = {
     httpPort: 3000,
     httpsPort:3001,
     envName: 'staging',
     secret:'ilovenode',
     maxOrders: 3,
     mailgun:{
         apiKey: '75b5267cb91185a168583ab1d746a80f-059e099e-9792b297',
         domain: 'sandbox26798bbf7eec4180a4dd48455042ea6f.mailgun.org',
         email: 'no-reply <pizza@sandbox26798bbf7eec4180a4dd48455042ea6f.mailgun.org>'

         //75 b5267cb91185a168583ab1d746a80f - 059e099 e - 9792 b297
     },
     stripe:{
         apiKey: 'sk_test_jvtMYHUDMaY4GLQibHzNMlcs'
     },
     templateGlobals:{
         appName:'PizzaApp',
         companyName: 'Pizza INC',
         yearCreated: '2019',
         baseUrl:'http://localhost:3000/'
     }

 };

 environments.production = {
     httpPort: 5000,
     httpsPort: 5001,
     envName: 'production',
     secret:'ilovenode',
     maxOrders: 3,
     mailgun: {
         apiKey:'',
         domain:''
     },
     stripe:{
        apiKey:''
     },
     templateGlobals:{
         appName: 'PizzaApp',
         company: 'Pizza INC',
         yearCreated: '2019',
         baseUrl: 'http://localhost:5000/'
     }
 }

 // Determine which environment has beed passed through the command-line
 const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

 // Determine which environment to export
 const environmentToExport = typeof(environments[currentEnvironment]) === 'object'? environments[currentEnvironment] : environments.staging;

 // export configuation 
 module.exports = environmentToExport;
 