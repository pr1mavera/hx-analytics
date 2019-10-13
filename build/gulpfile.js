const gulp = require('gulp');
const clean = require('gulp-clean');
const watch = require('gulp-watch');
const ts = require('gulp-typescript');

const entry = '../src/**/*';
const jsEntry = '../src/**/*.js';
const tsEntry = '../src/**/*.ts';
const buildEntry = '../packages/**';
// const types = [ '../node_modules/@types/**/index.d.ts', '!../node_modules/@types/**/node_modules/**/*.d.ts' ];
const types = [];

const tsconfig = {
    target: "es5",
    allowJs: true,
    module: "ES6",
    moduleResolution: "node",
    noImplicitAny: true
}

function cleanTask() {
    return gulp.src(buildEntry, { read: false })
        .pipe(clean({ force: true }));
}

function copyJs() {
    return watch(entry, { ignoreInitial: false }, function () {
        gulp.src(jsEntry)
            .pipe(gulp.dest('../packages'));
    });
}

function tsc() {
    return watch(entry, { ignoreInitial: false }, function () {
        gulp.src([ tsEntry, ...types ])
            .pipe(ts(tsconfig))
            .pipe(gulp.dest('../packages'));
    });
}

exports.default = gulp.series(cleanTask, gulp.parallel(copyJs, tsc));