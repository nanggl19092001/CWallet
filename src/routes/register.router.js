var express = require('express');



const router = express.Router();
const registerController = require('../controllers/register.controller.js')

router.use((req,res,next) => {
    if(req.session.user && req.session.role == 1){
        return res.redirect('/admin')
    }
    else{
        next()
    }
})

router.get('/registerpage', registerController.registerPage)

router.get('/getregister', registerController.getRegister)

router.post('/registerpage', registerController.postRegister)


module.exports = router;