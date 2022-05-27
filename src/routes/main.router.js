const express = require('express')

const Router = express.Router()

const mainController = require('../controllers/main.controller.js')

Router.get('/add', mainController.addGet)
Router.post('/add', mainController.addPost, mainController.errorPost)
Router.post('/process', mainController.process);

module.exports = Router