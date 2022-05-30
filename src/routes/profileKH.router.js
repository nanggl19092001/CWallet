const express = require('express')
const {upload} = require('../middleware/uploadImage.middleware')

const Router = express.Router()

const profileController = require('../controllers/profileKH.controller.js')

Router.get('/:username', profileController.profileKHPage)//Trang chủ của profile
Router.put('/:username', upload.single('image') , profileController.uploadCMND)

module.exports = Router