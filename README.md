# Desert Light Weddings

**Live site:** [https://desertlightweddings.com](https://desertlightweddings.com)

A full-featured wedding photography website for a Scottsdale, AZ-based photographer. Built with AI-assisted development using Windsurf Cascade.

## Features

### Core Pages (10+)
- **Home** — Hero section, portfolio grid, testimonials, CTAs
- **Portfolio** — Wedding photo gallery with lazy-loaded WebP images
- **About** — Photographer bio and story
- **Pricing** — Transparent pricing breakdown
- **Packages** — Detailed service tier comparison
- **Contact** — Functional contact form (Formspree integration with email delivery)
- **Venues** — Arizona wedding venue directory
- **Vendors** — Recommended vendor list
- **Bride Resources** — Planning guides and tips
- **Blog** — 3 SEO-optimized articles (Golden Hour, Bokeh, Engagement Outfits)

### Interactive Wedding Website Generator (`/weddings/`)
A full client-facing web app where couples can create their own free wedding website:
- **Form-based builder** — Couple names, date, venue, love story, wedding party, registry links, RSVP email, custom URL slug
- **Photo upload with client-side compression** — Resizes to 500px max, JPEG 0.5 quality
- **Supabase backend** — Stores wedding data in PostgreSQL via Supabase client
- **Dynamic template rendering** — `template.html?slug=your-wedding` renders personalized wedding sites
- **Serial number system** — Each wedding gets a unique code (format: `DLW-XXXX-XXXX`)
- **Find My Wedding** — Guests can look up a wedding by serial number
- **Email confirmation** — Couples can email themselves their wedding details via mailto

### Functional Contact Form
- Formspree-powered form with validation
- Fields: Name, Partner, Phone, Email, Date, Venue, Message
- Redirects to custom thank-you page on submission
- Fallback mailto link

### SEO & Technical
- **Structured Data (JSON-LD):** LocalBusiness, AggregateRating (5.0/150 reviews), FAQPage schemas
- **Open Graph + Twitter Cards** on every page
- **Canonical URLs** on every page
- **XML Sitemap** + **robots.txt**
- **Keyword-rich meta descriptions** targeting Scottsdale/Phoenix/Arizona wedding photography
- **Internal linking strategy** across all pages

### Performance
- **WebP images** with JPG fallbacks
- **Lazy loading** on all images
- **Font preloading** via `<link rel="preload">`
- **Aggressive caching** — Netlify headers set `max-age=31536000` for all image assets
- **No JavaScript framework** — vanilla JS for minimal bundle size

### Mobile & UX
- Fully responsive design
- Hamburger menu with smooth toggle
- Scroll-aware sticky navigation (changes background on scroll)
- Warm cream/gold color palette optimized for photography showcase

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Fonts | Google Fonts (Playfair Display + Inter) |
| Backend | Supabase (PostgreSQL + client SDK) |
| Forms | Formspree |
| Hosting | Netlify |
| Domain | Custom domain with SSL |
| Images | WebP format, client-side compression |

## Project Structure

```
desertlightweddings/
├── index.html              # Homepage
├── about.html              # About page
├── portfolio.html          # Photo portfolio
├── pricing.html            # Pricing page
├── packages.html           # Service packages
├── contact.html            # Contact form (Formspree)
├── venues.html             # Venue directory
├── vendors.html            # Vendor recommendations
├── bride-resources.html    # Planning resources
├── blog.html               # Blog index
├── blog-golden-hour.html   # Blog post
├── blog-bokeh-explained.html # Blog post
├── blog-engagement-outfits.html # Blog post
├── thankyou.html           # Form submission confirmation
├── 404.html                # Custom 404 page
├── style.css               # Global styles
├── favicon.svg             # Site icon
├── sitemap.xml             # XML sitemap
├── robots.txt              # Search engine directives
├── netlify.toml            # Netlify config (caching headers)
├── _redirects              # URL redirects (www → non-www)
├── CNAME                   # Custom domain
├── images/                 # Wedding photography (WebP + JPG)
└── weddings/               # Wedding website generator app
    ├── index.html          # Builder form
    ├── template.html       # Dynamic wedding site template
    ├── find.html           # Lookup by serial number
    ├── sample.html         # Demo wedding site
    └── weddings.js         # Client-side logic (upload, compress, Supabase)
```

## Setup & Development

1. Clone the repo:
   ```bash
   git clone https://github.com/webfor1website/desertlightweddings.git
   cd desertlightweddings
   ```

2. Serve locally (any static server):
   ```bash
   npx serve .
   ```
   Or open `index.html` directly in a browser.

3. For the wedding generator feature, you'll need Supabase credentials configured in the wedding pages.

## Deployment

Deployed on Netlify with:
- Custom domain (`desertlightweddings.com`)
- Automatic SSL
- `www` → non-www 301 redirects
- Image caching headers (1 year)

## AI-Assisted Development

This project was built with **Windsurf Cascade** (AI coding assistant). The AI assisted with:
- Page structure and semantic HTML
- SEO optimization (structured data, meta tags, sitemap)
- CSS design system (variables, responsive layout)
- Wedding website generator architecture (Supabase integration, photo compression, serial numbers)
- Performance optimizations (preloading, lazy loading, caching config)
- Content strategy (blog posts, venue/vendor directories)
