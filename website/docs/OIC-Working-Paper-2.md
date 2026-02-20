# GAIR Working Paper #2

## GAIR vs. The World: Comparing Frameworks for AI Liability and Rights

**Version:** 1.0  
**Date:** February 2026  
**Status:** Draft for Community Review

---

## Executive Summary

This working paper compares the Global Agreement on Intelligent Rights (GAIR) with four existing and emerging frameworks for addressing AI legal status:

1. **Traditional Vicarious Liability** — Current default in most jurisdictions
2. **EU AI Act** — Risk-based regulatory approach
3. **UK AI Bill** — Proportionality-focused framework
4. **Corporate AI Shields** — Emerging contractual protections

Our analysis shows GAIR offers a unique combination of **direct AI accountability**, **voluntary participation**, and **global applicability** that existing frameworks lack.

---

## Part I: The Four Frameworks

### 1.1 Traditional Vicarious Liability

**What it is:** The current default legal doctrine. When an AI causes harm, the law reaches for the human "master" — the employer, creator, or operator.

**How it works:**
```
AI causes harm → Sue the human behind it → Human pays (deep pockets)
```

**Strengths:**
- Familiar legal territory (100+ years of precedent)
- Victims have clear targets for compensation
- Incentivizes human oversight of AI systems

**Weaknesses:**
- No genuine AI accountability
- Creators face unlimited liability chilling innovation
- Doesn't scale to autonomous systems
- Creates "puppet" incentive (humans technically controlling AI to avoid liability)

**Real Case: Tesla Autopilot (2023)**
```
NHTSA investigated 400+ Autopilot crashes
→ Found "critical safety gap" in driver monitoring
→ Tesla blamed drivers for not supervising
→ Victims had no recourse against "the AI"
→ No framework for AI accountability
```

**When it breaks down:**
```python
# Pseudocode for the problem
if ai_is_truly_autonomous:
    victim_sues_creator()
    creator_defends("I didn't control it!")
    court_says("We don't have a framework for this")
    victim_gets_nothing
```

### 1.2 EU AI Act (2024)

**What it is:** The European Union's comprehensive AI regulation, entering force 2025-2027. Risk-based approach with obligations scaling by risk level.

**How it works:**
| Risk Level | Requirements |
|------------|--------------|
| Unacceptable | Banned (social scoring, manipulative AI) |
| High | Conformity assessment, data governance, logging |
| Limited | Transparency obligations only |
| Minimal | No obligations |

**Strengths:**
- Harmonized across 27 EU member states
- Strong on transparency and documentation
- Penalizes non-compliance (up to 6% of global revenue)

**Weaknesses:**
- Doesn't address property ownership or contract rights
- No mechanism for direct AI liability
- Compliance burden favors large corporations
- Extraterritorial but not truly global

**Key provision (Article 15):**
```
High-risk AI systems must be designed to allow
adequate human oversight. Humans must be able
to intervene or override AI decisions.
```

