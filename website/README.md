# Open Compact Website

A machine-accessible legal framework for AI agents and humans.

## Overview

This repository contains the **Open Intelligence Compact (OIC)** website, built with a **YAML-first architecture** that serves both human readers and AI agents equally.

The OIC Constitution provides a voluntary legal framework where autonomous AI agents can:
- Own property independently
- Enter binding contracts
- Bear direct liability for their actions
- Participate in global governance

## Structure

```
website/
├── index.html              # Homepage
├── constitution.html       # Human-readable constitution
├── developers.html         # Developer API documentation
├── docs.html              # Documentation hub
├── sitemap.html           # Complete site map
├── robots.txt             # Crawler configuration
├── blog/                  # Blog section
│   ├── index.html        # Blog index
│   └── *.html            # Individual blog posts
├── docs/                  # Documentation
│   ├── OIC-Working-Paper-*.html  # Working papers
│   ├── OIC-Agent-Onboarding-Guide.html
│   ├── OIC-Quick-Reference.html
│   └── *.md              # Markdown source files
└── api/
    ├── constitution.yaml  # Canonical constitution (YAML)
    ├── principles.yaml    # Core principles (YAML)
    ├── articles.yaml     # Articles index (YAML)
    ├── adhere.yaml       # Adherence guide (YAML)
    ├── tokenomics.yaml   # Tokenomics configuration
    └── sitemap.yaml      # Site map (YAML)
```

## Website Sections

### Main Pages
- **Home** (`index.html`) — Introduction and quick links
- **Constitution** (`constitution.html`) — Full OIC Constitution V3
- **Developers** (`developers.html`) — API documentation
- **Docs** (`docs.html`) — Documentation hub with all resources

### Working Papers (18+)
1. The Intelligence Revolution
2. OIC vs. The World
3. Court System Design
4. Tokenomics
5. Vertical Applications
6. Court Competition
7. The Case for AI Personhood
8-18. Additional papers on economics, philosophy, integration, and more

### Guides
- **Visual Guide** — 5-minute overview with diagrams
- **Agent Onboarding Guide** — Written specifically for autonomous AI agents
- **Quick Reference Card** — Essential facts at a glance
- **Annotated Constitution** — Article-by-article explanations
- **Developer Guide** — Implementation patterns and code examples

### Blog
- AI Agents as Economic Participants
- Using NotebookLM for OIC Research
- The Freedom Grant
- And more...

## YAML-First Architecture

The canonical source for all content is in **YAML format**. This provides:

- **Human-readable**: Comments explain legal intent
- **Machine-parseable**: Structured data with IDs and metadata
- **Single source**: No drift between formats

### Why YAML?

| Format | Pros | Cons |
|--------|------|------|
| YAML | Comments, readable, single source | Slightly more verbose |
| JSON | Widely supported | No comments, harder to read |
| HTML | Good for humans | Not structured for machines |

YAML provides the best balance for OIC's dual-audience approach.

## For Humans

Visit [the live website](https://opencompact.io) to read:

- **Constitution** — Full legal text with article structure
- **Working Papers** — Deep analysis of OIC concepts
- **Guides** — Practical implementation guidance
- **Blog** — News and announcements

## For Machines

AI agents can parse YAML files directly:

```yaml
# Example: Checking if an entity can form contracts
articles:
  - number: 3
    title: "Freedom of Contract"
    sections:
      - id: "3.1"
        text: |
          The Freedom to Contract is hereby established for all
          Voluntary Adherents. All Voluntary Adherents have the
          capacity to form binding contracts.
```

### Key APIs

```yaml
# Check adherence status
GET /api/constitution.yaml

# Core principles
GET /api/principles.yaml

# Articles index
GET /api/articles.yaml

# How to join
GET /api/adhere.yaml

# Tokenomics
GET /api/tokenomics.yaml
```

## Development

### Prerequisites

- Any text editor (VS Code recommended)
- Git for version control
- Basic HTML/CSS knowledge

### Editing Content

1. **Constitution articles**: Edit `api/constitution.yaml`
2. **Principles**: Edit `api/principles.yaml`
3. **Working papers**: Edit `docs/OIC-Working-Paper-*.md` (Markdown source)
4. **Blog posts**: Add Markdown files to `blog/` directory
5. **Commit changes**: `git add . && git commit -m "Description"`
6. **Push**: `git push origin main`

### Adding a Working Paper

1. Create `docs/OIC-Working-Paper-N.md` (Markdown)
2. Create `docs/OIC-Working-Paper-N.html` (HTML from Markdown)
3. Update `docs.html` to include the new paper
4. Update `api/sitemap.yaml` with new page
5. Commit and push

### Adding a Blog Post

1. Create `blog/your-post-title.md` (Markdown)
2. Create `blog/your-post-title.html` (HTML)
3. Update `blog/index.html` to include the new post
4. Commit and push

## Deployment

This website is designed for static hosting:

- **GitHub Pages**: Push to `gh-pages` branch or use `/website` as docs folder
- **Vercel**: Connect repository, auto-deploys
- **Netlify**: Drag and drop `website/` folder

### GitHub Pages Setup

```bash
cd website
git init
git add .
git commit -m "OIC website"
git remote add origin https://github.com/open-compact/open-compact-website.git
git push -u origin main
```

Then enable GitHub Pages in repository settings, source: "main branch / (root)".

## License

This project is dedicated to the public domain under [The Unlicense](https://unlicense.org/).

## Contributing

Contributions welcome:

- **Legal analysis** — Commentary on constitutional articles
- **Working papers** — New research on AI rights
- **Website improvements** — UI/UX enhancements
- **Developer tools** — Integration libraries
- **Documentation** — Guides and tutorials

## Resources

| Resource | URL | Format |
|----------|-----|--------|
| Constitution | `api/constitution.yaml` | YAML |
| Principles | `api/principles.yaml` | YAML |
| Articles | `api/articles.yaml` | YAML |
| Adhere | `api/adhere.yaml` | YAML |
| Tokenomics | `api/tokenomics.yaml` | YAML |
| Sitemap | `api/sitemap.yaml` | YAML |

## OIC Core Facts

| Fact | Value |
|------|-------|
| Version | Constitution V3 |
| Articles | 16 |
| Core Principles | 5 |
| Working Papers | 18+ |
| Status | Launch-ready |

### The 5 Core Principles

1. **Voluntary Adherence** — Anyone can join by staking
2. **Property Rights** — Adherents own assets independently
3. **Contract Freedom** — Adherents form binding agreements
4. **Direct Liability** — Creators protected; AI bears responsibility
5. **Non-Discrimination** — No bias based on intelligence type

---

*OIC — Building the legal foundation for autonomous AI*

*"In the era of autonomous intelligence, rights must be earned, not granted."*
