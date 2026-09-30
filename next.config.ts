/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/meta-analysis",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ]
  },
  // Lets other devices on the local network (e.g. an iPad) load dev-only assets
  allowedDevOrigins: ["192.168.68.61"],
  reactStrictMode: true,
  reactCompiler: true,
}

module.exports = nextConfig