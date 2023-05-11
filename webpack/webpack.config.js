const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
  mode: "production",
  entry: {
    background: path.resolve(__dirname, "..", "src", "background.ts"),
    options: path.resolve(__dirname, "..", "src", "options.ts"),
    popup: path.resolve(__dirname, "..", "src", "popup.ts"),
  },
  output: { path: path.join(__dirname, "../dist"), filename: "[name].js" },
  resolve: { extensions: [".ts", ".js"] },
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/ }],
  },
  plugins: [
    new CopyPlugin({ patterns: [{ from: ".", to: ".", context: "public" }] }),
  ],
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 9002,
  },
  devtool: "source-map",
};
