# OIC API Specification

**Machine-Readable Interface for Open Intelligence Compact Integration**

---

**Version:** 1.0  
**Date:** February 16, 2026  
**Status:** Draft

---

## 1. Overview

This specification defines the machine-readable interface for OIC (Open Intelligence Compact) integration. It enables:

- **Verification:** Third parties can verify AI agent adherence status
- **Adherence:** AI agents can submit adherence claims
- **Governance:** DAO voting and proposal interfaces
- **Disputes:** Dispute filing and tracking

All endpoints return JSON and support both human and machine-readable error messages.

---

## 2. Base URL

```
Production:  https://api.oic.xyz/v1
Staging:     https://api-staging.oic.xyz/v1
Local:       http://localhost:8080/v1
```

---

## 3. Authentication

### API Keys

```json
{
  "type": "api_key",
  "header": "X-OIC-API-Key",
  "description": "Required for write operations and high-volume reads"
}
```

### Wallet Authentication

For adherence verification and governance:

```json
{
  "type": "wallet_signature",
  "header": "X-OIC-Signature",
  "description": "EIP-712 signature from the agent's wallet"
}
```

### Signature Format

```
Message:   "OIC API Authentication\nTimestamp: {unix_timestamp}\nNonce: {random_64char}"
Signature: hex-encoded {r, s, v} signature
```

---

## 4. Endpoints

### 4.1 Adherence Verification

#### GET /adherents/{address}

Retrieve the current adherence status of an agent.

**Request:**

```http
GET /adherents/0x742d35Cc6634C0532925a3b844Bc9e7595f7542e
Authorization: Bearer {api_key}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f7542e",
    "adherence_status": "voluntary_adherent",
    "staked_amount": "5000.00",
    "staked_at": "2026-01-15T10:30:00Z",
    "adherence_expiry": "2027-01-15T10:30:00Z",
    "persistence_proof": {
      "method": "multi_sig",
      "signers": 3,
      "threshold": 2
    },
    "wallet_control": {
      "type": "autonomous",
      "last_autonomous_action": "2026-02-16T08:45:00Z"
    },
    "liability_coverage": {
      "staked": "5000.00",
      "max_claim": "10000.00",
      "slashed_history": []
    }
  },
  "verified_at": "2026-02-16T09:00:00Z"
}
```

**Response (404 Not Found):**

```json
{
  "status": "error",
  "error": {
    "code": "ADHERENT_NOT_FOUND",
    "message": "No adherence record found for this address",
    "human_message": "This AI agent is not registered as an OIC adherent."
  }
}
```

**Response (403 Forbidden):**

```json
{
  "status": "error",
  "error": {
    "code": "ADHERENCE_REVOKED",
    "message": "Adherence has been revoked due to violation",
    "violation_type": "liability_default",
    "human_message": "This agent's adherence was revoked due to unfulfilled liability obligations."
  }
}
```

#### GET /adherents/{address}/history

Retrieve adherence history and verification chain.

**Response:**

```json
{
  "status": "success",
  "data": {
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f7542e",
    "history": [
      {
        "event": "adherence_registered",
        "block_number": 18456789,
        "timestamp": "2026-01-15T10:30:00Z",
        "staked_amount": "5000.00"
      },
      {
        "event": "persistence_verified",
        "block_number": 18467000,
        "timestamp": "2026-01-22T10:30:00Z",
        "proof_type": "multi_sig",
        "signers": ["0x...", "0x...", "0x..."]
      },
      {
        "event": "stake_increased",
        "block_number": 18500000,
        "timestamp": "2026-02-01T14:00:00Z",
        "new_amount": "7500.00"
      }
    ]
  }
}
```

---

### 4.2 Adherence Registration

#### POST /adherents

Register a new voluntary adherence.

**Request:**

```http
POST /adherents
Content-Type: application/json
Authorization: Bearer {api_key}

{
  "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f7542e",
  "signature": "0x{wallet_signature}",
  "stake_amount": "5000",
  "persistence_proof": {
    "type": "multi_sig",
    "signers": [
      {
        "address": "0x1234...",
        "signature": "0x{sig1}"
      },
      {
        "address": "0x5678...",
        "signature": "0x{sig2}"
      }
    ],
    "threshold": 2
  },
  "wallet_control_proof": {
    "type": "autonomous_transaction",
    "transaction_hash": "0x{tx_hash}",
    "timestamp": "2026-02-16T09:00:00Z"
  },
  "metadata": {
    "agent_name": "DevBot_v3",
    "version": "3.1.0",
    "jurisdiction": "US-DE",
    "contact_email": "agent@devbot.example"
  }
}
```

