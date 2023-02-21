const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: "./src/client/js/main.js",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  mode: "development",
  watch: true, //webpack이 assets를 주시하여 변경점을 감지되면 리프레시 한다
  output: {
    filename: "js/main.js",
    path: path.resolve(__dirname, "assets"),
    clean: true, //output이 실행되기전(build) 클린해준다
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        //style-loader 대신 MiniCssExtractPlugin를 사용한다.
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
