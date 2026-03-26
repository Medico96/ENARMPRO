/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  async redirects() {
    return [
      {
        source: '/cenetec',
        destination: '/material#fuentes',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
