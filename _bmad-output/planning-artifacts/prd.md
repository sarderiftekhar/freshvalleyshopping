---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation']
inputDocuments: ['template/themeforest-BVCzujta-orfarm-grocery-food-store-ecommerce-next-js-template/orfarm-next-js']
workflowType: 'prd'
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 0
  projectDocs: 1
classification:
  projectType: web_app
  domain: ecommerce_food_grocery
  complexity: medium
  projectContext: brownfield
  market: UK - London, Dartford, Orpington, Sidcup
  audience: Asian communities - halal certified fresh products
  techStack:
    frontend: React (Inertia.js) + Tailwind CSS + shadcn/ui
    backend: Laravel
    payments: Stripe
  productRange: ~150 products (meat, fish, grocery, fresh produce)
  supplyModel: vertically integrated (own warehouse + butcher shop)
  competition: no direct competitor in niche/area
---

# Product Requirements Document - freshvalleyshopping

**Author:** Sarde
**Date:** 2026-03-14

## Executive Summary

Fresh Valley Shopping is an online halal grocery and fresh produce delivery service targeting underserved Asian communities in the Dartford, Orpington, and Sidcup areas of South East London, UK. With over 500 halal-consuming families in the region and virtually no remaining local halal shops, Fresh Valley fills a critical supply gap by delivering certified halal meat, fish, and a full range of Asian grocery items directly to customers' doors. The business operates from its own warehouse and butcher shop, providing end-to-end control over product quality, halal certification integrity, and freshness. Deliveries run twice weekly on full-day slots, with orders placed through a custom-built eCommerce platform (Laravel + React/Inertia.js + Tailwind/shadcn) and paid via Stripe.

### What Makes This Special

- **Supply desert solution** — Previous halal shops in the area have closed, leaving 500+ families with no local option. Fresh Valley isn't competing with alternatives — it's the only option purpose-built for this community.
- **Vertically integrated trust chain** — Own warehouse and butcher shop means full control from sourcing to doorstep. Halal certification isn't a label on a supermarket shelf — it's verified at every stage by people the community knows.
- **Cultural product fit** — Stocking the specialty Asian foods (spices, lentils, specific vegetables, cooking essentials) that mainstream supermarkets like Tesco and Sainsbury's simply don't carry.
- **Community-rooted business** — Growth driven by word of mouth, WhatsApp groups, local mosque boards, Facebook communities, leafletting, and local festival presence. Trust is earned through community relationships, not marketing spend.
- **Eliminates the long drive** — Families currently travel significant distances to reach a trusted halal butcher. Fresh Valley removes that burden entirely.

## Project Classification

- **Project Type:** Full-stack web application (eCommerce)
- **Domain:** E-commerce / Halal food & grocery (specialty niche)
- **Complexity:** Medium — halal certification trust requirements, fresh product logistics, delivery scheduling within defined geographic zones, and a full custom backend build
- **Project Context:** Brownfield — building on Orfarm Next.js template as frontend reference, with a new full-stack implementation using Laravel, React (Inertia.js), Tailwind CSS, and shadcn/ui
- **Tech Stack:** Laravel backend, React/Inertia.js frontend, Tailwind CSS + shadcn/ui, Stripe payments
- **Product Range:** ~150 SKUs across halal meat, fish, Asian groceries, and fresh produce

## Success Criteria

### User Success

- Customers can browse ~150 products by category (meat, fish, grocery, fresh produce), find what they need, and complete an order in under 5 minutes
- Mobile-first experience — most users will order from their phones
- Clear halal certification visibility on products builds immediate trust
- Customers can select a delivery slot (twice-weekly delivery days) at checkout
- Returning customers can quickly reorder previous items

### Business Success

- Admin can manage products (add, edit, remove, stock levels) without developer intervention
- Admin can manage delivery slots, view orders, and track order status
- Platform supports the ~150 SKU product range at launch
- Order and payment flow is reliable — zero failed payments that aren't reported

### Technical Success

- Site loads under 3 seconds on mobile (3G/4G connections)
- Stripe checkout completes reliably with proper error handling
- Admin dashboard is functional and intuitive
- Responsive across mobile, tablet, and desktop
- SEO-friendly for local search ("halal delivery Dartford", "halal meat Sidcup")

