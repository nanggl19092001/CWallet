const express = require('express')

const Router = express.Router()

const ruttienController = require('../controllers/ruttien.controller.js')

Router.use((req, res, next) => {
    if (req.session.user && req.session.role == 1) {
        return res.redirect('/admin')
    } else {
        next()
    }
})

Router.get('/add', ruttienController.renderRutTienForm)
Router.post('/add', ruttienController.firstValidateRutTienForm, ruttienController.secondValidateRutTienForm)
Router.post('/process', ruttienController.processRutTienRequest);

module.exports = Router