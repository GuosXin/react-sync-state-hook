const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, '../test/index.js'),
    plugins: [new HtmlWebpackPlugin()],
    devtool: 'inline-source-map',
    devServer: {
        host: '127.0.0.1',
        port: 3000,
        open: true,
        hot: true,
        static: path.resolve(__dirname, '../test/dist'),
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-react"]
                    }
                },
            }
        ]
    }
}