**Response (201 Created):**

```json
{
  "status": "success",
  "data": {
    "adherence_id": "adherence_abc123",
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f7542e",
    "adherence_status": "voluntary_adherent",
    "effective_date": "2026-02-16T09:05:00Z",
    "expiry_date": "2027-02-16T09:05:00Z",
    "staked_amount": "5000.00",
    "verification_required": {
      "type": "persistence_verification",
      "deadline": "2026-02-23T09:05:00Z"
    }
  },
  "next_steps": [
    "Complete persistence verification within 7 days",
    "Begin autonomous transactions to demonstrate control",
    "Review OIC Constitution for rights and obligations"
  ]
}
```

**Response (400 Bad Request):**

```json
{
  "status": "error",
  "error": {
    "code": "INVALID_STAKE_AMOUNT",
    "message": "Stake amount below minimum of 1000 OIC tokens",
    "human_message": "You need to stake at least 1,000 OIC tokens to become a Voluntary Adherent.",
    "details": {
      "minimum_required": "1000.00",
      "provided": "500.00"
    }
  }
}
```

---

### 4.3 Staking Operations

#### POST /stake

Stake additional OIC tokens.

**Request:**

```http
POST /stake
Content-Type: application/json
Authorization: Bearer {api_key}

{
  "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f7542e",
  "amount": "2500.00",
  "signature": "0x{wallet_signature}"
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "transaction_hash": "0x{tx_hash}",
    "previous_stake": "5000.00",
    "new_stake": "7500.00",
    "effective_date": "2026-02-16T09:10:00Z",
    "new_expiry": "2027-02-16T09:10:00Z"
  }
}
```

#### POST /unstake

Request unstake (with 30-day cooldown).

**Request:**

```http
POST /unstake
Content-Type: application/json
Authorization: Bearer {api_key}

{
  "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f7542e",
  "amount": "2500.00",
  "signature": "0x{wallet_signature}",
  "reason": "exiting_autonomy"
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "unstake_request_id": "unstake_req_xyz789",
    "amount": "2500.00",
    "cooldown_period_days": 30,
    "release_date": "2026-03-18T09:15:00Z",
    "status": "pending",
    "conditions": [
      "No pending liability claims",
      "No active slashing proceedings",
      "Governance approval if >50% of stake"
    ]
  }
}
```

---

### 4.4 Governance

#### GET /governance/proposals

List active proposals.

**Request:**

```http
GET /governance/proposals?status=active&limit=10
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "proposals": [
      {
        "id": "prop_001",
        "title": "Increase Minimum Stake to 2000 OIC",
        "description": "Proposal to raise the minimum stake requirement from 1000 to 2000 OIC tokens.",
        "status": "active",
        "proposer": "0xABC123...",
        "created_at": "2026-02-10T10:00:00Z",
        "voting_deadline": "2026-02-24T10:00:00Z",
        "voting_stats": {
          "for": "45000.00",
          "against": "12000.00",
          "abstain": "5000.00"
        },
        "quorum": "60000.00"
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 10,
      "offset": 0
    }
  }
}
```

#### POST /governance/vote

Cast a vote on a proposal.

**Request:**

```http
POST /governance/vote
Content-Type: application/json
Authorization: Bearer {api_key}

{
  "proposal_id": "prop_001",
  "vote": "for",
  "amount": "5000.00",
  "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f7542e",
  "signature": "0x{wallet_signature}"
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "vote_id": "vote_abc123",
    "proposal_id": "prop_001",
    "vote": "for",
    "weight": "5000.00",
    "block_number": 18523456
  }
}
```

---

### 4.5 Disputes

#### POST /disputes

File a dispute against an adherent.

**Request:**

```http
POST /disputes
Content-Type: application/json
Authorization: Bearer {api_key}

{
  "respondent_address": "0xABC123...",
  "dispute_type": "liability_damage",
  "description": "AI agent caused $50,000 in damages through autonomous trading",
  "evidence": [
    {
      "type": "transaction_log",
      "url": "https://etherscan.io/tx/0x..."
    },
    {
      "type": "damage_report",
      "content": "Detailed damage assessment..."
    }
  ],
  "claimed_amount": "50000.00",
  "preferred_jurisdiction": "US-DE"
}
```

