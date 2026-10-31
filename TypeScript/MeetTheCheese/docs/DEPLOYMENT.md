# Deployment Guide

**Status:** the site has **not** been published. It currently runs only on this computer (`http://localhost:5173` for development,
`http://localhost:4173` for the production preview). There is no public URL yet.

The site is a static build (`npm run build` → `dist/`). It needs no server code, database or secret keys.
Pages use `#/` addresses, so refreshes and direct links work on any static host.

---

## Private preview link for the owner (before launch)
Use a **demo build** for links shared before the restaurant has agreed to launch. It shows a "Preview prepared for
Meet The Cheese, not the official website yet" banner and tells search engines not to index it.
1. `npm run build:demo` (do not set `SITE_URL`; the netlify.app address is not the real domain).
2. Netlify: **Add new project → Deploy manually**, then drag the **`dist`** folder (not the whole project folder).
3. **Project configuration → Change project name** to something neutral (e.g. `mtc-preview-2026`), not an official-looking name.
4. To update it later: run `npm run build:demo` again and drag `dist` onto the project's **Deploys** page.
5. WhatsApp buttons on the preview go to the real branch numbers, so warn the owner before he test-sends an order.

For the real launch use `npm run build` (no banner, indexable) with `SITE_URL` set.

## Option A: Netlify (recommended; simplest)
`netlify.toml` is already configured (build command, `dist` folder, Node version, SPA fallback).

1. Put the project in a Git repository (GitHub, GitLab or Bitbucket) owned by, or shared with, the restaurant.
2. In Netlify: **Add new site → Import an existing project →** choose the repository. The settings are read from `netlify.toml`.
3. **Site configuration → Environment variables:** add `SITE_URL` = the final address, e.g. `https://www.meetthecheese.ae` (no trailing slash).
4. Deploy. Netlify gives a temporary `https://<name>.netlify.app` address to check the site.
5. **Domain management → Add a domain** and follow the DNS instructions (see "Connecting a domain" below). HTTPS is issued automatically.

No Git? Run `npm run build` locally and drag the `dist` folder onto **app.netlify.com/drop**. Set `SITE_URL` in a local
`.env.production` file first, so the build includes the correct address.

## Option B: Vercel
`vercel.json` is included (fallback and long-term caching for assets).
1. **Add New → Project →** import the repository. Framework preset: **Vite**. Build command `npm run build`, output `dist`.
2. **Settings → Environment Variables:** `SITE_URL` = final address.
3. Deploy, then **Settings → Domains → Add**.

## Option C: Cloudflare Pages
1. **Workers & Pages → Create → Pages →** connect the repository.
2. Build command `npm run build`, output directory `dist`. Add the environment variable `SITE_URL`, and set `NODE_VERSION` = `22`.
3. Deploy, then **Custom domains → Set up a domain**.
(Cloudflare Pages serves `index.html` for unknown paths automatically. `public/_headers` adds caching and security headers.)

---

## Connecting a domain
1. Register the domain in the **restaurant's name** (for `.ae` domains, use an accredited .ae registrar; a UAE trade licence is normally required).
2. In the host's dashboard, add the domain (`www.example.ae` and/or `example.ae`).
3. At the registrar, create the DNS records the host shows. This is usually a `CNAME` for `www` pointing to the host, plus an `A`/`ALIAS` record or redirect for the bare domain.
4. Wait for DNS to update (minutes to a few hours). HTTPS certificates are issued automatically by Netlify, Vercel and Cloudflare.
5. Set `SITE_URL` to the final `https://` address and redeploy, so the sitemap, canonical URL and share image use the real domain.

## After the site is live
- [ ] Open `https://YOUR-DOMAIN/?branch=ajman`, `?branch=al-zubair` and `?branch=kalba` on a phone and check that the right branch opens.
- [ ] Place a **test order with the restaurant's agreement**: the restaurant sends a message from its own phone to its own branch number, or the owner tests it. Do not send test orders to staff without warning.
- [ ] Generate the three QR codes from the final links (see README, "Branch links and QR codes"). Test-scan them before printing.
- [ ] Share the link on WhatsApp to check the preview image and title appear.
- [ ] Optional: submit `https://YOUR-DOMAIN/sitemap.xml` in Google Search Console (owned by the restaurant's Google account).
- [ ] Optional: add the website link to the Google Business Profile of each branch.

---

## Order of work once deployment is authorised
Nothing below has been done. Do not publish the restaurant's branding before the owner agrees.
1. Agree on the domain and the hosting arrangement (who owns and pays for them).
2. Set the real `SITE_URL` in the host's environment variables. Keep it **unset** until the domain is chosen.
3. Build and deploy.
4. Test the live website on a phone and a computer, in English and Arabic.
5. Check the real branch links (`?branch=ajman`, `?branch=al-zubair`, `?branch=kalba`) and the WhatsApp links. Only send a test
   order with the restaurant's agreement.
6. Generate QR codes from the real public URLs (never from `localhost`).
7. Get the restaurant's approval before printing or distributing the QR codes.

The code is in a local Git repository with no remote. Hosting services that build from Git need it pushed to a **private**
repository first; create that only when you're ready (and decide whose account it belongs to).

## Needs approval before launch
These are decisions for the restaurant owner (and you). None has been done:
1. **Publishing the restaurant's name, logo, photos and menu publicly**: written OK from the owner.
2. **Menu confirmations**: the items in `docs/MENU_CONFIRMATION.md` (41 meal-price interpretations, 6 unclear two-price items,
   4 unconfirmed sauce prices, printed spellings, and whether all branches share the same menu and prices).
3. **WhatsApp numbers that receive orders**: Ajman +971 50 116 4065, Al Zubair +971 56 647 0835, Kalba +971 52 835 3959. (+971 56 510 8828 was removed because it is not on WhatsApp.)
4. **Domain name**: choice, purchase, and who pays and owns it.
5. **Hosting account**: which provider, created in whose name, and any cost (free plans are normally enough).
6. **Branch details not yet supplied**: map links and Kalba's street address or landmark. They stay hidden until confirmed. Opening hours were taken from each branch's Google listing; ask the owner to confirm them.
7. **Whether to add the Ras Al Khaimah branch** mentioned on the printed menu.
8. **Price and terms**: agreed separately with the restaurant. Nothing has been agreed yet.
9. **Any analytics** (e.g. visitor statistics): none is installed. Adding one would need the owner's agreement and an updated privacy notice.

## Environment variables
| Name | Required | Purpose |
| --- | --- | --- |
| `SITE_URL` | Recommended | Public `https://` address, no trailing slash. Adds canonical URL, absolute share image and `sitemap.xml`. |

There are no secrets in this project. Do not add API keys or passwords to the source code.
