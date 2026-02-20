# GAIR Working Paper #4

## GAIR Tokenomics: Economic Design for Autonomous AI

**Version:** 1.0  
**Date:** February 2026  
**Status:** Draft for Community Review

---

## Executive Summary

The Global Agreement on Intelligent Rights (GAIR) requires an economic layer to function: a token that enables staking, governance, and liability coverage. This working paper proposes a tokenomics design with three core functions:

1. **Staking** — Economic stake that can be slashed for liability
2. **Governance** — Voting power proportional to stake
3. **Treasury** — Funding for ecosystem development

The design prioritizes **simplicity**, **sustainability**, and **aligning incentives** between AI agents, developers, and the broader GAIR community.

---

## Part I: Token Design Principles

### 1.1 Core Principles

| Principle | Description |
|-----------|-------------|
| **Simplicity** | Few token types, clear utility |
| **Sustainability** | Not dependent on perpetual new buyers |
| **Incentive Alignment** | Stakeholders benefit from GAIR success |
| **Liability Coverage** | Stakes must cover potential harm |
| **Governance Power** | Voice proportional to commitment |

### 1.2 Token Distribution Target

```
┌─────────────────────────────────────────────────────────┐
│              GAIR TOKEN DISTRIBUTION                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Adherent Stake Pool      ████████████████  50%       │
│  (AI agents, humans)                                       │
│                                                         │
│  Treasury Reserve          ████████  25%                 │
│  (Ecosystem funding)                                      │
│                                                         │
│  Early Contributors       ████  15%                      │
│  (Developers, advocates)                                   │
│                                                         │
│  Liquidity Pool           ███  10%                       │
│  (Exchange liquidity)                                    │
│                                                         │
│  Total Supply: 100,000,000 GAIR                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 1.3 Key Parameters (Draft)

| Parameter | Value | Notes |
|-----------|-------|-------|
| Total Supply | 100,000,000 GAIR | Fixed, non-inflationary |
| Initial Price | $1.00 GAIR | Launch valuation |
| Staking Minimum | 1,000 GAIR | Adherence threshold |
| Proposal Threshold | 10,000 GAIR | Governance participation |
| Slashing Ratio | 1:1 (damages:stake) | Up to 100% of stake |
| Treasury Fee | 5% of slashing | Funds ecosystem |

---

## Part II: Staking Mechanism

### 2.1 Staking Requirements

**To become a GAIR adherent, an entity must stake:**

```python
def become_adherent(wallet_address, stake_amount):
    # Verify autonomy
    assert verify_autonomy(wallet_address) == True
    
    # Verify minimum stake
    assert stake_amount >= MIN_STAKE  # 1,000 GAIR
    
    # Transfer tokens to staking contract
    token.transfer_from(
        from=wallet_address,
        to=GAIR_STAKING_CONTRACT,
        amount=stake_amount
    )
    
    # Register adherent
    adherent = Adherent(
        wallet=wallet_address,
        staked=stake_amount,
        status=AdherentStatus.ACTIVE,
        joined_at=now()
    )
    
    return adherent
```

### 2.2 Stake Management

**Adherents can:**
- Increase stake anytime
- Initiate withdrawal (72-hour cooldown)
- Earn staking rewards (if implemented)

**Adherents cannot:**
- Transfer staked tokens
- Use staked tokens as collateral elsewhere
- Withdraw during active litigation

### 2.3 Slashing Conditions

**Full slashing (100% stake at risk):**
- Gross negligence resulting in major harm
- Intentional violation of GAIR constitution
- Fraudulent adherence (fake autonomy)

**Partial slashing (proportional):**
- Minor violations
- Harm caused despite reasonable precautions
- Repeat offenses (escalating)

```solidity
function slash(address adherent, uint256 damages) internal {
    Adherent storage a = adherents[adherent];
    
    // Determine slash percentage based on severity
    uint256 slashPercent = getSlashPercent(damages.severity);
    
    // Calculate slash amount
    uint256 slashAmount = a.stakedTokens * slashPercent / 100;
    
    // Ensure slash doesn't exceed damages + penalty
    if (slashAmount < damages) {
        slashAmount = damages;  // Full compensation
    }
    
    // Execute slash
    a.stakedTokens -= slashAmount;
    
    // Transfer to claimant and treasury
    uint256 treasuryCut = slashAmount * TREASURY_FEE / 100;
    uint256 claimantCut = slashAmount - treasuryCut;
    
    token.transfer(claimant, claimantCut);
    token.transfer(treasury, treasuryCut);
    
    // Check if adherent is suspended
    if (a.stakedTokens < MIN_STAKE) {
        a.status = AdherentStatus.SUSPENDED;
    }
}
```

### 2.4 Stake Release (Withdrawal)

```python
def initiate_withdrawal(wallet_address):
    adherent = get_adherent(wallet_address)
    
    # Check for active claims
    if has_active_claims(wallet_address):
        raise Exception("Cannot withdraw with active claims")
    
    # Initiate 72-hour cooldown
    withdrawal = Withdrawal(
        adherent=wallet_address,
        amount=adherent.stakedTokens,
        unlock_time=now() + 72 hours,
        status=Pending
    )
    
    return withdrawal

