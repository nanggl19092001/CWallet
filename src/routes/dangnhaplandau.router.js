const express = require('express')
const e = require('method-override')

const Router = express.Router()

Router.use((req,res,next) => {
    if(!req.session.user){
        return res.redirect('/login')
    }
    else if(req.session.dangnhaplandau == 0){
        if(req.session.role == 0){
            res.redirect('/')
        }
        else{
            res.redirect('/admin')
        }
    } else{
        next()
    }
})
Router.get('/', (req,res) => {
    res.render('dangnhaplandau')
})





module.exports = Router