const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  configureWebpack: (config) => {
    config.module.rules.push({
      test: /\.glsl$/,
      use: [
        {
          loader: 'webpack-glsl-loader'
        }
      ]
    })
  }
})
