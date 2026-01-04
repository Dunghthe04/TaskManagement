const mongoose = require('mongoose')
const randomToken=require('../../../helpers/randomToken');
const UserSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    token:{
        type: String,
        default: randomToken.randomToken(20)
    } ,
    deletedAt: Date
},{timestamps: true})

const User=mongoose.model("User",UserSchema,"users");
module.exports=User;