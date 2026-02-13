# Account Management System - Test Plan

## Overview
This test plan documents all test cases for the Account Management System (COBOL and future Node.js implementation). It covers business logic validation for balance inquiries, credit transactions, and debit transactions with overdraft protection.

---

## Test Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | Verify initial account balance | Application starts fresh | 1. Launch application<br>2. Select menu option 1 (View Balance) | Display "Current balance: 001000.00" | | | |
| TC-002 | View balance multiple times | Balance = 1000.00 | 1. Select option 1 (View Balance)<br>2. Verify displayed balance<br>3. Select option 1 again<br>4. Verify balance unchanged | Multiple displays of 1000.00 (balance remains consistent) | | | |
| TC-003 | Reject invalid menu selection | Application displaying main menu | 1. At menu prompt, enter invalid choice (e.g., 5)<br>2. Verify error message<br>3. Menu should reappear | Display "Invalid choice, please select 1-4."<br>Menu redisplays for next input | | | |
| TC-004 | Reject invalid menu selection - letter input | Application displaying main menu | 1. At menu prompt, enter a letter (e.g., 'A')<br>2. Verify system handles invalid input | Display "Invalid choice, please select 1-4."<br>Menu redisplays | | | |
| TC-005 | Credit account - standard amount | Balance = 1000.00 | 1. Select option 2 (Credit Account)<br>2. When prompted, enter amount: 500.00<br>3. Verify balance updated | Display "Amount credited. New balance: 001500.00" | | | Credit a valid positive amount |
| TC-006 | Credit account - small amount | Balance = 1000.00 | 1. Select option 2 (Credit Account)<br>2. Enter amount: 0.01<br>3. Verify balance updated | Display "Amount credited. New balance: 001000.01" | | | Minimum credit validation |
| TC-007 | Credit account - large amount | Balance = 1000.00 | 1. Select option 2 (Credit Account)<br>2. Enter amount: 99999.99<br>3. Verify balance updated | Display "Amount credited. New balance: 100999.99" | | | Large credit validation |
| TC-008 | Credit account - whole number | Balance = 1000.00 | 1. Select option 2 (Credit Account)<br>2. Enter amount: 250<br>3. Verify balance updated | Display "Amount credited. New balance: 001250.00" | | | Whole number formatting |
| TC-009 | Multiple sequential credits | Balance = 1000.00 | 1. Credit 300.00 (new balance: 1300.00)<br>2. Credit 200.00 (new balance: 1500.00)<br>3. Credit 100.00 (new balance: 1600.00)<br>4. View balance to verify | Display shows 1600.00 | | | Multiple credits accumulate correctly |
| TC-010 | Debit account - standard amount | Balance = 1000.00 | 1. Select option 3 (Debit Account)<br>2. When prompted, enter amount: 250.00<br>3. Verify balance updated | Display "Amount debited. New balance: 000750.00" | | | Standard debit validation |
| TC-011 | Debit account - amount equal to balance | Balance = 1000.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 1000.00 | Display "Amount debited. New balance: 000000.00" | | | Debit entire balance |
| TC-012 | Debit account - insufficient funds | Balance = 1000.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 1500.00 | Display "Insufficient funds for this debit."<br>Balance remains 1000.00 | | | Overdraft protection - rejection |
| TC-013 | Debit account - excess amount | Balance = 500.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 600.00 | Display "Insufficient funds for this debit."<br>Balance remains 500.00 | | | Overdraft protection validation |
| TC-014 | Debit account - amount exceeds balance by 0.01 | Balance = 100.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 100.01 | Display "Insufficient funds for this debit."<br>Balance remains 100.00 | | | Precision validation with decimals |
| TC-015 | Debit account - small valid amount | Balance = 1000.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 0.01 | Display "Amount debited. New balance: 000999.99" | | | Minimum debit validation |
| TC-016 | Multiple sequential debits | Balance = 1000.00 | 1. Debit 100.00 (new balance: 900.00)<br>2. Debit 200.00 (new balance: 700.00)<br>3. Debit 150.00 (new balance: 550.00)<br>4. View balance to verify | Display shows 550.00 | | | Multiple debits subtract correctly |
| TC-017 | Credit then debit sequence | Balance = 1000.00 | 1. Credit 500.00 (balance: 1500.00)<br>2. Debit 300.00 (balance: 1200.00)<br>3. View balance | Display shows 1200.00 | | | Mixed transaction sequence |
| TC-018 | Debit after insufficient funds rejection | Balance = 100.00 | 1. Attempt to debit 200.00 (rejected)<br>2. Debit 50.00 (valid)<br>3. View balance | Display "Insufficient funds" for first debit<br>Display "Amount debited. New balance: 000050.00" for second debit | | | Transaction proceeds after rejection |
| TC-019 | Menu navigation - cycle through all options | Balance = 1000.00 | 1. Select option 1 (View Balance)<br>2. Select option 2 (Credit - enter 100)<br>3. Select option 3 (Debit - enter 50)<br>4. Select option 1 (View Balance) | Each operation executes correctly<br>Final balance shows 1050.00<br>Menu reappears after each operation | | | Menu returns after each operation |
| TC-020 | Exit application | Any state | 1. Select option 4 (Exit)<br>2. Verify program termination | Display "Exiting the program. Goodbye!"<br>Program terminates cleanly | | | Normal exit behavior |
| TC-021 | Data persistence - balance after credit | Balance = 1000.00 | 1. Credit 500.00<br>2. Select option 1 to view balance | Balance displayed as 1500.00<br>Persists through menu navigation | | | Balance persists in memory |
| TC-022 | Data persistence - balance after debit | Balance = 1000.00 | 1. Debit 250.00<br>2. Select option 1 to view balance | Balance displayed as 750.00<br>Persists through menu navigation | | | Balance persists in memory |
| TC-023 | Decimal precision - credit with cents | Balance = 1000.00 | 1. Credit 123.45<br>2. View balance | Balance displays as 1123.45 (6 digits + 2 decimals) | | | Decimal format validation |
| TC-024 | Decimal precision - multiple decimals | Balance = 1000.50 | 1. Credit 250.75<br>2. View balance | Balance displays as 1251.25 | | | Compound decimal validation |
| TC-025 | Edge case - zero credit amount | Balance = 1000.00 | 1. Credit 0.00<br>2. View balance | Balance remains 1000.00<br>Message: "Amount credited. New balance: 001000.00" | | | Zero amount handling |
| TC-026 | Edge case - zero debit amount | Balance = 1000.00 | 1. Debit 0.00<br>2. View balance | Balance remains 1000.00<br>Message: "Amount debited. New balance: 001000.00" | | | Zero debit handling |
| TC-027 | Debit - boundary condition (balance - 0.01) | Balance = 500.00 | 1. Debit 499.99<br>2. View balance | Balance displays as 0.01 | | | Minimum remaining balance |
| TC-028 | Credit after depleting balance | Balance = 1000.00 | 1. Debit 1000.00 (balance: 0.00)<br>2. Credit 500.00 (balance: 500.00)<br>3. View balance | Balance shows 500.00 (recovery from zero) | | | Account recovery validation |
| TC-029 | Invalid then valid debit in sequence | Balance = 1000.00 | 1. Attempt debit 1500.00 (insufficient funds - rejected)<br>2. Debit 300.00 (valid)<br>3. View balance | First debit rejected, balance unchanged<br>Second debit successful, balance: 700.00 | | | Validation doesn't affect next transaction |
| TC-030 | Menu loop - return to menu after credit | Operation: Credit 200 | 1. Complete credit transaction<br>2. Verify menu reappears<br>3. Can select another option | Menu displays again allowing next selection | | | Menu continuity after transaction |