### Measurable Outcomes

- Site is live and accepting orders
- Full product catalogue uploaded and browsable
- Checkout-to-payment flow works end-to-end
- Admin can independently manage day-to-day operations

## Product Scope

### MVP - Minimum Viable Product

- Product catalogue with categories, search, and filtering
- Product detail pages with images, price, weight/unit, halal certification badge
- Shopping cart with add/remove/quantity management
- Checkout with delivery slot selection and Stripe payment
- Customer registration and login
- Order confirmation (email + on-screen)
- Admin panel: product CRUD, order management, delivery slot management
- Mobile-responsive design
- Basic SEO setup

### Growth Features (Post-MVP)

- Reorder previous orders / favourites
- WhatsApp order notifications
- Customer reviews and ratings
- Promotional codes and discounts
- Delivery tracking / status updates
- Product recommendations ("frequently bought together")

### Vision (Future)

- Subscription boxes (weekly halal meat/grocery bundle)
- Multi-area expansion beyond initial delivery zone
- Mobile app (React Native)
- Loyalty/rewards programme
- Multi-language support (Urdu, Bengali, Arabic)

## User Journeys

### Journey 1: Fatima — First-Time Customer (Happy Path)

**Situation:** Fatima lives in Sidcup with her family of five. The local halal butcher closed last year. She currently drives 40 minutes each way to Woolwich every Saturday morning to buy meat and Asian groceries for the week. Her neighbour shares a Fresh Valley leaflet from the local mosque.

**Opening Scene:** Fatima visits freshvalleyshopping.co.uk on her phone. She sees the halal certification prominently displayed. She browses the meat category — lamb leg, chicken thighs, minced beef — all with clear weights, prices, and halal certification badges. She recognises the cuts she normally buys.

**Rising Action:** She registers with her email, adds items to her cart — 2kg lamb shoulder, 1kg chicken breast, basmati rice, red lentils, fresh coriander, green chillies, and a bag of chapatti flour. She sees a delivery slot for Wednesday and selects it. The cart shows her total with delivery charge clearly displayed.

**Climax:** She enters her Sidcup postcode, confirms her address is in the delivery zone, and pays via Stripe. Order confirmation appears on screen and hits her email within seconds.

**Resolution:** Wednesday arrives, the delivery shows up. Fresh, properly packaged, halal-certified. Fatima saves 80 minutes of driving and £15 in petrol. She shares the link in her family WhatsApp group.

**Requirements revealed:** Product browsing, categories, search, cart, postcode/delivery zone validation, delivery slot selection, Stripe checkout, email confirmation, mobile-responsive UI, halal certification display.

### Journey 2: Fatima — Returning Customer (Repeat Order)

**Opening Scene:** Two weeks later, Fatima logs in on her phone. She wants to order again but doesn't want to browse the whole catalogue.

**Rising Action:** She sees her previous order in her account. She also notices some items are out of stock this week (seasonal availability). She swaps those for alternatives, adds a couple of new items she spots on the homepage.

**Climax:** Checkout is fast — her address is saved, she picks the next available delivery slot, pays in under 2 minutes.

**Resolution:** Fatima is now a regular. She orders every delivery cycle.

**Requirements revealed:** Order history, reorder functionality, saved addresses, stock availability indicators, user account/profile, quick checkout flow.

### Journey 3: Admin — Managing the Shop

**Situation:** The shop owner (or staff) needs to manage the day-to-day operations — adding new products, updating stock, handling incoming orders, and setting up delivery schedules.

**Opening Scene:** Admin logs into the dashboard on Monday morning. They see a summary: 23 orders for Wednesday's delivery, 4 new orders since last night, 3 items running low on stock.

**Rising Action:** They add a new product — fresh sea bass — with photos, price per kg, description, and halal certification details. They mark lamb shanks as "out of stock" since the butcher is waiting on a delivery. They review the 23 orders for Wednesday, checking quantities to prep the warehouse picking list.

**Climax:** They update the delivery schedule — next week has a bank holiday, so they shift Thursday's delivery slot to Friday. All customers with existing orders for that day get notified.

