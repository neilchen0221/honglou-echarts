// Webpack uses this to work with directories
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
	template: './src/index.html',
	filename: './index.html'
});

// This is the main configuration object.
// Here you write different options and tell Webpack what to do
module.exports = {
	// Path to your entry point. From this file Webpack will begin his work
	entry: './src/index.js',

	// Path and filename of your result bundle.
	// Webpack will bundle all JavaScript into this file
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'bundle-[hash].js'
	},
	module: {
		rules: [
			{
				test: /\.(png|jpg)$/,
				exclude: /node_modules/,
				loader: 'file-loader'
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader']
			}
		]
	},
	// Default mode for Webpack is production.
	// Depending on mode Webpack will apply different things
	// on final bundle. For now we don't need production's JavaScript
	// minifying and other thing so let's set mode to development
	mode: 'development',
	plugins: [htmlPlugin]
};
