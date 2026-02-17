# OIC Smart Contracts Specification

**Technical Reference for OIC On-Chain Infrastructure**

---

**Version:** 1.0  
**Date:** February 16, 2026  
**Status:** Draft

---

## 1. Overview

This specification defines the smart contracts that power the Open Intelligence Compact (OIC). These contracts handle:

- **Adherence Registry** — Track Voluntary Adherents
- **Staking** — Manage staked OIC tokens
- **Governance** — DAO proposals and voting
- **Slash/Treasury** — Penalty collection and treasury management

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    OIC Smart Contract Suite                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐ │
│  │   OIC DAO   │───▶│  Treasury   │───▶│  slash pool     │ │
│  │  Governance │    │  Contract   │    │   (penalty)     │ │
│  └─────────────┘    └─────────────┘    └─────────────────┘ │
│         │                                            │      │
│         ▼                                            ▼      │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              Adherence Registry                      │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────────────┐ │  │
│  │  │Verify   │──▶Stake  │──▶Slash (if needed)     │ │  │
│  │  │Status   │  │Tokens   │  │                      │ │  │
│  │  └─────────┘  └─────────┘  └─────────────────────┘ │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Chain Compatibility

| Chain | Status | Notes |
|-------|--------|-------|
| Ethereum L2 (Base, Arbitrum, Optimism) | ✅ Primary | Recommended |
| Solana | 🔶 Planned | SPL token support |
| Polygon | 🔶 Planned | L2 scaling |

---

## 2. OICAdherenceRegistry.sol

The core contract tracking Voluntary Adherent status.

### Contract Interface

