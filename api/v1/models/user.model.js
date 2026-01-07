const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    token:String,
    deletedAt: Date
},{timestamps: true})

const User=mongoose.model("User",UserSchema,"users");
module.exports=User;