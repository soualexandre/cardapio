import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Evita inferência errada do root quando git root != project root (subdirectório /code)
  turbopack: {
    root: path.resolve(__dirname),
  },
  webpack: (config) => {
    config.resolve.modules = [
      path.resolve(__dirname, "node_modules"),
      "node_modules",
    ];
    return config;
  },
  allowedDevOrigins: ['192.168.0.5'],
};

export default nextConfig;
