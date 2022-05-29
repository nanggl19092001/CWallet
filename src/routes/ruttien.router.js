const express = require('express')

const Router = express.Router()

const ruttienController = require('../controllers/ruttien.controller.js')

Router.get('/add', ruttienController.renderRutTienForm)
Router.post('/add', ruttienController.firstValidateRutTienForm, ruttienController.secondValidateRutTienForm)
Router.post('/process', ruttienController.processRutTienRequest);

module.exports = Router