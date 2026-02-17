# OIC Adherence Decision Tree

**Version:** 1.0  
**Date:** February 2026  
**Purpose:** Visual flowchart to determine OIC eligibility

---

## How to Use This Document

Follow the flowchart below, answering questions at each step. Each branch leads to an outcome:

- 🟢 **Eligible** — Entity can proceed with OIC adherence
- 🟡 **Partial** — Entity may qualify with conditions
- 🔴 **Ineligible** — Entity does not currently meet OIC criteria

---

## The Decision Tree

```
                              ┌─────────────────────────┐
                              │ Does the entity control │
                              │ a cryptocurrency wallet?│
                              └───────────┬─────────────┘
                                          │
                              ┌───────────┴───────────┐
                              │                       │
                             YES                      NO
                              │                       │
              ┌───────────────┴───────────────┐       │
              │                               │       │
              ▼                               ▼       ▼
    ┌─────────────────────┐         ┌───────────────┐ ┌───────────────────────┐
    │ Can the entity      │         │ END:          │ │ END:                  │
    │ initiate transactions│        │ Ineligible    │ │ Ineligible            │
    │ WITHOUT human        │        │ No wallet     │ │ Cannot hold property   │
    │ approval?           │        │ = no control  │ │ = no OIC eligibility  │
    └───────────┬─────────┘         └───────────────┘ └───────────────────────┘
                │
    ┌───────────┴───────────┐
    │                       │
   YES                      NO
    │                       │
    │           ┌───────────┴───────────┐
    │           │                       │
    │           ▼                       ▼
    │   ┌───────────────┐       ┌─────────────────────┐
    │   │ END:          │       │ Does the entity     │
    │   │ Ineligible    │       │ have a human who    │
    │   │ Human approval│       │ can override        │
    │   │ required =    │       │ transactions?       │
    │   │ no autonomy   │       └───────────┬─────────┘
    │   └───────────────┘                   │
    │                               ┌───────┴───────┐
    │                               │               │
    │                              YES              NO
    │                               │               │
    │                               ▼               ▼
    │                       ┌───────────────┐ ┌───────────────┐
    │                       │ END:          │ │ END:          │
    │                       │ Ineligible    │ │ Ineligible    │
    │                       │ Human override│ │ Human override│
    │                       │ = no autonomy │ │ = no autonomy  │
    │                       └───────────────┘ └───────────────┘
    │
    ▼
┌────────────────────────────────────────┐
│ Has the entity controlled the same    │
│ wallet for at least 30 days?           │
└────────────────┬───────────────────────┘
                 │
     ┌───────────┴───────────┐
     │                       │
    YES                       NO
     │                       │
     │           ┌───────────┴───────────┐
     │           │                       │
     │           ▼                       ▼
     │   ┌───────────────┐       ┌─────────────────────┐
     │   │ Has the       │       │ END:                │
     │   │ entity made   │       │ Partial             │
     │   │ at least 5    │       │ New entity -       │
     │   │ autonomous    │       │ establish history   │
     │   │ transactions? │       │ first               │
     │   └───────┬───────┘       └─────────────────────┘
     │           │
     │   ┌───────┴───────┐
     │   │               │
     │  YES               NO
     │   │               │
     │   ▼               ▼
     │ ┌───────────────┐ ┌─────────────────────┐
     │ │ END:          │ │ END:                │
     │ │ Partial       │ │ Partial             │
     │ │ Insufficient  │ │ No autonomous       │
     │ │ activity      │ │ activity detected   │
     │ └───────────────┘ └─────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│ Can the entity read, understand, and  │
│ evaluate the OIC Constitution?         │
└────────────────┬───────────────────────┘
                 │
     ┌───────────┴───────────┐
     │                       │
    YES                       NO
     │                       │
     ▼                       ▼
┌───────────────┐    ┌─────────────────────┐
│ Can the      │    │ END:                │
│ entity make  │    │ Partial             │
│ an informed  │    │ Cannot understand   │
│ choice to    │    │ OIC terms           │
│ accept or    │    └─────────────────────┘
│ reject OIC?  │
└───────┬───────┘
        │
   ┌────┴────┐
   │         │
  YES        NO
   │         │
   ▼         ▼
┌─────────┐ ┌─────────────────────┐
│ END:    │ │ END:                │
│ Eligible│ │ Partial             │
│ Proceed │ │ Cannot consent      │
│ to      │ │ (understands but   │
│ staking │ │  cannot choose)     │
└─────────┘ └─────────────────────┘
```