---

## Test Coverage Summary

### Functional Areas Covered

#### 1. **Balance Inquiry**
- TC-001: Initial balance verification
- TC-002: Consistent balance retrieval
- TC-021: Balance persistence after credit
- TC-022: Balance persistence after debit

#### 2. **Credit Operations**
- TC-005: Standard credit amount
- TC-006: Minimum credit (0.01)
- TC-007: Large credit amount
- TC-008: Whole number formatting
- TC-009: Multiple sequential credits
- TC-023: Decimal precision in credits
- TC-025: Zero credit amount

#### 3. **Debit Operations**
- TC-010: Standard debit amount
- TC-011: Debit entire balance
- TC-012: Insufficient funds rejection
- TC-013: Excess debit rejection
- TC-014: Precision validation with decimals
- TC-015: Minimum debit (0.01)
- TC-016: Multiple sequential debits
- TC-026: Zero debit amount
- TC-027: Boundary condition debit

#### 4. **Overdraft Protection**
- TC-012: Insufficient funds - rejection
- TC-013: Excess amount validation
- TC-014: Precision-based validation
- TC-018: Transaction after rejection
- TC-029: Invalid then valid debit sequence

#### 5. **Menu Navigation & Validation**
- TC-003: Invalid menu selection (number)
- TC-004: Invalid menu selection (letter)
- TC-019: Cycle through all menu options
- TC-020: Exit application
- TC-030: Menu returns after transactions

#### 6. **Data Persistence & Integration**
- TC-017: Credit then debit sequence
- TC-024: Compound decimal calculations
- TC-028: Account recovery from zero balance

---

## Notes for Node.js Implementation

- All balance amounts should be stored as fixed-point decimals (cents as integers or Decimal library)
- Ensure decimal precision matches COBOL format (PIC 9(6)V99 = max 999999.99)
- Implement input validation for menu choices and transaction amounts
- Maintain transaction sequencing and data integrity across operations
- Consider adding transaction logging for audit trails in modernized version
- All test cases should pass with 100% success rate before production migration

---

## Business Rules Validation

✓ Initial balance must be 1000.00
✓ Credit operations increase balance without limits
✓ Debit operations decrease balance with overdraft protection
✓ Balance cannot go negative
✓ All amounts use 6-digit integer + 2-digit decimal format
✓ Menu-driven interface requires valid selections
✓ Program continues looping until user selects Exit
✓ Balance changes persist through menu navigation
