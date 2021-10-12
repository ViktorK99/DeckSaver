var gulp = require('gulp');
var sass = require('gulp-sass');

sass.compiler = require('node-sass');

gulp.task('sass', function () {
  return gulp.src('./config/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./config/static/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./config/scss/**/*.scss', gulp.series(['sass']));
});