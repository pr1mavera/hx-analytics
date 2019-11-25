module.exports = {
    compileOnSave: true,
    compilerOptions: {
        target: 'es5',
        allowJs: true,
        // lib: [ DOM, ES6, DOM.Iterable ],
        types: [ 'node' ],
        module: 'ES6',
        moduleResolution: 'node',
        noImplicitAny: true,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        sourceMap: true
    },
    exclude: [ 'node_modules', 'dist' ]
};