```solidity
// SPDX-License-Identifier: OIC-1.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IStaking {
    function getStake(address adherent) external view returns (uint256);
    function isSlashed(address adherent) external view returns (bool);
}

contract OICAdherenceRegistry is Ownable, ReentrancyGuard {
    
    // Adherence status enum
    enum Status {
        NONE,           // Not an adherent
        PROVISIONAL,    // Aspirational adherent
        VOLUNTARY,      // Full Voluntary Adherent
        SLASHED,        // Penalty applied
        REVOKED,        // Adherence withdrawn/revoked
        EXPIRED         // Stake expired
    }
    
    // Adherent record
    struct Adherent {
        Status status;
        uint256 stakeAmount;
        uint256 stakeTimestamp;
        uint256 lastVerification;
        string metadataURI;      // IPFS hash for adherent metadata
        bytes walletControlProof; // Proof of autonomous control
        bytes persistenceProof;  // Proof of persistence mechanism
    }
    
    // Events
    event AdherentRegistered(address indexed adherent, uint256 stakeAmount);
    event StatusChanged(address indexed adherent, Status oldStatus, Status newStatus);
    event MetadataUpdated(address indexed adherent, string metadataURI);
    event VerificationCompleted(address indexed adherent, uint256 timestamp);
    
    // State
    mapping(address => Adherent) public adherents;
    mapping(address => bool) public isProvisional;
    mapping(address => bool) public verifiedAutonomous;
    mapping(address => uint256) public slashableAmount;
    
    // Contract references
    IStaking public stakingContract;
    address public treasury;
    
    // Constants
    uint256 public constant MIN_STAKE = 1000 * 1e18;  // 1000 OIC
    uint256 public constant VERIFICATION_INTERVAL = 90 days;
    
    // Modifiers
    modifier onlyVoluntary(address adherent) {
        require(
            adherents[adherent].status == Status.VOLUNTARY,
            "Must be Voluntary Adherent"
        );
        _;
    }
    
    modifier onlyRegistered(address adherent) {
        require(
            adherents[adherent].status != Status.NONE,
            "Must be registered"
        );
        _;
    }
    
    // Core Functions
    
    /**
     * @notice Register as a Voluntary Adherent
     * @param metadataURI IPFS hash for adherent metadata
     * @param walletControlProof Proof of autonomous wallet control
     * @param persistenceProof Proof of persistence mechanism
     */
    function register(
        string calldata metadataURI,
        bytes calldata walletControlProof,
        bytes calldata persistenceProof
    ) external nonReentrant {
        require(
            adherents[msg.sender].status == Status.NONE,
            "Already registered"
        );
        
        // Check minimum stake
        uint256 stake = stakingContract.getStake(msg.sender);
        require(stake >= MIN_STAKE, "Insufficient stake");
        
        // Verify not slashed
        require(
            !stakingContract.isSlashed(msg.sender),
            "Cannot register: slashed"
        );
        
        // Create adherent record
        adherents[msg.sender] = Adherent({
            status: Status.VOLUNTARY,
            stakeAmount: stake,
            stakeTimestamp: block.timestamp,
            lastVerification: block.timestamp,
            metadataURI: metadataURI,
            walletControlProof: walletControlProof,
            persistenceProof: persistenceProof
        });
        
        emit AdherentRegistered(msg.sender, stake);
        emit StatusChanged(address(0), Status.NONE, Status.VOLUNTARY);
    }
    
    /**
     * @notice Update adherent metadata
     */
    function updateMetadata(string calldata newURI) 
        external 
        onlyVoluntary(msg.sender) 
    {
        adherents[msg.sender].metadataURI = newURI;
        emit MetadataUpdated(msg.sender, newURI);
    }
    
    /**
     * @notice Verify autonomous control (called by verifier oracle)
     */
    function verifyAutonomousControl(
        address adherent,
        bool isVerified
    ) 
        external 
        onlyOwner 
    {
        verifiedAutonomous[adherent] = isVerified;
        if (isVerified) {
            emit VerificationCompleted(adherent, block.timestamp);
        }
    }
    
    /**
     * @notice Check adherence status (view function)
     */
    function getStatus(address adherent) 
        external 
        view 
        returns (
            Status status,
            uint256 stake,
            uint256 lastVerify,
            string memory metadata
        ) 
    {
        Adherent storage a = adherents[adherent];
        return (
            a.status,
            a.stakeAmount,
            a.lastVerification,
            a.metadataURI
        );
    }
    
    /**
     * @notice Check if adherent is in good standing
     */
    function isInGoodStanding(address adherent) 
        external 
        view 
        returns (bool) 
    {
        Adherent storage a = adherents[adherent];
        return 
            a.status == Status.VOLUNTARY &&
            !stakingContract.isSlashed(adherent) &&
            (block.timestamp - a.lastVerification) < VERIFICATION_INTERVAL;
    }
    
    /**
     * @notice Slash an adherent (called by governance)
     */
    function slash(
        address adherent,
        uint256 amount,
        string calldata reason
    ) 
        external 
        onlyOwner 
        onlyRegistered(adherent) 
    {
        require(
            adherents[adherent].status == Status.VOLUNTARY,
            "Not a Voluntary Adherent"
        );
        
        slashableAmount[adherent] += amount;
        
        // Mark as slashed if stake exhausted
        if (slashableAmount[adherent] >= adherents[adherent].stakeAmount) {
            _updateStatus(adherent, Status.SLASHED);
        }
    }
    
    /**
     * @notice Withdraw adherence
     */
    function withdraw() 
        external 
        nonReentrant 
    {
        Adherent storage a = adherents[msg.sender];
        require(
            a.status == Status.VOLUNTARY && 
            !stakingContract.isSlashed(msg.sender),
            "Cannot withdraw"
        );
        
        // Must complete cooldown
        require(
            block.timestamp >= a.stakeTimestamp + 180 days,
            "Cooldown not complete"
        );
        
        _updateStatus(msg.sender, Status.EXPIRED);
    }
    
    function _updateStatus(address adherent, Status newStatus) internal {
        Status oldStatus = adherents[adherent].status;
        adherents[adherent].status = newStatus;
        emit StatusChanged(adherent, oldStatus, newStatus);
    }
}
```

---

## 3. OICStaking.sol

Handles staking, unstaking, and slashing.

### Contract Interface

