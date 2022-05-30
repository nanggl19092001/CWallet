const express = require('express')

const Router = express.Router()

const loginController = require('../controllers/login.controller')


Router.get('/', loginController.loginPage)

Router.post('/', loginController.validateLogin)

// Router.get('/user', (req, res) => {
//     res.render('user')
// })

module.exports = Router