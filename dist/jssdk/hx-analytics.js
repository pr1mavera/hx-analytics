
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(document);
var ha = (function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	/*! *****************************************************************************
	Copyright (C) Microsoft. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
	var Reflect$1;
	(function (Reflect) {
	    // Metadata Proposal
	    // https://rbuckton.github.io/reflect-metadata/
	    (function (factory) {
	        var root = typeof commonjsGlobal === "object" ? commonjsGlobal :
	            typeof self === "object" ? self :
	                typeof this === "object" ? this :
	                    Function("return this;")();
	        var exporter = makeExporter(Reflect);
	        if (typeof root.Reflect === "undefined") {
	            root.Reflect = Reflect;
	        }
	        else {
	            exporter = makeExporter(root.Reflect, exporter);
	        }
	        factory(exporter);
	        function makeExporter(target, previous) {
	            return function (key, value) {
	                if (typeof target[key] !== "function") {
	                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
	                }
	                if (previous)
	                    previous(key, value);
	            };
	        }
	    })(function (exporter) {
	        var hasOwn = Object.prototype.hasOwnProperty;
	        // feature test for Symbol support
	        var supportsSymbol = typeof Symbol === "function";
	        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
	        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
	        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
	        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
	        var downLevel = !supportsCreate && !supportsProto;
	        var HashMap = {
	            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
	            create: supportsCreate
	                ? function () { return MakeDictionary(Object.create(null)); }
	                : supportsProto
	                    ? function () { return MakeDictionary({ __proto__: null }); }
	                    : function () { return MakeDictionary({}); },
	            has: downLevel
	                ? function (map, key) { return hasOwn.call(map, key); }
	                : function (map, key) { return key in map; },
	            get: downLevel
	                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
	                : function (map, key) { return map[key]; },
	        };
	        // Load global or shim versions of Map, Set, and WeakMap
	        var functionPrototype = Object.getPrototypeOf(Function);
	        var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
	        var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
	        var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
	        var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
	        // [[Metadata]] internal slot
	        // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
	        var Metadata = new _WeakMap();
	        /**
	         * Applies a set of decorators to a property of a target object.
	         * @param decorators An array of decorators.
	         * @param target The target object.
	         * @param propertyKey (Optional) The property key to decorate.
	         * @param attributes (Optional) The property descriptor for the target key.
	         * @remarks Decorators are applied in reverse order.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     Example = Reflect.decorate(decoratorsArray, Example);
	         *
	         *     // property (on constructor)
	         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     Object.defineProperty(Example, "staticMethod",
	         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
	         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
	         *
	         *     // method (on prototype)
	         *     Object.defineProperty(Example.prototype, "method",
	         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
	         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
	         *
	         */
	        function decorate(decorators, target, propertyKey, attributes) {
	            if (!IsUndefined(propertyKey)) {
	                if (!IsArray(decorators))
	                    throw new TypeError();
	                if (!IsObject(target))
	                    throw new TypeError();
	                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
	                    throw new TypeError();
	                if (IsNull(attributes))
	                    attributes = undefined;
	                propertyKey = ToPropertyKey(propertyKey);
	                return DecorateProperty(decorators, target, propertyKey, attributes);
	            }
	            else {
	                if (!IsArray(decorators))
	                    throw new TypeError();
	                if (!IsConstructor(target))
	                    throw new TypeError();
	                return DecorateConstructor(decorators, target);
	            }
	        }
	        exporter("decorate", decorate);
	        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
	        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
	        /**
	         * A default metadata decorator factory that can be used on a class, class member, or parameter.
	         * @param metadataKey The key for the metadata entry.
	         * @param metadataValue The value for the metadata entry.
	         * @returns A decorator function.
	         * @remarks
	         * If `metadataKey` is already defined for the target and target key, the
	         * metadataValue for that key will be overwritten.
	         * @example
	         *
	         *     // constructor
	         *     @Reflect.metadata(key, value)
	         *     class Example {
	         *     }
	         *
	         *     // property (on constructor, TypeScript only)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         static staticProperty;
	         *     }
	         *
	         *     // property (on prototype, TypeScript only)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         property;
	         *     }
	         *
	         *     // method (on constructor)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         static staticMethod() { }
	         *     }
	         *
	         *     // method (on prototype)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         method() { }
	         *     }
	         *
	         */
	        function metadata(metadataKey, metadataValue) {
	            function decorator(target, propertyKey) {
	                if (!IsObject(target))
	                    throw new TypeError();
	                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
	                    throw new TypeError();
	                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
	            }
	            return decorator;
	        }
	        exporter("metadata", metadata);
	        /**
	         * Define a unique metadata entry on the target.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param metadataValue A value that contains attached metadata.
	         * @param target The target object on which to define metadata.
	         * @param propertyKey (Optional) The property key for the target.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     Reflect.defineMetadata("custom:annotation", options, Example);
	         *
	         *     // property (on constructor)
	         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
	         *
	         *     // decorator factory as metadata-producing annotation.
	         *     function MyAnnotation(options): Decorator {
	         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
	         *     }
	         *
	         */
	        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
	        }
	        exporter("defineMetadata", defineMetadata);
	        /**
	         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.hasMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function hasMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("hasMetadata", hasMetadata);
	        /**
	         * Gets a value indicating whether the target object has the provided metadata key defined.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function hasOwnMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("hasOwnMetadata", hasOwnMetadata);
	        /**
	         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function getMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("getMetadata", getMetadata);
	        /**
	         * Gets the metadata value for the provided metadata key on the target object.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function getOwnMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("getOwnMetadata", getOwnMetadata);
	        /**
	         * Gets the metadata keys defined on the target object or its prototype chain.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns An array of unique metadata keys.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getMetadataKeys(Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
	         *
	         */
	        function getMetadataKeys(target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryMetadataKeys(target, propertyKey);
	        }
	        exporter("getMetadataKeys", getMetadataKeys);
	        /**
	         * Gets the unique metadata keys defined on the target object.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns An array of unique metadata keys.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getOwnMetadataKeys(Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
	         *
	         */
	        function getOwnMetadataKeys(target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryOwnMetadataKeys(target, propertyKey);
	        }
	        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
	        /**
	         * Deletes the metadata entry from the target object with the provided key.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.deleteMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function deleteMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
	            if (IsUndefined(metadataMap))
	                return false;
	            if (!metadataMap.delete(metadataKey))
	                return false;
	            if (metadataMap.size > 0)
	                return true;
	            var targetMetadata = Metadata.get(target);
	            targetMetadata.delete(propertyKey);
	            if (targetMetadata.size > 0)
	                return true;
	            Metadata.delete(target);
	            return true;
	        }
	        exporter("deleteMetadata", deleteMetadata);
	        function DecorateConstructor(decorators, target) {
	            for (var i = decorators.length - 1; i >= 0; --i) {
	                var decorator = decorators[i];
	                var decorated = decorator(target);
	                if (!IsUndefined(decorated) && !IsNull(decorated)) {
	                    if (!IsConstructor(decorated))
	                        throw new TypeError();
	                    target = decorated;
	                }
	            }
	            return target;
	        }
	        function DecorateProperty(decorators, target, propertyKey, descriptor) {
	            for (var i = decorators.length - 1; i >= 0; --i) {
	                var decorator = decorators[i];
	                var decorated = decorator(target, propertyKey, descriptor);
	                if (!IsUndefined(decorated) && !IsNull(decorated)) {
	                    if (!IsObject(decorated))
	                        throw new TypeError();
	                    descriptor = decorated;
	                }
	            }
	            return descriptor;
	        }
	        function GetOrCreateMetadataMap(O, P, Create) {
	            var targetMetadata = Metadata.get(O);
	            if (IsUndefined(targetMetadata)) {
	                if (!Create)
	                    return undefined;
	                targetMetadata = new _Map();
	                Metadata.set(O, targetMetadata);
	            }
	            var metadataMap = targetMetadata.get(P);
	            if (IsUndefined(metadataMap)) {
	                if (!Create)
	                    return undefined;
	                metadataMap = new _Map();
	                targetMetadata.set(P, metadataMap);
	            }
	            return metadataMap;
	        }
	        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
	        function OrdinaryHasMetadata(MetadataKey, O, P) {
	            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
	            if (hasOwn)
	                return true;
	            var parent = OrdinaryGetPrototypeOf(O);
	            if (!IsNull(parent))
	                return OrdinaryHasMetadata(MetadataKey, parent, P);
	            return false;
	        }
	        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
	        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
	            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
	            if (IsUndefined(metadataMap))
	                return false;
	            return ToBoolean(metadataMap.has(MetadataKey));
	        }
	        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
	        function OrdinaryGetMetadata(MetadataKey, O, P) {
	            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
	            if (hasOwn)
	                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
	            var parent = OrdinaryGetPrototypeOf(O);
	            if (!IsNull(parent))
	                return OrdinaryGetMetadata(MetadataKey, parent, P);
	            return undefined;
	        }
	        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
	        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
	            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
	            if (IsUndefined(metadataMap))
	                return undefined;
	            return metadataMap.get(MetadataKey);
	        }
	        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
	        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
	            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
	            metadataMap.set(MetadataKey, MetadataValue);
	        }
	        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
	        function OrdinaryMetadataKeys(O, P) {
	            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
	            var parent = OrdinaryGetPrototypeOf(O);
	            if (parent === null)
	                return ownKeys;
	            var parentKeys = OrdinaryMetadataKeys(parent, P);
	            if (parentKeys.length <= 0)
	                return ownKeys;
	            if (ownKeys.length <= 0)
	                return parentKeys;
	            var set = new _Set();
	            var keys = [];
	            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
	                var key = ownKeys_1[_i];
	                var hasKey = set.has(key);
	                if (!hasKey) {
	                    set.add(key);
	                    keys.push(key);
	                }
	            }
	            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
	                var key = parentKeys_1[_a];
	                var hasKey = set.has(key);
	                if (!hasKey) {
	                    set.add(key);
	                    keys.push(key);
	                }
	            }
	            return keys;
	        }
	        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
	        function OrdinaryOwnMetadataKeys(O, P) {
	            var keys = [];
	            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
	            if (IsUndefined(metadataMap))
	                return keys;
	            var keysObj = metadataMap.keys();
	            var iterator = GetIterator(keysObj);
	            var k = 0;
	            while (true) {
	                var next = IteratorStep(iterator);
	                if (!next) {
	                    keys.length = k;
	                    return keys;
	                }
	                var nextValue = IteratorValue(next);
	                try {
	                    keys[k] = nextValue;
	                }
	                catch (e) {
	                    try {
	                        IteratorClose(iterator);
	                    }
	                    finally {
	                        throw e;
	                    }
	                }
	                k++;
	            }
	        }
	        // 6 ECMAScript Data Typ0es and Values
	        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
	        function Type(x) {
	            if (x === null)
	                return 1 /* Null */;
	            switch (typeof x) {
	                case "undefined": return 0 /* Undefined */;
	                case "boolean": return 2 /* Boolean */;
	                case "string": return 3 /* String */;
	                case "symbol": return 4 /* Symbol */;
	                case "number": return 5 /* Number */;
	                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
	                default: return 6 /* Object */;
	            }
	        }
	        // 6.1.1 The Undefined Type
	        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
	        function IsUndefined(x) {
	            return x === undefined;
	        }
	        // 6.1.2 The Null Type
	        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
	        function IsNull(x) {
	            return x === null;
	        }
	        // 6.1.5 The Symbol Type
	        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
	        function IsSymbol(x) {
	            return typeof x === "symbol";
	        }
	        // 6.1.7 The Object Type
	        // https://tc39.github.io/ecma262/#sec-object-type
	        function IsObject(x) {
	            return typeof x === "object" ? x !== null : typeof x === "function";
	        }
	        // 7.1 Type Conversion
	        // https://tc39.github.io/ecma262/#sec-type-conversion
	        // 7.1.1 ToPrimitive(input [, PreferredType])
	        // https://tc39.github.io/ecma262/#sec-toprimitive
	        function ToPrimitive(input, PreferredType) {
	            switch (Type(input)) {
	                case 0 /* Undefined */: return input;
	                case 1 /* Null */: return input;
	                case 2 /* Boolean */: return input;
	                case 3 /* String */: return input;
	                case 4 /* Symbol */: return input;
	                case 5 /* Number */: return input;
	            }
	            var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
	            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
	            if (exoticToPrim !== undefined) {
	                var result = exoticToPrim.call(input, hint);
	                if (IsObject(result))
	                    throw new TypeError();
	                return result;
	            }
	            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
	        }
	        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
	        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
	        function OrdinaryToPrimitive(O, hint) {
	            if (hint === "string") {
	                var toString_1 = O.toString;
	                if (IsCallable(toString_1)) {
	                    var result = toString_1.call(O);
	                    if (!IsObject(result))
	                        return result;
	                }
	                var valueOf = O.valueOf;
	                if (IsCallable(valueOf)) {
	                    var result = valueOf.call(O);
	                    if (!IsObject(result))
	                        return result;
	                }
	            }
	            else {
	                var valueOf = O.valueOf;
	                if (IsCallable(valueOf)) {
	                    var result = valueOf.call(O);
	                    if (!IsObject(result))
	                        return result;
	                }
	                var toString_2 = O.toString;
	                if (IsCallable(toString_2)) {
	                    var result = toString_2.call(O);
	                    if (!IsObject(result))
	                        return result;
	                }
	            }
	            throw new TypeError();
	        }
	        // 7.1.2 ToBoolean(argument)
	        // https://tc39.github.io/ecma262/2016/#sec-toboolean
	        function ToBoolean(argument) {
	            return !!argument;
	        }
	        // 7.1.12 ToString(argument)
	        // https://tc39.github.io/ecma262/#sec-tostring
	        function ToString(argument) {
	            return "" + argument;
	        }
	        // 7.1.14 ToPropertyKey(argument)
	        // https://tc39.github.io/ecma262/#sec-topropertykey
	        function ToPropertyKey(argument) {
	            var key = ToPrimitive(argument, 3 /* String */);
	            if (IsSymbol(key))
	                return key;
	            return ToString(key);
	        }
	        // 7.2 Testing and Comparison Operations
	        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
	        // 7.2.2 IsArray(argument)
	        // https://tc39.github.io/ecma262/#sec-isarray
	        function IsArray(argument) {
	            return Array.isArray
	                ? Array.isArray(argument)
	                : argument instanceof Object
	                    ? argument instanceof Array
	                    : Object.prototype.toString.call(argument) === "[object Array]";
	        }
	        // 7.2.3 IsCallable(argument)
	        // https://tc39.github.io/ecma262/#sec-iscallable
	        function IsCallable(argument) {
	            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
	            return typeof argument === "function";
	        }
	        // 7.2.4 IsConstructor(argument)
	        // https://tc39.github.io/ecma262/#sec-isconstructor
	        function IsConstructor(argument) {
	            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
	            return typeof argument === "function";
	        }
	        // 7.2.7 IsPropertyKey(argument)
	        // https://tc39.github.io/ecma262/#sec-ispropertykey
	        function IsPropertyKey(argument) {
	            switch (Type(argument)) {
	                case 3 /* String */: return true;
	                case 4 /* Symbol */: return true;
	                default: return false;
	            }
	        }
	        // 7.3 Operations on Objects
	        // https://tc39.github.io/ecma262/#sec-operations-on-objects
	        // 7.3.9 GetMethod(V, P)
	        // https://tc39.github.io/ecma262/#sec-getmethod
	        function GetMethod(V, P) {
	            var func = V[P];
	            if (func === undefined || func === null)
	                return undefined;
	            if (!IsCallable(func))
	                throw new TypeError();
	            return func;
	        }
	        // 7.4 Operations on Iterator Objects
	        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
	        function GetIterator(obj) {
	            var method = GetMethod(obj, iteratorSymbol);
	            if (!IsCallable(method))
	                throw new TypeError(); // from Call
	            var iterator = method.call(obj);
	            if (!IsObject(iterator))
	                throw new TypeError();
	            return iterator;
	        }
	        // 7.4.4 IteratorValue(iterResult)
	        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
	        function IteratorValue(iterResult) {
	            return iterResult.value;
	        }
	        // 7.4.5 IteratorStep(iterator)
	        // https://tc39.github.io/ecma262/#sec-iteratorstep
	        function IteratorStep(iterator) {
	            var result = iterator.next();
	            return result.done ? false : result;
	        }
	        // 7.4.6 IteratorClose(iterator, completion)
	        // https://tc39.github.io/ecma262/#sec-iteratorclose
	        function IteratorClose(iterator) {
	            var f = iterator["return"];
	            if (f)
	                f.call(iterator);
	        }
	        // 9.1 Ordinary Object Internal Methods and Internal Slots
	        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
	        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
	        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
	        function OrdinaryGetPrototypeOf(O) {
	            var proto = Object.getPrototypeOf(O);
	            if (typeof O !== "function" || O === functionPrototype)
	                return proto;
	            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
	            // Try to determine the superclass constructor. Compatible implementations
	            // must either set __proto__ on a subclass constructor to the superclass constructor,
	            // or ensure each class has a valid `constructor` property on its prototype that
	            // points back to the constructor.
	            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
	            // This is the case when in ES6 or when using __proto__ in a compatible browser.
	            if (proto !== functionPrototype)
	                return proto;
	            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
	            var prototype = O.prototype;
	            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
	            if (prototypeProto == null || prototypeProto === Object.prototype)
	                return proto;
	            // If the constructor was not a function, then we cannot determine the heritage.
	            var constructor = prototypeProto.constructor;
	            if (typeof constructor !== "function")
	                return proto;
	            // If we have some kind of self-reference, then we cannot determine the heritage.
	            if (constructor === O)
	                return proto;
	            // we have a pretty good guess at the heritage.
	            return constructor;
	        }
	        // naive Map shim
	        function CreateMapPolyfill() {
	            var cacheSentinel = {};
	            var arraySentinel = [];
	            var MapIterator = /** @class */ (function () {
	                function MapIterator(keys, values, selector) {
	                    this._index = 0;
	                    this._keys = keys;
	                    this._values = values;
	                    this._selector = selector;
	                }
	                MapIterator.prototype["@@iterator"] = function () { return this; };
	                MapIterator.prototype[iteratorSymbol] = function () { return this; };
	                MapIterator.prototype.next = function () {
	                    var index = this._index;
	                    if (index >= 0 && index < this._keys.length) {
	                        var result = this._selector(this._keys[index], this._values[index]);
	                        if (index + 1 >= this._keys.length) {
	                            this._index = -1;
	                            this._keys = arraySentinel;
	                            this._values = arraySentinel;
	                        }
	                        else {
	                            this._index++;
	                        }
	                        return { value: result, done: false };
	                    }
	                    return { value: undefined, done: true };
	                };
	                MapIterator.prototype.throw = function (error) {
	                    if (this._index >= 0) {
	                        this._index = -1;
	                        this._keys = arraySentinel;
	                        this._values = arraySentinel;
	                    }
	                    throw error;
	                };
	                MapIterator.prototype.return = function (value) {
	                    if (this._index >= 0) {
	                        this._index = -1;
	                        this._keys = arraySentinel;
	                        this._values = arraySentinel;
	                    }
	                    return { value: value, done: true };
	                };
	                return MapIterator;
	            }());
	            return /** @class */ (function () {
	                function Map() {
	                    this._keys = [];
	                    this._values = [];
	                    this._cacheKey = cacheSentinel;
	                    this._cacheIndex = -2;
	                }
	                Object.defineProperty(Map.prototype, "size", {
	                    get: function () { return this._keys.length; },
	                    enumerable: true,
	                    configurable: true
	                });
	                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
	                Map.prototype.get = function (key) {
	                    var index = this._find(key, /*insert*/ false);
	                    return index >= 0 ? this._values[index] : undefined;
	                };
	                Map.prototype.set = function (key, value) {
	                    var index = this._find(key, /*insert*/ true);
	                    this._values[index] = value;
	                    return this;
	                };
	                Map.prototype.delete = function (key) {
	                    var index = this._find(key, /*insert*/ false);
	                    if (index >= 0) {
	                        var size = this._keys.length;
	                        for (var i = index + 1; i < size; i++) {
	                            this._keys[i - 1] = this._keys[i];
	                            this._values[i - 1] = this._values[i];
	                        }
	                        this._keys.length--;
	                        this._values.length--;
	                        if (key === this._cacheKey) {
	                            this._cacheKey = cacheSentinel;
	                            this._cacheIndex = -2;
	                        }
	                        return true;
	                    }
	                    return false;
	                };
	                Map.prototype.clear = function () {
	                    this._keys.length = 0;
	                    this._values.length = 0;
	                    this._cacheKey = cacheSentinel;
	                    this._cacheIndex = -2;
	                };
	                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
	                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
	                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
	                Map.prototype["@@iterator"] = function () { return this.entries(); };
	                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
	                Map.prototype._find = function (key, insert) {
	                    if (this._cacheKey !== key) {
	                        this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
	                    }
	                    if (this._cacheIndex < 0 && insert) {
	                        this._cacheIndex = this._keys.length;
	                        this._keys.push(key);
	                        this._values.push(undefined);
	                    }
	                    return this._cacheIndex;
	                };
	                return Map;
	            }());
	            function getKey(key, _) {
	                return key;
	            }
	            function getValue(_, value) {
	                return value;
	            }
	            function getEntry(key, value) {
	                return [key, value];
	            }
	        }
	        // naive Set shim
	        function CreateSetPolyfill() {
	            return /** @class */ (function () {
	                function Set() {
	                    this._map = new _Map();
	                }
	                Object.defineProperty(Set.prototype, "size", {
	                    get: function () { return this._map.size; },
	                    enumerable: true,
	                    configurable: true
	                });
	                Set.prototype.has = function (value) { return this._map.has(value); };
	                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
	                Set.prototype.delete = function (value) { return this._map.delete(value); };
	                Set.prototype.clear = function () { this._map.clear(); };
	                Set.prototype.keys = function () { return this._map.keys(); };
	                Set.prototype.values = function () { return this._map.values(); };
	                Set.prototype.entries = function () { return this._map.entries(); };
	                Set.prototype["@@iterator"] = function () { return this.keys(); };
	                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
	                return Set;
	            }());
	        }
	        // naive WeakMap shim
	        function CreateWeakMapPolyfill() {
	            var UUID_SIZE = 16;
	            var keys = HashMap.create();
	            var rootKey = CreateUniqueKey();
	            return /** @class */ (function () {
	                function WeakMap() {
	                    this._key = CreateUniqueKey();
	                }
	                WeakMap.prototype.has = function (target) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
	                    return table !== undefined ? HashMap.has(table, this._key) : false;
	                };
	                WeakMap.prototype.get = function (target) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
	                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
	                };
	                WeakMap.prototype.set = function (target, value) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
	                    table[this._key] = value;
	                    return this;
	                };
	                WeakMap.prototype.delete = function (target) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
	                    return table !== undefined ? delete table[this._key] : false;
	                };
	                WeakMap.prototype.clear = function () {
	                    // NOTE: not a real clear, just makes the previous data unreachable
	                    this._key = CreateUniqueKey();
	                };
	                return WeakMap;
	            }());
	            function CreateUniqueKey() {
	                var key;
	                do
	                    key = "@@WeakMap@@" + CreateUUID();
	                while (HashMap.has(keys, key));
	                keys[key] = true;
	                return key;
	            }
	            function GetOrCreateWeakMapTable(target, create) {
	                if (!hasOwn.call(target, rootKey)) {
	                    if (!create)
	                        return undefined;
	                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
	                }
	                return target[rootKey];
	            }
	            function FillRandomBytes(buffer, size) {
	                for (var i = 0; i < size; ++i)
	                    buffer[i] = Math.random() * 0xff | 0;
	                return buffer;
	            }
	            function GenRandomBytes(size) {
	                if (typeof Uint8Array === "function") {
	                    if (typeof crypto !== "undefined")
	                        return crypto.getRandomValues(new Uint8Array(size));
	                    if (typeof msCrypto !== "undefined")
	                        return msCrypto.getRandomValues(new Uint8Array(size));
	                    return FillRandomBytes(new Uint8Array(size), size);
	                }
	                return FillRandomBytes(new Array(size), size);
	            }
	            function CreateUUID() {
	                var data = GenRandomBytes(UUID_SIZE);
	                // mark as random - RFC 4122 § 4.4
	                data[6] = data[6] & 0x4f | 0x40;
	                data[8] = data[8] & 0xbf | 0x80;
	                var result = "";
	                for (var offset = 0; offset < UUID_SIZE; ++offset) {
	                    var byte = data[offset];
	                    if (offset === 4 || offset === 6 || offset === 8)
	                        result += "-";
	                    if (byte < 16)
	                        result += "0";
	                    result += byte.toString(16).toLowerCase();
	                }
	                return result;
	            }
	        }
	        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
	        function MakeDictionary(obj) {
	            obj.__ = undefined;
	            delete obj.__;
	            return obj;
	        }
	    });
	})(Reflect$1 || (Reflect$1 = {}));

	var NAMED_TAG = "named";
	var NAME_TAG = "name";
	var UNMANAGED_TAG = "unmanaged";
	var OPTIONAL_TAG = "optional";
	var INJECT_TAG = "inject";
	var MULTI_INJECT_TAG = "multi_inject";
	var TAGGED = "inversify:tagged";
	var TAGGED_PROP = "inversify:tagged_props";
	var PARAM_TYPES = "inversify:paramtypes";
	var DESIGN_PARAM_TYPES = "design:paramtypes";
	var POST_CONSTRUCT = "post_construct";

	var BindingScopeEnum = {
	    Request: "Request",
	    Singleton: "Singleton",
	    Transient: "Transient"
	};
	var BindingTypeEnum = {
	    ConstantValue: "ConstantValue",
	    Constructor: "Constructor",
	    DynamicValue: "DynamicValue",
	    Factory: "Factory",
	    Function: "Function",
	    Instance: "Instance",
	    Invalid: "Invalid",
	    Provider: "Provider"
	};
	var TargetTypeEnum = {
	    ClassProperty: "ClassProperty",
	    ConstructorArgument: "ConstructorArgument",
	    Variable: "Variable"
	};

	var idCounter = 0;
	function id() {
	    return idCounter++;
	}

	var Binding = (function () {
	    function Binding(serviceIdentifier, scope) {
	        this.id = id();
	        this.activated = false;
	        this.serviceIdentifier = serviceIdentifier;
	        this.scope = scope;
	        this.type = BindingTypeEnum.Invalid;
	        this.constraint = function (request) { return true; };
	        this.implementationType = null;
	        this.cache = null;
	        this.factory = null;
	        this.provider = null;
	        this.onActivation = null;
	        this.dynamicValue = null;
	    }
	    Binding.prototype.clone = function () {
	        var clone = new Binding(this.serviceIdentifier, this.scope);
	        clone.activated = false;
	        clone.implementationType = this.implementationType;
	        clone.dynamicValue = this.dynamicValue;
	        clone.scope = this.scope;
	        clone.type = this.type;
	        clone.factory = this.factory;
	        clone.provider = this.provider;
	        clone.constraint = this.constraint;
	        clone.onActivation = this.onActivation;
	        clone.cache = this.cache;
	        return clone;
	    };
	    return Binding;
	}());

	var DUPLICATED_INJECTABLE_DECORATOR = "Cannot apply @injectable decorator multiple times.";
	var DUPLICATED_METADATA = "Metadata key was used more than once in a parameter:";
	var NULL_ARGUMENT = "NULL argument";
	var KEY_NOT_FOUND = "Key Not Found";
	var AMBIGUOUS_MATCH = "Ambiguous match found for serviceIdentifier:";
	var CANNOT_UNBIND = "Could not unbind serviceIdentifier:";
	var NOT_REGISTERED = "No matching bindings found for serviceIdentifier:";
	var MISSING_INJECTABLE_ANNOTATION = "Missing required @injectable annotation in:";
	var MISSING_INJECT_ANNOTATION = "Missing required @inject or @multiInject annotation in:";
	var UNDEFINED_INJECT_ANNOTATION = function (name) {
	    return "@inject called with undefined this could mean that the class " + name + " has " +
	        "a circular dependency problem. You can use a LazyServiceIdentifer to  " +
	        "overcome this limitation.";
	};
	var CIRCULAR_DEPENDENCY = "Circular dependency found:";
	var INVALID_BINDING_TYPE = "Invalid binding type:";
	var NO_MORE_SNAPSHOTS_AVAILABLE = "No snapshot available to restore.";
	var INVALID_MIDDLEWARE_RETURN = "Invalid return type in middleware. Middleware must return!";
	var INVALID_FUNCTION_BINDING = "Value provided to function binding must be a function!";
	var INVALID_TO_SELF_VALUE = "The toSelf function can only be applied when a constructor is " +
	    "used as service identifier";
	var INVALID_DECORATOR_OPERATION = "The @inject @multiInject @tagged and @named decorators " +
	    "must be applied to the parameters of a class constructor or a class property.";
	var ARGUMENTS_LENGTH_MISMATCH = function () {
	    var values = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        values[_i] = arguments[_i];
	    }
	    return "The number of constructor arguments in the derived class " +
	        (values[0] + " must be >= than the number of constructor arguments of its base class.");
	};
	var CONTAINER_OPTIONS_MUST_BE_AN_OBJECT = "Invalid Container constructor argument. Container options " +
	    "must be an object.";
	var CONTAINER_OPTIONS_INVALID_DEFAULT_SCOPE = "Invalid Container option. Default scope must " +
	    "be a string ('singleton' or 'transient').";
	var CONTAINER_OPTIONS_INVALID_AUTO_BIND_INJECTABLE = "Invalid Container option. Auto bind injectable must " +
	    "be a boolean";
	var CONTAINER_OPTIONS_INVALID_SKIP_BASE_CHECK = "Invalid Container option. Skip base check must " +
	    "be a boolean";
	var POST_CONSTRUCT_ERROR = function () {
	    var values = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        values[_i] = arguments[_i];
	    }
	    return "@postConstruct error in class " + values[0] + ": " + values[1];
	};
	var CIRCULAR_DEPENDENCY_IN_FACTORY = function () {
	    var values = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        values[_i] = arguments[_i];
	    }
	    return "It looks like there is a circular dependency " +
	        ("in one of the '" + values[0] + "' bindings. Please investigate bindings with") +
	        ("service identifier '" + values[1] + "'.");
	};
	var STACK_OVERFLOW = "Maximum call stack size exceeded";

	var MetadataReader = (function () {
	    function MetadataReader() {
	    }
	    MetadataReader.prototype.getConstructorMetadata = function (constructorFunc) {
	        var compilerGeneratedMetadata = Reflect.getMetadata(PARAM_TYPES, constructorFunc);
	        var userGeneratedMetadata = Reflect.getMetadata(TAGGED, constructorFunc);
	        return {
	            compilerGeneratedMetadata: compilerGeneratedMetadata,
	            userGeneratedMetadata: userGeneratedMetadata || {}
	        };
	    };
	    MetadataReader.prototype.getPropertiesMetadata = function (constructorFunc) {
	        var userGeneratedMetadata = Reflect.getMetadata(TAGGED_PROP, constructorFunc) || [];
	        return userGeneratedMetadata;
	    };
	    return MetadataReader;
	}());

	var BindingCount = {
	    MultipleBindingsAvailable: 2,
	    NoBindingsAvailable: 0,
	    OnlyOneBindingAvailable: 1
	};

	function isStackOverflowExeption(error) {
	    return (error instanceof RangeError ||
	        error.message === STACK_OVERFLOW);
	}

	function getServiceIdentifierAsString(serviceIdentifier) {
	    if (typeof serviceIdentifier === "function") {
	        var _serviceIdentifier = serviceIdentifier;
	        return _serviceIdentifier.name;
	    }
	    else if (typeof serviceIdentifier === "symbol") {
	        return serviceIdentifier.toString();
	    }
	    else {
	        var _serviceIdentifier = serviceIdentifier;
	        return _serviceIdentifier;
	    }
	}
	function listRegisteredBindingsForServiceIdentifier(container, serviceIdentifier, getBindings) {
	    var registeredBindingsList = "";
	    var registeredBindings = getBindings(container, serviceIdentifier);
	    if (registeredBindings.length !== 0) {
	        registeredBindingsList = "\nRegistered bindings:";
	        registeredBindings.forEach(function (binding) {
	            var name = "Object";
	            if (binding.implementationType !== null) {
	                name = getFunctionName(binding.implementationType);
	            }
	            registeredBindingsList = registeredBindingsList + "\n " + name;
	            if (binding.constraint.metaData) {
	                registeredBindingsList = registeredBindingsList + " - " + binding.constraint.metaData;
	            }
	        });
	    }
	    return registeredBindingsList;
	}
	function alreadyDependencyChain(request, serviceIdentifier) {
	    if (request.parentRequest === null) {
	        return false;
	    }
	    else if (request.parentRequest.serviceIdentifier === serviceIdentifier) {
	        return true;
	    }
	    else {
	        return alreadyDependencyChain(request.parentRequest, serviceIdentifier);
	    }
	}
	function dependencyChainToString(request) {
	    function _createStringArr(req, result) {
	        if (result === void 0) { result = []; }
	        var serviceIdentifier = getServiceIdentifierAsString(req.serviceIdentifier);
	        result.push(serviceIdentifier);
	        if (req.parentRequest !== null) {
	            return _createStringArr(req.parentRequest, result);
	        }
	        return result;
	    }
	    var stringArr = _createStringArr(request);
	    return stringArr.reverse().join(" --> ");
	}
	function circularDependencyToException(request) {
	    request.childRequests.forEach(function (childRequest) {
	        if (alreadyDependencyChain(childRequest, childRequest.serviceIdentifier)) {
	            var services = dependencyChainToString(childRequest);
	            throw new Error(CIRCULAR_DEPENDENCY + " " + services);
	        }
	        else {
	            circularDependencyToException(childRequest);
	        }
	    });
	}
	function listMetadataForTarget(serviceIdentifierString, target) {
	    if (target.isTagged() || target.isNamed()) {
	        var m_1 = "";
	        var namedTag = target.getNamedTag();
	        var otherTags = target.getCustomTags();
	        if (namedTag !== null) {
	            m_1 += namedTag.toString() + "\n";
	        }
	        if (otherTags !== null) {
	            otherTags.forEach(function (tag) {
	                m_1 += tag.toString() + "\n";
	            });
	        }
	        return " " + serviceIdentifierString + "\n " + serviceIdentifierString + " - " + m_1;
	    }
	    else {
	        return " " + serviceIdentifierString;
	    }
	}
	function getFunctionName(v) {
	    if (v.name) {
	        return v.name;
	    }
	    else {
	        var name_1 = v.toString();
	        var match = name_1.match(/^function\s*([^\s(]+)/);
	        return match ? match[1] : "Anonymous function: " + name_1;
	    }
	}

	var Context = (function () {
	    function Context(container) {
	        this.id = id();
	        this.container = container;
	    }
	    Context.prototype.addPlan = function (plan) {
	        this.plan = plan;
	    };
	    Context.prototype.setCurrentRequest = function (currentRequest) {
	        this.currentRequest = currentRequest;
	    };
	    return Context;
	}());

	var Metadata = (function () {
	    function Metadata(key, value) {
	        this.key = key;
	        this.value = value;
	    }
	    Metadata.prototype.toString = function () {
	        if (this.key === NAMED_TAG) {
	            return "named: " + this.value.toString() + " ";
	        }
	        else {
	            return "tagged: { key:" + this.key.toString() + ", value: " + this.value + " }";
	        }
	    };
	    return Metadata;
	}());

	var Plan = (function () {
	    function Plan(parentContext, rootRequest) {
	        this.parentContext = parentContext;
	        this.rootRequest = rootRequest;
	    }
	    return Plan;
	}());

	function tagParameter(annotationTarget, propertyName, parameterIndex, metadata) {
	    var metadataKey = TAGGED;
	    _tagParameterOrProperty(metadataKey, annotationTarget, propertyName, metadata, parameterIndex);
	}
	function tagProperty(annotationTarget, propertyName, metadata) {
	    var metadataKey = TAGGED_PROP;
	    _tagParameterOrProperty(metadataKey, annotationTarget.constructor, propertyName, metadata);
	}
	function _tagParameterOrProperty(metadataKey, annotationTarget, propertyName, metadata, parameterIndex) {
	    var paramsOrPropertiesMetadata = {};
	    var isParameterDecorator = (typeof parameterIndex === "number");
	    var key = (parameterIndex !== undefined && isParameterDecorator) ? parameterIndex.toString() : propertyName;
	    if (isParameterDecorator && propertyName !== undefined) {
	        throw new Error(INVALID_DECORATOR_OPERATION);
	    }
	    if (Reflect.hasOwnMetadata(metadataKey, annotationTarget)) {
	        paramsOrPropertiesMetadata = Reflect.getMetadata(metadataKey, annotationTarget);
	    }
	    var paramOrPropertyMetadata = paramsOrPropertiesMetadata[key];
	    if (!Array.isArray(paramOrPropertyMetadata)) {
	        paramOrPropertyMetadata = [];
	    }
	    else {
	        for (var _i = 0, paramOrPropertyMetadata_1 = paramOrPropertyMetadata; _i < paramOrPropertyMetadata_1.length; _i++) {
	            var m = paramOrPropertyMetadata_1[_i];
	            if (m.key === metadata.key) {
	                throw new Error(DUPLICATED_METADATA + " " + m.key.toString());
	            }
	        }
	    }
	    paramOrPropertyMetadata.push(metadata);
	    paramsOrPropertiesMetadata[key] = paramOrPropertyMetadata;
	    Reflect.defineMetadata(metadataKey, paramsOrPropertiesMetadata, annotationTarget);
	}

	var LazyServiceIdentifer = (function () {
	    function LazyServiceIdentifer(cb) {
	        this._cb = cb;
	    }
	    LazyServiceIdentifer.prototype.unwrap = function () {
	        return this._cb();
	    };
	    return LazyServiceIdentifer;
	}());
	function inject(serviceIdentifier) {
	    return function (target, targetKey, index) {
	        if (serviceIdentifier === undefined) {
	            throw new Error(UNDEFINED_INJECT_ANNOTATION(target.name));
	        }
	        var metadata = new Metadata(INJECT_TAG, serviceIdentifier);
	        if (typeof index === "number") {
	            tagParameter(target, targetKey, index, metadata);
	        }
	        else {
	            tagProperty(target, targetKey, metadata);
	        }
	    };
	}

	var QueryableString = (function () {
	    function QueryableString(str) {
	        this.str = str;
	    }
	    QueryableString.prototype.startsWith = function (searchString) {
	        return this.str.indexOf(searchString) === 0;
	    };
	    QueryableString.prototype.endsWith = function (searchString) {
	        var reverseString = "";
	        var reverseSearchString = searchString.split("").reverse().join("");
	        reverseString = this.str.split("").reverse().join("");
	        return this.startsWith.call({ str: reverseString }, reverseSearchString);
	    };
	    QueryableString.prototype.contains = function (searchString) {
	        return (this.str.indexOf(searchString) !== -1);
	    };
	    QueryableString.prototype.equals = function (compareString) {
	        return this.str === compareString;
	    };
	    QueryableString.prototype.value = function () {
	        return this.str;
	    };
	    return QueryableString;
	}());

	var Target = (function () {
	    function Target(type, name, serviceIdentifier, namedOrTagged) {
	        this.id = id();
	        this.type = type;
	        this.serviceIdentifier = serviceIdentifier;
	        this.name = new QueryableString(name || "");
	        this.metadata = new Array();
	        var metadataItem = null;
	        if (typeof namedOrTagged === "string") {
	            metadataItem = new Metadata(NAMED_TAG, namedOrTagged);
	        }
	        else if (namedOrTagged instanceof Metadata) {
	            metadataItem = namedOrTagged;
	        }
	        if (metadataItem !== null) {
	            this.metadata.push(metadataItem);
	        }
	    }
	    Target.prototype.hasTag = function (key) {
	        for (var _i = 0, _a = this.metadata; _i < _a.length; _i++) {
	            var m = _a[_i];
	            if (m.key === key) {
	                return true;
	            }
	        }
	        return false;
	    };
	    Target.prototype.isArray = function () {
	        return this.hasTag(MULTI_INJECT_TAG);
	    };
	    Target.prototype.matchesArray = function (name) {
	        return this.matchesTag(MULTI_INJECT_TAG)(name);
	    };
	    Target.prototype.isNamed = function () {
	        return this.hasTag(NAMED_TAG);
	    };
	    Target.prototype.isTagged = function () {
	        return this.metadata.some(function (m) {
	            return (m.key !== INJECT_TAG) &&
	                (m.key !== MULTI_INJECT_TAG) &&
	                (m.key !== NAME_TAG) &&
	                (m.key !== UNMANAGED_TAG) &&
	                (m.key !== NAMED_TAG);
	        });
	    };
	    Target.prototype.isOptional = function () {
	        return this.matchesTag(OPTIONAL_TAG)(true);
	    };
	    Target.prototype.getNamedTag = function () {
	        if (this.isNamed()) {
	            return this.metadata.filter(function (m) { return m.key === NAMED_TAG; })[0];
	        }
	        return null;
	    };
	    Target.prototype.getCustomTags = function () {
	        if (this.isTagged()) {
	            return this.metadata.filter(function (m) {
	                return (m.key !== INJECT_TAG) &&
	                    (m.key !== MULTI_INJECT_TAG) &&
	                    (m.key !== NAME_TAG) &&
	                    (m.key !== UNMANAGED_TAG) &&
	                    (m.key !== NAMED_TAG);
	            });
	        }
	        return null;
	    };
	    Target.prototype.matchesNamedTag = function (name) {
	        return this.matchesTag(NAMED_TAG)(name);
	    };
	    Target.prototype.matchesTag = function (key) {
	        var _this = this;
	        return function (value) {
	            for (var _i = 0, _a = _this.metadata; _i < _a.length; _i++) {
	                var m = _a[_i];
	                if (m.key === key && m.value === value) {
	                    return true;
	                }
	            }
	            return false;
	        };
	    };
	    return Target;
	}());

	function getDependencies(metadataReader, func) {
	    var constructorName = getFunctionName(func);
	    var targets = getTargets(metadataReader, constructorName, func, false);
	    return targets;
	}
	function getTargets(metadataReader, constructorName, func, isBaseClass) {
	    var metadata = metadataReader.getConstructorMetadata(func);
	    var serviceIdentifiers = metadata.compilerGeneratedMetadata;
	    if (serviceIdentifiers === undefined) {
	        var msg = MISSING_INJECTABLE_ANNOTATION + " " + constructorName + ".";
	        throw new Error(msg);
	    }
	    var constructorArgsMetadata = metadata.userGeneratedMetadata;
	    var keys = Object.keys(constructorArgsMetadata);
	    var hasUserDeclaredUnknownInjections = (func.length === 0 && keys.length > 0);
	    var iterations = (hasUserDeclaredUnknownInjections) ? keys.length : func.length;
	    var constructorTargets = getConstructorArgsAsTargets(isBaseClass, constructorName, serviceIdentifiers, constructorArgsMetadata, iterations);
	    var propertyTargets = getClassPropsAsTargets(metadataReader, func);
	    var targets = constructorTargets.concat(propertyTargets);
	    return targets;
	}
	function getConstructorArgsAsTarget(index, isBaseClass, constructorName, serviceIdentifiers, constructorArgsMetadata) {
	    var targetMetadata = constructorArgsMetadata[index.toString()] || [];
	    var metadata = formatTargetMetadata(targetMetadata);
	    var isManaged = metadata.unmanaged !== true;
	    var serviceIdentifier = serviceIdentifiers[index];
	    var injectIdentifier = (metadata.inject || metadata.multiInject);
	    serviceIdentifier = (injectIdentifier) ? (injectIdentifier) : serviceIdentifier;
	    if (serviceIdentifier instanceof LazyServiceIdentifer) {
	        serviceIdentifier = serviceIdentifier.unwrap();
	    }
	    if (isManaged) {
	        var isObject = serviceIdentifier === Object;
	        var isFunction = serviceIdentifier === Function;
	        var isUndefined = serviceIdentifier === undefined;
	        var isUnknownType = (isObject || isFunction || isUndefined);
	        if (!isBaseClass && isUnknownType) {
	            var msg = MISSING_INJECT_ANNOTATION + " argument " + index + " in class " + constructorName + ".";
	            throw new Error(msg);
	        }
	        var target = new Target(TargetTypeEnum.ConstructorArgument, metadata.targetName, serviceIdentifier);
	        target.metadata = targetMetadata;
	        return target;
	    }
	    return null;
	}
	function getConstructorArgsAsTargets(isBaseClass, constructorName, serviceIdentifiers, constructorArgsMetadata, iterations) {
	    var targets = [];
	    for (var i = 0; i < iterations; i++) {
	        var index = i;
	        var target = getConstructorArgsAsTarget(index, isBaseClass, constructorName, serviceIdentifiers, constructorArgsMetadata);
	        if (target !== null) {
	            targets.push(target);
	        }
	    }
	    return targets;
	}
	function getClassPropsAsTargets(metadataReader, constructorFunc) {
	    var classPropsMetadata = metadataReader.getPropertiesMetadata(constructorFunc);
	    var targets = [];
	    var keys = Object.keys(classPropsMetadata);
	    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
	        var key = keys_1[_i];
	        var targetMetadata = classPropsMetadata[key];
	        var metadata = formatTargetMetadata(classPropsMetadata[key]);
	        var targetName = metadata.targetName || key;
	        var serviceIdentifier = (metadata.inject || metadata.multiInject);
	        var target = new Target(TargetTypeEnum.ClassProperty, targetName, serviceIdentifier);
	        target.metadata = targetMetadata;
	        targets.push(target);
	    }
	    var baseConstructor = Object.getPrototypeOf(constructorFunc.prototype).constructor;
	    if (baseConstructor !== Object) {
	        var baseTargets = getClassPropsAsTargets(metadataReader, baseConstructor);
	        targets = targets.concat(baseTargets);
	    }
	    return targets;
	}
	function getBaseClassDependencyCount(metadataReader, func) {
	    var baseConstructor = Object.getPrototypeOf(func.prototype).constructor;
	    if (baseConstructor !== Object) {
	        var baseConstructorName = getFunctionName(baseConstructor);
	        var targets = getTargets(metadataReader, baseConstructorName, baseConstructor, true);
	        var metadata = targets.map(function (t) {
	            return t.metadata.filter(function (m) {
	                return m.key === UNMANAGED_TAG;
	            });
	        });
	        var unmanagedCount = [].concat.apply([], metadata).length;
	        var dependencyCount = targets.length - unmanagedCount;
	        if (dependencyCount > 0) {
	            return dependencyCount;
	        }
	        else {
	            return getBaseClassDependencyCount(metadataReader, baseConstructor);
	        }
	    }
	    else {
	        return 0;
	    }
	}
	function formatTargetMetadata(targetMetadata) {
	    var targetMetadataMap = {};
	    targetMetadata.forEach(function (m) {
	        targetMetadataMap[m.key.toString()] = m.value;
	    });
	    return {
	        inject: targetMetadataMap[INJECT_TAG],
	        multiInject: targetMetadataMap[MULTI_INJECT_TAG],
	        targetName: targetMetadataMap[NAME_TAG],
	        unmanaged: targetMetadataMap[UNMANAGED_TAG]
	    };
	}

	var Request = (function () {
	    function Request(serviceIdentifier, parentContext, parentRequest, bindings, target) {
	        this.id = id();
	        this.serviceIdentifier = serviceIdentifier;
	        this.parentContext = parentContext;
	        this.parentRequest = parentRequest;
	        this.target = target;
	        this.childRequests = [];
	        this.bindings = (Array.isArray(bindings) ? bindings : [bindings]);
	        this.requestScope = parentRequest === null
	            ? new Map()
	            : null;
	    }
	    Request.prototype.addChildRequest = function (serviceIdentifier, bindings, target) {
	        var child = new Request(serviceIdentifier, this.parentContext, this, bindings, target);
	        this.childRequests.push(child);
	        return child;
	    };
	    return Request;
	}());

	function getBindingDictionary(cntnr) {
	    return cntnr._bindingDictionary;
	}
	function _createTarget(isMultiInject, targetType, serviceIdentifier, name, key, value) {
	    var metadataKey = isMultiInject ? MULTI_INJECT_TAG : INJECT_TAG;
	    var injectMetadata = new Metadata(metadataKey, serviceIdentifier);
	    var target = new Target(targetType, name, serviceIdentifier, injectMetadata);
	    if (key !== undefined) {
	        var tagMetadata = new Metadata(key, value);
	        target.metadata.push(tagMetadata);
	    }
	    return target;
	}
	function _getActiveBindings(metadataReader, avoidConstraints, context, parentRequest, target) {
	    var bindings = getBindings(context.container, target.serviceIdentifier);
	    var activeBindings = [];
	    if (bindings.length === BindingCount.NoBindingsAvailable &&
	        context.container.options.autoBindInjectable &&
	        typeof target.serviceIdentifier === "function" &&
	        metadataReader.getConstructorMetadata(target.serviceIdentifier).compilerGeneratedMetadata) {
	        context.container.bind(target.serviceIdentifier).toSelf();
	        bindings = getBindings(context.container, target.serviceIdentifier);
	    }
	    if (!avoidConstraints) {
	        activeBindings = bindings.filter(function (binding) {
	            var request = new Request(binding.serviceIdentifier, context, parentRequest, binding, target);
	            return binding.constraint(request);
	        });
	    }
	    else {
	        activeBindings = bindings;
	    }
	    _validateActiveBindingCount(target.serviceIdentifier, activeBindings, target, context.container);
	    return activeBindings;
	}
	function _validateActiveBindingCount(serviceIdentifier, bindings, target, container) {
	    switch (bindings.length) {
	        case BindingCount.NoBindingsAvailable:
	            if (target.isOptional()) {
	                return bindings;
	            }
	            else {
	                var serviceIdentifierString = getServiceIdentifierAsString(serviceIdentifier);
	                var msg = NOT_REGISTERED;
	                msg += listMetadataForTarget(serviceIdentifierString, target);
	                msg += listRegisteredBindingsForServiceIdentifier(container, serviceIdentifierString, getBindings);
	                throw new Error(msg);
	            }
	        case BindingCount.OnlyOneBindingAvailable:
	            if (!target.isArray()) {
	                return bindings;
	            }
	        case BindingCount.MultipleBindingsAvailable:
	        default:
	            if (!target.isArray()) {
	                var serviceIdentifierString = getServiceIdentifierAsString(serviceIdentifier);
	                var msg = AMBIGUOUS_MATCH + " " + serviceIdentifierString;
	                msg += listRegisteredBindingsForServiceIdentifier(container, serviceIdentifierString, getBindings);
	                throw new Error(msg);
	            }
	            else {
	                return bindings;
	            }
	    }
	}
	function _createSubRequests(metadataReader, avoidConstraints, serviceIdentifier, context, parentRequest, target) {
	    var activeBindings;
	    var childRequest;
	    if (parentRequest === null) {
	        activeBindings = _getActiveBindings(metadataReader, avoidConstraints, context, null, target);
	        childRequest = new Request(serviceIdentifier, context, null, activeBindings, target);
	        var thePlan = new Plan(context, childRequest);
	        context.addPlan(thePlan);
	    }
	    else {
	        activeBindings = _getActiveBindings(metadataReader, avoidConstraints, context, parentRequest, target);
	        childRequest = parentRequest.addChildRequest(target.serviceIdentifier, activeBindings, target);
	    }
	    activeBindings.forEach(function (binding) {
	        var subChildRequest = null;
	        if (target.isArray()) {
	            subChildRequest = childRequest.addChildRequest(binding.serviceIdentifier, binding, target);
	        }
	        else {
	            if (binding.cache) {
	                return;
	            }
	            subChildRequest = childRequest;
	        }
	        if (binding.type === BindingTypeEnum.Instance && binding.implementationType !== null) {
	            var dependencies = getDependencies(metadataReader, binding.implementationType);
	            if (!context.container.options.skipBaseClassChecks) {
	                var baseClassDependencyCount = getBaseClassDependencyCount(metadataReader, binding.implementationType);
	                if (dependencies.length < baseClassDependencyCount) {
	                    var error = ARGUMENTS_LENGTH_MISMATCH(getFunctionName(binding.implementationType));
	                    throw new Error(error);
	                }
	            }
	            dependencies.forEach(function (dependency) {
	                _createSubRequests(metadataReader, false, dependency.serviceIdentifier, context, subChildRequest, dependency);
	            });
	        }
	    });
	}
	function getBindings(container, serviceIdentifier) {
	    var bindings = [];
	    var bindingDictionary = getBindingDictionary(container);
	    if (bindingDictionary.hasKey(serviceIdentifier)) {
	        bindings = bindingDictionary.get(serviceIdentifier);
	    }
	    else if (container.parent !== null) {
	        bindings = getBindings(container.parent, serviceIdentifier);
	    }
	    return bindings;
	}
	function plan(metadataReader, container, isMultiInject, targetType, serviceIdentifier, key, value, avoidConstraints) {
	    if (avoidConstraints === void 0) { avoidConstraints = false; }
	    var context = new Context(container);
	    var target = _createTarget(isMultiInject, targetType, serviceIdentifier, "", key, value);
	    try {
	        _createSubRequests(metadataReader, avoidConstraints, serviceIdentifier, context, null, target);
	        return context;
	    }
	    catch (error) {
	        if (isStackOverflowExeption(error)) {
	            if (context.plan) {
	                circularDependencyToException(context.plan.rootRequest);
	            }
	        }
	        throw error;
	    }
	}
	function createMockRequest(container, serviceIdentifier, key, value) {
	    var target = new Target(TargetTypeEnum.Variable, "", serviceIdentifier, new Metadata(key, value));
	    var context = new Context(container);
	    var request = new Request(serviceIdentifier, context, null, [], target);
	    return request;
	}

	function _injectProperties(instance, childRequests, resolveRequest) {
	    var propertyInjectionsRequests = childRequests.filter(function (childRequest) {
	        return (childRequest.target !== null &&
	            childRequest.target.type === TargetTypeEnum.ClassProperty);
	    });
	    var propertyInjections = propertyInjectionsRequests.map(resolveRequest);
	    propertyInjectionsRequests.forEach(function (r, index) {
	        var propertyName = "";
	        propertyName = r.target.name.value();
	        var injection = propertyInjections[index];
	        instance[propertyName] = injection;
	    });
	    return instance;
	}
	function _createInstance(Func, injections) {
	    return new (Func.bind.apply(Func, [void 0].concat(injections)))();
	}
	function _postConstruct(constr, result) {
	    if (Reflect.hasMetadata(POST_CONSTRUCT, constr)) {
	        var data = Reflect.getMetadata(POST_CONSTRUCT, constr);
	        try {
	            result[data.value]();
	        }
	        catch (e) {
	            throw new Error(POST_CONSTRUCT_ERROR(constr.name, e.message));
	        }
	    }
	}
	function resolveInstance(constr, childRequests, resolveRequest) {
	    var result = null;
	    if (childRequests.length > 0) {
	        var constructorInjectionsRequests = childRequests.filter(function (childRequest) {
	            return (childRequest.target !== null && childRequest.target.type === TargetTypeEnum.ConstructorArgument);
	        });
	        var constructorInjections = constructorInjectionsRequests.map(resolveRequest);
	        result = _createInstance(constr, constructorInjections);
	        result = _injectProperties(result, childRequests, resolveRequest);
	    }
	    else {
	        result = new constr();
	    }
	    _postConstruct(constr, result);
	    return result;
	}

	var invokeFactory = function (factoryType, serviceIdentifier, fn) {
	    try {
	        return fn();
	    }
	    catch (error) {
	        if (isStackOverflowExeption(error)) {
	            throw new Error(CIRCULAR_DEPENDENCY_IN_FACTORY(factoryType, serviceIdentifier.toString()));
	        }
	        else {
	            throw error;
	        }
	    }
	};
	var _resolveRequest = function (requestScope) {
	    return function (request) {
	        request.parentContext.setCurrentRequest(request);
	        var bindings = request.bindings;
	        var childRequests = request.childRequests;
	        var targetIsAnArray = request.target && request.target.isArray();
	        var targetParentIsNotAnArray = !request.parentRequest ||
	            !request.parentRequest.target ||
	            !request.target ||
	            !request.parentRequest.target.matchesArray(request.target.serviceIdentifier);
	        if (targetIsAnArray && targetParentIsNotAnArray) {
	            return childRequests.map(function (childRequest) {
	                var _f = _resolveRequest(requestScope);
	                return _f(childRequest);
	            });
	        }
	        else {
	            var result = null;
	            if (request.target.isOptional() && bindings.length === 0) {
	                return undefined;
	            }
	            var binding_1 = bindings[0];
	            var isSingleton = binding_1.scope === BindingScopeEnum.Singleton;
	            var isRequestSingleton = binding_1.scope === BindingScopeEnum.Request;
	            if (isSingleton && binding_1.activated) {
	                return binding_1.cache;
	            }
	            if (isRequestSingleton &&
	                requestScope !== null &&
	                requestScope.has(binding_1.id)) {
	                return requestScope.get(binding_1.id);
	            }
	            if (binding_1.type === BindingTypeEnum.ConstantValue) {
	                result = binding_1.cache;
	            }
	            else if (binding_1.type === BindingTypeEnum.Function) {
	                result = binding_1.cache;
	            }
	            else if (binding_1.type === BindingTypeEnum.Constructor) {
	                result = binding_1.implementationType;
	            }
	            else if (binding_1.type === BindingTypeEnum.DynamicValue && binding_1.dynamicValue !== null) {
	                result = invokeFactory("toDynamicValue", binding_1.serviceIdentifier, function () { return binding_1.dynamicValue(request.parentContext); });
	            }
	            else if (binding_1.type === BindingTypeEnum.Factory && binding_1.factory !== null) {
	                result = invokeFactory("toFactory", binding_1.serviceIdentifier, function () { return binding_1.factory(request.parentContext); });
	            }
	            else if (binding_1.type === BindingTypeEnum.Provider && binding_1.provider !== null) {
	                result = invokeFactory("toProvider", binding_1.serviceIdentifier, function () { return binding_1.provider(request.parentContext); });
	            }
	            else if (binding_1.type === BindingTypeEnum.Instance && binding_1.implementationType !== null) {
	                result = resolveInstance(binding_1.implementationType, childRequests, _resolveRequest(requestScope));
	            }
	            else {
	                var serviceIdentifier = getServiceIdentifierAsString(request.serviceIdentifier);
	                throw new Error(INVALID_BINDING_TYPE + " " + serviceIdentifier);
	            }
	            if (typeof binding_1.onActivation === "function") {
	                result = binding_1.onActivation(request.parentContext, result);
	            }
	            if (isSingleton) {
	                binding_1.cache = result;
	                binding_1.activated = true;
	            }
	            if (isRequestSingleton &&
	                requestScope !== null &&
	                !requestScope.has(binding_1.id)) {
	                requestScope.set(binding_1.id, result);
	            }
	            return result;
	        }
	    };
	};
	function resolve(context) {
	    var _f = _resolveRequest(context.plan.rootRequest.requestScope);
	    return _f(context.plan.rootRequest);
	}

	var traverseAncerstors = function (request, constraint) {
	    var parent = request.parentRequest;
	    if (parent !== null) {
	        return constraint(parent) ? true : traverseAncerstors(parent, constraint);
	    }
	    else {
	        return false;
	    }
	};
	var taggedConstraint = function (key) { return function (value) {
	    var constraint = function (request) {
	        return request !== null && request.target !== null && request.target.matchesTag(key)(value);
	    };
	    constraint.metaData = new Metadata(key, value);
	    return constraint;
	}; };
	var namedConstraint = taggedConstraint(NAMED_TAG);
	var typeConstraint = function (type) { return function (request) {
	    var binding = null;
	    if (request !== null) {
	        binding = request.bindings[0];
	        if (typeof type === "string") {
	            var serviceIdentifier = binding.serviceIdentifier;
	            return serviceIdentifier === type;
	        }
	        else {
	            var constructor = request.bindings[0].implementationType;
	            return type === constructor;
	        }
	    }
	    return false;
	}; };

	var BindingWhenSyntax = (function () {
	    function BindingWhenSyntax(binding) {
	        this._binding = binding;
	    }
	    BindingWhenSyntax.prototype.when = function (constraint) {
	        this._binding.constraint = constraint;
	        return new BindingOnSyntax(this._binding);
	    };
	    BindingWhenSyntax.prototype.whenTargetNamed = function (name) {
	        this._binding.constraint = namedConstraint(name);
	        return new BindingOnSyntax(this._binding);
	    };
	    BindingWhenSyntax.prototype.whenTargetIsDefault = function () {
	        this._binding.constraint = function (request) {
	            var targetIsDefault = (request.target !== null) &&
	                (!request.target.isNamed()) &&
	                (!request.target.isTagged());
	            return targetIsDefault;
	        };
	        return new BindingOnSyntax(this._binding);
	    };
	    BindingWhenSyntax.prototype.whenTargetTagged = function (tag, value) {
	        this._binding.constraint = taggedConstraint(tag)(value);
	        return new BindingOnSyntax(this._binding);
	    };
	    BindingWhenSyntax.prototype.whenInjectedInto = function (parent) {
	        this._binding.constraint = function (request) {
	            return typeConstraint(parent)(request.parentRequest);
	        };
	        return new BindingOnSyntax(this._binding);
	    };
	    BindingWhenSyntax.prototype.whenParentNamed = function (name) {
	        this._binding.constraint = function (request) {
	            return namedConstraint(name)(request.parentRequest);
	        };
	        return new BindingOnSyntax(this._binding);
	    };
	    BindingWhenSyntax.prototype.whenParentTagged = function (tag, value) {
	        this._binding.constraint = function (request) {
	            return taggedConstraint(tag)(value)(request.parentRequest);
	        };
	        return new BindingOnSyntax(this._binding);
	    };
	    BindingWhenSyntax.prototype.whenAnyAncestorIs = function (ancestor) {
	        this._binding.constraint = function (request) {
	            return traverseAncerstors(request, typeConstraint(ancestor));
	        };
	        return new BindingOnSyntax(this._binding);
	    };
	    BindingWhenSyntax.prototype.whenNoAncestorIs = function (ancestor) {
	        this._binding.constraint = function (request) {
	            return !traverseAncerstors(request, typeConstraint(ancestor));
	        };
	        return new BindingOnSyntax(this._binding);
	    };
	    BindingWhenSyntax.prototype.whenAnyAncestorNamed = function (name) {
	        this._binding.constraint = function (request) {
	            return traverseAncerstors(request, namedConstraint(name));
	        };
	        return new BindingOnSyntax(this._binding);
	    };
	    BindingWhenSyntax.prototype.whenNoAncestorNamed = function (name) {
	        this._binding.constraint = function (request) {
	            return !traverseAncerstors(request, namedConstraint(name));
	        };
	        return new BindingOnSyntax(this._binding);
	    };
	    BindingWhenSyntax.prototype.whenAnyAncestorTagged = function (tag, value) {
	        this._binding.constraint = function (request) {
	            return traverseAncerstors(request, taggedConstraint(tag)(value));
	        };
	        return new BindingOnSyntax(this._binding);
	    };
	    BindingWhenSyntax.prototype.whenNoAncestorTagged = function (tag, value) {
	        this._binding.constraint = function (request) {
	            return !traverseAncerstors(request, taggedConstraint(tag)(value));
	        };
	        return new BindingOnSyntax(this._binding);
	    };
	    BindingWhenSyntax.prototype.whenAnyAncestorMatches = function (constraint) {
	        this._binding.constraint = function (request) {
	            return traverseAncerstors(request, constraint);
	        };
	        return new BindingOnSyntax(this._binding);
	    };
	    BindingWhenSyntax.prototype.whenNoAncestorMatches = function (constraint) {
	        this._binding.constraint = function (request) {
	            return !traverseAncerstors(request, constraint);
	        };
	        return new BindingOnSyntax(this._binding);
	    };
	    return BindingWhenSyntax;
	}());

	var BindingOnSyntax = (function () {
	    function BindingOnSyntax(binding) {
	        this._binding = binding;
	    }
	    BindingOnSyntax.prototype.onActivation = function (handler) {
	        this._binding.onActivation = handler;
	        return new BindingWhenSyntax(this._binding);
	    };
	    return BindingOnSyntax;
	}());

	var BindingWhenOnSyntax = (function () {
	    function BindingWhenOnSyntax(binding) {
	        this._binding = binding;
	        this._bindingWhenSyntax = new BindingWhenSyntax(this._binding);
	        this._bindingOnSyntax = new BindingOnSyntax(this._binding);
	    }
	    BindingWhenOnSyntax.prototype.when = function (constraint) {
	        return this._bindingWhenSyntax.when(constraint);
	    };
	    BindingWhenOnSyntax.prototype.whenTargetNamed = function (name) {
	        return this._bindingWhenSyntax.whenTargetNamed(name);
	    };
	    BindingWhenOnSyntax.prototype.whenTargetIsDefault = function () {
	        return this._bindingWhenSyntax.whenTargetIsDefault();
	    };
	    BindingWhenOnSyntax.prototype.whenTargetTagged = function (tag, value) {
	        return this._bindingWhenSyntax.whenTargetTagged(tag, value);
	    };
	    BindingWhenOnSyntax.prototype.whenInjectedInto = function (parent) {
	        return this._bindingWhenSyntax.whenInjectedInto(parent);
	    };
	    BindingWhenOnSyntax.prototype.whenParentNamed = function (name) {
	        return this._bindingWhenSyntax.whenParentNamed(name);
	    };
	    BindingWhenOnSyntax.prototype.whenParentTagged = function (tag, value) {
	        return this._bindingWhenSyntax.whenParentTagged(tag, value);
	    };
	    BindingWhenOnSyntax.prototype.whenAnyAncestorIs = function (ancestor) {
	        return this._bindingWhenSyntax.whenAnyAncestorIs(ancestor);
	    };
	    BindingWhenOnSyntax.prototype.whenNoAncestorIs = function (ancestor) {
	        return this._bindingWhenSyntax.whenNoAncestorIs(ancestor);
	    };
	    BindingWhenOnSyntax.prototype.whenAnyAncestorNamed = function (name) {
	        return this._bindingWhenSyntax.whenAnyAncestorNamed(name);
	    };
	    BindingWhenOnSyntax.prototype.whenAnyAncestorTagged = function (tag, value) {
	        return this._bindingWhenSyntax.whenAnyAncestorTagged(tag, value);
	    };
	    BindingWhenOnSyntax.prototype.whenNoAncestorNamed = function (name) {
	        return this._bindingWhenSyntax.whenNoAncestorNamed(name);
	    };
	    BindingWhenOnSyntax.prototype.whenNoAncestorTagged = function (tag, value) {
	        return this._bindingWhenSyntax.whenNoAncestorTagged(tag, value);
	    };
	    BindingWhenOnSyntax.prototype.whenAnyAncestorMatches = function (constraint) {
	        return this._bindingWhenSyntax.whenAnyAncestorMatches(constraint);
	    };
	    BindingWhenOnSyntax.prototype.whenNoAncestorMatches = function (constraint) {
	        return this._bindingWhenSyntax.whenNoAncestorMatches(constraint);
	    };
	    BindingWhenOnSyntax.prototype.onActivation = function (handler) {
	        return this._bindingOnSyntax.onActivation(handler);
	    };
	    return BindingWhenOnSyntax;
	}());

	var BindingInSyntax = (function () {
	    function BindingInSyntax(binding) {
	        this._binding = binding;
	    }
	    BindingInSyntax.prototype.inRequestScope = function () {
	        this._binding.scope = BindingScopeEnum.Request;
	        return new BindingWhenOnSyntax(this._binding);
	    };
	    BindingInSyntax.prototype.inSingletonScope = function () {
	        this._binding.scope = BindingScopeEnum.Singleton;
	        return new BindingWhenOnSyntax(this._binding);
	    };
	    BindingInSyntax.prototype.inTransientScope = function () {
	        this._binding.scope = BindingScopeEnum.Transient;
	        return new BindingWhenOnSyntax(this._binding);
	    };
	    return BindingInSyntax;
	}());

	var BindingInWhenOnSyntax = (function () {
	    function BindingInWhenOnSyntax(binding) {
	        this._binding = binding;
	        this._bindingWhenSyntax = new BindingWhenSyntax(this._binding);
	        this._bindingOnSyntax = new BindingOnSyntax(this._binding);
	        this._bindingInSyntax = new BindingInSyntax(binding);
	    }
	    BindingInWhenOnSyntax.prototype.inRequestScope = function () {
	        return this._bindingInSyntax.inRequestScope();
	    };
	    BindingInWhenOnSyntax.prototype.inSingletonScope = function () {
	        return this._bindingInSyntax.inSingletonScope();
	    };
	    BindingInWhenOnSyntax.prototype.inTransientScope = function () {
	        return this._bindingInSyntax.inTransientScope();
	    };
	    BindingInWhenOnSyntax.prototype.when = function (constraint) {
	        return this._bindingWhenSyntax.when(constraint);
	    };
	    BindingInWhenOnSyntax.prototype.whenTargetNamed = function (name) {
	        return this._bindingWhenSyntax.whenTargetNamed(name);
	    };
	    BindingInWhenOnSyntax.prototype.whenTargetIsDefault = function () {
	        return this._bindingWhenSyntax.whenTargetIsDefault();
	    };
	    BindingInWhenOnSyntax.prototype.whenTargetTagged = function (tag, value) {
	        return this._bindingWhenSyntax.whenTargetTagged(tag, value);
	    };
	    BindingInWhenOnSyntax.prototype.whenInjectedInto = function (parent) {
	        return this._bindingWhenSyntax.whenInjectedInto(parent);
	    };
	    BindingInWhenOnSyntax.prototype.whenParentNamed = function (name) {
	        return this._bindingWhenSyntax.whenParentNamed(name);
	    };
	    BindingInWhenOnSyntax.prototype.whenParentTagged = function (tag, value) {
	        return this._bindingWhenSyntax.whenParentTagged(tag, value);
	    };
	    BindingInWhenOnSyntax.prototype.whenAnyAncestorIs = function (ancestor) {
	        return this._bindingWhenSyntax.whenAnyAncestorIs(ancestor);
	    };
	    BindingInWhenOnSyntax.prototype.whenNoAncestorIs = function (ancestor) {
	        return this._bindingWhenSyntax.whenNoAncestorIs(ancestor);
	    };
	    BindingInWhenOnSyntax.prototype.whenAnyAncestorNamed = function (name) {
	        return this._bindingWhenSyntax.whenAnyAncestorNamed(name);
	    };
	    BindingInWhenOnSyntax.prototype.whenAnyAncestorTagged = function (tag, value) {
	        return this._bindingWhenSyntax.whenAnyAncestorTagged(tag, value);
	    };
	    BindingInWhenOnSyntax.prototype.whenNoAncestorNamed = function (name) {
	        return this._bindingWhenSyntax.whenNoAncestorNamed(name);
	    };
	    BindingInWhenOnSyntax.prototype.whenNoAncestorTagged = function (tag, value) {
	        return this._bindingWhenSyntax.whenNoAncestorTagged(tag, value);
	    };
	    BindingInWhenOnSyntax.prototype.whenAnyAncestorMatches = function (constraint) {
	        return this._bindingWhenSyntax.whenAnyAncestorMatches(constraint);
	    };
	    BindingInWhenOnSyntax.prototype.whenNoAncestorMatches = function (constraint) {
	        return this._bindingWhenSyntax.whenNoAncestorMatches(constraint);
	    };
	    BindingInWhenOnSyntax.prototype.onActivation = function (handler) {
	        return this._bindingOnSyntax.onActivation(handler);
	    };
	    return BindingInWhenOnSyntax;
	}());

	var BindingToSyntax = (function () {
	    function BindingToSyntax(binding) {
	        this._binding = binding;
	    }
	    BindingToSyntax.prototype.to = function (constructor) {
	        this._binding.type = BindingTypeEnum.Instance;
	        this._binding.implementationType = constructor;
	        return new BindingInWhenOnSyntax(this._binding);
	    };
	    BindingToSyntax.prototype.toSelf = function () {
	        if (typeof this._binding.serviceIdentifier !== "function") {
	            throw new Error("" + INVALID_TO_SELF_VALUE);
	        }
	        var self = this._binding.serviceIdentifier;
	        return this.to(self);
	    };
	    BindingToSyntax.prototype.toConstantValue = function (value) {
	        this._binding.type = BindingTypeEnum.ConstantValue;
	        this._binding.cache = value;
	        this._binding.dynamicValue = null;
	        this._binding.implementationType = null;
	        return new BindingWhenOnSyntax(this._binding);
	    };
	    BindingToSyntax.prototype.toDynamicValue = function (func) {
	        this._binding.type = BindingTypeEnum.DynamicValue;
	        this._binding.cache = null;
	        this._binding.dynamicValue = func;
	        this._binding.implementationType = null;
	        return new BindingInWhenOnSyntax(this._binding);
	    };
	    BindingToSyntax.prototype.toConstructor = function (constructor) {
	        this._binding.type = BindingTypeEnum.Constructor;
	        this._binding.implementationType = constructor;
	        return new BindingWhenOnSyntax(this._binding);
	    };
	    BindingToSyntax.prototype.toFactory = function (factory) {
	        this._binding.type = BindingTypeEnum.Factory;
	        this._binding.factory = factory;
	        return new BindingWhenOnSyntax(this._binding);
	    };
	    BindingToSyntax.prototype.toFunction = function (func) {
	        if (typeof func !== "function") {
	            throw new Error(INVALID_FUNCTION_BINDING);
	        }
	        var bindingWhenOnSyntax = this.toConstantValue(func);
	        this._binding.type = BindingTypeEnum.Function;
	        return bindingWhenOnSyntax;
	    };
	    BindingToSyntax.prototype.toAutoFactory = function (serviceIdentifier) {
	        this._binding.type = BindingTypeEnum.Factory;
	        this._binding.factory = function (context) {
	            var autofactory = function () { return context.container.get(serviceIdentifier); };
	            return autofactory;
	        };
	        return new BindingWhenOnSyntax(this._binding);
	    };
	    BindingToSyntax.prototype.toProvider = function (provider) {
	        this._binding.type = BindingTypeEnum.Provider;
	        this._binding.provider = provider;
	        return new BindingWhenOnSyntax(this._binding);
	    };
	    BindingToSyntax.prototype.toService = function (service) {
	        this.toDynamicValue(function (context) { return context.container.get(service); });
	    };
	    return BindingToSyntax;
	}());

	var ContainerSnapshot = (function () {
	    function ContainerSnapshot() {
	    }
	    ContainerSnapshot.of = function (bindings, middleware) {
	        var snapshot = new ContainerSnapshot();
	        snapshot.bindings = bindings;
	        snapshot.middleware = middleware;
	        return snapshot;
	    };
	    return ContainerSnapshot;
	}());

	var Lookup = (function () {
	    function Lookup() {
	        this._map = new Map();
	    }
	    Lookup.prototype.getMap = function () {
	        return this._map;
	    };
	    Lookup.prototype.add = function (serviceIdentifier, value) {
	        if (serviceIdentifier === null || serviceIdentifier === undefined) {
	            throw new Error(NULL_ARGUMENT);
	        }
	        if (value === null || value === undefined) {
	            throw new Error(NULL_ARGUMENT);
	        }
	        var entry = this._map.get(serviceIdentifier);
	        if (entry !== undefined) {
	            entry.push(value);
	            this._map.set(serviceIdentifier, entry);
	        }
	        else {
	            this._map.set(serviceIdentifier, [value]);
	        }
	    };
	    Lookup.prototype.get = function (serviceIdentifier) {
	        if (serviceIdentifier === null || serviceIdentifier === undefined) {
	            throw new Error(NULL_ARGUMENT);
	        }
	        var entry = this._map.get(serviceIdentifier);
	        if (entry !== undefined) {
	            return entry;
	        }
	        else {
	            throw new Error(KEY_NOT_FOUND);
	        }
	    };
	    Lookup.prototype.remove = function (serviceIdentifier) {
	        if (serviceIdentifier === null || serviceIdentifier === undefined) {
	            throw new Error(NULL_ARGUMENT);
	        }
	        if (!this._map.delete(serviceIdentifier)) {
	            throw new Error(KEY_NOT_FOUND);
	        }
	    };
	    Lookup.prototype.removeByCondition = function (condition) {
	        var _this = this;
	        this._map.forEach(function (entries, key) {
	            var updatedEntries = entries.filter(function (entry) { return !condition(entry); });
	            if (updatedEntries.length > 0) {
	                _this._map.set(key, updatedEntries);
	            }
	            else {
	                _this._map.delete(key);
	            }
	        });
	    };
	    Lookup.prototype.hasKey = function (serviceIdentifier) {
	        if (serviceIdentifier === null || serviceIdentifier === undefined) {
	            throw new Error(NULL_ARGUMENT);
	        }
	        return this._map.has(serviceIdentifier);
	    };
	    Lookup.prototype.clone = function () {
	        var copy = new Lookup();
	        this._map.forEach(function (value, key) {
	            value.forEach(function (b) { return copy.add(key, b.clone()); });
	        });
	        return copy;
	    };
	    Lookup.prototype.traverse = function (func) {
	        this._map.forEach(function (value, key) {
	            func(key, value);
	        });
	    };
	    return Lookup;
	}());

	var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [0, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var Container = (function () {
	    function Container(containerOptions) {
	        var options = containerOptions || {};
	        if (typeof options !== "object") {
	            throw new Error("" + CONTAINER_OPTIONS_MUST_BE_AN_OBJECT);
	        }
	        if (options.defaultScope === undefined) {
	            options.defaultScope = BindingScopeEnum.Transient;
	        }
	        else if (options.defaultScope !== BindingScopeEnum.Singleton &&
	            options.defaultScope !== BindingScopeEnum.Transient &&
	            options.defaultScope !== BindingScopeEnum.Request) {
	            throw new Error("" + CONTAINER_OPTIONS_INVALID_DEFAULT_SCOPE);
	        }
	        if (options.autoBindInjectable === undefined) {
	            options.autoBindInjectable = false;
	        }
	        else if (typeof options.autoBindInjectable !== "boolean") {
	            throw new Error("" + CONTAINER_OPTIONS_INVALID_AUTO_BIND_INJECTABLE);
	        }
	        if (options.skipBaseClassChecks === undefined) {
	            options.skipBaseClassChecks = false;
	        }
	        else if (typeof options.skipBaseClassChecks !== "boolean") {
	            throw new Error("" + CONTAINER_OPTIONS_INVALID_SKIP_BASE_CHECK);
	        }
	        this.options = {
	            autoBindInjectable: options.autoBindInjectable,
	            defaultScope: options.defaultScope,
	            skipBaseClassChecks: options.skipBaseClassChecks
	        };
	        this.id = id();
	        this._bindingDictionary = new Lookup();
	        this._snapshots = [];
	        this._middleware = null;
	        this.parent = null;
	        this._metadataReader = new MetadataReader();
	    }
	    Container.merge = function (container1, container2) {
	        var container = new Container();
	        var bindingDictionary = getBindingDictionary(container);
	        var bindingDictionary1 = getBindingDictionary(container1);
	        var bindingDictionary2 = getBindingDictionary(container2);
	        function copyDictionary(origin, destination) {
	            origin.traverse(function (key, value) {
	                value.forEach(function (binding) {
	                    destination.add(binding.serviceIdentifier, binding.clone());
	                });
	            });
	        }
	        copyDictionary(bindingDictionary1, bindingDictionary);
	        copyDictionary(bindingDictionary2, bindingDictionary);
	        return container;
	    };
	    Container.prototype.load = function () {
	        var modules = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            modules[_i] = arguments[_i];
	        }
	        var getHelpers = this._getContainerModuleHelpersFactory();
	        for (var _a = 0, modules_1 = modules; _a < modules_1.length; _a++) {
	            var currentModule = modules_1[_a];
	            var containerModuleHelpers = getHelpers(currentModule.id);
	            currentModule.registry(containerModuleHelpers.bindFunction, containerModuleHelpers.unbindFunction, containerModuleHelpers.isboundFunction, containerModuleHelpers.rebindFunction);
	        }
	    };
	    Container.prototype.loadAsync = function () {
	        var modules = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            modules[_i] = arguments[_i];
	        }
	        return __awaiter(this, void 0, void 0, function () {
	            var getHelpers, _a, modules_2, currentModule, containerModuleHelpers;
	            return __generator(this, function (_b) {
	                switch (_b.label) {
	                    case 0:
	                        getHelpers = this._getContainerModuleHelpersFactory();
	                        _a = 0, modules_2 = modules;
	                        _b.label = 1;
	                    case 1:
	                        if (!(_a < modules_2.length)) return [3, 4];
	                        currentModule = modules_2[_a];
	                        containerModuleHelpers = getHelpers(currentModule.id);
	                        return [4, currentModule.registry(containerModuleHelpers.bindFunction, containerModuleHelpers.unbindFunction, containerModuleHelpers.isboundFunction, containerModuleHelpers.rebindFunction)];
	                    case 2:
	                        _b.sent();
	                        _b.label = 3;
	                    case 3:
	                        _a++;
	                        return [3, 1];
	                    case 4: return [2];
	                }
	            });
	        });
	    };
	    Container.prototype.unload = function () {
	        var _this = this;
	        var modules = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            modules[_i] = arguments[_i];
	        }
	        var conditionFactory = function (expected) { return function (item) {
	            return item.moduleId === expected;
	        }; };
	        modules.forEach(function (module) {
	            var condition = conditionFactory(module.id);
	            _this._bindingDictionary.removeByCondition(condition);
	        });
	    };
	    Container.prototype.bind = function (serviceIdentifier) {
	        var scope = this.options.defaultScope || BindingScopeEnum.Transient;
	        var binding = new Binding(serviceIdentifier, scope);
	        this._bindingDictionary.add(serviceIdentifier, binding);
	        return new BindingToSyntax(binding);
	    };
	    Container.prototype.rebind = function (serviceIdentifier) {
	        this.unbind(serviceIdentifier);
	        return this.bind(serviceIdentifier);
	    };
	    Container.prototype.unbind = function (serviceIdentifier) {
	        try {
	            this._bindingDictionary.remove(serviceIdentifier);
	        }
	        catch (e) {
	            throw new Error(CANNOT_UNBIND + " " + getServiceIdentifierAsString(serviceIdentifier));
	        }
	    };
	    Container.prototype.unbindAll = function () {
	        this._bindingDictionary = new Lookup();
	    };
	    Container.prototype.isBound = function (serviceIdentifier) {
	        var bound = this._bindingDictionary.hasKey(serviceIdentifier);
	        if (!bound && this.parent) {
	            bound = this.parent.isBound(serviceIdentifier);
	        }
	        return bound;
	    };
	    Container.prototype.isBoundNamed = function (serviceIdentifier, named) {
	        return this.isBoundTagged(serviceIdentifier, NAMED_TAG, named);
	    };
	    Container.prototype.isBoundTagged = function (serviceIdentifier, key, value) {
	        var bound = false;
	        if (this._bindingDictionary.hasKey(serviceIdentifier)) {
	            var bindings = this._bindingDictionary.get(serviceIdentifier);
	            var request_1 = createMockRequest(this, serviceIdentifier, key, value);
	            bound = bindings.some(function (b) { return b.constraint(request_1); });
	        }
	        if (!bound && this.parent) {
	            bound = this.parent.isBoundTagged(serviceIdentifier, key, value);
	        }
	        return bound;
	    };
	    Container.prototype.snapshot = function () {
	        this._snapshots.push(ContainerSnapshot.of(this._bindingDictionary.clone(), this._middleware));
	    };
	    Container.prototype.restore = function () {
	        var snapshot = this._snapshots.pop();
	        if (snapshot === undefined) {
	            throw new Error(NO_MORE_SNAPSHOTS_AVAILABLE);
	        }
	        this._bindingDictionary = snapshot.bindings;
	        this._middleware = snapshot.middleware;
	    };
	    Container.prototype.createChild = function (containerOptions) {
	        var child = new Container(containerOptions || this.options);
	        child.parent = this;
	        return child;
	    };
	    Container.prototype.applyMiddleware = function () {
	        var middlewares = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            middlewares[_i] = arguments[_i];
	        }
	        var initial = (this._middleware) ? this._middleware : this._planAndResolve();
	        this._middleware = middlewares.reduce(function (prev, curr) { return curr(prev); }, initial);
	    };
	    Container.prototype.applyCustomMetadataReader = function (metadataReader) {
	        this._metadataReader = metadataReader;
	    };
	    Container.prototype.get = function (serviceIdentifier) {
	        return this._get(false, false, TargetTypeEnum.Variable, serviceIdentifier);
	    };
	    Container.prototype.getTagged = function (serviceIdentifier, key, value) {
	        return this._get(false, false, TargetTypeEnum.Variable, serviceIdentifier, key, value);
	    };
	    Container.prototype.getNamed = function (serviceIdentifier, named) {
	        return this.getTagged(serviceIdentifier, NAMED_TAG, named);
	    };
	    Container.prototype.getAll = function (serviceIdentifier) {
	        return this._get(true, true, TargetTypeEnum.Variable, serviceIdentifier);
	    };
	    Container.prototype.getAllTagged = function (serviceIdentifier, key, value) {
	        return this._get(false, true, TargetTypeEnum.Variable, serviceIdentifier, key, value);
	    };
	    Container.prototype.getAllNamed = function (serviceIdentifier, named) {
	        return this.getAllTagged(serviceIdentifier, NAMED_TAG, named);
	    };
	    Container.prototype.resolve = function (constructorFunction) {
	        var tempContainer = this.createChild();
	        tempContainer.bind(constructorFunction).toSelf();
	        return tempContainer.get(constructorFunction);
	    };
	    Container.prototype._getContainerModuleHelpersFactory = function () {
	        var _this = this;
	        var setModuleId = function (bindingToSyntax, moduleId) {
	            bindingToSyntax._binding.moduleId = moduleId;
	        };
	        var getBindFunction = function (moduleId) {
	            return function (serviceIdentifier) {
	                var _bind = _this.bind.bind(_this);
	                var bindingToSyntax = _bind(serviceIdentifier);
	                setModuleId(bindingToSyntax, moduleId);
	                return bindingToSyntax;
	            };
	        };
	        var getUnbindFunction = function (moduleId) {
	            return function (serviceIdentifier) {
	                var _unbind = _this.unbind.bind(_this);
	                _unbind(serviceIdentifier);
	            };
	        };
	        var getIsboundFunction = function (moduleId) {
	            return function (serviceIdentifier) {
	                var _isBound = _this.isBound.bind(_this);
	                return _isBound(serviceIdentifier);
	            };
	        };
	        var getRebindFunction = function (moduleId) {
	            return function (serviceIdentifier) {
	                var _rebind = _this.rebind.bind(_this);
	                var bindingToSyntax = _rebind(serviceIdentifier);
	                setModuleId(bindingToSyntax, moduleId);
	                return bindingToSyntax;
	            };
	        };
	        return function (mId) { return ({
	            bindFunction: getBindFunction(mId),
	            isboundFunction: getIsboundFunction(),
	            rebindFunction: getRebindFunction(mId),
	            unbindFunction: getUnbindFunction()
	        }); };
	    };
	    Container.prototype._get = function (avoidConstraints, isMultiInject, targetType, serviceIdentifier, key, value) {
	        var result = null;
	        var defaultArgs = {
	            avoidConstraints: avoidConstraints,
	            contextInterceptor: function (context) { return context; },
	            isMultiInject: isMultiInject,
	            key: key,
	            serviceIdentifier: serviceIdentifier,
	            targetType: targetType,
	            value: value
	        };
	        if (this._middleware) {
	            result = this._middleware(defaultArgs);
	            if (result === undefined || result === null) {
	                throw new Error(INVALID_MIDDLEWARE_RETURN);
	            }
	        }
	        else {
	            result = this._planAndResolve()(defaultArgs);
	        }
	        return result;
	    };
	    Container.prototype._planAndResolve = function () {
	        var _this = this;
	        return function (args) {
	            var context = plan(_this._metadataReader, _this, args.isMultiInject, args.targetType, args.serviceIdentifier, args.key, args.value, args.avoidConstraints);
	            context = args.contextInterceptor(context);
	            var result = resolve(context);
	            return result;
	        };
	    };
	    return Container;
	}());

	function injectable() {
	    return function (target) {
	        if (Reflect.hasOwnMetadata(PARAM_TYPES, target)) {
	            throw new Error(DUPLICATED_INJECTABLE_DECORATOR);
	        }
	        var types = Reflect.getMetadata(DESIGN_PARAM_TYPES, target) || [];
	        Reflect.defineMetadata(PARAM_TYPES, types, target);
	        return target;
	    };
	}

	var TYPES = {
	    HXAnalytics: Symbol.for('HXAnalytics'),
	    // 应用事件层
	    AppEvent: Symbol.for('AppEvent'),
	    // 全局工具
	    Utils: Symbol.for('Utils'),
	    // API
	    Service: Symbol.for('Service'),
	    // 应用配置相关信息
	    Conf: Symbol.for('Config'),
	    // 模式
	    Browse: Symbol.for('Browse'),
	    Setting: Symbol.for('Setting'),
	    Report: Symbol.for('Report'),
	    ModeContainer: Symbol.for('ModeContainer'),
	    // 事件订阅器集合
	    EventSubscriber: Symbol.for('EventSubscriber'),
	    // 上报策略（远程服务 / 本地缓存）
	    ReportStrategy: Symbol.for('ReportStrategy'),
	    // 埋点配置相关类型
	    DomMasker: Symbol.for('DomMasker'),
	    CustomCanvas: Symbol.for('CustomCanvas'),
	    Point: Symbol.for('Point')
	};

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
	/* global Reflect, Promise */

	var extendStatics = function(d, b) {
	    extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return extendStatics(d, b);
	};

	function __extends(d, b) {
	    extendStatics(d, b);
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	var __assign = function() {
	    __assign = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};

	function __rest(s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
	            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
	                t[p[i]] = s[p[i]];
	        }
	    return t;
	}

	function __decorate(decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	}

	function __param(paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	}

	function __metadata(metadataKey, metadataValue) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
	}

	function __awaiter$1(thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	}

	function __generator$1(thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	}

	function __spreadArrays() {
	    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
	    for (var r = Array(s), k = 0, i = 0; i < il; i++)
	        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
	            r[k] = a[j];
	    return r;
	}

	// const getUserInfoByOpenID = (openID: string) => http.get('user', `/video/user?openId=${openID}`);
	// window.addEventListener('beforeunload', () => {
	//     localStorage.setItem('isUserMessageSendSuccT', JSON.stringify(Date.now()));
	//     getUserInfoByOpenID('oKXX7wKQhDf0sixuV0z-gEB8Y8is').then((res: Obj) => {
	//         console.log('用户信息: ', res);
	//         localStorage.setItem('isUserMessageSendSucc', JSON.stringify(res));
	//     })
	// })
	// const visit = _.createVisitId('SPKF');
	// console.log('访客码： ', visit);
	// 初始化 -> 校验签名是否合法
	//     非法 -> mode: none
	//     合法 -> 判断当前环境 app / iframe
	//         app -> 将本地缓存未上报的信息上报
	//              是否 B/A
	//                  是 -> mode: report
	//                  否 -> mode: none
	//         iframe -> 校验 iframe 来源是否有效
	//             有效 -> mode: catch
	//             无效 -> mode: none
	// ha 需要提供的 API : （只负责管理模式及事件推送）
	// 初始化 init | public
	// 行为事件主动上报 push | public
	// 上报统一入口 _report | private
	// 模式切换 _changeMode | private
	var HXAnalytics = /** @class */ (function () {
	    function HXAnalytics(
	    // 容器注入 | 模式
	    browse, report, setting) {
	        this.modeContainer = { browse: browse, report: report, setting: setting };
	        // this.modeContainer = modeContainer;
	    }
	    Object.defineProperty(HXAnalytics.prototype, "mode", {
	        get: function () {
	            return this._mode ? this._mode.modeType : null;
	        },
	        set: function (modeType) {
	            if (!this.modeContainer[modeType]) {
	                throw Error('Error in change mode: you are trying to enter an extra mode, please check the version of the jssdk you cited !');
	            }
	            if (this.mode === modeType)
	                return;
	            // last mode exit
	            this._mode && this._mode.onExit();
	            // 更新 mode
	            this._mode = this.modeContainer[modeType];
	            // mode enter
	            this._mode.onEnter();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    // 应用初始化入口
	    HXAnalytics.prototype.init = function (user) {
	        return __awaiter$1(this, void 0, void 0, function () {
	            var _a, err, res, _b, name, version, browser, connType, config;
	            var _this = this;
	            return __generator$1(this, function (_c) {
	                switch (_c.label) {
	                    case 0: return [4 /*yield*/, this._.errorCaptured(this.service.appLoginAPI, null, user)];
	                    case 1:
	                        _a = _c.sent(), err = _a[0], res = _a[1];
	                        // 未通过：警告
	                        if (err) {
	                            // this._.inIframe() && this.message.error('jssdk 初始化失败', 5000);
	                            this._.inIframe() && alert('jssdk 初始化失败');
	                            throw Error("jssdk login error: " + JSON.stringify(err));
	                        }
	                        _b = this._.deviceInfo(), name = _b.name, version = _b.version, browser = _b.browser, connType = _b.connType;
	                        // 通过：保存签名，登录等信息至容器 初始化当前模式
	                        this.conf.set(__assign(__assign({}, res.sysInfo), { openId: user.openId, batchId: this._.createVisitId(res.sysInfo.appId), 
	                            // 网络层系统配置
	                            sysConfig: res.sysConfig, 
	                            // 设备信息
	                            clientType: browser, sysVersion: name + " " + version, userNetWork: connType }));
	                        // this.service.setHeader();
	                        if (this._.inIframe()) {
	                            /* **************** 配置模式 **************** */
	                            // 切换模式
	                            this.mode = 'browse';
	                            config = {
	                                tag: 'appConfig',
	                                config: this.conf.getSelf()
	                            };
	                            window.parent && window.parent.postMessage(JSON.stringify(config), '*');
	                            // 绑定模式切换事件
	                            this.events.messageOf('mode').subscribe(function (msg) {
	                                // Reflect.defineMetadata('onMessageSetModeWithPoint', msg.data.points, this);
	                                _this.mode = msg.data.mode;
	                                // mode enter
	                                // this._mode.onEnter(msg.data.points);
	                            });
	                        }
	                        else {
	                            /* **************** 埋点上报模式 **************** */
	                            this.mode = 'report';
	                        }
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    // 提供应用开发人员主动埋点能力
	    HXAnalytics.prototype.push = function (data) {
	        this._mode.onTrigger(data);
	    };
	    __decorate([
	        inject(TYPES.AppEvent),
	        __metadata("design:type", Object)
	    ], HXAnalytics.prototype, "events", void 0);
	    __decorate([
	        inject(TYPES.Utils),
	        __metadata("design:type", Function)
	    ], HXAnalytics.prototype, "_", void 0);
	    __decorate([
	        inject(TYPES.Service),
	        __metadata("design:type", Object)
	    ], HXAnalytics.prototype, "service", void 0);
	    __decorate([
	        inject(TYPES.Conf),
	        __metadata("design:type", Object)
	    ], HXAnalytics.prototype, "conf", void 0);
	    HXAnalytics = __decorate([
	        injectable(),
	        __param(0, inject(TYPES.Browse)),
	        __param(1, inject(TYPES.Report)),
	        __param(2, inject(TYPES.Setting)),
	        __metadata("design:paramtypes", [Object, Object, Object])
	    ], HXAnalytics);
	    return HXAnalytics;
	}());

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function isFunction(x) {
	    return typeof x === 'function';
	}

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var _enable_super_gross_mode_that_will_cause_bad_things = false;
	var config = {
	    Promise: undefined,
	    set useDeprecatedSynchronousErrorHandling(value) {
	        if (value) {
	            var error = /*@__PURE__*/ new Error();
	            /*@__PURE__*/ console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
	        }
	        _enable_super_gross_mode_that_will_cause_bad_things = value;
	    },
	    get useDeprecatedSynchronousErrorHandling() {
	        return _enable_super_gross_mode_that_will_cause_bad_things;
	    },
	};

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function hostReportError(err) {
	    setTimeout(function () { throw err; }, 0);
	}

	/** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */
	var empty = {
	    closed: true,
	    next: function (value) { },
	    error: function (err) {
	        if (config.useDeprecatedSynchronousErrorHandling) {
	            throw err;
	        }
	        else {
	            hostReportError(err);
	        }
	    },
	    complete: function () { }
	};

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var isArray = /*@__PURE__*/ (function () { return Array.isArray || (function (x) { return x && typeof x.length === 'number'; }); })();

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function isObject(x) {
	    return x !== null && typeof x === 'object';
	}

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var UnsubscriptionErrorImpl = /*@__PURE__*/ (function () {
	    function UnsubscriptionErrorImpl(errors) {
	        Error.call(this);
	        this.message = errors ?
	            errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '';
	        this.name = 'UnsubscriptionError';
	        this.errors = errors;
	        return this;
	    }
	    UnsubscriptionErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
	    return UnsubscriptionErrorImpl;
	})();
	var UnsubscriptionError = UnsubscriptionErrorImpl;

	/** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_UnsubscriptionError PURE_IMPORTS_END */
	var Subscription = /*@__PURE__*/ (function () {
	    function Subscription(unsubscribe) {
	        this.closed = false;
	        this._parentOrParents = null;
	        this._subscriptions = null;
	        if (unsubscribe) {
	            this._unsubscribe = unsubscribe;
	        }
	    }
	    Subscription.prototype.unsubscribe = function () {
	        var errors;
	        if (this.closed) {
	            return;
	        }
	        var _a = this, _parentOrParents = _a._parentOrParents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
	        this.closed = true;
	        this._parentOrParents = null;
	        this._subscriptions = null;
	        if (_parentOrParents instanceof Subscription) {
	            _parentOrParents.remove(this);
	        }
	        else if (_parentOrParents !== null) {
	            for (var index = 0; index < _parentOrParents.length; ++index) {
	                var parent_1 = _parentOrParents[index];
	                parent_1.remove(this);
	            }
	        }
	        if (isFunction(_unsubscribe)) {
	            try {
	                _unsubscribe.call(this);
	            }
	            catch (e) {
	                errors = e instanceof UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
	            }
	        }
	        if (isArray(_subscriptions)) {
	            var index = -1;
	            var len = _subscriptions.length;
	            while (++index < len) {
	                var sub = _subscriptions[index];
	                if (isObject(sub)) {
	                    try {
	                        sub.unsubscribe();
	                    }
	                    catch (e) {
	                        errors = errors || [];
	                        if (e instanceof UnsubscriptionError) {
	                            errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
	                        }
	                        else {
	                            errors.push(e);
	                        }
	                    }
	                }
	            }
	        }
	        if (errors) {
	            throw new UnsubscriptionError(errors);
	        }
	    };
	    Subscription.prototype.add = function (teardown) {
	        var subscription = teardown;
	        if (!teardown) {
	            return Subscription.EMPTY;
	        }
	        switch (typeof teardown) {
	            case 'function':
	                subscription = new Subscription(teardown);
	            case 'object':
	                if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
	                    return subscription;
	                }
	                else if (this.closed) {
	                    subscription.unsubscribe();
	                    return subscription;
	                }
	                else if (!(subscription instanceof Subscription)) {
	                    var tmp = subscription;
	                    subscription = new Subscription();
	                    subscription._subscriptions = [tmp];
	                }
	                break;
	            default: {
	                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
	            }
	        }
	        var _parentOrParents = subscription._parentOrParents;
	        if (_parentOrParents === null) {
	            subscription._parentOrParents = this;
	        }
	        else if (_parentOrParents instanceof Subscription) {
	            if (_parentOrParents === this) {
	                return subscription;
	            }
	            subscription._parentOrParents = [_parentOrParents, this];
	        }
	        else if (_parentOrParents.indexOf(this) === -1) {
	            _parentOrParents.push(this);
	        }
	        else {
	            return subscription;
	        }
	        var subscriptions = this._subscriptions;
	        if (subscriptions === null) {
	            this._subscriptions = [subscription];
	        }
	        else {
	            subscriptions.push(subscription);
	        }
	        return subscription;
	    };
	    Subscription.prototype.remove = function (subscription) {
	        var subscriptions = this._subscriptions;
	        if (subscriptions) {
	            var subscriptionIndex = subscriptions.indexOf(subscription);
	            if (subscriptionIndex !== -1) {
	                subscriptions.splice(subscriptionIndex, 1);
	            }
	        }
	    };
	    Subscription.EMPTY = (function (empty) {
	        empty.closed = true;
	        return empty;
	    }(new Subscription()));
	    return Subscription;
	}());
	function flattenUnsubscriptionErrors(errors) {
	    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError) ? err.errors : err); }, []);
	}

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var rxSubscriber = /*@__PURE__*/ (function () {
	    return typeof Symbol === 'function'
	        ? /*@__PURE__*/ Symbol('rxSubscriber')
	        : '@@rxSubscriber_' + /*@__PURE__*/ Math.random();
	})();

	/** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */
	var Subscriber = /*@__PURE__*/ (function (_super) {
	    __extends(Subscriber, _super);
	    function Subscriber(destinationOrNext, error, complete) {
	        var _this = _super.call(this) || this;
	        _this.syncErrorValue = null;
	        _this.syncErrorThrown = false;
	        _this.syncErrorThrowable = false;
	        _this.isStopped = false;
	        switch (arguments.length) {
	            case 0:
	                _this.destination = empty;
	                break;
	            case 1:
	                if (!destinationOrNext) {
	                    _this.destination = empty;
	                    break;
	                }
	                if (typeof destinationOrNext === 'object') {
	                    if (destinationOrNext instanceof Subscriber) {
	                        _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
	                        _this.destination = destinationOrNext;
	                        destinationOrNext.add(_this);
	                    }
	                    else {
	                        _this.syncErrorThrowable = true;
	                        _this.destination = new SafeSubscriber(_this, destinationOrNext);
	                    }
	                    break;
	                }
	            default:
	                _this.syncErrorThrowable = true;
	                _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
	                break;
	        }
	        return _this;
	    }
	    Subscriber.prototype[rxSubscriber] = function () { return this; };
	    Subscriber.create = function (next, error, complete) {
	        var subscriber = new Subscriber(next, error, complete);
	        subscriber.syncErrorThrowable = false;
	        return subscriber;
	    };
	    Subscriber.prototype.next = function (value) {
	        if (!this.isStopped) {
	            this._next(value);
	        }
	    };
	    Subscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            this.isStopped = true;
	            this._error(err);
	        }
	    };
	    Subscriber.prototype.complete = function () {
	        if (!this.isStopped) {
	            this.isStopped = true;
	            this._complete();
	        }
	    };
	    Subscriber.prototype.unsubscribe = function () {
	        if (this.closed) {
	            return;
	        }
	        this.isStopped = true;
	        _super.prototype.unsubscribe.call(this);
	    };
	    Subscriber.prototype._next = function (value) {
	        this.destination.next(value);
	    };
	    Subscriber.prototype._error = function (err) {
	        this.destination.error(err);
	        this.unsubscribe();
	    };
	    Subscriber.prototype._complete = function () {
	        this.destination.complete();
	        this.unsubscribe();
	    };
	    Subscriber.prototype._unsubscribeAndRecycle = function () {
	        var _parentOrParents = this._parentOrParents;
	        this._parentOrParents = null;
	        this.unsubscribe();
	        this.closed = false;
	        this.isStopped = false;
	        this._parentOrParents = _parentOrParents;
	        return this;
	    };
	    return Subscriber;
	}(Subscription));
	var SafeSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(SafeSubscriber, _super);
	    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
	        var _this = _super.call(this) || this;
	        _this._parentSubscriber = _parentSubscriber;
	        var next;
	        var context = _this;
	        if (isFunction(observerOrNext)) {
	            next = observerOrNext;
	        }
	        else if (observerOrNext) {
	            next = observerOrNext.next;
	            error = observerOrNext.error;
	            complete = observerOrNext.complete;
	            if (observerOrNext !== empty) {
	                context = Object.create(observerOrNext);
	                if (isFunction(context.unsubscribe)) {
	                    _this.add(context.unsubscribe.bind(context));
	                }
	                context.unsubscribe = _this.unsubscribe.bind(_this);
	            }
	        }
	        _this._context = context;
	        _this._next = next;
	        _this._error = error;
	        _this._complete = complete;
	        return _this;
	    }
	    SafeSubscriber.prototype.next = function (value) {
	        if (!this.isStopped && this._next) {
	            var _parentSubscriber = this._parentSubscriber;
	            if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
	                this.__tryOrUnsub(this._next, value);
	            }
	            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            var _parentSubscriber = this._parentSubscriber;
	            var useDeprecatedSynchronousErrorHandling = config.useDeprecatedSynchronousErrorHandling;
	            if (this._error) {
	                if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
	                    this.__tryOrUnsub(this._error, err);
	                    this.unsubscribe();
	                }
	                else {
	                    this.__tryOrSetError(_parentSubscriber, this._error, err);
	                    this.unsubscribe();
	                }
	            }
	            else if (!_parentSubscriber.syncErrorThrowable) {
	                this.unsubscribe();
	                if (useDeprecatedSynchronousErrorHandling) {
	                    throw err;
	                }
	                hostReportError(err);
	            }
	            else {
	                if (useDeprecatedSynchronousErrorHandling) {
	                    _parentSubscriber.syncErrorValue = err;
	                    _parentSubscriber.syncErrorThrown = true;
	                }
	                else {
	                    hostReportError(err);
	                }
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.complete = function () {
	        var _this = this;
	        if (!this.isStopped) {
	            var _parentSubscriber = this._parentSubscriber;
	            if (this._complete) {
	                var wrappedComplete = function () { return _this._complete.call(_this._context); };
	                if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
	                    this.__tryOrUnsub(wrappedComplete);
	                    this.unsubscribe();
	                }
	                else {
	                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
	                    this.unsubscribe();
	                }
	            }
	            else {
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
	        try {
	            fn.call(this._context, value);
	        }
	        catch (err) {
	            this.unsubscribe();
	            if (config.useDeprecatedSynchronousErrorHandling) {
	                throw err;
	            }
	            else {
	                hostReportError(err);
	            }
	        }
	    };
	    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
	        if (!config.useDeprecatedSynchronousErrorHandling) {
	            throw new Error('bad call');
	        }
	        try {
	            fn.call(this._context, value);
	        }
	        catch (err) {
	            if (config.useDeprecatedSynchronousErrorHandling) {
	                parent.syncErrorValue = err;
	                parent.syncErrorThrown = true;
	                return true;
	            }
	            else {
	                hostReportError(err);
	                return true;
	            }
	        }
	        return false;
	    };
	    SafeSubscriber.prototype._unsubscribe = function () {
	        var _parentSubscriber = this._parentSubscriber;
	        this._context = null;
	        this._parentSubscriber = null;
	        _parentSubscriber.unsubscribe();
	    };
	    return SafeSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START _Subscriber PURE_IMPORTS_END */
	function canReportError(observer) {
	    while (observer) {
	        var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
	        if (closed_1 || isStopped) {
	            return false;
	        }
	        else if (destination && destination instanceof Subscriber) {
	            observer = destination;
	        }
	        else {
	            observer = null;
	        }
	    }
	    return true;
	}

	/** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */
	function toSubscriber(nextOrObserver, error, complete) {
	    if (nextOrObserver) {
	        if (nextOrObserver instanceof Subscriber) {
	            return nextOrObserver;
	        }
	        if (nextOrObserver[rxSubscriber]) {
	            return nextOrObserver[rxSubscriber]();
	        }
	    }
	    if (!nextOrObserver && !error && !complete) {
	        return new Subscriber(empty);
	    }
	    return new Subscriber(nextOrObserver, error, complete);
	}

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var observable = /*@__PURE__*/ (function () { return typeof Symbol === 'function' && Symbol.observable || '@@observable'; })();

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function noop() { }

	/** PURE_IMPORTS_START _noop PURE_IMPORTS_END */
	function pipeFromArray(fns) {
	    if (!fns) {
	        return noop;
	    }
	    if (fns.length === 1) {
	        return fns[0];
	    }
	    return function piped(input) {
	        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
	    };
	}

	/** PURE_IMPORTS_START _util_canReportError,_util_toSubscriber,_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */
	var Observable = /*@__PURE__*/ (function () {
	    function Observable(subscribe) {
	        this._isScalar = false;
	        if (subscribe) {
	            this._subscribe = subscribe;
	        }
	    }
	    Observable.prototype.lift = function (operator) {
	        var observable = new Observable();
	        observable.source = this;
	        observable.operator = operator;
	        return observable;
	    };
	    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
	        var operator = this.operator;
	        var sink = toSubscriber(observerOrNext, error, complete);
	        if (operator) {
	            sink.add(operator.call(sink, this.source));
	        }
	        else {
	            sink.add(this.source || (config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
	                this._subscribe(sink) :
	                this._trySubscribe(sink));
	        }
	        if (config.useDeprecatedSynchronousErrorHandling) {
	            if (sink.syncErrorThrowable) {
	                sink.syncErrorThrowable = false;
	                if (sink.syncErrorThrown) {
	                    throw sink.syncErrorValue;
	                }
	            }
	        }
	        return sink;
	    };
	    Observable.prototype._trySubscribe = function (sink) {
	        try {
	            return this._subscribe(sink);
	        }
	        catch (err) {
	            if (config.useDeprecatedSynchronousErrorHandling) {
	                sink.syncErrorThrown = true;
	                sink.syncErrorValue = err;
	            }
	            if (canReportError(sink)) {
	                sink.error(err);
	            }
	            else {
	                console.warn(err);
	            }
	        }
	    };
	    Observable.prototype.forEach = function (next, promiseCtor) {
	        var _this = this;
	        promiseCtor = getPromiseCtor(promiseCtor);
	        return new promiseCtor(function (resolve, reject) {
	            var subscription;
	            subscription = _this.subscribe(function (value) {
	                try {
	                    next(value);
	                }
	                catch (err) {
	                    reject(err);
	                    if (subscription) {
	                        subscription.unsubscribe();
	                    }
	                }
	            }, reject, resolve);
	        });
	    };
	    Observable.prototype._subscribe = function (subscriber) {
	        var source = this.source;
	        return source && source.subscribe(subscriber);
	    };
	    Observable.prototype[observable] = function () {
	        return this;
	    };
	    Observable.prototype.pipe = function () {
	        var operations = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            operations[_i] = arguments[_i];
	        }
	        if (operations.length === 0) {
	            return this;
	        }
	        return pipeFromArray(operations)(this);
	    };
	    Observable.prototype.toPromise = function (promiseCtor) {
	        var _this = this;
	        promiseCtor = getPromiseCtor(promiseCtor);
	        return new promiseCtor(function (resolve, reject) {
	            var value;
	            _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
	        });
	    };
	    Observable.create = function (subscribe) {
	        return new Observable(subscribe);
	    };
	    return Observable;
	}());
	function getPromiseCtor(promiseCtor) {
	    if (!promiseCtor) {
	        promiseCtor =  Promise;
	    }
	    if (!promiseCtor) {
	        throw new Error('no Promise impl found');
	    }
	    return promiseCtor;
	}

	/** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
	var Action = /*@__PURE__*/ (function (_super) {
	    __extends(Action, _super);
	    function Action(scheduler, work) {
	        return _super.call(this) || this;
	    }
	    Action.prototype.schedule = function (state, delay) {
	        return this;
	    };
	    return Action;
	}(Subscription));

	/** PURE_IMPORTS_START tslib,_Action PURE_IMPORTS_END */
	var AsyncAction = /*@__PURE__*/ (function (_super) {
	    __extends(AsyncAction, _super);
	    function AsyncAction(scheduler, work) {
	        var _this = _super.call(this, scheduler, work) || this;
	        _this.scheduler = scheduler;
	        _this.work = work;
	        _this.pending = false;
	        return _this;
	    }
	    AsyncAction.prototype.schedule = function (state, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if (this.closed) {
	            return this;
	        }
	        this.state = state;
	        var id = this.id;
	        var scheduler = this.scheduler;
	        if (id != null) {
	            this.id = this.recycleAsyncId(scheduler, id, delay);
	        }
	        this.pending = true;
	        this.delay = delay;
	        this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
	        return this;
	    };
	    AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        return setInterval(scheduler.flush.bind(scheduler, this), delay);
	    };
	    AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if (delay !== null && this.delay === delay && this.pending === false) {
	            return id;
	        }
	        clearInterval(id);
	        return undefined;
	    };
	    AsyncAction.prototype.execute = function (state, delay) {
	        if (this.closed) {
	            return new Error('executing a cancelled action');
	        }
	        this.pending = false;
	        var error = this._execute(state, delay);
	        if (error) {
	            return error;
	        }
	        else if (this.pending === false && this.id != null) {
	            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
	        }
	    };
	    AsyncAction.prototype._execute = function (state, delay) {
	        var errored = false;
	        var errorValue = undefined;
	        try {
	            this.work(state);
	        }
	        catch (e) {
	            errored = true;
	            errorValue = !!e && e || new Error(e);
	        }
	        if (errored) {
	            this.unsubscribe();
	            return errorValue;
	        }
	    };
	    AsyncAction.prototype._unsubscribe = function () {
	        var id = this.id;
	        var scheduler = this.scheduler;
	        var actions = scheduler.actions;
	        var index = actions.indexOf(this);
	        this.work = null;
	        this.state = null;
	        this.pending = false;
	        this.scheduler = null;
	        if (index !== -1) {
	            actions.splice(index, 1);
	        }
	        if (id != null) {
	            this.id = this.recycleAsyncId(scheduler, id, null);
	        }
	        this.delay = null;
	    };
	    return AsyncAction;
	}(Action));

	var Scheduler = /*@__PURE__*/ (function () {
	    function Scheduler(SchedulerAction, now) {
	        if (now === void 0) {
	            now = Scheduler.now;
	        }
	        this.SchedulerAction = SchedulerAction;
	        this.now = now;
	    }
	    Scheduler.prototype.schedule = function (work, delay, state) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        return new this.SchedulerAction(this, work).schedule(state, delay);
	    };
	    Scheduler.now = function () { return Date.now(); };
	    return Scheduler;
	}());

	/** PURE_IMPORTS_START tslib,_Scheduler PURE_IMPORTS_END */
	var AsyncScheduler = /*@__PURE__*/ (function (_super) {
	    __extends(AsyncScheduler, _super);
	    function AsyncScheduler(SchedulerAction, now) {
	        if (now === void 0) {
	            now = Scheduler.now;
	        }
	        var _this = _super.call(this, SchedulerAction, function () {
	            if (AsyncScheduler.delegate && AsyncScheduler.delegate !== _this) {
	                return AsyncScheduler.delegate.now();
	            }
	            else {
	                return now();
	            }
	        }) || this;
	        _this.actions = [];
	        _this.active = false;
	        _this.scheduled = undefined;
	        return _this;
	    }
	    AsyncScheduler.prototype.schedule = function (work, delay, state) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
	            return AsyncScheduler.delegate.schedule(work, delay, state);
	        }
	        else {
	            return _super.prototype.schedule.call(this, work, delay, state);
	        }
	    };
	    AsyncScheduler.prototype.flush = function (action) {
	        var actions = this.actions;
	        if (this.active) {
	            actions.push(action);
	            return;
	        }
	        var error;
	        this.active = true;
	        do {
	            if (error = action.execute(action.state, action.delay)) {
	                break;
	            }
	        } while (action = actions.shift());
	        this.active = false;
	        if (error) {
	            while (action = actions.shift()) {
	                action.unsubscribe();
	            }
	            throw error;
	        }
	    };
	    return AsyncScheduler;
	}(Scheduler));

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function isScheduler(value) {
	    return value && typeof value.schedule === 'function';
	}

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var subscribeToArray = function (array) {
	    return function (subscriber) {
	        for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
	            subscriber.next(array[i]);
	        }
	        subscriber.complete();
	    };
	};

	/** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
	function scheduleArray(input, scheduler) {
	    return new Observable(function (subscriber) {
	        var sub = new Subscription();
	        var i = 0;
	        sub.add(scheduler.schedule(function () {
	            if (i === input.length) {
	                subscriber.complete();
	                return;
	            }
	            subscriber.next(input[i++]);
	            if (!subscriber.closed) {
	                sub.add(this.schedule());
	            }
	        }));
	        return sub;
	    });
	}

	/** PURE_IMPORTS_START _Observable,_util_subscribeToArray,_scheduled_scheduleArray PURE_IMPORTS_END */
	function fromArray(input, scheduler) {
	    if (!scheduler) {
	        return new Observable(subscribeToArray(input));
	    }
	    else {
	        return scheduleArray(input, scheduler);
	    }
	}

	/** PURE_IMPORTS_START _AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
	var async = /*@__PURE__*/ new AsyncScheduler(AsyncAction);

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function identity(x) {
	    return x;
	}

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	function map(project, thisArg) {
	    return function mapOperation(source) {
	        if (typeof project !== 'function') {
	            throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
	        }
	        return source.lift(new MapOperator(project, thisArg));
	    };
	}
	var MapOperator = /*@__PURE__*/ (function () {
	    function MapOperator(project, thisArg) {
	        this.project = project;
	        this.thisArg = thisArg;
	    }
	    MapOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
	    };
	    return MapOperator;
	}());
	var MapSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(MapSubscriber, _super);
	    function MapSubscriber(destination, project, thisArg) {
	        var _this = _super.call(this, destination) || this;
	        _this.project = project;
	        _this.count = 0;
	        _this.thisArg = thisArg || _this;
	        return _this;
	    }
	    MapSubscriber.prototype._next = function (value) {
	        var result;
	        try {
	            result = this.project.call(this.thisArg, value, this.count++);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.destination.next(result);
	    };
	    return MapSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var OuterSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(OuterSubscriber, _super);
	    function OuterSubscriber() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.destination.next(innerValue);
	    };
	    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
	        this.destination.error(error);
	    };
	    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
	        this.destination.complete();
	    };
	    return OuterSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var InnerSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(InnerSubscriber, _super);
	    function InnerSubscriber(parent, outerValue, outerIndex) {
	        var _this = _super.call(this) || this;
	        _this.parent = parent;
	        _this.outerValue = outerValue;
	        _this.outerIndex = outerIndex;
	        _this.index = 0;
	        return _this;
	    }
	    InnerSubscriber.prototype._next = function (value) {
	        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
	    };
	    InnerSubscriber.prototype._error = function (error) {
	        this.parent.notifyError(error, this);
	        this.unsubscribe();
	    };
	    InnerSubscriber.prototype._complete = function () {
	        this.parent.notifyComplete(this);
	        this.unsubscribe();
	    };
	    return InnerSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START _hostReportError PURE_IMPORTS_END */
	var subscribeToPromise = function (promise) {
	    return function (subscriber) {
	        promise.then(function (value) {
	            if (!subscriber.closed) {
	                subscriber.next(value);
	                subscriber.complete();
	            }
	        }, function (err) { return subscriber.error(err); })
	            .then(null, hostReportError);
	        return subscriber;
	    };
	};

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function getSymbolIterator() {
	    if (typeof Symbol !== 'function' || !Symbol.iterator) {
	        return '@@iterator';
	    }
	    return Symbol.iterator;
	}
	var iterator = /*@__PURE__*/ getSymbolIterator();

	/** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
	var subscribeToIterable = function (iterable) {
	    return function (subscriber) {
	        var iterator$1 = iterable[iterator]();
	        do {
	            var item = iterator$1.next();
	            if (item.done) {
	                subscriber.complete();
	                break;
	            }
	            subscriber.next(item.value);
	            if (subscriber.closed) {
	                break;
	            }
	        } while (true);
	        if (typeof iterator$1.return === 'function') {
	            subscriber.add(function () {
	                if (iterator$1.return) {
	                    iterator$1.return();
	                }
	            });
	        }
	        return subscriber;
	    };
	};

	/** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
	var subscribeToObservable = function (obj) {
	    return function (subscriber) {
	        var obs = obj[observable]();
	        if (typeof obs.subscribe !== 'function') {
	            throw new TypeError('Provided object does not correctly implement Symbol.observable');
	        }
	        else {
	            return obs.subscribe(subscriber);
	        }
	    };
	};

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function isPromise(value) {
	    return !!value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
	}

	/** PURE_IMPORTS_START _subscribeToArray,_subscribeToPromise,_subscribeToIterable,_subscribeToObservable,_isArrayLike,_isPromise,_isObject,_symbol_iterator,_symbol_observable PURE_IMPORTS_END */
	var subscribeTo = function (result) {
	    if (!!result && typeof result[observable] === 'function') {
	        return subscribeToObservable(result);
	    }
	    else if (isArrayLike(result)) {
	        return subscribeToArray(result);
	    }
	    else if (isPromise(result)) {
	        return subscribeToPromise(result);
	    }
	    else if (!!result && typeof result[iterator] === 'function') {
	        return subscribeToIterable(result);
	    }
	    else {
	        var value = isObject(result) ? 'an invalid object' : "'" + result + "'";
	        var msg = "You provided " + value + " where a stream was expected."
	            + ' You can provide an Observable, Promise, Array, or Iterable.';
	        throw new TypeError(msg);
	    }
	};

	/** PURE_IMPORTS_START _InnerSubscriber,_subscribeTo,_Observable PURE_IMPORTS_END */
	function subscribeToResult(outerSubscriber, result, outerValue, outerIndex, destination) {
	    if (destination === void 0) {
	        destination = new InnerSubscriber(outerSubscriber, outerValue, outerIndex);
	    }
	    if (destination.closed) {
	        return undefined;
	    }
	    if (result instanceof Observable) {
	        return result.subscribe(destination);
	    }
	    return subscribeTo(result)(destination);
	}

	/** PURE_IMPORTS_START _Observable,_Subscription,_symbol_observable PURE_IMPORTS_END */
	function scheduleObservable(input, scheduler) {
	    return new Observable(function (subscriber) {
	        var sub = new Subscription();
	        sub.add(scheduler.schedule(function () {
	            var observable$1 = input[observable]();
	            sub.add(observable$1.subscribe({
	                next: function (value) { sub.add(scheduler.schedule(function () { return subscriber.next(value); })); },
	                error: function (err) { sub.add(scheduler.schedule(function () { return subscriber.error(err); })); },
	                complete: function () { sub.add(scheduler.schedule(function () { return subscriber.complete(); })); },
	            }));
	        }));
	        return sub;
	    });
	}

	/** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
	function schedulePromise(input, scheduler) {
	    return new Observable(function (subscriber) {
	        var sub = new Subscription();
	        sub.add(scheduler.schedule(function () {
	            return input.then(function (value) {
	                sub.add(scheduler.schedule(function () {
	                    subscriber.next(value);
	                    sub.add(scheduler.schedule(function () { return subscriber.complete(); }));
	                }));
	            }, function (err) {
	                sub.add(scheduler.schedule(function () { return subscriber.error(err); }));
	            });
	        }));
	        return sub;
	    });
	}

	/** PURE_IMPORTS_START _Observable,_Subscription,_symbol_iterator PURE_IMPORTS_END */
	function scheduleIterable(input, scheduler) {
	    if (!input) {
	        throw new Error('Iterable cannot be null');
	    }
	    return new Observable(function (subscriber) {
	        var sub = new Subscription();
	        var iterator$1;
	        sub.add(function () {
	            if (iterator$1 && typeof iterator$1.return === 'function') {
	                iterator$1.return();
	            }
	        });
	        sub.add(scheduler.schedule(function () {
	            iterator$1 = input[iterator]();
	            sub.add(scheduler.schedule(function () {
	                if (subscriber.closed) {
	                    return;
	                }
	                var value;
	                var done;
	                try {
	                    var result = iterator$1.next();
	                    value = result.value;
	                    done = result.done;
	                }
	                catch (err) {
	                    subscriber.error(err);
	                    return;
	                }
	                if (done) {
	                    subscriber.complete();
	                }
	                else {
	                    subscriber.next(value);
	                    this.schedule();
	                }
	            }));
	        }));
	        return sub;
	    });
	}

	/** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
	function isInteropObservable(input) {
	    return input && typeof input[observable] === 'function';
	}

	/** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
	function isIterable(input) {
	    return input && typeof input[iterator] === 'function';
	}

	/** PURE_IMPORTS_START _scheduleObservable,_schedulePromise,_scheduleArray,_scheduleIterable,_util_isInteropObservable,_util_isPromise,_util_isArrayLike,_util_isIterable PURE_IMPORTS_END */
	function scheduled(input, scheduler) {
	    if (input != null) {
	        if (isInteropObservable(input)) {
	            return scheduleObservable(input, scheduler);
	        }
	        else if (isPromise(input)) {
	            return schedulePromise(input, scheduler);
	        }
	        else if (isArrayLike(input)) {
	            return scheduleArray(input, scheduler);
	        }
	        else if (isIterable(input) || typeof input === 'string') {
	            return scheduleIterable(input, scheduler);
	        }
	    }
	    throw new TypeError((input !== null && typeof input || input) + ' is not observable');
	}

	/** PURE_IMPORTS_START _Observable,_util_subscribeTo,_scheduled_scheduled PURE_IMPORTS_END */
	function from(input, scheduler) {
	    if (!scheduler) {
	        if (input instanceof Observable) {
	            return input;
	        }
	        return new Observable(subscribeTo(input));
	    }
	    else {
	        return scheduled(input, scheduler);
	    }
	}

	/** PURE_IMPORTS_START tslib,_util_subscribeToResult,_OuterSubscriber,_InnerSubscriber,_map,_observable_from PURE_IMPORTS_END */
	function mergeMap(project, resultSelector, concurrent) {
	    if (concurrent === void 0) {
	        concurrent = Number.POSITIVE_INFINITY;
	    }
	    if (typeof resultSelector === 'function') {
	        return function (source) { return source.pipe(mergeMap(function (a, i) { return from(project(a, i)).pipe(map(function (b, ii) { return resultSelector(a, b, i, ii); })); }, concurrent)); };
	    }
	    else if (typeof resultSelector === 'number') {
	        concurrent = resultSelector;
	    }
	    return function (source) { return source.lift(new MergeMapOperator(project, concurrent)); };
	}
	var MergeMapOperator = /*@__PURE__*/ (function () {
	    function MergeMapOperator(project, concurrent) {
	        if (concurrent === void 0) {
	            concurrent = Number.POSITIVE_INFINITY;
	        }
	        this.project = project;
	        this.concurrent = concurrent;
	    }
	    MergeMapOperator.prototype.call = function (observer, source) {
	        return source.subscribe(new MergeMapSubscriber(observer, this.project, this.concurrent));
	    };
	    return MergeMapOperator;
	}());
	var MergeMapSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(MergeMapSubscriber, _super);
	    function MergeMapSubscriber(destination, project, concurrent) {
	        if (concurrent === void 0) {
	            concurrent = Number.POSITIVE_INFINITY;
	        }
	        var _this = _super.call(this, destination) || this;
	        _this.project = project;
	        _this.concurrent = concurrent;
	        _this.hasCompleted = false;
	        _this.buffer = [];
	        _this.active = 0;
	        _this.index = 0;
	        return _this;
	    }
	    MergeMapSubscriber.prototype._next = function (value) {
	        if (this.active < this.concurrent) {
	            this._tryNext(value);
	        }
	        else {
	            this.buffer.push(value);
	        }
	    };
	    MergeMapSubscriber.prototype._tryNext = function (value) {
	        var result;
	        var index = this.index++;
	        try {
	            result = this.project(value, index);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.active++;
	        this._innerSub(result, value, index);
	    };
	    MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
	        var innerSubscriber = new InnerSubscriber(this, undefined, undefined);
	        var destination = this.destination;
	        destination.add(innerSubscriber);
	        subscribeToResult(this, ish, value, index, innerSubscriber);
	    };
	    MergeMapSubscriber.prototype._complete = function () {
	        this.hasCompleted = true;
	        if (this.active === 0 && this.buffer.length === 0) {
	            this.destination.complete();
	        }
	        this.unsubscribe();
	    };
	    MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.destination.next(innerValue);
	    };
	    MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
	        var buffer = this.buffer;
	        this.remove(innerSub);
	        this.active--;
	        if (buffer.length > 0) {
	            this._next(buffer.shift());
	        }
	        else if (this.active === 0 && this.hasCompleted) {
	            this.destination.complete();
	        }
	    };
	    return MergeMapSubscriber;
	}(OuterSubscriber));

	/** PURE_IMPORTS_START _mergeMap,_util_identity PURE_IMPORTS_END */
	function mergeAll(concurrent) {
	    if (concurrent === void 0) {
	        concurrent = Number.POSITIVE_INFINITY;
	    }
	    return mergeMap(identity, concurrent);
	}

	/** PURE_IMPORTS_START _Observable,_util_isArray,_util_isFunction,_operators_map PURE_IMPORTS_END */
	function fromEvent(target, eventName, options, resultSelector) {
	    if (isFunction(options)) {
	        resultSelector = options;
	        options = undefined;
	    }
	    if (resultSelector) {
	        return fromEvent(target, eventName, options).pipe(map(function (args) { return isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args); }));
	    }
	    return new Observable(function (subscriber) {
	        function handler(e) {
	            if (arguments.length > 1) {
	                subscriber.next(Array.prototype.slice.call(arguments));
	            }
	            else {
	                subscriber.next(e);
	            }
	        }
	        setupSubscription(target, eventName, handler, subscriber, options);
	    });
	}
	function setupSubscription(sourceObj, eventName, handler, subscriber, options) {
	    var unsubscribe;
	    if (isEventTarget(sourceObj)) {
	        var source_1 = sourceObj;
	        sourceObj.addEventListener(eventName, handler, options);
	        unsubscribe = function () { return source_1.removeEventListener(eventName, handler, options); };
	    }
	    else if (isJQueryStyleEventEmitter(sourceObj)) {
	        var source_2 = sourceObj;
	        sourceObj.on(eventName, handler);
	        unsubscribe = function () { return source_2.off(eventName, handler); };
	    }
	    else if (isNodeStyleEventEmitter(sourceObj)) {
	        var source_3 = sourceObj;
	        sourceObj.addListener(eventName, handler);
	        unsubscribe = function () { return source_3.removeListener(eventName, handler); };
	    }
	    else if (sourceObj && sourceObj.length) {
	        for (var i = 0, len = sourceObj.length; i < len; i++) {
	            setupSubscription(sourceObj[i], eventName, handler, subscriber, options);
	        }
	    }
	    else {
	        throw new TypeError('Invalid event target');
	    }
	    subscriber.add(unsubscribe);
	}
	function isNodeStyleEventEmitter(sourceObj) {
	    return sourceObj && typeof sourceObj.addListener === 'function' && typeof sourceObj.removeListener === 'function';
	}
	function isJQueryStyleEventEmitter(sourceObj) {
	    return sourceObj && typeof sourceObj.on === 'function' && typeof sourceObj.off === 'function';
	}
	function isEventTarget(sourceObj) {
	    return sourceObj && typeof sourceObj.addEventListener === 'function' && typeof sourceObj.removeEventListener === 'function';
	}

	/** PURE_IMPORTS_START _Observable,_util_isScheduler,_operators_mergeAll,_fromArray PURE_IMPORTS_END */
	function merge() {
	    var observables = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        observables[_i] = arguments[_i];
	    }
	    var concurrent = Number.POSITIVE_INFINITY;
	    var scheduler = null;
	    var last = observables[observables.length - 1];
	    if (isScheduler(last)) {
	        scheduler = observables.pop();
	        if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
	            concurrent = observables.pop();
	        }
	    }
	    else if (typeof last === 'number') {
	        concurrent = observables.pop();
	    }
	    if (scheduler === null && observables.length === 1 && observables[0] instanceof Observable) {
	        return observables[0];
	    }
	    return mergeAll(concurrent)(fromArray(observables, scheduler));
	}

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	function filter(predicate, thisArg) {
	    return function filterOperatorFunction(source) {
	        return source.lift(new FilterOperator(predicate, thisArg));
	    };
	}
	var FilterOperator = /*@__PURE__*/ (function () {
	    function FilterOperator(predicate, thisArg) {
	        this.predicate = predicate;
	        this.thisArg = thisArg;
	    }
	    FilterOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
	    };
	    return FilterOperator;
	}());
	var FilterSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(FilterSubscriber, _super);
	    function FilterSubscriber(destination, predicate, thisArg) {
	        var _this = _super.call(this, destination) || this;
	        _this.predicate = predicate;
	        _this.thisArg = thisArg;
	        _this.count = 0;
	        return _this;
	    }
	    FilterSubscriber.prototype._next = function (value) {
	        var result;
	        try {
	            result = this.predicate.call(this.thisArg, value, this.count++);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        if (result) {
	            this.destination.next(value);
	        }
	    };
	    return FilterSubscriber;
	}(Subscriber));

	/** PURE_IMPORTS_START tslib,_Subscriber,_scheduler_async PURE_IMPORTS_END */
	function sampleTime(period, scheduler) {
	    if (scheduler === void 0) {
	        scheduler = async;
	    }
	    return function (source) { return source.lift(new SampleTimeOperator(period, scheduler)); };
	}
	var SampleTimeOperator = /*@__PURE__*/ (function () {
	    function SampleTimeOperator(period, scheduler) {
	        this.period = period;
	        this.scheduler = scheduler;
	    }
	    SampleTimeOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new SampleTimeSubscriber(subscriber, this.period, this.scheduler));
	    };
	    return SampleTimeOperator;
	}());
	var SampleTimeSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(SampleTimeSubscriber, _super);
	    function SampleTimeSubscriber(destination, period, scheduler) {
	        var _this = _super.call(this, destination) || this;
	        _this.period = period;
	        _this.scheduler = scheduler;
	        _this.hasValue = false;
	        _this.add(scheduler.schedule(dispatchNotification, period, { subscriber: _this, period: period }));
	        return _this;
	    }
	    SampleTimeSubscriber.prototype._next = function (value) {
	        this.lastValue = value;
	        this.hasValue = true;
	    };
	    SampleTimeSubscriber.prototype.notifyNext = function () {
	        if (this.hasValue) {
	            this.hasValue = false;
	            this.destination.next(this.lastValue);
	        }
	    };
	    return SampleTimeSubscriber;
	}(Subscriber));
	function dispatchNotification(state) {
	    var subscriber = state.subscriber, period = state.period;
	    subscriber.notifyNext();
	    this.schedule(state, period);
	}

	// const DomEvent = (target: HTMLElement, eventName: string, options: EventListenerOptions) => {
	// }
	// 单个事件模块实现
	// 页面生命周期事件
	// onload
	// onbeforeunload
	// onhashchange
	// onpopstate
	// onvisibilitychange
	// ononline
	// onoffline
	// onmessage
	// 用户行为
	// onclick
	// onmousemove
	// 自定义事件
	// performance 页面启动性能监控报告
	// tp 页面停留时长上报
	// 事件注册订阅调度机制
	// 各模式模块只维护当前的事件及其回调的列表，在对应生命周期中订阅及取消订阅
	var AppEvent = {
	    click: function (config) { return fromEvent(document, 'click', { capture: config.capture }); },
	    mousemove: function (config) { return fromEvent(document, 'mousemove', { capture: config.capture }).pipe(sampleTime(config.debounceTime), filter(function (e) { return e.target.tagName !== 'HTML'; })); },
	    load: function () { return fromEvent(document, 'load'); },
	    beforeUnload: function () { return fromEvent(document, 'beforeunload'); },
	    hashchange: function () { return fromEvent(document, 'hashchange'); },
	    popstate: function () { return fromEvent(document, 'popstate'); },
	    visibilitychange: function () { return fromEvent(document, 'visibilitychange'); },
	    online: function () { return fromEvent(window, 'online'); },
	    offline: function () { return fromEvent(window, 'offline'); },
	    message: function () { return fromEvent(window, 'message'); },
	    messageOf: function (tag) {
	        return this.message().pipe(filter(function (msg) { return (msg.data.tag) === tag; }));
	    },
	    netStatusChange: function () {
	        return merge(this.online(), this.offline()).pipe(map(function (e) { return e.type; }));
	    }
	};

	/* eslint-disable no-undef */
	var development = {
	  'public': 'https://112.74.159.153:8085/api/v1'
	};
	var conf =  development;

	// import './fetch';
	// import { RequestMethods, RequestOptions } from '../../types';
	/**
	 * 拼接请求地址
	 * splitUrl :: (String -> String -> Object) -> String
	 * @param {String} host 服务主机地址
	 * @param {String} path API地址
	 * @param {Object} data 需要拼接成 query 的对象，可选 { a: 123, b: 456 } -> '?a=123&b=456'
	 */
	var splitUrl = function (host, path, data) {
	    var query = data ?
	        Object.keys(data).reduce(function (q, k) { return q += (q ? '&' : '?') + (k + "=" + data[k]); }, '') :
	        '';
	    return conf[host] + path + query;
	};
	var http = (function () {
	    // 全局请求头暂存
	    var _header = {
	        'content-type': 'application/json'
	    };
	    /**
	     * 统一http请求入口
	     * @param {String} method http请求方式
	     * @param {String} url 请求URL
	     * @param {Object} data 请求体，将转为 json 之后作为 fetch 的 body 传入
	     * @param {Object} options 额外参数（注意：options 中设置的 body 将被忽略，请传入 data 参数代替）
	     */
	    var _request = function (method, url, data, options) {
	        if (options === void 0) { options = {}; }
	        var headers = options.headers, body = options.body, rest = __rest(options, ["headers", "body"]);
	        // 存在 body ，则警告并忽略
	        body && console.warn('Warn in http request: You are trying to set a request body in args:options, and it will be ignore. Please set it in args:data !  \n', "url: " + url + " \n", "body: " + JSON.stringify(body));
	        var safeOptions = __assign({ method: method, 
	            // 合并请求头，新传入的可代替公共的
	            headers: __assign(__assign({}, _header), headers) }, rest);
	        // 当前是 POST | PUT ，则合并请求体
	        (method === 'POST' || method === 'PUT') && Object.assign(safeOptions, {
	            body: JSON.stringify(data)
	        });
	        return fetch(url, safeOptions)
	            .then(function (response) { return response.json(); })
	            .catch(function (err) {
	            console.error(err);
	        });
	    };
	    // 构造request方法
	    return {
	        /**
	         * 增量设置请求头
	         */
	        setHeader: function (newHeader) {
	            _header = __assign(__assign({}, _header), newHeader);
	            return _header;
	        },
	        get: function (host, url, data, options) { return _request('GET', splitUrl(host, url, data), null, options); },
	        post: function (host, url, data, options) { return _request('POST', splitUrl(host, url), data, options); },
	        put: function (host, url, data, options) { return _request('PUT', splitUrl(host, url), data, options); },
	        delete: function (host, url, options) { return _request('DELETE', splitUrl(host, url), null, options); },
	        url: function (host, url) { return splitUrl(host, url); },
	    };
	})();

	var Service = {
	    ERR_OK: '0',
	    /**
	     * 增量设置请求头
	     */
	    setHeader: http.setHeader,
	    appLoginAPI: function (data) { return http.get('public', '/sys/login', data); },
	    reportAPI: function (data) { return http.post('public', '/log', data); },
	    getPresetPointsAPI: function (data) { return http.get('public', '/config/query/list', data); }
	};

	var Browse = /** @class */ (function () {
	    function Browse() {
	        this.modeType = 'browse';
	    }
	    Browse.prototype.onEnter = function () { };
	    Browse.prototype.onExit = function () { };
	    Browse.prototype.onTrigger = function () {
	        console.warn('No data will upload with browse mode!');
	    };
	    Browse = __decorate([
	        injectable()
	    ], Browse);
	    return Browse;
	}());

	// report 模式下所有的事件监听器注册方法，包装事件数据，触发事件消费 onTrigger
	var EventListener = {
	    'setting-click': [
	        { capture: true },
	        function (config) {
	            var _this = this;
	            return this.events.click(config).subscribe(function (e) {
	                e.stopPropagation();
	                // 包装事件数据，触发事件消费 onTrigger;
	                var repeatPoint = _this.domMasker.points.filter(function (point) { return point.pid === _this.domMasker.activePoint.pid; });
	                _this.onTrigger({
	                    tag: 'selectPoint',
	                    // 若命中的埋点是已配置过的埋点，需要将配置信息一并返回给iframe父层，即返回预埋列表的点
	                    point: repeatPoint.length ? repeatPoint[0] : _this.domMasker.activePoint,
	                    // 是否是重复设置的埋点
	                    isRepeat: repeatPoint.length !== 0
	                });
	            });
	        }
	    ],
	    'setting-mousemove': [
	        { capture: false, debounceTime: 200 },
	        function (config) {
	            var _this = this;
	            return this.events.mousemove(config).subscribe(function (e) {
	                // 包装事件数据，触发事件消费 onTrigger
	                var activePoint = _this.createPoint(e.target);
	                if (
	                // 当前为第一次绘制，活动元素还未初始化
	                !_this.domMasker.activePoint ||
	                    // 捕捉元素与缓存活动元素不相同
	                    activePoint.pid !== _this.domMasker.activePoint.pid) {
	                    // 设置新的捕捉元素
	                    _this.domMasker.activePoint = activePoint;
	                    // 渲染基础遮罩层
	                    _this.domMasker.reset();
	                    // 渲染当前活动埋点
	                    _this.domMasker.render(_this.domMasker.canvas.getContext('2d'), activePoint);
	                }
	            });
	        }
	    ],
	    'setting-preset': [
	        {},
	        function () {
	            var _this = this;
	            return this.events.messageOf('preset').subscribe(function (msg) {
	                _this.domMasker.preset(msg.data.points);
	            });
	        }
	    ],
	};
	function mixins() {
	    var list = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        list[_i] = arguments[_i];
	    }
	    return function (constructor) {
	        Object.assign.apply(Object, __spreadArrays([constructor.prototype], list));
	    };
	}
	var Setting = /** @class */ (function () {
	    function Setting(createPoint, eventSubscriber) {
	        this.modeType = 'setting';
	        this.evtSubs = eventSubscriber.init(this);
	        // 初始化单个埋点构造器
	        this.createPoint = createPoint;
	        // this.events = events;
	        // this.evtSubs = new EventSubscriber<Setting, Subscription>(this);
	    }
	    Setting.prototype.onEnter = function () {
	        return __awaiter$1(this, void 0, void 0, function () {
	            var subs;
	            var _this = this;
	            return __generator$1(this, function (_a) {
	                // 绑定监控事件
	                this.evtSubs.subscribe();
	                // 初始化埋点交互遮罩
	                !this.domMasker._INITED && this.domMasker.init();
	                // setTimeout(() => {
	                //     this.initPresetPoints();
	                // }, 10000);
	                this.initPresetPoints();
	                subs = this.events.messageOf('reset').subscribe(function (msg) { return __awaiter$1(_this, void 0, void 0, function () {
	                    return __generator$1(this, function (_a) {
	                        // 绑定监控事件
	                        this.evtSubs.subscribe();
	                        // 初始化埋点交互遮罩
	                        this.initPresetPoints();
	                        return [2 /*return*/];
	                    });
	                }); });
	                this.evtSubs.on('reset', subs);
	                return [2 /*return*/];
	            });
	        });
	    };
	    Setting.prototype.onExit = function () {
	        // 注销事件监听
	        this.evtSubs.unsubscribe();
	        // 单独注销
	        this.evtSubs.off('reset');
	        this.domMasker.activePoint = null;
	        this.domMasker.points = [];
	        this.domMasker.clear();
	    };
	    Setting.prototype.onTrigger = function (data) {
	        var conf = this.conf.getSelf();
	        // 包装额外数据
	        Object.assign(data, {
	            ext: {
	                appId: conf.appId,
	                appName: conf.appName,
	                sysId: conf.sysId,
	                sysName: conf.sysName,
	                pageId: location.pathname
	            }
	        });
	        console.log('SettingLifeCycle onTrigger：', data);
	        // console.log('当前的Points: ', this.domMasker.points);
	        // 通知父层设置层埋点捕捉完毕
	        window.parent && window.parent.postMessage(JSON.stringify(data), '*');
	        // 当前已捕获到埋点，通过注销绑定的监听可保持埋点蒙板状态
	        // 注销绑定的监听
	        this.evtSubs.unsubscribe();
	    };
	    Setting.prototype.initPresetPoints = function () {
	        return __awaiter$1(this, void 0, void 0, function () {
	            var points;
	            return __generator$1(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, this.getPresetPoints()];
	                    case 1:
	                        points = _a.sent();
	                        // 每次绑定预设埋点信息时，都重新缓存并初始化 缓存canvas
	                        points.length && this.domMasker.preset(points.map(function (point) { return (__assign(__assign({}, point), { pid: point.funcId })); }));
	                        // 手动重置 主绘制canvas
	                        this.domMasker.reset();
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    Setting.prototype.getPresetPoints = function () {
	        return __awaiter$1(this, void 0, void 0, function () {
	            var rules, parentsQueryStr, version, _a, err, res;
	            return __generator$1(this, function (_b) {
	                switch (_b.label) {
	                    case 0:
	                        rules = {
	                            pageId: location.pathname,
	                            appName: this.conf.get('appName'),
	                            sysName: this.conf.get('sysName'),
	                            pageSize: -1
	                        };
	                        parentsQueryStr = document.referrer.split('?')[1];
	                        version = this._.splitQuery(parentsQueryStr).dots_v;
	                        version && Object.assign(rules, { version: version });
	                        console.log('======= queryStr =======', parentsQueryStr);
	                        console.log('======= version =======', version);
	                        console.log('======= rules =======', rules);
	                        return [4 /*yield*/, this._.errorCaptured(this.service.getPresetPointsAPI, null, rules)];
	                    case 1:
	                        _a = _b.sent(), err = _a[0], res = _a[1];
	                        if (err) {
	                            console.warn("Warn in getPresetPointsAPI: ", err);
	                            return [2 /*return*/, []];
	                        }
	                        return [2 /*return*/, res];
	                }
	            });
	        });
	    };
	    __decorate([
	        inject(TYPES.DomMasker),
	        __metadata("design:type", Object)
	    ], Setting.prototype, "domMasker", void 0);
	    __decorate([
	        inject(TYPES.AppEvent),
	        __metadata("design:type", Object)
	    ], Setting.prototype, "events", void 0);
	    __decorate([
	        inject(TYPES.Service),
	        __metadata("design:type", Object)
	    ], Setting.prototype, "service", void 0);
	    __decorate([
	        inject(TYPES.Utils),
	        __metadata("design:type", Function)
	    ], Setting.prototype, "_", void 0);
	    __decorate([
	        inject(TYPES.Conf),
	        __metadata("design:type", Object)
	    ], Setting.prototype, "conf", void 0);
	    Setting = __decorate([
	        mixins(EventListener),
	        injectable(),
	        __param(0, inject(TYPES.Point)),
	        __param(1, inject(TYPES.EventSubscriber)),
	        __metadata("design:paramtypes", [Function, Object])
	    ], Setting);
	    return Setting;
	}());

	// report 模式下所有的事件监听器注册方法，包装事件数据，触发事件消费 onTrigger
	var EventListener$1 = {
	    'report-click': [
	        { capture: false },
	        function (config) {
	            var _this = this;
	            return this.events.click(config).subscribe(function (e) {
	                // 包装事件数据，触发事件消费 onTrigger
	                _this.onTrigger(['click', e.target]);
	            });
	        }
	    ],
	    'report-change-strategy': [
	        {},
	        function () {
	            var _this = this;
	            return this.events.netStatusChange().subscribe(function (type) {
	                var strategy = type === 'online' ? 'server' : 'storage';
	                console.log('Change report strategy by network fluctuation, current strategy: ', strategy);
	                // 网络状态变化，切换当前行为数据消费策略
	                _this.reportStrategy.controller = strategy;
	            });
	        }
	    ],
	};
	function mixins$1() {
	    var list = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        list[_i] = arguments[_i];
	    }
	    return function (constructor) {
	        Object.assign.apply(Object, __spreadArrays([constructor.prototype], list));
	    };
	}
	var Report = /** @class */ (function () {
	    function Report(createPoint, eventSubscriber) {
	        // 模式类型
	        this.modeType = 'report';
	        // 
	        this._INITED = false;
	        // this.events = events;
	        this.evtSubs = eventSubscriber.init(this);
	        // 初始化单个埋点构造器
	        this.createPoint = createPoint;
	    }
	    Report.prototype.onEnter = function () {
	        // 注册事件监听
	        console.log(this);
	        // 绑定监控事件
	        this.evtSubs.subscribe();
	        // 在第一次进入的时候推送系统加载事件
	        if (!this._INITED) {
	            this._INITED = true;
	            // 检查最后一次行为数据是否已消费完全，若未消费完全则将其合并至本地缓存
	            var customData = this._.windowName.get();
	            customData && !customData._consumed && this.reportStrategy.report2Storage([customData]);
	            // 上报访问记录
	            this.onSystemLoaded();
	            // 上报上次访问未上报的行为数据
	            this.reportStrategy.resend();
	        }
	    };
	    Report.prototype.onSystemLoaded = function () {
	        var reqData = {
	            type: 1,
	            funcId: '',
	            pageId: '',
	            sysId: this.conf.get('sysId'),
	            msg: this.formatDatagram(1)
	        };
	        this.reportStrategy.report([reqData]);
	    };
	    Report.prototype.onExit = function () {
	        // 注销事件监听
	        this.evtSubs.unsubscribe();
	    };
	    Report.prototype.onTrigger = function (data) {
	        var eventType = data[0], target = data[1];
	        // 格式化埋点信息
	        var point = this.createPoint(target);
	        // 埋点相关信息
	        var extendsData = {
	            pageId: location.pathname,
	            pageUrl: location.href,
	            funcId: point.pid,
	            // 上一次行为事件唯一标识
	            preFuncId: this._.windowName.get().funcId || '-',
	            eventId: eventType,
	            eventTime: Date.now()
	        };
	        // 单条上报数据
	        var reqData = {
	            type: 2,
	            funcId: extendsData.funcId,
	            pageId: extendsData.pageId,
	            sysId: this.conf.get('sysId'),
	            msg: this.formatDatagram(2, extendsData)
	        };
	        // 上一次行为事件，作为 window.name ，在下一次上报时使用
	        this._.windowName.set(reqData);
	        // 根据当前事件消费者消费数据
	        this.reportStrategy.report([reqData]);
	    };
	    Report.prototype.formatDatagram = function (type, extendsData) {
	        var _this = this;
	        if (extendsData === void 0) { extendsData = {}; }
	        // 根据事件类型获取对应字段模板
	        // 对模板中的内容进行映射
	        return this.conf.get("reportType" + type).reduce(function (temp, key) {
	            // 映射策略：全局系统配置 -> 传入的额外配置（一般包含当前触发的埋点信息） -> 占位
	            var val = _this.conf.get(key) ||
	                extendsData[key] ||
	                '$' + '{' + key + '}';
	            var str = key + "=" + val;
	            return temp += '|' + str;
	        }, "type=" + type);
	    };
	    __decorate([
	        inject(TYPES.ReportStrategy),
	        __metadata("design:type", Object)
	    ], Report.prototype, "reportStrategy", void 0);
	    __decorate([
	        inject(TYPES.AppEvent),
	        __metadata("design:type", Object)
	    ], Report.prototype, "events", void 0);
	    __decorate([
	        inject(TYPES.Utils),
	        __metadata("design:type", Function)
	    ], Report.prototype, "_", void 0);
	    __decorate([
	        inject(TYPES.Conf),
	        __metadata("design:type", Object)
	    ], Report.prototype, "conf", void 0);
	    Report = __decorate([
	        mixins$1(EventListener$1),
	        injectable(),
	        __param(0, inject(TYPES.Point)),
	        __param(1, inject(TYPES.EventSubscriber)),
	        __metadata("design:paramtypes", [Function, Object])
	    ], Report);
	    return Report;
	}());

	function getCoords(elem) {
	    var box = elem.getBoundingClientRect();
	    var body = document.body;
	    var docEl = document.documentElement;
	    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
	    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
	    var clientTop = docEl.clientTop || body.clientTop || 0;
	    var clientLeft = docEl.clientLeft || body.clientLeft || 0;
	    var top  = box.top +  scrollTop - clientTop;
	    var left = box.left + scrollLeft - clientLeft;
	    return { top: Math.round(top), left: Math.round(left) };
	}

	function initFunction(){
	    var init =  function (argument) {
	        this.options = Object.assign({},{
	            draw:true,
	            /**尽可能短的wid*/
	            simpleId:true
	        },argument);
	        this.lastClick = document.body;
	        var that = this;
	        /**点击其他地方时，清除*/
	        document.addEventListener('mousedown', function(event){
	            that.lastClick = event.target;
	            if(that.focusedElement!==that.lastClick){
	              init.prototype.clean();
	            }
	        });
	    };
	    return init;
	}

	/**
	 * Created by rowthan on 2017/12/9. TODO show size
	 * 包含核心 api 获取id,获取元素，不含UI
	 */
	var document$1 = window.document,noop$1 = function(){},
	whatsElementPure = initFunction(),
	prototype = whatsElementPure.prototype;
	prototype.getUniqueId = function (element,parent) {
	    element = element ? element : this.lastClick;
	    if(!(element instanceof HTMLElement)){
	        console.error("input is not a HTML element");
	        return {};
	    }
	    var result = {
	        wid:"",
	        type:"",
	        top:getCoords(element).top,
	        left:getCoords(element).left,
	        viewLeft:element.getBoundingClientRect().left,
	        viewTop: element.getBoundingClientRect().top,
	        text: element.innerText
	    },
	    //construct data info of the element
	      id = element.id,
	      name = element.name,
	      tag = element.tagName.toLowerCase(),
	      type = element.type?element.type.toLowerCase():"",
	      className = "",
	      classList = element.classList || [];
	      classList.forEach(function (item) {
	        className += "."+item;
	      });
	    if(tag==="body" || tag=== "html"){
	        result.wid = tag;
	        result.type= tag;
	    }
	    //location by id
	    if(id && document$1.getElementById(id) === element){
	        var regExp= new RegExp("^[a-zA-Z]+") ;
	        /**当不为parent定位，且设置为简单结果时，直接返回id 否则使用完整路径标识符。注：两个if顺序不能更换，递归调用时 simpleId为undefined*/
	        if(!parent && this.options.simpleId){
	            result.wid = id;
	        }
	        /*如果为parent定位，或者设置为完整结果时候，返回tag#id*/
	        else if(regExp.test(id)){
	            result.wid = tag+"#"+id;
	        }
	        result.type = "document.getElementById()";
	    }
	    //location by name
	    if(!result.wid && name && document$1.getElementsByName(name)[0] === element){
	        result.wid = name;
	        result.type = "document.getElementsByName()";
	    }
	    //location by class
	    if(!result.wid && className && document$1.querySelector(tag+className)===element){
	        result.wid = tag+className;
	        result.type = "document.querySelector()";
	        var classLength = classList.length;
	        if(classLength>2){
	          var n = 1,
	          /**使用class查询的个数，如2，4，8：使用2，4，8个className做查询*/
	          queryCount = [];
	          while (Math.pow(2,n)<classLength){
	              queryCount.push(Math.pow(2,n));
	              n++;
	          }
	          queryCount.push(classLength);

	          for(var k=0; k<queryCount.length;k++){
	              /**使用class个数去查询*/
	              var countNum = queryCount[k];
	                //TODO 性能优化
	          }
	        }
	    }
	    //for radio
	    if(type === "radio"){
	        var value = element.value,queryString = tag+"[value='"+value+"']";
	        if(name){
	            queryString += "[name='"+name+"']";
	        }
	        if(document$1.querySelector(queryString)===element){
	            result.wid = queryString;
	            result.type = "document.querySelector()";
	        }
	    }
	    //location by mixed,order
	    if(!result.wid){
	        queryString = tag;
	        queryString = className ? queryString +className: queryString;
	        queryString = name? queryString + "[name='"+name+"']": queryString;
	        if(prototype.getTarget(queryString)===element){
	            result.wid = queryString;
	            result.type = "document.querySelector()";
	        }
	    }
	    //location by order
	    if(!result.wid){
	        queryString = tag;
	        queryString = className ? queryString +className: queryString;

	        var elements = document$1.querySelectorAll(queryString);
	        if(elements && elements.length>0){
	            var index = null;
	            for(var i=0; i<elements.length; i++){
	                if(element===elements[i]){
	                    index = i+1;
	                    break;
	                }
	            }
	            if(index){
	                queryString = queryString + ":nth-child("+index+")";
	                if(document$1.querySelector(queryString) === element){
	                    result.wid = queryString;
	                    result.type = "document.querySelector()";
	                }
	            }
	        }
	    }
	    //location by parent
	    if(!result.wid){
	        if(!element.parentNode){
	            return
	        }
	        var parentQueryResult = whatsElementPure.prototype.getUniqueId(element.parentNode,true),
	          parentQueryString = parentQueryResult?parentQueryResult.wid:"";
	        if(!parentQueryString){
	            return {
	                wid:"",
	                type:"NO_LOCATION"
	            };
	        }
	        var targetQuery = tag;
	        if(className){
	            targetQuery += className;
	        }
	          queryString = parentQueryString+">"+targetQuery;
	          var queryElements = document$1.querySelectorAll(queryString);
	        if(queryElements.length>1){
	            queryString = null;
	            var index = null;
	            for(var j=0; j<element.parentNode.children.length; j++){
	                if(element.parentNode.children[j]===element){
	                    index = j+1;
	                    break;
	                }
	            }
	            if(index>=1){
	                queryString = parentQueryString+">"+ targetQuery + ":nth-child("+index+")";
	                var queryTarget = document$1.querySelector(queryString);
	                if(queryTarget!=element){
	                    queryString = null;
	                }
	            }
	        }
	        result.wid = queryString;
	        result.type = "document.querySelector()";
	    }

	    this.focusedElement = prototype.getTarget(result.wid);
	    if(!parent && this.options.draw ){
	        this.__proto__.draw(result);
	    }
	    return result
	};
	prototype.getTarget = function (queryString) {
	    return document$1.getElementById(queryString) || document$1.getElementsByName(queryString)[0] || document$1.querySelector(queryString);
	};

	prototype.clean = noop$1;
	prototype.draw = noop$1;
	window.whatsElement = whatsElementPure;

	var _ = function () { };
	_.unboundMethod = function (methodName, argCount) {
	    if (argCount === void 0) { argCount = 2; }
	    return this.curry(function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        var obj = args.pop();
	        return obj[methodName].apply(obj, args);
	    }, argCount);
	};
	_.curry = function (fn, arity) {
	    if (arity === void 0) { arity = fn.length; }
	    // 1. 构造一个这样的函数：
	    //    即：接收前一部分参数，返回一个 接收后一部分参数 的函数，返回的那个函数需在内部判断是否执行原函数
	    var nextCurried = function () {
	        var prev = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            prev[_i] = arguments[_i];
	        }
	        return function () {
	            var next = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                next[_i] = arguments[_i];
	            }
	            var args = __spreadArrays(prev, next);
	            return args.length >= arity
	                ? fn.apply(void 0, args) : nextCurried.apply(void 0, args);
	        };
	    };
	    // 2. 将构造的这个函数执行并返回，初始入参为空
	    return nextCurried();
	};
	_.map = _.unboundMethod('map', 2);
	var _a = window, sessionStorage = _a.sessionStorage, localStorage = _a.localStorage;
	var _b = _.map(function (storage) { return ({
	    get: function (key) { return JSON.parse(storage.getItem(key)); },
	    set: function (key, val) { return storage.setItem(key, JSON.stringify(val)); },
	    remove: function (key) { return storage.removeItem(key); },
	    clear: function () { return storage.clear(); }
	}); })([sessionStorage, localStorage]), SessStorage = _b[0], LocStorage = _b[1];
	_.SessStorage = SessStorage;
	_.LocStorage = LocStorage;
	_.windowName = {
	    get: function () {
	        var data = undefined;
	        try {
	            data = window.name ? JSON.parse(window.name) : '';
	        }
	        catch (_a) {
	            data = '';
	        }
	        return data;
	    },
	    set: function (val) {
	        window.name = JSON.stringify(val);
	    }
	};
	_.inIframe = function () { return window && window.self !== window.top; };
	_.isType = function (type, staff) { return Object.prototype.toString.call(staff) === "[object " + type + "]"; };
	_.firstUpperCase = function (str) { return str.toLowerCase().replace(/( |^)[a-z]/g, function (s) { return s.toUpperCase(); }); };
	_.splitQuery = function (str) {
	    if (!str)
	        return {};
	    var querystrList = str.split('&');
	    return querystrList.map(function (querystr) { return querystr.split('='); })
	        .reduce(function (temp, queryItem) {
	        var _a;
	        return (__assign(__assign({}, temp), (_a = {}, _a[queryItem[0]] = queryItem[1], _a)));
	    }, {});
	};
	_.createVisitId = function (appId) {
	    return ''
	        // 应用id
	        + appId
	        // 当前访问时间（到秒）
	        + this.formatDate('yyyy-MM-dd-hh-mm-ss').split(/-/g).join('')
	        // 6位随机数
	        + this.randomInRange(100000, 999999);
	};
	_.formatDate = function (format, date) {
	    if (date === void 0) { date = new Date(); }
	    var map = {
	        'M': date.getMonth() + 1,
	        'd': date.getDate(),
	        'h': date.getHours(),
	        'm': date.getMinutes(),
	        's': date.getSeconds(),
	        'q': Math.floor((date.getMonth() + 3) / 3) // 季度
	    };
	    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
	        var v = map[t];
	        if (v !== void 0) {
	            if (all.length > 1) {
	                v = '0' + v;
	                v = v.substr(v.length - 2);
	            }
	            return v;
	        }
	        else if (t === 'y') {
	            return (date.getFullYear() + '').substr(4 - all.length);
	        }
	        else if (t === 'S') {
	            var ms = "00" + date.getMilliseconds();
	            return ms.substr(ms.length - 3);
	        }
	        return all;
	    });
	    return format;
	};
	_.randomInRange = function (min, max) { return Math.floor(Math.random() * (max - min) + min); };
	_.getElemPid = function (sysId, pageId, e) {
	    try {
	        var _a = new whatsElementPure().getUniqueId(e), type = _a.type, wid = _a.wid;
	        // const { type, wid } = { type: 'type', wid: 'wid' };
	        return wid + "!" + type + "!" + sysId + "!" + pageId;
	    }
	    catch (_b) {
	        return null;
	    }
	};
	_.getElemByPid = function (pid) {
	    var _a = pid.split('!'), id = _a[0], pageId = _a[3];
	    if (pageId !== location.pathname)
	        return null;
	    return document.getElementById(id) || document.getElementsByName(id)[0] || document.querySelector(id);
	};
	_.getElemClientRect = function (e) {
	    var _a = e.getBoundingClientRect(), left = _a.left, top = _a.top, width = _a.width, height = _a.height;
	    // [ x, y, w, h ]
	    return [Math.round(left), Math.round(top), Math.round(width), Math.round(height)];
	};
	_.errorCaptured = function (asyncFn, formatter) {
	    var rest = [];
	    for (var _i = 2; _i < arguments.length; _i++) {
	        rest[_i - 2] = arguments[_i];
	    }
	    return __awaiter$1(void 0, void 0, void 0, function () {
	        var _a, _b, code, message, data, ex_1;
	        return __generator$1(this, function (_c) {
	            switch (_c.label) {
	                case 0:
	                    _c.trys.push([0, 2, , 3]);
	                    return [4 /*yield*/, asyncFn.apply(void 0, rest)];
	                case 1:
	                    _a = _c.sent(), _b = _a.result, code = _b.code, message = _b.message, data = _a.data;
	                    if (code === Service.ERR_OK) {
	                        return [2 /*return*/, [null, formatter ? formatter(data) : data]];
	                    }
	                    else {
	                        return [2 /*return*/, [message, data]];
	                    }
	                    return [3 /*break*/, 3];
	                case 2:
	                    ex_1 = _c.sent();
	                    return [2 /*return*/, [ex_1, null]];
	                case 3: return [2 /*return*/];
	            }
	        });
	    });
	};
	_.deviceInfo = function () {
	    var u = navigator.userAgent;
	    var ua = u.toLowerCase();
	    var name;
	    var version;
	    var browser = 'wx';
	    var connType = /nettype/.test(ua) ? ua.match(/NetType\/(\S*)/)[1] : 'unknown';
	    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
	        // Android
	        var reg = /android [\d._]+/gi;
	        name = 'Android';
	        version = parseFloat((ua.match(reg) + '').replace(/[^0-9|_.]/ig, '').replace(/_/ig, '.'));
	    }
	    else if (u.indexOf('iPhone') > -1) {
	        // iPhone
	        var ver = ua.match(/cpu iphone os (.*?) like mac os/);
	        name = 'iPhone';
	        version = parseFloat(ver[1].replace(/_/g, '.'));
	        // 微信内置浏览器否
	        browser = (ua.match(/MicroMessenger/i) && ua.match(/MicroMessenger/i)[0] == 'micromessenger') ? 'wx' : 'safari';
	    }
	    else if (u.indexOf('Windows Phone') > -1) {
	        name = 'windowsPhone';
	        version = -1;
	    }
	    return {
	        name: name,
	        version: version,
	        browser: browser,
	        connType: connType
	    };
	};
	_.reloadConstructor = function (constructor) {
	    return /** @class */ (function (_super) {
	        __extends(ReloadConstructor, _super);
	        function ReloadConstructor() {
	            return _super !== null && _super.apply(this, arguments) || this;
	        }
	        return ReloadConstructor;
	    }(constructor));
	};

	var AppConfig = /** @class */ (function () {
	    function AppConfig() {
	        // private container: Map<string, any> = new Map();
	        this.container = {
	            reportType1: [
	                'batchId',
	                'appId',
	                'appName',
	                'sysId',
	                'sysName',
	                'origin',
	                'openId',
	                'clientType',
	                'sysVersion',
	                'ip',
	                'userNetWork',
	                'createTime'
	            ],
	            reportType2: [
	                'batchId',
	                'sysId',
	                'pageId',
	                'pageName',
	                'pageUrl',
	                'funcId',
	                'funcName',
	                'funcIntention',
	                'preFuncId',
	                'eventId',
	                'eventName',
	                'eventType',
	                'eventTime',
	                'createTime',
	                'pageDwellTime',
	                'enterTime',
	                'leaveTime'
	            ],
	            // 三方跨域数据存贮 iframe 地址
	            insertIframeSrc: 'https://sales-dev.ihxlife.com/video/hx-analytics/jssdk/index.html'
	        };
	    }
	    AppConfig.prototype.set = function (data) {
	        this.container = __assign(__assign({}, this.container), data);
	    };
	    AppConfig.prototype.get = function (key) {
	        return this.container[key];
	    };
	    AppConfig.prototype.getSelf = function () {
	        return JSON.parse(JSON.stringify(this.container));
	    };
	    AppConfig = __decorate([
	        injectable()
	    ], AppConfig);
	    return AppConfig;
	}());

	var customCanvas = function (width, height, color) {
	    if (color === void 0) { color = 'rgba(77, 131, 202, 0.5)'; }
	    var canvas = document.createElement('canvas');
	    canvas.width = width;
	    canvas.height = height;
	    canvas.style.position = 'fixed';
	    canvas.style.top = '0';
	    canvas.style.left = '0';
	    canvas.style.zIndex = '9999';
	    canvas.style.pointerEvents = 'none';
	    var ctx = canvas.getContext('2d');
	    ctx.fillStyle = color;
	    ctx.font = '18px serif';
	    ctx.textBaseline = 'ideographic';
	    return canvas;
	};

	var DomMasker = /** @class */ (function () {
	    function DomMasker(createPoint, customCanvas) {
	        this._INITED = false;
	        // _active: boolean;
	        // 预设埋点
	        this.points = [];
	        // points: [{ pid:'span.corner.top!document.querySelector()!sysId!pageId' }]
	        // 初始化单个埋点构造器
	        this.createPoint = createPoint;
	        this.customCanvas = customCanvas;
	    }
	    DomMasker_1 = DomMasker;
	    DomMasker.prototype.init = function () {
	        this._INITED = true;
	        // 初始化 主绘制canvas / 缓存canvas
	        this.canvas = this.customCanvas(DomMasker_1.w, DomMasker_1.h);
	        this.tempCanvas = this.customCanvas(DomMasker_1.w, DomMasker_1.h, 'rgba(200, 100, 50, 0.6)');
	        // 插入页面根节点
	        document.body.appendChild(this.canvas);
	    };
	    // 将预设埋点信息标准化，并将信息对应的绘制到 缓存canvas 上
	    // 注意：此API不会造成页面 主绘制canvas 的绘制
	    // 幂等操作
	    DomMasker.prototype.preset = function (points) {
	        var _this = this;
	        // 清空缓存canvas
	        this.tempCanvas.getContext('2d').clearRect(0, 0, DomMasker_1.w, DomMasker_1.h);
	        // 绑定预设埋点
	        this.points = points.map(function (p) { return _this.createPoint(p); });
	        var ctx = this.tempCanvas.getContext('2d');
	        // 绘制预设埋点蒙版，保存在内存中
	        this.points.forEach(function (point) {
	            _this.render(ctx, point);
	        });
	    };
	    DomMasker.prototype.clear = function () {
	        this.canvas.getContext('2d').clearRect(0, 0, DomMasker_1.w, DomMasker_1.h);
	    };
	    DomMasker.prototype.reset = function () {
	        this.clear();
	        if (this.points.length) {
	            // 将缓存信息当做背景绘制到 主绘制canvas
	            var ctx = this.canvas.getContext('2d');
	            ctx.drawImage(this.tempCanvas, 0, 0);
	        }
	    };
	    DomMasker.prototype.render = function (ctx, point) {
	        var tag = point.tag, _a = point.rect, x = _a[0], y = _a[1], width = _a[2], height = _a[3];
	        ctx.fillRect(x, y, width, height);
	        ctx.fillText(tag, x, y);
	        // ctx.save();
	        // ctx.strokeStyle = '#fff';
	        // ctx.lineWidth = 1;
	        // ctx.strokeText(tag, x, y);
	        // ctx.restore();
	    };
	    var DomMasker_1;
	    // private static instance: DomMasker;
	    DomMasker.w = window.innerWidth;
	    DomMasker.h = window.innerHeight;
	    DomMasker = DomMasker_1 = __decorate([
	        injectable(),
	        __param(0, inject(TYPES.Point)),
	        __param(1, inject(TYPES.CustomCanvas)),
	        __metadata("design:paramtypes", [Function, Function])
	    ], DomMasker);
	    return DomMasker;
	}());

	var EventSubscriber = /** @class */ (function () {
	    function EventSubscriber() {
	        this.subs = [];
	    }
	    // 初始化入口，需传入绑定上下文
	    EventSubscriber.prototype.init = function (ctx) {
	        this.ctx = ctx;
	        return this;
	    };
	    EventSubscriber.prototype.subscribe = function () {
	        // 统一注册事件监听
	        // 将 ctx 所有 模式 + '-' 开头的事件监听器方法全部注册，并记录至 subs
	        for (var key in this.ctx) {
	            if (key.startsWith(this.ctx.modeType + '-')) {
	                var _a = this.ctx[key], config = _a[0], cb = _a[1];
	                this.subs.push(cb.call(this.ctx, config));
	            }
	        }
	    };
	    EventSubscriber.prototype.unsubscribe = function () {
	        // 统一注销事件监听
	        this.subs.length && this.subs.forEach(function (unsub) { return unsub.unsubscribe(); });
	        this.subs = [];
	    };
	    // 单独注册自定义事件
	    EventSubscriber.prototype.on = function (event, sub) {
	        this[event] = sub;
	    };
	    // 单独注销自定义事件
	    EventSubscriber.prototype.off = function (event) {
	        // 存在即注销
	        this[event] &&
	            this[event].unsubscribe &&
	            this[event].unsubscribe();
	        this[event] = undefined;
	    };
	    EventSubscriber = __decorate([
	        injectable()
	    ], EventSubscriber);
	    return EventSubscriber;
	}());

	var Point = /** @class */ (function () {
	    function Point(_, conf) {
	        this._ = _;
	        this.conf = conf;
	    }
	    Point.prototype.create = function (origin) {
	        if (origin instanceof EventTarget) {
	            this.createByEvent(origin);
	        }
	        else {
	            this.createByPointBase(origin);
	        }
	        return this;
	    };
	    Point.prototype.createByPointBase = function (origin) {
	        var pid = origin.pid, rest = __rest(origin, ["pid"]);
	        this.pid = origin.pid;
	        var elem = this._.getElemByPid(this.pid);
	        if (!elem) {
	            // 未能通过 pid 找到对应 dom节点（）
	            console.warn("Warn in Point.create: Can't find element with pid: ", this.pid, '\n', "please check out the element's fingerprint or location.pathname!");
	            this.tag = 'unknow';
	            this.rect = [0, 0, 0, 0];
	        }
	        else {
	            this.tag = '<' + elem.tagName.toLowerCase() + '>';
	            // [ x, y, w, h ]
	            this.rect = this._.getElemClientRect(elem);
	            // 将若存在额外内容，即为已配置埋点，同样绑定在该对象上
	            Object.assign(this, rest);
	        }
	    };
	    Point.prototype.createByEvent = function (origin) {
	        var sysId = this.conf.get('sysId');
	        this.pid = this._.getElemPid(sysId, location.pathname, origin);
	        this.tag = '<' + origin.tagName.toLowerCase() + '>';
	        // [ x, y, w, h ]
	        this.rect = this._.getElemClientRect(origin);
	    };
	    Point = __decorate([
	        injectable(),
	        __metadata("design:paramtypes", [Function, Object])
	    ], Point);
	    return Point;
	}());

	var ReportStrategy = /** @class */ (function () {
	    function ReportStrategy() {
	        // 缓存的 key
	        this.storageKey = 'UserBehaviorCache';
	        // 策略控制器（默认上报至RPC）
	        this.controller = 'server';
	    }
	    Object.defineProperty(ReportStrategy.prototype, "report", {
	        get: function () {
	            // 根据策略（本地缓存 / 远程接口），返回对应的回调
	            var strategy = "report2" + this._.firstUpperCase(this.controller);
	            return this[strategy];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ReportStrategy.prototype.report2Storage = function (data) {
	        var cache = this._.LocStorage.get(this.storageKey);
	        // 合并之前的缓存
	        cache = cache ? cache.concat(data) : data;
	        console.log('report to Storage: ', cache);
	        try {
	            // 存入本地
	            this._.LocStorage.set(this.storageKey, cache);
	            var customData = this._.windowName.get();
	            // 缓存的当前行为数据与请求成功的最后一条数据相同，则更新缓存的当前行为数据的已消费标识
	            if (data[data.length - 1].funcId === customData.funcId) {
	                customData._consumed = true;
	                this._.windowName.set(customData);
	            }
	            return true;
	        }
	        catch (error) {
	            var eStr = JSON.stringify(error);
	            error = null;
	            console.warn("Warn in report2Storage: " + eStr);
	            return false;
	        }
	    };
	    ReportStrategy.prototype.report2Server = function (data, ignoreErr) {
	        return __awaiter$1(this, void 0, void 0, function () {
	            var err, customData;
	            return __generator$1(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, this._.errorCaptured(this.service.reportAPI, null, { msgs: data })];
	                    case 1:
	                        err = (_a.sent())[0];
	                        if (err) {
	                            console.warn('Warn in report2Server: ', err);
	                            // 是否将未成功上报的数据缓存进本地，若指定为 'ignoreErr' 则不缓存
	                            if (!ignoreErr) {
	                                console.warn('this report data will be cached into LocalStorage, and will be resend on next time you visit this website ! ');
	                                this.report2Storage(data);
	                            }
	                            return [2 /*return*/, false];
	                        }
	                        else {
	                            console.log('report to Server: ', data);
	                            customData = this._.windowName.get();
	                            // 缓存的当前行为数据与请求成功的最后一条数据相同，则更新缓存的当前行为数据的已消费标识
	                            if (data[data.length - 1].funcId === customData.funcId) {
	                                customData._consumed = true;
	                                this._.windowName.set(customData);
	                            }
	                            return [2 /*return*/, true];
	                        }
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    ReportStrategy.prototype.resend = function () {
	        return __awaiter$1(this, void 0, void 0, function () {
	            var cache, _a;
	            return __generator$1(this, function (_b) {
	                switch (_b.label) {
	                    case 0:
	                        cache = this._.LocStorage.get(this.storageKey);
	                        // 若存在缓存
	                        _a = cache;
	                        if (!_a) 
	                        // 若存在缓存
	                        return [3 /*break*/, 2];
	                        // 则尝试重新发送
	                        return [4 /*yield*/, this.report2Server(cache, 'ignoreErr')];
	                    case 1:
	                        _a = (
	                        // 则尝试重新发送
	                        _b.sent());
	                        _b.label = 2;
	                    case 2:
	                        // 若存在缓存
	                        _a &&
	                            // 若成功将数据重新发送，则将缓存数据清空
	                            this._.LocStorage.remove(this.storageKey);
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    __decorate([
	        inject(TYPES.Utils),
	        __metadata("design:type", Function)
	    ], ReportStrategy.prototype, "_", void 0);
	    __decorate([
	        inject(TYPES.Service),
	        __metadata("design:type", Object)
	    ], ReportStrategy.prototype, "service", void 0);
	    ReportStrategy = __decorate([
	        injectable()
	    ], ReportStrategy);
	    return ReportStrategy;
	}());

	var container = new Container();
	container.bind(TYPES.HXAnalytics).to(HXAnalytics).inSingletonScope();
	// 应用事件层
	container.bind(TYPES.AppEvent).toConstantValue(AppEvent);
	// 全局工具
	container.bind(TYPES.Utils).toFunction(_);
	// API
	container.bind(TYPES.Service).toConstantValue(Service);
	// 应用配置相关信息
	container.bind(TYPES.Conf).to(AppConfig).inSingletonScope();
	// 模式
	container.bind(TYPES.Browse).to(Browse);
	container.bind(TYPES.Setting).to(Setting);
	container.bind(TYPES.Report).to(Report);
	// const modeContainer = {
	//     browse: container.get<ModeLifeCycle>(TYPES.Browse),
	//     setting: container.get<ModeLifeCycle>(TYPES.Setting),
	//     report: container.get<ModeLifeCycle>(TYPES.Report)
	// };
	// container.bind<{ [x: string]: ModeLifeCycle }>(TYPES.ModeContainer).toConstantValue(modeContainer);
	// 事件订阅器集合
	container.bind(TYPES.EventSubscriber).to(EventSubscriber);
	// 上报策略（远程服务 / 本地缓存）
	container.bind(TYPES.ReportStrategy).to(ReportStrategy);
	// 埋点配置相关类型
	container.bind(TYPES.DomMasker).to(DomMasker).inSingletonScope();
	container.bind(TYPES.CustomCanvas).toFunction(customCanvas);
	var createPoint = function (origin) { return new Point(_, container.get(TYPES.Conf)).create(origin); };
	container.bind(TYPES.Point).toFunction(createPoint);

	// window.onerror = function (msg, url, row, col, error) {
	//     console.log('错误 ❌: ', {
	//         msg, url, row, col, error
	//     });
	//     // return true 防止错误向上抛出
	//     return true;
	// }
	// window.addEventListener('unhandledrejection', e => {
	//     e.preventDefault();
	//     console.log('错误 ❌: ', e.reason);
	// }, true);
	var ha = container.get(TYPES.HXAnalytics);
	// interface PointBase {
	//     pid: 'span.corner.top!document.querySelector()!sysId!pageId'
	// }
	// interface Point extends PointBase {
	//     pid: string;
	//     tag: string;
	//     rect: number[];
	// }
	// 切换模式
	// {
	//     tag: 'mode',
	//     mode: 'setting' | 'browse',
	//     points: PointBase[]
	// }
	// 重置
	// {
	//     tag: 'reset',
	//     points?: PointBase[]
	// }
	// 预置埋点，不渲染
	// {
	//     tag: 'preset',
	//     points: PointBase[]
	// }
	// 捕捉到元素
	// {
	//     isRepeat: Boolean,
	//     point: Point,
	//     tag: 'selectPoint'
	// }
	// todo:
	// IoC 容器重构公共模块
	// 错误处理
	// 上报统一格式配置
	// 行为上报控制器切换 接口 / 本地缓存
	// 文档
	// 客户端日志上报与可视化埋点模式分离
	// 用户身份校验
	// 页面停留时长 页面切换机制
	// 单测

	return ha;

}());
//# sourceMappingURL=hx-analytics.js.map
