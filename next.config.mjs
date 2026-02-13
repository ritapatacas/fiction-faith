/** @type {import('next').NextConfig} */
const repoName = process.env.BASE_PATH || "";
const nextConfig = {
  output: "export",
  basePath: repoName ? `/${repoName}` : "",
  assetPrefix: repoName ? `/${repoName}/` : "",
  images: { unoptimized: true },
};

export default nextConfig;
