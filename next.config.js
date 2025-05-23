/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    serverActions: {
      serverComponentsExternalPackages: ["mongoose"],
    }
    },
  
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ng.jumia.is',
        pathname: '**',
      },
    ],
      }
    };
   


module.exports = nextConfig

