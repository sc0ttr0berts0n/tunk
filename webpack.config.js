const path = require('path');

module.exports = {
    entry: './src/ts/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'js/bundle.js',
        path: path.resolve(__dirname, 'public'),
    },
    optimization: {
        minimize: false,
    },
    watch: true,
};
