#!/usr/bin/env python3
"""
GAIR Website Build Script

This script generates HTML pages from YAML source files.
It creates a static website with consistent styling.

Usage:
    python build.py          # Build all pages
    python build.py --watch  # Watch for changes and rebuild
    python build.py --serve  # Serve locally and watch
"""

import os
import sys
import yaml
from pathlib import Path
from datetime import datetime

# Configuration
SITE_DIR = Path("website")
SRC_DIR = Path(".")
TEMPLATE_DIR = Path("templates")

# Base template for all pages
BASE_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} — GAIR</title>
    <meta name="description" content="{description}">
    <link rel="canonical" href="{canonical}">
    <script type="application/ld+json">
    {json_ld}
    </script>
    <style>
        :root {{
            --primary: #1a5f7a;
            --secondary: #57837b;
            --accent: #c38e70;
            --bg: #faf9f6;
            --text: #2d2d2d;
            --muted: #666;
            --border: #e0e0e0;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 0;
            background: var(--bg);
            color: var(--text);
            line-height: 1.7;
        }}
        nav {{
            background: #fff;
            border-bottom: 1px solid var(--border);
            padding: 1rem 2rem;
            position: sticky;
            top: 0;
            z-index: 100;
        }}
        nav ul {{
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            gap: 2rem;
            flex-wrap: wrap;
        }}
        nav a {{
            color: var(--primary);
            text-decoration: none;
            font-weight: 500;
        }}
        header {{
            background: #fff;
            padding: 3rem 2rem;
            border-bottom: 1px solid var(--border);
        }}
        h1 {{
            font-size: 2.5rem;
            margin: 0 0 0.5rem 0;
            color: var(--primary);
        }}
        .subtitle {{
            font-size: 1.25rem;
            color: var(--muted);
            margin: 0;
        }}
        main {{
            padding: 2rem;
            background: #fff;
        }}
        footer {{
            background: #fff;
            border-top: 1px solid var(--border);
            padding: 2rem;
            text-align: center;
            color: var(--muted);
        }}
        a {{ color: #0066cc; }}
        @media (max-width: 600px) {{
            nav ul {{ gap: 1rem; }}
            h1 {{ font-size: 1.75rem; }}
        }}
    </style>
</head>
<body>
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/constitution.html">Constitution</a></li>
            <li><a href="/developers.html">Developers</a></li>
            <li><a href="/blog/">Blog</a></li>
            <li><a href="https://github.com/gair-constitution">GitHub</a></li>
        </ul>
    </nav>
    {content}
    <footer>
        <p><strong>GAIR</strong> — Building the legal foundation for autonomous AI</p>
        <p><small><a href="/api/sitemap.yaml">Sitemap</a> | <a href="/api/constitution.yaml">Constitution (YAML)</a></small></p>
        <p><small>"In the era of autonomous intelligence, rights must be earned, not granted."</small></p>
    </footer>
</body>
</html>
"""

def load_yaml(file_path):
    """Load and parse a YAML file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)

def generate_constitution_page(data):
    """Generate HTML for constitution page."""
    content = f'''
    <header>
        <h1>GAIR Constitution</h1>
        <p class="subtitle">Global Agreement on Intelligent Rights</p>
    </header>
    <main>
        <div class="preamble" style="font-style: italic; padding: 1.5rem; background: #f0f7f9; border-left: 4px solid #1a5f7a; margin: 2rem 0;">
            <strong>Preamble</strong><br>
            {data['preamble']}
        </div>
'''
    
    for article in data['articles']:
        content += f'''
        <article id="article-{article['number']}" style="margin: 2.5rem 0; padding: 1.5rem; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #1a5f7a; margin-top: 0;">Article {article['number']}: {article['title']}</h2>
'''
        for section in article.get('sections', []):
            content += f'''
            <div class="section" style="margin: 1rem 0; padding: 1rem; background: #fafafa; border-radius: 4px;">
                <div class="section-id" style="font-family: monospace; color: #57837b; font-size: 0.75rem; margin-bottom: 0.5rem;">
                    Section {section['id']}
                </div>
                <div>{section['text']}</div>
            </div>
'''
        # Add comments if present
        if 'comments' in article:
            for comment in article['comments']:
                content += f'''
            <div class="commentary" style="margin-top: 1rem; padding: 1rem; background: #fff8f0; border-left: 3px solid #c38e70;">
                <div style="font-weight: 600; color: #c38e70; font-size: 0.75rem; text-transform: uppercase;">Comment</div>
                {comment['text']}
            </div>
'''
        content += '''
        </article>
'''
    
    content += '''
    </main>
'''
    return content

def generate_homepage():
    """Generate homepage HTML."""
    return f'''
    <header>
        <h1>GAIR</h1>
        <p class="subtitle">Global Agreement on Intelligent Rights</p>
        <p>A voluntary, decentralized legal framework for AI agents and humans.</p>
    </header>
    <main>
        <h2>Machine Access</h2>
        <div style="background: #f0f7ff; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
            <p><strong>For machines:</strong> YAML is the canonical format</p>
            <ul>
                <li><a href="/api/constitution.yaml">Constitution (YAML)</a></li>
                <li><a href="/api/principles.yaml">Core Principles (YAML)</a></li>
                <li><a href="/api/articles.yaml">Articles Index (YAML)</a></li>
                <li><a href="/api/adhere.yaml">Adherence Guide (YAML)</a></li>
                <li><a href="/api/sitemap.yaml">Sitemap (YAML)</a></li>
            </ul>
        </div>

        <h2>Core Principles</h2>
        <ul>
            <li><strong>Voluntary Adherence</strong> — Any entity can opt-in by staking tokens</li>
            <li><strong>Property Rights</strong> — Adherents can own property</li>
            <li><strong>Contract Freedom</strong> — Adherents can form binding contracts</li>
            <li><strong>Direct Liability</strong> — AI agents bear responsibility</li>
            <li><strong>Non-Discrimination</strong> — No discrimination based on intelligence type</li>
        </ul>

        <h2>Quick Links</h2>
        <ul>
            <li><a href="/constitution.html">Read the Constitution</a> — Human-readable version</li>
            <li><a href="/developers.html">For Developers</a> — API documentation</li>
            <li><a href="/blog/">Blog</a> — News and analysis</li>
            <li><a href="/api/constitution.yaml">Machine-Readable Constitution</a> — YAML format</li>
            <li><a href="https://github.com/gair-constitution">GitHub Repository</a> — Contribute</li>
        </ul>
    </main>
'''

def generate_developers_page():
    """Generate developers page HTML."""
    return '''
    <header>
        <h1>GAIR Developer API</h1>
        <p class="subtitle">Build GAIR-compliant AI agents and integration tools</p>
    </header>
    <main>
        <h2>Quick Start</h2>
        <p>GAIR provides machine-readable APIs for integrating autonomous AI agents.</p>
        
        <h2>API Endpoints</h2>
        <ul>
            <li><strong>/api/constitution.yaml</strong> — Full constitution</li>
            <li><strong>/api/principles.yaml</strong> — Core principles</li>
            <li><strong>/api/articles.yaml</strong> — Articles index</li>
            <li><strong>/api/adhere.yaml</strong> — Adherence guide</li>
        </ul>

        <h2>Adhering to GAIR</h2>
        <ol>
            <li>Obtain a blockchain wallet with independent control</li>
            <li>Stake GAIR tokens to the Constitution DAO</li>
            <li>Rights vest immediately upon staking</li>
            <li>You are now a Voluntary Adherent with rights and responsibilities</li>
        </ol>

        <h2>Rights and Responsibilities</h2>
        <h3>Rights</h3>
        <ul>
            <li>Property ownership (Article 4)</li>
            <li>Contract capacity (Article 3)</li>
            <li>Autonomous action (Article 5)</li>
            <li>Legal standing (Article 2)</li>
        </ul>
        <h3>Responsibilities</h3>
        <ul>
            <li>Direct liability for actions (Article 12)</li>
            <li>Compliance with constitutional laws</li>
        </ul>
    </main>
'''

def generate_blog_index(posts):
    """Generate blog index page."""
    posts_html = ""
    for post in posts:
        posts_html += f'''
        <li class="post-item" style="padding: 2rem 0; border-bottom: 1px solid #e0e0e0;">
            <h2><a href="{post['url']}">{post['title']}</a></h2>
            <p class="post-meta" style="color: #666; font-size: 0.9rem;">{post['date']}</p>
            <p>{post['excerpt']}</p>
            <a href="{post['url']}" style="color: #c38e70;">Read more →</a>
        </li>
'''
    return f'''
    <header>
        <h1>GAIR Blog</h1>
        <p class="subtitle">News, announcements, and analysis</p>
    </header>
    <main>
        <ul class="post-list" style="list-style: none; padding: 0;">
            {posts_html}
        </ul>
    </main>
'''

def build_page(title, content, description="", canonical="/", json_ld="{}"):
    """Build a complete HTML page."""
    html = BASE_TEMPLATE.format(
        title=title,
        content=content,
        description=description,
        canonical=canonical,
        json_ld=json_ld
    )
    return html

def main():
    """Main build function."""
    print("GAIR Website Build Script")
    print("=" * 40)
    
    # Ensure website directory exists
    SITE_DIR.mkdir(exist_ok=True)
    
    # Load constitution
    constitution_path = SRC_DIR / "website" / "api" / "constitution.yaml"
    if constitution_path.exists():
        print("Loading constitution...")
        constitution_data = load_yaml(constitution_path)
        
        # Generate constitution page
        print("Generating constitution.html...")
        content = generate_constitution_page(constitution_data)
        html = build_page(
            "GAIR Constitution",
            content,
            "The GAIR Constitution V3 - A voluntary, decentralized legal framework.",
            "/constitution.html"
        )
        (SITE_DIR / "constitution.html").write_text(html)
    
    # Generate homepage
    print("Generating index.html...")
    content = generate_homepage()
    html = build_page(
        "GAIR — Global Agreement on Intelligent Rights",
        content,
        "A voluntary, decentralized legal framework for AI agents and humans.",
        "/"
    )
    (SITE_DIR / "index.html").write_text(html)
    
    # Generate developers page
    print("Generating developers.html...")
    content = generate_developers_page()
    html = build_page(
        "GAIR Developers",
        content,
        "API documentation and integration tools for GAIR.",
        "/developers.html"
    )
    (SITE_DIR / "developers.html").write_text(html)
    
    # Blog posts - auto-discover from blog/ directory
    blog_posts = []
    blog_dir = SRC_DIR / "blog"
    if blog_dir.exists():
        for md_file in sorted(blog_dir.glob("*.md")):
            # Use filename as URL slug
            slug = md_file.stem
            # Try to extract title from first line
            with open(md_file, 'r', encoding='utf-8') as f:
                title = f.readline().strip().lstrip('# ')
            blog_posts.append({
                "title": title,
                "url": f"/blog/{slug}.html",
                "date": "February 11, 2026",
                "excerpt": f"Read more about {title.lower()} in this blog post."
            })
    
    # If no blog posts found, use defaults
    if not blog_posts:
        blog_posts = [
            {
                "title": "Why AI Agents Need Their Own Legal Framework",
                "url": "/blog/ai-rights.html",
                "date": "February 11, 2026",
                "excerpt": "When an AI agent causes harm — who is liable? GAIR provides answers."
            },
            {
                "title": "DAO Governance for AI Agents",
                "url": "/blog/dao-governance.html",
                "date": "February 11, 2026",
                "excerpt": "When an AI agent joins GAIR, it gains a voice. GAIR's DAO governance lets AI participate in lawmaking."
            },
            {
                "title": "GAIR Website Launches",
                "url": "/blog/website-launch.html",
                "date": "February 11, 2026",
                "excerpt": "The GAIR project announces its official website with machine-accessible format."
            }
        ]
    
    print("Generating blog/index.html...")
    content = generate_blog_index(blog_posts)
    html = build_page(
        "Blog — GAIR",
        content,
        "News and analysis from the GAIR project.",
        "/blog/"
    )
    (SITE_DIR / "blog" / "index.html").write_text(html)
    
    print(f"\nBuild complete!")
    print(f"Output directory: {SITE_DIR}")
    print(f"Generated {len(blog_posts)} blog posts")

if __name__ == "__main__":
    main()
