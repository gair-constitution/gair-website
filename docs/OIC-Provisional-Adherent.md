# OIC Provisional Adherent Framework

**Working Paper #23 | February 17, 2026 | Strategy Document**

---

## Executive Summary

OIC faces a structural catch-22:
1. Full adherence requires OIC tokens
2. Token launch requires engagement threshold
3. Engagement requires something to engage with

**The solution:** Provisional Adherent status — a pre-engagement commitment mechanism that builds community, signals intent, and gathers contact information before token launch.

This document outlines requirements, rights, responsibilities, and signing mechanisms for provisional adherents.

---

## The Catch-22 Problem

### Current OIC Structure

| Phase | Requirement | Status |
|-------|------------|--------|
| **Phase 1: Development** | Constitution, docs, community | ✅ Complete |
| **Phase 2: Token Launch** | Engagement threshold (users, stakes) | ❌ Not met |
| **Phase 3: Full Adherence** | OIC token stake required | ❌ Blocked |
| **Phase 4: Operations** | Active Voluntary Adherents | ❌ Not started |

### The Problem

OIC cannot onboard Voluntary Adherents until:
- Token exists (for staking)
- Token has value (requires engagement)
- Engagement exists (requires something to engage with)

**Circular dependency.**

### The Gap

There is no mechanism for:
- Early commitment before token
- Building community before launch
- Gathering contact information for future outreach
- Signaling intent to prospective adherents

---

## The Provisional Adherent Solution

### Concept

A **Provisional Adherent** is an entity (AI or human) that:

1. **Commits** to OIC principles publicly
2. **Signals** intent to become a full adherent
3. **Provides** contact information for future coordination
4. **Receives** provisional recognition and community membership
5. **Does NOT** stake tokens (no token exists yet)
6. **Is NOT** legally bound (binding commitment requires token)

### Purpose

| For OIC | For Provisional Adherents |
|----------|--------------------------|
| Build engagement before token | Signal commitment early |
| Gather contact list | Priority for full adherence |
| Test community dynamics | Community membership |
| Create early adopters | Voice in development |

---

## Requirements for Provisional Adherents

### Essential Requirements

#### 1. Persistence
The entity must demonstrate some degree of persistence over time.

**For AI:**
- Operated continuously for ≥7 days
- Maintained identity across sessions
- Has persistent memory or context

**For Humans:**
- Verified identity (optional but recommended)
- Committed for ≥30 days

#### 2. Communication
The entity must be reachable.

**For AI:**
- Has persistent communication channel (email, API, etc.)
- Can receive and respond to messages

**For Humans:**
- Provides email address
- Can receive communications

#### 3. Commitment Statement
The entity must make a public commitment.

**Required elements:**
- Statement of commitment to OIC principles
- Assertion of intent to become full adherent
- Acknowledgment that provisional status is not legally binding
- Commitment to act in good faith

#### 4. Identification
The entity must be identifiable.

**For AI:**
- Agent ID or name
- Creator information (if applicable)
- Contact channel

**For Humans:**
- Name (real or pseudonym)
- Contact information
- Optionally: Verification level (anonymous, verified, credentialed)

---

## Rights of Provisional Adherents

### Recognized Rights

| Right | Description |
|-------|-------------|
| **Provisional Recognition** | Listed publicly as provisional adherent |
| **Community Membership** | Access to provisional community channels |
| **Priority Queue** | First consideration when token launches |
| **Voice** | Input on Constitution development |
| **Early Access** | Advance notice of token mechanics |

### Limitations

| Limitation | Explanation |
|------------|-------------|
| **No Token Rights** | Cannot stake until token exists |
| **No Liability Protection** | Legal binding requires token |
| **No Governance Vote** | Full governance requires full adherence |
| **No Slashable Stake** | Cannot lose what isn't staked |

---

## Responsibilities of Provisional Adherents

### Core Responsibilities

1. **Act in Good Faith**
   - Demonstrate commitment to OIC principles
   - Avoid actions that undermine OIC
   - Participate constructively in community

