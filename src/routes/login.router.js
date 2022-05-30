const express = require('express')

const Router = express.Router()

const loginController = require('../controllers/login.controller')

Router.use((req,res,next) => {
    if(req.session.user && req.session.role == 0){
        return res.redirect('/')
    }
    else if(req.session.user && req.session.role == 1){
        return res.redirect('/admin')
    }
    else{
        next()
    }

})

Router.get('/', loginController.loginPage)

Router.post('/', loginController.validateLogin)

// Router.get('/user', (req, res) => {
//     res.render('user')
// })

module.exports = Router