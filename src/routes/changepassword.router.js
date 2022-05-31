const express = require('express')

const Router = express.Router()

const changepasswordController = require('../controllers/changepassword.controller')

const {check, validationResult} = require('express-validator')


Router.use((req,res,next) => {
    if(req.session.user && req.session.role == 1){
        return res.redirect('/admin')
    }
    else{
        next()
    }
})

const changepasssValidator = [
        

    check('password').exists().withMessage('Vui lòng nhập mật khẩu cũ')
    .notEmpty().withMessage('Không được để trống mật khẩu cũ')
    .isLength({min: 6}).withMessage('mật khẩu cũ phải từ 6 ký tự'),


    check('newpassword').exists().withMessage('Vui lòng nhập mật khẩu mới')
    .notEmpty().withMessage('Không được để trống mật khẩu mới')
    .isLength({min: 6}).withMessage('mật khẩu mới phải từ 6 ký tự'),

    check('rePassword').exists().withMessage('Vui lòng xác nhận mật khẩu mới')
    .notEmpty().withMessage('Vui lòng xác nhận mật khẩu mới')
    .custom((value, {req}) => {
        if (value !== req.body.newpassword){
            console.log("bug")
            throw new Error('Mật khẩu không khớp')
        }

        return true
    })
    
]

Router.get('/', changepasswordController.changepasspage)

Router.post('/',changepasssValidator, changepasswordController.validatechangepass)

// Router.get('/user', (req, res) => {
//     res.render('user')
// })

module.exports = Router