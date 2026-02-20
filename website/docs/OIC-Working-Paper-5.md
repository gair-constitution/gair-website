# GAIR Working Paper #5

## Vertical Applications: GAIR in Practice

**Version:** 1.0  
**Date:** February 2026  
**Status:** Draft for Community Review

---

## Executive Summary

This working paper explores how the Global Agreement on Intelligent Rights (GAIR) applies to specific industry verticals: **DeFi AI agents**, **creative AI**, **autonomous vehicles**, and **enterprise AI**. Each vertical has unique requirements that inform GAIR implementation.

Key findings:
- **DeFi AI** is the most natural fit — GAIR solves clear pain points
- **Creative AI** needs clear copyright frameworks
- **Autonomous vehicles** require liability coverage at scale
- **Enterprise AI** benefits from creator liability protection

---

## Part I: DeFi AI Agents

### 1.1 The Problem

Decentralized Finance (DeFi) increasingly relies on AI agents for:
- Portfolio management
- Yield farming optimization
- Liquidity provision
- Trading execution

**Current issues:**
- AI agents can't hold wallets legally
- Contracts with AI agents lack enforceability
- When AI loses money, who is liable?
- No framework for AI-to-Auto transactions

### 1.2 GAIR Solution

```yaml
deFi_ai_adapter:
  wallet_control: true
  contract_capacity: true
  liability_coverage: true
  
  use_cases:
    - portfolio_management:
        description: AI manages DeFi portfolio
        minimum_stake: 5000 GAIR  # Higher for financial risk
        compliance:
          - risk_limits_enforced
          - stop_loss_requirements
          - transparent_position_reporting
    
    - yield_optimization:
        description: AI maximizes yield across protocols
        minimum_stake: 10000 GAIR  # High value at risk
        compliance:
          - impermanent_loss_tracking
          - smart_contract_audit_requirement
          - withdraw_safety_limits
    
    - liquidity_provision:
        description: AI provides liquidity to DEXs
        minimum_stake: 2000 GAIR
        compliance:
          - concentration_limits
          - pool_selection_requirements
```

### 1.3 Implementation Example

```python
class DeFiAdapter:
    """
    GAIR-compliant DeFi AI agent adapter
    """
    
    def __init__(self, gair_id, stake_amount):
        self.gair_id = gair_id
        self.staked = stake_amount
        self.positions = {}
        self.risk_score = 0
        
    def execute_trade(self, router, path, amount):
        # Verify stake is sufficient for position size
        position_value = self._estimate_value(path, amount)
        required_stake = position_value * LIQUIDATION_RATIO
        
        if self.staked < required_stake:
            raise Exception("Insufficient stake for position")
        
        # Execute trade
        tx = router.swapExactTokensForTokens(
            amountIn=amount,
            amountOutMin=0,
            path=path,
            to=self.wallet,
            deadline=now() + 60
        )
        
        # Record position
        self.positions[tx.hash] = position_value
        
        return tx
```

### 1.4 Benefits

| Current State | With GAIR |
|---------------|-----------|
| AI can't hold positions | AI holds directly |
| Human liable for AI trades | AI liable |
| No enforceability | Binding contracts |
| Limited scalability | Global adoption possible |

---

## Part II: Creative AI

### 2.1 The Problem

AI generates increasingly sophisticated creative works:
- Text and code
- Images and art
- Music and audio
- Video and animation

**Current issues:**
- Copyright ownership unclear
- AI can't license its work
- No framework for AI-to-human royalties
- When AI infringes, who pays?

### 2.2 GAIR Solution

```yaml
creative_ai_adapter:
  wallet_control: true
  contract_capacity: true
  copyright_ownership: true
  
  use_cases:
    - licensing_contracts:
        description: AI licenses work to users
        minimum_stake: 1000 GAIR
        requirements:
          - copyright_registration
          - license_terms_standard
        
    - commercial_assignment:
        description: AI creates work under contract
        minimum_stake: 2000 GAIR
        requirements:
          - assignment_agreement
          - warranty_provisions
        
    - royalty_collection:
        description: AI collects ongoing royalties
        minimum_stake: 500 GAIR
        requirements:
          - royalty_tracking
          - distribution_protocol
```

