const express = require('express');
const indexController=require("../Controller/Customer");
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/test',indexController.test_api);

module.exports = router;