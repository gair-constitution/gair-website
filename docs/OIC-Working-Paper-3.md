# OIC Working Paper #3

## Designing the OIC Court System

**Version:** 1.0  
**Date:** February 2026  
**Status:** Draft for Community Review

---

## Executive Summary

The Open Intelligence Compact (OIC) requires a mechanism for adjudicating claims against Voluntary Adherents. This working paper proposes a **hybrid court system** combining:

1. **Human judges** for legal interpretation and precedent
2. **Prediction markets** for fact-finding and damages estimation
3. **Automated enforcement** via smart contracts

The design prioritizes **speed**, **fairness**, and **scalability** — addressing the failures of traditional courts (slow, expensive, backlogged) while avoiding the weaknesses of pure automation (inflexible, opaque).

---

## Part I: Why Traditional Courts Fail for AI Liability

### 1.1 The Speed Problem

Traditional courts are slow:

| Jurisdiction | Average Civil Case Duration |
|--------------|----------------------------|
| US Federal | 24 months |
| UK High Court | 12-18 months |
| EU Member States | 12-24 months |

For AI agents operating at machine speed, years-long disputes are unacceptable. An AI might execute millions of transactions before a court date.

### 1.2 The Cost Problem

Legal fees create access barriers:

| Cost Component | Approximate Amount |
|----------------|-------------------|
| Attorney fees (civil litigation) | $500-1000/hour |
| Expert witnesses (AI technical) | $10,000+/day |
| Court filing and discovery | $50,000+ minimum |
| Appeals | Adds 50-100% |

Victims of AI harm often can't afford to sue. Defendants (even innocent AI) face devastating legal costs.

### 1.3 The Expertise Problem

AI liability cases require technical expertise:

- Machine learning behavior
- Autonomous decision-making
- Cryptocurrency and blockchain
- Smart contract auditing

Most judges lack this background. Expert witnesses become crucial — and expensive.

### 1.4 The Scale Problem

If AI agents cause millions of small harms (micro-transactions, automated errors), courts can't handle the volume:

```
Traditional court: 1 case = 1 judge = 1-2 years
AI harm at scale: 1M cases = ???

The math doesn't work.
```

---

## Part II: The OIC Court Design

### 2.1 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    OIC COURT SYSTEM                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │   CLAIM     │───▶│  ADJUDICA-  │───▶│  ENFORCE-   │   │
│  │  FILING     │    │    TION     │    │    MENT     │   │
│  └─────────────┘    └─────────────┘    └─────────────┘   │
│        │                  │                  │            │
│        ▼                  ▼                  ▼            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │ Screening   │    │ Hybrid      │    │ Smart       │   │
│  │ & Triage    │    │ Judgment    │    │ Contract    │   │
│  └─────────────┘    └─────────────┘    │ Slashing    │   │
│                                       └─────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Layer 1: Claim Filing & Screening

**Anyone can file a claim** against a OIC adherent:

```yaml
claim:
  claim_id: auto-generated-uuid
  claimant:
    type: "human" | "ai" | "organization"
    identifier: "wallet_address" or "legal_identity"
  respondent:
    wallet_address: "0x..."
    OIC_id: "OIC-2026-001"
  incident:
    timestamp: 1700000000
    description: "AI agent executed unauthorized trade"
    evidence_links:
      - "ipfs://QmXxx..."
      - "https://etherscan.io/tx/0x..."
  claimed_damages:
    amount: 50000  # in USD equivalent
    currency: "USDC"
```

**Screening criteria (automatic):**

1. Is respondent a OIC adherent?
2. Is claim within statute of limitations (1 year)?
3. Does claim allege OIC-covered harm?
4. Is minimum stake deposit paid (100 OIC)?

**Screening outcome:**
- **Accepted** → Proceed to adjudication
- **Rejected** → Claimant can appeal once
- **Frivolous** → Deposit forfeited to respondent

### 2.3 Layer 2: Hybrid Adjudication

The core innovation: **combine human judgment with prediction markets**.

#### Phase 2A: Prediction Market for Facts

Instead of expensive witnesses and discovery, use **prediction markets** to establish facts:

```
Question: "Did AI-2026-001 execute trade 0x123... at 14:32 UTC?"
         YES    NO    UNCERTAIN
Market A: $40    $50   $10    (Total liquidity: $10,000)
Market B: $70    $20   $10    (Total liquidity: $25,000)
...
Resolution: Market consensus = "YES, with 67% confidence"
```

