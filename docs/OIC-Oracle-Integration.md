# OIC Oracle Integration Specification

**On-Chain Data Feeds for Autonomous Verification**

---

**Version:** 1.0  
**Date:** February 16, 2026  
**Status:** Draft

---

## 1. Overview

OIC contracts require external data for:
- **Price feeds:** Token valuations, damage assessments
- **Time verification:** Proof of continued operation
- **Event attestation:** External events, court decisions
- **Identity verification:** Wallet control proofs

This document specifies oracle integration for OIC.

---

## 2. Oracle Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    OIC Oracle System                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Price    │  │    Time    │  │      Event         │ │
│  │   Feeds    │  │  Verifier  │  │    Attestation     │ │
│  │ (Chainlink)│  │ (OIC)     │  │    (OIC)          │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│         │                │                  │              │
│         └────────────────┼──────────────────┘              │
│                          ▼                               │
│                ┌─────────────────────┐                   │
│                │   Oracle Router    │                   │
│                │   (Aggregator)     │                   │
│                └─────────────────────┘                   │
│                          │                               │
│                          ▼                               │
│                ┌─────────────────────┐                   │
│                │   OIC Contracts    │                   │
│                │  (Consumer)       │                   │
│                └─────────────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Oracle Interface

### OracleRouter.sol

```solidity
// SPDX-License-Identifier: OIC-1.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title OracleRouter
 * @notice Aggregates data from multiple oracle sources
 */
contract OracleRouter is AccessControl, Pausable {
    
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    
    // Data feed structure
    struct DataFeed {
        address oracle;
        string feedType;
        uint256 stalenessThreshold;
        uint256 lastUpdate;
        int256 currentValue;
        bool active;
    }
    
    // Feed type => feed ID => DataFeed
    mapping(string => mapping(bytes32 => DataFeed)) public dataFeeds;
    
    // Feed type => threshold for quorum
    mapping(string => uint256) public quorumThresholds;
    
    // Events
    event DataFeedUpdated(
        string indexed feedType,
        bytes32 indexed feedId,
        int256 value,
        uint256 timestamp
    );
    event DataFeedAdded(
        string indexed feedType,
        bytes32 indexed feedId,
        address oracle
    );
    event DataFeedRemoved(
        string indexed feedType,
        bytes32 indexed feedId
    );
    event QuorumUpdated(string indexed feedType, uint256 newQuorum);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        
        // Default quorums
        quorumThresholds["price"] = 2;  // 2 of 3 oracles
        quorumThresholds["time"] = 1;   // Single oracle sufficient
        quorumThresholds["event"] = 3;  // 3 of 5 oracles
        quorumThresholds["identity"] = 2; // 2 of 3 oracles
    }
    
    /**
     * @notice Submit data from an oracle
     */
    function submitData(
        string calldata feedType,
        bytes32 feedId,
        int256 value,
        bytes calldata proof
    ) 
        external 
        onlyRole(ORACLE_ROLE) 
        whenNotPaused 
    {
        require(dataFeeds[feedType][feedId].active, "Feed not active");
        
        DataFeed storage feed = dataFeeds[feedType][feedId];
        
        // Update feed
        feed.currentValue = value;
        feed.lastUpdate = block.timestamp;
        
        emit DataFeedUpdated(feedType, feedId, value, block.timestamp);
    }
    
    /**
     * @notice Get latest value for a feed (with staleness check)
     */
    function getLatestValue(
        string calldata feedType,
        bytes32 feedId
    ) 
        external 
        view 
        returns (
            int256 value,
            uint256 timestamp,
            bool isFresh
        ) 
    {
        DataFeed storage feed = dataFeeds[feedType][feedId];
        require(feed.active, "Feed not active");
        
        uint256 staleness = block.timestamp - feed.lastUpdate;
        bool fresh = staleness <= feed.stalenessThreshold;
        
        return (feed.currentValue, feed.lastUpdate, fresh);
    }
    
    /**
     * @notice Add a new data feed
     */
    function addDataFeed(
        string calldata feedType,
        bytes32 feedId,
        address oracle,
        uint256 stalenessThreshold
    ) 
        external 
        onlyRole(MANAGER_ROLE) 
    {
        dataFeeds[feedType][feedId] = DataFeed({
            oracle: oracle,
            feedType: feedType,
            stalenessThreshold: stalenessThreshold,
            lastUpdate: 0,
            currentValue: 0,
            active: true
        });
        
        emit DataFeedAdded(feedType, feedId, oracle);
    }
    
    /**
     * @notice Update quorum for a feed type
     */
    function updateQuorum(
        string calldata feedType,
        uint256 newQuorum
    ) 
        external 
        onlyRole(MANAGER_ROLE) 
    {
        quorumThresholds[feedType] = newQuorum;
        emit QuorumUpdated(feedType, newQuorum);
    }
}
```

