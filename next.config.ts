import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    webpack(config) {
        config.module.rules.push(
            {
                test: /\.svg$/i,
                use: ["@svgr/webpack"],
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                use: "glslify-loader",
            },
        );

        return config;
    },

    devIndicators: false,

    turbopack: {
        rules: {
            "*.svg": {
                loaders: ["@svgr/webpack"],
                as: "*.js",
            },
            "*.vert": {
                loaders: ["raw-loader", "glslify-loader"],
                as: "*.js",
            },
            "*.frag": {
                loaders: ["raw-loader", "glslify-loader"],
                as: "*.js",
            },
        },
    },

    transpilePackages: ["three"],
};

module.exports = nextConfig;

export default nextConfig;
