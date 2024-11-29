/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { hostname: "*", protocol: "https" },
      { hostname: "*", protocol: "http" },
    ],
  },
};

export default nextConfig;
