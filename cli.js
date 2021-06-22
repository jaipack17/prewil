#!/usr/bin/env node

const chalk = require("chalk");
const fs = require("fs");
const { dirname } = require("path");

const [,, ... args] = process.argv;

var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

if(!args[0]){
    console.log("prewil init - Setup _errors.json\nprewil new - Create new custom error\nprewil -v - Version");
    rl.close()
    return;
}

if(args[0] == "init") {
    let obj = {
        "errors": {
            
        }
    }
    if(fs.existsSync("_errors.json")) {
        console.log(chalk.green("> Prewil has already been initialized!"))
        rl.close()
        return;
    }
    fs.writeFile("_errors.json", JSON.stringify(obj, null, 2), function(err){
        if(err) {
            console.log(chalk.red("> Error creating _errors.json file: ", err));
            rl.close();
        }
        console.log(chalk.green("> Successfully initialized prewil.\n> Created _errors.json in the main directory."))
        rl.close()
    })
}
else if(args[0] == "new") {
    let configeration = {
        code: undefined,
        name: undefined,
        type: undefined,
        description: undefined,
        alius: undefined
    };
    rl.question(chalk.cyan("Enter a custom error code:  "), (code) => {    
        if(isNaN(code)){
            console.log(chalk.red("Invalid Error Code Provided. Error code must be a whole number.")); 
            rl.close();
            return;
        }
        const file = require("./_errors.json")
        
        if(code in file.errors) {
            console.log(chalk.red("An error with that code already exists!")); 
            rl.close();
            return;
        }
        configeration.code = parseInt(code);
        rl.question(chalk.cyan("Enter error name (eg. Invalid Input): "), (name) => {
            if(name.length == 0) {
                console.log(chalk.red("Name cannot be empty!"));
                rl.close();
                return;
            }
            configeration.name = name;
            rl.question(chalk.cyan("Enter error type (eg. ref | syntax | type | http): "), (type) => {
                let types = ["ref", "syntax", "type", "http"];
                if(!types.includes(type)) { 
                    console.log(chalk.red("> Invalid Error Type Provided. Error type must be 'ref', 'syntax', 'http' or 'type'")); 
                    rl.close();
                    return;
                }
                configeration.type = type;
                rl.question(chalk.cyan("Enter a breif description of the error: "), (desc) => {
                    if(desc.length == 0) {
                        console.log(chalk.red("> Description cannot be empty!"));
                        rl.close();
                        return;
                    }
                    configeration.description = desc;
                    let defaultAlias = configeration.name.toLowerCase().replace(/\s/g, '_')
                    if(defaultAlias.endsWith("_")) {
                        defaultAlias.slice(0, -1)
                    }

                    rl.question(chalk.cyan(`Enter an error alias (${defaultAlias}): `), (alius) => {
                        if(alius.length == 0) {
                            configeration.alius = defaultAlias;
                        } else {
                            configeration.alius = alius;
                        }
                        console.log(chalk.green("> Error successfully created."));
                        let fileName = "./_errors.json"
                        let file1 = require(fileName)
                        file1.errors[configeration.code] = configeration;
                        try {
                            fs.writeFile(fileName, JSON.stringify(file1, null, 2), (err) => {
                                if (err) console.log(err);
                                console.log(chalk.green("> Updated _errors.json"))
                                rl.close();   
                            })
                        } catch (err) {
                            console.log(chalk.red("> Error updating _errors.json file:", err));
                            rl.close();
                        }
                        rl.close();
                    })
                })
            })
        })
    });

}
else if(args[0] == "-v"){
    console.log("v0.0.1");
    rl.close();
}
else{
    console.log(chalk.red("Invalid Command :/"));
    rl.close()
    return;
}