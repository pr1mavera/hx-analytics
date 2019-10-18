
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

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
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

  /**
   * Created by rowthan on 2017/11/19.
   */

  var pure = whatsElementPure.default;

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

  _.getElemId = function (sysId, pageId, e) {
    try {
      var _getUniqueId = new pure().getUniqueId(e),
          type = _getUniqueId.type,
          wid = _getUniqueId.wid;

      return "".concat(wid, "!").concat(type, "!").concat(sysId, "!").concat(pageId);
    } catch (_a) {
      return null;
    }
  };

  _.getElem = function (pid) {
    return document.getElementById(pid) || document.getElementsByName(pid)[0] || document.querySelector(pid);
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
      capture: false
    }, function (config) {
      var _this = this;

      return this.events.click(config).subscribe(function (e) {
        // 包装事件数据，触发事件消费 onTrigger
        _this.onTrigger(e);
      });
    }],
    'setting-reset': [{}, function () {
      var _this2 = this;

      return this.events.messageOf('reset').subscribe(function () {
        _this2.domMasker.reset();
      });
    }],
    'setting-preset': [{}, function () {
      var _this3 = this;

      return this.events.messageOf('preset').subscribe(function (msg) {
        _this3.domMasker.preset(msg.data.presetPoints);
      });
    }]
  };

  var Setting =
  /*#__PURE__*/
  function () {
    function Setting(events) {
      this.modeType = 'setting';
      this.events = events;
      this.subs = []; // 注册通讯
    }

    var _proto = Setting.prototype;

    _proto.onEnter = function onEnter() {
      // 切换当前事件消费者为Setting
      // 订阅该模式下的事件消费信息
      // 注册事件监听
      // 将自身所有 模式 + '-' 开头的事件监听器方法全部注册，并记录至 subs
      for (var key in this) {
        if (key.startsWith(this.modeType)) {
          var _this$key = _slicedToArray(this[key], 2),
              config = _this$key[0],
              cb = _this$key[1];

          this.subs.push(cb.call(this, config));
        }
      } // 初始化埋点交互遮罩


      this.DomMasker = new DomMasker(); // todo: 阻止文档滚动
    };

    _proto.onExit = function onExit() {
      // 注销事件监听
      this.subs.length && this.subs.forEach(function (unsub) {
        return unsub.unsubscribe();
      });
      this.subs = [];
      this.DomMasker.clear();
    };

    _proto.onTrigger = function onTrigger(data) {
      console.log('SettingLifeCycle onTrigger');
      window.parent.postMessage(data, '*');
    };

    return Setting;
  }();

  Setting = __decorate([_.mixins(EventListener), __metadata("design:paramtypes", [Object])], Setting);

  var DomMasker =
  /*#__PURE__*/
  function () {
    function DomMasker() {
      var points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (!DomMasker.instance) {
        // 初始化 主绘制canvas / 缓存canvas
        var w = window.innerWidth;
        var h = window.innerHeight;
        this.canvas = new CustomCanvas(w, h);
        this.tempCanvas = new CustomCanvas(w, h); // 插入页面根节点

        document.body.appendChild(this.canvas);
        DomMasker.instance = this;
      } // 每次绑定预设埋点信息时，都重新缓存并初始化 缓存canvas


      this.preset(points); // 将缓存信息当做背景绘制到 主绘制canvas

      var ctx = this.canvas.getContext('2d');
      ctx.drawImage(this.tempCanvas, 0, 0); // 返回单例

      return DomMasker.instance;
    } // 将预设埋点信息标准化，并将信息对应的绘制到 缓存canvas 上
    // 幂等操作


    var _proto2 = DomMasker.prototype;

    _proto2.preset = function preset(points) {
      var _this4 = this;

      this.tempCanvas.clear();
      this.points = points.map(function (p) {
        return new Point(p.pid);
      });
      var ctx = this.tempCanvas.getContext('2d'); // 绘制预设埋点蒙版，保存在内存中

      this.points.forEach(function (point) {
        _this4.render(ctx, point.getRect());
      });
    };

    _proto2.clear = function clear() {
      this.canvas.clear();
    };

    _proto2.reset = function reset() {};

    _proto2.onCatch = function onCatch() {};

    _proto2.render = function render(ctx, rect) {};

    return DomMasker;
  }();

  var Point =
  /*#__PURE__*/
  function () {
    function Point(pid) {
      this.pid = pid;
    }

    var _proto3 = Point.prototype;

    _proto3.getRect = function getRect() {
      var wid = this.pid.split('!')[0];

      var _$getElem = _.getElem(wid),
          clientWidth = _$getElem.clientWidth,
          clientHeight = _$getElem.clientHeight,
          scrollHeight = _$getElem.scrollHeight,
          scrollWidth = _$getElem.scrollWidth,
          offsetTop = _$getElem.offsetTop,
          offsetLeft = _$getElem.offsetLeft; // [ x, y, w, h ]


      return [offsetLeft - scrollWidth, offsetTop - scrollHeight, clientWidth, clientHeight];
    };

    _proto3.draw = function draw(ctx) {};

    return Point;
  }();

  var CustomCanvas =
  /*#__PURE__*/
  function (_HTMLCanvasElement) {
    _inheritsLoose(CustomCanvas, _HTMLCanvasElement);

    function CustomCanvas(w, h) {
      var _this5;

      _this5 = _HTMLCanvasElement.call(this) || this;
      _this5.width = _this5.w = w;
      _this5.height = _this5.h = h;
      _this5.style.position = 'absolute';
      _this5.style.top = '0';
      _this5.style.left = '0';
      _this5.style.zIndex = '9999';
      _this5.style.pointerEvents = 'none';
      return _assertThisInitialized(_this5) || _assertThisInitialized(_this5);
    }

    var _proto4 = CustomCanvas.prototype;

    _proto4.clear = function clear() {
      this.getContext('2d').clearRect(0, 0, this.w, this.h);
    };

    return CustomCanvas;
  }(_wrapNativeSuper(HTMLCanvasElement));

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
    return fromEvent(document, 'click', config);
  };
  var mousemove = function mousemove(config) {
    return fromEvent(document, 'mousemove', config);
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
      this.mode = _.inIframe() ? 'browse' : 'report'; // 调用 mode 的生命周期

      this._mode.onEnter(); // 绑定模式切换事件


      messageOf('mode').subscribe(function (msg) {
        _this.mode = msg.data.mode; // 调用 mode 的生命周期

        _this._mode.onEnter(msg.data.points);
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
      get: function get() {
        return this._mode ? this._mode.modeType : null;
      },
      set: function set(modeType) {
        if (this.mode === modeType) return;
        this._mode = this.modeContainer[modeType];
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

  return ha;

}());
//# sourceMappingURL=hx-analytics-jssdk.js.map
