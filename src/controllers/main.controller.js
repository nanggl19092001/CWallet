const DBconnection = require('../DB')

class main{
    homePage(req,res){
        res.render('index')
    }
}

module.exports = new main