var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 35729}));
  app.use(express.static(__dirname));
  app.listen(4000, '0.0.0.0');
});

var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
    tinylr.listen(35729);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

// Styles
gulp.task('styles', function() {
  return sass('app/styles/sass/styles.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('app/styles/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('app/styles/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('app/scripts/main.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('app/scripts/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('app/scripts/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('app/assets/images/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('app/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('watch', function() {
  gulp.watch('app/styles/sass/styles.scss', ['styles']);
  gulp.watch('app/scripts/main.js', ['scripts']);
  gulp.watch('app/assets/images/*', ['images']);
  gulp.watch('app/index.html', notifyLiveReload);
  gulp.watch('app/styles/css/styles.css', notifyLiveReload);
  gulp.watch('app/scripts/js/main.js', notifyLiveReload);
  gulp.watch('app/images/*', notifyLiveReload);
});

// Default task
gulp.task('default', ['styles', 'scripts', 'images', 'express', 'livereload', 'watch'], function() {
});