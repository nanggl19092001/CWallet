var express = require('express');



const router = express.Router();
const registerController = require('../controllers/register.controller.js')
router.get('/registerpage', registerController.registerPage)
router.get('/getregister', registerController.getRegister)
router.post('/registerpage', registerController.postRegister)







module.exports = router;