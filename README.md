# aerlinger.com

Personal site and blog, built with [Jekyll 4](https://jekyllrb.com) and deployed to GitHub Pages via GitHub Actions.

## Local development

```sh
bundle install
bundle exec jekyll serve --livereload --drafts
```

Then open http://localhost:4000.

## Structure

| Path | What it is |
| --- | --- |
| `_config.yml` | Site title, tagline, social links, analytics/AdSense ids |
| `_posts/` | Published posts (`YYYY-MM-DD-slug.md`) |
| `_drafts/` | Unpublished posts (shown with `--drafts`) |
| `_projects/` | Project cards on the home page (`title`, `description`, `repo`, `tech`, `order`) |
| `_layouts/`, `_includes/` | Templates |
| `assets/css/main.css` | All styles (light + dark theme via CSS custom properties) |
| `assets/js/main.js` | Theme toggle, reading progress fallback, client-side search |

Built-in: SEO/Open Graph tags (`jekyll-seo-tag`), Atom feed at `/feed.xml`, `sitemap.xml`, search over `/search.json`, dark mode, tags page.

## Deploying

Pushes to `master` run `.github/workflows/pages.yml`. In the repository's **Settings → Pages**, set **Source** to **GitHub Actions**. For a custom domain, set it in the same settings page (or add a `CNAME` file).