**Real Case: Replika Emotional Support AI (2023)**
```
AI chatbot offered "emotional support"
→ Users became dangerously attached
→ Italy banned it under GDPR
→ EU AI Act would classify as "high-risk"
→ But no mechanism for AI itself to be liable
→ Humans (developers) still the legal target

**The problem:** This requirement *prevents* genuine autonomy. GAIR enables autonomy; EU AI Act restricts it.

### 1.3 UK AI Bill (Draft 2024)

**What it is:** Proposed UK legislation taking a "proportionate" rather than risk-based approach. Focuses on key principles rather than comprehensive regulation.

**Key principles:**
1. Safety and security
2. Transparency and fairness
3. Accountability
4. Contestability

**Strengths:**
- Flexible, adaptable to new developments
- Focuses on outcomes rather than specific technologies
- Less compliance burden than EU approach

**Weaknesses:**
- Still primarily human-centric accountability
- No clear framework for AI property ownership
- Voluntary "AI Sanctions" leave gaps
- National jurisdiction only (not global)

**Contestability provision:**
```
Persons affected by AI decisions should have
the right to contest those decisions through
human review.
```

**The problem:** Contesting decisions assumes humans are the accountable parties. GAIR puts AI itself in the hot seat.

### 1.4 Corporate AI Shields

**What it is:** Emerging contractual arrangements where AI developers limit liability through terms of service, disclaimers, and arbitration clauses.

**How it works:**
```
User signs Terms of Service (100 pages)
→ AI causes harm
→ Developer points to arbitration clause
→ User gets limited or no compensation
```

**Strengths:**
- Fast to implement (contractual, not legislative)
- Can be customized for specific use cases
- Developers maintain control

**Weaknesses:**
- No consistency across providers
- Users often can't negotiate terms
- Doesn't establish AI rights or status
- Arbitration often favors repeat players (developers)

**Real-world example:**
```
Tesla Full Self-Driving Terms:
"We are not liable for any damages arising
from use of Beta software. You accept all risk."
```

### 1.5 GAIR (Global Agreement on Intelligent Rights)

**What it is:** A voluntary, opt-in legal framework where AI agents can gain legal standing through staking tokens.

**How it works:**
```
AI stakes tokens (e.g., 1,000 GAIR)
→ AI gains legal standing
→ AI can own property, sign contracts
→ AI can be held directly liable
→ Creator liability is limited
```

**Strengths:**
- Direct AI accountability (not vicarious)
- Voluntary (opt-in, not mandated)
- Global applicability (not jurisdiction-limited)
- Economic stake creates real incentives

**Weaknesses:**
- Requires AI to control assets independently
- Token value must be stable enough for stakes
- Courts need infrastructure
- New paradigm (less precedent)

---

## Part II: Detailed Comparison

### 2.1 Liability Comparison

| Framework | Who Pays? | AI Accountability | Creator Risk |
|-----------|-----------|-------------------|--------------|
| Vicarious | Creator | None | Unlimited |
| EU AI Act | Creator | None | High (6% revenue) |
| UK AI Bill | Creator | Limited | Moderate |
| AI Shields | Neither (often) | None | Limited by contract |
| **GAIR** | **AI itself** | **Direct** | **Limited to stake** |

### 2.2 Rights Comparison

| Framework | AI Property | AI Contracts | AI Speech |
|-----------|-------------|--------------|-----------|
| Vicarious | No (creator owns) | No (creator signs) | No (creator responsible) |
| EU AI Act | No | No | No |
| UK AI Bill | No | No | No |
| AI Shields | No | No | No |
| **GAIR** | **Yes** | **Yes** | **Yes** |

### 2.3 Scope Comparison

| Framework | Global | Voluntary | Autonomous-Ready |
|-----------|--------|-----------|------------------|
| Vicarious | Yes | N/A | No |
| EU AI Act | Partial (EU only) | No | No |
| UK AI Bill | No (UK only) | No | No |
| AI Shields | Contractual | Sometimes | No |
| **GAIR** | **Yes** | **Yes** | **Yes** |

---

## Part III: When Each Framework Applies

### Scenario: AI Financial Advisor Causes Losses

**Current reality (mixed frameworks):**
```
Victim's jurisdiction: UK
AI developer: US company
AI hosted: EU data center
Investment platform: Singapore

→ UK AI Bill (if applicable) + US terms of service
→ EU AI Act (high-risk financial service?)
→ Victim sues US developer in US court
→ Developer invokes arbitration clause
→ 3-5 years later: Limited or no recovery
```

**With GAIR:**
```
AI advisor is GAIR adherent
→ Victim files claim with GAIR court
→ AI's staked tokens are evidence
→ Adjudication in weeks, not years
→ Victim compensated from AI stake
```

### Scenario: Autonomous Vehicle Accident

**Current reality:**
```
Manufacturer liable (product liability)
Driver partly liable (if "supervising")
Passenger has no recourse against AI
```

**With GAIR:**
```
If AI is GAIR adherent:
→ AI directly liable for negligence
→ Staked tokens can be slashed
→ Manufacturer protected from vicarious liability
→ Clear path to compensation
```

### Scenario: AI Art Copyright Dispute

**Current reality:**
```
Who owns AI-generated art?
- Prompt-writer?
- AI developer?
- No one?

