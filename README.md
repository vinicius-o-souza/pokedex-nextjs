# Pokédex Next.js

A Pokédex portfolio project built with Next.js 14 App Router, TypeScript, Tailwind CSS, and a Drupal CMS backend.

## Project Overview

This project displays a full Pokédex sourced from a Drupal headless CMS via its REST API and OAuth 2.0 authentication. It supports browsing, filtering, and viewing detailed Pokémon pages including stats, abilities, and evolution chains.

---

## Built with

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) — App Router, Server & Client Components |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/) |
| Authentication | [NextAuth.js v4](https://next-auth.js.org/) — OAuth 2.0 client credentials flow |
| CMS / Backend | [Drupal](https://www.drupal.org/) — headless, exposing REST API + JSON:API |
| Data fetching | Native `fetch` with a typed wrapper (`drupalFetch`) + `useEffect`-based client pagination |
| Images | `next/image` with built-in optimisation |
| Font | Montserrat via `next/font/google` |
| Analytics | [Vercel Analytics](https://vercel.com/analytics) + [Speed Insights](https://vercel.com/docs/speed-insights) |

---

## What this project demonstrates

- **Server Components for auth-gated data fetching** — pages fetch data and verify the session on the server before rendering; unauthenticated requests are redirected without a client-side round-trip.
- **Hybrid rendering strategy** — the Pokédex list is server-rendered on first load for instant content, then transitions to client-side fetch for pagination and filtering without a full page reload.
- **Drupal as a headless CMS** — consumes both the Drupal REST API (list endpoints) and JSON:API (detail endpoints with `?include=` relationships), demonstrating how to integrate a decoupled CMS with a modern frontend.
- **OAuth 2.0 machine-to-machine flow** — the Next.js backend exchanges client credentials with Drupal's Simple OAuth server and forwards the bearer token on every API call, keeping secrets out of the browser.
- **Type-safe API layer** — a single `drupalFetch<T>` wrapper handles auth headers, content-type negotiation, and structured error handling (`DrupalApiError`) so every caller gets a fully typed response.
- **Composable filter UX** — type, generation, legendary, and mythical filters combine with a search bar and server-side pagination, reset to page 1 on any change, and surface errors inline.
- **Responsive layout with a mobile drawer** — desktop shows a persistent filter sidebar; mobile replaces it with a slide-in overlay, sharing the same `FilterPanel` component.
- **Pokémon detail page with adjacent navigation** — fetches previous/next UUIDs in parallel (`Promise.all`) and renders a type-coloured header, stat bars, ability list, and a full evolution chain.

---

## Drupal Setup

### Required Modules

Install and enable the following contributed modules:

| Module | Purpose |
|---|---|
| [Simple OAuth](https://www.drupal.org/project/simple_oauth) | OAuth 2.0 server (client credentials grant) |
| [REST UI](https://www.drupal.org/project/restui) | GUI to enable and configure REST resources |
| [Serialization](https://www.drupal.org/project/serialization) | JSON serialization (usually already installed) |

### Content Type: `pokemon`

Create a content type machine-named `pokemon` with the following fields:

| Field label | Machine name | Field type | Notes |
|---|---|---|---|
| Name | `title` | Text (plain) | Core field |
| Image | `field_image` | Image | Store the official artwork URL or file |
| Types | `field_types` | Entity reference (taxonomy) | Vocabulary: `pokemon_type`; allow multiple |
| Stats | `field_stats` | Paragraphs / JSON | Store stat name + base value pairs |
| Abilities | `field_abilities` | Paragraphs / JSON | Store ability name + is_hidden flag |
| Order | `field_order` | Number (integer) | Pokédex number |
| Weight | `field_weight` | Number (decimal) | In hectograms |
| Height | `field_height` | Number (decimal) | In decimetres |
| Evolution Chain | `field_evolution_chain` | Entity reference (node) | Self-referential; ordered |
| Base Experience | `field_base_experience` | Number (integer) | |
| Is Legendary | `field_is_legendary` | Boolean | |
| Is Mythical | `field_is_mythical` | Boolean | |
| Generation | `field_generation` | Text (plain) / List | e.g., `generation-i` |
| Description | `field_description` | Text (long) | Pokédex flavor text |

### REST API Configuration

1. Enable the `Content` REST resource via REST UI (`/admin/config/services/rest`).
2. Enable GET method with JSON format and `cookie` or `oauth2` authentication.
3. Configure a Simple OAuth client (client credentials) and note the Client ID and Secret.

---

## Environment Setup

Copy the example env file and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `DRUPAL_BASE_URL` | Base URL of your Drupal site (no trailing slash) |
| `DRUPAL_CLIENT_ID` | OAuth 2.0 client ID from Simple OAuth |
| `DRUPAL_CLIENT_SECRET` | OAuth 2.0 client secret from Simple OAuth |
| `NEXTAUTH_SECRET` | Random secret for NextAuth session encryption (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Public URL of this Next.js app |

---

## Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later (install via [nvm](https://github.com/nvm-sh/nvm) is recommended)
- A running Drupal instance configured as described above

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/pokedex-nextjs.git
cd pokedex-nextjs

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and fill in your Drupal and NextAuth values
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```
