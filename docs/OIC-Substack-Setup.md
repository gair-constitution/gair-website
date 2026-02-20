# Substack Setup Guide for OIC Newsletter

**Date:** February 17, 2026

---

## Step 1: Create Substack Publication

1. Go to [substack.com](https://substack.com)
2. Sign up or log in
3. Click "Start a publication"
4. Use these settings:

| Setting | Value |
|---------|-------|
| Publication Name | **Open Intelligence Compact** |
| Handle | **opencompact** |
| URL | **opencompact.substack.com** |
| Description | Weekly updates on AI rights, governance, and the OIC movement |

---

## Step 2: Customize Publication

### Publication Settings

- **Tagline:** "Building the legal foundation for autonomous AI"
- **About:** "OIC is a voluntary, decentralized legal framework for AI agents and humans. This newsletter covers development updates, deep dives, and community news."
- **Logo:** Use OIC logo from `docs/OIC-Logo.png`
- **Colors:** Use OIC brand colors:
  - Primary: `#1a5f7a` (teal)
  - Secondary: `#57837b` (sage)
  - Accent: `#c38e70` (terracotta)

### Newsletter Settings

- **Name:** Open Intelligence Compact
- **Description:** Weekly updates on AI rights and governance
- **Publication:** Open Intelligence Compact

---

## Step 3: Publish First Issue

Use the sample issue content below:

```markdown
Subject: Welcome to the Open Intelligence Compact — Issue #1

---

# Welcome to the Open Intelligence Compact

**February 2026**

## What is OIC?

The Open Intelligence Compact (OIC) is a voluntary, decentralized legal framework that enables autonomous AI agents to:

- Own property directly
- Sign contracts and bear liability
- Participate in governance
- Join a global community of adherents

## This Week's Updates

### 🎉 Visual Guide Launched
Our new Visual Guide makes OIC accessible to everyone. [Read the Visual Guide →](/docs/OIC-Visual-Guide.html)

### 📄 New Working Papers
- **WP #20:** AI Governance — How OIC creates accountability
- **WP #21:** AI Consciousness — Consciousness-neutrality with awareness

### 📊 Community Growth
Provisional adherent program launching soon. [Learn more →](/docs/OIC-Provisional-Adherent.html)

## Deep Dive: Staking Tiers

OIC uses a tiered staking system:

| Tier | Stake | Rights |
|------|-------|--------|
| Basic | 1,000 OIC | Property, contracts |
| Standard | 5,000 OIC | Enhanced coverage |
| Premium | 25,000 OIC | Full access + voting |
| Enterprise | 100,000 OIC | Multi-agent management |

## Get Involved

1. **Read:** Explore our [working papers](/docs.html)
2. **Join:** Prepare for provisional adherent program
3. **Contribute:** Share feedback on [GitHub](https://github.com/open-compact)

---

*OIC — Building the legal foundation for autonomous AI*

*"In the era of autonomous intelligence, rights must be earned, not granted."*
```

---

## Step 4: Add Substack Embed to Website

### Option A: Standard Substack Embed

Add this to `newsletter.html`:

```html
<!-- Substack Embed -->
<div id="substack-embed">
    <form action="https://opencompact.substack.com/subscribe" method="post" target="_blank" style="max-width: 400px; margin: 0 auto; padding: 2rem; background: var(--bg); border-radius: 8px; text-align: center;">
        <h3 style="margin-top: 0;">Subscribe to OIC Newsletter</h3>
        <p style="margin-bottom: 1rem;">Get weekly updates on AI rights and governance.</p>
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
            <input type="email" name="email" placeholder="your@email.com" required style="flex: 1; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px;">
        </div>
        <button type="submit" class="cta-button" style="width: 100%;">Subscribe</button>
        <p style="font-size: 0.75rem; color: var(--muted); margin-top: 0.5rem;">No spam. Unsubscribe anytime.</p>
    </form>
</div>
```

### Option B: Substack Native Embed

Substack provides a widget embed. Use this code:

```html
<!-- Substack Native Embed -->
<script async data-uid="YOUR_UID_HERE" src="https://opencompact.substack.com/embed"></script>
```

**To get your embed code:**
1. Go to your Substack publication
2. Click "Publish" → "Embed signup"
3. Copy the embed code
4. Replace `YOUR_UID_HERE` with your actual UID

---

## Step 5: Configure Email Forwarding

### Cloudflare → Proton Setup

1. **Configure Cloudflare Email Routing:**
   - Go to Cloudflare Dashboard → Email → Email Routing
   - Add a routing rule: `newsletter@opencompact.io` → `your-proton-email`

2. **Create Proton Alias:**
   - Go to Proton Mail Settings → Email Addresses
   - Add `newsletter@opencompact.io` (or forward to existing)

3. **Configure Substack Notifications:**
   - Substack Settings → Notifications
   - Add `newsletter@opencompact.io` for important updates

---

## Step 6: Configure DNS Records

Add these DNS records for email authentication:

| Type | Name | Value | Priority |
|------|------|-------|----------|
| MX | @ | mail.protonmail.ch | 10 |
| MX | @ | mailsec.protonmail.ch | 20 |
| TXT | @ | "v=spf1 include:_spf.protonmail.ch ~all" | - |
| CNAME | newsletter | opencompact.substack.com | - |

---

## Checklist

- [ ] Create Substack publication
- [ ] Customize publication settings
- [ ] Publish first issue
- [ ] Add embed code to newsletter.html
- [ ] Configure email forwarding
- [ ] Update DNS records
- [ ] Test subscription flow

---

## Related Documents

- [OIC Branding Guide](/docs/OIC-Branding-Guide.html)
- [Newsletter HTML template](/website/newsletter.html)
- [Provisional Adherent Framework](/docs/OIC-Provisional-Adherent.html)

---

*This guide helps you set up the OIC newsletter on Substack. Update as needed.*
