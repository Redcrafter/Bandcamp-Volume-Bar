const gulp = require('gulp');
const replace = require('gulp-replace');
const sass = require("gulp-sass");
const autoprefixer = require('gulp-autoprefixer');
const fs = require("fs");

function buildCSS() {
    return gulp.src("src/style.scss")
    .pipe(sass({
        outputStyle: 'compressed'
    })).pipe(autoprefixer({
        browsers: [">1%"]
    }));
}

gulp.task('default', function () {
    buildCSS().on("data", function (file) {
        var cssText = file.contents.toString().trim("\r\n");

        gulp.src('src/main.js')
            .pipe(replace('$style', cssText))
            .pipe(replace('$volume_off', fs.readFileSync("src/volume_off-24px.svg")))
            .pipe(replace('$volume_mute', fs.readFileSync("src/volume_mute-24px.svg")))
            .pipe(replace('$volume_down', fs.readFileSync("src/volume_down-24px.svg")))
            .pipe(replace('$volume_up', fs.readFileSync("src/volume_up-24px.svg")))
            .pipe(gulp.dest('dist'));
    });
});

gulp.task("default:watch", function() {
    gulp.watch("src/**", ["default"])
});