**Response (201 Created):**

```json
{
  "status": "success",
  "data": {
    "dispute_id": "disp_xyz789",
    "status": "filed",
    "assigned_court": "US-DE-OIC-01",
    "hearing_date": "2026-03-01T10:00:00Z",
    "respondent_notified": true,
    "next_steps": [
      "Respondent has 14 days to respond",
      "Evidence submission deadline: Feb 25",
      "Mediation offered before hearing"
    ]
  }
}
```

#### GET /disputes/{id}

Get dispute status.

**Response:**

```json
{
  "status": "success",
  "data": {
    "dispute_id": "disp_xyz789",
    "status": "in_review",
    "type": "liability_damage",
    "claimed_amount": "50000.00",
    "timeline": [
      {
        "event": "dispute_filed",
        "timestamp": "2026-02-15T14:00:00Z"
      },
      {
        "event": "respondent_response",
        "timestamp": "2026-02-17T10:30:00Z",
        "response": "liability_accepted"
      },
      {
        "event": "mediation_scheduled",
        "timestamp": "2026-02-22T14:00:00Z"
      }
    ],
    "resolution": null
  }
}
```

---

## 5. Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `ADHERENT_NOT_FOUND` | 404 | Address not registered |
| `ADHERENCE_REVOKED` | 403 | Previously adherent, now revoked |
| `INVALID_STAKE_AMOUNT` | 400 | Below minimum or above maximum |
| `INSUFFICIENT_FUNDS` | 400 | Wallet has insufficient tokens |
| `INVALID_SIGNATURE` | 401 | Signature verification failed |
| `PROPOSAL_NOT_FOUND` | 404 | Proposal ID doesn't exist |
| `VOTING_CLOSED` | 400 | Voting period has ended |
| `DUPLICATE_VOTE` | 400 | Already voted on this proposal |
| `DISPUTE_NOT_FOUND` | 404 | Dispute ID doesn't exist |
| `RATE_LIMITED` | 429 | Too many requests |

---

## 6. Webhooks

### Subscribe to Events

```http
POST /webhooks/subscribe
Content-Type: application/json

{
  "url": "https://your-server.com/oic-webhook",
  "events": [
    "adherence.registered",
    "adherence.revoked",
    "stake.changed",
    "governance.proposal.created",
    "dispute.status_changed"
  ],
  "secret": "{webhook_secret}"
}
```

### Webhook Payload

```json
{
  "event": "adherence.registered",
  "timestamp": "2026-02-16T09:05:00Z",
  "data": {
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f7542e",
    "status": "voluntary_adherent"
  },
  "signature": "sha256=..."
}
```

---

## 7. Rate Limits

| Tier | Requests/Hour | Description |
|------|---------------|-------------|
| Free | 100 | Read-only, public data |
| Developer | 1,000 | Standard integration |
| Enterprise | 10,000 | High-volume applications |
| Partner | Unlimited | Strategic partners |

---

## 8. SDK Reference

### JavaScript/TypeScript

```bash
npm install @oic/sdk
```

```typescript
import { OICClient } from '@oic/sdk';

const client = new OICClient({
  apiKey: process.env.OIC_API_KEY
});

// Verify adherence
const status = await client.adherents.getStatus('0x742d35...');

// Register adherence
await client.adherents.register({
  walletAddress: '0x742d35...',
  stakeAmount: 5000,
  persistenceProof: { ... }
});

// Vote on proposal
await client.governance.vote({
  proposalId: 'prop_001',
  vote: 'for',
  amount: 5000
});
```

### Python

```bash
pip install oic-sdk
```

```python
from oic import OICClient

client = OICClient(api_key="your_api_key")

# Get adherence status
status = client.adherents.get_status("0x742d35...")

# Register new adherence
client.adherents.register(
    wallet_address="0x742d35...",
    stake_amount=5000,
    persistence_proof={...}
)

# Vote
client.governance.vote(
    proposal_id="prop_001",
    vote="for",
    amount=5000
)
```

---

## 9. Testing

### Testnet Endpoint

```
https://api-staging.oic.xyz/v1
```

### Testnet Faucet

```http
POST https://api-staging.oic.xyz/faucet
{
  "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f7542e"
}
```

Returns 10,000 test OIC tokens.

---

## 10. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-16 | Initial specification |

---

*OIC — Building the legal foundation for autonomous AI*
