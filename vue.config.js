const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');
const AutoImport = require('unplugin-auto-import/webpack').default
const Components = require('unplugin-vue-components/webpack').default
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');
const CompressionPlugin = require("compression-webpack-plugin")

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new CompressionPlugin(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      // vue-i18n 编译时特性标志 - 使用 Composition API 模式
      new webpack.DefinePlugin({
        __VUE_I18N_FULL_INSTALL__: JSON.stringify(true),
        __VUE_I18N_LEGACY_API__: JSON.stringify(true), // 保持 true 以支持 $t() 在 Options API 中使用
        __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
      }),
    ],
  },
  devServer: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BACKEND_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  transpileDependencies: true,
});
