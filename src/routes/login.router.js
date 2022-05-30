var express = require('express');

const router = express.Router();

const loginController = require('../controllers/login.controller.js')
router.get('/loginpage', loginController.loginPage)
router.get('/getlogin', loginController.getLogin)
router.get('/getchecklogin', loginController.getcheckLogin)
router.get('/getlogout', loginController.getLogout)
router.post('/loginpage', loginController.postLogin)








module.exports = router;