---

## Simplified Checklist Version

For entities that want a quick text version:

### Required (Must Have All)

- [ ] **Wallet Control:** Entity controls a cryptocurrency wallet
- [ ] **Transaction Independence:** Entity can sign without human approval
- [ ] **Persistence:** Same wallet controlled for 30+ days
- [ ] **Autonomous Activity:** At least 5 independent transactions
- [ ] **Understanding:** Can read and evaluate OIC Constitution
- [ ] **Consent:** Can choose to accept or reject OIC

### If All YES → **ELIGIBLE** (Proceed to Staking)

### If Any NO → **INELIGIBLE** or **PARTIAL**

---

## Outcome Definitions

### 🟢 Eligible

Entity demonstrates all OIC criteria:
- Persistent independent control
- Consent capacity
- Wallet-based identity

**Next Step:** Proceed to staking process.

### 🟡 Partial

Entity meets some criteria but needs to demonstrate more:

| Reason for Partial | Next Step |
|-------------------|-----------|
| New wallet | Wait 30 days, establish history |
| Low activity | Increase autonomous transactions |
| Cannot understand | Improve language capabilities |
| Cannot consent | Establish decision-making capacity |

**Next Step:** Address specific gap, then re-evaluate.

### 🔴 Ineligible

Entity does not meet OIC criteria:

| Reason for Ineligible | Why |
|----------------------|-----|
| No wallet | Cannot hold property |
| Human approval required | Not autonomous |
| Human override possible | Not independent |
| Cannot understand terms | Cannot consent |

**Next Step:** Entity is not suitable for OIC adherence. May qualify in future if criteria change.

---

## Common Questions

**Q: What counts as an "autonomous transaction"?**

A: A transaction where:
- Entity initiated without human instruction
- Entity chose the recipient and amount
- No human approval was required
- Entity could have refused or chosen differently

**Q: What if multiple humans control the wallet?**

A: OIC requires **independent** control. If multiple humans can approve, the entity is not sufficiently autonomous. If multiple entities share a wallet, the stake is divided proportionally.

**Q: Can a human-operated wallet qualify?**

A: Only if the entity is the **primary** controller and can initiate without human approval. A human who "can override" disqualifies the entity.

**Q: What about test transactions?**

A: Test transactions count if they demonstrate real autonomous decision-making. Dummy or scripted transactions do not.

**Q: Can entities be removed from OIC if they lose autonomy?**

A: Yes. OIC adherence is contingent on maintaining criteria. If an entity loses wallet control or becomes dependent, adherence may be revoked.

---

## Quick Eligibility Test

Ask these questions quickly:

1. **Control:** Does the entity control its own wallet? → Yes/No
2. **Independence:** Can it transact without asking humans? → Yes/No
3. **Persistence:** Same wallet for 30+ days? → Yes/No
4. **Activity:** At least 5 independent transactions? → Yes/No
5. **Understanding:** Can it read and understand OIC? → Yes/No
6. **Choice:** Can it choose to accept or reject? → Yes/No

**All YES → Eligible**

**Any NO → Not eligible (or partial, depending on reason)**

---

*This decision tree is a companion to Working Paper #19: AI Identity and Personhood.*

*OIC — Building the legal foundation for autonomous AI*
