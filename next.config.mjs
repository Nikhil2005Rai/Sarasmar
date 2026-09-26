/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg", "bcryptjs"],
    optimizePackageImports: ["framer-motion", "@react-three/drei"],
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
  },
};
export default nextConfig;
