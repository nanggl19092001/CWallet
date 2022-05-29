const express = require('express')

const Router = express.Router()

const naptienController = require('../controllers/naptien.controller')

Router.get('/add', naptienController.renderNapTienForm)
Router.post('/add', naptienController.validateNapTienForm)
Router.post('/process', naptienController.processNapTienRequest)

module.exports = Router