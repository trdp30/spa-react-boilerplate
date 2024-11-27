const path = require('path');
const Dotenv = require('dotenv-webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './app/index.tsx',
  module: {
    rules: [
      // Rule for processing TypeScript and TSX files
      {
        test: /.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },

      // Rule for processing CSS files
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },

      // Rule for processing CSS files from node_modules
      {
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },

      // Rule for processing SVG files
      {
        test: /\.svg/,
        type: 'asset/resource', // Use asset/resource type for handling SVG
      },

      // Rule for processing image files (jpg, png, gif)
      {
        test: /\.(jpg|png|gif)$/, // Regex to match .jpg, .png, .gif files
        use: [
          {
            loader: 'url-loader', // Use url-loader to handle images
            options: {
              limit: 10 * 1024, // Inline images smaller than 10KB as base64 URIs
            },
          },
          {
            loader: 'image-webpack-loader', // Use image-webpack-loader to optimize images
            options: {
              mozjpeg: {
                enabled: false, // Disable mozjpeg optimization
              },
              gifsicle: {
                interlaced: false, // Disable interlacing for GIFs
              },
              optipng: {
                optimizationLevel: 7, // Set PNG optimization level
              },
            },
          },
        ],
      },
    ],
  },

  // Resolve configuration for module resolution
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()], // Use TsconfigPathsPlugin for path aliasing
    alias: {
      // Define aliases for easier imports
      '@components': path.resolve(__dirname, 'app/components/'),
      '@containers': path.resolve(__dirname, 'app/containers/'),
      '@utils': path.resolve(__dirname, 'app/utils/'),
      '@hooks': path.resolve(__dirname, 'app/hooks/'),
      '@contexts': path.resolve(__dirname, 'app/contexts/'),
      '@assets': path.resolve(__dirname, 'app/assets'),
      '@store': path.resolve(__dirname, 'app/store'),
    },
  },

  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    clean: true, // Clean the output directory before each build
    publicPath: '/', // Public URL of the output directory
  },

  // Plugins to extend Webpack functionality
  plugins: [
    new Dotenv({
      systemvars: true, // Load environment variables from .env file
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '',
          globOptions: { ignore: ['**/index.html'] },
        }, // Copy files from public directory to the root of the output directory excluding 'index.html'
      ],
    }),
  ],
};
