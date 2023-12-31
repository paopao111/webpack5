const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { library } = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const config = {
  entry: {
    index: {
      import: "./src/index.js",
      dependOn: "react-vendor",
      filename: "js/index.js",
    },
    "react-vendor": {
      import: ["react"],
      filename: "js/dependOn/test.js",
    },
    test: {
      import: "./src/test.js",
      filename: "app.js",
      filename: "js/test.js",
    },
  },
  output: {
    // 产物输出路径，绝对路径
    path: path.resolve(__dirname, "public"),
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
    chunkFilename: "js/chunk/[name]_[chunkhash].js",
    library: {
      name: "simin_[id]", // 导出仓的名称，可以单独设置，也可以统一放一起
      type: "var", // library.type 库暴露的方式，比如var module umd cmd require等
      export: "log_a", // 决定将哪个函数导出。例如index.js 文件中定义了log_a 和log_b两个函数，这里可以仅将log_a导出
      //  auxliaryComment:true, // 在umd中添加注释 仅能在umd模式下用
      // umnNameDefine: true,// 在umd模式下是否使用define
    },
  },
  // 根据mode 使用不同的配置来构建
  /*
    development:开发模式，会将DefinePlugin中的NODE_ENV设置为development
    production：将NODE_ENV设置development
    none:使用默认模式
    */
  // 如果要根据mode来改变打包行为，必须要将配置导出为函数 -命令行方式传入参数时 --mode=production
  //   mode: "production",
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
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.scss$/,
        // 如果只有一个loader
        // loader:'css-loader',
        // 通过loader可以支持其他类型资源编译，比如css、图片等
        // use 从右往左执行
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  // 更强大的功能，某些场景需要注意使用顺序
  /*
    常用插件：
    HtmlWebpackPlubgin\
    EsLintWebpackPlubin\
    MiniCssExtractPlugin\
    TerserPlugin\ js压缩
    CssMinimizerPlugin\ css压缩 不是在plugins下面用的，而是在optimization.minimizer,模式为production
    PrefetchPlugin \ 代码预加载
    */
  plugins: [
    new HtmlWebpackPlugin({
      /*
        相关配置：
        title-html document title 如果定义了模版，则按照模版中的title来
        filename-输出html文件名
        template-制定html模版，一般指.html文件
        templateParameters-替换模版中的数据
        publicPath-script、style的路径 与output 中的public path一致
        minify-压缩配置
        */
      //  对应index.html文件中的htmlWebpackPlugin.options.title1
      title1: "title",
      template: path.resolve(__dirname, "src/index.html"),
      filename: "index.html",
      templateParameters: {
        // titleName对应index.html文件中ejs语法块中的titleName
        titleName: "test2",
      },
      minify: {
        //   production模式下默认全部开启
        collapseWhitespace: true, //空格是否压缩
        keepClosingSlash: true, //保留单例元素的末尾斜杠
        removeComments: true, //是否移除注释
        removeRedundantAttributes: true, //删除多余的属性
        removeScriptTypeAttributes: true, //删除script中的type属性
        removeStyleLinkTypeAttributes: true, //删除style标签中的type属性
        useShortDoctype: true, //使用短的文档类型
      },
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      // 与js chunk一样，如果不是直接加载就会形成一个chunkfilename
      chunkFilename: "css/chunk/[name].css",
    }),
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin({
        /*
          test-文件匹配,这里匹配的不是原始文件，而是build文件夹下的文件,可以是正则、字符串、函数
          include-文件包含
          exclude-文件排除
          parallel-是否启用多进程
          minify-用cssoMinify、cleanCssMinify、wsbuildMinify、parcelCssMinify 替换cssnanoMinify(默认)
          minimizerOptions-cssnano 优化选项
          */
        // test:/index\.css$/,
        // include: /cssFile/,
        exclude: /cssFile/,
      }),
      // webpack5 只需配置mode为production就可以压缩js代码。
      // 但是，如果用了css-minimizer-webpack-plugin插件去压缩css文件，js的压缩就会失效。
      // 因此需要使用terser-webpack-plugin插件去压缩js代码
      new TerserPlugin({ test: /\.js$/ }),
    ],
  },
  /*
    sourcemap 开发调试&线上排查利器
    1 配置规范 -devtool
    [inline-|hidden-|eval-][nosources-][cheat-[module-]]source-map
        引入方式：
            inline：内联 将生成的sourcemap文件，内联到我们的文件中
            hidden：会生成sourcemap，但是不在文件中引入
            eval：sourcemap也会在源代码中，但是不是放在文件最后，放在代码里面中间，通过eval的方式执行出来
        源码展示：nosource
        调试展示(展示行信息)：cheap、cheap-module
    2 production模式下：
            source-map、
            nosources-source-map、
            hidden-nosources-source-map、
            hidden-source-map
    3
    {
        "version": 3, //文件版本
        "file": "js/test.js", //对应文件名称
        "mappings": "gCACAA,QAAQC,IAAI,gB",
        "sources": [ //源文件列表
            "webpack://simin_/./src/test.js"
        ],
        "sourcesContent": [// 源文件字符串列表
            "import './index.css';\nconsole.log('this is test')"
        ],
        "names": [//源文件变量名和属性名
            "console",
            "log"
        ],
        "sourceRoot": ""源文件根目录
     }
     4、在监控中用途比较大
    */
  devtool: "source-map",
  // 开发环境模式 -devserver
  /*
   提供一个本地server -webpack-dev-server 隐藏输出
   1 allowedHosts: 将允许访问开发服务器的服务列为白名单
        设置为all时会跳过所有检查
        设置为auto时对于localhost、host等都会允许访问
        设置为【string】时，允许指定的host访问
    2 client:设置用户端相关展示
        overlay 可设置编译出错时全屏覆盖错误
        progress 可设置编辑进度展示
    3、compress 是否启用gzip 默认为true
    4、host `0.0.0.0`可被外部访问 https://cloud.tencent.com/developer/article/1643083
    5、hot: 设置为only时，修改代码不会刷新，只会提示更新但是不刷新 默认会自动热更新
    6、open 每次dev结束后，会打开一个新的浏览器，默认为false
    7、port:打开时的端口，webpack5可以设置为auto自动切换可用端口，默认为8080
    8、proxy:设置请求代理
   */
  devServer: {
    client: {
      overlay: false,
    },
    compress: true,
    open: false,
    port: 9001,
    // 设置请求代理
    proxy: {
        // 前端请求fetch('http://localhost:9001/api') 然后将/api匹配到的请求，转发到http://localhost:3000/，此时服务端请求服务端就不会发生跨域
        '/api/*':{
            target:'http://localhost:3000/',
            // pathRewrite 可以对请求到后端的接口进行替换，例如请求fetch('http://localhost:9001/api/test1')，此时后端本来获取的参数是
            ///api/test1 pathRewrite之后，则为/test1
            // pathRewrite:{
            //     '^/api':''
            // }
            bypass:(req,res,proxyOptions)=>{
                if(req.url.indexOf('test2')!==-1){
                    // 如果请求api包含test2，则返回首页
                    return '/'
                }
            },
            // 为true代表只有https才能访问，其他不能访问
            secure: false, 
        }
    },
    // 设置请求协议，比如http、https、spdy
    // server:'http',
    // 静态资源访问
    static:{
        directory:path.resolve(__dirname,'content'),
        // http://localhost:9001/static_txt/a.txt 
        publicPath:'/static_txt'
    }
  },
};
module.exports = (env, arg) => {
  console.log(env, arg);
  if (arg.mode === "development") {
    config.output.filename = "dev_[name].js";
    config.output.library.type = "global";
  }
  return config;
};