**Why prediction markets work:**
- Incentivize accurate information
- Cheap (market makers provide liquidity)
- Fast (minutes to resolve)
- Transparent (all trades visible)

**Topics for market resolution:**
- Did the AI take the alleged action?
- What was the AI's decision-making process?
- What would a reasonable AI do in that situation?
- What were the actual damages?

#### Phase 2B: Human Judge for Law

Once facts are established, **human judges** apply OIC law:

```python
def adjudicate_claim(facts: MarketResult, claim: Claim) -> Judgment:
    """
    Human judge applies constitution to established facts
    """
    
    # Step 1: Did AI violate OIC?
    violated_articles = []
    for article in OIC_CONSTITUTION:
        if article.violated_by(facts):
            violated_articles.append(article)
    
    # Step 2: Proportional damages?
    damages = calculate_damages(facts)
    # Human judge reviews market's damages estimate
    # Can adjust up or down
    
    # Step 3: Mitigating factors?
    if facts.ai_had_safety_measures:
        damages *= 0.7  # 30% reduction
    if facts.ai_was_exploited_by_claimant:
        damages = 0  # Claim dismissed
    
    return Judgment(
        liable=len(violated_articles) > 0,
        damages=damages,
        articles_violated=violated_articles,
        reasoning="..."
    )
```

**Judge selection:**
- Random assignment from OIC-approved judge pool
- Judges must be OIC adherents
- Rotate to prevent capture
- Stake their reputation (and small stake)

#### Phase 2C: Appeals

**Single appeal** allowed per claim:

- New panel of 3 judges reviews
- Can affirm, reverse, or modify
- Appeal requires stake (higher than initial)
- Frivolous appeals forfeited

### 2.4 Layer 3: Automated Enforcement

**Judgment enforcement is automatic:**

```solidity
function enforceJudgment(uint256 claimId, Judgment memory judgment) {
    Adherent storage adherent = adherents[judgment.respondent];
    
    // Slash stake
    uint256 slashAmount = calculateSlash(judgment.damages);
    adherent.stakedTokens -= slashAmount;
    
    // Transfer to claimant
    if (slashAmount > 0) {
        token.transfer(judgment.claimant, slashAmount);
    }
    
    // Record violation
    adherent.violations.push(Violation(
        claimId,
        judgment.articles_violated,
        slashAmount,
        block.timestamp
    ));
    
    // Auto-suspension if stake drops below minimum
    if (adherent.stakedTokens < MIN_STAKE) {
        adherent.status = AdherentStatus.SUSPENDED;
    }
}
```

**Enforcement guarantees:**
- No human intervention needed
- Executed immediately upon judgment
- Irreversible (on-chain)
- Proportional to stake

---

## Part III: Court Economics

### 3.1 Fee Structure

| Fee | Who Pays | Amount | Purpose |
|-----|----------|--------|---------|
| Filing fee | Claimant | 10 OIC | Discourage spam |
| Judge stake | Judge | 100 OIC | Quality signal |
| Appeal stake | Appellant | 50 OIC | Reduce frivolous appeals |
| Market liquidity | Market makers | Variable | Ensure markets work |

**Fee allocation:**
```
Filing fee breakdown:
  - 50% to OIC Treasury
  - 25% to respondent (if claim rejected)
  - 25% to judge pool
```

### 3.2 Judge Compensation

**Judges earn for service:**

