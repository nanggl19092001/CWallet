const express = require('express')

const Router = express.Router()

const chuyenTienController = require('../controllers/chuyenTien.controller')

// Router.use((req,res,next) => {
//     if(req.session.user && req.session.role == 1){
//         return res.redirect('/admin')
//     }
//     else{
//         next()
//     }
// })

Router.get('/', chuyenTienController.homePage)
Router.get('/', chuyenTienController.getThongTinKH)


module.exports = Router