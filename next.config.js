/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  // Configuration to resolve cross-origin request warning
  // See: https://nextjs.org/docs/app/api-reference/next-config-js/allowedDevOrigins
  allowedDevOrigins: ["*"],

  // Allow images from Google's domain for profile pictures
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default config;
