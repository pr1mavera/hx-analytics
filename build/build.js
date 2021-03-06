const base = require('../config/base');
const ora = require('ora');
const spinner = ora(`building hx-analytics jssdk v${base.jssdk_VERSION}\n`).start();

const _mode = process.env.NODE_ENV || 'development';
const isProd = _mode == 'production' ? true : false;
const configs = require(`./rollup.${_mode}.js`);
const fs = require('fs');
const terser = require('terser');
const zlib = require('zlib');
const rollup = require('rollup');
const { relative } = require('path');
const { resolveFile, deleteall, blue, getSize } = require('./utils');

const TARGET = process.env.TARGET;
console.log('file: ', resolveFile(`dist/${TARGET}/hx-analytics.min.js`))

const distPath = resolveFile(`dist/${process.env.TARGET}`);
if (!fs.existsSync(distPath)) {
    // deleteall(distPath);
    fs.mkdirSync(distPath, {recursive: true});
}
// fs.mkdirSync(distPath, {recursive: true});

const banner =
    '/*!\n' +
    ` * hx-analytics jssdk v${base.jssdk_VERSION}\n` +
    ` * (c) 2018-${new Date().getFullYear()}\n` +
    ' * author: pr1mavera\n' +
    ' * email: pr1mavera.w4ng@gmail.com\n' +
    ' */';

/**
 * 编译开始
 */
build(configs);

function build(builds) {
    let built = 0
    const total = builds.length
    const next = () => {
        buildEntry(builds[built]).then(() => {
            built++;
            if (built < total) {
                next();
            } else {
                spinner.stop();
            }
        }).catch(err => {
            console.log(err);
            process.exit(1);
        });
    }
    next();
}

async function buildEntry(config) {
    const output = config.output;
    const bundle = await rollup.rollup(config)
    const { output: chunks } = await bundle.generate(output);

    for (const chunk of chunks) {
        let { code } = chunk;
        if (isProd) {
        code = (banner ? banner + '\n' : '') + terser.minify(code, {
            output: {
                ascii_only: true
            },
            compress: {
                pure_funcs: ['makeMap']
            }
        }).code;
        }
        await write(output.file, code, true);
        // await write(output.path + fileName, code, isProd);
    }
}

function write(dest, code, zip) {
    return new Promise((resolve, reject) => {
        function report(extra) {
            spinner.succeed(blue('🍺 ' + relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''));
            resolve();
        }
        fs.writeFile(dest, code, err => {
            if (err) return reject(err);
            if (zip) {
                zlib.gzip(code, (err, zipped) => {
                    if (err) return reject(err);
                    report(' (gzipped: ' + getSize(zipped) + ')');
                });
            } else {
                report();
            }
        })
    })
}