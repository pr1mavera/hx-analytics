const gulp = require('gulp')
const typedoc = require('gulp-typedoc')
const browserSync = require('browser-sync').create()

const runTypeDoc = () => gulp
    .src(['src/utils/utils.ts'])
    .pipe(typedoc({
        name: 'hx-analytics-utils',
        out: './docs',
        module: 'esm',
        target: 'es2015',
        includeDeclarations: true,
        // 这个文件里都是 export * from '...' 就没必要导出文档了
        // exclude: 'src/index.ts',
        tsconfig: 'tsconfig.json',
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

gulp.task('default', gulp.series(runTypeDoc, runBrowserSync, watch))