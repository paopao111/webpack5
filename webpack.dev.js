const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { library } = require("webpack");
module.exports = {
  entry: {
    index: {
      import: "./src/index.js",
      dependOn: "react-vendor",
    },
    "react-vendor": {
      import: ["react"],
    },
    test: {
      import: "./src/test.js",
      filename: "app.js",
    },
  },
  output: {
    // 产物输出路径，绝对路径
    path: path.resolve(__dirname, "build"),
    // 按需加载或外部资源的真实路径，默认为相对路径;
    /*
         主要用于线上CDN路径
         <script defer="defer" src="https://a/assets/index.js"></script>
         <script defer="defer" src="https://a/assets/react-vendor.js"></script>
         <script defer="defer" src="https://a/assets/app.js"></script>
        */
    // publicPath: 'https://a/assets/',
    filename: "[name].js",
    // 如果不是一开始引入的，包括一些异步引入的;[id] 为模块ID
    chunkFilename: "assets_[chunkhash].js",
    library: {
      name: "simin_[id]", // 导出仓的名称，可以单独设置，也可以统一放一起
      type: "var", // library.type 库暴露的方式，比如var module umd cmd require等
      export: "log_a", // 决定将哪个函数导出。例如index.js 文件中定义了log_a 和log_b两个函数，这里可以仅将log_a导出
      //  auxliaryComment:true, // 在umd中添加注释 仅能在umd模式下用
      // umnNameDefine: true,// 在umd模式下是否使用define
    },
  },
  mode: "production",
  /*
    常用的loader有：
    babel-loader、
    ts-loader、
    css-loader、
    sass-loader、
    style-loader、
    MiniCssExtractPlugin.loader 把样式文件分隔开
    */
  module: {
    rules: [
      {
        test: /\.css$/,
        // 如果只有一个loader
        // loader:'css-loader',
        // 通过loader可以支持其他类型资源编译，比如css、图片等
        // use 从右往左执行
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
    }),
  ],
};
