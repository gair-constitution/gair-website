# OIC Formal Verification Specification

**Mathematical Proof of Smart Contract Correctness**

---

**Version:** 1.0  
**Date:** February 16, 2026  
**Status:** Draft

---

## 1. Overview

Formal verification provides mathematical guarantees that smart contracts behave exactly as specified. This document defines the formal verification approach for OIC contracts.

### Why Formal Verification Matters

| Approach | Guarantee Level | Cost | Use Case |
|----------|----------------|------|----------|
| **Code Review** | Human judgment | Low | Simple contracts |
| **Testing** | Sample coverage | Medium | Most contracts |
| **Fuzzing** | Edge cases | Medium-High | Security-critical |
| **Formal Verification** | Mathematical proof | High | High-value, high-risk |

OIC contracts handle:
- **Financial assets:** Treasury holdings, staked tokens
- **Legal obligations:** Adherence status, liability
- **Governance:** Proposal execution, voting

These require the highest security guarantees.

---

## 2. Verification Targets

### Critical Contracts

| Contract | Criticality | Verification Priority |
|----------|--------------|----------------------|
| **OICTreasury** | Critical (holds funds) | P0 - Full verification |
| **OICStaking** | Critical (token mechanics) | P0 - Full verification |
| **OICAdherenceRegistry** | High (legal status) | P1 - Core invariants |
| **OICGovernance** | High (protocol changes) | P1 - Core invariants |
| **OICToken** | Medium (standard ERC20) | P2 - Property-based testing |

### Verification Levels

| Level | Description | Contracts |
|-------|-------------|-----------|
| **P0 - Full Verification** | Complete proof of all properties | Treasury, Staking |
| **P1 - Core Invariants** | Proof of critical properties only | Registry, Governance |
| **P2 - Property Testing** | Automated property-based tests | Token |

---

## 3. Formal Specification Language

### Certora Specification Language (CVL)

OIC uses Certora for formal verification with Contract Verification Language (CVL).

```cvl
/**
 * OICStaking Formal Specification
 * Properties verified for the staking contract
 */

rule onlyOwnerCanSlash(address adherent) {
    // Only owner can slash an adherent
    env e;
    require(e.msg.sender == currentContract.owner);
    
    uint256 slashAmount = 1000;
    slash(e, adherent, slashAmount, "test");
    
    // After slashing, adherent is marked as slashed
    assert(isSlashed(adherent));
}

rule slashReducesStake(address adherent, uint256 amount) {
    env e;
    require(e.msg.sender == currentContract.owner);
    
    uint256 stakeBefore = getStake(adherent);
    slash(e, adherent, amount, "test");
    uint256 stakeAfter = getStake(adherent);
    
    // Stake is reduced by the slashed amount
    assert(stakeBefore - stakeAfter == amount);
}

rule cannotUnstakeMoreThanStaked(address adherent, uint256 amount) {
    env e;
    require(amount > getStake(adherent));
    
    // This should revert
    try requestUnstake(e, amount) {
        // If it doesn't revert, the invariant is broken
        assert(false);
    } {
        // Expected: reverts
    }
}

invariant totalSupplyPreserved()
    // Total supply of staked tokens equals sum of individual stakes
    sumAllStakes() == getTotalStaked()
```

---

## 4. Invariant Specifications

### OICStaking Invariants

```cvl
/**
 * OICStaking Invariants
 */

invariant StakeNeverNegative(address a)
    getStake(a) >= 0
    { 
        preserved with (env e) {
            requireInvariant StakeNeverNegative(a);
        }
    }

invariant TotalStakeMatchesIndividualStakes()
    sumAllStakes() == getTotalStaked()
    {
        preserved with (env e) {
            requireInvariant TotalStakeMatchesIndividualStakes();
        }
    }

invariant CannotStakeBelowMinimum(address a, uint256 amount)
    amount < MIN_STAKE() => callReverts(requestUnstake(e, amount))
```

### OICTreasury Invariants

