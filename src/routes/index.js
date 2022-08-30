const express = require('express');
const api = require('./api');
const path = require('path');
const router = express.Router();


//add our api endpoints
router.use('/api', api);


module.exports = router;