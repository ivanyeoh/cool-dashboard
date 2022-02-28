/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:3030/api/v1/:path*", // Proxy to Backend
      },
    ];
  },
};

module.exports = nextConfig;
