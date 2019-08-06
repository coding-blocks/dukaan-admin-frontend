const withSass = require('@zeit/next-sass')
const webpack = require('webpack')
const { parsed: localEnv } = require('dotenv').config();

module.exports = withSass({
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv))
    return config
  }
})
