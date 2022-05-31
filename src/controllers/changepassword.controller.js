const db = require('../DB')

const bcrypt = require('bcrypt');

const {check, validationResult} = require('express-validator')


class changepasss {

    changepasspage(req, res){

        const error = req.flash('error') || ''
        res.render('changepassword', {error: error})
    }


    validatechangepass(req, res){

        let current_username = req.session.user

        let result = validationResult(req)
    
        if(result.errors.length === 0){
    
            const {password, newpassword, rePassword} = req.body

    
            const sql = 'Select * from user where username = ?'
            const params = [current_username]

            db.query(sql, params, (err, results, fields) => {
                
                if(err){
                    req.flash('error', err.message)
                    return res.redirect('/changepassword')
                } else if(results.length===0){
                    req.flash('error', 'Username không tồn tại')   
                    return res.redirect('/changepassword')
                }
                else{
                    const hashed = results[0].password
                    const match = bcrypt.compareSync(password, hashed)
                    
                    if(match){
                        const hashed1 = bcrypt.hashSync(newpassword, 10)

                        const sql = `Update user set password = '${hashed1}' where username = '${current_username}'`

                        const params1 = [current_username, hashed1]

                        db.query(sql, params1, (error, result, fields) => {

                            if(error){
                                req.flash('error', error.message)
                                return res.redirect('/changepassword')
                            }else if(result.affectedRows === 1) {
                                return res.redirect('/')
                            }
                
                            req.flash('error', 'Đổi mật khẩu thất bại')
                
                            return res.redirect('/changepassword')
                        })
                    } else{

                        req.flash('error', 'Sai mật khẩu cũ')
                        return res.redirect('/changepassword')   

                    }

                }
            })
        } else {

            result = result.mapped()

            console.log(result)


            let message;

            
            
            for( fields in result){

                message = result[fields].msg

                break
            }

            const {password, newpassword} = req.body
            
            // req.flash('error', message)
            return res.redirect('/changepassword')
        }
    }

}

module.exports = new changepasss
  
