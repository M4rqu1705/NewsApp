const { src, dest, series, parallel } = require('gulp');
const minify = require("gulp-minify");
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer')

const clean = function () {
    return del(['dist']);
}

const styles = function () {
    return (
        src([
            "./static/css/variables.css",
            "./static/css/general.css",
            "./static/css/card.css",
            "./static/css/overlay.css",
            "./static/css/watermarks.css",
            "./static/css/menu.css",
            "./static/css/themes.css",

        ], { allowEmpty: true })
            .pipe(concat('app.css'))
            .pipe(autoprefixer({
                // browsers: ['last 99 versions'],
                cascade: false
            }))
            .pipe(cleanCSS())
            .pipe(dest('./static/dist'))
    );
}

const scripts = function () {
    return (
        src([
            "./static/js/globals.js",
            "./static/js/overlay.js",
            "./static/js/menu.js",
            "./static/js/themes.js",
            "./static/js/script.js",
        ], { allowEmpty: true })
            .pipe(concat('app.js'))
            .pipe(minify({ noSource: true }))
            .pipe(dest('./static/dist'))
    );
}


const build = series(clean, parallel(styles, scripts));

exports.styles = styles;
exports.scripts = scripts;
exports.clean = clean;
exports.build = build;
exports.default = build;