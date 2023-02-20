const path = require("path");

module.exports = {
  // 모든 내용들이 module.exports 안에 다 들어가 있어야한다!!!!
  entry: "./src/client/js/main.js",
  mode: "development",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "assets", "js"),
  },
  module: {
    rules: [
      {
        test: /\.js$/, //변환시킬 파일의 형식
        use: {
          // 어떤loader로 변환 시킬 것인지
          loader: "babel-loader", //'babel-loader' 로 변환 시켜준다.
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
        //webpack은 뒤에서 부터 읽기 때문에 , 사용할 순서를 정할때 역순으로 입력 해야한다.
        //sass-loader ⏩ css-loader ⏩ styels-loader 으로 실행된다.
      },
    ],
  },
};
