
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(document);
var ha = (function () {
  'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

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
  var document$1 = window.document,noop = function(){},
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

  prototype.clean = noop;
  prototype.draw = noop;
  window.whatsElement = whatsElementPure;

  var _ = function _() {};

  _.unboundMethod = function (methodName) {
    var argCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    return this.curry(function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var obj = args.pop();
      return obj[methodName].apply(obj, args);
    }, argCount);
  };

  _.curry = function (fn) {
    var arity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : fn.length;

    // 1. 构造一个这样的函数：
    //    即：接收前一部分参数，返回一个 接收后一部分参数 的函数，返回的那个函数需在内部判断是否执行原函数
    var nextCurried = function nextCurried() {
      for (var _len2 = arguments.length, prev = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        prev[_key2] = arguments[_key2];
      }

      return function () {
        for (var _len3 = arguments.length, next = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          next[_key3] = arguments[_key3];
        }

        var args = [].concat(prev, next);
        return args.length >= arity ? fn.apply(void 0, _toConsumableArray(args)) : nextCurried.apply(void 0, _toConsumableArray(args));
      };
    }; // 2. 将构造的这个函数执行并返回，初始入参为空


    return nextCurried();
  };

  _.map = _.unboundMethod('map', 2);
  var _window = window,
      sessionStorage = _window.sessionStorage,
      localStorage = _window.localStorage;

  var _$map = _.map(function (storage) {
    return {
      get: function get(key) {
        return JSON.parse(storage.getItem(key));
      },
      set: function set(key, val) {
        return storage.setItem(key, JSON.stringify(val));
      },
      remove: function remove(key) {
        return storage.removeItem(key);
      },
      clear: function clear() {
        return storage.clear();
      }
    };
  })([sessionStorage, localStorage]),
      _$map2 = _slicedToArray(_$map, 2),
      SessStorage = _$map2[0],
      LocStorage = _$map2[1];

  _.SessStorage = SessStorage;
  _.LocStorage = LocStorage;

  _.inIframe = function () {
    return window && window.self !== window.top;
  };

  _.isType = function (type, staff) {
    return Object.prototype.toString.call(staff) === "[object ".concat(type, "]");
  };

  _.createVisitId = function (appId) {
    return '' // 应用id
    + appId // 当前访问时间（到秒）
    + this.formatDate('yyyy-MM-dd-hh-mm-ss').split(/-/g).join('') // 6位随机数
    + this.randomInRange(100000, 999999);
  };

  _.formatDate = function (format) {
    var date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
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
      } else if (t === 'y') {
        return (date.getFullYear() + '').substr(4 - all.length);
      } else if (t === 'S') {
        var ms = "00".concat(date.getMilliseconds());
        return ms.substr(ms.length - 3);
      }

      return all;
    });
    return format;
  };

  _.randomInRange = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  _.getElemPid = function (sysId, pageId, e) {
    try {
      var _getUniqueId = new whatsElementPure().getUniqueId(e),
          type = _getUniqueId.type,
          wid = _getUniqueId.wid;

      return "".concat(wid, "!").concat(type, "!").concat(sysId, "!").concat(pageId);
    } catch (_a) {
      return null;
    }
  };

  _.getElemByPid = function (pid) {
    var id = pid.split('!')[0];
    return document.getElementById(id) || document.getElementsByName(id)[0] || document.querySelector(id);
  };

  _.getElemClientRect = function (e) {
    var _e$getBoundingClientR = e.getBoundingClientRect(),
        left = _e$getBoundingClientR.left,
        top = _e$getBoundingClientR.top,
        right = _e$getBoundingClientR.right,
        bottom = _e$getBoundingClientR.bottom; // [ x, y, w, h ]


    return [left, top, right - left, bottom - top];
  };

  _.mixins = function () {
    for (var _len4 = arguments.length, list = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      list[_key4] = arguments[_key4];
    }

    return function (constructor) {
      Object.assign.apply(Object, [constructor.prototype].concat(list));
    };
  };

  _.reloadConstructor = function (constructor) {
    return (
      /*#__PURE__*/
      function (_constructor) {
        _inheritsLoose(ReloadConstructor, _constructor);

        function ReloadConstructor() {
          return _constructor.apply(this, arguments) || this;
        }

        return ReloadConstructor;
      }(constructor)
    );
  };

  var Browse =
  /*#__PURE__*/
  function () {
    function Browse(events) {
      this.modeType = 'browse';
    }

    var _proto = Browse.prototype;

    _proto.onEnter = function onEnter() {};

    _proto.onExit = function onExit() {};

    _proto.onTrigger = function onTrigger() {
      console.log('点吧~老弟嗷~我浏览模式啥也不会干的~');
    };

    return Browse;
  }();

  var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
      if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };

  var __metadata = undefined && undefined.__metadata || function (k, v) {
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
  };

  var EventListener = {
    'setting-click': [{
      capture: true
    }, function (config) {
      var _this = this;

      return this.events.click(config).subscribe(function (e) {
        e.stopPropagation(); // 包装事件数据，触发事件消费 onTrigger;

        _this.onTrigger({
          tag: 'selectPoint',
          point: _this.domMasker.activePoint,
          // 是否是重复设置的埋点
          isRepeat: _this.domMasker.points.filter(function (point) {
            return point.pid === _this.domMasker.activePoint.pid;
          }).length !== 0
        });
      });
    }],
    'setting-mousemove': [{
      capture: false,
      debounceTime: 200
    }, function (config) {
      var _this2 = this;

      return this.events.mousemove(config).subscribe(function (e) {
        // 包装事件数据，触发事件消费 onTrigger
        var activePoint = new Point(e.target);

        if (activePoint !== _this2.domMasker.activePoint) {
          // 获取的元素为新的捕捉元素
          _this2.domMasker.activePoint = activePoint; // 渲染遮罩层

          _this2.domMasker.reset();

          _this2.domMasker.render(_this2.domMasker.canvas.getContext('2d'), new Point(e.target));
        }
      });
    }],
    'setting-preset': [{}, function () {
      var _this3 = this;

      return this.events.messageOf('preset').subscribe(function (msg) {
        _this3.domMasker.preset(msg.data.points);
      });
    }]
  };

  var Setting =
  /*#__PURE__*/
  function () {
    function Setting(events) {
      var _this4 = this;

      this.modeType = 'setting';
      this.events = events;
      this.subs = []; // 单独注册父页面的重置通讯
      // 捕捉到元素之后 Setting 模式会将当前绑定的 setting- 监控事件都注销
      // 因此在不改变模式的情况下需要依靠父窗口消息推送 reset 指令来重新开启捕捉元素

      this.events.messageOf('reset').subscribe(function (msg) {
        // 绑定监控事件
        _this4.subscribe(); // 若此处将新的预设埋点传过来了，则更新，否则使用原来的


        msg.data.points && _this4.domMasker.preset(msg.data.points); // 重置埋点蒙板

        _this4.domMasker.reset();
      });
    }

    var _proto = Setting.prototype;

    _proto.subscribe = function subscribe() {
      // 注册事件监听
      // 将自身所有 模式 + '-' 开头的事件监听器方法全部注册，并记录至 subs
      for (var key in this) {
        if (key.startsWith(this.modeType)) {
          var _this$key = _slicedToArray(this[key], 2),
              config = _this$key[0],
              cb = _this$key[1];

          this.subs.push(cb.call(this, config));
        }
      }
    };

    _proto.unsubscribe = function unsubscribe() {
      // 注销事件监听
      this.subs.length && this.subs.forEach(function (unsub) {
        return unsub.unsubscribe();
      });
      this.subs = [];
    };

    _proto.onEnter = function onEnter() {
      var points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      // 绑定监控事件
      this.subscribe(); // 初始化埋点交互遮罩

      this.domMasker = new DomMasker(points); // todo: 阻止文档滚动
    };

    _proto.onExit = function onExit() {
      // 注销事件监听
      this.unsubscribe();
      this.domMasker.clear();
    };

    _proto.onTrigger = function onTrigger(data) {
      console.log('SettingLifeCycle onTrigger：', data); // console.log('当前的Points: ', this.domMasker.points);
      // 当前已捕获到埋点，通过注销绑定的监听可保持埋点蒙板状态
      // 注销绑定的监听

      this.unsubscribe(); // 通知父层设置层埋点捕捉完毕

      window.parent && window.parent.postMessage(data, '*');
    };

    return Setting;
  }();

  Setting = __decorate([_.mixins(EventListener), __metadata("design:paramtypes", [Object])], Setting);

  var customCanvas = function customCanvas(width, height) {
    var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rgba(77, 131, 202, 0.5)';
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

  var DomMasker =
  /*#__PURE__*/
  function () {
    function DomMasker() {
      var points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      // points: [{ pid:'span.corner.top!document.querySelector()!sysId!pageId' }]
      if (!DomMasker.instance) {
        // 初始化 主绘制canvas / 缓存canvas
        this.canvas = customCanvas(DomMasker.w, DomMasker.h);
        this.tempCanvas = customCanvas(DomMasker.w, DomMasker.h, 'rgba(200, 100, 50, 0.6)'); // 插入页面根节点

        document.body.appendChild(this.canvas);
        DomMasker.instance = this;
      } // 每次绑定预设埋点信息时，都重新缓存并初始化 缓存canvas


      this.preset(points); // 手动重置 主绘制canvas

      this.reset(); // 返回单例

      return DomMasker.instance;
    } // 将预设埋点信息标准化，并将信息对应的绘制到 缓存canvas 上
    // 注意：此API不会造成页面 主绘制canvas 的绘制
    // 幂等操作


    var _proto2 = DomMasker.prototype;

    _proto2.preset = function preset(points) {
      var _this5 = this;

      this.tempCanvas.getContext('2d').clearRect(0, 0, DomMasker.w, DomMasker.h);
      this.points = points.map(function (p) {
        return new Point(p);
      });
      var ctx = this.tempCanvas.getContext('2d'); // 绘制预设埋点蒙版，保存在内存中

      this.points.forEach(function (point) {
        _this5.render(ctx, point);
      });
    };

    _proto2.clear = function clear() {
      this.canvas.getContext('2d').clearRect(0, 0, DomMasker.w, DomMasker.h);
    };

    _proto2.reset = function reset() {
      this.clear();

      if (this.points.length) {
        // 将缓存信息当做背景绘制到 主绘制canvas
        var ctx = this.canvas.getContext('2d');
        ctx.drawImage(this.tempCanvas, 0, 0);
      }
    };

    _proto2.render = function render(ctx, point) {
      var tag = point.tag,
          _point$rect = _slicedToArray(point.rect, 4),
          x = _point$rect[0],
          y = _point$rect[1],
          width = _point$rect[2],
          height = _point$rect[3];

      ctx.fillRect(x, y, width, height);
      ctx.fillText(tag, x, y); // ctx.save();
      // ctx.strokeStyle = '#fff';
      // ctx.lineWidth = 1;
      // ctx.strokeText(tag, x, y);
      // ctx.restore();
    };

    return DomMasker;
  }();

  DomMasker.w = window.innerWidth;
  DomMasker.h = window.innerHeight;

  var Point =
  /*#__PURE__*/
  function () {
    function Point(origin) {
      if (origin instanceof EventTarget) {
        this.createByEvent(origin);
      } else {
        this.createByPointBase(origin);
      }
    }

    var _proto3 = Point.prototype;

    _proto3.createByPointBase = function createByPointBase(origin) {
      this.pid = origin.pid;

      var elem = _.getElemByPid(origin.pid);

      this.tag = '<' + elem.tagName.toLowerCase() + '>'; // [ x, y, w, h ]

      this.rect = _.getElemClientRect(elem);
    };

    _proto3.createByEvent = function createByEvent(origin) {
      this.pid = _.getElemPid('sysId', 'pageId', origin);
      this.tag = '<' + origin.tagName.toLowerCase() + '>'; // [ x, y, w, h ]

      this.rect = _.getElemClientRect(origin);
    };

    return Point;
  }();

  var __decorate$1 = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
      if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };

  var __metadata$1 = undefined && undefined.__metadata || function (k, v) {
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
  };

  var EventListener$1 = {
    'report-click': [{
      capture: false
    }, function (config) {
      var _this = this;

      return this.events.click(config).subscribe(function (e) {
        // 包装事件数据，触发事件消费 onTrigger
        _this.onTrigger(e);
      });
    }]
  };

  var Report =
  /*#__PURE__*/
  function () {
    function Report(events) {
      this.modeType = 'report';
      this.events = events;
      this.subs = [];
    }

    var _proto = Report.prototype;

    _proto.onEnter = function onEnter() {
      // 注册事件监听
      console.log(this); // 将自身所有 模式 + '-' 开头的事件监听器方法全部注册，并记录至 subs

      for (var key in this) {
        if (key.startsWith(this.modeType)) {
          var _this$key = _slicedToArray(this[key], 2),
              config = _this$key[0],
              cb = _this$key[1];

          this.subs.push(cb.call(this, config));
        }
      }
    };

    _proto.onExit = function onExit() {
      // 注销事件监听
      this.subs.length && this.subs.forEach(function (unsub) {
        return unsub.unsubscribe();
      });
      this.subs = [];
    };

    _proto.onTrigger = function onTrigger(data) {
      // 根据当前事件消费者消费数据
      console.log('ReportLifeCycle onTrigger: ', data);
    };

    _proto.formatDatagram = function formatDatagram() {};

    return Report;
  }();

  Report = __decorate$1([_.mixins(EventListener$1), __metadata$1("design:paramtypes", [Object])], Report);

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

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function isFunction(x) {
      return typeof x === 'function';
  }
  //# sourceMappingURL=isFunction.js.map

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
  //# sourceMappingURL=config.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function hostReportError(err) {
      setTimeout(function () { throw err; }, 0);
  }
  //# sourceMappingURL=hostReportError.js.map

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
  //# sourceMappingURL=Observer.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var isArray = /*@__PURE__*/ (function () { return Array.isArray || (function (x) { return x && typeof x.length === 'number'; }); })();
  //# sourceMappingURL=isArray.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function isObject(x) {
      return x !== null && typeof x === 'object';
  }
  //# sourceMappingURL=isObject.js.map

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
  //# sourceMappingURL=UnsubscriptionError.js.map

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
  //# sourceMappingURL=Subscription.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var rxSubscriber = /*@__PURE__*/ (function () {
      return typeof Symbol === 'function'
          ? /*@__PURE__*/ Symbol('rxSubscriber')
          : '@@rxSubscriber_' + /*@__PURE__*/ Math.random();
  })();
  //# sourceMappingURL=rxSubscriber.js.map

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
  //# sourceMappingURL=Subscriber.js.map

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
  //# sourceMappingURL=canReportError.js.map

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
  //# sourceMappingURL=toSubscriber.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var observable = /*@__PURE__*/ (function () { return typeof Symbol === 'function' && Symbol.observable || '@@observable'; })();
  //# sourceMappingURL=observable.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function noop$1() { }
  //# sourceMappingURL=noop.js.map

  /** PURE_IMPORTS_START _noop PURE_IMPORTS_END */
  function pipeFromArray(fns) {
      if (!fns) {
          return noop$1;
      }
      if (fns.length === 1) {
          return fns[0];
      }
      return function piped(input) {
          return fns.reduce(function (prev, fn) { return fn(prev); }, input);
      };
  }
  //# sourceMappingURL=pipe.js.map

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
  //# sourceMappingURL=Observable.js.map

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
  //# sourceMappingURL=Action.js.map

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
  //# sourceMappingURL=AsyncAction.js.map

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
  //# sourceMappingURL=Scheduler.js.map

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
  //# sourceMappingURL=AsyncScheduler.js.map

  /** PURE_IMPORTS_START _AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
  var async = /*@__PURE__*/ new AsyncScheduler(AsyncAction);
  //# sourceMappingURL=async.js.map

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
  //# sourceMappingURL=map.js.map

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
  //# sourceMappingURL=fromEvent.js.map

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
  //# sourceMappingURL=filter.js.map

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
  //# sourceMappingURL=sampleTime.js.map

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

  var click = function click(config) {
    return fromEvent(document, 'click', {
      capture: config.capture
    });
  };
  var mousemove = function mousemove(config) {
    return fromEvent(document, 'mousemove', {
      capture: config.capture
    }).pipe(sampleTime(config.debounceTime), filter(function (e) {
      return e.target.tagName !== 'HTML';
    }));
  };
  var load = function load() {
    return fromEvent(document, 'load');
  };
  var beforeUnload = function beforeUnload() {
    return fromEvent(document, 'beforeunload');
  };
  var hashchange = function hashchange() {
    return fromEvent(document, 'hashchange');
  };
  var popstate = function popstate() {
    return fromEvent(document, 'popstate');
  };
  var visibilitychange = function visibilitychange() {
    return fromEvent(document, 'visibilitychange');
  };
  var online = function online() {
    return fromEvent(document, 'online');
  };
  var offline = function offline() {
    return fromEvent(document, 'offline');
  };
  var message = function message() {
    return fromEvent(window, 'message');
  };

  // export const performance: () => Observable<Event> =
  //     () => {
  //     }
  // // 自定义事件 | 上报页面停留时长数据
  // export const tp: () => Observable<Event> =
  //     () => {
  //     }
  // 切换模式相关 切换至浏览模式 切换至埋点模式（附带preset）
  // 埋点流程相关
  // 自定义事件 | message分流
  // 推送已埋埋点
  // msg: {
  //     data: {
  //         tag: 'mode',
  //         mode: 'setting',
  //         points: PointBase[]
  //     }
  // }
  // 重置（包括 鼠标移出区域、点击重置按钮）
  // msg: {
  //     data: {
  //         tag: 'reset'
  //     }
  // }

  var messageOf = function messageOf(tag) {
    return message().pipe(filter(function (msg) {
      return msg.data.tag === tag;
    }));
  };



  var events = /*#__PURE__*/Object.freeze({
    click: click,
    mousemove: mousemove,
    load: load,
    beforeUnload: beforeUnload,
    hashchange: hashchange,
    popstate: popstate,
    visibilitychange: visibilitychange,
    online: online,
    offline: offline,
    message: message,
    messageOf: messageOf
  });

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

  var HXAnalytics =
  /*#__PURE__*/
  function () {
    function HXAnalytics(_ref) {
      var _this = this;

      var mode = _ref.mode;
      this.modeContainer = mode;
      this.mode = _.inIframe() ? 'browse' : 'report'; // 绑定模式切换事件

      messageOf('mode').subscribe(function (msg) {
        Reflect.defineMetadata('onMessageSetModeWithPoint', msg.data.points, _this);
        _this.mode = msg.data.mode;
      });
    }

    var _proto = HXAnalytics.prototype;

    // 提供应用开发人员主动埋点能力
    _proto.push = function push(data) {
      this._mode.onTrigger(data);
    };

    _proto.init = function init() {
      return this;
    };

    _createClass(HXAnalytics, [{
      key: "mode",
      set: function set(modeType) {
        if (this.mode === modeType) return; // last mode exit

        this._mode && this._mode.onExit(); // 更新 mode

        this._mode = this.modeContainer[modeType]; // mode enter

        this._mode.onEnter(Reflect.getMetadata('onMessageSetMode', this));
      },
      get: function get() {
        return this._mode ? this._mode.modeType : null;
      }
    }]);

    return HXAnalytics;
  }();

  var ha = new HXAnalytics({
    mode: {
      browse: new Browse(),
      report: new Report(events),
      setting: new Setting(events)
    }
  });
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
  // IoC 容器重构公共模块
  // 错误处理
  // 上报统一格式配置
  // 行为上报控制器切换 接口 / 本地缓存
  // 用户身份校验
  // 页面停留时长 页面切换机制
  // 单测
  // 文档

  return ha;

}());
//# sourceMappingURL=hx-analytics-jssdk.js.map
