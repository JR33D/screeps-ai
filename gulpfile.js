var gulp = require('gulp');
var screeps = require('gulp-screeps');

var secrets = require('./secrets.js');

gulp.task('upload', function () {
    gulp.src('src/*.js')
        .pipe(screeps(secrets));
});

gulp.task('ptr', function () {
    secrets.ptr = true;
    gulp.src('src/*.js')
        .pipe(screeps(secrets));
});
