const readline = require('readline');

/**
 * Account Management System - Node.js Implementation
 * 
 * This is a modernized version of the original COBOL application.
 * It preserves the original business logic, data integrity, and menu structure.
 * 
 * Architecture:
 * - DataLayer: Manages account balance (equivalent to DataProgram)
 * - Operations: Implements business logic (equivalent to Operations)
 * - MenuSystem: User interface (equivalent to MainProgram)
 */

// ============================================
// DATA LAYER (equivalent to DataProgram.cob)
// ============================================

class DataLayer {
  constructor() {
    // STORAGE-BALANCE = 1000.00 (PIC 9(6)V99)
    this.storageBalance = 100000; // Stored as cents to maintain precision (1000.00 * 100)
  }

  /**
   * Retrieves current balance (equivalent to READ operation)
   * @returns {number} Balance in cents
   */
  read() {
    return this.storageBalance;
  }

  /**
   * Updates balance to new value (equivalent to WRITE operation)
   * @param {number} balance - New balance in cents
   */
  write(balance) {
    this.storageBalance = balance;
  }

  /**
   * Formats balance from cents to display format (X.XX)
   * @param {number} balanceInCents - Balance in cents
   * @returns {string} Formatted balance with leading zeros
   */
  formatBalance(balanceInCents) {
    const dollars = Math.floor(balanceInCents / 100);
    const cents = balanceInCents % 100;
    return String(dollars).padStart(6, '0') + '.' + String(cents).padStart(2, '0');
  }
}

// ============================================
// OPERATIONS LAYER (equivalent to Operations.cob)
// ============================================

class Operations {
  constructor(dataLayer) {
    this.dataLayer = dataLayer;
  }

  /**
   * View current account balance (TOTAL operation)
   */
  viewBalance() {
    const balance = this.dataLayer.read();
    const formattedBalance = this.dataLayer.formatBalance(balance);
    console.log(`Current balance: ${formattedBalance}`);
  }

  /**
   * Credit amount to account (CREDIT operation)
   * @param {number} amount - Amount to credit in cents
   */
  creditAccount(amountInCents) {
    // READ current balance
    const currentBalance = this.dataLayer.read();

    // ADD amount to balance
    const newBalance = currentBalance + amountInCents;

    // WRITE updated balance
    this.dataLayer.write(newBalance);

    // DISPLAY confirmation
    const formattedBalance = this.dataLayer.formatBalance(newBalance);
    console.log(`Amount credited. New balance: ${formattedBalance}`);
  }

  /**
   * Debit amount from account (DEBIT operation)
   * Only allows debit if sufficient funds (overdraft protection)
   * @param {number} amountInCents - Amount to debit in cents
   * @returns {boolean} True if debit successful, false if insufficient funds
   */
  debitAccount(amountInCents) {
    // READ current balance
    const currentBalance = this.dataLayer.read();

    // VALIDATE sufficient funds
    if (currentBalance >= amountInCents) {
      // SUBTRACT amount from balance
      const newBalance = currentBalance - amountInCents;

      // WRITE updated balance
      this.dataLayer.write(newBalance);

      // DISPLAY confirmation
      const formattedBalance = this.dataLayer.formatBalance(newBalance);
      console.log(`Amount debited. New balance: ${formattedBalance}`);
      return true;
    } else {
      // DISPLAY error message
      console.log('Insufficient funds for this debit.');
      return false;
    }
  }
}

// ============================================
// MENU SYSTEM (equivalent to MainProgram.cob)
// ============================================

class MenuSystem {
  constructor(operations) {
    this.operations = operations;
    this.continueFlag = true;

    // Create readline interface for user input
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Display main menu and options
   */
  displayMenu() {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');
  }

  /**
   * Parse amount input, handling both integers and decimals
   * @param {string} input - User input string
   * @returns {number|null} Amount in cents or null if invalid
   */
  parseAmount(input) {
    const amount = parseFloat(input);

    // Validate: must be a number and >= 0
    if (isNaN(amount) || amount < 0) {
      return null;
    }

    // Convert to cents, rounding to handle floating point precision
    return Math.round(amount * 100);
  }

  /**
   * Get numeric input from user with validation
   * @param {string} prompt - Prompt message
   * @param {boolean} isMenuChoice - If true, validate as 1-4
   * @returns {Promise<number|null>} Parsed input or null if invalid
   */
  getInput(prompt, isMenuChoice = false) {
    return new Promise((resolve) => {
      this.rl.question(prompt, (answer) => {
        if (isMenuChoice) {
          const choice = parseInt(answer, 10);
          if (choice >= 1 && choice <= 4 && !isNaN(choice)) {
            resolve(choice);
          } else {
            resolve(null);
          }
        } else {
          const amount = this.parseAmount(answer);
          resolve(amount);
        }
      });
    });
  }

  /**
   * Process user choice and execute corresponding operation
   * @param {number} choice - Menu choice (1-4)
   */
  async processChoice(choice) {
    switch (choice) {
      case 1:
        this.operations.viewBalance();
        break;

      case 2:
        // CREDIT operation
        const creditAmount = await this.getInput('Enter credit amount: ');
        if (creditAmount !== null) {
          this.operations.creditAccount(creditAmount);
        } else {
          console.log('Invalid amount entered.');
        }
        break;

      case 3:
        // DEBIT operation
        const debitAmount = await this.getInput('Enter debit amount: ');
        if (debitAmount !== null) {
          this.operations.debitAccount(debitAmount);
        } else {
          console.log('Invalid amount entered.');
        }
        break;

      case 4:
        // EXIT
        this.continueFlag = false;
        console.log('Exiting the program. Goodbye!');
        break;

      default:
        console.log('Invalid choice, please select 1-4.');
    }
  }

  /**
   * Main menu loop (equivalent to MAIN-LOGIC in MainProgram)
   */
  async run() {
    while (this.continueFlag) {
      this.displayMenu();
      const choice = await this.getInput('Enter your choice (1-4): ', true);

      if (choice !== null) {
        await this.processChoice(choice);
      } else {
        console.log('Invalid choice, please select 1-4.');
      }
    }

    // Cleanup
    this.rl.close();
  }
}

// ============================================
// APPLICATION ENTRY POINT
// ============================================

async function main() {
  // Initialize layers (following the original architecture)
  const dataLayer = new DataLayer();
  const operations = new Operations(dataLayer);
  const menuSystem = new MenuSystem(operations);

  // Start the application
  await menuSystem.run();
}

// Only run the application if this file is executed directly
// This allows the module to be imported for testing without automatically running
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

// Export for testing purposes
module.exports = { DataLayer, Operations, MenuSystem };
