const serve = require('rollup-plugin-serve');
const livereload = require('rollup-plugin-livereload');
const config = require('./rollup.config');
const { dev } = require('../config/base');
const { resolveFile } = require('./utils');

module.exports = {
    ...config,
    output: {
        path: resolveFile('dist/'),
        file: resolveFile('dist/hx-analytics.js'),
        format: 'iife',
        name: 'ha',
        sourcemap: true
    },
    plugins: [
        ...config.plugins,
        ...[
            serve({
                port: dev.port,
                contentBase: [ resolveFile('dist') ]
            }),
            livereload(resolveFile('dist'))
        ]
    ]
};