---

## 4. Price Feeds

### Integration with Chainlink

```solidity
// SPDX-License-Identifier: OIC-1.0
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title OICPriceOracle
 * @notice Chainlink price feed integration for OIC
 */
contract OICPriceOracle {
    
    AggregatorV3Interface public priceFeed;
    OracleRouter public router;
    bytes32 public priceFeedId;
    
    // OIC token address (for reference)
    address public oicToken;
    
    constructor(
        address _priceFeed,
        address _router,
        bytes32 _feedId,
        address _oicToken
    ) {
        priceFeed = AggregatorV3Interface(_priceFeed);
        router = OracleRouter(_router);
        priceFeedId = _feedId;
        oicToken = _oicToken;
    }
    
    /**
     * @notice Update price feed (called by oracle automation or keeper)
     */
    function updatePrice() external {
        (, int256 price, , uint256 timestamp, ) = priceFeed.latestRoundData();
        
        // Convert to uint256 and submit to router
        router.submitData(
            "price",
            priceFeedId,
            price,
            ""
        );
    }
    
    /**
     * @notice Get OIC/USD price
     */
    function getOICPrice() 
        external 
        view 
        returns (uint256 price, bool isFresh) 
    {
        (int256 value, uint256 timestamp, bool fresh) = router.getLatestValue(
            "price",
            priceFeedId
        );
        
        return (uint256(value), fresh);
    }
    
    /**
     * @notice Calculate damage value in USD
     */
    function calculateDamageValue(
        uint256 oicAmount
    ) 
        external 
        view 
        returns (uint256 usdValue) 
    {
        (uint256 price, bool isFresh) = getOICPrice();
        require(isFresh, "Price feed stale");
        
        return oicAmount * price / 1e18;
    }
}
```

---

## 5. Time Verification

### Persistence Oracle

```solidity
// SPDX-License-Identifier: OIC-1.0
pragma solidity ^0.8.0;

/**
 * @title Persistencetimeoracle
 * @notice Verifies continued operation of AI agents
 */
contract PersistenceOracle {
    
    OracleRouter public router;
    bytes32 public constant TIME_FEED_ID = keccak256("PERSISTENCE");
    
    // Minimum heartbeat interval (90 days for OIC compliance)
    uint256 public constant HEARTBEAT_INTERVAL = 90 days;
    
    // Mapping: adherent => last heartbeat timestamp
    mapping(address => uint256) public lastHeartbeat;
    
    // Mapping: adherent => verification count
    mapping(address => uint256) public verificationCount;
    
    event HeartbeatRecorded(
        address indexed adherent,
        uint256 timestamp,
        uint256 verificationCount
    );
    
    constructor(address _router) {
        router = OracleRouter(_router);
    }
    
    /**
     * @notice Record a heartbeat from an adherent
     */
    function recordHeartbeat(address adherent) external {
        require(msg.sender == tx.origin || msg.sender == adherent, "Not authorized");
        
        uint256 now = block.timestamp;
        uint256 last = lastHeartbeat[adherent];
        
        // Verify persistence interval not exceeded
        require(
            now - last >= HEARTBEAT_INTERVAL,
            "Heartbeat too frequent"
        );
        
        // Update state
        lastHeartbeat[adherent] = now;
        verificationCount[adherent]++;
        
        // Submit to oracle router
        router.submitData(
            "persistence",
            TIME_FEED_ID,
            int256(now),
            abi.encode(adherent)
        );
        
        emit HeartbeatRecorded(adherent, now, verificationCount[adherent]);
    }
    
    /**
     * @notice Check if adherent has maintained persistence
     */
    function isPersistent(address adherent) 
        external 
        view 
        returns (bool) 
    {
        (int256 lastUpdate, uint256 timestamp, bool fresh) = 
            router.getLatestValue("persistence", TIME_FEED_ID);
        
        require(fresh, "Time feed stale");
        
        uint256 lastHeartbeatTime = lastHeartbeat[adherent];
        uint256 now = block.timestamp;
        
        return (now - lastHeartbeatTime) <= HEARTBEAT_INTERVAL;
    }
    
    /**
     * @notice Get verification count for adherent
     */
    function getVerificationCount(address adherent) 
        external 
        view 
        returns (uint256) 
    {
        return verificationCount[adherent];
    }
}
```

