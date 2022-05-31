const db = require('../DB')

const bcrypt = require('bcrypt');

const {check, validationResult} = require('express-validator')

const loginValidator = [
        
    check('email').exists().withMessage('Vui lòng nhập Email')
    .notEmpty().withMessage('Không được để trống Email'),
    check('password').exists().withMessage('Vui lòng nhập password người dùng')
    .notEmpty().withMessage('Không được để trống password')
    .isLength({min: 6}).withMessage('Mật khẩu phải nhiều hơn 1 kí tự'),
    
]

class login{

    loginPage(req, res){

        const error = req.flash('error') || ''
        const password = req.flash('password') || ''
        const email = req.flash('email') || ''
        res.render('login', {error: error, password: password, email: email})
    
        
    }
    
    
    
    
    
    validateLogin(req, res){
    
        let result = validationResult(req)
    
        if(result.errors.length === 0){
    
            const {email, password} = req.body
    
            const sql = 'Select * from user where Email = ?'
            const params = [email]
            db.query(sql, params, (err, results, fields) => {
                
                if(err){
                    req.flash('error', err.message)
                    req.flash('password', password)
                    req.flash('email', email)
                    return res.redirect('/login')
                } else if(results.length===0){
                    req.flash('error', 'Email không tồn tại')
                    req.flash('password', password)
                    req.flash('email', email)
    
                    return res.redirect('/login')
                }
                else if(results[0].trangthai == 3){
                    req.flash('error', 'Tài khoản hiện đang bị khóa vô thời hạn vui lòng liên hệ admin')
                    return res.redirect('/login')
                }
                else{
                    const hashed = results[0].password
                    const match = bcrypt.compareSync(password, hashed)

                        if(match){
                            req.session.user = results[0].username
                            req.session.role = results[0].LoaiTaiKhoan
                            req.session.dangnhaplandau = results[0].DangNhapLanDau
                            if(results[0].DangNhapThatBai === 3){
                                const sql1 = `Update user set DangNhapThatBai = 0 where Email = '${email}'`
                                
                                db.query(sql1, (err, results, fields) => {
    
                                    if(err){
                                        req.flash('error', err.message)
                                        req.flash('password', password)
                                        req.flash('email', email)
                                        return res.redirect('/login')
                                    }
                                        // console.log(results)
                                        return res.redirect('/')
                                    
                                })
                                
                            } else {return res.redirect('/')}
                        } else{

                            if(results[0].DangNhapThatBai < 3)
                            {
                            req.flash('error', 'Sai mật khẩu')
                            req.flash('password', password)
                            req.flash('email', email)
                            const sql2 = `Update user set DangNhapThatBai = DangNhapThatBai + 1 where Email = '${email}'`
    
                                db.query(sql2, (err, results, fields) => {
                                    if(err){
                                        console.log(err)
                                        req.flash('error', err.message)
                                        // req.flash('password', password)
                                        // req.flash('username', username)
                                    }
                                    else{
                                        console.log('OK')
                                        return res.redirect('/login')
                                    }
                                })
                            }
                            
                            else if(results[0].DangNhapThatBai === 3){
                                if(!results[0].ThoiGianVoHieuHoa){
                                    req.flash('error', 'Tài khoản của bạn bị khóa 1 phút')
                                    req.flash('password', password)
                                    req.flash('email', email)
                                    const sql3 = `UPDATE user set ThoiGianVoHieuHoa = NOW() where Email = '${email}'`
                                    
                                    db.query(sql3, (err, results, fields) => {
    
                                        if(err) {
                                            console.log(err)
                                            req.flash('error', err.message)
                                        }
    
                                    })
                                }
                                else{
                                const sql5 = `SELECT ThoiGianVoHieuHoa FROM user where Email = '${email}'`
    
                                let emailForThis = email
                                db.query(sql5, (err, results, fields) => {
                                    
                                    console.log(results)
                                    
                                    if(err) {
                                        req.flash('error', err.message) 
                                        return res.redirect('/login')
                                    }
                                    
                                    
    
                                    let date_ob = new Date();
                                    // let minutes = date_ob.getMinutes();
                                    let deacDate = new Date(results[0].ThoiGianVoHieuHoa)

                                    const a = Math.floor((date_ob - deacDate)/1000/60)
    
        
                                    if (a <= 1){
                                        req.flash('error', 'Vui lòng chờ sau 1 phút hãy tiến hành đăng nhập lại')
                                        // req.flash('password', password)
                                        // req.flash('username', username)
                                        return res.redirect('/login')
                                    } else{ 
                                        db.query(`Update user set DangNhapThatBai = DangNhapThatBai + 1 where email = '${emailForThis}'`,(err,result) => {
                                            if(err){
                                                console.log(err)
                                            }
                                            else{
                                                req.flash('error', 'Tài khoản của bạn bị khóa vĩnh viễn. Vui lòng liên hệ admin để được hỗ trợ')
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
                                const sql4 = `UPDATE user set trangthai = 3, ThoiGianVoHieuHoa = NULL where Email = '${email}'`
                                
    
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
    
            const {email, password} = req.body
    
            const sql = 'Select DangNhapThatBai from user where Email = ?'
            const params = [email]
    
            db.query(sql, params, (err, results, fields) => {
                results[0] += 1
                req.flash('error', message)
                req.flash('password', password)
                req.flash('email', email)
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