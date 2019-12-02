const gulp = require('gulp')
const typedoc = require('gulp-typedoc')
const browserSync = require('browser-sync').create()

const runTypeDoc = () => gulp
    .src(['src/utils/utils.ts', 'src/typings/index.d.ts'])
    .pipe(typedoc({
        name: 'hx-analytics-utils',
        out: './docs',
        module: 'ES6',
        target: 'es6',
        includeDeclarations: true,
        tsconfig: 'tsconfig.json'
    }))

const reload = (done) => {
    browserSync.reload()
    done()
}

const runBrowserSync = (done) => {
    browserSync.init({
        server: {
            baseDir: './docs',
        },
    })
    done()
}

const watch = () => gulp.watch(
    ['README.md', 'src/utils/utils.ts'],
    gulp.series(runTypeDoc, reload)
)

// gulp.task('default', gulp.series(runTypeDoc, runBrowserSync))
gulp.task('default', runTypeDoc)