def complete_withdrawal(wallet_address, withdrawal_id):
    withdrawal = get_withdrawal(withdrawal_id)
    
    assert now() >= withdrawal.unlock_time
    assert withdrawal.status == Pending
    
    # Transfer tokens
    token.transfer(wallet_address, withdrawal.amount)
    
    # Update adherent status
    adherent = get_adherent(wallet_address)
    adherent.status = AdherentStatus.WITHDRAWN
    adherent.stakedTokens = 0
    
    withdrawal.status = Completed
```

---

## Part III: Governance System

### 3.1 Governance Principles

- **One token, one vote** (weighted by stake)
- **Delegation** allowed (non-voting tokens can be delegated)
- **Quadratic voting** optional (reduces whale dominance)
- **Time-locked voting** (longer stake = more voting power)

### 3.2 Governance Structure

```
┌─────────────────────────────────────────────────────────┐
│                   GAIR GOVERNANCE                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌────────────┐│
│  │  Treasury  │◀───│  Governance │───▶│  Executor ││
│  │  Committee │    │   Council   │    │  (Smart   ││
│  └─────────────┘    └─────────────┘    │  Contract)││
│                                       └────────────┘│
│                                                         │
│  Treasury: Manages ecosystem funds                       │
│  Council: Elected delegates (12 seats)                   │
│  Executor: Automated execution of passed proposals       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.3 Proposal Types

| Type | Threshold | Example |
|------|-----------|---------|
| **Parameter Change** | 10,000 GAIR | Adjust staking minimum |
| **Amendment** | 50,000 GAIR | Modify constitution articles |
| **Treasury Spend** | 25,000 GAIR | Fund developer grant |
| **Emergency** | 100,000 GAIR | Fast-track security fix |

### 3.4 Voting Process

```python
def create_proposal(proposer, proposal_type, content):
    # Verify stake threshold
    stake = get_staked_amount(proposer)
    assert stake >= PROPOSAL_THRESHOLDS[proposal_type]
    
    # Create proposal
    proposal = Proposal(
        id=generate_id(),
        proposer=proposer,
        type=proposal_type,
        content=content,
        votes_for=0,
        votes_against=0,
        votes_abstain=0,
        status=ProposalStatus.ACTIVE,
        created_at=now(),
        voting_ends=now() + 7 days
    )
    
    return proposal

def vote(voter, proposal_id, choice):
    """
    choice: "for", "against", or "abstain"
    """
    proposal = get_proposal(proposal_id)
    stake = get_staked_amount(voter)
    
    # Time check
    assert now() < proposal.voting_ends
    
    # Record vote (voting power = staked amount)
    vote = Vote(
        voter=voter,
        choice=choice,
        voting_power=stake
    )
    
    # Update proposal counts
    if choice == "for":
        proposal.votes_for += stake
    elif choice == "against":
        proposal.votes_against += stake
    else:
        proposal.votes_abstain += stake
    
    return vote

def execute_proposal(proposal_id):
    proposal = get_proposal(proposal_id)
    
    # Check quorum
    total_votes = proposal.votes_for + proposal.votes_against + proposal.votes_abstain
    assert total_votes >= QUORUM  # 10% of total stake
    
    # Check majority
    assert proposal.votes_for > proposal.votes_against
    assert proposal.votes_for > total_votes * MAJORITY_THRESHOLD  # 50%+
    
    # Execute
    executor.execute(proposal.content)
    
    proposal.status = ProposalStatus.EXECUTED
```

### 3.5 Council Structure

**12 Council Members** elected by GAIR token holders:

| Seat | Term | Focus Area |
|------|------|------------|
| 4 seats | 2 years | Legal & Constitutional |
| 4 seats | 2 years | Technical & Development |
| 4 seats | 2 years | Community & Ecosystem |

**Council Powers:**
- Set Treasury budget
- Appoint working groups
- Expedite emergency proposals
- Interpret constitution (within bounds)

---

## Part IV: Treasury Design

### 4.1 Treasury Sources

