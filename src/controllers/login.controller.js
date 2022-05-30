const db = require('../DB')

const bcrypt = require('bcrypt');

const {check, validationResult} = require('express-validator')

const loginValidator = [
        
    check('username').exists().withMessage('Vui lòng nhập username')
    .notEmpty().withMessage('Không được để trống username')
    .isInt('username').withMessage('username không hợp lệ'),
    check('password').exists().withMessage('Vui lòng nhập password người dùng')
    .notEmpty().withMessage('Không được để trống password')
    .isLength({min: 6}).withMessage('Mật khẩu phải nhiều hơn 1 kí tự'),
    
]

class login{

    loginPage(req, res){

        const error = req.flash('error') || ''
        const password = req.flash('password') || ''
        const username = req.flash('username') || ''
        res.render('login', {error: error, password: password, username: username})
    
        
    }
    
    
    
    
    
    validateLogin(req, res){
    
        let result = validationResult(req)
    
        if(result.errors.length === 0){
    
            const {username, password} = req.body
    
            const sql = 'Select * from user where username = ?'
            const params = [username]
    
            db.query(sql, params, (err, results, fields) => {
                
                if(err){
                    req.flash('error', err.message)
                    req.flash('password', password)
                    req.flash('username', username)
                    return res.redirect('/login')
                } else if(results.length===0){
                    req.flash('error', 'Username không tồn tại')
                    req.flash('password', password)
                    req.flash('username', username)
    
    
                    return res.redirect('/login')
                }
                else{
                    const hashed = results[0].password
                    const match = bcrypt.compareSync(password, hashed)
                    console.log(password)
                    console.log(hashed)
                    console.log(match)
    
                        if(match){
                            if(results[0].DangNhapThatBai === 3){
                                const sql1 = `Update user set DangNhapThatBai = 0 where username = ${results[0].username}`
    
                                db.query(sql1, (err, results, fields) => {
    
                                    if(err){
                                        req.flash('error', err.message)
                                        req.flash('password', password)
                                        req.flash('username', username)
                                        return res.redirect('/login')
                                    }
                                    
                                        return res.redirect('/')
                                    
                                })
                                
                            } else {return res.redirect('/')}
                        } else{
                            if(results[0].DangNhapThatBai < 3)
                            {
                            req.flash('error', 'Sai mật khẩu')
                            req.flash('password', password)
                            req.flash('username', username)
                            const sql2 = `Update user set DangNhapThatBai = DangNhapThatBai + 1 where username = ${results[0].username}`
                                
    
                                db.query(sql2, (err, results, fields) => {
                                    if(err){
                                        req.flash('error', err.message)
                                        // req.flash('password', password)
                                        // req.flash('username', username)
                                    }
                                    else{
                                        return res.redirect('/login')
                                    }
                                })
                            }
                            
                            else if(results[0].DangNhapThatBai == 3){
                                if(!results[0].ThoiGianVoHieuHoa){
                                    req.flash('error', 'Tài khoản của bạn bị khóa 1 phút')
                                    req.flash('password', password)
                                    req.flash('username', username)
                                    const sql3 = `UPDATE user set ThoiGianVoHieuHoa = CURTIME() where username = ${results[0].username}`
                                    
                                    db.query(sql3, (err, results, fields) => {
    
                                        if(err) {req.flash('error', err.message)}
    
                                    })
                                }
                                else{
                                const sql5 = `SELECT ThoiGianVoHieuHoa FROM user where username = ${results[0].username}`
    
                                let usernameForThis = results[0].username
                                db.query(sql5, (err, results, fields) => {
    
                                    
                                    if(err) {
                                        req.flash('error', err.message) 
                                        return res.redirect('/login')
                                    }
                                    
                                    
    
                                    let date_ob = new Date();
                                    // let minutes = date_ob.getMinutes();
    
                                    const a = Math.floor((date_ob - results[0].ThoiGianVoHieuHoa)/1000/60)
    
                                    console.log(a)
    
                                    console.log((date_ob - results[0].ThoiGianVoHieuHoa))
        
                                    if (a <= 1){
                                        req.flash('error', 'Vui lòng chờ sau 1 phút hãy tiến hành đăng nhập lại')
                                        // req.flash('password', password)
                                        // req.flash('username', username)
                                        return res.redirect('/login')
                                    } else{ 
                                        db.query(`Update user set DangNhapThatBai = DangNhapThatBai + 1 where username = ${usernameForThis}`,(err,result) => {
                                            if(err){
                                                console.log(err)
                                            }
                                            else{
                                                return res.redirect('/login')
                                            }
                                        })
                                     }
                                    
                                })
                            }
                                // return res.redirect('/login')
    
                            } else if(results[0].DangNhapThatBai >= 4){
                                req.flash('error', 'Tài khoản của bạn bị khóa vĩnh viễn. Vui lòng liên hệ admin để được hỗ trợ')
                                // req.flash('password', password)
                                // req.flash('username', username)
                                const sql4 = `UPDATE user set trangthai = 3 where username = ${results[0].username}`
                                
    
                                db.query(sql4, (err, results, fields) => {
                                    if(err){
                                        req.flash('error', err.message)
                                        
                                    }
                                    
                                })
                                return res.redirect('/login')
                            }
                            else{
                            return res.redirect('/login')
                            }
    
                        }
                    
                }
                
            })
    
        } else{
    
            result = result.mapped()
    
    
            let message;
            for( fields in result){
                message = result[fields].msg
    
                break
            }
    
            const {username, password} = req.body
    
            const sql = 'Select DangNhapThatBai from user where username = ?'
            const params = [username]
    
            db.query(sql, params, (err, results, fields) => {
                results[0] += 1
                req.flash('error', message)
                req.flash('password', password)
                req.flash('username', username)
                return res.redirect('/login')
            })
            
            // req.flash('error', message)
            // req.flash('password', password)
            // req.flash('username', username)
    
            
            //res.redirect('/login')
    
        }
        // res.render('login')
    }
}

module.exports = new login