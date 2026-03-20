# CareBridge China

React + Tailwind website for a hospital accompaniment service for foreigners in China, deployed on Cloudflare Pages with lightweight dynamic endpoints handled by Pages Functions and D1.

## Stack

- `React`
- `Tailwind CSS`
- `Vite`
- `Cloudflare Pages Functions`
- `Cloudflare D1`

## MVP pages

- Landing page
- Service overview
- How it works
- Pricing
- FAQ
- Accompany request form

## Dynamic endpoints

- `POST /api/submit-request`
- `POST /api/contact`
- `GET /api/service-availability`

## Local development

```bash
npm install
npm run dev
```

## Cloudflare local development

```bash
npm run build
npm run cf:dev
```

## Skill installer utility

If you have skill files arranged like `CATEGORY/SKILL-NAME.md`, you can install them into Codex's
expected skill layout with:

```bash
python3 scripts/install_skills.py /path/to/skill-markdown-root
```

Useful options:

```bash
python3 scripts/install_skills.py /path/to/skill-markdown-root --dry-run
python3 scripts/install_skills.py /path/to/skill-markdown-root --force
python3 scripts/install_skills.py /path/to/skill-markdown-root --flatten
```

## D1 setup

```bash
npx wrangler d1 create carebridge-db
npx wrangler d1 execute carebridge-db --remote --file=./schema.sql
```

## Cloudflare notes

- Deploy the frontend with `Cloudflare Pages`
- Pages Functions are read from the `functions/` directory
- Replace the D1 database id in `wrangler.toml`
- Optionally set `OPS_WEBHOOK_URL` to forward intake events to WeCom, Slack, or another ops workflow
- Set `ADMIN_API_KEY` in Cloudflare Pages environment variables to protect `GET /api/leads` and `/ops/leads`
