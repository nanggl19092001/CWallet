const express = require('express')

const Router = express.Router()

const adminController = require('../controllers/admin.controller.js')

Router.get('/', adminController.homePage)

Router.get('/profile/:username', adminController.userProfilePage)

Router.post('/user', adminController.userInfo)

Router.post('/profile', adminController.updateProfile)

Router.get('/activated', adminController.activatedPage)

Router.get('/deactivated', adminController.deactivatedPage)

Router.get('/locked', adminController.lockedPage)

Router.get('/transaction/transfer', adminController.transferPage)

Router.get('/transaction/:username', adminController.getUserTransaction)

Router.get('/transaction', adminController.transactionPage)

Router.post('/transaction', adminController.confirmTransaction)

module.exports = Router