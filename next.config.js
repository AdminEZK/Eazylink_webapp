/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qfpviwjjbxqliyskpuzb.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
