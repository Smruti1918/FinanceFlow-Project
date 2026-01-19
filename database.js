
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Initialize database
const db = new Database('finance.db', { verbose: console.log });

// Execute schema
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

/**
 * Account Operations
 */
const getAccounts = () => {
    return db.prepare('SELECT id, name, balance FROM accounts').all();
};

const getAccountByName = (name) => {
    return db.prepare('SELECT * FROM accounts WHERE name = ?').get(name);
};

/**
 * Transaction Operations
 */
const getTransactions = () => {
    return db.prepare(`
        SELECT t.*, 
               fa.name as from_account_name, 
               ta.name as to_account_name 
        FROM transactions t
        LEFT JOIN accounts fa ON t.from_account_id = fa.id
        LEFT JOIN accounts ta ON t.to_account_id = ta.id
        ORDER BY t.timestamp DESC
    `).all();
};

/**
 * Atomic Salary & Transfer Logic
 * Wrapped in a DB transaction to ensure consistency and prevent race conditions.
 */
const executeSalaryCycle = db.transaction((salaryAmount, windowId) => {
    // 1. Check for existing window_id to prevent duplicate credits
    const existing = db.prepare('SELECT id FROM transactions WHERE window_id = ?').get(windowId);
    if (existing) {
        console.log(`[Scheduler] Cycle ${windowId} already processed. Skipping.`);
        return false;
    }

    const mainAccount = getAccountByName('Main');
    const savingsAccount = getAccountByName('Savings');
    const savingsAmount = salaryAmount * 0.5;

    // 2. Record Salary Credit to Main
    db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?')
      .run(salaryAmount, mainAccount.id);
    
    db.prepare(`
        INSERT INTO transactions (to_account_id, amount, type, window_id) 
        VALUES (?, ?, 'salary', ?)
    `).run(mainAccount.id, salaryAmount, windowId);

    // 3. Record Automatic Transfer to Savings
    db.prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?')
      .run(savingsAmount, mainAccount.id);
    
    db.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?')
      .run(savingsAmount, savingsAccount.id);

    db.prepare(`
        INSERT INTO transactions (from_account_id, to_account_id, amount, type) 
        VALUES (?, ?, 'transfer')
    `).run(mainAccount.id, savingsAccount.id, savingsAmount);

    console.log(`[Scheduler] Successfully processed cycle ${windowId}: Credited ${salaryAmount}, Transferred ${savingsAmount}`);
    return true;
});

module.exports = {
    getAccounts,
    getTransactions,
    executeSalaryCycle
};
