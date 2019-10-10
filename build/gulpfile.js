const gulp = require('gulp');
const clean = require('gulp-clean');
// const rollup = require('gulp-better-rollup');
const watch = require('gulp-watch');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

const entry = '../src/**/*';
const jsEntry = '../src/**/*.js';
const tsEntry = '../src/**/*.ts';
const buildEntry = '../packages/**';

function cleanTask() {
    return gulp.src(buildEntry, {read: false})
                .pipe(clean({force: true}));
}

function copyJs() {
    return watch(entry, { ignoreInitial: false }, function () {
        gulp.src(jsEntry)
            .pipe(gulp.dest('../packages'));
    });
}

function tsc() {
    return watch(entry, { ignoreInitial: false }, function () {
        gulp.src(tsEntry)
            .pipe(tsProject())
            .js.pipe(gulp.dest('../packages'));
    });
}

// function build() {

//     return watch(buildEntry, { ignoreInitial: false }, function () {

//         gulp.src(buildEntry)
//             .pipe(rollup({
//                 rollup: require('rollup'),
//                 ...require('./rollup.development')
//             }))
//             .pipe(gulp.dest('../dist'));
//     });
// }

exports.default = gulp.series(cleanTask, gulp.parallel(copyJs, tsc));
// exports.default = gulp.series(cleanTask, gulp.parallel(copyJs, tsc, build));