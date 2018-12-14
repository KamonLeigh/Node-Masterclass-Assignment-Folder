/*
 *
 * Library for storing data
 * 
 */

 // Dependencies 
 const fs = require('fs');
 const path = require('path');
 const helpers = require('./helpers');

 // Container containing module to be exported
 const lib = {};

 // Base directory of the the .data folder
 lib.baseDir = path.join(__dirname, './../.data/');


 // write data to a file 
 lib.create = ((dir, file, data, callback) => {
    // open file 

    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
       
        if(err) return callback('Could not create no file, it may already exist');

        // Convert the data to a string
        const stringData = JSON.stringify(data);


        // Write the data the file
        fs.writeFile(fileDescriptor, stringData, (err) => {
            if(err) return callback('Error writing file');

            // Close the file
            fs.close(fileDescriptor, (err) => {
                if(err) {
                    callback('Error closing files')
                } else {
                    callback(false);
                }
               
            });

        });

    });

 });

 // Read data from a file
 lib.read = ((dir, file, callback) => {

    fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf8', (err, data) =>{
        if(!err && data) {
            const parsedData = helpers.parseJsonToObject(data);
            callback(false, parsedData);
        } else {
            callback(err, data);
        }
    })
 });


 // Delete file 
 lib.delete = ((dir, file, callback) =>{
    //Unlink
    fs.unlink(`${lib.baseDir}${dir}/${file}.json`, (err) => {
        if(err) return callback('Error deleting file');
        callback(false);
    })
 });


 // Update file
 lib.update = ((dir, file, data, callback) => {
    // Open the file for updating 
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+' ,(err, fileDescriptor) => {

        if(!err && fileDescriptor){
            // Convert data to spring 
            const stringData = JSON.stringify(data);

            // Truncate the file
            fs.truncate(fileDescriptor, (err) => {
                if(err) return callback('Error in truncating file');

                fs.writeFile(fileDescriptor, stringData, (err) => {
                    if(err) return callback('Error writing to existing file');

                    fs.close(fileDescriptor, (err) => {
                        if(err) return callback('Error closing file');

                        callback(false);
                    });

                })

            });

        } else {
            callback('Could not find the file, the file may not exist')
        }

    });
 });


// Read the filed from the directory
lib.list = ((dir, callback) => {
    // Read file name in directory
    fs.readdir(`${lib.baseDir}${dir}/`, (err, data) => {
        if(!err && data && data.length > 0){
            
            const trimmedFileNames = data.map(fileNames => {
                fileNames.replace('.json', '');
            });
            callback(false, trimmedFileNames);
        } else {
            callback(err, data);
        }

    });
});

 // Export lib module
 module.exports = lib;