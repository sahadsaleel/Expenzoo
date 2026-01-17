const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');

// @desc    Request OTP
// @route   POST /api/auth/request-otp
// @access  Public
exports.requestOtp = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Please provide an email address',
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to database
        await Otp.create({
            email,
            otp,
        });

        // In a real app, send via Email (Nodemailer/SendGrid)
        // For development, we log it to variables/console
        console.log(`🔐 OTP for ${email}: ${otp}`);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            data: { email }, // Return email to confirm
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message || 'Failed to send OTP',
        });
    }
};

// @desc    Verify OTP and Login/Signup
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and OTP',
            });
        }

        // Check if OTP exists and is valid
        const validOtp = await Otp.findOne({ email, otp });

        if (!validOtp) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or expired OTP',
            });
        }

        // OTP is valid - Find or Create User
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user (name is optional or can be asked later)
            user = await User.create({
                name: email.split('@')[0], // Default name from email
                email,
            });
        }

        // Delete used OTP (optional, but good practice)
        await Otp.deleteMany({ email });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message || 'OTP Verification failed',
        });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    });
};
