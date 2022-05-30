const express = require('express')

const Router = express.Router()

const muatheController = require('../controllers/muathe.controller.js')

Router.post('/confirm', muatheController.confirm)

Router.get('/', muatheController.homePage)

module.exports = Router