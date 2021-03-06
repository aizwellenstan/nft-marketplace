const path = require('path')
const nodeExternals = require('webpack-node-externals')
const CURRENT_WORKING_DIR = process.cwd()
const webpack = require('webpack');
require('dotenv').config()

const config = {
    name: "server",
    entry: [ path.join(CURRENT_WORKING_DIR , './server/server.js') ],
    target: "node",
    output: {
        path: path.join(CURRENT_WORKING_DIR , '/dist/'),
        filename: "server.generated.js",
        publicPath: '/dist/',
        libraryTarget: "commonjs2"
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [ 'babel-loader' ]
            },
            {
                test: /\.(ttf|eot|svg|gif|jpg|png)(\?[\s\S]+)?$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
          "process.env.NFTPORT_API_KEY": JSON.stringify(process.env.NFTPORT_API_KEY),
          "process.env.CONTRACT_ADDRESS": JSON.stringify(process.env.CONTRACT_ADDRESS),
          "process.env.WALLET_ADDRESS": JSON.stringify(process.env.WALLET_ADDRESS),
          "process.env.CHAIN": JSON.stringify(process.env.CHAIN)
        }),
    ]
}

module.exports = config
