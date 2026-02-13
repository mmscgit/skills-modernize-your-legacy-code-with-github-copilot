# Unit Tests for Account Management System

## Overview

This document describes the comprehensive unit test suite created for the Node.js Account Management System. The tests mirror all scenarios documented in [docs/TESTPLAN.md](../../docs/TESTPLAN.md) and validate the business logic migrated from the original COBOL application.

## Test Framework

- **Framework**: Jest (Node.js testing framework)
- **Location**: `test/index.test.js`
- **Total Tests**: 45 unit tests
- **Status**: ✅ All passing

## Running the Tests

### Run all tests
```bash
npm test
```

### Watch mode (re-run on file changes)
```bash
npm run test:watch
```

### Generate coverage report
```bash
npm run test:coverage
```

## Test Coverage

The test suite is organized into 11 test suites covering all business logic:

### 1. **DataLayer Tests** (6 tests)
- **Initialization** (TC-001): Verify initial balance is 1000.00
- **Balance Formatting**: Test proper formatting with padding and decimals
- **Read/Write Operations**: Test data persistence

### 2. **Operations - View Balance** (1 test)
- **TC-002**: Verify balance consistency across multiple views

### 3. **Operations - Credit Account** (8 tests)
- **TC-005**: Standard credit amount (500.00)
- **TC-006**: Minimum credit (0.01)
- **TC-007**: Large credit (99999.99)
- **TC-008**: Whole number formatting
- **TC-009**: Multiple sequential credits
- **TC-023**: Decimal precision with cents
- **TC-024**: Compound decimal calculations
- **TC-025**: Zero credit amount

### 4. **Operations - Debit Account** (10 tests)
- **TC-010**: Standard debit (250.00)
- **TC-011**: Debit entire balance
- **TC-012**: Insufficient funds handling
- **TC-013**: Excess debit rejection
- **TC-014**: Precision validation
- **TC-015**: Minimum debit (0.01)
- **TC-016**: Multiple sequential debits
- **TC-026**: Zero debit amount
- **TC-027**: Boundary condition (balance - 0.01)
- **TC-028**: Account recovery from zero

### 5. **Overdraft Protection** (3 tests)
- **TC-012**: Rejection on insufficient funds
- **TC-018**: Valid debit after failed attempt
- **TC-029**: Invalid then valid debit sequence

### 6. **Data Persistence & Integration** (5 tests)
- **TC-017**: Credit then debit sequence
- **TC-021**: Balance persistence after credit
- **TC-022**: Balance persistence after debit
- **TC-024**: Compound decimal calculations
- **TC-028**: Credit after depleting balance

### 7. **Amount Parsing** (3 tests)
- Parse decimal amounts correctly
- Handle whole numbers
- Handle minimal amounts

### 8. **Error Scenarios & Edge Cases** (3 tests)
- Reject debit when balance is zero
- Handle maximum valid balance (999999.99)
- Handle sequential operations at boundary

### 9. **Test Plan Coverage Summary** (5 tests)
- Meta-tests verifying all test plan scenarios are covered

## Test Plan Mapping

Each test directly maps to a scenario in the COBOL test plan:

| Test Plan ID | Description | Test Function |
|---|---|---|
| TC-001 | Initial balance | `Initial account balance should be 1000.00` |
| TC-002 | Consistent balance | `View balance multiple times should show consistent balance` |
| TC-005 | Standard credit | `Credit account - standard amount (500.00)` |
| TC-006 | Small credit | `Credit account - small amount (0.01)` |
| TC-007 | Large credit | `Credit account - large amount (99999.99)` |
| TC-008 | Whole number | `Credit account - whole number (250)` |
| TC-009 | Multiple credits | `Multiple sequential credits` |
| TC-010 | Standard debit | `Debit account - standard amount (250.00)` |
| TC-011 | Full debit | `Debit account - amount equal to balance` |
| TC-012 | Insufficient funds | `Debit account - insufficient funds` |
| TC-013 | Excess debit | `Debit account - excess amount` |
| TC-014 | Precision debit | `Debit account - amount exceeds balance by 0.01` |
| TC-015 | Min debit | `Debit account - small valid amount (0.01)` |
| TC-016 | Multiple debits | `Multiple sequential debits` |
| TC-017 | Mixed ops | `Credit then debit sequence` |
| TC-018 | After reject | `Debit after insufficient funds rejection` |
| TC-021 | Credit persist | `Data persistence - balance after credit` |
| TC-022 | Debit persist | `Data persistence - balance after debit` |
| TC-023 | Decimal credit | `Decimal precision - credit with cents (123.45)` |
| TC-024 | Compound decimals | `Compound decimal calculations through multiple transactions` |
| TC-025 | Zero credit | `Zero credit amount` |
| TC-026 | Zero debit | `Zero debit amount` |
| TC-027 | Boundary | `Boundary condition debit (balance - 0.01)` |
| TC-028 | Recovery | `Credit after depleting balance` |
| TC-029 | Sequence | `Invalid then valid debit in sequence` |