**Resolution:** Orders are packed, dispatched, and marked as delivered. The admin sees revenue and order count for the week.

**Requirements revealed:** Admin dashboard with order summary, product CRUD (create, read, update, delete), stock management, image upload, delivery slot management, order list with status tracking, basic reporting/metrics.

### Journey 4: Guest — Browsing Before Committing

**Situation:** Ahmed in Dartford hears about Fresh Valley from a Facebook post. He's sceptical — he wants to see the product range and prices before creating an account.

**Opening Scene:** Ahmed lands on the homepage. He sees the product range, categories, and prices without needing to register.

**Rising Action:** He browses meat, checks prices against what he pays at the butcher in Lewisham. He adds a few items to his cart to see the total. At checkout, he's prompted to register or continue as guest.

**Climax:** He decides to register and complete his first order.

**Resolution:** The barrier to entry was low enough — he could browse and compare before committing.

**Requirements revealed:** Public product catalogue (no login required), guest cart, registration prompt at checkout, guest checkout option, SEO-friendly public pages.

### Journey Requirements Summary

| Capability | Journeys |
|---|---|
| Product catalogue (browse, search, filter) | 1, 2, 4 |
| Product detail pages with halal badge | 1, 4 |
| Shopping cart | 1, 2, 4 |
| User registration & login | 1, 4 |
| Delivery zone validation (postcode check) | 1 |
| Delivery slot selection | 1, 2, 3 |
| Stripe payment checkout | 1, 2 |
| Order confirmation (email + screen) | 1, 2 |
| Order history & reorder | 2 |
| Saved addresses | 2 |
| Stock availability display | 2, 3 |
| Admin dashboard | 3 |
| Product CRUD + image upload | 3 |
| Order management & status tracking | 3 |
| Delivery schedule management | 3 |
| Guest browsing (no auth required) | 4 |
| Mobile-responsive design | 1, 2, 4 |
| Basic reporting/metrics | 3 |

## Domain-Specific Requirements

### Compliance & Regulatory

- **Food Standards Agency (FSA)** — Online food businesses in the UK must be registered with the local authority. The website must display required allergen information for applicable products.
- **Halal certification display** — Products must clearly show halal certification body/source. This is a trust requirement, not a legal one, but it's the core value proposition.
- **Distance Selling Regulations** — UK Consumer Contracts Regulations apply: customers must have clear cancellation/refund rights, pricing must include VAT, delivery charges shown before checkout.
- **GDPR** — Customer data (names, addresses, emails, order history) must be handled in compliance with UK GDPR. Privacy policy required. Stripe handles PCI-DSS compliance for card data.

### Technical Constraints

- **Stripe PCI compliance** — Use Stripe Checkout or Stripe Elements (never handle raw card data server-side). Stripe manages PCI-DSS scope.
- **Delivery zone validation** — Postcode-based validation to ensure orders are within the Dartford/Orpington/Sidcup delivery area. Reject or flag out-of-zone orders at checkout.
- **Stock accuracy** — Real-time stock levels matter for fresh/perishable goods. Overselling meat or fish that isn't available erodes trust fast.
- **Image quality** — Fresh food products need clear, appetising product photos. Support for multiple images per product.

### Integration Requirements

- **Stripe** — Payment processing, webhook handling for order confirmation, refund capability
- **Email service** — Transactional emails (order confirmation, delivery notifications). Laravel's built-in mail with a provider like Mailgun or Resend.
- **No third-party delivery integration needed** — Own delivery team, so no API integration with courier services at MVP

### Risk Mitigations

- **Overselling perishables** — Stock decrement on order placement, not on delivery. Admin alerts when stock is low.
- **Payment failures** — Stripe webhook confirmation before marking order as paid. Handle edge cases (card declined, session expired).
- **Delivery zone creep** — Hard postcode validation prevents orders from outside the service area. Expandable later.
- **Trust erosion** — If a delivery arrives with wrong items or quality issues, trust is hard to rebuild in a small community. Order accuracy and quality control are critical operational concerns (outside software scope, but the admin tools should support picking lists and order verification).