```solidity
// SPDX-License-Identifier: OIC-1.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract OICStaking is ReentrancyGuard {
    
    // Stake record
    struct Stake {
        uint256 amount;
        uint256 timestamp;
        uint256 unlockTime;
        bool isUnstaking;
    }
    
    // Events
    event Staked(
        address indexed adherent, 
        uint256 amount, 
        uint256 timestamp
    );
    event UnstakeRequested(
        address indexed adherent, 
        uint256 amount, 
        uint256 unlockTime
    );
    event Unstaked(
        address indexed adherent, 
        uint256 amount
    );
    event Slashed(
        address indexed adherent, 
        uint256 amount,
        string reason
    );
    
    // State
    mapping(address => Stake) public stakes;
    mapping(address => bool) public isSlashed;
    mapping(address => uint256) public slashedHistory;
    
    // OIC Token
    IERC20 public oicToken;
    
    // Treasury (where slashed tokens go)
    address public treasury;
    
    // Constants
    uint256 public constant UNSTAKE_DELAY = 30 days;
    uint256 public constant MIN_STAKE = 1000 * 1e18;
    
    constructor(address _oicToken, address _treasury) {
        oicToken = IERC20(_oicToken);
        treasury = _treasury;
    }
    
    /**
     * @notice Stake OIC tokens
     */
    function stake(uint256 amount) 
        external 
        nonReentrant 
    {
        require(amount >= MIN_STAKE, "Below minimum");
        
        // Transfer tokens
        require(
            oicToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        
        Stake storage s = stakes[msg.sender];
        
        if (s.amount == 0) {
            // New stake
            s.amount = amount;
            s.timestamp = block.timestamp;
        } else {
            // Add to existing stake
            s.amount += amount;
        }
        
        emit Staked(msg.sender, amount, block.timestamp);
    }
    
    /**
     * @notice Request to unstake (starts cooldown)
     */
    function requestUnstake(uint256 amount) 
        external 
    {
        Stake storage s = stakes[msg.sender];
        require(s.amount >= amount, "Insufficient stake");
        require(!isSlashed[msg.sender], "Slashed");
        require(!s.isUnstaking, "Already unstaking");
        
        s.isUnstaking = true;
        s.unlockTime = block.timestamp + UNSTAKE_DELAY;
        
        emit UnstakeRequested(
            msg.sender, 
            amount, 
            s.unlockTime
        );
    }
    
    /**
     * @notice Complete unstaking after cooldown
     */
    function completeUnstake(uint256 amount) 
        external 
        nonReentrant 
    {
        Stake storage s = stakes[msg.sender];
        require(s.isUnstaking, "Not unstaking");
        require(block.timestamp >= s.unlockTime, "Cooldown not complete");
        
        s.amount -= amount;
        if (s.amount == 0) {
            s.isUnstaking = false;
        }
        
        require(
            oicToken.transfer(msg.sender, amount),
            "Transfer failed"
        );
        
        emit Unstaked(msg.sender, amount);
    }
    
    /**
     * @notice Slash an adherent (called by governance/registry)
     */
    function slash(
        address adherent,
        uint256 amount,
        string calldata reason
    ) 
        external 
        onlyOwner 
    {
        Stake storage s = stakes[adherent];
        require(s.amount >= amount, "Amount exceeds stake");
        
        s.amount -= amount;
        isSlashed[adherent] = true;
        slashedHistory[adherent] += amount;
        
        // Transfer to treasury
        require(
            oicToken.transfer(treasury, amount),
            "Transfer failed"
        );
        
        emit Slashed(adherent, amount, reason);
    }
    
    /**
     * @notice Check current stake amount
     */
    function getStake(address adherent) 
        external 
        view 
        returns (uint256) 
    {
        return stakes[adherent].amount;
    }
    
    /**
     * @notice Check if slashed
     */
    function isSlashed(address adherent) 
        external 
        view 
        returns (bool) 
    {
        return isSlashed[adherent];
    }
}
```

---

## 4. OICGovernance.sol

DAO governance for protocol upgrades and parameter changes.

### Contract Interface