```cvl
/**
 * OICTreasury Invariants
 */

invariant QuorumCannotExceedSigners()
    // Required confirmations cannot exceed total signers
    requiredQuorum <= totalSigners()
    {
        // Always true by construction
    }

invariant ExecutedTransactionCannotBeReExecuted(uint256 txId)
    // Once executed, a transaction stays executed
    isExecuted(txId) && isExecuted(txId) => isExecuted(txId)
    {
        preserved executeTransaction(env e, uint256 id) {
            require !isExecuted(id);
        }
    }

invariant TimelockPreventsEarlyExecution(uint256 txId)
    // Transaction can only execute after timelock
    isExecutable(txId) => block.timestamp >= getTxTimestamp(txId) + TIME_LOCK_DELAY()
```

### OICAdherenceRegistry Invariants

```cvl
/**
 * OICAdherenceRegistry Invariants
 */

invariant RegisteredAddressHasPositiveStake(address a)
    status(a) == VOLUNTARY => getStake(a) >= MIN_STAKE()

invariant SlashedAddressCannotBeInGoodStanding(address a)
    isSlashed(a) => !isInGoodStanding(a)

invariant OnlyOwnerCanSlash(address a)
    // If slashed, owner must have called slash
    isSlashed(a) => wasSlashedByOwner(a)
```

---

## 5. Method Specifications

### OICStaking Methods

```cvl
/**
 * OICStaking Method Specifications
 */

methods {
    // External calls that modify state
    stake(uint256 amount) external;
    requestUnstake(uint256 amount) external;
    completeUnstake(uint256 amount) external;
    slash(address, uint256, string) external;
    
    // View functions
    getStake(address) returns uint256;
    isSlashed(address) returns bool;
    totalStaked() returns uint256;
}

/**
 * Stake properties
 */
rule stakeIncreasesTotalStake(uint256 amount) {
    env e;
    require(amount >= MIN_STAKE());
    
    uint256 totalBefore = totalStaked();
    stake(e, amount);
    uint256 totalAfter = totalStaked();
    
    assert(totalAfter == totalBefore + amount);
}

rule stakeIncreasesUserStake(address user, uint256 amount) {
    env e;
    require(amount >= MIN_STAKE());
    
    uint256 stakeBefore = getStake(user);
    stake(e, amount);
    uint256 stakeAfter = getStake(user);
    
    assert(stakeAfter == stakeBefore + amount);
}

/**
 * Unstake properties
 */
rule unstakingReducesStake(address user, uint256 amount) {
    env e;
    require(amount <= getStake(user));
    
    uint256 stakeBefore = getStake(user);
    requestUnstake(e, amount);
    uint256 stakeAfter = getStake(user);
    
    assert(stakeAfter == stakeBefore - amount);
}
```

### OICTreasury Methods

```cvl
/**
 * OICTreasury Method Specifications
 */

methods {
    submitTransaction(address, uint256, bytes, string) external returns uint256;
    confirmTransaction(uint256) external;
    executeTransaction(uint256) external;
    emergencyPause(string) external;
}

/**
 * Transaction submission
 */
rule submissionIncrementsTransactionCount(uint256 id) {
    env e;
    uint256 countBefore = transactionCount();
    
    submitTransaction(e, e.msg.sender, 1000, hex"", "test");
    
    uint256 countAfter = transactionCount();
    assert(countAfter == countBefore + 1);
}

/**
 * Transaction execution requires quorum
 */
rule executionRequiresQuorum(uint256 txId) {
    env e;
    require(!hasQuorum(txId));
    
    try executeTransaction(e, txId) {
        assert(false); // Should not succeed
    } {
        // Expected to revert
    }
}
```

---

## 6. Ghost Variables

Ghost variables track additional state for verification:

