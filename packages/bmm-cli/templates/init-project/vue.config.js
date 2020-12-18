const domainConfig = require('./config/domain-config-local')
const glob = require('glob')
const CompressionPlugin = require('compression-webpack-plugin')

// 配置pages多页面获取当前文件夹下的html和js
function getEntry (globPath) {
  const entries = {}
  glob.sync(globPath).forEach(function (entry) {

    /**
     * 本地时：
     * 多层目录嵌套，既可以http://localhost:8080/demo/trainning-mission访问，
     * 也可以http://localhost:8080/trainning-mission访问
     * 存在问题是当存在同名pages时只能识别层级最低的，src/pages/trainning-mission 和 src/pages/demo/trainning-mission.html,
     * 会只识别前者，后者不起作用，即便访问http://localhost:8080/trainning-mission可以，
     * 但访问http://localhost:8080/demo/trainning-mission不可以
     *
     * 生产环境：
     * 输出到dist，按层级
     */
    let paths = entry.split('/')
    // const basename = paths.slice(-2)[0]
    paths = paths.slice(3, -1).join('/')
    entries[paths] = {
      entry: 'src/pages/' + paths + '/main.js',
      template: 'src/pages/' + paths + '/index.html',
      filename: paths + '.html',
      title: require('./src/pages/' + paths + '/config.js').title,
    }
  })
  return entries
}

const pages = getEntry('./src/pages/**/main.js')

// 预览模式下的代理跳转
const router = function (req, res, proxyOptions) {
  const hostname = req.hostname
  if (hostname.indexOf('dsalbbp') === 0) {
    const splitArr = hostname.split('.')
    if (splitArr.length > 1) {
      const prefix = splitArr[0]
      const url = `http://${prefix}.dev.gdy.io`
      return url
    }
  }
}

// 自定义主题
const themeStyle = {
  'primary-color': '#2a5bf6', /* 主题色 */
}

// 根据域名配置生成proxy对象
const generateProxy = (srvList) => {
  const proxy = {}
  Object.keys(srvList).forEach((key) => {
    const { prefix, host } = srvList[key]
    const rule = '/' + prefix
    const rewriteRule = '^' + rule
    const pathRewrite = {}
    pathRewrite[rewriteRule] = ''
    proxy[rule] = {
      target: `${domainConfig.protocolDev}//${host}/`,
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite,
      router,
    }
  })
  return proxy
}

const proxy = generateProxy(domainConfig.srvList)

// 配置end
module.exports = {
  /* 输出文件目录：在npm run build时，生成文件的目录名称 */
  outputDir: 'dist',
  /* 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
  assetsDir: 'assets',
  /* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
  productionSourceMap: false,
  /* 代码保存时进行eslint检测 */
  lintOnSave: true,
  css: {
    loaderOptions: { // 向 CSS 相关的 loader 传递选项
      less: {
        javascriptEnabled: true,
        modifyVars: themeStyle,
      },
    },
  },
  pages,
  devServer: {
    // index: '',
    port: 8080,
    https: false,
    hotOnly: false,
    /* 设置为0.0.0.0则所有的地址均能访问 */
    host: '0.0.0.0',
    // 为每个静态文件开启 gzip
    compress: true,
    // 取消检测hostname，不然无法访问预览模式 http://dsalbbpgx8p.localhost:8080/
    disableHostCheck: true,
    // contentBase: path.join(__dirname, 'dist'),
    proxy,
  },
  configureWebpack: config => {
    config.module.rules.push({
      test: /\.worker.js$/,
      use: {
        loader: 'worker-loader',
        options: { inline: 'fallback', filename: 'file-worker.[hash].js' },
      },
    })
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new CompressionPlugin({
            test: /\.js$|\.html$|\.css$/, // 匹配文件名
            threshold: 10240, // 对超过10k的数据压缩
            deleteOriginalAssets: false, // 不删除源文件
          }),
          // 打包性能可视化
          // new BundleAnalyzerPlugin()
        ],
      }
    }
  },
  parallel: true,
  chainWebpack: config => {
    config.output.globalObject('this')
  },
}
