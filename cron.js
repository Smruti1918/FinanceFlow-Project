
const cron = require('node-cron');
const { executeSalaryCycle } = require('./database');

// Configuration
const SALARY_AMOUNT = 50000.00;

/**
 * Scheduled Job: Runs every 30 minutes
 * Logic:
 * 1. Generates a unique Window ID based on the current 30-min block.
 * 2. Executes the atomic database transaction.
 */
const initScheduler = () => {
    console.log('[Scheduler] Initializing 30-minute Salary Job...');
    
    // Pattern: 0, 30 * * * * (At minute 0 and 30 of every hour)
    cron.schedule('0,30 * * * *', () => {
        const now = new Date();
        // Create a deterministic window ID: YYYY-MM-DD-HH-MM (rounded to 30)
        const minutes = now.getMinutes() < 30 ? '00' : '30';
        const windowId = `${now.toISOString().split('T')[0]}-${now.getHours()}-${minutes}`;
        
        try {
            executeSalaryCycle(SALARY_AMOUNT, windowId);
        } catch (error) {
            console.error('[Scheduler] Critical Error during salary cycle:', error);
        }
    });
};

module.exports = { initScheduler };
