# Paywand Ismail — Portfolio

A personal developer portfolio built with [Hugo](https://gohugo.io/). No theme,
no CSS framework, no JavaScript framework — hand-written templates, CSS, and a
small amount of vanilla JS.

## Requirements

- Hugo Extended v0.120 or newer

## Local development

```powershell
hugo server -D
```

Then open <http://localhost:1313>.

`-D` includes draft content. Live reload is on by default.

## Production build

```powershell
hugo --gc --cleanDestinationDir --minify
```

Output goes to `public/`.

## Deployment

### Pre-deploy checklist

1. Replace the `[bracketed placeholders]` listed in [PLACEHOLDERS.md](PLACEHOLDERS.md) (GitHub/LinkedIn links, project repos, study dates, optional photo/CV).
2. Update `baseURL` in `hugo.toml` to your real domain (GitHub Actions sets this automatically for GitHub Pages).
3. Optionally add a `1200x630` social preview image at `static/images/og-cover.png`.

### Option A — GitHub Pages (automatic via GitHub Actions)

A workflow is included at `.github/workflows/deploy.yml`.

1. Push this repository to GitHub with `main` as the default branch.
2. In your repository on GitHub, open **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Every push to `main` builds and deploys the site automatically.

### Option B — Cloudflare Pages or Netlify

- **Build command:** `hugo --gc --minify`
- **Publish directory:** `public`
- **Environment variable:** `HUGO_VERSION` set to `0.170.1` (or `0.120.0+` Extended)

## Where to edit your information

| I want to change… | Edit this file |
| --- | --- |
| Name, role, bio, email, social links | `data/profile.toml` |
| Skills | `data/skills.toml` |
| Education | `data/education.toml` |
| Experience | `data/experience.toml` |
| Projects | `content/projects/*.md` |
| Site title, meta description, base URL | `hugo.toml` |
| Colours, fonts, spacing | `assets/css/` |

Anything shown in `[square brackets]` is a placeholder that still needs real
content.

## Project structure

```
.
├── hugo.toml              # site configuration
├── data/                  # structured content (profile, skills, education)
├── content/
│   └── projects/          # one Markdown file per project
├── layouts/
│   ├── _default/          # base template
│   ├── partials/          # reusable components (nav, footer, cards…)
│   └── index.html         # homepage
├── assets/
│   ├── css/               # stylesheets (processed by Hugo Pipes)
│   └── js/                # vanilla JavaScript
└── static/                # images and files copied as-is
```
