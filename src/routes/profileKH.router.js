const express = require('express')
const {upload} = require('../middleware/uploadImage.middleware')

const Router = express.Router()

const profileController = require('../controllers/profileKH.controller.js')

Router.use((req,res,next) => {
    if(req.session.user && req.session.role == 1){
        return res.redirect('/admin')
    }
    else{
        next()
    }
})

Router.get('/', profileController.profileKHPage)//Trang chủ của profile
Router.put('/', upload.single('image') , profileController.uploadCMND)

module.exports = Router