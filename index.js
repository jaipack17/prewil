const chalk = require("chalk");

class ErrorBuilder {

    /**
     * @param {object} args
     * @param {string} args.path 
     */

    constructor(args) {
        this.data = {};
        if(args) {
            this.path = args.path;
        }
    }

    build() {
        const path = require(this.path);

        if (path.errors) {
            this.data = path.errors;
            console.log(chalk.green("> Prewil errors built."))
        } else {
            console.log("> Invalid file path provided. Prewil build failed")
        }
    }

    throw(errorCode) {
        if(errorCode in this.data) {
            if (this.data[errorCode].type == "ref") {
                throw new ReferenceError(chalk.red(`[${this.data[errorCode].code}] ${this.data[errorCode].name} - ${this.data[errorCode].description} \n`), [this.data[errorCode]])
            }
            if (this.data[errorCode].type == "type") {
                throw new TypeError(chalk.red(`[${this.data[errorCode].code}] ${this.data[errorCode].name} - ${this.data[errorCode].description} \n`), [this.data[errorCode]])
            }
            if (this.data[errorCode].type == "http") {
                throw new Error(chalk.red(`[${this.data[errorCode].code}] ${this.data[errorCode].name} - ${this.data[errorCode].description} \n`), [this.data[errorCode]])
            }
            if (this.data[errorCode].type == "syntax") {
                throw new SyntaxError(chalk.red(`[${this.data[errorCode].code}] ${this.data[errorCode].name} - ${this.data[errorCode].description} \n`), [this.data[errorCode]])
            }
        } else {
            throw new Error("An error with that errorcode or alias does not exist!")
        }
    }
    
    setPath(filepath) {
        if (filepath) {
            this.path = filepath;
        }
    }

    get(errorCode) {
        if(errorCode in this.data) {
            console.log(this.data[errorCode])
        } else {
            throw new Error("An error with that errorcode or alias does not exist!")
        }    
    }
}

module.exports = ErrorBuilder;

