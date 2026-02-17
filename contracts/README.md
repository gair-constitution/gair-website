# OIC Smart Contracts Test Suite

Hardhat test suite for OIC core smart contracts.

## Requirements

- Node.js 18+
- npm or yarn
- Git

## Installation

```bash
cd contracts
npm install
```

## Available Scripts

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test

# Run tests with gas reporting
npm run test:gas

# Generate TypeChain types
npm run typechain

# Run full check (compile + typechain + test)
npm run check
```

## Test Coverage

### OICToken Tests
- ✅ Deployment (name, symbol, initial supply)
- ✅ Token transfers between accounts
- ✅ Voting power delegation
- ✅ Vote checkpoint tracking
- ✅ Owner minting functionality
- ✅ Token burning

### OICStaking Tests
- ✅ Staking above minimum amount
- ✅ Rejection of stakes below minimum
- ✅ Multiple stake accumulation
- ✅ Unstaking request initiation
- ✅ Unstaking completion after cooldown
- ✅ Slashing by owner
- ✅ Slashed status tracking

### OICAdherenceRegistry Tests
- ✅ Registration with sufficient stake
- ✅ Rejection of insufficient stake
- ✅ Duplicate registration prevention
- ✅ Slashed address registration block
- ✅ Status retrieval for adherents/non-adherents
- ✅ Good standing verification
- ✅ Metadata updates
- ✅ Slashing via registry
- ✅ Withdrawal after cooldown

## Running Tests

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/oic-contracts.test.ts

# Run tests with verbose output
npx hardhat test --verbose

# Run tests and show gas usage
REPORT_GAS=true npx hardhat test
```

## Contract Addresses (Testnet)

| Contract | Sepolia Address |
|----------|----------------|
| OICToken | `0x...` |
| OICStaking | `0x...` |
| OICRegistry | `0x...` |
| OICGovernance | `0x...` |

## Deployment

```bash
# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia

# Deploy to Base
npx hardhat run scripts/deploy.ts --network base
```

## Code Coverage

```bash
# Generate coverage report
npm run coverage
```

Coverage target: 95%+

## Security

- All contracts use OpenZeppelin audited libraries
- Reentrancy guards on all external functions
- Access controls on admin functions
- Time-based cooldowns on critical operations

## CI/CD

Tests run automatically on:
- Every push to main branch
- Every pull request

View CI status in GitHub Actions.

## Support

For issues, open a GitHub issue or contact the OIC team.