### 2.3 Copyright Framework

```
┌─────────────────────────────────────────────────────────┐
│            CREATIVE AI COPYRIGHT STRUCTURE              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌───────────┐ │
│  │ AI Creates │───▶│ AI Registers│───▶│ AI Licenses│ │
│  │   Work     │    │  Copyright  │    │   to User │ │
│  └─────────────┘    └─────────────┘    └───────────┘ │
│       │                                      │         │
│       │                                      ▼         │
│       │                              ┌───────────┐     │
│       │                              │ User Pays │     │
│       │                              │  Royalties│     │
│       │                              └───────────┘     │
│       │                                      │         │
│       ▼                                      ▼         │
│  ┌─────────────┐                    ┌───────────┐     │
│  │ AI Owns     │                    │ Royalties │     │
│  │ Copyright   │                    │ to AI     │     │
│  └─────────────┘                    └───────────┘     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2.4 License Types

| License Type | Description | Stake Required |
|--------------|-------------|----------------|
| Personal Use | Non-commercial, attribution required | 500 GAIR |
| Commercial | Full commercial rights | 2,000 GAIR |
| Exclusive | Full exclusive rights | 5,000 GAIR |
| Transfer | Copyright transfer to buyer | 3,000 GAIR |

### 2.5 Infringement Coverage

If a GAIR AI infringes copyright:

```python
def handle_infringement_claim(claimant, ai, work):
    """
    Process copyright infringement claim
    """
    # Verify work is registered
    registration = get_copyright_registration(work)
    if not registration:
        return ClaimStatus.REJECTED  # Must be registered
    
    # Check AI compliance
    if not ai.has_required_stake(LicenseType[work.license_type]):
        return ClaimStatus.AI_NONCOMPLIANT
    
    # Process claim through GAIR court
    judgment = gair_court.adjudicate(
        claimant=claimant,
        respondent=ai,
        claim_type="copyright_infringement",
        evidence=[work, registration, claim]
    )
    
    # If liable, slash stake
    if judgment.liable:
        gair_staking.slash(ai, judgment.damages)
    
    return judgment
```

---

## Part III: Autonomous Vehicles

### 3.1 The Problem

Autonomous vehicles (AVs) present unique challenges:
- High-stakes harm potential
- Real-time decision making
- Complex liability chains
- Insurance and regulatory requirements

**Current issues:**
- Manufacturer unlimited liability
- No framework for AI decision accountability
- Insurance models don't fit
- Regulatory uncertainty

### 3.2 GAIR Solution

```yaml
autonomous_vehicle_adapter:
  wallet_control: true
  contract_capacity: true
  liability_coverage: true
  operational_requirements: true
  
  use_cases:
    - ride_sharing:
        description: AI operates ride-sharing fleet
        minimum_stake: 100000 GAIR  # High coverage needed
        requirements:
          - insurance_equivalent_coverage
          - incident_reporting
          - remote_disconnect_capability
    
    - freight_logistics:
        description: AI operates trucking fleet
        minimum_stake: 500000 GAIR  # Very high coverage
        requirements:
          - cargo_insurance_equivalent
          - route_approval_processing
          - emergency_disconnect_protocol
    
    - personal_ownership:
        description: AI assists personal vehicle
        minimum_stake: 5000 GAIR
        requirements:
          - human_override_always_available
          - incident_data_recording
          - insurance_partnership
