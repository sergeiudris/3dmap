var path = require('path');
var webpack = require('webpack');
var DEBUG = !(process.argv.indexOf('--release') != -1);
console.log(process.argv);

module.exports = {
    entry: './src/main.js',
    output: {
        path: "",
        filename: "bundle.js",
        library: "worldmap3d",
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        modulesDirectories: ['node_modules', '.']
    },
    module: {
        //  preLoaders: [
        //         { 
        //             test: /\.json$/, 
        //             exclude: /node_modules/,
        //             include: [
        //                 path.resolve(__dirname, './node_modules/adven/UI/')
        //             ],
        //             loader: 'json'
        //         }
        //     ],
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, './src/')
                ],
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.json$/,
                exclude: [
                    path.resolve(__dirname, './routes.json'),
                ],
                loader: 'json-loader',
            },
            {
                test: /\.(txt|shader|cpp|vs|fs)$/,
                loader: 'raw-loader',
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
                loader: 'url-loader?limit=10000',
            },
            {
                test: /\.(eot|ttf|wav|mp3)$/,
                loader: 'file-loader',
            }

        ]

    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        ...(!DEBUG ? [new webpack.optimize.UglifyJsPlugin({
            compress: false,
            mangle: {
                toplevel: true
            },
            mangleProperties: true
        })] : [])

    ]
};