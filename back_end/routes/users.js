var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller');
var JWT_Verify = require('../middlewares/jwt');

router.post('/register', userController.Register);
router.post('/login', userController.Login);
router.get('/activate/:token', userController.Activate);
router.post('/request/:email', userController.request_change);
router.get('/reset/:token', userController.reset_pass_bypass);
router.put('/reset_password/:token', userController.reset_password);

router.use(JWT_Verify.verifyToken);
router.get('/view/:id', userController.view);
router.get('/view', userController.view);
router.put('/edit', userController.Update);
router.put('/update/:id', userController.Update);
router.get('/number', userController.countNumbers);
router.post('/upload', userController.upload_photo);
router.post('*', (req, res) => {
    return res.status(404).json({status: false, message: 'Route not found'});
})

module.exports = router;