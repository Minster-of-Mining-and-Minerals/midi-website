import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ["localhost", "127.0.0.1", "midi.gov.et", "www.midi.gov.et", "jarra.et", "www.jarra.et", "backend"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "midi.gov.et",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.midi.gov.et",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "jarra.et",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.jarra.et",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "backend",
        port: "4000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "4000",
        pathname: "/**",
      },
    ],
  },
  /* config options here */
};

export default withNextIntl(nextConfig);