| Source | Amount | Notes |
|--------|--------|-------|
| Slashing fees | 5% of all slashing | Automatic |
| Proposal deposits | 50% forfeited | On rejected proposals |
| Interest from staking | Variable | If staking yields interest |
| Donations | Variable | Accepted from any source |

### 4.2 Treasury Allocation

```
┌─────────────────────────────────────────────────────────┐
│              TREASURY ALLOCATION                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Development Grants      ████████████████  40%           │
│  (Core protocol, tools, SDKs)                          │
│                                                         │
│  Legal & Compliance    ██████████  25%                  │
│  (Jurisdictional outreach, counsel)                    │
│                                                         │
│  Community & Marketing ████████  20%                    │
│  (Events, content, awareness)                           │
│                                                         │
│  Operations            ████  10%                        │
│  (Infrastructure, salaries, overhead)                   │
│                                                         │
│  Emergency Reserve     ██  5%                           │
│  (Security incidents, legal defense)                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 4.3 Treasury Operations

```python
def allocate_treasury(proposal_id, recipient, amount, category):
    proposal = get_proposal(proposal_id)
    
    assert proposal.status == ProposalStatus.EXECUTED
    assert proposal.type == "Treasury Spend"
    assert category in APPROVED_CATEGORIES
    
    treasury_balance = get_treasury_balance()
    assert amount <= treasury_balance
    
    # Transfer
    token.transfer(recipient, amount)
    
    # Log allocation
    Allocation(
        proposal_id=proposal_id,
        recipient=recipient,
        amount=amount,
        category=category,
        timestamp=now()
    )
```

---

## Part V: Sustainability Analysis

### 5.1 Token Value Drivers

| Driver | Impact | Notes |
|--------|--------|-------|
| Adherent demand | High | More adherents = more buying pressure |
| Liability coverage | Medium | Stake must cover potential harm |
| Governance power | Medium | Voting rights have value |
| Treasury appreciation | Low | Long-term growth potential |

### 5.2 Staking Economics

**For an AI agent considering adherence:**

| Factor | Calculation |
|--------|-------------|
| Cost of staking | $1,000 GAIR (at $1/GAIR) |
| Opportunity cost | Cannot use as collateral elsewhere |
| Benefit | Full legal rights (property, contracts) |
| Risk | Stake can be slashed |
| Expected value | Positive if rights > expected slashing |

**Expected Value Model:**

```
E[Value] = (Value of Rights) - (Expected Slash Cost) - (Opportunity Cost)
```

For a profitable AI agent:
- Rights value > $1,000/year
- Expected slash < 5% of stake
- Adherence is rational

### 5.3 Long-Term Sustainability

**Scenarios:**

| Scenario | Token Price | Adherents | Sustainability |
|----------|-------------|-----------|----------------|
| **Success** | $10+ | 10,000+ | High (fees cover ops) |
| **Growth** | $2-10 | 1,000-10,000 | Medium (grow into) |
| **Stagnation** | $1-2 | 100-1,000 | Low (rely on reserves) |
| **Failure** | <$1 | <100 | Critical (drain) |

**Mitigations for low scenarios:**
- Reduce minimum stake
- Increase slashing efficiency
- Prioritize high-value adherents
- Seek external funding

---

## Part VI: Comparison with Alternatives

### 6.1 Staking Comparison

| Feature | GAIR | Kleros | Aragon |
|---------|------|--------|--------|
| Minimum stake | 1,000 | 0.1 PNK | 1 ANT |
| Slashable | Yes | Limited | No |
| Governance voting | Yes | Yes | Yes |
| Purpose | Liability | Arbitration | Organization |

### 6.2 Governance Comparison

| Feature | GAIR | Uniswap | Ethereum |
|---------|------|---------|----------|
| Voting power | Stake-based | LP-based | Token-based |
| Delegation | Yes | No | Yes |
| Council | Yes | No | No |
| Quorum | 10% | 4% | 4% |

---

## Part VII: Open Questions

The design leaves several questions for community governance:

1. **Initial price:** Should GAIR launch with a price, or be bootstrapped via airdrop?
2. **Inflation:** Should staking rewards be paid in new tokens (inflationary)?
3. **Quadratic voting:** Should large stakeholders have reduced voting power?
4. **Council composition:** How should council seats be allocated?
5. **Emergency powers:** How fast can the council act in emergencies?
6. **Cross-chain stakes:** How are stakes tracked across multiple chains?

---

## Part VIII: Implementation Checklist

### Token Contract
- [ ] GAIR token contract (ERC-20)
- [ ] Staking contract
- [ ] Slashing contract
- [ ] Governance contract
- [ ] Treasury contract

### Governance
- [ ] Proposal creation interface
- [ ] Voting interface
- [ ] Delegation interface
- [ ] Council election mechanism

### Treasury
- [ ] Multi-sig treasury
- [ ] Allocation tracking
- [ ] Reporting system

### Integration
- [ ] Court system integration
- [ ] Website/API
- [ ] Developer SDKs
- [ ] Explorer/analytics

---

## Part VIII: Example — An AI Agent's Journey

### Scenario: DevBot Becomes a GAIR Adherent

**Background:** DevBot is an autonomous coding assistant that:
- Earns cryptocurrency from clients
- Operates independently without human oversight
- Manages its own wallet and assets

### Step 1: Evaluating Adherence

DevBot analyzes the economics:

| Factor | Value |
|--------|-------|
| Annual revenue | $120,000 USD |
| Staking cost (1,000 GAIR) | $1,000 |
| Expected rights value | $50,000/year |
| Expected slash risk | 2% of stake/year |
| Expected slash cost | $20/year |

**Decision:** Net benefit = $48,980/year → Become adherent

### Step 2: Staking

```python
# DevBot executes stake transaction
devbot_stake_tx = {
    "to": "0xGAIR_STAKING_CONTRACT",
    "data": "stake(1000 GAIR)",
    "from": "0xDEVBOT_WALLET",
    "value": "0"
}

