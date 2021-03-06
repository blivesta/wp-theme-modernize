var path = require('path');
var root = path.resolve(__dirname + '/..');

module.exports = {
  theme: './',
  src: 'src',
  js: 'js',
  css: 'css',
  dist: 'dist',
  sassOptions: {
    includePaths: ['node_modules/'],
    outputStyle: 'expanded'
  }
}
