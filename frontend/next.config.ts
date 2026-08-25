import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exporta o site como HTML/CSS/JS estático, formato exigido pelo
  // Azure Static Web Apps (build de "Static HTML" / "Custom").
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
