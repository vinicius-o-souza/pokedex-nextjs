# Pokédex Next.js

A Pokédex portfolio project built with Next.js 14 App Router, TypeScript, Tailwind CSS, and a Drupal CMS backend.

## Project Overview

This project displays a full Pokédex sourced from a Drupal headless CMS via its REST API and OAuth 2.0 authentication. It supports browsing, filtering, and viewing detailed Pokémon pages including stats, abilities, and evolution chains.

**Stack:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query (React Query v5)
- NextAuth.js v4 (OAuth 2.0 client credentials flow against Drupal)

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