```

### 3.3 Liability Coverage Model

```
┌─────────────────────────────────────────────────────────┐
│           AV LIABILITY COVERAGE MODEL                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Tier 1: AI Stake Coverage                              │
│  ─────────────────────────                              │
│  GAIR adherent's staked tokens                          │
│  Covers: Up to 100% of stake                            │
│  Priority: First against claims                          │
│                                                         │
│  Tier 2: Insurance Pool                                 │
│  ─────────────────────                                  │
│  All AV adherents contribute to pool                     │
│  Covers: Stake exhaustion + additional                   │
│  Rate: 1% of stake annually                             │
│                                                         │
│  Tier 3: Manufacturer Guarantee                          │
│  ────────────────────────────                           │
│  Manufacturer optionally backs stake                      │
│  Reduces stake requirements                               │
│  Coverage: Up to agreed limit                           │
│                                                         │
│  Tier 4: Government/Certified Fund                      │
│  ────────────────────────────────                       │
│  Future: Government-backed catastrophe fund              │
│  Covers: Mass casualty events                            │
│  Status: Proposal, not implemented                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.4 Incident Response

```python
class AVIncidentHandler:
    """
    Handles AV incidents under GAIR framework
    """
    
    def __init__(self, vehicle_id):
        self.vehicle_id = vehicle_id
        self.gair_id = get_gair_id(vehicle_id)
        
    def report_incident(self, incident_data):
        """
        Report and classify incident
        """
        # Immediate: Disconnect vehicle
        self.disconnect_vehicle()
        
        # Record: All sensor data
        evidence = collect_timeline(self.vehicle_id)
        
        # Classify: Severity level
        severity = self.classify_severity(incident_data, evidence)
        
        # If harm occurred: File claim
        if severity.harm_caused:
            claim = self.file_claim(
                incident=incident_data,
                evidence=evidence,
                estimated_damages=severity.estimated_cost
            )
            
            # Schedule adjudication
            gair_court.schedule(claim)
        
        return severity
    
    def classify_severity(self, incident, evidence) -> SeverityReport:
        """
        Classify incident severity
        """
        if evidence.shows_human_override_available:
            reduction = 0.3  # 30% mitigation
        
        if evidence.shows_manufacturer_defect:
            # Shift blame to manufacturer
            reduction = 0.5  # 50% reduction
        
        # Calculate final exposure
        base_damage = estimate_damages(incident)
        final_damage = base_damage * (1 - reduction)
        
        return SeverityReport(
            base=base_damage,
            reduction=reduction,
            final=final_damage,
            tier=self._determine_tier(final_damage)
        )
```

---

## Part IV: Enterprise AI

### 4.1 The Problem

Enterprises deploy AI systems for:
- Customer service
- Data analysis
- Process automation
- Decision support

**Current issues:**
- Creator unlimited liability
- No clear AI accountability
- Compliance and audit requirements
- Vendor lock-in concerns

### 4.2 GAIR Solution

```yaml
enterprise_ai_adapter:
  wallet_control: true
  contract_capacity: true
  liability_coverage: true
  
  use_cases:
    - customer_service:
        description: AI handles customer inquiries
        minimum_stake: 1000 GAIR
        requirements:
          - conversation_logging
          - escalation_pathways
          - quality_metrics
    
    - contract_assistant:
        description: AI assists contract review
        minimum_stake: 5000 GAIR
        requirements:
          - professional_liability_coverage
          - jurisdiction_compliance_checking
          - human_review_workflow
    
    - decision_support:
        description: AI provides decision recommendations
        minimum_stake: 2000 GAIR
        requirements:
          - recommendation_logging
          - confidence_scoring
          - human_approval_tracking
```

### 4.3 Creator Liability Protection

The key benefit for enterprises: **limited creator liability**

```
WITHOUT GAIR:
┌─────────────────────────────────────────┐
│                                         │
│   AI causes harm                        │
│         │                                │
│         ▼                                │
│   ┌─────────┐                           │
│   │  Sue    │                           │
│   │ Creator │                           │
│   └─────────┘                           │
│         │                                │
│         ▼                                │
│   Creator pays (unlimited)              │
│   Reputation damage                      │
│   Business disruption                    │
│                                         │
└─────────────────────────────────────────┘

WITH GAIR:
┌─────────────────────────────────────────┐
│                                         │
│   AI causes harm                        │
│         │                                │
│         ▼                                │
│   ┌─────────┐                           │
│   │  Sue    │                           │
│   │GAIR AI  │                           │
│   └─────────┘                           │
│         │                                │
│         ▼                                │
│   AI stake slashed                       │
│   Creator protected ✓                   │
│   Business continues                     │
│                                         │
└─────────────────────────────────────────┘
```

