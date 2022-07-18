/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
          source: '/',
          headers: [
              {
                "key": "Content-Security-Policy",
                "value": "default-src 'self' https: ; script-src 'self' ; object-src 'none'"
              }
          ]
      }
    ]
  }
}

module.exports = nextConfig


// async headers() {
//   return [
//     {
//       source: '/:path*',
//       headers: [{
//         key: 'Content-Security-Policy',
//         value: 'upgrade-insecure-requests'
//       }],
//     },
//   ]
// },


