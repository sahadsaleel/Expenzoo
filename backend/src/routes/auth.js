const express = require('express');
const {
    requestOtp,
    verifyOtp,
} = require('../controllers/authController');

const router = express.Router();

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);

module.exports = router;
