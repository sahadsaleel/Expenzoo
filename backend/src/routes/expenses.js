const express = require('express');
const {
    getExpenses,
    getExpense,
    addExpense,
    updateExpense,
    deleteExpense,
} = require('../controllers/expenseController');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

router
    .route('/')
    .get(getExpenses)
    .post(addExpense);

router
    .route('/:id')
    .get(getExpense)
    .put(updateExpense)
    .delete(deleteExpense);

module.exports = router;
