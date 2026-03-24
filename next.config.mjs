/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'golfangers.fr',
      },
      {
        protocol: 'https',
        hostname: 'anjou-vignoble-villages.com',
      },
      {
        protocol: 'https',
        hostname: 'www.loireavelo.fr',
      },
    ],
  },
};

export default nextConfig;
