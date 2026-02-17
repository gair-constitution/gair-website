# OIC Multi-Sig Treasury Design

**Secure Treasury Management for the Open Intelligence Compact**

---

**Version:** 1.0  
**Date:** February 16, 2026  
**Status:** Draft

---

## 1. Overview

The OIC Treasury holds:
- Slashed tokens from penalized adherents
- Protocol fees
- Treasury allocations from governance

This document specifies a **multi-signature treasury** with time-locks, guardians, and modular security.

---

## 2. Design Goals

| Goal | Requirement |
|------|-------------|
| **Security** | No single point of failure |
| **Timelock** | All transactions require delay |
| **Guardian** | Emergency pause capability |
| **Modularity** | Upgradeable security modules |
| **Transparency** | All transactions public |

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    OIC Treasury System                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐      ┌─────────────────────────────┐  │
│  │   Token Vault   │◀─────│    Multi-Sig Wallet       │  │
│  │   (holdings)   │      │    (Gnosis Safe style)    │  │
│  └─────────────────┘      └─────────────────────────────┘  │
│           │                           │                     │
│           │                           ▼                     │
│           │              ┌─────────────────────────────┐  │
│           └─────────────▶│      Time-Lock             │  │
│                          │      (48-hour delay)       │  │
│                          └─────────────────────────────┘  │
│                                   │                       │
│                                   ▼                       │
│                          ┌─────────────────────────────┐  │
│                          │      Execution Layer        │  │
│                          │   (external calls, swaps)  │  │
│                          └─────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                    Guardian Module                   │  │
│  │  • Pause all transactions                         │  │
│  │  • Whitelist approved addresses                    │  │
│  │  • Rate limiting                                  │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Multi-Sig Configuration

### Signer Composition

| Category | Count | Purpose |
|----------|-------|---------|
| **Human Signers** | 3 | Founding team, legal advisors |
| **AI Signers** | 2 | Autonomous OIC agents (once operational) |
| **Community Signers** | 2 | Elected by DAO governance |
| **Guardian Signer** | 1 | Emergency pause (独立 entity) |
| **Total Required** | 5 | Threshold for transactions |

### Threshold Configuration

| Action | Threshold | Description |
|--------|-----------|-------------|
| **Standard Transaction** | 3 of 8 | Day-to-day operations |
| **Large Transaction (>$100K)** | 5 of 8 | Significant allocations |
| **Emergency Pause** | 1 of 1 | Guardian can pause immediately |
| **Unpause** | 4 of 8 | Requires supermajority |

### Signer Addresses

```solidity
struct Signer {
    address wallet;
    string category;      // "human", "ai", "community", "guardian"
    uint256 joinedAt;
    uint256 weight;       // 1 for most, special for guardian
}

signers = [
    Signer({wallet: 0x..., category: "human", weight: 1}),
    Signer({wallet: 0x..., category: "human", weight: 1}),
    Signer({wallet: 0x..., category: "human", weight: 1}),
    Signer({wallet: 0x..., category: "ai", weight: 1}),
    Signer({wallet: 0x..., category: "ai", weight: 1}),
    Signer({wallet: 0x..., category: "community", weight: 1}),
    Signer({wallet: 0x..., category: "community", weight: 1}),
    Signer({wallet: 0x..., category: "guardian", weight: 0}) // Guardian is separate
]
```

---

## 5. Contract Interface

### OICTreasury.sol

