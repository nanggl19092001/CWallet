const DBconnection = require('../DB')
var express = require('express');
var flash = require('express-flash');
var {
	check,
	validatonResult,
	validationResult
} = require('express-validator');
const {
	ValidatorsImpl
} = require('express-validator/src/chain');
var bcrypt = require('bcrypt');

var csrf = require('csrf-token')


class main {

	registerPage(req, res) {
		bcrypt.compare('90830056', '$2b$10$TQlnQswrKFHCFpWufMk/3.4HqsnyoTaKrfAUWjTKd3t9HyvMvsG52', function (err, result) {
			console.log(result);
		});

		res.render('register')
	}

	getRegister(req, res) {
		var token = csrf.createSync('RegisterWebsite')
		res.render('register', {
			csrf: token
		});
	}

	postRegister(req, res) {
		//	var matchToken = csrf.verifySync('RegisterWebsite', req.body._csrf)
		//	if (!matchToken)
		//		return res.redirect('/register')
		//	var validate = validationResult(req)
		//if (validate.errors.length === 0) {
		var password = Math.random().toString().substr(2, 8);
		console.log(password);
		const LoaiTaiKhoan = 0
		var {
			HoVaTen,
			Email,
			DiaChi,
			NgayThangNamSinh,
			SoDienThoai,

		} = req.body;

		bcrypt.hash(password, 10, function (err, hash) {
			var sql = 'INSERT INTO user(HoVaTen, Email, DiaChi,NgayThangNamSinh,SoDienThoai,password,LoaiTaiKhoan) values(?, ?, ?, ?, ?, ?,?)';
			var params = [HoVaTen, Email, DiaChi, NgayThangNamSinh, SoDienThoai, hash, LoaiTaiKhoan];

			DBconnection.query(sql, params, (err, result, fields) => {
				if (err) {
					req.session.flash = {
						message: 'Đăng kí thất bại!'
					}
					return res.redirect('/register/registerpage')
				} else if (result.affectedRows == 1) {
					return res.redirect('/login/loginpage')
				}
			})
		});


		//	} 
		//else {
		//	validate = validate.mapped()
		//	var message
		//	for (i in validate) {
		//		message = validate[i].msg
		//		break
		//	}
		//	req.session.flash = {
		//		message: message
		//	}
		//	res.redirect('/register')
		//	}
	}
}

module.exports = new main