import { service_list_api } from '@/api';
import { NextResponse } from 'next/server';

export async function GET() {

  const today = new Date().toISOString().split('T')[0];

  // Static URLs
  const staticUrls = [
    { path: '/', priority: '1.00' },
    { path: '/services', priority: '0.80' },
    { path: '/search', priority: '0.70' },
    { path: '/about', priority: '0.70' },
    { path: '/login', priority: '0.70' },
    { path: '/contact', priority: '0.60' },
    { path: '/faq', priority: '0.60' },
  ];

  // Fetch services dynamically from your API
  let dynamicUrls: { path: string; priority: string }[] = [];
  try {
  const res = await fetch(service_list_api, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ }),
  });

  if (!res.ok) {
    console.error('API returned non-OK status:', res.status);
  } else {
    const services = await res.json();
    dynamicUrls = services.workflows.map((service: { slug: string }) => ({
      path: `/services/view?id=${service.slug}`,
      priority: '0.80',
    }));
  }
} catch (error) {
  console.error('Failed to fetch service list:', error);
}

  // Combine static and dynamic URLs
  const allUrls = [...staticUrls, ...dynamicUrls];

  // Build XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      ({ path, priority }) => `
    <url>
      <loc>${process.env.CLIENT_BASE_URL}${path}</loc>
      <lastmod>${today}</lastmod>
      <priority>${priority}</priority>
    </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
