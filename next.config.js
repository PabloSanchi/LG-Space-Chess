/** @type {import('next').NextConfig} */


const nextConfig = {
  reactStrictMode: true,  
  setupFiles: process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
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