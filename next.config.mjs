/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // This will skip ESLint during the build process
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during production build
  },
};

export default nextConfig;
