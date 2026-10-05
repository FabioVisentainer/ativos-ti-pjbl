import type { NextConfig } from "next";

// Dois modos de execução:
//
// 1) PROXY (desenvolvimento com o backend Kotlin): quando GATEWAY_URL está definido
//    (ex.: http://localhost:8080), o Next.js atua como proxy reverso e encaminha
//    /api/* ao API Gateway (Spring Cloud Gateway). Veja o script "dev:backend".
//
// 2) ESTÁTICO (padrão): sem GATEWAY_URL, o site é exportado como HTML/CSS/JS estático,
//    formato exigido pelo Azure Static Web Apps (build de "Static HTML" / "Custom").
const gatewayUrl = process.env.GATEWAY_URL;

const nextConfig: NextConfig = gatewayUrl
  ? {
      images: { unoptimized: true },
      async rewrites() {
        return [
          { source: "/api/:path*", destination: `${gatewayUrl}/api/:path*` },
        ];
      },
    }
  : {
      output: "export",
      trailingSlash: true,
      images: { unoptimized: true },
    };

export default nextConfig;