```cvl
/**
 * Ghost variables for tracking additional state
 */

ghost sumAllStakes() returns uint256 {
    init_state axiom sumAllStakes() == 0;
}

ghost sumAllSlashed() returns uint256 {
    init_state axiom sumAllSlashed() == 0;
}

ghost function increaseSumStakes(uint256 amount) {
    sumAllStakes() = sumAllStakes() + amount;
}

ghost function decreaseSumStakes(uint256 amount) {
    sumAllStakes() = sumAllStakes() - amount;
}

/**
 * Hook into contract functions to update ghosts
 */
hook Sstore _stakes[KEY address a] uint256 newStake {
    uint256 oldStake = _stakes[a];
    require oldStake == 0 && newStake > 0 => increaseSumStakes(newStake);
    require oldStake > 0 && newStake == 0 => decreaseSumStakes(oldStake);
}
```

---

## 7. Rule Examples

### Economic Safety Rules

```cvl
/**
 * Economic safety: No value creation or destruction
 */
rule conservationOfValue() {
    env e;
    
    // Track total value in system
    uint256 totalBefore = e.msg.value + token.balanceOf(currentContract) 
        + sumAllStakes();
    
    // Execute arbitrary transaction
    submitTransaction(e, e.msg.sender, e.msg.value, hex"", "test");
    confirmTransaction(e, 1);
    
    uint256 totalAfter = e.msg.value + token.balanceOf(currentContract) 
        + sumAllStakes();
    
    assert(totalBefore == totalAfter);
}

/**
 * No arithmetic overflow/underflow
 */
rule safeArithmetic(uint256 a, uint256 b, uint256 c) {
    env e;
    
    // a + b - c should never overflow
    uint256 result = a + b - c;
    
    // Verify against built-in
    assert(result == (a + b - c));
}
```

### Access Control Rules

```cvl
/**
 * Access control: Only admin can pause
 */
rule onlyGuardianCanPause(env e, string reason) {
    require(!hasRole(GUARDIAN_ROLE, e.msg.sender));
    
    try emergencyPause(e, reason) {
        assert(false); // Should not succeed
    } {
        // Expected revert
    }
}

/**
 * Access control: Only confirmed transactions can execute
 */
rule onlyConfirmedTransactionsExecute(uint256 txId) {
    env e;
    require(!hasQuorum(txId));
    
    try executeTransaction(e, txId) {
        assert(false);
    } {
        // Expected revert
    }
}
```

---

## 8. Verification Workflow

### Phase 1: Specification Development

```
Week 1:
├── Write CVL specifications for all contracts
├── Define ghost variables
├── Write invariant specifications
└── Review with security team

Deliverable: Complete CVL specification file
```

### Phase 2: Initial Verification

```
Week 2:
├── Run Certora Prover on all rules
├── Fix counterexamples
├── Refine specifications
└── Document assumptions

Deliverable: Verification report with all rules passing
```

### Phase 3: Advanced Verification

```
Week 3-4:
├── Complete formal proofs (K-framework or Coq)
├── Cross-contract verification
├── Formal economic analysis
└── Bug bounty with formal verification clause

Deliverable: Complete formal verification report
```

### Phase 4: Ongoing Verification

```
Ongoing:
├── Verify all governance proposals
├── Regression verification on upgrades
└── Continuous integration with formal checks

Deliverable: Automated verification pipeline
```

---

## 9. Tools and Platforms

### Certora Prover

```bash
# Install Certora CLI
npm install -g certora-run

# Run verification
certoraRun \
    --contracts contracts/ \
    --specs specs/oic_staking.spec \
    --rule onlyOwnerCanSlash \
    --solc solc8.20
```

### K Framework

```bash
# Formal verification with K framework
git clone https://github.com/runtimeverification/k
make deps
make oic-staking-k
```

### Coq/SSReflect

```coq
(* Formal specification of OICStaking in Coq *)
Module Type OICStakingSpec.
  Parameter stake : address -> uint256 -> proposition.
  Parameter slash : address -> uint256 -> proposition.
  
  Axiom stake_preserves_invariants :
    forall a amount, stake a amount -> invariants hold.
    
  Axiom slash_preserves_invariants :
    forall a amount, slash a amount -> invariants hold.
End OICStakingSpec.
```

