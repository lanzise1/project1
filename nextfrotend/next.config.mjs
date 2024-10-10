/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, //严格模式在开发时可以关闭，生产中不用关闭
  async rewrites() {
    return [
      {
        source: "/pyapi/:path*", // 将前端 `/pyapi` 开头的请求代理到后端
        destination: `${process.env.PY_API_URL}/:path*`, // 从环境变量中获取后端服务器地址
      },
      {
        source: "/goapi/:path*", // 将前端 `/goapi` 开头的请求代理到后端
        destination: `${process.env.GO_API_URL}/:path*`, // 从环境变量中获取后端服务器地址
      },
    ];
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: "file-loader",
        options: {
          outputPath: "static/models/",
          publicPath: "/_next/static/models/",
          name: "[name].[hash].[ext]",
        },
      },
    });

    return config;
  },
};

export default nextConfig;
