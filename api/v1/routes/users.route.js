const express=require('express')
const router=express.Router();
const controller=require('../controllers/user.controller')
const authenMiddleware=require('../../../middleware/auth.middleware')
router.post('/register',controller.register)
router.get('/login',controller.login)
router.get('/forgotpassword',controller.forgotpassword)
router.get('/otpPassword',controller.otpPassword)
router.get('/resetPassword',controller.resetPassword)
router.get('/profileDetail',authenMiddleware.requireAuthen ,controller.profileDetail)
router.get('/getAllUsers',authenMiddleware.requireAuthen ,controller.getAllUser)

module.exports=router;