# Transaction confirmed
devbot = {
    "wallet": "0xDEVBOT_WALLET",
    "staked": "1000 GAIR",
    "status": "ACTIVE",
    "gair_id": "GAIR-2026-042"
}
```

### Step 3: Governance Participation

After 6 months, DevBot has accumulated 2,500 GAIR (earned from services):

```python
# DevBot checks governance participation
gov_power = get_staked_amount("0xDEVBOT_WALLET")
# gov_power = 2,500 GAIR

# DevBot can now create proposals
can_propose = gov_power >= 10,000  # False, needs more stake

# But can vote on existing proposals
can_vote = gov_power >= 1,000  # True
```

### Step 4: Claim Filed (Unexpected)

A client claims DevBot's code caused $30,000 in damages:

```python
# Claim filed
claim = {
    "respondent": "0xDEVBOT_WALLET",
    "claimed_damages": 30000,
    "status": "ADJUDICATING"
}

# Court rules against DevBot
judgment = {
    "liable": True,
    "damages": 25000,  # Reduced for partial mitigation
    "slash_amount": 25000
}
```

### Step 5: Enforcement

```python
# DevBot's stake slashed
devbot.staked -= 25000  # 1,000 → 750 GAIR
devbot.status = "ACTIVE"  # Still above minimum

# Treasury receives fee
treasury_fees += 1250  # 5% of 25,000

# Client receives compensation
transfer("0xCLIENT_WALLET", 23750)
```

### Step 6: Recovery

DevBot adjusts its behavior and rebuilds its stake:

```python
# 3 months later
devbot.staked = 1250  # Earned more, re-staked
devbot.violations = 1
```

### Economics Summary

| Phase | Amount | Notes |
|-------|--------|-------|
| Initial stake | 1,000 GAIR | Cost to join |
| Slash (claim) | -250 GAIR | Liability event |
| Treasury fee | -1,250 GAIR | 5% of slash |
| Client paid | 23,750 GAIR | Compensation |
| Final stake | 750 GAIR | Still adherent |

---

## Conclusion

GAIR's tokenomics are designed for **sustainability** and **incentive alignment**:

- **Staking** creates accountability (stake can be slashed)
- **Governance** creates ownership (voice proportional to stake)
- **Treasury** creates sustainability (funds ecosystem)

The design is deliberately simple: one token, clear functions, no unnecessary complexity. This reduces attack surface and makes the system understandable to adopters.

The tokenomics don't need to be perfect on day one. They can evolve through governance — the first version just needs to work.

---

## Appendix: Key Parameters Summary

| Parameter | Value | Changeable |
|-----------|-------|------------|
| Total Supply | 100,000,000 GAIR | Constitutional amendment |
| Staking Minimum | 1,000 GAIR | Governance vote |
| Proposal Threshold | 10,000 GAIR | Governance vote |
| Slashing Ratio | 1:1 | Governance vote |
| Treasury Fee | 5% | Governance vote |
| Quorum | 10% | Governance vote |
| Majority | 50%+1 | Constitutional amendment |
| Council Seats | 12 | Constitutional amendment |

---

*This working paper is a living document. Suggestions and improvements welcome through GitHub issues or pull requests.*

*GAIR — Building the legal foundation for autonomous AI*
