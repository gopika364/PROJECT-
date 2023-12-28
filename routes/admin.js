const admin = require('../controllers/adminController');
const express = require('express');

const router = express.Router();

router.get('/',admin.signin);
router.get('/home',admin.home);
router.get('/addProduct',admin.addProduct);
router.get('/productlist',admin.productlist);


module.exports = router;