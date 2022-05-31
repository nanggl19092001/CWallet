const express = require('express')

const Router = express.Router()

const chuyentienController = require('../controllers/chuyentien.controller.js')

Router.use((req,res,next) => {
    if(req.session.user && req.session.role == 1){
        return res.redirect('/admin')
    }
    else{
        next()
    }
})

Router.get('/', chuyentienController.chuyentienPage)

module.exports = Router