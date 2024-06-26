/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // SSR off for deployment
    webpack: (config) => {
        config.externals.push("pino-pretty", "lokijs", "encoding");
        return config;
    },
};

export default nextConfig;
