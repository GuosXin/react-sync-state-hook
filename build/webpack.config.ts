const path = require('path')

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, '../src/index.ts'),
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, '../public'),
        globalObject: 'this',
        library: {
            name:'reactSyncStateHook',
            type: 'umd'
        }
    },
    module: {
        rules: [
            {
                test: /.ts$/,
                use: 'ts-loader',
                include: [ path.resolve(__dirname, '../src') ],
            }
        ]
    },
    externals: ['react', 'lodash'],
}