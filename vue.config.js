module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:9000/',
                ws: true,
                changeOrigin: true,
                logLevel: 'debug',
                pathRewrite: {
                    '^/api': '/api'
                }
            }
        }
    },
    pwa: {
        iconPaths: {
            favicon32: 'favicon.ioc',
            favicon16: 'favicon.ioc',
            appleTouchIcon: 'favicon.ioc',
            maskIcon: 'favicon.ioc',
            msTileImage: 'favicon.ioc'
        }
    },
    assetsDir: 'static',
    parallel: false,
    publicPath: './',
    lintOnSave: false //关闭eslint检查
}