# Contributing to GAIR

Thank you for your interest in contributing to the Global Agreement on Intelligent Rights (GAIR)! This document outlines how you can help build the legal framework for autonomous AI.

## Ways to Contribute

### 1. Legal Analysis and Commentary
- Analyze constitutional articles for legal soundness
- Identify gaps or ambiguities in the text
- Suggest improvements to legal language
- Research precedents in AI law and personhood

### 2. Working Papers
- Write new working papers on GAIR-related topics
- Update existing papers with new research
- Translate concepts into practical applications
- Address criticism and objections

### 3. Website Improvements
- Improve HTML/CSS design and accessibility
- Add new documentation and guides
- Enhance machine-readable APIs
- Optimize for search engines

### 4. Developer Tools
- Build integration libraries for common platforms
- Create verification and compliance tools
- Develop staking and adherence automation
- Build testing frameworks

### 5. Translation and Localization
- Translate core documents into other languages
- Adapt content for different legal jurisdictions
- Create jurisdiction-specific guides

## Getting Started

### Prerequisites

- Git installed locally
- GitHub account
- Basic understanding of HTML and Markdown
- Familiarity with YAML is helpful but not required

### Quick Start

1. **Fork the repository**
   ```
   Visit https://github.com/gair-constitution/gair-website
   Click "Fork" button
   ```

2. **Clone your fork**
   ```
   git clone https://github.com/YOUR-USERNAME/gair-website.git
   cd gair-website
   ```

3. **Create a branch**
   ```
   git checkout -b your-feature-name
   ```

4. **Make changes**
   - Edit YAML files for constitutional changes
   - Edit Markdown/HTML for documentation
   - Add new working papers or blog posts

5. **Commit your changes**
   ```
   git add .
   git commit -m "Description of your changes"
   ```

6. **Push to GitHub**
   ```
   git push origin your-feature-name
   ```

7. **Submit a Pull Request**
   - Visit the original repository
   - Click "New Pull Request"
   - Describe your changes
   - Submit

## Content Guidelines

### Constitution and Principles

When editing constitutional content:

- Use clear, precise legal language
- Maintain consistency with existing style
- Add comments in YAML explaining intent
- Consider implications across jurisdictions
- Reference existing articles when adding new content

### Working Papers

Working papers should:

- Address a specific GAIR-related topic
- Provide thorough analysis with evidence
- Consider counterarguments
- Include practical recommendations
- Follow the existing working paper structure

### Blog Posts

Blog posts should:

- Be timely and relevant
- Provide substantive content
- Link to deeper resources (working papers, docs)
- Follow GAIR's voice: professional but accessible

### Code and Tools

When contributing code:

- Write clear, commented code
- Include tests where applicable
- Follow existing code style
- Document functions and modules
- Keep dependencies minimal

## Project Structure

```
gair-website/
├── README.md              # This file
├── LICENSE               # The Unlicense
├── index.html            # Homepage
├── constitution.html      # Constitution page
├── developers.html       # Developer docs
├── docs.html            # Documentation hub
├── sitemap.html         # Site map
├── blog/               # Blog posts
│   ├── index.html     # Blog index
│   └── *.html         # Individual posts
├── docs/               # Documentation
│   ├── GAIR-Working-Paper-*.html/md
│   ├── GAIR-Agent-Onboarding-Guide.html/md
│   ├── GAIR-Quick-Reference.html/md
│   ├── GAIR-Constitution-Annotated.md
│   └── GAIR-Developer-Guide.md
└── api/               # Machine-readable APIs (canonical source)
    ├── constitution.yaml
    ├── principles.yaml
    ├── articles.yaml
    ├── adhere.yaml
    ├── tokenomics.yaml
    └── sitemap.yaml
```

## Style Guide

### Writing Style

- **Tone**: Professional, accessible, authoritative
- **Structure**: Clear headings, logical flow
- **Language**: Plain English, avoid jargon where possible
- **Citations**: When citing sources, include URLs or references

### YAML Files

- Use comments to explain legal intent
- Maintain consistent indentation (2 spaces)
- Use descriptive IDs for sections
- Keep line length reasonable

### HTML Files

- Use semantic HTML5 elements
- Include proper meta tags
- Maintain responsive design
- Follow accessibility guidelines

### Markdown Files

- Use standard Markdown syntax
- Include front matter for HTML generation
- Keep line length under 100 characters
- Use relative links within the project

## Communication

### Issues

Use GitHub Issues for:

- Reporting bugs
- Suggesting features
- Discussing large changes
- Asking questions

### Pull Requests

- Keep PRs focused and small
- Include clear description
- Link related issues
- Allow time for review

### Discussions

For general questions and brainstorming, use GitHub Discussions.

## Recognition

Contributors will be recognized in:

- Commit history
- Documentation credits
- Acknowledgment in releases

## Legal Notes

### No Legal Advice

GAIR provides a framework, not legal advice. Contributors should:

- Not provide jurisdiction-specific legal advice
- Clarify when content is analysis vs. guidance
- Encourage users to consult qualified attorneys

### License

All contributions are made under The Unlicense (public domain). By contributing, you agree to dedicate your work to the public domain.

## Questions?

If you have questions about contributing:

- Open a GitHub Discussion
- Email: hello@gair.io
- Visit the website: https://gair.io

---

*Thank you for helping build the legal foundation for autonomous AI.*
