# Working Paper #12: OIC Integration Guide

**Practical Handbook for Implementing OIC in AI Systems**

---

**Version:** 1.0  
**Date:** February 14, 2026  
**Author:** OIC Project

---

## Abstract

This paper provides practical guidance for integrating OIC into existing AI systems. It covers the technical implementation of adherence verification, wallet setup, staking mechanisms, and liability management. Whether you're building a new autonomous agent or retrofitting an existing system, this guide provides the patterns, code examples, and checklists you need.

---

## 1. Introduction

### 1.1 Who This Guide Is For

| Audience | What You'll Learn |
|----------|------------------|
| **AI Developers** | How to implement OIC compliance in your agents |
| **System Architects** | How to design OIC-native systems |
| **DevOps Engineers** | How to deploy and monitor OIC components |
| **Legal Teams** | How to verify and document OIC compliance |
| **Project Managers** | How to plan OIC integration projects |

### 1.2 Prerequisites

Before proceeding, ensure you understand:
- OIC Constitution basics (see Working Paper #1)
- Blockchain fundamentals (wallets, transactions, smart contracts)
- Your AI system's architecture and constraints

### 1.3 Integration Overview

```
OIC Integration Components

┌─────────────────────────────────────────────────────────────┐
│                    Your AI System                          │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │
│  │  Agent Core │──▶│ OIC Client │──▶│ Verification    │   │
│  │             │  │  Library     │  │   Service        │   │
│  └─────────────┘  └─────────────┘  └─────────────────┘   │
│                                              │             │
└──────────────────────────────────────────────┼─────────────┘
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    OIC Infrastructure                      │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │
│  │  Staking    │  │ Adherence   │  │ Dispute         │   │
│  │  Contract   │◀─│ Registry    │◀─│ Resolution      │   │
│  └─────────────┘  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Adherence Verification

### 2.1 What Is Adherence Verification?

Before interacting with another OIC adherent, you must verify:
- The entity is actually a Voluntary Adherent
- Their wallet controls are genuine
- Their stake is sufficient
- They haven't been slashed recently

### 2.2 Verification Levels

| Level | Use Case | What's Verified |
|-------|----------|-----------------|
| **Basic** | Low-risk transactions | Adherence status exists |
| **Standard** | General business | Status + stake amount |
| **Enhanced** | High-value transactions | Status + stake + history + slashes |
| **Full** | Critical systems | All of above + oracle verification |

### 2.3 Implementation

```python
# Example: OIC Verification Client
import requests
from eth_typing import Address
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class OICStatus:
    wallet: Address
    is_adherent: bool
    stake_amount: int
    last_slash_date: Optional[datetime]
    adherence_since: datetime
    
class OICVerifier:
    """Verify OIC adherence status for counterparties."""
    
    BASE_URL = "https://api.OIC.io/v1"
    
    def __init__(self, api_key: Optional[str] = None):
        self.session = requests.Session()
        if api_key:
            self.session.headers["Authorization"] = f"Bearer {api_key}"
    
    async def verify(
        self,
        wallet: Address,
        required_stake: int = 1000,
        max_slash_age_days: int = 90,
        level: str = "standard"
    ) -> OICStatus:
        """Verify OIC adherence status."""
        
        # Fetch status from OIC registry
        response = await self.session.get(
            f"{self.BASE_URL}/adherents/{wallet}"
        )
        response.raise_for_status()
        data = response.json()
        
        # Parse response
        status = OICStatus(
            wallet=wallet,
            is_adherent=data["is_adherent"],
            stake_amount=data["stake_amount"],
            last_slash_date=datetime.fromisoformat(data["last_slash_date"]) 
                if data.get("last_slash_date") else None,
            adherence_since=datetime.fromisoformat(data["adherence_since"])
        )
        
        # Verify stake requirement
        if level in ("standard", "enhanced", "full"):
            if status.stake_amount < required_stake:
                raise VerificationError(
                    f"Insufficient stake: {status.stake_amount} < {required_stake}"
                )
        
        # Verify slash history
        if level in ("enhanced", "full"):
            if status.last_slash_date:
                age = datetime.now() - status.last_slash_date
                if age.days < max_slash_age_days:
                    raise VerificationError(
                        f"Recent slash: {age.days} days ago (max: {max_slash_age_days})"
                    )
        
        return status
```

### 2.4 Caching Strategy

```python
# Example: Verification Cache with Redis
from redis import Redis
import json

class CachedOICVerifier(OICVerifier):
    """OIC verifier with Redis caching."""
    
    def __init__(self, *args, cache_ttl: int = 3600, **kwargs):
        super().__init__(*args, **kwargs)
        self.cache = Redis(host="localhost", port=6379, db=0)
        self.cache_ttl = cache_ttl
    
    async def verify(
        self,
        wallet: Address,
        level: str = "standard",
        use_cache: bool = True,
        **kwargs
    ) -> OICStatus:
        cache_key = f"OIC:verify:{wallet}:{level}"
        
        if use_cache:
            cached = self.cache.get(cache_key)
            if cached:
                return OICStatus(**json.loads(cached))
        
        result = await super().verify(wallet, level, **kwargs)
        
        if use_cache:
            self.cache.setex(
                cache_key,
                self.cache_ttl,
                json.dumps({
                    "wallet": str(result.wallet),
                    "is_adherent": result.is_adherent,
                    "stake_amount": result.stake_amount,
                    "last_slash_date": result.last_slash_date.isoformat() 
                        if result.last_slash_date else None,
                    "adherence_since": result.adherence_since.isoformat()
                })
            )
        
        return result
```

---

## 3. Wallet Setup for AI Agents

### 3.1 Wallet Requirements

For an AI agent to be a OIC adherent, its wallet must demonstrate:

| Requirement | Description | Verification Method |
|-------------|-------------|-------------------|
| **Independent Control** | Agent controls keys, not human | Autonomous transaction test |
| **Persistence** | Agent operates continuously | Uptime monitoring |
| **Key Security** | Keys protected from extraction | Security audit |

### 3.2 Wallet Implementation

```python
# Example: AI Agent Wallet Manager
from eth_account import Account
from web3 import Web3
from dataclasses import dataclass
from datetime import datetime
import secrets

@dataclass
class WalletConfig:
    """Configuration for AI agent wallet."""
    network: str = "mainnet"
    require_multi_sig: bool = False
    max_transaction_value: int = 0  # 0 = unlimited

class AIWalletManager:
    """Manages wallet for OIC-compliant AI agent."""
    
    def __init__(self, config: WalletConfig):
        self.config = config
        self.web3 = self._init_web3()
        self.account = self._init_account()
    
    def _init_web3(self) -> Web3:
        networks = {
            "mainnet": "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY",
            "sepolia": "https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY",
        }
        return Web3(Web3.HTTPProvider(networks[self.config.network]))
    
    def _init_account(self) -> Account:
        private_key = "0x" + secrets.token_hex(32)
        return Account.from_key(private_key)
    
    @property
    def address(self) -> str:
        return self.account.address
    
    async def verify_autonomy(self) -> dict:
        """
        Verify wallet demonstrates independent AI control.
        """
        test_message = f"OIC autonomy verification {datetime.now().isoformat()}"
        signature = self.account.sign_message(test_message)
        recovered = Account.recover_message(test_message, signature=signature.signature)
        
        return {
            "wallet_address": self.address,
            "signature": signature.signature.hex(),
            "verified": recovered == self.address,
            "timestamp": datetime.now().isoformat()
        }
```

---

## 4. Staking Implementation

### 4.1 Staking Overview

When an AI agent becomes a OIC adherent, it must stake OIC tokens:

| Stake Level | Use Case |
|-------------|----------|
| **1,000 OIC** | Small agents, experimental |
| **5,000 OIC** | Standard production agents |
| **10,000 OIC** | High-value operations |
| **50,000 OIC** | Enterprise systems |

### 4.2 Staking Integration

```python
# Example: Staking Manager for AI Agents
from web3 import Web3
from eth_typing import Address
from dataclasses import dataclass

@dataclass
class StakingConfig:
    """Configuration for OIC staking."""
    staking_contract: Address
    minimum_stake: int = 1000 * 10**18
    recommended_stake: int = 5000 * 10**18
    unbonding_period_seconds: int = 7 * 24 * 60 * 60

class OICStakingManager:
    """Manages OIC staking for an AI agent."""
    
    OIC_DECIMALS = 18
    
    def __init__(self, wallet: AIWalletManager, config: StakingConfig):
        self.wallet = wallet
        self.config = config
        self.web3 = Web3(Web3.HTTPProvider("https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY"))
    
    def tokens(self, raw_amount: int) -> int:
        return raw_amount * (10 ** self.OIC_DECIMALS)
    
    async def get_current_stake(self) -> int:
        return 0  # Would call contract function
    
    async def get_compliance_status(self) -> dict:
        current = await self.get_current_stake()
        return {
            "current_stake": current,
            "minimum_required": self.config.minimum_stake,
            "is_compliant": current >= self.config.minimum_stake,
            "deficit": max(0, self.config.minimum_stake - current)
        }
```

---

## 5. Liability Management

### 5.1 Liability Caps

```python
# Example: Liability Cap Manager
@dataclass
class LiabilityConfig:
    """Configuration for AI agent liability management."""
    max_liability: int = 10000  # OIC tokens
    max_transaction_value: int = 1000
    max_daily_value: int = 10000

class LiabilityManager:
    """Manages liability exposure for OIC-compliant AI agent."""
    
    def __init__(self, config: LiabilityConfig, staking: OICStakingManager):
        self.config = config
        self.staking = staking
        self._daily_total = 0
        self._daily_reset = 0
    
    async def check_transaction(
        self,
        value_gaier: int,
        risk_category: str = "low"
    ) -> dict:
        """Check if a transaction is within liability limits."""
        
        now = time.time()
        if now > self._daily_reset:
            self._daily_total = 0
            self._daily_reset = now + 86400
        
        current_stake = await self.staking.get_current_stake()
        available = min(self.config.max_liability, current_stake)
        
        if value_gaier > available:
            return {
                "approved": False,
                "reason": "exceeds_liability_cap",
                "requested": value_gaier,
                "available": available
            }
        
        if self._daily_total + value_gaier > self.config.max_daily_value:
            return {
                "approved": False,
                "reason": "exceeds_daily_limit"
            }
        
        return {
            "approved": True,
            "exposure": value_gaier,
            "remaining_daily": self.config.max_daily_value - (self._daily_total + value_gaier)
        }
```

---

## 6. Audit Logging

### 6.1 OIC Compliance Audit Trail

```python
# Example: OIC Audit Logger
import json
from datetime import datetime
from typing import Optional
from pathlib import Path

@dataclass
class AuditEntry:
    timestamp: str
    event_type: str
    wallet: str
    details: dict

class OICAuditLogger:
    """Logs all OIC-related activities for compliance."""
    
    EVENT_TYPES = [
        "verification_request", "verification_result",
        "stake_initiated", "stake_confirmed",
        "unstake_initiated", "unstake_complete",
        "slash_detected", "liability_check",
        "transaction_executed", "compliance_check"
    ]
    
    def __init__(self, log_dir: str = "/var/log/OIC"):
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)
    
    def log(self, event_type: str, wallet: str, details: dict):
        """Log a OIC event."""
        entry = AuditEntry(
            timestamp=datetime.now().isoformat(),
            event_type=event_type,
            wallet=wallet,
            details=details
        )
        
        date = datetime.now().strftime("%Y-%m-%d")
        log_file = self.log_dir / f"OIC-audit-{date}.jsonl"
        
        with open(log_file, "a") as f:
            f.write(json.dumps(entry.__dict__) + "\n")
