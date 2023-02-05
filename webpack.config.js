const path = require("path");

module.exports = {
  entry: {
    content: "./src/content.ts",
    service_worker: "./src/service_worker.ts",
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts"],
    modules: [
      path.resolve(__dirname, "node_modules"),
      path.resolve(__dirname, "src"),
    ],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
