const DBconnection = require('../DB')

class main {

    renderRutTienForm(req, res) {
        res.render('ruttien')
    }

    firstValidateRutTienForm(req, res, next) {
        const {
            GhiChu,
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

            console.log(thongTinThe[0].NgayHetHan);

            if (thongTinThe.length == 0) {
                errors.SoTheMessage = 'Vui lòng nhập lại số thẻ.';
                flag = false;
            } else if (req.body.NgayHetHan != thongTinThe[0].NgayHetHan) {
                errors.NgayHetHanMessage = 'Vui lòng chọn lại ngày hết hạn.';
                flag = false;
            } else if (CVV != thongTinThe[0].CVV) {
                errors.CVVMessage = 'Vui lòng nhập lại mã CVV.';
                flag = false;
            } else if (SoTien % 50000 != 0) {
                errors.SoTienMessage = 'Số tiền rút phải là bội số của 50,000 đồng.';
                flag = false;
            }

            if (!flag) {
                // console.log(errors);
                res.render('ruttien', {
                    errors
                });
            } else {
                next();
            }
        });
    }

    secondValidateRutTienForm(req, res, next) {
        const {
            GhiChu,
            SoThe,
            NgayHetHan,
            CVV,
            SoTien
        } = req.body;

        let errors = {};
        errors.data = req.body;

        DBconnection.query(`SELECT * FROM taikhoan WHERE username = 0`, function (err, result) {
            let thongTinTaiKhoan = JSON.parse(JSON.stringify(result));
            let GiaoDichConLai = thongTinTaiKhoan[0].GiaoDichConLai;
            let NgayReset = thongTinTaiKhoan[0].NgayReset;
            let NgayHienTai = new Date().toISOString().slice(0, 10);

            if (GiaoDichConLai == 0 && NgayReset == NgayHienTai) {
                errors.GiaoDichToiDaMessage = 'Mỗi ngày chỉ được tạo tối đa 2 giao dịch rút tiền.';
            }

            if (errors.GiaoDichToiDaMessage) {
                res.render('ruttien', {
                    errors
                });
            } else {
                const XacNhanSoTienRut = parseInt(errors.data.SoTien).toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND'
                });

                const PhiRutTien = (parseInt(errors.data.SoTien) * 5 / 100).toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND'
                });

                res.cookie('userInput', errors);

                res.render('ruttien', {
                    message: "successful",
                    errors,
                    XacNhanSoTienRut,
                    PhiRutTien,
                });
            }
        })
    }

    processRutTienRequest(req, res) {
        const SoTien = req.cookies.userInput.data.SoTien;

        if (SoTien <= 5000000) {
            let query1 = "INSERT INTO chuyentien (IDChuyenTien, username, SDTNguoiNhan, SoTien, TrangThai, BenChiuPhi, LoaiGiaoDich) VALUES(NULL, 0, '0797377266', '" + (SoTien * 105 / 100) + "', 1, 0, 2)"
            DBconnection.query(query1, function (err, result) {
                if (err) throw err;
                // console.log(result);
            })
        } else {
            let query1 = "INSERT INTO chuyentien (IDChuyenTien, username, SDTNguoiNhan, SoTien, TrangThai, BenChiuPhi, LoaiGiaoDich) VALUES(NULL, 0, '0797377266', '" + (SoTien * 105 / 100) + "', 3, 0, 2)"
            DBconnection.query(query1, function (err, result) {
                if (err) throw err;
                // console.log(result);
            })
        }

        let query2 = "SELECT * FROM taikhoan WHERE username = 0"
        DBconnection.query(query2, function (err, result) {
            if (err) throw err;
            let thongTinTaiKhoan = JSON.parse(JSON.stringify(result[0]));
            let NgayReset = thongTinTaiKhoan.NgayReset;
            let NgayHienTai = new Date().toISOString().slice(0, 10);

            if (NgayReset == NgayHienTai) {
                let query3 = "UPDATE taikhoan SET SoDu = SoDu - " + (thongTinTaiKhoan.SoDu - (SoTien * 105 / 100)) + ", GiaoDichConLai = GiaoDichConLai - 1";
                DBconnection.query(query3, function (err, result) {
                    if (err) throw err;
                    console.log(result);
                })
            } else {
                let query3 = "UPDATE taikhoan SET SoDu = SoDu - " + (thongTinTaiKhoan.SoDu - (SoTien * 105 / 100)) + ", NgayReset = '" + NgayHienTai + "', GiaoDichConLai = 1";
                DBconnection.query(query3, function (err, result) {
                    if (err) throw err;
                    console.log(result);
                })
            }
        })
    }
}

module.exports = new main