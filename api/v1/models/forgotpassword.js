//tao ra de luu otp, expireAt se xoa ban ghi dua vao thoi gian
const mongoose= require('mongoose')
const forgotPasswordSchema=mongoose.Schema(
    {
        email:String,
        otp: String,
        expireAt:{
            type: Date,
            expire: 180
        }
    },{timestamps: true}
)
const forgotpassword= mongoose.model("Forgotpassword",forgotPasswordSchema,"forgotpassword")
module.exports=forgotpassword