const express = require('express')

const Router = express.Router()

const muatheController = require('../controllers/muathe.controller.js')

Router.use((req,res,next) => {
    if(req.session.user && req.session.role == 1){
        return res.redirect('/admin')
    }
    else{
        next()
    }
})

Router.post('/confirm', muatheController.confirm)

Router.get('/', muatheController.homePage)

module.exports = Router