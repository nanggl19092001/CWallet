const mysql = require('mysql')

var con = mysql.createPool({
    host: "localhost",
    user: "root",
    password: null,
    database: "onlineBanking",
    dateStrings: true
})

con.getConnection((err) => {
    if (err) throw err
    console.log('DBconnected')
})

module.exports = con