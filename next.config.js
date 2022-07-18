/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         {
  //           "key": "Content-Security-Policy",
  //           "value": "upgrade-insecure-requests"
  //         }
  //       ]
  //     }
  //   ]
  // }
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


