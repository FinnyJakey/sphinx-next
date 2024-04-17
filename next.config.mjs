/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://us-central1-sphinx-910e5.cloudfunctions.net/:path*',
            },
        ]
    },
};

export default nextConfig;
