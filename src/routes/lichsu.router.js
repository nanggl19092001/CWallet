const express = require('express')

const Router = express.Router()

const lichsuController = require('../controllers/lichsu.controller.js')

Router.use((req,res,next) => {
    if(req.session.user && req.session.role == 1){
        return res.redirect('/admin')
    }
    else{
        next()
    }
})

Router.get('/thedienthoai/:IDGiaoDich', lichsuController.thedienthoaiInfo)

Router.get('/ruttien', lichsuController.ruttienPage)

Router.get('/', lichsuController.homePage)

module.exports = Router