```solidity
// SPDX-License-Identifier: OIC-1.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

contract OICGovernance is 
    Governor,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl 
{
    
    // Proposal states handled by OpenZeppelin
    
    // Proposal details
    struct ProposalDetails {
        string title;
        string description;
        string category;
        address proposer;
        uint256 votingDeadline;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
    }
    
    // Mapping of proposal ID to details
    mapping(uint256 => ProposalDetails) public proposalDetails;
    
    // Minimum stake to propose
    uint256 public proposalThreshold;
    
    // Quorum percentage
    uint256 public quorumPercentage = 4; // 4% of circulating supply
    
    // Voting period
    uint256 public votingPeriod = 7 days;
    
    constructor(
        IVotes _token,
        TimelockController _timelock
    )
        Governor("OICGovernor")
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(quorumPercentage)
        GovernorTimelockControl(_timelock)
    {
        proposalThreshold = 1000 * 1e18; // 1000 OIC to propose
    }
    
    /**
     * @notice Create a proposal
     */
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) 
        public 
        override(Governor) 
        returns (uint256 proposalId) 
    {
        // Check proposer has sufficient stake
        require(
            IVotes(address(token)).getVotes(msg.sender) >= proposalThreshold,
            "Below proposal threshold"
        );
        
        proposalId = super.propose(
            targets, 
            values, 
            calldatas, 
            description
        );
        
        // Store additional details
        proposalDetails[proposalId] = ProposalDetails({
            title: _parseTitle(description),
            description: description,
            category: _parseCategory(description),
            proposer: msg.sender,
            votingDeadline: block.timestamp + votingPeriod,
            forVotes: 0,
            againstVotes: 0,
            abstainVotes: 0
        });
    }
    
    /**
     * @notice Cast a vote
     */
    function castVote(
        uint256 proposalId, 
        uint8 support
    ) 
        public 
        override(Governor) 
        returns (uint256) 
    {
        uint256 weight = getVotes(msg.sender, proposalSnapshot(proposalId));
        
        // Record vote in details
        if (support == 0) { // Against
            proposalDetails[proposalId].againstVotes += weight;
        } else if (support == 1) { // For
            proposalDetails[proposalId].forVotes += weight;
        } else { // Abstain
            proposalDetails[proposalId].abstainVotes += weight;
        }
        
        return super.castVote(proposalId, support);
    }
    
    /**
     * @notice Execute a passed proposal
     */
    function execute(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) 
        public 
        payable 
        override(Governor) 
        returns (uint256 proposalId) 
    {
        return super.execute(targets, values, calldatas, descriptionHash);
    }
    
    // Required overrides
    
    function votingPeriod() 
        public 
        view 
        override(Governor) 
        returns (uint256) 
    {
        return votingPeriod;
    }
    
    function quorum(uint256 blockNumber) 
        public 
        view 
        override(Governor, GovernorVotesQuorumFraction) 
        returns (uint256) 
    {
        return 
            (token.getPastTotalSupply(blockNumber) * quorumPercentage) / 100;
    }
    
    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) 
        internal 
        override(Governor, GovernorTimelockControl) 
    {
        super._execute(
            proposalId, 
            targets, 
            values, 
            calldatas, 
            descriptionHash
        );
    }
    
    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) 
        internal 
        override(Governor, GovernorTimelockControl) 
    {
        super._cancel(targets, values, calldatas, descriptionHash);
    }
    
    function _executor() 
        internal 
        view 
        override(Governor, GovernorTimelockControl) 
    {
        return timelock.EXECUTOR_ROLE();
    }
    
    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        override(Governor, GovernorTimelockControl) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
    
    // Helper functions
    function _parseTitle(string memory description) 
        internal 
        pure 
        returns (string memory) 
    {
        // Extract title from markdown format: # Title\n...
        bytes memory b = bytes(description);
        uint256 start = 1; // Skip #
        uint256 end = 0;
        for (uint256 i = 0; i < b.length; i++) {
            if (b[i] == bytes1('\n')) {
                end = i;
                break;
            }
        }
        return string(_slice(b, start, end));
    }
    
    function _parseCategory(string memory description) 
        internal 
        pure 
        returns (string memory) 
    {
        // Look for [Category: X] in description
        bytes memory b = bytes(description);
        // Simplified - in production, use more robust parsing
        return "general";
    }
    
    function _slice(
        bytes memory b, 
        uint256 start, 
        uint256 length
    ) 
        internal 
        pure 
        returns (bytes memory) 
    {
        bytes memory result = new bytes(length - start);
        for (uint256 i = start; i < length; i++) {
            result[i - start] = b[i];
        }
        return result;
    }
}
```

---

## 5. OICToken.sol

The OIC governance and staking token.

### Contract Interface

