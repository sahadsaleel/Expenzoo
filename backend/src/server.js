const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// Load env vars
dotenv.config();

// Route files
const auth = require('./routes/auth');
const expenses = require('./routes/expenses');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/expenses', expenses);

// Root route
app.get('/', (req, res) => {
    res.send('Expenzoo API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Server Error',
    });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expenzoo');
        console.log('MongoDB Connected...');

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`✅ Backend Server is LIVE!`);
            console.log(`🌐 Local Access: http://localhost:${PORT}`);
            console.log(`📱 Network Access: http://${process.env.YOUR_COMPUTER_IP || '192.168.1.15'}:${PORT}`);
            console.log(`🚀 Ready for Auth & Expense requests!`);
        });
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

startServer();
