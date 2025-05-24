/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    serverActions: {
      serverComponentsExternalPackages: ["mongoose"],
    }
    },
  
    images: {
      domains: ['ng.jumia.is'], // Add the domain
      dangerouslyAllowSVG: true,
      contentDispositionType: 'attachment',
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
      // Increase timeout and add retry logic
      minimumCacheTTL: 60,
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    };
   


module.exports = nextConfig

