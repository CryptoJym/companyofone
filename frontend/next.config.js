const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [require('remark-gfm')],
    rehypePlugins: [
      require('rehype-slug'),
      require('rehype-highlight'),
      [require('rehype-autolink-headings'), { behavior: 'wrap' }]
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  images: {
    domains: ['localhost', 'via.placeholder.com'],
  },
};

module.exports = withMDX(nextConfig);