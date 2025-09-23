import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/i,
            use: ["@svgr/webpack"],
        });

        return config;
    },

    devIndicators: false,

    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js'
            }
        },
    },

    transpilePackages: ['three'],
};

module.exports = nextConfig;

export default nextConfig;
