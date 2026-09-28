import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const config: NextConfig = {
  // Fully static site: deploys to Vercel or Cloudflare Pages (or any static host) unchanged.
  output: "export",
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [480, 828, 1200, 1920],
    imageSizes: [240, 360],
  },
  transpilePackages: ["@tve/content", "@tve/visa-logic", "@tve/ui-tokens"],
  typedRoutes: false,
};

export default withNextIntl(config);
