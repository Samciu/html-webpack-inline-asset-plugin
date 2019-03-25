const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineAssetPlugin = require('html-webpack-inline-asset-plugin');
const path = require('path');

module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            { test: /\.hbs$/, loader: "handlebars-loader" }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            template: './src/index.hbs'
        }),
        new HtmlWebpackInlineAssetPlugin()
    ]
};