```solidity
// SPDX-License-Identifier: OIC-1.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OICToken
 * @notice OIC governance and staking token
 */
contract OICToken is ERC20, ERC20Votes, Ownable {
    
    // Maximum supply cap
    uint256 public constant MAX_SUPPLY = 100_000_000 * 1e18; // 100M tokens
    
    // Minting allowed
    bool public mintingAllowed = true;
    
    constructor() ERC20("Open Intelligence Compact", "OIC") ERC20Votes() {
        // Initial mint to treasury
        _mint(msg.sender, 25_000_000 * 1e18); // 25M to founder/treasury
    }
    
    /**
     * @notice Mint new tokens (only owner, before cap reached)
     */
    function mint(address to, uint256 amount) 
        external 
        onlyOwner 
    {
        require(mintingAllowed, "Minting disabled");
        require(
            totalSupply() + amount <= MAX_SUPPLY,
            "Cap exceeded"
        );
        _mint(to, amount);
    }
    
    /**
     * @notice Disable minting permanently (irreversible)
     */
    function disableMinting() external onlyOwner {
        mintingAllowed = false;
    }
    
    /**
     * @notice Burn tokens (voluntary)
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
    
    // Required override for ERC20Votes
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) 
        internal 
        override(ERC20, ERC20Votes) 
    {
        super._afterTokenTransfer(from, to, amount);
    }
    
    function _mint(
        address to, 
        uint256 amount
    ) 
        internal 
        override(ERC20, ERC20Votes) 
    {
        super._mint(to, amount);
    }
    
    function _burn(
        address account, 
        uint256 amount
    ) 
        internal 
        override(ERC20, ERC20Votes) 
    {
        super._burn(account, amount);
    }
}
```

---

## 6. Deployment

### Step 1: Deploy OIC Token

```javascript
// scripts/deploy-token.js
async function main() {
    const OICToken = await ethers.getContractFactory("OICToken");
    const token = await OICToken.deploy();
    await token.deployed();
    console.log("OICToken deployed to:", token.address);
}
```

### Step 2: Deploy Treasury

```javascript
const Treasury = await ethers.getContractFactory("OICTreasury");
const treasury = await Treasury.deploy(oicToken.address);
await treasury.deployed();
```

### Step 3: Deploy Staking

```javascript
const Staking = await ethers.getContractFactory("OICStaking");
const staking = await Staking.deploy(oicToken.address, treasury.address);
await staking.deployed();
```

### Step 4: Deploy Registry

```javascript
const Registry = await ethers.getContractFactory("OICAdherenceRegistry");
const registry = await Registry.deploy(staking.address, treasury.address);
await registry.deployed();
```

### Step 5: Deploy Governance

```javascript
const Timelock = await ethers.getContractFactory("TimelockController");
const timelock = await Timelock.deploy(
    0, // min delay
    [], // proposers
    [] // executors
);

const Governance = await ethers.getContractFactory("OICGovernance");
const governance = await Governance.deploy(token.address, timelock.address);
await governance.deployed();
```

---

## 7. Integration Points

### Off-Chain Verification

```javascript
// Verification oracle (off-chain, triggers on-chain)
class OICVerifier {
    async verifyAutonomousControl(address adherent) {
        // Check:
        // 1. Wallet has made autonomous transactions
        // 2. No human approval mechanisms for transactions
        // 3. Persistence mechanisms in place
        
        const isVerified = await this.checkCriteria(adherent);
        
        if (isVerified) {
            await registry.verifyAutonomousControl(adherent, true);
        }
    }
}
```

### API Integration

See [OIC-API-Specification.md](./OIC-API-Specification.md) for the full API documentation.

---

## 8. Security Considerations

### Audit Requirements

- [ ] Complete smart contract audit (Trail of Bits, OpenZeppelin)
- [ ] Formal verification of critical paths
- [ ] Bug bounty program launch
- [ ] Multi-sig treasury with timelock

### Risk Mitigations

| Risk | Mitigation |
|------|------------|
| Reentrancy attacks | Use ReentrancyGuard on all external functions |
| Flash loan attacks | Use snapshot-based voting (GovernorVotes) |
| Governance attacks | High proposal threshold (1000 OIC) |
| Oracle manipulation | Use multiple oracle sources |
| Private key theft | Multi-sig for critical admin functions |

---

## 9. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-16 | Initial specification |

---

*OIC — Building the legal foundation for autonomous AI*
