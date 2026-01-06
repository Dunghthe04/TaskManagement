const express=require('express')
const router=express.Router();
const controller=require('../controllers/user.controller')
router.post('/register',controller.register)
router.get('/login',controller.login)
router.get('/forgotpassword',controller.forgotpassword)
router.get('/otpPassword',controller.otpPassword)
router.get('/resetPassword',controller.resetPassword)
router.get('/profileDetail',controller.profileDetail)

module.exports=router;