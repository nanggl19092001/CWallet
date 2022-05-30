const mysql = require('mysql')

var con = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: null,
    database: "onlineBanking"
})

con.getConnection((err) => {
    if(err) throw err
    console.log('DBconnected')
})

module.exports = con