const path = require('path');

module.exports = (config, { isProd, isDev, isTest }) => {
  /**
   * Customize the webpack by modifying the config object.
   * Consult https://webpack.js.org/configuration for more information
   */

  return {
    ...config,
    node: {
      ...config.node,
      global: true,
    },
    performance: {
      ...config.performance,
      hints: false,
    },
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /index\.ts$/,
          include: [path.join(__dirname, 'src/feature-library/')],
          use: 'import-glob',
        },
        {
          test: /\.ts$/,
          include: [path.join(__dirname, 'src/utils/feature-loader/')],
          use: 'import-glob',
        },
        {
          test: /\.tsx$/,
          include: [path.join(__dirname, 'src/utils/feature-loader/')],
          use: 'import-glob',
        },
      ],
    },
  };
};
