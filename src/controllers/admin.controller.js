const DBconnection = require('../DB')

class admin{

    homePage(req,res){
        DBconnection.query(`SELECT * FROM user WHERE trangthai = 0 or trangthai = 4 AND LoaiTaiKhoan = 0 ORDER BY trangthai DESC`, (err,result) => {
            console.log(result)
            if(err){
                console.log(err)
                res.send(JSON.stringify({code: 500}))
                return false
            }
            else{
                res.render('adminHomePage', {users:result})
                return true
            }
        })
    }

    userProfilePage(req,res){
        let username = req.params.username
        
        DBconnection.query(`SELECT * FROM user WHERE username = ${username}`, (err, result) => {
            if(err){
                res.send(JSON.stringify({code: 500}))
                return false
            }
            else{
                let status = ''
                if(result[0]){
                    result[0].NgayThangNamSinh = JSON.stringify(result[0].NgayThangNamSinh).split('T')[0].replace('"','')

                    if(result[0].trangthai == 0 || result[0].trangthai == 4){
                        status = 'Đang chờ xác minh'
                    }
                    else if(result[0].trangthai == 1){
                        status = 'Đã xác minh'
                    }
                    else if(result[0].trangthai == 2){
                        status = 'Vô hiệu hóa'
                    }
                    else if(result[0].trangthai == 3){
                        status = 'Khóa vô thời hạn'
                    }

                }
                res.render('adminUserProfile', {user:result,status:status, helpers: {
                    eq(a,b) { return a == b }
                }})
                return true
            }
        })
    }

    userInfo(req,res){
        if(req.body.username){
            DBconnection.query(`SELECT * FROM user WHERE username = ${req.body.username}`, (err,result) => {
                if(err){
                    res.send(JSON.stringify({code: 500}))
                    return false
                }
                else{
                    res.send(JSON.stringify(result[0]))
                    return true
                }
            })
        }
        else if(req.body.SoDienThoai){
            DBconnection.query(`SELECT * FROM user WHERE SoDienThoai = ${req.body.SoDienThoai}`, (err,result) => {
                if(err){
                    res.send(JSON.stringify({code: 500}))
                    return false
                }
                else{
                    res.send(JSON.stringify(result[0]))
                    return true
                }
            })
        }
    }

    userTransaction(req,res){
        let username = req.body.username

        DBconnection.query(`SELECT * FROM chuyentien WHERE username = ${username}`, (err, result) => {
            if(err){
                res.send(JSON.stringify({code: 500}))
                return false
            }
            else{
                res.send(result)
                return true
            }
        })
    }

    updateProfile(req,res){
        let username = req.body.username
        let trangthai = req.body.trangthai

        DBconnection.query(`UPDATE user SET trangthai = ${trangthai} WHERE username = ${username}`, (err,result)=> {
            if(err){
                console.log(err)
                res.send(JSON.stringify({code: 500}))
                return false
            }
            else{
                res.send(JSON.stringify({code: 200}))
                return true
            }
        })
    }

    activatedPage(req,res){
        DBconnection.query(`SELECT * FROM user WHERE trangthai = 1 ORDER BY NgayTao DESC`, (err,result) => {
            if(err){
                res.send(JSON.stringify({code:500}))
                return false
            }
            else{
                if(result){
                    for(let i=0;i<result.length;i++){
                        result[i].NgayTao = JSON.stringify(result[i].NgayTao).split('T')[0].replace('"','')
                    }
                }
                res.render('adminActivatedUsers', {user: result})
                return true
            }
        })
    }

    deactivatedPage(req,res){
        DBconnection.query(`SELECT * FROM user WHERE trangthai = 2 ORDER BY NgayTao DESC`, (err,result) => {
            if(err){
                res.send(JSON.stringify({code:500}))
                return false
            }
            else{
                if(result[0]){
                    result[0].NgayTao = JSON.stringify(result[0].NgayTao).split('T')[0].replace('"','')
                }
                res.render('adminDeactivatedUsers', {user: result})
                return true
            }
        })
    }

    lockedPage(req,res){
        DBconnection.query(`SELECT * FROM user WHERE trangthai = 3 ORDER BY NgayTao DESC`, (err,result) => {
            if(err){
                res.send(JSON.stringify({code:500}))
                return false
            }
            else{
                if(result[0]){
                    result[0].NgayTao = JSON.stringify(result[0].NgayTao).split('T')[0].replace('"','')
                }
                res.render('adminLockedUsers', {user: result})
                return true
            }
        })
    }

    transactionPage(req,res){
        DBconnection.query(`SELECT * FROM chuyentien WHERE TrangThai = 3 AND LoaiGiaoDich = 2`, (err, result) => {
            if(err){
                res.send(JSON.stringify({code: 404}))
                return false
            }
            else{
                res.render('adminTransaction', {transaction: result})
                return true
            }
        })
    }

    confirmTransaction(req,res){
        let tienChuyen = 0
        let tienTru = 0
        if(req.body.BenChiuPhi == 0){
            tienChuyen = req.body.SoTien
            tienTru = parseInt(req.body.SoTien)*105/100
        }
        else{
            tienChuyen = req.body.SoTien*95/100
            tienTru = parseInt(req.body.SoTien)
        }

        // console.log(tienChuyen)
        // console.log(tienTru)
        DBconnection.query(`SELECT SoDu FROM taikhoan WHERE username = ${req.body.username}`, (err, result) => {
            if(err){
                res.send(JSON.stringify({code: 500}))
                return false
            }
            else{
                console.log(result)
                if(result[0].SoDu < tienTru){
                    res.send(JSON.stringify({code: 403,msg: 'Số dư tài khoản hiện tại không đủ'}))
                    return false
                }
                else{
                    DBconnection.query(`UPDATE chuyentien SET TrangThai = ${req.body.TrangThai} WHERE IDChuyenTien = ${req.body.IDChuyenTien}`,(err,result) => {
                        if(err){
                            console.log(err)
                            res.send(JSON.stringify({error: 'Failed'}))
                            return false
                        }
                        else{
                            DBconnection.query(`UPDATE taikhoan SET SoDu = SoDu - ${tienTru} WHERE username = ${req.body.username}`)
            
                            DBconnection.query(`UPDATE taikhoan SET SoDu = SoDu + ${tienChuyen} WHERE username = ${req.body.usernameNguoiNhan}`)
                            res.send(JSON.stringify({code: 200}))
                            return true
                        }
                    })
                }
            }
        })
        
    }

    refuseTransaction(req,res){
        DBconnection.query(`UPDATE chuyentien SET TrangThai = 0 WHERE IDChuyenTien = ${req.body.IDChuyenTien}`, (err,req) => {
            if(err){
                res.send(JSON.stringify({code: 500, msg: 'server error'}))
                return false
            }
            else{
                res.send(JSON.stringify({code: 200}))
                return true
            }
        })
    }

    getUserTransaction(req,res){
        DBconnection.query(`SELECT * FROM chuyentien WHERE username = ${req.params.username}`, (err,result) => {
            if(err){
                console.log(err)
                res.send(JSON.stringify({error: 'Failed'}))
                return false
            }
            else{
                res.send(JSON.stringify(result))
                return true
            }
        })
    }

    transferPage(req,res){
        DBconnection.query(`SELECT * FROM chuyentien WHERE TrangThai = 3 AND LoaiGiaoDich = 1`, (err, result) => {
            if(err){
                res.send(JSON.stringify({code: 404}))
                return false
            }
            else{
                res.render('adminTransactionTransfer', {transaction: result})
                return true
            }
        })
    }

}

module.exports = new admin