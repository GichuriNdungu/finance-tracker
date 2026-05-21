# Finance Tracker — Vite React

This project is a Vite + React web app. Use the commands below to run locally and deploy to Vercel.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Vercel (quick, CLI)

1. Install Vercel CLI (one-time):

```bash
npm install -g vercel
```

2. Log in:

```bash
vercel login
```

3. From the project root, deploy (follow prompts):

```bash
vercel
# or for a production deploy
vercel --prod
```

Vercel will run `npm run build` and serve the `dist/` directory. If you prefer Git-based deploys, push this repository to GitHub and connect it in the Vercel dashboard.

## Notes
- The app output directory is `dist/` (configured in `vercel.json`).
- To get an installable web app experience on mobile, we can add a PWA manifest and service worker next.