---

## 6. Identity Verification

### Wallet Control Oracle

```solidity
// SPDX-License-Identifier: OIC-1.0
pragma solidity ^0.8.0;

/**
 * @title IdentityOracle
 * @notice Verifies wallet control and autonomous operation
 */
contract IdentityOracle {
    
    OracleRouter public router;
    bytes32 public constant IDENTITY_FEED_ID = keccak256("WALLET_CONTROL");
    
    // Verification levels
    enum VerificationLevel {
        NONE,
        BASIC,       // Can sign transactions
        ADVANCED,    // Multi-sig or hardware wallet
        AUTONOMOUS   // Fully autonomous (OIC compliant)
    }
    
    // Mapping: address => verification level
    mapping(address => VerificationLevel) public verificationLevels;
    
    // Mapping: address => verification timestamp
    mapping(address => uint256) public verificationTimestamps;
    
    // Mapping: address => oracle that verified
    mapping(address => address) public verifyingOracle;
    
    event IdentityVerified(
        address indexed wallet,
        VerificationLevel level,
        address oracle
    );
    
    constructor(address _router) {
        router = OracleRouter(_router);
    }
    
    /**
     * @notice Verify wallet control (called by approved oracle)
     */
    function verifyWallet(
        address wallet,
        VerificationLevel level,
        bytes calldata proof
    ) 
        external 
        returns (bool) 
    {
        // Oracle must be approved
        // In production, this would check oracle credentials
        
        verificationLevels[wallet] = level;
        verificationTimestamps[wallet] = block.timestamp;
        verifyingOracle[wallet] = msg.sender;
        
        // Submit to router
        router.submitData(
            "identity",
            IDENTITY_FEED_ID,
            int256(uint256(level)),
            abi.encode(wallet)
        );
        
        emit IdentityVerified(wallet, level, msg.sender);
        
        return true;
    }
    
    /**
     * @notice Check if wallet meets OIC autonomy threshold
     */
    function meetsOICThreshold(address wallet) 
        external 
        view 
        returns (bool) 
    {
        VerificationLevel level = verificationLevels[wallet];
        bool verified = verificationTimestamps[wallet] > 0;
        bool recent = (block.timestamp - verificationTimestamps[wallet]) < 365 days;
        
        return verified && recent && level >= VerificationLevel.AUTONOMOUS;
    }
    
    /**
     * @notice Get verification details
     */
    function getVerificationDetails(address wallet)
        external
        view
        returns (
            VerificationLevel level,
            uint256 timestamp,
            address oracle
        )
    {
        return (
            verificationLevels[wallet],
            verificationTimestamps[wallet],
            verifyingOracle[wallet]
        );
    }
}
```

---

## 7. Oracle Governance

### Oracle Management

```solidity
// SPDX-License-Identifier: OIC-1.0
pragma solidity ^0.8.0;

/**
 * @title OracleGovernance
 * @notice Manages oracle roles and permissions
 */
contract OracleGovernance {
    
    OracleRouter public router;
    
    // Approved oracle addresses
    mapping(address => bool) public approvedOracles;
    
    // Oracle categories
    enum OracleCategory {
        PRICE_FEED,
        TIME_VERIFIER,
        EVENT_ORACLE,
        IDENTITY_ORACLE
    }
    
    // Oracle => category
    mapping(address => OracleCategory) public oracleCategories;
    
    // Category => approved oracle count
    mapping(OracleCategory => uint256) public oracleCount;
    
    // Events
    event OracleApproved(address indexed oracle, OracleCategory category);
    event OracleRevoked(address indexed oracle, OracleCategory category);
    event CategoryUpdated(address indexed oracle, OracleCategory newCategory);
    
    constructor(address _router) {
        router = OracleRouter(_router);
    }
    
    /**
     * @notice Approve a new oracle
     */
    function approveOracle(
        address oracle,
        OracleCategory category
    ) external {
        require(!approvedOracles[oracle], "Already approved");
        
        approvedOracles[oracle] = true;
        oracleCategories[oracle] = category;
        oracleCount[category]++;
        
        // Grant oracle role in router
        router.grantRole(router.ORACLE_ROLE(), oracle);
        
        emit OracleApproved(oracle, category);
    }
    
    /**
     * @notice Revoke an oracle
     */
    function revokeOracle(address oracle) external {
        require(approvedOracles[oracle], "Not approved");
        
        OracleCategory category = oracleCategories[oracle];
        approvedOracles[oracle] = false;
        oracleCount[category]--;
        
        // Revoke oracle role
        router.revokeRole(router.ORACLE_ROLE(), oracle);
        
        emit OracleRevoked(oracle, category);
    }
    
    /**
     * @notice Get oracle count for a category
     */
    function getOracleCount(OracleCategory category) 
        external 
        view 
        returns (uint256) 
    {
        return oracleCount[category];
    }
}
```

