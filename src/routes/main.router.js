const express = require('express')

const Router = express.Router()

const mainController = require('../controllers/main.controller.js')

Router.get('/', mainController.mainPage)

module.exports = Router