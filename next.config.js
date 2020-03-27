const withSass = require('@zeit/next-sass')
const withCss = require('@zeit/next-css')
const webpack = require('webpack')
const {parsed: localEnv} = require('dotenv').config();

module.exports = withCss(
    withSass({
        webpack: config => {
            // Fixes npm packages that depend on `fs` module
            config.node = {
                fs: 'empty'
            }
            config.plugins.push(new webpack.EnvironmentPlugin(localEnv))
            return config
        }
    })
);
