var gulp = require('gulp');
var browserSync = require('browser-sync');
var postcss = require('gulp-postcss');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var Svgpack = require('svgpack');
var webpack = require('webpack');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var webpackStream = require('webpack-stream');
var webpackConfig = require('../../webpack.config.js');

var config = require('../config');

// browserSync
gulp.task('browser-sync', function() {
  browserSync.init({
    proxy: "vccw.dev"
  });
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});

// css
gulp.task("css", function() {
  return gulp.src(config.css + '/style.css')
    .pipe(postcss([
      require('postcss-import'),
      require('postcss-custom-properties'),
      require('postcss-nesting'),
      require('postcss-custom-media'),
      require('postcss-flexbugs-fixes'),
      require('autoprefixer')
    ]))
    .pipe(gulp.dest(config.theme))
    .on('end', function(){
      gulp.src( [ config.theme + 'style.css'] )
        .pipe( cssmin() )
        .pipe( rename( { suffix: '.min' } ) )
        .pipe( gulp.dest(config.theme) );
    });
});

// SVG
gulp.task('svg', function () {
  var svg = new Svgpack(config.src + '/svg/*.svg', config.theme + 'svgpack')
  return svg.init()
})

gulp.task('svg:spriteRename', function () {
  return gulp
    .src(config.theme + 'svgpack/svgpack-sprite.svg')
    .pipe(rename('svgpack-sprite.php'))
    .pipe(gulp.dest(config.theme + 'template-parts'))
})

gulp.task('svg:cssRename', function () {
  return gulp
    .src(config.theme + 'svgpack/svgpack.css')
    .pipe(gulp.dest(config.css + '/modules'))
})

// webpack
gulp.task('webpack', function() {
  return gulp
    .src(config.src + '/js/main.js')
    .pipe(plumber())
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(config.js))
    .on('end', function(){
      gulp.src( [ config.js + '/bundle.js'] )
				.pipe( uglify() )
        .pipe( rename( { suffix: '.min' } ) )
				.pipe( gulp.dest(config.js) );
    });
});

gulp.task('uglify', function(){
  gulp.src(config.js + '/bundle.js')
    .pipe(uglify('bundle.min.js'))
    .pipe(gulp.dest(config.js));
});

gulp.task('watch', ['browser-sync'], function(callback) {
  gulp.watch([config.src + '/js/**/*.js'], ['webpack'], ['bs-reload']);
  gulp.watch([config.css + '/**/*.css'], ['css'], ['bs-reload']);
  gulp.watch([config.theme + '**/*.{css,js,php}'], ['bs-reload']);
  callback();
});


// Default
// =====================================================
gulp.task('default', function (cb) {
  return runSequence(
    ['build'],
    'watch',
    'browser-sync',
    cb
  )
})

// Build
// =====================================================
gulp.task('build', function (cb) {
  return runSequence(
    ['svg'],
    'svg:spriteRename',
    'svg:cssRename',
    ['css', 'webpack'],
    cb
  )
})
