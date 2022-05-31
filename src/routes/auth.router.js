const express = require('express')

const Router = express.Router()

const authController = require('../controllers/auth.controller.js')

Router.use((req,res,next) => {
  if(req.session.user && req.session.role == 1){
      return res.redirect('/admin')
  }
  else{
      next()
  }
})

Router.get('/restorePassword', authController.restorePassword)
Router.post('/restorePassword/send', authController.sendOtp)
Router.post('/verifyOtp', authController.verifyOtp)
Router.get('/changePassword', authController.getLayout)
Router.patch('/changepassword', authController.updatePassword)




// Router.get('/changePassword', authController.getLayout)

module.exports = Router