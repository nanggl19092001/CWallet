const DBconnection = require('../DB')

class main {

    renderNapTienForm(req, res) {
        res.render('naptien')
    }

    validateNapTienForm(req, res, next) {
        const {
            SoThe,
            NgayHetHan,
            CVV,
            SoTien
        } = req.body;

        let errors = {};
        errors.data = req.body;
        let thongTinThe = [];
        let thongTinTaiKhoan = [];
        let flag = true;

        DBconnection.query(`SELECT * FROM thetindung WHERE SoThe = ${SoThe}`, function (err, result) {
            if (err) throw err;

            thongTinThe = JSON.parse(JSON.stringify(result));

            if (thongTinThe.length == 0) {
                errors.SoTheMessage = 'Vui lòng nhập lại số thẻ.';
                flag = false;
            } else if (req.body.NgayHetHan != thongTinThe[0].NgayHetHan) {
                errors.NgayHetHanMessage = 'Vui lòng chọn lại ngày hết hạn.';
                flag = false;
            } else if (CVV != thongTinThe[0].CVV) {
                errors.CVVMessage = 'Vui lòng nhập lại mã CVV.';
                flag = false;
            }

            if (!flag) {

                res.render('naptien', {
                    errors
                });
            } else {
                const XacNhanSoTienNap = parseInt(errors.data.SoTien).toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND'
                });

                res.cookie('userInput', errors);

                res.render('naptien', {
                    message: "successful",
                    errors,
                    XacNhanSoTienNap,
                });
            }
        });
    }

    processNapTienRequest(req, res) {
        const SoTien = req.cookies.userInput.data.SoTien;

        let query1 = "INSERT INTO chuyentien (IDChuyenTien, username, SDTNguoiNhan, SoTien, TrangThai, BenChiuPhi, LoaiGiaoDich) VALUES(NULL, 0, '0797377266', '" + SoTien + "', 1, 0, 1)"
        DBconnection.query(query1, function (err, result) {
            if (err) throw err;
            // console.log(result);
        })

        let query2 = "SELECT * FROM taikhoan WHERE username = 0"
        DBconnection.query(query2, function (err, result) {
            if (err) throw err;
            let thongTinTaiKhoan = JSON.parse(JSON.stringify(result[0]));
            let query3 = "UPDATE taikhoan SET SoDu = SoDu + " + SoTien;

            DBconnection.query(query3, function (err, result) {
                if (err) throw err;
                console.log(result);
            })
        })
    }
}

module.exports = new main