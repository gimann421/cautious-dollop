import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow @react-pdf/renderer to be server-side rendered
  serverExternalPackages: ['@react-pdf/renderer'],

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'fonts.gstatic.com' },
    ],
  },

  // Ensure webhook raw body is available
  async headers() {
    return [
      {
        source: '/api/stripe/webhook',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
    ]
  },
}

export default nextConfig