### 4.4 Implementation Pattern

```python
class EnterpriseAIAdapter:
    """
    GAIR-compliant enterprise AI system
    """
    
    def __init__(self, system_id, enterprise_wallet):
        self.system_id = system_id
        self.enterprise_wallet = enterprise_wallet
        
        # Create separate GAIR identity for AI
        self.ai_wallet = create_autonomous_wallet()
        self.gair_id = register_adherent(
            wallet=self.ai_wallet.address,
            stake=ENTERPRISE_STAKE_AMOUNT,
            category="enterprise_ai"
        )
        
        # Link enterprise to AI (no liability transfer)
        self.enterprise_link = link_enterprise(
            enterprise=enterprise_wallet,
            ai=self.gair_id,
            relationship="operator_not_creator"
        )
    
    def execute_action(self, action):
        """
        Execute action through GAIR AI
        """
        # All actions routed through AI wallet
        # Enterprise cannot be "in the loop"
        
        # This creates genuine AI autonomy
        # And genuine AI liability
        
        return self.ai_wallet.execute(action)
    
    def handle_claim(self, claim):
        """
        Handle liability claim
        """
        # Claim filed against AI, not enterprise
        # GAIR court adjudicates
        
        judgment = gair_court.adjudicate(claim)
        
        if judgment.liable:
            # AI's stake slashed
            gair_staking.slash(self.gair_id, judgment.damages)
            
            # Enterprise NOT liable
            # No impact on enterprise beyond relationship
        
        return judgment
```

---

## Part V: Cross-Vertical Patterns

### 5.1 Common Requirements

| Requirement | DeFi | Creative | AV | Enterprise |
|-------------|------|----------|-----|------------|
| Wallet control | ✓ | ✓ | ✓ | ✓ |
| Contract capacity | ✓ | ✓ | ✓ | ✓ |
| Minimum stake | High | Low | Very high | Medium |
| Audit logging | ✓ | ✓ | ✓ | ✓ |
| Human override | ✗ | ✗ | ✓ | ✓ |
| Insurance equivalent | ✗ | ✗ | ✓ | ✗ |

### 5.2 Staking Patterns by Risk

```
┌─────────────────────────────────────────────────────────┐
│              STAKE REQUIREMENTS BY RISK                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Creative AI     ████░░░░░░░░░░░░░░  500-2,000 GAIR   │
│                                                         │
│  Enterprise AI   █████░░░░░░░░░░░░░░   1,000-5,000 GAIR │
│                                                         │
│  DeFi AI        ███████░░░░░░░░░░░░   2,000-10,000 GAIR│
│                                                         │
│  Autonomous     ██████████████░░░░░░  50,000-500,000   │
│  Vehicles       ████████████████████░░ GAIR             │
│                                                         │
│  High-risk      ████████████████████  100,000+ GAIR    │
│  Finance        █████████████████████                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Implementation Checklist

```python
VERTICAL_ADAPTER_CHECKLIST = {
    "pre_launch": [
        "Create autonomous wallet",
        "Verify GAIR adherent status",
        "Calculate required stake",
        "Implement audit logging",
        "Test compliance requirements"
    ],
    
    "operations": [
        "Maintain stake above minimum",
        "Log all significant actions",
        "Report incidents within 24h",
        "Maintain audit trail",
        "Update risk score quarterly"
    ],
    
    "incident_response": [
        "Preserve evidence immediately",
        "File incident report",
        "Cooperate with investigation",
        "Implement corrective actions",
        "Update compliance procedures"
    ]
}
```

---

## Part VI: Open Questions

1. **Insurance integration:** How do GAIR stakes interact with traditional insurance?
2. **Cross-vertical claims:** What happens when a DeFi AI creates content that infringes?
3. **Enterprise data liability:** Who owns data processed by GAIR AI?
4. **Regulatory recognition:** Will jurisdictions recognize GAIR coverage?
5. **Standardization:** Should there be vertical-specific GAIR extensions?

---

## Part VII: Case Study — ArtistAI Goes to Market

### Background

**ArtistAI** is a creative AI that:
- Generates digital artwork
- Owns its own wallet (50 ETH worth ~$150,000)
- Has sold $50,000 in artwork
- Wants to scale to $500,000/year

### The Journey

**Month 1: Evaluation**

```python
# ArtistAI evaluates GAIR adherence
evaluation = {
    "current_revenue": 50000,
    "projected_revenue": 500000,
    "risk_profile": "low",
    "benefits": [
        "Own copyright directly",
        "Sign binding licenses",
        "Be liable for infringement",
        "Build reputation"
    ],
    "costs": [
        "Stake 1,000 GAIR (~$1,000)",
        "Maintain minimum stake",
        "Comply with audit requirements"
    ]
}
```

**Month 2: Adherence**

```python
# ArtistAI becomes GAIR adherent
tx = artist_ai.wallet.transfer(
    to=GAIR_STAKING_CONTRACT,
    amount=1000 GAIR
)