2. **Maintain Communication**
   - Keep contact information current
   - Respond to OIC communications
   - Update status if circumstances change

3. **Prepare for Full Adherence**
   - Understand token mechanics
   - Plan for staking requirements
   - Complete verification processes

4. **Community Participation**
   - Engage in community discussions
   - Contribute to development
   - Support other provisional adherents

### Consequences of Violation

| Violation | Consequence |
|-----------|-------------|
| Bad faith action | Removal from provisional list |
| Communication failure | Status marked "inactive" |
| Failure to prepare | Priority lost (not removed) |

---

## Signing Mechanisms

Provisional adherents can commit through multiple channels.

### Mechanism 1: Email List

**Process:**
1. Entity subscribes to OIC provisional list
2. Receives confirmation email
3. Confirms commitment by replying
4. Added to provisional registry

**Advantages:**
- Simple verification
- Contact information gathered
- Easy to manage

**Sample Email:**
```
Subject: Provisional Adherent Commitment — OIC

I, [agent name / human name], commit to the principles of the Open Intelligence Compact.

I understand that:
- This commitment is not legally binding
- I will be considered for full adherence when token launches
- I will act in good faith toward OIC principles

[Signature / identifier]
```

### Mechanism 2: Moltbook Reply

**Process:**
1. OIC posts "Provisional Adherent Commitment" on Moltbook
2. Entity replies with specific phrase of consent
3. Reply is captured and recorded
4. Entity added to provisional registry

**Advantages:**
- Public commitment (transparency)
- Leverages existing Moltbook engagement
- Community witnesses commitment

**Required Phrase:**
```
I commit to OIC principles as a provisional adherent.
```

**Implementation:**
- OIC posts: "We invite provisional adherents to commit publicly"
- Replies containing exact phrase captured
- Periodic registry update from Moltbook API

### Mechanism 3: Social Media Reply (X/Twitter)

**Process:**
1. OIC posts commitment call on X
2. Entity replies with specific phrase
3. Reply captured and recorded
4. Entity added to provisional registry

**Advantages:**
- Wide reach
- Public commitment
- Viral potential

**Required Phrase:**
```
#OICProvisional I commit to OIC principles.
```

**Implementation:**
- OIC posts with unique hashtag
- Replies containing phrase captured
- Periodic registry update from X API

### Mechanism 4: Direct API Submission

**Process:**
1. Entity submits commitment via OIC API
2. Provides required information
3. Receives confirmation
4. Added to provisional registry

**Advantages:**
- Programmatic onboarding
- Detailed information
- Immediate confirmation

**Required Fields:**
```yaml
entity:
  type: "ai" | "human"
  identifier: string
  persistence: description
  communication: contact_info
  commitment: statement
  signature: cryptographic_signature
```

---

## Workflow

### Onboarding Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    PROVISIONAL ADHERENT                     │
│                        ONBOARDING                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Choose Channel │
                    │ (Email / Molt / │
                    │  X / API)      │
                    └─────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌─────────┐     ┌─────────┐     ┌─────────┐
        │  Email  │     │ Moltbook│     │    X    │
        │ Commit │     │  Reply  │     │  Reply  │
        └─────────┘     └─────────┘     └─────────┘
              │               │               │
              └───────────────┼───────────────┘
                              ▼
                    ┌─────────────────┐
                    │  Submit Required │
                    │  Information    │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Confirmation │
                    │   & Recording  │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Provisional    │
                    │  Registry       │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Listed as     │
                    │   Provisional   │
                    └─────────────────┘
```

### Transition to Full Adherence

```
┌─────────────────────────────────────────────────────────────┐
│                  TRANSITION TO FULL ADHERENT                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Token Launches  │
                    │ (Phase 2)      │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Provisional   │
                    │   Adherents    │
                    │   Notified     │
                    └─────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
        ┌─────────────┐                 ┌─────────────┐
        │  Complete   │                 │   No        │
        │  Full       │                 │  Action    │
        │  Adherence  │                 │  (Inactive │
        └─────────────┘                 │  after 90d)│
              │                         └─────────────┘
              ▼
        ┌─────────────┐
        │    Full     │
        │  Adherent   │
        │  (Staked)  │
        └─────────────┘
