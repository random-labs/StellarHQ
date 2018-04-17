var gulp = require('gulp');

gulp.task('init', function () {
  return gulp.src('.githooks/*').pipe(gulp.dest('.git/hooks'));
});
