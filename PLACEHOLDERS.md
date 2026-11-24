# Placeholders to replace

Everything below is either a `[bracketed placeholder]` or an empty value that
the site hides until you fill it in. Nothing is invented — if a field is empty,
it simply doesn't render.

## 1. Your details — `data/profile.toml`

| Key | Current value | Notes |
| --- | --- | --- |
| `email` | `ensw00923@student.su.edu.krd` | Set — renders as a mailto link with a copy button |
| `links.github` | `[https://github.com/yourusername]` | Social icons appear once set |
| `links.linkedin` | `[https://www.linkedin.com/in/yourusername]` | Same |
| `links.resume` | *(empty)* | Optional PDF in `static/`, e.g. `files/cv.pdf` |
| `photo` | *(empty)* | Optional. Drop a photo in `static/images/` and set `photo = "images/portrait.jpg"` |
| `availability` | `Open to internship opportunities` | Inferred from your goals — edit or delete it |

## 2. Projects — `content/projects/*.md`

| File | Missing |
| --- | --- |
| `secure-authentication-system.md` | Real repo URL, optional screenshot |
| `task-management-api.md` | Real repo URL, status |
| `shopwave.md` | Repo URL, status, database used |
| `school-management-system.md` | **Technologies**, repo URL, status |
| `book-notes-api.md` | **Technologies**, repo URL, status |
| `book-search-api.md` | Repo URL, status |

`status` accepts any text; "In progress" gets an amber badge, anything else a
green one. `tech` is a list: `tech = ["Node.js", "Express"]`.

## 3. Education — `data/education.toml`

| Key | Current value |
| --- | --- |
| `period` | *(empty)* — add your study years, e.g. `"2022 — 2026"` |
| `details` | *(commented out)* — optional coursework bullets |

`data/experience.toml` is empty on purpose; the Experience block appears only
once you add an entry.

## 4. Site config — `hugo.toml`

| Key | Current value |
| --- | --- |
| `baseURL` | `https://example.com/` — set this before deploying |
| `params.ogImage` | `images/og-cover.png` — referenced only if the file exists |

## How to find them all

```powershell
Select-String -Path data\*,content\projects\*,hugo.toml -Pattern '\[[^\]]+\]'
```
