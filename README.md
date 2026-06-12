# Maison Sadique | Haute Horlogerie & Luxury Timepieces

A premium, visually stunning multi-page e-commerce website for **Maison Sadique** (luxury watch boutique).

## Visual Design & Brand Story
* **Obsidian & Gold Theme:** Features a premium dark theme using obsidian black, carbon grey, and champagne gold accents.
* **Branded Philosophy:** Editorial narrative woven into the brand history inspired by the Arabic translation of the name **Sadiq (صادق)**—representing "truthful watch movements and honest luxury materials".
* **Premium Typography:** Headings stylized in elegant serif *Bodoni Moda* and body copy in clean, highly legible *Inter*.

## Key Features
* **Custom Watch Imagery:** High-resolution product photos generated for the boutique (Heritage Gold, Chronograph Black, Minimalist Obsidian, Ocean Master Sport).
* **Faceted Search Filters:** Live catalog filters based on category series, metal casing material, and pricing ranges, with price sorting.
* **Shopping Cart State:** LocalStorage-powered shopping cart persisting item counts and subtotals across all page loads.
* **Bespoke WhatsApp Checkout:** Collects delivery details and dynamically compiles a prefilled WhatsApp template text to route checkout directly to the concierge chat.
* **Cross-Document View Transitions:** Smooth CSS morphing transitions on product card click when navigating from shop lists to detail views.
* **Mobile-First Design:** Fully responsive hamburger navigation overlay and collapsible sidebar filters tailored for narrow mobile screens.

## Project Structure
* `index.html` - Homepage with hero banner and curated watch collections.
* `shop.html` - Dynamic watch catalog with faceted side-panel filters.
* `product.html` - Detail view with tech specs sheets and WhatsApp inquiries.
* `cart.html` - Cart checkout page with customer information form.
* `about.html` - Atelier narrative story page.
* `styles.css` - Central design system styling sheet.
* `app.js` - Dynamic UI page renderer and cart state manager.
* `assets/` - Image directories containing watch photography.

## Local Preview
Simply open `index.html` directly in any browser, or run a local web server:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.
