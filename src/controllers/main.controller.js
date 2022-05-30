const DBconnection = require('../DB')

class main{

    mainPage(req,res){
        res.render('index')
    }
}

module.exports = new main