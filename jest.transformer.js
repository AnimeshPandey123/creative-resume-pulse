const babelJest = require('babel-jest').default;

module.exports = babelJest.createTransformer({
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [
    // Force React into development mode
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic',
        development: true,
      },
    ],
  ],
  env: {
    test: {
      plugins: [
        // Ensure development mode in test environment
        [
          '@babel/plugin-transform-react-jsx',
          {
            runtime: 'automatic',
            development: true,
          },
        ],
      ],
    },
  },
});
