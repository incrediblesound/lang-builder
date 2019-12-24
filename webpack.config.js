const path = require('path');

const webpackConfig = {
  target: 'node',
  entry: {
    story: './server.ts'
  },
  mode: 'development',
  externals: { knex: 'commonjs knex' },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist')
  },

  resolve: {
    extensions: ['.js', '.json', '.ts', '.d.ts'],
    modules: [
      'node_modules',
      path.resolve('./'),
    ]
  },

  module: {
    rules: [
      { test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  }
}

module.exports = webpackConfig