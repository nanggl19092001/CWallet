const DBconnection = require('../DB')

class main{
// INSERT INTO `user`(`SoDienThoai`, `Email`, `HoVaTen`, `NgayThangNamSinh`, `DiaChi`, `username`, `password`, `DangNhapLanDau`, `trangthai`, `DangNhapThatBai`, `ThoiGianVoHieuHoa`, `LoaiTaiKhoan`) VALUES ('0359663439','aaaa@gmail.com',N'Phạm Tùng','08/23/2001','phamtung123','123456',1,2,0,,Null,0)
    async profileKHPage(req,res){
        // const username = Number(req.params.username);
        const username = Number(req.session.user);
        DBconnection.query(`SELECT * FROM user WHERE username = ${username}`, function (err, result) {
            if (err) throw err;
            const user = JSON.parse(JSON.stringify(result))
            res.render('profileKH',{user: user[0]})
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
        if (!req.file ) {
            req.body.image = '';
        }
        else {
            req.body.image = req.file.path.split('\\').slice(2).join('\\');
            
        }
        
        DBconnection.query('UPDATE user SET trangthai = 0 WHERE username = ' + req.session.user, (err, result) => {
            if (err) throw err;
            res.status(200).json({message: "Yêu cầu đã được gửi, chờ admin phê duyệt!"});
        })
    }
}

module.exports = new main