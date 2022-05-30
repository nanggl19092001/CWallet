const DBconnection = require('../DB')
var csrf = require('csrf-token')
var bcrypt = require('bcrypt')

class main {

    loginPage(req, res) {
        res.render('login')
    }

    checkLogin = (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/login/loginpage')
        }
        next()
    }

    getcheckLogin(req, res) {
        var HoVaTen = req.session.name || ''
        res.render('index', {
            name: HoVaTen
        });
    }

    getLogout(req, res) {
        req.session.destroy()
        res.redirect('/login/loginpage')
    }

    getLogin(req, res) {
        var token = csrf.createSync('LoginWebsite')
        res.render('login', {
            csrf: token
        });
    }

    postLogin(req, res) {
        var {
            Email,
            password
        } = req.body

        var sql = 'SELECT * FROM user WHERE Email = ? LIMIT 1'
        var params = [Email]

        DBconnection.query(sql, params, (err, result, fields) => {
            let queryResult = JSON.parse(JSON.stringify(result))[0];

            if (err) {
                console.log('error');
                req.session.flash = {
                    message: 'Sai tài khoản hoặc mật khẩu!'
                }
                return res.redirect('/login/loginpage')
            } 
            
            
            else if (queryResult.length === 0) {
                console.log('wrong');
                req.session.flash = {
                    message: 'Sai tài khoản hoặc mật khẩu!'
                }
                return res.redirect('/login/loginpage')
            } else {
                var hash = result[0].password

                bcrypt.compare(password, hash, function (err, result) {
                    console.log(password + " " + hash);
                    if (result) {
                        req.session.user = queryResult.username;
                        req.session.Email = queryResult.Email;
                        console.log(req.session);
                        return res.redirect('/')
                    } else {
                        // console.log('last');
                        req.session.flash = {
                            message: 'Sai tài khoản hoặc mật khẩu!'
                        }
                        return res.redirect('/login/loginpage')
                    }
                })
            }
        })
    }
    // var matchToken = csrf.verifySync('LoginWebsite', req.body._csrf)
    // // if (!matchToken)
    // //     return res.redirect('/login/loginpage')
    // var loginValidator = [
    //     check('Email').exists().withMessage('Chưa nhập email!').notEmpty().withMessage('Chưa nhập email!')
    //     .isEmail().withMessage('Email không hợp lệ!'),
    //     check('password').exists().withMessage('Chưa nhập mật khẩu!').notEmpty().withMessage('Chưa nhập mật khẩu!')
    //     .isLength({
    //         min: 6
    //     }).withMessage('Mật khẩu phải ít nhất 6 ký tự!')
    // ]

    // var validate = validationResult(req)
    // if (validate.errors.length === 0) {

    // } else {
    //     validate = validate.mapped()
    //     var message
    //     for (i in validate) {
    //         message = validate[i].msg
    //         break
    //     }
    //     req.session.flash = {
    //         message: message
    //     }
    //     res.redirect('/login/loginpage')
    // }
};

module.exports = new main