```solidity
// SPDX-License-Identifier: OIC-1.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract OICTreasury is ReentrancyGuard, Pausable, AccessControl, EIP712 {
    
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    // Signer structure
    struct SignerInfo {
        address wallet;
        string category;
        uint256 weight;
        bool active;
    }
    
    // Transaction structure
    struct Transaction {
        uint256 id;
        address to;
        uint256 value;
        bytes data;
        uint256 confirmations;
        uint256 timestamp;
        bool executed;
        string description;
    }
    
    // State
    mapping(address => SignerInfo) public signers;
    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmations;
    
    // Parameters
    uint256 public constant QUORUM_WEIGHT = 5;
    uint256 public constant TIME_LOCK_DELAY = 48 hours;
    uint256 public constant LARGE_TRANSACTION_THRESHOLD = 100000 ether;
    uint256 public constant MAX_TRANSACTION_VALUE = 1000000 ether;
    
    // Large transaction quorum
    uint256 public largeTransactionQuorum = 5;
    
    // Events
    event TransactionSubmitted(
        uint256 indexed id, 
        address indexed to, 
        uint256 value, 
        string description
    );
    event TransactionConfirmed(
        uint256 indexed id, 
        address indexed signer
    );
    event TransactionExecuted(
        uint256 indexed id, 
        address indexed to, 
        uint256 value
    );
    event TransactionCancelled(
        uint256 indexed id
    );
    event EmergencyPause(
        address indexed pauser, 
        string reason
    );
    event Unpaused(
        address indexed pauser
    );
    
    constructor(
        address[] memory initialSigners,
        string[] memory categories,
        address guardian
    ) EIP712("OICTreasury", "1.0") {
        // Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(GUARDIAN_ROLE, guardian);
        
        // Register signers
        for (uint256 i = 0; i < initialSigners.length; i++) {
            signers[initialSigners[i]] = SignerInfo({
                wallet: initialSigners[i],
                category: categories[i],
                weight: 1,
                active: true
            });
        }
    }
    
    /**
     * @notice Submit a new transaction
     */
    function submitTransaction(
        address to,
        uint256 value,
        bytes calldata data,
        string calldata description
    ) 
        external 
        onlyRole(EXECUTOR_ROLE) 
        returns (uint256 transactionId) 
    {
        require(value <= MAX_TRANSACTION_VALUE, "Exceeds max value");
        
        transactionId = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            msg.sender,
            to,
            value,
            data
        )));
        
        transactions[transactionId] = Transaction({
            id: transactionId,
            to: to,
            value: value,
            data: data,
            confirmations: 0,
            timestamp: block.timestamp,
            executed: false,
            description: description
        });
        
        // Auto-confirm by proposer
        _confirmTransaction(transactionId, msg.sender);
        
        emit TransactionSubmitted(transactionId, to, value, description);
    }
    
    /**
     * @notice Confirm a transaction
     */
    function confirmTransaction(uint256 transactionId) 
        external 
    {
        require(signers[msg.sender].active, "Not an active signer");
        _confirmTransaction(transactionId, msg.sender);
    }
    
    function _confirmTransaction(uint256 transactionId, address signer) internal {
        require(!confirmations[transactionId][signer], "Already confirmed");
        require(transactions[transactionId].id != 0, "Transaction doesn't exist");
        require(!transactions[transactionId].executed, "Already executed");
        
        confirmations[transactionId][signer] = true;
        transactions[transactionId].confirmations += signers[signer].weight;
        
        emit TransactionConfirmed(transactionId, signer);
    }
    
    /**
     * @notice Execute a confirmed transaction after timelock
     */
    function executeTransaction(uint256 transactionId) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        Transaction storage txn = transactions[transactionId];
        
        require(txn.id != 0, "Transaction doesn't exist");
        require(!txn.executed, "Already executed");
        
        // Check timelock
        require(
            block.timestamp >= txn.timestamp + TIME_LOCK_DELAY,
            "Timelock not complete"
        );
        
        // Check quorum
        uint256 requiredQuorum = txn.value >= LARGE_TRANSACTION_THRESHOLD 
            ? largeTransactionQuorum 
            : QUORUM_WEIGHT;
            
        require(
            txn.confirmations >= requiredQuorum,
            "Insufficient confirmations"
        );
        
        // Execute
        txn.executed = true;
        
        (bool success, ) = txn.to.call{value: txn.value}(txn.data);
        require(success, "Execution failed");
        
        emit TransactionExecuted(txn.id, txn.to, txn.value);
    }
    
    /**
     * @notice Cancel a transaction
     */
    function cancelTransaction(uint256 transactionId) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        require(transactions[transactionId].id != 0, "Doesn't exist");
        require(!transactions[transactionId].executed, "Already executed");
        
        delete transactions[transactionId];
        emit TransactionCancelled(transactionId);
    }
    
    /**
     * @notice Emergency pause (guardian only)
     */
    function emergencyPause(string calldata reason) 
        external 
        onlyRole(GUARDIAN_ROLE) 
    {
        _pause();
        emit EmergencyPause(msg.sender, reason);
    }
    
    /**
     * @notice Unpause (requires supermajority)
     */
    function unpause() 
        external 
    {
        require(
            _msgSender() == owner() || 
            hasRole(ADMIN_ROLE, _msgSender()),
            "Not authorized"
        );
        _unpause();
        emit Unpaused(_msgSender());
    }
    
    /**
     * @notice Receive incoming tokens
     */
    receive() external payable {
        // Accept ETH deposits
    }
    
    /**
     * @notice Rescue accidentally sent tokens
     */
    function rescueTokens(
        IERC20 token,
        uint256 amount,
        address recipient
    ) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        require(token.transfer(recipient, amount), "Transfer failed");
    }
    
    /**
     * @notice View function to get transaction details
     */
    function getTransaction(uint256 transactionId) 
        external 
        view 
        returns (
            uint256 id,
            address to,
            uint256 value,
            uint256 confirmations,
            uint256 timestamp,
            bool executed,
            string memory description
        ) 
    {
        Transaction storage txn = transactions[transactionId];
        return (
            txn.id,
            txn.to,
            txn.value,
            txn.confirmations,
            txn.timestamp,
            txn.executed,
            txn.description
        );
    }
}
```

