const gulp = require('gulp');
const replace = require('gulp-replace');
const sass = require("gulp-sass");
const autoprefixer = require('gulp-autoprefixer');

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
        console.log(cssText);

        gulp.src('src/main.js')
            .pipe(replace('$style', cssText))
            .pipe(gulp.dest('dist'));
    });
});

gulp.task("default:watch", function() {
    gulp.watch("src/**", ["default"])
});