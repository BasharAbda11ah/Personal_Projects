/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * SITE_URL = the public address of the live site, e.g. https://www.example.ae (no trailing slash).
 * Set it in the hosting dashboard or in a local `.env.production` file before `npm run build`.
 * When set, the build adds canonical/og:url tags, absolute share-image URLs and sitemap.xml.
 * When not set, the build still works; it just leaves those out.
 */
function readSiteUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`SITE_URL is not a valid URL: "${raw}"`);
  }
  if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
    throw new Error(`SITE_URL should start with https:// (got "${raw}")`);
  }
  return url.origin + url.pathname.replace(/\/+$/, '');
}

/**
 * Demo mode (`npm run build:demo`): for a private preview link shown to the restaurant before launch.
 * Adds a "Preview" banner and asks search engines not to index the site. Normal builds are unaffected.
 */
function seo(siteUrl: string | null, demo: boolean): Plugin {
  const ogImage = '/images/brand/og-image.jpg';
  return {
    name: 'mtc-seo',
    transformIndexHtml(html) {
      const abs = siteUrl
        ? [
            `<link rel="canonical" href="${siteUrl}/" />`,
            `<meta property="og:url" content="${siteUrl}/" />`,
            `<link rel="alternate" hreflang="en" href="${siteUrl}/?lang=en" />`,
            `<link rel="alternate" hreflang="ar" href="${siteUrl}/?lang=ar" />`,
          ].join('\n    ')
        : '';
      const noindex = demo ? '<meta name="robots" content="noindex, nofollow" />' : '';
      return html
        .replace('%OG_IMAGE%', siteUrl ? `${siteUrl}${ogImage}` : ogImage)
        .replace('<!--%SEO_ABSOLUTE%-->', [noindex, abs].filter(Boolean).join('\n    '));
    },
    generateBundle() {
      // Demo builds keep robots.txt open on purpose: crawlers must be able to read the noindex tag.
      const robots = ['User-agent: *', 'Allow: /', ...(siteUrl && !demo ? ['', `Sitemap: ${siteUrl}/sitemap.xml`] : [])].join('\n');
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots}\n` });
      if (siteUrl && !demo) {
        // The site is a single page (sections and summary use #hash URLs), so the sitemap lists the home page.
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc></url>\n</urlset>\n`;
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = readSiteUrl(env.SITE_URL || process.env.SITE_URL);
  return {
    plugins: [react(), tailwindcss(), seo(siteUrl, mode === 'demo')],
    server: { port: 5173 },
    preview: { port: 4173 },
    build: { assetsInlineLimit: 0 },
    test: { environment: 'node' },
  };
});
