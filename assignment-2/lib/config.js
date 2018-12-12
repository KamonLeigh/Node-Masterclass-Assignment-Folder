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
     mailgun:{
         apiKey:'059e099e-9792b297  ',
         domain: 'sandbox26798bbf7eec4180a4dd48455042ea6f'
     },
     stripe:{
         apiKey: 'sk_test_jvtMYHUDMaY4GLQibHzNMlcs'
     }
 };

 environments.production = {
     httpPort: 5000,
     httpsPort: 5001,
     envName: 'production',
     secret:'ilovenode'
 }

 // Determine which environment has beed passed through the command-line
 const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

 // Determine which environment to export
 const environmentToExport = typeof(environments[currentEnvironment]) === 'object'? environments[currentEnvironment] : environments.staging;

 // export configuation 
 module.exports = environmentToExport;
 