module.exports = {
    "compilerOptions": {
        "noImplicitAny": true,
        // "strictNullChecks": true,
        "target": "es5",
        "allowJs": true,
        // lib: [ "DOM", "ES6", "DOM.Iterable" ],
        // "types": [ "node" ],
        "module": "ES6",
        "moduleResolution": "node",
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
        "sourceMap": true,
        "typeRoots" : [ "src/typings" ]
    },
    "exclude": [ "node_modules", "dist" ],
};