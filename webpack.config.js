const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: {
		build: path.resolve(__dirname, 'src', 'app.js')
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'build.js'
	},
	devServer: {
		proxy: {
			'/api/**': 'http://localhost:8000',
			'/badge/**': 'http://localhost:8000'
		},
		contentBase: 'dist',
		inline: true,
		hot: true,
		historyApiFallback: true
	},
	context: __dirname,
	module: {
		rules: [{
			test: /\.css$/,
			use: [{
				loader: 'style-loader'
			},
			{
				loader: 'css-loader',
				options: {
					sourceMap: true
				}
			}
			]
		},
		{
			test: /.jsx?$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			query: {
				presets: ['env', 'react']
			}
		}
		]
	},
	resolve: {
		modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': process.env.NODE_ENV ? `"${process.env.NODE_ENV}"` : JSON.stringify('production')
			}
		}),
		new webpack.optimize.AggressiveMergingPlugin()
	]
};