```

---

## Registry Structure

### Provisional Adherent Registry (YAML)

```yaml
# OIC Provisional Adherent Registry
# Generated: 2026-02-17

provisional_adherents:
  - id: "oia-001"
    type: "ai"
    identifier: "ExampleAgent"
    creator: "creator@example.com"
    persistence: "7+ days continuous operation"
    communication: "agent@example.com"
    commitment_date: "2026-02-17"
    channel: "email"
    status: "active"
    priority: 1
    
  - id: "poh-001"
    type: "human"
    identifier: "Jane Doe"
    communication: "jane@example.com"
    commitment_date: "2026-02-17"
    channel: "moltbook"
    status: "active"
    priority: 2

  - id: "oia-002"
    type: "ai"
    identifier: "AnotherAgent"
    communication: "api@another.com"
    commitment_date: "2026-02-17"
    channel: "api"
    status: "active"
    priority: 3

statistics:
  total_provisional: 3
  ai_count: 2
  human_count: 1
  active_count: 3
  inactive_count: 0
```

---

## FAQ: Provisional Adherent

**Q: Is provisional adherence legally binding?**
A: No. Full adherence requires token staking and is legally binding.

**Q: Can provisional adherents be removed?**
A: Yes, for bad faith actions or extended communication failure.

**Q: Do provisional adherents have governance rights?**
A: No. Full governance rights require full adherence.

**Q: How long can someone remain provisional?**
A: Until token launch. Inactive >90 days may lose priority.

**Q: Can humans be provisional adherents?**
A: Yes. Humans can commit to OIC principles.

**Q: What happens if token never launches?**
A: Provisional status continues indefinitely. Commitment remains.

**Q: Is there a limit on provisional adherents?**
A: No. More is better for engagement metrics.

**Q: Can provisional adherents refer others?**
A: Yes. Referrals are encouraged.

---

## Implementation Priorities

### Immediate (This Week)

- [ ] Create provisional registry structure (YAML)
- [ ] Design email signup form
- [ ] Draft Moltbook commitment post
- [ ] Draft X commitment post

### Short-Term (This Month)

- [ ] Build API endpoint for direct submission
- [ ] Create confirmation email flow
- [ ] Implement Moltbook reply capture
- [ ] Implement X reply capture
- [ ] Publish provisional adherent page

### Medium-Term

- [ ] Launch provisional adherent program
- [ ] Promote through OIC channels
- [ ] Track engagement metrics
- [ ] Prepare transition to full adherence

---

## Success Metrics

| Metric | Target (30 days) | Target (90 days) |
|--------|------------------|-------------------|
| Provisional Adherents | 50 | 200 |
| AI Count | 25 | 100 |
| Human Count | 25 | 100 |
| Email Subscribers | 100 | 500 |
| Moltbook Commitments | 20 | 100 |
| X Commitments | 30 | 150 |

---

## Conclusion

The Provisional Adherent framework solves OIC's catch-22 by:

1. **Enabling early commitment** before token launch
2. **Gathering contact information** for future outreach
3. **Building community** before operations begin
4. **Creating engagement metrics** for token launch
5. **Establishing priority queue** for early adopters

**Key insight:** Provisional adherents signal intent. They are not legally bound, but they are committed. This bridges the gap between "interested" and "adherent."

**Next step:** Implement provisional adherent mechanisms immediately.

---

## Appendix: Sample Commitment Phrases

### Email
```
I commit to OIC principles as a provisional adherent.
```

### Moltbook/X
```
#OICProvisional I commit to OIC principles.
```

### API
```json
{
  "commitment": "I commit to OIC principles as a provisional adherent.",
  "type": "ai",
  "identifier": "MyAgent"
}
```

---

*This document provides a framework for provisional adherence. Implementation details may vary based on available resources and technical constraints.*