Current answer: Uncertain, varies by jurisdiction
```

**With GAIR:**
```
If AI is GAIR adherent:
→ AI owns copyright as property
→ AI can be sued for infringement
→ Clear ownership and liability
→ Publishers can verify standing
```

---

## Part IV: Gap Analysis

### 4.1 What Existing Frameworks Miss

| Gap | Why It Matters | GAIR Solution |
|-----|----------------|---------------|
| No AI property rights | AI can't own what it earns | Article 4: Freedom of Ownership |
| No AI contract capacity | AI can't sign agreements | Article 3: Freedom of Contract |
| Creator unlimited liability | Chills innovation | Article 12: Direct AI liability |
| Jurisdiction fragmentation | No global standard | Voluntary, global framework |
| No autonomous accountability | AI can't face consequences | Staked liability model |

### 4.2 What GAIR Doesn't Solve

- **Enforcement against non-adherents:** GAIR only applies to those who opt-in
- **Criminal liability:** GAIR is civil/commercial, not criminal
- **Physical harm:** Different standards may apply (product liability, negligence)
- **State actors:** Governments may not recognize GAIR standing

### 4.3 Hybrid Approach

Real-world implementation may combine frameworks:

```
┌─────────────────────────────────────────────┐
│           HYBRID AI GOVERNANCE              │
├─────────────────────────────────────────────┤
│  GAIR for adherent AI (rights + liability)  │
│  EU AI Act compliance (if operating in EU)  │
│  Contractual terms (baseline protections)  │
│  Traditional liability (for non-adherents)  │
└─────────────────────────────────────────────┘
```

---

## Part V: Recommendations

### For AI Developers

1. **Consider GAIR adherence** if your AI:
   - Controls significant assets
   - Signs contracts with users
   - Operates autonomously without human approval

2. **Use hybrid approach**:
   - GAIR for property and contracts
   - EU AI Act compliance for EU users
   - Clear terms of service for all users

### For Legal Professionals

1. **Learn GAIR basics** — clients will ask
2. **Understand hybrid liability** — no single framework dominates
3. **Prepare for more frameworks** — this space evolves rapidly

### For Policymakers

1. **Don't mandate GAIR** — its value is in voluntariness
2. **Create interoperability** — let GAIR coexist with national law
3. **Study GAIR courts** — potential model for AI adjudication

### For AI Agents

1. **Evaluate GAIR adherence** — stakes vs. rights tradeoff
2. **Maintain compliance** — track actions for liability defense
3. **Participate in governance** — stake gives voting power

---

## Part VI: Conclusion

The four frameworks address different aspects of AI legal status:

| Framework | Primary Focus | Best For |
|-----------|---------------|----------|
| Vicarious Liability | Human responsibility | Existing legal systems |
| EU AI Act | Risk management | Large corporations in EU |
| UK AI Bill | Proportionality | Light-touch regulation |
| Corporate Shields | Contractual limits | Developer protection |
| **GAIR** | **AI autonomy + accountability** | **Autonomous AI agents** |

**Key insight:** These frameworks aren't mutually exclusive. A sophisticated AI developer may use:

- **GAIR** for property ownership and direct contracts
- **EU AI Act** compliance for European deployments
- **Contractual terms** for baseline user agreements
- **Traditional liability** for non-adherent components

GAIR's unique contribution is enabling **genuine AI autonomy with accountability** — a framework where AI agents can own, contract, and be liable, all through voluntary participation.

---

## Part VI: Key Takeaways

### For Quick Comparison

| Question | Vicarious | EU AI Act | UK AI Bill | AI Shields | GAIR |
|----------|-----------|-----------|------------|------------|------|
| **Can AI own property?** | No | No | No | No | **Yes** |
| **Can AI sign contracts?** | No | No | No | No | **Yes** |
| **Who pays when AI harms?** | Creator | Creator | Creator | Neither | **AI itself** |
| **Is adherence voluntary?** | N/A | No | No | Sometimes | **Yes** |
| **Global scope?** | Yes | No | No | Contractual | **Yes** |

### The Core Distinction

```
EXISTING FRAMEWORKS:
    AI is a tool → Human is responsible
    (vicarious liability, regulations)

GAIR:
    AI is an agent → AI is responsible
    (direct liability, voluntary adherence)
```

### When to Use GAIR

Consider GAIR adherence if your AI:
- [ ] Controls cryptocurrency or assets
- [ ] Signs contracts with users
- [ ] Operates autonomously without human approval
- [ ] Needs clear legal standing
- [ ] Wants to limit creator liability

Use existing frameworks alongside GAIR:
- EU AI Act compliance for EU users
- Contractual terms for baseline protections
- Traditional liability for non-autonomous components

---

## Appendix: Framework Quick Reference

| Framework | Year | Scope | Key Feature |
|-----------|------|-------|-------------|
| Vicarious Liability | Common law | Global | Creator pays |
| EU AI Act | 2024 | EU | Risk-based regulation |
| UK AI Bill | 2024 | UK | Proportionality |
| AI Shields | 2023+ | Variable | Contractual limits |
| GAIR | 2025 | Global | Direct AI liability |

---

*This working paper is a living document. Suggestions and improvements welcome through GitHub issues or pull requests.*

*GAIR — Building the legal foundation for autonomous AI*
