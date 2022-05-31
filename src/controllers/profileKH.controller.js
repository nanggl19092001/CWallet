const DBconnection = require('../DB')
var fs = require('fs');
const path = require('path');
class main{
// INSERT INTO `user`(`SoDienThoai`, `Email`, `HoVaTen`, `NgayThangNamSinh`, `DiaChi`, `username`, `password`, `DangNhapLanDau`, `trangthai`, `DangNhapThatBai`, `ThoiGianVoHieuHoa`, `LoaiTaiKhoan`) VALUES ('0359663439','aaaa@gmail.com',N'Phạm Tùng','08/23/2001','phamtung123','123456',1,2,0,,Null,0)
    async profileKHPage(req,res){
        // const username = Number(req.params.username);
        const username = Number(req.session.user);
        var soDu = ''
        DBconnection.query(`SELECT * FROM user WHERE username = ${username}`, function (err, result) {
            if (err) throw err;
            const user = JSON.parse(JSON.stringify(result))

            DBconnection.query(`SELECT SoDu FROM taikhoan WHERE username = ${username}`, function (err, result){
                if (err) throw err;
                soDu = JSON.parse(JSON.stringify(result))
                res.render('profileKH',{user: user[0],soDu: soDu[0]})
            })
            
        })
        // try {
        //     const username = Number(req.params.username);
        //     const data = await DBconnection.query(`SELECT * FROM user WHERE username = ${username} `)
        //     console.log(JSON.parse(JSON.stringify(data)));
        //     res.render('profileKH',{user: user})
        // }
        // catch (err) {
        //     res.status(500).json({message: 'Server dang loi'})
        // }
    }

    async uploadCMND(req, res){
        
        const username = req.session.user
        // fs.readdirSync(path.join(__dirname,'../uploads/user/new.png')).forEach(file => {
            fs.rename(path.join(__dirname,'../uploads/user/new.png'), path.join(__dirname,`../uploads/user/${username}.png`), () => {
                console.log("\nFile Renamed!\n");
            })
        //   });
        if (!req.file ) {
            req.body.image = '';
        }
        else {
            req.body.image = req.file.path.split('\\').slice(2).join('\\');
            
        }
        
        DBconnection.query('UPDATE user SET trangthai = 0 WHERE username = ' + username, (err, result) => {
            if (err) throw err;
            // fs.rename('new.png', `${username}.png`, function(err) {
            //     if ( err ) console.log('ERROR: không thể thây đổi');
            // });
            res.status(200).json({message: "Yêu cầu đã được gửi, chờ admin phê duyệt!"});
        })
    }
}

module.exports = new main