const express = require('express')

const Router = express.Router()

const authController = require('../controllers/auth.controller.js')

Router.get('/restorePassword', authController.restorePassword)
Router.post('/restorePassword/send', authController.sendOtp)
Router.post('/verifyOtp', authController.verifyOtp)
Router.get('/changePassword', authController.getLayout)
Router.patch('/changepassword', authController.updatePassword)




// Router.get('/changePassword', authController.getLayout)

module.exports = Router