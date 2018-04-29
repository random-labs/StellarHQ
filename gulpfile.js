var gulp = require('gulp');
var gulpSequence = require('gulp-sequence')
var sourcemaps = require('gulp-sourcemaps');

var requirejsOptimize = require('gulp-requirejs-optimize');
var requirejsConfig = require('./requirejs.config.json');
var swPrecache = require('sw-precache');

gulp.task('init', function () {
  return gulp.src('.githooks/*').pipe(gulp.dest('.git/hooks'));
});

gulp.task('build', gulpSequence(['bundle', 'requirejs'], 'generate-service-worker'));

gulp.task('generate-service-worker', function (callback) {
  swPrecache.write(`./service-worker.js`, {
    staticFileGlobs: [
      'index.html',
      'dist/**/*',
      'app/**/*.css'
    ],
    maximumFileSizeToCacheInBytes: 4194304
  }, callback);
});

gulp.task('bundle', function () {
  return gulp.src('app/app.js')
    .pipe(sourcemaps.init())
    .pipe(requirejsOptimize(requirejsConfig))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('requirejs', function () {
  return gulp.src('bower_components/requirejs/require.js')
    .pipe(gulp.dest('dist'));
});
