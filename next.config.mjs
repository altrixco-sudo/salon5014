/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  // Demo runs fully self-contained: images are served as static assets,
  // chat/lead-capture are local, and no external media domains are needed.
  images: { unoptimized: true }
};

export default nextConfig;
