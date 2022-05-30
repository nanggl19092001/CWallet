const DBconnection = require('../DB')

class chuyenTien{
  homePage(req,res){
    let current_user = req.session.user
    res.render('chuyenTien')
  }

  getThongTinKH(req, res){
    const sdt = req.body.phoneKH
    res.status(200).json({message: "Yêu cầu đã được gửi, chờ admin phê duyệt!"});
  }
}

module.exports = new chuyenTien
