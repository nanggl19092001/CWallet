const DBconnection = require('../DB')

class chuyentien{
    chuyentienPage(req,res){
        res.render('chuyentien')
    }
}

module.exports = new chuyentien