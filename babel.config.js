// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true,
          ie: 11
        },
        useBuiltIns: 'usage',
        corejs: 3
      }
    ]
  ]
};