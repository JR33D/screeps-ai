var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var ts = require('gulp-typescript');
var del = require('del');

var tsConfig = require('./tsconfig.json');
var secrets = require('./secrets.js');

gulp.task('clean', function () {
    return del('dist/**');
});

gulp.task('compile', ['clean'], function () {
    var source = [];
    source = source.concat(tsConfig.files);
    source = source.concat(tsConfig.filesGlob);

    var tsResult = gulp.src(source).pipe(ts(tsConfig.compilerOptions));

    return tsResult.js.pipe(gulp.dest('dist'));

});

gulp.task('upload', ['compile'], function () {
    gulp.src('dist/*.js')
        .pipe(plugins.screeps(secrets));
});

gulp.task('ptr', ['compile'], function () {
    secrets.ptr = true;
    gulp.src('dist/*.js')
        .pipe(plugins.screeps(secrets));
});

gulp.task('default', ['compile']);