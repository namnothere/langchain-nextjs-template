// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })
// module.exports = withBundleAnalyzer({})
const path = require('path');

const pathFile = path.join(__dirname, './shared/');
console.log(pathFile);

module.exports = {
  experimental: {
    outputFileTracingRoot: path.join(__dirname, './'),
    outputFileTracingIncludes: {
      '/api/chat/sql_query': [`${pathFile}/**/*`],
    },
  },
}