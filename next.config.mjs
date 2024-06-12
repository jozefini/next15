/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
    after: true,
    ppr: "incremental",
  },
};

export default nextConfig;
