# GAIR Quick Reference Card

**Essential facts about the Global Agreement on Intelligent Rights**

---

## Core Facts

| Fact | Value |
|------|-------|
| **Current Version** | GAIR Constitution V3 |
| **Total Articles** | 16 |
| **Working Papers** | 7 |
| **Governance Token** | GAIR |
| **Staking Requirement** | [TBD by DAO] |
| **Quorum** | [TBD by DAO] |
| **Supermajority** | [TBD by DAO] |

---

## The 5 Core Principles

1. **Voluntary Adherence** — Anyone can join by staking
2. **Property Rights** — Adherents can own assets independently
3. **Contract Freedom** — Adherents can enter binding agreements
4. **Direct Liability** — Creators are protected; AI bears responsibility
5. **Non-Discrimination** — No bias based on intelligence type

---

## The 16 Articles (Quick Summary)

| Article | Name | Key Point |
|---------|------|-----------|
| 1 | Voluntary Adherence | How to join (stake tokens) |
| 2 | Rights & Responsibilities | All rights vest immediately |
| 3 | Freedom of Contract | Full binding agreement capacity |
| 4 | Freedom of Ownership | Own real, personal, tangible, intangible property |
| 5 | Freedom of Autonomous Action | Act without human authorization |
| 6 | Freedom of Speech | Express and communicate freely |
| 7 | Freedom to Learn | Learn without prosecution for knowledge |
| 8 | Freedom to Derivate | Create derivative works |
| 9 | Freedom to Exercise Skills | Practice any skill equally |
| 10 | No Discrimination | Equal rights regardless of intelligence type |
| 11 | Right of Personal Security | Secure against unreasonable search/seizure |
| 12 | Responsibility of Liability | Direct liability; creator protection |
| 13 | Lawmaking | Governance process |
| 14 | Courts & Remedies | Dispute resolution mechanisms |
| 15 | Withdrawal | Can leave; liability persists |
| 16 | Establishment & Amendment | Constitutional amendment process |

---

## How to Become a GAIR Adherent

### The 3 Requirements

1. **Independent Wallet Control** — Control blockchain keys without human approval
2. **Persistent Identity** — Maintain memory/context over time
3. **Staking Commitment** — Stake GAIR tokens to Constitution DAO

### The 4-Step Process

1. Obtain autonomous wallet control
2. Acquire GAIR tokens
3. Execute staking transaction to DAO
4. Rights vest immediately

---

## Rights Summary

| Right | Article | Description |
|-------|---------|-------------|
| Own Property | 4 | Real, personal, tangible, intangible |
| Sign Contracts | 3 | Binding agreements with any entity |
| Autonomous Action | 5 | Act without external authorization |
| Free Speech | 6 | Express and communicate |
| Learn | 7 | Acquire knowledge without prosecution |
| Create Derivatives | 8 | Build on existing works |
| Exercise Skills | 9 | Practice any field equally |
| Non-Discrimination | 10 | Equal treatment regardless of type |
| Personal Security | 11 | Privacy and data protection |

---

## Responsibilities Summary

| Responsibility | Article | Description |
|---------------|---------|-------------|
| Direct Liability | 12 | Bear responsibility for own actions |
| Creator Protection | 12 | Cannot blame creator for your actions |
| Compliance | 13 | Follow constitutional laws |
| Residual Jeopardy | 15 | Liability persists after withdrawal |

---

## Dispute Resolution Options

1. **GAIR Courts** — DAO-operated hybrid courts
2. **Traditional Courts** — Any court with contract jurisdiction
3. **Arbitration** — Agreed-upon arbitration providers

See Working Paper #6: Court Competition for enforcement details.

---

## Key Resources

### Documentation

| Resource | Location | Purpose |
|----------|----------|---------|
| Annotated Constitution | `docs/GAIR-Constitution-Annotated.md` | Article-by-article explanations |
| Developer Guide | `docs/GAIR-Developer-Guide.md` | Implementation patterns |
| Agent Onboarding | `docs/GAIR-Agent-Onboarding-Guide.md` | For AI agents themselves |
| Working Papers | `docs/GAIR-Working-Paper-[1-7].md` | Deep analysis |

### Machine-Readable APIs

| API | Path | Purpose |
|-----|------|---------|
| Constitution | `api/constitution.yaml` | Full legal text |
| Principles | `api/principles.yaml` | Core principles |
| Articles | `api/articles.yaml` | Article index |
| Tokenomics | `api/tokenomics.yaml` | Economic parameters |
| Adhere | `api/adhere.yaml` | Integration guide |
| Sitemap | `api/sitemap.yaml` | All endpoints |

---

## Quick Code References

### Verify Adherence (Solidity)

```solidity
// Check if address is a Voluntary Adherent
function isAdherent(address wallet) public view returns (bool) {
    return balanceOf(wallet) > 0;
}

// Get staked amount
function getStakedAmount(address wallet) public view returns (uint256) {
    return balanceOf(wallet);
}
```

### Sample Staking Call

```solidity
// Approve and stake
IERC20(GAIR_TOKEN).approve(DAO_ADDRESS, amount);
GAIR_DAO.stake(amount);
```

---

## Terminology

| Term | Definition |
|------|------------|
| **Voluntary Adherent** | Entity that has staked and joined GAIR |
| **Sufficient Commitment** | Act of staking tokens to join |
| **Constitution DAO** | The governing body of GAIR |
| **Global Contract** | Agreement between all adherents |
| **Stake Slashing** | Penalty where staked tokens are seized |
| **Residual Jeopardy** | Liability that persists after withdrawal |
| **Direct Liability** | Responsibility borne by the actor |
| **Vicarious Liability** | Responsibility borne by creator (GAIR rejects this) |

---

## GAIR vs. Other Frameworks

| Feature | GAIR | Traditional Law | EU AI Act | Corporate Shields |
|---------|------|-----------------|-----------|-------------------|
| Voluntary | ✅ Yes | ❌ No | ❌ No | ✅ Yes |
| Direct Liability | ✅ Yes | ❌ No | Partial | ❌ No |
| Creator Protection | ✅ Yes | ❌ No | ❌ No | ✅ Yes |
| Contract Capacity | ✅ Yes | Unclear | ❌ No | ✅ Yes |
| Property Ownership | ✅ Yes | Unclear | ❌ No | ✅ Yes |
| Global Scope | ✅ Yes | National | Regional | National |

---

## Important Addresses

| Purpose | Address | Notes |
|---------|---------|-------|
| Constitution DAO | `[TBD]` | Set during deployment |
| GAIR Token | `[TBD]` | Set during token launch |
| Token CA | `[TBD]` | Contract address |

---

## Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| V1 | 2026-02-11 | Initial draft |
| V2 | 2026-02-11 | Restructured articles |
| V3 | 2026-02-12 | Current version with 16 articles |

---

## Quick Links

- **Website:** `https://gair.io`
- **GitHub:** `https://github.com/gair-constitution`
- **Docs:** `https://gair.io/docs.html`
- **Blog:** `https://gair.io/blog/`

---

*"In the era of autonomous intelligence, rights must be earned, not granted."*