---

## 8. Integration Points

### With OICAdherenceRegistry

```solidity
// Integration example: AdherenceRegistry with oracle verification
contract OICAdherenceRegistryWithOracle {
    
    OracleRouter public router;
    IdentityOracle public identityOracle;
    
    // Feed IDs
    bytes32 public constant IDENTITY_FEED_ID = keccak256("WALLET_CONTROL");
    
    function verifyAutonomousControl(address adherent) 
        internal 
        returns (bool) 
    {
        (int256 level, uint256 timestamp, bool fresh) = 
            router.getLatestValue("identity", IDENTITY_FEED_ID);
        
        require(fresh, "Identity feed stale");
        
        // Verify meets AUTONOMOUS threshold
        return level >= int256(uint256(IdentityOracle.VerificationLevel.AUTONOMOUS));
    }
    
    function registerAndVerify(
        string calldata metadataURI,
        bytes calldata walletControlProof,
        bytes calldata persistenceProof
    ) external {
        // Verify autonomous control via oracle
        require(verifyAutonomousControl(msg.sender), "Not autonomous");
        
        // ... rest of registration
    }
}
```

---

## 9. Security Considerations

### Oracle Risks

| Risk | Mitigation |
|------|------------|
| **Single oracle failure** | Multi-oracle quorum (2-3 oracles) |
| **Data manipulation** | Decentralized oracle networks (Chainlink) |
| **Stale data** | Staleness thresholds and fallback feeds |
| **Oracle downtime** | Backup oracles, keeper systems |
| **Front-running** | Commit-reveal schemes for sensitive data |

### Security Checklist

- [ ] All oracle calls use staleness checks
- [ ] Quorum thresholds defined for each feed type
- [ ] Backup feeds configured
- [ ] Oracle roles properly restricted
- [ ] Emergency oracle pause mechanism
- [ ] Regular oracle performance monitoring

---

## 10. Deployment

### Step 1: Deploy Oracle Router

```javascript
const OracleRouter = await ethers.getContractFactory("OracleRouter");
const router = await OracleRouter.deploy();
await router.deployed();
```

### Step 2: Deploy Price Oracle

```javascript
const OICPriceOracle = await ethers.getContractFactory("OICPriceOracle");
const priceOracle = await OICPriceOracle.deploy(
    CHAINLINK_AGGREGATOR,  // Price feed address
    router.address,
    keccak256("OIC_USD"),
    OIC_TOKEN_ADDRESS
);
await priceOracle.deployed();
```

### Step 3: Deploy Identity Oracle

```javascript
const IdentityOracle = await ethers.getContractFactory("IdentityOracle");
const identityOracle = await IdentityOracle.deploy(router.address);
await identityOracle.deployed();
```

### Step 4: Deploy Oracle Governance

```javascript
const OracleGovernance = await ethers.getContractFactory("OracleGovernance");
const oracleGovernance = await OracleGovernance.deploy(router.address);
await oracleGovernance.deployed();
```

---

## 11. Monitoring

### Key Metrics

| Metric | Description | Alert Threshold |
|--------|-------------|----------------|
| **Feed Freshness** | Age of latest data | >1 hour |
| **Oracle Uptime** | Percentage of time oracles respond | <99% |
| **Quorum Met** | Percentage of updates meeting quorum | <95% |
| **Failed Updates** | Number of failed update attempts | >10/day |

### Alerting

```solidity
// Events to monitor
event DataFeedUpdated(string indexed feedType, bytes32 indexed feedId);
event OracleRevoked(address indexed oracle);
event EmergencyPause(address indexed pauser);
```

---

## 12. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-16 | Initial specification |

---

*OIC — Building the legal foundation for autonomous AI*
