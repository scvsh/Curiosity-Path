const camelCase = require('camelcase');
const path = require('path');
const webpack = require('webpack');
const pkg = require(path.join(process.cwd(), 'package.json'));
const shouldMininimize = process.argv.indexOf('--min') !== -1;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractLess = new ExtractTextPlugin({
    filename: 'style.css',
    disable: process.env.NODE_ENV === 'development',
});

const HtmlWebpackPlugin = require('html-webpack-plugin');

const standardConfig = {
    devtool: 'source-map',
    entry: './src/app.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app.js',
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: extractLess.extract({
                    use: [
                        {
                            loader: 'css-loader',
                        },
                        {
                            loader: 'less-loader',
                        },
                    ],
                    // use style-loader in development
                    fallback: 'style-loader',
                }),
            },
        ],
        noParse: /node_modules\/knockout\/build\/output\/*.js/,
        loaders: [
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                loader: 'file-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['babel-preset-es2015'],
                },
            },
        ],
    },
    devServer: {
        port: 3000,
        contentBase: 'src/',
        inline: false,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            hash: true,
            inject: false,
        }),
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true,
        }),
        extractLess,
    ],
};

if (shouldMininimize) {
    Object.assign(standardConfig.entry, {
        'dist/app.min.js': './src/app.js',
    });
}

module.exports = standardConfig;
