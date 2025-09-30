module.exports = {
  webpack: (config) => {
    config.externals.push({ canvas: 'commonjs canvas' });
    return config;
  },
}
