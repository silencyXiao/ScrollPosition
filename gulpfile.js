var gulp = require('gulp');

var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// path路径
var devPath = './build/*.js';
var releasePath = './dist/js';

// 压缩js文件
gulp.task('uglify', function() {
  gulp.src(devPath)
      .pipe(uglify())
      .pipe(rename({
        prefix: 'jquery.',
        suffix: '.min'
      }))
      .pipe(gulp.dest(releasePath));
});