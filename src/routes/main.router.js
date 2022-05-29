const express = require('express')

const Router = express.Router()

const mainController = require('../controllers/main.controller.js')

Router.get('/add', mainController.renderRutTienForm)
Router.post('/add', mainController.firstValidateRutTienForm, mainController.secondValidateRutTienForm)
Router.post('/process', mainController.processRutTienRequest);

module.exports = Router