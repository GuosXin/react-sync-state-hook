const path = require('path')

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, '../src/index.js'),
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, '../public'),
        globalObject: 'this',
        library: {
            name:'reactSyncStateHook',
            type: 'umd',
        }
    },
    externals: ['react', 'lodash'],
}