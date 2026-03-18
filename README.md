# MediGuide China

React + Tailwind MVP website for a hospital accompany service for foreigners in China, designed for static hosting on Cloudflare with lightweight dynamic endpoints handled by Cloudflare Pages Functions.

## Stack

- `React`
- `Tailwind CSS`
- `Vite`
- `Cloudflare Pages Functions`

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

## Local development

```bash
npm install
npm run dev
```

## Cloudflare notes

- Deploy the frontend with `Cloudflare Pages`
- Add Pages Functions from the `functions/` directory
- Replace KV namespace ids in `wrangler.toml`
- Optionally set `OPS_WEBHOOK_URL` to forward intake events to WeCom, Slack, or another ops workflow
