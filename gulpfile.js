var gulp = require('gulp');
var screeps = require('gulp-screeps');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");


var secrets = require('./secrets.js');

var srcDist = 'dist/';

gulp.task('upload', function () {
    gulp.src(srcDist + '*.js')
        .pipe(screeps(secrets));
});

gulp.task('ptr', function () {
    secrets.ptr = true;
    gulp.src(srcDist + '*.js')
        .pipe(screeps(secrets));
});

gulp.task("compile", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('./dist'));
});
