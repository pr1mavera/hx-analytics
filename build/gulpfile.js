const gulp = require('gulp');
const changed = require('gulp-changed');
const print = require('gulp-print').default;
const clean = require('gulp-clean');
const watch = require('gulp-watch');
const glob = require('glob');
const ts = require('gulp-typescript');

const entry = '../src/**/*';
const jsEntry = '../src/**/*.js';
const tsEntry = '../src/**/*.ts';
const buildEntry = '../packages/**/*';
const types = [];

const files = glob.sync('../node_modules/@types/**/index.d.ts');
for (const item of files) {
    // 获取所有 rx 的类型声明文件
    /.+\/[rx].*/g.test(item) && types.push(item);
}

// const types = [];

const tsconfig = {
    target: "es6",
    allowJs: true,
    module: "ES6",
    moduleResolution: "node",
    noImplicitAny: true,
    experimentalDecorators: true
    // noExternalResolve: true
}

function cleanTask() {
    return gulp.src(buildEntry, { read: false })
                .pipe(print(filepath => `clear: ${filepath}`))
                .pipe(clean({ force: true }));
}

function copyJs() {
    return watch(jsEntry, { ignoreInitial: false }, function () {
        gulp.src(jsEntry)
            .pipe(changed(jsEntry))
            .pipe(print(filepath => `copyJs: ${filepath}`))
            .pipe(gulp.dest('../packages'));
    });
}

function tsc() {
    return watch(tsEntry, { ignoreInitial: false }, function () {
        gulp.src([ tsEntry, ...types ])
        gulp.src(tsEntry)
            .pipe(changed(jsEntry))
            .pipe(print(filepath => `tsc: ${filepath}`))
            .pipe(ts(tsconfig))
            .pipe(gulp.dest('../packages'));
    });
}

exports.default = gulp.series(cleanTask, gulp.parallel(copyJs, tsc));
// exports.default = gulp.series(cleanTask, copyJs);