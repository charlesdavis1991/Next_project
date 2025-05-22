const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const dotenv = require("dotenv").config();
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = (env = {}, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: argv.mode || "development",
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProduction ? "[name].[contenthash].js" : "[name].bundle.js",
      chunkFilename: isProduction
        ? "[name].[contenthash].chunk.js"
        : "[name].chunk.js",
      publicPath: "/",
    },
    resolve: {
      extensions: [".js", ".jsx"],
    },

    // Use faster source maps in development
    devtool: isProduction ? "source-map" : "eval-cheap-module-source-map",

    devServer: {
      server: "http",
      static: "./dist",
      historyApiFallback: true,
      hot: true,
      open: true,
      port: 3000,
      compress: true, // Enable gzip compression
    },

    // Optimized splitChunks configuration - this was the most effective change
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: isProduction,
              drop_debugger: isProduction,
            },
            output: {
              comments: false,
            },
          },
        }),
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        chunks: "all",
        maxInitialRequests: 10,
        minSize: 20000,
        maxSize: 300000, // Increased to reduce total chunk count
        cacheGroups: {
          // Consolidated Syncfusion bundles
          syncfusionCore: {
            test: /[\\/]node_modules[\\/]@syncfusion[\\/](base|data|calendars|ej2-base)[\\/]/,
            name: "syncfusion-core",
            priority: 30,
            reuseExistingChunk: true,
          },
          syncfusion: {
            test: /[\\/]node_modules[\\/]@syncfusion[\\/]/,
            name: "syncfusion-other",
            priority: 20,
            reuseExistingChunk: true,
          },
          // React and related libraries
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
            name: "react-core",
            priority: 15,
            reuseExistingChunk: true,
          },
          // Keep specialized chunks for specific libraries
          pdfLibs: {
            test: /[\\/]node_modules[\\/](pdf-lib|jspdf|react-pdf|pdfjs)[\\/]/,
            name: "pdf-libs",
            priority: 15,
            reuseExistingChunk: true,
          },
          calendar: {
            test: /[\\/]node_modules[\\/](@fullcalendar|fullcalendar)[\\/]/,
            name: "calendar",
            priority: 15,
            reuseExistingChunk: true,
          },
          reactIcons: {
            test: /[\\/]node_modules[\\/]react-icons[\\/]/,
            name: "react-icons",
            priority: 15,
            reuseExistingChunk: true,
          },
          // All other vendor modules
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: 10,
            reuseExistingChunk: true,
            minSize: 50000, // Larger minSize to avoid tiny chunks
          },
          // Common code between modules
          common: {
            name: "common",
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
      runtimeChunk: "single",
    },

    // Simplified loader configuration
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    useBuiltIns: "usage",
                    corejs: 3,
                    modules: false, // Important for tree shaking
                  },
                ],
                "@babel/preset-react",
              ],
              plugins: [
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-syntax-dynamic-import",
              ],
              cacheDirectory: true,
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader", // Extract CSS in production
            "css-loader",
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/,
          type: "asset", // Use asset module
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024, // 8kb - inline smaller images
            },
          },
        },
        {
          test: /\.scss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            "sass-loader",
          ],
        },
      ],
    },

    // Plugins that actually made a difference
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: "./public/BP_resources", to: "BP_resources" },
          { from: "./public/bp_assets", to: "bp_assets" },
        ],
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        favicon: "./public/favicon.ico",
        minify: isProduction
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
            }
          : false,
      }),
      // Extract CSS - this made a big difference
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: "styles/[name].[contenthash].css",
              chunkFilename: "styles/[name].[contenthash].css",
            }),
          ]
        : []),
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(dotenv.parsed || {}),
        "process.env.REACT_APP_BACKEND_URL": JSON.stringify(
          process.env.REACT_APP_BACKEND_URL
        ),
        "process.env.NODE_ENV": JSON.stringify(
          isProduction ? "production" : "development"
        ),
      }),

      // Only include this if you're using moment.js
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
    ],
    performance: {
      hints: isProduction ? "warning" : false,
      maxAssetSize: 300000, // 300KB
      maxEntrypointSize: 500000, // 500KB
    },
  };
};
