/** @type {import('next').NextConfig} */
const repoName = process.env.BASE_PATH || "";
const siteUrl = process.env.SITE_URL || null;
const nextConfig = {
  output: "export",
  basePath: repoName ? `/${repoName}` : "",
  assetPrefix: repoName ? `/${repoName}/` : "",
  images: { unoptimized: true },
  ...(siteUrl && { metadataBase: new URL(siteUrl) }),
};

export default nextConfig;
