var express = require('express');
var router = express.Router();
var sane = require('../controllers/saves.controller');
var JWT_Verify = require('../middlewares/jwt');

// router.use(JWT_Verify.verifyToken);
router.post('/request', sane.requestSave);
router.put('/payment', sane.payment);
router.put('/withdraw', sane.withdrawal);
router.get('/views/:id', sane.ViewSaves);
router.get('/views', sane.ViewSaves);
router.get('/view/:id', sane.viewSave);

module.exports = router;