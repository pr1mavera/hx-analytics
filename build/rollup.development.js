const serve = require('rollup-plugin-serve');
const livereload = require('rollup-plugin-livereload');
const config = require('./rollup.config');
const { dev } = require('../config/base');
const { resolveFile } = require('./utils');

const TARGET = process.env.TARGET;
console.log('TARGET: ', TARGET)

module.exports = {
    ...config,
    output: {
        file: resolveFile(`dist/${TARGET}/hx-analytics.js`),
        format: 'iife',
        name: 'ha',
        sourcemap: true
    },
    plugins: [
        ...config.plugins,
        ...[
            serve({
                host: dev.host,
                port: dev.port,
                contentBase: [ resolveFile('dist') ]
            }),
            livereload(resolveFile('dist'))
        ]
    ]
};
