const express = require('express')

const Router = express.Router()

const naptienController = require('../controllers/naptien.controller')

Router.use((req,res,next) => {
    if(req.session.user && req.session.role == 1){
        return res.redirect('/admin')
    }
    else{
        next()
    }
})

Router.get('/add', naptienController.renderNapTienForm)
Router.post('/add', naptienController.validateNapTienForm)
Router.post('/process', naptienController.processNapTienRequest)

module.exports = Router