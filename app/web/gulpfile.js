const { src, dest, series, parallel, watch } = require('gulp');
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const del = require('del');
const minify = require("gulp-minify");
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');
const image = require('gulp-image');
const webp = require('gulp-webp');
// const uglify = require('gulp-uglify-es').default;



const clean = function () {
    return del(['dist/static/css/*', 'dist/static/js/*', 'dist/templates/*']);
}

const cleanAll = function () {
    return del(['dist']);
}

const images = function () {
    return (
        src('./img/*')
            .pipe(image({
                optipng: ['-i 1', '-strip all', '-fix', '-o7', '-force'],
                pngquant: ['--speed=1', '--force', 256],
                zopflipng: ['-y', '--lossy_8bit', '--lossy_transparent'],
                jpegRecompress: ['--strip', '--quality', 'medium', '--min', 40, '--max', 80],
                mozjpeg: ['-optimize', '-progressive'],
                gifsicle: ['--optimize'],
                svgo: ['--enable', 'cleanupIDs', '--disable', 'convertColors']
            }))
            .pipe(webp())
            .pipe(dest('./dist/static/img'))
    );
}

const moveFonts = function () {
    return (
        src('./font/*')
            .pipe(dest('./dist/static/font'))
    );
}

const css = function () {
    return (
        src([
            "./css/variables.css",
            "./css/general.css",
            "./css/card.css",
            "./css/overlay.css",
            "./css/watermarks.css",
            "./css/menu.css",
            "./css/themes.css",

        ], { allowEmpty: true })
            .pipe(concat('styles.css'))
            .pipe(autoprefixer())
            .pipe(cleanCSS({ level: 2 }))
            .pipe(dest('./dist/static/css'))
    );
}

const js = function () {
    const old_api_server = `var api_server = "http:\/\/127.0.0.1:5000";`
    const new_api_server = `var api_server = "https:\/\/marcos-newsapp.herokuapp.com";`;

    return (
        src([
            "./js/globals.js",
            "./js/overlay.js",
            "./js/menu.js",
            "./js/themes.js",
            "./js/script.js",
        ], { allowEmpty: true })
            .pipe(concat('scripts.js'))
            .pipe(replace(old_api_server, new_api_server))
            .pipe(minify())
            .pipe(dest('./dist/static/js'))
    );
}

const html = function () {
    const old_css_imports = /<link rel="stylesheet" href="\/static\/css\/variables.css">[\S\s]+themes.css">/gi;
    const new_css_import = '<link rel="stylesheet" href="static/css/styles.css">';

    const old_js_import = /<script src="\/static\/js\/globals.js"><\/script>[\S\s]+script.js"><\/script>/gi;
    const new_js_import = '<script src="static/js/scripts-min.js"></script>';

    return (
        src("./index.html", { allowEmpty: true })
            .pipe(replace(old_css_imports, new_css_import))
            .pipe(replace(old_js_import, new_js_import))
            .pipe(htmlmin({
                caseSensitive: true,
                collapseWhitespace: true,
                quoteCharacter: '"',
                removeRedundantAttributes: true,

            }))
            .pipe(dest('./dist/templates'))
    );
}


const build = series(clean, parallel(css, js, html));
const full = series(cleanAll, parallel(images, moveFonts, css, js, html));

exports.images = images;
exports.css = css;
exports.js = js;
exports.html = html;
exports.clean = clean;
exports.cleanAll = cleanAll;
exports.build = build;
exports.full = full;
exports.default = function () {
    watch('./js/*.js', js);
    watch('./css/*.css', css);
    watch('*.html', html);
    watch('./img/*', images);
    watch('./font/*', moveFonts);
};