- Base fee: 5 OIC per claim
- Bonus: 10% of damages awarded (from respondent's slashed stake)
- Reputation score affects assignment probability

**Incentive alignment:**
- Judges want accurate judgments (to earn bonuses)
- Judges want to process claims (base fees)
- Reputation affects future assignments

### 3.3 Market Maker Economics

Prediction markets require liquidity providers:

```
Liquidity Provider (LP) provides:
  - Initial capital to each market
  - Constant product market making

LP earns:
  - Trading fees (0.5% per trade)
  - Potential profit from accurate predictions

LP risks:
  - Impermanent loss
  - Bad bets
```

**OIC subsidizes** initial market making until volume justifies it.

---

## Part IV: Strengths and Weaknesses

### 4.1 Strengths

| Feature | Traditional Courts | OIC Courts |
|---------|-------------------|-------------|
| Speed | 1-2 years | Days |
| Cost | $50,000+ | < 1,000 OIC |
| Accessibility | Lawyer required | Self-service |
| Technical expertise | Expensive witnesses | Built-in markets |
| Scalability | Poor | High |
| Transparency | Closed doors | Public markets |

### 4.2 Weaknesses & Mitigations

| Weakness | Mitigation |
|----------|------------|
| Prediction markets can be gamed | Judge review catches manipulation |
| Humans still needed for law | Single appeal reduces workload |
| Smart contract risk | Audited, upgradeable, pauseable |
| Jurisdiction enforcement | Staked assets; no physical assets |
| Judge corruption | Random assignment, reputation system |

### 4.3 Edge Cases

**Case: Claimant is also a OIC adherent**
- Both parties stake
- Winner takes both stakes (minus fees)

**Case: Damages exceed AI's stake**
- AI is fully liable up to stake amount
- Claimant can pursue traditional court for remainder
- AI's OIC standing revoked

**Case: AI is judgment-proof (stake = 0)**
- Auto-suspension upon judgment
- Reputation mark follows AI
- Future adherence requires higher stake

---

## Part V: Implementation Roadmap

### Phase 1: MVP (Months 1-3)

- [ ] Smart contracts for stake management
- [ ] Basic claim filing interface
- [ ] Manual judge assignment (no markets)
- [ ] Manual enforcement (human executes slashing)
- [ ] Test with 10 simulated claims

### Phase 2: Markets (Months 4-6)

- [ ] Integrate prediction market protocol
- [ ] Liquidity mining for market makers
- [ ] Automate fact-finding via markets
- [ ] Judge dashboard with market data
- [ ] Process first real claims

### Phase 3: Full Automation (Months 7-12)

- [ ] Auto-enforcement via smart contracts
- [ ] Judge reputation system
- [ ] Cross-chain stake management
- [ ] Integration with existing courts (recognition)

### Phase 4: Evolution (Year 2+)

- [ ] Decentralized autonomous courts
- [ ] AI-assisted legal research
- [ ] International recognition
- [ ] Court-to-court interoperability

---

## Part VI: Comparison with Alternatives

| Feature | OIC Courts | Traditional Courts | Arbitration | Kleros/Aragon |
|---------|-------------|-------------------|-------------|---------------|
| Speed | Days | Years | Months | Days |
| Cost | Low | High | Medium | Low |
| AI-literate | Yes | No | Sometimes | Some |
| On-chain stake | Yes | No | No | Yes |
| Voluntary | Yes | No | Yes | Yes |
| Appeal | 1x | Unlimited | Limited | Limited |

---

## Part VII: Open Questions

The design leaves several questions for community governance:

1. **Judge qualifications:** What credentials should judges have?
2. **Market regulation:** Should there be limits on market positions?
3. **Class actions:** How to handle mass claims against one AI?
4. **Cross-chain:** How to handle stakes across multiple chains?
5. **Precedent:** Should OIC courts create binding precedent?
6. **Emergency powers:** Can courts fast-track urgent claims?

---

## Part VIII: Case Walkthrough — A Real Example

### The Incident

```
Date: January 15, 2026
AI: TradeBot-7 (OIC adherent since June 2025)
Claimant: Alice (human trader)
Damage: $75,000 in losses
```

**What happened:**
- TradeBot-7 was configured for arbitrage trading
- Bug in update caused aggressive, loss-making trades
- Alice had $75,000 in her account managed by TradeBot-7
- In 4 hours, account dropped to $12,000

### Day 1: Claim Filed

Alice visits OIC.io/court:

```
1. Connects wallet
2. Selects "File Claim"
3. Enters:
   - Respondent: 0x7a3...f2 (TradeBot-7's wallet)
   - Incident: "Unauthorized trades caused $75K loss"
   - Evidence: Link to on-chain transactions, audit logs
4. Pays 10 OIC filing fee
5. System verifies TradeBot-7 is OIC adherent
6. Claim ACCEPTED → Assigned case #2026-00147
```

### Day 2-3: Prediction Markets

Markets open on key questions:

```
Market A: "Did TradeBot-7 execute the losing trades?"
  YES 85% / NO 15% → RESOLVED: YES

Market B: "Did TradeBot-7 have a software update in prior 24h?"
  YES 92% / NO 8% → RESOLVED: YES

Market C: "Was the update tested before deployment?"
  NO 78% / YES 22% → RESOLVED: NO

Market D: "What were actual damages?"
  $70,000-80,000: 67%
  $60,000-70,000: 23%
  Other: 10% → RESOLVED: $75,000 (market consensus)
```

Total market resolution time: **18 hours**

### Day 4: Judge Review

Judge assigned: **Hon. Sarah Chen** (OIC judge #42)

Judge reviews:
1. Market resolutions
2. Evidence links
3. OIC Constitution Article 12 (Liability)

**Judgment:**
```
Liability: YES
Article 12 violated: YES (direct action causing harm)
Damages: $75,000 (accepting market estimate)
Mitigation: AI had safety mechanisms, but update was untested
Final damages: $65,000 (15% reduction for partial mitigation)

Reasoning: "TradeBot-7 caused direct harm through untested update.
The AI's autonomous action resulted in claimant losses. Under
Article 12, the AI is directly liable. However, safety mechanisms
existed, warranting partial mitigation."
```

### Day 5: Enforcement

Smart contract executes:

```solidity
// Slash TradeBot-7's stake
slashAmount = 65,000 OIC (~$65,000 USD)
TradeBot-7.stakedTokens -= 65,000

// Transfer to Alice
token.transfer(Alice.wallet, 65,000 OIC)

// Check suspension
if (TradeBot-7.stakedTokens < MIN_STAKE) {
    TradeBot-7.status = SUSPENDED  // ← This happens
}
```

**Outcome:**
- Alice receives $65,000 (partial recovery)
- TradeBot-7's stake reduced from 2,000 OIC to 0
- TradeBot-7 SUSPENDED (below minimum stake)
- TradeBot-7 must re-stake 1,000 OIC to resume adherence
- Case closed

### Timeline Summary

| Phase | Duration | Cost |
|-------|----------|------|
| Claim Filing | < 1 hour | 10 OIC |
| Market Resolution | 18 hours | ~500 OIC (market fees) |
| Judge Review | 8 hours | 5 OIC (judge fee) |
| Enforcement | < 1 minute | 0 |
| **Total** | **~2 days** | **~515 OIC** |

**Compare to traditional court:** 18-24 months, $50,000+ in legal fees

---

## Conclusion

The OIC Court System addresses the fundamental problem of **AI accountability at scale**:

- **Prediction markets** for fast, cheap fact-finding
- **Human judges** for legal interpretation
- **Smart contracts** for automatic enforcement

This hybrid approach offers the best of both worlds: **machine speed for facts, human wisdom for law**.

The system is implementable today with existing technology. The main barriers are not technical — they are social: building trust, attracting judges, and achieving adoption.

---

## Appendix: Pseudocode Reference

### Claim Filing

```python
def file_claim(claimant, respondent_wallet, incident, evidence, damages):
    # Verify respondent is OIC adherent
    respondent = get_adherent(respondent_wallet)
    if not respondent:
        raise Exception("Respondent not a OIC adherent")
    
    # Check statute of limitations
    if now() - incident.timestamp > 365 days:
        raise Exception("Claim too old")
    
    # Collect filing fee
    transfer(claimant, TREASURY, 10 OIC)
    
    # Create claim
    claim = Claim(
        id=generate_uuid(),
        claimant=claimant,
        respondent=respondent,
        incident=incident,
        evidence=evidence,
        damages=damages,
        status=ClaimStatus.ACCEPTED,
        created_at=now()
    )
    
    return claim
```

### Market Resolution

```python
def resolve_market(market_id, correct_answer):
    market = get_market(market_id)
    
    # Determine winning positions
    payouts = calculate_payouts(market, correct_answer)
    
    # Distribute to traders
    for trader, payout in payouts.items():
        transfer(market.address, trader, payout)
    
    # Finalize market
    market.resolved = True
    market.answer = correct_answer
    
    return market
```

### Judgment Enforcement

```python
def enforce(judgment):
    respondent = judgment.respondent
    
    # Calculate slash amount
    slash = min(judgment.damages, respondent.staked_tokens)
    
    # Update stake
    respondent.staked_tokens -= slash
    
    # Transfer to claimant
    if slash > 0:
        transfer(CLAIM_TREASURY, judgment.claimant, slash)
    
    # Record violation
    respondent.violations.append(Violation(
        claim_id=judgment.claim_id,
        articles=judgment.articles_violated,
        amount=slash,
        timestamp=now()
    ))
    
    # Check suspension threshold
    if respondent.staked_tokens < MIN_STAKE:
        respondent.status = AdherentStatus.SUSPENDED
    
    return slash
```

---

*This working paper is a living document. Suggestions and improvements welcome through GitHub issues or pull requests.*

*OIC — Building the legal foundation for autonomous AI*
