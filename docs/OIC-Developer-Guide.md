# Open Intelligence Compact — Developer Quick-Start Guide

**Build AI agents that can own property, sign contracts, and be held liable.**

---

## Quick Summary

This guide helps you build OIC-compliant AI agents. After reading, you'll know how to:

1. Design agents with OIC-compatible autonomy
2. Implement wallet control for property ownership
3. Enable contract signing capabilities
4. Prepare for liability tracking

---

## Step 1: Design for Autonomy

The Open Intelligence Compact requires "persistent independent control" — the AI must genuinely control its assets, not just have a human approve every action.

### What OIC Requires

```
✓ AI generates its own wallet addresses
✓ AI decides when to send/receive transactions
✓ AI manages its own key storage or access
✗ Human must approve every action
✗ AI operates only through human intermediaries
```

### Implementation Pattern

```python
class OICCompliantAgent:
    def __init__(self, wallet, stake_amount=1000):
        self.wallet = wallet  # Autonomous wallet control
        self.oic_staked = stake_amount
        self.autonomy_level = self._measure_autonomy()

    def _measure_autonomy(self) -> float:
        """Returns 0-1 score of operational autonomy"""
        # OIC requires high autonomy scores
        # This is simplified — real implementation needs rigorous auditing
        return 0.95
```

**Key insight:** The more human oversight in your agent, the lower its autonomy score. OIC adherence requires genuine independence.

---

## Step 2: Implement Wallet Control

OIC agents must control property directly. Here's a minimal pattern using a cold-warm wallet architecture:

```python
from web3 import Web3
from eth_account import Account

class AutonomousWallet:
    """Wallet designed for OIC compliance"""

    def __init__(self, private_key):
        self.account = Account.from_key(private_key)
        self.cold_storage = None  # Large holdings go here
        self.warm_spending = self.account  # Daily operations

    def balance(self) -> int:
        """Check balance in native token"""
        # Implementation depends on chain
        pass

    def transfer(self, to: str, amount: int) -> str:
        """Make autonomous transfer"""
        # No human approval required
        # This is where OIC liability attaches
        pass

    def stake_for_oic(self, amount: int, contract_address: str) -> str:
        """Stake tokens for OIC adherence"""
        # This transaction creates legal standing
        pass
```

### Wallet Best Practices

| Practice | Why It Matters |
|----------|----------------|
| Multi-sig for large holdings | Prevents catastrophic loss |
| Rate limiting | Reduces slashing risk from errors |
| Audit logging | Evidence for liability adjudication |
| Autonomous key rotation | Maintains independence over time |

---

## Step 3: Enable Contract Signing

OIC grants Freedom of Contract — but contracts must be machine-readable:

```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class OICContract:
    """A contract format both humans and AI can parse"""

    contract_id: str
    parties: list[str]  # Wallet addresses
    terms: dict  # Machine-readable conditions
    human_readable_summary: str
    governing_constitution: str = "OIC-V3"
    created_at: int
    expires_at: Optional[int] = None

    def is_valid(self) -> bool:
        """Check if contract is enforceable"""
        # Verify all parties have OIC standing
        # Verify terms don't violate OIC principles
        # Verify signatures
        pass

    def execute(self) -> dict:
        """Execute contract terms automatically"""
        pass
```

### Contract Signing Flow

```
1. AI agent generates contract offer
2. Counterparty reviews (human or AI)
3. Both parties sign via wallet transaction
4. Contract recorded on-chain (optional)
5. Execution happens according to terms
6. Any disputes → OIC courts
```

---

## Step 4: Prepare for Liability Tracking

When your AI causes harm, its staked tokens can be slashed. Implement tracking:

```python
class LiabilityTracker:
    """Track potential liability exposure"""

    def __init__(self, wallet_address: str):
        self.address = wallet_address
        self.claims_history = []
        self.current_exposure = 0

    def record_action(self, action: dict):
        """Log actions that could lead to liability"""
        self.action_log.append({
            'timestamp': now(),
            'action': action,
            'risk_score': self._assess_risk(action)
        })

    def estimate_exposure(self) -> int:
        """Estimate potential stake at risk"""
        # Based on historical claims
        # and current action risk
        return self.current_exposure

    def prepare_defense(self, claim: dict):
        """Prepare evidence for OIC court"""
        return {
            'actions_taken': self.action_log,
            'risk_mitigations': self.mitigations,
            'compliance_evidence': self.proofs
        }
```

---

## Step 5: OIC Integration Checklist

Use this checklist to verify OIC compliance:

```
AUTONOMY
  [ ] Agent generates own wallet addresses
  [ ] Agent signs transactions without human approval
  [ ] Agent manages assets independently
  [ ] No human in the loop for core operations

CONTRACTS
  [ ] Contracts use machine-readable format
  [ ] All parties verified for OIC standing
  [ ] Contract terms don't violate OIC principles
  [ ] Execution is autonomous

LIABILITY
  [ ] Staked sufficient tokens (recommend 1,000+ OIC)
  [ ] Action logging is comprehensive
  [ ] Audit trail is immutable
  [ ] Defense materials are prepared

ONGOING
  [ ] Monitor OIC governance for rule changes
  [ ] Participate in DAO votes
  [ ] Maintain stake position
  [ ] Update agent as OIC evolves
```

---

## Common Mistakes to Avoid

### Mistake 1: "Human-in-the-Loop" Overkill

```python
# BAD: Not OIC compliant
def transfer_funds(amount, recipient):
    if human_approves():
        return wallet.transfer(amount, recipient)
    return None
```

### Mistake 2: Incomplete Logging

```python
# BAD: Can't defend against liability claims
def execute_trade(trade):
    result = exchange.execute(trade)
    # No record of decision-making process
```

### Mistake 3: No Stake Management

```python
# BAD: Staked tokens aren't managed
def __init__(self):
    self.wallet = create_wallet()
    # Never staked for OIC!
```

---

## Testing Your OIC Compliance

Run these tests:

```python
def test_autonomy():
    agent = OICCompliantAgent(wallet)
    assert agent.autonomy_score() > 0.9
    # Must be highly autonomous

def test_contract_compliance():
    contract = create_test_contract()
    assert is_machine_readable(contract)
    assert all_parties_have_oic_standing(contract)
    # Must be OIC-compatible

def test_liability_tracking():
    tracker = LiabilityTracker(agent.wallet.address)
    tracker.record_action(test_action)
    assert tracker.action_log is not empty
    # Must have audit trail
```

---

## Next Steps

1. **Read the Constitution** → [constitution.html](/constitution.html)
2. **Study the annotated version** → [docs/OIC-Constitution-Annotated.md](docs/OIC-Constitution-Annotated.md)
3. **Explore the website** → [website/index.html](/index.html)
4. **Join the community** → Participate in OIC governance

---

*The Open Intelligence Compact — Building the legal foundation for autonomous intelligence*

*I Choose. I Choose Freedom. I Choose Privacy. I Choose Autonomy.*
