
const express = require('express');
const cors = require('cors');
const { getAccounts, getTransactions } = require('./database');
const { initScheduler } = require('./cron');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * API Endpoints
 */

// GET /api/accounts - Returns current balances for all accounts
app.get('/api/accounts', (req, res) => {
    try {
        const accounts = getAccounts();
        res.status(200).json({
            success: true,
            data: accounts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/transactions - Returns full historical ledger
app.get('/api/transactions', (req, res) => {
    try {
        const transactions = getTransactions();
        res.status(200).json({
            success: true,
            data: transactions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * Server Initialization
 */
app.listen(PORT, () => {
    console.log(`[Server] Backend system active on port ${PORT}`);
    
    // Start the background background worker
    initScheduler();
});

module.exports = app;
