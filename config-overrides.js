const path = require('path');

module.exports = function override(config, env) {
  // Add file-loader for pdf.js
  config.module.rules.push({
    test: /pdf\.js$/,
    use: 'file-loader',
  });

  // Allow absolute imports of pdfjs-dist in the code
  config.resolve.alias = {
    ...config.resolve.alias,
    'pdfjs-dist': path.resolve('./node_modules/pdfjs-dist'),
  };

  return config;
};
