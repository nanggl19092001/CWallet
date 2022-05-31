const DBconnection = require('../DB')
const {main} = require('../middleware/sendMail.middleware')
const bcrypt = require('bcrypt');
const saltRounds = 10;
class auth{

    restorePassword(req,res){
        res.render('restorePassword')
    }

    async sendOtp(req,res){
      const email = req.body.email;
      DBconnection.query(`SELECT COUNT(*) as count FROM user WHERE Email = "${email}"`,async (err,result)=>{
        if (err) throw err;
        let count = JSON.parse(JSON.stringify(result))[0].count;
        console.log(count)
        if (count === 0) {
          res.json({state: 0})
        }
        else {
          DBconnection.query(`SELECT username FROM user WHERE Email = "${email}"`,async (err,result)=>{
            let username = JSON.parse(JSON.stringify(result))[0].username;
            const otp = Math.floor(Math.random() * 9) + 100000;
            DBconnection.query(`INSERT INTO otp( username, OTPKey) VALUES (${username},${otp})`, async(err, result) => {
             const id = JSON.parse(JSON.stringify(result)).insertId
              await main(email, otp)
              res.status(200).json({state: 1, id: id})
            })
          })
        }
      })
    }

    async verifyOtp(req,res) {
      const {otp, id} = req.body;
      DBconnection.query(`SELECT OTPKey, username FROM otp WHERE id = "${id}"`,async (err,result)=>{
        var {OTPKey, username} = JSON.parse(JSON.stringify(result))[0];
        if (Number(otp) !== OTPKey) {
          res.json({state: 0})
        }
        else if (Number(otp) === OTPKey){
          // console.log("Ádd")
     
          res.json({state: 1, username: username})
        }
      })
    }

    getLayout(req, res) {
      // console.log(res.params.username)
      res.render('changePassword')
    }
    updatePassword(req, res) {
      const newPW = req.body.newPW;
      const username = req.query.username;
      bcrypt.hash(newPW, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        DBconnection.query(`update user set password='${hash}' WHERE username=${username}`, async (err, result) => {
          if (err) throw err;
          console.log("Thành công!!!!");
          res.redirect('/')
          })
       
    });
    
    
      //console.log(newPW, username)
      
    }
}

module.exports = new auth