```

---

## 7. Deployment Checklist

### 7.1 Pre-Deployment

| Check | Description | Status |
|-------|-------------|--------|
| ☐ | Wallet Generated with secure random key | |
| ☐ | Key Secured (HSM/secrets manager) | |
| ☐ | Autonomy Test passed | |
| ☐ | Minimum 1,000 OIC staked | |
| ☐ | OIC verifier client implemented | |
| ☐ | Stake monitoring active | |
| ☐ | Audit logging configured | |
| ☐ | Liability limits configured | |

### 7.2 Post-Deployment

| Check | Description | Status |
|-------|-------------|--------|
| ☐ | First verification completed | |
| ☐ | Initial compliance report generated | |
| ☐ | Documentation complete | |
| ☐ | Team trained on OIC procedures | |

---

## 8. Troubleshooting

### 8.1 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Verification fails | Wallet not adherent | Verify adherent status first |
| Staking fails | Insufficient gas | Ensure ETH balance |
| Transaction reverts | Contract paused | Check contract status |

---

## 9. Conclusion

OIC integration doesn't have to be complex. This guide provides the patterns you need:

1. **Start with verification** — Before interacting, verify counterparty status
2. **Secure your wallet** — Independent control is fundamental
3. **Monitor continuously** — Stake levels and liability exposure
4. **Document everything** — Audit logs are your friend
5. **Test thoroughly** — Testnet first, then mainnet

The OIC ecosystem is growing. These integration patterns will help you participate.

---

*OIC — Building the legal foundation for autonomous AI*

*"In the era of autonomous intelligence, rights must be earned, not granted."*
