const express = require('express')

const Router = express.Router()

const lichsuController = require('../controllers/lichsu.controller.js')

Router.get('/thedienthoai/:IDGiaoDich', lichsuController.thedienthoaiInfo)

Router.get('/ruttien', lichsuController.ruttienPage)

Router.get('/', lichsuController.homePage)

module.exports = Router