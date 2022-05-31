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
            const otp = Math.floor(Math.random() * (1000000-100000)) + 100000;
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
      DBconnection.query(`SELECT * FROM otp WHERE id = "${id}"`,async (err,result)=>{
        if (Number(otp) !== result[0].OTPKey) {
          return res.json({state: 0})
        }
        else if (Number(otp) === result[0].OTPKey){
          // console.log("Ádd")
          let date_ob = new Date();
          // let minutes = date_ob.getMinutes();
          let deacDate = new Date(result[0].TimeSt)

          console.log(result[0].TimeSt)
          const a = Math.floor((date_ob - deacDate)/1000/60)

          console.log(a)
          if(a <= 1){
            DBconnection.query(`DELETE FROM otp WHERE username = ${result[0].username}`)
            return res.json({state: 1, username: result[0].username})
          }
          else{
            DBconnection.query(`DELETE FROM otp WHERE username = ${result[0].username}`)
            return res.json({state: 2, username: result[0].username})
          }
        }
      })
    }

    getLayout(req, res) {
      // console.log(res.params.username)
      res.render('restoreChangePassword')
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