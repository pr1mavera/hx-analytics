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

fs.existsSync(resolveFile('dist')) && deleteall(resolveFile('dist'))
fs.mkdirSync(resolveFile('dist'));

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
        let { code, fileName } = chunk;
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
        await write(output.path + fileName, code, isProd);
    }
}

function write(file, code, isProd) {
    return new Promise((resolve, reject) => {
        function report(extra) {
            isProd
                ? spinner.succeed(blue('🍺 ' + relative(process.cwd(), file)) + ' ' + getSize(code) + (extra || ''))
                : spinner.succeed('🍺 ' + 'You sdk is deploy in http://localhost:3001/hx-analytics.js');
            
            resolve();
        }
        fs.writeFile(file, code, err => {
            if (err) return reject(err);
            if (isProd) {
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