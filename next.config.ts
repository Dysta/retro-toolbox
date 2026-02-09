import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    runMode: process.env.RUN_MODE || "prod",
    appName: "Retro Toolbox",
    appAuthor: "Dysta",
    appAuthorGithub: "https://github.com/Dysta",
    appRepository: "https://github.com/Dysta/retro-toolbox",
  },
};

export default nextConfig;
