const ts = require('rollup-plugin-typescript2');
const babel = require('rollup-plugin-babel');
const json = require('rollup-plugin-json');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const alias = require('rollup-plugin-alias');
const { eslint } = require('rollup-plugin-eslint');
const { resolveFile } = require('./utils');

const tsconfig = {
    compilerOptions: {
        target: 'es5',
        allowJs: true,
        types: ['reflect-metadata', 'rx'],
        module: 'ES6',
        moduleResolution: 'node',
        noImplicitAny: true,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        sourceMap: true
    }
};

module.exports = {
    input: resolveFile(`src/entry-${process.env.TARGET}.ts`),
    // input: resolveFile('src/app.ts'),
    onwarn: function(warning) {
        // Skip certain warnings
    
        // should intercept ... but doesn't in some rollup versions
        if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }
    
        // console.warn everything else
        console.warn( warning.message );
    },
    plugins: [
        ts({
            tsconfigDefaults: tsconfig,
            include: [ resolveFile('src/**/*') ],
            // exclude: [ resolveFile('src/**/*.js') ]
        }),
        resolve({
            jsnext: true, // 该属性是指定将Node包转换为ES2015模块
            // main 和 browser 属性将使插件决定将那些文件应用到bundle中
            main: true, // Default: true
            browser: true // Default: false
        }),
        commonjs({extensions: ['.js', '.ts']}),
        json(),
        babel({
            babelrc: false,
            exclude: 'node_modules/**',
            runtimeHelpers: true,
            presets: [
                ['@babel/preset-env', { modules: false }]
            ],
            plugins: [
                ['@babel/plugin-transform-classes', {
                    'loose': true
                }]
            ]
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(
                process.env.NODE_ENV || 'development',
            ),
        }),
        eslint({
            include: [ 'src/**' ],
            exclude: [ 'node_modules/**' ],
        }),
        alias({
            resolve: [ '.jsx', '.js', '.ts' ],
            '@': resolveFile('packages')
        })
    ],
};
