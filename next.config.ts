import type { NextConfig } from "next";

// Old WordPress URLs that don't exist on the new site. Every page keeps its original path,
// so only the odd aliases need a redirect.
const legacy = [
  { source: "/contact", destination: "/contact-us" },
  { source: "/home", destination: "/" },
  { source: "/category/uncategorized", destination: "/blog" },
  { source: "/blog/:slug", destination: "/:slug" },
];

const nextConfig: NextConfig = {
  async headers() {
    const headers = [
      { key: "Cache-Control", value: "private, no-store, max-age=0" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "same-origin" },
    ];
    return [{ source: "/admin/:path*", headers }, { source: "/api/:path*", headers }, { source: "/admin/sw.js", headers: [{key:"Service-Worker-Allowed",value:"/admin"},{key:"Cache-Control",value:"no-cache"}] }];
  },
  async redirects() {
    return legacy.flatMap((r) => [
      { ...r, permanent: true },
      { source: `${r.source}/`, destination: r.destination, permanent: true },
    ]);
  },
};

export default nextConfig;
