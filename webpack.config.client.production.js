const path = require('path')
const CURRENT_WORKING_DIR = process.cwd()
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
require('dotenv').config();

const config = {
    mode: "production",
    entry: [
        path.join(CURRENT_WORKING_DIR, 'client/main.js')
    ],
    output: {
        path: path.join(CURRENT_WORKING_DIR , '/dist'),
        filename: 'bundle.js',
        publicPath: "/dist/"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.(ttf|eot|svg|gif|jpg|png)(\?[\s\S]+)?$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
          "process.env.NFTPORT_API_KEY": process.env.NFTPORT_API_KEY
        }),
    ]
}

module.exports = config
