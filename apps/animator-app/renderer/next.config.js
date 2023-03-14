module.exports = {
  transpilePackages: ["ui-react", "preview-react"],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer";
    }

    return config;
  },
};