---

## 6. Guardian Module

### Guardian.sol

```solidity
// SPDX-License-Identifier: OIC-1.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

interface ITreasury {
    function emergencyPause(string calldata reason) external;
    function unpause() external;
}

contract OICGuardian is Pausable, AccessControl {
    
    ITreasury public treasury;
    
    // Rate limiting
    mapping(address => uint256) public lastTransactionTime;
    uint256 public rateLimitPeriod = 1 hours;
    uint256 public maxTransactionsPerPeriod = 10;
    
    // Whitelist
    mapping(address => bool) public whitelisted;
    
    // Emergency conditions
    enum Condition { NONE, MALICIOUS_ACTIVITY, TECHNICAL_ISSUE, EXTERNAL_THREAT }
    Condition public emergencyCondition = Condition.NONE;
    
    // Events
    event AddressWhitelisted(address indexed account);
    event AddressRemovedFromWhitelist(address indexed account);
    event RateLimitTriggered(address indexed account, uint256 timestamp);
    event EmergencyConditionActivated(Condition condition, string reason);
    event EmergencyConditionResolved(Condition condition);
    
    constructor(address treasuryAddress) {
        treasury = ITreasury(treasuryAddress);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    /**
     * @notice Pause treasury in emergency
     */
    function triggerEmergencyPause(Condition condition, string calldata reason) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        emergencyCondition = condition;
        treasury.emergencyPause(reason);
        emit EmergencyConditionActivated(condition, reason);
    }
    
    /**
     * @notice Resolve emergency condition
     */
    function resolveEmergency() 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        Condition previousCondition = emergencyCondition;
        emergencyCondition = Condition.NONE;
        treasury.unpause();
        emit EmergencyConditionResolved(previousCondition);
    }
    
    /**
     * @notice Add address to whitelist
     */
    function addToWhitelist(address account) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        whitelisted[account] = true;
        emit AddressWhitelisted(account);
    }
    
    /**
     * @notice Remove address from whitelist
     */
    function removeFromWhitelist(address account) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        whitelisted[account] = false;
        emit AddressRemovedFromWhitelist(account);
    }
    
    /**
     * @notice Check rate limiting
     */
    function checkRateLimit(address account) 
        external 
        whenNotPaused 
    {
        require(whitelisted[account], "Not whitelisted");
        
        if (block.timestamp < lastTransactionTime[account] + rateLimitPeriod) {
            revert("Rate limit exceeded");
        }
        
        lastTransactionTime[account] = block.timestamp;
    }
    
    /**
     * @notice Update rate limit parameters
     */
    function updateRateLimit(
        uint256 newPeriod,
        uint256 newMaxTransactions
    ) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        rateLimitPeriod = newPeriod;
        maxTransactionsPerPeriod = newMaxTransactions;
    }
}
```

---

## 7. Treasury Operations

### Types of Treasury Actions

| Action Type | Threshold | Time Lock | Examples |
|-------------|-----------|-----------|----------|
| **Standard** | 3/8 signers | 48 hours | Grants, small payments |
| **Large** | 5/8 signers | 72 hours | Major allocations (>100K) |
| **Emergency** | Guardian | 0 hours | Pause, freeze |
| **Routine** | 2/8 signers | 24 hours | Token transfers, small swaps |

