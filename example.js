let prewil = require("./index.js");

let errorBuilder = new prewil()
.setPath("./_errors.json");

errorBuilder.build();


let a = 10;
if(a == 10){
    errorBuilder.throw(101)
}

errorBuilder.get(101)