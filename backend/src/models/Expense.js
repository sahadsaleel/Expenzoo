const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
    },
    paymentMode: {
        type: String,
        required: [true, 'Please add a payment mode'],
        enum: ['Cash', 'Online', 'Card', 'Other'],
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot be more than 500 characters'],
    },
    expenseDate: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Expense', ExpenseSchema);
