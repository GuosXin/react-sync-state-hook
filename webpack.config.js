const path = require('path')

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'publish'),
        library: {
            name:'reactSyncStateHook',
            type: 'umd'
        }
    },
    externals: ['react', 'lodash'],
}