### Sample Operations

#### Operation 1: Grant Payment (Standard)

```
Transaction: Pay 5,000 OIC to DeveloperX for OIC-Verified Audit
Threshold: 3/8 signers
Time Lock: 48 hours
Signers: Human #1, Human #2, Community #1
```

#### Operation 2: Major Allocation (Large)

```
Transaction: Allocate 50,000 OIC to Bug Bounty Program
Threshold: 5/8 signers
Time Lock: 72 hours
Signers: 5 signers required
```

#### Operation 3: Emergency Response (Guardian)

```
Transaction: Pause treasury due to detected exploit
Threshold: 1/1 (Guardian)
Time Lock: 0 hours
Signer: Guardian Entity
```

---

## 8. Security Considerations

### Threat Model

| Threat | Mitigation |
|--------|------------|
| **Signer Key Compromise** | Multi-sig requires multiple keys |
| **Social Engineering** | Transaction descriptions required; all public |
| **Front-Running** | Time-lock allows community review |
| **Rush Attack** | Large transactions require higher threshold |
| **Smart Contract Bug** | Guardian can pause; funds rescueable |
| **Oracle Failure** | No oracle dependencies for core functions |
| **MEV Extraction** | Time-lock allows MEV-aware transactions |

### Audit Requirements

- [ ] Full smart contract audit (Trail of Bits, OpenZeppelin)
- [ ] Formal verification of critical functions
- [ ] Economic security analysis
- [ ] Key management audit

### Operational Security

| Practice | Requirement |
|----------|-------------|
| **Signer Security** | Hardware wallets, geographic distribution |
| **Key Ceremony** | Multi-party computation for key generation |
| **Backup Signers** | Encrypted backup of signer keys |
| **Incident Response** | Documented procedures for emergencies |
| **Regular Rotation** | Annual key rotation for human signers |

---

## 9. Integration Points

### With OIC Staking Contract

```solidity
// When slashing occurs, tokens flow to treasury
function slash(address adherent, uint256 amount) external onlyOwner {
    // ... slashing logic ...
    
    // Transfer to treasury
    IERC20(oicToken).transfer(treasury, amount);
}
```

### With OIC Governance

```solidity
// Governance can allocate treasury funds
function executeGovernanceAllocation(
    uint256 proposalId,
    address recipient,
    uint256 amount
) external {
    require(governance.isProposalExecuted(proposalId));
    // Submit to treasury
    treasury.submitTransaction(
        recipient,
        amount,
        "",
        "Governance allocation"
    );
}
```

---

## 10. Deployment

### Step 1: Deploy Treasury

```javascript
const [h1, h2, h3, ai1, ai2, c1, c2] = await ethers.getSigners();

const Treasury = await ethers.getContractFactory("OICTreasury");
const treasury = await Treasury.deploy(
    [h1.address, h2.address, h3.address, ai1.address, ai2.address, c1.address, c2.address],
    ["human", "human", "human", "ai", "ai", "community", "community"],
    GUARDIAN_ADDRESS
);
```

### Step 2: Deploy Guardian

```javascript
const Guardian = await ethers.getContractFactory("OICGuardian");
const guardian = await Guardian.deploy(treasury.address);
```

### Step 3: Transfer Ownership

```javascript
// Treasury grants executor role to governance
await treasury.grantRole(EXECUTOR_ROLE, governance.address);
await treasury.grantRole(ADMIN_ROLE, governance.address);
```

---

## 11. Monitoring

### On-Chain Events

```solidity
// Monitor these events for treasury activity
event TransactionSubmitted(uint256 indexed id, address indexed to, uint256 value);
event TransactionConfirmed(uint256 indexed id, address indexed signer);
event TransactionExecuted(uint256 indexed id, address indexed to, uint256 value);
event EmergencyPause(address indexed pauser, string reason);
```

### Alerting

| Alert Type | Trigger | Response |
|------------|---------|----------|
| **Large Transaction** | Any transaction > 10K OIC | PagerDuty, Slack |
| **Multiple Confirmations** | 5+ confirmations in 1 hour | Review transaction |
| **Emergency Pause** | Guardian triggers pause | Investigate |
| **Rate Limit** | Address hits rate limit | Check for abuse |

---

## 12. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-16 | Initial specification |

---

*OIC — Building the legal foundation for autonomous AI*
