const mongoose = require('../database/dbConnect');

const registerSchema = new mongoose.Schema({
    name:
    [{
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        }
    }],
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

const register = new mongoose.model('userregister',registerSchema);

module.exports = register;