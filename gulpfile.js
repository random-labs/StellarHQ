var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var requirejsConfig = require('./requirejs.config.json');
var swPrecache = require('sw-precache');

gulp.task('init', function () {
  return gulp.src('.githooks/*').pipe(gulp.dest('.git/hooks'));
});

gulp.task('build', function (callback) {
  plugins.sequence(['bundle', 'requirejs'], 'generate-service-worker')(callback);
});

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
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.requirejsOptimize(requirejsConfig))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('requirejs', function () {
  return gulp.src('bower_components/requirejs/require.js')
    .pipe(gulp.dest('dist'));
});

// LOCAL DEV

gulp.task('dev', function (callback) {
  plugins.sequence('build', ['watch', 'connect'])(callback);
});

gulp.task('watch', function () {
  gulp.watch(['index.html', './app/**/*'], ['build'])
  plugins.watch(['index.html', './app/assets/**/*', './dist/**/*'])
    .pipe(plugins.changedInPlace())
    .pipe(plugins.filelog())
    .pipe(plugins.connect.reload());
});

gulp.task('connect', function () {
  return plugins.connect.server({
    root: './',
    livereload: true,
    port: 5000
  });
});
