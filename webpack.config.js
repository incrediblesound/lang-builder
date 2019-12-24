const path = require('path');

const webpackConfig = {
  target: 'node',
  node: {
    __dirname: true,
  },
  entry: {
    server: './server.ts',
    client: './client/app.tsx',
  },
  mode: 'development',
  externals: { knex: 'commonjs knex' },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },

  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx', '.d.ts'],
    modules: [
      'node_modules',
      path.resolve('./'),
    ]
  },

  module: {
    rules: [
      { test: /\.ts(x?)?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  }
}

module.exports = webpackConfig