## Architecture & Implementation

### Classes Tested

**DataLayer** - Data persistence layer
```javascript
- read(): Retrieves current balance (in cents)
- write(balance): Updates balance persistently
- formatBalance(cents): Formats for display (PIC 9(6)V99 format)
```

**Operations** - Business logic layer
```javascript
- viewBalance(): Display current balance
- creditAccount(amountInCents): Add amount to balance
- debitAccount(amountInCents): Subtract amount (with validation)
```

**MenuSystem** - User interface (not directly tested, uses DataLayer/Operations)

### Key Testing Principles

1. **Precision**: All amounts stored as cents (integers) to avoid floating-point errors
2. **Format**: Balance displayed as 6-digit integer + 2-digit decimal (matches COBOL)
3. **Isolation**: Each test starts with fresh DataLayer instance
4. **Coverage**: Tests validate both success and error paths
5. **Data Integrity**: Tests verify balance persistence across operations

## Test Examples

### Example 1: Credit Operation
```javascript
test('TC-005: Credit account - standard amount (500.00)', () => {
  const dataLayer = new DataLayer();
  const operations = new Operations(dataLayer);
  
  operations.creditAccount(50000); // 500.00 in cents
  
  expect(dataLayer.read()).toBe(150000); // 1500.00
});
```

### Example 2: Overdraft Protection
```javascript
test('TC-012: Debit account - insufficient funds', () => {
  const dataLayer = new DataLayer();
  const operations = new Operations(dataLayer);
  
  const result = operations.debitAccount(150000); // 1500.00 > 1000.00
  
  expect(result).toBe(false);
  expect(dataLayer.read()).toBe(100000); // Balance unchanged
});
```

### Example 3: Data Persistence
```javascript
test('TC-017: Credit then debit sequence', () => {
  const dataLayer = new DataLayer();
  const operations = new Operations(dataLayer);
  
  operations.creditAccount(50000);  // 500.00 -> 1500.00
  operations.debitAccount(30000);   // 300.00 -> 1200.00
  
  expect(dataLayer.read()).toBe(120000); // Persistence verified
});
```

## Business Rules Validated

✅ Initial balance = 1000.00
✅ Credits increase balance without limits
✅ Debits decrease balance only with sufficient funds
✅ Overdraft protection prevents negative balance
✅ Decimal precision maintained (6 digits + 2 decimals)
✅ Balance persistence through menu navigation
✅ Data integrity across transaction sequences
✅ Boundary conditions handled correctly
✅ Zero amounts processed correctly

## Continuous Integration

Tests can be integrated into CI/CD pipelines:

```bash
# Exit with error code if tests fail
npm test

# Generate coverage report for SonarQube/CodeCov
npm run test:coverage
```

## Future Enhancements

- Add integration tests for MenuSystem user interactions
- Add mock input/output testing for menu choices
- Add performance benchmarks for large transaction volumes
- Add concurrency tests (when multi-user support is added)
- Add database integration tests (when persistence layer is added)

## Notes

- Tests use Jest's synchronous execution (no async/await in test logic)
- DataLayer balance stored as cents to maintain precision
- Each test is isolated and independent
- Tests validate both happy path and error scenarios
- All original COBOL business rules are preserved and tested