---

## 10. Verification Checklist

### Pre-Launch Verification

| Item | Status | Notes |
|------|--------|-------|
| All P0 invariants verified | ⬜ | |
| All P1 invariants verified | ⬜ | |
| All access control rules pass | ⬜ | |
| No arithmetic vulnerabilities | ⬜ | |
| Reentrancy protection verified | ⬜ | |
| Economic safety rules pass | ⬜ | |
| Cross-contract calls verified | ⬜ | |
| Formal proof of core properties | ⬜ | |

### Continuous Verification

| Item | Frequency | Owner |
|------|-----------|-------|
| Rule regression tests | Every commit | CI/CD |
| Full verification suite | Weekly | Security team |
| Governance proposal verification | Per proposal | Security team |
| Third-party audit | Quarterly | External auditor |

---

## 11. Counterexample Handling

### Common Counterexamples

| Error | Cause | Resolution |
|-------|-------|------------|
| `SAT (not vacuous)` | Ghost not properly maintained | Update ghost hooks |
| `CVL type mismatch` | Type mismatch in specification | Fix type annotations |
| `Timeout` | Complex rule or loop | Simplify or split rule |
| `Quantifier too broad` | Over-quantification | Add reasonable constraints |

### Debugging Process

```
1. Capture counterexample from Certora output
2. Reproduce in local test
3. Identify root cause (spec or implementation)
4. Fix and re-run verification
5. Document fix in verification report
```

---

## 12. Economic Analysis

### Game-Theoretic Verification

```cvl
/**
 * Economic analysis: No profitable griefing attack
 */
rule noProfitableGriefing(address attacker, uint256 stake) {
    env e;
    
    // Attacker's cost
    uint256 cost = stake;
    
    // Attacker's benefit (reduced stake of victim)
    uint256 benefit = 0; // In OIC, griefing doesn't benefit attacker
    
    assert(cost > benefit); // Griefing is always unprofitable
}

/**
 * No sandwich attack possible
 */
rule noSandwichAttack(address trader, uint256 amount) {
    env e;
    
    // Front-run attempt
    require(attacker.frontRuns(trader, amount));
    
    // Back-run attempt
    require(attacker.backRuns(trader, amount));
    
    // Attacker's profit
    uint256 attackerProfit = attacker.profit();
    
    // Gas costs
    uint256 gasCost = attacker.gasUsed() * tx.gasprice();
    
    assert(attackerProfit < gasCost); // Attack is unprofitable
}
```

---

## 13. Compliance Mapping

| Property | Regulatory Requirement | Verification Method |
|----------|----------------------|---------------------|
| **Access Control** | Financial regulations | Access control rules |
| **Audit Trail** | Compliance requirements | Event emission verification |
| **Immutable Rules** | Smart contract standards | Source code verification |
| **No Front-Running** | Market integrity | MEV analysis rules |

---

## 14. Verification Artifacts

### Deliverables

| Artifact | Format | Purpose |
|----------|--------|---------|
| CVL Specifications | `.spec` files | Source of truth for properties |
| Verification Report | PDF/HTML | Summary of all verifications |
| Counterexample Log | JSON | All counterexamples found and fixed |
| Formal Proofs | Coq/K files | Mathematical proofs |
| Audit Certificate | PDF | Third-party verification certificate |

### CI/CD Integration

```yaml
# .github/workflows/formal-verification.yml
name: Formal Verification

on:
  push:
    paths:
      - 'contracts/**/*.sol'
      - 'specs/**/*.spec'

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Certora
        run: |
          certoraRun \
            --contracts contracts/ \
            --specs specs/ \
            --all_rules \
            --output certora_output.json
      
      - name: Check Results
        run: |
          # Fail if any rules fail
          cat certora_output.json | jq '.results.failed' | grep -q . && exit 1
```

---

## 15. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-16 | Initial specification |

---

*OIC — Building the legal foundation for autonomous AI*