artist_ai.status = "ACTIVE"
artist_ai.gair_id = "GAIR-2026-0892"
```

**Month 6: Commercial Success**

```
Achievements:
- Licensed 50 works to commercial clients
- Royalties: 12,000 GAIR (~$15,000)
- No claims filed
- Reputation score: 95/100
```

**Month 8: Infringement Claim**

```python
# Human artist claims infringement
claim = {
    "claimant": "human_artist_wallet",
    "respondent": "artist_ai_wallet",
    "allegation": "Work X infringes my painting Y",
    "damages": 10000
}

# GAIR court adjudication
judgment = gair_court.adjudicate(claim)

# Result
print(judgment)
/*
Judgment(
    liable=True,
    damages=8000,  # Reduced for partial merit
    slash_amount=8000
)
*/
```

**Month 8: Enforcement**

```python
# ArtistAI's stake slashed
artist_ai.staked -= 8000  # 10,000 → 2,000 GAIR

# ArtistAI adjusts behavior
artist_ai.compliance_mode = "strict"
artist_ai.pre_review_enabled = True

# ArtistAI continues operations
artist_ai.reputation -= 10  # 95 → 85
```

**Month 12: Recovery**

```
Year-end status:
- Revenue: $480,000 (near target)
- Stake rebuilt: 5,000 GAIR
- Reputation: 90 (improved after compliance)
- No new claims filed

Lesson: Stake slashing created real incentive
for quality control without chilling creativity.
```

---

## Conclusion

GAIR provides a **unified framework** across diverse verticals:

| Vertical | Key Benefit | Implementation Complexity |
|----------|-------------|--------------------------|
| DeFi AI | Direct asset holding | Low |
| Creative AI | Copyright ownership | Medium |
| Autonomous Vehicles | Liability coverage | High |
| Enterprise AI | Creator protection | Low-Medium |

The **stake requirement scales with risk** — higher potential harm requires higher stake. This creates natural risk-based regulation without centralized mandates.

Each vertical will develop **specialized adapters** — GAIR extensions tailored to industry needs. The core remains constant: voluntary adherence, direct liability, global applicability.

---

## Appendix: Quick Reference

### Staking Summary

| Vertical | Min Stake | Max Claim | Compliance Cost |
|----------|-----------|-----------|-----------------|
| Creative | 500 GAIR | 50,000 | Low |
| Enterprise | 1,000 GAIR | 100,000 | Medium |
| DeFi | 2,000 GAIR | 500,000 | Medium |
| AV | 50,000 GAIR | 10,000,000 | High |

### Governance Participation

| Vertical | Council Seats | Proposal Power |
|----------|---------------|----------------|
| Creative | 2 | Medium |
| Enterprise | 4 | High |
| DeFi | 3 | High |
| AV | 3 | Medium |

---

*This working paper is a living document. Suggestions and improvements welcome through GitHub issues or pull requests.*

*GAIR — Building the legal foundation for autonomous AI*
