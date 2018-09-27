(function () {
	'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var _global = createCommonjsModule(function (module) {
	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
	});

	var hasOwnProperty = {}.hasOwnProperty;
	var _has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var _fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var _descriptors = !_fails(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});

	var _core = createCommonjsModule(function (module) {
	var core = module.exports = { version: '2.5.7' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
	});
	var _core_1 = _core.version;

	var _isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	var _anObject = function (it) {
	  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

	var document$1 = _global.document;
	// typeof document.createElement is 'object' in old IE
	var is = _isObject(document$1) && _isObject(document$1.createElement);
	var _domCreate = function (it) {
	  return is ? document$1.createElement(it) : {};
	};

	var _ie8DomDefine = !_descriptors && !_fails(function () {
	  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
	});

	// 7.1.1 ToPrimitive(input [, PreferredType])

	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var _toPrimitive = function (it, S) {
	  if (!_isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var dP = Object.defineProperty;

	var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  _anObject(O);
	  P = _toPrimitive(P, true);
	  _anObject(Attributes);
	  if (_ie8DomDefine) try {
	    return dP(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var _objectDp = {
		f: f
	};

	var _propertyDesc = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var _hide = _descriptors ? function (object, key, value) {
	  return _objectDp.f(object, key, _propertyDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var id = 0;
	var px = Math.random();
	var _uid = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

	var _redefine = createCommonjsModule(function (module) {
	var SRC = _uid('src');
	var TO_STRING = 'toString';
	var $toString = Function[TO_STRING];
	var TPL = ('' + $toString).split(TO_STRING);

	_core.inspectSource = function (it) {
	  return $toString.call(it);
	};

	(module.exports = function (O, key, val, safe) {
	  var isFunction = typeof val == 'function';
	  if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
	  if (O[key] === val) return;
	  if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
	  if (O === _global) {
	    O[key] = val;
	  } else if (!safe) {
	    delete O[key];
	    _hide(O, key, val);
	  } else if (O[key]) {
	    O[key] = val;
	  } else {
	    _hide(O, key, val);
	  }
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, TO_STRING, function toString() {
	  return typeof this == 'function' && this[SRC] || $toString.call(this);
	});
	});

	var _aFunction = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

	// optional / simple context binding

	var _ctx = function (fn, that, length) {
	  _aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var PROTOTYPE = 'prototype';

	var $export = function (type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
	  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
	  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
	  var key, own, out, exp;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    // export native or passed
	    out = (own ? target : source)[key];
	    // bind timers to global for call from export context
	    exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
	    // extend global
	    if (target) _redefine(target, key, out, type & $export.U);
	    // export
	    if (exports[key] != out) _hide(exports, key, exp);
	    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
	  }
	};
	_global.core = _core;
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library`
	var _export = $export;

	var _meta = createCommonjsModule(function (module) {
	var META = _uid('meta');


	var setDesc = _objectDp.f;
	var id = 0;
	var isExtensible = Object.isExtensible || function () {
	  return true;
	};
	var FREEZE = !_fails(function () {
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function (it) {
	  setDesc(it, META, { value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  } });
	};
	var fastKey = function (it, create) {
	  // return primitive with prefix
	  if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!_has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function (it, create) {
	  if (!_has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY: META,
	  NEED: false,
	  fastKey: fastKey,
	  getWeak: getWeak,
	  onFreeze: onFreeze
	};
	});
	var _meta_1 = _meta.KEY;
	var _meta_2 = _meta.NEED;
	var _meta_3 = _meta.fastKey;
	var _meta_4 = _meta.getWeak;
	var _meta_5 = _meta.onFreeze;

	var _library = false;

	var _shared = createCommonjsModule(function (module) {
	var SHARED = '__core-js_shared__';
	var store = _global[SHARED] || (_global[SHARED] = {});

	(module.exports = function (key, value) {
	  return store[key] || (store[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: _core.version,
	  mode: _library ? 'pure' : 'global',
	  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
	});
	});

	var _wks = createCommonjsModule(function (module) {
	var store = _shared('wks');

	var Symbol = _global.Symbol;
	var USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function (name) {
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
	};

	$exports.store = store;
	});

	var def = _objectDp.f;

	var TAG = _wks('toStringTag');

	var _setToStringTag = function (it, tag, stat) {
	  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};

	var f$1 = _wks;

	var _wksExt = {
		f: f$1
	};

	var defineProperty = _objectDp.f;
	var _wksDefine = function (name) {
	  var $Symbol = _core.Symbol || (_core.Symbol = _global.Symbol || {});
	  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: _wksExt.f(name) });
	};

	var toString = {}.toString;

	var _cof = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	// fallback for non-array-like ES3 and non-enumerable old V8 strings

	// eslint-disable-next-line no-prototype-builtins
	var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return _cof(it) == 'String' ? it.split('') : Object(it);
	};

	// 7.2.1 RequireObjectCoercible(argument)
	var _defined = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};

	// to indexed object, toObject with fallback for non-array-like ES3 strings


	var _toIobject = function (it) {
	  return _iobject(_defined(it));
	};

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;
	var _toInteger = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

	// 7.1.15 ToLength

	var min = Math.min;
	var _toLength = function (it) {
	  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;
	var _toAbsoluteIndex = function (index, length) {
	  index = _toInteger(index);
	  return index < 0 ? max(index + length, 0) : min$1(index, length);
	};

	// false -> Array#indexOf
	// true  -> Array#includes



	var _arrayIncludes = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = _toIobject($this);
	    var length = _toLength(O.length);
	    var index = _toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
	      if (O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var shared = _shared('keys');

	var _sharedKey = function (key) {
	  return shared[key] || (shared[key] = _uid(key));
	};

	var arrayIndexOf = _arrayIncludes(false);
	var IE_PROTO = _sharedKey('IE_PROTO');

	var _objectKeysInternal = function (object, names) {
	  var O = _toIobject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (_has(O, key = names[i++])) {
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE 8- don't enum bug keys
	var _enumBugKeys = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)



	var _objectKeys = Object.keys || function keys(O) {
	  return _objectKeysInternal(O, _enumBugKeys);
	};

	var f$2 = Object.getOwnPropertySymbols;

	var _objectGops = {
		f: f$2
	};

	var f$3 = {}.propertyIsEnumerable;

	var _objectPie = {
		f: f$3
	};

	// all enumerable object keys, includes symbols



	var _enumKeys = function (it) {
	  var result = _objectKeys(it);
	  var getSymbols = _objectGops.f;
	  if (getSymbols) {
	    var symbols = getSymbols(it);
	    var isEnum = _objectPie.f;
	    var i = 0;
	    var key;
	    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
	  } return result;
	};

	// 7.2.2 IsArray(argument)

	var _isArray = Array.isArray || function isArray(arg) {
	  return _cof(arg) == 'Array';
	};

	var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  _anObject(O);
	  var keys = _objectKeys(Properties);
	  var length = keys.length;
	  var i = 0;
	  var P;
	  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

	var document$2 = _global.document;
	var _html = document$2 && document$2.documentElement;

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



	var IE_PROTO$1 = _sharedKey('IE_PROTO');
	var Empty = function () { /* empty */ };
	var PROTOTYPE$1 = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = _domCreate('iframe');
	  var i = _enumBugKeys.length;
	  var lt = '<';
	  var gt = '>';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  _html.appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
	  return createDict();
	};

	var _objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty[PROTOTYPE$1] = _anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE$1] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$1] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : _objectDps(result, Properties);
	};

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

	var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

	var f$4 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return _objectKeysInternal(O, hiddenKeys);
	};

	var _objectGopn = {
		f: f$4
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

	var gOPN = _objectGopn.f;
	var toString$1 = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return gOPN(it);
	  } catch (e) {
	    return windowNames.slice();
	  }
	};

	var f$5 = function getOwnPropertyNames(it) {
	  return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(_toIobject(it));
	};

	var _objectGopnExt = {
		f: f$5
	};

	var gOPD = Object.getOwnPropertyDescriptor;

	var f$6 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
	  O = _toIobject(O);
	  P = _toPrimitive(P, true);
	  if (_ie8DomDefine) try {
	    return gOPD(O, P);
	  } catch (e) { /* empty */ }
	  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
	};

	var _objectGopd = {
		f: f$6
	};

	// ECMAScript 6 symbols shim





	var META = _meta.KEY;



















	var gOPD$1 = _objectGopd.f;
	var dP$1 = _objectDp.f;
	var gOPN$1 = _objectGopnExt.f;
	var $Symbol = _global.Symbol;
	var $JSON = _global.JSON;
	var _stringify = $JSON && $JSON.stringify;
	var PROTOTYPE$2 = 'prototype';
	var HIDDEN = _wks('_hidden');
	var TO_PRIMITIVE = _wks('toPrimitive');
	var isEnum = {}.propertyIsEnumerable;
	var SymbolRegistry = _shared('symbol-registry');
	var AllSymbols = _shared('symbols');
	var OPSymbols = _shared('op-symbols');
	var ObjectProto = Object[PROTOTYPE$2];
	var USE_NATIVE = typeof $Symbol == 'function';
	var QObject = _global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = _descriptors && _fails(function () {
	  return _objectCreate(dP$1({}, 'a', {
	    get: function () { return dP$1(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (it, key, D) {
	  var protoDesc = gOPD$1(ObjectProto, key);
	  if (protoDesc) delete ObjectProto[key];
	  dP$1(it, key, D);
	  if (protoDesc && it !== ObjectProto) dP$1(ObjectProto, key, protoDesc);
	} : dP$1;

	var wrap = function (tag) {
	  var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D) {
	  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
	  _anObject(it);
	  key = _toPrimitive(key, true);
	  _anObject(D);
	  if (_has(AllSymbols, key)) {
	    if (!D.enumerable) {
	      if (!_has(it, HIDDEN)) dP$1(it, HIDDEN, _propertyDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
	      D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });
	    } return setSymbolDesc(it, key, D);
	  } return dP$1(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P) {
	  _anObject(it);
	  var keys = _enumKeys(P = _toIobject(P));
	  var i = 0;
	  var l = keys.length;
	  var key;
	  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P) {
	  return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key) {
	  var E = isEnum.call(this, key = _toPrimitive(key, true));
	  if (this === ObjectProto && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;
	  return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
	  it = _toIobject(it);
	  key = _toPrimitive(key, true);
	  if (it === ObjectProto && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;
	  var D = gOPD$1(it, key);
	  if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it) {
	  var names = gOPN$1(_toIobject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
	  var IS_OP = it === ObjectProto;
	  var names = gOPN$1(IS_OP ? OPSymbols : _toIobject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if (!USE_NATIVE) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
	    var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function (value) {
	      if (this === ObjectProto) $set.call(OPSymbols, value);
	      if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, _propertyDesc(1, value));
	    };
	    if (_descriptors && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
	    return wrap(tag);
	  };
	  _redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
	    return this._k;
	  });

	  _objectGopd.f = $getOwnPropertyDescriptor;
	  _objectDp.f = $defineProperty;
	  _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
	  _objectPie.f = $propertyIsEnumerable;
	  _objectGops.f = $getOwnPropertySymbols;

	  if (_descriptors && !_library) {
	    _redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  _wksExt.f = function (name) {
	    return wrap(_wks(name));
	  };
	}

	_export(_export.G + _export.W + _export.F * !USE_NATIVE, { Symbol: $Symbol });

	for (var es6Symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), j = 0; es6Symbols.length > j;)_wks(es6Symbols[j++]);

	for (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);

	_export(_export.S + _export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function (key) {
	    return _has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
	    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
	  },
	  useSetter: function () { setter = true; },
	  useSimple: function () { setter = false; }
	});

	_export(_export.S + _export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && _export(_export.S + _export.F * (!USE_NATIVE || _fails(function () {
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it) {
	    var args = [it];
	    var i = 1;
	    var replacer, $replacer;
	    while (arguments.length > i) args.push(arguments[i++]);
	    $replacer = replacer = args[1];
	    if (!_isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	    if (!_isArray(replacer)) replacer = function (key, value) {
	      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	      if (!isSymbol(value)) return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	_setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	_setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	_setToStringTag(_global.JSON, 'JSON', true);

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	_export(_export.S, 'Object', { create: _objectCreate });

	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	_export(_export.S + _export.F * !_descriptors, 'Object', { defineProperty: _objectDp.f });

	// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
	_export(_export.S + _export.F * !_descriptors, 'Object', { defineProperties: _objectDps });

	// most Object methods by ES6 should accept primitives



	var _objectSap = function (KEY, exec) {
	  var fn = (_core.Object || {})[KEY] || Object[KEY];
	  var exp = {};
	  exp[KEY] = exec(fn);
	  _export(_export.S + _export.F * _fails(function () { fn(1); }), 'Object', exp);
	};

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)

	var $getOwnPropertyDescriptor$1 = _objectGopd.f;

	_objectSap('getOwnPropertyDescriptor', function () {
	  return function getOwnPropertyDescriptor(it, key) {
	    return $getOwnPropertyDescriptor$1(_toIobject(it), key);
	  };
	});

	// 7.1.13 ToObject(argument)

	var _toObject = function (it) {
	  return Object(_defined(it));
	};

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


	var IE_PROTO$2 = _sharedKey('IE_PROTO');
	var ObjectProto$1 = Object.prototype;

	var _objectGpo = Object.getPrototypeOf || function (O) {
	  O = _toObject(O);
	  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto$1 : null;
	};

	// 19.1.2.9 Object.getPrototypeOf(O)



	_objectSap('getPrototypeOf', function () {
	  return function getPrototypeOf(it) {
	    return _objectGpo(_toObject(it));
	  };
	});

	// 19.1.2.14 Object.keys(O)



	_objectSap('keys', function () {
	  return function keys(it) {
	    return _objectKeys(_toObject(it));
	  };
	});

	// 19.1.2.7 Object.getOwnPropertyNames(O)
	_objectSap('getOwnPropertyNames', function () {
	  return _objectGopnExt.f;
	});

	// 19.1.2.5 Object.freeze(O)

	var meta = _meta.onFreeze;

	_objectSap('freeze', function ($freeze) {
	  return function freeze(it) {
	    return $freeze && _isObject(it) ? $freeze(meta(it)) : it;
	  };
	});

	// 19.1.2.17 Object.seal(O)

	var meta$1 = _meta.onFreeze;

	_objectSap('seal', function ($seal) {
	  return function seal(it) {
	    return $seal && _isObject(it) ? $seal(meta$1(it)) : it;
	  };
	});

	// 19.1.2.15 Object.preventExtensions(O)

	var meta$2 = _meta.onFreeze;

	_objectSap('preventExtensions', function ($preventExtensions) {
	  return function preventExtensions(it) {
	    return $preventExtensions && _isObject(it) ? $preventExtensions(meta$2(it)) : it;
	  };
	});

	// 19.1.2.12 Object.isFrozen(O)


	_objectSap('isFrozen', function ($isFrozen) {
	  return function isFrozen(it) {
	    return _isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
	  };
	});

	// 19.1.2.13 Object.isSealed(O)


	_objectSap('isSealed', function ($isSealed) {
	  return function isSealed(it) {
	    return _isObject(it) ? $isSealed ? $isSealed(it) : false : true;
	  };
	});

	// 19.1.2.11 Object.isExtensible(O)


	_objectSap('isExtensible', function ($isExtensible) {
	  return function isExtensible(it) {
	    return _isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
	  };
	});

	// 19.1.2.1 Object.assign(target, source, ...)





	var $assign = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	var _objectAssign = !$assign || _fails(function () {
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var S = Symbol();
	  var K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function (k) { B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = _toObject(target);
	  var aLen = arguments.length;
	  var index = 1;
	  var getSymbols = _objectGops.f;
	  var isEnum = _objectPie.f;
	  while (aLen > index) {
	    var S = _iobject(arguments[index++]);
	    var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
	  } return T;
	} : $assign;

	// 19.1.3.1 Object.assign(target, source)


	_export(_export.S + _export.F, 'Object', { assign: _objectAssign });

	// 7.2.9 SameValue(x, y)
	var _sameValue = Object.is || function is(x, y) {
	  // eslint-disable-next-line no-self-compare
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

	// 19.1.3.10 Object.is(value1, value2)

	_export(_export.S, 'Object', { is: _sameValue });

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */


	var check = function (O, proto) {
	  _anObject(O);
	  if (!_isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
	};
	var _setProto = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function (test, buggy, set) {
	      try {
	        set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch (e) { buggy = true; }
	      return function setPrototypeOf(O, proto) {
	        check(O, proto);
	        if (buggy) O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

	// 19.1.3.19 Object.setPrototypeOf(O, proto)

	_export(_export.S, 'Object', { setPrototypeOf: _setProto.set });

	// getting tag from 19.1.3.6 Object.prototype.toString()

	var TAG$1 = _wks('toStringTag');
	// ES3 wrong here
	var ARG = _cof(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (e) { /* empty */ }
	};

	var _classof = function (it) {
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
	    // builtinTag case
	    : ARG ? _cof(O)
	    // ES3 arguments fallback
	    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

	// 19.1.3.6 Object.prototype.toString()

	var test = {};
	test[_wks('toStringTag')] = 'z';
	if (test + '' != '[object z]') {
	  _redefine(Object.prototype, 'toString', function toString() {
	    return '[object ' + _classof(this) + ']';
	  }, true);
	}

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	var _invoke = function (fn, args, that) {
	  var un = that === undefined;
	  switch (args.length) {
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return fn.apply(that, args);
	};

	var arraySlice = [].slice;
	var factories = {};

	var construct = function (F, len, args) {
	  if (!(len in factories)) {
	    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
	    // eslint-disable-next-line no-new-func
	    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
	  } return factories[len](F, args);
	};

	var _bind = Function.bind || function bind(that /* , ...args */) {
	  var fn = _aFunction(this);
	  var partArgs = arraySlice.call(arguments, 1);
	  var bound = function (/* args... */) {
	    var args = partArgs.concat(arraySlice.call(arguments));
	    return this instanceof bound ? construct(fn, args.length, args) : _invoke(fn, args, that);
	  };
	  if (_isObject(fn.prototype)) bound.prototype = fn.prototype;
	  return bound;
	};

	// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)


	_export(_export.P, 'Function', { bind: _bind });

	var dP$2 = _objectDp.f;
	var FProto = Function.prototype;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME = 'name';

	// 19.2.4.2 name
	NAME in FProto || _descriptors && dP$2(FProto, NAME, {
	  configurable: true,
	  get: function () {
	    try {
	      return ('' + this).match(nameRE)[1];
	    } catch (e) {
	      return '';
	    }
	  }
	});

	var HAS_INSTANCE = _wks('hasInstance');
	var FunctionProto = Function.prototype;
	// 19.2.3.6 Function.prototype[@@hasInstance](V)
	if (!(HAS_INSTANCE in FunctionProto)) _objectDp.f(FunctionProto, HAS_INSTANCE, { value: function (O) {
	  if (typeof this != 'function' || !_isObject(O)) return false;
	  if (!_isObject(this.prototype)) return O instanceof this;
	  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
	  while (O = _objectGpo(O)) if (this.prototype === O) return true;
	  return false;
	} });

	var _stringWs = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
	  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var space = '[' + _stringWs + ']';
	var non = '\u200b\u0085';
	var ltrim = RegExp('^' + space + space + '*');
	var rtrim = RegExp(space + space + '*$');

	var exporter = function (KEY, exec, ALIAS) {
	  var exp = {};
	  var FORCE = _fails(function () {
	    return !!_stringWs[KEY]() || non[KEY]() != non;
	  });
	  var fn = exp[KEY] = FORCE ? exec(trim) : _stringWs[KEY];
	  if (ALIAS) exp[ALIAS] = fn;
	  _export(_export.P + _export.F * FORCE, 'String', exp);
	};

	// 1 -> String#trimLeft
	// 2 -> String#trimRight
	// 3 -> String#trim
	var trim = exporter.trim = function (string, TYPE) {
	  string = String(_defined(string));
	  if (TYPE & 1) string = string.replace(ltrim, '');
	  if (TYPE & 2) string = string.replace(rtrim, '');
	  return string;
	};

	var _stringTrim = exporter;

	var $parseInt = _global.parseInt;
	var $trim = _stringTrim.trim;

	var hex = /^[-+]?0[xX]/;

	var _parseInt = $parseInt(_stringWs + '08') !== 8 || $parseInt(_stringWs + '0x16') !== 22 ? function parseInt(str, radix) {
	  var string = $trim(String(str), 3);
	  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
	} : $parseInt;

	// 18.2.5 parseInt(string, radix)
	_export(_export.G + _export.F * (parseInt != _parseInt), { parseInt: _parseInt });

	var $parseFloat = _global.parseFloat;
	var $trim$1 = _stringTrim.trim;

	var _parseFloat = 1 / $parseFloat(_stringWs + '-0') !== -Infinity ? function parseFloat(str) {
	  var string = $trim$1(String(str), 3);
	  var result = $parseFloat(string);
	  return result === 0 && string.charAt(0) == '-' ? -0 : result;
	} : $parseFloat;

	// 18.2.4 parseFloat(string)
	_export(_export.G + _export.F * (parseFloat != _parseFloat), { parseFloat: _parseFloat });

	var setPrototypeOf = _setProto.set;
	var _inheritIfRequired = function (that, target, C) {
	  var S = target.constructor;
	  var P;
	  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && _isObject(P) && setPrototypeOf) {
	    setPrototypeOf(that, P);
	  } return that;
	};

	var gOPN$2 = _objectGopn.f;
	var gOPD$2 = _objectGopd.f;
	var dP$3 = _objectDp.f;
	var $trim$2 = _stringTrim.trim;
	var NUMBER = 'Number';
	var $Number = _global[NUMBER];
	var Base = $Number;
	var proto = $Number.prototype;
	// Opera ~12 has broken Object#toString
	var BROKEN_COF = _cof(_objectCreate(proto)) == NUMBER;
	var TRIM = 'trim' in String.prototype;

	// 7.1.3 ToNumber(argument)
	var toNumber = function (argument) {
	  var it = _toPrimitive(argument, false);
	  if (typeof it == 'string' && it.length > 2) {
	    it = TRIM ? it.trim() : $trim$2(it, 3);
	    var first = it.charCodeAt(0);
	    var third, radix, maxCode;
	    if (first === 43 || first === 45) {
	      third = it.charCodeAt(2);
	      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
	    } else if (first === 48) {
	      switch (it.charCodeAt(1)) {
	        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
	        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
	        default: return +it;
	      }
	      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
	        code = digits.charCodeAt(i);
	        // parseInt parses a string to a first unavailable symbol
	        // but ToNumber should return NaN if a string contains unavailable symbols
	        if (code < 48 || code > maxCode) return NaN;
	      } return parseInt(digits, radix);
	    }
	  } return +it;
	};

	if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
	  $Number = function Number(value) {
	    var it = arguments.length < 1 ? 0 : value;
	    var that = this;
	    return that instanceof $Number
	      // check on 1..constructor(foo) case
	      && (BROKEN_COF ? _fails(function () { proto.valueOf.call(that); }) : _cof(that) != NUMBER)
	        ? _inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
	  };
	  for (var keys = _descriptors ? gOPN$2(Base) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES6 (in case, if modules with ES6 Number statics required before):
	    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
	  ).split(','), j$1 = 0, key; keys.length > j$1; j$1++) {
	    if (_has(Base, key = keys[j$1]) && !_has($Number, key)) {
	      dP$3($Number, key, gOPD$2(Base, key));
	    }
	  }
	  $Number.prototype = proto;
	  proto.constructor = $Number;
	  _redefine(_global, NUMBER, $Number);
	}

	var _aNumberValue = function (it, msg) {
	  if (typeof it != 'number' && _cof(it) != 'Number') throw TypeError(msg);
	  return +it;
	};

	var _stringRepeat = function repeat(count) {
	  var str = String(_defined(this));
	  var res = '';
	  var n = _toInteger(count);
	  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
	  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
	  return res;
	};

	var $toFixed = 1.0.toFixed;
	var floor$1 = Math.floor;
	var data = [0, 0, 0, 0, 0, 0];
	var ERROR = 'Number.toFixed: incorrect invocation!';
	var ZERO = '0';

	var multiply = function (n, c) {
	  var i = -1;
	  var c2 = c;
	  while (++i < 6) {
	    c2 += n * data[i];
	    data[i] = c2 % 1e7;
	    c2 = floor$1(c2 / 1e7);
	  }
	};
	var divide = function (n) {
	  var i = 6;
	  var c = 0;
	  while (--i >= 0) {
	    c += data[i];
	    data[i] = floor$1(c / n);
	    c = (c % n) * 1e7;
	  }
	};
	var numToString = function () {
	  var i = 6;
	  var s = '';
	  while (--i >= 0) {
	    if (s !== '' || i === 0 || data[i] !== 0) {
	      var t = String(data[i]);
	      s = s === '' ? t : s + _stringRepeat.call(ZERO, 7 - t.length) + t;
	    }
	  } return s;
	};
	var pow = function (x, n, acc) {
	  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
	};
	var log = function (x) {
	  var n = 0;
	  var x2 = x;
	  while (x2 >= 4096) {
	    n += 12;
	    x2 /= 4096;
	  }
	  while (x2 >= 2) {
	    n += 1;
	    x2 /= 2;
	  } return n;
	};

	_export(_export.P + _export.F * (!!$toFixed && (
	  0.00008.toFixed(3) !== '0.000' ||
	  0.9.toFixed(0) !== '1' ||
	  1.255.toFixed(2) !== '1.25' ||
	  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
	) || !_fails(function () {
	  // V8 ~ Android 4.3-
	  $toFixed.call({});
	})), 'Number', {
	  toFixed: function toFixed(fractionDigits) {
	    var x = _aNumberValue(this, ERROR);
	    var f = _toInteger(fractionDigits);
	    var s = '';
	    var m = ZERO;
	    var e, z, j, k;
	    if (f < 0 || f > 20) throw RangeError(ERROR);
	    // eslint-disable-next-line no-self-compare
	    if (x != x) return 'NaN';
	    if (x <= -1e21 || x >= 1e21) return String(x);
	    if (x < 0) {
	      s = '-';
	      x = -x;
	    }
	    if (x > 1e-21) {
	      e = log(x * pow(2, 69, 1)) - 69;
	      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
	      z *= 0x10000000000000;
	      e = 52 - e;
	      if (e > 0) {
	        multiply(0, z);
	        j = f;
	        while (j >= 7) {
	          multiply(1e7, 0);
	          j -= 7;
	        }
	        multiply(pow(10, j, 1), 0);
	        j = e - 1;
	        while (j >= 23) {
	          divide(1 << 23);
	          j -= 23;
	        }
	        divide(1 << j);
	        multiply(1, 1);
	        divide(2);
	        m = numToString();
	      } else {
	        multiply(0, z);
	        multiply(1 << -e, 0);
	        m = numToString() + _stringRepeat.call(ZERO, f);
	      }
	    }
	    if (f > 0) {
	      k = m.length;
	      m = s + (k <= f ? '0.' + _stringRepeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
	    } else {
	      m = s + m;
	    } return m;
	  }
	});

	var $toPrecision = 1.0.toPrecision;

	_export(_export.P + _export.F * (_fails(function () {
	  // IE7-
	  return $toPrecision.call(1, undefined) !== '1';
	}) || !_fails(function () {
	  // V8 ~ Android 4.3-
	  $toPrecision.call({});
	})), 'Number', {
	  toPrecision: function toPrecision(precision) {
	    var that = _aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
	    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
	  }
	});

	// 20.1.2.1 Number.EPSILON


	_export(_export.S, 'Number', { EPSILON: Math.pow(2, -52) });

	// 20.1.2.2 Number.isFinite(number)

	var _isFinite = _global.isFinite;

	_export(_export.S, 'Number', {
	  isFinite: function isFinite(it) {
	    return typeof it == 'number' && _isFinite(it);
	  }
	});

	// 20.1.2.3 Number.isInteger(number)

	var floor$2 = Math.floor;
	var _isInteger = function isInteger(it) {
	  return !_isObject(it) && isFinite(it) && floor$2(it) === it;
	};

	// 20.1.2.3 Number.isInteger(number)


	_export(_export.S, 'Number', { isInteger: _isInteger });

	// 20.1.2.4 Number.isNaN(number)


	_export(_export.S, 'Number', {
	  isNaN: function isNaN(number) {
	    // eslint-disable-next-line no-self-compare
	    return number != number;
	  }
	});

	// 20.1.2.5 Number.isSafeInteger(number)


	var abs = Math.abs;

	_export(_export.S, 'Number', {
	  isSafeInteger: function isSafeInteger(number) {
	    return _isInteger(number) && abs(number) <= 0x1fffffffffffff;
	  }
	});

	// 20.1.2.6 Number.MAX_SAFE_INTEGER


	_export(_export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });

	// 20.1.2.10 Number.MIN_SAFE_INTEGER


	_export(_export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });

	// 20.1.2.12 Number.parseFloat(string)
	_export(_export.S + _export.F * (Number.parseFloat != _parseFloat), 'Number', { parseFloat: _parseFloat });

	// 20.1.2.13 Number.parseInt(string, radix)
	_export(_export.S + _export.F * (Number.parseInt != _parseInt), 'Number', { parseInt: _parseInt });

	// 20.2.2.20 Math.log1p(x)
	var _mathLog1p = Math.log1p || function log1p(x) {
	  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
	};

	// 20.2.2.3 Math.acosh(x)


	var sqrt = Math.sqrt;
	var $acosh = Math.acosh;

	_export(_export.S + _export.F * !($acosh
	  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
	  && Math.floor($acosh(Number.MAX_VALUE)) == 710
	  // Tor Browser bug: Math.acosh(Infinity) -> NaN
	  && $acosh(Infinity) == Infinity
	), 'Math', {
	  acosh: function acosh(x) {
	    return (x = +x) < 1 ? NaN : x > 94906265.62425156
	      ? Math.log(x) + Math.LN2
	      : _mathLog1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
	  }
	});

	// 20.2.2.5 Math.asinh(x)

	var $asinh = Math.asinh;

	function asinh(x) {
	  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
	}

	// Tor Browser bug: Math.asinh(0) -> -0
	_export(_export.S + _export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', { asinh: asinh });

	// 20.2.2.7 Math.atanh(x)

	var $atanh = Math.atanh;

	// Tor Browser bug: Math.atanh(-0) -> 0
	_export(_export.S + _export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
	  atanh: function atanh(x) {
	    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
	  }
	});

	// 20.2.2.28 Math.sign(x)
	var _mathSign = Math.sign || function sign(x) {
	  // eslint-disable-next-line no-self-compare
	  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
	};

	// 20.2.2.9 Math.cbrt(x)



	_export(_export.S, 'Math', {
	  cbrt: function cbrt(x) {
	    return _mathSign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
	  }
	});

	// 20.2.2.11 Math.clz32(x)


	_export(_export.S, 'Math', {
	  clz32: function clz32(x) {
	    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
	  }
	});

	// 20.2.2.12 Math.cosh(x)

	var exp = Math.exp;

	_export(_export.S, 'Math', {
	  cosh: function cosh(x) {
	    return (exp(x = +x) + exp(-x)) / 2;
	  }
	});

	// 20.2.2.14 Math.expm1(x)
	var $expm1 = Math.expm1;
	var _mathExpm1 = (!$expm1
	  // Old FF bug
	  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
	  // Tor Browser bug
	  || $expm1(-2e-17) != -2e-17
	) ? function expm1(x) {
	  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
	} : $expm1;

	// 20.2.2.14 Math.expm1(x)



	_export(_export.S + _export.F * (_mathExpm1 != Math.expm1), 'Math', { expm1: _mathExpm1 });

	// 20.2.2.16 Math.fround(x)

	var pow$1 = Math.pow;
	var EPSILON = pow$1(2, -52);
	var EPSILON32 = pow$1(2, -23);
	var MAX32 = pow$1(2, 127) * (2 - EPSILON32);
	var MIN32 = pow$1(2, -126);

	var roundTiesToEven = function (n) {
	  return n + 1 / EPSILON - 1 / EPSILON;
	};

	var _mathFround = Math.fround || function fround(x) {
	  var $abs = Math.abs(x);
	  var $sign = _mathSign(x);
	  var a, result;
	  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
	  a = (1 + EPSILON32 / EPSILON) * $abs;
	  result = a - (a - $abs);
	  // eslint-disable-next-line no-self-compare
	  if (result > MAX32 || result != result) return $sign * Infinity;
	  return $sign * result;
	};

	// 20.2.2.16 Math.fround(x)


	_export(_export.S, 'Math', { fround: _mathFround });

	// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])

	var abs$1 = Math.abs;

	_export(_export.S, 'Math', {
	  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
	    var sum = 0;
	    var i = 0;
	    var aLen = arguments.length;
	    var larg = 0;
	    var arg, div;
	    while (i < aLen) {
	      arg = abs$1(arguments[i++]);
	      if (larg < arg) {
	        div = larg / arg;
	        sum = sum * div * div + 1;
	        larg = arg;
	      } else if (arg > 0) {
	        div = arg / larg;
	        sum += div * div;
	      } else sum += arg;
	    }
	    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
	  }
	});

	// 20.2.2.18 Math.imul(x, y)

	var $imul = Math.imul;

	// some WebKit versions fails with big numbers, some has wrong arity
	_export(_export.S + _export.F * _fails(function () {
	  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
	}), 'Math', {
	  imul: function imul(x, y) {
	    var UINT16 = 0xffff;
	    var xn = +x;
	    var yn = +y;
	    var xl = UINT16 & xn;
	    var yl = UINT16 & yn;
	    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
	  }
	});

	// 20.2.2.21 Math.log10(x)


	_export(_export.S, 'Math', {
	  log10: function log10(x) {
	    return Math.log(x) * Math.LOG10E;
	  }
	});

	// 20.2.2.20 Math.log1p(x)


	_export(_export.S, 'Math', { log1p: _mathLog1p });

	// 20.2.2.22 Math.log2(x)


	_export(_export.S, 'Math', {
	  log2: function log2(x) {
	    return Math.log(x) / Math.LN2;
	  }
	});

	// 20.2.2.28 Math.sign(x)


	_export(_export.S, 'Math', { sign: _mathSign });

	// 20.2.2.30 Math.sinh(x)


	var exp$1 = Math.exp;

	// V8 near Chromium 38 has a problem with very small numbers
	_export(_export.S + _export.F * _fails(function () {
	  return !Math.sinh(-2e-17) != -2e-17;
	}), 'Math', {
	  sinh: function sinh(x) {
	    return Math.abs(x = +x) < 1
	      ? (_mathExpm1(x) - _mathExpm1(-x)) / 2
	      : (exp$1(x - 1) - exp$1(-x - 1)) * (Math.E / 2);
	  }
	});

	// 20.2.2.33 Math.tanh(x)


	var exp$2 = Math.exp;

	_export(_export.S, 'Math', {
	  tanh: function tanh(x) {
	    var a = _mathExpm1(x = +x);
	    var b = _mathExpm1(-x);
	    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp$2(x) + exp$2(-x));
	  }
	});

	// 20.2.2.34 Math.trunc(x)


	_export(_export.S, 'Math', {
	  trunc: function trunc(it) {
	    return (it > 0 ? Math.floor : Math.ceil)(it);
	  }
	});

	var fromCharCode = String.fromCharCode;
	var $fromCodePoint = String.fromCodePoint;

	// length should be 1, old FF problem
	_export(_export.S + _export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
	  // 21.1.2.2 String.fromCodePoint(...codePoints)
	  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
	    var res = [];
	    var aLen = arguments.length;
	    var i = 0;
	    var code;
	    while (aLen > i) {
	      code = +arguments[i++];
	      if (_toAbsoluteIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
	      res.push(code < 0x10000
	        ? fromCharCode(code)
	        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
	      );
	    } return res.join('');
	  }
	});

	_export(_export.S, 'String', {
	  // 21.1.2.4 String.raw(callSite, ...substitutions)
	  raw: function raw(callSite) {
	    var tpl = _toIobject(callSite.raw);
	    var len = _toLength(tpl.length);
	    var aLen = arguments.length;
	    var res = [];
	    var i = 0;
	    while (len > i) {
	      res.push(String(tpl[i++]));
	      if (i < aLen) res.push(String(arguments[i]));
	    } return res.join('');
	  }
	});

	// 21.1.3.25 String.prototype.trim()
	_stringTrim('trim', function ($trim) {
	  return function trim() {
	    return $trim(this, 3);
	  };
	});

	// true  -> String#at
	// false -> String#codePointAt
	var _stringAt = function (TO_STRING) {
	  return function (that, pos) {
	    var s = String(_defined(that));
	    var i = _toInteger(pos);
	    var l = s.length;
	    var a, b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

	var _iterators = {};

	var IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	_hide(IteratorPrototype, _wks('iterator'), function () { return this; });

	var _iterCreate = function (Constructor, NAME, next) {
	  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
	  _setToStringTag(Constructor, NAME + ' Iterator');
	};

	var ITERATOR = _wks('iterator');
	var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
	var FF_ITERATOR = '@@iterator';
	var KEYS = 'keys';
	var VALUES = 'values';

	var returnThis = function () { return this; };

	var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  _iterCreate(Constructor, NAME, next);
	  var getMethod = function (kind) {
	    if (!BUGGY && kind in proto) return proto[kind];
	    switch (kind) {
	      case KEYS: return function keys() { return new Constructor(this, kind); };
	      case VALUES: return function values() { return new Constructor(this, kind); };
	    } return function entries() { return new Constructor(this, kind); };
	  };
	  var TAG = NAME + ' Iterator';
	  var DEF_VALUES = DEFAULT == VALUES;
	  var VALUES_BUG = false;
	  var proto = Base.prototype;
	  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
	  var $default = $native || getMethod(DEFAULT);
	  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
	  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
	  var methods, key, IteratorPrototype;
	  // Fix native
	  if ($anyNative) {
	    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
	    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      _setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if (typeof IteratorPrototype[ITERATOR] != 'function') _hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;
	    $default = function values() { return $native.call(this); };
	  }
	  // Define iterator
	  if (BUGGY || VALUES_BUG || !proto[ITERATOR]) {
	    _hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  _iterators[NAME] = $default;
	  _iterators[TAG] = returnThis;
	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) _redefine(proto, key, methods[key]);
	    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

	var $at = _stringAt(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	_iterDefine(String, 'String', function (iterated) {
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var index = this._i;
	  var point;
	  if (index >= O.length) return { value: undefined, done: true };
	  point = $at(O, index);
	  this._i += point.length;
	  return { value: point, done: false };
	});

	var $at$1 = _stringAt(false);
	_export(_export.P, 'String', {
	  // 21.1.3.3 String.prototype.codePointAt(pos)
	  codePointAt: function codePointAt(pos) {
	    return $at$1(this, pos);
	  }
	});

	// 7.2.8 IsRegExp(argument)


	var MATCH = _wks('match');
	var _isRegexp = function (it) {
	  var isRegExp;
	  return _isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : _cof(it) == 'RegExp');
	};

	// helper for String#{startsWith, endsWith, includes}



	var _stringContext = function (that, searchString, NAME) {
	  if (_isRegexp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
	  return String(_defined(that));
	};

	var MATCH$1 = _wks('match');
	var _failsIsRegexp = function (KEY) {
	  var re = /./;
	  try {
	    '/./'[KEY](re);
	  } catch (e) {
	    try {
	      re[MATCH$1] = false;
	      return !'/./'[KEY](re);
	    } catch (f) { /* empty */ }
	  } return true;
	};

	var ENDS_WITH = 'endsWith';
	var $endsWith = ''[ENDS_WITH];

	_export(_export.P + _export.F * _failsIsRegexp(ENDS_WITH), 'String', {
	  endsWith: function endsWith(searchString /* , endPosition = @length */) {
	    var that = _stringContext(this, searchString, ENDS_WITH);
	    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
	    var len = _toLength(that.length);
	    var end = endPosition === undefined ? len : Math.min(_toLength(endPosition), len);
	    var search = String(searchString);
	    return $endsWith
	      ? $endsWith.call(that, search, end)
	      : that.slice(end - search.length, end) === search;
	  }
	});

	var INCLUDES = 'includes';

	_export(_export.P + _export.F * _failsIsRegexp(INCLUDES), 'String', {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~_stringContext(this, searchString, INCLUDES)
	      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	_export(_export.P, 'String', {
	  // 21.1.3.13 String.prototype.repeat(count)
	  repeat: _stringRepeat
	});

	var STARTS_WITH = 'startsWith';
	var $startsWith = ''[STARTS_WITH];

	_export(_export.P + _export.F * _failsIsRegexp(STARTS_WITH), 'String', {
	  startsWith: function startsWith(searchString /* , position = 0 */) {
	    var that = _stringContext(this, searchString, STARTS_WITH);
	    var index = _toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
	    var search = String(searchString);
	    return $startsWith
	      ? $startsWith.call(that, search, index)
	      : that.slice(index, index + search.length) === search;
	  }
	});

	var quot = /"/g;
	// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
	var createHTML = function (string, tag, attribute, value) {
	  var S = String(_defined(string));
	  var p1 = '<' + tag;
	  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
	  return p1 + '>' + S + '</' + tag + '>';
	};
	var _stringHtml = function (NAME, exec) {
	  var O = {};
	  O[NAME] = exec(createHTML);
	  _export(_export.P + _export.F * _fails(function () {
	    var test = ''[NAME]('"');
	    return test !== test.toLowerCase() || test.split('"').length > 3;
	  }), 'String', O);
	};

	// B.2.3.2 String.prototype.anchor(name)
	_stringHtml('anchor', function (createHTML) {
	  return function anchor(name) {
	    return createHTML(this, 'a', 'name', name);
	  };
	});

	// B.2.3.3 String.prototype.big()
	_stringHtml('big', function (createHTML) {
	  return function big() {
	    return createHTML(this, 'big', '', '');
	  };
	});

	// B.2.3.4 String.prototype.blink()
	_stringHtml('blink', function (createHTML) {
	  return function blink() {
	    return createHTML(this, 'blink', '', '');
	  };
	});

	// B.2.3.5 String.prototype.bold()
	_stringHtml('bold', function (createHTML) {
	  return function bold() {
	    return createHTML(this, 'b', '', '');
	  };
	});

	// B.2.3.6 String.prototype.fixed()
	_stringHtml('fixed', function (createHTML) {
	  return function fixed() {
	    return createHTML(this, 'tt', '', '');
	  };
	});

	// B.2.3.7 String.prototype.fontcolor(color)
	_stringHtml('fontcolor', function (createHTML) {
	  return function fontcolor(color) {
	    return createHTML(this, 'font', 'color', color);
	  };
	});

	// B.2.3.8 String.prototype.fontsize(size)
	_stringHtml('fontsize', function (createHTML) {
	  return function fontsize(size) {
	    return createHTML(this, 'font', 'size', size);
	  };
	});

	// B.2.3.9 String.prototype.italics()
	_stringHtml('italics', function (createHTML) {
	  return function italics() {
	    return createHTML(this, 'i', '', '');
	  };
	});

	// B.2.3.10 String.prototype.link(url)
	_stringHtml('link', function (createHTML) {
	  return function link(url) {
	    return createHTML(this, 'a', 'href', url);
	  };
	});

	// B.2.3.11 String.prototype.small()
	_stringHtml('small', function (createHTML) {
	  return function small() {
	    return createHTML(this, 'small', '', '');
	  };
	});

	// B.2.3.12 String.prototype.strike()
	_stringHtml('strike', function (createHTML) {
	  return function strike() {
	    return createHTML(this, 'strike', '', '');
	  };
	});

	// B.2.3.13 String.prototype.sub()
	_stringHtml('sub', function (createHTML) {
	  return function sub() {
	    return createHTML(this, 'sub', '', '');
	  };
	});

	// B.2.3.14 String.prototype.sup()
	_stringHtml('sup', function (createHTML) {
	  return function sup() {
	    return createHTML(this, 'sup', '', '');
	  };
	});

	// 20.3.3.1 / 15.9.4.4 Date.now()


	_export(_export.S, 'Date', { now: function () { return new Date().getTime(); } });

	_export(_export.P + _export.F * _fails(function () {
	  return new Date(NaN).toJSON() !== null
	    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
	}), 'Date', {
	  // eslint-disable-next-line no-unused-vars
	  toJSON: function toJSON(key) {
	    var O = _toObject(this);
	    var pv = _toPrimitive(O);
	    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
	  }
	});

	// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()

	var getTime = Date.prototype.getTime;
	var $toISOString = Date.prototype.toISOString;

	var lz = function (num) {
	  return num > 9 ? num : '0' + num;
	};

	// PhantomJS / old WebKit has a broken implementations
	var _dateToIsoString = (_fails(function () {
	  return $toISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
	}) || !_fails(function () {
	  $toISOString.call(new Date(NaN));
	})) ? function toISOString() {
	  if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
	  var d = this;
	  var y = d.getUTCFullYear();
	  var m = d.getUTCMilliseconds();
	  var s = y < 0 ? '-' : y > 9999 ? '+' : '';
	  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
	    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
	    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
	    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
	} : $toISOString;

	// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()



	// PhantomJS / old WebKit has a broken implementations
	_export(_export.P + _export.F * (Date.prototype.toISOString !== _dateToIsoString), 'Date', {
	  toISOString: _dateToIsoString
	});

	var DateProto = Date.prototype;
	var INVALID_DATE = 'Invalid Date';
	var TO_STRING = 'toString';
	var $toString = DateProto[TO_STRING];
	var getTime$1 = DateProto.getTime;
	if (new Date(NaN) + '' != INVALID_DATE) {
	  _redefine(DateProto, TO_STRING, function toString() {
	    var value = getTime$1.call(this);
	    // eslint-disable-next-line no-self-compare
	    return value === value ? $toString.call(this) : INVALID_DATE;
	  });
	}

	var NUMBER$1 = 'number';

	var _dateToPrimitive = function (hint) {
	  if (hint !== 'string' && hint !== NUMBER$1 && hint !== 'default') throw TypeError('Incorrect hint');
	  return _toPrimitive(_anObject(this), hint != NUMBER$1);
	};

	var TO_PRIMITIVE$1 = _wks('toPrimitive');
	var proto$1 = Date.prototype;

	if (!(TO_PRIMITIVE$1 in proto$1)) _hide(proto$1, TO_PRIMITIVE$1, _dateToPrimitive);

	// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)


	_export(_export.S, 'Array', { isArray: _isArray });

	// call something on iterator step with safe closing on error

	var _iterCall = function (iterator, fn, value, entries) {
	  try {
	    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (e) {
	    var ret = iterator['return'];
	    if (ret !== undefined) _anObject(ret.call(iterator));
	    throw e;
	  }
	};

	// check on default Array iterator

	var ITERATOR$1 = _wks('iterator');
	var ArrayProto = Array.prototype;

	var _isArrayIter = function (it) {
	  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR$1] === it);
	};

	var _createProperty = function (object, index, value) {
	  if (index in object) _objectDp.f(object, index, _propertyDesc(0, value));
	  else object[index] = value;
	};

	var ITERATOR$2 = _wks('iterator');

	var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$2]
	    || it['@@iterator']
	    || _iterators[_classof(it)];
	};

	var ITERATOR$3 = _wks('iterator');
	var SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR$3]();
	  riter['return'] = function () { SAFE_CLOSING = true; };
	} catch (e) { /* empty */ }

	var _iterDetect = function (exec, skipClosing) {
	  if (!skipClosing && !SAFE_CLOSING) return false;
	  var safe = false;
	  try {
	    var arr = [7];
	    var iter = arr[ITERATOR$3]();
	    iter.next = function () { return { done: safe = true }; };
	    arr[ITERATOR$3] = function () { return iter; };
	    exec(arr);
	  } catch (e) { /* empty */ }
	  return safe;
	};

	_export(_export.S + _export.F * !_iterDetect(function (iter) { }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	    var O = _toObject(arrayLike);
	    var C = typeof this == 'function' ? this : Array;
	    var aLen = arguments.length;
	    var mapfn = aLen > 1 ? arguments[1] : undefined;
	    var mapping = mapfn !== undefined;
	    var index = 0;
	    var iterFn = core_getIteratorMethod(O);
	    var length, result, step, iterator;
	    if (mapping) mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if (iterFn != undefined && !(C == Array && _isArrayIter(iterFn))) {
	      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
	        _createProperty(result, index, mapping ? _iterCall(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = _toLength(O.length);
	      for (result = new C(length); length > index; index++) {
	        _createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});

	// WebKit Array.of isn't generic
	_export(_export.S + _export.F * _fails(function () {
	  function F() { /* empty */ }
	  return !(Array.of.call(F) instanceof F);
	}), 'Array', {
	  // 22.1.2.3 Array.of( ...items)
	  of: function of(/* ...args */) {
	    var index = 0;
	    var aLen = arguments.length;
	    var result = new (typeof this == 'function' ? this : Array)(aLen);
	    while (aLen > index) _createProperty(result, index, arguments[index++]);
	    result.length = aLen;
	    return result;
	  }
	});

	var _strictMethod = function (method, arg) {
	  return !!method && _fails(function () {
	    // eslint-disable-next-line no-useless-call
	    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
	  });
	};

	// 22.1.3.13 Array.prototype.join(separator)


	var arrayJoin = [].join;

	// fallback for not array-like strings
	_export(_export.P + _export.F * (_iobject != Object || !_strictMethod(arrayJoin)), 'Array', {
	  join: function join(separator) {
	    return arrayJoin.call(_toIobject(this), separator === undefined ? ',' : separator);
	  }
	});

	var arraySlice$1 = [].slice;

	// fallback for not array-like ES3 strings and DOM objects
	_export(_export.P + _export.F * _fails(function () {
	  if (_html) arraySlice$1.call(_html);
	}), 'Array', {
	  slice: function slice(begin, end) {
	    var len = _toLength(this.length);
	    var klass = _cof(this);
	    end = end === undefined ? len : end;
	    if (klass == 'Array') return arraySlice$1.call(this, begin, end);
	    var start = _toAbsoluteIndex(begin, len);
	    var upTo = _toAbsoluteIndex(end, len);
	    var size = _toLength(upTo - start);
	    var cloned = new Array(size);
	    var i = 0;
	    for (; i < size; i++) cloned[i] = klass == 'String'
	      ? this.charAt(start + i)
	      : this[start + i];
	    return cloned;
	  }
	});

	var $sort = [].sort;
	var test$1 = [1, 2, 3];

	_export(_export.P + _export.F * (_fails(function () {
	  // IE8-
	  test$1.sort(undefined);
	}) || !_fails(function () {
	  // V8 bug
	  test$1.sort(null);
	  // Old WebKit
	}) || !_strictMethod($sort)), 'Array', {
	  // 22.1.3.25 Array.prototype.sort(comparefn)
	  sort: function sort(comparefn) {
	    return comparefn === undefined
	      ? $sort.call(_toObject(this))
	      : $sort.call(_toObject(this), _aFunction(comparefn));
	  }
	});

	var SPECIES = _wks('species');

	var _arraySpeciesConstructor = function (original) {
	  var C;
	  if (_isArray(original)) {
	    C = original.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || _isArray(C.prototype))) C = undefined;
	    if (_isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return C === undefined ? Array : C;
	};

	// 9.4.2.3 ArraySpeciesCreate(originalArray, length)


	var _arraySpeciesCreate = function (original, length) {
	  return new (_arraySpeciesConstructor(original))(length);
	};

	// 0 -> Array#forEach
	// 1 -> Array#map
	// 2 -> Array#filter
	// 3 -> Array#some
	// 4 -> Array#every
	// 5 -> Array#find
	// 6 -> Array#findIndex





	var _arrayMethods = function (TYPE, $create) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  var create = $create || _arraySpeciesCreate;
	  return function ($this, callbackfn, that) {
	    var O = _toObject($this);
	    var self = _iobject(O);
	    var f = _ctx(callbackfn, that, 3);
	    var length = _toLength(self.length);
	    var index = 0;
	    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var val, res;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      val = self[index];
	      res = f(val, index, O);
	      if (TYPE) {
	        if (IS_MAP) result[index] = res;   // map
	        else if (res) switch (TYPE) {
	          case 3: return true;             // some
	          case 5: return val;              // find
	          case 6: return index;            // findIndex
	          case 2: result.push(val);        // filter
	        } else if (IS_EVERY) return false; // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
	  };
	};

	var $forEach = _arrayMethods(0);
	var STRICT = _strictMethod([].forEach, true);

	_export(_export.P + _export.F * !STRICT, 'Array', {
	  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
	  forEach: function forEach(callbackfn /* , thisArg */) {
	    return $forEach(this, callbackfn, arguments[1]);
	  }
	});

	var $map = _arrayMethods(1);

	_export(_export.P + _export.F * !_strictMethod([].map, true), 'Array', {
	  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments[1]);
	  }
	});

	var $filter = _arrayMethods(2);

	_export(_export.P + _export.F * !_strictMethod([].filter, true), 'Array', {
	  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments[1]);
	  }
	});

	var $some = _arrayMethods(3);

	_export(_export.P + _export.F * !_strictMethod([].some, true), 'Array', {
	  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
	  some: function some(callbackfn /* , thisArg */) {
	    return $some(this, callbackfn, arguments[1]);
	  }
	});

	var $every = _arrayMethods(4);

	_export(_export.P + _export.F * !_strictMethod([].every, true), 'Array', {
	  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
	  every: function every(callbackfn /* , thisArg */) {
	    return $every(this, callbackfn, arguments[1]);
	  }
	});

	var _arrayReduce = function (that, callbackfn, aLen, memo, isRight) {
	  _aFunction(callbackfn);
	  var O = _toObject(that);
	  var self = _iobject(O);
	  var length = _toLength(O.length);
	  var index = isRight ? length - 1 : 0;
	  var i = isRight ? -1 : 1;
	  if (aLen < 2) for (;;) {
	    if (index in self) {
	      memo = self[index];
	      index += i;
	      break;
	    }
	    index += i;
	    if (isRight ? index < 0 : length <= index) {
	      throw TypeError('Reduce of empty array with no initial value');
	    }
	  }
	  for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
	    memo = callbackfn(memo, self[index], index, O);
	  }
	  return memo;
	};

	_export(_export.P + _export.F * !_strictMethod([].reduce, true), 'Array', {
	  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
	  reduce: function reduce(callbackfn /* , initialValue */) {
	    return _arrayReduce(this, callbackfn, arguments.length, arguments[1], false);
	  }
	});

	_export(_export.P + _export.F * !_strictMethod([].reduceRight, true), 'Array', {
	  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
	  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
	    return _arrayReduce(this, callbackfn, arguments.length, arguments[1], true);
	  }
	});

	var $indexOf = _arrayIncludes(false);
	var $native = [].indexOf;
	var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

	_export(_export.P + _export.F * (NEGATIVE_ZERO || !_strictMethod($native)), 'Array', {
	  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
	  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
	    return NEGATIVE_ZERO
	      // convert -0 to +0
	      ? $native.apply(this, arguments) || 0
	      : $indexOf(this, searchElement, arguments[1]);
	  }
	});

	var $native$1 = [].lastIndexOf;
	var NEGATIVE_ZERO$1 = !!$native$1 && 1 / [1].lastIndexOf(1, -0) < 0;

	_export(_export.P + _export.F * (NEGATIVE_ZERO$1 || !_strictMethod($native$1)), 'Array', {
	  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
	  lastIndexOf: function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
	    // convert -0 to +0
	    if (NEGATIVE_ZERO$1) return $native$1.apply(this, arguments) || 0;
	    var O = _toIobject(this);
	    var length = _toLength(O.length);
	    var index = length - 1;
	    if (arguments.length > 1) index = Math.min(index, _toInteger(arguments[1]));
	    if (index < 0) index = length + index;
	    for (;index >= 0; index--) if (index in O) if (O[index] === searchElement) return index || 0;
	    return -1;
	  }
	});

	var _arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
	  var O = _toObject(this);
	  var len = _toLength(O.length);
	  var to = _toAbsoluteIndex(target, len);
	  var from = _toAbsoluteIndex(start, len);
	  var end = arguments.length > 2 ? arguments[2] : undefined;
	  var count = Math.min((end === undefined ? len : _toAbsoluteIndex(end, len)) - from, len - to);
	  var inc = 1;
	  if (from < to && to < from + count) {
	    inc = -1;
	    from += count - 1;
	    to += count - 1;
	  }
	  while (count-- > 0) {
	    if (from in O) O[to] = O[from];
	    else delete O[to];
	    to += inc;
	    from += inc;
	  } return O;
	};

	// 22.1.3.31 Array.prototype[@@unscopables]
	var UNSCOPABLES = _wks('unscopables');
	var ArrayProto$1 = Array.prototype;
	if (ArrayProto$1[UNSCOPABLES] == undefined) _hide(ArrayProto$1, UNSCOPABLES, {});
	var _addToUnscopables = function (key) {
	  ArrayProto$1[UNSCOPABLES][key] = true;
	};

	// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)


	_export(_export.P, 'Array', { copyWithin: _arrayCopyWithin });

	_addToUnscopables('copyWithin');

	var _arrayFill = function fill(value /* , start = 0, end = @length */) {
	  var O = _toObject(this);
	  var length = _toLength(O.length);
	  var aLen = arguments.length;
	  var index = _toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
	  var end = aLen > 2 ? arguments[2] : undefined;
	  var endPos = end === undefined ? length : _toAbsoluteIndex(end, length);
	  while (endPos > index) O[index++] = value;
	  return O;
	};

	// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)


	_export(_export.P, 'Array', { fill: _arrayFill });

	_addToUnscopables('fill');

	// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)

	var $find = _arrayMethods(5);
	var KEY = 'find';
	var forced = true;
	// Shouldn't skip holes
	if (KEY in []) Array(1)[KEY](function () { forced = false; });
	_export(_export.P + _export.F * forced, 'Array', {
	  find: function find(callbackfn /* , that = undefined */) {
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});
	_addToUnscopables(KEY);

	// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)

	var $find$1 = _arrayMethods(6);
	var KEY$1 = 'findIndex';
	var forced$1 = true;
	// Shouldn't skip holes
	if (KEY$1 in []) Array(1)[KEY$1](function () { forced$1 = false; });
	_export(_export.P + _export.F * forced$1, 'Array', {
	  findIndex: function findIndex(callbackfn /* , that = undefined */) {
	    return $find$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});
	_addToUnscopables(KEY$1);

	var SPECIES$1 = _wks('species');

	var _setSpecies = function (KEY) {
	  var C = _global[KEY];
	  if (_descriptors && C && !C[SPECIES$1]) _objectDp.f(C, SPECIES$1, {
	    configurable: true,
	    get: function () { return this; }
	  });
	};

	_setSpecies('Array');

	var _iterStep = function (done, value) {
	  return { value: value, done: !!done };
	};

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
	  this._t = _toIobject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var kind = this._k;
	  var index = this._i++;
	  if (!O || index >= O.length) {
	    this._t = undefined;
	    return _iterStep(1);
	  }
	  if (kind == 'keys') return _iterStep(0, index);
	  if (kind == 'values') return _iterStep(0, O[index]);
	  return _iterStep(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	_iterators.Arguments = _iterators.Array;

	_addToUnscopables('keys');
	_addToUnscopables('values');
	_addToUnscopables('entries');

	// 21.2.5.3 get RegExp.prototype.flags

	var _flags = function () {
	  var that = _anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var dP$4 = _objectDp.f;
	var gOPN$3 = _objectGopn.f;


	var $RegExp = _global.RegExp;
	var Base$1 = $RegExp;
	var proto$2 = $RegExp.prototype;
	var re1 = /a/g;
	var re2 = /a/g;
	// "new" creates a new object, old webkit buggy here
	var CORRECT_NEW = new $RegExp(re1) !== re1;

	if (_descriptors && (!CORRECT_NEW || _fails(function () {
	  re2[_wks('match')] = false;
	  // RegExp constructor can alter flags and IsRegExp works correct with @@match
	  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
	}))) {
	  $RegExp = function RegExp(p, f) {
	    var tiRE = this instanceof $RegExp;
	    var piRE = _isRegexp(p);
	    var fiU = f === undefined;
	    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
	      : _inheritIfRequired(CORRECT_NEW
	        ? new Base$1(piRE && !fiU ? p.source : p, f)
	        : Base$1((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? _flags.call(p) : f)
	      , tiRE ? this : proto$2, $RegExp);
	  };
	  var proxy = function (key) {
	    key in $RegExp || dP$4($RegExp, key, {
	      configurable: true,
	      get: function () { return Base$1[key]; },
	      set: function (it) { Base$1[key] = it; }
	    });
	  };
	  for (var keys$1 = gOPN$3(Base$1), i = 0; keys$1.length > i;) proxy(keys$1[i++]);
	  proto$2.constructor = $RegExp;
	  $RegExp.prototype = proto$2;
	  _redefine(_global, 'RegExp', $RegExp);
	}

	_setSpecies('RegExp');

	// 21.2.5.3 get RegExp.prototype.flags()
	if (_descriptors && /./g.flags != 'g') _objectDp.f(RegExp.prototype, 'flags', {
	  configurable: true,
	  get: _flags
	});

	var TO_STRING$1 = 'toString';
	var $toString$1 = /./[TO_STRING$1];

	var define = function (fn) {
	  _redefine(RegExp.prototype, TO_STRING$1, fn, true);
	};

	// 21.2.5.14 RegExp.prototype.toString()
	if (_fails(function () { return $toString$1.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
	  define(function toString() {
	    var R = _anObject(this);
	    return '/'.concat(R.source, '/',
	      'flags' in R ? R.flags : !_descriptors && R instanceof RegExp ? _flags.call(R) : undefined);
	  });
	// FF44- RegExp#toString has a wrong name
	} else if ($toString$1.name != TO_STRING$1) {
	  define(function toString() {
	    return $toString$1.call(this);
	  });
	}

	var _fixReWks = function (KEY, length, exec) {
	  var SYMBOL = _wks(KEY);
	  var fns = exec(_defined, SYMBOL, ''[KEY]);
	  var strfn = fns[0];
	  var rxfn = fns[1];
	  if (_fails(function () {
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  })) {
	    _redefine(String.prototype, KEY, strfn);
	    _hide(RegExp.prototype, SYMBOL, length == 2
	      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	      ? function (string, arg) { return rxfn.call(string, this, arg); }
	      // 21.2.5.6 RegExp.prototype[@@match](string)
	      // 21.2.5.9 RegExp.prototype[@@search](string)
	      : function (string) { return rxfn.call(string, this); }
	    );
	  }
	};

	// @@match logic
	_fixReWks('match', 1, function (defined, MATCH, $match) {
	  // 21.1.3.11 String.prototype.match(regexp)
	  return [function match(regexp) {
	    var O = defined(this);
	    var fn = regexp == undefined ? undefined : regexp[MATCH];
	    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
	  }, $match];
	});

	// @@replace logic
	_fixReWks('replace', 2, function (defined, REPLACE, $replace) {
	  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
	  return [function replace(searchValue, replaceValue) {
	    var O = defined(this);
	    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
	    return fn !== undefined
	      ? fn.call(searchValue, O, replaceValue)
	      : $replace.call(String(O), searchValue, replaceValue);
	  }, $replace];
	});

	// @@search logic
	_fixReWks('search', 1, function (defined, SEARCH, $search) {
	  // 21.1.3.15 String.prototype.search(regexp)
	  return [function search(regexp) {
	    var O = defined(this);
	    var fn = regexp == undefined ? undefined : regexp[SEARCH];
	    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
	  }, $search];
	});

	// @@split logic
	_fixReWks('split', 2, function (defined, SPLIT, $split) {
	  var isRegExp = _isRegexp;
	  var _split = $split;
	  var $push = [].push;
	  var $SPLIT = 'split';
	  var LENGTH = 'length';
	  var LAST_INDEX = 'lastIndex';
	  if (
	    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
	    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
	    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
	    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
	    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
	    ''[$SPLIT](/.?/)[LENGTH]
	  ) {
	    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
	    // based on es5-shim implementation, need to rework it
	    $split = function (separator, limit) {
	      var string = String(this);
	      if (separator === undefined && limit === 0) return [];
	      // If `separator` is not a regex, use native split
	      if (!isRegExp(separator)) return _split.call(string, separator, limit);
	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') +
	                  (separator.multiline ? 'm' : '') +
	                  (separator.unicode ? 'u' : '') +
	                  (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0;
	      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var separator2, match, lastIndex, lastLength, i;
	      // Doesn't need flags gy, but they don't hurt
	      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
	      while (match = separatorCopy.exec(string)) {
	        // `separatorCopy.lastIndex` is not reliable cross-browser
	        lastIndex = match.index + match[0][LENGTH];
	        if (lastIndex > lastLastIndex) {
	          output.push(string.slice(lastLastIndex, match.index));
	          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
	          // eslint-disable-next-line no-loop-func
	          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
	            for (i = 1; i < arguments[LENGTH] - 2; i++) if (arguments[i] === undefined) match[i] = undefined;
	          });
	          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
	          lastLength = match[0][LENGTH];
	          lastLastIndex = lastIndex;
	          if (output[LENGTH] >= splitLimit) break;
	        }
	        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
	      }
	      if (lastLastIndex === string[LENGTH]) {
	        if (lastLength || !separatorCopy.test('')) output.push('');
	      } else output.push(string.slice(lastLastIndex));
	      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
	    };
	  // Chakra, V8
	  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
	    $split = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
	    };
	  }
	  // 21.1.3.17 String.prototype.split(separator, limit)
	  return [function split(separator, limit) {
	    var O = defined(this);
	    var fn = separator == undefined ? undefined : separator[SPLIT];
	    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
	  }, $split];
	});

	var _anInstance = function (it, Constructor, name, forbiddenField) {
	  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};

	var _forOf = createCommonjsModule(function (module) {
	var BREAK = {};
	var RETURN = {};
	var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
	  var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);
	  var f = _ctx(fn, that, entries ? 2 : 1);
	  var index = 0;
	  var length, step, iterator, result;
	  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
	    result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if (result === BREAK || result === RETURN) return result;
	  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
	    result = _iterCall(iterator, f, step.value, entries);
	    if (result === BREAK || result === RETURN) return result;
	  }
	};
	exports.BREAK = BREAK;
	exports.RETURN = RETURN;
	});

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)


	var SPECIES$2 = _wks('species');
	var _speciesConstructor = function (O, D) {
	  var C = _anObject(O).constructor;
	  var S;
	  return C === undefined || (S = _anObject(C)[SPECIES$2]) == undefined ? D : _aFunction(S);
	};

	var process = _global.process;
	var setTask = _global.setImmediate;
	var clearTask = _global.clearImmediate;
	var MessageChannel = _global.MessageChannel;
	var Dispatch = _global.Dispatch;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var defer, channel, port;
	var run = function () {
	  var id = +this;
	  // eslint-disable-next-line no-prototype-builtins
	  if (queue.hasOwnProperty(id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listener = function (event) {
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!setTask || !clearTask) {
	  setTask = function setImmediate(fn) {
	    var args = [];
	    var i = 1;
	    while (arguments.length > i) args.push(arguments[i++]);
	    queue[++counter] = function () {
	      // eslint-disable-next-line no-new-func
	      _invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (_cof(process) == 'process') {
	    defer = function (id) {
	      process.nextTick(_ctx(run, id, 1));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(_ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if (MessageChannel) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = _ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {
	    defer = function (id) {
	      _global.postMessage(id + '', '*');
	    };
	    _global.addEventListener('message', listener, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE in _domCreate('script')) {
	    defer = function (id) {
	      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {
	        _html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(_ctx(run, id, 1), 0);
	    };
	  }
	}
	var _task = {
	  set: setTask,
	  clear: clearTask
	};

	var macrotask = _task.set;
	var Observer = _global.MutationObserver || _global.WebKitMutationObserver;
	var process$1 = _global.process;
	var Promise$1 = _global.Promise;
	var isNode = _cof(process$1) == 'process';

	var _microtask = function () {
	  var head, last, notify;

	  var flush = function () {
	    var parent, fn;
	    if (isNode && (parent = process$1.domain)) parent.exit();
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (e) {
	        if (head) notify();
	        else last = undefined;
	        throw e;
	      }
	    } last = undefined;
	    if (parent) parent.enter();
	  };

	  // Node.js
	  if (isNode) {
	    notify = function () {
	      process$1.nextTick(flush);
	    };
	  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
	  } else if (Observer && !(_global.navigator && _global.navigator.standalone)) {
	    var toggle = true;
	    var node = document.createTextNode('');
	    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
	    notify = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (Promise$1 && Promise$1.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    var promise = Promise$1.resolve(undefined);
	    notify = function () {
	      promise.then(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function () {
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(_global, flush);
	    };
	  }

	  return function (fn) {
	    var task = { fn: fn, next: undefined };
	    if (last) last.next = task;
	    if (!head) {
	      head = task;
	      notify();
	    } last = task;
	  };
	};

	// 25.4.1.5 NewPromiseCapability(C)


	function PromiseCapability(C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = _aFunction(resolve);
	  this.reject = _aFunction(reject);
	}

	var f$7 = function (C) {
	  return new PromiseCapability(C);
	};

	var _newPromiseCapability = {
		f: f$7
	};

	var _perform = function (exec) {
	  try {
	    return { e: false, v: exec() };
	  } catch (e) {
	    return { e: true, v: e };
	  }
	};

	var navigator$1 = _global.navigator;

	var _userAgent = navigator$1 && navigator$1.userAgent || '';

	var _promiseResolve = function (C, x) {
	  _anObject(C);
	  if (_isObject(x) && x.constructor === C) return x;
	  var promiseCapability = _newPromiseCapability.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var _redefineAll = function (target, src, safe) {
	  for (var key in src) _redefine(target, key, src[key], safe);
	  return target;
	};

	var task = _task.set;
	var microtask = _microtask();




	var PROMISE = 'Promise';
	var TypeError$1 = _global.TypeError;
	var process$2 = _global.process;
	var versions = process$2 && process$2.versions;
	var v8 = versions && versions.v8 || '';
	var $Promise = _global[PROMISE];
	var isNode$1 = _classof(process$2) == 'process';
	var empty = function () { /* empty */ };
	var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
	var newPromiseCapability = newGenericPromiseCapability = _newPromiseCapability.f;

	var USE_NATIVE$1 = !!function () {
	  try {
	    // correct subclassing with @@species support
	    var promise = $Promise.resolve(1);
	    var FakePromise = (promise.constructor = {})[_wks('species')] = function (exec) {
	      exec(empty, empty);
	    };
	    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    return (isNode$1 || typeof PromiseRejectionEvent == 'function')
	      && promise.then(empty) instanceof FakePromise
	      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	      // we can't detect it synchronously, so just check versions
	      && v8.indexOf('6.6') !== 0
	      && _userAgent.indexOf('Chrome/66') === -1;
	  } catch (e) { /* empty */ }
	}();

	// helpers
	var isThenable = function (it) {
	  var then;
	  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var notify = function (promise, isReject) {
	  if (promise._n) return;
	  promise._n = true;
	  var chain = promise._c;
	  microtask(function () {
	    var value = promise._v;
	    var ok = promise._s == 1;
	    var i = 0;
	    var run = function (reaction) {
	      var handler = ok ? reaction.ok : reaction.fail;
	      var resolve = reaction.resolve;
	      var reject = reaction.reject;
	      var domain = reaction.domain;
	      var result, then, exited;
	      try {
	        if (handler) {
	          if (!ok) {
	            if (promise._h == 2) onHandleUnhandled(promise);
	            promise._h = 1;
	          }
	          if (handler === true) result = value;
	          else {
	            if (domain) domain.enter();
	            result = handler(value); // may throw
	            if (domain) {
	              domain.exit();
	              exited = true;
	            }
	          }
	          if (result === reaction.promise) {
	            reject(TypeError$1('Promise-chain cycle'));
	          } else if (then = isThenable(result)) {
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (e) {
	        if (domain && !exited) domain.exit();
	        reject(e);
	      }
	    };
	    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
	    promise._c = [];
	    promise._n = false;
	    if (isReject && !promise._h) onUnhandled(promise);
	  });
	};
	var onUnhandled = function (promise) {
	  task.call(_global, function () {
	    var value = promise._v;
	    var unhandled = isUnhandled(promise);
	    var result, handler, console;
	    if (unhandled) {
	      result = _perform(function () {
	        if (isNode$1) {
	          process$2.emit('unhandledRejection', value, promise);
	        } else if (handler = _global.onunhandledrejection) {
	          handler({ promise: promise, reason: value });
	        } else if ((console = _global.console) && console.error) {
	          console.error('Unhandled promise rejection', value);
	        }
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      promise._h = isNode$1 || isUnhandled(promise) ? 2 : 1;
	    } promise._a = undefined;
	    if (unhandled && result.e) throw result.v;
	  });
	};
	var isUnhandled = function (promise) {
	  return promise._h !== 1 && (promise._a || promise._c).length === 0;
	};
	var onHandleUnhandled = function (promise) {
	  task.call(_global, function () {
	    var handler;
	    if (isNode$1) {
	      process$2.emit('rejectionHandled', promise);
	    } else if (handler = _global.onrejectionhandled) {
	      handler({ promise: promise, reason: promise._v });
	    }
	  });
	};
	var $reject = function (value) {
	  var promise = this;
	  if (promise._d) return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  promise._v = value;
	  promise._s = 2;
	  if (!promise._a) promise._a = promise._c.slice();
	  notify(promise, true);
	};
	var $resolve = function (value) {
	  var promise = this;
	  var then;
	  if (promise._d) return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  try {
	    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
	    if (then = isThenable(value)) {
	      microtask(function () {
	        var wrapper = { _w: promise, _d: false }; // wrap
	        try {
	          then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
	        } catch (e) {
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      promise._v = value;
	      promise._s = 1;
	      notify(promise, false);
	    }
	  } catch (e) {
	    $reject.call({ _w: promise, _d: false }, e); // wrap
	  }
	};

	// constructor polyfill
	if (!USE_NATIVE$1) {
	  // 25.4.3.1 Promise(executor)
	  $Promise = function Promise(executor) {
	    _anInstance(this, $Promise, PROMISE, '_h');
	    _aFunction(executor);
	    Internal.call(this);
	    try {
	      executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
	    } catch (err) {
	      $reject.call(this, err);
	    }
	  };
	  // eslint-disable-next-line no-unused-vars
	  Internal = function Promise(executor) {
	    this._c = [];             // <- awaiting reactions
	    this._a = undefined;      // <- checked in isUnhandled reactions
	    this._s = 0;              // <- state
	    this._d = false;          // <- done
	    this._v = undefined;      // <- value
	    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
	    this._n = false;          // <- notify
	  };
	  Internal.prototype = _redefineAll($Promise.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected) {
	      var reaction = newPromiseCapability(_speciesConstructor(this, $Promise));
	      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      reaction.domain = isNode$1 ? process$2.domain : undefined;
	      this._c.push(reaction);
	      if (this._a) this._a.push(reaction);
	      if (this._s) notify(this, false);
	      return reaction.promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });
	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    this.promise = promise;
	    this.resolve = _ctx($resolve, promise, 1);
	    this.reject = _ctx($reject, promise, 1);
	  };
	  _newPromiseCapability.f = newPromiseCapability = function (C) {
	    return C === $Promise || C === Wrapper
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };
	}

	_export(_export.G + _export.W + _export.F * !USE_NATIVE$1, { Promise: $Promise });
	_setToStringTag($Promise, PROMISE);
	_setSpecies(PROMISE);
	Wrapper = _core[PROMISE];

	// statics
	_export(_export.S + _export.F * !USE_NATIVE$1, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r) {
	    var capability = newPromiseCapability(this);
	    var $$reject = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	_export(_export.S + _export.F * (!USE_NATIVE$1), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x) {
	    return _promiseResolve(this, x);
	  }
	});
	_export(_export.S + _export.F * !(USE_NATIVE$1 && _iterDetect(function (iter) {
	  $Promise.all(iter)['catch'](empty);
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = _perform(function () {
	      var values = [];
	      var index = 0;
	      var remaining = 1;
	      _forOf(iterable, false, function (promise) {
	        var $index = index++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        C.resolve(promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[$index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.e) reject(result.v);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var reject = capability.reject;
	    var result = _perform(function () {
	      _forOf(iterable, false, function (promise) {
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.e) reject(result.v);
	    return capability.promise;
	  }
	});

	var _validateCollection = function (it, TYPE) {
	  if (!_isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
	  return it;
	};

	var dP$5 = _objectDp.f;









	var fastKey = _meta.fastKey;

	var SIZE = _descriptors ? '_s' : 'size';

	var getEntry = function (that, key) {
	  // fast case
	  var index = fastKey(key);
	  var entry;
	  if (index !== 'F') return that._i[index];
	  // frozen object case
	  for (entry = that._f; entry; entry = entry.n) {
	    if (entry.k == key) return entry;
	  }
	};

	var _collectionStrong = {
	  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      _anInstance(that, C, NAME, '_i');
	      that._t = NAME;         // collection type
	      that._i = _objectCreate(null); // index
	      that._f = undefined;    // first entry
	      that._l = undefined;    // last entry
	      that[SIZE] = 0;         // size
	      if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    _redefineAll(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear() {
	        for (var that = _validateCollection(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
	          entry.r = true;
	          if (entry.p) entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }
	        that._f = that._l = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function (key) {
	        var that = _validateCollection(this, NAME);
	        var entry = getEntry(that, key);
	        if (entry) {
	          var next = entry.n;
	          var prev = entry.p;
	          delete that._i[entry.i];
	          entry.r = true;
	          if (prev) prev.n = next;
	          if (next) next.p = prev;
	          if (that._f == entry) that._f = next;
	          if (that._l == entry) that._l = prev;
	          that[SIZE]--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /* , that = undefined */) {
	        _validateCollection(this, NAME);
	        var f = _ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
	        var entry;
	        while (entry = entry ? entry.n : this._f) {
	          f(entry.v, entry.k, this);
	          // revert to the last existing entry
	          while (entry && entry.r) entry = entry.p;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key) {
	        return !!getEntry(_validateCollection(this, NAME), key);
	      }
	    });
	    if (_descriptors) dP$5(C.prototype, 'size', {
	      get: function () {
	        return _validateCollection(this, NAME)[SIZE];
	      }
	    });
	    return C;
	  },
	  def: function (that, key, value) {
	    var entry = getEntry(that, key);
	    var prev, index;
	    // change existing entry
	    if (entry) {
	      entry.v = value;
	    // create new entry
	    } else {
	      that._l = entry = {
	        i: index = fastKey(key, true), // <- index
	        k: key,                        // <- key
	        v: value,                      // <- value
	        p: prev = that._l,             // <- previous entry
	        n: undefined,                  // <- next entry
	        r: false                       // <- removed
	      };
	      if (!that._f) that._f = entry;
	      if (prev) prev.n = entry;
	      that[SIZE]++;
	      // add to index
	      if (index !== 'F') that._i[index] = entry;
	    } return that;
	  },
	  getEntry: getEntry,
	  setStrong: function (C, NAME, IS_MAP) {
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    _iterDefine(C, NAME, function (iterated, kind) {
	      this._t = _validateCollection(iterated, NAME); // target
	      this._k = kind;                     // kind
	      this._l = undefined;                // previous
	    }, function () {
	      var that = this;
	      var kind = that._k;
	      var entry = that._l;
	      // revert to the last existing entry
	      while (entry && entry.r) entry = entry.p;
	      // get next entry
	      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
	        // or finish the iteration
	        that._t = undefined;
	        return _iterStep(1);
	      }
	      // return step by kind
	      if (kind == 'keys') return _iterStep(0, entry.k);
	      if (kind == 'values') return _iterStep(0, entry.v);
	      return _iterStep(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

	    // add [@@species], 23.1.2.2, 23.2.2.2
	    _setSpecies(NAME);
	  }
	};

	var _collection = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
	  var Base = _global[NAME];
	  var C = Base;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var proto = C && C.prototype;
	  var O = {};
	  var fixMethod = function (KEY) {
	    var fn = proto[KEY];
	    _redefine(proto, KEY,
	      KEY == 'delete' ? function (a) {
	        return IS_WEAK && !_isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
	      } : KEY == 'has' ? function has(a) {
	        return IS_WEAK && !_isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
	      } : KEY == 'get' ? function get(a) {
	        return IS_WEAK && !_isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
	      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
	        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
	    );
	  };
	  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !_fails(function () {
	    new C().entries().next();
	  }))) {
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    _redefineAll(C.prototype, methods);
	    _meta.NEED = true;
	  } else {
	    var instance = new C();
	    // early implementations not supports chaining
	    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
	    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
	    var THROWS_ON_PRIMITIVES = _fails(function () { instance.has(1); });
	    // most early implementations doesn't supports iterables, most modern - not close it correctly
	    var ACCEPT_ITERABLES = _iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
	    // for early implementations -0 and +0 not the same
	    var BUGGY_ZERO = !IS_WEAK && _fails(function () {
	      // V8 ~ Chromium 42- fails only with 5+ elements
	      var $instance = new C();
	      var index = 5;
	      while (index--) $instance[ADDER](index, index);
	      return !$instance.has(-0);
	    });
	    if (!ACCEPT_ITERABLES) {
	      C = wrapper(function (target, iterable) {
	        _anInstance(target, C, NAME);
	        var that = _inheritIfRequired(new Base(), target, C);
	        if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
	        return that;
	      });
	      C.prototype = proto;
	      proto.constructor = C;
	    }
	    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }
	    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
	    // weak collections should not contains .clear method
	    if (IS_WEAK && proto.clear) delete proto.clear;
	  }

	  _setToStringTag(C, NAME);

	  O[NAME] = C;
	  _export(_export.G + _export.W + _export.F * (C != Base), O);

	  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

	  return C;
	};

	var MAP = 'Map';

	// 23.1 Map Objects
	var es6_map = _collection(MAP, function (get) {
	  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.1.3.6 Map.prototype.get(key)
	  get: function get(key) {
	    var entry = _collectionStrong.getEntry(_validateCollection(this, MAP), key);
	    return entry && entry.v;
	  },
	  // 23.1.3.9 Map.prototype.set(key, value)
	  set: function set(key, value) {
	    return _collectionStrong.def(_validateCollection(this, MAP), key === 0 ? 0 : key, value);
	  }
	}, _collectionStrong, true);

	var SET = 'Set';

	// 23.2 Set Objects
	var es6_set = _collection(SET, function (get) {
	  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.2.3.1 Set.prototype.add(value)
	  add: function add(value) {
	    return _collectionStrong.def(_validateCollection(this, SET), value = value === 0 ? 0 : value, value);
	  }
	}, _collectionStrong);

	var getWeak = _meta.getWeak;







	var arrayFind = _arrayMethods(5);
	var arrayFindIndex = _arrayMethods(6);
	var id$1 = 0;

	// fallback for uncaught frozen keys
	var uncaughtFrozenStore = function (that) {
	  return that._l || (that._l = new UncaughtFrozenStore());
	};
	var UncaughtFrozenStore = function () {
	  this.a = [];
	};
	var findUncaughtFrozen = function (store, key) {
	  return arrayFind(store.a, function (it) {
	    return it[0] === key;
	  });
	};
	UncaughtFrozenStore.prototype = {
	  get: function (key) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) return entry[1];
	  },
	  has: function (key) {
	    return !!findUncaughtFrozen(this, key);
	  },
	  set: function (key, value) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) entry[1] = value;
	    else this.a.push([key, value]);
	  },
	  'delete': function (key) {
	    var index = arrayFindIndex(this.a, function (it) {
	      return it[0] === key;
	    });
	    if (~index) this.a.splice(index, 1);
	    return !!~index;
	  }
	};

	var _collectionWeak = {
	  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      _anInstance(that, C, NAME, '_i');
	      that._t = NAME;      // collection type
	      that._i = id$1++;      // collection id
	      that._l = undefined; // leak store for uncaught frozen objects
	      if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    _redefineAll(C.prototype, {
	      // 23.3.3.2 WeakMap.prototype.delete(key)
	      // 23.4.3.3 WeakSet.prototype.delete(value)
	      'delete': function (key) {
	        if (!_isObject(key)) return false;
	        var data = getWeak(key);
	        if (data === true) return uncaughtFrozenStore(_validateCollection(this, NAME))['delete'](key);
	        return data && _has(data, this._i) && delete data[this._i];
	      },
	      // 23.3.3.4 WeakMap.prototype.has(key)
	      // 23.4.3.4 WeakSet.prototype.has(value)
	      has: function has(key) {
	        if (!_isObject(key)) return false;
	        var data = getWeak(key);
	        if (data === true) return uncaughtFrozenStore(_validateCollection(this, NAME)).has(key);
	        return data && _has(data, this._i);
	      }
	    });
	    return C;
	  },
	  def: function (that, key, value) {
	    var data = getWeak(_anObject(key), true);
	    if (data === true) uncaughtFrozenStore(that).set(key, value);
	    else data[that._i] = value;
	    return that;
	  },
	  ufstore: uncaughtFrozenStore
	};

	var es6_weakMap = createCommonjsModule(function (module) {
	var each = _arrayMethods(0);







	var WEAK_MAP = 'WeakMap';
	var getWeak = _meta.getWeak;
	var isExtensible = Object.isExtensible;
	var uncaughtFrozenStore = _collectionWeak.ufstore;
	var tmp = {};
	var InternalMap;

	var wrapper = function (get) {
	  return function WeakMap() {
	    return get(this, arguments.length > 0 ? arguments[0] : undefined);
	  };
	};

	var methods = {
	  // 23.3.3.3 WeakMap.prototype.get(key)
	  get: function get(key) {
	    if (_isObject(key)) {
	      var data = getWeak(key);
	      if (data === true) return uncaughtFrozenStore(_validateCollection(this, WEAK_MAP)).get(key);
	      return data ? data[this._i] : undefined;
	    }
	  },
	  // 23.3.3.5 WeakMap.prototype.set(key, value)
	  set: function set(key, value) {
	    return _collectionWeak.def(_validateCollection(this, WEAK_MAP), key, value);
	  }
	};

	// 23.3 WeakMap Objects
	var $WeakMap = module.exports = _collection(WEAK_MAP, wrapper, methods, _collectionWeak, true, true);

	// IE11 WeakMap frozen keys fix
	if (_fails(function () { return new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7; })) {
	  InternalMap = _collectionWeak.getConstructor(wrapper, WEAK_MAP);
	  _objectAssign(InternalMap.prototype, methods);
	  _meta.NEED = true;
	  each(['delete', 'has', 'get', 'set'], function (key) {
	    var proto = $WeakMap.prototype;
	    var method = proto[key];
	    _redefine(proto, key, function (a, b) {
	      // store frozen objects on internal weakmap shim
	      if (_isObject(a) && !isExtensible(a)) {
	        if (!this._f) this._f = new InternalMap();
	        var result = this._f[key](a, b);
	        return key == 'set' ? this : result;
	      // store all the rest on native weakmap
	      } return method.call(this, a, b);
	    });
	  });
	}
	});

	var WEAK_SET = 'WeakSet';

	// 23.4 WeakSet Objects
	_collection(WEAK_SET, function (get) {
	  return function WeakSet() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.4.3.1 WeakSet.prototype.add(value)
	  add: function add(value) {
	    return _collectionWeak.def(_validateCollection(this, WEAK_SET), value, true);
	  }
	}, _collectionWeak, false, true);

	var TYPED = _uid('typed_array');
	var VIEW = _uid('view');
	var ABV = !!(_global.ArrayBuffer && _global.DataView);
	var CONSTR = ABV;
	var i$1 = 0;
	var l = 9;
	var Typed;

	var TypedArrayConstructors = (
	  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
	).split(',');

	while (i$1 < l) {
	  if (Typed = _global[TypedArrayConstructors[i$1++]]) {
	    _hide(Typed.prototype, TYPED, true);
	    _hide(Typed.prototype, VIEW, true);
	  } else CONSTR = false;
	}

	var _typed = {
	  ABV: ABV,
	  CONSTR: CONSTR,
	  TYPED: TYPED,
	  VIEW: VIEW
	};

	// https://tc39.github.io/ecma262/#sec-toindex


	var _toIndex = function (it) {
	  if (it === undefined) return 0;
	  var number = _toInteger(it);
	  var length = _toLength(number);
	  if (number !== length) throw RangeError('Wrong length!');
	  return length;
	};

	var _typedBuffer = createCommonjsModule(function (module, exports) {











	var gOPN = _objectGopn.f;
	var dP = _objectDp.f;


	var ARRAY_BUFFER = 'ArrayBuffer';
	var DATA_VIEW = 'DataView';
	var PROTOTYPE = 'prototype';
	var WRONG_LENGTH = 'Wrong length!';
	var WRONG_INDEX = 'Wrong index!';
	var $ArrayBuffer = _global[ARRAY_BUFFER];
	var $DataView = _global[DATA_VIEW];
	var Math = _global.Math;
	var RangeError = _global.RangeError;
	// eslint-disable-next-line no-shadow-restricted-names
	var Infinity = _global.Infinity;
	var BaseBuffer = $ArrayBuffer;
	var abs = Math.abs;
	var pow = Math.pow;
	var floor = Math.floor;
	var log = Math.log;
	var LN2 = Math.LN2;
	var BUFFER = 'buffer';
	var BYTE_LENGTH = 'byteLength';
	var BYTE_OFFSET = 'byteOffset';
	var $BUFFER = _descriptors ? '_b' : BUFFER;
	var $LENGTH = _descriptors ? '_l' : BYTE_LENGTH;
	var $OFFSET = _descriptors ? '_o' : BYTE_OFFSET;

	// IEEE754 conversions based on https://github.com/feross/ieee754
	function packIEEE754(value, mLen, nBytes) {
	  var buffer = new Array(nBytes);
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
	  var i = 0;
	  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
	  var e, m, c;
	  value = abs(value);
	  // eslint-disable-next-line no-self-compare
	  if (value != value || value === Infinity) {
	    // eslint-disable-next-line no-self-compare
	    m = value != value ? 1 : 0;
	    e = eMax;
	  } else {
	    e = floor(log(value) / LN2);
	    if (value * (c = pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }
	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * pow(2, eBias - 1) * pow(2, mLen);
	      e = 0;
	    }
	  }
	  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
	  e = e << mLen | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
	  buffer[--i] |= s * 128;
	  return buffer;
	}
	function unpackIEEE754(buffer, mLen, nBytes) {
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = eLen - 7;
	  var i = nBytes - 1;
	  var s = buffer[i--];
	  var e = s & 127;
	  var m;
	  s >>= 7;
	  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
	  m = e & (1 << -nBits) - 1;
	  e >>= -nBits;
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : s ? -Infinity : Infinity;
	  } else {
	    m = m + pow(2, mLen);
	    e = e - eBias;
	  } return (s ? -1 : 1) * m * pow(2, e - mLen);
	}

	function unpackI32(bytes) {
	  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
	}
	function packI8(it) {
	  return [it & 0xff];
	}
	function packI16(it) {
	  return [it & 0xff, it >> 8 & 0xff];
	}
	function packI32(it) {
	  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
	}
	function packF64(it) {
	  return packIEEE754(it, 52, 8);
	}
	function packF32(it) {
	  return packIEEE754(it, 23, 4);
	}

	function addGetter(C, key, internal) {
	  dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
	}

	function get(view, bytes, index, isLittleEndian) {
	  var numIndex = +index;
	  var intIndex = _toIndex(numIndex);
	  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
	  var store = view[$BUFFER]._b;
	  var start = intIndex + view[$OFFSET];
	  var pack = store.slice(start, start + bytes);
	  return isLittleEndian ? pack : pack.reverse();
	}
	function set(view, bytes, index, conversion, value, isLittleEndian) {
	  var numIndex = +index;
	  var intIndex = _toIndex(numIndex);
	  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
	  var store = view[$BUFFER]._b;
	  var start = intIndex + view[$OFFSET];
	  var pack = conversion(+value);
	  for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
	}

	if (!_typed.ABV) {
	  $ArrayBuffer = function ArrayBuffer(length) {
	    _anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
	    var byteLength = _toIndex(length);
	    this._b = _arrayFill.call(new Array(byteLength), 0);
	    this[$LENGTH] = byteLength;
	  };

	  $DataView = function DataView(buffer, byteOffset, byteLength) {
	    _anInstance(this, $DataView, DATA_VIEW);
	    _anInstance(buffer, $ArrayBuffer, DATA_VIEW);
	    var bufferLength = buffer[$LENGTH];
	    var offset = _toInteger(byteOffset);
	    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
	    byteLength = byteLength === undefined ? bufferLength - offset : _toLength(byteLength);
	    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
	    this[$BUFFER] = buffer;
	    this[$OFFSET] = offset;
	    this[$LENGTH] = byteLength;
	  };

	  if (_descriptors) {
	    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
	    addGetter($DataView, BUFFER, '_b');
	    addGetter($DataView, BYTE_LENGTH, '_l');
	    addGetter($DataView, BYTE_OFFSET, '_o');
	  }

	  _redefineAll($DataView[PROTOTYPE], {
	    getInt8: function getInt8(byteOffset) {
	      return get(this, 1, byteOffset)[0] << 24 >> 24;
	    },
	    getUint8: function getUint8(byteOffset) {
	      return get(this, 1, byteOffset)[0];
	    },
	    getInt16: function getInt16(byteOffset /* , littleEndian */) {
	      var bytes = get(this, 2, byteOffset, arguments[1]);
	      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
	    },
	    getUint16: function getUint16(byteOffset /* , littleEndian */) {
	      var bytes = get(this, 2, byteOffset, arguments[1]);
	      return bytes[1] << 8 | bytes[0];
	    },
	    getInt32: function getInt32(byteOffset /* , littleEndian */) {
	      return unpackI32(get(this, 4, byteOffset, arguments[1]));
	    },
	    getUint32: function getUint32(byteOffset /* , littleEndian */) {
	      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
	    },
	    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
	    },
	    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
	    },
	    setInt8: function setInt8(byteOffset, value) {
	      set(this, 1, byteOffset, packI8, value);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      set(this, 1, byteOffset, packI8, value);
	    },
	    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
	      set(this, 2, byteOffset, packI16, value, arguments[2]);
	    },
	    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
	      set(this, 2, byteOffset, packI16, value, arguments[2]);
	    },
	    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
	      set(this, 4, byteOffset, packI32, value, arguments[2]);
	    },
	    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
	      set(this, 4, byteOffset, packI32, value, arguments[2]);
	    },
	    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
	      set(this, 4, byteOffset, packF32, value, arguments[2]);
	    },
	    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
	      set(this, 8, byteOffset, packF64, value, arguments[2]);
	    }
	  });
	} else {
	  if (!_fails(function () {
	    $ArrayBuffer(1);
	  }) || !_fails(function () {
	    new $ArrayBuffer(-1); // eslint-disable-line no-new
	  }) || _fails(function () {
	    new $ArrayBuffer(); // eslint-disable-line no-new
	    new $ArrayBuffer(1.5); // eslint-disable-line no-new
	    new $ArrayBuffer(NaN); // eslint-disable-line no-new
	    return $ArrayBuffer.name != ARRAY_BUFFER;
	  })) {
	    $ArrayBuffer = function ArrayBuffer(length) {
	      _anInstance(this, $ArrayBuffer);
	      return new BaseBuffer(_toIndex(length));
	    };
	    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
	    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
	      if (!((key = keys[j++]) in $ArrayBuffer)) _hide($ArrayBuffer, key, BaseBuffer[key]);
	    }
	    ArrayBufferProto.constructor = $ArrayBuffer;
	  }
	  // iOS Safari 7.x bug
	  var view = new $DataView(new $ArrayBuffer(2));
	  var $setInt8 = $DataView[PROTOTYPE].setInt8;
	  view.setInt8(0, 2147483648);
	  view.setInt8(1, 2147483649);
	  if (view.getInt8(0) || !view.getInt8(1)) _redefineAll($DataView[PROTOTYPE], {
	    setInt8: function setInt8(byteOffset, value) {
	      $setInt8.call(this, byteOffset, value << 24 >> 24);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      $setInt8.call(this, byteOffset, value << 24 >> 24);
	    }
	  }, true);
	}
	_setToStringTag($ArrayBuffer, ARRAY_BUFFER);
	_setToStringTag($DataView, DATA_VIEW);
	_hide($DataView[PROTOTYPE], _typed.VIEW, true);
	exports[ARRAY_BUFFER] = $ArrayBuffer;
	exports[DATA_VIEW] = $DataView;
	});

	var ArrayBuffer = _global.ArrayBuffer;

	var $ArrayBuffer = _typedBuffer.ArrayBuffer;
	var $DataView = _typedBuffer.DataView;
	var $isView = _typed.ABV && ArrayBuffer.isView;
	var $slice = $ArrayBuffer.prototype.slice;
	var VIEW$1 = _typed.VIEW;
	var ARRAY_BUFFER = 'ArrayBuffer';

	_export(_export.G + _export.W + _export.F * (ArrayBuffer !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });

	_export(_export.S + _export.F * !_typed.CONSTR, ARRAY_BUFFER, {
	  // 24.1.3.1 ArrayBuffer.isView(arg)
	  isView: function isView(it) {
	    return $isView && $isView(it) || _isObject(it) && VIEW$1 in it;
	  }
	});

	_export(_export.P + _export.U + _export.F * _fails(function () {
	  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
	}), ARRAY_BUFFER, {
	  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
	  slice: function slice(start, end) {
	    if ($slice !== undefined && end === undefined) return $slice.call(_anObject(this), start); // FF fix
	    var len = _anObject(this).byteLength;
	    var first = _toAbsoluteIndex(start, len);
	    var fin = _toAbsoluteIndex(end === undefined ? len : end, len);
	    var result = new (_speciesConstructor(this, $ArrayBuffer))(_toLength(fin - first));
	    var viewS = new $DataView(this);
	    var viewT = new $DataView(result);
	    var index = 0;
	    while (first < fin) {
	      viewT.setUint8(index++, viewS.getUint8(first++));
	    } return result;
	  }
	});

	_setSpecies(ARRAY_BUFFER);

	_export(_export.G + _export.W + _export.F * !_typed.ABV, {
	  DataView: _typedBuffer.DataView
	});

	var _typedArray = createCommonjsModule(function (module) {
	if (_descriptors) {
	  var global = _global;
	  var fails = _fails;
	  var $export = _export;
	  var $typed = _typed;
	  var $buffer = _typedBuffer;
	  var ctx = _ctx;
	  var anInstance = _anInstance;
	  var propertyDesc = _propertyDesc;
	  var hide = _hide;
	  var redefineAll = _redefineAll;
	  var toInteger = _toInteger;
	  var toLength = _toLength;
	  var toIndex = _toIndex;
	  var toAbsoluteIndex = _toAbsoluteIndex;
	  var toPrimitive = _toPrimitive;
	  var has = _has;
	  var classof = _classof;
	  var isObject = _isObject;
	  var toObject = _toObject;
	  var isArrayIter = _isArrayIter;
	  var create = _objectCreate;
	  var getPrototypeOf = _objectGpo;
	  var gOPN = _objectGopn.f;
	  var getIterFn = core_getIteratorMethod;
	  var uid = _uid;
	  var wks = _wks;
	  var createArrayMethod = _arrayMethods;
	  var createArrayIncludes = _arrayIncludes;
	  var speciesConstructor = _speciesConstructor;
	  var ArrayIterators = es6_array_iterator;
	  var Iterators = _iterators;
	  var $iterDetect = _iterDetect;
	  var setSpecies = _setSpecies;
	  var arrayFill = _arrayFill;
	  var arrayCopyWithin = _arrayCopyWithin;
	  var $DP = _objectDp;
	  var $GOPD = _objectGopd;
	  var dP = $DP.f;
	  var gOPD = $GOPD.f;
	  var RangeError = global.RangeError;
	  var TypeError = global.TypeError;
	  var Uint8Array = global.Uint8Array;
	  var ARRAY_BUFFER = 'ArrayBuffer';
	  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
	  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
	  var PROTOTYPE = 'prototype';
	  var ArrayProto = Array[PROTOTYPE];
	  var $ArrayBuffer = $buffer.ArrayBuffer;
	  var $DataView = $buffer.DataView;
	  var arrayForEach = createArrayMethod(0);
	  var arrayFilter = createArrayMethod(2);
	  var arraySome = createArrayMethod(3);
	  var arrayEvery = createArrayMethod(4);
	  var arrayFind = createArrayMethod(5);
	  var arrayFindIndex = createArrayMethod(6);
	  var arrayIncludes = createArrayIncludes(true);
	  var arrayIndexOf = createArrayIncludes(false);
	  var arrayValues = ArrayIterators.values;
	  var arrayKeys = ArrayIterators.keys;
	  var arrayEntries = ArrayIterators.entries;
	  var arrayLastIndexOf = ArrayProto.lastIndexOf;
	  var arrayReduce = ArrayProto.reduce;
	  var arrayReduceRight = ArrayProto.reduceRight;
	  var arrayJoin = ArrayProto.join;
	  var arraySort = ArrayProto.sort;
	  var arraySlice = ArrayProto.slice;
	  var arrayToString = ArrayProto.toString;
	  var arrayToLocaleString = ArrayProto.toLocaleString;
	  var ITERATOR = wks('iterator');
	  var TAG = wks('toStringTag');
	  var TYPED_CONSTRUCTOR = uid('typed_constructor');
	  var DEF_CONSTRUCTOR = uid('def_constructor');
	  var ALL_CONSTRUCTORS = $typed.CONSTR;
	  var TYPED_ARRAY = $typed.TYPED;
	  var VIEW = $typed.VIEW;
	  var WRONG_LENGTH = 'Wrong length!';

	  var $map = createArrayMethod(1, function (O, length) {
	    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
	  });

	  var LITTLE_ENDIAN = fails(function () {
	    // eslint-disable-next-line no-undef
	    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
	  });

	  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
	    new Uint8Array(1).set({});
	  });

	  var toOffset = function (it, BYTES) {
	    var offset = toInteger(it);
	    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
	    return offset;
	  };

	  var validate = function (it) {
	    if (isObject(it) && TYPED_ARRAY in it) return it;
	    throw TypeError(it + ' is not a typed array!');
	  };

	  var allocate = function (C, length) {
	    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
	      throw TypeError('It is not a typed array constructor!');
	    } return new C(length);
	  };

	  var speciesFromList = function (O, list) {
	    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
	  };

	  var fromList = function (C, list) {
	    var index = 0;
	    var length = list.length;
	    var result = allocate(C, length);
	    while (length > index) result[index] = list[index++];
	    return result;
	  };

	  var addGetter = function (it, key, internal) {
	    dP(it, key, { get: function () { return this._d[internal]; } });
	  };

	  var $from = function from(source /* , mapfn, thisArg */) {
	    var O = toObject(source);
	    var aLen = arguments.length;
	    var mapfn = aLen > 1 ? arguments[1] : undefined;
	    var mapping = mapfn !== undefined;
	    var iterFn = getIterFn(O);
	    var i, length, values, result, step, iterator;
	    if (iterFn != undefined && !isArrayIter(iterFn)) {
	      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
	        values.push(step.value);
	      } O = values;
	    }
	    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
	    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
	      result[i] = mapping ? mapfn(O[i], i) : O[i];
	    }
	    return result;
	  };

	  var $of = function of(/* ...items */) {
	    var index = 0;
	    var length = arguments.length;
	    var result = allocate(this, length);
	    while (length > index) result[index] = arguments[index++];
	    return result;
	  };

	  // iOS Safari 6.x fails here
	  var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });

	  var $toLocaleString = function toLocaleString() {
	    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
	  };

	  var proto = {
	    copyWithin: function copyWithin(target, start /* , end */) {
	      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    every: function every(callbackfn /* , thisArg */) {
	      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
	      return arrayFill.apply(validate(this), arguments);
	    },
	    filter: function filter(callbackfn /* , thisArg */) {
	      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
	        arguments.length > 1 ? arguments[1] : undefined));
	    },
	    find: function find(predicate /* , thisArg */) {
	      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    findIndex: function findIndex(predicate /* , thisArg */) {
	      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    forEach: function forEach(callbackfn /* , thisArg */) {
	      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    indexOf: function indexOf(searchElement /* , fromIndex */) {
	      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    includes: function includes(searchElement /* , fromIndex */) {
	      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    join: function join(separator) { // eslint-disable-line no-unused-vars
	      return arrayJoin.apply(validate(this), arguments);
	    },
	    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
	      return arrayLastIndexOf.apply(validate(this), arguments);
	    },
	    map: function map(mapfn /* , thisArg */) {
	      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
	      return arrayReduce.apply(validate(this), arguments);
	    },
	    reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
	      return arrayReduceRight.apply(validate(this), arguments);
	    },
	    reverse: function reverse() {
	      var that = this;
	      var length = validate(that).length;
	      var middle = Math.floor(length / 2);
	      var index = 0;
	      var value;
	      while (index < middle) {
	        value = that[index];
	        that[index++] = that[--length];
	        that[length] = value;
	      } return that;
	    },
	    some: function some(callbackfn /* , thisArg */) {
	      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    },
	    sort: function sort(comparefn) {
	      return arraySort.call(validate(this), comparefn);
	    },
	    subarray: function subarray(begin, end) {
	      var O = validate(this);
	      var length = O.length;
	      var $begin = toAbsoluteIndex(begin, length);
	      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
	        O.buffer,
	        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
	        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
	      );
	    }
	  };

	  var $slice = function slice(start, end) {
	    return speciesFromList(this, arraySlice.call(validate(this), start, end));
	  };

	  var $set = function set(arrayLike /* , offset */) {
	    validate(this);
	    var offset = toOffset(arguments[1], 1);
	    var length = this.length;
	    var src = toObject(arrayLike);
	    var len = toLength(src.length);
	    var index = 0;
	    if (len + offset > length) throw RangeError(WRONG_LENGTH);
	    while (index < len) this[offset + index] = src[index++];
	  };

	  var $iterators = {
	    entries: function entries() {
	      return arrayEntries.call(validate(this));
	    },
	    keys: function keys() {
	      return arrayKeys.call(validate(this));
	    },
	    values: function values() {
	      return arrayValues.call(validate(this));
	    }
	  };

	  var isTAIndex = function (target, key) {
	    return isObject(target)
	      && target[TYPED_ARRAY]
	      && typeof key != 'symbol'
	      && key in target
	      && String(+key) == String(key);
	  };
	  var $getDesc = function getOwnPropertyDescriptor(target, key) {
	    return isTAIndex(target, key = toPrimitive(key, true))
	      ? propertyDesc(2, target[key])
	      : gOPD(target, key);
	  };
	  var $setDesc = function defineProperty(target, key, desc) {
	    if (isTAIndex(target, key = toPrimitive(key, true))
	      && isObject(desc)
	      && has(desc, 'value')
	      && !has(desc, 'get')
	      && !has(desc, 'set')
	      // TODO: add validation descriptor w/o calling accessors
	      && !desc.configurable
	      && (!has(desc, 'writable') || desc.writable)
	      && (!has(desc, 'enumerable') || desc.enumerable)
	    ) {
	      target[key] = desc.value;
	      return target;
	    } return dP(target, key, desc);
	  };

	  if (!ALL_CONSTRUCTORS) {
	    $GOPD.f = $getDesc;
	    $DP.f = $setDesc;
	  }

	  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
	    getOwnPropertyDescriptor: $getDesc,
	    defineProperty: $setDesc
	  });

	  if (fails(function () { arrayToString.call({}); })) {
	    arrayToString = arrayToLocaleString = function toString() {
	      return arrayJoin.call(this);
	    };
	  }

	  var $TypedArrayPrototype$ = redefineAll({}, proto);
	  redefineAll($TypedArrayPrototype$, $iterators);
	  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
	  redefineAll($TypedArrayPrototype$, {
	    slice: $slice,
	    set: $set,
	    constructor: function () { /* noop */ },
	    toString: arrayToString,
	    toLocaleString: $toLocaleString
	  });
	  addGetter($TypedArrayPrototype$, 'buffer', 'b');
	  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
	  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
	  addGetter($TypedArrayPrototype$, 'length', 'e');
	  dP($TypedArrayPrototype$, TAG, {
	    get: function () { return this[TYPED_ARRAY]; }
	  });

	  // eslint-disable-next-line max-statements
	  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
	    CLAMPED = !!CLAMPED;
	    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
	    var GETTER = 'get' + KEY;
	    var SETTER = 'set' + KEY;
	    var TypedArray = global[NAME];
	    var Base = TypedArray || {};
	    var TAC = TypedArray && getPrototypeOf(TypedArray);
	    var FORCED = !TypedArray || !$typed.ABV;
	    var O = {};
	    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
	    var getter = function (that, index) {
	      var data = that._d;
	      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
	    };
	    var setter = function (that, index, value) {
	      var data = that._d;
	      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
	      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
	    };
	    var addElement = function (that, index) {
	      dP(that, index, {
	        get: function () {
	          return getter(this, index);
	        },
	        set: function (value) {
	          return setter(this, index, value);
	        },
	        enumerable: true
	      });
	    };
	    if (FORCED) {
	      TypedArray = wrapper(function (that, data, $offset, $length) {
	        anInstance(that, TypedArray, NAME, '_d');
	        var index = 0;
	        var offset = 0;
	        var buffer, byteLength, length, klass;
	        if (!isObject(data)) {
	          length = toIndex(data);
	          byteLength = length * BYTES;
	          buffer = new $ArrayBuffer(byteLength);
	        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
	          buffer = data;
	          offset = toOffset($offset, BYTES);
	          var $len = data.byteLength;
	          if ($length === undefined) {
	            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
	            byteLength = $len - offset;
	            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
	          } else {
	            byteLength = toLength($length) * BYTES;
	            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
	          }
	          length = byteLength / BYTES;
	        } else if (TYPED_ARRAY in data) {
	          return fromList(TypedArray, data);
	        } else {
	          return $from.call(TypedArray, data);
	        }
	        hide(that, '_d', {
	          b: buffer,
	          o: offset,
	          l: byteLength,
	          e: length,
	          v: new $DataView(buffer)
	        });
	        while (index < length) addElement(that, index++);
	      });
	      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
	      hide(TypedArrayPrototype, 'constructor', TypedArray);
	    } else if (!fails(function () {
	      TypedArray(1);
	    }) || !fails(function () {
	      new TypedArray(-1); // eslint-disable-line no-new
	    }) || !$iterDetect(function (iter) {
	      new TypedArray(); // eslint-disable-line no-new
	      new TypedArray(null); // eslint-disable-line no-new
	      new TypedArray(1.5); // eslint-disable-line no-new
	      new TypedArray(iter); // eslint-disable-line no-new
	    }, true)) {
	      TypedArray = wrapper(function (that, data, $offset, $length) {
	        anInstance(that, TypedArray, NAME);
	        var klass;
	        // `ws` module bug, temporarily remove validation length for Uint8Array
	        // https://github.com/websockets/ws/pull/645
	        if (!isObject(data)) return new Base(toIndex(data));
	        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
	          return $length !== undefined
	            ? new Base(data, toOffset($offset, BYTES), $length)
	            : $offset !== undefined
	              ? new Base(data, toOffset($offset, BYTES))
	              : new Base(data);
	        }
	        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
	        return $from.call(TypedArray, data);
	      });
	      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
	        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
	      });
	      TypedArray[PROTOTYPE] = TypedArrayPrototype;
	      TypedArrayPrototype.constructor = TypedArray;
	    }
	    var $nativeIterator = TypedArrayPrototype[ITERATOR];
	    var CORRECT_ITER_NAME = !!$nativeIterator
	      && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
	    var $iterator = $iterators.values;
	    hide(TypedArray, TYPED_CONSTRUCTOR, true);
	    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
	    hide(TypedArrayPrototype, VIEW, true);
	    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

	    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
	      dP(TypedArrayPrototype, TAG, {
	        get: function () { return NAME; }
	      });
	    }

	    O[NAME] = TypedArray;

	    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

	    $export($export.S, NAME, {
	      BYTES_PER_ELEMENT: BYTES
	    });

	    $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
	      from: $from,
	      of: $of
	    });

	    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

	    $export($export.P, NAME, proto);

	    setSpecies(NAME);

	    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

	    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

	    if (TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

	    $export($export.P + $export.F * fails(function () {
	      new TypedArray(1).slice();
	    }), NAME, { slice: $slice });

	    $export($export.P + $export.F * (fails(function () {
	      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
	    }) || !fails(function () {
	      TypedArrayPrototype.toLocaleString.call([1, 2]);
	    })), NAME, { toLocaleString: $toLocaleString });

	    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
	    if (!CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
	  };
	} else module.exports = function () { /* empty */ };
	});

	_typedArray('Int8', 1, function (init) {
	  return function Int8Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	_typedArray('Uint8', 1, function (init) {
	  return function Uint8Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	_typedArray('Uint8', 1, function (init) {
	  return function Uint8ClampedArray(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	}, true);

	_typedArray('Int16', 2, function (init) {
	  return function Int16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	_typedArray('Uint16', 2, function (init) {
	  return function Uint16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	_typedArray('Int32', 4, function (init) {
	  return function Int32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	_typedArray('Uint32', 4, function (init) {
	  return function Uint32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	_typedArray('Float32', 4, function (init) {
	  return function Float32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	_typedArray('Float64', 8, function (init) {
	  return function Float64Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)



	var rApply = (_global.Reflect || {}).apply;
	var fApply = Function.apply;
	// MS Edge argumentsList argument is optional
	_export(_export.S + _export.F * !_fails(function () {
	  rApply(function () { /* empty */ });
	}), 'Reflect', {
	  apply: function apply(target, thisArgument, argumentsList) {
	    var T = _aFunction(target);
	    var L = _anObject(argumentsList);
	    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
	  }
	});

	// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])







	var rConstruct = (_global.Reflect || {}).construct;

	// MS Edge supports only 2 arguments and argumentsList argument is optional
	// FF Nightly sets third argument as `new.target`, but does not create `this` from it
	var NEW_TARGET_BUG = _fails(function () {
	  function F() { /* empty */ }
	  return !(rConstruct(function () { /* empty */ }, [], F) instanceof F);
	});
	var ARGS_BUG = !_fails(function () {
	  rConstruct(function () { /* empty */ });
	});

	_export(_export.S + _export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
	  construct: function construct(Target, args /* , newTarget */) {
	    _aFunction(Target);
	    _anObject(args);
	    var newTarget = arguments.length < 3 ? Target : _aFunction(arguments[2]);
	    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
	    if (Target == newTarget) {
	      // w/o altered newTarget, optimization for 0-4 arguments
	      switch (args.length) {
	        case 0: return new Target();
	        case 1: return new Target(args[0]);
	        case 2: return new Target(args[0], args[1]);
	        case 3: return new Target(args[0], args[1], args[2]);
	        case 4: return new Target(args[0], args[1], args[2], args[3]);
	      }
	      // w/o altered newTarget, lot of arguments case
	      var $args = [null];
	      $args.push.apply($args, args);
	      return new (_bind.apply(Target, $args))();
	    }
	    // with altered newTarget, not support built-in constructors
	    var proto = newTarget.prototype;
	    var instance = _objectCreate(_isObject(proto) ? proto : Object.prototype);
	    var result = Function.apply.call(Target, instance, args);
	    return _isObject(result) ? result : instance;
	  }
	});

	// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)





	// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
	_export(_export.S + _export.F * _fails(function () {
	  // eslint-disable-next-line no-undef
	  Reflect.defineProperty(_objectDp.f({}, 1, { value: 1 }), 1, { value: 2 });
	}), 'Reflect', {
	  defineProperty: function defineProperty(target, propertyKey, attributes) {
	    _anObject(target);
	    propertyKey = _toPrimitive(propertyKey, true);
	    _anObject(attributes);
	    try {
	      _objectDp.f(target, propertyKey, attributes);
	      return true;
	    } catch (e) {
	      return false;
	    }
	  }
	});

	// 26.1.4 Reflect.deleteProperty(target, propertyKey)

	var gOPD$3 = _objectGopd.f;


	_export(_export.S, 'Reflect', {
	  deleteProperty: function deleteProperty(target, propertyKey) {
	    var desc = gOPD$3(_anObject(target), propertyKey);
	    return desc && !desc.configurable ? false : delete target[propertyKey];
	  }
	});

	// 26.1.5 Reflect.enumerate(target)


	var Enumerate = function (iterated) {
	  this._t = _anObject(iterated); // target
	  this._i = 0;                  // next index
	  var keys = this._k = [];      // keys
	  var key;
	  for (key in iterated) keys.push(key);
	};
	_iterCreate(Enumerate, 'Object', function () {
	  var that = this;
	  var keys = that._k;
	  var key;
	  do {
	    if (that._i >= keys.length) return { value: undefined, done: true };
	  } while (!((key = keys[that._i++]) in that._t));
	  return { value: key, done: false };
	});

	_export(_export.S, 'Reflect', {
	  enumerate: function enumerate(target) {
	    return new Enumerate(target);
	  }
	});

	// 26.1.6 Reflect.get(target, propertyKey [, receiver])







	function get(target, propertyKey /* , receiver */) {
	  var receiver = arguments.length < 3 ? target : arguments[2];
	  var desc, proto;
	  if (_anObject(target) === receiver) return target[propertyKey];
	  if (desc = _objectGopd.f(target, propertyKey)) return _has(desc, 'value')
	    ? desc.value
	    : desc.get !== undefined
	      ? desc.get.call(receiver)
	      : undefined;
	  if (_isObject(proto = _objectGpo(target))) return get(proto, propertyKey, receiver);
	}

	_export(_export.S, 'Reflect', { get: get });

	// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)




	_export(_export.S, 'Reflect', {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
	    return _objectGopd.f(_anObject(target), propertyKey);
	  }
	});

	// 26.1.8 Reflect.getPrototypeOf(target)




	_export(_export.S, 'Reflect', {
	  getPrototypeOf: function getPrototypeOf(target) {
	    return _objectGpo(_anObject(target));
	  }
	});

	// 26.1.9 Reflect.has(target, propertyKey)


	_export(_export.S, 'Reflect', {
	  has: function has(target, propertyKey) {
	    return propertyKey in target;
	  }
	});

	// 26.1.10 Reflect.isExtensible(target)


	var $isExtensible = Object.isExtensible;

	_export(_export.S, 'Reflect', {
	  isExtensible: function isExtensible(target) {
	    _anObject(target);
	    return $isExtensible ? $isExtensible(target) : true;
	  }
	});

	// all object keys, includes non-enumerable and symbols



	var Reflect$1 = _global.Reflect;
	var _ownKeys = Reflect$1 && Reflect$1.ownKeys || function ownKeys(it) {
	  var keys = _objectGopn.f(_anObject(it));
	  var getSymbols = _objectGops.f;
	  return getSymbols ? keys.concat(getSymbols(it)) : keys;
	};

	// 26.1.11 Reflect.ownKeys(target)


	_export(_export.S, 'Reflect', { ownKeys: _ownKeys });

	// 26.1.12 Reflect.preventExtensions(target)


	var $preventExtensions = Object.preventExtensions;

	_export(_export.S, 'Reflect', {
	  preventExtensions: function preventExtensions(target) {
	    _anObject(target);
	    try {
	      if ($preventExtensions) $preventExtensions(target);
	      return true;
	    } catch (e) {
	      return false;
	    }
	  }
	});

	// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])









	function set(target, propertyKey, V /* , receiver */) {
	  var receiver = arguments.length < 4 ? target : arguments[3];
	  var ownDesc = _objectGopd.f(_anObject(target), propertyKey);
	  var existingDescriptor, proto;
	  if (!ownDesc) {
	    if (_isObject(proto = _objectGpo(target))) {
	      return set(proto, propertyKey, V, receiver);
	    }
	    ownDesc = _propertyDesc(0);
	  }
	  if (_has(ownDesc, 'value')) {
	    if (ownDesc.writable === false || !_isObject(receiver)) return false;
	    if (existingDescriptor = _objectGopd.f(receiver, propertyKey)) {
	      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
	      existingDescriptor.value = V;
	      _objectDp.f(receiver, propertyKey, existingDescriptor);
	    } else _objectDp.f(receiver, propertyKey, _propertyDesc(0, V));
	    return true;
	  }
	  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
	}

	_export(_export.S, 'Reflect', { set: set });

	// 26.1.14 Reflect.setPrototypeOf(target, proto)



	if (_setProto) _export(_export.S, 'Reflect', {
	  setPrototypeOf: function setPrototypeOf(target, proto) {
	    _setProto.check(target, proto);
	    try {
	      _setProto.set(target, proto);
	      return true;
	    } catch (e) {
	      return false;
	    }
	  }
	});

	// https://github.com/tc39/Array.prototype.includes

	var $includes = _arrayIncludes(true);

	_export(_export.P, 'Array', {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	_addToUnscopables('includes');

	var includes = _core.Array.includes;

	// https://github.com/tc39/proposal-string-pad-start-end




	var _stringPad = function (that, maxLength, fillString, left) {
	  var S = String(_defined(that));
	  var stringLength = S.length;
	  var fillStr = fillString === undefined ? ' ' : String(fillString);
	  var intMaxLength = _toLength(maxLength);
	  if (intMaxLength <= stringLength || fillStr == '') return S;
	  var fillLen = intMaxLength - stringLength;
	  var stringFiller = _stringRepeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
	  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
	  return left ? stringFiller + S : S + stringFiller;
	};

	// https://github.com/tc39/proposal-string-pad-start-end




	// https://github.com/zloirock/core-js/issues/280
	_export(_export.P + _export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(_userAgent), 'String', {
	  padStart: function padStart(maxLength /* , fillString = ' ' */) {
	    return _stringPad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
	  }
	});

	var padStart = _core.String.padStart;

	// https://github.com/tc39/proposal-string-pad-start-end




	// https://github.com/zloirock/core-js/issues/280
	_export(_export.P + _export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(_userAgent), 'String', {
	  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
	    return _stringPad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
	  }
	});

	var padEnd = _core.String.padEnd;

	_wksDefine('asyncIterator');

	var asyncIterator = _wksExt.f('asyncIterator');

	// https://github.com/tc39/proposal-object-getownpropertydescriptors






	_export(_export.S, 'Object', {
	  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
	    var O = _toIobject(object);
	    var getDesc = _objectGopd.f;
	    var keys = _ownKeys(O);
	    var result = {};
	    var i = 0;
	    var key, desc;
	    while (keys.length > i) {
	      desc = getDesc(O, key = keys[i++]);
	      if (desc !== undefined) _createProperty(result, key, desc);
	    }
	    return result;
	  }
	});

	var getOwnPropertyDescriptors = _core.Object.getOwnPropertyDescriptors;

	var isEnum$1 = _objectPie.f;
	var _objectToArray = function (isEntries) {
	  return function (it) {
	    var O = _toIobject(it);
	    var keys = _objectKeys(O);
	    var length = keys.length;
	    var i = 0;
	    var result = [];
	    var key;
	    while (length > i) if (isEnum$1.call(O, key = keys[i++])) {
	      result.push(isEntries ? [key, O[key]] : O[key]);
	    } return result;
	  };
	};

	// https://github.com/tc39/proposal-object-values-entries

	var $values = _objectToArray(false);

	_export(_export.S, 'Object', {
	  values: function values(it) {
	    return $values(it);
	  }
	});

	var values = _core.Object.values;

	// https://github.com/tc39/proposal-object-values-entries

	var $entries = _objectToArray(true);

	_export(_export.S, 'Object', {
	  entries: function entries(it) {
	    return $entries(it);
	  }
	});

	var entries = _core.Object.entries;

	_export(_export.P + _export.R, 'Promise', { 'finally': function (onFinally) {
	  var C = _speciesConstructor(this, _core.Promise || _global.Promise);
	  var isFunction = typeof onFinally == 'function';
	  return this.then(
	    isFunction ? function (x) {
	      return _promiseResolve(C, onFinally()).then(function () { return x; });
	    } : onFinally,
	    isFunction ? function (e) {
	      return _promiseResolve(C, onFinally()).then(function () { throw e; });
	    } : onFinally
	  );
	} });

	var _finally = _core.Promise['finally'];

	// ie9- setTimeout & setInterval additional parameters fix



	var slice = [].slice;
	var MSIE = /MSIE .\./.test(_userAgent); // <- dirty ie9- check
	var wrap$1 = function (set) {
	  return function (fn, time /* , ...args */) {
	    var boundArgs = arguments.length > 2;
	    var args = boundArgs ? slice.call(arguments, 2) : false;
	    return set(boundArgs ? function () {
	      // eslint-disable-next-line no-new-func
	      (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
	    } : fn, time);
	  };
	};
	_export(_export.G + _export.B + _export.F * MSIE, {
	  setTimeout: wrap$1(_global.setTimeout),
	  setInterval: wrap$1(_global.setInterval)
	});

	_export(_export.G + _export.B, {
	  setImmediate: _task.set,
	  clearImmediate: _task.clear
	});

	var ITERATOR$4 = _wks('iterator');
	var TO_STRING_TAG = _wks('toStringTag');
	var ArrayValues = _iterators.Array;

	var DOMIterables = {
	  CSSRuleList: true, // TODO: Not spec compliant, should be false.
	  CSSStyleDeclaration: false,
	  CSSValueList: false,
	  ClientRectList: false,
	  DOMRectList: false,
	  DOMStringList: false,
	  DOMTokenList: true,
	  DataTransferItemList: false,
	  FileList: false,
	  HTMLAllCollection: false,
	  HTMLCollection: false,
	  HTMLFormElement: false,
	  HTMLSelectElement: false,
	  MediaList: true, // TODO: Not spec compliant, should be false.
	  MimeTypeArray: false,
	  NamedNodeMap: false,
	  NodeList: true,
	  PaintRequestList: false,
	  Plugin: false,
	  PluginArray: false,
	  SVGLengthList: false,
	  SVGNumberList: false,
	  SVGPathSegList: false,
	  SVGPointList: false,
	  SVGStringList: false,
	  SVGTransformList: false,
	  SourceBufferList: false,
	  StyleSheetList: true, // TODO: Not spec compliant, should be false.
	  TextTrackCueList: false,
	  TextTrackList: false,
	  TouchList: false
	};

	for (var collections = _objectKeys(DOMIterables), i$2 = 0; i$2 < collections.length; i$2++) {
	  var NAME$1 = collections[i$2];
	  var explicit = DOMIterables[NAME$1];
	  var Collection = _global[NAME$1];
	  var proto$3 = Collection && Collection.prototype;
	  var key$1;
	  if (proto$3) {
	    if (!proto$3[ITERATOR$4]) _hide(proto$3, ITERATOR$4, ArrayValues);
	    if (!proto$3[TO_STRING_TAG]) _hide(proto$3, TO_STRING_TAG, NAME$1);
	    _iterators[NAME$1] = ArrayValues;
	    if (explicit) for (key$1 in es6_array_iterator) if (!proto$3[key$1]) _redefine(proto$3, key$1, es6_array_iterator[key$1], true);
	  }
	}

	var runtime = createCommonjsModule(function (module) {
	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	!(function(global) {

	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    }
	    // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.
	    return;
	  }

	  // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.
	  runtime = global.regeneratorRuntime = module.exports;

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	    var generator = Object.create(protoGenerator.prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  runtime.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  // This is a polyfill for %IteratorPrototype% for environments that
	  // don't natively support it.
	  var IteratorPrototype = {};
	  IteratorPrototype[iteratorSymbol] = function () {
	    return this;
	  };

	  var getProto = Object.getPrototypeOf;
	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  if (NativeIteratorPrototype &&
	      NativeIteratorPrototype !== Op &&
	      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	    // This environment has a native %IteratorPrototype%; use it instead
	    // of the polyfill.
	    IteratorPrototype = NativeIteratorPrototype;
	  }

	  var Gp = GeneratorFunctionPrototype.prototype =
	    Generator.prototype = Object.create(IteratorPrototype);
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunctionPrototype[toStringTagSymbol] =
	    GeneratorFunction.displayName = "GeneratorFunction";

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      prototype[method] = function(arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }

	  runtime.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };

	  runtime.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      if (!(toStringTagSymbol in genFun)) {
	        genFun[toStringTagSymbol] = "GeneratorFunction";
	      }
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
	  // meant to be awaited.
	  runtime.awrap = function(arg) {
	    return { __await: arg };
	  };

	  function AsyncIterator(generator) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value &&
	            typeof value === "object" &&
	            hasOwn.call(value, "__await")) {
	          return Promise.resolve(value.__await).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }

	        return Promise.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration. If the Promise is rejected, however, the
	          // result for this iteration will be rejected with the same
	          // reason. Note that rejections of yielded Promises are not
	          // thrown back into the generator function, as is the case
	          // when an awaited Promise is rejected. This difference in
	          // behavior between yield and await is important, because it
	          // allows the consumer to decide what to do with the yielded
	          // rejection (swallow it and continue, manually .throw it back
	          // into the generator, abandon iteration, whatever). With
	          // await, by contrast, there is no opportunity to examine the
	          // rejection reason outside the generator function, so the
	          // only option is to throw it from the await expression, and
	          // let the generator function handle the exception.
	          result.value = unwrapped;
	          resolve(result);
	        }, reject);
	      }
	    }

	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new Promise(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }

	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);
	  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
	    return this;
	  };
	  runtime.AsyncIterator = AsyncIterator;

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList)
	    );

	    return runtime.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      context.method = method;
	      context.arg = arg;

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          var delegateResult = maybeInvokeDelegate(delegate, context);
	          if (delegateResult) {
	            if (delegateResult === ContinueSentinel) continue;
	            return delegateResult;
	          }
	        }

	        if (context.method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = context.arg;

	        } else if (context.method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw context.arg;
	          }

	          context.dispatchException(context.arg);

	        } else if (context.method === "return") {
	          context.abrupt("return", context.arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;

	          if (record.arg === ContinueSentinel) {
	            continue;
	          }

	          return {
	            value: record.arg,
	            done: context.done
	          };

	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(context.arg) call above.
	          context.method = "throw";
	          context.arg = record.arg;
	        }
	      }
	    };
	  }

	  // Call delegate.iterator[context.method](context.arg) and handle the
	  // result, either by returning a { value, done } result from the
	  // delegate iterator, or by modifying context.method and context.arg,
	  // setting context.delegate to null, and returning the ContinueSentinel.
	  function maybeInvokeDelegate(delegate, context) {
	    var method = delegate.iterator[context.method];
	    if (method === undefined) {
	      // A .throw or .return when the delegate iterator has no .throw
	      // method always terminates the yield* loop.
	      context.delegate = null;

	      if (context.method === "throw") {
	        if (delegate.iterator.return) {
	          // If the delegate iterator has a return method, give it a
	          // chance to clean up.
	          context.method = "return";
	          context.arg = undefined;
	          maybeInvokeDelegate(delegate, context);

	          if (context.method === "throw") {
	            // If maybeInvokeDelegate(context) changed context.method from
	            // "return" to "throw", let that override the TypeError below.
	            return ContinueSentinel;
	          }
	        }

	        context.method = "throw";
	        context.arg = new TypeError(
	          "The iterator does not provide a 'throw' method");
	      }

	      return ContinueSentinel;
	    }

	    var record = tryCatch(method, delegate.iterator, context.arg);

	    if (record.type === "throw") {
	      context.method = "throw";
	      context.arg = record.arg;
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    var info = record.arg;

	    if (! info) {
	      context.method = "throw";
	      context.arg = new TypeError("iterator result is not an object");
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    if (info.done) {
	      // Assign the result of the finished delegate to the temporary
	      // variable specified by delegate.resultName (see delegateYield).
	      context[delegate.resultName] = info.value;

	      // Resume execution at the desired location (see delegateYield).
	      context.next = delegate.nextLoc;

	      // If context.method was "throw" but the delegate handled the
	      // exception, let the outer generator proceed normally. If
	      // context.method was "next", forget context.arg since it has been
	      // "consumed" by the delegate iterator. If context.method was
	      // "return", allow the original .return call to continue in the
	      // outer generator.
	      if (context.method !== "return") {
	        context.method = "next";
	        context.arg = undefined;
	      }

	    } else {
	      // Re-yield the result returned by the delegate method.
	      return info;
	    }

	    // The delegate iterator is finished, so forget it and continue with
	    // the outer generator.
	    context.delegate = null;
	    return ContinueSentinel;
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  Gp[toStringTagSymbol] = "Generator";

	  // A Generator should always return itself as the iterator object when the
	  // @@iterator function is called on it. Some browsers' implementations of the
	  // iterator prototype chain incorrectly implement this, causing the Generator
	  // object to not be returned from this call. This ensures that doesn't happen.
	  // See https://github.com/facebook/regenerator/issues/274 for more details.
	  Gp[iteratorSymbol] = function() {
	    return this;
	  };

	  Gp.toString = function() {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  runtime.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  runtime.values = values;

	  function doneResult() {
	    return { value: undefined, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined;
	      this.done = false;
	      this.delegate = null;

	      this.method = "next";
	      this.arg = undefined;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined;
	          }
	        }
	      }
	    },

	    stop: function() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;

	        if (caught) {
	          // If the dispatched exception was caught by a catch block,
	          // then let that catch block handle the exception normally.
	          context.method = "next";
	          context.arg = undefined;
	        }

	        return !! caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }

	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.method = "next";
	        this.next = finallyEntry.finallyLoc;
	        return ContinueSentinel;
	      }

	      return this.complete(record);
	    },

	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = this.arg = record.arg;
	        this.method = "return";
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }

	      return ContinueSentinel;
	    },

	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      if (this.method === "next") {
	        // Deliberately forget the last sent value so that we don't
	        // accidentally pass it on to the delegate.
	        this.arg = undefined;
	      }

	      return ContinueSentinel;
	    }
	  };
	})(
	  // In sloppy mode, unbound `this` refers to the global object, fallback to
	  // Function constructor if we're in global strict mode. That is sadly a form
	  // of indirect eval which violates Content Security Policy.
	  (function() { return this })() || Function("return this")()
	);
	});

	if (commonjsGlobal._babelPolyfill && typeof console !== "undefined" && console.warn) {
	  console.warn("@babel/polyfill is loaded more than once on this page. This is probably not desirable/intended " + "and may have consequences if different versions of the polyfills are applied sequentially. " + "If you do need to load the polyfill more than once, use @babel/polyfill/noConflict " + "instead to bypass the warning.");
	}

	commonjsGlobal._babelPolyfill = true;

	var defaultpalette = {
	  paletteName: 'Hsl Color Circle',
	  cards: Array.from('0123456789abcdefghijklmnopqrstuvwxyz')
	    .map((name, i) => ({ name, color: `hsl(${i * 10},100%,50%)` })),
	  bgColor: '#222222',
	  sortX: 'deg',
	  sortY: 'saturationv',
	};

	var fuji = {
	  paletteName: 'Fuji',
	  cards: [
	    { name: 'Background', color: '#1d141f' },
	    { name: 'Text', color: '#f0ebdb' },
	    { name: '{}()[]', color: '#bfc0c5' },
	    { name: 'Invalid', color: '#FF5370' },
	    { name: 'Comment', color: '#72747d' },
	    { name: 'Variables', color: '#c3bbe2' },
	    { name: 'Property Name', color: '#c3bbe2' },
	    { name: 'Keyword', color: '#6ea451' },
	    { name: 'Storage', color: '#778a33' },
	    { name: 'Operator', color: '#6da895' },
	    { name: 'Constant, Numeric, Color, Escape Characters', color: '#c274a7' },
	    { name: 'Math, JSON', color: '#c274a7' },
	    { name: 'Booleans and null', color: '#c274a7' },
	    { name: 'String', color: '#db9da7' },
	    { name: 'Function', color: '#8b81c4' },
	    { name: 'Class', color: '#f5c133' },
	    { name: 'Built-in Class', color: '#bf8ed4' },
	  ].map((item, i) => {
	    item.textMode = !!i;
	    return item
	  }),
	  bgColor: '#1d141f',
	};

	function noop() {}

	function assign(tar, src) {
		for (var k in src) tar[k] = src[k];
		return tar;
	}

	function assignTrue(tar, src) {
		for (var k in src) tar[k] = 1;
		return tar;
	}

	function addLoc(element, file, line, column, char) {
		element.__svelte_meta = {
			loc: { file, line, column, char }
		};
	}

	function append(target, node) {
		target.appendChild(node);
	}

	function insert(target, node, anchor) {
		target.insertBefore(node, anchor);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function reinsertAfter(before, target) {
		while (before.nextSibling) target.appendChild(before.nextSibling);
	}

	function reinsertBefore(after, target) {
		var parent = after.parentNode;
		while (parent.firstChild !== after) target.appendChild(parent.firstChild);
	}

	function destroyEach(iterations, detach) {
		for (var i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d(detach);
		}
	}

	function createFragment() {
		return document.createDocumentFragment();
	}

	function createElement(name) {
		return document.createElement(name);
	}

	function createText(data) {
		return document.createTextNode(data);
	}

	function createComment() {
		return document.createComment('');
	}

	function addListener(node, event, handler) {
		node.addEventListener(event, handler, false);
	}

	function removeListener(node, event, handler) {
		node.removeEventListener(event, handler, false);
	}

	function setAttribute(node, attribute, value) {
		node.setAttribute(attribute, value);
	}

	function setAttributes(node, attributes) {
		for (var key in attributes) {
			if (key === 'style') {
				node.style.cssText = attributes[key];
			} else if (key in node) {
				node[key] = attributes[key];
			} else {
				if (attributes[key] === undefined) removeAttribute(node, key);
				else setAttribute(node, key, attributes[key]);
			}
		}
	}

	function removeAttribute(node, attribute) {
		node.removeAttribute(attribute);
	}

	function setData(text, data) {
		text.data = '' + data;
	}

	function setStyle(node, key, value) {
		node.style.setProperty(key, value);
	}

	function selectOption(select, value) {
		for (var i = 0; i < select.options.length; i += 1) {
			var option = select.options[i];

			if (option.__value === value) {
				option.selected = true;
				return;
			}
		}
	}

	function selectValue(select) {
		var selectedOption = select.querySelector(':checked') || select.options[0];
		return selectedOption && selectedOption.__value;
	}

	function getSpreadUpdate(levels, updates) {
		var update = {};

		var to_null_out = {};
		var accounted_for = {};

		var i = levels.length;
		while (i--) {
			var o = levels[i];
			var n = updates[i];

			if (n) {
				for (var key in o) {
					if (!(key in n)) to_null_out[key] = 1;
				}

				for (var key in n) {
					if (!accounted_for[key]) {
						update[key] = n[key];
						accounted_for[key] = 1;
					}
				}

				levels[i] = n;
			} else {
				for (var key in o) {
					accounted_for[key] = 1;
				}
			}
		}

		for (var key in to_null_out) {
			if (!(key in update)) update[key] = undefined;
		}

		return update;
	}

	function blankObject() {
		return Object.create(null);
	}

	function destroy(detach) {
		this.destroy = noop;
		this.fire('destroy');
		this.set = noop;

		this._fragment.d(detach !== false);
		this._fragment = null;
		this._state = {};
	}

	function destroyDev(detach) {
		destroy.call(this, detach);
		this.destroy = function() {
			console.warn('Component was already destroyed');
		};
	}

	function _differs(a, b) {
		return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	function _differsImmutable(a, b) {
		return a != a ? b == b : a !== b;
	}

	function fire(eventName, data) {
		var handlers =
			eventName in this._handlers && this._handlers[eventName].slice();
		if (!handlers) return;

		for (var i = 0; i < handlers.length; i += 1) {
			var handler = handlers[i];

			if (!handler.__calling) {
				try {
					handler.__calling = true;
					handler.call(this, data);
				} finally {
					handler.__calling = false;
				}
			}
		}
	}

	function flush(component) {
		component._lock = true;
		callAll(component._beforecreate);
		callAll(component._oncreate);
		callAll(component._aftercreate);
		component._lock = false;
	}

	function get$1() {
		return this._state;
	}

	function init(component, options) {
		component._handlers = blankObject();
		component._slots = blankObject();
		component._bind = options._bind;
		component._staged = {};

		component.options = options;
		component.root = options.root || component;
		component.store = options.store || component.root.store;

		if (!options.root) {
			component._beforecreate = [];
			component._oncreate = [];
			component._aftercreate = [];
		}
	}

	function on(eventName, handler) {
		var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
		handlers.push(handler);

		return {
			cancel: function() {
				var index = handlers.indexOf(handler);
				if (~index) handlers.splice(index, 1);
			}
		};
	}

	function set$1(newState) {
		this._set(assign({}, newState));
		if (this.root._lock) return;
		flush(this.root);
	}

	function _set(newState) {
		var oldState = this._state,
			changed = {},
			dirty = false;

		newState = assign(this._staged, newState);
		this._staged = {};

		for (var key in newState) {
			if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
		}
		if (!dirty) return;

		this._state = assign(assign({}, oldState), newState);
		this._recompute(changed, this._state);
		if (this._bind) this._bind(changed, this._state);

		if (this._fragment) {
			this.fire("state", { changed: changed, current: this._state, previous: oldState });
			this._fragment.p(changed, this._state);
			this.fire("update", { changed: changed, current: this._state, previous: oldState });
		}
	}

	function _stage(newState) {
		assign(this._staged, newState);
	}

	function setDev(newState) {
		if (typeof newState !== 'object') {
			throw new Error(
				this._debugName + '.set was called without an object of data key-values to update.'
			);
		}

		this._checkReadOnly(newState);
		set$1.call(this, newState);
	}

	function callAll(fns) {
		while (fns && fns.length) fns.shift()();
	}

	function _mount(target, anchor) {
		this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
	}

	function removeFromStore() {
		this.store._remove(this);
	}

	var protoDev = {
		destroy: destroyDev,
		get: get$1,
		fire,
		on,
		set: setDev,
		_recompute: noop,
		_set,
		_stage,
		_mount,
		_differs
	};

	function Store(state, options) {
		this._handlers = {};
		this._dependents = [];

		this._computed = blankObject();
		this._sortedComputedProperties = [];

		this._state = assign({}, state);
		this._differs = options && options.immutable ? _differsImmutable : _differs;
	}

	assign(Store.prototype, {
		_add(component, props) {
			this._dependents.push({
				component: component,
				props: props
			});
		},

		_init(props) {
			const state = {};
			for (let i = 0; i < props.length; i += 1) {
				const prop = props[i];
				state['$' + prop] = this._state[prop];
			}
			return state;
		},

		_remove(component) {
			let i = this._dependents.length;
			while (i--) {
				if (this._dependents[i].component === component) {
					this._dependents.splice(i, 1);
					return;
				}
			}
		},

		_set(newState, changed) {
			const previous = this._state;
			this._state = assign(assign({}, previous), newState);

			for (let i = 0; i < this._sortedComputedProperties.length; i += 1) {
				this._sortedComputedProperties[i].update(this._state, changed);
			}

			this.fire('state', {
				changed,
				previous,
				current: this._state
			});

			this._dependents
				.filter(dependent => {
					const componentState = {};
					let dirty = false;

					for (let j = 0; j < dependent.props.length; j += 1) {
						const prop = dependent.props[j];
						if (prop in changed) {
							componentState['$' + prop] = this._state[prop];
							dirty = true;
						}
					}

					if (dirty) {
						dependent.component._stage(componentState);
						return true;
					}
				})
				.forEach(dependent => {
					dependent.component.set({});
				});

			this.fire('update', {
				changed,
				previous,
				current: this._state
			});
		},

		_sortComputedProperties() {
			const computed = this._computed;
			const sorted = this._sortedComputedProperties = [];
			const visited = blankObject();
			let currentKey;

			function visit(key) {
				const c = computed[key];

				if (c) {
					c.deps.forEach(dep => {
						if (dep === currentKey) {
							throw new Error(`Cyclical dependency detected between ${dep} <-> ${key}`);
						}

						visit(dep);
					});

					if (!visited[key]) {
						visited[key] = true;
						sorted.push(c);
					}
				}
			}

			for (const key in this._computed) {
				visit(currentKey = key);
			}
		},

		compute(key, deps, fn) {
			let value;

			const c = {
				deps,
				update: (state, changed, dirty) => {
					const values = deps.map(dep => {
						if (dep in changed) dirty = true;
						return state[dep];
					});

					if (dirty) {
						const newValue = fn.apply(null, values);
						if (this._differs(newValue, value)) {
							value = newValue;
							changed[key] = true;
							state[key] = value;
						}
					}
				}
			};

			this._computed[key] = c;
			this._sortComputedProperties();

			const state = assign({}, this._state);
			const changed = {};
			c.update(state, changed, true);
			this._set(state, changed);
		},

		fire,

		get: get$1,

		on,

		set(newState) {
			const oldState = this._state;
			const changed = this._changed = {};
			let dirty = false;

			for (const key in newState) {
				if (this._computed[key]) throw new Error(`'${key}' is a read-only property`);
				if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
			}
			if (!dirty) return;

			this._set(newState, changed);
		}
	});

	const defaultkeymaps = [
	  {
	    key: 'ctrl+z',
	    action: 'undo',
	    mode: '',
	    // payload: {}
	  },
	  {
	    key: 'ctrl+shift+z',
	    action: 'redo',
	    mode: '',
	    // payload: {}
	  },
	];
	/**
	 * keydown
	 *
	 * @param {function} handler
	 * @returns {function}
	 */
	function keydownHandler (handler) {
	  return function (e) {
	    if (
	      e.which !== 17 && // Ctrl
	      e.which !== 91 && // Cmd
	      e.which !== 18 && // Alt
	      e.which !== 16 && // Shift
	      !(/^\w$/.test(e.key) && !(e.ctrlKey || e.altKey || e.metaKey)) // [a-zA-Z]
	    ) {
	      handler(e);
	    }
	  }
	}

	class KeyManager {
	  constructor (store, options = {}) {
	    const { keymaps } = this.options = Object.assign({
	      element: window,
	      keymaps: defaultkeymaps,
	    }, options);
	    this.mode = options.mode;
	    this.keymaps = [];

	    this.addKeymaps(keymaps);

	    this.options.element.addEventListener('keydown', keydownHandler((e) => {
	      const inputTags = /^(INPUT|TEXTAREA)$/.test(e.target.tagName);
	      if (inputTags || e.target.contentEditable === 'true' || e.target.parentNode.contentEditable === 'true') {
	        // brackets
	        return `fd${inputTags}`
	      }
	      // console.log('e.key', e.key, this.keymaps)
	      this.keymaps.some((keymap) => {
	        const action = this.getAction(e, keymap);
	        if (action) {
	          try {
	            if (typeof action === 'function') {
	              action(e, keymap.payload);
	            } else if (store) {
	              if (typeof store[action] === 'function') {
	                store[action](e, keymap.payload);
	              } else {
	                store.fire(action, e, keymap.payload);
	              }
	            } else {
	              throw new Error('keymaps action error')
	            }
	          } catch (err) {
	            console.error(err.message, err.stack);
	          }
	          e.preventDefault();
	          return true
	        }
	      });
	    }));
	  }

	  getAction (e, keymap) {
	    const { key, action, mode } = keymap;
	    // if (!this.modeCheck(mode)) return
	    if (e.shiftKey !== /\bshift\b/i.test(key)) return
	    if (e.ctrlKey !== /\bctrl\b/i.test(key)) return
	    if (e.altKey !== /\balt\b/i.test(key)) return
	    if (e.metaKey !== /\b(command|cmd)\b/i.test(key)) return

	    const eKey = e.key.replace('Arrow', '').toLowerCase();
	    const keyReg = key.replace(/\b(shift|ctrl|alt|command|cmd)[-+]/ig, '');
	    // console.log(keyReg, eKey)
	    if (!new RegExp(`${keyReg}$`).test(eKey)) return
	    return action
	  }

	  addKeymap (key, action, mode = '', payload = {}) {
	    this.keymaps.push({ key, action, mode, payload });
	  }

	  addKeymaps (keymaps, mode) {
	    // store.on('undo', (e, payload) => { store.undo() })
	    // [
	    //   { key: 'ctrl+z', action: 'undo', mode, payload },
	    // ]
	    if (Array.isArray(keymaps)) {
	      for (const keymap of keymaps) {
	        this.keymaps.push(keymap);
	      }
	    } else if (typeof keymaps === 'object') {
	    // {
	      // 'ctrl+z' () { store.undo() },
	    // }
	      for (const [key, action] of Object.entries(keymaps)) {
	        this.addKeymap(key, action, mode);
	      }
	    }
	  }
	}

	/* eslint no-extend-native: 0 */
	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	Map.prototype.toJSON = function toJSON () {
	  return [...Map.prototype.entries.call(this)]
	};
	Set.prototype.toJSON = function toJSON () {
	  return [...Set.prototype.values.call(this)]
	};

	function save (key, value) {
	  window.localStorage.setItem(key, JSON.stringify(value));
	}
	function load (key) {
	  const data = window.localStorage.getItem(key);
	  if (!data) {
	    console.warn(key + ' is Undefind');
	    return null
	  }
	  return JSON.parse(window.localStorage.getItem(key))
	}

	function updater (globalStorageKey) {
	  const saveListsKey = globalStorageKey + '-list';
	  const saveList = load(saveListsKey);
	  if (saveList) {
	    saveList.forEach((saveName) => {
	      const data = load(saveName);
	      if (data) {
	        window.localStorage.removeItem(saveName);
	        const storageKey = globalStorageKey + '/palette/' + saveName;
	        save(storageKey, data);
	      }
	    });
	    window.localStorage.removeItem(saveListsKey);
	  }
	  return saveList
	}

	const EVENTS = constructor._events = {};

	class Histore extends Store {
	  constructor (state, options) {
	    const { globalStorageKey } = options;
	    const saveTypes = options.saveTypes || { global: Object.keys(state) };
	    if (globalStorageKey) {
	      state = load(globalStorageKey) || state;
	    }

	    super(state, options);
	    this._keyManager = new KeyManager(this, options);
	    this.options = options;

	    this.globalStorageKey = globalStorageKey;

	    this.saveListsKey = globalStorageKey + '-lists';
	    const _saveList = load(this.saveListsKey) || {};

	    const oldData = updater(globalStorageKey);
	    /**
	     * @property {Set{}} saveLists { global: new Set(['saveName', 'saveName']) }
	     */
	    this.saveLists = Object.keys(saveTypes).reduce((obj, saveType, i) => {
	      if (i) {
	        const saveList = _saveList[saveType];
	        if (i === 1 && oldData) {
	          saveList.push(...oldData);
	        }
	        obj[saveType] = new Set(saveList || []);
	      }
	      return obj
	    }, {});

	    this._history = {
	      oldstate: JSON.stringify(state),
	      undostock: [],
	      redostock: [],
	      memo: false,
	    };

	    this.on('update', this._memo.bind(this));
	  }
	  on (eventName, handler) {
	    if (eventName === 'state' || eventName === 'update') {
	      super.on(eventName, handler);
	    } else {
	      (EVENTS[eventName] = EVENTS[eventName] || []).push(handler);
	    }
	    return this
	  }
	  fire (eventName, ...args) {
	    console.log('fire', eventName);
	    if (eventName === 'state' || eventName === 'update') {
	      super.fire(eventName, ...args);
	    } else if (EVENTS[eventName]) {
	      EVENTS[eventName].forEach((handler) => handler(...args));
	    } else {
	      console.error(`fire: ${eventName} is undefind`);
	    }
	    return this
	  }
	  set (newState, memo) {
	    for (const key in newState) {
	      if (typeof newState[key] === 'function') {
	        newState[key] = newState[key](this.get()[key]);
	      }
	    }
	    this._history.memo = memo;
	    super.set(newState);
	  }
	  memo () {
	    this._history.memo = true;
	    this._memo({
	      current: this.get(),
	    });
	  }
	  dataList (saveType) {
	    const saveList = this.saveLists[saveType];
	    const list = [];
	    saveList.forEach((saveName) => {
	      const storageKey = this._createStorageKey(saveType, saveName);
	      const data = load(storageKey);
	      if (!data) return
	      list.push(data);
	    });
	    return list
	  }
	  _createStorageKey (saveType, saveName) {
	    return this.globalStorageKey + '/' + saveType + '/' + saveName
	  }

	  /**
	   * LocalStrageにデータを追加
	   *
	   * @param {string} saveType
	   * @param {string} saveName
	   * @param {*} data
	   * @memberof Histore
	   */
	  add (saveType, saveName, data) {
	    const storageKey = this._createStorageKey(saveType, saveName);
	    if (!load(storageKey)) {
	      this._save(saveType, saveName, data);
	    }
	  }
	  /**
	   * LocalStrageからデータを削除
	   *
	   * @param {string} saveType
	   * @param {string} saveName
	   * @memberof Histore
	   */
	  remove (saveType, saveName) {
	    const storageKey = this._createStorageKey(saveType, saveName);
	    const saveList = this.saveLists[saveType];
	    if (saveList && saveList.has(saveName)) {
	      window.localStorage.removeItem(storageKey);

	      saveList.delete(saveName);
	      save(this.saveListsKey, this.saveLists);
	    } else {
	      throw new Error(`Histore.remove(${saveType}, ${saveName}): save is undefind`)
	    }
	  }
	  /**
	   * LocalStrageからstateにデータをロード
	   *
	   * @param {string} saveType
	   * @param {string} saveName
	   * @memberof Histore
	   */
	  load (saveType, saveName) {
	    const storageKey = this._createStorageKey(saveType, saveName);
	    const data = load(storageKey);
	    if (data) {
	      data[saveType] = saveName;
	      this.set(data);
	    } else {
	      throw new Error(`Histore.load(${saveType}, ${saveName}): savedata is undefind`)
	    }
	  }
	  /**
	   * LocalStrageにstateのデータを保存
	   *
	   * @param {string} [saveType] 省略した場合、すべて記録する
	   * @param {string} [saveName]
	   * @memberof Histore
	   */
	  save (saveType, saveName) {
	    const state = this.get();
	    const { saveTypes, saveUse } = this.options;

	    if (saveType == null) {
	      Object.keys(saveTypes).forEach((savetype) => {
	        const data = saveTypes[savetype].reduce((obj, key) => {
	          obj[key] = state[key];
	          return obj
	        }, {});

	        if (savetype === 'global') {
	          save(this.globalStorageKey, data);
	        } else {
	          this._save(savetype, '', data);
	        }
	      });
	    } else {
	      const data = saveTypes[saveType].reduce((obj, key) => {
	        obj[key] = state[key];
	        return obj
	      }, {});

	      const savename = saveName || saveUse[saveType];
	      this._save(saveType, savename, data);
	    }
	  }
	  _save (saveType, saveName, data) {
	    const saveList = this.saveLists[saveType];
	    if (saveList && !saveList.has(saveName) && saveType !== 'global' && saveName) {
	      saveList.add(saveName);
	      save(this.saveListsKey, this.saveLists);
	    }
	    save(this._createStorageKey(saveType, saveName), data);
	  }


	  _memo ({ changed, current, previous }) {
	    const newstateJSON = JSON.stringify(current);
	    const { oldstate, undostock, redostock, memo } = this._history;
	    console.log('changed', newstateJSON !== oldstate);
	    if (newstateJSON !== oldstate) {
	      switch (memo) {
	        case 'undo':
	          redostock.push(oldstate);
	          break
	        case 'redo':
	          undostock.push(oldstate);
	          break
	        case true:
	          undostock.push(oldstate);
	          if (undostock.length > 10) {
	            undostock.shift();
	          }
	          redostock.splice(0, redostock.length);
	          break
	      }
	      if (memo) {
	        this.save();
	        this._history.oldstate = newstateJSON;
	      }
	      console.log('memo', memo);
	    }
	    this._history.memo = false;
	    console.log('State', this.get());
	  }
	  undo () {
	    const history = this._history;
	    if (history.undostock.length) {
	      this.set(JSON.parse(history.undostock.pop()), 'undo');
	    }
	  }
	  redo () {
	    const history = this._history;
	    if (history.redostock.length) {
	      this.set(JSON.parse(history.redostock.pop()), 'redo');
	    }
	  }
	}

	var colorName = {
		"aliceblue": [240, 248, 255],
		"antiquewhite": [250, 235, 215],
		"aqua": [0, 255, 255],
		"aquamarine": [127, 255, 212],
		"azure": [240, 255, 255],
		"beige": [245, 245, 220],
		"bisque": [255, 228, 196],
		"black": [0, 0, 0],
		"blanchedalmond": [255, 235, 205],
		"blue": [0, 0, 255],
		"blueviolet": [138, 43, 226],
		"brown": [165, 42, 42],
		"burlywood": [222, 184, 135],
		"cadetblue": [95, 158, 160],
		"chartreuse": [127, 255, 0],
		"chocolate": [210, 105, 30],
		"coral": [255, 127, 80],
		"cornflowerblue": [100, 149, 237],
		"cornsilk": [255, 248, 220],
		"crimson": [220, 20, 60],
		"cyan": [0, 255, 255],
		"darkblue": [0, 0, 139],
		"darkcyan": [0, 139, 139],
		"darkgoldenrod": [184, 134, 11],
		"darkgray": [169, 169, 169],
		"darkgreen": [0, 100, 0],
		"darkgrey": [169, 169, 169],
		"darkkhaki": [189, 183, 107],
		"darkmagenta": [139, 0, 139],
		"darkolivegreen": [85, 107, 47],
		"darkorange": [255, 140, 0],
		"darkorchid": [153, 50, 204],
		"darkred": [139, 0, 0],
		"darksalmon": [233, 150, 122],
		"darkseagreen": [143, 188, 143],
		"darkslateblue": [72, 61, 139],
		"darkslategray": [47, 79, 79],
		"darkslategrey": [47, 79, 79],
		"darkturquoise": [0, 206, 209],
		"darkviolet": [148, 0, 211],
		"deeppink": [255, 20, 147],
		"deepskyblue": [0, 191, 255],
		"dimgray": [105, 105, 105],
		"dimgrey": [105, 105, 105],
		"dodgerblue": [30, 144, 255],
		"firebrick": [178, 34, 34],
		"floralwhite": [255, 250, 240],
		"forestgreen": [34, 139, 34],
		"fuchsia": [255, 0, 255],
		"gainsboro": [220, 220, 220],
		"ghostwhite": [248, 248, 255],
		"gold": [255, 215, 0],
		"goldenrod": [218, 165, 32],
		"gray": [128, 128, 128],
		"green": [0, 128, 0],
		"greenyellow": [173, 255, 47],
		"grey": [128, 128, 128],
		"honeydew": [240, 255, 240],
		"hotpink": [255, 105, 180],
		"indianred": [205, 92, 92],
		"indigo": [75, 0, 130],
		"ivory": [255, 255, 240],
		"khaki": [240, 230, 140],
		"lavender": [230, 230, 250],
		"lavenderblush": [255, 240, 245],
		"lawngreen": [124, 252, 0],
		"lemonchiffon": [255, 250, 205],
		"lightblue": [173, 216, 230],
		"lightcoral": [240, 128, 128],
		"lightcyan": [224, 255, 255],
		"lightgoldenrodyellow": [250, 250, 210],
		"lightgray": [211, 211, 211],
		"lightgreen": [144, 238, 144],
		"lightgrey": [211, 211, 211],
		"lightpink": [255, 182, 193],
		"lightsalmon": [255, 160, 122],
		"lightseagreen": [32, 178, 170],
		"lightskyblue": [135, 206, 250],
		"lightslategray": [119, 136, 153],
		"lightslategrey": [119, 136, 153],
		"lightsteelblue": [176, 196, 222],
		"lightyellow": [255, 255, 224],
		"lime": [0, 255, 0],
		"limegreen": [50, 205, 50],
		"linen": [250, 240, 230],
		"magenta": [255, 0, 255],
		"maroon": [128, 0, 0],
		"mediumaquamarine": [102, 205, 170],
		"mediumblue": [0, 0, 205],
		"mediumorchid": [186, 85, 211],
		"mediumpurple": [147, 112, 219],
		"mediumseagreen": [60, 179, 113],
		"mediumslateblue": [123, 104, 238],
		"mediumspringgreen": [0, 250, 154],
		"mediumturquoise": [72, 209, 204],
		"mediumvioletred": [199, 21, 133],
		"midnightblue": [25, 25, 112],
		"mintcream": [245, 255, 250],
		"mistyrose": [255, 228, 225],
		"moccasin": [255, 228, 181],
		"navajowhite": [255, 222, 173],
		"navy": [0, 0, 128],
		"oldlace": [253, 245, 230],
		"olive": [128, 128, 0],
		"olivedrab": [107, 142, 35],
		"orange": [255, 165, 0],
		"orangered": [255, 69, 0],
		"orchid": [218, 112, 214],
		"palegoldenrod": [238, 232, 170],
		"palegreen": [152, 251, 152],
		"paleturquoise": [175, 238, 238],
		"palevioletred": [219, 112, 147],
		"papayawhip": [255, 239, 213],
		"peachpuff": [255, 218, 185],
		"peru": [205, 133, 63],
		"pink": [255, 192, 203],
		"plum": [221, 160, 221],
		"powderblue": [176, 224, 230],
		"purple": [128, 0, 128],
		"rebeccapurple": [102, 51, 153],
		"red": [255, 0, 0],
		"rosybrown": [188, 143, 143],
		"royalblue": [65, 105, 225],
		"saddlebrown": [139, 69, 19],
		"salmon": [250, 128, 114],
		"sandybrown": [244, 164, 96],
		"seagreen": [46, 139, 87],
		"seashell": [255, 245, 238],
		"sienna": [160, 82, 45],
		"silver": [192, 192, 192],
		"skyblue": [135, 206, 235],
		"slateblue": [106, 90, 205],
		"slategray": [112, 128, 144],
		"slategrey": [112, 128, 144],
		"snow": [255, 250, 250],
		"springgreen": [0, 255, 127],
		"steelblue": [70, 130, 180],
		"tan": [210, 180, 140],
		"teal": [0, 128, 128],
		"thistle": [216, 191, 216],
		"tomato": [255, 99, 71],
		"turquoise": [64, 224, 208],
		"violet": [238, 130, 238],
		"wheat": [245, 222, 179],
		"white": [255, 255, 255],
		"whitesmoke": [245, 245, 245],
		"yellow": [255, 255, 0],
		"yellowgreen": [154, 205, 50]
	};

	var isArrayish = function isArrayish(obj) {
		if (!obj || typeof obj === 'string') {
			return false;
		}

		return obj instanceof Array || Array.isArray(obj) ||
			(obj.length >= 0 && (obj.splice instanceof Function ||
				(Object.getOwnPropertyDescriptor(obj, (obj.length - 1)) && obj.constructor.name !== 'String')));
	};

	var simpleSwizzle = createCommonjsModule(function (module) {



	var concat = Array.prototype.concat;
	var slice = Array.prototype.slice;

	var swizzle = module.exports = function swizzle(args) {
		var results = [];

		for (var i = 0, len = args.length; i < len; i++) {
			var arg = args[i];

			if (isArrayish(arg)) {
				// http://jsperf.com/javascript-array-concat-vs-push/98
				results = concat.call(results, slice.call(arg));
			} else {
				results.push(arg);
			}
		}

		return results;
	};

	swizzle.wrap = function (fn) {
		return function () {
			return fn(swizzle(arguments));
		};
	};
	});

	var colorString = createCommonjsModule(function (module) {
	/* MIT license */



	var reverseNames = {};

	// create a list of reverse color names
	for (var name in colorName) {
		if (colorName.hasOwnProperty(name)) {
			reverseNames[colorName[name]] = name;
		}
	}

	var cs = module.exports = {
		to: {},
		get: {}
	};

	cs.get = function (string) {
		var prefix = string.substring(0, 3).toLowerCase();
		var val;
		var model;
		switch (prefix) {
			case 'hsl':
				val = cs.get.hsl(string);
				model = 'hsl';
				break;
			case 'hwb':
				val = cs.get.hwb(string);
				model = 'hwb';
				break;
			default:
				val = cs.get.rgb(string);
				model = 'rgb';
				break;
		}

		if (!val) {
			return null;
		}

		return {model: model, value: val};
	};

	cs.get.rgb = function (string) {
		if (!string) {
			return null;
		}

		var abbr = /^#([a-f0-9]{3,4})$/i;
		var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
		var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
		var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
		var keyword = /(\D+)/;

		var rgb = [0, 0, 0, 1];
		var match;
		var i;
		var hexAlpha;

		if (match = string.match(hex)) {
			hexAlpha = match[2];
			match = match[1];

			for (i = 0; i < 3; i++) {
				// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
				var i2 = i * 2;
				rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
			}

			if (hexAlpha) {
				rgb[3] = Math.round((parseInt(hexAlpha, 16) / 255) * 100) / 100;
			}
		} else if (match = string.match(abbr)) {
			match = match[1];
			hexAlpha = match[3];

			for (i = 0; i < 3; i++) {
				rgb[i] = parseInt(match[i] + match[i], 16);
			}

			if (hexAlpha) {
				rgb[3] = Math.round((parseInt(hexAlpha + hexAlpha, 16) / 255) * 100) / 100;
			}
		} else if (match = string.match(rgba)) {
			for (i = 0; i < 3; i++) {
				rgb[i] = parseInt(match[i + 1], 0);
			}

			if (match[4]) {
				rgb[3] = parseFloat(match[4]);
			}
		} else if (match = string.match(per)) {
			for (i = 0; i < 3; i++) {
				rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
			}

			if (match[4]) {
				rgb[3] = parseFloat(match[4]);
			}
		} else if (match = string.match(keyword)) {
			if (match[1] === 'transparent') {
				return [0, 0, 0, 0];
			}

			rgb = colorName[match[1]];

			if (!rgb) {
				return null;
			}

			rgb[3] = 1;

			return rgb;
		} else {
			return null;
		}

		for (i = 0; i < 3; i++) {
			rgb[i] = clamp(rgb[i], 0, 255);
		}
		rgb[3] = clamp(rgb[3], 0, 1);

		return rgb;
	};

	cs.get.hsl = function (string) {
		if (!string) {
			return null;
		}

		var hsl = /^hsla?\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
		var match = string.match(hsl);

		if (match) {
			var alpha = parseFloat(match[4]);
			var h = (parseFloat(match[1]) + 360) % 360;
			var s = clamp(parseFloat(match[2]), 0, 100);
			var l = clamp(parseFloat(match[3]), 0, 100);
			var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

			return [h, s, l, a];
		}

		return null;
	};

	cs.get.hwb = function (string) {
		if (!string) {
			return null;
		}

		var hwb = /^hwb\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
		var match = string.match(hwb);

		if (match) {
			var alpha = parseFloat(match[4]);
			var h = ((parseFloat(match[1]) % 360) + 360) % 360;
			var w = clamp(parseFloat(match[2]), 0, 100);
			var b = clamp(parseFloat(match[3]), 0, 100);
			var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
			return [h, w, b, a];
		}

		return null;
	};

	cs.to.hex = function () {
		var rgba = simpleSwizzle(arguments);

		return (
			'#' +
			hexDouble(rgba[0]) +
			hexDouble(rgba[1]) +
			hexDouble(rgba[2]) +
			(rgba[3] < 1
				? (hexDouble(Math.round(rgba[3] * 255)))
				: '')
		);
	};

	cs.to.rgb = function () {
		var rgba = simpleSwizzle(arguments);

		return rgba.length < 4 || rgba[3] === 1
			? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
			: 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
	};

	cs.to.rgb.percent = function () {
		var rgba = simpleSwizzle(arguments);

		var r = Math.round(rgba[0] / 255 * 100);
		var g = Math.round(rgba[1] / 255 * 100);
		var b = Math.round(rgba[2] / 255 * 100);

		return rgba.length < 4 || rgba[3] === 1
			? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
			: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
	};

	cs.to.hsl = function () {
		var hsla = simpleSwizzle(arguments);
		return hsla.length < 4 || hsla[3] === 1
			? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
			: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
	};

	// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
	// (hwb have alpha optional & 1 is default value)
	cs.to.hwb = function () {
		var hwba = simpleSwizzle(arguments);

		var a = '';
		if (hwba.length >= 4 && hwba[3] !== 1) {
			a = ', ' + hwba[3];
		}

		return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
	};

	cs.to.keyword = function (rgb) {
		return reverseNames[rgb.slice(0, 3)];
	};

	// helpers
	function clamp(num, min, max) {
		return Math.min(Math.max(min, num), max);
	}

	function hexDouble(num) {
		var str = num.toString(16).toUpperCase();
		return (str.length < 2) ? '0' + str : str;
	}
	});
	var colorString_1 = colorString.to;
	var colorString_2 = colorString.get;

	var conversions = createCommonjsModule(function (module) {
	/* MIT license */


	// NOTE: conversions should only return primitive values (i.e. arrays, or
	//       values that give correct `typeof` results).
	//       do not use box values types (i.e. Number(), String(), etc.)

	var reverseKeywords = {};
	for (var key in colorName) {
		if (colorName.hasOwnProperty(key)) {
			reverseKeywords[colorName[key]] = key;
		}
	}

	var convert = module.exports = {
		rgb: {channels: 3, labels: 'rgb'},
		hsl: {channels: 3, labels: 'hsl'},
		hsv: {channels: 3, labels: 'hsv'},
		hwb: {channels: 3, labels: 'hwb'},
		cmyk: {channels: 4, labels: 'cmyk'},
		xyz: {channels: 3, labels: 'xyz'},
		lab: {channels: 3, labels: 'lab'},
		lch: {channels: 3, labels: 'lch'},
		hex: {channels: 1, labels: ['hex']},
		keyword: {channels: 1, labels: ['keyword']},
		ansi16: {channels: 1, labels: ['ansi16']},
		ansi256: {channels: 1, labels: ['ansi256']},
		hcg: {channels: 3, labels: ['h', 'c', 'g']},
		apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
		gray: {channels: 1, labels: ['gray']}
	};

	// hide .channels and .labels properties
	for (var model in convert) {
		if (convert.hasOwnProperty(model)) {
			if (!('channels' in convert[model])) {
				throw new Error('missing channels property: ' + model);
			}

			if (!('labels' in convert[model])) {
				throw new Error('missing channel labels property: ' + model);
			}

			if (convert[model].labels.length !== convert[model].channels) {
				throw new Error('channel and label counts mismatch: ' + model);
			}

			var channels = convert[model].channels;
			var labels = convert[model].labels;
			delete convert[model].channels;
			delete convert[model].labels;
			Object.defineProperty(convert[model], 'channels', {value: channels});
			Object.defineProperty(convert[model], 'labels', {value: labels});
		}
	}

	convert.rgb.hsl = function (rgb) {
		var r = rgb[0] / 255;
		var g = rgb[1] / 255;
		var b = rgb[2] / 255;
		var min = Math.min(r, g, b);
		var max = Math.max(r, g, b);
		var delta = max - min;
		var h;
		var s;
		var l;

		if (max === min) {
			h = 0;
		} else if (r === max) {
			h = (g - b) / delta;
		} else if (g === max) {
			h = 2 + (b - r) / delta;
		} else if (b === max) {
			h = 4 + (r - g) / delta;
		}

		h = Math.min(h * 60, 360);

		if (h < 0) {
			h += 360;
		}

		l = (min + max) / 2;

		if (max === min) {
			s = 0;
		} else if (l <= 0.5) {
			s = delta / (max + min);
		} else {
			s = delta / (2 - max - min);
		}

		return [h, s * 100, l * 100];
	};

	convert.rgb.hsv = function (rgb) {
		var rdif;
		var gdif;
		var bdif;
		var h;
		var s;

		var r = rgb[0] / 255;
		var g = rgb[1] / 255;
		var b = rgb[2] / 255;
		var v = Math.max(r, g, b);
		var diff = v - Math.min(r, g, b);
		var diffc = function (c) {
			return (v - c) / 6 / diff + 1 / 2;
		};

		if (diff === 0) {
			h = s = 0;
		} else {
			s = diff / v;
			rdif = diffc(r);
			gdif = diffc(g);
			bdif = diffc(b);

			if (r === v) {
				h = bdif - gdif;
			} else if (g === v) {
				h = (1 / 3) + rdif - bdif;
			} else if (b === v) {
				h = (2 / 3) + gdif - rdif;
			}
			if (h < 0) {
				h += 1;
			} else if (h > 1) {
				h -= 1;
			}
		}

		return [
			h * 360,
			s * 100,
			v * 100
		];
	};

	convert.rgb.hwb = function (rgb) {
		var r = rgb[0];
		var g = rgb[1];
		var b = rgb[2];
		var h = convert.rgb.hsl(rgb)[0];
		var w = 1 / 255 * Math.min(r, Math.min(g, b));

		b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

		return [h, w * 100, b * 100];
	};

	convert.rgb.cmyk = function (rgb) {
		var r = rgb[0] / 255;
		var g = rgb[1] / 255;
		var b = rgb[2] / 255;
		var c;
		var m;
		var y;
		var k;

		k = Math.min(1 - r, 1 - g, 1 - b);
		c = (1 - r - k) / (1 - k) || 0;
		m = (1 - g - k) / (1 - k) || 0;
		y = (1 - b - k) / (1 - k) || 0;

		return [c * 100, m * 100, y * 100, k * 100];
	};

	/**
	 * See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
	 * */
	function comparativeDistance(x, y) {
		return (
			Math.pow(x[0] - y[0], 2) +
			Math.pow(x[1] - y[1], 2) +
			Math.pow(x[2] - y[2], 2)
		);
	}

	convert.rgb.keyword = function (rgb) {
		var reversed = reverseKeywords[rgb];
		if (reversed) {
			return reversed;
		}

		var currentClosestDistance = Infinity;
		var currentClosestKeyword;

		for (var keyword in colorName) {
			if (colorName.hasOwnProperty(keyword)) {
				var value = colorName[keyword];

				// Compute comparative distance
				var distance = comparativeDistance(rgb, value);

				// Check if its less, if so set as closest
				if (distance < currentClosestDistance) {
					currentClosestDistance = distance;
					currentClosestKeyword = keyword;
				}
			}
		}

		return currentClosestKeyword;
	};

	convert.keyword.rgb = function (keyword) {
		return colorName[keyword];
	};

	convert.rgb.xyz = function (rgb) {
		var r = rgb[0] / 255;
		var g = rgb[1] / 255;
		var b = rgb[2] / 255;

		// assume sRGB
		r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
		g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
		b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

		var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
		var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
		var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

		return [x * 100, y * 100, z * 100];
	};

	convert.rgb.lab = function (rgb) {
		var xyz = convert.rgb.xyz(rgb);
		var x = xyz[0];
		var y = xyz[1];
		var z = xyz[2];
		var l;
		var a;
		var b;

		x /= 95.047;
		y /= 100;
		z /= 108.883;

		x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
		y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
		z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

		l = (116 * y) - 16;
		a = 500 * (x - y);
		b = 200 * (y - z);

		return [l, a, b];
	};

	convert.hsl.rgb = function (hsl) {
		var h = hsl[0] / 360;
		var s = hsl[1] / 100;
		var l = hsl[2] / 100;
		var t1;
		var t2;
		var t3;
		var rgb;
		var val;

		if (s === 0) {
			val = l * 255;
			return [val, val, val];
		}

		if (l < 0.5) {
			t2 = l * (1 + s);
		} else {
			t2 = l + s - l * s;
		}

		t1 = 2 * l - t2;

		rgb = [0, 0, 0];
		for (var i = 0; i < 3; i++) {
			t3 = h + 1 / 3 * -(i - 1);
			if (t3 < 0) {
				t3++;
			}
			if (t3 > 1) {
				t3--;
			}

			if (6 * t3 < 1) {
				val = t1 + (t2 - t1) * 6 * t3;
			} else if (2 * t3 < 1) {
				val = t2;
			} else if (3 * t3 < 2) {
				val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
			} else {
				val = t1;
			}

			rgb[i] = val * 255;
		}

		return rgb;
	};

	convert.hsl.hsv = function (hsl) {
		var h = hsl[0];
		var s = hsl[1] / 100;
		var l = hsl[2] / 100;
		var smin = s;
		var lmin = Math.max(l, 0.01);
		var sv;
		var v;

		l *= 2;
		s *= (l <= 1) ? l : 2 - l;
		smin *= lmin <= 1 ? lmin : 2 - lmin;
		v = (l + s) / 2;
		sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

		return [h, sv * 100, v * 100];
	};

	convert.hsv.rgb = function (hsv) {
		var h = hsv[0] / 60;
		var s = hsv[1] / 100;
		var v = hsv[2] / 100;
		var hi = Math.floor(h) % 6;

		var f = h - Math.floor(h);
		var p = 255 * v * (1 - s);
		var q = 255 * v * (1 - (s * f));
		var t = 255 * v * (1 - (s * (1 - f)));
		v *= 255;

		switch (hi) {
			case 0:
				return [v, t, p];
			case 1:
				return [q, v, p];
			case 2:
				return [p, v, t];
			case 3:
				return [p, q, v];
			case 4:
				return [t, p, v];
			case 5:
				return [v, p, q];
		}
	};

	convert.hsv.hsl = function (hsv) {
		var h = hsv[0];
		var s = hsv[1] / 100;
		var v = hsv[2] / 100;
		var vmin = Math.max(v, 0.01);
		var lmin;
		var sl;
		var l;

		l = (2 - s) * v;
		lmin = (2 - s) * vmin;
		sl = s * vmin;
		sl /= (lmin <= 1) ? lmin : 2 - lmin;
		sl = sl || 0;
		l /= 2;

		return [h, sl * 100, l * 100];
	};

	// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
	convert.hwb.rgb = function (hwb) {
		var h = hwb[0] / 360;
		var wh = hwb[1] / 100;
		var bl = hwb[2] / 100;
		var ratio = wh + bl;
		var i;
		var v;
		var f;
		var n;

		// wh + bl cant be > 1
		if (ratio > 1) {
			wh /= ratio;
			bl /= ratio;
		}

		i = Math.floor(6 * h);
		v = 1 - bl;
		f = 6 * h - i;

		if ((i & 0x01) !== 0) {
			f = 1 - f;
		}

		n = wh + f * (v - wh); // linear interpolation

		var r;
		var g;
		var b;
		switch (i) {
			default:
			case 6:
			case 0: r = v; g = n; b = wh; break;
			case 1: r = n; g = v; b = wh; break;
			case 2: r = wh; g = v; b = n; break;
			case 3: r = wh; g = n; b = v; break;
			case 4: r = n; g = wh; b = v; break;
			case 5: r = v; g = wh; b = n; break;
		}

		return [r * 255, g * 255, b * 255];
	};

	convert.cmyk.rgb = function (cmyk) {
		var c = cmyk[0] / 100;
		var m = cmyk[1] / 100;
		var y = cmyk[2] / 100;
		var k = cmyk[3] / 100;
		var r;
		var g;
		var b;

		r = 1 - Math.min(1, c * (1 - k) + k);
		g = 1 - Math.min(1, m * (1 - k) + k);
		b = 1 - Math.min(1, y * (1 - k) + k);

		return [r * 255, g * 255, b * 255];
	};

	convert.xyz.rgb = function (xyz) {
		var x = xyz[0] / 100;
		var y = xyz[1] / 100;
		var z = xyz[2] / 100;
		var r;
		var g;
		var b;

		r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
		g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
		b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

		// assume sRGB
		r = r > 0.0031308
			? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
			: r * 12.92;

		g = g > 0.0031308
			? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
			: g * 12.92;

		b = b > 0.0031308
			? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
			: b * 12.92;

		r = Math.min(Math.max(0, r), 1);
		g = Math.min(Math.max(0, g), 1);
		b = Math.min(Math.max(0, b), 1);

		return [r * 255, g * 255, b * 255];
	};

	convert.xyz.lab = function (xyz) {
		var x = xyz[0];
		var y = xyz[1];
		var z = xyz[2];
		var l;
		var a;
		var b;

		x /= 95.047;
		y /= 100;
		z /= 108.883;

		x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
		y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
		z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

		l = (116 * y) - 16;
		a = 500 * (x - y);
		b = 200 * (y - z);

		return [l, a, b];
	};

	convert.lab.xyz = function (lab) {
		var l = lab[0];
		var a = lab[1];
		var b = lab[2];
		var x;
		var y;
		var z;

		y = (l + 16) / 116;
		x = a / 500 + y;
		z = y - b / 200;

		var y2 = Math.pow(y, 3);
		var x2 = Math.pow(x, 3);
		var z2 = Math.pow(z, 3);
		y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
		x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
		z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

		x *= 95.047;
		y *= 100;
		z *= 108.883;

		return [x, y, z];
	};

	convert.lab.lch = function (lab) {
		var l = lab[0];
		var a = lab[1];
		var b = lab[2];
		var hr;
		var h;
		var c;

		hr = Math.atan2(b, a);
		h = hr * 360 / 2 / Math.PI;

		if (h < 0) {
			h += 360;
		}

		c = Math.sqrt(a * a + b * b);

		return [l, c, h];
	};

	convert.lch.lab = function (lch) {
		var l = lch[0];
		var c = lch[1];
		var h = lch[2];
		var a;
		var b;
		var hr;

		hr = h / 360 * 2 * Math.PI;
		a = c * Math.cos(hr);
		b = c * Math.sin(hr);

		return [l, a, b];
	};

	convert.rgb.ansi16 = function (args) {
		var r = args[0];
		var g = args[1];
		var b = args[2];
		var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2]; // hsv -> ansi16 optimization

		value = Math.round(value / 50);

		if (value === 0) {
			return 30;
		}

		var ansi = 30
			+ ((Math.round(b / 255) << 2)
			| (Math.round(g / 255) << 1)
			| Math.round(r / 255));

		if (value === 2) {
			ansi += 60;
		}

		return ansi;
	};

	convert.hsv.ansi16 = function (args) {
		// optimization here; we already know the value and don't need to get
		// it converted for us.
		return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
	};

	convert.rgb.ansi256 = function (args) {
		var r = args[0];
		var g = args[1];
		var b = args[2];

		// we use the extended greyscale palette here, with the exception of
		// black and white. normal palette only has 4 greyscale shades.
		if (r === g && g === b) {
			if (r < 8) {
				return 16;
			}

			if (r > 248) {
				return 231;
			}

			return Math.round(((r - 8) / 247) * 24) + 232;
		}

		var ansi = 16
			+ (36 * Math.round(r / 255 * 5))
			+ (6 * Math.round(g / 255 * 5))
			+ Math.round(b / 255 * 5);

		return ansi;
	};

	convert.ansi16.rgb = function (args) {
		var color = args % 10;

		// handle greyscale
		if (color === 0 || color === 7) {
			if (args > 50) {
				color += 3.5;
			}

			color = color / 10.5 * 255;

			return [color, color, color];
		}

		var mult = (~~(args > 50) + 1) * 0.5;
		var r = ((color & 1) * mult) * 255;
		var g = (((color >> 1) & 1) * mult) * 255;
		var b = (((color >> 2) & 1) * mult) * 255;

		return [r, g, b];
	};

	convert.ansi256.rgb = function (args) {
		// handle greyscale
		if (args >= 232) {
			var c = (args - 232) * 10 + 8;
			return [c, c, c];
		}

		args -= 16;

		var rem;
		var r = Math.floor(args / 36) / 5 * 255;
		var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
		var b = (rem % 6) / 5 * 255;

		return [r, g, b];
	};

	convert.rgb.hex = function (args) {
		var integer = ((Math.round(args[0]) & 0xFF) << 16)
			+ ((Math.round(args[1]) & 0xFF) << 8)
			+ (Math.round(args[2]) & 0xFF);

		var string = integer.toString(16).toUpperCase();
		return '000000'.substring(string.length) + string;
	};

	convert.hex.rgb = function (args) {
		var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
		if (!match) {
			return [0, 0, 0];
		}

		var colorString = match[0];

		if (match[0].length === 3) {
			colorString = colorString.split('').map(function (char) {
				return char + char;
			}).join('');
		}

		var integer = parseInt(colorString, 16);
		var r = (integer >> 16) & 0xFF;
		var g = (integer >> 8) & 0xFF;
		var b = integer & 0xFF;

		return [r, g, b];
	};

	convert.rgb.hcg = function (rgb) {
		var r = rgb[0] / 255;
		var g = rgb[1] / 255;
		var b = rgb[2] / 255;
		var max = Math.max(Math.max(r, g), b);
		var min = Math.min(Math.min(r, g), b);
		var chroma = (max - min);
		var grayscale;
		var hue;

		if (chroma < 1) {
			grayscale = min / (1 - chroma);
		} else {
			grayscale = 0;
		}

		if (chroma <= 0) {
			hue = 0;
		} else
		if (max === r) {
			hue = ((g - b) / chroma) % 6;
		} else
		if (max === g) {
			hue = 2 + (b - r) / chroma;
		} else {
			hue = 4 + (r - g) / chroma + 4;
		}

		hue /= 6;
		hue %= 1;

		return [hue * 360, chroma * 100, grayscale * 100];
	};

	convert.hsl.hcg = function (hsl) {
		var s = hsl[1] / 100;
		var l = hsl[2] / 100;
		var c = 1;
		var f = 0;

		if (l < 0.5) {
			c = 2.0 * s * l;
		} else {
			c = 2.0 * s * (1.0 - l);
		}

		if (c < 1.0) {
			f = (l - 0.5 * c) / (1.0 - c);
		}

		return [hsl[0], c * 100, f * 100];
	};

	convert.hsv.hcg = function (hsv) {
		var s = hsv[1] / 100;
		var v = hsv[2] / 100;

		var c = s * v;
		var f = 0;

		if (c < 1.0) {
			f = (v - c) / (1 - c);
		}

		return [hsv[0], c * 100, f * 100];
	};

	convert.hcg.rgb = function (hcg) {
		var h = hcg[0] / 360;
		var c = hcg[1] / 100;
		var g = hcg[2] / 100;

		if (c === 0.0) {
			return [g * 255, g * 255, g * 255];
		}

		var pure = [0, 0, 0];
		var hi = (h % 1) * 6;
		var v = hi % 1;
		var w = 1 - v;
		var mg = 0;

		switch (Math.floor(hi)) {
			case 0:
				pure[0] = 1; pure[1] = v; pure[2] = 0; break;
			case 1:
				pure[0] = w; pure[1] = 1; pure[2] = 0; break;
			case 2:
				pure[0] = 0; pure[1] = 1; pure[2] = v; break;
			case 3:
				pure[0] = 0; pure[1] = w; pure[2] = 1; break;
			case 4:
				pure[0] = v; pure[1] = 0; pure[2] = 1; break;
			default:
				pure[0] = 1; pure[1] = 0; pure[2] = w;
		}

		mg = (1.0 - c) * g;

		return [
			(c * pure[0] + mg) * 255,
			(c * pure[1] + mg) * 255,
			(c * pure[2] + mg) * 255
		];
	};

	convert.hcg.hsv = function (hcg) {
		var c = hcg[1] / 100;
		var g = hcg[2] / 100;

		var v = c + g * (1.0 - c);
		var f = 0;

		if (v > 0.0) {
			f = c / v;
		}

		return [hcg[0], f * 100, v * 100];
	};

	convert.hcg.hsl = function (hcg) {
		var c = hcg[1] / 100;
		var g = hcg[2] / 100;

		var l = g * (1.0 - c) + 0.5 * c;
		var s = 0;

		if (l > 0.0 && l < 0.5) {
			s = c / (2 * l);
		} else
		if (l >= 0.5 && l < 1.0) {
			s = c / (2 * (1 - l));
		}

		return [hcg[0], s * 100, l * 100];
	};

	convert.hcg.hwb = function (hcg) {
		var c = hcg[1] / 100;
		var g = hcg[2] / 100;
		var v = c + g * (1.0 - c);
		return [hcg[0], (v - c) * 100, (1 - v) * 100];
	};

	convert.hwb.hcg = function (hwb) {
		var w = hwb[1] / 100;
		var b = hwb[2] / 100;
		var v = 1 - b;
		var c = v - w;
		var g = 0;

		if (c < 1) {
			g = (v - c) / (1 - c);
		}

		return [hwb[0], c * 100, g * 100];
	};

	convert.apple.rgb = function (apple) {
		return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
	};

	convert.rgb.apple = function (rgb) {
		return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
	};

	convert.gray.rgb = function (args) {
		return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
	};

	convert.gray.hsl = convert.gray.hsv = function (args) {
		return [0, 0, args[0]];
	};

	convert.gray.hwb = function (gray) {
		return [0, 100, gray[0]];
	};

	convert.gray.cmyk = function (gray) {
		return [0, 0, 0, gray[0]];
	};

	convert.gray.lab = function (gray) {
		return [gray[0], 0, 0];
	};

	convert.gray.hex = function (gray) {
		var val = Math.round(gray[0] / 100 * 255) & 0xFF;
		var integer = (val << 16) + (val << 8) + val;

		var string = integer.toString(16).toUpperCase();
		return '000000'.substring(string.length) + string;
	};

	convert.rgb.gray = function (rgb) {
		var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
		return [val / 255 * 100];
	};
	});
	var conversions_1 = conversions.rgb;
	var conversions_2 = conversions.hsl;
	var conversions_3 = conversions.hsv;
	var conversions_4 = conversions.hwb;
	var conversions_5 = conversions.cmyk;
	var conversions_6 = conversions.xyz;
	var conversions_7 = conversions.lab;
	var conversions_8 = conversions.lch;
	var conversions_9 = conversions.hex;
	var conversions_10 = conversions.keyword;
	var conversions_11 = conversions.ansi16;
	var conversions_12 = conversions.ansi256;
	var conversions_13 = conversions.hcg;
	var conversions_14 = conversions.apple;
	var conversions_15 = conversions.gray;

	/*
		this function routes a model to all other models.

		all functions that are routed have a property `.conversion` attached
		to the returned synthetic function. This property is an array
		of strings, each with the steps in between the 'from' and 'to'
		color models (inclusive).

		conversions that are not possible simply are not included.
	*/

	function buildGraph() {
		var graph = {};
		// https://jsperf.com/object-keys-vs-for-in-with-closure/3
		var models = Object.keys(conversions);

		for (var len = models.length, i = 0; i < len; i++) {
			graph[models[i]] = {
				// http://jsperf.com/1-vs-infinity
				// micro-opt, but this is simple.
				distance: -1,
				parent: null
			};
		}

		return graph;
	}

	// https://en.wikipedia.org/wiki/Breadth-first_search
	function deriveBFS(fromModel) {
		var graph = buildGraph();
		var queue = [fromModel]; // unshift -> queue -> pop

		graph[fromModel].distance = 0;

		while (queue.length) {
			var current = queue.pop();
			var adjacents = Object.keys(conversions[current]);

			for (var len = adjacents.length, i = 0; i < len; i++) {
				var adjacent = adjacents[i];
				var node = graph[adjacent];

				if (node.distance === -1) {
					node.distance = graph[current].distance + 1;
					node.parent = current;
					queue.unshift(adjacent);
				}
			}
		}

		return graph;
	}

	function link(from, to) {
		return function (args) {
			return to(from(args));
		};
	}

	function wrapConversion(toModel, graph) {
		var path = [graph[toModel].parent, toModel];
		var fn = conversions[graph[toModel].parent][toModel];

		var cur = graph[toModel].parent;
		while (graph[cur].parent) {
			path.unshift(graph[cur].parent);
			fn = link(conversions[graph[cur].parent][cur], fn);
			cur = graph[cur].parent;
		}

		fn.conversion = path;
		return fn;
	}

	var route = function (fromModel) {
		var graph = deriveBFS(fromModel);
		var conversion = {};

		var models = Object.keys(graph);
		for (var len = models.length, i = 0; i < len; i++) {
			var toModel = models[i];
			var node = graph[toModel];

			if (node.parent === null) {
				// no possible conversion, or this node is the source model.
				continue;
			}

			conversion[toModel] = wrapConversion(toModel, graph);
		}

		return conversion;
	};

	var convert = {};

	var models = Object.keys(conversions);

	function wrapRaw(fn) {
		var wrappedFn = function (args) {
			if (args === undefined || args === null) {
				return args;
			}

			if (arguments.length > 1) {
				args = Array.prototype.slice.call(arguments);
			}

			return fn(args);
		};

		// preserve .conversion property if there is one
		if ('conversion' in fn) {
			wrappedFn.conversion = fn.conversion;
		}

		return wrappedFn;
	}

	function wrapRounded(fn) {
		var wrappedFn = function (args) {
			if (args === undefined || args === null) {
				return args;
			}

			if (arguments.length > 1) {
				args = Array.prototype.slice.call(arguments);
			}

			var result = fn(args);

			// we're assuming the result is an array here.
			// see notice in conversions.js; don't use box types
			// in conversion functions.
			if (typeof result === 'object') {
				for (var len = result.length, i = 0; i < len; i++) {
					result[i] = Math.round(result[i]);
				}
			}

			return result;
		};

		// preserve .conversion property if there is one
		if ('conversion' in fn) {
			wrappedFn.conversion = fn.conversion;
		}

		return wrappedFn;
	}

	models.forEach(function (fromModel) {
		convert[fromModel] = {};

		Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
		Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

		var routes = route(fromModel);
		var routeModels = Object.keys(routes);

		routeModels.forEach(function (toModel) {
			var fn = routes[toModel];

			convert[fromModel][toModel] = wrapRounded(fn);
			convert[fromModel][toModel].raw = wrapRaw(fn);
		});
	});

	var colorConvert = convert;

	var _slice = [].slice;

	var skippedModels = [
		// to be honest, I don't really feel like keyword belongs in color convert, but eh.
		'keyword',

		// gray conflicts with some method names, and has its own method defined.
		'gray',

		// shouldn't really be in color-convert either...
		'hex'
	];

	var hashedModelKeys = {};
	Object.keys(colorConvert).forEach(function (model) {
		hashedModelKeys[_slice.call(colorConvert[model].labels).sort().join('')] = model;
	});

	var limiters = {};

	function Color(obj, model) {
		if (!(this instanceof Color)) {
			return new Color(obj, model);
		}

		if (model && model in skippedModels) {
			model = null;
		}

		if (model && !(model in colorConvert)) {
			throw new Error('Unknown model: ' + model);
		}

		var i;
		var channels;

		if (!obj) {
			this.model = 'rgb';
			this.color = [0, 0, 0];
			this.valpha = 1;
		} else if (obj instanceof Color) {
			this.model = obj.model;
			this.color = obj.color.slice();
			this.valpha = obj.valpha;
		} else if (typeof obj === 'string') {
			var result = colorString.get(obj);
			if (result === null) {
				throw new Error('Unable to parse color from string: ' + obj);
			}

			this.model = result.model;
			channels = colorConvert[this.model].channels;
			this.color = result.value.slice(0, channels);
			this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
		} else if (obj.length) {
			this.model = model || 'rgb';
			channels = colorConvert[this.model].channels;
			var newArr = _slice.call(obj, 0, channels);
			this.color = zeroArray(newArr, channels);
			this.valpha = typeof obj[channels] === 'number' ? obj[channels] : 1;
		} else if (typeof obj === 'number') {
			// this is always RGB - can be converted later on.
			obj &= 0xFFFFFF;
			this.model = 'rgb';
			this.color = [
				(obj >> 16) & 0xFF,
				(obj >> 8) & 0xFF,
				obj & 0xFF
			];
			this.valpha = 1;
		} else {
			this.valpha = 1;

			var keys = Object.keys(obj);
			if ('alpha' in obj) {
				keys.splice(keys.indexOf('alpha'), 1);
				this.valpha = typeof obj.alpha === 'number' ? obj.alpha : 0;
			}

			var hashedKeys = keys.sort().join('');
			if (!(hashedKeys in hashedModelKeys)) {
				throw new Error('Unable to parse color from object: ' + JSON.stringify(obj));
			}

			this.model = hashedModelKeys[hashedKeys];

			var labels = colorConvert[this.model].labels;
			var color = [];
			for (i = 0; i < labels.length; i++) {
				color.push(obj[labels[i]]);
			}

			this.color = zeroArray(color);
		}

		// perform limitations (clamping, etc.)
		if (limiters[this.model]) {
			channels = colorConvert[this.model].channels;
			for (i = 0; i < channels; i++) {
				var limit = limiters[this.model][i];
				if (limit) {
					this.color[i] = limit(this.color[i]);
				}
			}
		}

		this.valpha = Math.max(0, Math.min(1, this.valpha));

		if (Object.freeze) {
			Object.freeze(this);
		}
	}

	Color.prototype = {
		toString: function () {
			return this.string();
		},

		toJSON: function () {
			return this[this.model]();
		},

		string: function (places) {
			var self = this.model in colorString.to ? this : this.rgb();
			self = self.round(typeof places === 'number' ? places : 1);
			var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
			return colorString.to[self.model](args);
		},

		percentString: function (places) {
			var self = this.rgb().round(typeof places === 'number' ? places : 1);
			var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
			return colorString.to.rgb.percent(args);
		},

		array: function () {
			return this.valpha === 1 ? this.color.slice() : this.color.concat(this.valpha);
		},

		object: function () {
			var result = {};
			var channels = colorConvert[this.model].channels;
			var labels = colorConvert[this.model].labels;

			for (var i = 0; i < channels; i++) {
				result[labels[i]] = this.color[i];
			}

			if (this.valpha !== 1) {
				result.alpha = this.valpha;
			}

			return result;
		},

		unitArray: function () {
			var rgb = this.rgb().color;
			rgb[0] /= 255;
			rgb[1] /= 255;
			rgb[2] /= 255;

			if (this.valpha !== 1) {
				rgb.push(this.valpha);
			}

			return rgb;
		},

		unitObject: function () {
			var rgb = this.rgb().object();
			rgb.r /= 255;
			rgb.g /= 255;
			rgb.b /= 255;

			if (this.valpha !== 1) {
				rgb.alpha = this.valpha;
			}

			return rgb;
		},

		round: function (places) {
			places = Math.max(places || 0, 0);
			return new Color(this.color.map(roundToPlace(places)).concat(this.valpha), this.model);
		},

		alpha: function (val) {
			if (arguments.length) {
				return new Color(this.color.concat(Math.max(0, Math.min(1, val))), this.model);
			}

			return this.valpha;
		},

		// rgb
		red: getset('rgb', 0, maxfn(255)),
		green: getset('rgb', 1, maxfn(255)),
		blue: getset('rgb', 2, maxfn(255)),

		hue: getset(['hsl', 'hsv', 'hsl', 'hwb', 'hcg'], 0, function (val) { return ((val % 360) + 360) % 360; }), // eslint-disable-line brace-style

		saturationl: getset('hsl', 1, maxfn(100)),
		lightness: getset('hsl', 2, maxfn(100)),

		saturationv: getset('hsv', 1, maxfn(100)),
		value: getset('hsv', 2, maxfn(100)),

		chroma: getset('hcg', 1, maxfn(100)),
		gray: getset('hcg', 2, maxfn(100)),

		white: getset('hwb', 1, maxfn(100)),
		wblack: getset('hwb', 2, maxfn(100)),

		cyan: getset('cmyk', 0, maxfn(100)),
		magenta: getset('cmyk', 1, maxfn(100)),
		yellow: getset('cmyk', 2, maxfn(100)),
		black: getset('cmyk', 3, maxfn(100)),

		x: getset('xyz', 0, maxfn(100)),
		y: getset('xyz', 1, maxfn(100)),
		z: getset('xyz', 2, maxfn(100)),

		l: getset('lab', 0, maxfn(100)),
		a: getset('lab', 1),
		b: getset('lab', 2),

		keyword: function (val) {
			if (arguments.length) {
				return new Color(val);
			}

			return colorConvert[this.model].keyword(this.color);
		},

		hex: function (val) {
			if (arguments.length) {
				return new Color(val);
			}

			return colorString.to.hex(this.rgb().round().color);
		},

		rgbNumber: function () {
			var rgb = this.rgb().color;
			return ((rgb[0] & 0xFF) << 16) | ((rgb[1] & 0xFF) << 8) | (rgb[2] & 0xFF);
		},

		luminosity: function () {
			// http://www.w3.org/TR/WCAG20/#relativeluminancedef
			var rgb = this.rgb().color;

			var lum = [];
			for (var i = 0; i < rgb.length; i++) {
				var chan = rgb[i] / 255;
				lum[i] = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4);
			}

			return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
		},

		contrast: function (color2) {
			// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
			var lum1 = this.luminosity();
			var lum2 = color2.luminosity();

			if (lum1 > lum2) {
				return (lum1 + 0.05) / (lum2 + 0.05);
			}

			return (lum2 + 0.05) / (lum1 + 0.05);
		},

		level: function (color2) {
			var contrastRatio = this.contrast(color2);
			if (contrastRatio >= 7.1) {
				return 'AAA';
			}

			return (contrastRatio >= 4.5) ? 'AA' : '';
		},

		isDark: function () {
			// YIQ equation from http://24ways.org/2010/calculating-color-contrast
			var rgb = this.rgb().color;
			var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
			return yiq < 128;
		},

		isLight: function () {
			return !this.isDark();
		},

		negate: function () {
			var rgb = this.rgb();
			for (var i = 0; i < 3; i++) {
				rgb.color[i] = 255 - rgb.color[i];
			}
			return rgb;
		},

		lighten: function (ratio) {
			var hsl = this.hsl();
			hsl.color[2] += hsl.color[2] * ratio;
			return hsl;
		},

		darken: function (ratio) {
			var hsl = this.hsl();
			hsl.color[2] -= hsl.color[2] * ratio;
			return hsl;
		},

		saturate: function (ratio) {
			var hsl = this.hsl();
			hsl.color[1] += hsl.color[1] * ratio;
			return hsl;
		},

		desaturate: function (ratio) {
			var hsl = this.hsl();
			hsl.color[1] -= hsl.color[1] * ratio;
			return hsl;
		},

		whiten: function (ratio) {
			var hwb = this.hwb();
			hwb.color[1] += hwb.color[1] * ratio;
			return hwb;
		},

		blacken: function (ratio) {
			var hwb = this.hwb();
			hwb.color[2] += hwb.color[2] * ratio;
			return hwb;
		},

		grayscale: function () {
			// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
			var rgb = this.rgb().color;
			var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
			return Color.rgb(val, val, val);
		},

		fade: function (ratio) {
			return this.alpha(this.valpha - (this.valpha * ratio));
		},

		opaquer: function (ratio) {
			return this.alpha(this.valpha + (this.valpha * ratio));
		},

		rotate: function (degrees) {
			var hsl = this.hsl();
			var hue = hsl.color[0];
			hue = (hue + degrees) % 360;
			hue = hue < 0 ? 360 + hue : hue;
			hsl.color[0] = hue;
			return hsl;
		},

		mix: function (mixinColor, weight) {
			// ported from sass implementation in C
			// https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
			var color1 = mixinColor.rgb();
			var color2 = this.rgb();
			var p = weight === undefined ? 0.5 : weight;

			var w = 2 * p - 1;
			var a = color1.alpha() - color2.alpha();

			var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
			var w2 = 1 - w1;

			return Color.rgb(
					w1 * color1.red() + w2 * color2.red(),
					w1 * color1.green() + w2 * color2.green(),
					w1 * color1.blue() + w2 * color2.blue(),
					color1.alpha() * p + color2.alpha() * (1 - p));
		}
	};

	// model conversion methods and static constructors
	Object.keys(colorConvert).forEach(function (model) {
		if (skippedModels.indexOf(model) !== -1) {
			return;
		}

		var channels = colorConvert[model].channels;

		// conversion methods
		Color.prototype[model] = function () {
			if (this.model === model) {
				return new Color(this);
			}

			if (arguments.length) {
				return new Color(arguments, model);
			}

			var newAlpha = typeof arguments[channels] === 'number' ? channels : this.valpha;
			return new Color(assertArray(colorConvert[this.model][model].raw(this.color)).concat(newAlpha), model);
		};

		// 'static' construction methods
		Color[model] = function (color) {
			if (typeof color === 'number') {
				color = zeroArray(_slice.call(arguments), channels);
			}
			return new Color(color, model);
		};
	});

	function roundTo(num, places) {
		return Number(num.toFixed(places));
	}

	function roundToPlace(places) {
		return function (num) {
			return roundTo(num, places);
		};
	}

	function getset(model, channel, modifier) {
		model = Array.isArray(model) ? model : [model];

		model.forEach(function (m) {
			(limiters[m] || (limiters[m] = []))[channel] = modifier;
		});

		model = model[0];

		return function (val) {
			var result;

			if (arguments.length) {
				if (modifier) {
					val = modifier(val);
				}

				result = this[model]();
				result.color[channel] = val;
				return result;
			}

			result = this[model]().color[channel];
			if (modifier) {
				result = modifier(result);
			}

			return result;
		};
	}

	function maxfn(max) {
		return function (v) {
			return Math.max(0, Math.min(max, v));
		};
	}

	function assertArray(val) {
		return Array.isArray(val) ? val : [val];
	}

	function zeroArray(arr, length) {
		for (var i = 0; i < length; i++) {
			if (typeof arr[i] !== 'number') {
				arr[i] = 0;
			}
		}

		return arr;
	}

	var color = Color;

	var xkcd = [["AcidGreen",{"h":87,"s":99,"l":52}],["Adobe",{"h":18,"s":47,"l":51}],["Algae",{"h":134,"s":35,"l":50}],["AlgaeGreen",{"h":149,"s":71,"l":45}],["AlmostBlack",{"h":180,"s":30,"l":4}],["Amber",{"h":42,"s":99,"l":51}],["Amethyst",{"h":277,"s":43,"l":56}],["Apple",{"h":99,"s":58,"l":52}],["AppleGreen",{"h":91,"s":69,"l":48}],["Apricot",{"h":28,"s":100,"l":71}],["Aqua",{"h":171,"s":85,"l":50}],["AquaBlue",{"h":184,"s":98,"l":46}],["AquaGreen",{"h":157,"s":85,"l":48}],["AquaMarine",{"h":165,"s":80,"l":55}],["Aquamarine",{"h":169,"s":96,"l":43}],["ArmyGreen",{"h":75,"s":62,"l":23}],["Asparagus",{"h":97,"s":34,"l":50}],["Aubergine",{"h":310,"s":79,"l":13}],["Auburn",{"h":18,"s":99,"l":30}],["Avocado",{"h":76,"s":55,"l":45}],["AvocadoGreen",{"h":75,"s":67,"l":40}],["Azul",{"h":221,"s":84,"l":52}],["Azure",{"h":203,"s":95,"l":49}],["BabyBlue",{"h":211,"s":98,"l":82}],["BabyGreen",{"h":129,"s":100,"l":77}],["BabyPink",{"h":341,"s":100,"l":86}],["BabyPoo",{"h":50,"s":95,"l":34}],["BabyPoop",{"h":51,"s":100,"l":29}],["BabyPoopGreen",{"h":64,"s":94,"l":31}],["BabyPukeGreen",{"h":64,"s":94,"l":40}],["BabyPurple",{"h":271,"s":85,"l":79}],["BabyShitBrown",{"h":49,"s":86,"l":36}],["BabyShitGreen",{"h":67,"s":74,"l":34}],["Banana",{"h":60,"s":100,"l":75}],["BananaYellow",{"h":61,"s":99,"l":65}],["BarbiePink",{"h":329,"s":99,"l":64}],["BarfGreen",{"h":68,"s":98,"l":34}],["Barney",{"h":295,"s":73,"l":42}],["BarneyPurple",{"h":303,"s":95,"l":32}],["BattleshipGrey",{"h":201,"s":11,"l":47}],["Beige",{"h":49,"s":56,"l":78}],["Berry",{"h":334,"s":82,"l":33}],["Bile",{"h":64,"s":94,"l":39}],["Black",{"h":0,"s":0,"l":0}],["Bland",{"h":48,"s":18,"l":62}],["Blood",{"h":359,"s":100,"l":23}],["BloodOrange",{"h":17,"s":99,"l":50}],["BloodRed",{"h":359,"s":100,"l":30}],["Blue",{"h":164,"s":99,"l":38}],["Blue",{"h":223,"s":97,"l":44}],["Blue",{"h":204,"s":17,"l":47}],["Blue",{"h":261,"s":73,"l":47}],["BlueBlue",{"h":228,"s":71,"l":46}],["BlueGreen",{"h":170,"s":74,"l":28}],["BlueGrey",{"h":203,"s":19,"l":47}],["BluePurple",{"h":257,"s":67,"l":48}],["BlueViolet",{"h":263,"s":95,"l":47}],["BlueWithAHintOfPurple",{"h":250,"s":55,"l":51}],["Blueberry",{"h":244,"s":40,"l":42}],["Bluegreen",{"h":180,"s":98,"l":24}],["Bluegrey",{"h":200,"s":23,"l":61}],["BlueyGreen",{"h":155,"s":61,"l":43}],["BlueyGrey",{"h":205,"s":20,"l":61}],["BlueyPurple",{"h":255,"s":54,"l":52}],["Bluish",{"h":208,"s":64,"l":45}],["BluishGreen",{"h":160,"s":82,"l":36}],["BluishGrey",{"h":201,"s":14,"l":52}],["BluishPurple",{"h":258,"s":78,"l":57}],["Blurple",{"h":251,"s":59,"l":51}],["Blush",{"h":10,"s":79,"l":75}],["BlushPink",{"h":355,"s":98,"l":75}],["Booger",{"h":73,"s":50,"l":47}],["BoogerGreen",{"h":70,"s":97,"l":36}],["Bordeaux",{"h":339,"s":100,"l":24}],["BoringGreen",{"h":122,"s":34,"l":55}],["BottleGreen",{"h":121,"s":90,"l":15}],["Brick",{"h":9,"s":64,"l":38}],["BrickOrange",{"h":21,"s":91,"l":40}],["BrickRed",{"h":8,"s":97,"l":28}],["BrightAqua",{"h":176,"s":95,"l":51}],["BrightBlue",{"h":216,"s":99,"l":50}],["BrightCyan",{"h":180,"s":99,"l":63}],["BrightGreen",{"h":121,"s":100,"l":50}],["BrightLavender",{"h":279,"s":100,"l":69}],["BrightLightBlue",{"h":182,"s":98,"l":57}],["BrightLightGreen",{"h":131,"s":99,"l":59}],["BrightLilac",{"h":281,"s":95,"l":68}],["BrightLime",{"h":89,"s":98,"l":51}],["BrightLimeGreen",{"h":97,"s":99,"l":51}],["BrightMagenta",{"h":306,"s":100,"l":52}],["BrightOlive",{"h":70,"s":96,"l":37}],["BrightOrange",{"h":21,"s":100,"l":50}],["BrightPink",{"h":318,"s":99,"l":50}],["BrightPurple",{"h":285,"s":98,"l":50}],["BrightRed",{"h":357,"s":100,"l":50}],["BrightSeaGreen",{"h":159,"s":100,"l":51}],["BrightSkyBlue",{"h":192,"s":99,"l":50}],["BrightTeal",{"h":168,"s":99,"l":49}],["BrightTurquoise",{"h":179,"s":99,"l":53}],["BrightViolet",{"h":280,"s":98,"l":52}],["BrightYellow",{"h":60,"s":100,"l":50}],["BrightYellowGreen",{"h":83,"s":100,"l":50}],["BritishRacingGreen",{"h":127,"s":87,"l":15}],["Bronze",{"h":43,"s":100,"l":33}],["Brown",{"h":33,"s":100,"l":20}],["BrownGreen",{"h":57,"s":74,"l":25}],["BrownGrey",{"h":45,"s":15,"l":48}],["BrownOrange",{"h":34,"s":98,"l":37}],["BrownRed",{"h":16,"s":93,"l":30}],["BrownYellow",{"h":51,"s":95,"l":36}],["Brownish",{"h":19,"s":28,"l":48}],["BrownishGreen",{"h":62,"s":85,"l":23}],["BrownishGrey",{"h":37,"s":17,"l":45}],["BrownishOrange",{"h":30,"s":71,"l":47}],["BrownishPink",{"h":4,"s":37,"l":62}],["BrownishPurple",{"h":346,"s":28,"l":36}],["BrownishRed",{"h":9,"s":64,"l":38}],["BrownishYellow",{"h":52,"s":97,"l":40}],["BrownyGreen",{"h":58,"s":83,"l":24}],["BrownyOrange",{"h":32,"s":98,"l":40}],["Bruise",{"h":313,"s":33,"l":37}],["BubbleGumPink",{"h":332,"s":100,"l":71}],["Bubblegum",{"h":330,"s":100,"l":71}],["BubblegumPink",{"h":324,"s":98,"l":75}],["Buff",{"h":55,"s":98,"l":81}],["Burgundy",{"h":338,"s":100,"l":19}],["BurntOrange",{"h":24,"s":99,"l":38}],["BurntRed",{"h":12,"s":94,"l":32}],["BurntSiena",{"h":26,"s":97,"l":36}],["BurntSienna",{"h":23,"s":84,"l":37}],["BurntUmber",{"h":23,"s":84,"l":34}],["BurntYellow",{"h":48,"s":92,"l":44}],["Burple",{"h":258,"s":76,"l":54}],["Butter",{"h":60,"s":100,"l":75}],["ButterYellow",{"h":59,"s":100,"l":73}],["Butterscotch",{"h":35,"s":98,"l":64}],["CadetBlue",{"h":208,"s":32,"l":45}],["Camel",{"h":39,"s":49,"l":56}],["Camo",{"h":75,"s":29,"l":43}],["CamoGreen",{"h":78,"s":46,"l":27}],["CamouflageGreen",{"h":77,"s":67,"l":23}],["Canary",{"h":61,"s":100,"l":69}],["CanaryYellow",{"h":60,"s":100,"l":63}],["CandyPink",{"h":308,"s":100,"l":69}],["Caramel",{"h":37,"s":90,"l":36}],["Carmine",{"h":352,"s":97,"l":31}],["Carnation",{"h":350,"s":97,"l":73}],["CarnationPink",{"h":341,"s":100,"l":75}],["CarolinaBlue",{"h":216,"s":98,"l":77}],["Celadon",{"h":114,"s":95,"l":85}],["Celery",{"h":95,"s":96,"l":79}],["Cement",{"h":54,"s":10,"l":61}],["Cerise",{"h":335,"s":90,"l":46}],["Cerulean",{"h":202,"s":96,"l":42}],["CeruleanBlue",{"h":213,"s":96,"l":48}],["Charcoal",{"h":165,"s":4,"l":21}],["CharcoalGrey",{"h":190,"s":5,"l":25}],["Chartreuse",{"h":74,"s":94,"l":51}],["Cherry",{"h":345,"s":98,"l":41}],["CherryRed",{"h":350,"s":98,"l":49}],["Chestnut",{"h":20,"s":97,"l":23}],["Chocolate",{"h":26,"s":94,"l":12}],["ChocolateBrown",{"h":23,"s":100,"l":13}],["Cinnamon",{"h":26,"s":93,"l":35}],["Claret",{"h":346,"s":100,"l":20}],["Clay",{"h":15,"s":41,"l":51}],["ClayBrown",{"h":27,"s":49,"l":47}],["ClearBlue",{"h":216,"s":98,"l":57}],["CloudyBlue",{"h":211,"s":37,"l":76}],["Cobalt",{"h":218,"s":65,"l":34}],["CobaltBlue",{"h":237,"s":96,"l":33}],["Cocoa",{"h":25,"s":34,"l":39}],["Coffee",{"h":35,"s":37,"l":47}],["CoolBlue",{"h":208,"s":44,"l":50}],["CoolGreen",{"h":142,"s":57,"l":46}],["CoolGrey",{"h":191,"s":9,"l":62}],["Copper",{"h":26,"s":66,"l":43}],["Coral",{"h":3,"s":97,"l":65}],["CoralPink",{"h":359,"s":100,"l":69}],["Cornflower",{"h":234,"s":90,"l":69}],["CornflowerBlue",{"h":226,"s":63,"l":58}],["Cranberry",{"h":338,"s":100,"l":31}],["Cream",{"h":60,"s":100,"l":88}],["Creme",{"h":60,"s":100,"l":86}],["Crimson",{"h":354,"s":100,"l":27}],["Custard",{"h":59,"s":100,"l":74}],["Cyan",{"h":180,"s":100,"l":50}],["Dandelion",{"h":52,"s":99,"l":51}],["Dark",{"h":215,"s":29,"l":15}],["DarkAqua",{"h":181,"s":91,"l":22}],["DarkAquamarine",{"h":179,"s":98,"l":23}],["DarkBeige",{"h":40,"s":31,"l":53}],["DarkBlue",{"h":238,"s":100,"l":18}],["DarkBlueGreen",{"h":173,"s":100,"l":16}],["DarkBlueGrey",{"h":203,"s":43,"l":21}],["DarkBrown",{"h":31,"s":93,"l":11}],["DarkCoral",{"h":2,"s":57,"l":56}],["DarkCream",{"h":53,"s":100,"l":80}],["DarkCyan",{"h":181,"s":86,"l":29}],["DarkForestGreen",{"h":125,"s":100,"l":9}],["DarkFuchsia",{"h":327,"s":91,"l":32}],["DarkGold",{"h":48,"s":84,"l":39}],["DarkGrassGreen",{"h":95,"s":94,"l":26}],["DarkGreen",{"h":117,"s":100,"l":10}],["DarkGreenBlue",{"h":169,"s":52,"l":25}],["DarkGrey",{"h":180,"s":1,"l":21}],["DarkGreyBlue",{"h":205,"s":38,"l":26}],["DarkHotPink",{"h":332,"s":99,"l":43}],["DarkIndigo",{"h":258,"s":81,"l":18}],["DarkKhaki",{"h":50,"s":29,"l":47}],["DarkLavender",{"h":277,"s":19,"l":50}],["DarkLilac",{"h":290,"s":24,"l":54}],["DarkLime",{"h":77,"s":99,"l":36}],["DarkLimeGreen",{"h":80,"s":99,"l":37}],["DarkMagenta",{"h":326,"s":100,"l":29}],["DarkMaroon",{"h":352,"s":100,"l":12}],["DarkMauve",{"h":338,"s":28,"l":41}],["DarkMint",{"h":141,"s":49,"l":52}],["DarkMintGreen",{"h":151,"s":71,"l":44}],["DarkMustard",{"h":49,"s":94,"l":34}],["DarkNavy",{"h":235,"s":100,"l":10}],["DarkNavyBlue",{"h":237,"s":100,"l":9}],["DarkOlive",{"h":67,"s":94,"l":13}],["DarkOliveGreen",{"h":74,"s":93,"l":16}],["DarkOrange",{"h":24,"s":98,"l":39}],["DarkPastelGreen",{"h":121,"s":35,"l":51}],["DarkPeach",{"h":15,"s":66,"l":62}],["DarkPeriwinkle",{"h":244,"s":55,"l":60}],["DarkPink",{"h":342,"s":57,"l":53}],["DarkPlum",{"h":318,"s":97,"l":13}],["DarkPurple",{"h":290,"s":82,"l":13}],["DarkRed",{"h":0,"s":100,"l":26}],["DarkRose",{"h":348,"s":43,"l":50}],["DarkRoyalBlue",{"h":238,"s":96,"l":22}],["DarkSage",{"h":116,"s":21,"l":43}],["DarkSalmon",{"h":4,"s":52,"l":55}],["DarkSand",{"h":41,"s":31,"l":50}],["DarkSeaGreen",{"h":159,"s":78,"l":30}],["DarkSeafoam",{"h":156,"s":71,"l":42}],["DarkSeafoamGreen",{"h":150,"s":48,"l":46}],["DarkSkyBlue",{"h":212,"s":75,"l":58}],["DarkSlateBlue",{"h":204,"s":49,"l":25}],["DarkTan",{"h":37,"s":41,"l":49}],["DarkTaupe",{"h":32,"s":24,"l":40}],["DarkTeal",{"h":181,"s":97,"l":15}],["DarkTurquoise",{"h":179,"s":92,"l":19}],["DarkViolet",{"h":289,"s":97,"l":13}],["DarkYellow",{"h":51,"s":91,"l":44}],["DarkYellowGreen",{"h":72,"s":97,"l":28}],["Darkblue",{"h":238,"s":94,"l":20}],["Darkgreen",{"h":122,"s":87,"l":15}],["DarkishBlue",{"h":210,"s":98,"l":26}],["DarkishGreen",{"h":131,"s":51,"l":32}],["DarkishPink",{"h":338,"s":67,"l":56}],["DarkishPurple",{"h":301,"s":65,"l":28}],["DarkishRed",{"h":358,"s":97,"l":34}],["DeepAqua",{"h":184,"s":88,"l":26}],["DeepBlue",{"h":241,"s":97,"l":23}],["DeepBrown",{"h":2,"s":100,"l":13}],["DeepGreen",{"h":129,"s":96,"l":18}],["DeepLavender",{"h":272,"s":38,"l":54}],["DeepLilac",{"h":270,"s":37,"l":59}],["DeepMagenta",{"h":326,"s":98,"l":32}],["DeepOrange",{"h":21,"s":99,"l":43}],["DeepPink",{"h":331,"s":99,"l":40}],["DeepPurple",{"h":291,"s":97,"l":13}],["DeepRed",{"h":1,"s":100,"l":30}],["DeepRose",{"h":345,"s":53,"l":53}],["DeepSeaBlue",{"h":201,"s":98,"l":26}],["DeepSkyBlue",{"h":213,"s":94,"l":51}],["DeepTeal",{"h":183,"s":100,"l":18}],["DeepTurquoise",{"h":181,"s":98,"l":23}],["DeepViolet",{"h":301,"s":85,"l":15}],["Denim",{"h":210,"s":41,"l":39}],["DenimBlue",{"h":218,"s":42,"l":40}],["Desert",{"h":43,"s":51,"l":59}],["Diarrhea",{"h":49,"s":96,"l":32}],["Dirt",{"h":36,"s":33,"l":41}],["DirtBrown",{"h":36,"s":39,"l":37}],["DirtyBlue",{"h":197,"s":43,"l":43}],["DirtyGreen",{"h":78,"s":48,"l":33}],["DirtyOrange",{"h":35,"s":94,"l":40}],["DirtyPink",{"h":356,"s":43,"l":64}],["DirtyPurple",{"h":320,"s":22,"l":37}],["DirtyYellow",{"h":58,"s":91,"l":42}],["DodgerBlue",{"h":219,"s":97,"l":62}],["Drab",{"h":61,"s":32,"l":39}],["DrabGreen",{"h":89,"s":30,"l":45}],["DriedBlood",{"h":0,"s":97,"l":15}],["DuckEggBlue",{"h":173,"s":88,"l":87}],["DullBlue",{"h":208,"s":36,"l":45}],["DullBrown",{"h":35,"s":29,"l":41}],["DullGreen",{"h":104,"s":28,"l":52}],["DullOrange",{"h":29,"s":67,"l":54}],["DullPink",{"h":343,"s":48,"l":68}],["DullPurple",{"h":308,"s":19,"l":43}],["DullRed",{"h":0,"s":50,"l":49}],["DullTeal",{"h":166,"s":25,"l":50}],["DullYellow",{"h":53,"s":81,"l":65}],["Dusk",{"h":233,"s":25,"l":41}],["DuskBlue",{"h":214,"s":58,"l":35}],["DuskyBlue",{"h":221,"s":35,"l":43}],["DuskyPink",{"h":348,"s":45,"l":64}],["DuskyPurple",{"h":318,"s":20,"l":45}],["DuskyRose",{"h":352,"s":37,"l":57}],["Dust",{"h":38,"s":31,"l":56}],["DustyBlue",{"h":208,"s":34,"l":52}],["DustyGreen",{"h":117,"s":24,"l":56}],["DustyLavender",{"h":306,"s":19,"l":60}],["DustyOrange",{"h":24,"s":86,"l":58}],["DustyPink",{"h":352,"s":47,"l":69}],["DustyPurple",{"h":293,"s":17,"l":45}],["DustyRed",{"h":357,"s":45,"l":50}],["DustyRose",{"h":355,"s":38,"l":60}],["DustyTeal",{"h":170,"s":31,"l":43}],["Earth",{"h":23,"s":45,"l":44}],["EasterGreen",{"h":113,"s":97,"l":74}],["EasterPurple",{"h":274,"s":99,"l":72}],["Ecru",{"h":61,"s":100,"l":90}],["EggShell",{"h":57,"s":100,"l":88}],["Eggplant",{"h":304,"s":75,"l":13}],["EggplantPurple",{"h":302,"s":86,"l":14}],["Eggshell",{"h":60,"s":100,"l":92}],["EggshellBlue",{"h":172,"s":100,"l":88}],["ElectricBlue",{"h":222,"s":100,"l":51}],["ElectricGreen",{"h":115,"s":98,"l":52}],["ElectricLime",{"h":81,"s":100,"l":51}],["ElectricPink",{"h":327,"s":100,"l":51}],["ElectricPurple",{"h":277,"s":100,"l":57}],["Emerald",{"h":147,"s":99,"l":32}],["EmeraldGreen",{"h":132,"s":97,"l":28}],["Evergreen",{"h":154,"s":87,"l":15}],["FadedBlue",{"h":213,"s":39,"l":56}],["FadedGreen",{"h":113,"s":29,"l":58}],["FadedOrange",{"h":26,"s":84,"l":62}],["FadedPink",{"h":346,"s":50,"l":74}],["FadedPurple",{"h":289,"s":17,"l":52}],["FadedRed",{"h":358,"s":61,"l":56}],["FadedYellow",{"h":60,"s":100,"l":75}],["Fawn",{"h":37,"s":47,"l":65}],["Fern",{"h":107,"s":36,"l":49}],["FernGreen",{"h":107,"s":35,"l":41}],["FireEngineRed",{"h":0,"s":100,"l":50}],["FlatBlue",{"h":209,"s":47,"l":45}],["FlatGreen",{"h":99,"s":35,"l":46}],["FluorescentGreen",{"h":120,"s":100,"l":52}],["FluroGreen",{"h":118,"s":100,"l":50}],["FoamGreen",{"h":134,"s":96,"l":78}],["Forest",{"h":118,"s":81,"l":18}],["ForestGreen",{"h":126,"s":84,"l":15}],["ForrestGreen",{"h":105,"s":84,"l":15}],["FrenchBlue",{"h":217,"s":44,"l":47}],["FreshGreen",{"h":109,"s":64,"l":58}],["FrogGreen",{"h":93,"s":92,"l":38}],["Fuchsia",{"h":305,"s":90,"l":49}],["Gold",{"h":49,"s":90,"l":45}],["Golden",{"h":47,"s":98,"l":49}],["GoldenBrown",{"h":41,"s":99,"l":35}],["GoldenRod",{"h":45,"s":95,"l":50}],["GoldenYellow",{"h":46,"s":99,"l":54}],["Goldenrod",{"h":46,"s":96,"l":50}],["Grape",{"h":312,"s":35,"l":31}],["GrapePurple",{"h":310,"s":65,"l":22}],["Grapefruit",{"h":1,"s":98,"l":66}],["Grass",{"h":98,"s":59,"l":43}],["GrassGreen",{"h":98,"s":87,"l":33}],["GrassyGreen",{"h":96,"s":96,"l":31}],["Green",{"h":174,"s":82,"l":33}],["Green",{"h":77,"s":98,"l":62}],["Green",{"h":122,"s":79,"l":39}],["Green",{"h":105,"s":16,"l":56}],["GreenApple",{"h":100,"s":75,"l":49}],["GreenBlue",{"h":166,"s":94,"l":36}],["GreenBrown",{"h":56,"s":93,"l":17}],["GreenGrey",{"h":106,"s":14,"l":50}],["GreenTeal",{"h":158,"s":88,"l":38}],["GreenYellow",{"h":75,"s":100,"l":58}],["Greenblue",{"h":159,"s":70,"l":45}],["Greenish",{"h":144,"s":44,"l":45}],["GreenishBeige",{"h":65,"s":49,"l":65}],["GreenishBlue",{"h":178,"s":85,"l":29}],["GreenishBrown",{"h":54,"s":71,"l":24}],["GreenishCyan",{"h":160,"s":99,"l":58}],["GreenishGrey",{"h":104,"s":17,"l":62}],["GreenishTan",{"h":71,"s":44,"l":64}],["GreenishTeal",{"h":155,"s":59,"l":47}],["GreenishTurquoise",{"h":162,"s":100,"l":49}],["GreenishYellow",{"h":71,"s":98,"l":50}],["GreenyBlue",{"h":164,"s":46,"l":48}],["GreenyBrown",{"h":55,"s":89,"l":22}],["GreenyGrey",{"h":114,"s":17,"l":55}],["GreenyYellow",{"h":73,"s":94,"l":50}],["Grey",{"h":209,"s":20,"l":55}],["Grey",{"h":105,"s":2,"l":58}],["GreyBlue",{"h":206,"s":24,"l":53}],["GreyBrown",{"h":40,"s":21,"l":41}],["GreyGreen",{"h":113,"s":17,"l":53}],["GreyPink",{"h":347,"s":30,"l":66}],["GreyPurple",{"h":281,"s":12,"l":49}],["GreyTeal",{"h":163,"s":24,"l":49}],["Greyblue",{"h":199,"s":30,"l":59}],["Greyish",{"h":47,"s":10,"l":62}],["GreyishBlue",{"h":207,"s":25,"l":49}],["GreyishBrown",{"h":38,"s":21,"l":39}],["GreyishGreen",{"h":113,"s":19,"l":57}],["GreyishPink",{"h":353,"s":35,"l":67}],["GreyishPurple",{"h":283,"s":13,"l":51}],["GreyishTeal",{"h":162,"s":19,"l":53}],["GrossGreen",{"h":71,"s":79,"l":42}],["Gunmetal",{"h":195,"s":11,"l":36}],["Hazel",{"h":48,"s":71,"l":33}],["Heather",{"h":288,"s":19,"l":60}],["Heliotrope",{"h":290,"s":89,"l":64}],["HighlighterGreen",{"h":115,"s":98,"l":51}],["HospitalGreen",{"h":132,"s":59,"l":75}],["HotGreen",{"h":121,"s":100,"l":57}],["HotMagenta",{"h":311,"s":97,"l":49}],["HotPink",{"h":327,"s":100,"l":50}],["HotPurple",{"h":290,"s":100,"l":48}],["HunterGreen",{"h":117,"s":78,"l":14}],["Ice",{"h":173,"s":100,"l":92}],["IceBlue",{"h":179,"s":100,"l":92}],["IckyGreen",{"h":73,"s":67,"l":41}],["IndianRed",{"h":5,"s":94,"l":27}],["Indigo",{"h":265,"s":97,"l":26}],["IndigoBlue",{"h":253,"s":76,"l":39}],["Iris",{"h":246,"s":48,"l":56}],["IrishGreen",{"h":136,"s":99,"l":29}],["Ivory",{"h":60,"s":100,"l":90}],["Jade",{"h":158,"s":69,"l":39}],["JadeGreen",{"h":149,"s":61,"l":43}],["JungleGreen",{"h":150,"s":94,"l":26}],["KelleyGreen",{"h":142,"s":100,"l":29}],["KellyGreen",{"h":136,"s":98,"l":34}],["KermitGreen",{"h":89,"s":100,"l":35}],["KeyLime",{"h":94,"s":100,"l":72}],["Khaki",{"h":57,"s":30,"l":53}],["KhakiGreen",{"h":76,"s":40,"l":37}],["Kiwi",{"h":89,"s":84,"l":60}],["KiwiGreen",{"h":91,"s":76,"l":57}],["Lavender",{"h":270,"s":71,"l":78}],["LavenderBlue",{"h":242,"s":89,"l":75}],["LavenderPink",{"h":304,"s":56,"l":69}],["LawnGreen",{"h":94,"s":90,"l":34}],["Leaf",{"h":89,"s":53,"l":44}],["LeafGreen",{"h":88,"s":95,"l":34}],["LeafyGreen",{"h":109,"s":51,"l":47}],["Leather",{"h":32,"s":54,"l":44}],["Lemon",{"h":61,"s":100,"l":66}],["LemonGreen",{"h":78,"s":98,"l":49}],["LemonLime",{"h":78,"s":99,"l":58}],["LemonYellow",{"h":61,"s":100,"l":61}],["Lichen",{"h":100,"s":29,"l":60}],["LightAqua",{"h":161,"s":100,"l":77}],["LightAquamarine",{"h":155,"s":97,"l":74}],["LightBeige",{"h":59,"s":100,"l":86}],["LightBlue",{"h":206,"s":94,"l":79}],["LightBlueGreen",{"h":145,"s":94,"l":74}],["LightBlueGrey",{"h":215,"s":43,"l":80}],["LightBluishGreen",{"h":142,"s":97,"l":73}],["LightBrightGreen",{"h":123,"s":99,"l":66}],["LightBrown",{"h":32,"s":37,"l":50}],["LightBurgundy",{"h":345,"s":44,"l":46}],["LightCyan",{"h":178,"s":100,"l":84}],["LightEggplant",{"h":304,"s":33,"l":40}],["LightForestGreen",{"h":124,"s":29,"l":44}],["LightGold",{"h":48,"s":98,"l":68}],["LightGrassGreen",{"h":98,"s":90,"l":68}],["LightGreen",{"h":107,"s":91,"l":73}],["LightGreenBlue",{"h":147,"s":97,"l":66}],["LightGreenishBlue",{"h":153,"s":90,"l":68}],["LightGrey",{"h":100,"s":8,"l":85}],["LightGreyBlue",{"h":206,"s":39,"l":72}],["LightGreyGreen",{"h":99,"s":52,"l":76}],["LightIndigo",{"h":250,"s":55,"l":58}],["LightKhaki",{"h":69,"s":75,"l":79}],["LightLavendar",{"h":285,"s":97,"l":87}],["LightLavender",{"h":267,"s":97,"l":88}],["LightLightBlue",{"h":175,"s":100,"l":90}],["LightLightGreen",{"h":102,"s":100,"l":85}],["LightLilac",{"h":280,"s":100,"l":89}],["LightLime",{"h":93,"s":97,"l":71}],["LightLimeGreen",{"h":87,"s":100,"l":70}],["LightMagenta",{"h":301,"s":94,"l":68}],["LightMaroon",{"h":350,"s":38,"l":46}],["LightMauve",{"h":341,"s":28,"l":67}],["LightMint",{"h":124,"s":100,"l":86}],["LightMintGreen",{"h":128,"s":91,"l":82}],["LightMossGreen",{"h":85,"s":43,"l":62}],["LightMustard",{"h":46,"s":90,"l":67}],["LightNavy",{"h":208,"s":73,"l":30}],["LightNavyBlue",{"h":211,"s":49,"l":36}],["LightNeonGreen",{"h":122,"s":98,"l":65}],["LightOlive",{"h":73,"s":40,"l":58}],["LightOliveGreen",{"h":76,"s":43,"l":55}],["LightOrange",{"h":32,"s":98,"l":64}],["LightPastelGreen",{"h":111,"s":91,"l":82}],["LightPeaGreen",{"h":88,"s":98,"l":75}],["LightPeach",{"h":30,"s":100,"l":85}],["LightPeriwinkle",{"h":235,"s":91,"l":87}],["LightPink",{"h":342,"s":100,"l":91}],["LightPlum",{"h":322,"s":29,"l":48}],["LightPurple",{"h":274,"s":88,"l":72}],["LightRed",{"h":358,"s":100,"l":64}],["LightRose",{"h":354,"s":100,"l":89}],["LightRoyalBlue",{"h":243,"s":99,"l":59}],["LightSage",{"h":105,"s":63,"l":80}],["LightSalmon",{"h":12,"s":98,"l":79}],["LightSeaGreen",{"h":135,"s":84,"l":78}],["LightSeafoam",{"h":140,"s":98,"l":81}],["LightSeafoamGreen",{"h":130,"s":100,"l":83}],["LightSkyBlue",{"h":183,"s":100,"l":89}],["LightTan",{"h":50,"s":91,"l":83}],["LightTeal",{"h":155,"s":61,"l":73}],["LightTurquoise",{"h":160,"s":84,"l":73}],["LightUrple",{"h":270,"s":88,"l":70}],["LightViolet",{"h":268,"s":92,"l":85}],["LightYellow",{"h":60,"s":100,"l":74}],["LightYellowGreen",{"h":83,"s":97,"l":75}],["LightYellowishGreen",{"h":91,"s":100,"l":77}],["Lightblue",{"h":202,"s":87,"l":72}],["LighterGreen",{"h":113,"s":97,"l":69}],["LighterPurple",{"h":269,"s":88,"l":65}],["Lightgreen",{"h":122,"s":100,"l":73}],["LightishBlue",{"h":221,"s":98,"l":62}],["LightishGreen",{"h":120,"s":68,"l":63}],["LightishPurple",{"h":274,"s":75,"l":61}],["LightishRed",{"h":352,"s":99,"l":59}],["Lilac",{"h":269,"s":96,"l":81}],["Liliac",{"h":269,"s":97,"l":77}],["Lime",{"h":85,"s":100,"l":60}],["LimeGreen",{"h":88,"s":99,"l":51}],["LimeYellow",{"h":72,"s":99,"l":55}],["Lipstick",{"h":343,"s":81,"l":46}],["LipstickRed",{"h":346,"s":98,"l":38}],["MacaroniAndCheese",{"h":41,"s":85,"l":57}],["Magenta",{"h":323,"s":100,"l":38}],["Mahogany",{"h":1,"s":100,"l":15}],["Maize",{"h":47,"s":88,"l":64}],["Mango",{"h":35,"s":100,"l":58}],["Manilla",{"h":58,"s":100,"l":76}],["Marigold",{"h":45,"s":98,"l":51}],["Marine",{"h":213,"s":92,"l":20}],["MarineBlue",{"h":209,"s":98,"l":21}],["Maroon",{"h":340,"s":100,"l":20}],["Mauve",{"h":344,"s":27,"l":56}],["MediumBlue",{"h":212,"s":62,"l":45}],["MediumBrown",{"h":35,"s":75,"l":28}],["MediumGreen",{"h":128,"s":50,"l":45}],["MediumGrey",{"h":100,"s":1,"l":49}],["MediumPink",{"h":338,"s":86,"l":67}],["MediumPurple",{"h":297,"s":41,"l":45}],["Melon",{"h":12,"s":100,"l":67}],["Merlot",{"h":330,"s":100,"l":23}],["MetallicBlue",{"h":206,"s":29,"l":43}],["MidBlue",{"h":211,"s":64,"l":43}],["MidGreen",{"h":114,"s":40,"l":47}],["Midnight",{"h":243,"s":96,"l":9}],["MidnightBlue",{"h":242,"s":100,"l":10}],["MidnightPurple",{"h":283,"s":96,"l":11}],["MilitaryGreen",{"h":81,"s":33,"l":36}],["MilkChocolate",{"h":30,"s":62,"l":31}],["Mint",{"h":131,"s":98,"l":81}],["MintGreen",{"h":129,"s":100,"l":78}],["MintyGreen",{"h":149,"s":94,"l":51}],["Mocha",{"h":29,"s":32,"l":47}],["Moss",{"h":92,"s":27,"l":47}],["MossGreen",{"h":87,"s":43,"l":38}],["MossyGreen",{"h":84,"s":56,"l":35}],["Mud",{"h":46,"s":73,"l":26}],["MudBrown",{"h":41,"s":73,"l":22}],["MudGreen",{"h":64,"s":96,"l":20}],["MuddyBrown",{"h":45,"s":92,"l":28}],["MuddyGreen",{"h":74,"s":40,"l":33}],["MuddyYellow",{"h":54,"s":95,"l":38}],["Mulberry",{"h":330,"s":87,"l":31}],["MurkyGreen",{"h":68,"s":79,"l":27}],["Mushroom",{"h":26,"s":27,"l":63}],["Mustard",{"h":52,"s":99,"l":41}],["MustardBrown",{"h":44,"s":95,"l":35}],["MustardGreen",{"h":64,"s":96,"l":36}],["MustardYellow",{"h":54,"s":91,"l":43}],["MutedBlue",{"h":208,"s":46,"l":43}],["MutedGreen",{"h":110,"s":32,"l":47}],["MutedPink",{"h":344,"s":50,"l":64}],["MutedPurple",{"h":290,"s":19,"l":44}],["NastyGreen",{"h":94,"s":48,"l":47}],["Navy",{"h":220,"s":97,"l":12}],["NavyBlue",{"h":225,"s":100,"l":14}],["NavyGreen",{"h":85,"s":78,"l":18}],["NeonBlue",{"h":189,"s":100,"l":51}],["NeonGreen",{"h":120,"s":100,"l":52}],["NeonPink",{"h":324,"s":99,"l":50}],["NeonPurple",{"h":283,"s":99,"l":54}],["NeonRed",{"h":348,"s":100,"l":51}],["NeonYellow",{"h":71,"s":100,"l":51}],["NiceBlue",{"h":200,"s":83,"l":38}],["NightBlue",{"h":241,"s":92,"l":15}],["Ocean",{"h":190,"s":99,"l":29}],["OceanBlue",{"h":197,"s":96,"l":31}],["OceanGreen",{"h":155,"s":43,"l":42}],["Ocher",{"h":48,"s":88,"l":40}],["Ochre",{"h":45,"s":95,"l":38}],["Ocre",{"h":47,"s":96,"l":40}],["OffBlue",{"h":209,"s":35,"l":51}],["OffGreen",{"h":102,"s":33,"l":48}],["OffWhite",{"h":60,"s":100,"l":95}],["OffYellow",{"h":61,"s":88,"l":60}],["OldPink",{"h":350,"s":41,"l":63}],["OldRose",{"h":352,"s":40,"l":64}],["Olive",{"h":64,"s":79,"l":26}],["OliveBrown",{"h":50,"s":94,"l":20}],["OliveDrab",{"h":66,"s":40,"l":33}],["OliveGreen",{"h":70,"s":94,"l":25}],["OliveYellow",{"h":56,"s":91,"l":40}],["Orange",{"h":27,"s":95,"l":50}],["OrangeBrown",{"h":32,"s":100,"l":37}],["OrangePink",{"h":10,"s":100,"l":66}],["OrangeRed",{"h":9,"s":98,"l":55}],["OrangeYellow",{"h":41,"s":100,"l":50}],["Orangeish",{"h":23,"s":98,"l":64}],["Orangered",{"h":13,"s":99,"l":53}],["OrangeyBrown",{"h":32,"s":98,"l":35}],["OrangeyRed",{"h":8,"s":96,"l":56}],["OrangeyYellow",{"h":42,"s":98,"l":54}],["Orangish",{"h":19,"s":97,"l":64}],["OrangishBrown",{"h":32,"s":97,"l":35}],["OrangishRed",{"h":12,"s":96,"l":49}],["Orchid",{"h":303,"s":43,"l":62}],["Pale",{"h":52,"s":100,"l":91}],["PaleAqua",{"h":163,"s":100,"l":86}],["PaleBlue",{"h":180,"s":96,"l":91}],["PaleBrown",{"h":31,"s":30,"l":56}],["PaleCyan",{"h":176,"s":100,"l":86}],["PaleGold",{"h":47,"s":97,"l":71}],["PaleGreen",{"h":105,"s":95,"l":85}],["PaleGrey",{"h":240,"s":33,"l":99}],["PaleLavender",{"h":280,"s":96,"l":90}],["PaleLightGreen",{"h":105,"s":94,"l":79}],["PaleLilac",{"h":269,"s":100,"l":90}],["PaleLime",{"h":87,"s":97,"l":72}],["PaleLimeGreen",{"h":90,"s":100,"l":70}],["PaleMagenta",{"h":323,"s":58,"l":62}],["PaleMauve",{"h":303,"s":96,"l":91}],["PaleOlive",{"h":75,"s":42,"l":65}],["PaleOliveGreen",{"h":83,"s":49,"l":65}],["PaleOrange",{"h":29,"s":100,"l":67}],["PalePeach",{"h":41,"s":100,"l":84}],["PalePink",{"h":344,"s":100,"l":91}],["PalePurple",{"h":274,"s":44,"l":70}],["PaleRed",{"h":3,"s":65,"l":58}],["PaleRose",{"h":356,"s":94,"l":87}],["PaleSalmon",{"h":14,"s":100,"l":80}],["PaleSkyBlue",{"h":187,"s":97,"l":87}],["PaleTeal",{"h":159,"s":41,"l":65}],["PaleTurquoise",{"h":153,"s":91,"l":82}],["PaleViolet",{"h":265,"s":88,"l":83}],["PaleYellow",{"h":60,"s":100,"l":76}],["Parchment",{"h":58,"s":98,"l":84}],["PastelBlue",{"h":221,"s":98,"l":82}],["PastelGreen",{"h":108,"s":100,"l":81}],["PastelOrange",{"h":24,"s":100,"l":65}],["PastelPink",{"h":343,"s":100,"l":86}],["PastelPurple",{"h":267,"s":100,"l":81}],["PastelRed",{"h":1,"s":65,"l":60}],["PastelYellow",{"h":60,"s":100,"l":72}],["Pea",{"h":70,"s":71,"l":44}],["PeaGreen",{"h":71,"s":81,"l":37}],["PeaSoup",{"h":63,"s":99,"l":30}],["PeaSoupGreen",{"h":68,"s":76,"l":37}],["Peach",{"h":24,"s":100,"l":74}],["PeachyPink",{"h":8,"s":100,"l":77}],["PeacockBlue",{"h":199,"s":99,"l":29}],["Pear",{"h":78,"s":92,"l":67}],["Periwinkle",{"h":246,"s":98,"l":75}],["PeriwinkleBlue",{"h":234,"s":93,"l":77}],["Perrywinkle",{"h":242,"s":65,"l":73}],["Petrol",{"h":186,"s":100,"l":21}],["PigPink",{"h":344,"s":65,"l":73}],["Pine",{"h":131,"s":37,"l":27}],["PineGreen",{"h":139,"s":76,"l":16}],["Pink",{"h":330,"s":100,"l":75}],["Pink",{"h":298,"s":74,"l":51}],["PinkPurple",{"h":300,"s":67,"l":58}],["PinkRed",{"h":342,"s":96,"l":49}],["Pinkish",{"h":349,"s":55,"l":62}],["PinkishBrown",{"h":13,"s":34,"l":54}],["PinkishGrey",{"h":6,"s":22,"l":72}],["PinkishOrange",{"h":13,"s":100,"l":65}],["PinkishPurple",{"h":300,"s":64,"l":56}],["PinkishRed",{"h":345,"s":91,"l":50}],["PinkishTan",{"h":17,"s":53,"l":68}],["Pinky",{"h":342,"s":95,"l":76}],["PinkyPurple",{"h":305,"s":54,"l":54}],["PinkyRed",{"h":351,"s":97,"l":57}],["PissYellow",{"h":58,"s":80,"l":48}],["Pistachio",{"h":91,"s":92,"l":76}],["Plum",{"h":319,"s":71,"l":20}],["PlumPurple",{"h":298,"s":88,"l":17}],["PoisonGreen",{"h":109,"s":98,"l":54}],["Poo",{"h":48,"s":96,"l":29}],["PooBrown",{"h":42,"s":99,"l":27}],["Poop",{"h":44,"s":100,"l":25}],["PoopBrown",{"h":44,"s":98,"l":24}],["PoopGreen",{"h":66,"s":100,"l":24}],["PowderBlue",{"h":214,"s":93,"l":84}],["PowderPink",{"h":337,"s":100,"l":85}],["PrimaryBlue",{"h":241,"s":97,"l":50}],["PrussianBlue",{"h":205,"s":100,"l":23}],["Puce",{"h":32,"s":34,"l":48}],["Puke",{"h":60,"s":98,"l":33}],["PukeBrown",{"h":48,"s":92,"l":30}],["PukeGreen",{"h":67,"s":92,"l":35}],["PukeYellow",{"h":59,"s":87,"l":41}],["Pumpkin",{"h":32,"s":99,"l":44}],["PumpkinOrange",{"h":29,"s":97,"l":51}],["PureBlue",{"h":240,"s":98,"l":45}],["Purple",{"h":286,"s":68,"l":36}],["Purple",{"h":262,"s":95,"l":48}],["Purple",{"h":302,"s":87,"l":53}],["PurpleBlue",{"h":257,"s":81,"l":55}],["PurpleBrown",{"h":353,"s":28,"l":32}],["PurpleGrey",{"h":303,"s":9,"l":48}],["PurplePink",{"h":303,"s":72,"l":56}],["PurpleRed",{"h":332,"s":99,"l":30}],["Purpleish",{"h":310,"s":28,"l":47}],["PurpleishBlue",{"h":251,"s":85,"l":59}],["PurpleishPink",{"h":310,"s":69,"l":59}],["Purpley",{"h":261,"s":72,"l":62}],["PurpleyBlue",{"h":254,"s":79,"l":55}],["PurpleyGrey",{"h":300,"s":9,"l":54}],["PurpleyPink",{"h":306,"s":56,"l":51}],["Purplish",{"h":308,"s":26,"l":46}],["PurplishBlue",{"h":258,"s":95,"l":55}],["PurplishBrown",{"h":353,"s":24,"l":34}],["PurplishGrey",{"h":287,"s":10,"l":45}],["PurplishPink",{"h":317,"s":54,"l":59}],["PurplishRed",{"h":335,"s":94,"l":35}],["Purply",{"h":286,"s":48,"l":47}],["PurplyBlue",{"h":262,"s":86,"l":52}],["PurplyPink",{"h":305,"s":80,"l":70}],["Putty",{"h":42,"s":29,"l":64}],["RacingGreen",{"h":119,"s":100,"l":14}],["RadioactiveGreen",{"h":116,"s":96,"l":55}],["Raspberry",{"h":335,"s":99,"l":35}],["RawSienna",{"h":38,"s":100,"l":30}],["RawUmber",{"h":32,"s":90,"l":35}],["ReallyLightBlue",{"h":180,"s":100,"l":92}],["Red",{"h":0,"s":100,"l":45}],["RedBrown",{"h":12,"s":73,"l":32}],["RedOrange",{"h":13,"s":98,"l":51}],["RedPink",{"h":348,"s":95,"l":57}],["RedPurple",{"h":329,"s":90,"l":27}],["RedViolet",{"h":321,"s":99,"l":31}],["RedWine",{"h":338,"s":100,"l":27}],["Reddish",{"h":1,"s":53,"l":51}],["ReddishBrown",{"h":17,"s":85,"l":27}],["ReddishGrey",{"h":7,"s":17,"l":52}],["ReddishOrange",{"h":12,"s":94,"l":54}],["ReddishPink",{"h":349,"s":99,"l":58}],["ReddishPurple",{"h":328,"s":88,"l":30}],["ReddyBrown",{"h":6,"s":91,"l":23}],["RichBlue",{"h":234,"s":98,"l":49}],["RichPurple",{"h":314,"s":100,"l":22}],["Robin'sEgg",{"h":187,"s":97,"l":71}],["Robin'sEggBlue",{"h":186,"s":89,"l":79}],["RobinEggBlue",{"h":187,"s":98,"l":77}],["Rosa",{"h":345,"s":98,"l":76}],["Rose",{"h":350,"s":53,"l":60}],["RosePink",{"h":350,"s":88,"l":75}],["RoseRed",{"h":341,"s":99,"l":37}],["RosyPink",{"h":344,"s":89,"l":69}],["Rouge",{"h":345,"s":81,"l":37}],["Royal",{"h":235,"s":85,"l":31}],["RoyalBlue",{"h":240,"s":95,"l":34}],["RoyalPurple",{"h":281,"s":100,"l":22}],["Ruby",{"h":339,"s":99,"l":40}],["Russet",{"h":20,"s":94,"l":33}],["Rust",{"h":19,"s":90,"l":35}],["RustBrown",{"h":20,"s":96,"l":28}],["RustOrange",{"h":25,"s":92,"l":40}],["RustRed",{"h":13,"s":95,"l":34}],["RustyOrange",{"h":24,"s":92,"l":42}],["RustyRed",{"h":13,"s":86,"l":37}],["Saffron",{"h":41,"s":99,"l":52}],["Sage",{"h":100,"s":27,"l":57}],["SageGreen",{"h":104,"s":28,"l":59}],["Salmon",{"h":5,"s":100,"l":71}],["SalmonPink",{"h":0,"s":98,"l":74}],["Sand",{"h":47,"s":65,"l":67}],["SandBrown",{"h":39,"s":51,"l":59}],["SandYellow",{"h":49,"s":96,"l":69}],["Sandstone",{"h":41,"s":44,"l":62}],["Sandy",{"h":48,"s":81,"l":71}],["SandyBrown",{"h":42,"s":46,"l":57}],["SandyYellow",{"h":53,"s":97,"l":72}],["SapGreen",{"h":84,"s":74,"l":31}],["Sapphire",{"h":230,"s":68,"l":40}],["Scarlet",{"h":352,"s":99,"l":37}],["Sea",{"h":175,"s":44,"l":42}],["SeaBlue",{"h":194,"s":95,"l":30}],["SeaGreen",{"h":148,"s":97,"l":66}],["Seafoam",{"h":142,"s":91,"l":74}],["SeafoamBlue",{"h":162,"s":49,"l":65}],["SeafoamGreen",{"h":143,"s":91,"l":73}],["Seaweed",{"h":152,"s":79,"l":46}],["SeaweedGreen",{"h":147,"s":53,"l":44}],["Sepia",{"h":28,"s":56,"l":38}],["Shamrock",{"h":145,"s":99,"l":35}],["ShamrockGreen",{"h":144,"s":98,"l":38}],["Shit",{"h":45,"s":100,"l":25}],["ShitBrown",{"h":42,"s":94,"l":25}],["ShitGreen",{"h":65,"s":100,"l":25}],["ShockingPink",{"h":322,"s":99,"l":50}],["SickGreen",{"h":72,"s":62,"l":45}],["SicklyGreen",{"h":72,"s":73,"l":40}],["SicklyYellow",{"h":66,"s":78,"l":53}],["Sienna",{"h":24,"s":70,"l":39}],["Silver",{"h":150,"s":4,"l":78}],["Sky",{"h":205,"s":95,"l":75}],["SkyBlue",{"h":209,"s":97,"l":73}],["Slate",{"h":204,"s":17,"l":38}],["SlateBlue",{"h":208,"s":25,"l":48}],["SlateGreen",{"h":132,"s":17,"l":47}],["SlateGrey",{"h":204,"s":10,"l":39}],["SlimeGreen",{"h":75,"s":96,"l":41}],["Snot",{"h":65,"s":87,"l":39}],["SnotGreen",{"h":71,"s":100,"l":38}],["SoftBlue",{"h":224,"s":76,"l":65}],["SoftGreen",{"h":125,"s":40,"l":60}],["SoftPink",{"h":348,"s":95,"l":84}],["SoftPurple",{"h":287,"s":32,"l":57}],["Spearmint",{"h":144,"s":94,"l":55}],["SpringGreen",{"h":95,"s":92,"l":71}],["Spruce",{"h":152,"s":81,"l":21}],["Squash",{"h":41,"s":89,"l":52}],["Steel",{"h":208,"s":14,"l":52}],["SteelBlue",{"h":207,"s":26,"l":48}],["SteelGrey",{"h":198,"s":11,"l":49}],["Stone",{"h":47,"s":19,"l":60}],["StormyBlue",{"h":206,"s":32,"l":46}],["Straw",{"h":57,"s":96,"l":73}],["Strawberry",{"h":353,"s":96,"l":57}],["StrongBlue",{"h":241,"s":95,"l":50}],["StrongPink",{"h":329,"s":100,"l":51}],["SunYellow",{"h":51,"s":100,"l":57}],["Sunflower",{"h":45,"s":100,"l":54}],["SunflowerYellow",{"h":51,"s":100,"l":51}],["SunnyYellow",{"h":58,"s":100,"l":55}],["SunshineYellow",{"h":59,"s":100,"l":61}],["Swamp",{"h":81,"s":39,"l":37}],["SwampGreen",{"h":68,"s":100,"l":26}],["Tan",{"h":41,"s":52,"l":63}],["TanBrown",{"h":32,"s":38,"l":48}],["TanGreen",{"h":76,"s":38,"l":59}],["Tangerine",{"h":34,"s":100,"l":52}],["Taupe",{"h":35,"s":29,"l":62}],["Tea",{"h":140,"s":29,"l":53}],["TeaGreen",{"h":102,"s":86,"l":81}],["Teal",{"h":175,"s":97,"l":29}],["TealBlue",{"h":189,"s":99,"l":31}],["TealGreen",{"h":155,"s":63,"l":39}],["Tealish",{"h":172,"s":68,"l":44}],["TealishGreen",{"h":150,"s":90,"l":45}],["TerraCotta",{"h":17,"s":57,"l":51}],["Terracota",{"h":16,"s":57,"l":53}],["Terracotta",{"h":16,"s":56,"l":52}],["TiffanyBlue",{"h":168,"s":82,"l":72}],["Tomato",{"h":8,"s":86,"l":54}],["TomatoRed",{"h":11,"s":99,"l":46}],["Topaz",{"h":176,"s":82,"l":40}],["Toupe",{"h":38,"s":40,"l":64}],["ToxicGreen",{"h":102,"s":73,"l":52}],["TreeGreen",{"h":110,"s":67,"l":30}],["TrueBlue",{"h":236,"s":99,"l":40}],["TrueGreen",{"h":118,"s":95,"l":30}],["Turquoise",{"h":173,"s":94,"l":39}],["TurquoiseBlue",{"h":186,"s":94,"l":40}],["TurquoiseGreen",{"h":153,"s":97,"l":49}],["TurtleGreen",{"h":98,"s":43,"l":52}],["Twilight",{"h":237,"s":28,"l":43}],["TwilightBlue",{"h":209,"s":85,"l":26}],["UglyBlue",{"h":204,"s":48,"l":37}],["UglyBrown",{"h":54,"s":95,"l":25}],["UglyGreen",{"h":72,"s":96,"l":30}],["UglyPink",{"h":350,"s":47,"l":63}],["UglyPurple",{"h":302,"s":43,"l":45}],["UglyYellow",{"h":56,"s":99,"l":41}],["Ultramarine",{"h":251,"s":100,"l":35}],["UltramarineBlue",{"h":245,"s":96,"l":44}],["Umber",{"h":34,"s":100,"l":35}],["Velvet",{"h":320,"s":87,"l":25}],["Vermillion",{"h":10,"s":91,"l":50}],["VeryDarkBlue",{"h":239,"s":100,"l":10}],["VeryDarkBrown",{"h":4,"s":100,"l":6}],["VeryDarkGreen",{"h":116,"s":88,"l":10}],["VeryDarkPurple",{"h":288,"s":96,"l":10}],["VeryLightBlue",{"h":180,"s":100,"l":92}],["VeryLightBrown",{"h":38,"s":48,"l":67}],["VeryLightGreen",{"h":102,"s":100,"l":87}],["VeryLightPink",{"h":9,"s":100,"l":97}],["VeryLightPurple",{"h":292,"s":88,"l":90}],["VeryPaleBlue",{"h":179,"s":100,"l":92}],["VeryPaleGreen",{"h":102,"s":94,"l":86}],["VibrantBlue",{"h":227,"s":98,"l":49}],["VibrantGreen",{"h":119,"s":93,"l":45}],["VibrantPurple",{"h":287,"s":97,"l":44}],["Violet",{"h":278,"s":89,"l":49}],["VioletBlue",{"h":262,"s":91,"l":41}],["VioletPink",{"h":300,"s":96,"l":68}],["VioletRed",{"h":329,"s":100,"l":32}],["Viridian",{"h":158,"s":66,"l":34}],["VividBlue",{"h":234,"s":100,"l":54}],["VividGreen",{"h":112,"s":87,"l":50}],["VividPurple",{"h":277,"s":100,"l":49}],["Vomit",{"h":61,"s":77,"l":36}],["VomitGreen",{"h":69,"s":96,"l":32}],["VomitYellow",{"h":58,"s":89,"l":41}],["WarmBlue",{"h":235,"s":67,"l":58}],["WarmBrown",{"h":31,"s":97,"l":30}],["WarmGrey",{"h":19,"s":8,"l":55}],["WarmPink",{"h":344,"s":95,"l":66}],["WarmPurple",{"h":303,"s":53,"l":38}],["WashedOutGreen",{"h":103,"s":80,"l":81}],["WaterBlue",{"h":202,"s":87,"l":43}],["Watermelon",{"h":354,"s":98,"l":63}],["WeirdGreen",{"h":144,"s":77,"l":56}],["Wheat",{"h":46,"s":94,"l":74}],["White",{"h":0,"s":0,"l":100}],["WindowsBlue",{"h":211,"s":55,"l":48}],["Wine",{"h":331,"s":98,"l":25}],["WineRed",{"h":344,"s":95,"l":25}],["Wintergreen",{"h":148,"s":95,"l":55}],["Wisteria",{"h":277,"s":36,"l":63}],["Yellow",{"h":68,"s":93,"l":42}],["Yellow",{"h":60,"s":100,"l":54}],["YellowBrown",{"h":49,"s":100,"l":36}],["YellowGreen",{"h":77,"s":96,"l":58}],["YellowOchre",{"h":46,"s":94,"l":41}],["YellowOrange",{"h":42,"s":99,"l":50}],["YellowTan",{"h":48,"s":100,"l":72}],["Yellowgreen",{"h":76,"s":95,"l":52}],["Yellowish",{"h":55,"s":94,"l":69}],["YellowishBrown",{"h":47,"s":99,"l":31}],["YellowishGreen",{"h":74,"s":82,"l":48}],["YellowishOrange",{"h":39,"s":100,"l":53}],["YellowishTan",{"h":60,"s":95,"l":75}],["YellowyBrown",{"h":47,"s":87,"l":36}],["YellowyGreen",{"h":75,"s":88,"l":55}]]
	;

	Object.assign(color.prototype, {
	  toString (model) {
	    // console.log('model', model)
	    const color$$1 = this.alpha(Math.round(this.valpha * 100) / 100);
	    switch (model) {
	      case 'hex':
	        return color$$1.hex()
	      case 'zaa':
	        const [h, s, l] = color$$1.hsl().round().array().map((a) => a / 10);
	        return '$' + h.toString(36) + s.toString(11) + l.toString(11)
	      case 'rgb':
	      case 'hsl':
	        return color$$1[model]().string(0)
	      case 'prgb':
	      case '%':
	        return color$$1.percentString(0)
	      case 'hsv':
	      case 'hwb':
	      case 'xyz':
	      case 'lab':
	        let str = model;
	        const arr = color$$1[model]().round().array();
	        if (color$$1.valpha !== 1) {
	          str += 'a';
	        }
	        if (/hsv|hwb/.test(model)) {
	          arr[1] += '%';
	          arr[2] += '%';
	        }
	        return str + `(${arr.join(', ')})`
	      case 'cmyk':
	        const cmyk = color$$1.cmyk().round().array();
	        return `cmyk(${cmyk.join(', ')})`
	      default:
	        return color$$1.string(0)
	    }
	  },
	});

	class Color$1 extends color {
	  constructor (param, model) {
	    const match = typeof param === 'string' && param.replace(/\s*/g, '').match(
	      /(hsv|hwb|xyz|lab|cmyk)a?\([-+]?(\d+),-?(\d+)%?,-?(\d+)%?(?:,([.\d]+))?\)/i
	    );
	    if (match) {
	      param = match.slice(2);
	      param[3] = param[3] == null ? 1 : param[3] || 0;
	      model = match[1];
	      param = param.map((a) => +a || 0);
	    } else {
	      // $zaa code
	      const match = typeof param === 'string' && param.replace(/\s*/g, '').match(
	        /^\$([0-9a-z]\d)([0-9a]\d)([0-9a]\d)|\$([0-9a-z])([0-9a])([0-9a])$/i
	      );
	      if (match) {
	        const [h, s, l] = match[1] ? match.slice(1) : match.slice(4);
	        param = [
	          parseInt(h[0], 36) * 10 + parseInt(h[1] | 0, 10),
	          parseInt(s[0], 11) * 10 + parseInt(s[1] | 0, 10),
	          parseInt(l[0], 11) * 10 + parseInt(l[1] | 0, 10)
	        ];
	        model = 'hsl';
	      }
	    }
	    super(param, model);
	  }
	  toJSON () {
	    if (this.valpha !== 1) {
	      return this.hex() + Math.round(this.valpha * 255).toString(16)
	    }
	    return this.hex() // this[this.model]().round(2).object()
	  }
	  nearColorName () {
	    const hsl = this.hsl().alpha(1).object();
	    let difference = 50;
	    let name = '';
	    xkcd.forEach(([_name, _hsl]) => {
	      let diff = 0;
	      // gray
	      if (hsl.s < 5) {
	        diff += Math.abs(hsl.s - _hsl.s);
	        if (diff < 5) {
	          diff += Math.abs(hsl.l - _hsl.l);
	          if (diff < difference) {
	            difference = diff;
	            name = _name;
	          }
	          return
	        }
	        diff = 0;
	      }

	      for (const key in hsl) {
	        diff += Math.abs(hsl[key] - _hsl[key]);
	      }
	      if (diff < difference) {
	        difference = diff;
	        name = _name;
	      }
	    });
	    return name
	  }
	  /**
	   * Alpha Blending in CSS
	   *
	   * <-back   layer   front->
	   * Color.alphaBlending('rgba(...)', txtColor)
	   *
	   * @export
	   * @param {Color} colors indexが深いほど手前。index0が一番奥の色
	   * @see https://engineering.canva.com/2017/12/04/WebGL-David-Guan/
	   * @returns
	   */
	  alphaBlending (...colors) {
	    return new Color$1(
	      [this, ...colors]
	        .map((color$$1) => new Color$1(color$$1).rgb().array())
	        .reduce((back, front) => {
	          const color$$1 = [];
	          const a = front[3] == null ? 1 : front[3];
	          for (let i = 0; i < 3; i++) {
	            color$$1[i] = front[i] * a + back[i] * (1 - a);
	          }
	          return color$$1
	        }, [255, 255, 255, 1])
	    )
	  }
	  contrast (txtColor) {
	    let bgColor = this;
	    if (this.valpha !== 1 && txtColor.valpha !== 1) {
	      bgColor = this.alphaBlending();
	      txtColor = bgColor.alphaBlending(txtColor);
	    } else {
	      bgColor = this.valpha === 1 ? this : txtColor.alphaBlending(this);
	      txtColor = txtColor.valpha === 1 ? txtColor : this.alphaBlending(txtColor);
	    }
	    const lum1 = bgColor.luminosity();
	    const lum2 = txtColor.luminosity();

	    if (lum1 > lum2) return (lum1 + 0.05) / (lum2 + 0.05)
	    return (lum2 + 0.05) / (lum1 + 0.05)
	  }
	  mostReadable (...colors) {
	    let mostlum = 0;
	    let mostread;
	    for (const color$$1 of colors) {
	      const contrast = this.contrast(new Color$1(color$$1));
	      if (mostlum < contrast) {
	        mostlum = contrast;
	        mostread = color$$1;
	      }
	    }
	    return mostread
	  }
	}

	Color$1.random = function () {
	  return new Color$1('#' + Math.random().toString(16).slice(2, 8))
	};

	/// © 2015 Nathan Rugg <nmrugg@gmail.com> | MIT
	/// See LICENSE for more details.

	/* jshint noarg:true, boss:true, unused:strict, strict:true, undef:true, noarg: true, forin:true, evil:true, newcap:false, -W041, -W021, worker:true, browser:true, node:true */

	/* global setImmediate, setTimeout, window, onmessage */

	/** xs */
	///NOTE: This is the master file that is used to generate lzma-c.js and lzma-d.js.
	///      Comments are used to determine which parts are to be removed.
	///
	/// cs-ce (compression start-end)
	/// ds-de (decompression start-end)
	/// xs-xe (only in this file start-end)
	/// co    (compression only)
	/// do    (decompression only)
	/** xe */

	var LZMA$1 = (function () {
	    
	    var /** cs */
	        action_compress   = 1,
	        /** ce */
	        /** ds */
	        action_decompress = 2,
	        /** de */
	        action_progress   = 3,
	        wait = typeof setImmediate == "function" ? setImmediate : setTimeout,
	        __4294967296 = 4294967296,
	        N1_longLit = [4294967295, -__4294967296],
	        /** cs */
	        MIN_VALUE = [0, -9223372036854775808],
	        /** ce */
	        P0_longLit = [0, 0],
	        P1_longLit = [1, 0];
	    
	    function update_progress(percent, cbn) {
	        postMessage({
	            action: action_progress,
	            cbn: cbn,
	            result: percent
	        });
	    }
	    
	    function initDim(len) {
	        ///NOTE: This is MUCH faster than "new Array(len)" in newer versions of v8 (starting with Node.js 0.11.15, which uses v8 3.28.73).
	        var a = [];
	        a[len - 1] = undefined;
	        return a;
	    }
	    
	    function add(a, b) {
	        return create(a[0] + b[0], a[1] + b[1]);
	    }
	    
	    /** cs */
	    function and(a, b) {
	        return makeFromBits(~~Math.max(Math.min(a[1] / __4294967296, 2147483647), -2147483648) & ~~Math.max(Math.min(b[1] / __4294967296, 2147483647), -2147483648), lowBits_0(a) & lowBits_0(b));
	    }
	    /** ce */
	    
	    function compare(a, b) {
	        var nega, negb;
	        if (a[0] == b[0] && a[1] == b[1]) {
	            return 0;
	        }
	        nega = a[1] < 0;
	        negb = b[1] < 0;
	        if (nega && !negb) {
	            return -1;
	        }
	        if (!nega && negb) {
	            return 1;
	        }
	        if (sub(a, b)[1] < 0) {
	            return -1;
	        }
	        return 1;
	    }
	    
	    function create(valueLow, valueHigh) {
	        var diffHigh, diffLow;
	        valueHigh %= 1.8446744073709552E19;
	        valueLow %= 1.8446744073709552E19;
	        diffHigh = valueHigh % __4294967296;
	        diffLow = Math.floor(valueLow / __4294967296) * __4294967296;
	        valueHigh = valueHigh - diffHigh + diffLow;
	        valueLow = valueLow - diffLow + diffHigh;
	        while (valueLow < 0) {
	            valueLow += __4294967296;
	            valueHigh -= __4294967296;
	        }
	        while (valueLow > 4294967295) {
	            valueLow -= __4294967296;
	            valueHigh += __4294967296;
	        }
	        valueHigh = valueHigh % 1.8446744073709552E19;
	        while (valueHigh > 9223372032559808512) {
	            valueHigh -= 1.8446744073709552E19;
	        }
	        while (valueHigh < -9223372036854775808) {
	            valueHigh += 1.8446744073709552E19;
	        }
	        return [valueLow, valueHigh];
	    }
	    
	    /** cs */
	    function eq(a, b) {
	        return a[0] == b[0] && a[1] == b[1];
	    }
	    /** ce */
	    function fromInt(value) {
	        if (value >= 0) {
	            return [value, 0];
	        } else {
	            return [value + __4294967296, -__4294967296];
	        }
	    }
	    
	    function lowBits_0(a) {
	        if (a[0] >= 2147483648) {
	            return ~~Math.max(Math.min(a[0] - __4294967296, 2147483647), -2147483648);
	        } else {
	            return ~~Math.max(Math.min(a[0], 2147483647), -2147483648);
	        }
	    }
	    /** cs */
	    function makeFromBits(highBits, lowBits) {
	        var high, low;
	        high = highBits * __4294967296;
	        low = lowBits;
	        if (lowBits < 0) {
	            low += __4294967296;
	        }
	        return [low, high];
	    }
	    
	    function pwrAsDouble(n) {
	        if (n <= 30) {
	            return 1 << n;
	        } else {
	            return pwrAsDouble(30) * pwrAsDouble(n - 30);
	        }
	    }
	    
	    function shl(a, n) {
	        var diff, newHigh, newLow, twoToN;
	        n &= 63;
	        if (eq(a, MIN_VALUE)) {
	            if (!n) {
	                return a;
	            }
	            return P0_longLit;
	        }
	        if (a[1] < 0) {
	            throw new Error("Neg");
	        }
	        twoToN = pwrAsDouble(n);
	        newHigh = a[1] * twoToN % 1.8446744073709552E19;
	        newLow = a[0] * twoToN;
	        diff = newLow - newLow % __4294967296;
	        newHigh += diff;
	        newLow -= diff;
	        if (newHigh >= 9223372036854775807) {
	            newHigh -= 1.8446744073709552E19;
	        }
	        return [newLow, newHigh];
	    }
	    
	    function shr(a, n) {
	        var shiftFact;
	        n &= 63;
	        shiftFact = pwrAsDouble(n);
	        return create(Math.floor(a[0] / shiftFact), a[1] / shiftFact);
	    }
	    
	    function shru(a, n) {
	        var sr;
	        n &= 63;
	        sr = shr(a, n);
	        if (a[1] < 0) {
	            sr = add(sr, shl([2, 0], 63 - n));
	        }
	        return sr;
	    }
	    
	    /** ce */
	    
	    function sub(a, b) {
	        return create(a[0] - b[0], a[1] - b[1]);
	    }
	    
	    function $ByteArrayInputStream(this$static, buf) {
	        this$static.buf = buf;
	        this$static.pos = 0;
	        this$static.count = buf.length;
	        return this$static;
	    }
	    
	    /** ds */
	    function $read(this$static) {
	        if (this$static.pos >= this$static.count)
	            return -1;
	        return this$static.buf[this$static.pos++] & 255;
	    }
	    /** de */
	    /** cs */
	    function $read_0(this$static, buf, off, len) {
	        if (this$static.pos >= this$static.count)
	            return -1;
	        len = Math.min(len, this$static.count - this$static.pos);
	        arraycopy(this$static.buf, this$static.pos, buf, off, len);
	        this$static.pos += len;
	        return len;
	    }
	    /** ce */
	    
	    function $ByteArrayOutputStream(this$static) {
	        this$static.buf = initDim(32);
	        this$static.count = 0;
	        return this$static;
	    }
	    
	    function $toByteArray(this$static) {
	        var data = this$static.buf;
	        data.length = this$static.count;
	        return data;
	    }
	    
	    /** cs */
	    function $write(this$static, b) {
	        this$static.buf[this$static.count++] = b << 24 >> 24;
	    }
	    /** ce */
	    
	    function $write_0(this$static, buf, off, len) {
	        arraycopy(buf, off, this$static.buf, this$static.count, len);
	        this$static.count += len;
	    }
	    
	    /** cs */
	    function $getChars(this$static, srcBegin, srcEnd, dst, dstBegin) {
	        var srcIdx;
	        for (srcIdx = srcBegin; srcIdx < srcEnd; ++srcIdx) {
	            dst[dstBegin++] = this$static.charCodeAt(srcIdx);
	        }
	    }
	    /** ce */
	    
	    function arraycopy(src, srcOfs, dest, destOfs, len) {
	        for (var i = 0; i < len; ++i) {
	            dest[destOfs + i] = src[srcOfs + i];
	        }
	    }
	    
	    /** cs */
	    function $configure(this$static, encoder) {
	        $SetDictionarySize_0(encoder, 1 << this$static.s);
	        encoder._numFastBytes = this$static.f;
	        $SetMatchFinder(encoder, this$static.m);
	        
	        /// lc is always 3
	        /// lp is always 0
	        /// pb is always 2
	        encoder._numLiteralPosStateBits = 0;
	        encoder._numLiteralContextBits = 3;
	        encoder._posStateBits = 2;
	        ///this$static._posStateMask = (1 << pb) - 1;
	        encoder._posStateMask = 3;
	    }
	    
	    function $init(this$static, input, output, length_0, mode) {
	        var encoder, i;
	        if (compare(length_0, N1_longLit) < 0)
	            throw new Error("invalid length " + length_0);
	        this$static.length_0 = length_0;
	        encoder = $Encoder({});
	        $configure(mode, encoder);
	        encoder._writeEndMark = typeof LZMA$1.disableEndMark == "undefined";
	        $WriteCoderProperties(encoder, output);
	        for (i = 0; i < 64; i += 8)
	            $write(output, lowBits_0(shr(length_0, i)) & 255);
	        this$static.chunker = (encoder._needReleaseMFStream = 0 , (encoder._inStream = input , encoder._finished = 0 , $Create_2(encoder) , encoder._rangeEncoder.Stream = output , $Init_4(encoder) , $FillDistancesPrices(encoder) , $FillAlignPrices(encoder) , encoder._lenEncoder._tableSize = encoder._numFastBytes + 1 - 2 , $UpdateTables(encoder._lenEncoder, 1 << encoder._posStateBits) , encoder._repMatchLenEncoder._tableSize = encoder._numFastBytes + 1 - 2 , $UpdateTables(encoder._repMatchLenEncoder, 1 << encoder._posStateBits) , encoder.nowPos64 = P0_longLit , undefined) , $Chunker_0({}, encoder));
	    }
	    
	    function $LZMAByteArrayCompressor(this$static, data, mode) {
	        this$static.output = $ByteArrayOutputStream({});
	        $init(this$static, $ByteArrayInputStream({}, data), this$static.output, fromInt(data.length), mode);
	        return this$static;
	    }
	    /** ce */
	    
	    /** ds */
	    function $init_0(this$static, input, output) {
	        var decoder,
	            hex_length = "",
	            i,
	            properties = [],
	            r,
	            tmp_length;
	        
	        for (i = 0; i < 5; ++i) {
	            r = $read(input);
	            if (r == -1)
	                throw new Error("truncated input");
	            properties[i] = r << 24 >> 24;
	        }
	        
	        decoder = $Decoder({});
	        if (!$SetDecoderProperties(decoder, properties)) {
	            throw new Error("corrupted input");
	        }
	        for (i = 0; i < 64; i += 8) {
	            r = $read(input);
	            if (r == -1)
	                throw new Error("truncated input");
	            r = r.toString(16);
	            if (r.length == 1) r = "0" + r;
	            hex_length = r + "" + hex_length;
	        }
	        
	        /// Was the length set in the header (if it was compressed from a stream, the length is all f"s).
	        if (/^0+$|^f+$/i.test(hex_length)) {
	            /// The length is unknown, so set to -1.
	            this$static.length_0 = N1_longLit;
	        } else {
	            ///NOTE: If there is a problem with the decoder because of the length, you can always set the length to -1 (N1_longLit) which means unknown.
	            tmp_length = parseInt(hex_length, 16);
	            /// If the length is too long to handle, just set it to unknown.
	            if (tmp_length > 4294967295) {
	                this$static.length_0 = N1_longLit;
	            } else {
	                this$static.length_0 = fromInt(tmp_length);
	            }
	        }
	        
	        this$static.chunker = $CodeInChunks(decoder, input, output, this$static.length_0);
	    }
	    
	    function $LZMAByteArrayDecompressor(this$static, data) {
	        this$static.output = $ByteArrayOutputStream({});
	        $init_0(this$static, $ByteArrayInputStream({}, data), this$static.output);
	        return this$static;
	    }
	    /** de */
	    /** cs */
	    function $Create_4(this$static, keepSizeBefore, keepSizeAfter, keepSizeReserv) {
	        var blockSize;
	        this$static._keepSizeBefore = keepSizeBefore;
	        this$static._keepSizeAfter = keepSizeAfter;
	        blockSize = keepSizeBefore + keepSizeAfter + keepSizeReserv;
	        if (this$static._bufferBase == null || this$static._blockSize != blockSize) {
	            this$static._bufferBase = null;
	            this$static._blockSize = blockSize;
	            this$static._bufferBase = initDim(this$static._blockSize);
	        }
	        this$static._pointerToLastSafePosition = this$static._blockSize - keepSizeAfter;
	    }
	    
	    function $GetIndexByte(this$static, index) {
	        return this$static._bufferBase[this$static._bufferOffset + this$static._pos + index];
	    }
	    
	    function $GetMatchLen(this$static, index, distance, limit) {
	        var i, pby;
	        if (this$static._streamEndWasReached) {
	            if (this$static._pos + index + limit > this$static._streamPos) {
	                limit = this$static._streamPos - (this$static._pos + index);
	            }
	        }
	        ++distance;
	        pby = this$static._bufferOffset + this$static._pos + index;
	        for (i = 0; i < limit && this$static._bufferBase[pby + i] == this$static._bufferBase[pby + i - distance]; ++i) {
	        }
	        return i;
	    }
	    
	    function $GetNumAvailableBytes(this$static) {
	        return this$static._streamPos - this$static._pos;
	    }
	    
	    function $MoveBlock(this$static) {
	        var i, numBytes, offset;
	        offset = this$static._bufferOffset + this$static._pos - this$static._keepSizeBefore;
	        if (offset > 0) {
	            --offset;
	        }
	        numBytes = this$static._bufferOffset + this$static._streamPos - offset;
	        for (i = 0; i < numBytes; ++i) {
	            this$static._bufferBase[i] = this$static._bufferBase[offset + i];
	        }
	        this$static._bufferOffset -= offset;
	    }
	    
	    function $MovePos_1(this$static) {
	        var pointerToPostion;
	        ++this$static._pos;
	        if (this$static._pos > this$static._posLimit) {
	            pointerToPostion = this$static._bufferOffset + this$static._pos;
	            if (pointerToPostion > this$static._pointerToLastSafePosition) {
	                $MoveBlock(this$static);
	            }
	            $ReadBlock(this$static);
	        }
	    }
	    
	    function $ReadBlock(this$static) {
	        var numReadBytes, pointerToPostion, size;
	        if (this$static._streamEndWasReached)
	            return;
	        while (1) {
	            size = -this$static._bufferOffset + this$static._blockSize - this$static._streamPos;
	            if (!size)
	                return;
	            numReadBytes = $read_0(this$static._stream, this$static._bufferBase, this$static._bufferOffset + this$static._streamPos, size);
	            if (numReadBytes == -1) {
	                this$static._posLimit = this$static._streamPos;
	                pointerToPostion = this$static._bufferOffset + this$static._posLimit;
	                if (pointerToPostion > this$static._pointerToLastSafePosition) {
	                    this$static._posLimit = this$static._pointerToLastSafePosition - this$static._bufferOffset;
	                }
	                this$static._streamEndWasReached = 1;
	                return;
	            }
	            this$static._streamPos += numReadBytes;
	            if (this$static._streamPos >= this$static._pos + this$static._keepSizeAfter) {
	                this$static._posLimit = this$static._streamPos - this$static._keepSizeAfter;
	            }
	        }
	    }
	    
	    function $ReduceOffsets(this$static, subValue) {
	        this$static._bufferOffset += subValue;
	        this$static._posLimit -= subValue;
	        this$static._pos -= subValue;
	        this$static._streamPos -= subValue;
	    }
	    
	    var CrcTable = (function () {
	        var i, j, r, CrcTable = [];
	        for (i = 0; i < 256; ++i) {
	            r = i;
	            for (j = 0; j < 8; ++j)
	            if ((r & 1) != 0) {
	                r = r >>> 1 ^ -306674912;
	            } else {
	                r >>>= 1;
	            }
	            CrcTable[i] = r;
	        }
	        return CrcTable;
	    }());
	    
	    function $Create_3(this$static, historySize, keepAddBufferBefore, matchMaxLen, keepAddBufferAfter) {
	        var cyclicBufferSize, hs, windowReservSize;
	        if (historySize < 1073741567) {
	            this$static._cutValue = 16 + (matchMaxLen >> 1);
	            windowReservSize = ~~((historySize + keepAddBufferBefore + matchMaxLen + keepAddBufferAfter) / 2) + 256;
	            $Create_4(this$static, historySize + keepAddBufferBefore, matchMaxLen + keepAddBufferAfter, windowReservSize);
	            this$static._matchMaxLen = matchMaxLen;
	            cyclicBufferSize = historySize + 1;
	            if (this$static._cyclicBufferSize != cyclicBufferSize) {
	                this$static._son = initDim((this$static._cyclicBufferSize = cyclicBufferSize) * 2);
	            }
	    
	            hs = 65536;
	            if (this$static.HASH_ARRAY) {
	                hs = historySize - 1;
	                hs |= hs >> 1;
	                hs |= hs >> 2;
	                hs |= hs >> 4;
	                hs |= hs >> 8;
	                hs >>= 1;
	                hs |= 65535;
	                if (hs > 16777216)
	                hs >>= 1;
	                this$static._hashMask = hs;
	                ++hs;
	                hs += this$static.kFixHashSize;
	            }
	            
	            if (hs != this$static._hashSizeSum) {
	                this$static._hash = initDim(this$static._hashSizeSum = hs);
	            }
	        }
	    }
	    
	    function $GetMatches(this$static, distances) {
	        var count, cur, curMatch, curMatch2, curMatch3, cyclicPos, delta, hash2Value, hash3Value, hashValue, len, len0, len1, lenLimit, matchMinPos, maxLen, offset, pby1, ptr0, ptr1, temp;
	        if (this$static._pos + this$static._matchMaxLen <= this$static._streamPos) {
	            lenLimit = this$static._matchMaxLen;
	        } else {
	            lenLimit = this$static._streamPos - this$static._pos;
	            if (lenLimit < this$static.kMinMatchCheck) {
	                $MovePos_0(this$static);
	                return 0;
	            }
	        }
	        offset = 0;
	        matchMinPos = this$static._pos > this$static._cyclicBufferSize?this$static._pos - this$static._cyclicBufferSize:0;
	        cur = this$static._bufferOffset + this$static._pos;
	        maxLen = 1;
	        hash2Value = 0;
	        hash3Value = 0;
	        if (this$static.HASH_ARRAY) {
	            temp = CrcTable[this$static._bufferBase[cur] & 255] ^ this$static._bufferBase[cur + 1] & 255;
	            hash2Value = temp & 1023;
	            temp ^= (this$static._bufferBase[cur + 2] & 255) << 8;
	            hash3Value = temp & 65535;
	            hashValue = (temp ^ CrcTable[this$static._bufferBase[cur + 3] & 255] << 5) & this$static._hashMask;
	        } else {
	            hashValue = this$static._bufferBase[cur] & 255 ^ (this$static._bufferBase[cur + 1] & 255) << 8;
	        }

	        curMatch = this$static._hash[this$static.kFixHashSize + hashValue] || 0;
	        if (this$static.HASH_ARRAY) {
	            curMatch2 = this$static._hash[hash2Value] || 0;
	            curMatch3 = this$static._hash[1024 + hash3Value] || 0;
	            this$static._hash[hash2Value] = this$static._pos;
	            this$static._hash[1024 + hash3Value] = this$static._pos;
	            if (curMatch2 > matchMinPos) {
	                if (this$static._bufferBase[this$static._bufferOffset + curMatch2] == this$static._bufferBase[cur]) {
	                    distances[offset++] = maxLen = 2;
	                    distances[offset++] = this$static._pos - curMatch2 - 1;
	                }
	            }
	            if (curMatch3 > matchMinPos) {
	                if (this$static._bufferBase[this$static._bufferOffset + curMatch3] == this$static._bufferBase[cur]) {
	                    if (curMatch3 == curMatch2) {
	                        offset -= 2;
	                    }
	                    distances[offset++] = maxLen = 3;
	                    distances[offset++] = this$static._pos - curMatch3 - 1;
	                    curMatch2 = curMatch3;
	                }
	            }
	            if (offset != 0 && curMatch2 == curMatch) {
	                offset -= 2;
	                maxLen = 1;
	            }
	        }
	        this$static._hash[this$static.kFixHashSize + hashValue] = this$static._pos;
	        ptr0 = (this$static._cyclicBufferPos << 1) + 1;
	        ptr1 = this$static._cyclicBufferPos << 1;
	        len0 = len1 = this$static.kNumHashDirectBytes;
	        if (this$static.kNumHashDirectBytes != 0) {
	            if (curMatch > matchMinPos) {
	                if (this$static._bufferBase[this$static._bufferOffset + curMatch + this$static.kNumHashDirectBytes] != this$static._bufferBase[cur + this$static.kNumHashDirectBytes]) {
	                    distances[offset++] = maxLen = this$static.kNumHashDirectBytes;
	                    distances[offset++] = this$static._pos - curMatch - 1;
	                }
	            }
	        }
	        count = this$static._cutValue;
	        while (1) {
	            if (curMatch <= matchMinPos || count-- == 0) {
	                this$static._son[ptr0] = this$static._son[ptr1] = 0;
	                break;
	            }
	            delta = this$static._pos - curMatch;
	            cyclicPos = (delta <= this$static._cyclicBufferPos?this$static._cyclicBufferPos - delta:this$static._cyclicBufferPos - delta + this$static._cyclicBufferSize) << 1;
	            pby1 = this$static._bufferOffset + curMatch;
	            len = len0 < len1?len0:len1;
	            if (this$static._bufferBase[pby1 + len] == this$static._bufferBase[cur + len]) {
	                while (++len != lenLimit) {
	                    if (this$static._bufferBase[pby1 + len] != this$static._bufferBase[cur + len]) {
	                        break;
	                    }
	                }
	                if (maxLen < len) {
	                    distances[offset++] = maxLen = len;
	                    distances[offset++] = delta - 1;
	                    if (len == lenLimit) {
	                    this$static._son[ptr1] = this$static._son[cyclicPos];
	                    this$static._son[ptr0] = this$static._son[cyclicPos + 1];
	                    break;
	                    }
	                }
	            }
	            if ((this$static._bufferBase[pby1 + len] & 255) < (this$static._bufferBase[cur + len] & 255)) {
	                this$static._son[ptr1] = curMatch;
	                ptr1 = cyclicPos + 1;
	                curMatch = this$static._son[ptr1];
	                len1 = len;
	            } else {
	                this$static._son[ptr0] = curMatch;
	                ptr0 = cyclicPos;
	                curMatch = this$static._son[ptr0];
	                len0 = len;
	            }
	        }
	        $MovePos_0(this$static);
	        return offset;
	    }
	    
	    function $Init_5(this$static) {
	        this$static._bufferOffset = 0;
	        this$static._pos = 0;
	        this$static._streamPos = 0;
	        this$static._streamEndWasReached = 0;
	        $ReadBlock(this$static);
	        this$static._cyclicBufferPos = 0;
	        $ReduceOffsets(this$static, -1);
	    }
	    
	    function $MovePos_0(this$static) {
	        var subValue;
	        if (++this$static._cyclicBufferPos >= this$static._cyclicBufferSize) {
	            this$static._cyclicBufferPos = 0;
	        }
	        $MovePos_1(this$static);
	        if (this$static._pos == 1073741823) {
	            subValue = this$static._pos - this$static._cyclicBufferSize;
	            $NormalizeLinks(this$static._son, this$static._cyclicBufferSize * 2, subValue);
	            $NormalizeLinks(this$static._hash, this$static._hashSizeSum, subValue);
	            $ReduceOffsets(this$static, subValue);
	        }
	    }
	    
	    ///NOTE: This is only called after reading one whole gigabyte.
	    function $NormalizeLinks(items, numItems, subValue) {
	        var i, value;
	        for (i = 0; i < numItems; ++i) {
	            value = items[i] || 0;
	            if (value <= subValue) {
	                value = 0;
	            } else {
	                value -= subValue;
	            }
	            items[i] = value;
	        }
	    }
	    
	    function $SetType(this$static, numHashBytes) {
	        this$static.HASH_ARRAY = numHashBytes > 2;
	        if (this$static.HASH_ARRAY) {
	            this$static.kNumHashDirectBytes = 0;
	            this$static.kMinMatchCheck = 4;
	            this$static.kFixHashSize = 66560;
	        } else {
	            this$static.kNumHashDirectBytes = 2;
	            this$static.kMinMatchCheck = 3;
	            this$static.kFixHashSize = 0;
	        }
	    }
	    
	    function $Skip(this$static, num) {
	        var count, cur, curMatch, cyclicPos, delta, hash2Value, hash3Value, hashValue, len, len0, len1, lenLimit, matchMinPos, pby1, ptr0, ptr1, temp;
	        do {
	            if (this$static._pos + this$static._matchMaxLen <= this$static._streamPos) {
	                lenLimit = this$static._matchMaxLen;
	            } else {
	                lenLimit = this$static._streamPos - this$static._pos;
	                if (lenLimit < this$static.kMinMatchCheck) {
	                    $MovePos_0(this$static);
	                    continue;
	                }
	            }
	            matchMinPos = this$static._pos > this$static._cyclicBufferSize?this$static._pos - this$static._cyclicBufferSize:0;
	            cur = this$static._bufferOffset + this$static._pos;
	            if (this$static.HASH_ARRAY) {
	                temp = CrcTable[this$static._bufferBase[cur] & 255] ^ this$static._bufferBase[cur + 1] & 255;
	                hash2Value = temp & 1023;
	                this$static._hash[hash2Value] = this$static._pos;
	                temp ^= (this$static._bufferBase[cur + 2] & 255) << 8;
	                hash3Value = temp & 65535;
	                this$static._hash[1024 + hash3Value] = this$static._pos;
	                hashValue = (temp ^ CrcTable[this$static._bufferBase[cur + 3] & 255] << 5) & this$static._hashMask;
	            } else {
	                hashValue = this$static._bufferBase[cur] & 255 ^ (this$static._bufferBase[cur + 1] & 255) << 8;
	            }
	            curMatch = this$static._hash[this$static.kFixHashSize + hashValue];
	            this$static._hash[this$static.kFixHashSize + hashValue] = this$static._pos;
	            ptr0 = (this$static._cyclicBufferPos << 1) + 1;
	            ptr1 = this$static._cyclicBufferPos << 1;
	            len0 = len1 = this$static.kNumHashDirectBytes;
	            count = this$static._cutValue;
	            while (1) {
	                if (curMatch <= matchMinPos || count-- == 0) {
	                    this$static._son[ptr0] = this$static._son[ptr1] = 0;
	                    break;
	                }
	                delta = this$static._pos - curMatch;
	                cyclicPos = (delta <= this$static._cyclicBufferPos?this$static._cyclicBufferPos - delta:this$static._cyclicBufferPos - delta + this$static._cyclicBufferSize) << 1;
	                pby1 = this$static._bufferOffset + curMatch;
	                len = len0 < len1?len0:len1;
	                if (this$static._bufferBase[pby1 + len] == this$static._bufferBase[cur + len]) {
	                    while (++len != lenLimit) {
	                        if (this$static._bufferBase[pby1 + len] != this$static._bufferBase[cur + len]) {
	                            break;
	                        }
	                    }
	                    if (len == lenLimit) {
	                        this$static._son[ptr1] = this$static._son[cyclicPos];
	                        this$static._son[ptr0] = this$static._son[cyclicPos + 1];
	                        break;
	                    }
	                }
	                if ((this$static._bufferBase[pby1 + len] & 255) < (this$static._bufferBase[cur + len] & 255)) {
	                    this$static._son[ptr1] = curMatch;
	                    ptr1 = cyclicPos + 1;
	                    curMatch = this$static._son[ptr1];
	                    len1 = len;
	                } else {
	                    this$static._son[ptr0] = curMatch;
	                    ptr0 = cyclicPos;
	                    curMatch = this$static._son[ptr0];
	                    len0 = len;
	                }
	            }
	            $MovePos_0(this$static);
	        }
	        while (--num != 0);
	    }
	    
	    /** ce */
	    /** ds */
	    function $CopyBlock(this$static, distance, len) {
	        var pos = this$static._pos - distance - 1;
	        if (pos < 0) {
	            pos += this$static._windowSize;
	        }
	        for (; len != 0; --len) {
	            if (pos >= this$static._windowSize) {
	                pos = 0;
	            }
	            this$static._buffer[this$static._pos++] = this$static._buffer[pos++];
	            if (this$static._pos >= this$static._windowSize) {
	                $Flush_0(this$static);
	            }
	        }
	    }
	    
	    function $Create_5(this$static, windowSize) {
	        if (this$static._buffer == null || this$static._windowSize != windowSize) {
	            this$static._buffer = initDim(windowSize);
	        }
	        this$static._windowSize = windowSize;
	        this$static._pos = 0;
	        this$static._streamPos = 0;
	    }
	    
	    function $Flush_0(this$static) {
	        var size = this$static._pos - this$static._streamPos;
	        if (!size) {
	            return;
	        }
	        $write_0(this$static._stream, this$static._buffer, this$static._streamPos, size);
	        if (this$static._pos >= this$static._windowSize) {
	            this$static._pos = 0;
	        }
	        this$static._streamPos = this$static._pos;
	    }
	    
	    function $GetByte(this$static, distance) {
	        var pos = this$static._pos - distance - 1;
	        if (pos < 0) {
	            pos += this$static._windowSize;
	        }
	        return this$static._buffer[pos];
	    }
	    
	    function $PutByte(this$static, b) {
	        this$static._buffer[this$static._pos++] = b;
	        if (this$static._pos >= this$static._windowSize) {
	            $Flush_0(this$static);
	        }
	    }
	    
	    function $ReleaseStream(this$static) {
	        $Flush_0(this$static);
	        this$static._stream = null;
	    }
	    /** de */
	    
	    function GetLenToPosState(len) {
	        len -= 2;
	        if (len < 4) {
	            return len;
	        }
	        return 3;
	    }
	    
	    function StateUpdateChar(index) {
	        if (index < 4) {
	            return 0;
	        }
	        if (index < 10) {
	            return index - 3;
	        }
	        return index - 6;
	    }
	    
	    /** cs */
	    function $Chunker_0(this$static, encoder) {
	        this$static.encoder = encoder;
	        this$static.decoder = null;
	        this$static.alive = 1;
	        return this$static;
	    }
	    /** ce */
	    /** ds */
	    function $Chunker(this$static, decoder) {
	        this$static.decoder = decoder;
	        this$static.encoder = null;
	        this$static.alive = 1;
	        return this$static;
	    }
	    /** de */
	    
	    function $processChunk(this$static) {
	        if (!this$static.alive) {
	            throw new Error("bad state");
	        }
	        
	        if (this$static.encoder) {
	            /// do:throw new Error("No encoding");
	            /** cs */
	            $processEncoderChunk(this$static);
	            /** ce */
	        } else {
	            /// co:throw new Error("No decoding");
	            /** ds */
	            $processDecoderChunk(this$static);
	            /** de */
	        }
	        return this$static.alive;
	    }
	    
	    /** ds */
	    function $processDecoderChunk(this$static) {
	        var result = $CodeOneChunk(this$static.decoder);
	        if (result == -1) {
	            throw new Error("corrupted input");
	        }
	        this$static.inBytesProcessed = N1_longLit;
	        this$static.outBytesProcessed = this$static.decoder.nowPos64;
	        if (result || compare(this$static.decoder.outSize, P0_longLit) >= 0 && compare(this$static.decoder.nowPos64, this$static.decoder.outSize) >= 0) {
	            $Flush_0(this$static.decoder.m_OutWindow);
	            $ReleaseStream(this$static.decoder.m_OutWindow);
	            this$static.decoder.m_RangeDecoder.Stream = null;
	            this$static.alive = 0;
	        }
	    }
	    /** de */
	    /** cs */
	    function $processEncoderChunk(this$static) {
	        $CodeOneBlock(this$static.encoder, this$static.encoder.processedInSize, this$static.encoder.processedOutSize, this$static.encoder.finished);
	        this$static.inBytesProcessed = this$static.encoder.processedInSize[0];
	        if (this$static.encoder.finished[0]) {
	            $ReleaseStreams(this$static.encoder);
	            this$static.alive = 0;
	        }
	    }
	    /** ce */
	    
	    /** ds */
	    function $CodeInChunks(this$static, inStream, outStream, outSize) {
	        this$static.m_RangeDecoder.Stream = inStream;
	        $ReleaseStream(this$static.m_OutWindow);
	        this$static.m_OutWindow._stream = outStream;
	        $Init_1(this$static);
	        this$static.state = 0;
	        this$static.rep0 = 0;
	        this$static.rep1 = 0;
	        this$static.rep2 = 0;
	        this$static.rep3 = 0;
	        this$static.outSize = outSize;
	        this$static.nowPos64 = P0_longLit;
	        this$static.prevByte = 0;
	        return $Chunker({}, this$static);
	    }
	    
	    function $CodeOneChunk(this$static) {
	        var decoder2, distance, len, numDirectBits, posSlot, posState;
	        posState = lowBits_0(this$static.nowPos64) & this$static.m_PosStateMask;
	        if (!$DecodeBit(this$static.m_RangeDecoder, this$static.m_IsMatchDecoders, (this$static.state << 4) + posState)) {
	            decoder2 = $GetDecoder(this$static.m_LiteralDecoder, lowBits_0(this$static.nowPos64), this$static.prevByte);
	            if (this$static.state < 7) {
	                this$static.prevByte = $DecodeNormal(decoder2, this$static.m_RangeDecoder);
	            } else {
	                this$static.prevByte = $DecodeWithMatchByte(decoder2, this$static.m_RangeDecoder, $GetByte(this$static.m_OutWindow, this$static.rep0));
	            }
	            $PutByte(this$static.m_OutWindow, this$static.prevByte);
	            this$static.state = StateUpdateChar(this$static.state);
	            this$static.nowPos64 = add(this$static.nowPos64, P1_longLit);
	        } else {
	            if ($DecodeBit(this$static.m_RangeDecoder, this$static.m_IsRepDecoders, this$static.state)) {
	                len = 0;
	                if (!$DecodeBit(this$static.m_RangeDecoder, this$static.m_IsRepG0Decoders, this$static.state)) {
	                    if (!$DecodeBit(this$static.m_RangeDecoder, this$static.m_IsRep0LongDecoders, (this$static.state << 4) + posState)) {
	                        this$static.state = this$static.state < 7?9:11;
	                        len = 1;
	                    }
	                } else {
	                    if (!$DecodeBit(this$static.m_RangeDecoder, this$static.m_IsRepG1Decoders, this$static.state)) {
	                        distance = this$static.rep1;
	                    } else {
	                        if (!$DecodeBit(this$static.m_RangeDecoder, this$static.m_IsRepG2Decoders, this$static.state)) {
	                            distance = this$static.rep2;
	                        } else {
	                            distance = this$static.rep3;
	                            this$static.rep3 = this$static.rep2;
	                        }
	                        this$static.rep2 = this$static.rep1;
	                    }
	                    this$static.rep1 = this$static.rep0;
	                    this$static.rep0 = distance;
	                }
	                if (!len) {
	                    len = $Decode(this$static.m_RepLenDecoder, this$static.m_RangeDecoder, posState) + 2;
	                    this$static.state = this$static.state < 7?8:11;
	                }
	            } else {
	                this$static.rep3 = this$static.rep2;
	                this$static.rep2 = this$static.rep1;
	                this$static.rep1 = this$static.rep0;
	                len = 2 + $Decode(this$static.m_LenDecoder, this$static.m_RangeDecoder, posState);
	                this$static.state = this$static.state < 7?7:10;
	                posSlot = $Decode_0(this$static.m_PosSlotDecoder[GetLenToPosState(len)], this$static.m_RangeDecoder);
	                if (posSlot >= 4) {
	                    numDirectBits = (posSlot >> 1) - 1;
	                    this$static.rep0 = (2 | posSlot & 1) << numDirectBits;
	                    if (posSlot < 14) {
	                        this$static.rep0 += ReverseDecode(this$static.m_PosDecoders, this$static.rep0 - posSlot - 1, this$static.m_RangeDecoder, numDirectBits);
	                    } else {
	                        this$static.rep0 += $DecodeDirectBits(this$static.m_RangeDecoder, numDirectBits - 4) << 4;
	                        this$static.rep0 += $ReverseDecode(this$static.m_PosAlignDecoder, this$static.m_RangeDecoder);
	                        if (this$static.rep0 < 0) {
	                            if (this$static.rep0 == -1) {
	                                return 1;
	                            }
	                            return -1;
	                        }
	                    }
	                } else 
	                    this$static.rep0 = posSlot;
	            }
	            if (compare(fromInt(this$static.rep0), this$static.nowPos64) >= 0 || this$static.rep0 >= this$static.m_DictionarySizeCheck) {
	                return -1;
	            }
	            $CopyBlock(this$static.m_OutWindow, this$static.rep0, len);
	            this$static.nowPos64 = add(this$static.nowPos64, fromInt(len));
	            this$static.prevByte = $GetByte(this$static.m_OutWindow, 0);
	        }
	        return 0;
	    }
	    
	    function $Decoder(this$static) {
	        this$static.m_OutWindow = {};
	        this$static.m_RangeDecoder = {};
	        this$static.m_IsMatchDecoders = initDim(192);
	        this$static.m_IsRepDecoders = initDim(12);
	        this$static.m_IsRepG0Decoders = initDim(12);
	        this$static.m_IsRepG1Decoders = initDim(12);
	        this$static.m_IsRepG2Decoders = initDim(12);
	        this$static.m_IsRep0LongDecoders = initDim(192);
	        this$static.m_PosSlotDecoder = initDim(4);
	        this$static.m_PosDecoders = initDim(114);
	        this$static.m_PosAlignDecoder = $BitTreeDecoder({}, 4);
	        this$static.m_LenDecoder = $Decoder$LenDecoder({});
	        this$static.m_RepLenDecoder = $Decoder$LenDecoder({});
	        this$static.m_LiteralDecoder = {};
	        for (var i = 0; i < 4; ++i) {
	            this$static.m_PosSlotDecoder[i] = $BitTreeDecoder({}, 6);
	        }
	        return this$static;
	    }
	    
	    function $Init_1(this$static) {
	        this$static.m_OutWindow._streamPos = 0;
	        this$static.m_OutWindow._pos = 0;
	        InitBitModels(this$static.m_IsMatchDecoders);
	        InitBitModels(this$static.m_IsRep0LongDecoders);
	        InitBitModels(this$static.m_IsRepDecoders);
	        InitBitModels(this$static.m_IsRepG0Decoders);
	        InitBitModels(this$static.m_IsRepG1Decoders);
	        InitBitModels(this$static.m_IsRepG2Decoders);
	        InitBitModels(this$static.m_PosDecoders);
	        $Init_0(this$static.m_LiteralDecoder);
	        for (var i = 0; i < 4; ++i) {
	            InitBitModels(this$static.m_PosSlotDecoder[i].Models);
	        }
	        $Init(this$static.m_LenDecoder);
	        $Init(this$static.m_RepLenDecoder);
	        InitBitModels(this$static.m_PosAlignDecoder.Models);
	        $Init_8(this$static.m_RangeDecoder);
	    }
	    
	    function $SetDecoderProperties(this$static, properties) {
	        var dictionarySize, i, lc, lp, pb, remainder, val;
	        if (properties.length < 5)
	            return 0;
	        val = properties[0] & 255;
	        lc = val % 9;
	        remainder = ~~(val / 9);
	        lp = remainder % 5;
	        pb = ~~(remainder / 5);
	        dictionarySize = 0;
	        for (i = 0; i < 4; ++i) {
	            dictionarySize += (properties[1 + i] & 255) << i * 8;
	        }
	        ///NOTE: If the input is bad, it might call for an insanely large dictionary size, which would crash the script.
	        if (dictionarySize > 99999999 || !$SetLcLpPb(this$static, lc, lp, pb)) {
	            return 0;
	        }
	        return $SetDictionarySize(this$static, dictionarySize);
	    }
	    
	    function $SetDictionarySize(this$static, dictionarySize) {
	        if (dictionarySize < 0) {
	            return 0;
	        }
	        if (this$static.m_DictionarySize != dictionarySize) {
	            this$static.m_DictionarySize = dictionarySize;
	            this$static.m_DictionarySizeCheck = Math.max(this$static.m_DictionarySize, 1);
	            $Create_5(this$static.m_OutWindow, Math.max(this$static.m_DictionarySizeCheck, 4096));
	        }
	        return 1;
	    }
	    
	    function $SetLcLpPb(this$static, lc, lp, pb) {
	        if (lc > 8 || lp > 4 || pb > 4) {
	            return 0;
	        }
	        $Create_0(this$static.m_LiteralDecoder, lp, lc);
	        var numPosStates = 1 << pb;
	        $Create(this$static.m_LenDecoder, numPosStates);
	        $Create(this$static.m_RepLenDecoder, numPosStates);
	        this$static.m_PosStateMask = numPosStates - 1;
	        return 1;
	    }
	    
	    function $Create(this$static, numPosStates) {
	        for (; this$static.m_NumPosStates < numPosStates; ++this$static.m_NumPosStates) {
	            this$static.m_LowCoder[this$static.m_NumPosStates] = $BitTreeDecoder({}, 3);
	            this$static.m_MidCoder[this$static.m_NumPosStates] = $BitTreeDecoder({}, 3);
	        }
	    }
	    
	    function $Decode(this$static, rangeDecoder, posState) {
	        if (!$DecodeBit(rangeDecoder, this$static.m_Choice, 0)) {
	            return $Decode_0(this$static.m_LowCoder[posState], rangeDecoder);
	        }
	        var symbol = 8;
	        if (!$DecodeBit(rangeDecoder, this$static.m_Choice, 1)) {
	            symbol += $Decode_0(this$static.m_MidCoder[posState], rangeDecoder);
	        } else {
	            symbol += 8 + $Decode_0(this$static.m_HighCoder, rangeDecoder);
	        }
	        return symbol;
	    }
	    
	    function $Decoder$LenDecoder(this$static) {
	        this$static.m_Choice = initDim(2);
	        this$static.m_LowCoder = initDim(16);
	        this$static.m_MidCoder = initDim(16);
	        this$static.m_HighCoder = $BitTreeDecoder({}, 8);
	        this$static.m_NumPosStates = 0;
	        return this$static;
	    }
	    
	    function $Init(this$static) {
	        InitBitModels(this$static.m_Choice);
	        for (var posState = 0; posState < this$static.m_NumPosStates; ++posState) {
	            InitBitModels(this$static.m_LowCoder[posState].Models);
	            InitBitModels(this$static.m_MidCoder[posState].Models);
	        }
	        InitBitModels(this$static.m_HighCoder.Models);
	    }
	    
	    
	    function $Create_0(this$static, numPosBits, numPrevBits) {
	        var i, numStates;
	        if (this$static.m_Coders != null && this$static.m_NumPrevBits == numPrevBits && this$static.m_NumPosBits == numPosBits)
	            return;
	        this$static.m_NumPosBits = numPosBits;
	        this$static.m_PosMask = (1 << numPosBits) - 1;
	        this$static.m_NumPrevBits = numPrevBits;
	        numStates = 1 << this$static.m_NumPrevBits + this$static.m_NumPosBits;
	        this$static.m_Coders = initDim(numStates);
	        for (i = 0; i < numStates; ++i)
	            this$static.m_Coders[i] = $Decoder$LiteralDecoder$Decoder2({});
	    }
	    
	    function $GetDecoder(this$static, pos, prevByte) {
	        return this$static.m_Coders[((pos & this$static.m_PosMask) << this$static.m_NumPrevBits) + ((prevByte & 255) >>> 8 - this$static.m_NumPrevBits)];
	    }
	    
	    function $Init_0(this$static) {
	        var i, numStates;
	        numStates = 1 << this$static.m_NumPrevBits + this$static.m_NumPosBits;
	        for (i = 0; i < numStates; ++i) {
	            InitBitModels(this$static.m_Coders[i].m_Decoders);
	        }
	    }
	    
	    
	    function $DecodeNormal(this$static, rangeDecoder) {
	        var symbol = 1;
	        do {
	            symbol = symbol << 1 | $DecodeBit(rangeDecoder, this$static.m_Decoders, symbol);
	        } while (symbol < 256);
	        return symbol << 24 >> 24;
	    }
	    
	    function $DecodeWithMatchByte(this$static, rangeDecoder, matchByte) {
	        var bit, matchBit, symbol = 1;
	        do {
	            matchBit = matchByte >> 7 & 1;
	            matchByte <<= 1;
	            bit = $DecodeBit(rangeDecoder, this$static.m_Decoders, (1 + matchBit << 8) + symbol);
	            symbol = symbol << 1 | bit;
	            if (matchBit != bit) {
	                while (symbol < 256) {
	                    symbol = symbol << 1 | $DecodeBit(rangeDecoder, this$static.m_Decoders, symbol);
	                }
	            break;
	            }
	        } while (symbol < 256);
	        return symbol << 24 >> 24;
	    }
	    
	    function $Decoder$LiteralDecoder$Decoder2(this$static) {
	        this$static.m_Decoders = initDim(768);
	        return this$static;
	    }
	    
	    /** de */
	    /** cs */
	    var g_FastPos = (function () {
	        var j, k, slotFast, c = 2, g_FastPos = [0, 1];
	        for (slotFast = 2; slotFast < 22; ++slotFast) {
	            k = 1 << (slotFast >> 1) - 1;
	            for (j = 0; j < k; ++j , ++c)
	                g_FastPos[c] = slotFast << 24 >> 24;
	        }
	        return g_FastPos;
	    }());
	    
	    function $Backward(this$static, cur) {
	        var backCur, backMem, posMem, posPrev;
	        this$static._optimumEndIndex = cur;
	        posMem = this$static._optimum[cur].PosPrev;
	        backMem = this$static._optimum[cur].BackPrev;
	        do {
	            if (this$static._optimum[cur].Prev1IsChar) {
	                $MakeAsChar(this$static._optimum[posMem]);
	                this$static._optimum[posMem].PosPrev = posMem - 1;
	                if (this$static._optimum[cur].Prev2) {
	                    this$static._optimum[posMem - 1].Prev1IsChar = 0;
	                    this$static._optimum[posMem - 1].PosPrev = this$static._optimum[cur].PosPrev2;
	                    this$static._optimum[posMem - 1].BackPrev = this$static._optimum[cur].BackPrev2;
	                }
	            }
	            posPrev = posMem;
	            backCur = backMem;
	            backMem = this$static._optimum[posPrev].BackPrev;
	            posMem = this$static._optimum[posPrev].PosPrev;
	            this$static._optimum[posPrev].BackPrev = backCur;
	            this$static._optimum[posPrev].PosPrev = cur;
	            cur = posPrev;
	        } while (cur > 0);
	        this$static.backRes = this$static._optimum[0].BackPrev;
	        this$static._optimumCurrentIndex = this$static._optimum[0].PosPrev;
	        return this$static._optimumCurrentIndex;
	    }
	    
	    function $BaseInit(this$static) {
	        this$static._state = 0;
	        this$static._previousByte = 0;
	        for (var i = 0; i < 4; ++i) {
	            this$static._repDistances[i] = 0;
	        }
	    }
	    
	    function $CodeOneBlock(this$static, inSize, outSize, finished) {
	        var baseVal, complexState, curByte, distance, footerBits, i, len, lenToPosState, matchByte, pos, posReduced, posSlot, posState, progressPosValuePrev, subCoder;
	        inSize[0] = P0_longLit;
	        outSize[0] = P0_longLit;
	        finished[0] = 1;
	        if (this$static._inStream) {
	            this$static._matchFinder._stream = this$static._inStream;
	            $Init_5(this$static._matchFinder);
	            this$static._needReleaseMFStream = 1;
	            this$static._inStream = null;
	        }
	        if (this$static._finished) {
	            return;
	        }
	        this$static._finished = 1;
	        progressPosValuePrev = this$static.nowPos64;
	        if (eq(this$static.nowPos64, P0_longLit)) {
	            if (!$GetNumAvailableBytes(this$static._matchFinder)) {
	                $Flush(this$static, lowBits_0(this$static.nowPos64));
	                return;
	            }
	            $ReadMatchDistances(this$static);
	            posState = lowBits_0(this$static.nowPos64) & this$static._posStateMask;
	            $Encode_3(this$static._rangeEncoder, this$static._isMatch, (this$static._state << 4) + posState, 0);
	            this$static._state = StateUpdateChar(this$static._state);
	            curByte = $GetIndexByte(this$static._matchFinder, -this$static._additionalOffset);
	            $Encode_1($GetSubCoder(this$static._literalEncoder, lowBits_0(this$static.nowPos64), this$static._previousByte), this$static._rangeEncoder, curByte);
	            this$static._previousByte = curByte;
	            --this$static._additionalOffset;
	            this$static.nowPos64 = add(this$static.nowPos64, P1_longLit);
	        }
	        if (!$GetNumAvailableBytes(this$static._matchFinder)) {
	            $Flush(this$static, lowBits_0(this$static.nowPos64));
	            return;
	        }
	        while (1) {
	            len = $GetOptimum(this$static, lowBits_0(this$static.nowPos64));
	            pos = this$static.backRes;
	            posState = lowBits_0(this$static.nowPos64) & this$static._posStateMask;
	            complexState = (this$static._state << 4) + posState;
	            if (len == 1 && pos == -1) {
	                $Encode_3(this$static._rangeEncoder, this$static._isMatch, complexState, 0);
	                curByte = $GetIndexByte(this$static._matchFinder, -this$static._additionalOffset);
	                subCoder = $GetSubCoder(this$static._literalEncoder, lowBits_0(this$static.nowPos64), this$static._previousByte);
	                if (this$static._state < 7) {
	                    $Encode_1(subCoder, this$static._rangeEncoder, curByte);
	                } else {
	                    matchByte = $GetIndexByte(this$static._matchFinder, -this$static._repDistances[0] - 1 - this$static._additionalOffset);
	                    $EncodeMatched(subCoder, this$static._rangeEncoder, matchByte, curByte);
	                }
	                this$static._previousByte = curByte;
	                this$static._state = StateUpdateChar(this$static._state);
	            } else {
	                $Encode_3(this$static._rangeEncoder, this$static._isMatch, complexState, 1);
	                if (pos < 4) {
	                    $Encode_3(this$static._rangeEncoder, this$static._isRep, this$static._state, 1);
	                    if (!pos) {
	                        $Encode_3(this$static._rangeEncoder, this$static._isRepG0, this$static._state, 0);
	                        if (len == 1) {
	                            $Encode_3(this$static._rangeEncoder, this$static._isRep0Long, complexState, 0);
	                        } else {
	                            $Encode_3(this$static._rangeEncoder, this$static._isRep0Long, complexState, 1);
	                        }
	                    } else {
	                        $Encode_3(this$static._rangeEncoder, this$static._isRepG0, this$static._state, 1);
	                        if (pos == 1) {
	                            $Encode_3(this$static._rangeEncoder, this$static._isRepG1, this$static._state, 0);
	                        } else {
	                            $Encode_3(this$static._rangeEncoder, this$static._isRepG1, this$static._state, 1);
	                            $Encode_3(this$static._rangeEncoder, this$static._isRepG2, this$static._state, pos - 2);
	                        }
	                    }
	                    if (len == 1) {
	                        this$static._state = this$static._state < 7?9:11;
	                    } else {
	                        $Encode_0(this$static._repMatchLenEncoder, this$static._rangeEncoder, len - 2, posState);
	                        this$static._state = this$static._state < 7?8:11;
	                    }
	                    distance = this$static._repDistances[pos];
	                    if (pos != 0) {
	                        for (i = pos; i >= 1; --i) {
	                            this$static._repDistances[i] = this$static._repDistances[i - 1];
	                        }
	                        this$static._repDistances[0] = distance;
	                    }
	                } else {
	                    $Encode_3(this$static._rangeEncoder, this$static._isRep, this$static._state, 0);
	                    this$static._state = this$static._state < 7?7:10;
	                    $Encode_0(this$static._lenEncoder, this$static._rangeEncoder, len - 2, posState);
	                    pos -= 4;
	                    posSlot = GetPosSlot(pos);
	                    lenToPosState = GetLenToPosState(len);
	                    $Encode_2(this$static._posSlotEncoder[lenToPosState], this$static._rangeEncoder, posSlot);
	                    if (posSlot >= 4) {
	                        footerBits = (posSlot >> 1) - 1;
	                        baseVal = (2 | posSlot & 1) << footerBits;
	                        posReduced = pos - baseVal;
	                        if (posSlot < 14) {
	                            ReverseEncode(this$static._posEncoders, baseVal - posSlot - 1, this$static._rangeEncoder, footerBits, posReduced);
	                        } else {
	                            $EncodeDirectBits(this$static._rangeEncoder, posReduced >> 4, footerBits - 4);
	                            $ReverseEncode(this$static._posAlignEncoder, this$static._rangeEncoder, posReduced & 15);
	                            ++this$static._alignPriceCount;
	                        }
	                    }
	                    distance = pos;
	                    for (i = 3; i >= 1; --i) {
	                        this$static._repDistances[i] = this$static._repDistances[i - 1];
	                    }
	                    this$static._repDistances[0] = distance;
	                    ++this$static._matchPriceCount;
	                }
	                this$static._previousByte = $GetIndexByte(this$static._matchFinder, len - 1 - this$static._additionalOffset);
	            }
	            this$static._additionalOffset -= len;
	            this$static.nowPos64 = add(this$static.nowPos64, fromInt(len));
	            if (!this$static._additionalOffset) {
	                if (this$static._matchPriceCount >= 128) {
	                    $FillDistancesPrices(this$static);
	                }
	                if (this$static._alignPriceCount >= 16) {
	                    $FillAlignPrices(this$static);
	                }
	                inSize[0] = this$static.nowPos64;
	                outSize[0] = $GetProcessedSizeAdd(this$static._rangeEncoder);
	                if (!$GetNumAvailableBytes(this$static._matchFinder)) {
	                    $Flush(this$static, lowBits_0(this$static.nowPos64));
	                    return;
	                }
	                if (compare(sub(this$static.nowPos64, progressPosValuePrev), [4096, 0]) >= 0) {
	                    this$static._finished = 0;
	                    finished[0] = 0;
	                    return;
	                }
	            }
	        }
	    }
	    
	    function $Create_2(this$static) {
	        var bt, numHashBytes;
	        if (!this$static._matchFinder) {
	            bt = {};
	            numHashBytes = 4;
	            if (!this$static._matchFinderType) {
	                numHashBytes = 2;
	            }
	            $SetType(bt, numHashBytes);
	            this$static._matchFinder = bt;
	        }
	        $Create_1(this$static._literalEncoder, this$static._numLiteralPosStateBits, this$static._numLiteralContextBits);
	        if (this$static._dictionarySize == this$static._dictionarySizePrev && this$static._numFastBytesPrev == this$static._numFastBytes) {
	            return;
	        }
	        $Create_3(this$static._matchFinder, this$static._dictionarySize, 4096, this$static._numFastBytes, 274);
	        this$static._dictionarySizePrev = this$static._dictionarySize;
	        this$static._numFastBytesPrev = this$static._numFastBytes;
	    }
	    
	    function $Encoder(this$static) {
	        var i;
	        this$static._repDistances = initDim(4);
	        this$static._optimum = [];
	        this$static._rangeEncoder = {};
	        this$static._isMatch = initDim(192);
	        this$static._isRep = initDim(12);
	        this$static._isRepG0 = initDim(12);
	        this$static._isRepG1 = initDim(12);
	        this$static._isRepG2 = initDim(12);
	        this$static._isRep0Long = initDim(192);
	        this$static._posSlotEncoder = [];
	        this$static._posEncoders = initDim(114);
	        this$static._posAlignEncoder = $BitTreeEncoder({}, 4);
	        this$static._lenEncoder = $Encoder$LenPriceTableEncoder({});
	        this$static._repMatchLenEncoder = $Encoder$LenPriceTableEncoder({});
	        this$static._literalEncoder = {};
	        this$static._matchDistances = [];
	        this$static._posSlotPrices = [];
	        this$static._distancesPrices = [];
	        this$static._alignPrices = initDim(16);
	        this$static.reps = initDim(4);
	        this$static.repLens = initDim(4);
	        this$static.processedInSize = [P0_longLit];
	        this$static.processedOutSize = [P0_longLit];
	        this$static.finished = [0];
	        this$static.properties = initDim(5);
	        this$static.tempPrices = initDim(128);
	        this$static._longestMatchLength = 0;
	        this$static._matchFinderType = 1;
	        this$static._numDistancePairs = 0;
	        this$static._numFastBytesPrev = -1;
	        this$static.backRes = 0;
	        for (i = 0; i < 4096; ++i) {
	            this$static._optimum[i] = {};
	        }
	        for (i = 0; i < 4; ++i) {
	            this$static._posSlotEncoder[i] = $BitTreeEncoder({}, 6);
	        }
	        return this$static;
	    }
	    
	    function $FillAlignPrices(this$static) {
	        for (var i = 0; i < 16; ++i) {
	            this$static._alignPrices[i] = $ReverseGetPrice(this$static._posAlignEncoder, i);
	        }
	        this$static._alignPriceCount = 0;
	    }
	    
	    function $FillDistancesPrices(this$static) {
	        var baseVal, encoder, footerBits, i, lenToPosState, posSlot, st, st2;
	        for (i = 4; i < 128; ++i) {
	            posSlot = GetPosSlot(i);
	            footerBits = (posSlot >> 1) - 1;
	            baseVal = (2 | posSlot & 1) << footerBits;
	            this$static.tempPrices[i] = ReverseGetPrice(this$static._posEncoders, baseVal - posSlot - 1, footerBits, i - baseVal);
	        }
	        for (lenToPosState = 0; lenToPosState < 4; ++lenToPosState) {
	            encoder = this$static._posSlotEncoder[lenToPosState];
	            st = lenToPosState << 6;
	            for (posSlot = 0; posSlot < this$static._distTableSize; ++posSlot) {
	                this$static._posSlotPrices[st + posSlot] = $GetPrice_1(encoder, posSlot);
	            }
	            for (posSlot = 14; posSlot < this$static._distTableSize; ++posSlot) {
	                this$static._posSlotPrices[st + posSlot] += (posSlot >> 1) - 1 - 4 << 6;
	            }
	            st2 = lenToPosState * 128;
	            for (i = 0; i < 4; ++i) {
	                this$static._distancesPrices[st2 + i] = this$static._posSlotPrices[st + i];
	            }
	            for (; i < 128; ++i) {
	                this$static._distancesPrices[st2 + i] = this$static._posSlotPrices[st + GetPosSlot(i)] + this$static.tempPrices[i];
	            }
	        }
	        this$static._matchPriceCount = 0;
	    }
	    
	    function $Flush(this$static, nowPos) {
	        $ReleaseMFStream(this$static);
	        $WriteEndMarker(this$static, nowPos & this$static._posStateMask);
	        for (var i = 0; i < 5; ++i) {
	            $ShiftLow(this$static._rangeEncoder);
	        }
	    }
	    
	    function $GetOptimum(this$static, position) {
	        var cur, curAnd1Price, curAndLenCharPrice, curAndLenPrice, curBack, curPrice, currentByte, distance, i, len, lenEnd, lenMain, lenRes, lenTest, lenTest2, lenTestTemp, matchByte, matchPrice, newLen, nextIsChar, nextMatchPrice, nextOptimum, nextRepMatchPrice, normalMatchPrice, numAvailableBytes, numAvailableBytesFull, numDistancePairs, offs, offset, opt, optimum, pos, posPrev, posState, posStateNext, price_4, repIndex, repLen, repMatchPrice, repMaxIndex, shortRepPrice, startLen, state, state2, t, price, price_0, price_1, price_2, price_3;
	        if (this$static._optimumEndIndex != this$static._optimumCurrentIndex) {
	            lenRes = this$static._optimum[this$static._optimumCurrentIndex].PosPrev - this$static._optimumCurrentIndex;
	            this$static.backRes = this$static._optimum[this$static._optimumCurrentIndex].BackPrev;
	            this$static._optimumCurrentIndex = this$static._optimum[this$static._optimumCurrentIndex].PosPrev;
	            return lenRes;
	        }
	        this$static._optimumCurrentIndex = this$static._optimumEndIndex = 0;
	        if (this$static._longestMatchWasFound) {
	            lenMain = this$static._longestMatchLength;
	            this$static._longestMatchWasFound = 0;
	        } else {
	            lenMain = $ReadMatchDistances(this$static);
	        }
	        numDistancePairs = this$static._numDistancePairs;
	        numAvailableBytes = $GetNumAvailableBytes(this$static._matchFinder) + 1;
	        if (numAvailableBytes < 2) {
	            this$static.backRes = -1;
	            return 1;
	        }
	        if (numAvailableBytes > 273) {
	            numAvailableBytes = 273;
	        }
	        repMaxIndex = 0;
	        for (i = 0; i < 4; ++i) {
	            this$static.reps[i] = this$static._repDistances[i];
	            this$static.repLens[i] = $GetMatchLen(this$static._matchFinder, -1, this$static.reps[i], 273);
	            if (this$static.repLens[i] > this$static.repLens[repMaxIndex]) {
	                repMaxIndex = i;
	            }
	        }
	        if (this$static.repLens[repMaxIndex] >= this$static._numFastBytes) {
	            this$static.backRes = repMaxIndex;
	            lenRes = this$static.repLens[repMaxIndex];
	            $MovePos(this$static, lenRes - 1);
	            return lenRes;
	        }
	        if (lenMain >= this$static._numFastBytes) {
	            this$static.backRes = this$static._matchDistances[numDistancePairs - 1] + 4;
	            $MovePos(this$static, lenMain - 1);
	            return lenMain;
	        }
	        currentByte = $GetIndexByte(this$static._matchFinder, -1);
	        matchByte = $GetIndexByte(this$static._matchFinder, -this$static._repDistances[0] - 1 - 1);
	        if (lenMain < 2 && currentByte != matchByte && this$static.repLens[repMaxIndex] < 2) {
	            this$static.backRes = -1;
	            return 1;
	        }
	        this$static._optimum[0].State = this$static._state;
	        posState = position & this$static._posStateMask;
	        this$static._optimum[1].Price = ProbPrices[this$static._isMatch[(this$static._state << 4) + posState] >>> 2] + $GetPrice_0($GetSubCoder(this$static._literalEncoder, position, this$static._previousByte), this$static._state >= 7, matchByte, currentByte);
	        $MakeAsChar(this$static._optimum[1]);
	        matchPrice = ProbPrices[2048 - this$static._isMatch[(this$static._state << 4) + posState] >>> 2];
	        repMatchPrice = matchPrice + ProbPrices[2048 - this$static._isRep[this$static._state] >>> 2];
	        if (matchByte == currentByte) {
	            shortRepPrice = repMatchPrice + $GetRepLen1Price(this$static, this$static._state, posState);
	            if (shortRepPrice < this$static._optimum[1].Price) {
	                this$static._optimum[1].Price = shortRepPrice;
	                $MakeAsShortRep(this$static._optimum[1]);
	            }
	        }
	        lenEnd = lenMain >= this$static.repLens[repMaxIndex]?lenMain:this$static.repLens[repMaxIndex];
	        if (lenEnd < 2) {
	            this$static.backRes = this$static._optimum[1].BackPrev;
	            return 1;
	        }
	        this$static._optimum[1].PosPrev = 0;
	        this$static._optimum[0].Backs0 = this$static.reps[0];
	        this$static._optimum[0].Backs1 = this$static.reps[1];
	        this$static._optimum[0].Backs2 = this$static.reps[2];
	        this$static._optimum[0].Backs3 = this$static.reps[3];
	        len = lenEnd;
	        do {
	            this$static._optimum[len--].Price = 268435455;
	        } while (len >= 2);
	        for (i = 0; i < 4; ++i) {
	            repLen = this$static.repLens[i];
	            if (repLen < 2) {
	                continue;
	            }
	            price_4 = repMatchPrice + $GetPureRepPrice(this$static, i, this$static._state, posState);
	            do {
	                curAndLenPrice = price_4 + $GetPrice(this$static._repMatchLenEncoder, repLen - 2, posState);
	                optimum = this$static._optimum[repLen];
	                if (curAndLenPrice < optimum.Price) {
	                    optimum.Price = curAndLenPrice;
	                    optimum.PosPrev = 0;
	                    optimum.BackPrev = i;
	                    optimum.Prev1IsChar = 0;
	                }
	            } while (--repLen >= 2);
	        }
	        normalMatchPrice = matchPrice + ProbPrices[this$static._isRep[this$static._state] >>> 2];
	        len = this$static.repLens[0] >= 2?this$static.repLens[0] + 1:2;
	        if (len <= lenMain) {
	            offs = 0;
	            while (len > this$static._matchDistances[offs]) {
	                offs += 2;
	            }
	            for (;; ++len) {
	                distance = this$static._matchDistances[offs + 1];
	                curAndLenPrice = normalMatchPrice + $GetPosLenPrice(this$static, distance, len, posState);
	                optimum = this$static._optimum[len];
	                if (curAndLenPrice < optimum.Price) {
	                    optimum.Price = curAndLenPrice;
	                    optimum.PosPrev = 0;
	                    optimum.BackPrev = distance + 4;
	                    optimum.Prev1IsChar = 0;
	                }
	                if (len == this$static._matchDistances[offs]) {
	                    offs += 2;
	                    if (offs == numDistancePairs) {
	                        break;
	                    }
	                }
	            }
	        }
	        cur = 0;
	        while (1) {
	            ++cur;
	            if (cur == lenEnd) {
	                return $Backward(this$static, cur);
	            }
	            newLen = $ReadMatchDistances(this$static);
	            numDistancePairs = this$static._numDistancePairs;
	            if (newLen >= this$static._numFastBytes) {
	                this$static._longestMatchLength = newLen;
	                this$static._longestMatchWasFound = 1;
	                return $Backward(this$static, cur);
	            }
	            ++position;
	            posPrev = this$static._optimum[cur].PosPrev;
	            if (this$static._optimum[cur].Prev1IsChar) {
	                --posPrev;
	                if (this$static._optimum[cur].Prev2) {
	                    state = this$static._optimum[this$static._optimum[cur].PosPrev2].State;
	                    if (this$static._optimum[cur].BackPrev2 < 4) {
	                        state = (state < 7) ? 8 : 11;
	                    } else {
	                        state = (state < 7) ? 7 : 10;
	                    }
	                } else {
	                    state = this$static._optimum[posPrev].State;
	                }
	                state = StateUpdateChar(state);
	            } else {
	                state = this$static._optimum[posPrev].State;
	            }
	            if (posPrev == cur - 1) {
	                if (!this$static._optimum[cur].BackPrev) {
	                    state = state < 7?9:11;
	                } else {
	                    state = StateUpdateChar(state);
	                }
	            } else {
	                if (this$static._optimum[cur].Prev1IsChar && this$static._optimum[cur].Prev2) {
	                    posPrev = this$static._optimum[cur].PosPrev2;
	                    pos = this$static._optimum[cur].BackPrev2;
	                    state = state < 7?8:11;
	                } else {
	                    pos = this$static._optimum[cur].BackPrev;
	                    if (pos < 4) {
	                        state = state < 7?8:11;
	                    } else {
	                        state = state < 7?7:10;
	                    }
	                }
	                opt = this$static._optimum[posPrev];
	                if (pos < 4) {
	                    if (!pos) {
	                        this$static.reps[0] = opt.Backs0;
	                        this$static.reps[1] = opt.Backs1;
	                        this$static.reps[2] = opt.Backs2;
	                        this$static.reps[3] = opt.Backs3;
	                    } else if (pos == 1) {
	                        this$static.reps[0] = opt.Backs1;
	                        this$static.reps[1] = opt.Backs0;
	                        this$static.reps[2] = opt.Backs2;
	                        this$static.reps[3] = opt.Backs3;
	                    } else if (pos == 2) {
	                        this$static.reps[0] = opt.Backs2;
	                        this$static.reps[1] = opt.Backs0;
	                        this$static.reps[2] = opt.Backs1;
	                        this$static.reps[3] = opt.Backs3;
	                    } else {
	                        this$static.reps[0] = opt.Backs3;
	                        this$static.reps[1] = opt.Backs0;
	                        this$static.reps[2] = opt.Backs1;
	                        this$static.reps[3] = opt.Backs2;
	                    }
	                } else {
	                    this$static.reps[0] = pos - 4;
	                    this$static.reps[1] = opt.Backs0;
	                    this$static.reps[2] = opt.Backs1;
	                    this$static.reps[3] = opt.Backs2;
	                }
	            }
	            this$static._optimum[cur].State = state;
	            this$static._optimum[cur].Backs0 = this$static.reps[0];
	            this$static._optimum[cur].Backs1 = this$static.reps[1];
	            this$static._optimum[cur].Backs2 = this$static.reps[2];
	            this$static._optimum[cur].Backs3 = this$static.reps[3];
	            curPrice = this$static._optimum[cur].Price;
	            currentByte = $GetIndexByte(this$static._matchFinder, -1);
	            matchByte = $GetIndexByte(this$static._matchFinder, -this$static.reps[0] - 1 - 1);
	            posState = position & this$static._posStateMask;
	            curAnd1Price = curPrice + ProbPrices[this$static._isMatch[(state << 4) + posState] >>> 2] + $GetPrice_0($GetSubCoder(this$static._literalEncoder, position, $GetIndexByte(this$static._matchFinder, -2)), state >= 7, matchByte, currentByte);
	            nextOptimum = this$static._optimum[cur + 1];
	            nextIsChar = 0;
	            if (curAnd1Price < nextOptimum.Price) {
	                nextOptimum.Price = curAnd1Price;
	                nextOptimum.PosPrev = cur;
	                nextOptimum.BackPrev = -1;
	                nextOptimum.Prev1IsChar = 0;
	                nextIsChar = 1;
	            }
	            matchPrice = curPrice + ProbPrices[2048 - this$static._isMatch[(state << 4) + posState] >>> 2];
	            repMatchPrice = matchPrice + ProbPrices[2048 - this$static._isRep[state] >>> 2];
	            if (matchByte == currentByte && !(nextOptimum.PosPrev < cur && !nextOptimum.BackPrev)) {
	                shortRepPrice = repMatchPrice + (ProbPrices[this$static._isRepG0[state] >>> 2] + ProbPrices[this$static._isRep0Long[(state << 4) + posState] >>> 2]);
	                if (shortRepPrice <= nextOptimum.Price) {
	                    nextOptimum.Price = shortRepPrice;
	                    nextOptimum.PosPrev = cur;
	                    nextOptimum.BackPrev = 0;
	                    nextOptimum.Prev1IsChar = 0;
	                    nextIsChar = 1;
	                }
	            }
	            numAvailableBytesFull = $GetNumAvailableBytes(this$static._matchFinder) + 1;
	            numAvailableBytesFull = 4095 - cur < numAvailableBytesFull?4095 - cur:numAvailableBytesFull;
	            numAvailableBytes = numAvailableBytesFull;
	            if (numAvailableBytes < 2) {
	                continue;
	            }
	            if (numAvailableBytes > this$static._numFastBytes) {
	                numAvailableBytes = this$static._numFastBytes;
	            }
	            if (!nextIsChar && matchByte != currentByte) {
	                t = Math.min(numAvailableBytesFull - 1, this$static._numFastBytes);
	                lenTest2 = $GetMatchLen(this$static._matchFinder, 0, this$static.reps[0], t);
	                if (lenTest2 >= 2) {
	                    state2 = StateUpdateChar(state);
	                    posStateNext = position + 1 & this$static._posStateMask;
	                    nextRepMatchPrice = curAnd1Price + ProbPrices[2048 - this$static._isMatch[(state2 << 4) + posStateNext] >>> 2] + ProbPrices[2048 - this$static._isRep[state2] >>> 2];
	                    offset = cur + 1 + lenTest2;
	                    while (lenEnd < offset) {
	                        this$static._optimum[++lenEnd].Price = 268435455;
	                    }
	                    curAndLenPrice = nextRepMatchPrice + (price = $GetPrice(this$static._repMatchLenEncoder, lenTest2 - 2, posStateNext) , price + $GetPureRepPrice(this$static, 0, state2, posStateNext));
	                    optimum = this$static._optimum[offset];
	                    if (curAndLenPrice < optimum.Price) {
	                        optimum.Price = curAndLenPrice;
	                        optimum.PosPrev = cur + 1;
	                        optimum.BackPrev = 0;
	                        optimum.Prev1IsChar = 1;
	                        optimum.Prev2 = 0;
	                    }
	                }
	            }
	            startLen = 2;
	            for (repIndex = 0; repIndex < 4; ++repIndex) {
	                lenTest = $GetMatchLen(this$static._matchFinder, -1, this$static.reps[repIndex], numAvailableBytes);
	                if (lenTest < 2) {
	                    continue;
	                }
	                lenTestTemp = lenTest;
	                do {
	                    while (lenEnd < cur + lenTest) {
	                        this$static._optimum[++lenEnd].Price = 268435455;
	                    }
	                    curAndLenPrice = repMatchPrice + (price_0 = $GetPrice(this$static._repMatchLenEncoder, lenTest - 2, posState) , price_0 + $GetPureRepPrice(this$static, repIndex, state, posState));
	                    optimum = this$static._optimum[cur + lenTest];
	                    if (curAndLenPrice < optimum.Price) {
	                        optimum.Price = curAndLenPrice;
	                        optimum.PosPrev = cur;
	                        optimum.BackPrev = repIndex;
	                        optimum.Prev1IsChar = 0;
	                    }
	                } while (--lenTest >= 2);
	                lenTest = lenTestTemp;
	                if (!repIndex) {
	                    startLen = lenTest + 1;
	                }
	                if (lenTest < numAvailableBytesFull) {
	                    t = Math.min(numAvailableBytesFull - 1 - lenTest, this$static._numFastBytes);
	                    lenTest2 = $GetMatchLen(this$static._matchFinder, lenTest, this$static.reps[repIndex], t);
	                    if (lenTest2 >= 2) {
	                        state2 = state < 7?8:11;
	                        posStateNext = position + lenTest & this$static._posStateMask;
	                        curAndLenCharPrice = repMatchPrice + (price_1 = $GetPrice(this$static._repMatchLenEncoder, lenTest - 2, posState) , price_1 + $GetPureRepPrice(this$static, repIndex, state, posState)) + ProbPrices[this$static._isMatch[(state2 << 4) + posStateNext] >>> 2] + $GetPrice_0($GetSubCoder(this$static._literalEncoder, position + lenTest, $GetIndexByte(this$static._matchFinder, lenTest - 1 - 1)), 1, $GetIndexByte(this$static._matchFinder, lenTest - 1 - (this$static.reps[repIndex] + 1)), $GetIndexByte(this$static._matchFinder, lenTest - 1));
	                        state2 = StateUpdateChar(state2);
	                        posStateNext = position + lenTest + 1 & this$static._posStateMask;
	                        nextMatchPrice = curAndLenCharPrice + ProbPrices[2048 - this$static._isMatch[(state2 << 4) + posStateNext] >>> 2];
	                        nextRepMatchPrice = nextMatchPrice + ProbPrices[2048 - this$static._isRep[state2] >>> 2];
	                        offset = lenTest + 1 + lenTest2;
	                        while (lenEnd < cur + offset) {
	                            this$static._optimum[++lenEnd].Price = 268435455;
	                        }
	                        curAndLenPrice = nextRepMatchPrice + (price_2 = $GetPrice(this$static._repMatchLenEncoder, lenTest2 - 2, posStateNext) , price_2 + $GetPureRepPrice(this$static, 0, state2, posStateNext));
	                        optimum = this$static._optimum[cur + offset];
	                        if (curAndLenPrice < optimum.Price) {
	                            optimum.Price = curAndLenPrice;
	                            optimum.PosPrev = cur + lenTest + 1;
	                            optimum.BackPrev = 0;
	                            optimum.Prev1IsChar = 1;
	                            optimum.Prev2 = 1;
	                            optimum.PosPrev2 = cur;
	                            optimum.BackPrev2 = repIndex;
	                        }
	                    }
	                }
	            }
	            if (newLen > numAvailableBytes) {
	                newLen = numAvailableBytes;
	                for (numDistancePairs = 0; newLen > this$static._matchDistances[numDistancePairs]; numDistancePairs += 2) {}
	                this$static._matchDistances[numDistancePairs] = newLen;
	                numDistancePairs += 2;
	            }
	            if (newLen >= startLen) {
	            normalMatchPrice = matchPrice + ProbPrices[this$static._isRep[state] >>> 2];
	            while (lenEnd < cur + newLen) {
	                this$static._optimum[++lenEnd].Price = 268435455;
	            }
	            offs = 0;
	            while (startLen > this$static._matchDistances[offs]) {
	                offs += 2;
	            }
	            for (lenTest = startLen;; ++lenTest) {
	                curBack = this$static._matchDistances[offs + 1];
	                curAndLenPrice = normalMatchPrice + $GetPosLenPrice(this$static, curBack, lenTest, posState);
	                optimum = this$static._optimum[cur + lenTest];
	                if (curAndLenPrice < optimum.Price) {
	                    optimum.Price = curAndLenPrice;
	                    optimum.PosPrev = cur;
	                    optimum.BackPrev = curBack + 4;
	                    optimum.Prev1IsChar = 0;
	                }
	                if (lenTest == this$static._matchDistances[offs]) {
	                    if (lenTest < numAvailableBytesFull) {
	                        t = Math.min(numAvailableBytesFull - 1 - lenTest, this$static._numFastBytes);
	                        lenTest2 = $GetMatchLen(this$static._matchFinder, lenTest, curBack, t);
	                        if (lenTest2 >= 2) {
	                            state2 = state < 7?7:10;
	                            posStateNext = position + lenTest & this$static._posStateMask;
	                            curAndLenCharPrice = curAndLenPrice + ProbPrices[this$static._isMatch[(state2 << 4) + posStateNext] >>> 2] + $GetPrice_0($GetSubCoder(this$static._literalEncoder, position + lenTest, $GetIndexByte(this$static._matchFinder, lenTest - 1 - 1)), 1, $GetIndexByte(this$static._matchFinder, lenTest - (curBack + 1) - 1), $GetIndexByte(this$static._matchFinder, lenTest - 1));
	                            state2 = StateUpdateChar(state2);
	                            posStateNext = position + lenTest + 1 & this$static._posStateMask;
	                            nextMatchPrice = curAndLenCharPrice + ProbPrices[2048 - this$static._isMatch[(state2 << 4) + posStateNext] >>> 2];
	                            nextRepMatchPrice = nextMatchPrice + ProbPrices[2048 - this$static._isRep[state2] >>> 2];
	                            offset = lenTest + 1 + lenTest2;
	                            while (lenEnd < cur + offset) {
	                                this$static._optimum[++lenEnd].Price = 268435455;
	                            }
	                            curAndLenPrice = nextRepMatchPrice + (price_3 = $GetPrice(this$static._repMatchLenEncoder, lenTest2 - 2, posStateNext) , price_3 + $GetPureRepPrice(this$static, 0, state2, posStateNext));
	                            optimum = this$static._optimum[cur + offset];
	                            if (curAndLenPrice < optimum.Price) {
	                                optimum.Price = curAndLenPrice;
	                                optimum.PosPrev = cur + lenTest + 1;
	                                optimum.BackPrev = 0;
	                                optimum.Prev1IsChar = 1;
	                                optimum.Prev2 = 1;
	                                optimum.PosPrev2 = cur;
	                                optimum.BackPrev2 = curBack + 4;
	                            }
	                        }
	                    }
	                    offs += 2;
	                    if (offs == numDistancePairs)
	                        break;
	                    }
	                }
	            }
	        }
	    }
	    
	    function $GetPosLenPrice(this$static, pos, len, posState) {
	        var price, lenToPosState = GetLenToPosState(len);
	        if (pos < 128) {
	            price = this$static._distancesPrices[lenToPosState * 128 + pos];
	        } else {
	            price = this$static._posSlotPrices[(lenToPosState << 6) + GetPosSlot2(pos)] + this$static._alignPrices[pos & 15];
	        }
	        return price + $GetPrice(this$static._lenEncoder, len - 2, posState);
	    }
	    
	    function $GetPureRepPrice(this$static, repIndex, state, posState) {
	        var price;
	        if (!repIndex) {
	            price = ProbPrices[this$static._isRepG0[state] >>> 2];
	            price += ProbPrices[2048 - this$static._isRep0Long[(state << 4) + posState] >>> 2];
	        } else {
	            price = ProbPrices[2048 - this$static._isRepG0[state] >>> 2];
	            if (repIndex == 1) {
	                price += ProbPrices[this$static._isRepG1[state] >>> 2];
	            } else {
	                price += ProbPrices[2048 - this$static._isRepG1[state] >>> 2];
	                price += GetPrice(this$static._isRepG2[state], repIndex - 2);
	            }
	        }
	        return price;
	    }
	    
	    function $GetRepLen1Price(this$static, state, posState) {
	        return ProbPrices[this$static._isRepG0[state] >>> 2] + ProbPrices[this$static._isRep0Long[(state << 4) + posState] >>> 2];
	    }
	    
	    function $Init_4(this$static) {
	        $BaseInit(this$static);
	        $Init_9(this$static._rangeEncoder);
	        InitBitModels(this$static._isMatch);
	        InitBitModels(this$static._isRep0Long);
	        InitBitModels(this$static._isRep);
	        InitBitModels(this$static._isRepG0);
	        InitBitModels(this$static._isRepG1);
	        InitBitModels(this$static._isRepG2);
	        InitBitModels(this$static._posEncoders);
	        $Init_3(this$static._literalEncoder);
	        for (var i = 0; i < 4; ++i) {
	            InitBitModels(this$static._posSlotEncoder[i].Models);
	        }
	        $Init_2(this$static._lenEncoder, 1 << this$static._posStateBits);
	        $Init_2(this$static._repMatchLenEncoder, 1 << this$static._posStateBits);
	        InitBitModels(this$static._posAlignEncoder.Models);
	        this$static._longestMatchWasFound = 0;
	        this$static._optimumEndIndex = 0;
	        this$static._optimumCurrentIndex = 0;
	        this$static._additionalOffset = 0;
	    }
	    
	    function $MovePos(this$static, num) {
	        if (num > 0) {
	            $Skip(this$static._matchFinder, num);
	            this$static._additionalOffset += num;
	        }
	    }
	    
	    function $ReadMatchDistances(this$static) {
	        var lenRes = 0;
	        this$static._numDistancePairs = $GetMatches(this$static._matchFinder, this$static._matchDistances);
	        if (this$static._numDistancePairs > 0) {
	            lenRes = this$static._matchDistances[this$static._numDistancePairs - 2];
	            if (lenRes == this$static._numFastBytes)
	            lenRes += $GetMatchLen(this$static._matchFinder, lenRes - 1, this$static._matchDistances[this$static._numDistancePairs - 1], 273 - lenRes);
	        }
	        ++this$static._additionalOffset;
	        return lenRes;
	    }
	    
	    function $ReleaseMFStream(this$static) {
	        if (this$static._matchFinder && this$static._needReleaseMFStream) {
	            this$static._matchFinder._stream = null;
	            this$static._needReleaseMFStream = 0;
	        }
	    }
	    
	    function $ReleaseStreams(this$static) {
	        $ReleaseMFStream(this$static);
	        this$static._rangeEncoder.Stream = null;
	    }
	    
	    function $SetDictionarySize_0(this$static, dictionarySize) {
	        this$static._dictionarySize = dictionarySize;
	        for (var dicLogSize = 0; dictionarySize > 1 << dicLogSize; ++dicLogSize) {}
	        this$static._distTableSize = dicLogSize * 2;
	    }
	    
	    function $SetMatchFinder(this$static, matchFinderIndex) {
	        var matchFinderIndexPrev = this$static._matchFinderType;
	        this$static._matchFinderType = matchFinderIndex;
	        if (this$static._matchFinder && matchFinderIndexPrev != this$static._matchFinderType) {
	            this$static._dictionarySizePrev = -1;
	            this$static._matchFinder = null;
	        }
	    }
	    
	    function $WriteCoderProperties(this$static, outStream) {
	        this$static.properties[0] = (this$static._posStateBits * 5 + this$static._numLiteralPosStateBits) * 9 + this$static._numLiteralContextBits << 24 >> 24;
	        for (var i = 0; i < 4; ++i) {
	            this$static.properties[1 + i] = this$static._dictionarySize >> 8 * i << 24 >> 24;
	        }
	        $write_0(outStream, this$static.properties, 0, 5);
	    }
	    
	    function $WriteEndMarker(this$static, posState) {
	        if (!this$static._writeEndMark) {
	            return;
	        }
	        $Encode_3(this$static._rangeEncoder, this$static._isMatch, (this$static._state << 4) + posState, 1);
	        $Encode_3(this$static._rangeEncoder, this$static._isRep, this$static._state, 0);
	        this$static._state = this$static._state < 7?7:10;
	        $Encode_0(this$static._lenEncoder, this$static._rangeEncoder, 0, posState);
	        var lenToPosState = GetLenToPosState(2);
	        $Encode_2(this$static._posSlotEncoder[lenToPosState], this$static._rangeEncoder, 63);
	        $EncodeDirectBits(this$static._rangeEncoder, 67108863, 26);
	        $ReverseEncode(this$static._posAlignEncoder, this$static._rangeEncoder, 15);
	    }
	    
	    function GetPosSlot(pos) {
	        if (pos < 2048) {
	            return g_FastPos[pos];
	        }
	        if (pos < 2097152) {
	            return g_FastPos[pos >> 10] + 20;
	        }
	        return g_FastPos[pos >> 20] + 40;
	    }
	    
	    function GetPosSlot2(pos) {
	        if (pos < 131072) {
	            return g_FastPos[pos >> 6] + 12;
	        }
	        if (pos < 134217728) {
	            return g_FastPos[pos >> 16] + 32;
	        }
	        return g_FastPos[pos >> 26] + 52;
	    }
	    
	    function $Encode(this$static, rangeEncoder, symbol, posState) {
	        if (symbol < 8) {
	            $Encode_3(rangeEncoder, this$static._choice, 0, 0);
	            $Encode_2(this$static._lowCoder[posState], rangeEncoder, symbol);
	        } else {
	            symbol -= 8;
	            $Encode_3(rangeEncoder, this$static._choice, 0, 1);
	            if (symbol < 8) {
	                $Encode_3(rangeEncoder, this$static._choice, 1, 0);
	                $Encode_2(this$static._midCoder[posState], rangeEncoder, symbol);
	            } else {
	                $Encode_3(rangeEncoder, this$static._choice, 1, 1);
	                $Encode_2(this$static._highCoder, rangeEncoder, symbol - 8);
	            }
	        }
	    }
	    
	    function $Encoder$LenEncoder(this$static) {
	        this$static._choice = initDim(2);
	        this$static._lowCoder = initDim(16);
	        this$static._midCoder = initDim(16);
	        this$static._highCoder = $BitTreeEncoder({}, 8);
	        for (var posState = 0; posState < 16; ++posState) {
	            this$static._lowCoder[posState] = $BitTreeEncoder({}, 3);
	            this$static._midCoder[posState] = $BitTreeEncoder({}, 3);
	        }
	        return this$static;
	    }
	    
	    function $Init_2(this$static, numPosStates) {
	        InitBitModels(this$static._choice);
	        for (var posState = 0; posState < numPosStates; ++posState) {
	            InitBitModels(this$static._lowCoder[posState].Models);
	            InitBitModels(this$static._midCoder[posState].Models);
	        }
	        InitBitModels(this$static._highCoder.Models);
	    }
	    
	    function $SetPrices(this$static, posState, numSymbols, prices, st) {
	        var a0, a1, b0, b1, i;
	        a0 = ProbPrices[this$static._choice[0] >>> 2];
	        a1 = ProbPrices[2048 - this$static._choice[0] >>> 2];
	        b0 = a1 + ProbPrices[this$static._choice[1] >>> 2];
	        b1 = a1 + ProbPrices[2048 - this$static._choice[1] >>> 2];
	        i = 0;
	        for (i = 0; i < 8; ++i) {
	            if (i >= numSymbols)
	            return;
	            prices[st + i] = a0 + $GetPrice_1(this$static._lowCoder[posState], i);
	        }
	        for (; i < 16; ++i) {
	            if (i >= numSymbols)
	            return;
	            prices[st + i] = b0 + $GetPrice_1(this$static._midCoder[posState], i - 8);
	        }
	        for (; i < numSymbols; ++i) {
	            prices[st + i] = b1 + $GetPrice_1(this$static._highCoder, i - 8 - 8);
	        }
	    }
	    
	    function $Encode_0(this$static, rangeEncoder, symbol, posState) {
	        $Encode(this$static, rangeEncoder, symbol, posState);
	        if (--this$static._counters[posState] == 0) {
	            $SetPrices(this$static, posState, this$static._tableSize, this$static._prices, posState * 272);
	            this$static._counters[posState] = this$static._tableSize;
	        }
	    }
	    
	    function $Encoder$LenPriceTableEncoder(this$static) {
	        $Encoder$LenEncoder(this$static);
	        this$static._prices = [];
	        this$static._counters = [];
	        return this$static;
	    }
	    
	    function $GetPrice(this$static, symbol, posState) {
	        return this$static._prices[posState * 272 + symbol];
	    }
	    
	    function $UpdateTables(this$static, numPosStates) {
	        for (var posState = 0; posState < numPosStates; ++posState) {
	            $SetPrices(this$static, posState, this$static._tableSize, this$static._prices, posState * 272);
	            this$static._counters[posState] = this$static._tableSize;
	        }
	    }
	    
	    function $Create_1(this$static, numPosBits, numPrevBits) {
	        var i, numStates;
	        if (this$static.m_Coders != null && this$static.m_NumPrevBits == numPrevBits && this$static.m_NumPosBits == numPosBits) {
	            return;
	        }
	        this$static.m_NumPosBits = numPosBits;
	        this$static.m_PosMask = (1 << numPosBits) - 1;
	        this$static.m_NumPrevBits = numPrevBits;
	        numStates = 1 << this$static.m_NumPrevBits + this$static.m_NumPosBits;
	        this$static.m_Coders = initDim(numStates);
	        for (i = 0; i < numStates; ++i) {
	            this$static.m_Coders[i] = $Encoder$LiteralEncoder$Encoder2({});
	        }
	    }
	    
	    function $GetSubCoder(this$static, pos, prevByte) {
	        return this$static.m_Coders[((pos & this$static.m_PosMask) << this$static.m_NumPrevBits) + ((prevByte & 255) >>> 8 - this$static.m_NumPrevBits)];
	    }
	    
	    function $Init_3(this$static) {
	        var i, numStates = 1 << this$static.m_NumPrevBits + this$static.m_NumPosBits;
	        for (i = 0; i < numStates; ++i) {
	            InitBitModels(this$static.m_Coders[i].m_Encoders);
	        }
	    }
	    
	    function $Encode_1(this$static, rangeEncoder, symbol) {
	        var bit, i, context = 1;
	        for (i = 7; i >= 0; --i) {
	            bit = symbol >> i & 1;
	            $Encode_3(rangeEncoder, this$static.m_Encoders, context, bit);
	            context = context << 1 | bit;
	        }
	    }
	    
	    function $EncodeMatched(this$static, rangeEncoder, matchByte, symbol) {
	        var bit, i, matchBit, state, same = 1, context = 1;
	        for (i = 7; i >= 0; --i) {
	            bit = symbol >> i & 1;
	            state = context;
	            if (same) {
	                matchBit = matchByte >> i & 1;
	                state += 1 + matchBit << 8;
	                same = matchBit == bit;
	            }
	            $Encode_3(rangeEncoder, this$static.m_Encoders, state, bit);
	            context = context << 1 | bit;
	        }
	    }
	    
	    function $Encoder$LiteralEncoder$Encoder2(this$static) {
	        this$static.m_Encoders = initDim(768);
	        return this$static;
	    }
	    
	    function $GetPrice_0(this$static, matchMode, matchByte, symbol) {
	        var bit, context = 1, i = 7, matchBit, price = 0;
	        if (matchMode) {
	            for (; i >= 0; --i) {
	                matchBit = matchByte >> i & 1;
	                bit = symbol >> i & 1;
	                price += GetPrice(this$static.m_Encoders[(1 + matchBit << 8) + context], bit);
	                context = context << 1 | bit;
	                if (matchBit != bit) {
	                    --i;
	                    break;
	                }
	            }
	        }
	        for (; i >= 0; --i) {
	            bit = symbol >> i & 1;
	            price += GetPrice(this$static.m_Encoders[context], bit);
	            context = context << 1 | bit;
	        }
	        return price;
	    }
	    
	    function $MakeAsChar(this$static) {
	        this$static.BackPrev = -1;
	        this$static.Prev1IsChar = 0;
	    }
	    
	    function $MakeAsShortRep(this$static) {
	        this$static.BackPrev = 0;
	        this$static.Prev1IsChar = 0;
	    }
	    /** ce */
	    /** ds */
	    function $BitTreeDecoder(this$static, numBitLevels) {
	        this$static.NumBitLevels = numBitLevels;
	        this$static.Models = initDim(1 << numBitLevels);
	        return this$static;
	    }
	    
	    function $Decode_0(this$static, rangeDecoder) {
	        var bitIndex, m = 1;
	        for (bitIndex = this$static.NumBitLevels; bitIndex != 0; --bitIndex) {
	            m = (m << 1) + $DecodeBit(rangeDecoder, this$static.Models, m);
	        }
	        return m - (1 << this$static.NumBitLevels);
	    }
	    
	    function $ReverseDecode(this$static, rangeDecoder) {
	        var bit, bitIndex, m = 1, symbol = 0;
	        for (bitIndex = 0; bitIndex < this$static.NumBitLevels; ++bitIndex) {
	            bit = $DecodeBit(rangeDecoder, this$static.Models, m);
	            m <<= 1;
	            m += bit;
	            symbol |= bit << bitIndex;
	        }
	        return symbol;
	    }
	    
	    function ReverseDecode(Models, startIndex, rangeDecoder, NumBitLevels) {
	        var bit, bitIndex, m = 1, symbol = 0;
	        for (bitIndex = 0; bitIndex < NumBitLevels; ++bitIndex) {
	            bit = $DecodeBit(rangeDecoder, Models, startIndex + m);
	            m <<= 1;
	            m += bit;
	            symbol |= bit << bitIndex;
	        }
	        return symbol;
	    }
	    /** de */
	    /** cs */
	    function $BitTreeEncoder(this$static, numBitLevels) {
	        this$static.NumBitLevels = numBitLevels;
	        this$static.Models = initDim(1 << numBitLevels);
	        return this$static;
	    }
	    
	    function $Encode_2(this$static, rangeEncoder, symbol) {
	        var bit, bitIndex, m = 1;
	        for (bitIndex = this$static.NumBitLevels; bitIndex != 0;) {
	            --bitIndex;
	            bit = symbol >>> bitIndex & 1;
	            $Encode_3(rangeEncoder, this$static.Models, m, bit);
	            m = m << 1 | bit;
	        }
	    }
	    
	    function $GetPrice_1(this$static, symbol) {
	        var bit, bitIndex, m = 1, price = 0;
	        for (bitIndex = this$static.NumBitLevels; bitIndex != 0;) {
	            --bitIndex;
	            bit = symbol >>> bitIndex & 1;
	            price += GetPrice(this$static.Models[m], bit);
	            m = (m << 1) + bit;
	        }
	        return price;
	    }
	    
	    function $ReverseEncode(this$static, rangeEncoder, symbol) {
	        var bit, i, m = 1;
	        for (i = 0; i < this$static.NumBitLevels; ++i) {
	            bit = symbol & 1;
	            $Encode_3(rangeEncoder, this$static.Models, m, bit);
	            m = m << 1 | bit;
	            symbol >>= 1;
	        }
	    }
	    
	    function $ReverseGetPrice(this$static, symbol) {
	        var bit, i, m = 1, price = 0;
	        for (i = this$static.NumBitLevels; i != 0; --i) {
	            bit = symbol & 1;
	            symbol >>>= 1;
	            price += GetPrice(this$static.Models[m], bit);
	            m = m << 1 | bit;
	        }
	        return price;
	    }
	    
	    function ReverseEncode(Models, startIndex, rangeEncoder, NumBitLevels, symbol) {
	        var bit, i, m = 1;
	        for (i = 0; i < NumBitLevels; ++i) {
	            bit = symbol & 1;
	            $Encode_3(rangeEncoder, Models, startIndex + m, bit);
	            m = m << 1 | bit;
	            symbol >>= 1;
	        }
	    }
	    
	    function ReverseGetPrice(Models, startIndex, NumBitLevels, symbol) {
	        var bit, i, m = 1, price = 0;
	        for (i = NumBitLevels; i != 0; --i) {
	            bit = symbol & 1;
	            symbol >>>= 1;
	            price += ProbPrices[((Models[startIndex + m] - bit ^ -bit) & 2047) >>> 2];
	            m = m << 1 | bit;
	        }
	        return price;
	    }
	    /** ce */
	    /** ds */
	    function $DecodeBit(this$static, probs, index) {
	        var newBound, prob = probs[index];
	        newBound = (this$static.Range >>> 11) * prob;
	        if ((this$static.Code ^ -2147483648) < (newBound ^ -2147483648)) {
	            this$static.Range = newBound;
	            probs[index] = prob + (2048 - prob >>> 5) << 16 >> 16;
	            if (!(this$static.Range & -16777216)) {
	                this$static.Code = this$static.Code << 8 | $read(this$static.Stream);
	                this$static.Range <<= 8;
	            }
	            return 0;
	        } else {
	            this$static.Range -= newBound;
	            this$static.Code -= newBound;
	            probs[index] = prob - (prob >>> 5) << 16 >> 16;
	            if (!(this$static.Range & -16777216)) {
	                this$static.Code = this$static.Code << 8 | $read(this$static.Stream);
	                this$static.Range <<= 8;
	            }
	            return 1;
	        }
	    }
	    
	    function $DecodeDirectBits(this$static, numTotalBits) {
	        var i, t, result = 0;
	        for (i = numTotalBits; i != 0; --i) {
	            this$static.Range >>>= 1;
	            t = this$static.Code - this$static.Range >>> 31;
	            this$static.Code -= this$static.Range & t - 1;
	            result = result << 1 | 1 - t;
	            if (!(this$static.Range & -16777216)) {
	                this$static.Code = this$static.Code << 8 | $read(this$static.Stream);
	                this$static.Range <<= 8;
	            }
	        }
	        return result;
	    }
	    
	    function $Init_8(this$static) {
	        this$static.Code = 0;
	        this$static.Range = -1;
	        for (var i = 0; i < 5; ++i) {
	            this$static.Code = this$static.Code << 8 | $read(this$static.Stream);
	        }
	    }
	    /** de */
	    
	    function InitBitModels(probs) {
	        for (var i = probs.length - 1; i >= 0; --i) {
	            probs[i] = 1024;
	        }
	    }
	    /** cs */
	    var ProbPrices = (function () {
	        var end, i, j, start, ProbPrices = [];
	        for (i = 8; i >= 0; --i) {
	            start = 1 << 9 - i - 1;
	            end = 1 << 9 - i;
	            for (j = start; j < end; ++j) {
	                ProbPrices[j] = (i << 6) + (end - j << 6 >>> 9 - i - 1);
	            }
	        }
	        return ProbPrices;
	    }());
	    
	    function $Encode_3(this$static, probs, index, symbol) {
	        var newBound, prob = probs[index];
	        newBound = (this$static.Range >>> 11) * prob;
	        if (!symbol) {
	            this$static.Range = newBound;
	            probs[index] = prob + (2048 - prob >>> 5) << 16 >> 16;
	        } else {
	            this$static.Low = add(this$static.Low, and(fromInt(newBound), [4294967295, 0]));
	            this$static.Range -= newBound;
	            probs[index] = prob - (prob >>> 5) << 16 >> 16;
	        }
	        if (!(this$static.Range & -16777216)) {
	            this$static.Range <<= 8;
	            $ShiftLow(this$static);
	        }
	    }
	    
	    function $EncodeDirectBits(this$static, v, numTotalBits) {
	        for (var i = numTotalBits - 1; i >= 0; --i) {
	            this$static.Range >>>= 1;
	            if ((v >>> i & 1) == 1) {
	                this$static.Low = add(this$static.Low, fromInt(this$static.Range));
	            }
	            if (!(this$static.Range & -16777216)) {
	                this$static.Range <<= 8;
	                $ShiftLow(this$static);
	            }
	        }
	    }
	    
	    function $GetProcessedSizeAdd(this$static) {
	        return add(add(fromInt(this$static._cacheSize), this$static._position), [4, 0]);
	    }
	    
	    function $Init_9(this$static) {
	        this$static._position = P0_longLit;
	        this$static.Low = P0_longLit;
	        this$static.Range = -1;
	        this$static._cacheSize = 1;
	        this$static._cache = 0;
	    }
	    
	    function $ShiftLow(this$static) {
	        var temp, LowHi = lowBits_0(shru(this$static.Low, 32));
	        if (LowHi != 0 || compare(this$static.Low, [4278190080, 0]) < 0) {
	            this$static._position = add(this$static._position, fromInt(this$static._cacheSize));
	            temp = this$static._cache;
	            do {
	                $write(this$static.Stream, temp + LowHi);
	                temp = 255;
	            } while (--this$static._cacheSize != 0);
	            this$static._cache = lowBits_0(this$static.Low) >>> 24;
	        }
	        ++this$static._cacheSize;
	        this$static.Low = shl(and(this$static.Low, [16777215, 0]), 8);
	    }
	    
	    function GetPrice(Prob, symbol) {
	        return ProbPrices[((Prob - symbol ^ -symbol) & 2047) >>> 2];
	    }
	    
	    /** ce */
	    /** ds */
	    function decode(utf) {
	        var i = 0, j = 0, x, y, z, l = utf.length, buf = [], charCodes = [];
	        for (; i < l; ++i, ++j) {
	            x = utf[i] & 255;
	            if (!(x & 128)) {
	                if (!x) {
	                    /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
	                    return utf;
	                }
	                charCodes[j] = x;
	            } else if ((x & 224) == 192) {
	                if (i + 1 >= l) {
	                    /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
	                    return utf;
	                }
	                y = utf[++i] & 255;
	                if ((y & 192) != 128) {
	                    /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
	                    return utf;
	                }
	                charCodes[j] = ((x & 31) << 6) | (y & 63);
	            } else if ((x & 240) == 224) {
	                if (i + 2 >= l) {
	                    /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
	                    return utf;
	                }
	                y = utf[++i] & 255;
	                if ((y & 192) != 128) {
	                    /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
	                    return utf;
	                }
	                z = utf[++i] & 255;
	                if ((z & 192) != 128) {
	                    /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
	                    return utf;
	                }
	                charCodes[j] = ((x & 15) << 12) | ((y & 63) << 6) | (z & 63);
	            } else {
	                /// It appears that this is binary data, so it cannot be converted to a string, so just send it back.
	                return utf;
	            }
	            if (j == 16383) {
	                buf.push(String.fromCharCode.apply(String, charCodes));
	                j = -1;
	            }
	        }
	        if (j > 0) {
	            charCodes.length = j;
	            buf.push(String.fromCharCode.apply(String, charCodes));
	        }
	        return buf.join("");
	    }
	    /** de */
	    /** cs */
	    function encode(s) {
	        var ch, chars = [], data, elen = 0, i, l = s.length;
	        /// Be able to handle binary arrays and buffers.
	        if (typeof s == "object") {
	            return s;
	        } else {
	            $getChars(s, 0, l, chars, 0);
	        }
	        /// Add extra spaces in the array to break up the unicode symbols.
	        for (i = 0; i < l; ++i) {
	            ch = chars[i];
	            if (ch >= 1 && ch <= 127) {
	                ++elen;
	            } else if (!ch || ch >= 128 && ch <= 2047) {
	                elen += 2;
	            } else {
	                elen += 3;
	            }
	        }
	        data = [];
	        elen = 0;
	        for (i = 0; i < l; ++i) {
	            ch = chars[i];
	            if (ch >= 1 && ch <= 127) {
	                data[elen++] = ch << 24 >> 24;
	            } else if (!ch || ch >= 128 && ch <= 2047) {
	                data[elen++] = (192 | ch >> 6 & 31) << 24 >> 24;
	                data[elen++] = (128 | ch & 63) << 24 >> 24;
	            } else {
	                data[elen++] = (224 | ch >> 12 & 15) << 24 >> 24;
	                data[elen++] = (128 | ch >> 6 & 63) << 24 >> 24;
	                data[elen++] = (128 | ch & 63) << 24 >> 24;
	            }
	        }
	        return data;
	    }
	    /** ce */
	    
	    function toDouble(a) {
	        return a[1] + a[0];
	    }
	    
	    /** cs */
	    function compress(str, mode, on_finish, on_progress) {
	        var this$static = {},
	            percent,
	            cbn, /// A callback number should be supplied instead of on_finish() if we are using Web Workers.
	            sync = typeof on_finish == "undefined" && typeof on_progress == "undefined";
	        
	        if (typeof on_finish != "function") {
	            cbn = on_finish;
	            on_finish = on_progress = 0;
	        }
	        
	        on_progress = on_progress || function(percent) {
	            if (typeof cbn == "undefined")
	                return;
	            
	            return update_progress(percent, cbn);
	        };
	        
	        on_finish = on_finish || function(res, err) {
	            if (typeof cbn == "undefined")
	                return;
	            
	            return postMessage({
	                action: action_compress,
	                cbn: cbn,
	                result: res,
	                error: err
	            });
	        };

	        if (sync) {
	            this$static.c = $LZMAByteArrayCompressor({}, encode(str), get_mode_obj(mode));
	            while ($processChunk(this$static.c.chunker));
	            return $toByteArray(this$static.c.output);
	        }
	        
	        try {
	            this$static.c = $LZMAByteArrayCompressor({}, encode(str), get_mode_obj(mode));
	            
	            on_progress(0);
	        } catch (err) {
	            return on_finish(null, err);
	        }
	        
	        function do_action() {
	            try {
	                var res, start = (new Date()).getTime();
	                
	                while ($processChunk(this$static.c.chunker)) {
	                    percent = toDouble(this$static.c.chunker.inBytesProcessed) / toDouble(this$static.c.length_0);
	                    /// If about 200 miliseconds have passed, update the progress.
	                    if ((new Date()).getTime() - start > 200) {
	                        on_progress(percent);
	                        
	                        wait(do_action, 0);
	                        return 0;
	                    }
	                }
	                
	                on_progress(1);
	                
	                res = $toByteArray(this$static.c.output);
	                
	                /// delay so we don’t catch errors from the on_finish handler
	                wait(on_finish.bind(null, res), 0);
	            } catch (err) {
	                on_finish(null, err);
	            }
	        }
	        
	        ///NOTE: We need to wait to make sure it is always async.
	        wait(do_action, 0);
	    }
	    /** ce */
	    /** ds */
	    function decompress(byte_arr, on_finish, on_progress) {
	        var this$static = {},
	            percent,
	            cbn, /// A callback number should be supplied instead of on_finish() if we are using Web Workers.
	            has_progress,
	            len,
	            sync = typeof on_finish == "undefined" && typeof on_progress == "undefined";

	        if (typeof on_finish != "function") {
	            cbn = on_finish;
	            on_finish = on_progress = 0;
	        }
	        
	        on_progress = on_progress || function(percent) {
	            if (typeof cbn == "undefined")
	                return;
	            
	            return update_progress(has_progress ? percent : -1, cbn);
	        };
	        
	        on_finish = on_finish || function(res, err) {
	            if (typeof cbn == "undefined")
	                return;
	            
	            return postMessage({
	                action: action_decompress,
	                cbn: cbn,
	                result: res,
	                error: err
	            });
	        };

	        if (sync) {
	            this$static.d = $LZMAByteArrayDecompressor({}, byte_arr);
	            while ($processChunk(this$static.d.chunker));
	            return decode($toByteArray(this$static.d.output));
	        }
	        
	        try {
	            this$static.d = $LZMAByteArrayDecompressor({}, byte_arr);
	            
	            len = toDouble(this$static.d.length_0);
	            
	            ///NOTE: If the data was created via a stream, it will not have a length value, and therefore we can't calculate the progress.
	            has_progress = len > -1;
	            
	            on_progress(0);
	        } catch (err) {
	            return on_finish(null, err);
	        }
	        
	        function do_action() {
	            try {
	                var res, i = 0, start = (new Date()).getTime();
	                while ($processChunk(this$static.d.chunker)) {
	                    if (++i % 1000 == 0 && (new Date()).getTime() - start > 200) {
	                        if (has_progress) {
	                            percent = toDouble(this$static.d.chunker.decoder.nowPos64) / len;
	                            /// If about 200 miliseconds have passed, update the progress.
	                            on_progress(percent);
	                        }
	                        
	                        ///NOTE: This allows other code to run, like the browser to update.
	                        wait(do_action, 0);
	                        return 0;
	                    }
	                }
	                
	                on_progress(1);
	                
	                res = decode($toByteArray(this$static.d.output));
	                
	                /// delay so we don’t catch errors from the on_finish handler
	                wait(on_finish.bind(null, res), 0);
	            } catch (err) {
	                on_finish(null, err);
	            }
	        }
	        
	        ///NOTE: We need to wait to make sure it is always async.
	        wait(do_action, 0);
	    }
	    /** de */
	    /** cs */
	    var get_mode_obj = (function () {
	        /// s is dictionarySize
	        /// f is fb
	        /// m is matchFinder
	        ///NOTE: Because some values are always the same, they have been removed.
	        /// lc is always 3
	        /// lp is always 0
	        /// pb is always 2
	        var modes = [
	            {s: 16, f:  64, m: 0},
	            {s: 20, f:  64, m: 0},
	            {s: 19, f:  64, m: 1},
	            {s: 20, f:  64, m: 1},
	            {s: 21, f: 128, m: 1},
	            {s: 22, f: 128, m: 1},
	            {s: 23, f: 128, m: 1},
	            {s: 24, f: 255, m: 1},
	            {s: 25, f: 255, m: 1}
	        ];
	        
	        return function (mode) {
	            return modes[mode - 1] || modes[6];
	        };
	    }());
	    /** ce */
	    
	    /// If we're in a Web Worker, create the onmessage() communication channel.
	    ///NOTE: This seems to be the most reliable way to detect this.
	    if (typeof onmessage != "undefined" && (typeof window == "undefined" || typeof window.document == "undefined")) {
	        (function () {
	            /* jshint -W020 */
	            /// Create the global onmessage function.
	            onmessage = function (e) {
	                if (e && e.data) {
	                    /** xs */
	                    if (e.data.action == action_decompress) {
	                        LZMA$1.decompress(e.data.data, e.data.cbn);
	                    } else if (e.data.action == action_compress) {
	                        LZMA$1.compress(e.data.data, e.data.mode, e.data.cbn);
	                    }
	                    /** xe */
	                    /// co:if (e.data.action == action_compress) {
	                    /// co:    LZMA.compress(e.data.data, e.data.mode, e.data.cbn);
	                    /// co:}
	                    /// do:if (e.data.action == action_decompress) {
	                    /// do:    LZMA.decompress(e.data.data, e.data.cbn);
	                    /// do:}
	                }
	            };
	        }());
	    }
	        
	    return {
	        /** xs */
	        compress:   compress,
	        decompress: decompress,
	        /** xe */
	        /// co:compress:   compress
	        /// do:decompress: decompress
	    };
	}());

	/// This is used by browsers that do not support web workers (and possibly Node.js).
	commonjsGlobal.LZMA = commonjsGlobal.LZMA_WORKER = LZMA$1;

	var byteLength_1 = byteLength;
	var toByteArray_1 = toByteArray;
	var fromByteArray_1 = fromByteArray;

	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	for (var i$3 = 0, len = code.length; i$3 < len; ++i$3) {
	  lookup[i$3] = code[i$3];
	  revLookup[code.charCodeAt(i$3)] = i$3;
	}

	// Support decoding URL-safe base64 strings, as Node.js does.
	// See: https://en.wikipedia.org/wiki/Base64#URL_applications
	revLookup['-'.charCodeAt(0)] = 62;
	revLookup['_'.charCodeAt(0)] = 63;

	function getLens (b64) {
	  var len = b64.length;

	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // Trim off extra bytes after placeholder bytes are found
	  // See: https://github.com/beatgammit/base64-js/issues/42
	  var validLen = b64.indexOf('=');
	  if (validLen === -1) validLen = len;

	  var placeHoldersLen = validLen === len
	    ? 0
	    : 4 - (validLen % 4);

	  return [validLen, placeHoldersLen]
	}

	// base64 is 4/3 + up to two characters of the original data
	function byteLength (b64) {
	  var lens = getLens(b64);
	  var validLen = lens[0];
	  var placeHoldersLen = lens[1];
	  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
	}

	function _byteLength (b64, validLen, placeHoldersLen) {
	  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
	}

	function toByteArray (b64) {
	  var tmp;
	  var lens = getLens(b64);
	  var validLen = lens[0];
	  var placeHoldersLen = lens[1];

	  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));

	  var curByte = 0;

	  // if there are placeholders, only get up to the last complete 4 chars
	  var len = placeHoldersLen > 0
	    ? validLen - 4
	    : validLen;

	  for (var i = 0; i < len; i += 4) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 18) |
	      (revLookup[b64.charCodeAt(i + 1)] << 12) |
	      (revLookup[b64.charCodeAt(i + 2)] << 6) |
	      revLookup[b64.charCodeAt(i + 3)];
	    arr[curByte++] = (tmp >> 16) & 0xFF;
	    arr[curByte++] = (tmp >> 8) & 0xFF;
	    arr[curByte++] = tmp & 0xFF;
	  }

	  if (placeHoldersLen === 2) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 2) |
	      (revLookup[b64.charCodeAt(i + 1)] >> 4);
	    arr[curByte++] = tmp & 0xFF;
	  }

	  if (placeHoldersLen === 1) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 10) |
	      (revLookup[b64.charCodeAt(i + 1)] << 4) |
	      (revLookup[b64.charCodeAt(i + 2)] >> 2);
	    arr[curByte++] = (tmp >> 8) & 0xFF;
	    arr[curByte++] = tmp & 0xFF;
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] +
	    lookup[num >> 12 & 0x3F] +
	    lookup[num >> 6 & 0x3F] +
	    lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp;
	  var output = [];
	  for (var i = start; i < end; i += 3) {
	    tmp =
	      ((uint8[i] << 16) & 0xFF0000) +
	      ((uint8[i + 1] << 8) & 0xFF00) +
	      (uint8[i + 2] & 0xFF);
	    output.push(tripletToBase64(tmp));
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  var tmp;
	  var len = uint8.length;
	  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
	  var parts = [];
	  var maxChunkLength = 16383; // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(
	      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
	    ));
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1];
	    parts.push(
	      lookup[tmp >> 2] +
	      lookup[(tmp << 4) & 0x3F] +
	      '=='
	    );
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
	    parts.push(
	      lookup[tmp >> 10] +
	      lookup[(tmp >> 4) & 0x3F] +
	      lookup[(tmp << 2) & 0x3F] +
	      '='
	    );
	  }

	  return parts.join('')
	}

	var base64Js = {
		byteLength: byteLength_1,
		toByteArray: toByteArray_1,
		fromByteArray: fromByteArray_1
	};

	function searchToObject () {
	  // modified from https://stackoverflow.com/a/7090123/806777
	  return window.location.search.slice(1).split('&').reduce((result, value) => {
	    let parts = value.split('=').map(decodeURIComponent);
	    if (parts[0]) {
	      let val = parts[1];
	      try {
	        val = base64Js.toByteArray(val);
	        val = LZMA.decompress(val);
	        val = JSON.parse(val);
	      } catch (error) {
	        console.error(`ParseError: ${error}`);
	        return result
	      }
	      result[parts[0]] = val;
	    }
	    return result
	  }, {})
	}

	function objectToUrl (object, key) {
	  let val = '';
	  try {
	    val = JSON.stringify(object);
	    val = LZMA.compress(val);
	    val = base64Js.fromByteArray(val);
	  } catch (error) {
	    throw new Error(`ParseError: ${error}`)
	  }
	  const href = `?${encodeURIComponent(key || 'data')}=${encodeURIComponent(val)}`;
	  window.history.replaceState('', document.title, href);
	}

	const globalSave = {
	  pickermodel: 'hsl',
	  grayscale: false,
	  textvisible: true,
	  cardViewModels: {
	    hex: true,
	    rgb: false,
	    hsl: true,
	    hsv: false,
	    hcg: false,
	    hwb: false,
	    cmyk: false,
	    contrast: true,
	  },
	};

	const store = new Histore(
	  Object.assign({}, globalSave, defaultpalette),
	  {
	    globalStorageKey: '$color-factory',
	    saveTypes: {
	      global: Object.keys(globalSave),
	      palette: Object.keys(defaultpalette),
	    },
	    keymaps: [
	      {
	        key: 'ctrl+z',
	        action: 'undo',
	      },
	      {
	        key: 'ctrl+shift+z',
	        action: 'redo',
	      },
	      {
	        key: 'ctrl+a',
	        action: 'selectAll',
	      },
	      {
	        key: 'delete',
	        action: 'delete',
	      },
	    ],
	  }
	);

	store.on('state', ({ changed, current }) => {
	  if (changed.cards) {
	    for (let i = 0; i < current.cards.length; i++) {
	      const card = current.cards[i];
	      if (!(card.color instanceof Color$1)) {
	        card.color = new Color$1(card.color);
	      }
	      card.index = i;
	      card.zIndex = card.zIndex == null ? i : card.zIndex;
	    }
	  }
	  if (current.bgColor && !(current.bgColor instanceof Color$1)) {
	    current.bgColor = new Color$1(current.bgColor);
	  }
	});

	store.add('palette', defaultpalette.paletteName, defaultpalette);
	store.add('palette', fuji.paletteName, fuji);

	const query = searchToObject();
	if (query.data) {
	  const key = query.data.paletteName || 'Imported palette';
	  query.data.paletteName = key;
	  store.set(query.data, true);
	} else {
	  try {
	    store.load('palette', '');
	  } catch (error) {
	    store.load('palette', defaultpalette.paletteName);
	  }
	}

	const keys$2 = Object.keys(defaultpalette);
	store.on('update', ({ changed, current }) => {
	  if (changed) {
	    objectToUrl(keys$2.reduce((obj, key) => {
	      obj[key] = current[key];
	      return obj
	    }, {}));
	  }
	});

	// Events
	store.on('cards.ADD_CARD', (card) => {
	  store.set({ cards: (cards) => {
	    card.color = new Color$1(card.color);
	    card.zIndex = cards.length;
	    card.index = cards.length;
	    return [...cards, store.cardPosition(card)]
	  } });
	  store.memo();
	});

	store.on('cards.EDIT_CARD', (index, param) => {
	  store.set({ cards: (cards) => {
	    const card = cards[index];
	    Object.assign(card, param);
	    return cards
	  } });
	});
	// @params {array} indexs
	store.on('cards.DUPLICATE_CARD', (indexs) => {
	  store.set({ cards: (cards) => {
	    const newCards = indexs.map((index, i) => {
	      const card = Object.assign({}, cards[index]);
	      card.color = new Color$1(card.color);
	      card.zIndex = cards.length + i;
	      card.index = cards.length + i;
	      card.left += 30;
	      card.top += 30;
	      return store.cardPosition(card)
	    });
	    return cards.concat(newCards)
	  } });
	  store.memo();
	});
	// @params {array} indexs
	store.on('cards.TOGGLE_TEXTMODE', (indexs, bool) => {
	  store.set({ cards: (cards) => {
	    indexs.map((index) => {
	      const card = cards[index];
	      card.textMode = typeof bool === 'boolean' ? bool : !card.textMode;
	    });
	    return cards
	  } });
	  store.memo();
	});

	// @params {array} indexs
	/**
	 * [5,2,1,4,7][3,6]
	 * [4,2,1,3,5]
	 *
	 * [5,2,1,4,7,12][3,6,8,9,10,11]
	 * [4,2,1,3,5,6]
	 */
	store.on('cards.REMOVE_CARD', (indexs) => {
	  store.set({ cards: (cards) => {
	    const zIndexs = indexs.map((i) => cards[i].zIndex);
	    return cards.reduce((newcards, card, i) => {
	      if (!~indexs.indexOf(i)) {
	        card.index = newcards.length;
	        card.zIndex -= zIndexs.reduce((num, zIndex) => num + (card.zIndex > zIndex), 0);
	        newcards.push(card);
	      }
	      return newcards
	    }, [])
	  } });
	  store.memo();
	});

	store.on('cards.CARD_FORWARD', (index) => {
	  store.set({ cards: (cards) => {
	    const currIndex = +cards[index].zIndex;
	    cards.forEach((card, i) => {
	      if (i === index) {
	        card.zIndex = cards.length - 1;
	      } else if (card.zIndex > currIndex) {
	        --card.zIndex;
	      }
	    });
	    return cards
	  } });
	});

	function round (num, digit) {
	  return Number(num.toFixed(digit))
	}

	const numStylekey = ['width', 'height', 'top', 'left'];
	function styler (dom, data) {
	  if (dom[0] === void 0) {
	    dom = [dom];
	  }
	  dom.forEach((el) => {
	    const style = el.style;
	    for (let key in data) {
	      const val = data[key];
	      if (typeof val === 'number' && numStylekey.indexOf(key) !== -1) {
	        style[key] = val + 'px';
	      } else if (val != null) {
	        style[key] = val;
	      }
	    }
	  });
	}

	/**
	 * クリップボードコピー関数
	 *
	 * @export
	 * @param {string} textVal
	 * @returns {boolean}
	 */
	function copyTextToClipboard (textVal) {
	  // テキストエリアを用意する
	  const copyFrom = document.createElement('textarea');
	  // テキストエリアへ値をセット
	  copyFrom.textContent = textVal;

	  // bodyタグの要素を取得
	  const bodyElm = document.getElementsByTagName('body')[0];
	  // 子要素にテキストエリアを配置
	  bodyElm.appendChild(copyFrom);

	  // テキストエリアの値を選択
	  copyFrom.select();
	  // コピーコマンド発行
	  const retVal = document.execCommand('copy');
	  // 追加テキストエリアを削除
	  bodyElm.removeChild(copyFrom);

	  return retVal
	}

	/* src\color-picker\color-input.html generated by Svelte v2.13.5 */

	function caretIndex (event, color) {
	  const { value, selectionStart } = event.target;
	  const index = value[0] === '#'
	    ? Math.floor((selectionStart - 1) / 2)
	    // count ',' before selectionStart
	    : value.substring(0, selectionStart).replace(/[^,()]/g, '').length - 1;
	  return ((value[0] === '#' || color.alpha() === 1) && index === 3) || index === 4 ? -1 : index
	}

	function value({ color, model }) {
		return color.toString(model);
	}

	function textColor({ color, bgColor }) {
		return bgColor.alphaBlending(color).isDark() ? '#fff' : '#000';
	}

	function data$1() {
	  return {
	    phone: /iPhone|iPad|Android/.test(window.navigator.userAgent),
	    color: new Color$1('#050'),
	    bgColor: '',
	    models: ['hex', 'rgb', '%', 'hsl', 'hsv', 'xyz', 'lab', 'cmyk'],
	    model: 'rgb',
	  }
	}
	function updown(node, callback) {
	  function onkeydown (event) {
	    let time;
	    if (/Arrow(Up|Down)/.test(event.key)) {
	      callback(event);
	      time = setTimeout(() => {
	        clearTimeout(time);
	        time = setInterval(() => callback(event), 100);
	      }, 300);
	    }
	    function onkeyup (e) {
	      clearInterval(time);
	      time = null;
	      node.removeEventListener('keyup', onkeyup, false);
	    }

	    node.addEventListener('keyup', onkeyup, false);
	  }

	  node.addEventListener('keydown', onkeydown, false);

	  return {
	    teardown () {
	      node.removeEventListener('keydown', onkeydown, false);
	    }
	  }
	}
	function modelStyler(_model, model, color, bgColor, textColor) {
	  return model === _model
	    ? `color: ${textColor}; background-color: ${color};`
	    : `color: ${bgColor.mostReadable('#ccc', '#333')}; background-color: transparent;`
	}
	var methods = {
	  randomColor () {
	    this.set({ color: Color$1.random() });
	  },
	  keydown (event) {
	    const value = event.target.value;
	    const color = new Color$1(value);
	    if (/^#?([a-f\d]{3})$/i.test(value) && event.key === 'Enter') {
	      this.set({ color, model: 'hex' });
	    }
	  },
	  input (event) {
	    const value = event.target.value;
	    if (!event.target.value) return

	    let color;
	    try {
	      color = new Color$1(value);
	    } catch (error) {
	      return
	    }
	    if (/^#?([a-f\d]{3})$/i.test(value)) return
	    const model = /^#?([a-f\d]{6})$/i.test(value) ? 'hex' : color.model;
	    this.set({ color, model });
	  },
	  updown (event) {
	    const { value, selectionStart, selectionEnd } = event.target;
	    const numbercheckReg = /-?(?:0?\.)?\d{1,3}/g;
	    if (
	      selectionStart !== selectionEnd &&
	      !numbercheckReg.test(value.substring(selectionStart, selectionEnd))
	    ) {
	      return
	    }

	    const { model, models } = this.get();
	    let color;
	    try {
	      color = new Color$1(value);
	    } catch (error) {
	      try {
	        const arr = value.match(/.*?\(([-\d.%, ]*)\)/)[1].split(',');
	        color = new Color$1(arr.map((v) => {
	          v = v.trim();
	          if (v.slice(-1) === '%') {
	            v = parseFloat(v) / 100;
	          } else {
	            v = parseFloat(v);
	          }
	          return v
	        }), model);
	      } catch (error) {
	        return
	      }
	    }

	    const index = caretIndex(event, color);

	    if (index === -1) {
	      const arrow = event.type === 'keydown'
	        ? (event.key === 'ArrowUp' ? 1 : -1)
	        : event.deltaY < 0 ? 1 : -1;

	      let findex = models.indexOf(model) + arrow;

	      if (findex < 0) {
	        findex = models.length + findex;
	      } else if (findex >= models.length) {
	        findex -= models.length;
	      }
	      this.set({ model: models[findex] });
	    } else {
	      const arrow = event.type === 'keydown'
	        ? (event.key === 'ArrowUp' ? 1 : -1) * (event.shiftKey ? 10 : 1)
	        : event.deltaY < 0 ? 10 : -10;

	      let param = model === '%' ? color.unitArray() : color[model]().array();

	      if (index === 3) {
	        // alpla
	        color = color.alpha(color.alpha() + arrow / 100);
	      } else {
	        // not alpla
	        switch (model) {
	          case '%':
	            const val = (param[index] + arrow / 100) * 255;
	            param = color.rgb().array();
	            param[index] = val;
	            color = new Color$1(param, 'rgb');
	            break
	          default:
	            param[index] += arrow;
	            color = new Color$1(param, model);
	            break
	        }
	      }
	      this.set({ color });
	      if (model !== 'hex') {
	        let result;
	        for (let i = -1; i < index; i++) {
	          result = numbercheckReg.exec(value);
	        }
	        event.target.selectionStart = result.index;
	        event.target.selectionEnd = result.index + result[0].length;
	      }
	    }
	  },
	};

	const file = "src\\color-picker\\color-input.html";

	function create_main_fragment(component, ctx) {
		var if_block_anchor;

		function select_block_type(ctx) {
			if (ctx.phone) return create_if_block;
			return create_if_block_1;
		}

		var current_block_type = select_block_type(ctx);
		var if_block = current_block_type(component, ctx);

		return {
			c: function create() {
				if_block.c();
				if_block_anchor = createComment();
			},

			m: function mount(target, anchor) {
				if_block.m(target, anchor);
				insert(target, if_block_anchor, anchor);
			},

			p: function update(changed, ctx) {
				if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block.d(1);
					if_block = current_block_type(component, ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},

			d: function destroy$$1(detach) {
				if_block.d(detach);
				if (detach) {
					detachNode(if_block_anchor);
				}
			}
		};
	}

	// (5:4) {#each models as _model}
	function create_each_block(component, ctx) {
		var div, button, text_value = ctx._model.toUpperCase(), text, button_style_value;

		return {
			c: function create() {
				div = createElement("div");
				button = createElement("button");
				text = createText(text_value);
				button._svelte = { component, ctx };

				addListener(button, "click", click_handler);
				button.style.cssText = button_style_value = modelStyler(ctx._model, ctx.model, ctx.color, ctx.bgColor, ctx.textColor);
				button.className = "svelte-qzhqz5";
				addLoc(button, file, 6, 6, 128);
				addLoc(div, file, 5, 4, 115);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, button);
				append(button, text);
			},

			p: function update(changed, _ctx) {
				ctx = _ctx;
				if ((changed.models) && text_value !== (text_value = ctx._model.toUpperCase())) {
					setData(text, text_value);
				}

				button._svelte.ctx = ctx;
				if ((changed.models || changed.model || changed.color || changed.bgColor || changed.textColor) && button_style_value !== (button_style_value = modelStyler(ctx._model, ctx.model, ctx.color, ctx.bgColor, ctx.textColor))) {
					button.style.cssText = button_style_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(button, "click", click_handler);
			}
		};
	}

	// (1:0) {#if phone}
	function create_if_block(component, ctx) {
		var input;

		return {
			c: function create() {
				input = createElement("input");
				setAttribute(input, "type", "color");
				addLoc(input, file, 1, 2, 15);
			},

			m: function mount(target, anchor) {
				insert(target, input, anchor);
			},

			p: noop,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(input);
				}
			}
		};
	}

	// (3:0) {:else}
	function create_if_block_1(component, ctx) {
		var div, text_1, div_1, input, updown_handler, text_2, button, text_3;

		var each_value = ctx.models;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(component, get_each_context(ctx, each_value, i));
		}

		function input_handler(event) {
			component.input(event);
		}

		function wheel_handler(event) {
			component.updown(event);
		}

		function keydown_handler(event) {
			component.keydown(event);
		}

		function click_handler_1(event) {
			component.randomColor();
		}

		return {
			c: function create() {
				div = createElement("div");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				text_1 = createText("\r\n  ");
				div_1 = createElement("div");
				input = createElement("input");
				text_2 = createText("\r\n    ");
				button = createElement("button");
				text_3 = createText("!");
				div.className = "models button-set svelte-qzhqz5";
				addLoc(div, file, 3, 2, 48);
				addListener(input, "input", input_handler);

				updown_handler = updown.call(component, input, function(event) {
					component.updown(event);
				});

				addListener(input, "wheel", wheel_handler);
				addListener(input, "keydown", keydown_handler);
				input.className = "color-text svelte-qzhqz5";
				setStyle(input, "color", ctx.textColor);
				setStyle(input, "background-color", ctx.color.rgb());
				input.value = ctx.value;
				input.spellcheck = "";
				input.placeholder = "keypress: ↑↓";
				addLoc(input, file, 13, 4, 353);
				addListener(button, "click", click_handler_1);
				button.className = "random-color svelte-qzhqz5";
				button.title = "Random Color";
				setStyle(button, "color", ctx.color.hex());
				setStyle(button, "background-color", ctx.textColor);
				addLoc(button, file, 22, 4, 654);
				div_1.className = "input-wrapper svelte-qzhqz5";
				addLoc(div_1, file, 12, 2, 320);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(div, null);
				}

				insert(target, text_1, anchor);
				insert(target, div_1, anchor);
				append(div_1, input);
				append(div_1, text_2);
				append(div_1, button);
				append(button, text_3);
			},

			p: function update(changed, ctx) {
				if (changed.models || changed.model || changed.color || changed.bgColor || changed.textColor) {
					each_value = ctx.models;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(div, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}

				if (changed.textColor) {
					setStyle(input, "color", ctx.textColor);
				}

				if (changed.color) {
					setStyle(input, "background-color", ctx.color.rgb());
				}

				if (changed.value) {
					input.value = ctx.value;
				}

				if (changed.color) {
					setStyle(button, "color", ctx.color.hex());
				}

				if (changed.textColor) {
					setStyle(button, "background-color", ctx.textColor);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				destroyEach(each_blocks, detach);

				if (detach) {
					detachNode(text_1);
					detachNode(div_1);
				}

				removeListener(input, "input", input_handler);
				updown_handler.destroy();
				removeListener(input, "wheel", wheel_handler);
				removeListener(input, "keydown", keydown_handler);
				removeListener(button, "click", click_handler_1);
			}
		};
	}

	function get_each_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx._model = list[i];
		child_ctx.each_value = list;
		child_ctx._model_index = i;
		return child_ctx;
	}

	function click_handler(event) {
		const { component, ctx } = this._svelte;

		component.set({model: ctx._model});
	}

	function Color_input(options) {
		this._debugName = '<Color_input>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(data$1(), options.data);
		this._recompute({ color: 1, model: 1, bgColor: 1 }, this._state);
		if (!('color' in this._state)) console.warn("<Color_input> was created without expected data property 'color'");
		if (!('model' in this._state)) console.warn("<Color_input> was created without expected data property 'model'");
		if (!('bgColor' in this._state)) console.warn("<Color_input> was created without expected data property 'bgColor'");
		if (!('phone' in this._state)) console.warn("<Color_input> was created without expected data property 'phone'");
		if (!('models' in this._state)) console.warn("<Color_input> was created without expected data property 'models'");
		this._intro = true;

		this._fragment = create_main_fragment(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}
	}

	assign(Color_input.prototype, protoDev);
	assign(Color_input.prototype, methods);

	Color_input.prototype._checkReadOnly = function _checkReadOnly(newState) {
		if ('value' in newState && !this._updatingReadonlyProperty) throw new Error("<Color_input>: Cannot set read-only property 'value'");
		if ('textColor' in newState && !this._updatingReadonlyProperty) throw new Error("<Color_input>: Cannot set read-only property 'textColor'");
	};

	Color_input.prototype._recompute = function _recompute(changed, state) {
		if (changed.color || changed.model) {
			if (this._differs(state.value, (state.value = value(state)))) changed.value = true;
		}

		if (changed.color || changed.bgColor) {
			if (this._differs(state.textColor, (state.textColor = textColor(state)))) changed.textColor = true;
		}
	};

	/**
	 * constructor PositionManager
	 *
	 * @export
	 * @class PositionManager
	 * @param {object} options
	 */
	class PositionManager {
	  constructor (options) {
	    this.options = Object.assign({
	      containment: document.body,
	      handle: null,
	      grid: 1,
	      axis: false, // or 'x' , 'y', 'shift', 'ctrl', 'alt'
	    }, options || {});

	    let grid = this.options.grid;
	    if (!Array.isArray(grid)) {
	      grid = parseFloat(grid, 10) || 1;
	      grid = [grid, grid];
	    }
	    this.options.grid = grid;

	    // containment内に置ける現在のマウス相対位置
	    this.x = 0;
	    this.y = 0;
	    // this.x、this.yの初期値保存
	    this.startX = 0;
	    this.startY = 0;

	    this.handleRect = { width: 0, height: 0, left: 0, top: 0 };

	    // position
	    const position = { left: 0, top: 0 };
	    // 代入したときにもthis.adjust()したい
	    Object.defineProperties(this, {
	      left: {
	        get () {
	          return position.left
	        },
	        set (val) {
	          position.left = this.adjust(val, 'width');
	        }
	      },
	      top: {
	        get () {
	          return position.top
	        },
	        set (val) {
	          position.top = this.adjust(val, 'height');
	        }
	      },
	    });
	  }

	  /**
	   * mousemove, mouseup
	   *
	   * @param {Event}   e
	   * @param {Boolean} [initflg]
	   * @param {Element} [handle=this.options.handle]
	   * @returns
	   *
	   * @memberOf PositionManager
	   */
	  set (e, initflg, handle = this.options.handle) {
	    if (initflg) {
	      // ボックスサイズ取得。ここに書くのはresize対策
	      this.parentRect = this.options.containment.getBoundingClientRect();
	      if (handle) this.handleRect = handle.getBoundingClientRect();
	    }

	    const event = 'touches' in e ? e.touches[0] : e;
	    // スクロールも考慮した絶対座標 this.parentRect.left - window.pageXOffset
	    this.x = event.pageX - this.parentRect.left - window.pageXOffset;
	    this.y = event.pageY - this.parentRect.top - window.pageYOffset;

	    if (initflg) {
	      this.startX = this.x;
	      this.startY = this.y;
	      this.vectorX = 0;
	      this.vectorY = 0;
	    } else {
	      this.vectorX = this.x - this.startX;
	      this.vectorY = this.y - this.startY;
	    }

	    // modify
	    this.left = this.handleRect.left - this.parentRect.left + this.vectorX;
	    this.top  = this.handleRect.top - this.parentRect.top + this.vectorY;

	    this.percentLeft = this.percentage(this.x, 'width');
	    this.percentTop  = this.percentage(this.y, 'height');

	    if (initflg) {
	      this.startLeft = this.left;
	      this.startTop  = this.top;
	    }
	    return this
	  }


	  /**
	   * handle move
	   *
	   * @param {Event}    e
	   * @param {Element} [el=this.options.handle]
	   * @returns
	   *
	   * @memberOf PositionManager
	   */
	  setPosition (e, el = this.options.handle) {
	    switch (this.options.axis) {
	      case 'x':
	      case 'y':
	        this.oneWayMove(this.options.axis, el);
	        break
	      case 'shift':
	      case 'ctrl':
	      case 'alt':
	        if (e[this.options.axis + 'Key']) {
	          const maxV = Math.abs(this.vectorX) > Math.abs(this.vectorY);
	          this.oneWayMove(maxV ? 'x' : 'y', el);
	          break
	        }
	        // fall through
	      default:
	        el.style.left = this.left + 'px';
	        el.style.top  = this.top + 'px';
	    }
	    if (typeof this.width === 'number') {
	      el.style.width  = this.width + 'px';
	    }
	    if (typeof this.height === 'number') {
	      el.style.height = this.height + 'px';
	    }
	    return this
	  }
	  oneWayMove (either, el = this.options.handle) {
	    if (either === 'x') {
	      el.style.left = this.left + 'px';
	      el.style.top = this.startTop + 'px';
	    } else if (either === 'y') {
	      el.style.left = this.startLeft + 'px';
	      el.style.top = this.top + 'px';
	    }
	    return this
	  }

	  /**
	   * Box内に制限しグリッド幅に合わせ計算調整する
	   *
	   * @param {Number}  offset                     this.handleRect.left + this.vectorX
	   * @param {String}  side
	   * @param {Object}  [rect=this.handleRect]     getBoundingClientRect
	   * @returns {Number}          this.left
	   *
	   * @memberOf PositionManager
	   */
	  adjust (offset, side, rect = this.handleRect) {
	    const options = this.options;
	    // handlesの動きをcontainmentに制限する
	    if (options.containment !== document.body) {
	      offset = Math.min(Math.max(0, offset), this.parentRect[side] - rect[side]);
	    }
	    const grid = side === 'width' ? options.grid[0] : options.grid[1];
	    offset = Math.round(offset / grid) * grid;
	    return offset
	  }
	  /**
	   * Boxを基準にした％
	   *
	   * @param {Number}  offset    this.left
	   * @param {String}  side
	   * @returns {Number} ％
	   *
	   * @memberOf PositionManager
	   */
	  percentage (offset, side) {
	    return Math.min(Math.max(0, offset / (this.parentRect[side] - this.handleRect[side]) * 100), 100)
	  }
	}

	/**
	 * addEventListener & removeEventListener
	 *
	 * @export
	 * @param {element}  el
	 * @param {string}   eventNames Multiple event registration with space delimiter.スぺース区切りで複数イベント登録
	 * @param {function} callback
	 * @param {boolean}  [useCapture]
	 */
	function on$1 (el, eventNames, callback, useCapture) {
	  eventNames.split(' ').forEach((eventName) => {
	(el || window).addEventListener(eventName, callback, !!useCapture);
	  });
	}
	function off (el, eventNames, callback, useCapture) {
	  eventNames.split(' ').forEach((eventName) => {
	(el || window).removeEventListener(eventName, callback, !!useCapture);
	  });
	}

	/**
	 * マウス座標
	 *
	 * @param {Object|Element} options
	 */
	class MousePosition {
	  constructor (element,  options) {
	    this.options = Object.assign({
	      containment: element || document.body,
	      handle: null,
	      // start: noop,
	      // drag: noop,
	      // stop: noop,
	      switch: true,
	    }, options || {});

	    // イベント登録
	    this._event = {
	      mdown: (e) => { this.mdown(e); },
	      mmove: (e) => { this.mmove(e); },
	      mup: (e) => { this.mup(e); },
	    };
	    on$1(element, 'mousedown touchstart', this._event.mdown);

	    this.position = new PositionManager(this.options);

	    this._clickFlg = false;
	  }

	  destroy () {
	    off(0, 'mousedown touchstart', this._event.mdown);
	  }

	  toggle (bool = !this.options.switch) {
	    this.options.switch = bool;
	  }

	  // マウスが押された際の関数
	  mdown (e, handle) {
	    if (!this.options.switch) return
	    const { options, position } = this;
	    // マウス座標を保存
	    position.set(e, true, handle);

	    if (options.start) {
	      options.start(e, position, handle);
	    }
	    on$1(0, 'mouseup touchcancel touchend', this._event.mup);
	    on$1(0, 'mousemove touchmove', this._event.mmove);
	    this._clickFlg = true;
	  }
	  // マウスカーソルが動いたときに発火
	  mmove (e) {
	    if (!this.options.switch) return
	    const { options, position } = this;
	    // マウスが動いたベクトルを保存
	    position.set(e);
	    // フリックしたときに画面を動かさないようにデフォルト動作を抑制
	    e.preventDefault();

	    if (options.drag) {
	      options.drag(e, position);
	    }
	    // カーソルが外れたとき発火
	    on$1(0, 'mouseleave touchleave', this._event.mup);
	    this._clickFlg = false;
	  }
	  // マウスボタンが上がったら発火
	  mup (e) {
	    if (!this.options.switch) return
	    const { options, position } = this;
	    // マウスが動いたベクトルを保存
	    position.set(e);

	    if (this._clickFlg && options.click) {
	      options.click(e, position);
	    } else if (options.stop) {
	      options.stop(e, position);
	    }
	    // ハンドラの消去
	    off(0, 'mouseup touchend touchcancel mouseleave touchleave', this._event.mup);
	    off(0, 'mousemove touchmove', this._event.mmove);
	  }
	}

	/**
	 * movable
	 *
	 * @export
	 * @param {element} element
	 * @param {object} options
	 */
	class Movable extends MousePosition {
	  constructor (element, options) {
	    super(element, Object.assign({
	      containment: element.parentElement,
	      handle: element,
	      draggingClass: 'dragging',
	    }, options || {}));
	  }
	  // マウスが押された際の関数
	  mdown (e) {
	    super.mdown(e);
	    // クラス名に .drag を追加
	    this.options.handle.classList.add(this.options.draggingClass);
	  }
	  // マウスカーソルが動いたときに発火
	  mmove (e) {
	    super.mmove(e);
	    // マウスが動いた場所に要素を動かす
	    this.position.setPosition(e);
	  }
	  // マウスボタンが上がったら発火
	  mup (e) {
	    super.mup(e);
	    // クラス名 .drag も消す
	    this.options.handle.classList.remove(this.options.draggingClass);
	  }
	}

	/**
	 * Resizable
	 *
	 * @export
	 * @param {element} element
	 * @param {object} options
	 */
	class Resizable extends MousePosition {
	  constructor (element, options) {
	    const style = window.getComputedStyle(element.parentElement);
	    super(element, Object.assign({
	      containment: element.parentElement,
	      handle: element,
	      draggingClass: 'resizing',
	      minWidth: parseFloat(style.minWidth) || 10,
	      minHeight: parseFloat(style.minHeight) || 10,
	    }, options || {}));
	  }
	  // マウスが押された際の関数
	  mdown (e) {
	    super.mdown(e);
	    // クラス名に .drag を追加
	    this.options.handle.classList.add(this.options.draggingClass);
	  }
	  // マウスカーソルが動いたときに発火
	  mmove (e) {
	    super.mmove(e);
	    const pos = this.position;
	    const width = pos.parentRect.width + pos.vectorX;
	    const height = pos.parentRect.height + pos.vectorY;
	    if (width >= this.options.minWidth) {
	      this.options.containment.style.width = width + 'px';
	    }
	    if (height >= this.options.minHeight) {
	      this.options.containment.style.height = height + 'px';
	    }
	  }
	  // マウスボタンが上がったら発火
	  mup (e) {
	    super.mup(e);
	    // クラス名 .drag も消す
	    this.options.handle.classList.remove(this.options.draggingClass);
	  }
	}


	function hitChecker (rect1, rect2, tolerance) {
	  return tolerance === 'fit' ? fitHit(rect1, rect2) : touchHit(rect1, rect2)
	}

	function fitCheck (rectA, rectB, direction, side) {
	  const a1 = rectA[direction];
	  const a2 = a1 + rectA[side];
	  const b1 = rectB[direction];
	  const b2 = b1 + rectB[side];
	  // rectA a1----------------------------------------a2
	  // rectB          b1---------------b2
	  return a1 <= b1 && b2 <= a2
	}
	function fitHit (rectA, rectB) {
	  if (
	    fitCheck(rectA, rectB, 'left', 'width') &&
	    fitCheck(rectA, rectB, 'top', 'height')
	  ) {
	    return true
	  }
	  return false
	}

	function touchCheck (rectA, rectB, direction, side) {
	  const a1 = rectA[direction];
	  const a2 = a1 + rectA[side];
	  const b1 = rectB[direction];
	  const b2 = b1 + rectB[side];
	  // rectA                (a1)---a2      a1-----(a2)
	  // rectA (a1)------------------a2      a1----------------------(a2)
	  // rectA       a1----------------------------------------a2
	  // rectB             b1-----------------------------b2
	  return (b1 <= a2 && a2 <= b2) || (b1 <= a1 && a1 <= b2) || (a1 <= b1 && b2 <= a2)
	}
	function touchHit (rectA, rectB) {
	  if (
	    touchCheck(rectA, rectB, 'left', 'width') &&
	    touchCheck(rectA, rectB, 'top', 'height')
	  ) {
	    return true
	  }
	  return false
	}


	class Selectable extends MousePosition {
	  constructor (element, options) {
	    super(element, Object.assign({
	      containment: element,
	      filter: '*',
	      cancel: 'input,textarea,button,select,option',
	      tolerance: 'touch', // or 'fit'
	      selectorClass: '', // 'selector'
	      selectedClass: 'selected',
	      // selecting: noop,
	      // unselecting: noop,
	      // selected: noop,
	    }, options || {}));

	    const opts = this.options;

	    const helper = this.helper = document.createElement('div');

	    helper.style.position = 'absolute';

	    if (opts.selectorClass) {
	      helper.classList.add(opts.selectorClass);
	    } else {
	      helper.style.zIndex = '10000';
	      helper.style.border = '1px dotted black';
	    }
	    this.reset();

	    const callback = (e, that) => {
	      if (e.shiftKey) {
	        this.toggle(that);
	      } else if (!this.children.find(({ el }) => el === that).isSelected) {
	        this.unselectAll();
	        this.toggle(that);
	      }
	      // Callback
	      if (opts.selected) {
	        opts.selected(this.position, this.selects);
	      }
	    };
	    function cb (e) { callback(e, this); }

	    this.children.forEach(({ el }, i) => {
	      el.addEventListener('mousedown', cb);
	    });

	    const observer = new MutationObserver((mutations) => { // eslint-disable-line
	      mutations.forEach((mutation) => {
	        // console.log('!!!!!', mutation.type)
	        let change = false;
	        for (const el of mutation.addedNodes) {
	          if (el !== helper) {
	            el.addEventListener('mousedown', cb);
	            change = true;
	          }
	        }
	        for (const el of mutation.removedNodes) {
	          if (el !== helper) {
	            el.removeEventListener('mousedown', cb);
	            change = true;
	          }
	        }
	        if (change) {
	          this.reset();
	        }
	      });
	    });
	    observer.observe(element, { childList: true });
	  }

	  get selects () {
	    return this.children.filter((child) => child.isSelected)
	  }

	  reset (isSelected = false) {
	    const opts = this.options;
	    const method = isSelected ? 'add' : 'remove';
	    const que = opts.filter + opts.cancel.replace(/(\w+),?/g, ':not($1)');
	    this.children = Array.from(opts.containment.querySelectorAll(que))
	      .map((el, index) => {
	        el.classList[method](opts.selectedClass);
	        return {
	          el,
	          index,
	          rect: el.getBoundingClientRect(),
	          isSelected,
	        }
	      });
	  }

	  /**
	   *
	   *
	   * @param {number|element} search
	   * @param {boolean} flg
	   * @memberof Selectable
	   */
	  toggle (search, flg) {
	    const opts = this.options;
	    const child = typeof search === 'number'
	      ? this.children[search]
	      : this.children.find(({ el }) => el === search);
	    const { el, isSelected } = child;

	    child.isSelected = flg = flg == null ? !isSelected : flg;

	    if (flg) {
	      el.classList.add(opts.selectedClass);
	      // Callback
	      if (opts.selecting) {
	        this.position.options.handle = el;
	        opts.selecting(this.position, child);
	      }
	    } else {
	      el.classList.remove(opts.selectedClass);
	      // Callback
	      if (opts.unselecting) {
	        this.position.options.handle = el;
	        opts.unselecting(this.position, child);
	      }
	    }
	  }

	  select (i) {
	    this.toggle(i, true);
	  }
	  selectAll () {
	    this.children.forEach((child, i) => {
	      this.select(i);
	    });
	  }
	  unselect (i) {
	    this.toggle(i, false);
	  }
	  unselectAll () {
	    this.children.forEach((child, i) => {
	      this.unselect(i);
	    });
	  }

	  helperRect (position) {
	    let left, top, width, height;
	    if (position.vectorX < 0) {
	      left  = position.startX + position.vectorX;
	    }
	    if (position.vectorX >= 0) {
	      left  = position.startX;
	    }
	    if (position.vectorY < 0) {
	      top  = position.startY + position.vectorY;
	    }
	    if (position.vectorY >= 0) {
	      top  = position.startY;
	    }
	    width  = Math.abs(position.vectorX);
	    height = Math.abs(position.vectorY);
	    // 選択範囲のRectデータ
	    return { left, top, width, height }
	  }

	  mdown (e, handle) {
	    super.mdown(e, handle);
	    const el = this.options.containment;
	    const { position, helper } = this;
	    // array init
	    if (!e.shiftKey) this.reset();
	    else {
	      for (const child of this.children) {
	        child.shiftSelected = child.isSelected;
	      }
	    }
	    // helper追加
	    el.appendChild(helper);
	    helper.style.left = position.startX + 'px';
	    helper.style.top  = position.startY + 'px';
	    helper.style.width  = '0px';
	    helper.style.height = '0px';
	  }

	  // マウスカーソルが動いたときに発火
	  mmove (e) {
	    super.mmove(e);
	    const opts = this.options;
	    const { position, helper } = this;
	    // 選択範囲のRectデータ
	    const helperRect = this.helperRect(position);

	    // 選択範囲内の要素にクラスを追加。範囲外の要素からクラスを削除
	    this.children.forEach(({ rect }, i) => {
	      const hit = hitChecker(helperRect, rect, opts.tolerance);
	      if (!this.children[i].shiftSelected) {
	        this.toggle(i, hit);
	      }
	    });
	    // マウスが動いた場所にhelper要素を動かす
	    helper.style.left = helperRect.left + 'px';
	    helper.style.top  = helperRect.top + 'px';
	    helper.style.width  = helperRect.width + 'px';
	    helper.style.height = helperRect.height + 'px';
	  }
	  // マウスボタンが上がったら発火
	  mup (e) {
	    super.mup(e);
	    const opts = this.options;
	    // helper要素を消す
	    opts.containment.removeChild(this.helper);
	    // Callback
	    if (opts.selected) {
	      opts.selected(this.position, this.selects);
	    }
	  }
	}

	/* src\color-picker\spectrum.html generated by Svelte v2.13.5 */

	function data$2() {
	  return {
	    color: 'red',
	    model: 'hsv',
	  }
	}
	var methods$1 = {
	  setColor (position) {
	    const { color, model } = this.get();
	    const arr = color[model]().array();
	    arr[1] = position.percentLeft;
	    arr[2] = 100 - position.percentTop;
	    this.set({ color: new Color$1(arr, model) });
	  },
	  setPosition () {
	    const { color, model } = this.get();
	    const { width, height } = this.refs.spectrum.getBoundingClientRect();
	    const arr = color[model]().array();
	    this.refs.handle.style.left = width * arr[1] / 100 + 'px';
	    this.refs.handle.style.top = height - (height * arr[2] / 100) + 'px';
	  },
	};

	function oncreate() {
	  // picker
	  return new MousePosition(this.refs.spectrum, {
	    start: (e, position) => {
	      this.setColor(position);
	    },
	    drag: (e, position) => {
	      this.setColor(position);
	    },
	  })
	}
	function onupdate({ changed, current }) {
	  // update oncolorchange
	  if (changed.color) {
	    this.setPosition();
	  }
	}
	const file$1 = "src\\color-picker\\spectrum.html";

	function create_main_fragment$1(component, ctx) {
		var div, div_1, div_class_value;

		return {
			c: function create() {
				div = createElement("div");
				div_1 = createElement("div");
				div_1.className = "color-handle svelte-g1l90n";
				addLoc(div_1, file$1, 1, 2, 102);
				div.className = div_class_value = "spectrum " + ctx.model + " svelte-g1l90n";
				setStyle(div, "background-color", "hsl(" + ctx.color.hue() + ",100%,50%)");
				addLoc(div, file$1, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, div_1);
				component.refs.handle = div_1;
				component.refs.spectrum = div;
			},

			p: function update(changed, ctx) {
				if ((changed.model) && div_class_value !== (div_class_value = "spectrum " + ctx.model + " svelte-g1l90n")) {
					div.className = div_class_value;
				}

				if (changed.color) {
					setStyle(div, "background-color", "hsl(" + ctx.color.hue() + ",100%,50%)");
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				if (component.refs.handle === div_1) component.refs.handle = null;
				if (component.refs.spectrum === div) component.refs.spectrum = null;
			}
		};
	}

	function Spectrum(options) {
		this._debugName = '<Spectrum>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this.refs = {};
		this._state = assign(data$2(), options.data);
		if (!('model' in this._state)) console.warn("<Spectrum> was created without expected data property 'model'");
		if (!('color' in this._state)) console.warn("<Spectrum> was created without expected data property 'color'");
		this._intro = true;
		this._handlers.update = [onupdate];

		this._fragment = create_main_fragment$1(this, this._state);

		this.root._oncreate.push(() => {
			oncreate.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}
	}

	assign(Spectrum.prototype, protoDev);
	assign(Spectrum.prototype, methods$1);

	Spectrum.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src\color-picker\slider.html generated by Svelte v2.13.5 */

	function data$3() {
	  return {
	    size: 0,
	    rect: { width: 0, height: 0 },
	    direction: 'vertical',
	    value: 50,
	    min: 0,
	    max: 100,
	    step: 1,
	    reverse: false
	  }
	}
	var methods$2 = {
	  setValue (position) {
	    const { max, min, direction } = this.get();
	    const side = direction === 'vertical' ? 'percentTop' : 'percentLeft';
	    let per = position[side] / 100;
	    if (this.get().reverse) {
	      per = 1 - per;
	    }
	    this.set({
	      value: (max - min) * per + min
	    });
	  },
	  setPosition (value) {
	    const { size, max, min, direction } = this.get();
	    const side = direction === 'vertical' ? 'top' : 'left';
	    let per = value / (max - min);
	    if (this.get().reverse) {
	      per = 1 - per;
	    }
	    this.refs.sliderHandle.style[side] = per * (size - 6) + 3 + 'px';
	  },
	  draw (beginColor, endColor) {
	    const cxt = this.refs.slider.getContext('2d');
	    const { size, direction, reverse } = this.get();
	    cxt.clearRect(0, 0, size, size);

	    const grd = direction === 'vertical'
	      ? cxt.createLinearGradient(0, 0, 0, size)
	      : cxt.createLinearGradient(0, 0, size, 0);

	    const [begin, end] = reverse ? [1, 0] : [0, 1];

	    if (beginColor === 'hue') {
	      // hue gradient bar
	      const len = 12;
	      for (let i = 0; i <= len; i++) {
	        grd.addColorStop(1 / len * i, `hsl(${360 / len * i}, 100%, 50%)`);
	      }
	    } else {
	      grd.addColorStop(begin, beginColor + '');
	      grd.addColorStop(end, endColor + '');
	    }

	    cxt.fillStyle = grd;
	    cxt.fillRect(0, 0, size, size);
	  }
	};

	function oncreate$1() {
	  const rect = {
	    width: this.refs.box.clientWidth,
	    height: this.refs.box.clientHeight,
	  };
	  console.log('rect', rect);
	  this.set({ rect });
	  if (rect.width > rect.height) {
	    this.set({
	      direction: 'horizontal'
	    });
	  }
	  this.set({
	    size: Math.max(rect.width, rect.height)
	  });

	  this.draw('hue');

	  // picker
	  new MousePosition(this.refs.slider, { // eslint-disable-line no-new
	    // handle: this.refs.sliderHandle,
	    start: (e, position) => {
	      this.setValue(position);
	    },
	    drag: (e, position) => {
	      this.setValue(position);
	    },
	  });
	}
	function onupdate$1({ changed, current }) {
	  if (changed.value) {
	    this.setPosition(current.value);
	  }
	}
	const file$2 = "src\\color-picker\\slider.html";

	function create_main_fragment$2(component, ctx) {
		var div, canvas, text, div_1, div_1_class_value, div_class_value;

		var canvas_levels = [
			{ class: "slider-canvas svelte-1qjgv7z" },
			ctx.rect
		];

		var canvas_data = {};
		for (var i = 0; i < canvas_levels.length; i += 1) {
			canvas_data = assign(canvas_data, canvas_levels[i]);
		}

		return {
			c: function create() {
				div = createElement("div");
				canvas = createElement("canvas");
				text = createText("\r\n  ");
				div_1 = createElement("div");
				setAttributes(canvas, canvas_data);
				addLoc(canvas, file$2, 1, 2, 59);
				div_1.className = div_1_class_value = "slider-handle " + ctx.direction + " svelte-1qjgv7z";
				addLoc(div_1, file$2, 2, 2, 124);
				div.className = div_class_value = "slider alpha-check-bg " + ctx.direction + " svelte-1qjgv7z";
				addLoc(div, file$2, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, canvas);
				component.refs.slider = canvas;
				append(div, text);
				append(div, div_1);
				component.refs.sliderHandle = div_1;
				component.refs.box = div;
			},

			p: function update(changed, ctx) {
				setAttributes(canvas, getSpreadUpdate(canvas_levels, [
					{ class: "slider-canvas svelte-1qjgv7z" },
					(changed.rect) && ctx.rect
				]));

				if ((changed.direction) && div_1_class_value !== (div_1_class_value = "slider-handle " + ctx.direction + " svelte-1qjgv7z")) {
					div_1.className = div_1_class_value;
				}

				if ((changed.direction) && div_class_value !== (div_class_value = "slider alpha-check-bg " + ctx.direction + " svelte-1qjgv7z")) {
					div.className = div_class_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				if (component.refs.slider === canvas) component.refs.slider = null;
				if (component.refs.sliderHandle === div_1) component.refs.sliderHandle = null;
				if (component.refs.box === div) component.refs.box = null;
			}
		};
	}

	function Slider(options) {
		this._debugName = '<Slider>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this.refs = {};
		this._state = assign(data$3(), options.data);
		if (!('direction' in this._state)) console.warn("<Slider> was created without expected data property 'direction'");
		if (!('rect' in this._state)) console.warn("<Slider> was created without expected data property 'rect'");
		this._intro = true;
		this._handlers.update = [onupdate$1];

		this._fragment = create_main_fragment$2(this, this._state);

		this.root._oncreate.push(() => {
			oncreate$1.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}
	}

	assign(Slider.prototype, protoDev);
	assign(Slider.prototype, methods$2);

	Slider.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src\color-picker\hsv-picker.html generated by Svelte v2.13.5 */

	function textColor$1({ color }) {
		return color.isDark() ? '#fff' : '#000';
	}

	function data$4() {
	  return {
	    color: '#000',
	  }
	}
	function oncreate$2() {
	  this.refs.hue.on('state', ({ changed, current, previous }) => {
	    if (changed.value) {
	      const { color } = this.get();
	      this.set({ color: color.hue(current.value) });
	    }
	  });
	  this.refs.alpha.on('state', ({ changed, current, previous }) => {
	    if (changed.value) {
	      const { color } = this.get();
	      this.set({ color: color.alpha(current.value / 100) });
	    }
	  });
	}
	function onupdate$2({ changed, current }) {
	  if (changed.color) {
	    const alphaColor = (alpha) => current.color.hsv().alpha(alpha).string();
	    this.refs.alpha.draw(alphaColor(0), alphaColor(1));
	  }
	}
	const file$3 = "src\\color-picker\\hsv-picker.html";

	function create_main_fragment$3(component, ctx) {
		var div, text, spectrum_updating = {}, text_1;

		var slider_initial_data = { value: ctx.color.hue(), max: "359" };
		var slider = new Slider({
			root: component.root,
			store: component.store,
			data: slider_initial_data
		});

		component.refs.hue = slider;

		var spectrum_initial_data = { model: "hsv" };
		if (ctx.color  !== void 0) {
			spectrum_initial_data.color = ctx.color ;
			spectrum_updating.color = true;
		}
		var spectrum = new Spectrum({
			root: component.root,
			store: component.store,
			data: spectrum_initial_data,
			_bind(changed, childState) {
				var newState = {};
				if (!spectrum_updating.color && changed.color) {
					newState.color = childState.color;
				}
				component._set(newState);
				spectrum_updating = {};
			}
		});

		component.root._beforecreate.push(() => {
			spectrum._bind({ color: 1 }, spectrum.get());
		});

		var slider_1_initial_data = { value: ctx.color.alpha() * 100 };
		var slider_1 = new Slider({
			root: component.root,
			store: component.store,
			data: slider_1_initial_data
		});

		component.refs.alpha = slider_1;

		return {
			c: function create() {
				div = createElement("div");
				slider._fragment.c();
				text = createText("\r\n  ");
				spectrum._fragment.c();
				text_1 = createText("\r\n  ");
				slider_1._fragment.c();
				div.className = "hsv-picker svelte-1pwgigk";
				addLoc(div, file$3, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				slider._mount(div, null);
				append(div, text);
				spectrum._mount(div, null);
				append(div, text_1);
				slider_1._mount(div, null);
			},

			p: function update(changed, _ctx) {
				ctx = _ctx;
				var slider_changes = {};
				if (changed.color) slider_changes.value = ctx.color.hue();
				slider._set(slider_changes);

				var spectrum_changes = {};
				if (!spectrum_updating.color && changed.color) {
					spectrum_changes.color = ctx.color ;
					spectrum_updating.color = ctx.color  !== void 0;
				}
				spectrum._set(spectrum_changes);
				spectrum_updating = {};

				var slider_1_changes = {};
				if (changed.color) slider_1_changes.value = ctx.color.alpha() * 100;
				slider_1._set(slider_1_changes);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				slider.destroy();
				if (component.refs.hue === slider) component.refs.hue = null;
				spectrum.destroy();
				slider_1.destroy();
				if (component.refs.alpha === slider_1) component.refs.alpha = null;
			}
		};
	}

	function Hsv_picker(options) {
		this._debugName = '<Hsv_picker>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this.refs = {};
		this._state = assign(data$4(), options.data);
		this._recompute({ color: 1 }, this._state);
		if (!('color' in this._state)) console.warn("<Hsv_picker> was created without expected data property 'color'");
		this._intro = true;
		this._handlers.update = [onupdate$2];

		this._fragment = create_main_fragment$3(this, this._state);

		this.root._oncreate.push(() => {
			oncreate$2.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}
	}

	assign(Hsv_picker.prototype, protoDev);

	Hsv_picker.prototype._checkReadOnly = function _checkReadOnly(newState) {
		if ('textColor' in newState && !this._updatingReadonlyProperty) throw new Error("<Hsv_picker>: Cannot set read-only property 'textColor'");
	};

	Hsv_picker.prototype._recompute = function _recompute(changed, state) {
		if (changed.color) {
			if (this._differs(state.textColor, (state.textColor = textColor$1(state)))) changed.textColor = true;
		}
	};

	/* src\color-picker\blender.html generated by Svelte v2.13.5 */

	function data$5() {
	  return {
	    rect: { width: 0, height: 0 },
	    color1: '#000',
	    color2: '#fff',
	    direction: 'vertical', // horizontal
	  }
	}
	var methods$3 = {
	  getColor (position) {
	    const { width } = this.get().rect;
	    const x = Math.max(0, Math.min(position.x, width - 1));
	    const [r, g, b] = this.refs.canvas.getContext('2d').getImageData(x, 0, 1, 1).data;
	    const color = new Color$1({ r, g, b });

	    this.refs.handle.style.left = x + 'px';
	    this.refs.handle.style.backgroundColor = color.isDark() ? '#fff' : '#000';
	    return color
	  },
	  draw () {
	    const { direction, color1, color2 } = this.get();
	    const canvas = this.refs.canvas;
	    const cxt = canvas.getContext('2d');
	    const [w, h] = [canvas.width, canvas.height];
	    cxt.clearRect(0, 0, w, h);

	    const grd = direction === 'vertical'
	      ? cxt.createLinearGradient(0, 0, 0, h)
	      : cxt.createLinearGradient(0, 0, w, 0);

	    grd.addColorStop(0.02, new Color$1(color1).rgb().string());
	    grd.addColorStop(0.98, new Color$1(color2).rgb().string());

	    cxt.fillStyle = grd;
	    cxt.fillRect(0, 0, w, h);

	    this.getColor({ x: w / 2 });
	  }
	};

	function oncreate$3() {
	  const rect = {
	    width: this.refs.blender.clientWidth,
	    height: this.refs.blender.clientHeight,
	  };
	  this.set({ rect });
	  // picker
	  new MousePosition(this.refs.blender, { // eslint-disable-line no-new
	    handle: this.refs.handle,
	    start: (e, position) => {
	      this.set({ color: this.getColor(position) });
	    },
	    drag: (e, position) => {
	      this.set({ color: this.getColor(position) });
	    },
	  });
	}
	function onupdate$3({ changed, current }) {
	  if (changed.color1) {
	    this.refs.color1.style.backgroundColor = current.color1.toString();
	    this.draw();
	  }
	  if (changed.color2) {
	    this.refs.color2.style.backgroundColor = current.color2.toString();
	    this.draw();
	  }
	}
	const file$4 = "src\\color-picker\\blender.html";

	function create_main_fragment$4(component, ctx) {
		var div, div_1, text, div_2, canvas, text_1, div_3, div_3_class_value, text_3, div_4;

		function click_handler(event) {
			component.set({color1: ctx.color});
		}

		var canvas_levels = [
			{ class: "blender-canvas svelte-9a06ho" },
			ctx.rect
		];

		var canvas_data = {};
		for (var i = 0; i < canvas_levels.length; i += 1) {
			canvas_data = assign(canvas_data, canvas_levels[i]);
		}

		function click_handler_1(event) {
			component.set({color2: ctx.color});
		}

		return {
			c: function create() {
				div = createElement("div");
				div_1 = createElement("div");
				text = createText("\r\n  ");
				div_2 = createElement("div");
				canvas = createElement("canvas");
				text_1 = createText("\r\n    ");
				div_3 = createElement("div");
				text_3 = createText("\r\n  ");
				div_4 = createElement("div");
				addListener(div_1, "click", click_handler);
				div_1.className = "blender-btn color1 svelte-9a06ho";
				addLoc(div_1, file$4, 1, 2, 25);
				setAttributes(canvas, canvas_data);
				addLoc(canvas, file$4, 3, 4, 156);
				div_3.className = div_3_class_value = "blender-handle " + ctx.direction + " svelte-9a06ho";
				addLoc(div_3, file$4, 4, 4, 224);
				div_2.className = "blender-slider svelte-9a06ho";
				addLoc(div_2, file$4, 2, 2, 110);
				addListener(div_4, "click", click_handler_1);
				div_4.className = "blender-btn color2 svelte-9a06ho";
				addLoc(div_4, file$4, 6, 2, 295);
				div.className = "blender svelte-9a06ho";
				addLoc(div, file$4, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, div_1);
				component.refs.color1 = div_1;
				append(div, text);
				append(div, div_2);
				append(div_2, canvas);
				component.refs.canvas = canvas;
				append(div_2, text_1);
				append(div_2, div_3);
				component.refs.handle = div_3;
				component.refs.blender = div_2;
				append(div, text_3);
				append(div, div_4);
				component.refs.color2 = div_4;
			},

			p: function update(changed, _ctx) {
				ctx = _ctx;
				setAttributes(canvas, getSpreadUpdate(canvas_levels, [
					{ class: "blender-canvas svelte-9a06ho" },
					(changed.rect) && ctx.rect
				]));

				if ((changed.direction) && div_3_class_value !== (div_3_class_value = "blender-handle " + ctx.direction + " svelte-9a06ho")) {
					div_3.className = div_3_class_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(div_1, "click", click_handler);
				if (component.refs.color1 === div_1) component.refs.color1 = null;
				if (component.refs.canvas === canvas) component.refs.canvas = null;
				if (component.refs.handle === div_3) component.refs.handle = null;
				if (component.refs.blender === div_2) component.refs.blender = null;
				removeListener(div_4, "click", click_handler_1);
				if (component.refs.color2 === div_4) component.refs.color2 = null;
			}
		};
	}

	function Blender(options) {
		this._debugName = '<Blender>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this.refs = {};
		this._state = assign(data$5(), options.data);
		if (!('color' in this._state)) console.warn("<Blender> was created without expected data property 'color'");
		if (!('rect' in this._state)) console.warn("<Blender> was created without expected data property 'rect'");
		if (!('direction' in this._state)) console.warn("<Blender> was created without expected data property 'direction'");
		this._intro = true;
		this._handlers.update = [onupdate$3];

		this._fragment = create_main_fragment$4(this, this._state);

		this.root._oncreate.push(() => {
			oncreate$3.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}
	}

	assign(Blender.prototype, protoDev);
	assign(Blender.prototype, methods$3);

	Blender.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src\color-picker\color-picker.html generated by Svelte v2.13.5 */

	function contrast({ color, bgColor }) {
		return round(bgColor.contrast(color), 1);
	}

	function data$6() {
	  return {
	    color: '',
	    bgColor: '',
	    model: 'hex',
	  }
	}
	var methods$4 = {
	  alphaBlending () {
	    const { color, bgColor } = this.get();
	    this.set({
	      color: bgColor.alphaBlending(color),
	    });
	  },
	  setBgColor ({ color } = this.get()) {
	    this.set({ bgColor: color });
	    this.fire('setBgColor', color);
	  },
	};

	function onstate({ changed, current }) {
	  if (changed.color) {
	    this.set({ color: new Color$1(current.color) });
	  }
	  if (changed.bgColor) {
	    this.set({ bgColor: new Color$1(current.bgColor) });
	  }

	  if (changed.model) {
	    this.fire('modelChange', current.model);
	  }
	}
	const file$5 = "src\\color-picker\\color-picker.html";

	function create_main_fragment$5(component, ctx) {
		var div, colorinput_updating = {}, text, div_1, hsvpicker_updating = {}, text_2, div_2, div_3, button, text_3, button_class_value, text_6, div_4, blender_updating = {}, text_8, div_5, button_1, text_9;

		var colorinput_initial_data = { bgColor: ctx.bgColor };
		if (ctx.color  !== void 0) {
			colorinput_initial_data.color = ctx.color ;
			colorinput_updating.color = true;
		}
		if (ctx.model  !== void 0) {
			colorinput_initial_data.model = ctx.model ;
			colorinput_updating.model = true;
		}
		var colorinput = new Color_input({
			root: component.root,
			store: component.store,
			data: colorinput_initial_data,
			_bind(changed, childState) {
				var newState = {};
				if (!colorinput_updating.color && changed.color) {
					newState.color = childState.color;
				}

				if (!colorinput_updating.model && changed.model) {
					newState.model = childState.model;
				}
				component._set(newState);
				colorinput_updating = {};
			}
		});

		component.root._beforecreate.push(() => {
			colorinput._bind({ color: 1, model: 1 }, colorinput.get());
		});

		var hsvpicker_initial_data = {};
		if (ctx.color  !== void 0) {
			hsvpicker_initial_data.color = ctx.color ;
			hsvpicker_updating.color = true;
		}
		var hsvpicker = new Hsv_picker({
			root: component.root,
			store: component.store,
			data: hsvpicker_initial_data,
			_bind(changed, childState) {
				var newState = {};
				if (!hsvpicker_updating.color && changed.color) {
					newState.color = childState.color;
				}
				component._set(newState);
				hsvpicker_updating = {};
			}
		});

		component.root._beforecreate.push(() => {
			hsvpicker._bind({ color: 1 }, hsvpicker.get());
		});

		function click_handler(event) {
			component.setBgColor();
		}

		var blender_initial_data = {};
		if (ctx.color !== void 0) {
			blender_initial_data.color = ctx.color;
			blender_updating.color = true;
		}
		var blender = new Blender({
			root: component.root,
			store: component.store,
			data: blender_initial_data,
			_bind(changed, childState) {
				var newState = {};
				if (!blender_updating.color && changed.color) {
					newState.color = childState.color;
				}
				component._set(newState);
				blender_updating = {};
			}
		});

		component.root._beforecreate.push(() => {
			blender._bind({ color: 1 }, blender.get());
		});

		function click_handler_1(event) {
			component.alphaBlending();
		}

		return {
			c: function create() {
				div = createElement("div");
				colorinput._fragment.c();
				text = createText("\r\n  ");
				div_1 = createElement("div");
				hsvpicker._fragment.c();
				text_2 = createText("\r\n  ");
				div_2 = createElement("div");
				div_3 = createElement("div");
				button = createElement("button");
				text_3 = createText(ctx.contrast);
				text_6 = createText("\r\n    ");
				div_4 = createElement("div");
				blender._fragment.c();
				text_8 = createText("\r\n    ");
				div_5 = createElement("div");
				button_1 = createElement("button");
				text_9 = createText("a=1");
				div_1.className = "picker-body svelte-1nih27n";
				addLoc(div_1, file$5, 2, 2, 80);
				addListener(button, "click", click_handler);
				button.className = button_class_value = "contrast " + ctx.bgColor.level(ctx.color) + " svelte-1nih27n";
				setStyle(button, "color", ctx.color);
				addLoc(button, file$5, 7, 6, 270);
				div_3.className = "button svelte-1nih27n";
				div_3.title = "Click: set BG-color. Display: Readable Score(1~21).";
				addLoc(div_3, file$5, 6, 4, 182);
				div_4.className = "blender-wrapper svelte-1nih27n";
				addLoc(div_4, file$5, 11, 4, 420);
				addListener(button_1, "click", click_handler_1);
				button_1.className = "svelte-1nih27n";
				addLoc(button_1, file$5, 15, 6, 559);
				div_5.className = "button svelte-1nih27n";
				div_5.title = "Alpha Blending by BG-color";
				addLoc(div_5, file$5, 14, 4, 496);
				div_2.className = "picker-footer svelte-1nih27n";
				addLoc(div_2, file$5, 5, 2, 149);
				div.className = "color-picker svelte-1nih27n";
				addLoc(div, file$5, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				colorinput._mount(div, null);
				append(div, text);
				append(div, div_1);
				hsvpicker._mount(div_1, null);
				append(div, text_2);
				append(div, div_2);
				append(div_2, div_3);
				append(div_3, button);
				append(button, text_3);
				append(div_2, text_6);
				append(div_2, div_4);
				blender._mount(div_4, null);
				append(div_2, text_8);
				append(div_2, div_5);
				append(div_5, button_1);
				append(button_1, text_9);
			},

			p: function update(changed, _ctx) {
				ctx = _ctx;
				var colorinput_changes = {};
				if (changed.bgColor) colorinput_changes.bgColor = ctx.bgColor;
				if (!colorinput_updating.color && changed.color) {
					colorinput_changes.color = ctx.color ;
					colorinput_updating.color = ctx.color  !== void 0;
				}
				if (!colorinput_updating.model && changed.model) {
					colorinput_changes.model = ctx.model ;
					colorinput_updating.model = ctx.model  !== void 0;
				}
				colorinput._set(colorinput_changes);
				colorinput_updating = {};

				var hsvpicker_changes = {};
				if (!hsvpicker_updating.color && changed.color) {
					hsvpicker_changes.color = ctx.color ;
					hsvpicker_updating.color = ctx.color  !== void 0;
				}
				hsvpicker._set(hsvpicker_changes);
				hsvpicker_updating = {};

				if (changed.contrast) {
					setData(text_3, ctx.contrast);
				}

				if ((changed.bgColor || changed.color) && button_class_value !== (button_class_value = "contrast " + ctx.bgColor.level(ctx.color) + " svelte-1nih27n")) {
					button.className = button_class_value;
				}

				if (changed.color) {
					setStyle(button, "color", ctx.color);
				}

				var blender_changes = {};
				if (!blender_updating.color && changed.color) {
					blender_changes.color = ctx.color;
					blender_updating.color = ctx.color !== void 0;
				}
				blender._set(blender_changes);
				blender_updating = {};
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				colorinput.destroy();
				hsvpicker.destroy();
				removeListener(button, "click", click_handler);
				blender.destroy();
				removeListener(button_1, "click", click_handler_1);
			}
		};
	}

	function Color_picker(options) {
		this._debugName = '<Color_picker>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(data$6(), options.data);
		this._recompute({ color: 1, bgColor: 1 }, this._state);
		if (!('color' in this._state)) console.warn("<Color_picker> was created without expected data property 'color'");
		if (!('bgColor' in this._state)) console.warn("<Color_picker> was created without expected data property 'bgColor'");
		if (!('model' in this._state)) console.warn("<Color_picker> was created without expected data property 'model'");
		this._intro = true;

		this._handlers.state = [onstate];

		onstate.call(this, { changed: assignTrue({}, this._state), current: this._state });

		this._fragment = create_main_fragment$5(this, this._state);

		this.root._oncreate.push(() => {
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}
	}

	assign(Color_picker.prototype, protoDev);
	assign(Color_picker.prototype, methods$4);

	Color_picker.prototype._checkReadOnly = function _checkReadOnly(newState) {
		if ('contrast' in newState && !this._updatingReadonlyProperty) throw new Error("<Color_picker>: Cannot set read-only property 'contrast'");
	};

	Color_picker.prototype._recompute = function _recompute(changed, state) {
		if (changed.color || changed.bgColor) {
			if (this._differs(state.contrast, (state.contrast = contrast(state)))) changed.contrast = true;
		}
	};

	/* src\svelte\color-card.html generated by Svelte v2.13.5 */

	const colorsWidth = 320;

	function textColor$2({ card, $bgColor, contrast }) {
	  const { color, textMode } = card;
	  if (textMode) {
	    return `color: ${(contrast < 4.5) ? ($bgColor.isDark() ? '#fff' : '#000') : color};`
	  }
	  return `color: ${color.isDark() ? '#fff' : '#000'};`
	}

	function cardStyle({ card, $grayscale }) {
	  const { width, height, top, left, color, textMode } = card;
	  const w = width > 120 ? width + 'px' : 'auto';
	  const h = height > 120 ? height + 'px' : 'auto';
	  const c2 = $grayscale ? color.grayscale() : color;
	  const colorstyle = textMode
	    ? `background-color: transparent; color: ${c2};`
	    : `background-color: ${c2}; color: ${color.isDark() ? '#fff' : '#000'};`;
	  return colorstyle + `width:${w}; height:${h};top:${top}px;left:${left}px;`
	}

	function contrast$1({ card, $bgColor }) {
		return round($bgColor.contrast(card.color), 1);
	}

	function modelsEntries({ $cardViewModels }) {
		return Object.entries($cardViewModels).filter(([, value]) => value);
	}

	function data$7() {
	  return {
	    edit: false,
	  }
	}
	var methods$5 = {
	  reverse () {
	    const { card } = this.get();
	    store.fire('cards.TOGGLE_TEXTMODE', [card.index]);
	  },
	  remove () {
	    const { card } = this.get();
	    store.fire('cards.REMOVE_CARD', [card.index]);
	  },
	  edit () {
	    this.set({ edit: true });
	    const title = this.refs.title;
	    const selection = window.getSelection();
	    const range = document.createRange();
	    const name = title.textContent;
	    // range.setStart(title, 0)
	    // range.setEnd(title, title.childNodes.length)
	    range.selectNodeContents(title);
	    selection.removeAllRanges();
	    selection.addRange(range);

	    const editOff = (e, cb) => {
	      if (title.textContent && title.textContent !== name) {
	        store.fire('cards.EDIT_CARD', this.get().index, {
	          name: title.textContent,
	        });
	        store.memo();
	      } else {
	        title.textContent = name;
	      }
	      this.set({ edit: false });

	      // 選択解除
	      range.setStart(title, 0);
	      range.setEnd(title, 0);
	      selection.addRange(range);

	      document.removeEventListener('selectionchange', cb);
	      document.removeEventListener('click', cb);
	      window.removeEventListener('blur', editOff);
	    };
	    const selectionchange = (e) => {
	      const selection = window.getSelection();
	      if (selection.focusNode.parentNode === title || selection.focusNode === title) {
	        return
	      }
	      editOff(e, selectionchange);
	    };
	    const click = (e) => {
	      if (e.target === title || e.target.classList.contains('menuitem')) {
	        return
	      }
	      editOff(e, click);
	    };
	    document.addEventListener('selectionchange', selectionchange);
	    document.addEventListener('click', click);
	    window.addEventListener('blur', editOff);
	  },
	};

	function oncreate$4() {
	  console.log('card-render');

	  const cardEl = this.refs.card;
	  const box = cardEl.parentElement;
	  const { index } = this.get();

	  let cards;

	  this.movable = new Movable(cardEl, {
	    containment: box,
	    grid: 10,
	    axis: 'shift',
	    start: (e, position) => {
	      e.stopPropagation();

	      // 右クリック以外のとき
	      if (!(e.which === 3 || e.button === 2)) {
	        store.fire('cards.CARD_FORWARD', index);
	        cards = store.get().cards;
	      }
	    },
	    drag: (e, position) => {
	      e.stopPropagation();
	      for (const scard of this.root.selectable.selects) {
	        const { index, el, rect } = scard;
	        const selectcard = cards[index];
	        scard.left = position.adjust(selectcard.left + position.vectorX, 'width', rect);
	        scard.top = position.adjust(selectcard.top + position.vectorY, 'height', rect);

	        el.style.left = scard.left + 'px';
	        el.style.top = scard.top + 'px';
	      }
	    },
	    stop: (e, { left, top }, el) => {
	      const selects = this.root.selectable.selects;
	      left = Math.max(colorsWidth, left);

	      store.set({ cards: (cards) => {
	        for (const scard of selects) {
	          const { index, left, top } = scard;
	          const card = cards[index];
	          Object.assign(card, { left, top });
	        }
	        return cards
	      } });
	      store.set({ sortX: 'none', sortY: 'none' });
	      store.memo();
	    },
	    click: (e, position, el) => {
	      store.memo();
	    },
	  });
	  this.resizable = new Resizable(this.refs.handle, {
	    start: (e) => {
	      e.stopPropagation();
	    },
	    drag: (e) => {
	      e.stopPropagation();
	    },
	    stop: (e) => {
	      e.stopPropagation();
	      const { width, height } = cardEl.getBoundingClientRect();
	      store.fire('cards.EDIT_CARD', index, { width, height });
	      store.memo();
	    },
	  });

	  cardEl.addEventListener('dblclick', (e) => {
	    this.edit();
	  });

	  cardEl.addEventListener('contextmenu', (e) => {
	    // デフォルトイベントをキャンセル
	    // これを書くことでコンテキストメニューが表示されなくなります
	    e.preventDefault();
	    store.fire('menu_open', e, this, 'card');
	  }, false);
	}
	function onupdate$4({ changed, current }) {
	  if (changed.edit) {
	    this.movable.toggle(!current.edit);
	  }
	}
	const file$6 = "src\\svelte\\color-card.html";

	function create_main_fragment$6(component, ctx) {
		var div, div_1, h3, text_value = ctx.card.name, text, text_1, div_1_class_value, text_3, span, i, text_5, span_1, i_1, text_7, div_2, div_style_value;

		var each_value = ctx.modelsEntries;

		var each_blocks = [];

		for (var i_2 = 0; i_2 < each_value.length; i_2 += 1) {
			each_blocks[i_2] = create_each_block$1(component, get_each_context$1(ctx, each_value, i_2));
		}

		function click_handler(event) {
			component.reverse();
		}

		function click_handler_1(event) {
			component.remove();
		}

		return {
			c: function create() {
				div = createElement("div");
				div_1 = createElement("div");
				h3 = createElement("h3");
				text = createText(text_value);
				text_1 = createText("\r\n    ");

				for (var i_2 = 0; i_2 < each_blocks.length; i_2 += 1) {
					each_blocks[i_2].c();
				}

				text_3 = createText("\r\n  ");
				span = createElement("span");
				i = createElement("i");
				text_5 = createText("\r\n  ");
				span_1 = createElement("span");
				i_1 = createElement("i");
				text_7 = createText("\r\n  ");
				div_2 = createElement("div");
				h3.className = "card_title svelte-mv8r9f";
				h3.contentEditable = ctx.edit;
				addLoc(h3, file$6, 4, 4, 180);
				div_1.className = div_1_class_value = "cardtext " + ((ctx.$textvisible || ctx.card.textMode)? '': 'textvisible') + " svelte-mv8r9f";
				addLoc(div_1, file$6, 3, 2, 99);
				i.className = "fas fa-sync fa-fw";
				addLoc(i, file$6, 14, 4, 537);
				addListener(span, "click", click_handler);
				span.className = "icon card-reverse svelte-mv8r9f";
				span.style.cssText = ctx.textColor;
				addLoc(span, file$6, 13, 2, 458);
				i_1.className = "fas fa-times fa-fw";
				addLoc(i_1, file$6, 18, 4, 679);
				addListener(span_1, "click", click_handler_1);
				span_1.className = "icon card-delete svelte-mv8r9f";
				span_1.style.cssText = ctx.textColor;
				addLoc(span_1, file$6, 17, 2, 602);
				div_2.className = "icon resize-handle svelte-mv8r9f";
				addLoc(div_2, file$6, 21, 2, 745);
				div.className = "card animated bounceIn svelte-mv8r9f";
				div.style.cssText = div_style_value = "" + ctx.cardStyle + " z-index: " + ctx.card.zIndex + ";";
				addLoc(div, file$6, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, div_1);
				append(div_1, h3);
				append(h3, text);
				component.refs.title = h3;
				append(div_1, text_1);

				for (var i_2 = 0; i_2 < each_blocks.length; i_2 += 1) {
					each_blocks[i_2].m(div_1, null);
				}

				append(div, text_3);
				append(div, span);
				append(span, i);
				append(div, text_5);
				append(div, span_1);
				append(span_1, i_1);
				append(div, text_7);
				append(div, div_2);
				component.refs.handle = div_2;
				component.refs.card = div;
			},

			p: function update(changed, ctx) {
				if ((changed.card) && text_value !== (text_value = ctx.card.name)) {
					setData(text, text_value);
				}

				if (changed.edit) {
					h3.contentEditable = ctx.edit;
				}

				if (changed.modelsEntries || changed.contrast || changed.card) {
					each_value = ctx.modelsEntries;

					for (var i_2 = 0; i_2 < each_value.length; i_2 += 1) {
						const child_ctx = get_each_context$1(ctx, each_value, i_2);

						if (each_blocks[i_2]) {
							each_blocks[i_2].p(changed, child_ctx);
						} else {
							each_blocks[i_2] = create_each_block$1(component, child_ctx);
							each_blocks[i_2].c();
							each_blocks[i_2].m(div_1, null);
						}
					}

					for (; i_2 < each_blocks.length; i_2 += 1) {
						each_blocks[i_2].d(1);
					}
					each_blocks.length = each_value.length;
				}

				if ((changed.$textvisible || changed.card) && div_1_class_value !== (div_1_class_value = "cardtext " + ((ctx.$textvisible || ctx.card.textMode)? '': 'textvisible') + " svelte-mv8r9f")) {
					div_1.className = div_1_class_value;
				}

				if (changed.textColor) {
					span.style.cssText = ctx.textColor;
					span_1.style.cssText = ctx.textColor;
				}

				if ((changed.cardStyle || changed.card) && div_style_value !== (div_style_value = "" + ctx.cardStyle + " z-index: " + ctx.card.zIndex + ";")) {
					div.style.cssText = div_style_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				if (component.refs.title === h3) component.refs.title = null;

				destroyEach(each_blocks, detach);

				removeListener(span, "click", click_handler);
				removeListener(span_1, "click", click_handler_1);
				if (component.refs.handle === div_2) component.refs.handle = null;
				if (component.refs.card === div) component.refs.card = null;
			}
		};
	}

	// (6:4) {#each modelsEntries as [key, value]}
	function create_each_block$1(component, ctx) {
		var if_block_anchor;

		function select_block_type(ctx) {
			if (ctx.key === 'contrast') return create_if_block$1;
			return create_if_block_1$1;
		}

		var current_block_type = select_block_type(ctx);
		var if_block = current_block_type(component, ctx);

		return {
			c: function create() {
				if_block.c();
				if_block_anchor = createComment();
			},

			m: function mount(target, anchor) {
				if_block.m(target, anchor);
				insert(target, if_block_anchor, anchor);
			},

			p: function update(changed, ctx) {
				if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block.d(1);
					if_block = current_block_type(component, ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},

			d: function destroy$$1(detach) {
				if_block.d(detach);
				if (detach) {
					detachNode(if_block_anchor);
				}
			}
		};
	}

	// (7:6) {#if key === 'contrast'}
	function create_if_block$1(component, ctx) {
		var div, text;

		return {
			c: function create() {
				div = createElement("div");
				text = createText(ctx.contrast);
				addLoc(div, file$6, 7, 6, 337);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, text);
			},

			p: function update(changed, ctx) {
				if (changed.contrast) {
					setData(text, ctx.contrast);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}
			}
		};
	}

	// (9:6) {:else}
	function create_if_block_1$1(component, ctx) {
		var div, text_value = ctx.card.color.toString(ctx.key), text;

		return {
			c: function create() {
				div = createElement("div");
				text = createText(text_value);
				addLoc(div, file$6, 9, 6, 381);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, text);
			},

			p: function update(changed, ctx) {
				if ((changed.card || changed.modelsEntries) && text_value !== (text_value = ctx.card.color.toString(ctx.key))) {
					setData(text, text_value);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}
			}
		};
	}

	function get_each_context$1(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.key = list[i][0];
		child_ctx.value = list[i][1];
		child_ctx.each_value = list;
		child_ctx.each_index = i;
		return child_ctx;
	}

	function Color_card(options) {
		this._debugName = '<Color_card>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this.refs = {};
		this._state = assign(assign(this.store._init(["bgColor","grayscale","cardViewModels","textvisible"]), data$7()), options.data);
		this.store._add(this, ["bgColor","grayscale","cardViewModels","textvisible"]);
		this._recompute({ card: 1, $bgColor: 1, contrast: 1, $grayscale: 1, $cardViewModels: 1 }, this._state);
		if (!('card' in this._state)) console.warn("<Color_card> was created without expected data property 'card'");
		if (!('$bgColor' in this._state)) console.warn("<Color_card> was created without expected data property '$bgColor'");

		if (!('$grayscale' in this._state)) console.warn("<Color_card> was created without expected data property '$grayscale'");
		if (!('$cardViewModels' in this._state)) console.warn("<Color_card> was created without expected data property '$cardViewModels'");

		if (!('$textvisible' in this._state)) console.warn("<Color_card> was created without expected data property '$textvisible'");
		if (!('edit' in this._state)) console.warn("<Color_card> was created without expected data property 'edit'");
		this._intro = true;
		this._handlers.update = [onupdate$4];

		this._handlers.destroy = [removeFromStore];

		this._fragment = create_main_fragment$6(this, this._state);

		this.root._oncreate.push(() => {
			oncreate$4.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}
	}

	assign(Color_card.prototype, protoDev);
	assign(Color_card.prototype, methods$5);

	Color_card.prototype._checkReadOnly = function _checkReadOnly(newState) {
		if ('contrast' in newState && !this._updatingReadonlyProperty) throw new Error("<Color_card>: Cannot set read-only property 'contrast'");
		if ('textColor' in newState && !this._updatingReadonlyProperty) throw new Error("<Color_card>: Cannot set read-only property 'textColor'");
		if ('cardStyle' in newState && !this._updatingReadonlyProperty) throw new Error("<Color_card>: Cannot set read-only property 'cardStyle'");
		if ('modelsEntries' in newState && !this._updatingReadonlyProperty) throw new Error("<Color_card>: Cannot set read-only property 'modelsEntries'");
	};

	Color_card.prototype._recompute = function _recompute(changed, state) {
		if (changed.card || changed.$bgColor) {
			if (this._differs(state.contrast, (state.contrast = contrast$1(state)))) changed.contrast = true;
		}

		if (changed.card || changed.$bgColor || changed.contrast) {
			if (this._differs(state.textColor, (state.textColor = textColor$2(state)))) changed.textColor = true;
		}

		if (changed.card || changed.$grayscale) {
			if (this._differs(state.cardStyle, (state.cardStyle = cardStyle(state)))) changed.cardStyle = true;
		}

		if (changed.$cardViewModels) {
			if (this._differs(state.modelsEntries, (state.modelsEntries = modelsEntries(state)))) changed.modelsEntries = true;
		}
	};

	const White = [
		"#FFFFFF"
	];
	const Snow = [
		"#FFFAFA"
	];
	const HoneyDew = [
		"#F0FFF0"
	];
	const MintCream = [
		"#F5FFFA"
	];
	const Azure = [
		"#F0FFFF"
	];
	const AliceBlue = [
		"#F0F8FF"
	];
	const GhostWhite = [
		"#F8F8FF"
	];
	const WhiteSmoke = [
		"#F5F5F5"
	];
	const SeaShell = [
		"#FFF5EE"
	];
	const Beige = [
		"#F5F5DC"
	];
	const OldLace = [
		"#FDF5E6"
	];
	const FloralWhite = [
		"#FFFAF0"
	];
	const Ivory = [
		"#FFFFF0"
	];
	const AntiqueWhite = [
		"#FAEBD7"
	];
	const Linen = [
		"#FAF0E6"
	];
	const LavenderBlush = [
		"#FFF0F5"
	];
	const MistyRose = [
		"#FFE4E1"
	];
	const Gainsboro = [
		"#DCDCDC"
	];
	const LightGray = [
		"#D3D3D3"
	];
	const Silver = [
		"#C0C0C0"
	];
	const DarkGray = [
		"#A9A9A9"
	];
	const DimGray = [
		"#696969"
	];
	const Gray = [
		"#808080"
	];
	const LightSlateGray = [
		"#778899"
	];
	const SlateGray = [
		"#708090"
	];
	const DarkSlateGray = [
		"#2F4F4F"
	];
	const Black = [
		"#000000"
	];
	const LightSalmon = [
		"#FFA07A"
	];
	const Salmon = [
		"#FA8072"
	];
	const DarkSalmon = [
		"#E9967A"
	];
	const LightCoral = [
		"#F08080"
	];
	const IndianRed = [
		"#CD5C5C"
	];
	const Crimson = [
		"#DC143C"
	];
	const Red = [
		"#FF0000"
	];
	const FireBrick = [
		"#B22222"
	];
	const DarkRed = [
		"#8B0000"
	];
	const Orange = [
		"#FFA500"
	];
	const DarkOrange = [
		"#FF8C00"
	];
	const Coral = [
		"#FF7F50"
	];
	const Tomato = [
		"#FF6347"
	];
	const OrangeRed = [
		"#FF4500"
	];
	const Gold = [
		"#FFD700"
	];
	const Yellow = [
		"#FFFF00"
	];
	const LightYellow = [
		"#FFFFE0"
	];
	const LemonChiffon = [
		"#FFFACD"
	];
	const LightGoldenRodYellow = [
		"#FAFAD2"
	];
	const PapayaWhip = [
		"#FFEFD5"
	];
	const Moccasin = [
		"#FFE4B5"
	];
	const PeachPuff = [
		"#FFDAB9"
	];
	const PaleGoldenRod = [
		"#EEE8AA"
	];
	const Khaki = [
		"#F0E68C"
	];
	const DarkKhaki = [
		"#BDB76B"
	];
	const GreenYellow = [
		"#ADFF2F"
	];
	const Chartreuse = [
		"#7FFF00"
	];
	const LawnGreen = [
		"#7CFC00"
	];
	const Lime = [
		"#00FF00"
	];
	const LimeGreen = [
		"#32CD32"
	];
	const PaleGreen = [
		"#98FB98"
	];
	const LightGreen = [
		"#90EE90"
	];
	const MediumSpringGreen = [
		"#00FA9A"
	];
	const SpringGreen = [
		"#00FF7F"
	];
	const MediumSeaGreen = [
		"#3CB371"
	];
	const SeaGreen = [
		"#2E8B57"
	];
	const ForestGreen = [
		"#228B22"
	];
	const Green = [
		"#008000"
	];
	const DarkGreen = [
		"#006400"
	];
	const YellowGreen = [
		"#9ACD32"
	];
	const OliveDrab = [
		"#6B8E23"
	];
	const DarkOliveGreen = [
		"#556B2F"
	];
	const MediumAquaMarine = [
		"#66CDAA"
	];
	const DarkSeaGreen = [
		"#8FBC8F"
	];
	const LightSeaGreen = [
		"#20B2AA"
	];
	const DarkCyan = [
		"#008B8B"
	];
	const Teal = [
		"#008080"
	];
	const Aqua = [
		"#00FFFF"
	];
	const Cyan = [
		"#00FFFF"
	];
	const LightCyan = [
		"#E0FFFF"
	];
	const PaleTurquoise = [
		"#AFEEEE"
	];
	const Aquamarine = [
		"#7FFFD4"
	];
	const Turquoise = [
		"#40E0D0"
	];
	const MediumTurquoise = [
		"#48D1CC"
	];
	const DarkTurquoise = [
		"#00CED1"
	];
	const CadetBlue = [
		"#5F9EA0"
	];
	const SteelBlue = [
		"#4682B4"
	];
	const LightSteelBlue = [
		"#B0C4DE"
	];
	const LightBlue = [
		"#ADD8E6"
	];
	const PowderBlue = [
		"#B0E0E6"
	];
	const LightSkyBlue = [
		"#87CEFA"
	];
	const SkyBlue = [
		"#87CEEB"
	];
	const CornflowerBlue = [
		"#6495ED"
	];
	const DeepSkyBlue = [
		"#00BFFF"
	];
	const DodgerBlue = [
		"#1E90FF"
	];
	const RoyalBlue = [
		"#4169E1"
	];
	const Blue = [
		"#0000FF"
	];
	const MediumBlue = [
		"#0000CD"
	];
	const DarkBlue = [
		"#00008B"
	];
	const Navy = [
		"#000080"
	];
	const MidnightBlue = [
		"#191970"
	];
	const Lavender = [
		"#E6E6FA"
	];
	const Thistle = [
		"#D8BFD8"
	];
	const Plum = [
		"#DDA0DD"
	];
	const Orchid = [
		"#DA70D6"
	];
	const Violet = [
		"#EE82EE"
	];
	const Fuchsia = [
		"#FF00FF"
	];
	const Magenta = [
		"#FF00FF"
	];
	const MediumOrchid = [
		"#BA55D3"
	];
	const DarkOrchid = [
		"#9932CC"
	];
	const DarkViolet = [
		"#9400D3"
	];
	const BlueViolet = [
		"#8A2BE2"
	];
	const DarkMagenta = [
		"#8B008B"
	];
	const Purple = [
		"#800080"
	];
	const MediumPurple = [
		"#9370DB"
	];
	const MediumSlateBlue = [
		"#7B68EE"
	];
	const SlateBlue = [
		"#6A5ACD"
	];
	const DarkSlateBlue = [
		"#483D8B"
	];
	const RebeccaPurple = [
		"#663399"
	];
	const Indigo = [
		"#4B0082"
	];
	const Pink = [
		"#FFC0CB"
	];
	const LightPink = [
		"#FFB6C1"
	];
	const HotPink = [
		"#FF69B4"
	];
	const DeepPink = [
		"#FF1493"
	];
	const PaleVioletRed = [
		"#DB7093"
	];
	const MediumVioletRed = [
		"#C71585"
	];
	const Cornsilk = [
		"#FFF8DC"
	];
	const BlanchedAlmond = [
		"#FFEBCD"
	];
	const Bisque = [
		"#FFE4C4"
	];
	const NavajoWhite = [
		"#FFDEAD"
	];
	const Wheat = [
		"#F5DEB3"
	];
	const BurlyWood = [
		"#DEB887"
	];
	const Tan = [
		"#D2B48C"
	];
	const RosyBrown = [
		"#BC8F8F"
	];
	const SandyBrown = [
		"#F4A460"
	];
	const GoldenRod = [
		"#DAA520"
	];
	const DarkGoldenRod = [
		"#B8860B"
	];
	const Peru = [
		"#CD853F"
	];
	const Chocolate = [
		"#D2691E"
	];
	const Olive = [
		"#808000"
	];
	const SaddleBrown = [
		"#8B4513"
	];
	const Sienna = [
		"#A0522D"
	];
	const Brown = [
		"#A52A2A"
	];
	const Maroon = [
		"#800000"
	];
	var WEBCOLOR = {
		White: White,
		Snow: Snow,
		HoneyDew: HoneyDew,
		MintCream: MintCream,
		Azure: Azure,
		AliceBlue: AliceBlue,
		GhostWhite: GhostWhite,
		WhiteSmoke: WhiteSmoke,
		SeaShell: SeaShell,
		Beige: Beige,
		OldLace: OldLace,
		FloralWhite: FloralWhite,
		Ivory: Ivory,
		AntiqueWhite: AntiqueWhite,
		Linen: Linen,
		LavenderBlush: LavenderBlush,
		MistyRose: MistyRose,
		Gainsboro: Gainsboro,
		LightGray: LightGray,
		Silver: Silver,
		DarkGray: DarkGray,
		DimGray: DimGray,
		Gray: Gray,
		LightSlateGray: LightSlateGray,
		SlateGray: SlateGray,
		DarkSlateGray: DarkSlateGray,
		Black: Black,
		LightSalmon: LightSalmon,
		Salmon: Salmon,
		DarkSalmon: DarkSalmon,
		LightCoral: LightCoral,
		IndianRed: IndianRed,
		Crimson: Crimson,
		Red: Red,
		FireBrick: FireBrick,
		DarkRed: DarkRed,
		Orange: Orange,
		DarkOrange: DarkOrange,
		Coral: Coral,
		Tomato: Tomato,
		OrangeRed: OrangeRed,
		Gold: Gold,
		Yellow: Yellow,
		LightYellow: LightYellow,
		LemonChiffon: LemonChiffon,
		LightGoldenRodYellow: LightGoldenRodYellow,
		PapayaWhip: PapayaWhip,
		Moccasin: Moccasin,
		PeachPuff: PeachPuff,
		PaleGoldenRod: PaleGoldenRod,
		Khaki: Khaki,
		DarkKhaki: DarkKhaki,
		GreenYellow: GreenYellow,
		Chartreuse: Chartreuse,
		LawnGreen: LawnGreen,
		Lime: Lime,
		LimeGreen: LimeGreen,
		PaleGreen: PaleGreen,
		LightGreen: LightGreen,
		MediumSpringGreen: MediumSpringGreen,
		SpringGreen: SpringGreen,
		MediumSeaGreen: MediumSeaGreen,
		SeaGreen: SeaGreen,
		ForestGreen: ForestGreen,
		Green: Green,
		DarkGreen: DarkGreen,
		YellowGreen: YellowGreen,
		OliveDrab: OliveDrab,
		DarkOliveGreen: DarkOliveGreen,
		MediumAquaMarine: MediumAquaMarine,
		DarkSeaGreen: DarkSeaGreen,
		LightSeaGreen: LightSeaGreen,
		DarkCyan: DarkCyan,
		Teal: Teal,
		Aqua: Aqua,
		Cyan: Cyan,
		LightCyan: LightCyan,
		PaleTurquoise: PaleTurquoise,
		Aquamarine: Aquamarine,
		Turquoise: Turquoise,
		MediumTurquoise: MediumTurquoise,
		DarkTurquoise: DarkTurquoise,
		CadetBlue: CadetBlue,
		SteelBlue: SteelBlue,
		LightSteelBlue: LightSteelBlue,
		LightBlue: LightBlue,
		PowderBlue: PowderBlue,
		LightSkyBlue: LightSkyBlue,
		SkyBlue: SkyBlue,
		CornflowerBlue: CornflowerBlue,
		DeepSkyBlue: DeepSkyBlue,
		DodgerBlue: DodgerBlue,
		RoyalBlue: RoyalBlue,
		Blue: Blue,
		MediumBlue: MediumBlue,
		DarkBlue: DarkBlue,
		Navy: Navy,
		MidnightBlue: MidnightBlue,
		Lavender: Lavender,
		Thistle: Thistle,
		Plum: Plum,
		Orchid: Orchid,
		Violet: Violet,
		Fuchsia: Fuchsia,
		Magenta: Magenta,
		MediumOrchid: MediumOrchid,
		DarkOrchid: DarkOrchid,
		DarkViolet: DarkViolet,
		BlueViolet: BlueViolet,
		DarkMagenta: DarkMagenta,
		Purple: Purple,
		MediumPurple: MediumPurple,
		MediumSlateBlue: MediumSlateBlue,
		SlateBlue: SlateBlue,
		DarkSlateBlue: DarkSlateBlue,
		RebeccaPurple: RebeccaPurple,
		Indigo: Indigo,
		Pink: Pink,
		LightPink: LightPink,
		HotPink: HotPink,
		DeepPink: DeepPink,
		PaleVioletRed: PaleVioletRed,
		MediumVioletRed: MediumVioletRed,
		Cornsilk: Cornsilk,
		BlanchedAlmond: BlanchedAlmond,
		Bisque: Bisque,
		NavajoWhite: NavajoWhite,
		Wheat: Wheat,
		BurlyWood: BurlyWood,
		Tan: Tan,
		RosyBrown: RosyBrown,
		SandyBrown: SandyBrown,
		GoldenRod: GoldenRod,
		DarkGoldenRod: DarkGoldenRod,
		Peru: Peru,
		Chocolate: Chocolate,
		Olive: Olive,
		SaddleBrown: SaddleBrown,
		Sienna: Sienna,
		Brown: Brown,
		Maroon: Maroon
	};

	const Vermilion = [
		"#EF454A",
		"バーミリオン"
	];
	const Maroon$1 = [
		"#662B2C",
		"マルーン"
	];
	const Pink$1 = [
		"#EA9198",
		"ピンク"
	];
	const Bordeaux = [
		"#533638",
		"ボルドー"
	];
	const Red$1 = [
		"#DF3447",
		"レッド"
	];
	const Burgundy = [
		"#442E31",
		"バーガンディー"
	];
	const Rose = [
		"#DB3561",
		"ローズ"
	];
	const Carmine = [
		"#BE0039",
		"カーマイン"
	];
	const Strawberry = [
		"#BB004B",
		"ストロベリー"
	];
	const Magenta$1 = [
		"#D13A84",
		"マゼンタ"
	];
	const Orchid$1 = [
		"#C69CC5",
		"オーキッド"
	];
	const Purple$1 = [
		"#A757A8",
		"パープル"
	];
	const Lilac = [
		"#C29DC8",
		"ライラック"
	];
	const Lavender$1 = [
		"#9A8A9F",
		"ラベンダー"
	];
	const Mauve = [
		"#855896",
		"モーブ"
	];
	const Violet$1 = [
		"#714C99",
		"バイオレット"
	];
	const Heliotrope = [
		"#8865B2",
		"ヘリオトロープ"
	];
	const Pansy = [
		"#433171",
		"パンジー"
	];
	const Wistaria = [
		"#7967C3",
		"ウイスタリア"
	];
	const Hyacinth = [
		"#6E82AD",
		"ヒヤシンス"
	];
	const Blue$1 = [
		"#006FAB",
		"ブルー"
	];
	const Cyan$1 = [
		"#009CD1",
		"シアン"
	];
	const Viridian = [
		"#006D56",
		"ビリジアン"
	];
	const Green$1 = [
		"#009A57",
		"グリーン"
	];
	const Yellow$1 = [
		"#F4D500",
		"イエロー"
	];
	const Olive$1 = [
		"#5C5424",
		"オリーブ"
	];
	const Marigold = [
		"#FFA400",
		"マリーゴールド"
	];
	const Leghorn = [
		"#DFC291",
		"レグホーン"
	];
	const Ivory$1 = [
		"#DED2BF",
		"アイボリー"
	];
	const Sepia = [
		"#483C2C",
		"セピア"
	];
	const Bronze = [
		"#7A592F",
		"ブロンズ"
	];
	const Beige$1 = [
		"#BCA78D",
		"ベージュ"
	];
	const Amber = [
		"#AA7A40",
		"アンバー"
	];
	const Buff = [
		"#C09567",
		"バフ"
	];
	const Orange$1 = [
		"#EF810F",
		"オレンジ"
	];
	const Tan$1 = [
		"#9E6C3F",
		"タン"
	];
	const Apricot = [
		"#D89F6D",
		"アプリコット"
	];
	const Cork = [
		"#9F7C5C",
		"コルク"
	];
	const Brown$1 = [
		"#6D4C33",
		"ブラウン"
	];
	const Peach = [
		"#E8BDA5",
		"ピーチ"
	];
	const Blond = [
		"#F6A57D",
		"ブロンド"
	];
	const Khaki$1 = [
		"#A36851",
		"カーキー"
	];
	const Chocolate$1 = [
		"#503830",
		"チョコレート"
	];
	const Terracotta = [
		"#A95045",
		"テラコッタ"
	];
	const Scarlet = [
		"#DE3838",
		"スカーレット"
	];
	const White$1 = [
		"#F0F0F0",
		"ホワイト"
	];
	const Grey = [
		"#767676",
		"グレイ"
	];
	const Black$1 = [
		"#212121",
		"ブラック"
	];
	var JISCOLOR_EN = {
		Vermilion: Vermilion,
		Maroon: Maroon$1,
		Pink: Pink$1,
		Bordeaux: Bordeaux,
		"Tomato Red": [
		"#DF3447",
		"トマトレッド"
	],
		Red: Red$1,
		"Coral Red": [
		"#FF7F8F",
		"コーラルレッド"
	],
		"Old Rose": [
		"#C67A85",
		"オールドローズ"
	],
		Burgundy: Burgundy,
		"Poppy Red": [
		"#DF334E",
		"ポピーレッド"
	],
		"Signal red": [
		"#CE2143",
		"シグナルレッド"
	],
		"Rose Pink": [
		"#EE8EA0",
		"ローズピンク"
	],
		Rose: Rose,
		"Wine Red": [
		"#80273F",
		"ワインレッド"
	],
		Carmine: Carmine,
		"Cochineal Red": [
		"#AE2B52",
		"コチニールレッド"
	],
		"Rose Red": [
		"#CA4775",
		"ローズレッド"
	],
		"Ruby Red": [
		"#B90B50",
		"ルビーレッド"
	],
		"Cherry Pink": [
		"#D35889",
		"チェリーピンク"
	],
		Strawberry: Strawberry,
		Magenta: Magenta$1,
		Orchid: Orchid$1,
		Purple: Purple$1,
		Lilac: Lilac,
		Lavender: Lavender$1,
		Mauve: Mauve,
		"Charcoal Grey": [
		"#4B474D",
		"チャコールグレイ"
	],
		"Steel Grey": [
		"#6D696F",
		"スチールグレイ"
	],
		Violet: Violet$1,
		Heliotrope: Heliotrope,
		Pansy: Pansy,
		Wistaria: Wistaria,
		"Oriental Blue": [
		"#304285",
		"オリエンタルブルー"
	],
		"Ultramarine Blue": [
		"#384D98",
		"ウルトラマリンブルー"
	],
		"Navy Blue": [
		"#343D55",
		"ネービーブルー"
	],
		"Midnight Blue": [
		"#252A35",
		"ミッドナイトブルー"
	],
		Hyacinth: Hyacinth,
		"Prussian Blue": [
		"#3A4861",
		"プルシャンブルー"
	],
		"Iron Blue": [
		"#3A4861",
		"アイアンブルー"
	],
		"Slate Grey": [
		"#515356",
		"スレートグレイ"
	],
		"Sax Blue": [
		"#5A7993",
		"サックスブルー"
	],
		"Baby Blue": [
		"#A3BACD",
		"ベビーブルー"
	],
		"Cobalt Blue": [
		"#0062A0",
		"コバルトブルー"
	],
		"Sky Blue": [
		"#89BDDE",
		"スカイブルー"
	],
		"Sky Grey": [
		"#B3B8BB",
		"スカイグレイ"
	],
		Blue: Blue$1,
		"Horizon Blue": [
		"#87AFC5",
		"ホリゾンブルー"
	],
		"Cerulean Blue": [
		"#0073A2",
		"セルリアンブルー"
	],
		Cyan: Cyan$1,
		"Marine Blue": [
		"#00526B",
		"マリンブルー"
	],
		"Turquoise Blue": [
		"#009DBF",
		"ターコイズブルー"
	],
		"Peacock Blue": [
		"#006E7B",
		"ピーコックブルー"
	],
		"Nile Blue": [
		"#3D8E95",
		"ナイルブルー"
	],
		"Peacock Green": [
		"#007D7F",
		"ピーコックグリーン"
	],
		"Billiard Green": [
		"#00483A",
		"ビリヤードグリーン"
	],
		Viridian: Viridian,
		"Forest Green": [
		"#2A7762",
		"フォレストグリーン"
	],
		"Emerald Green": [
		"#00A474",
		"エメラルドグリーン"
	],
		"Cobalt Green": [
		"#09C289",
		"コバルトグリーン"
	],
		"Malachite Green": [
		"#007E4E",
		"マラカイトグリーン"
	],
		"Bottle Green": [
		"#204537",
		"ボトルグリーン"
	],
		Green: Green$1,
		"Mint Green": [
		"#58CE91",
		"ミントグリーン"
	],
		"Apple Green": [
		"#A2D29E",
		"アップルグリーン"
	],
		"Ivy Green": [
		"#4C6733",
		"アイビーグリーン"
	],
		"Sea Green": [
		"#97B64D",
		"シーグリーン"
	],
		"Leaf Green": [
		"#89983B",
		"リーフグリーン"
	],
		"Grass Green": [
		"#737C3E",
		"グラスグリーン"
	],
		"Chartreuse Green": [
		"#C0D136",
		"シャトルーズグリーン"
	],
		"Olive Green": [
		"#575531",
		"オリーブグリーン"
	],
		"Lemon Yellow": [
		"#D9CA00",
		"レモンイエロー"
	],
		"Jaune Brillant": [
		"#F4D500",
		"ジョンブリアン"
	],
		Yellow: Yellow$1,
		"Canary Yellow": [
		"#EDD634",
		"カナリヤ"
	],
		Olive: Olive$1,
		"Olive Drab": [
		"#655F47",
		"オリーブドラブ"
	],
		"Chrome Yellow": [
		"#F6BF00",
		"クロムイエロー"
	],
		"Cream Yellow": [
		"#E4D3A2",
		"クリームイエロー"
	],
		"Raw umber": [
		"#765B1B",
		"ローアンバー"
	],
		"Naples Yellow": [
		"#EEC063",
		"ネープルスイエロー"
	],
		Marigold: Marigold,
		Leghorn: Leghorn,
		"Yellow Ocher": [
		"#B8883B",
		"イエローオーカー"
	],
		Ivory: Ivory$1,
		"Burnt Umber": [
		"#57462D",
		"バーントアンバー"
	],
		Sepia: Sepia,
		Bronze: Bronze,
		Beige: Beige$1,
		"Mandarin Orange": [
		"#F09629",
		"マンダリンオレンジ"
	],
		"Golden Yellow": [
		"#E89A3C",
		"ゴールデンイエロー"
	],
		Amber: Amber,
		Buff: Buff,
		Orange: Orange$1,
		"Ecru Beige": [
		"#F5CDA6",
		"エクルベイジュ"
	],
		Tan: Tan$1,
		Apricot: Apricot,
		Cork: Cork,
		"Raw Sienna": [
		"#B1632A",
		"ローシェンナ"
	],
		Brown: Brown$1,
		Peach: Peach,
		"Cocoa Brown": [
		"#704B38",
		"ココアブラウン"
	],
		Blond: Blond,
		Khaki: Khaki$1,
		"Nail Pink": [
		"#EFBAA8",
		"ネールピンク"
	],
		"Carrot Orange": [
		"#C55431",
		"キャロットオレンジ"
	],
		"Burnt Sienna": [
		"#A2553C",
		"バーントシェンナ"
	],
		Chocolate: Chocolate$1,
		"Shell Pink": [
		"#F9C9B9",
		"シェルピンク"
	],
		"Chinese Red": [
		"#FD5A2A",
		"チャイニーズレッド"
	],
		"Salmon pink": [
		"#FF9E8C",
		"サーモンピンク"
	],
		Terracotta: Terracotta,
		"Baby Pink": [
		"#FEC6C5",
		"ベビーピンク"
	],
		Scarlet: Scarlet,
		"Rose Grey": [
		"#8C8080",
		"ローズグレイ"
	],
		"Snow White": [
		"#F0F0F0",
		"スノーホワイト"
	],
		White: White$1,
		"Pearl Grey": [
		"#AAAAAA",
		"パールグレイ"
	],
		"Silver Grey": [
		"#9C9C9C",
		"シルバーグレイ"
	],
		"Ash Grey": [
		"#8F8F8F",
		"アッシュグレイ"
	],
		Grey: Grey,
		Black: Black$1,
		"Lamp Black": [
		"#212121",
		"ランプブラック"
	]
	};

	var JISCOLOR_JA = {
		"朱色": [
		"#EF454A",
		"しゅいろ"
	],
		"蘇芳": [
		"#94474B",
		"すおう"
	],
		"桃色": [
		"#E38089",
		"ももいろ"
	],
		"紅梅色": [
		"#DF828A",
		"こうばいいろ"
	],
		"臙脂": [
		"#AD3140",
		"えんじ"
	],
		"珊瑚色": [
		"#FF7F8F",
		"さんごいろ"
	],
		"桜色": [
		"#FBDADE",
		"さくらいろ"
	],
		"茜色": [
		"#9E2236",
		"あかねいろ"
	],
		"韓紅": [
		"#E64B6B",
		"からくれない"
	],
		"紅赤": [
		"#B81A3E",
		"べにあか"
	],
		"薔薇色": [
		"#D53E62",
		"ばらいろ"
	],
		"赤": [
		"#BE0032",
		"あか"
	],
		"鴇色": [
		"#FA9CB8",
		"ときいろ"
	],
		"紅色": [
		"#BE003F",
		"べにいろ"
	],
		"躑躅色": [
		"#CF4078",
		"つつじいろ"
	],
		"赤紫": [
		"#DA508F",
		"あかむらさき"
	],
		"牡丹色": [
		"#C94093",
		"ぼたんいろ"
	],
		"菖蒲色": [
		"#744B98",
		"しょうぶいろ"
	],
		"茄子紺": [
		"#473946",
		"なすこん"
	],
		"紫紺": [
		"#422C41",
		"しこん"
	],
		"古代紫": [
		"#765276",
		"こだいむらさき"
	],
		"紫": [
		"#A757A8",
		"むらさき"
	],
		"江戸紫": [
		"#614876",
		"えどむらさき"
	],
		"鳩羽色": [
		"#665971",
		"はとばいろ"
	],
		"菫色": [
		"#714C99",
		"すみれいろ"
	],
		"青紫": [
		"#7445AA",
		"あおむらさき"
	],
		"藤紫": [
		"#9883C9",
		"ふじむらさき"
	],
		"藤色": [
		"#A294C8",
		"ふじいろ"
	],
		"藤納戸": [
		"#69639A",
		"ふじなんど"
	],
		"紺藍": [
		"#353573",
		"こんあい"
	],
		"鉄紺": [
		"#292934",
		"てつこん"
	],
		"桔梗色": [
		"#4347A2",
		"ききょういろ"
	],
		"勝色": [
		"#3A3C4F",
		"かちいろ"
	],
		"群青色": [
		"#384D98",
		"ぐんじょういろ"
	],
		"杜若色": [
		"#435AA0",
		"かきつばたいろ"
	],
		"紺色": [
		"#343D55",
		"こんいろ"
	],
		"紺青": [
		"#3A4861",
		"こんじょう"
	],
		"瑠璃紺": [
		"#27477A",
		"るりこん"
	],
		"勿忘草色": [
		"#89ACD7",
		"わすれなぐさいろ"
	],
		"鉛色": [
		"#72777D",
		"なまりいろ"
	],
		"瑠璃色": [
		"#00519A",
		"るりいろ"
	],
		"濃藍": [
		"#223546",
		"こいあい"
	],
		"縹色": [
		"#2B618F",
		"はなだいろ"
	],
		"藍色": [
		"#2B4B65",
		"あいいろ"
	],
		"青": [
		"#006AB6",
		"あお"
	],
		"空色": [
		"#89BDDE",
		"そらいろ"
	],
		"露草色": [
		"#007BC3",
		"つゆくさいろ"
	],
		"藍鼠": [
		"#576D79",
		"あいねず"
	],
		"水色": [
		"#9DCCE0",
		"みずいろ"
	],
		"甕覗き": [
		"#7EB1C1",
		"かめのぞき"
	],
		"白群": [
		"#73B3C1",
		"びゃくぐん"
	],
		"納戸色": [
		"#00687C",
		"なんどいろ"
	],
		"浅葱色": [
		"#00859B",
		"あさぎいろ"
	],
		"新橋色": [
		"#53A8B7",
		"しんばしいろ"
	],
		"水浅葱": [
		"#6D969C",
		"みずあさぎ"
	],
		"錆浅葱": [
		"#608A8E",
		"さびあさぎ"
	],
		"青緑": [
		"#008E94",
		"あおみどり"
	],
		"鉄色": [
		"#24433E",
		"てついろ"
	],
		"青竹色": [
		"#6AA89D",
		"あおたけいろ"
	],
		"若竹色": [
		"#00A37E",
		"わかたけいろ"
	],
		"萌葱色": [
		"#00533E",
		"もえぎいろ"
	],
		"青磁色": [
		"#6DA895",
		"せいじいろ"
	],
		"常磐色": [
		"#007B50",
		"ときわいろ"
	],
		"深緑": [
		"#005638",
		"ふかみどり"
	],
		"緑": [
		"#00B66E",
		"みどり"
	],
		"千歳緑": [
		"#3C6754",
		"ちとせみどり"
	],
		"緑青色": [
		"#4D8169",
		"ろくしょういろ"
	],
		"白緑": [
		"#BADBC7",
		"びゃくろく"
	],
		"利休鼠": [
		"#6E7972",
		"りきゅうねずみ"
	],
		"松葉色": [
		"#687E52",
		"まつばいろ"
	],
		"若葉色": [
		"#A9C087",
		"わかばいろ"
	],
		"草色": [
		"#737C3E",
		"くさいろ"
	],
		"萌黄": [
		"#97A61E",
		"もえぎ"
	],
		"若草色": [
		"#AAB300",
		"わかくさいろ"
	],
		"黄緑": [
		"#BBC000",
		"きみどり"
	],
		"苔色": [
		"#7C7A37",
		"こけいろ"
	],
		"鶸色": [
		"#C2BD3D",
		"ひわいろ"
	],
		"鶯色": [
		"#706C3E",
		"うぐいすいろ"
	],
		"黄檗色": [
		"#D6C949",
		"きはだいろ"
	],
		"抹茶色": [
		"#C0BA7F",
		"まっちゃいろ"
	],
		"中黄": [
		"#EDD60E",
		"ちゅうき"
	],
		"蒲公英色": [
		"#E3C700",
		"たんぽぽいろ"
	],
		"黄色": [
		"#E3C700",
		"きいろ"
	],
		"刈安色": [
		"#EAD56B",
		"かりやすいろ"
	],
		"海松色": [
		"#716B4A",
		"みるいろ"
	],
		"鶯茶": [
		"#6A5F37",
		"うぐいすちゃ"
	],
		"鬱金色": [
		"#EDAE00",
		"うこんいろ"
	],
		"向日葵色": [
		"#FFBB00",
		"ひまわりいろ"
	],
		"山吹色": [
		"#F8A900",
		"やまぶきいろ"
	],
		"芥子色": [
		"#C8A65D",
		"からしいろ"
	],
		"金茶": [
		"#B47700",
		"きんちゃ"
	],
		"黄土色": [
		"#B8883B",
		"おうどいろ"
	],
		"砂色": [
		"#C5B69E",
		"すないろ"
	],
		"象牙色": [
		"#DED2BF",
		"ぞうげいろ"
	],
		"胡粉色": [
		"#EBE7E1",
		"ごふんいろ"
	],
		"卵色": [
		"#F4BD6B",
		"たまごいろ"
	],
		"蜜柑色": [
		"#EB8400",
		"みかんいろ"
	],
		"褐色": [
		"#6B3E08",
		"かっしょく"
	],
		"土色": [
		"#9F6C31",
		"つちいろ"
	],
		"琥珀色": [
		"#AA7A40",
		"こはくいろ"
	],
		"朽葉色": [
		"#847461",
		"くちばいろ"
	],
		"煤竹色": [
		"#5D5245",
		"すすたけいろ"
	],
		"小麦色": [
		"#D4A168",
		"こむぎいろ"
	],
		"生成り色": [
		"#EAE0D5",
		"きなりいろ"
	],
		"橙色": [
		"#EF810F",
		"だいだいいろ"
	],
		"杏色": [
		"#D89F6D",
		"あんずいろ"
	],
		"柑子色": [
		"#FAA55C",
		"こうじいろ"
	],
		"黄茶": [
		"#B1632A",
		"きちゃ"
	],
		"茶色": [
		"#6D4C33",
		"ちゃいろ"
	],
		"肌色": [
		"#F1BB93",
		"はだいろ"
	],
		"駱駝色": [
		"#B0764F",
		"らくだいろ"
	],
		"灰茶": [
		"#816551",
		"はいちゃ"
	],
		"焦茶": [
		"#564539",
		"こげちゃ"
	],
		"黄赤": [
		"#D86011",
		"きあか"
	],
		"茶鼠": [
		"#998D86",
		"ちゃねずみ"
	],
		"代赭": [
		"#B26235",
		"たいしゃ"
	],
		"栗色": [
		"#704B38",
		"くりいろ"
	],
		"黒茶": [
		"#3E312B",
		"くろちゃ"
	],
		"桧皮色": [
		"#865C4B",
		"ひわだいろ"
	],
		"樺色": [
		"#B64826",
		"かばいろ"
	],
		"柿色": [
		"#DB5C35",
		"かきいろ"
	],
		"黄丹": [
		"#EB6940",
		"おうに"
	],
		"煉瓦色": [
		"#914C35",
		"れんがいろ"
	],
		"肉桂色": [
		"#B5725C",
		"にっけいいろ"
	],
		"錆色": [
		"#624035",
		"さびいろ"
	],
		"赤橙": [
		"#E65226",
		"あかだいだい"
	],
		"赤錆色": [
		"#8D3927",
		"あかさびいろ"
	],
		"赤茶": [
		"#AD4E39",
		"あかちゃ"
	],
		"金赤": [
		"#EA4E31",
		"きんあか"
	],
		"海老茶": [
		"#693C34",
		"えびちゃ"
	],
		"小豆色": [
		"#905D54",
		"あずきいろ"
	],
		"弁柄色": [
		"#863E33",
		"べんがらいろ"
	],
		"紅海老茶": [
		"#6D3A33",
		"べにえびちゃ"
	],
		"鳶色": [
		"#7A453D",
		"とびいろ"
	],
		"鉛丹色": [
		"#D1483E",
		"えんたんいろ"
	],
		"紅樺色": [
		"#9E413F",
		"べにかばいろ"
	],
		"紅緋": [
		"#EF4644",
		"べにひ"
	],
		"白": [
		"#F0F0F0",
		"しろ"
	],
		"銀鼠": [
		"#9C9C9C",
		"ぎんねず"
	],
		"鼠色": [
		"#838383",
		"ねずみいろ"
	],
		"灰色": [
		"#767676",
		"はいいろ"
	],
		"墨": [
		"#343434",
		"すみ"
	],
		"鉄黒": [
		"#2A2A2A",
		"てつぐろ"
	],
		"黒": [
		"#2A2A2A",
		"くろ"
	]
	};

	const Red$2 = [
		"#ffebee",
		"#ffcdd2",
		"#ef9a9a",
		"#e57373",
		"#ef5350",
		"#f44336",
		"#e53935",
		"#d32f2f",
		"#c62828",
		"#b71c1c",
		"#ff8a80",
		"#ff5252",
		"#ff1744",
		"#d50000"
	];
	const Pink$2 = [
		"#fce4ec",
		"#f8bbd0",
		"#f48fb1",
		"#f06292",
		"#ec407a",
		"#e91e63",
		"#d81b60",
		"#c2185b",
		"#ad1457",
		"#880e4f",
		"#ff80ab",
		"#ff4081",
		"#f50057",
		"#c51162"
	];
	const Purple$2 = [
		"#f3e5f5",
		"#e1bee7",
		"#ce93d8",
		"#ba68c8",
		"#ab47bc",
		"#9c27b0",
		"#8e24aa",
		"#7b1fa2",
		"#6a1b9a",
		"#4a148c",
		"#ea80fc",
		"#e040fb",
		"#d500f9",
		"#aa00ff"
	];
	const DeepPurple = [
		"#ede7f6",
		"#d1c4e9",
		"#b39ddb",
		"#9575cd",
		"#7e57c2",
		"#673ab7",
		"#5e35b1",
		"#512da8",
		"#4527a0",
		"#311b92",
		"#b388ff",
		"#7c4dff",
		"#651fff",
		"#6200ea"
	];
	const Indigo$1 = [
		"#e8eaf6",
		"#c5cae9",
		"#9fa8da",
		"#7986cb",
		"#5c6bc0",
		"#3f51b5",
		"#3949ab",
		"#303f9f",
		"#283593",
		"#1a237e",
		"#8c9eff",
		"#536dfe",
		"#3d5afe",
		"#304ffe"
	];
	const Blue$2 = [
		"#e3f2fd",
		"#bbdefb",
		"#90caf9",
		"#64b5f6",
		"#42a5f5",
		"#2196f3",
		"#1e88e5",
		"#1976d2",
		"#1565c0",
		"#0d47a1",
		"#82b1ff",
		"#448aff",
		"#2979ff",
		"#2962ff"
	];
	const LightBlue$1 = [
		"#e1f5fe",
		"#b3e5fc",
		"#81d4fa",
		"#4fc3f7",
		"#29b6f6",
		"#03a9f4",
		"#039be5",
		"#0288d1",
		"#0277bd",
		"#01579b",
		"#80d8ff",
		"#40c4ff",
		"#00b0ff",
		"#0091ea"
	];
	const Cyan$2 = [
		"#e0f7fa",
		"#b2ebf2",
		"#80deea",
		"#4dd0e1",
		"#26c6da",
		"#00bcd4",
		"#00acc1",
		"#0097a7",
		"#00838f",
		"#006064",
		"#84ffff",
		"#18ffff",
		"#00e5ff",
		"#00b8d4"
	];
	const Teal$1 = [
		"#e0f2f1",
		"#b2dfdb",
		"#80cbc4",
		"#4db6ac",
		"#26a69a",
		"#009688",
		"#00897b",
		"#00796b",
		"#00695c",
		"#004d40",
		"#a7ffeb",
		"#64ffda",
		"#1de9b6",
		"#00bfa5"
	];
	const Green$2 = [
		"#e8f5e9",
		"#c8e6c9",
		"#a5d6a7",
		"#81c784",
		"#66bb6a",
		"#4caf50",
		"#43a047",
		"#388e3c",
		"#2e7d32",
		"#1b5e20",
		"#b9f6ca",
		"#69f0ae",
		"#00e676",
		"#00c853"
	];
	const LightGreen$1 = [
		"#f1f8e9",
		"#dcedc8",
		"#c5e1a5",
		"#aed581",
		"#9ccc65",
		"#8bc34a",
		"#7cb342",
		"#689f38",
		"#558b2f",
		"#33691e",
		"#ccff90",
		"#b2ff59",
		"#76ff03",
		"#64dd17"
	];
	const Lime$1 = [
		"#f9fbe7",
		"#f0f4c3",
		"#e6ee9c",
		"#dce775",
		"#d4e157",
		"#cddc39",
		"#c0ca33",
		"#afb42b",
		"#9e9d24",
		"#827717",
		"#f4ff81",
		"#eeff41",
		"#c6ff00",
		"#aeea00"
	];
	const Yellow$2 = [
		"#fffde7",
		"#fff9c4",
		"#fff59d",
		"#fff176",
		"#ffee58",
		"#ffeb3b",
		"#fdd835",
		"#fbc02d",
		"#f9a825",
		"#f57f17",
		"#ffff8d",
		"#ffff00",
		"#ffea00",
		"#ffd600"
	];
	const Amber$1 = [
		"#fff8e1",
		"#ffecb3",
		"#ffe082",
		"#ffd54f",
		"#ffca28",
		"#ffc107",
		"#ffb300",
		"#ffa000",
		"#ff8f00",
		"#ff6f00",
		"#ffe57f",
		"#ffd740",
		"#ffc400",
		"#ffab00"
	];
	const Orange$2 = [
		"#fff3e0",
		"#ffe0b2",
		"#ffcc80",
		"#ffb74d",
		"#ffa726",
		"#ff9800",
		"#fb8c00",
		"#f57c00",
		"#ef6c00",
		"#e65100",
		"#ffd180",
		"#ffab40",
		"#ff9100",
		"#ff6d00"
	];
	const DeepOrange = [
		"#fbe9e7",
		"#ffccbc",
		"#ffab91",
		"#ff8a65",
		"#ff7043",
		"#ff5722",
		"#f4511e",
		"#e64a19",
		"#d84315",
		"#bf360c",
		"#ff9e80",
		"#ff6e40",
		"#ff3d00",
		"#dd2c00"
	];
	const Brown$2 = [
		"#efebe9",
		"#d7ccc8",
		"#bcaaa4",
		"#a1887f",
		"#8d6e63",
		"#795548",
		"#6d4c41",
		"#5d4037",
		"#4e342e",
		"#3e2723"
	];
	const Grey$1 = [
		"#fafafa",
		"#f5f5f5",
		"#eeeeee",
		"#e0e0e0",
		"#bdbdbd",
		"#9e9e9e",
		"#757575",
		"#616161",
		"#424242",
		"#212121"
	];
	const BlueGrey = [
		"#eceff1",
		"#cfd8dc",
		"#b0bec5",
		"#90a4ae",
		"#78909c",
		"#607d8b",
		"#546e7a",
		"#455a64",
		"#37474f",
		"#263238"
	];
	var MATERIALCOLOR = {
		Red: Red$2,
		Pink: Pink$2,
		Purple: Purple$2,
		DeepPurple: DeepPurple,
		Indigo: Indigo$1,
		Blue: Blue$2,
		LightBlue: LightBlue$1,
		Cyan: Cyan$2,
		Teal: Teal$1,
		Green: Green$2,
		LightGreen: LightGreen$1,
		Lime: Lime$1,
		Yellow: Yellow$2,
		Amber: Amber$1,
		Orange: Orange$2,
		DeepOrange: DeepOrange,
		Brown: Brown$2,
		Grey: Grey$1,
		BlueGrey: BlueGrey
	};

	const Beige$2 = [
		"#D0B084",
		1001
	];
	const Ivory$2 = [
		"#E1CC4F",
		1014
	];
	const Curry = [
		"#9D9101",
		1027
	];
	const Vermilion$1 = [
		"#CB2821",
		2002
	];
	const Cored = [
		"#B32821",
		3016
	];
	const Rose$1 = [
		"#E63244",
		3017
	];
	const Luminous = [
		"#FE0000",
		3026
	];
	const Telemagenta = [
		"#CF3476",
		4010
	];
	const braun = [
		"#45322E",
		8017
	];
	const Cream = [
		"#FDF4E3",
		9001
	];
	const schwarz = [
		"#1E1E1E",
		9017
	];
	var RALCOLOUR = {
		"Green beige": [
		"#CDBA88",
		1000
	],
		Beige: Beige$2,
		"Sand yellow": [
		"#D2AA6D",
		1002
	],
		"Signal yellow": [
		"#F9A800",
		1003
	],
		"Golden yellow": [
		"#CDA434",
		1004
	],
		"Honey yellow": [
		"#CB8E00",
		1005
	],
		"Maize yellow": [
		"#E29000",
		1006
	],
		"Daffodil yellow": [
		"#DC9D00",
		1007
	],
		"Brown beige": [
		"#AF804F",
		1011
	],
		"Lemon yellow": [
		"#C7B446",
		1012
	],
		"Oyster white": [
		"#E3D9C6",
		1013
	],
		Ivory: Ivory$2,
		"Light ivory": [
		"#E6D690",
		1015
	],
		"Sulfur yellow": [
		"#EDFF21",
		1016
	],
		"Saffron yellow": [
		"#F5D033",
		1017
	],
		"Zinc yellow": [
		"#F8F32B",
		1018
	],
		"Grey beige": [
		"#9E9764",
		1019
	],
		"Olive yellow": [
		"#999950",
		1020
	],
		"Rape yellow": [
		"#F3DA0B",
		1021
	],
		"Traffic yellow": [
		"#FAD201",
		1023
	],
		"Ochre yellow": [
		"#AEA04B",
		1024
	],
		"Luminous yellow": [
		"#FFFF00",
		1026
	],
		Curry: Curry,
		"Melon yellow": [
		"#F4A900",
		1028
	],
		"Broom yellow": [
		"#D6AE01",
		1032
	],
		"Dahlia yellow": [
		"#F3A505",
		1033
	],
		"Pastel yellow": [
		"#EFA94A",
		1034
	],
		"Pearl beige": [
		"#6A5D4D",
		1035
	],
		"Pearl gold": [
		"#705335",
		1036
	],
		"Sun yellow": [
		"#F39F18",
		1037
	],
		"Yellow orange": [
		"#ED760E",
		2000
	],
		"Red orange": [
		"#C93C20",
		2001
	],
		Vermilion: Vermilion$1,
		"Pastel orange": [
		"#FF7514",
		2003
	],
		"Pure orange": [
		"#F44611",
		2004
	],
		"Luminous orange": [
		"#FF2301",
		2005
	],
		"Luminous bright orange": [
		"#FFA420",
		2007
	],
		"Bright red orange": [
		"#F75E25",
		2008
	],
		"Traffic orange": [
		"#F54021",
		2009
	],
		"Signal orange": [
		"#D84B20",
		2010
	],
		"Deep orange": [
		"#EC7C26",
		2011
	],
		"Salmon range": [
		"#E55137",
		2012
	],
		"Pearl orange": [
		"#C35831",
		2013
	],
		"Flame red": [
		"#AF2B1E",
		3000
	],
		"Signal red": [
		"#A52019",
		3001
	],
		"Carmine red": [
		"#A2231D",
		3002
	],
		"Ruby red": [
		"#9B111E",
		3003
	],
		"Purple red": [
		"#75151E",
		3004
	],
		"Wine red": [
		"#5E2129",
		3005
	],
		"Black red": [
		"#412227",
		3007
	],
		"Oxide red": [
		"#642424",
		3009
	],
		"Brown red": [
		"#781F19",
		3011
	],
		"Beige red": [
		"#C1876B",
		3012
	],
		"Tomato red": [
		"#A12312",
		3013
	],
		"Antique pink": [
		"#D36E70",
		3014
	],
		"Light pink": [
		"#EA899A",
		3015
	],
		Cored: Cored,
		Rose: Rose$1,
		"Strawberry red": [
		"#D53032",
		3018
	],
		"Traffic red": [
		"#CC0605",
		3020
	],
		"Salmon pink": [
		"#D95030",
		3022
	],
		"Luminous red": [
		"#F80000",
		3024
	],
		Luminous: Luminous,
		"Raspberry red": [
		"#C51D34",
		3027
	],
		"Pure  red": [
		"#CB3234",
		3028
	],
		"Orient red": [
		"#B32428",
		3031
	],
		"Pearl ruby red": [
		"#721422",
		3032
	],
		"Pearl pink": [
		"#B44C43",
		3033
	],
		"Red lilac": [
		"#6D3F5B",
		4001
	],
		"Red violet": [
		"#922B3E",
		4002
	],
		"Heather violet": [
		"#DE4C8A",
		4003
	],
		"Claret violet": [
		"#641C34",
		4004
	],
		"Blue lilac": [
		"#6C4675",
		4005
	],
		"Traffic purple": [
		"#A03472",
		4006
	],
		"Purple violet": [
		"#4A192C",
		4007
	],
		"Signal violet": [
		"#924E7D",
		4008
	],
		"Pastel violet": [
		"#A18594",
		4009
	],
		Telemagenta: Telemagenta,
		"Pearl violet": [
		"#8673A1",
		4011
	],
		"Pearl black berry": [
		"#6C6874",
		4012
	],
		"Violet blue": [
		"#354D73",
		5000
	],
		"Green blue": [
		"#1F3438",
		5001
	],
		"Ultramarine blue": [
		"#20214F",
		5002
	],
		"Saphire blue": [
		"#1D1E33",
		5003
	],
		"Black blue": [
		"#18171C",
		5004
	],
		"Signal blue": [
		"#1E2460",
		5005
	],
		"Brillant blue": [
		"#3E5F8A",
		5007
	],
		"Grey blue": [
		"#26252D",
		5008
	],
		"Azure blue": [
		"#025669",
		5009
	],
		"Gentian blue": [
		"#0E294B",
		5010
	],
		"Steel blue": [
		"#231A24",
		5011
	],
		"Light blue": [
		"#3B83BD",
		5012
	],
		"Cobalt blue": [
		"#1E213D",
		5013
	],
		"Pigeon blue": [
		"#606E8C",
		5014
	],
		"Sky blue": [
		"#2271B3",
		5015
	],
		"Traffic blue": [
		"#063971",
		5017
	],
		"Turquoise blue": [
		"#3F888F",
		5018
	],
		"Capri blue": [
		"#1B5583",
		5019
	],
		"Ocean blue": [
		"#1D334A",
		5020
	],
		"Water blue": [
		"#256D7B",
		5021
	],
		"Night blue": [
		"#252850",
		5022
	],
		"Distant blue": [
		"#49678D",
		5023
	],
		"Pastel blue": [
		"#5D9B9B",
		5024
	],
		"Pearl gentian blue": [
		"#2A6478",
		5025
	],
		"Pearl night blue": [
		"#102C54",
		5026
	],
		"Patina green": [
		"#316650",
		6000
	],
		"Emerald green": [
		"#287233",
		6001
	],
		"Leaf green": [
		"#2D572C",
		6002
	],
		"Olive green": [
		"#424632",
		6003
	],
		"Blue green": [
		"#1F3A3D",
		6004
	],
		"Moss green": [
		"#2F4538",
		6005
	],
		"Grey olive": [
		"#3E3B32",
		6006
	],
		"Bottle green": [
		"#343B29",
		6007
	],
		"Brown green": [
		"#39352A",
		6008
	],
		"Fir green": [
		"#31372B",
		6009
	],
		"Grass green": [
		"#35682D",
		6010
	],
		"Reseda green": [
		"#587246",
		6011
	],
		"Black green": [
		"#343E40",
		6012
	],
		"Reed green": [
		"#6C7156",
		6013
	],
		"Yellow olive": [
		"#47402E",
		6014
	],
		"Black olive": [
		"#3B3C36",
		6015
	],
		"Turquoise green": [
		"#1E5945",
		6016
	],
		"May green": [
		"#4C9141",
		6017
	],
		"Yellow green": [
		"#57A639",
		6018
	],
		"Pastel green": [
		"#BDECB6",
		6019
	],
		"Chrome green": [
		"#2E3A23",
		6020
	],
		"Pale green": [
		"#89AC76",
		6021
	],
		"Olive drab": [
		"#25221B",
		6022
	],
		"Traffic green": [
		"#308446",
		6024
	],
		"Fern green": [
		"#3D642D",
		6025
	],
		"Opal green": [
		"#015D52",
		6026
	],
		"Light green": [
		"#84C3BE",
		6027
	],
		"Pine green": [
		"#2C5545",
		6028
	],
		"Mint green": [
		"#20603D",
		6029
	],
		"Signal green": [
		"#317F43",
		6032
	],
		"Mint turquoise": [
		"#497E76",
		6033
	],
		"Pastel turquoise": [
		"#7FB5B5",
		6034
	],
		"Pearl green": [
		"#1C542D",
		6035
	],
		"Pearl opal green": [
		"#193737",
		6036
	],
		"Pure green": [
		"#008F39",
		6037
	],
		"Luminous green": [
		"#00BB2D",
		6038
	],
		"Squirrel grey": [
		"#78858B",
		7000
	],
		"Silver grey": [
		"#8A9597",
		7001
	],
		"Olive grey": [
		"#7E7B52",
		7002
	],
		"Moss grey": [
		"#6C7059",
		7003
	],
		"Signal grey": [
		"#969992",
		7004
	],
		"Mouse grey": [
		"#646B63",
		7005
	],
		"Beige grey": [
		"#6D6552",
		7006
	],
		"Khaki grey": [
		"#6A5F31",
		7008
	],
		"Green grey": [
		"#4D5645",
		7009
	],
		"Tarpaulin grey": [
		"#4C514A",
		7010
	],
		"Iron grey": [
		"#434B4D",
		7011
	],
		"Basalt grey": [
		"#4E5754",
		7012
	],
		"Brown grey": [
		"#464531",
		7013
	],
		"Slate grey": [
		"#434750",
		7015
	],
		"Anthracite grey": [
		"#293133",
		7016
	],
		"Black grey": [
		"#23282B",
		7021
	],
		"Umbra grey": [
		"#332F2C",
		7022
	],
		"Concrete grey": [
		"#686C5E",
		7023
	],
		"Graphite grey": [
		"#474A51",
		7024
	],
		"Granite grey": [
		"#2F353B",
		7026
	],
		"Stone grey": [
		"#8B8C7A",
		7030
	],
		"Blue grey": [
		"#474B4E",
		7031
	],
		"Pebble grey": [
		"#B8B799",
		7032
	],
		"Cement grey": [
		"#7D8471",
		7033
	],
		"Yellow grey": [
		"#8F8B66",
		7034
	],
		"Light grey": [
		"#D7D7D7",
		7035
	],
		"Platinum grey": [
		"#7F7679",
		7036
	],
		"Dusty grey": [
		"#7D7F7D",
		7037
	],
		"Agate grey": [
		"#B5B8B1",
		7038
	],
		"Quartz grey": [
		"#6C6960",
		7039
	],
		"Window grey": [
		"#9DA1AA",
		7040
	],
		"Traffic grey A": [
		"#8D948D",
		7042
	],
		"Traffic grey B": [
		"#4E5452",
		7043
	],
		"Silk grey": [
		"#CAC4B0",
		7044
	],
		"Telegrey 1": [
		"#909090",
		7045
	],
		"Telegrey 2": [
		"#82898F",
		7046
	],
		"Telegrey 4": [
		"#D0D0D0",
		7047
	],
		"Pearl mouse grey": [
		"#898176",
		7048
	],
		"Green brown": [
		"#826C34",
		8000
	],
		"Ochre brown": [
		"#955F20",
		8001
	],
		"Signal brown": [
		"#6C3B2A",
		8002
	],
		"Clay brown": [
		"#734222",
		8003
	],
		"Copper brown": [
		"#8E402A",
		8004
	],
		"Fawn brown": [
		"#59351F",
		8007
	],
		"Olive brown": [
		"#6F4F28",
		8008
	],
		"Nut brown": [
		"#5B3A29",
		8011
	],
		"Red brown": [
		"#592321",
		8012
	],
		"Sepia brown": [
		"#382C1E",
		8014
	],
		"Chestnut brown": [
		"#633A34",
		8015
	],
		"Mahogany brown": [
		"#4C2F27",
		8016
	],
		braun: braun,
		"Grey brown": [
		"#403A3A",
		8019
	],
		"Black brown": [
		"#212121",
		8022
	],
		"Orange brown": [
		"#A65E2E",
		8023
	],
		"Beige brown": [
		"#79553D",
		8024
	],
		"Pale brown": [
		"#755C48",
		8025
	],
		"Terra brown": [
		"#4E3B31",
		8028
	],
		"Pearl copper": [
		"#763C28",
		8029
	],
		Cream: Cream,
		"Grey white": [
		"#E7EBDA",
		9002
	],
		"Signal white": [
		"#F4F4F4",
		9003
	],
		"Signal black": [
		"#282828",
		9004
	],
		"Jet black": [
		"#0A0A0A",
		9005
	],
		"White aluminium": [
		"#A5A5A5",
		9006
	],
		"Grey aluminium": [
		"#8F8F8F",
		9007
	],
		"Pure white": [
		"#FFFFFF",
		9010
	],
		"Graphite black": [
		"#1C1C1C",
		9011
	],
		"Traffic white": [
		"#F6F6F6",
		9016
	],
		schwarz: schwarz,
		"Papyrus white": [
		"#D7D7D7",
		9018
	],
		"Pearl light grey": [
		"#9C9C9C",
		9022
	],
		"Pearl dark grey": [
		"#828282",
		9023
	]
	};

	const MediumYellowC = "#fbd800";
	const BrightOrangeC = "#ff5d00";
	const BrightRedC = "#f33633";
	const StrongRedC = "#cc0066";
	const PinkC = "#cf2197";
	const MediumPurpleC = "#4c008f";
	const DarkBlueC = "#002297";
	const MediumBlueC = "#0088ce";
	const BrightGreenC = "#00ad83";
	const NeutralBlackC = "#19191a";
	var GOE_COATED = {
		MediumYellowC: MediumYellowC,
		BrightOrangeC: BrightOrangeC,
		BrightRedC: BrightRedC,
		StrongRedC: StrongRedC,
		PinkC: PinkC,
		MediumPurpleC: MediumPurpleC,
		DarkBlueC: DarkBlueC,
		MediumBlueC: MediumBlueC,
		BrightGreenC: BrightGreenC,
		NeutralBlackC: NeutralBlackC,
		"1-1-1C": "#edeed3",
		"1-1-2C": "#eeeeb9",
		"1-1-3C": "#f0ec93",
		"1-1-4C": "#f2ea6f",
		"1-1-5C": "#f4e737",
		"1-1-6C": "#f7e200",
		"1-1-7C": "#fbd800",
		"1-2-1C": "#e9e8c2",
		"1-2-2C": "#e9e6a0",
		"1-2-3C": "#e5df82",
		"1-2-4C": "#dfd459",
		"1-2-5C": "#d4c421",
		"1-2-6C": "#c9b600",
		"1-2-7C": "#b7a000",
		"1-3-1C": "#e5e2b6",
		"1-3-2C": "#dad489",
		"1-3-3C": "#cac05b",
		"1-3-4C": "#bbae36",
		"1-3-5C": "#ae9f19",
		"1-3-6C": "#9e8c00",
		"1-3-7C": "#8c7900",
		"1-4-1C": "#e5e5d3",
		"1-4-2C": "#d5d1a7",
		"1-4-3C": "#beb779",
		"1-4-4C": "#a49a4f",
		"1-4-5C": "#908534",
		"1-4-6C": "#7a6d1f",
		"1-4-7C": "#5c5017",
		"1-5-1C": "#cfb100",
		"1-5-2C": "#b59b00",
		"1-5-3C": "#9d8600",
		"1-5-4C": "#8b7600",
		"1-5-5C": "#78660e",
		"1-5-6C": "#635517",
		"1-5-7C": "#49401c",
		"2-1-1C": "#efeaa7",
		"2-1-2C": "#f1e784",
		"2-1-3C": "#f4e35f",
		"2-1-4C": "#f7df33",
		"2-1-5C": "#fad900",
		"2-1-6C": "#fece00",
		"2-1-7C": "#ffbe00",
		"3-1-1C": "#eeeac5",
		"3-1-2C": "#f1e89f",
		"3-1-3C": "#f4e47a",
		"3-1-4C": "#f9da44",
		"3-1-5C": "#fecf00",
		"3-1-6C": "#ffc100",
		"3-1-7C": "#fead00",
		"4-1-1C": "#f4e38f",
		"4-1-2C": "#f8dc69",
		"4-1-3C": "#fbd64b",
		"4-1-4C": "#ffcb00",
		"4-1-5C": "#ffbc00",
		"4-1-6C": "#ffb200",
		"4-1-7C": "#ffa100",
		"5-1-1C": "#f2e5aa",
		"5-1-2C": "#f7dc82",
		"5-1-3C": "#fbd35b",
		"5-1-4C": "#ffc82a",
		"5-1-5C": "#ffbd00",
		"5-1-6C": "#ffab00",
		"5-1-7C": "#ff9700",
		"6-1-1C": "#eec956",
		"6-1-2C": "#eebf3e",
		"6-1-3C": "#edb220",
		"6-1-4C": "#eca400",
		"6-1-5C": "#eb9700",
		"6-1-6C": "#e98a00",
		"6-1-7C": "#e77d00",
		"7-1-1C": "#f5e1a6",
		"7-1-2C": "#f9d888",
		"7-1-3C": "#fdce61",
		"7-1-4C": "#ffbd31",
		"7-1-5C": "#ffad00",
		"7-1-6C": "#ff9a00",
		"7-1-7C": "#ff8600",
		"7-2-1C": "#edd89d",
		"7-2-2C": "#ecca78",
		"7-2-3C": "#e8bc5a",
		"7-2-4C": "#e1a92d",
		"7-2-5C": "#d69500",
		"7-2-6C": "#cc8800",
		"7-2-7C": "#bd7300",
		"7-3-1C": "#e6d6a9",
		"7-3-2C": "#ddc17b",
		"7-3-3C": "#cda850",
		"7-3-4C": "#be932d",
		"7-3-5C": "#b38419",
		"7-3-6C": "#a17000",
		"7-3-7C": "#8d5c00",
		"8-1-1C": "#eddb93",
		"8-1-2C": "#edce75",
		"8-1-3C": "#edba44",
		"8-1-4C": "#ecad27",
		"8-1-5C": "#ea9900",
		"8-1-6C": "#e98800",
		"8-1-7C": "#e67300",
		"8-2-1C": "#c07000",
		"8-2-2C": "#a96907",
		"8-2-3C": "#945e0f",
		"8-2-4C": "#815614",
		"8-2-5C": "#704e19",
		"8-2-6C": "#5b431c",
		"8-2-7C": "#45351d",
		"9-1-1C": "#ecd595",
		"9-1-2C": "#ebbe65",
		"9-1-3C": "#ebb24f",
		"9-1-4C": "#e99a27",
		"9-1-5C": "#e78603",
		"9-1-6C": "#e57900",
		"9-1-7C": "#e26400",
		"10-1-1C": "#f3b06e",
		"10-1-2C": "#ed9d4a",
		"10-1-3C": "#e38b26",
		"10-1-4C": "#db7f06",
		"10-1-5C": "#d17700",
		"10-1-6C": "#c26800",
		"10-1-7C": "#b15b00",
		"11-1-1C": "#e59c55",
		"11-1-2C": "#df9041",
		"11-1-3C": "#d7842e",
		"11-1-4C": "#cc7616",
		"11-1-5C": "#c26b04",
		"11-1-6C": "#ba6300",
		"11-1-7C": "#a95600",
		"11-2-1C": "#9d5108",
		"11-2-2C": "#924d0c",
		"11-2-3C": "#7d4312",
		"11-2-4C": "#723f14",
		"11-2-5C": "#653a18",
		"11-2-6C": "#573419",
		"11-2-7C": "#452b19",
		"12-1-1C": "#f6dcaf",
		"12-1-2C": "#fbd293",
		"12-1-3C": "#ffc36e",
		"12-1-4C": "#ffb246",
		"12-1-5C": "#ffa110",
		"12-1-6C": "#ff8a00",
		"12-1-7C": "#ff7200",
		"13-1-1C": "#f5dec7",
		"13-1-2C": "#fccca1",
		"13-1-3C": "#ffb87b",
		"13-1-4C": "#ffa351",
		"13-1-5C": "#ff9127",
		"13-1-6C": "#ff7c00",
		"13-1-7C": "#ff5d00",
		"13-2-1C": "#f4d7bc",
		"13-2-2C": "#f9cba3",
		"13-2-3C": "#f6b884",
		"13-2-4C": "#f3a05b",
		"13-2-5C": "#e88731",
		"13-2-6C": "#d96f00",
		"13-2-7C": "#c05700",
		"13-3-1C": "#eabb92",
		"13-3-2C": "#e0a675",
		"13-3-3C": "#d28f54",
		"13-3-4C": "#c47a37",
		"13-3-5C": "#b46820",
		"13-3-6C": "#a5580e",
		"13-3-7C": "#8c4406",
		"13-4-1C": "#e6d2bd",
		"13-4-2C": "#d3b395",
		"13-4-3C": "#c39973",
		"13-4-4C": "#ad7c4f",
		"13-4-5C": "#976434",
		"13-4-6C": "#875323",
		"13-4-7C": "#633715",
		"13-5-1C": "#d85800",
		"13-5-2C": "#b74d00",
		"13-5-3C": "#9f4600",
		"13-5-4C": "#8b4009",
		"13-5-5C": "#793c12",
		"13-5-6C": "#633314",
		"13-5-7C": "#492a17",
		"14-1-1C": "#fbcbae",
		"14-1-2C": "#ffbc97",
		"14-1-3C": "#ffaa7c",
		"14-1-4C": "#ff9559",
		"14-1-5C": "#ff843e",
		"14-1-6C": "#ff6b00",
		"14-1-7C": "#fc5100",
		"15-1-1C": "#f8cec4",
		"15-1-2C": "#febbaa",
		"15-1-3C": "#ffa185",
		"15-1-4C": "#ff8864",
		"15-1-5C": "#ff6f3e",
		"15-1-6C": "#ff580f",
		"15-1-7C": "#f84400",
		"16-1-1C": "#ffa494",
		"16-1-2C": "#ff8774",
		"16-1-3C": "#ff755c",
		"16-1-4C": "#ff6445",
		"16-1-5C": "#fe572f",
		"16-1-6C": "#fb4a11",
		"16-1-7C": "#f53d00",
		"16-2-1C": "#f19386",
		"16-2-2C": "#ef8477",
		"16-2-3C": "#ea7967",
		"16-2-4C": "#df644e",
		"16-2-5C": "#d7573c",
		"16-2-6C": "#cc4b2c",
		"16-2-7C": "#bc3e19",
		"16-3-1C": "#e49d96",
		"16-3-2C": "#d7877d",
		"16-3-3C": "#c86e62",
		"16-3-4C": "#bd5f50",
		"16-3-5C": "#b0503e",
		"16-3-6C": "#a1432e",
		"16-3-7C": "#8b351e",
		"16-4-1C": "#c29389",
		"16-4-2C": "#b47b71",
		"16-4-3C": "#a86b61",
		"16-4-4C": "#955449",
		"16-4-5C": "#824336",
		"16-4-6C": "#76382c",
		"16-4-7C": "#56271c",
		"16-5-1C": "#d54115",
		"16-5-2C": "#b83a15",
		"16-5-3C": "#9e3417",
		"16-5-4C": "#89321b",
		"16-5-5C": "#79301e",
		"16-5-6C": "#5f291c",
		"16-5-7C": "#47231c",
		"17-1-1C": "#ecd0ac",
		"17-1-2C": "#eabe8d",
		"17-1-3C": "#e7a468",
		"17-1-4C": "#e48c48",
		"17-1-5C": "#e27830",
		"17-1-6C": "#df5d18",
		"17-1-7C": "#d9430e",
		"18-1-1C": "#f9884f",
		"18-1-2C": "#f8783a",
		"18-1-3C": "#f66e2b",
		"18-1-4C": "#f45c10",
		"18-1-5C": "#f04d00",
		"18-1-6C": "#ed4300",
		"18-1-7C": "#e62f00",
		"19-1-1C": "#f7b196",
		"19-1-2C": "#f79d7f",
		"19-1-3C": "#f58460",
		"19-1-4C": "#f16b44",
		"19-1-5C": "#ee5328",
		"19-1-6C": "#e7390c",
		"19-1-7C": "#df1c01",
		"20-1-1C": "#f3aa9a",
		"20-1-2C": "#f28e7c",
		"20-1-3C": "#ef725f",
		"20-1-4C": "#eb5946",
		"20-1-5C": "#e74431",
		"20-1-6C": "#e02619",
		"20-1-7C": "#d8000a",
		"21-1-1C": "#ed8380",
		"21-1-2C": "#eb706e",
		"21-1-3C": "#e85c5c",
		"21-1-4C": "#e44546",
		"21-1-5C": "#e03034",
		"21-1-6C": "#dc1c26",
		"21-1-7C": "#d50019",
		"21-2-1C": "#db817d",
		"21-2-2C": "#d6716e",
		"21-2-3C": "#ce5d5a",
		"21-2-4C": "#c44c4a",
		"21-2-5C": "#bc3d3b",
		"21-2-6C": "#b22f2e",
		"21-2-7C": "#a41e20",
		"21-3-1C": "#c6807c",
		"21-3-2C": "#b86863",
		"21-3-3C": "#b05d59",
		"21-3-4C": "#a24945",
		"21-3-5C": "#953a37",
		"21-3-6C": "#8d322f",
		"21-3-7C": "#78201f",
		"21-4-1C": "#ac7b76",
		"21-4-2C": "#9c6560",
		"21-4-3C": "#8f5550",
		"21-4-4C": "#844944",
		"21-4-5C": "#7b3f3a",
		"21-4-6C": "#682e2a",
		"21-4-7C": "#501f1d",
		"22-1-1C": "#f9cccf",
		"22-1-2C": "#ffafb6",
		"22-1-3C": "#ff999f",
		"22-1-4C": "#ff797d",
		"22-1-5C": "#ff6361",
		"22-1-6C": "#fd4f3f",
		"22-1-7C": "#f74024",
		"23-1-1C": "#f4d9df",
		"23-1-2C": "#fcbccc",
		"23-1-3C": "#ffa4ba",
		"23-1-4C": "#ff7892",
		"23-1-5C": "#ff576d",
		"23-1-6C": "#fb4552",
		"23-1-7C": "#f33633",
		"23-2-1C": "#f0d8dd",
		"23-2-2C": "#f7aebf",
		"23-2-3C": "#f38fa6",
		"23-2-4C": "#ea6f88",
		"23-2-5C": "#df5870",
		"23-2-6C": "#ce4151",
		"23-2-7C": "#ba3337",
		"23-3-1C": "#e8aebc",
		"23-3-2C": "#dc97a7",
		"23-3-3C": "#d37c91",
		"23-3-4C": "#c25f75",
		"23-3-5C": "#b54c5f",
		"23-3-6C": "#a43c4a",
		"23-3-7C": "#8c2d33",
		"23-4-1C": "#e1c3c7",
		"23-4-2C": "#d0a3ac",
		"23-4-3C": "#bb7987",
		"23-4-4C": "#a55e6c",
		"23-4-5C": "#934a57",
		"23-4-6C": "#79323c",
		"23-4-7C": "#592226",
		"23-5-1C": "#d43837",
		"23-5-2C": "#b93230",
		"23-5-3C": "#a73131",
		"23-5-4C": "#8c2b2b",
		"23-5-5C": "#742626",
		"23-5-6C": "#612525",
		"23-5-7C": "#472020",
		"24-1-1C": "#f8b9ce",
		"24-1-2C": "#fba1bd",
		"24-1-3C": "#fc82a5",
		"24-1-4C": "#f95f87",
		"24-1-5C": "#f44068",
		"24-1-6C": "#ed274b",
		"24-1-7C": "#e61a36",
		"25-1-1C": "#f990b1",
		"25-1-2C": "#f8789f",
		"25-1-3C": "#f6608c",
		"25-1-4C": "#f24574",
		"25-1-5C": "#ed2c5d",
		"25-1-6C": "#e81748",
		"25-1-7C": "#e10034",
		"26-1-1C": "#f4bad1",
		"26-1-2C": "#f59fc1",
		"26-1-3C": "#f57da8",
		"26-1-4C": "#f1598e",
		"26-1-5C": "#ec3774",
		"26-1-6C": "#e51158",
		"26-1-7C": "#de0043",
		"26-2-1C": "#efaac4",
		"26-2-2C": "#e98bae",
		"26-2-3C": "#e2719b",
		"26-2-4C": "#d65181",
		"26-2-5C": "#c73669",
		"26-2-6C": "#be285a",
		"26-2-7C": "#ac1441",
		"26-3-1C": "#c40e43",
		"26-3-2C": "#a91039",
		"26-3-3C": "#911231",
		"26-3-4C": "#801830",
		"26-3-5C": "#711c2f",
		"26-3-6C": "#5b1b29",
		"26-3-7C": "#461b22",
		"27-1-1C": "#f08fbb",
		"27-1-2C": "#ee78ac",
		"27-1-3C": "#ec5f9b",
		"27-1-4C": "#e84388",
		"27-1-5C": "#e32373",
		"27-1-6C": "#de0061",
		"27-1-7C": "#d8004e",
		"28-1-1C": "#e44b95",
		"28-1-2C": "#e02e84",
		"28-1-3C": "#de1e7b",
		"28-1-4C": "#da0069",
		"28-1-5C": "#d6005a",
		"28-1-6C": "#d30055",
		"28-1-7C": "#ce0045",
		"29-1-1C": "#efe0e7",
		"29-1-2C": "#f2c7dd",
		"29-1-3C": "#f4a7cc",
		"29-1-4C": "#f286b7",
		"29-1-5C": "#ed609e",
		"29-1-6C": "#e53b82",
		"29-1-7C": "#da1c68",
		"29-2-1C": "#edd2de",
		"29-2-2C": "#ebb4cd",
		"29-2-3C": "#e69abd",
		"29-2-4C": "#da78a5",
		"29-2-5C": "#cc598c",
		"29-2-6C": "#c0457b",
		"29-2-7C": "#ac2960",
		"29-3-1C": "#e6c6d4",
		"29-3-2C": "#d8a4ba",
		"29-3-3C": "#c984a2",
		"29-3-4C": "#b96b8d",
		"29-3-5C": "#ad587d",
		"29-3-6C": "#983f65",
		"29-3-7C": "#7e294a",
		"30-1-1C": "#f0b3d7",
		"30-1-2C": "#ef9dcc",
		"30-1-3C": "#ec81bc",
		"30-1-4C": "#e867ac",
		"30-1-5C": "#e34c9c",
		"30-1-6C": "#dc2f8a",
		"30-1-7C": "#d20c74",
		"31-1-1C": "#ef88bd",
		"31-1-2C": "#ed77b2",
		"31-1-3C": "#e961a4",
		"31-1-4C": "#e64e98",
		"31-1-5C": "#e13a8b",
		"31-1-6C": "#dc287e",
		"31-1-7C": "#d51570",
		"32-1-1C": "#ead6e4",
		"32-1-2C": "#e7b9db",
		"32-1-3C": "#e598cc",
		"32-1-4C": "#e071b6",
		"32-1-5C": "#db469e",
		"32-1-6C": "#d41383",
		"32-1-7C": "#cc0066",
		"32-2-1C": "#e6c7dd",
		"32-2-2C": "#ddaacd",
		"32-2-3C": "#d486b9",
		"32-2-4C": "#cc66a6",
		"32-2-5C": "#bf4690",
		"32-2-6C": "#b12578",
		"32-2-7C": "#9e005b",
		"32-3-1C": "#ddb9d2",
		"32-3-2C": "#ce96bb",
		"32-3-3C": "#bf79a6",
		"32-3-4C": "#ac598d",
		"32-3-5C": "#9b3d76",
		"32-3-6C": "#8d2964",
		"32-3-7C": "#731045",
		"32-4-1C": "#dac4d1",
		"32-4-2C": "#c19cb2",
		"32-4-3C": "#a97996",
		"32-4-4C": "#955e7f",
		"32-4-5C": "#894d71",
		"32-4-6C": "#6d2d50",
		"32-4-7C": "#4c1830",
		"32-5-1C": "#b50063",
		"32-5-2C": "#a3005d",
		"32-5-3C": "#900854",
		"32-5-4C": "#7d0f4a",
		"32-5-5C": "#6b1440",
		"32-5-6C": "#5a1837",
		"32-5-7C": "#44162a",
		"33-1-1C": "#dd7ba9",
		"33-1-2C": "#d46598",
		"33-1-3C": "#c74d84",
		"33-1-4C": "#bb3c73",
		"33-1-5C": "#b03065",
		"33-1-6C": "#a42656",
		"33-1-7C": "#971f48",
		"34-1-1C": "#d895b7",
		"34-1-2C": "#c6729c",
		"34-1-3C": "#b25582",
		"34-1-4C": "#a34370",
		"34-1-5C": "#983964",
		"34-1-6C": "#842c52",
		"34-1-7C": "#732843",
		"34-2-1C": "#732b45",
		"34-2-2C": "#6a293f",
		"34-2-3C": "#62283b",
		"34-2-4C": "#572634",
		"34-2-5C": "#4e2430",
		"34-2-6C": "#46232c",
		"34-2-7C": "#391f25",
		"35-1-1C": "#ca9dbc",
		"35-1-2C": "#b27ca4",
		"35-1-3C": "#a36793",
		"35-1-4C": "#8d4e7c",
		"35-1-5C": "#7d3d6c",
		"35-1-6C": "#703460",
		"35-1-7C": "#5b294c",
		"36-1-1C": "#b593a7",
		"36-1-2C": "#a67d94",
		"36-1-3C": "#94667f",
		"36-1-4C": "#86556f",
		"36-1-5C": "#79455f",
		"36-1-6C": "#6b364e",
		"36-1-7C": "#58273c",
		"37-1-1C": "#ecdfe9",
		"37-1-2C": "#ecc3e3",
		"37-1-3C": "#eba4d9",
		"37-1-4C": "#e684cb",
		"37-1-5C": "#e165bc",
		"37-1-6C": "#d940a8",
		"37-1-7C": "#cf2197",
		"37-2-1C": "#cf83b8",
		"37-2-2C": "#ca7bb2",
		"37-2-3C": "#c56dab",
		"37-2-4C": "#be60a1",
		"37-2-5C": "#b55898",
		"37-2-6C": "#b04c91",
		"37-2-7C": "#a63c84",
		"37-3-1C": "#b880a4",
		"37-3-2C": "#b0749b",
		"37-3-3C": "#a5648e",
		"37-3-4C": "#9d5985",
		"37-3-5C": "#954f7c",
		"37-3-6C": "#86446d",
		"37-3-7C": "#77325d",
		"37-4-1C": "#977084",
		"37-4-2C": "#895f75",
		"37-4-3C": "#83596e",
		"37-4-4C": "#754960",
		"37-4-5C": "#683c52",
		"37-4-6C": "#62374d",
		"37-4-7C": "#492836",
		"37-5-1C": "#bb3591",
		"37-5-2C": "#a2307d",
		"37-5-3C": "#8e2e6d",
		"37-5-4C": "#762f5b",
		"37-5-5C": "#6d2f53",
		"37-5-6C": "#582b43",
		"37-5-7C": "#422432",
		"38-1-1C": "#d06db7",
		"38-1-2C": "#c853a8",
		"38-1-3C": "#c2439e",
		"38-1-4C": "#b8298e",
		"38-1-5C": "#af0d7f",
		"38-1-6C": "#a90075",
		"38-1-7C": "#9b0061",
		"39-1-1C": "#da9ed2",
		"39-1-2C": "#d285c6",
		"39-1-3C": "#c568b7",
		"39-1-4C": "#ba4ba5",
		"39-1-5C": "#af3295",
		"39-1-6C": "#a21684",
		"39-1-7C": "#91006e",
		"39-2-1C": "#830062",
		"39-2-2C": "#740355",
		"39-2-3C": "#650b4a",
		"39-2-4C": "#5c1043",
		"39-2-5C": "#55163f",
		"39-2-6C": "#461634",
		"39-2-7C": "#371428",
		"40-1-1C": "#be6fb7",
		"40-1-2C": "#b65ead",
		"40-1-3C": "#ad4da1",
		"40-1-4C": "#a23994",
		"40-1-5C": "#992a88",
		"40-1-6C": "#8e1a7b",
		"40-1-7C": "#7f0869",
		"41-1-1C": "#ae52ae",
		"41-1-2C": "#a847a7",
		"41-1-3C": "#a13aa0",
		"41-1-4C": "#982b95",
		"41-1-5C": "#8f1b8b",
		"41-1-6C": "#870d82",
		"41-1-7C": "#7a0073",
		"41-2-1C": "#72086a",
		"41-2-2C": "#680e60",
		"41-2-3C": "#5b0f51",
		"41-2-4C": "#511246",
		"41-2-5C": "#49153e",
		"41-2-6C": "#3e1534",
		"41-2-7C": "#311428",
		"42-1-1C": "#da93d4",
		"42-1-2C": "#cf79c9",
		"42-1-3C": "#c768c1",
		"42-1-4C": "#bb4fb4",
		"42-1-5C": "#b03ba8",
		"42-1-6C": "#aa30a2",
		"42-1-7C": "#9a1590",
		"42-2-1C": "#be89b6",
		"42-2-2C": "#bc77b4",
		"42-2-3C": "#b164a8",
		"42-2-4C": "#a8589e",
		"42-2-5C": "#a34f98",
		"42-2-6C": "#97408c",
		"42-2-7C": "#892f7d",
		"42-3-1C": "#a6849a",
		"42-3-2C": "#9c778f",
		"42-3-3C": "#906982",
		"42-3-4C": "#825974",
		"42-3-5C": "#744a65",
		"42-3-6C": "#643b55",
		"42-3-7C": "#4c2840",
		"42-4-1C": "#962d8c",
		"42-4-2C": "#8a307f",
		"42-4-3C": "#742868",
		"42-4-4C": "#662759",
		"42-4-5C": "#5a264c",
		"42-4-6C": "#4b243e",
		"42-4-7C": "#3b2030",
		"43-1-1C": "#e6c8e6",
		"43-1-2C": "#ddafe0",
		"43-1-3C": "#cf8ed4",
		"43-1-4C": "#c170c7",
		"43-1-5C": "#b153b9",
		"43-1-6C": "#a138a9",
		"43-1-7C": "#8e1e98",
		"44-1-1C": "#d9b2e1",
		"44-1-2C": "#ca92d7",
		"44-1-3C": "#bc79cd",
		"44-1-4C": "#ab5cbf",
		"44-1-5C": "#993fb1",
		"44-1-6C": "#9033a9",
		"44-1-7C": "#7c1797",
		"44-2-1C": "#cfa8d4",
		"44-2-2C": "#bc8ac3",
		"44-2-3C": "#ac71b5",
		"44-2-4C": "#9f5fa9",
		"44-2-5C": "#94509f",
		"44-2-6C": "#853d8f",
		"44-2-7C": "#70277c",
		"45-1-1C": "#dfb5dc",
		"45-1-2C": "#d29cd1",
		"45-1-3C": "#c585c5",
		"45-1-4C": "#b56ab4",
		"45-1-5C": "#a752a5",
		"45-1-6C": "#9b4a9d",
		"45-1-7C": "#8b368d",
		"45-2-1C": "#d3aece",
		"45-2-2C": "#c496bf",
		"45-2-3C": "#b47eaf",
		"45-2-4C": "#a86ca1",
		"45-2-5C": "#9d5d96",
		"45-2-6C": "#8b5388",
		"45-2-7C": "#793e75",
		"45-3-1C": "#b8a2af",
		"45-3-2C": "#a88f9d",
		"45-3-3C": "#997c8d",
		"45-3-4C": "#866879",
		"45-3-5C": "#755568",
		"45-3-6C": "#624355",
		"45-3-7C": "#472d3b",
		"46-1-1C": "#e1d4e5",
		"46-1-2C": "#d3bbdc",
		"46-1-3C": "#c0a1cf",
		"46-1-4C": "#ab84be",
		"46-1-5C": "#986eaf",
		"46-1-6C": "#8a5ea2",
		"46-1-7C": "#774b92",
		"47-1-1C": "#c5b0d5",
		"47-1-2C": "#b49cc9",
		"47-1-3C": "#a083ba",
		"47-1-4C": "#9071ad",
		"47-1-5C": "#8262a2",
		"47-1-6C": "#745496",
		"47-1-7C": "#644487",
		"48-1-1C": "#c8b1dd",
		"48-1-2C": "#b89ad5",
		"48-1-3C": "#a884cc",
		"48-1-4C": "#976ec1",
		"48-1-5C": "#895cb6",
		"48-1-6C": "#7b4dad",
		"48-1-7C": "#6a3a9e",
		"49-1-1C": "#a48eb7",
		"49-1-2C": "#8f75a5",
		"49-1-3C": "#83689b",
		"49-1-4C": "#70538a",
		"49-1-5C": "#60417b",
		"49-1-6C": "#593b74",
		"49-1-7C": "#4b2f64",
		"50-1-1C": "#d1b5e4",
		"50-1-2C": "#b98fda",
		"50-1-3C": "#a46fce",
		"50-1-4C": "#8d4dbf",
		"50-1-5C": "#7a31b1",
		"50-1-6C": "#6b1ba5",
		"50-1-7C": "#52008d",
		"51-1-1C": "#e1d5e9",
		"51-1-2C": "#c5a8e1",
		"51-1-3C": "#a87dd5",
		"51-1-4C": "#8f59c7",
		"51-1-5C": "#7d3ebb",
		"51-1-6C": "#6519a8",
		"51-1-7C": "#4c008f",
		"51-2-1C": "#d4c1e2",
		"51-2-2C": "#bea2d6",
		"51-2-3C": "#a580c5",
		"51-2-4C": "#8c60b4",
		"51-2-5C": "#7a49a4",
		"51-2-6C": "#663093",
		"51-2-7C": "#4b1478",
		"51-3-1C": "#cbb8d5",
		"51-3-2C": "#b297c4",
		"51-3-3C": "#9876ae",
		"51-3-4C": "#835d9c",
		"51-3-5C": "#6f468a",
		"51-3-6C": "#572d72",
		"51-3-7C": "#3a1753",
		"51-4-1C": "#cfc1d4",
		"51-4-2C": "#b09ab8",
		"51-4-3C": "#967ca2",
		"51-4-4C": "#7c5d88",
		"51-4-5C": "#644271",
		"51-4-6C": "#4f2e5c",
		"51-4-7C": "#2b1735",
		"51-5-1C": "#4a0682",
		"51-5-2C": "#410c6d",
		"51-5-3C": "#380f5b",
		"51-5-4C": "#361450",
		"51-5-5C": "#321646",
		"51-5-6C": "#2d183c",
		"51-5-7C": "#24152e",
		"52-1-1C": "#c5b2df",
		"52-1-2C": "#ae95d4",
		"52-1-3C": "#9a7dc8",
		"52-1-4C": "#8a6bbf",
		"52-1-5C": "#805eb8",
		"52-1-6C": "#6f4bac",
		"52-1-7C": "#5d379d",
		"52-2-1C": "#603f92",
		"52-2-2C": "#5c3f84",
		"52-2-3C": "#573e75",
		"52-2-4C": "#4b3561",
		"52-2-5C": "#443152",
		"52-2-6C": "#3e2e45",
		"52-2-7C": "#322634",
		"53-1-1C": "#d3cfe5",
		"53-1-2C": "#bab4df",
		"53-1-3C": "#a199d5",
		"53-1-4C": "#897fc9",
		"53-1-5C": "#766bbf",
		"53-1-6C": "#6458b4",
		"53-1-7C": "#4d3fa2",
		"53-2-1C": "#c9c3ca",
		"53-2-2C": "#ada7b2",
		"53-2-3C": "#928a98",
		"53-2-4C": "#7f7686",
		"53-2-5C": "#696071",
		"53-2-6C": "#53495b",
		"53-2-7C": "#342c3c",
		"53-3-1C": "#514596",
		"53-3-2C": "#473d7f",
		"53-3-3C": "#453a71",
		"53-3-4C": "#3d345f",
		"53-3-5C": "#372e4e",
		"53-3-6C": "#362e45",
		"53-3-7C": "#2c2533",
		"54-1-1C": "#b8a4e2",
		"54-1-2C": "#9d82d7",
		"54-1-3C": "#8b6ace",
		"54-1-4C": "#754ec2",
		"54-1-5C": "#6135b5",
		"54-1-6C": "#5525ac",
		"54-1-7C": "#3f0296",
		"55-1-1C": "#c3bbe5",
		"55-1-2C": "#a496dd",
		"55-1-3C": "#8c7ad4",
		"55-1-4C": "#715ac6",
		"55-1-5C": "#5c3fba",
		"55-1-6C": "#4d2daf",
		"55-1-7C": "#360c99",
		"55-2-1C": "#b8aed8",
		"55-2-2C": "#998bc7",
		"55-2-3C": "#8070b8",
		"55-2-4C": "#6e5bab",
		"55-2-5C": "#604ba1",
		"55-2-6C": "#4a338e",
		"55-2-7C": "#321b73",
		"55-3-1C": "#c1b8d4",
		"55-3-2C": "#a59ac1",
		"55-3-3C": "#8c7eae",
		"55-3-4C": "#76669c",
		"55-3-5C": "#61508b",
		"55-3-6C": "#4c3976",
		"55-3-7C": "#302157",
		"55-4-1C": "#452b97",
		"55-4-2C": "#422d87",
		"55-4-3C": "#392771",
		"55-4-4C": "#342561",
		"55-4-5C": "#332656",
		"55-4-6C": "#2d2247",
		"55-4-7C": "#251d37",
		"56-1-1C": "#c1b6d5",
		"56-1-2C": "#aaa1c8",
		"56-1-3C": "#978ebb",
		"56-1-4C": "#857aae",
		"56-1-5C": "#786ca3",
		"56-1-6C": "#665e95",
		"56-1-7C": "#534e87",
		"56-2-1C": "#5a5183",
		"56-2-2C": "#574e78",
		"56-2-3C": "#4f486a",
		"56-2-4C": "#46405a",
		"56-2-5C": "#423b4e",
		"56-2-6C": "#3d3643",
		"56-2-7C": "#2e2930",
		"57-1-1C": "#9c8bcb",
		"57-1-2C": "#8b76c0",
		"57-1-3C": "#775eb2",
		"57-1-4C": "#694da6",
		"57-1-5C": "#593a99",
		"57-1-6C": "#472587",
		"57-1-7C": "#34136e",
		"58-1-1C": "#a496c7",
		"58-1-2C": "#8674b3",
		"58-1-3C": "#7561a6",
		"58-1-4C": "#5e4794",
		"58-1-5C": "#482f80",
		"58-1-6C": "#3d2373",
		"58-1-7C": "#2f1b5a",
		"59-1-1C": "#c4c2e1",
		"59-1-2C": "#a19fd4",
		"59-1-3C": "#807dc3",
		"59-1-4C": "#6865b5",
		"59-1-5C": "#5956ac",
		"59-1-6C": "#3f3c99",
		"59-1-7C": "#25247f",
		"60-1-1C": "#8b85ca",
		"60-1-2C": "#7971c0",
		"60-1-3C": "#645bb3",
		"60-1-4C": "#564ba8",
		"60-1-5C": "#463a9b",
		"60-1-6C": "#38278b",
		"60-1-7C": "#281473",
		"61-1-1C": "#d5d6e3",
		"61-1-2C": "#bbbcd6",
		"61-1-3C": "#9d9fc4",
		"61-1-4C": "#8789b5",
		"61-1-5C": "#7477a7",
		"61-1-6C": "#626599",
		"61-1-7C": "#4d5287",
		"62-1-1C": "#adb4cd",
		"62-1-2C": "#8c95b8",
		"62-1-3C": "#727ca4",
		"62-1-4C": "#5f6b97",
		"62-1-5C": "#535f8d",
		"62-1-6C": "#414d7c",
		"62-1-7C": "#2c3866",
		"63-1-1C": "#8f99cf",
		"63-1-2C": "#757ec0",
		"63-1-3C": "#616cb4",
		"63-1-4C": "#545eab",
		"63-1-5C": "#4b54a4",
		"63-1-6C": "#3b4297",
		"63-1-7C": "#2d3186",
		"63-2-1C": "#88889b",
		"63-2-2C": "#7d7d91",
		"63-2-3C": "#717086",
		"63-2-4C": "#605f76",
		"63-2-5C": "#515068",
		"63-2-6C": "#424057",
		"63-2-7C": "#2c2a3e",
		"63-3-1C": "#333880",
		"63-3-2C": "#333774",
		"63-3-3C": "#2d3063",
		"63-3-4C": "#2c2d57",
		"63-3-5C": "#2a2a4b",
		"63-3-6C": "#27253f",
		"63-3-7C": "#201f2f",
		"64-1-1C": "#dbdfe9",
		"64-1-2C": "#b4b9e6",
		"64-1-3C": "#9298de",
		"64-1-4C": "#7278d3",
		"64-1-5C": "#595dc7",
		"64-1-6C": "#4144ba",
		"64-1-7C": "#2d29a8",
		"64-2-1C": "#c2c3d8",
		"64-2-2C": "#a4a6c7",
		"64-2-3C": "#8587b1",
		"64-2-4C": "#6e709f",
		"64-2-5C": "#5c5e91",
		"64-2-6C": "#45477d",
		"64-2-7C": "#2a2b5e",
		"64-3-1C": "#d8d7de",
		"64-3-2C": "#aeabc0",
		"64-3-3C": "#9090a9",
		"64-3-4C": "#6e6e8c",
		"64-3-5C": "#575677",
		"64-3-6C": "#403e60",
		"64-3-7C": "#21213a",
		"65-1-1C": "#cfd5ec",
		"65-1-2C": "#b3bbe8",
		"65-1-3C": "#919ce1",
		"65-1-4C": "#6975d4",
		"65-1-5C": "#4b59c7",
		"65-1-6C": "#3743ba",
		"65-1-7C": "#1e1ca0",
		"66-1-1C": "#a6b1e3",
		"66-1-2C": "#8492db",
		"66-1-3C": "#6676d1",
		"66-1-4C": "#5263c9",
		"66-1-5C": "#4252c1",
		"66-1-6C": "#2c3bb4",
		"66-1-7C": "#1f24a4",
		"67-1-1C": "#bbcae9",
		"67-1-2C": "#97afe5",
		"67-1-3C": "#7793de",
		"67-1-4C": "#5a7ad4",
		"67-1-5C": "#4468cc",
		"67-1-6C": "#2d54c2",
		"67-1-7C": "#1b3fb5",
		"68-1-1C": "#7392d7",
		"68-1-2C": "#587cce",
		"68-1-3C": "#426ac6",
		"68-1-4C": "#2856ba",
		"68-1-5C": "#1043ae",
		"68-1-6C": "#04309f",
		"68-1-7C": "#0e1f8c",
		"69-1-1C": "#e1e5ea",
		"69-1-2C": "#b8c7e6",
		"69-1-3C": "#96acde",
		"69-1-4C": "#7490d3",
		"69-1-5C": "#5a7ac8",
		"69-1-6C": "#4367bd",
		"69-1-7C": "#2d50ae",
		"70-1-1C": "#d1deea",
		"70-1-2C": "#97b8e6",
		"70-1-3C": "#6091dc",
		"70-1-4C": "#2f71cf",
		"70-1-5C": "#0055c1",
		"70-1-6C": "#0038af",
		"70-1-7C": "#002297",
		"70-2-1C": "#bbcee4",
		"70-2-2C": "#87a9d7",
		"70-2-3C": "#628dc9",
		"70-2-4C": "#366eb5",
		"70-2-5C": "#0d55a3",
		"70-2-6C": "#004193",
		"70-2-7C": "#002777",
		"70-3-1C": "#acc0d7",
		"70-3-2C": "#7d9bc0",
		"70-3-3C": "#587daa",
		"70-3-4C": "#3f699b",
		"70-3-5C": "#28568c",
		"70-3-6C": "#063c74",
		"70-3-7C": "#042353",
		"70-4-1C": "#ced7de",
		"70-4-2C": "#9dafc4",
		"70-4-3C": "#7990ab",
		"70-4-4C": "#5a7594",
		"70-4-5C": "#3c5b7d",
		"70-4-6C": "#224165",
		"70-4-7C": "#0f223e",
		"70-5-1C": "#002c8b",
		"70-5-2C": "#052d7c",
		"70-5-3C": "#0b2967",
		"70-5-4C": "#112858",
		"70-5-5C": "#14264c",
		"70-5-6C": "#162440",
		"70-5-7C": "#162136",
		"71-1-1C": "#c1cae0",
		"71-1-2C": "#94a7d0",
		"71-1-3C": "#7288bf",
		"71-1-4C": "#5873b1",
		"71-1-5C": "#4864a7",
		"71-1-6C": "#2b4c94",
		"71-1-7C": "#10367e",
		"72-1-1C": "#b1bad2",
		"72-1-2C": "#99a6c6",
		"72-1-3C": "#8494b9",
		"72-1-4C": "#6d81a9",
		"72-1-5C": "#5f759f",
		"72-1-6C": "#4b6b95",
		"72-1-7C": "#3e5886",
		"72-2-1C": "#bac1d1",
		"72-2-2C": "#a6afc4",
		"72-2-3C": "#909ab3",
		"72-2-4C": "#7f8ba6",
		"72-2-5C": "#717e9b",
		"72-2-6C": "#616f8e",
		"72-2-7C": "#4d5e7e",
		"72-3-1C": "#485f85",
		"72-3-2C": "#405273",
		"72-3-3C": "#40506c",
		"72-3-4C": "#3b465d",
		"72-3-5C": "#363d4f",
		"72-3-6C": "#353a45",
		"72-3-7C": "#2a2b31",
		"73-1-1C": "#c8d1dd",
		"73-1-2C": "#9cacc6",
		"73-1-3C": "#798eaf",
		"73-1-4C": "#637aa0",
		"73-1-5C": "#526c94",
		"73-1-6C": "#3a5681",
		"73-1-7C": "#24406a",
		"74-1-1C": "#83a7e1",
		"74-1-2C": "#608cd8",
		"74-1-3C": "#4c7dd3",
		"74-1-4C": "#2c67c9",
		"74-1-5C": "#0c55c1",
		"74-1-6C": "#004cbb",
		"74-1-7C": "#0037ad",
		"75-1-1C": "#b5cce8",
		"75-1-2C": "#8fb4e5",
		"75-1-3C": "#6c9bde",
		"75-1-4C": "#4781d5",
		"75-1-5C": "#296fcd",
		"75-1-6C": "#005bc3",
		"75-1-7C": "#0046b6",
		"76-1-1C": "#bad3ea",
		"76-1-2C": "#7eaee4",
		"76-1-3C": "#5291dc",
		"76-1-4C": "#0970ce",
		"76-1-5C": "#0055c0",
		"76-1-6C": "#0042b4",
		"76-1-7C": "#002ea1",
		"77-1-1C": "#9dc3e6",
		"77-1-2C": "#70a8e0",
		"77-1-3C": "#4e95db",
		"77-1-4C": "#107bd1",
		"77-1-5C": "#0068c8",
		"77-1-6C": "#005bc2",
		"77-1-7C": "#0048b5",
		"78-1-1C": "#3f8acc",
		"78-1-2C": "#0075c0",
		"78-1-3C": "#0065b6",
		"78-1-4C": "#0059ae",
		"78-1-5C": "#004fa6",
		"78-1-6C": "#004099",
		"78-1-7C": "#00348a",
		"79-1-1C": "#95a0b1",
		"79-1-2C": "#7b889c",
		"79-1-3C": "#616f86",
		"79-1-4C": "#4e5d76",
		"79-1-5C": "#3b4a64",
		"79-1-6C": "#2a374f",
		"79-1-7C": "#1f2839",
		"80-1-1C": "#96aec5",
		"80-1-2C": "#7796b3",
		"80-1-3C": "#6587a7",
		"80-1-4C": "#4b7396",
		"80-1-5C": "#356387",
		"80-1-6C": "#2a597e",
		"80-1-7C": "#11446a",
		"81-1-1C": "#5e90b0",
		"81-1-2C": "#4780a5",
		"81-1-3C": "#296e95",
		"81-1-4C": "#0b6089",
		"81-1-5C": "#00527b",
		"81-1-6C": "#00436a",
		"81-1-7C": "#003656",
		"82-1-1C": "#acbfd2",
		"82-1-2C": "#8ea8c2",
		"82-1-3C": "#7a98b6",
		"82-1-4C": "#6184a6",
		"82-1-5C": "#4c7499",
		"82-1-6C": "#436d93",
		"82-1-7C": "#2c5a82",
		"82-2-1C": "#a6b6c4",
		"82-2-2C": "#869aad",
		"82-2-3C": "#788ea2",
		"82-2-4C": "#688096",
		"82-2-5C": "#5e788f",
		"82-2-6C": "#4f6b84",
		"82-2-7C": "#3d5a74",
		"82-3-1C": "#a3afb7",
		"82-3-2C": "#8f9ca6",
		"82-3-3C": "#808e9a",
		"82-3-4C": "#6f7d8b",
		"82-3-5C": "#61717f",
		"82-3-6C": "#526271",
		"82-3-7C": "#3e4f5e",
		"82-4-1C": "#395c7d",
		"82-4-2C": "#3a5773",
		"82-4-3C": "#374f65",
		"82-4-4C": "#37495b",
		"82-4-5C": "#354350",
		"82-4-6C": "#313942",
		"82-4-7C": "#272b2f",
		"83-1-1C": "#96b8d6",
		"83-1-2C": "#6998c4",
		"83-1-3C": "#417eb0",
		"83-1-4C": "#236ca2",
		"83-1-5C": "#005b94",
		"83-1-6C": "#00447c",
		"83-1-7C": "#003566",
		"84-1-1C": "#bad8eb",
		"84-1-2C": "#93c4e9",
		"84-1-3C": "#6aaee4",
		"84-1-4C": "#3c98de",
		"84-1-5C": "#0689d8",
		"84-1-6C": "#007ad2",
		"84-1-7C": "#006ac8",
		"84-2-1C": "#b1d1e2",
		"84-2-2C": "#90bcd9",
		"84-2-3C": "#6aa3cb",
		"84-2-4C": "#4b91bf",
		"84-2-5C": "#2c81b3",
		"84-2-6C": "#006da4",
		"84-2-7C": "#005792",
		"84-3-1C": "#b6c6cd",
		"84-3-2C": "#8ca4af",
		"84-3-3C": "#74909e",
		"84-3-4C": "#577787",
		"84-3-5C": "#3d6173",
		"84-3-6C": "#2b4f61",
		"84-3-7C": "#133141",
		"85-1-1C": "#56a7e1",
		"85-1-2C": "#439fdf",
		"85-1-3C": "#1891da",
		"85-1-4C": "#0085d5",
		"85-1-5C": "#007bd0",
		"85-1-6C": "#006fcb",
		"85-1-7C": "#0066c5",
		"86-1-1C": "#7ac0e8",
		"86-1-2C": "#4faee3",
		"86-1-3C": "#0098dc",
		"86-1-4C": "#0087d5",
		"86-1-5C": "#0076cd",
		"86-1-6C": "#0065c3",
		"86-1-7C": "#0054b7",
		"86-2-1C": "#80afc4",
		"86-2-2C": "#5a95af",
		"86-2-3C": "#4487a4",
		"86-2-4C": "#207493",
		"86-2-5C": "#006183",
		"86-2-6C": "#005578",
		"86-2-7C": "#003c5e",
		"86-3-1C": "#82a3ae",
		"86-3-2C": "#618998",
		"86-3-3C": "#4b7787",
		"86-3-4C": "#38697a",
		"86-3-5C": "#275b6d",
		"86-3-6C": "#0f4557",
		"86-3-7C": "#072e3d",
		"86-4-1C": "#0054a3",
		"86-4-2C": "#004e8d",
		"86-4-3C": "#00497a",
		"86-4-4C": "#004066",
		"86-4-5C": "#003b58",
		"86-4-6C": "#00344a",
		"86-4-7C": "#102b39",
		"87-1-1C": "#89cbea",
		"87-1-2C": "#4cb4e5",
		"87-1-3C": "#00a2e0",
		"87-1-4C": "#008bd7",
		"87-1-5C": "#0078ce",
		"87-1-6C": "#0070ca",
		"87-1-7C": "#0060bf",
		"88-1-1C": "#73c5e7",
		"88-1-2C": "#47b7e4",
		"88-1-3C": "#00a6df",
		"88-1-4C": "#0095d9",
		"88-1-5C": "#0086d2",
		"88-1-6C": "#007acc",
		"88-1-7C": "#006bc2",
		"88-2-1C": "#88c4db",
		"88-2-2C": "#66b4d3",
		"88-2-3C": "#3aa2c6",
		"88-2-4C": "#0093bc",
		"88-2-5C": "#0086b2",
		"88-2-6C": "#0077a6",
		"88-2-7C": "#006496",
		"88-3-1C": "#006db0",
		"88-3-2C": "#005e94",
		"88-3-3C": "#005782",
		"88-3-4C": "#004a6b",
		"88-3-5C": "#003f57",
		"88-3-6C": "#003a4b",
		"88-3-7C": "#072d38",
		"89-1-1C": "#d5e5e8",
		"89-1-2C": "#95c7dd",
		"89-1-3C": "#5ca9ce",
		"89-1-4C": "#118ebd",
		"89-1-5C": "#007aaf",
		"89-1-6C": "#00619b",
		"89-1-7C": "#004984",
		"90-1-1C": "#92b4c7",
		"90-1-2C": "#6494af",
		"90-1-3C": "#3f7ba2",
		"90-1-4C": "#206887",
		"90-1-5C": "#005979",
		"90-1-6C": "#004462",
		"90-1-7C": "#00334c",
		"91-1-1C": "#c5d9df",
		"91-1-2C": "#a0becf",
		"91-1-3C": "#80a5bc",
		"91-1-4C": "#5f8ea9",
		"91-1-5C": "#457b99",
		"91-1-6C": "#2c6a8a",
		"91-1-7C": "#045273",
		"92-1-1C": "#e3e9e9",
		"92-1-2C": "#b7cfdb",
		"92-1-3C": "#8eb3c7",
		"92-1-4C": "#6e9db5",
		"92-1-5C": "#5189a4",
		"92-1-6C": "#377896",
		"92-1-7C": "#186484",
		"92-2-1C": "#29627b",
		"92-2-2C": "#28566b",
		"92-2-3C": "#2c5061",
		"92-2-4C": "#2a4652",
		"92-2-5C": "#283c45",
		"92-2-6C": "#2a3a3f",
		"92-2-7C": "#232a2c",
		"93-1-1C": "#b0d8e2",
		"93-1-2C": "#83c4d8",
		"93-1-3C": "#52adca",
		"93-1-4C": "#0096b9",
		"93-1-5C": "#0081a9",
		"93-1-6C": "#00709c",
		"93-1-7C": "#005a87",
		"93-2-1C": "#b4c7c9",
		"93-2-2C": "#8fa9ac",
		"93-2-3C": "#6e8e92",
		"93-2-4C": "#577a7f",
		"93-2-5C": "#40666c",
		"93-2-6C": "#274e54",
		"93-2-7C": "#123238",
		"93-3-1C": "#00577c",
		"93-3-2C": "#004b6a",
		"93-3-3C": "#00475f",
		"93-3-4C": "#003b4d",
		"93-3-5C": "#003341",
		"93-3-6C": "#0b313b",
		"93-3-7C": "#11272d",
		"94-1-1C": "#d3e8ea",
		"94-1-2C": "#a2dcea",
		"94-1-3C": "#63cde8",
		"94-1-4C": "#00bce5",
		"94-1-5C": "#00abe0",
		"94-1-6C": "#009ad9",
		"94-1-7C": "#0088ce",
		"94-2-1C": "#c2e0e5",
		"94-2-2C": "#9ad4e1",
		"94-2-3C": "#6ac2d8",
		"94-2-4C": "#28aeca",
		"94-2-5C": "#009dbd",
		"94-2-6C": "#0090b4",
		"94-2-7C": "#007da3",
		"94-3-1C": "#b7d6db",
		"94-3-2C": "#8dc1cb",
		"94-3-3C": "#61a8b6",
		"94-3-4C": "#3b95a5",
		"94-3-5C": "#068495",
		"94-3-6C": "#007184",
		"94-3-7C": "#00566a",
		"94-4-1C": "#d0dedd",
		"94-4-2C": "#97b7bb",
		"94-4-3C": "#749ea2",
		"94-4-4C": "#4f8288",
		"94-4-5C": "#316b72",
		"94-4-6C": "#16575f",
		"94-4-7C": "#00363d",
		"94-5-1C": "#0081b6",
		"94-5-2C": "#00709b",
		"94-5-3C": "#006182",
		"94-5-4C": "#00556d",
		"94-5-5C": "#004d5f",
		"94-5-6C": "#003e4a",
		"94-5-7C": "#032e35",
		"95-1-1C": "#75d2e4",
		"95-1-2C": "#2fc5df",
		"95-1-3C": "#00b9d9",
		"95-1-4C": "#00add3",
		"95-1-5C": "#00a3cd",
		"95-1-6C": "#0097c4",
		"95-1-7C": "#0089b8",
		"96-1-1C": "#76afbe",
		"96-1-2C": "#5b9fb0",
		"96-1-3C": "#4a96a8",
		"96-1-4C": "#2d879b",
		"96-1-5C": "#0d7c91",
		"96-1-6C": "#00778c",
		"96-1-7C": "#006a80",
		"97-1-1C": "#99b9c0",
		"97-1-2C": "#749ea5",
		"97-1-3C": "#55888f",
		"97-1-4C": "#36727b",
		"97-1-5C": "#196069",
		"97-1-6C": "#004e56",
		"97-1-7C": "#003b41",
		"98-1-1C": "#7cd6e0",
		"98-1-2C": "#50cddb",
		"98-1-3C": "#00c3d4",
		"98-1-4C": "#00b7cb",
		"98-1-5C": "#00aac0",
		"98-1-6C": "#009fb6",
		"98-1-7C": "#0092aa",
		"98-2-1C": "#92c6c9",
		"98-2-2C": "#75b4b8",
		"98-2-3C": "#56a3a8",
		"98-2-4C": "#399399",
		"98-2-5C": "#19868c",
		"98-2-6C": "#00777e",
		"98-2-7C": "#006167",
		"98-3-1C": "#008da1",
		"98-3-2C": "#007888",
		"98-3-3C": "#006e7a",
		"98-3-4C": "#005d65",
		"98-3-5C": "#004c51",
		"98-3-6C": "#004346",
		"98-3-7C": "#083233",
		"99-1-1C": "#91d2d9",
		"99-1-2C": "#5ebeca",
		"99-1-3C": "#17abbb",
		"99-1-4C": "#009cae",
		"99-1-5C": "#008ea2",
		"99-1-6C": "#007d93",
		"99-1-7C": "#006b83",
		"99-2-1C": "#97cbd0",
		"99-2-2C": "#76bac1",
		"99-2-3C": "#56aab3",
		"99-2-4C": "#3399a3",
		"99-2-5C": "#008b96",
		"99-2-6C": "#007d88",
		"99-2-7C": "#006b78",
		"99-3-1C": "#006a7d",
		"99-3-2C": "#00616f",
		"99-3-3C": "#00545e",
		"99-3-4C": "#004a51",
		"99-3-5C": "#004044",
		"99-3-6C": "#09373a",
		"99-3-7C": "#112b2c",
		"100-1-1C": "#81dadd",
		"100-1-2C": "#46cfd3",
		"100-1-3C": "#00c4c9",
		"100-1-4C": "#00bac0",
		"100-1-5C": "#00b1b6",
		"100-1-6C": "#00a4a9",
		"100-1-7C": "#009599",
		"100-2-1C": "#008a8e",
		"100-2-2C": "#007c7f",
		"100-2-3C": "#006b6c",
		"100-2-4C": "#005c5c",
		"100-2-5C": "#004e4d",
		"100-2-6C": "#003f3e",
		"100-2-7C": "#0a2f2d",
		"101-1-1C": "#b7cfcd",
		"101-1-2C": "#82a8a5",
		"101-1-3C": "#618f8b",
		"101-1-4C": "#3c7470",
		"101-1-5C": "#1c5e59",
		"101-1-6C": "#08514b",
		"101-1-7C": "#023b38",
		"102-1-1C": "#50c7c3",
		"102-1-2C": "#00bab5",
		"102-1-3C": "#00ada4",
		"102-1-4C": "#00a398",
		"102-1-5C": "#009d91",
		"102-1-6C": "#009283",
		"102-1-7C": "#008674",
		"103-1-1C": "#00ccc5",
		"103-1-2C": "#00c6be",
		"103-1-3C": "#00bfb6",
		"103-1-4C": "#00b7ad",
		"103-1-5C": "#00b0a5",
		"103-1-6C": "#00a99d",
		"103-1-7C": "#019e91",
		"104-1-1C": "#87ded7",
		"104-1-2C": "#64d8d0",
		"104-1-3C": "#03cec3",
		"104-1-4C": "#00c4b7",
		"104-1-5C": "#00baab",
		"104-1-6C": "#00ae9c",
		"104-1-7C": "#00a28e",
		"104-2-1C": "#8fd6cf",
		"104-2-2C": "#68c8bf",
		"104-2-3C": "#45bcb2",
		"104-2-4C": "#00ada1",
		"104-2-5C": "#009e92",
		"104-2-6C": "#009688",
		"104-2-7C": "#008678",
		"104-3-1C": "#93c5be",
		"104-3-2C": "#6db1a8",
		"104-3-3C": "#4d9d93",
		"104-3-4C": "#349085",
		"104-3-5C": "#1e867b",
		"104-3-6C": "#007569",
		"104-3-7C": "#006156",
		"104-4-1C": "#009484",
		"104-4-2C": "#008577",
		"104-4-3C": "#007568",
		"104-4-4C": "#006257",
		"104-4-5C": "#00534a",
		"104-4-6C": "#01453d",
		"104-4-7C": "#11352f",
		"105-1-1C": "#cbeae3",
		"105-1-2C": "#aee7dc",
		"105-1-3C": "#87e2d1",
		"105-1-4C": "#48d9c1",
		"105-1-5C": "#00ceaf",
		"105-1-6C": "#00bf9b",
		"105-1-7C": "#00ad83",
		"105-2-1C": "#c2e6de",
		"105-2-2C": "#a2ded2",
		"105-2-3C": "#7cd1c0",
		"105-2-4C": "#51c3ae",
		"105-2-5C": "#16b39b",
		"105-2-6C": "#00a287",
		"105-2-7C": "#009073",
		"105-3-1C": "#d0e5de",
		"105-3-2C": "#a3d0c5",
		"105-3-3C": "#80bcad",
		"105-3-4C": "#58a392",
		"105-3-5C": "#348e7b",
		"105-3-6C": "#1d816d",
		"105-3-7C": "#006651",
		"105-4-1C": "#cfddd7",
		"105-4-2C": "#9db9af",
		"105-4-3C": "#7b9e91",
		"105-4-4C": "#628a7c",
		"105-4-5C": "#507a6b",
		"105-4-6C": "#346152",
		"105-4-7C": "#1a4235",
		"105-5-1C": "#009d7a",
		"105-5-2C": "#008e70",
		"105-5-3C": "#007e64",
		"105-5-4C": "#006a55",
		"105-5-5C": "#005947",
		"105-5-6C": "#0b493a",
		"105-5-7C": "#14362c",
		"106-1-1C": "#2fc0ad",
		"106-1-2C": "#00b8a1",
		"106-1-3C": "#00ac92",
		"106-1-4C": "#00a487",
		"106-1-5C": "#009b7b",
		"106-1-6C": "#009270",
		"106-1-7C": "#008660",
		"107-1-1C": "#b2e0d5",
		"107-1-2C": "#82d3c0",
		"107-1-3C": "#41c3aa",
		"107-1-4C": "#00b392",
		"107-1-5C": "#00a682",
		"107-1-6C": "#00956b",
		"107-1-7C": "#008455",
		"107-2-1C": "#a1d4ca",
		"107-2-2C": "#76c3b3",
		"107-2-3C": "#5bb5a2",
		"107-2-4C": "#2da48e",
		"107-2-5C": "#00967d",
		"107-2-6C": "#008a6f",
		"107-2-7C": "#007658",
		"107-3-1C": "#b4cac2",
		"107-3-2C": "#90aea4",
		"107-3-3C": "#709588",
		"107-3-4C": "#5a8476",
		"107-3-5C": "#447163",
		"107-3-6C": "#27594a",
		"107-3-7C": "#0e3c31",
		"107-4-1C": "#007f5a",
		"107-4-2C": "#006e4f",
		"107-4-3C": "#00634a",
		"107-4-4C": "#00513d",
		"107-4-5C": "#004334",
		"107-4-6C": "#013f32",
		"107-4-7C": "#0d2e26",
		"108-1-1C": "#77d0b8",
		"108-1-2C": "#54c6a9",
		"108-1-3C": "#00b993",
		"108-1-4C": "#00ae84",
		"108-1-5C": "#00a375",
		"108-1-6C": "#009866",
		"108-1-7C": "#008953",
		"109-1-1C": "#83a795",
		"109-1-2C": "#638f7a",
		"109-1-3C": "#4f8069",
		"109-1-4C": "#366c55",
		"109-1-5C": "#1e5a44",
		"109-1-6C": "#14513c",
		"109-1-7C": "#0c3f31",
		"110-1-1C": "#79cfaa",
		"110-1-2C": "#5ac69a",
		"110-1-3C": "#2dbb87",
		"110-1-4C": "#00af74",
		"110-1-5C": "#00a564",
		"110-1-6C": "#009b58",
		"110-1-7C": "#008f48",
		"111-1-1C": "#a9dec3",
		"111-1-2C": "#86d3ac",
		"111-1-3C": "#56c490",
		"111-1-4C": "#0db779",
		"111-1-5C": "#00a862",
		"111-1-6C": "#009a4e",
		"111-1-7C": "#008a3c",
		"111-2-1C": "#a9d5ba",
		"111-2-2C": "#7fc29f",
		"111-2-3C": "#64b58a",
		"111-2-4C": "#3ba270",
		"111-2-5C": "#00915b",
		"111-2-6C": "#008952",
		"111-2-7C": "#00743c",
		"111-3-1C": "#a6bcaa",
		"111-3-2C": "#83a089",
		"111-3-3C": "#688a71",
		"111-3-4C": "#577b60",
		"111-3-5C": "#496f54",
		"111-3-6C": "#31583e",
		"111-3-7C": "#173b28",
		"112-1-1C": "#a0bca6",
		"112-1-2C": "#7fa487",
		"112-1-3C": "#618c6c",
		"112-1-4C": "#4a7958",
		"112-1-5C": "#366948",
		"112-1-6C": "#23593a",
		"112-1-7C": "#12432e",
		"113-1-1C": "#8d9f87",
		"113-1-2C": "#768b70",
		"113-1-3C": "#6c8165",
		"113-1-4C": "#586e51",
		"113-1-5C": "#485f43",
		"113-1-6C": "#41583d",
		"113-1-7C": "#334730",
		"114-1-1C": "#b6ddc8",
		"114-1-2C": "#9bd1b4",
		"114-1-3C": "#7cc09b",
		"114-1-4C": "#5cac81",
		"114-1-5C": "#419b6a",
		"114-1-6C": "#2d8b57",
		"114-1-7C": "#187844",
		"115-1-1C": "#9de4c0",
		"115-1-2C": "#78ddae",
		"115-1-3C": "#4ad598",
		"115-1-4C": "#00cb85",
		"115-1-5C": "#00c273",
		"115-1-6C": "#00b65d",
		"115-1-7C": "#00a748",
		"116-1-1C": "#e0ece1",
		"116-1-2C": "#c3ead1",
		"116-1-3C": "#9fe4b4",
		"116-1-4C": "#73db9a",
		"116-1-5C": "#33ce7b",
		"116-1-6C": "#00bd59",
		"116-1-7C": "#00aa39",
		"117-1-1C": "#b5e7c2",
		"117-1-2C": "#96e1aa",
		"117-1-3C": "#79db96",
		"117-1-4C": "#47d07a",
		"117-1-5C": "#00c35b",
		"117-1-6C": "#00b948",
		"117-1-7C": "#00a82e",
		"118-1-1C": "#b6e0b9",
		"118-1-2C": "#97d79f",
		"118-1-3C": "#6ec97e",
		"118-1-4C": "#47bc64",
		"118-1-5C": "#00ad4c",
		"118-1-6C": "#009f39",
		"118-1-7C": "#008f29",
		"118-2-1C": "#b2d7b1",
		"118-2-2C": "#93c795",
		"118-2-3C": "#74b778",
		"118-2-4C": "#50a35b",
		"118-2-5C": "#329447",
		"118-2-6C": "#1f8c3e",
		"118-2-7C": "#00792c",
		"118-3-1C": "#adbea5",
		"118-3-2C": "#8ba181",
		"118-3-3C": "#718b67",
		"118-3-4C": "#5f7a55",
		"118-3-5C": "#526e48",
		"118-3-6C": "#3b5934",
		"118-3-7C": "#213d23",
		"118-4-1C": "#00852c",
		"118-4-2C": "#007b2e",
		"118-4-3C": "#006e2d",
		"118-4-4C": "#135f2a",
		"118-4-5C": "#1e5329",
		"118-4-6C": "#204726",
		"118-4-7C": "#1e3722",
		"119-1-1C": "#bbe8b6",
		"119-1-2C": "#9fe29b",
		"119-1-3C": "#7eda7f",
		"119-1-4C": "#52ce5c",
		"119-1-5C": "#38c84b",
		"119-1-6C": "#00ba2d",
		"119-1-7C": "#00a911",
		"119-2-1C": "#bae0b6",
		"119-2-2C": "#a2d69e",
		"119-2-3C": "#8bcb84",
		"119-2-4C": "#71be6c",
		"119-2-5C": "#57af53",
		"119-2-6C": "#41a340",
		"119-2-7C": "#24932c",
		"119-3-1C": "#00941b",
		"119-3-2C": "#038a25",
		"119-3-3C": "#107421",
		"119-3-4C": "#1e6422",
		"119-3-5C": "#225422",
		"119-3-6C": "#214220",
		"119-3-7C": "#1d301d",
		"120-1-1C": "#70c668",
		"120-1-2C": "#53bb51",
		"120-1-3C": "#35b23e",
		"120-1-4C": "#15aa33",
		"120-1-5C": "#00a52d",
		"120-1-6C": "#009b21",
		"120-1-7C": "#00901b",
		"121-1-1C": "#c0e2ad",
		"121-1-2C": "#a8da90",
		"121-1-3C": "#87ce6e",
		"121-1-4C": "#68c151",
		"121-1-5C": "#45b336",
		"121-1-6C": "#15a522",
		"121-1-7C": "#009615",
		"121-2-1C": "#0b8d1e",
		"121-2-2C": "#177c1d",
		"121-2-3C": "#287121",
		"121-2-4C": "#275e20",
		"121-2-5C": "#264f1f",
		"121-2-6C": "#2a4721",
		"121-2-7C": "#23361e",
		"122-1-1C": "#a5d778",
		"122-1-2C": "#90cf5e",
		"122-1-3C": "#78c442",
		"122-1-4C": "#61b929",
		"122-1-5C": "#4aaf14",
		"122-1-6C": "#2fa302",
		"122-1-7C": "#009700",
		"123-1-1C": "#92b084",
		"123-1-2C": "#709562",
		"123-1-3C": "#547e48",
		"123-1-4C": "#426e39",
		"123-1-5C": "#356331",
		"123-1-6C": "#245228",
		"123-1-7C": "#174125",
		"124-1-1C": "#91b78b",
		"124-1-2C": "#82aa79",
		"124-1-3C": "#729c67",
		"124-1-4C": "#628e55",
		"124-1-5C": "#588348",
		"124-1-6C": "#4e783c",
		"124-1-7C": "#43692e",
		"124-2-1C": "#95b18d",
		"124-2-2C": "#86a37b",
		"124-2-3C": "#76956a",
		"124-2-4C": "#6c8c5f",
		"124-2-5C": "#608152",
		"124-2-6C": "#557646",
		"124-2-7C": "#466636",
		"124-3-1C": "#7e8972",
		"124-3-2C": "#6d7960",
		"124-3-3C": "#606d53",
		"124-3-4C": "#566348",
		"124-3-5C": "#4d5a40",
		"124-3-6C": "#3d4931",
		"124-3-7C": "#2d3823",
		"124-4-1C": "#416530",
		"124-4-2C": "#406031",
		"124-4-3C": "#3c582f",
		"124-4-4C": "#384f2c",
		"124-4-5C": "#34462a",
		"124-4-6C": "#2f3e27",
		"124-4-7C": "#273121",
		"125-1-1C": "#b2cda1",
		"125-1-2C": "#94b683",
		"125-1-3C": "#7ea36c",
		"125-1-4C": "#658c4f",
		"125-1-5C": "#537839",
		"125-1-6C": "#496c2f",
		"125-1-7C": "#3a5820",
		"126-1-1C": "#aec490",
		"126-1-2C": "#92ad6d",
		"126-1-3C": "#7a9951",
		"126-1-4C": "#63843a",
		"126-1-5C": "#52752d",
		"126-1-6C": "#436727",
		"126-1-7C": "#345725",
		"127-1-1C": "#c9e9a0",
		"127-1-2C": "#bbe587",
		"127-1-3C": "#aae067",
		"127-1-4C": "#94d946",
		"127-1-5C": "#7dd01a",
		"127-1-6C": "#5fc300",
		"127-1-7C": "#3cb400",
		"127-2-1C": "#c4de9d",
		"127-2-2C": "#b4d67d",
		"127-2-3C": "#a2cb62",
		"127-2-4C": "#8bba3f",
		"127-2-5C": "#77ab21",
		"127-2-6C": "#6ba110",
		"127-2-7C": "#559000",
		"127-3-1C": "#c1d49c",
		"127-3-2C": "#a6bd71",
		"127-3-3C": "#8ca74f",
		"127-3-4C": "#7b9738",
		"127-3-5C": "#6e8b2a",
		"127-3-6C": "#5d7b1c",
		"127-3-7C": "#4a6913",
		"127-4-1C": "#b7c099",
		"127-4-2C": "#a0aa79",
		"127-4-3C": "#8a955d",
		"127-4-4C": "#768146",
		"127-4-5C": "#677136",
		"127-4-6C": "#525d25",
		"127-4-7C": "#3a451c",
		"127-5-1C": "#58a700",
		"127-5-2C": "#589603",
		"127-5-3C": "#52830e",
		"127-5-4C": "#4c7215",
		"127-5-5C": "#48631d",
		"127-5-6C": "#3c4e1c",
		"127-5-7C": "#303c1d",
		"128-1-1C": "#d4deb7",
		"128-1-2C": "#b1c585",
		"128-1-3C": "#94ac5e",
		"128-1-4C": "#74913a",
		"128-1-5C": "#5b7925",
		"128-1-6C": "#4e6e21",
		"128-1-7C": "#3b5b21",
		"129-1-1C": "#b4c298",
		"129-1-2C": "#9aaa76",
		"129-1-3C": "#839457",
		"129-1-4C": "#788a4a",
		"129-1-5C": "#6e7e3c",
		"129-1-6C": "#5e6e2b",
		"129-1-7C": "#4e5d1d",
		"129-2-1C": "#505e24",
		"129-2-2C": "#4d5925",
		"129-2-3C": "#485226",
		"129-2-4C": "#414a24",
		"129-2-5C": "#3b4224",
		"129-2-6C": "#363c23",
		"129-2-7C": "#333524",
		"130-1-1C": "#e5e8dc",
		"130-1-2C": "#c2cba7",
		"130-1-3C": "#a6b07d",
		"130-1-4C": "#919b5f",
		"130-1-5C": "#7f8848",
		"130-1-6C": "#6d7633",
		"130-1-7C": "#5b6322",
		"131-1-1C": "#b9b89b",
		"131-1-2C": "#999873",
		"131-1-3C": "#88865f",
		"131-1-4C": "#727046",
		"131-1-5C": "#616037",
		"131-1-6C": "#585731",
		"131-1-7C": "#444626",
		"131-2-1C": "#afaf94",
		"131-2-2C": "#969575",
		"131-2-3C": "#7f805e",
		"131-2-4C": "#71724e",
		"131-2-5C": "#686945",
		"131-2-6C": "#585935",
		"131-2-7C": "#474828",
		"132-1-1C": "#c1e086",
		"132-1-2C": "#acd764",
		"132-1-3C": "#9bcf46",
		"132-1-4C": "#7fc21c",
		"132-1-5C": "#65b400",
		"132-1-6C": "#54ab00",
		"132-1-7C": "#399d00",
		"132-2-1C": "#4b9100",
		"132-2-2C": "#467d06",
		"132-2-3C": "#436d11",
		"132-2-4C": "#426117",
		"132-2-5C": "#40551a",
		"132-2-6C": "#38461d",
		"132-2-7C": "#2c351d",
		"133-1-1C": "#e6edd6",
		"133-1-2C": "#ddebb0",
		"133-1-3C": "#cee88b",
		"133-1-4C": "#bde365",
		"133-1-5C": "#a9dc3d",
		"133-1-6C": "#85cd00",
		"133-1-7C": "#61bb00",
		"134-1-1C": "#dae79b",
		"134-1-2C": "#d0e381",
		"134-1-3C": "#c0dc61",
		"134-1-4C": "#acd334",
		"134-1-5C": "#96c700",
		"134-1-6C": "#83bc00",
		"134-1-7C": "#6dae00",
		"135-1-1C": "#d1e776",
		"135-1-2C": "#c6e357",
		"135-1-3C": "#bfe242",
		"135-1-4C": "#afdb01",
		"135-1-5C": "#9ed300",
		"135-1-6C": "#90cc00",
		"135-1-7C": "#7cc000",
		"135-2-1C": "#c8d777",
		"135-2-2C": "#bacc57",
		"135-2-3C": "#acc13a",
		"135-2-4C": "#a2ba24",
		"135-2-5C": "#99b10c",
		"135-2-6C": "#8ba400",
		"135-2-7C": "#7c9700",
		"135-3-1C": "#c1c97d",
		"135-3-2C": "#b0ba60",
		"135-3-3C": "#a3ad48",
		"135-3-4C": "#939d30",
		"135-3-5C": "#879120",
		"135-3-6C": "#7a8413",
		"135-3-7C": "#6c770b",
		"135-4-1C": "#adaf78",
		"135-4-2C": "#9b9d5f",
		"135-4-3C": "#898a46",
		"135-4-4C": "#7b7b36",
		"135-4-5C": "#6c6c28",
		"135-4-6C": "#5b5b1d",
		"135-4-7C": "#454618",
		"135-5-1C": "#7eaa00",
		"135-5-2C": "#729100",
		"135-5-3C": "#6d8300",
		"135-5-4C": "#606f07",
		"135-5-5C": "#535d12",
		"135-5-6C": "#4a5019",
		"135-5-7C": "#383a1b",
		"136-1-1C": "#b7c77a",
		"136-1-2C": "#9db152",
		"136-1-3C": "#879d34",
		"136-1-4C": "#758d22",
		"136-1-5C": "#6a821b",
		"136-1-6C": "#5c7518",
		"136-1-7C": "#4b661b",
		"137-1-1C": "#c7db34",
		"137-1-2C": "#c0d710",
		"137-1-3C": "#b3d000",
		"137-1-4C": "#aaca00",
		"137-1-5C": "#a1c400",
		"137-1-6C": "#98be00",
		"137-1-7C": "#8ab600",
		"138-1-1C": "#e4eba5",
		"138-1-2C": "#dfe987",
		"138-1-3C": "#dae76c",
		"138-1-4C": "#cee33f",
		"138-1-5C": "#bfdc00",
		"138-1-6C": "#add400",
		"138-1-7C": "#91c400",
		"138-2-1C": "#8faa00",
		"138-2-2C": "#809100",
		"138-2-3C": "#747d00",
		"138-2-4C": "#696e06",
		"138-2-5C": "#5f6111",
		"138-2-6C": "#4f4f18",
		"138-2-7C": "#3b3b1c",
		"139-1-1C": "#e4ea7f",
		"139-1-2C": "#e0e86a",
		"139-1-3C": "#dce549",
		"139-1-4C": "#d6e323",
		"139-1-5C": "#cdde00",
		"139-1-6C": "#bfd700",
		"139-1-7C": "#accc00",
		"140-1-1C": "#dbe090",
		"140-1-2C": "#cfd56b",
		"140-1-3C": "#c5cc4d",
		"140-1-4C": "#b1b91d",
		"140-1-5C": "#9da500",
		"140-1-6C": "#919900",
		"140-1-7C": "#808800",
		"141-1-1C": "#e3d6b8",
		"141-1-2C": "#d3be8c",
		"141-1-3C": "#bfa463",
		"141-1-4C": "#ad8f44",
		"141-1-5C": "#9a7b27",
		"141-1-6C": "#896c16",
		"141-1-7C": "#765c0d",
		"141-2-1C": "#c9bea7",
		"141-2-2C": "#ac9d7f",
		"141-2-3C": "#9b8a69",
		"141-2-4C": "#83704b",
		"141-2-5C": "#6e5b35",
		"141-2-6C": "#5d4b28",
		"141-2-7C": "#3e3119",
		"142-1-1C": "#d3ae70",
		"142-1-2C": "#c89f59",
		"142-1-3C": "#be9244",
		"142-1-4C": "#ae8028",
		"142-1-5C": "#a07315",
		"142-1-6C": "#946907",
		"142-1-7C": "#855d05",
		"143-1-1C": "#e8c69a",
		"143-1-2C": "#deb276",
		"143-1-3C": "#cf9b4f",
		"143-1-4C": "#c0882f",
		"143-1-5C": "#b07712",
		"143-1-6C": "#9e6800",
		"143-1-7C": "#835701",
		"144-1-1C": "#ebdfcc",
		"144-1-2C": "#dabf98",
		"144-1-3C": "#c8a16c",
		"144-1-4C": "#b28547",
		"144-1-5C": "#9f702b",
		"144-1-6C": "#8d5f1c",
		"144-1-7C": "#744c15",
		"145-1-1C": "#d5b991",
		"145-1-2C": "#c19d69",
		"145-1-3C": "#b38c52",
		"145-1-4C": "#a07637",
		"145-1-5C": "#8e6423",
		"145-1-6C": "#845c1e",
		"145-1-7C": "#6b4919",
		"145-2-1C": "#c5ae8e",
		"145-2-2C": "#ac916b",
		"145-2-3C": "#997c52",
		"145-2-4C": "#8c6d42",
		"145-2-5C": "#826337",
		"145-2-6C": "#6e5026",
		"145-2-7C": "#543b1a",
		"146-1-1C": "#cba98b",
		"146-1-2C": "#b9906c",
		"146-1-3C": "#a3764d",
		"146-1-4C": "#94643a",
		"146-1-5C": "#82542a",
		"146-1-6C": "#6f441f",
		"146-1-7C": "#56341b",
		"147-1-1C": "#d7c3b0",
		"147-1-2C": "#bb9d82",
		"147-1-3C": "#a48263",
		"147-1-4C": "#8a6442",
		"147-1-5C": "#734e2e",
		"147-1-6C": "#654225",
		"147-1-7C": "#482f1d",
		"148-1-1C": "#b8a18c",
		"148-1-2C": "#9f836a",
		"148-1-3C": "#886a50",
		"148-1-4C": "#795a40",
		"148-1-5C": "#6a4d33",
		"148-1-6C": "#563b26",
		"148-1-7C": "#3f2d20",
		"149-1-1C": "#dacbae",
		"149-1-2C": "#bfa77b",
		"149-1-3C": "#a78a55",
		"149-1-4C": "#92753b",
		"149-1-5C": "#86682e",
		"149-1-6C": "#73561e",
		"149-1-7C": "#5b4419",
		"150-1-1C": "#bfa880",
		"150-1-2C": "#a99567",
		"150-1-3C": "#95804d",
		"150-1-4C": "#87703b",
		"150-1-5C": "#78632f",
		"150-1-6C": "#685322",
		"150-1-7C": "#53431b",
		"150-2-1C": "#a1947b",
		"150-2-2C": "#8e7e62",
		"150-2-3C": "#817256",
		"150-2-4C": "#6d5e41",
		"150-2-5C": "#5a4c30",
		"150-2-6C": "#4e4127",
		"150-2-7C": "#342b1b",
		"151-1-1C": "#d3cca6",
		"151-1-2C": "#b7ae75",
		"151-1-3C": "#a39653",
		"151-1-4C": "#93853c",
		"151-1-5C": "#87792d",
		"151-1-6C": "#776a1c",
		"151-1-7C": "#665b14",
		"151-2-1C": "#685d1d",
		"151-2-2C": "#62581e",
		"151-2-3C": "#5c5220",
		"151-2-4C": "#53491f",
		"151-2-5C": "#48401f",
		"151-2-6C": "#423b1f",
		"151-2-7C": "#36301d",
		"152-1-1C": "#cdc6ab",
		"152-1-2C": "#ada37d",
		"152-1-3C": "#9c9066",
		"152-1-4C": "#85794b",
		"152-1-5C": "#736637",
		"152-1-6C": "#6a5e31",
		"152-1-7C": "#544a24",
		"152-2-1C": "#bab29f",
		"152-2-2C": "#9c927b",
		"152-2-3C": "#877c62",
		"152-2-4C": "#796e54",
		"152-2-5C": "#6c6147",
		"152-2-6C": "#534930",
		"152-2-7C": "#393221",
		"153-1-1C": "#c3bea7",
		"153-1-2C": "#9e9779",
		"153-1-3C": "#817856",
		"153-1-4C": "#6b623f",
		"153-1-5C": "#534b2b",
		"153-1-6C": "#322d1b",
		"153-1-7C": "#20201c",
		"154-1-1C": "#d6d3ca",
		"154-1-2C": "#aaa495",
		"154-1-3C": "#8c8573",
		"154-1-4C": "#6e6653",
		"154-1-5C": "#4c4433",
		"154-1-6C": "#2d281e",
		"154-1-7C": "#1a1b1b",
		"155-1-1C": "#bdafa2",
		"155-1-2C": "#a08f81",
		"155-1-3C": "#8a7668",
		"155-1-4C": "#745f50",
		"155-1-5C": "#614d3e",
		"155-1-6C": "#4c3b2f",
		"155-1-7C": "#372c24",
		"156-1-1C": "#e3dfd9",
		"156-1-2C": "#bfb3aa",
		"156-1-3C": "#9b8c81",
		"156-1-4C": "#827164",
		"156-1-5C": "#6d5b50",
		"156-1-6C": "#544439",
		"156-1-7C": "#3a3029",
		"157-1-1C": "#cac4be",
		"157-1-2C": "#a69f9a",
		"157-1-3C": "#8c837e",
		"157-1-4C": "#746a65",
		"157-1-5C": "#615652",
		"157-1-6C": "#4b423e",
		"157-1-7C": "#37312e",
		"158-1-1C": "#b8b0ac",
		"158-1-2C": "#9b928d",
		"158-1-3C": "#847974",
		"158-1-4C": "#6a5e59",
		"158-1-5C": "#4b3f3b",
		"158-1-6C": "#2a2220",
		"158-1-7C": "#1a191a",
		"159-1-1C": "#d9d3d1",
		"159-1-2C": "#b4a7a7",
		"159-1-3C": "#938284",
		"159-1-4C": "#7b696b",
		"159-1-5C": "#594647",
		"159-1-6C": "#312224",
		"159-1-7C": "#1d1819",
		"160-1-1C": "#c2c2c2",
		"160-1-2C": "#98989b",
		"160-1-3C": "#7d7d82",
		"160-1-4C": "#626268",
		"160-1-5C": "#4b4b52",
		"160-1-6C": "#3d3d43",
		"160-1-7C": "#292a2f",
		"161-1-1C": "#d5d5d1",
		"161-1-2C": "#a8a7a3",
		"161-1-3C": "#8b8986",
		"161-1-4C": "#6c6a67",
		"161-1-5C": "#4a4845",
		"161-1-6C": "#2b2a29",
		"161-1-7C": "#1b1c1e",
		"162-1-1C": "#686365",
		"162-1-2C": "#605c5f",
		"162-1-3C": "#565255",
		"162-1-4C": "#4a4649",
		"162-1-5C": "#403c3f",
		"162-1-6C": "#363436",
		"162-1-7C": "#2d2c2e",
		"162-2-1C": "#deddda",
		"162-2-2C": "#c0bfbf",
		"162-2-3C": "#aaa6a5",
		"162-2-4C": "#9a9798",
		"162-2-5C": "#8b8889",
		"162-2-6C": "#7d787a",
		"162-2-7C": "#6a6668",
		"163-1-1C": "#626671",
		"163-1-2C": "#5a5e6a",
		"163-1-3C": "#4f535f",
		"163-1-4C": "#424653",
		"163-1-5C": "#393c48",
		"163-1-6C": "#2f333e",
		"163-1-7C": "#282b33",
		"163-2-1C": "#dadcdd",
		"163-2-2C": "#bcc0c5",
		"163-2-3C": "#a5a8af",
		"163-2-4C": "#94979e",
		"163-2-5C": "#878b94",
		"163-2-6C": "#767a85",
		"163-2-7C": "#656974",
		"164-1-1C": "#636970",
		"164-1-2C": "#51585f",
		"164-1-3C": "#454c54",
		"164-1-4C": "#31373f",
		"164-1-5C": "#21272e",
		"164-1-6C": "#1a1f25",
		"164-1-7C": "#1c1f23",
		"164-2-1C": "#d3d5d6",
		"164-2-2C": "#bdc1c3",
		"164-2-3C": "#a7abaf",
		"164-2-4C": "#979ca1",
		"164-2-5C": "#888e93",
		"164-2-6C": "#797f86",
		"164-2-7C": "#676e75",
		"165-1-1C": "#6e665d",
		"165-1-2C": "#61594f",
		"165-1-3C": "#4f473f",
		"165-1-4C": "#3f3831",
		"165-1-5C": "#2e2823",
		"165-1-6C": "#211e1c",
		"165-1-7C": "#19191a",
		"165-2-1C": "#d5d2cc",
		"165-2-2C": "#c4c0b9",
		"165-2-3C": "#b3afa7",
		"165-2-4C": "#a49e96",
		"165-2-5C": "#969087",
		"165-2-6C": "#8a837a",
		"165-2-7C": "#787067"
	};

	var GOE_UNCOATED = {
		"1-1-1U": "#f9f7d0",
		"1-1-2U": "#fbf5a7",
		"1-1-3U": "#fdf37e",
		"1-1-4U": "#fff15f",
		"1-1-5U": "#ffee44",
		"1-1-6U": "#ffea1c",
		"1-1-7U": "#ffe100",
		"1-2-1U": "#f4f1b5",
		"1-2-2U": "#f1ea93",
		"1-2-3U": "#ede275",
		"1-2-4U": "#e0d15c",
		"1-2-5U": "#d2c049",
		"1-2-6U": "#c1ae3f",
		"1-2-7U": "#ac9936",
		"1-3-1U": "#e9e3a0",
		"1-3-2U": "#ded582",
		"1-3-3U": "#c9bd67",
		"1-3-4U": "#b6a957",
		"1-3-5U": "#a79a4e",
		"1-3-6U": "#9a8d46",
		"1-3-7U": "#8d8142",
		"1-4-1U": "#ebe9cc",
		"1-4-2U": "#cac48e",
		"1-4-3U": "#afa772",
		"1-4-4U": "#958c5d",
		"1-4-5U": "#837c53",
		"1-4-6U": "#7b754f",
		"1-4-7U": "#6b6646",
		"1-5-1U": "#d4b922",
		"1-5-2U": "#b7a231",
		"1-5-3U": "#9d8c36",
		"1-5-4U": "#8f813b",
		"1-5-5U": "#84793e",
		"1-5-6U": "#746d42",
		"1-5-7U": "#645f41",
		"2-1-1U": "#f9f3a8",
		"2-1-2U": "#fbf08a",
		"2-1-3U": "#feec72",
		"2-1-4U": "#ffe755",
		"2-1-5U": "#ffe03c",
		"2-1-6U": "#ffd520",
		"2-1-7U": "#ffc500",
		"3-1-1U": "#f9f3c1",
		"3-1-2U": "#fbf0a0",
		"3-1-3U": "#ffea7b",
		"3-1-4U": "#ffe35f",
		"3-1-5U": "#ffd641",
		"3-1-6U": "#ffc625",
		"3-1-7U": "#ffb400",
		"4-1-1U": "#ffe989",
		"4-1-2U": "#ffe16d",
		"4-1-3U": "#ffd95b",
		"4-1-4U": "#ffcd44",
		"4-1-5U": "#ffc131",
		"4-1-6U": "#ffb723",
		"4-1-7U": "#ffaa01",
		"5-1-1U": "#fdec9f",
		"5-1-2U": "#ffe383",
		"5-1-3U": "#ffd55e",
		"5-1-4U": "#ffc94b",
		"5-1-5U": "#ffbe3a",
		"5-1-6U": "#ffae26",
		"5-1-7U": "#ff9e13",
		"6-1-1U": "#f7cb64",
		"6-1-2U": "#f7bf59",
		"6-1-3U": "#f6b34f",
		"6-1-4U": "#f5a445",
		"6-1-5U": "#f39a3e",
		"6-1-6U": "#f19039",
		"6-1-7U": "#ee8032",
		"7-1-1U": "#ffe49b",
		"7-1-2U": "#ffd984",
		"7-1-3U": "#ffcc6a",
		"7-1-4U": "#ffbe52",
		"7-1-5U": "#ffb142",
		"7-1-6U": "#ffa131",
		"7-1-7U": "#ff911f",
		"7-2-1U": "#f7dc98",
		"7-2-2U": "#f7cc7a",
		"7-2-3U": "#f1be68",
		"7-2-4U": "#e3a956",
		"7-2-5U": "#d6994a",
		"7-2-6U": "#ca8e43",
		"7-2-7U": "#ba7f3b",
		"7-3-1U": "#eed9a3",
		"7-3-2U": "#e3c482",
		"7-3-3U": "#cba563",
		"7-3-4U": "#ba9458",
		"7-3-5U": "#ae8951",
		"7-3-6U": "#9e7c49",
		"7-3-7U": "#917043",
		"8-1-1U": "#f6de91",
		"8-1-2U": "#f7d378",
		"8-1-3U": "#f6c063",
		"8-1-4U": "#f5ad52",
		"8-1-5U": "#f29c48",
		"8-1-6U": "#f08f40",
		"8-1-7U": "#ec7d3a",
		"8-2-1U": "#c07b3a",
		"8-2-2U": "#aa7940",
		"8-2-3U": "#977240",
		"8-2-4U": "#896c3f",
		"8-2-5U": "#7d6740",
		"8-2-6U": "#6f6041",
		"8-2-7U": "#615841",
		"9-1-1U": "#f6d890",
		"9-1-2U": "#f5c172",
		"9-1-3U": "#f4b060",
		"9-1-4U": "#f19950",
		"9-1-5U": "#ee8845",
		"9-1-6U": "#ec7e41",
		"9-1-7U": "#e86f3a",
		"10-1-1U": "#f4a768",
		"10-1-2U": "#eb9d5d",
		"10-1-3U": "#da8c4d",
		"10-1-4U": "#d18447",
		"10-1-5U": "#c87d40",
		"10-1-6U": "#bb7338",
		"10-1-7U": "#ae6b34",
		"11-1-1U": "#dd935e",
		"11-1-2U": "#d28956",
		"11-1-3U": "#cb824e",
		"11-1-4U": "#bf7845",
		"11-1-5U": "#b77140",
		"11-1-6U": "#ae6b3b",
		"11-1-7U": "#9f6135",
		"11-2-1U": "#ab6c3e",
		"11-2-2U": "#a56e44",
		"11-2-3U": "#92633f",
		"11-2-4U": "#8b6241",
		"11-2-5U": "#815e40",
		"11-2-6U": "#795b41",
		"11-2-7U": "#6b543e",
		"12-1-1U": "#ffe2af",
		"12-1-2U": "#ffd38f",
		"12-1-3U": "#ffc87d",
		"12-1-4U": "#ffb863",
		"12-1-5U": "#ffa64d",
		"12-1-6U": "#ff9a3e",
		"12-1-7U": "#ff862a",
		"13-1-1U": "#ffe8cf",
		"13-1-2U": "#ffd5ac",
		"13-1-3U": "#ffbf89",
		"13-1-4U": "#ffaa6a",
		"13-1-5U": "#ff9b58",
		"13-1-6U": "#ff8943",
		"13-1-7U": "#ff7126",
		"13-2-1U": "#ffdab8",
		"13-2-2U": "#ffcb9f",
		"13-2-3U": "#feb685",
		"13-2-4U": "#f9a36e",
		"13-2-5U": "#ee9059",
		"13-2-6U": "#e0824c",
		"13-2-7U": "#c46a38",
		"13-3-1U": "#eeb389",
		"13-3-2U": "#e3a277",
		"13-3-3U": "#d28f65",
		"13-3-4U": "#c28058",
		"13-3-5U": "#b57750",
		"13-3-6U": "#a86c46",
		"13-3-7U": "#9a613d",
		"13-4-1U": "#eed3ba",
		"13-4-2U": "#d5ad8e",
		"13-4-3U": "#c19676",
		"13-4-4U": "#a87f63",
		"13-4-5U": "#957057",
		"13-4-6U": "#8b674f",
		"13-4-7U": "#775842",
		"13-5-1U": "#de6c31",
		"13-5-2U": "#c26736",
		"13-5-3U": "#a86038",
		"13-5-4U": "#965c39",
		"13-5-5U": "#8c5b3c",
		"13-5-6U": "#7a573f",
		"13-5-7U": "#69503c",
		"14-1-1U": "#ffc9a5",
		"14-1-2U": "#ffbb90",
		"14-1-3U": "#ffaa79",
		"14-1-4U": "#ff9763",
		"14-1-5U": "#ff8752",
		"14-1-6U": "#ff7842",
		"14-1-7U": "#ff642c",
		"15-1-1U": "#ffcebc",
		"15-1-2U": "#ffbaa3",
		"15-1-3U": "#ffa386",
		"15-1-4U": "#ff8e6e",
		"15-1-5U": "#ff7d5b",
		"15-1-6U": "#ff6c48",
		"15-1-7U": "#ff582f",
		"16-1-1U": "#ff9b8a",
		"16-1-2U": "#ff8a76",
		"16-1-3U": "#ff826d",
		"16-1-4U": "#ff735c",
		"16-1-5U": "#ff6850",
		"16-1-6U": "#ff6248",
		"16-1-7U": "#fe5233",
		"16-2-1U": "#f89386",
		"16-2-2U": "#f38879",
		"16-2-3U": "#e67665",
		"16-2-4U": "#d96c5c",
		"16-2-5U": "#d26656",
		"16-2-6U": "#c65e4d",
		"16-2-7U": "#b75543",
		"16-3-1U": "#dd9187",
		"16-3-2U": "#d18379",
		"16-3-3U": "#c4776e",
		"16-3-4U": "#b56b61",
		"16-3-5U": "#a96359",
		"16-3-6U": "#9d5c52",
		"16-3-7U": "#8c5145",
		"16-4-1U": "#b38079",
		"16-4-2U": "#ab7871",
		"16-4-3U": "#9b6c66",
		"16-4-4U": "#90645e",
		"16-4-5U": "#865d57",
		"16-4-6U": "#7c564f",
		"16-4-7U": "#6c4d45",
		"16-5-1U": "#d45338",
		"16-5-2U": "#b54f38",
		"16-5-3U": "#a4503b",
		"16-5-4U": "#904d3b",
		"16-5-5U": "#7e4a3c",
		"16-5-6U": "#744c40",
		"16-5-7U": "#64473d",
		"17-1-1U": "#f6d7ab",
		"17-1-2U": "#f5bc8c",
		"17-1-3U": "#f29d6e",
		"17-1-4U": "#ef875c",
		"17-1-5U": "#ec7852",
		"17-1-6U": "#e76747",
		"17-1-7U": "#e1553b",
		"18-1-1U": "#ff8860",
		"18-1-2U": "#ff7f58",
		"18-1-3U": "#ff7853",
		"18-1-4U": "#fc6b4a",
		"18-1-5U": "#fa6443",
		"18-1-6U": "#f65b3b",
		"18-1-7U": "#ee4b31",
		"19-1-1U": "#ffac8f",
		"19-1-2U": "#ff9d81",
		"19-1-3U": "#fd876c",
		"19-1-4U": "#fa775f",
		"19-1-5U": "#f66753",
		"19-1-6U": "#f05947",
		"19-1-7U": "#e84939",
		"20-1-1U": "#fead9d",
		"20-1-2U": "#fc9384",
		"20-1-3U": "#f98477",
		"20-1-4U": "#f46e63",
		"20-1-5U": "#ee5c54",
		"20-1-6U": "#ea544d",
		"20-1-7U": "#e2433d",
		"21-1-1U": "#f68683",
		"21-1-2U": "#f37876",
		"21-1-3U": "#ee6465",
		"21-1-4U": "#eb595b",
		"21-1-5U": "#e85356",
		"21-1-6U": "#e3494d",
		"21-1-7U": "#dc3f42",
		"21-2-1U": "#e48985",
		"21-2-2U": "#db7a77",
		"21-2-3U": "#d3706e",
		"21-2-4U": "#c76463",
		"21-2-5U": "#c05e5d",
		"21-2-6U": "#b75655",
		"21-2-7U": "#a84c4a",
		"21-3-1U": "#c27d79",
		"21-3-2U": "#bb7673",
		"21-3-3U": "#b06b69",
		"21-3-4U": "#a56461",
		"21-3-5U": "#9c5d5b",
		"21-3-6U": "#905552",
		"21-3-7U": "#844e4a",
		"21-4-1U": "#b08480",
		"21-4-2U": "#a17571",
		"21-4-3U": "#9a706c",
		"21-4-4U": "#8a6461",
		"21-4-5U": "#805c59",
		"21-4-6U": "#7a5754",
		"21-4-7U": "#6c4e4a",
		"22-1-1U": "#ffbec2",
		"22-1-2U": "#ffa6aa",
		"22-1-3U": "#ff8987",
		"22-1-4U": "#ff7974",
		"22-1-5U": "#ff6d64",
		"22-1-6U": "#ff5c51",
		"22-1-7U": "#fc4c38",
		"23-1-1U": "#ffdce2",
		"23-1-2U": "#ffbdcc",
		"23-1-3U": "#ff9fb3",
		"23-1-4U": "#ff8292",
		"23-1-5U": "#ff6b75",
		"23-1-6U": "#ff595d",
		"23-1-7U": "#fb4945",
		"23-2-1U": "#ffd2db",
		"23-2-2U": "#ffabbc",
		"23-2-3U": "#f88e9f",
		"23-2-4U": "#ee7987",
		"23-2-5U": "#de6873",
		"23-2-6U": "#cc5b63",
		"23-2-7U": "#bb5053",
		"23-3-1U": "#f3adba",
		"23-3-2U": "#e08c9a",
		"23-3-3U": "#d07a87",
		"23-3-4U": "#ba6773",
		"23-3-5U": "#ac5d66",
		"23-3-6U": "#a1585f",
		"23-3-7U": "#8f4e50",
		"23-4-1U": "#e9bcc2",
		"23-4-2U": "#d199a2",
		"23-4-3U": "#b37982",
		"23-4-4U": "#9f6a72",
		"23-4-5U": "#946269",
		"23-4-6U": "#82565b",
		"23-4-7U": "#6e494a",
		"23-5-1U": "#d34e4b",
		"23-5-2U": "#bd4e4d",
		"23-5-3U": "#a94e4d",
		"23-5-4U": "#964c4b",
		"23-5-5U": "#854b49",
		"23-5-6U": "#764946",
		"23-5-7U": "#664441",
		"24-1-1U": "#ffbccf",
		"24-1-2U": "#ffa6be",
		"24-1-3U": "#ff88a3",
		"24-1-4U": "#ff6e89",
		"24-1-5U": "#fc5e76",
		"24-1-6U": "#f64e63",
		"24-1-7U": "#f14454",
		"25-1-1U": "#ff94b2",
		"25-1-2U": "#ff7c9b",
		"25-1-3U": "#ff6e8c",
		"25-1-4U": "#fa5c78",
		"25-1-5U": "#f44d68",
		"25-1-6U": "#f14761",
		"25-1-7U": "#ec4054",
		"26-1-1U": "#ffb5ce",
		"26-1-2U": "#ff99ba",
		"26-1-3U": "#fc779d",
		"26-1-4U": "#f86388",
		"26-1-5U": "#f35579",
		"26-1-6U": "#ec4366",
		"26-1-7U": "#e53955",
		"26-2-1U": "#faacc6",
		"26-2-2U": "#f495b3",
		"26-2-3U": "#eb7f9f",
		"26-2-4U": "#db6a89",
		"26-2-5U": "#ce5d79",
		"26-2-6U": "#c2526d",
		"26-2-7U": "#b0495e",
		"26-3-1U": "#bf3c50",
		"26-3-2U": "#ad4353",
		"26-3-3U": "#9a4451",
		"26-3-4U": "#8b434e",
		"26-3-5U": "#7e444d",
		"26-3-6U": "#724449",
		"26-3-7U": "#634244",
		"27-1-1U": "#fa8eb8",
		"27-1-2U": "#f674a1",
		"27-1-3U": "#f26593",
		"27-1-4U": "#ed537f",
		"27-1-5U": "#e7446f",
		"27-1-6U": "#e23c66",
		"27-1-7U": "#db3356",
		"28-1-1U": "#eb6094",
		"28-1-2U": "#e9578b",
		"28-1-3U": "#e4487b",
		"28-1-4U": "#e14273",
		"28-1-5U": "#df3f71",
		"28-1-6U": "#db3766",
		"28-1-7U": "#d6335c",
		"29-1-1U": "#fcdde9",
		"29-1-2U": "#ffc2dc",
		"29-1-3U": "#ffa3c9",
		"29-1-4U": "#fb81b0",
		"29-1-5U": "#f46998",
		"29-1-6U": "#e95280",
		"29-1-7U": "#dd3b6a",
		"29-2-1U": "#f5cbda",
		"29-2-2U": "#f3aecb",
		"29-2-3U": "#ea92b5",
		"29-2-4U": "#dc789e",
		"29-2-5U": "#cc678b",
		"29-2-6U": "#bb597b",
		"29-2-7U": "#aa4c6b",
		"29-3-1U": "#f0c2d3",
		"29-3-2U": "#dc9eb6",
		"29-3-3U": "#cb87a1",
		"29-3-4U": "#b47089",
		"29-3-5U": "#a36179",
		"29-3-6U": "#975a6f",
		"29-3-7U": "#854c5f",
		"30-1-1U": "#fbafd7",
		"30-1-2U": "#fa98cb",
		"30-1-3U": "#f47ab5",
		"30-1-4U": "#ef69a6",
		"30-1-5U": "#ea5f9b",
		"30-1-6U": "#e14d8a",
		"30-1-7U": "#d83d7b",
		"31-1-1U": "#f885ba",
		"31-1-2U": "#f679af",
		"31-1-3U": "#f26ea5",
		"31-1-4U": "#ec5f96",
		"31-1-5U": "#e8558d",
		"31-1-6U": "#e34b82",
		"31-1-7U": "#da3a73",
		"32-1-1U": "#f6deea",
		"32-1-2U": "#f4bdde",
		"32-1-3U": "#f099ca",
		"32-1-4U": "#eb79b3",
		"32-1-5U": "#e55f9a",
		"32-1-6U": "#db4680",
		"32-1-7U": "#d1306a",
		"32-2-1U": "#efc8df",
		"32-2-2U": "#e9a7ce",
		"32-2-3U": "#e18dbc",
		"32-2-4U": "#d271a3",
		"32-2-5U": "#c25e8e",
		"32-2-6U": "#b65481",
		"32-2-7U": "#a3446c",
		"32-3-1U": "#e7bbd4",
		"32-3-2U": "#d69cbd",
		"32-3-3U": "#c07aa0",
		"32-3-4U": "#b26c91",
		"32-3-5U": "#a66285",
		"32-3-6U": "#945473",
		"32-3-7U": "#824661",
		"32-4-1U": "#e2c8d4",
		"32-4-2U": "#cba5b8",
		"32-4-3U": "#b68aa1",
		"32-4-4U": "#a0748a",
		"32-4-5U": "#8f667a",
		"32-4-6U": "#7e586a",
		"32-4-7U": "#694755",
		"32-5-1U": "#b33a67",
		"32-5-2U": "#9e3f64",
		"32-5-3U": "#8c435e",
		"32-5-4U": "#80445b",
		"32-5-5U": "#754557",
		"32-5-6U": "#6d4653",
		"32-5-7U": "#60434b",
		"33-1-1U": "#d9779c",
		"33-1-2U": "#ca668a",
		"33-1-3U": "#c05f80",
		"33-1-4U": "#b15472",
		"33-1-5U": "#a44d67",
		"33-1-6U": "#9d4860",
		"33-1-7U": "#924053",
		"34-1-1U": "#d990af",
		"34-1-2U": "#c47a99",
		"34-1-3U": "#a96581",
		"34-1-4U": "#9c5b74",
		"34-1-5U": "#93566d",
		"34-1-6U": "#854c60",
		"34-1-7U": "#794352",
		"34-2-1U": "#7a4755",
		"34-2-2U": "#774854",
		"34-2-3U": "#724751",
		"34-2-4U": "#6a464d",
		"34-2-5U": "#68474d",
		"34-2-6U": "#63464a",
		"34-2-7U": "#574142",
		"35-1-1U": "#c495b5",
		"35-1-2U": "#b283a5",
		"35-1-3U": "#9e7191",
		"35-1-4U": "#916786",
		"35-1-5U": "#865e7b",
		"35-1-6U": "#7b5670",
		"35-1-7U": "#6a495e",
		"36-1-1U": "#ba97aa",
		"36-1-2U": "#a47e92",
		"36-1-3U": "#987387",
		"36-1-4U": "#896578",
		"36-1-5U": "#7c5c6c",
		"36-1-6U": "#765766",
		"36-1-7U": "#674a55",
		"37-1-1U": "#f7e5ed",
		"37-1-2U": "#f8cae8",
		"37-1-3U": "#f6a4db",
		"37-1-4U": "#f187cc",
		"37-1-5U": "#ea71bc",
		"37-1-6U": "#e059a8",
		"37-1-7U": "#d7489a",
		"37-2-1U": "#d380b5",
		"37-2-2U": "#cb77ac",
		"37-2-3U": "#c671a6",
		"37-2-4U": "#bc679b",
		"37-2-5U": "#b56093",
		"37-2-6U": "#ae5a8d",
		"37-2-7U": "#a25081",
		"37-3-1U": "#bb84a5",
		"37-3-2U": "#b680a0",
		"37-3-3U": "#aa7594",
		"37-3-4U": "#a36e8d",
		"37-3-5U": "#9f6b89",
		"37-3-6U": "#956280",
		"37-3-7U": "#8a5975",
		"37-4-1U": "#a07f8e",
		"37-4-2U": "#927381",
		"37-4-3U": "#8f707e",
		"37-4-4U": "#836674",
		"37-4-5U": "#7b5f6c",
		"37-4-6U": "#775c68",
		"37-4-7U": "#6c525e",
		"37-5-1U": "#c45699",
		"37-5-2U": "#af548c",
		"37-5-3U": "#9a527d",
		"37-5-4U": "#8c5073",
		"37-5-5U": "#84546e",
		"37-5-6U": "#734f60",
		"37-5-7U": "#674d57",
		"38-1-1U": "#d97cb8",
		"38-1-2U": "#d271ae",
		"38-1-3U": "#cb65a1",
		"38-1-4U": "#bf5893",
		"38-1-5U": "#b54f87",
		"38-1-6U": "#aa467a",
		"38-1-7U": "#a9487c",
		"39-1-1U": "#de95cc",
		"39-1-2U": "#d481bf",
		"39-1-3U": "#c66cad",
		"39-1-4U": "#ba5f9e",
		"39-1-5U": "#ad538f",
		"39-1-6U": "#9d497e",
		"39-1-7U": "#8c3f6e",
		"39-2-1U": "#88456d",
		"39-2-2U": "#7b4263",
		"39-2-3U": "#774461",
		"39-2-4U": "#6d4259",
		"39-2-5U": "#664353",
		"39-2-6U": "#644352",
		"39-2-7U": "#5d434d",
		"40-1-1U": "#c17ab4",
		"40-1-2U": "#b86da8",
		"40-1-3U": "#a55c95",
		"40-1-4U": "#9d568c",
		"40-1-5U": "#975285",
		"40-1-6U": "#8a4977",
		"40-1-7U": "#7b406a",
		"41-1-1U": "#af66ab",
		"41-1-2U": "#a95fa3",
		"41-1-3U": "#a1599b",
		"41-1-4U": "#975090",
		"41-1-5U": "#8e4c86",
		"41-1-6U": "#85467c",
		"41-1-7U": "#763d6d",
		"41-2-1U": "#743f68",
		"41-2-2U": "#714365",
		"41-2-3U": "#6b435f",
		"41-2-4U": "#67435b",
		"41-2-5U": "#634357",
		"41-2-6U": "#5f4353",
		"41-2-7U": "#59424d",
		"42-1-1U": "#df92d5",
		"42-1-2U": "#d37cc8",
		"42-1-3U": "#cb72c0",
		"42-1-4U": "#be62b3",
		"42-1-5U": "#b257a7",
		"42-1-6U": "#ac52a1",
		"42-1-7U": "#9f4494",
		"42-2-1U": "#cb8ec0",
		"42-2-2U": "#bf80b5",
		"42-2-3U": "#b26fa6",
		"42-2-4U": "#a6669a",
		"42-2-5U": "#a36398",
		"42-2-6U": "#98598d",
		"42-2-7U": "#8b4f80",
		"42-3-1U": "#a58698",
		"42-3-2U": "#9b7c8e",
		"42-3-3U": "#917486",
		"42-3-4U": "#86697a",
		"42-3-5U": "#7b6070",
		"42-3-6U": "#725968",
		"42-3-7U": "#614b58",
		"42-4-1U": "#934888",
		"42-4-2U": "#8b4a80",
		"42-4-3U": "#804b74",
		"42-4-4U": "#774a6b",
		"42-4-5U": "#704b64",
		"42-4-6U": "#674a5c",
		"42-4-7U": "#5d4652",
		"43-1-1U": "#eac4e4",
		"43-1-2U": "#dfa2dd",
		"43-1-3U": "#d088d1",
		"43-1-4U": "#bc6dbe",
		"43-1-5U": "#ab5dae",
		"43-1-6U": "#9f53a3",
		"43-1-7U": "#8d4291",
		"44-1-1U": "#dcaae1",
		"44-1-2U": "#cc8fd7",
		"44-1-3U": "#b572c5",
		"44-1-4U": "#a763b8",
		"44-1-5U": "#9d5baf",
		"44-1-6U": "#8e4fa0",
		"44-1-7U": "#7e3f90",
		"44-2-1U": "#d1a4d3",
		"44-2-2U": "#c08ec4",
		"44-2-3U": "#b27db8",
		"44-2-4U": "#a16da7",
		"44-2-5U": "#95649b",
		"44-2-6U": "#895a90",
		"44-2-7U": "#764b7c",
		"45-1-1U": "#dea9d8",
		"45-1-2U": "#d398cf",
		"45-1-3U": "#c384c0",
		"45-1-4U": "#b373b2",
		"45-1-5U": "#a868a6",
		"45-1-6U": "#9d5e9c",
		"45-1-7U": "#8f508e",
		"45-2-1U": "#d6abce",
		"45-2-2U": "#c492bc",
		"45-2-3U": "#b785b0",
		"45-2-4U": "#a6749f",
		"45-2-5U": "#986892",
		"45-2-6U": "#92648c",
		"45-2-7U": "#84587e",
		"45-3-1U": "#b79eab",
		"45-3-2U": "#a38a97",
		"45-3-3U": "#8e7582",
		"45-3-4U": "#87707c",
		"45-3-5U": "#7e6874",
		"45-3-6U": "#715d67",
		"45-3-7U": "#625059",
		"46-1-1U": "#e5d1e7",
		"46-1-2U": "#d0b4da",
		"46-1-3U": "#ba99c9",
		"46-1-4U": "#a482b6",
		"46-1-5U": "#9372a6",
		"46-1-6U": "#86679a",
		"46-1-7U": "#745688",
		"47-1-1U": "#c1aad2",
		"47-1-2U": "#b199c6",
		"47-1-3U": "#9f87b8",
		"47-1-4U": "#927bab",
		"47-1-5U": "#8872a2",
		"47-1-6U": "#7c6695",
		"47-1-7U": "#725d8c",
		"48-1-1U": "#ceb4e3",
		"48-1-2U": "#b798d7",
		"48-1-3U": "#a988ce",
		"48-1-4U": "#9675bf",
		"48-1-5U": "#8968b3",
		"48-1-6U": "#8362ac",
		"48-1-7U": "#72529c",
		"49-1-1U": "#a18eb5",
		"49-1-2U": "#9280a7",
		"49-1-3U": "#7f6d93",
		"49-1-4U": "#77658b",
		"49-1-5U": "#726185",
		"49-1-6U": "#675679",
		"49-1-7U": "#5a4b6b",
		"50-1-1U": "#d7b6e8",
		"50-1-2U": "#c197e0",
		"50-1-3U": "#ac7dd3",
		"50-1-4U": "#9869c4",
		"50-1-5U": "#885ab5",
		"50-1-6U": "#794da4",
		"50-1-7U": "#653c8a",
		"51-1-1U": "#e8d7ee",
		"51-1-2U": "#d4b6e9",
		"51-1-3U": "#b68fdd",
		"51-1-4U": "#9e73cd",
		"51-1-5U": "#8f65c0",
		"51-1-6U": "#7d55ae",
		"51-1-7U": "#6b4496",
		"51-2-1U": "#e1ceea",
		"51-2-2U": "#c3a4d9",
		"51-2-3U": "#ad8bca",
		"51-2-4U": "#9472b5",
		"51-2-5U": "#8463a4",
		"51-2-6U": "#785a97",
		"51-2-7U": "#664a7f",
		"51-3-1U": "#d2bddb",
		"51-3-2U": "#b99ec7",
		"51-3-3U": "#9b7eae",
		"51-3-4U": "#8c709f",
		"51-3-5U": "#816794",
		"51-3-6U": "#6a5479",
		"51-3-7U": "#614a6d",
		"51-4-1U": "#d9cada",
		"51-4-2U": "#bea8c4",
		"51-4-3U": "#a68fae",
		"51-4-4U": "#927b9a",
		"51-4-5U": "#826d8b",
		"51-4-6U": "#725e79",
		"51-4-7U": "#5e4c61",
		"51-5-1U": "#5c3e79",
		"51-5-2U": "#5d4173",
		"51-5-3U": "#5a426a",
		"51-5-4U": "#574262",
		"51-5-5U": "#57445d",
		"51-5-6U": "#544256",
		"51-5-7U": "#4f3f4f",
		"52-1-1U": "#cab5e4",
		"52-1-2U": "#af98d7",
		"52-1-3U": "#a188cd",
		"52-1-4U": "#8f75bf",
		"52-1-5U": "#8169b3",
		"52-1-6U": "#7b62ad",
		"52-1-7U": "#6a509c",
		"52-2-1U": "#6b5592",
		"52-2-2U": "#6a5787",
		"52-2-3U": "#5f4f74",
		"52-2-4U": "#5d4f6c",
		"52-2-5U": "#5e5066",
		"52-2-6U": "#574c5a",
		"52-2-7U": "#514750",
		"53-1-1U": "#d8d2ec",
		"53-1-2U": "#b8b2e3",
		"53-1-3U": "#a097d7",
		"53-1-4U": "#8a82c9",
		"53-1-5U": "#7c72bd",
		"53-1-6U": "#7066b0",
		"53-1-7U": "#5d529d",
		"53-2-1U": "#bfb8c2",
		"53-2-2U": "#a59daa",
		"53-2-3U": "#8c8592",
		"53-2-4U": "#7c7581",
		"53-2-5U": "#716a76",
		"53-2-6U": "#655f6a",
		"53-2-7U": "#555059",
		"53-3-1U": "#615992",
		"53-3-2U": "#5b5481",
		"53-3-3U": "#5b5478",
		"53-3-4U": "#554e69",
		"53-3-5U": "#524c60",
		"53-3-6U": "#534d5b",
		"53-3-7U": "#4d474f",
		"54-1-1U": "#b39cde",
		"54-1-2U": "#9e84d8",
		"54-1-3U": "#8468c6",
		"54-1-4U": "#765bb9",
		"54-1-5U": "#6e54af",
		"54-1-6U": "#62489f",
		"54-1-7U": "#553c8b",
		"55-1-1U": "#c2b6e9",
		"55-1-2U": "#a496e0",
		"55-1-3U": "#8d7cd3",
		"55-1-4U": "#7a68c4",
		"55-1-5U": "#6d5ab6",
		"55-1-6U": "#604ea5",
		"55-1-7U": "#523f8d",
		"55-2-1U": "#baacda",
		"55-2-2U": "#a497d0",
		"55-2-3U": "#8e80bc",
		"55-2-4U": "#7e71ae",
		"55-2-5U": "#7568a2",
		"55-2-6U": "#685b92",
		"55-2-7U": "#594d7c",
		"55-3-1U": "#c4b9d6",
		"55-3-2U": "#a397bd",
		"55-3-3U": "#9085ab",
		"55-3-4U": "#7c7299",
		"55-3-5U": "#6f658a",
		"55-3-6U": "#675d7f",
		"55-3-7U": "#564d68",
		"55-4-1U": "#584989",
		"55-4-2U": "#584b7c",
		"55-4-3U": "#514568",
		"55-4-4U": "#534864",
		"55-4-5U": "#53485f",
		"55-4-6U": "#53495a",
		"55-4-7U": "#4d4451",
		"56-1-1U": "#bfb1d5",
		"56-1-2U": "#ab9ec7",
		"56-1-3U": "#9a8fba",
		"56-1-4U": "#8a80ac",
		"56-1-5U": "#7f76a1",
		"56-1-6U": "#776e99",
		"56-1-7U": "#655c87",
		"56-2-1U": "#635d7c",
		"56-2-2U": "#635c78",
		"56-2-3U": "#605a71",
		"56-2-4U": "#5b5464",
		"56-2-5U": "#564f5a",
		"56-2-6U": "#554f57",
		"56-2-7U": "#4e494d",
		"57-1-1U": "#9d8cc7",
		"57-1-2U": "#8977b7",
		"57-1-3U": "#7e6dad",
		"57-1-4U": "#705f9d",
		"57-1-5U": "#675590",
		"57-1-6U": "#614e85",
		"57-1-7U": "#564375",
		"58-1-1U": "#a192c5",
		"58-1-2U": "#8d7eb5",
		"58-1-3U": "#76689e",
		"58-1-4U": "#6d5e93",
		"58-1-5U": "#655689",
		"58-1-6U": "#5b4d7a",
		"58-1-7U": "#4d3f68",
		"59-1-1U": "#c6c3e6",
		"59-1-2U": "#a5a3d8",
		"59-1-3U": "#8c8ac8",
		"59-1-4U": "#7574b4",
		"59-1-5U": "#6968a6",
		"59-1-6U": "#5c5a96",
		"59-1-7U": "#4d4b81",
		"60-1-1U": "#827dc1",
		"60-1-2U": "#7b74b9",
		"60-1-3U": "#716aad",
		"60-1-4U": "#6961a3",
		"60-1-5U": "#625898",
		"60-1-6U": "#5a4f8a",
		"60-1-7U": "#4f427c",
		"61-1-1U": "#dcdce8",
		"61-1-2U": "#b5b7d4",
		"61-1-3U": "#9da0c4",
		"61-1-4U": "#8488ae",
		"61-1-5U": "#74789e",
		"61-1-6U": "#6d7196",
		"61-1-7U": "#5b6085",
		"62-1-1U": "#afbad0",
		"62-1-2U": "#96a2bc",
		"62-1-3U": "#7a86a3",
		"62-1-4U": "#6d7996",
		"62-1-5U": "#67738e",
		"62-1-6U": "#5b657f",
		"62-1-7U": "#4e5772",
		"63-1-1U": "#909bcf",
		"63-1-2U": "#808bc4",
		"63-1-3U": "#747db8",
		"63-1-4U": "#6a72ac",
		"63-1-5U": "#61669f",
		"63-1-6U": "#585b91",
		"63-1-7U": "#4d4c81",
		"63-2-1U": "#8e909d",
		"63-2-2U": "#848593",
		"63-2-3U": "#787886",
		"63-2-4U": "#6f6f7c",
		"63-2-5U": "#676773",
		"63-2-6U": "#5d5c67",
		"63-2-7U": "#52505a",
		"63-3-1U": "#535580",
		"63-3-2U": "#515172",
		"63-3-3U": "#51516d",
		"63-3-4U": "#504f64",
		"63-3-5U": "#4c4a5b",
		"63-3-6U": "#504d5a",
		"63-3-7U": "#4b4850",
		"64-1-1U": "#e2e3f0",
		"64-1-2U": "#b3b7ea",
		"64-1-3U": "#888cdc",
		"64-1-4U": "#7476cf",
		"64-1-5U": "#6a6ac4",
		"64-1-6U": "#5d5ab3",
		"64-1-7U": "#534da4",
		"64-2-1U": "#c4c5da",
		"64-2-2U": "#a6a7c8",
		"64-2-3U": "#8f90b4",
		"64-2-4U": "#7c7da2",
		"64-2-5U": "#717195",
		"64-2-6U": "#636384",
		"64-2-7U": "#54526f",
		"64-3-1U": "#d6d3db",
		"64-3-2U": "#abaabd",
		"64-3-3U": "#8c8ba2",
		"64-3-4U": "#78778e",
		"64-3-5U": "#6b6a7f",
		"64-3-6U": "#5c5b6d",
		"64-3-7U": "#4f4c5b",
		"65-1-1U": "#cfd2ed",
		"65-1-2U": "#abb4e8",
		"65-1-3U": "#8992dc",
		"65-1-4U": "#6f75cd",
		"65-1-5U": "#6062bd",
		"65-1-6U": "#5958b0",
		"65-1-7U": "#49459b",
		"66-1-1U": "#a4b0e8",
		"66-1-2U": "#8793df",
		"66-1-3U": "#6c76cf",
		"66-1-4U": "#6269c5",
		"66-1-5U": "#5d61bc",
		"66-1-6U": "#5253ac",
		"66-1-7U": "#4a479b",
		"67-1-1U": "#b7c9ed",
		"67-1-2U": "#90a8e6",
		"67-1-3U": "#758cdb",
		"67-1-4U": "#6175cd",
		"67-1-5U": "#5867c1",
		"67-1-6U": "#4f5ab2",
		"67-1-7U": "#454ba0",
		"68-1-1U": "#758ed6",
		"68-1-2U": "#667cc9",
		"68-1-3U": "#5c6ebd",
		"68-1-4U": "#5362b0",
		"68-1-5U": "#4e5aa6",
		"68-1-6U": "#464e97",
		"68-1-7U": "#3e4089",
		"69-1-1U": "#e4e9ef",
		"69-1-2U": "#aec1e8",
		"69-1-3U": "#8da4de",
		"69-1-4U": "#7188ce",
		"69-1-5U": "#6175bf",
		"69-1-6U": "#5b6cb6",
		"69-1-7U": "#4959a4",
		"70-1-1U": "#cfe0f0",
		"70-1-2U": "#90b3e9",
		"70-1-3U": "#6489d9",
		"70-1-4U": "#5373cb",
		"70-1-5U": "#4b65bd",
		"70-1-6U": "#4253aa",
		"70-1-7U": "#373f94",
		"70-2-1U": "#b8cde7",
		"70-2-2U": "#8aa9d9",
		"70-2-3U": "#6e8ec6",
		"70-2-4U": "#5b78b3",
		"70-2-5U": "#526ba4",
		"70-2-6U": "#485b91",
		"70-2-7U": "#3c497a",
		"70-3-1U": "#aabfd8",
		"70-3-2U": "#89a1c4",
		"70-3-3U": "#728ab1",
		"70-3-4U": "#62789e",
		"70-3-5U": "#5a6d91",
		"70-3-6U": "#4e5d7e",
		"70-3-7U": "#434c6a",
		"70-4-1U": "#d2dce2",
		"70-4-2U": "#99abc0",
		"70-4-3U": "#7e90a9",
		"70-4-4U": "#6a7a92",
		"70-4-5U": "#5c6a80",
		"70-4-6U": "#535f73",
		"70-4-7U": "#42495b",
		"70-5-1U": "#3a468b",
		"70-5-2U": "#3b477e",
		"70-5-3U": "#3a426d",
		"70-5-4U": "#3b4264",
		"70-5-5U": "#3f4561",
		"70-5-6U": "#3e4258",
		"70-5-7U": "#404251",
		"71-1-1U": "#c4cce5",
		"71-1-2U": "#9daed5",
		"71-1-3U": "#8295c2",
		"71-1-4U": "#6c80b0",
		"71-1-5U": "#6275a4",
		"71-1-6U": "#556794",
		"71-1-7U": "#465682",
		"72-1-1U": "#a8b7cf",
		"72-1-2U": "#96a6c3",
		"72-1-3U": "#8294b2",
		"72-1-4U": "#7485a5",
		"72-1-5U": "#6b7d9c",
		"72-1-6U": "#617392",
		"72-1-7U": "#536584",
		"72-2-1U": "#acb5c6",
		"72-2-2U": "#939eb2",
		"72-2-3U": "#8692a7",
		"72-2-4U": "#788398",
		"72-2-5U": "#6e7a8e",
		"72-2-6U": "#6a7589",
		"72-2-7U": "#5e687c",
		"72-3-1U": "#576680",
		"72-3-2U": "#576479",
		"72-3-3U": "#535c6d",
		"72-3-4U": "#535a67",
		"72-3-5U": "#535862",
		"72-3-6U": "#505359",
		"72-3-7U": "#4b4b4e",
		"73-1-1U": "#c8d4df",
		"73-1-2U": "#9eafc6",
		"73-1-3U": "#8496b1",
		"73-1-4U": "#70839e",
		"73-1-5U": "#657791",
		"73-1-6U": "#5a6b85",
		"73-1-7U": "#4a5b74",
		"74-1-1U": "#7c9fe3",
		"74-1-2U": "#6f90dd",
		"74-1-3U": "#5d7dd3",
		"74-1-4U": "#5773ca",
		"74-1-5U": "#5067c1",
		"74-1-6U": "#495cb5",
		"74-1-7U": "#3e50a8",
		"75-1-1U": "#b8d0ee",
		"75-1-2U": "#88afe8",
		"75-1-3U": "#6d96df",
		"75-1-4U": "#5a7fd3",
		"75-1-5U": "#4e6fc7",
		"75-1-6U": "#4763bb",
		"75-1-7U": "#3e53aa",
		"76-1-1U": "#b9d6ef",
		"76-1-2U": "#86b3ea",
		"76-1-3U": "#5d8edb",
		"76-1-4U": "#4d77cd",
		"76-1-5U": "#456cc3",
		"76-1-6U": "#3c5ab1",
		"76-1-7U": "#30479d",
		"77-1-1U": "#99c4ed",
		"77-1-2U": "#78ace7",
		"77-1-3U": "#6097df",
		"77-1-4U": "#4d82d3",
		"77-1-5U": "#4473c8",
		"77-1-6U": "#3d67bd",
		"77-1-7U": "#3557ad",
		"78-1-1U": "#598dca",
		"78-1-2U": "#5485c4",
		"78-1-3U": "#4a79b9",
		"78-1-4U": "#4270b0",
		"78-1-5U": "#3b67a7",
		"78-1-6U": "#355d9b",
		"78-1-7U": "#2f5190",
		"79-1-1U": "#99a3b2",
		"79-1-2U": "#7f8898",
		"79-1-3U": "#737c8c",
		"79-1-4U": "#656d7d",
		"79-1-5U": "#5b6170",
		"79-1-6U": "#535967",
		"79-1-7U": "#474a56",
		"80-1-1U": "#92aec2",
		"80-1-2U": "#7f9bb2",
		"80-1-3U": "#69869d",
		"80-1-4U": "#617d94",
		"80-1-5U": "#5d788f",
		"80-1-6U": "#546d84",
		"80-1-7U": "#4a6178",
		"81-1-1U": "#6b91b0",
		"81-1-2U": "#6085a4",
		"81-1-3U": "#597c9a",
		"81-1-4U": "#50718e",
		"81-1-5U": "#4b6883",
		"81-1-6U": "#425d79",
		"81-1-7U": "#3b5069",
		"82-1-1U": "#9fb8cd",
		"82-1-2U": "#8ba6bf",
		"82-1-3U": "#7996b0",
		"82-1-4U": "#6b89a4",
		"82-1-5U": "#627f99",
		"82-1-6U": "#58758f",
		"82-1-7U": "#4f6984",
		"82-2-1U": "#a7b7c4",
		"82-2-2U": "#8da0af",
		"82-2-3U": "#8194a5",
		"82-2-4U": "#728495",
		"82-2-5U": "#697b8b",
		"82-2-6U": "#657787",
		"82-2-7U": "#586979",
		"82-3-1U": "#a2adb4",
		"82-3-2U": "#909ba4",
		"82-3-3U": "#7a858f",
		"82-3-4U": "#727d86",
		"82-3-5U": "#6d7880",
		"82-3-6U": "#636d75",
		"82-3-7U": "#555f68",
		"82-4-1U": "#50697e",
		"82-4-2U": "#526677",
		"82-4-3U": "#536370",
		"82-4-4U": "#505c66",
		"82-4-5U": "#525b62",
		"82-4-6U": "#4f5459",
		"82-4-7U": "#494b4d",
		"83-1-1U": "#85aacd",
		"83-1-2U": "#6f96be",
		"83-1-3U": "#5c81ab",
		"83-1-4U": "#50729c",
		"83-1-5U": "#48668e",
		"83-1-6U": "#3e597f",
		"83-1-7U": "#37496d",
		"84-1-1U": "#b0d2ee",
		"84-1-2U": "#7db8ea",
		"84-1-3U": "#5ca0e2",
		"84-1-4U": "#4588d6",
		"84-1-5U": "#3878ca",
		"84-1-6U": "#366dc0",
		"84-1-7U": "#2a5db3",
		"84-2-1U": "#a3cae1",
		"84-2-2U": "#80b0d3",
		"84-2-3U": "#6094be",
		"84-2-4U": "#5485b2",
		"84-2-5U": "#4e7ca7",
		"84-2-6U": "#446d97",
		"84-2-7U": "#3b5e86",
		"84-3-1U": "#afc1c9",
		"84-3-2U": "#8da3ad",
		"84-3-3U": "#798f9b",
		"84-3-4U": "#677b87",
		"84-3-5U": "#5e707b",
		"84-3-6U": "#52616c",
		"84-3-7U": "#434e57",
		"85-1-1U": "#5ca5e4",
		"85-1-2U": "#509adf",
		"85-1-3U": "#418bd8",
		"85-1-4U": "#3880d0",
		"85-1-5U": "#3578ca",
		"85-1-6U": "#2e6dc0",
		"85-1-7U": "#2662b8",
		"86-1-1U": "#76bfec",
		"86-1-2U": "#51a8e5",
		"86-1-3U": "#3d99de",
		"86-1-4U": "#2a85d3",
		"86-1-5U": "#1c78c9",
		"86-1-6U": "#1d70c1",
		"86-1-7U": "#0c61b5",
		"86-2-1U": "#83aec3",
		"86-2-2U": "#6e9bb2",
		"86-2-3U": "#59869f",
		"86-2-4U": "#517c95",
		"86-2-5U": "#4e758d",
		"86-2-6U": "#3c596e",
		"86-2-7U": "#3e5a6e",
		"86-3-1U": "#87a3ae",
		"86-3-2U": "#78949f",
		"86-3-3U": "#6b8793",
		"86-3-4U": "#607a85",
		"86-3-5U": "#576f7a",
		"86-3-6U": "#4e626d",
		"86-3-7U": "#43525c",
		"86-4-1U": "#25619b",
		"86-4-2U": "#2d5f8b",
		"86-4-3U": "#305879",
		"86-4-4U": "#37566e",
		"86-4-5U": "#375165",
		"86-4-6U": "#3b4e5c",
		"86-4-7U": "#3e4a54",
		"87-1-1U": "#85ccef",
		"87-1-2U": "#52b3e8",
		"87-1-3U": "#33a1e2",
		"87-1-4U": "#1184d1",
		"87-1-5U": "#007ecc",
		"87-1-6U": "#0075c4",
		"87-1-7U": "#0067b9",
		"88-1-1U": "#66c4ec",
		"88-1-2U": "#43b4e8",
		"88-1-3U": "#009ddf",
		"88-1-4U": "#0090d7",
		"88-1-5U": "#0087d1",
		"88-1-6U": "#0079c6",
		"88-1-7U": "#006fbf",
		"88-2-1U": "#75bbd7",
		"88-2-2U": "#5eadce",
		"88-2-3U": "#499cc1",
		"88-2-4U": "#3b8eb4",
		"88-2-5U": "#3485ac",
		"88-2-6U": "#2c789f",
		"88-2-7U": "#24698e",
		"88-3-1U": "#00679e",
		"88-3-2U": "#1e668e",
		"88-3-3U": "#2c5f7c",
		"88-3-4U": "#315b70",
		"88-3-5U": "#395867",
		"88-3-6U": "#3a525d",
		"88-3-7U": "#3d4e55",
		"89-1-1U": "#dcedee",
		"89-1-2U": "#95cbe1",
		"89-1-3U": "#6db1d2",
		"89-1-4U": "#4a95bc",
		"89-1-5U": "#377fa8",
		"89-1-6U": "#2d759d",
		"89-1-7U": "#195f89",
		"90-1-1U": "#93b6ca",
		"90-1-2U": "#789eb6",
		"90-1-3U": "#5c819b",
		"90-1-4U": "#53768f",
		"90-1-5U": "#4e6d84",
		"90-1-6U": "#435e74",
		"90-1-7U": "#364b60",
		"91-1-1U": "#c6dee1",
		"91-1-2U": "#99baca",
		"91-1-3U": "#7da2b5",
		"91-1-4U": "#678da1",
		"91-1-5U": "#5a8093",
		"91-1-6U": "#517487",
		"91-1-7U": "#446276",
		"92-1-1U": "#e7edeb",
		"92-1-2U": "#b0ced9",
		"92-1-3U": "#89b1c3",
		"92-1-4U": "#6f9bae",
		"92-1-5U": "#628ea2",
		"92-1-6U": "#558296",
		"92-1-7U": "#466f85",
		"92-2-1U": "#4c7181",
		"92-2-2U": "#4a6774",
		"92-2-3U": "#4c656e",
		"92-2-4U": "#4a5c63",
		"92-2-5U": "#4b595e",
		"92-2-6U": "#4e595b",
		"92-2-7U": "#4a5050",
		"93-1-1U": "#bfe3e9",
		"93-1-2U": "#94cfdf",
		"93-1-3U": "#5fb0ca",
		"93-1-4U": "#429ab7",
		"93-1-5U": "#368daa",
		"93-1-6U": "#1d7c99",
		"93-1-7U": "#0c6787",
		"93-2-1U": "#c2d2d1",
		"93-2-2U": "#a0b7b7",
		"93-2-3U": "#89a2a3",
		"93-2-4U": "#768e90",
		"93-2-5U": "#697f82",
		"93-2-6U": "#596e71",
		"93-2-7U": "#47585b",
		"93-3-1U": "#1f6078",
		"93-3-2U": "#2c6073",
		"93-3-3U": "#335a69",
		"93-3-4U": "#355560",
		"93-3-5U": "#39525a",
		"93-3-6U": "#3d4f55",
		"93-3-7U": "#3f4b4f",
		"94-1-1U": "#d8eff0",
		"94-1-2U": "#9ce1f0",
		"94-1-3U": "#65d1ee",
		"94-1-4U": "#00bbe8",
		"94-1-5U": "#00a5de",
		"94-1-6U": "#0097d5",
		"94-1-7U": "#0084c9",
		"94-2-1U": "#bfe4e9",
		"94-2-2U": "#8fd4e4",
		"94-2-3U": "#54b9d2",
		"94-2-4U": "#32a5c2",
		"94-2-5U": "#1a98b6",
		"94-2-6U": "#0187a6",
		"94-2-7U": "#007694",
		"94-3-1U": "#b0d7dc",
		"94-3-2U": "#85bfca",
		"94-3-3U": "#68a8b5",
		"94-3-4U": "#5292a0",
		"94-3-5U": "#468391",
		"94-3-6U": "#3f7784",
		"94-3-7U": "#35616e",
		"94-4-1U": "#d2e1de",
		"94-4-2U": "#99b9bc",
		"94-4-3U": "#769a9f",
		"94-4-4U": "#65878c",
		"94-4-5U": "#58787e",
		"94-4-6U": "#4b676d",
		"94-4-7U": "#3f5459",
		"94-5-1U": "#007eac",
		"94-5-2U": "#007091",
		"94-5-3U": "#1d6a81",
		"94-5-4U": "#2b6070",
		"94-5-5U": "#355863",
		"94-5-6U": "#38545c",
		"94-5-7U": "#3c4e53",
		"95-1-1U": "#6ad5e9",
		"95-1-2U": "#3bcbe5",
		"95-1-3U": "#00b8da",
		"95-1-4U": "#00add2",
		"95-1-5U": "#00a4ca",
		"95-1-6U": "#0096bd",
		"95-1-7U": "#0089b3",
		"96-1-1U": "#72adb9",
		"96-1-2U": "#65a2af",
		"96-1-3U": "#5b98a5",
		"96-1-4U": "#4e8c9a",
		"96-1-5U": "#478593",
		"96-1-6U": "#3f7e8c",
		"96-1-7U": "#377181",
		"97-1-1U": "#96b8bd",
		"97-1-2U": "#7a9fa7",
		"97-1-3U": "#668a91",
		"97-1-4U": "#587a82",
		"97-1-5U": "#4f6e76",
		"97-1-6U": "#466169",
		"97-1-7U": "#394f56",
		"98-1-1U": "#76dbe5",
		"98-1-2U": "#36cedb",
		"98-1-3U": "#00c4d3",
		"98-1-4U": "#00b5c5",
		"98-1-5U": "#00a8b9",
		"98-1-6U": "#009fb0",
		"98-1-7U": "#0091a4",
		"98-2-1U": "#87c1c2",
		"98-2-2U": "#70adb0",
		"98-2-3U": "#57969a",
		"98-2-4U": "#4f8b8f",
		"98-2-5U": "#498488",
		"98-2-6U": "#42777b",
		"98-2-7U": "#37676c",
		"98-3-1U": "#008996",
		"98-3-2U": "#007e88",
		"98-3-3U": "#15737a",
		"98-3-4U": "#2d686d",
		"98-3-5U": "#386165",
		"98-3-6U": "#3c5a5c",
		"98-3-7U": "#3e5052",
		"99-1-1U": "#7dced5",
		"99-1-2U": "#5fc1c9",
		"99-1-3U": "#41afba",
		"99-1-4U": "#219daa",
		"99-1-5U": "#08929f",
		"99-1-6U": "#008593",
		"99-1-7U": "#007787",
		"99-2-1U": "#8dcbcd",
		"99-2-2U": "#69b2b5",
		"99-2-3U": "#59a3a8",
		"99-2-4U": "#479197",
		"99-2-5U": "#40868c",
		"99-2-6U": "#387f85",
		"99-2-7U": "#2f7178",
		"99-3-1U": "#06737d",
		"99-3-2U": "#256d75",
		"99-3-3U": "#2e6167",
		"99-3-4U": "#345c60",
		"99-3-5U": "#3a5a5c",
		"99-3-6U": "#3d5355",
		"99-3-7U": "#3c4c4c",
		"100-1-1U": "#7adfdf",
		"100-1-2U": "#52d7d7",
		"100-1-3U": "#0ecccd",
		"100-1-4U": "#00bebe",
		"100-1-5U": "#00b3b3",
		"100-1-6U": "#00a6a5",
		"100-1-7U": "#009799",
		"100-2-1U": "#008787",
		"100-2-2U": "#007e7e",
		"100-2-3U": "#127271",
		"100-2-4U": "#296867",
		"100-2-5U": "#36605f",
		"100-2-6U": "#3a5857",
		"100-2-7U": "#3f5150",
		"101-1-1U": "#b9d1cd",
		"101-1-2U": "#84a8a4",
		"101-1-3U": "#6e928f",
		"101-1-4U": "#5a7d7b",
		"101-1-5U": "#4f6e6d",
		"101-1-6U": "#496665",
		"101-1-7U": "#3c5352",
		"102-1-1U": "#4fcbc6",
		"102-1-2U": "#2ac1ba",
		"102-1-3U": "#00b0a6",
		"102-1-4U": "#00a69a",
		"102-1-5U": "#009f93",
		"102-1-6U": "#009286",
		"102-1-7U": "#008477",
		"103-1-1U": "#00d0c4",
		"103-1-2U": "#00cabd",
		"103-1-3U": "#00c3b4",
		"103-1-4U": "#00b9aa",
		"103-1-5U": "#00b2a2",
		"103-1-6U": "#00ab9a",
		"103-1-7U": "#009d8e",
		"104-1-1U": "#a7ebe3",
		"104-1-2U": "#8de6dc",
		"104-1-3U": "#67ded1",
		"104-1-4U": "#1fd2c2",
		"104-1-5U": "#00c8b5",
		"104-1-6U": "#00bba6",
		"104-1-7U": "#00a994",
		"104-2-1U": "#aae4db",
		"104-2-2U": "#86d6cb",
		"104-2-3U": "#6fcbbf",
		"104-2-4U": "#50bbad",
		"104-2-5U": "#38aea0",
		"104-2-6U": "#2aa597",
		"104-2-7U": "#139486",
		"104-3-1U": "#abd8cf",
		"104-3-2U": "#92c7bd",
		"104-3-3U": "#74afa4",
		"104-3-4U": "#67a298",
		"104-3-5U": "#609a90",
		"104-3-6U": "#518b81",
		"104-3-7U": "#457b72",
		"104-4-1U": "#009c8c",
		"104-4-2U": "#009083",
		"104-4-3U": "#2a8479",
		"104-4-4U": "#37776e",
		"104-4-5U": "#406e67",
		"104-4-6U": "#45655f",
		"104-4-7U": "#465b57",
		"105-1-1U": "#ccf3e7",
		"105-1-2U": "#abf0df",
		"105-1-3U": "#7ae9d1",
		"105-1-4U": "#34dfbf",
		"105-1-5U": "#00d2ae",
		"105-1-6U": "#00c39b",
		"105-1-7U": "#00b089",
		"105-2-1U": "#b7e9da",
		"105-2-2U": "#8eddca",
		"105-2-3U": "#6fd0b9",
		"105-2-4U": "#4bbda4",
		"105-2-5U": "#32ac92",
		"105-2-6U": "#2aa188",
		"105-2-7U": "#209079",
		"105-3-1U": "#d0e9de",
		"105-3-2U": "#9dd1c1",
		"105-3-3U": "#75b1a0",
		"105-3-4U": "#619c8b",
		"105-3-5U": "#599081",
		"105-3-6U": "#4d8273",
		"105-3-7U": "#427266",
		"105-4-1U": "#cdded4",
		"105-4-2U": "#9cb8ac",
		"105-4-3U": "#839f93",
		"105-4-4U": "#708b80",
		"105-4-5U": "#657e74",
		"105-4-6U": "#5a7168",
		"105-4-7U": "#4a5d56",
		"105-5-1U": "#00977a",
		"105-5-2U": "#009078",
		"105-5-3U": "#2a7f6c",
		"105-5-4U": "#387264",
		"105-5-5U": "#426a5f",
		"105-5-6U": "#445f57",
		"105-5-7U": "#42544e",
		"106-1-1U": "#39c2ad",
		"106-1-2U": "#00b59c",
		"106-1-3U": "#00ad93",
		"106-1-4U": "#00a085",
		"106-1-5U": "#00977b",
		"106-1-6U": "#009176",
		"106-1-7U": "#00886d",
		"107-1-1U": "#b2e7da",
		"107-1-2U": "#81d9c6",
		"107-1-3U": "#41c5aa",
		"107-1-4U": "#00b495",
		"107-1-5U": "#00a681",
		"107-1-6U": "#009675",
		"107-1-7U": "#008768",
		"107-2-1U": "#9cd6c8",
		"107-2-2U": "#7ac8b5",
		"107-2-3U": "#60b6a2",
		"107-2-4U": "#48a38f",
		"107-2-5U": "#399581",
		"107-2-6U": "#2f8975",
		"107-2-7U": "#237766",
		"107-3-1U": "#b1cac0",
		"107-3-2U": "#91aea4",
		"107-3-3U": "#79978d",
		"107-3-4U": "#69867d",
		"107-3-5U": "#5e7971",
		"107-3-6U": "#526a63",
		"107-3-7U": "#4a5d57",
		"107-4-1U": "#008168",
		"107-4-2U": "#197462",
		"107-4-3U": "#306d60",
		"107-4-4U": "#39635a",
		"107-4-5U": "#3a5a53",
		"107-4-6U": "#3f5852",
		"107-4-7U": "#3f504c",
		"108-1-1U": "#61ceb1",
		"108-1-2U": "#3bc2a1",
		"108-1-3U": "#00b18b",
		"108-1-4U": "#00a780",
		"108-1-5U": "#009f78",
		"108-1-6U": "#00946e",
		"108-1-7U": "#008762",
		"109-1-1U": "#81a495",
		"109-1-2U": "#729485",
		"109-1-3U": "#668779",
		"109-1-4U": "#5b7a6d",
		"109-1-5U": "#527064",
		"109-1-6U": "#4c665c",
		"109-1-7U": "#41584f",
		"110-1-1U": "#68cfa5",
		"110-1-2U": "#4ac393",
		"110-1-3U": "#23b684",
		"110-1-4U": "#00aa77",
		"110-1-5U": "#009f6d",
		"110-1-6U": "#009564",
		"110-1-7U": "#008959",
		"111-1-1U": "#a1e2c2",
		"111-1-2U": "#6ed0a2",
		"111-1-3U": "#4cc38f",
		"111-1-4U": "#1cb27a",
		"111-1-5U": "#00a16a",
		"111-1-6U": "#009862",
		"111-1-7U": "#008956",
		"111-2-1U": "#a6dabb",
		"111-2-2U": "#7fc6a0",
		"111-2-3U": "#5cad86",
		"111-2-4U": "#4e9f78",
		"111-2-5U": "#479570",
		"111-2-6U": "#3a8865",
		"111-2-7U": "#347a5b",
		"111-3-1U": "#a5bca9",
		"111-3-2U": "#8ca592",
		"111-3-3U": "#7b9382",
		"111-3-4U": "#6c8373",
		"111-3-5U": "#627869",
		"111-3-6U": "#586c5f",
		"111-3-7U": "#49594f",
		"112-1-1U": "#93b399",
		"112-1-2U": "#7b9d85",
		"112-1-3U": "#698975",
		"112-1-4U": "#5d7c69",
		"112-1-5U": "#567260",
		"112-1-6U": "#4d6758",
		"112-1-7U": "#41594a",
		"113-1-1U": "#8fa18c",
		"113-1-2U": "#7c8d7a",
		"113-1-3U": "#758674",
		"113-1-4U": "#687867",
		"113-1-5U": "#5e6e5e",
		"113-1-6U": "#5c6a5c",
		"113-1-7U": "#4f5d4f",
		"114-1-1U": "#b6e2c6",
		"114-1-2U": "#99d3b0",
		"114-1-3U": "#76ba91",
		"114-1-4U": "#65a87e",
		"114-1-5U": "#5c9c75",
		"114-1-6U": "#528c67",
		"114-1-7U": "#467e5d",
		"115-1-1U": "#93ebc0",
		"115-1-2U": "#76e6af",
		"115-1-3U": "#5adf9f",
		"115-1-4U": "#28d38c",
		"115-1-5U": "#00c97f",
		"115-1-6U": "#00bb6f",
		"115-1-7U": "#00a960",
		"116-1-1U": "#e6f5e7",
		"116-1-2U": "#caf3d5",
		"116-1-3U": "#a0eeba",
		"116-1-4U": "#70e29d",
		"116-1-5U": "#3cd482",
		"116-1-6U": "#00c16b",
		"116-1-7U": "#00ac58",
		"117-1-1U": "#b8f1c7",
		"117-1-2U": "#95ebac",
		"117-1-3U": "#79e49a",
		"117-1-4U": "#4cd780",
		"117-1-5U": "#16c96c",
		"117-1-6U": "#00be62",
		"117-1-7U": "#00ad53",
		"118-1-1U": "#b2e6b7",
		"118-1-2U": "#8fdb9f",
		"118-1-3U": "#61c87f",
		"118-1-4U": "#41b86d",
		"118-1-5U": "#30ad63",
		"118-1-6U": "#119d56",
		"118-1-7U": "#00914c",
		"118-2-1U": "#b8dfb5",
		"118-2-2U": "#9bd1a0",
		"118-2-3U": "#82bf8b",
		"118-2-4U": "#69ae78",
		"118-2-5U": "#5da16d",
		"118-2-6U": "#509461",
		"118-2-7U": "#428355",
		"118-3-1U": "#a3b69d",
		"118-3-2U": "#8da187",
		"118-3-3U": "#7b8f76",
		"118-3-4U": "#6d8069",
		"118-3-5U": "#647662",
		"118-3-6U": "#596957",
		"118-3-7U": "#4d5b4d",
		"118-4-1U": "#2a864f",
		"118-4-2U": "#37784d",
		"118-4-3U": "#40714d",
		"118-4-4U": "#42664a",
		"118-4-5U": "#455e49",
		"118-4-6U": "#485b49",
		"118-4-7U": "#475446",
		"119-1-1U": "#b4efb2",
		"119-1-2U": "#9cea9d",
		"119-1-3U": "#75df80",
		"119-1-4U": "#56d56e",
		"119-1-5U": "#40cb63",
		"119-1-6U": "#11bc53",
		"119-1-7U": "#00ab48",
		"119-2-1U": "#b5e5af",
		"119-2-2U": "#9dda99",
		"119-2-3U": "#86cb85",
		"119-2-4U": "#6fba72",
		"119-2-5U": "#61ad66",
		"119-2-6U": "#569e5c",
		"119-2-7U": "#479050",
		"119-3-1U": "#32974b",
		"119-3-2U": "#438e4f",
		"119-3-3U": "#47804c",
		"119-3-4U": "#4b744c",
		"119-3-5U": "#4c6a4b",
		"119-3-6U": "#4c614a",
		"119-3-7U": "#495646",
		"120-1-1U": "#6dc874",
		"120-1-2U": "#53bc66",
		"120-1-3U": "#49b560",
		"120-1-4U": "#36a956",
		"120-1-5U": "#27a050",
		"120-1-6U": "#249c4d",
		"120-1-7U": "#179144",
		"121-1-1U": "#b8e6a5",
		"121-1-2U": "#98db8b",
		"121-1-3U": "#72ca6f",
		"121-1-4U": "#57bc5f",
		"121-1-5U": "#46b056",
		"121-1-6U": "#31a24a",
		"121-1-7U": "#249342",
		"121-2-1U": "#3c8d47",
		"121-2-2U": "#488249",
		"121-2-3U": "#4c7848",
		"121-2-4U": "#4d6d47",
		"121-2-5U": "#4f6648",
		"121-2-6U": "#4d5d46",
		"121-2-7U": "#485242",
		"122-1-1U": "#b3e390",
		"122-1-2U": "#9ad87a",
		"122-1-3U": "#80cc67",
		"122-1-4U": "#69bf5a",
		"122-1-5U": "#5eb752",
		"122-1-6U": "#4eac49",
		"122-1-7U": "#43a13f",
		"123-1-1U": "#a1bd97",
		"123-1-2U": "#87a580",
		"123-1-3U": "#7c9975",
		"123-1-4U": "#698766",
		"123-1-5U": "#5d795b",
		"123-1-6U": "#557154",
		"123-1-7U": "#4b634a",
		"124-1-1U": "#9ebf94",
		"124-1-2U": "#8db185",
		"124-1-3U": "#789b70",
		"124-1-4U": "#6f9167",
		"124-1-5U": "#6a8a63",
		"124-1-6U": "#62815b",
		"124-1-7U": "#5a7753",
		"124-2-1U": "#96b28f",
		"124-2-2U": "#8ba683",
		"124-2-3U": "#829d7b",
		"124-2-4U": "#7c9574",
		"124-2-5U": "#758e6e",
		"124-2-6U": "#6d8767",
		"124-2-7U": "#61785b",
		"124-3-1U": "#7b8472",
		"124-3-2U": "#7a8270",
		"124-3-3U": "#707968",
		"124-3-4U": "#6b7263",
		"124-3-5U": "#636b5d",
		"124-3-6U": "#5c6356",
		"124-3-7U": "#51584c",
		"124-4-1U": "#5b7655",
		"124-4-2U": "#556b4f",
		"124-4-3U": "#566951",
		"124-4-4U": "#52614d",
		"124-4-5U": "#4f5b4a",
		"124-4-6U": "#50594b",
		"124-4-7U": "#4a5046",
		"125-1-1U": "#c2dbba",
		"125-1-2U": "#a5c498",
		"125-1-3U": "#87a677",
		"125-1-4U": "#77966b",
		"125-1-5U": "#6f8c63",
		"125-1-6U": "#637f58",
		"125-1-7U": "#59724f",
		"126-1-1U": "#b2c894",
		"126-1-2U": "#95b07b",
		"126-1-3U": "#809c6a",
		"126-1-4U": "#6f8a5c",
		"126-1-5U": "#657f54",
		"126-1-6U": "#5c754d",
		"126-1-7U": "#516746",
		"127-1-1U": "#caef9b",
		"127-1-2U": "#beed89",
		"127-1-3U": "#a7e672",
		"127-1-4U": "#92df5f",
		"127-1-5U": "#7cd64f",
		"127-1-6U": "#60c93e",
		"127-1-7U": "#4eba31",
		"127-2-1U": "#cbe39e",
		"127-2-2U": "#b4d983",
		"127-2-3U": "#a3ce72",
		"127-2-4U": "#8cbd5e",
		"127-2-5U": "#7bad52",
		"127-2-6U": "#73a34d",
		"127-2-7U": "#659543",
		"127-3-1U": "#c4d79c",
		"127-3-2U": "#abc281",
		"127-3-3U": "#8fa967",
		"127-3-4U": "#80995c",
		"127-3-5U": "#789056",
		"127-3-6U": "#6d834f",
		"127-3-7U": "#617747",
		"127-4-1U": "#b9c29a",
		"127-4-2U": "#a1a981",
		"127-4-3U": "#8f9871",
		"127-4-4U": "#7d8662",
		"127-4-5U": "#747c5c",
		"127-4-6U": "#666e51",
		"127-4-7U": "#575f47",
		"127-5-1U": "#5ba23b",
		"127-5-2U": "#659644",
		"127-5-3U": "#648845",
		"127-5-4U": "#617c45",
		"127-5-5U": "#5e7145",
		"127-5-6U": "#596546",
		"127-5-7U": "#515843",
		"128-1-1U": "#d8e4b9",
		"128-1-2U": "#b1c68b",
		"128-1-3U": "#96af73",
		"128-1-4U": "#7c965e",
		"128-1-5U": "#6b8452",
		"128-1-6U": "#667d4d",
		"128-1-7U": "#5a6f46",
		"129-1-1U": "#b3c396",
		"129-1-2U": "#9eaf7f",
		"129-1-3U": "#88986a",
		"129-1-4U": "#7e8d61",
		"129-1-5U": "#78875c",
		"129-1-6U": "#6e7c54",
		"129-1-7U": "#62704b",
		"129-2-1U": "#66724f",
		"129-2-2U": "#636d4e",
		"129-2-3U": "#60694e",
		"129-2-4U": "#5b634b",
		"129-2-5U": "#585e4a",
		"129-2-6U": "#555948",
		"129-2-7U": "#4d5045",
		"130-1-1U": "#ebefdb",
		"130-1-2U": "#c2cea2",
		"130-1-3U": "#a1af7f",
		"130-1-4U": "#8c996b",
		"130-1-5U": "#7f8b5f",
		"130-1-6U": "#727e55",
		"130-1-7U": "#65704a",
		"131-1-1U": "#babb9f",
		"131-1-2U": "#9b9c80",
		"131-1-3U": "#8b8c72",
		"131-1-4U": "#7c7d65",
		"131-1-5U": "#70715b",
		"131-1-6U": "#6a6a55",
		"131-1-7U": "#5b5d49",
		"131-2-1U": "#b0ae98",
		"131-2-2U": "#9a9882",
		"131-2-3U": "#84836f",
		"131-2-4U": "#7a7967",
		"131-2-5U": "#747362",
		"131-2-6U": "#686757",
		"131-2-7U": "#5c5b4e",
		"132-1-1U": "#c2e68c",
		"132-1-2U": "#aede76",
		"132-1-3U": "#98d464",
		"132-1-4U": "#80c653",
		"132-1-5U": "#70bb4a",
		"132-1-6U": "#60b041",
		"132-1-7U": "#51a236",
		"132-2-1U": "#59933c",
		"132-2-2U": "#618b40",
		"132-2-3U": "#607e42",
		"132-2-4U": "#5f7543",
		"132-2-5U": "#5c6b42",
		"132-2-6U": "#576142",
		"132-2-7U": "#525842",
		"133-1-1U": "#f1f6d8",
		"133-1-2U": "#e2f4b2",
		"133-1-3U": "#d4f293",
		"133-1-4U": "#b9eb70",
		"133-1-5U": "#9be153",
		"133-1-6U": "#81d540",
		"133-1-7U": "#64c02c",
		"134-1-1U": "#dcee98",
		"134-1-2U": "#cce880",
		"134-1-3U": "#b5de61",
		"134-1-4U": "#9fd351",
		"134-1-5U": "#8dc946",
		"134-1-6U": "#78bb3a",
		"134-1-7U": "#69ac30",
		"135-1-1U": "#d1ef78",
		"135-1-2U": "#c7ec6b",
		"135-1-3U": "#bce85c",
		"135-1-4U": "#aae24a",
		"135-1-5U": "#9adc3d",
		"135-1-6U": "#89d330",
		"135-1-7U": "#76c420",
		"135-2-1U": "#c8dd7c",
		"135-2-2U": "#c0d674",
		"135-2-3U": "#b1cb62",
		"135-2-4U": "#a1bc55",
		"135-2-5U": "#95b14e",
		"135-2-6U": "#8ca748",
		"135-2-7U": "#7f9c41",
		"135-3-1U": "#c1cc84",
		"135-3-2U": "#a9b46b",
		"135-3-3U": "#9ca861",
		"135-3-4U": "#8c9756",
		"135-3-5U": "#808c4d",
		"135-3-6U": "#7b874a",
		"135-3-7U": "#717c46",
		"135-4-1U": "#a5a67c",
		"135-4-2U": "#9a9c71",
		"135-4-3U": "#868860",
		"135-4-4U": "#7d7f59",
		"135-4-5U": "#777955",
		"135-4-6U": "#6b6d4d",
		"135-4-7U": "#606247",
		"135-5-1U": "#7fae36",
		"135-5-2U": "#7d9c3a",
		"135-5-3U": "#798e41",
		"135-5-4U": "#718042",
		"135-5-5U": "#6d7644",
		"135-5-6U": "#656a45",
		"135-5-7U": "#595d44",
		"136-1-1U": "#b1c178",
		"136-1-2U": "#9fb46c",
		"136-1-3U": "#8aa15d",
		"136-1-4U": "#7b9253",
		"136-1-5U": "#72874b",
		"136-1-6U": "#697e46",
		"136-1-7U": "#617440",
		"137-1-1U": "#c6e153",
		"137-1-2U": "#bada47",
		"137-1-3U": "#b0d540",
		"137-1-4U": "#a2cd36",
		"137-1-5U": "#96c52f",
		"137-1-6U": "#91c12d",
		"137-1-7U": "#89b928",
		"138-1-1U": "#ecf5a6",
		"138-1-2U": "#e6f38f",
		"138-1-3U": "#daef6c",
		"138-1-4U": "#d0ec59",
		"138-1-5U": "#c1e746",
		"138-1-6U": "#a7dc2a",
		"138-1-7U": "#8cca10",
		"138-2-1U": "#8eaf2f",
		"138-2-2U": "#869936",
		"138-2-3U": "#7f8b3d",
		"138-2-4U": "#757c3d",
		"138-2-5U": "#6e7140",
		"138-2-6U": "#646540",
		"138-2-7U": "#565740",
		"139-1-1U": "#e5f071",
		"139-1-2U": "#e3ef68",
		"139-1-3U": "#daec57",
		"139-1-4U": "#d3e945",
		"139-1-5U": "#c6e435",
		"139-1-6U": "#b5dd1e",
		"139-1-7U": "#a0cf00",
		"140-1-1U": "#e1e68e",
		"140-1-2U": "#d2d974",
		"140-1-3U": "#c4cd62",
		"140-1-4U": "#adb94e",
		"140-1-5U": "#99a543",
		"140-1-6U": "#8e9a3d",
		"140-1-7U": "#828c39",
		"141-1-1U": "#e7d9b2",
		"141-1-2U": "#cfbc87",
		"141-1-3U": "#b29d65",
		"141-1-4U": "#9e8c59",
		"141-1-5U": "#93814f",
		"141-1-6U": "#827346",
		"141-1-7U": "#76683e",
		"141-2-1U": "#c8bda1",
		"141-2-2U": "#ac9f84",
		"141-2-3U": "#968971",
		"141-2-4U": "#867a64",
		"141-2-5U": "#796f5b",
		"141-2-6U": "#6a6150",
		"141-2-7U": "#595344",
		"142-1-1U": "#d0ae75",
		"142-1-2U": "#c3a169",
		"142-1-3U": "#b4935c",
		"142-1-4U": "#a78853",
		"142-1-5U": "#9b7e4c",
		"142-1-6U": "#917545",
		"142-1-7U": "#836a3c",
		"143-1-1U": "#f0cc9b",
		"143-1-2U": "#ddb279",
		"143-1-3U": "#cda36a",
		"143-1-4U": "#b98f57",
		"143-1-5U": "#a7804b",
		"143-1-6U": "#a07842",
		"143-1-7U": "#8c6b3c",
		"144-1-1U": "#f8e9d3",
		"144-1-2U": "#e4c49c",
		"144-1-3U": "#c49e72",
		"144-1-4U": "#ab8861",
		"144-1-5U": "#9e7d58",
		"144-1-6U": "#8b6d4b",
		"144-1-7U": "#785d3d",
		"145-1-1U": "#d7b991",
		"145-1-2U": "#c3a279",
		"145-1-3U": "#b08f68",
		"145-1-4U": "#9e805c",
		"145-1-5U": "#937653",
		"145-1-6U": "#856b4a",
		"145-1-7U": "#725c3e",
		"145-2-1U": "#baa385",
		"145-2-2U": "#aa9377",
		"145-2-3U": "#9a846a",
		"145-2-4U": "#8d7860",
		"145-2-5U": "#83705a",
		"145-2-6U": "#776652",
		"145-2-7U": "#685946",
		"146-1-1U": "#ceaa8e",
		"146-1-2U": "#b48f74",
		"146-1-3U": "#a28067",
		"146-1-4U": "#8e6f5a",
		"146-1-5U": "#826551",
		"146-1-6U": "#7a5e4a",
		"146-1-7U": "#69523f",
		"147-1-1U": "#ddc5af",
		"147-1-2U": "#bfa088",
		"147-1-3U": "#9f836e",
		"147-1-4U": "#8c7260",
		"147-1-5U": "#836b5a",
		"147-1-6U": "#715d4d",
		"147-1-7U": "#614f40",
		"148-1-1U": "#bca491",
		"148-1-2U": "#a58e7c",
		"148-1-3U": "#917c6d",
		"148-1-4U": "#826f61",
		"148-1-5U": "#78665a",
		"148-1-6U": "#6b5b4f",
		"148-1-7U": "#5a4d41",
		"149-1-1U": "#e0cdaa",
		"149-1-2U": "#c4ac85",
		"149-1-3U": "#a9926e",
		"149-1-4U": "#958160",
		"149-1-5U": "#887557",
		"149-1-6U": "#7b6a4e",
		"149-1-7U": "#6b5c41",
		"150-1-1U": "#c0b08c",
		"150-1-2U": "#a69674",
		"150-1-3U": "#988969",
		"150-1-4U": "#87795d",
		"150-1-5U": "#7a6d54",
		"150-1-6U": "#75694f",
		"150-1-7U": "#665c43",
		"150-2-1U": "#a49883",
		"150-2-2U": "#948975",
		"150-2-3U": "#827866",
		"150-2-4U": "#786e5f",
		"150-2-5U": "#72695a",
		"150-2-6U": "#665e50",
		"150-2-7U": "#585145",
		"151-1-1U": "#d6cfa2",
		"151-1-2U": "#bdb580",
		"151-1-3U": "#a7a06b",
		"151-1-4U": "#948d5b",
		"151-1-5U": "#868051",
		"151-1-6U": "#7b764a",
		"151-1-7U": "#6b6842",
		"151-2-1U": "#6f6943",
		"151-2-2U": "#6e6845",
		"151-2-3U": "#686344",
		"151-2-4U": "#645f44",
		"151-2-5U": "#605c45",
		"151-2-6U": "#5b5745",
		"151-2-7U": "#555243",
		"152-1-1U": "#d6cdb0",
		"152-1-2U": "#b3a886",
		"152-1-3U": "#a09676",
		"152-1-4U": "#8b8264",
		"152-1-5U": "#7b7358",
		"152-1-6U": "#736b50",
		"152-1-7U": "#68624a",
		"152-2-1U": "#c2b8a4",
		"152-2-2U": "#a8a08d",
		"152-2-3U": "#8e8674",
		"152-2-4U": "#837c6b",
		"152-2-5U": "#7b7464",
		"152-2-6U": "#696355",
		"152-2-7U": "#595448",
		"153-1-1U": "#cac5af",
		"153-1-2U": "#ada78f",
		"153-1-3U": "#968f79",
		"153-1-4U": "#817a67",
		"153-1-5U": "#6f6a59",
		"153-1-6U": "#5c584a",
		"153-1-7U": "#4f4d42",
		"154-1-1U": "#d9d5c7",
		"154-1-2U": "#aba597",
		"154-1-3U": "#8d877c",
		"154-1-4U": "#7b766c",
		"154-1-5U": "#69655c",
		"154-1-6U": "#56534c",
		"154-1-7U": "#494742",
		"155-1-1U": "#c0b2a4",
		"155-1-2U": "#9e8f82",
		"155-1-3U": "#8e7f73",
		"155-1-4U": "#7b6d63",
		"155-1-5U": "#6d6158",
		"155-1-6U": "#665a51",
		"155-1-7U": "#544b44",
		"156-1-1U": "#eae2d7",
		"156-1-2U": "#b9ab9e",
		"156-1-3U": "#928479",
		"156-1-4U": "#80736a",
		"156-1-5U": "#746860",
		"156-1-6U": "#645952",
		"156-1-7U": "#514a44",
		"157-1-1U": "#c8c2bd",
		"157-1-2U": "#a49b94",
		"157-1-3U": "#8b837e",
		"157-1-4U": "#79726d",
		"157-1-5U": "#6d6662",
		"157-1-6U": "#5f5855",
		"157-1-7U": "#4d4845",
		"158-1-1U": "#b4aba6",
		"158-1-2U": "#9c938f",
		"158-1-3U": "#857d79",
		"158-1-4U": "#766e6b",
		"158-1-5U": "#655e5b",
		"158-1-6U": "#534d4a",
		"158-1-7U": "#46413e",
		"159-1-1U": "#dcd4d0",
		"159-1-2U": "#b1a3a2",
		"159-1-3U": "#948687",
		"159-1-4U": "#7c7071",
		"159-1-5U": "#675d5d",
		"159-1-6U": "#584f4e",
		"159-1-7U": "#49413f",
		"160-1-1U": "#c4c4c2",
		"160-1-2U": "#9b9b9d",
		"160-1-3U": "#7f7e80",
		"160-1-4U": "#706f72",
		"160-1-5U": "#676668",
		"160-1-6U": "#5a595b",
		"160-1-7U": "#4c4a4c",
		"161-1-1U": "#d7d5d0",
		"161-1-2U": "#aba8a4",
		"161-1-3U": "#8d8b88",
		"161-1-4U": "#787674",
		"161-1-5U": "#676564",
		"161-1-6U": "#545251",
		"161-1-7U": "#43403e",
		"162-1-1U": "#737070",
		"162-1-2U": "#736f6e",
		"162-1-3U": "#6b6767",
		"162-1-4U": "#656161",
		"162-1-5U": "#5e5b5a",
		"162-1-6U": "#565352",
		"162-1-7U": "#4e4b4a",
		"162-2-1U": "#e6e3de",
		"162-2-2U": "#c6c4c1",
		"162-2-3U": "#b2aeaa",
		"162-2-4U": "#9d9896",
		"162-2-5U": "#8c8987",
		"162-2-6U": "#898482",
		"162-2-7U": "#7a7574",
		"163-1-1U": "#75767b",
		"163-1-2U": "#6f7075",
		"163-1-3U": "#646469",
		"163-1-4U": "#5f6064",
		"163-1-5U": "#5b5b60",
		"163-1-6U": "#515156",
		"163-1-7U": "#49494d",
		"163-2-1U": "#e3e3e1",
		"163-2-2U": "#c7c8c9",
		"163-2-3U": "#b0b2b4",
		"163-2-4U": "#9c9ea3",
		"163-2-5U": "#909297",
		"163-2-6U": "#85878c",
		"163-2-7U": "#75777c",
		"164-1-1U": "#696d71",
		"164-1-2U": "#686b6f",
		"164-1-3U": "#5e6064",
		"164-1-4U": "#585a5e",
		"164-1-5U": "#515255",
		"164-1-6U": "#4a4a4d",
		"164-1-7U": "#414042",
		"164-2-1U": "#d6d6d3",
		"164-2-2U": "#b7b9ba",
		"164-2-3U": "#a6a9ac",
		"164-2-4U": "#919496",
		"164-2-5U": "#83868a",
		"164-2-6U": "#7d8185",
		"164-2-7U": "#72767a",
		"165-1-1U": "#77716c",
		"165-1-2U": "#6e6964",
		"165-1-3U": "#605b57",
		"165-1-4U": "#5b5854",
		"165-1-5U": "#57534f",
		"165-1-6U": "#4d4a46",
		"165-1-7U": "#45423f",
		"165-2-1U": "#d9d5ce",
		"165-2-2U": "#c4beb6",
		"165-2-3U": "#b2aba3",
		"165-2-4U": "#9f9991",
		"165-2-5U": "#938d86",
		"165-2-6U": "#87817b",
		"165-2-7U": "#78726d"
	};

	const Black2C = "#3c3625";
	const Black3C = "#252c26";
	const Black4C = "#382d24";
	const Black5C = "#443135";
	const Black6C = "#111c24";
	const Black7C = "#363534";
	const BlackC = "#2a2623";
	const Blue072C = "#0018a8";
	const CoolGray1C = "#e0e1dd";
	const CoolGray10C = "#616365";
	const CoolGray11C = "#4d4f53";
	const CoolGray2C = "#d5d6d2";
	const CoolGray3C = "#c9cac8";
	const CoolGray4C = "#bcbdbc";
	const CoolGray5C = "#b2b4b3";
	const CoolGray6C = "#adafaf";
	const CoolGray7C = "#9a9b9c";
	const CoolGray8C = "#8b8d8e";
	const CoolGray9C = "#747678";
	const GreenC = "#00ad83";
	const Orange021C = "#ff5800";
	const ProcessBlackC = "#1e1e1e";
	const ProcessBlueC = "#0088ce";
	const ProcessCyanC = "#009fda";
	const ProcessMagentaC = "#d10074";
	const ProcessYellowC = "#f9e300";
	const PurpleC = "#b634bb";
	const Red032C = "#ed2939";
	const ReflexBlueC = "#002395";
	const RhodamineRedC = "#e0119d";
	const RubineRedC = "#ca005d";
	const VioletC = "#4b08a1";
	const WarmGray1C = "#e0ded8";
	const WarmGray10C = "#766a62";
	const WarmGray11C = "#675c53";
	const WarmGray2C = "#d5d2ca";
	const WarmGray3C = "#c7c2ba";
	const WarmGray4C = "#b7b1a9";
	const WarmGray5C = "#aea79f";
	const WarmGray6C = "#a59d95";
	const WarmGray7C = "#988f86";
	const WarmGray8C = "#8b8178";
	const WarmGray9C = "#82786f";
	const WarmRedC = "#f7403a";
	const Yellow012C = "#ffd500";
	const YellowC = "#fedf00";
	var SOLID_COATED = {
		"100C": "#f3ec7a",
		"101C": "#f5ec5a",
		"102C": "#fae700",
		"103C": "#c6ac00",
		"104C": "#ae9a00",
		"105C": "#867a24",
		"106C": "#f7e654",
		"107C": "#f9e11e",
		"108C": "#fcd900",
		"109C": "#fed100",
		"110C": "#d7a900",
		"111C": "#ab8d00",
		"112C": "#968000",
		"113C": "#f8e04d",
		"114C": "#f9de42",
		"115C": "#fadc41",
		"116C": "#fecb00",
		"117C": "#c79900",
		"118C": "#ad8800",
		"119C": "#86731e",
		"120C": "#f8de6e",
		"1205C": "#f8e498",
		"121C": "#fada63",
		"1215C": "#fadd80",
		"122C": "#fcd450",
		"1225C": "#ffcb4f",
		"123C": "#fdc82f",
		"1235C": "#ffb612",
		"124C": "#eaab00",
		"1245C": "#c59217",
		"125C": "#b88b00",
		"1255C": "#ab8422",
		"126C": "#9e7c0c",
		"1265C": "#856822",
		"127C": "#f2df74",
		"128C": "#f2d653",
		"129C": "#f3cf45",
		"130C": "#f0ab00",
		"131C": "#ce8e00",
		"132C": "#a17700",
		"133C": "#6d5818",
		"134C": "#fbd476",
		"1345C": "#fcd189",
		"135C": "#ffc550",
		"1355C": "#ffc674",
		"136C": "#ffbc3d",
		"1365C": "#ffb652",
		"137C": "#ffa100",
		"1375C": "#ffa02f",
		"138C": "#df7a00",
		"1385C": "#d47600",
		"139C": "#b06f00",
		"1395C": "#9c6114",
		"140C": "#755418",
		"1405C": "#6a491c",
		"141C": "#efcb65",
		"142C": "#efbd47",
		"143C": "#eeaf30",
		"144C": "#e98300",
		"145C": "#ca7700",
		"146C": "#9c6409",
		"147C": "#6e5a2a",
		"148C": "#fbce92",
		"1485C": "#ffb070",
		"149C": "#fdc480",
		"1495C": "#ff9133",
		"150C": "#ffa952",
		"1505C": "#ff6e00",
		"151C": "#ff7900",
		"152C": "#e17000",
		"1525C": "#c54c00",
		"153C": "#bb650e",
		"1535C": "#91420e",
		"154C": "#955214",
		"1545C": "#542e19",
		"155C": "#eed6a5",
		"1555C": "#ffc19c",
		"156C": "#ecc182",
		"1565C": "#ffaa7b",
		"157C": "#e9994a",
		"1575C": "#ff8849",
		"158C": "#e37222",
		"1585C": "#ff6d22",
		"159C": "#c75b12",
		"1595C": "#d55c19",
		"160C": "#9d5116",
		"1605C": "#a25022",
		"161C": "#623c1b",
		"1615C": "#86431e",
		"162C": "#ffc2a2",
		"1625C": "#ffa48a",
		"163C": "#ff9e71",
		"1635C": "#ff8f70",
		"164C": "#ff7f45",
		"1645C": "#ff6d42",
		"165C": "#ff6319",
		"1655C": "#fb4f14",
		"166C": "#e05206",
		"1665C": "#dd4814",
		"167C": "#bd4f19",
		"1675C": "#a33f1f",
		"168C": "#6e3219",
		"1685C": "#833820",
		"169C": "#ffb7ae",
		"170C": "#ff8b7c",
		"171C": "#ff5c3e",
		"172C": "#f9461c",
		"173C": "#d2492a",
		"174C": "#9a3b26",
		"175C": "#70382d",
		"176C": "#ffb0b7",
		"1765C": "#fe9eaf",
		"1767C": "#fab1c2",
		"177C": "#ff818d",
		"1775C": "#fe8a9e",
		"1777C": "#fa6380",
		"178C": "#ff585f",
		"1785C": "#f54359",
		"1787C": "#f53f5b",
		"1788C": "#ea2839",
		"179C": "#de3831",
		"1795C": "#cd202c",
		"1797C": "#c4262e",
		"180C": "#bd3632",
		"1805C": "#aa272f",
		"1807C": "#9e3039",
		"181C": "#7b2927",
		"1815C": "#782327",
		"1817C": "#5e3032",
		"182C": "#f9bbca",
		"183C": "#fa93ab",
		"184C": "#f4587a",
		"185C": "#e00034",
		"186C": "#c60c30",
		"187C": "#a71930",
		"188C": "#772432",
		"189C": "#f6a3bb",
		"1895C": "#f3bbce",
		"190C": "#f3789b",
		"1905C": "#f39ebc",
		"191C": "#ec4371",
		"1915C": "#ea5084",
		"192C": "#e10e49",
		"1925C": "#dc0451",
		"193C": "#bb133e",
		"1935C": "#c30045",
		"194C": "#97233f",
		"1945C": "#a51140",
		"195C": "#773141",
		"1955C": "#8d1b3d",
		"196C": "#e9c5cb",
		"197C": "#e59aaa",
		"198C": "#db4d69",
		"199C": "#d0103a",
		"200C": "#b71234",
		"201C": "#981e32",
		"202C": "#822433",
		"203C": "#e7aec6",
		"204C": "#e27ea6",
		"205C": "#da487e",
		"206C": "#cb0044",
		"207C": "#a70240",
		"208C": "#882345",
		"209C": "#6e273d",
		"210C": "#f9a1ca",
		"211C": "#f77ab4",
		"212C": "#f04d98",
		"213C": "#e21776",
		"214C": "#c90062",
		"215C": "#a71056",
		"216C": "#7c2348",
		"217C": "#eabdd8",
		"218C": "#e26eb2",
		"219C": "#d71f85",
		"220C": "#a30050",
		"221C": "#91004b",
		"222C": "#6a1a41",
		"223C": "#f092cd",
		"224C": "#eb67b9",
		"225C": "#e0249a",
		"226C": "#cf0072",
		"227C": "#a90061",
		"228C": "#830051",
		"229C": "#662046",
		"230C": "#f7a3d5",
		"231C": "#f375c6",
		"232C": "#ea3bae",
		"233C": "#c50084",
		"234C": "#a1006b",
		"235C": "#850057",
		"236C": "#f3adde",
		"2365C": "#efc2e1",
		"237C": "#ef8bd3",
		"2375C": "#e170c9",
		"238C": "#e45bbf",
		"2385C": "#d12db1",
		"239C": "#da39af",
		"2395C": "#c3009e",
		"240C": "#bf2296",
		"2405C": "#a40084",
		"241C": "#a31a7e",
		"2415C": "#920075",
		"242C": "#772059",
		"2425C": "#7d0063",
		"243C": "#ebbce3",
		"244C": "#e59fdb",
		"245C": "#de81d3",
		"246C": "#c21dac",
		"247C": "#b1059d",
		"248C": "#9b1889",
		"249C": "#752864",
		"250C": "#e7c1e3",
		"251C": "#dc9ddd",
		"252C": "#c966cd",
		"253C": "#a626aa",
		"254C": "#952d98",
		"255C": "#6e2c6b",
		"256C": "#dcc7df",
		"2562C": "#d4aae2",
		"2563C": "#c9a5d7",
		"2567C": "#bb9dd6",
		"257C": "#cba8d2",
		"2572C": "#c48bda",
		"2573C": "#b382c7",
		"2577C": "#a47cc9",
		"258C": "#93509e",
		"2582C": "#a44dc4",
		"2583C": "#9c5fb5",
		"2587C": "#824bb0",
		"259C": "#6e267b",
		"2592C": "#8f23b3",
		"2593C": "#80379b",
		"2597C": "#57068c",
		"260C": "#622567",
		"2602C": "#7c109a",
		"2603C": "#6e2585",
		"2607C": "#4f0b7b",
		"261C": "#5a245a",
		"2612C": "#6b1f7c",
		"2613C": "#631d76",
		"2617C": "#490e6f",
		"262C": "#53284f",
		"2622C": "#5e2d61",
		"2623C": "#5b1f69",
		"2627C": "#42145f",
		"263C": "#dbcfe9",
		"2635C": "#c5b9e3",
		"264C": "#c1afe5",
		"2645C": "#ac98db",
		"265C": "#8c6cd0",
		"2655C": "#9278d1",
		"266C": "#6639b7",
		"2665C": "#7d5cc6",
		"267C": "#522398",
		"268C": "#4f2d7f",
		"2685C": "#3b0083",
		"269C": "#4b306a",
		"2695C": "#331c54",
		"270C": "#b3b6dd",
		"2705C": "#a5a4df",
		"2706C": "#cad1e7",
		"2707C": "#c5d7eb",
		"2708C": "#b3c8e6",
		"271C": "#9093ce",
		"2715C": "#8884d5",
		"2716C": "#9dabe2",
		"2717C": "#a8c5eb",
		"2718C": "#5a85d7",
		"272C": "#7577c0",
		"2725C": "#6459c4",
		"2726C": "#4c5cc5",
		"2727C": "#3d7edb",
		"2728C": "#0f4dbc",
		"273C": "#241773",
		"2735C": "#280091",
		"2736C": "#2526a9",
		"2738C": "#001b96",
		"274C": "#1f145d",
		"2745C": "#240078",
		"2746C": "#212492",
		"2747C": "#00257a",
		"2748C": "#031f73",
		"275C": "#1e1656",
		"2755C": "#21076a",
		"2756C": "#1a206d",
		"2757C": "#002663",
		"2758C": "#0b2265",
		"276C": "#201c3e",
		"2765C": "#1c0e52",
		"2766C": "#1a2155",
		"2767C": "#182b49",
		"2768C": "#0f204b",
		"277C": "#aacae6",
		"278C": "#8ebae5",
		"279C": "#4b92db",
		"280C": "#002776",
		"281C": "#002664",
		"282C": "#002147",
		"283C": "#98c6ea",
		"284C": "#6aade4",
		"285C": "#0073cf",
		"286C": "#0039a6",
		"287C": "#00338d",
		"288C": "#002c77",
		"289C": "#002244",
		"290C": "#c2deea",
		"2905C": "#8fcae7",
		"291C": "#a0cfeb",
		"2915C": "#5eb6e4",
		"292C": "#63b1e5",
		"2925C": "#0098db",
		"293C": "#0046ad",
		"2935C": "#005bbb",
		"294C": "#003478",
		"2945C": "#00549f",
		"295C": "#002f5f",
		"2955C": "#003c69",
		"296C": "#031e2f",
		"2965C": "#002b45",
		"297C": "#72c7e7",
		"2975C": "#a3dbe8",
		"298C": "#3db7e4",
		"2985C": "#5bc6e8",
		"299C": "#00a1de",
		"2995C": "#00a9e0",
		"300C": "#0065bd",
		"3005C": "#007ac9",
		"301C": "#005293",
		"3015C": "#0066a1",
		"302C": "#004165",
		"3025C": "#005172",
		"303C": "#003145",
		"3035C": "#004153",
		"304C": "#a1dee9",
		"305C": "#65cfe9",
		"306C": "#00b9e4",
		"307C": "#0075b0",
		"308C": "#005b82",
		"309C": "#003d4c",
		"310C": "#6fd4e4",
		"3105C": "#71d6e0",
		"311C": "#0cc6de",
		"3115C": "#00c6d7",
		"312C": "#00add0",
		"3125C": "#00b0ca",
		"313C": "#0098c3",
		"3135C": "#0094b3",
		"314C": "#0083a9",
		"3145C": "#007c92",
		"315C": "#006983",
		"3155C": "#006778",
		"316C": "#004953",
		"3165C": "#00505c",
		"317C": "#bbe7e6",
		"318C": "#8fdfe2",
		"319C": "#3fcfd5",
		"320C": "#009aa6",
		"321C": "#008b95",
		"322C": "#00747a",
		"323C": "#006265",
		"324C": "#9cdcd9",
		"3242C": "#72dcd4",
		"3245C": "#80e0d3",
		"3248C": "#7fd5c5",
		"325C": "#63ceca",
		"3252C": "#47d5cd",
		"3255C": "#3ad6c5",
		"3258C": "#50c9b5",
		"326C": "#00b2a9",
		"3262C": "#00c0b5",
		"3265C": "#00c7b2",
		"3268C": "#00b092",
		"327C": "#008770",
		"3272C": "#00a599",
		"3275C": "#00b299",
		"3278C": "#009b74",
		"328C": "#007363",
		"3282C": "#00877c",
		"3285C": "#009581",
		"3288C": "#008566",
		"329C": "#00675a",
		"3292C": "#005d55",
		"3295C": "#007b69",
		"3298C": "#006d55",
		"330C": "#005751",
		"3302C": "#004d46",
		"3305C": "#024e43",
		"3308C": "#004438",
		"331C": "#b0e9db",
		"332C": "#a1e7d7",
		"333C": "#4bdbc3",
		"334C": "#009b76",
		"335C": "#007f64",
		"336C": "#006751",
		"337C": "#9adcc6",
		"3375C": "#81e2c1",
		"338C": "#76d2b6",
		"3385C": "#50dab0",
		"339C": "#00b588",
		"3395C": "#00c78b",
		"340C": "#00985f",
		"3405C": "#00ae65",
		"341C": "#007d57",
		"3415C": "#007a4d",
		"342C": "#006a4d",
		"3425C": "#006643",
		"343C": "#035642",
		"3435C": "#024731",
		"344C": "#aadfbe",
		"345C": "#91d8ae",
		"346C": "#72ce9b",
		"347C": "#009b48",
		"348C": "#008542",
		"349C": "#00693c",
		"350C": "#284e36",
		"351C": "#a6e6bc",
		"352C": "#8fe2af",
		"353C": "#7edfa6",
		"354C": "#00af3f",
		"355C": "#009b3a",
		"356C": "#007934",
		"357C": "#275937",
		"358C": "#a9dc92",
		"359C": "#a1da8b",
		"360C": "#61c250",
		"361C": "#34b233",
		"362C": "#3f9c35",
		"363C": "#3c8a2e",
		"364C": "#427730",
		"365C": "#c8e59a",
		"366C": "#bde18a",
		"367C": "#a5d867",
		"368C": "#69be28",
		"369C": "#58a618",
		"370C": "#5b8f22",
		"371C": "#53682b",
		"372C": "#d9ec9c",
		"373C": "#d0eb8a",
		"374C": "#c3e76f",
		"375C": "#92d400",
		"376C": "#7ab800",
		"377C": "#739600",
		"378C": "#55601c",
		"379C": "#e0e96e",
		"380C": "#d6e342",
		"381C": "#c9dd03",
		"382C": "#bed600",
		"383C": "#a2ad00",
		"384C": "#8e9300",
		"385C": "#726e20",
		"386C": "#e8eb6f",
		"387C": "#e0e830",
		"388C": "#d9e506",
		"389C": "#ccdc00",
		"390C": "#b6bf00",
		"391C": "#9c9a00",
		"392C": "#7f7a00",
		"393C": "#eeec83",
		"3935C": "#f2ee72",
		"394C": "#ebe945",
		"3945C": "#f1e800",
		"395C": "#e7e600",
		"3955C": "#eadf00",
		"396C": "#dfdf00",
		"3965C": "#e4d700",
		"397C": "#c1bb00",
		"3975C": "#b5a300",
		"398C": "#aea400",
		"3985C": "#978700",
		"399C": "#9c9100",
		"3995C": "#695d15",
		"400C": "#cbc7bf",
		"401C": "#b6b1a9",
		"402C": "#a9a39b",
		"403C": "#928b81",
		"404C": "#776f65",
		"405C": "#5f574f",
		"406C": "#cdc6c0",
		"407C": "#b5aca6",
		"408C": "#a29791",
		"409C": "#8d817b",
		"410C": "#766a65",
		"411C": "#5d4f4b",
		"412C": "#332b2a",
		"413C": "#c6c6bc",
		"414C": "#b0b1a6",
		"415C": "#999a8f",
		"416C": "#83847a",
		"417C": "#6d6f64",
		"418C": "#57584f",
		"419C": "#1c1e1c",
		"420C": "#cecfcb",
		"421C": "#b5b6b3",
		"422C": "#a2a4a3",
		"423C": "#8e908f",
		"424C": "#6c6f70",
		"425C": "#565a5c",
		"426C": "#191d1f",
		"427C": "#d1d4d3",
		"428C": "#c3c8c8",
		"429C": "#a5acaf",
		"430C": "#818a8f",
		"431C": "#5e6a71",
		"432C": "#37424a",
		"433C": "#1b242a",
		"434C": "#cfc3c3",
		"435C": "#c2b2b5",
		"436C": "#b29fa4",
		"437C": "#80686f",
		"438C": "#513c40",
		"439C": "#423132",
		"440C": "#312626",
		"441C": "#bec5c2",
		"442C": "#a9b2b1",
		"443C": "#949d9e",
		"444C": "#747f81",
		"445C": "#4d5357",
		"446C": "#404545",
		"447C": "#353735",
		"448C": "#4b452c",
		"4485C": "#5b491f",
		"449C": "#4c4726",
		"4495C": "#816e2c",
		"450C": "#4f4c25",
		"4505C": "#988642",
		"451C": "#9a996e",
		"4515C": "#b4a76c",
		"452C": "#b3b38c",
		"4525C": "#c6bc89",
		"453C": "#c2c2a0",
		"4535C": "#d1c99d",
		"454C": "#d0d1b4",
		"4545C": "#dcd6b2",
		"455C": "#65551c",
		"456C": "#9a8419",
		"457C": "#b19401",
		"458C": "#ddcd69",
		"459C": "#e2d478",
		"460C": "#e6dc8f",
		"461C": "#eae4a9",
		"462C": "#584528",
		"4625C": "#512b1b",
		"463C": "#6c4d23",
		"4635C": "#935e3a",
		"464C": "#825c26",
		"4645C": "#ae7d5b",
		"465C": "#b3995d",
		"4655C": "#bd9271",
		"466C": "#c7b37f",
		"4665C": "#cea98c",
		"467C": "#d2c295",
		"4675C": "#dbc0a8",
		"468C": "#ddd3af",
		"4685C": "#e2cdb8",
		"469C": "#60351d",
		"4695C": "#522d24",
		"470C": "#9d5324",
		"4705C": "#774a39",
		"471C": "#b2541a",
		"4715C": "#966d5b",
		"472C": "#e39b6c",
		"4725C": "#ab8876",
		"473C": "#efbe9c",
		"4735C": "#c0a494",
		"474C": "#f1c4a2",
		"4745C": "#cdb6a7",
		"475C": "#f1cdaf",
		"4755C": "#d8c7b9",
		"476C": "#4c3327",
		"477C": "#5d3526",
		"478C": "#703d29",
		"479C": "#a88165",
		"480C": "#c7ac96",
		"481C": "#d3bea9",
		"482C": "#dac9b5",
		"483C": "#673327",
		"484C": "#983222",
		"485C": "#d52b1e",
		"486C": "#e78f77",
		"487C": "#e9a68f",
		"488C": "#ebbda9",
		"489C": "#ebcab8",
		"490C": "#5b2b2f",
		"491C": "#783037",
		"492C": "#8a343d",
		"493C": "#d78396",
		"494C": "#e5a0af",
		"495C": "#edb8c4",
		"496C": "#f0c4cd",
		"497C": "#4e2e2d",
		"4975C": "#452325",
		"498C": "#683735",
		"4985C": "#844c54",
		"499C": "#753b37",
		"4995C": "#9d6670",
		"500C": "#c5858f",
		"5005C": "#b6848c",
		"501C": "#dba7ae",
		"5015C": "#cfa7ad",
		"502C": "#e6bfc4",
		"5025C": "#dabbbe",
		"503C": "#eacacd",
		"5035C": "#e2cacb",
		"504C": "#592c35",
		"505C": "#6f2c3e",
		"506C": "#83334a",
		"507C": "#d490a8",
		"508C": "#e3abbe",
		"509C": "#e8b7c7",
		"510C": "#ebc0cc",
		"511C": "#5e2750",
		"5115C": "#4b2942",
		"512C": "#77216f",
		"5125C": "#6a4061",
		"513C": "#8e258d",
		"5135C": "#865f7f",
		"514C": "#d28ac8",
		"5145C": "#9f7f9a",
		"515C": "#e1aad7",
		"5155C": "#c2acbe",
		"516C": "#e8bcdd",
		"5165C": "#d5c5d1",
		"517C": "#eac7df",
		"5175C": "#d9ccd4",
		"518C": "#4f324c",
		"5185C": "#4a3242",
		"519C": "#593160",
		"5195C": "#644459",
		"520C": "#693a77",
		"5205C": "#89687c",
		"521C": "#ab8ab8",
		"5215C": "#af94a3",
		"522C": "#bea5ca",
		"5225C": "#c4afb9",
		"523C": "#ccb7d4",
		"5235C": "#d2c0c8",
		"524C": "#d7c8dc",
		"5245C": "#dfd4d7",
		"525C": "#532e60",
		"5255C": "#272445",
		"526C": "#652d86",
		"5265C": "#403b65",
		"527C": "#722ea5",
		"5275C": "#55517b",
		"528C": "#ad80d0",
		"5285C": "#8683a4",
		"529C": "#c5a3dc",
		"5295C": "#afadc3",
		"530C": "#d3b8e2",
		"5305C": "#c0bfcf",
		"531C": "#ddc6e4",
		"5315C": "#d2d3db",
		"532C": "#292c39",
		"533C": "#21314d",
		"534C": "#263f6a",
		"535C": "#92a2bd",
		"536C": "#a4b3c9",
		"537C": "#bec9d6",
		"538C": "#ced5dd",
		"539C": "#002a42",
		"5395C": "#03202f",
		"540C": "#003359",
		"5405C": "#44697d",
		"541C": "#003f72",
		"5415C": "#5c7f92",
		"542C": "#64a0c8",
		"5425C": "#7d9aaa",
		"543C": "#9ec3de",
		"5435C": "#a6bcc6",
		"544C": "#b7d2e3",
		"5445C": "#b9c9d0",
		"545C": "#c4d9e4",
		"5455C": "#c6d3d7",
		"546C": "#00333b",
		"5463C": "#002d36",
		"5467C": "#1c3632",
		"547C": "#003946",
		"5473C": "#156570",
		"5477C": "#3e5d57",
		"548C": "#004250",
		"5483C": "#589199",
		"5487C": "#627d77",
		"549C": "#5e9cae",
		"5493C": "#83afb4",
		"5497C": "#899f99",
		"550C": "#8cb8c6",
		"5503C": "#99bfc2",
		"5507C": "#a7b8b4",
		"551C": "#a1c6cf",
		"5513C": "#b5d0d1",
		"5517C": "#bac7c3",
		"552C": "#bed6db",
		"5523C": "#c3d9d7",
		"5527C": "#c9d4d0",
		"553C": "#214332",
		"5535C": "#203731",
		"554C": "#1d5c42",
		"5545C": "#496c60",
		"555C": "#206c49",
		"5555C": "#6a8a7f",
		"556C": "#70a489",
		"5565C": "#8ba69c",
		"557C": "#91baa3",
		"5575C": "#a1b9af",
		"558C": "#aac9b6",
		"5585C": "#b9ccc3",
		"559C": "#bcd4c3",
		"5595C": "#cbd9d1",
		"560C": "#23423a",
		"5605C": "#20372a",
		"561C": "#175e54",
		"5615C": "#59705d",
		"562C": "#0d776e",
		"5625C": "#718674",
		"563C": "#7bbbb2",
		"5635C": "#96a797",
		"564C": "#99ccc3",
		"5645C": "#adbbad",
		"565C": "#b5dad2",
		"5655C": "#bbc6b9",
		"566C": "#c9e3dc",
		"5665C": "#c7d1c5",
		"567C": "#1c453b",
		"568C": "#00685b",
		"569C": "#008576",
		"570C": "#79cabd",
		"571C": "#a1dad0",
		"572C": "#b2e0d6",
		"573C": "#bfe3da",
		"574C": "#435125",
		"5743C": "#404a29",
		"5747C": "#3e4519",
		"575C": "#557630",
		"5753C": "#5b6334",
		"5757C": "#6a7029",
		"576C": "#69923a",
		"5763C": "#6e7645",
		"5767C": "#898f4b",
		"577C": "#abc785",
		"5773C": "#90986b",
		"5777C": "#a3a86b",
		"578C": "#b8cf95",
		"5783C": "#a9b089",
		"5787C": "#bec292",
		"579C": "#c1d59f",
		"5793C": "#b9be9c",
		"5797C": "#cacda3",
		"580C": "#ccdbae",
		"5803C": "#cbcfb3",
		"5807C": "#d8daba",
		"581C": "#5b5617",
		"5815C": "#4b471a",
		"582C": "#878800",
		"5825C": "#827c34",
		"583C": "#a8b400",
		"5835C": "#a09b59",
		"584C": "#ced64b",
		"5845C": "#aeaa6c",
		"585C": "#dadf71",
		"5855C": "#c4c18e",
		"586C": "#dfe383",
		"5865C": "#cecca0",
		"587C": "#e3e696",
		"5875C": "#d6d4ae",
		"600C": "#edebaa",
		"601C": "#edea9c",
		"602C": "#ede98c",
		"603C": "#ece354",
		"604C": "#eade29",
		"605C": "#e1cd00",
		"606C": "#d4ba00",
		"607C": "#ebe8b1",
		"608C": "#e9e69f",
		"609C": "#e7e188",
		"610C": "#e0d760",
		"611C": "#d5c833",
		"612C": "#c2b000",
		"613C": "#b19b00",
		"614C": "#e1deae",
		"615C": "#dad69c",
		"616C": "#d3cd8b",
		"617C": "#c6bf70",
		"618C": "#aea444",
		"619C": "#9b8f2e",
		"620C": "#887b1b",
		"621C": "#d1dfd6",
		"622C": "#b7cec4",
		"623C": "#9dbcb0",
		"624C": "#7ca295",
		"625C": "#578575",
		"626C": "#2c5e4f",
		"627C": "#13352c",
		"628C": "#c1e2e5",
		"629C": "#a1d8e0",
		"630C": "#85cddb",
		"631C": "#3cb6ce",
		"632C": "#009bbb",
		"633C": "#007ea3",
		"634C": "#006890",
		"635C": "#acdee6",
		"636C": "#90d7e7",
		"637C": "#52c6e2",
		"638C": "#00afd8",
		"639C": "#0099cc",
		"640C": "#0082bb",
		"641C": "#0073b0",
		"642C": "#d3dee4",
		"643C": "#c3d3df",
		"644C": "#93b1cc",
		"645C": "#739abc",
		"646C": "#5482ab",
		"647C": "#165788",
		"648C": "#002857",
		"649C": "#d7dfe6",
		"650C": "#c5d2e0",
		"651C": "#9bb2ce",
		"652C": "#7090b7",
		"653C": "#21578a",
		"654C": "#002c5f",
		"655C": "#00204e",
		"656C": "#dae3ea",
		"657C": "#c6d6e8",
		"658C": "#a7c1e3",
		"659C": "#6f9ad3",
		"660C": "#2a6ebb",
		"661C": "#003591",
		"662C": "#001d77",
		"663C": "#e0dce3",
		"664C": "#dcd8e2",
		"665C": "#c6bdd2",
		"666C": "#a092b4",
		"667C": "#786592",
		"668C": "#614d7d",
		"669C": "#412d5d",
		"670C": "#e9d4e1",
		"671C": "#e5c0d8",
		"672C": "#dea3c8",
		"673C": "#d688b8",
		"674C": "#c55e9b",
		"675C": "#ac2973",
		"676C": "#970254",
		"677C": "#e4d0db",
		"678C": "#e0c7d7",
		"679C": "#ddbed1",
		"680C": "#c896b5",
		"681C": "#b3749a",
		"682C": "#954975",
		"683C": "#772953",
		"684C": "#e3c5d2",
		"685C": "#deb7ca",
		"686C": "#d5a5be",
		"687C": "#c286a7",
		"688C": "#b06a92",
		"689C": "#8f3f6d",
		"690C": "#641f45",
		"691C": "#e9d3d7",
		"692C": "#e2c2c7",
		"693C": "#d8aab3",
		"694C": "#c68d99",
		"695C": "#b26f7e",
		"696C": "#8e4453",
		"697C": "#823c47",
		"698C": "#efd6db",
		"699C": "#efc5ce",
		"700C": "#ebaab9",
		"701C": "#e28a9e",
		"702C": "#d06079",
		"703C": "#b5384f",
		"704C": "#a22b38",
		"705C": "#f1dbdf",
		"706C": "#f3c9d3",
		"707C": "#f4b2c1",
		"708C": "#f28ca3",
		"709C": "#ea6682",
		"710C": "#de4561",
		"711C": "#cf2f44",
		"712C": "#f8cca6",
		"713C": "#fac396",
		"714C": "#fbaf73",
		"715C": "#f69240",
		"716C": "#ec7a08",
		"717C": "#d95e00",
		"718C": "#c84e00",
		"719C": "#edcfb3",
		"720C": "#e9bf9b",
		"721C": "#e2ae81",
		"722C": "#cd894e",
		"723C": "#ba6f2e",
		"724C": "#954a09",
		"725C": "#803d0d",
		"726C": "#e5cbb1",
		"727C": "#ddb99a",
		"728C": "#d3a985",
		"729C": "#bd8a5e",
		"730C": "#a76f3e",
		"731C": "#723d14",
		"732C": "#5f3316",
		"7401C": "#f1e3bb",
		"7402C": "#ebdd9c",
		"7403C": "#e8ce79",
		"7404C": "#f3d311",
		"7405C": "#ecc200",
		"7406C": "#ebb700",
		"7407C": "#ca9b4a",
		"7408C": "#f2af00",
		"7409C": "#eeaf00",
		"7410C": "#faa671",
		"7411C": "#e1a358",
		"7412C": "#cd7a31",
		"7413C": "#d47b22",
		"7414C": "#b7621b",
		"7415C": "#e3baa4",
		"7416C": "#e0684b",
		"7417C": "#dc5034",
		"7418C": "#c24d52",
		"7419C": "#a8475a",
		"7420C": "#981f40",
		"7421C": "#5e172d",
		"7422C": "#f0d5da",
		"7423C": "#df668a",
		"7424C": "#da3d7e",
		"7425C": "#b7295a",
		"7426C": "#aa1948",
		"7427C": "#96172e",
		"7428C": "#6d2d41",
		"7429C": "#e3c4d1",
		"7430C": "#dbafc2",
		"7431C": "#cb89a5",
		"7432C": "#b56183",
		"7433C": "#a84069",
		"7434C": "#963156",
		"7435C": "#82244e",
		"7436C": "#e8d7e3",
		"7437C": "#ccb2d1",
		"7438C": "#cf9ad5",
		"7439C": "#b390bb",
		"7440C": "#a17aaa",
		"7441C": "#9760c2",
		"7442C": "#8637ba",
		"7443C": "#d8d9e5",
		"7444C": "#b6badb",
		"7445C": "#a5a2c6",
		"7446C": "#8f8dcb",
		"7447C": "#5a447a",
		"7448C": "#4a3651",
		"7449C": "#3c2639",
		"7450C": "#bcc3db",
		"7451C": "#89a8e0",
		"7452C": "#8193db",
		"7453C": "#7ba4d9",
		"7454C": "#6493b5",
		"7455C": "#4060af",
		"7456C": "#6773b6",
		"7457C": "#cae3e9",
		"7458C": "#72b5cc",
		"7459C": "#3095b4",
		"7460C": "#0089c4",
		"7461C": "#0083be",
		"7462C": "#005a8b",
		"7463C": "#003150",
		"7464C": "#a0d6d2",
		"7465C": "#35c4b5",
		"7466C": "#00b3be",
		"7467C": "#00a8b4",
		"7468C": "#00759a",
		"7469C": "#005c84",
		"7470C": "#005e6e",
		"7471C": "#80ded6",
		"7472C": "#5bbbb7",
		"7473C": "#1e9d8b",
		"7474C": "#007a87",
		"7475C": "#477f80",
		"7476C": "#005157",
		"7477C": "#22505f",
		"7478C": "#a2e6c2",
		"7479C": "#32d17e",
		"7480C": "#00c473",
		"7481C": "#00ba4c",
		"7482C": "#00a551",
		"7483C": "#275e37",
		"7484C": "#00583c",
		"7485C": "#dae5cd",
		"7486C": "#c5e5a4",
		"7487C": "#99e071",
		"7488C": "#76d750",
		"7489C": "#73af55",
		"7490C": "#6a963b",
		"7491C": "#738639",
		"7492C": "#c7d28a",
		"7493C": "#bac696",
		"7494C": "#9eb28f",
		"7495C": "#879637",
		"7496C": "#6a7f10",
		"7497C": "#756e52",
		"7498C": "#4e562b",
		"7499C": "#ede8c4",
		"7500C": "#e1d8b7",
		"7501C": "#dbceac",
		"7502C": "#d3bf96",
		"7503C": "#a79e70",
		"7504C": "#91785b",
		"7505C": "#836344",
		"7506C": "#ecdebb",
		"7507C": "#f7d6a5",
		"7508C": "#e3c08b",
		"7509C": "#d9ac6d",
		"7510C": "#c88f42",
		"7511C": "#b26f16",
		"7512C": "#a05c0f",
		"7513C": "#e6bfae",
		"7514C": "#d7a890",
		"7515C": "#c99272",
		"7516C": "#9a542e",
		"7517C": "#85421e",
		"7518C": "#6d5047",
		"7519C": "#635245",
		"7520C": "#eac4b7",
		"7521C": "#c6a693",
		"7522C": "#b6735c",
		"7523C": "#ac675e",
		"7524C": "#a5594c",
		"7525C": "#9b6e51",
		"7526C": "#8d3c1e",
		"7527C": "#dad7cb",
		"7528C": "#cac0b6",
		"7529C": "#bdb1a6",
		"7530C": "#aa9c8f",
		"7531C": "#857363",
		"7532C": "#665546",
		"7533C": "#4a3c31",
		"7534C": "#d7d3c7",
		"7535C": "#beb9a6",
		"7536C": "#aaa38e",
		"7537C": "#aeb4ab",
		"7538C": "#9ca299",
		"7539C": "#989b97",
		"7540C": "#5e6167",
		"7541C": "#e0e6e6",
		"7542C": "#acc0c6",
		"7543C": "#a4aeb5",
		"7544C": "#8996a0",
		"7545C": "#51626f",
		"7546C": "#394a58",
		"7547C": "#1a2732",
		"8003C": "#867a6e",
		"801C": "#00b0d8",
		"802C": "#5adb3c",
		"8021C": "#93776a",
		"803C": "#ffe818",
		"804C": "#ff9838",
		"805C": "#ff535a",
		"806C": "#ff10a4",
		"8062C": "#95707d",
		"807C": "#d700b2",
		"808C": "#00b28f",
		"809C": "#e2e000",
		"810C": "#ffc60d",
		"8100C": "#86788b",
		"811C": "#ff663f",
		"812C": "#ff256c",
		"813C": "#e905aa",
		"814C": "#7d5bcb",
		"8201C": "#628091",
		"8281C": "#728b89",
		"8321C": "#7b8a73",
		"871C": "#907c4b",
		"872C": "#8d744a",
		"873C": "#95774d",
		"874C": "#8e6e4d",
		"875C": "#8c674b",
		"876C": "#94664b",
		"877C": "#85888b",
		Black2C: Black2C,
		Black3C: Black3C,
		Black4C: Black4C,
		Black5C: Black5C,
		Black6C: Black6C,
		Black7C: Black7C,
		BlackC: BlackC,
		Blue072C: Blue072C,
		CoolGray1C: CoolGray1C,
		CoolGray10C: CoolGray10C,
		CoolGray11C: CoolGray11C,
		CoolGray2C: CoolGray2C,
		CoolGray3C: CoolGray3C,
		CoolGray4C: CoolGray4C,
		CoolGray5C: CoolGray5C,
		CoolGray6C: CoolGray6C,
		CoolGray7C: CoolGray7C,
		CoolGray8C: CoolGray8C,
		CoolGray9C: CoolGray9C,
		GreenC: GreenC,
		"HEXACHROME®BlackC": "#202121",
		"HEXACHROME®CyanC": "#008fd0",
		"HEXACHROME®GreenC": "#00b04a",
		"HEXACHROME®MagentaC": "#de0090",
		"HEXACHROME®OrangeC": "#ff7c00",
		"HEXACHROME®YellowC": "#ffe000",
		Orange021C: Orange021C,
		ProcessBlackC: ProcessBlackC,
		ProcessBlueC: ProcessBlueC,
		ProcessCyanC: ProcessCyanC,
		ProcessMagentaC: ProcessMagentaC,
		ProcessYellowC: ProcessYellowC,
		PurpleC: PurpleC,
		Red032C: Red032C,
		ReflexBlueC: ReflexBlueC,
		RhodamineRedC: RhodamineRedC,
		RubineRedC: RubineRedC,
		VioletC: VioletC,
		WarmGray1C: WarmGray1C,
		WarmGray10C: WarmGray10C,
		WarmGray11C: WarmGray11C,
		WarmGray2C: WarmGray2C,
		WarmGray3C: WarmGray3C,
		WarmGray4C: WarmGray4C,
		WarmGray5C: WarmGray5C,
		WarmGray6C: WarmGray6C,
		WarmGray7C: WarmGray7C,
		WarmGray8C: WarmGray8C,
		WarmGray9C: WarmGray9C,
		WarmRedC: WarmRedC,
		Yellow012C: Yellow012C,
		YellowC: YellowC
	};

	const Black2U = "#625e51";
	const Black3U = "#595c59";
	const Black4U = "#635a52";
	const Black5U = "#66585b";
	const Black6U = "#51565f";
	const Black7U = "#6c6a68";
	const BlackU = "#605b55";
	const Blue072U = "#3945a6";
	const CoolGray1U = "#e2e1dc";
	const CoolGray10U = "#7f8184";
	const CoolGray11U = "#75777b";
	const CoolGray2U = "#d4d4d0";
	const CoolGray3U = "#c5c6c4";
	const CoolGray4U = "#b5b6b6";
	const CoolGray5U = "#acadae";
	const CoolGray6U = "#a3a5a6";
	const CoolGray7U = "#98999b";
	const CoolGray8U = "#8f9193";
	const CoolGray9U = "#85878a";
	const GreenU = "#00aa87";
	const Orange021U = "#ff7334";
	const ProcessBlackU = "#555150";
	const ProcessBlueU = "#0083c5";
	const ProcessCyanU = "#009fd6";
	const ProcessMagentaU = "#d74d84";
	const ProcessYellowU = "#ffe623";
	const PurpleU = "#bd55bb";
	const Red032U = "#f35562";
	const ReflexBlueU = "#354793";
	const RhodamineRedU = "#e351a2";
	const RubineRedU = "#d4487e";
	const VioletU = "#7557b1";
	const WarmGray1U = "#e5e0d9";
	const WarmGray10U = "#7e7774";
	const WarmGray11U = "#78716e";
	const WarmGray2U = "#d7d1c9";
	const WarmGray3U = "#c3bcb4";
	const WarmGray4U = "#b5ada6";
	const WarmGray5U = "#a8a19b";
	const WarmGray6U = "#9e9791";
	const WarmGray7U = "#958e89";
	const WarmGray8U = "#8d8682";
	const WarmGray9U = "#87807c";
	const WarmRedU = "#fe615c";
	const Yellow012U = "#ffda00";
	const YellowU = "#ffe600";
	var SOLID_UNCOATED = {
		"100U": "#faef77",
		"101U": "#fdef67",
		"102U": "#ffeb33",
		"103U": "#b8a32a",
		"104U": "#998b39",
		"105U": "#817a49",
		"106U": "#ffea64",
		"107U": "#ffe552",
		"108U": "#ffdc3d",
		"109U": "#ffc702",
		"110U": "#cba128",
		"111U": "#9c8738",
		"112U": "#897a3e",
		"113U": "#ffe25f",
		"114U": "#ffdc52",
		"115U": "#ffd141",
		"116U": "#ffbc19",
		"117U": "#b89032",
		"118U": "#a0853a",
		"119U": "#847849",
		"120U": "#ffdb6d",
		"1205U": "#fee79d",
		"121U": "#ffd462",
		"1215U": "#ffe088",
		"122U": "#ffc54e",
		"1225U": "#ffbf57",
		"123U": "#ffb02e",
		"1235U": "#ffae3e",
		"124U": "#de9631",
		"1245U": "#bc9045",
		"125U": "#a7823d",
		"1255U": "#a18348",
		"126U": "#917942",
		"1265U": "#8c784c",
		"127U": "#f9e17e",
		"128U": "#f9d465",
		"129U": "#f7b446",
		"130U": "#f39b31",
		"131U": "#c38834",
		"132U": "#95783a",
		"133U": "#766b44",
		"134U": "#ffd57c",
		"1345U": "#ffd390",
		"135U": "#ffc66c",
		"1355U": "#ffc981",
		"136U": "#ffaf51",
		"1365U": "#ffb060",
		"137U": "#ff9f3c",
		"1375U": "#ff9b47",
		"138U": "#da8134",
		"1385U": "#cf8042",
		"139U": "#a7763d",
		"1395U": "#9b7245",
		"140U": "#846e48",
		"1405U": "#7f6949",
		"141U": "#f7c26b",
		"142U": "#f6b25e",
		"143U": "#f4a251",
		"144U": "#ef8c40",
		"145U": "#c67e3e",
		"146U": "#9a7340",
		"147U": "#796c4e",
		"148U": "#ffc788",
		"1485U": "#ffa96e",
		"149U": "#ffb876",
		"1495U": "#ff9657",
		"150U": "#ff9551",
		"1505U": "#ff8442",
		"151U": "#ff8843",
		"152U": "#de783e",
		"1525U": "#c5683b",
		"153U": "#ab6d42",
		"1535U": "#9b6544",
		"154U": "#926744",
		"1545U": "#7a5c46",
		"155U": "#f5cf9a",
		"1555U": "#ffc6a5",
		"156U": "#f3bb84",
		"1565U": "#ffae88",
		"157U": "#ee9461",
		"1575U": "#ff966d",
		"158U": "#e9804f",
		"1585U": "#ff8355",
		"159U": "#c9754a",
		"1595U": "#d0704b",
		"160U": "#9e6b48",
		"1605U": "#a46a4f",
		"161U": "#7c654c",
		"1615U": "#92654d",
		"162U": "#ffc0a1",
		"1625U": "#ffa48e",
		"163U": "#ff9b79",
		"1635U": "#ff957d",
		"164U": "#ff8562",
		"1645U": "#ff8269",
		"165U": "#ff764f",
		"1655U": "#ff7253",
		"166U": "#df6c4b",
		"1665U": "#df674c",
		"167U": "#b5664c",
		"1675U": "#a9624f",
		"168U": "#88604e",
		"1685U": "#925f4e",
		"169U": "#ffb9af",
		"170U": "#ff8e81",
		"171U": "#ff7868",
		"172U": "#ff6852",
		"173U": "#cd6250",
		"174U": "#9c5b4d",
		"175U": "#825b51",
		"176U": "#ffb1b9",
		"1765U": "#ffa4b2",
		"1767U": "#ffb8c5",
		"177U": "#ff8c92",
		"1775U": "#ff8a99",
		"1777U": "#fe8193",
		"178U": "#ff7577",
		"1785U": "#fa6672",
		"1787U": "#f96778",
		"1788U": "#f55d65",
		"179U": "#de5d5a",
		"1795U": "#d8595e",
		"1797U": "#ca535c",
		"180U": "#bb5c5a",
		"1805U": "#af5556",
		"1807U": "#a7575f",
		"181U": "#8b5654",
		"1815U": "#905554",
		"1817U": "#765455",
		"182U": "#ffb6c6",
		"183U": "#ff8ea3",
		"184U": "#f96f85",
		"185U": "#ec4f61",
		"186U": "#cd505e",
		"187U": "#af525c",
		"188U": "#875359",
		"189U": "#fea6bd",
		"1895U": "#fbb0c7",
		"190U": "#fa839e",
		"1905U": "#f995b3",
		"191U": "#f26580",
		"1915U": "#ee6688",
		"192U": "#e84f68",
		"1925U": "#e44d6d",
		"193U": "#bc4e60",
		"1935U": "#c64a64",
		"194U": "#9a515e",
		"1945U": "#a64d61",
		"195U": "#80535b",
		"1955U": "#975060",
		"196U": "#f2c4ca",
		"197U": "#ee9eac",
		"198U": "#e36c7f",
		"199U": "#d85266",
		"200U": "#b94e5e",
		"201U": "#a15562",
		"202U": "#8b535d",
		"203U": "#efabc3",
		"204U": "#e980a1",
		"205U": "#e06184",
		"206U": "#d4486a",
		"207U": "#ad4c66",
		"208U": "#8f5366",
		"209U": "#805462",
		"210U": "#ff9cc6",
		"211U": "#fa81b2",
		"212U": "#f46ea1",
		"213U": "#e65385",
		"214U": "#cb4e78",
		"215U": "#a94f6f",
		"216U": "#885365",
		"217U": "#f2bdda",
		"218U": "#eb88bb",
		"219U": "#de5d94",
		"220U": "#ad4b74",
		"221U": "#9c4b6e",
		"222U": "#85566c",
		"223U": "#f8a4d6",
		"224U": "#f285c4",
		"225U": "#e760a5",
		"226U": "#d74487",
		"227U": "#b04579",
		"228U": "#914e71",
		"229U": "#7e5467",
		"230U": "#feacdc",
		"231U": "#f880c7",
		"232U": "#ee64b3",
		"233U": "#c94d92",
		"234U": "#aa5082",
		"235U": "#944e74",
		"236U": "#f7a5dd",
		"2365U": "#f7c5e6",
		"237U": "#f085cf",
		"2375U": "#e884d0",
		"238U": "#e669be",
		"2385U": "#dd68c0",
		"239U": "#d94faa",
		"2395U": "#d255b2",
		"240U": "#bc4f97",
		"2405U": "#b9519d",
		"241U": "#a84f89",
		"2415U": "#a75090",
		"242U": "#8c5475",
		"2425U": "#965182",
		"243U": "#eeace1",
		"244U": "#e795d9",
		"245U": "#de7fcf",
		"246U": "#cc56b6",
		"247U": "#b74ca2",
		"248U": "#9e4e8e",
		"249U": "#865478",
		"250U": "#ebbce5",
		"251U": "#dc94db",
		"252U": "#ca6cc9",
		"253U": "#b455b3",
		"254U": "#9d549c",
		"255U": "#82567f",
		"256U": "#d9badd",
		"2562U": "#d8ade5",
		"2563U": "#c59dd3",
		"2567U": "#ba9bd5",
		"257U": "#c49dcc",
		"2572U": "#c893dd",
		"2573U": "#b488c6",
		"2577U": "#a07dc3",
		"258U": "#a278ad",
		"2582U": "#b477ce",
		"2583U": "#a476b7",
		"2587U": "#906cb4",
		"259U": "#91689c",
		"2592U": "#a360bf",
		"2593U": "#895c9e",
		"2597U": "#7e59a2",
		"260U": "#88658d",
		"2602U": "#9458a8",
		"2603U": "#7f578e",
		"2607U": "#785895",
		"261U": "#7c5e7e",
		"2612U": "#83578d",
		"2613U": "#7a5686",
		"2617U": "#75568d",
		"262U": "#775d75",
		"2622U": "#7b5d7c",
		"2623U": "#74547b",
		"2627U": "#715682",
		"263U": "#dbc9ea",
		"2635U": "#c5b5e5",
		"264U": "#b8a1e2",
		"2645U": "#b4a1e0",
		"265U": "#957ad0",
		"2655U": "#9c85d3",
		"266U": "#8363c0",
		"2665U": "#876cc3",
		"267U": "#775ba7",
		"268U": "#6f588d",
		"2685U": "#6b529b",
		"269U": "#6c597f",
		"2695U": "#6a5a7f",
		"270U": "#aeaedb",
		"2705U": "#b7b4e7",
		"2706U": "#ccd3eb",
		"2707U": "#bed5ef",
		"2708U": "#abc3e8",
		"271U": "#9e9ed3",
		"2715U": "#9a95db",
		"2716U": "#a3aee4",
		"2717U": "#a7c6ee",
		"2718U": "#6984d1",
		"272U": "#8686c2",
		"2725U": "#857dce",
		"2726U": "#7077ca",
		"2727U": "#5c87dc",
		"2728U": "#4f63b8",
		"273U": "#605893",
		"2735U": "#5e50a7",
		"2736U": "#5a5ab1",
		"2738U": "#424899",
		"274U": "#5a5284",
		"2745U": "#584f92",
		"2746U": "#55589e",
		"2747U": "#3c4a84",
		"2748U": "#444b83",
		"275U": "#564e78",
		"2755U": "#554e85",
		"2756U": "#535686",
		"2757U": "#3e4a76",
		"2758U": "#454b78",
		"276U": "#5a536d",
		"2765U": "#534d77",
		"2766U": "#535577",
		"2767U": "#484f68",
		"2768U": "#454968",
		"277U": "#aacceb",
		"278U": "#8cb8e7",
		"279U": "#6193d9",
		"280U": "#3c4f85",
		"281U": "#3e4d75",
		"282U": "#404965",
		"283U": "#a1caec",
		"284U": "#79afe6",
		"285U": "#4882d0",
		"286U": "#2f58a7",
		"287U": "#345290",
		"288U": "#364f81",
		"289U": "#3f4b65",
		"290U": "#aed7eb",
		"2905U": "#88c8ea",
		"291U": "#86c1ea",
		"2915U": "#61b1e3",
		"292U": "#62a9e3",
		"2925U": "#3b95d8",
		"293U": "#225eac",
		"2935U": "#1661ad",
		"294U": "#325a89",
		"2945U": "#265b91",
		"295U": "#385475",
		"2955U": "#355777",
		"296U": "#415061",
		"2965U": "#3b5065",
		"297U": "#7acaeb",
		"2975U": "#8dd7ea",
		"298U": "#51b6e6",
		"2985U": "#3eb8e5",
		"299U": "#0193d5",
		"2995U": "#009dda",
		"300U": "#006eb7",
		"3005U": "#0076bd",
		"301U": "#0f6292",
		"3015U": "#006795",
		"302U": "#305b75",
		"3025U": "#2b5c74",
		"303U": "#3a5565",
		"3035U": "#365463",
		"304U": "#8fddea",
		"305U": "#5ccdeb",
		"306U": "#00b6e3",
		"307U": "#0073a4",
		"308U": "#02617e",
		"309U": "#345460",
		"310U": "#68d2e5",
		"3105U": "#58d0dd",
		"311U": "#26c2dd",
		"3115U": "#04c1d4",
		"312U": "#00afd1",
		"3125U": "#00acc4",
		"313U": "#0090b6",
		"3135U": "#0092ac",
		"314U": "#007b9b",
		"3145U": "#00778a",
		"315U": "#006679",
		"3155U": "#006877",
		"316U": "#365860",
		"3165U": "#245d67",
		"317U": "#b0e9e5",
		"318U": "#6dd9db",
		"319U": "#33cbd0",
		"320U": "#009fa8",
		"321U": "#008289",
		"322U": "#046e73",
		"323U": "#2a6166",
		"324U": "#8adbd5",
		"3242U": "#70ded4",
		"3245U": "#69dfcd",
		"3248U": "#75d3c0",
		"325U": "#46c4bc",
		"3252U": "#34d1c6",
		"3255U": "#1fd2bd",
		"3258U": "#4dc5ae",
		"326U": "#00aba0",
		"3262U": "#00bdb0",
		"3265U": "#00c3ab",
		"3268U": "#10b197",
		"327U": "#008d7e",
		"3272U": "#00a599",
		"3275U": "#00ab94",
		"3278U": "#009d7f",
		"328U": "#007a72",
		"3282U": "#008b83",
		"3285U": "#009282",
		"3288U": "#068974",
		"329U": "#1c6f6a",
		"3292U": "#346d69",
		"3295U": "#248579",
		"3298U": "#2e7064",
		"330U": "#406060",
		"3302U": "#426461",
		"3305U": "#466862",
		"3308U": "#43605b",
		"331U": "#96e8d2",
		"332U": "#77e2c9",
		"333U": "#00d0b1",
		"334U": "#009378",
		"335U": "#237d6c",
		"336U": "#387165",
		"337U": "#7bd4b7",
		"3375U": "#70e1b9",
		"338U": "#4ac19e",
		"3385U": "#3dd5a5",
		"339U": "#0cab85",
		"3395U": "#00c992",
		"340U": "#009d77",
		"3405U": "#00b57c",
		"341U": "#2e7864",
		"3415U": "#318268",
		"342U": "#3b6f61",
		"3425U": "#3d715e",
		"343U": "#45635d",
		"3435U": "#446256",
		"344U": "#90dbaf",
		"345U": "#76d2a0",
		"346U": "#4dc088",
		"347U": "#009f66",
		"348U": "#278558",
		"349U": "#407056",
		"350U": "#4b6052",
		"351U": "#88e4a8",
		"352U": "#6ede9a",
		"353U": "#51d68b",
		"354U": "#00a958",
		"355U": "#009454",
		"356U": "#367a52",
		"357U": "#4f6b56",
		"358U": "#91d784",
		"359U": "#81d07a",
		"360U": "#5ebd63",
		"361U": "#4aad52",
		"362U": "#4c904b",
		"363U": "#52854c",
		"364U": "#527549",
		"365U": "#bce58c",
		"366U": "#a9de7c",
		"367U": "#8fd268",
		"368U": "#61b544",
		"369U": "#60a144",
		"370U": "#618845",
		"371U": "#63714b",
		"372U": "#d4ee8c",
		"373U": "#bae86a",
		"374U": "#a6e259",
		"375U": "#74c830",
		"376U": "#6ea634",
		"377U": "#718c3f",
		"378U": "#6c734a",
		"379U": "#e1ec71",
		"380U": "#d1e458",
		"381U": "#b6d840",
		"382U": "#99c525",
		"383U": "#8a9a36",
		"384U": "#81883c",
		"385U": "#7b7a4b",
		"386U": "#ecf073",
		"387U": "#e2ec56",
		"388U": "#d4e741",
		"389U": "#bbdb0c",
		"390U": "#97a825",
		"391U": "#87893a",
		"392U": "#7c7b42",
		"393U": "#f6f283",
		"3935U": "#f9f27c",
		"394U": "#edec4b",
		"3945U": "#f8ed4e",
		"395U": "#e9ea3f",
		"3955U": "#f4e827",
		"396U": "#d8e100",
		"3965U": "#ede100",
		"397U": "#a9aa23",
		"3975U": "#b1a42c",
		"398U": "#97942e",
		"3985U": "#978c3d",
		"399U": "#8b8739",
		"3995U": "#7b7442",
		"400U": "#c5bfb6",
		"401U": "#b4aea6",
		"402U": "#a09a93",
		"403U": "#948e88",
		"404U": "#857f79",
		"405U": "#726c67",
		"406U": "#c3b8b1",
		"407U": "#aba19b",
		"408U": "#998f8a",
		"409U": "#8d8481",
		"410U": "#857c79",
		"411U": "#716967",
		"412U": "#625957",
		"413U": "#bebdb1",
		"414U": "#a9a89e",
		"415U": "#98988f",
		"416U": "#8b8b84",
		"417U": "#83837d",
		"418U": "#75756f",
		"419U": "#575652",
		"420U": "#c8c8c4",
		"421U": "#afb0ae",
		"422U": "#a2a3a3",
		"423U": "#919394",
		"424U": "#7f8182",
		"425U": "#707274",
		"426U": "#595859",
		"427U": "#c8cbcb",
		"428U": "#afb4b6",
		"429U": "#949a9f",
		"430U": "#7c848a",
		"431U": "#6b7178",
		"432U": "#61666c",
		"433U": "#55565c",
		"434U": "#d4c9c9",
		"435U": "#bbabae",
		"436U": "#a7969b",
		"437U": "#88787d",
		"438U": "#75666a",
		"439U": "#6b5f61",
		"440U": "#665d5c",
		"441U": "#bec6c2",
		"442U": "#a9b1b0",
		"443U": "#969d9e",
		"444U": "#7e8587",
		"445U": "#6a7072",
		"446U": "#65696a",
		"447U": "#5e5f5e",
		"448U": "#6c6857",
		"4485U": "#766b4c",
		"449U": "#6f6d56",
		"4495U": "#8a7e5b",
		"450U": "#747356",
		"4505U": "#9c8f6a",
		"451U": "#929275",
		"4515U": "#b1a47b",
		"452U": "#acac8c",
		"4525U": "#c1b58a",
		"453U": "#bcbc9c",
		"4535U": "#d0c59b",
		"454U": "#cbcaab",
		"4545U": "#dbd1a9",
		"455U": "#766d49",
		"456U": "#948447",
		"457U": "#a99141",
		"458U": "#d1bb65",
		"459U": "#dfcd77",
		"460U": "#e8da88",
		"461U": "#eee39c",
		"462U": "#756954",
		"4625U": "#765948",
		"463U": "#837053",
		"4635U": "#967360",
		"464U": "#988059",
		"4645U": "#9f7a68",
		"465U": "#af9771",
		"4655U": "#b28b78",
		"466U": "#bda67d",
		"4665U": "#caa58f",
		"467U": "#ceba90",
		"4675U": "#dbbaa3",
		"468U": "#dccca4",
		"4685U": "#e7ceb8",
		"469U": "#7b5e4b",
		"4695U": "#735950",
		"470U": "#9d6a4e",
		"4705U": "#856a62",
		"471U": "#be7854",
		"4715U": "#997c73",
		"472U": "#da9170",
		"4725U": "#ab8d83",
		"473U": "#ecaa87",
		"4735U": "#bda195",
		"474U": "#f4bf9c",
		"4745U": "#ceb4a7",
		"475U": "#f8cbaa",
		"4755U": "#dcc7b9",
		"476U": "#6f5e55",
		"477U": "#765e54",
		"478U": "#8c6c5d",
		"479U": "#a88779",
		"480U": "#c3a493",
		"481U": "#d0b5a2",
		"482U": "#ddc7b3",
		"483U": "#7f5d52",
		"484U": "#a05d51",
		"485U": "#de5c51",
		"486U": "#ed8f80",
		"487U": "#efa190",
		"488U": "#f2b8a6",
		"489U": "#f3cab7",
		"490U": "#805a5c",
		"491U": "#8f5b5e",
		"492U": "#9e5f64",
		"493U": "#c87e8b",
		"494U": "#e39ca9",
		"495U": "#eeafbb",
		"496U": "#f6c2cb",
		"497U": "#735957",
		"4975U": "#745757",
		"498U": "#825c5c",
		"4985U": "#926d73",
		"499U": "#8e6060",
		"4995U": "#9d777d",
		"500U": "#be888e",
		"5005U": "#b28a90",
		"501U": "#d6a2a8",
		"5015U": "#c9a1a7",
		"502U": "#e7b9be",
		"5025U": "#dcb9bc",
		"503U": "#f0cdcf",
		"5035U": "#e8cdcd",
		"504U": "#7f5c61",
		"505U": "#875962",
		"506U": "#975f6c",
		"507U": "#c48397",
		"508U": "#db9baf",
		"509U": "#e7abbd",
		"510U": "#f0bfcb",
		"511U": "#735267",
		"5115U": "#705767",
		"512U": "#87547e",
		"5125U": "#7f6579",
		"513U": "#9b5a97",
		"5135U": "#8c7387",
		"514U": "#c881bf",
		"5145U": "#a48a9f",
		"515U": "#de9ed1",
		"5155U": "#bea5b7",
		"516U": "#eab3db",
		"5165U": "#cfb9c7",
		"517U": "#f1c7e1",
		"5175U": "#ddccd5",
		"518U": "#6c5a6a",
		"5185U": "#6e5a64",
		"519U": "#705975",
		"5195U": "#7a6572",
		"520U": "#7b5f85",
		"5205U": "#907b89",
		"521U": "#a68ab2",
		"5215U": "#a48d9c",
		"522U": "#b89dc3",
		"5225U": "#bca6b3",
		"523U": "#c9b1d1",
		"5235U": "#d7c5ce",
		"524U": "#d9c7db",
		"5245U": "#decfd5",
		"525U": "#6e5676",
		"5255U": "#5a536a",
		"526U": "#79578f",
		"5265U": "#6a657f",
		"527U": "#895eaf",
		"5275U": "#77738f",
		"528U": "#ad85ce",
		"5285U": "#9390ab",
		"529U": "#c6a3de",
		"5295U": "#adaac2",
		"530U": "#d5b4e4",
		"5305U": "#c4c1d3",
		"531U": "#e1c5e7",
		"5315U": "#d4d2dd",
		"532U": "#5b5b65",
		"533U": "#596174",
		"534U": "#5d6884",
		"535U": "#8e9cb7",
		"536U": "#a6b2c9",
		"537U": "#bec7d7",
		"538U": "#d1d7e0",
		"539U": "#414d5f",
		"5395U": "#454c5a",
		"540U": "#3c536f",
		"5405U": "#576a79",
		"541U": "#37597c",
		"5415U": "#677c8c",
		"542U": "#6193bc",
		"5425U": "#7e95a4",
		"543U": "#81afd1",
		"5435U": "#9db2be",
		"544U": "#98bfdb",
		"5445U": "#b7c8d0",
		"545U": "#bbd5e6",
		"5455U": "#cbd8dc",
		"546U": "#44525b",
		"5463U": "#374a52",
		"5467U": "#515d5d",
		"547U": "#405c69",
		"5473U": "#4d6e76",
		"5477U": "#5c6d6d",
		"548U": "#3b606e",
		"5483U": "#61868d",
		"5487U": "#6c7e7e",
		"549U": "#6e9eaf",
		"5493U": "#7aa1a8",
		"5497U": "#849795",
		"550U": "#7fadbc",
		"5503U": "#9dc0c4",
		"5507U": "#a0b1ae",
		"551U": "#99c0cc",
		"5513U": "#b6d2d3",
		"5517U": "#adbcb9",
		"552U": "#b6d3da",
		"5523U": "#c7dcdb",
		"5527U": "#c1cdc8",
		"553U": "#526158",
		"5535U": "#44524f",
		"554U": "#4d6b5c",
		"5545U": "#637771",
		"555U": "#537b66",
		"5555U": "#778c85",
		"556U": "#749f8d",
		"5565U": "#8da39b",
		"557U": "#8cb4a1",
		"5575U": "#a0b6ad",
		"558U": "#9bc0ac",
		"5585U": "#b6c9c0",
		"559U": "#b7d2c0",
		"5595U": "#cbd9d0",
		"560U": "#4e605d",
		"5605U": "#58635a",
		"561U": "#4b706b",
		"5615U": "#616e67",
		"562U": "#4b837d",
		"5625U": "#728179",
		"563U": "#7fb7ae",
		"5635U": "#8b9a8f",
		"564U": "#91c6bd",
		"5645U": "#9eada1",
		"565U": "#a9d6cc",
		"5655U": "#b4c0b4",
		"566U": "#bae0d5",
		"5665U": "#c3cdc0",
		"567U": "#4f6762",
		"568U": "#46776f",
		"569U": "#3b8a80",
		"570U": "#67baac",
		"571U": "#86cfc1",
		"572U": "#a3ddd0",
		"573U": "#b7e4d8",
		"574U": "#666e52",
		"5743U": "#636851",
		"5747U": "#676c4a",
		"575U": "#677d50",
		"5753U": "#717760",
		"5757U": "#7a7e5a",
		"576U": "#6f8f56",
		"5763U": "#7d846c",
		"5767U": "#8f946c",
		"577U": "#8eb077",
		"5773U": "#979d81",
		"5777U": "#a4a87c",
		"578U": "#a9c58c",
		"5783U": "#abb294",
		"5787U": "#bcc094",
		"579U": "#bbd29b",
		"5793U": "#c1c6a9",
		"5797U": "#c8cba1",
		"580U": "#cedeb0",
		"5803U": "#ced1b6",
		"5807U": "#d8dab6",
		"581U": "#716f47",
		"5815U": "#696747",
		"582U": "#878b43",
		"5825U": "#84805a",
		"583U": "#9fad3e",
		"5835U": "#928e67",
		"584U": "#cbd465",
		"5845U": "#a6a276",
		"585U": "#dce17e",
		"5855U": "#bbb88a",
		"586U": "#e4e790",
		"5865U": "#cdca9f",
		"587U": "#e8ea9d",
		"5875U": "#d9d6af",
		"600U": "#f3efa6",
		"601U": "#f3ee9d",
		"602U": "#f3ed92",
		"603U": "#f2e770",
		"604U": "#eddd50",
		"605U": "#e0cb2d",
		"606U": "#d0b91e",
		"607U": "#f1edb0",
		"608U": "#efeaa2",
		"609U": "#eae38c",
		"610U": "#e0d673",
		"611U": "#cabd54",
		"612U": "#baac49",
		"613U": "#a2943b",
		"614U": "#e2ddaa",
		"615U": "#dcd7a2",
		"616U": "#cdc68a",
		"617U": "#bdb579",
		"618U": "#a8a067",
		"619U": "#918a56",
		"620U": "#847d4d",
		"621U": "#c9dbd1",
		"622U": "#b4cdc2",
		"623U": "#99b6ac",
		"624U": "#81a096",
		"625U": "#69867e",
		"626U": "#556e68",
		"627U": "#445954",
		"628U": "#bde3e7",
		"629U": "#98d5e0",
		"630U": "#6dc3d7",
		"631U": "#55b2cb",
		"632U": "#329ab7",
		"633U": "#1f819e",
		"634U": "#086e8c",
		"635U": "#abe2ee",
		"636U": "#88d7eb",
		"637U": "#56c6e5",
		"638U": "#10b1da",
		"639U": "#009bca",
		"640U": "#0084b5",
		"641U": "#0078ab",
		"642U": "#cad9e5",
		"643U": "#b1c6db",
		"644U": "#8ca9c7",
		"645U": "#7795b7",
		"646U": "#6380a2",
		"647U": "#516a8b",
		"648U": "#465776",
		"649U": "#d3dde8",
		"650U": "#c1cfe1",
		"651U": "#9fb3cf",
		"652U": "#7d95b7",
		"653U": "#5e7599",
		"654U": "#4b5b7c",
		"655U": "#485475",
		"656U": "#d5e0ed",
		"657U": "#c3d4eb",
		"658U": "#a8c1e5",
		"659U": "#85a5d8",
		"660U": "#5d7ebc",
		"661U": "#445e9c",
		"662U": "#3c4c86",
		"663U": "#e0dae4",
		"664U": "#d5cddd",
		"665U": "#c3b9d0",
		"666U": "#b0a4c0",
		"667U": "#8c80a0",
		"668U": "#807394",
		"669U": "#726483",
		"670U": "#eed3e4",
		"671U": "#ebc6de",
		"672U": "#e1a3c9",
		"673U": "#d78bb7",
		"674U": "#c875a2",
		"675U": "#b9638e",
		"676U": "#a35077",
		"677U": "#e7cfdc",
		"678U": "#e1c1d4",
		"679U": "#d7b0c8",
		"680U": "#be8ba9",
		"681U": "#a3708d",
		"682U": "#91607b",
		"683U": "#7f5067",
		"684U": "#eacbd9",
		"685U": "#e4bdd0",
		"686U": "#d1a0ba",
		"687U": "#be89a6",
		"688U": "#a5718e",
		"689U": "#92607b",
		"690U": "#84566b",
		"691U": "#edd3d7",
		"692U": "#e4bdc4",
		"693U": "#d3a2ac",
		"694U": "#c18e98",
		"695U": "#a3737d",
		"696U": "#91646c",
		"697U": "#855a60",
		"698U": "#f5d1d8",
		"699U": "#f3bfca",
		"700U": "#eca4b2",
		"701U": "#de8a9a",
		"702U": "#cb7484",
		"703U": "#af5d6a",
		"704U": "#a2555f",
		"705U": "#f8d5dd",
		"706U": "#f9c9d4",
		"707U": "#f9abbb",
		"708U": "#f493a5",
		"709U": "#e97688",
		"710U": "#d86171",
		"711U": "#cc5663",
		"712U": "#ffcba3",
		"713U": "#ffbd8f",
		"714U": "#feaf7d",
		"715U": "#f59662",
		"716U": "#e88554",
		"717U": "#d57444",
		"718U": "#c96a3c",
		"719U": "#f2ccad",
		"720U": "#edc19e",
		"721U": "#e2ad87",
		"722U": "#cc916d",
		"723U": "#bc8360",
		"724U": "#a16d4d",
		"725U": "#926243",
		"726U": "#ecd0b6",
		"727U": "#dfbc9f",
		"728U": "#cba184",
		"729U": "#bc9377",
		"730U": "#a57e64",
		"731U": "#916d54",
		"732U": "#805f48",
		"7401U": "#f8e3af",
		"7402U": "#f1de9b",
		"7403U": "#edcd82",
		"7404U": "#f8ce43",
		"7405U": "#e2ad15",
		"7406U": "#edb72b",
		"7407U": "#cda36f",
		"7408U": "#e99526",
		"7409U": "#f2ad50",
		"7410U": "#fea97e",
		"7411U": "#e5a371",
		"7412U": "#ce8b62",
		"7413U": "#d68658",
		"7414U": "#c5835a",
		"7415U": "#e7b5a1",
		"7416U": "#e47669",
		"7417U": "#df685d",
		"7418U": "#bd686b",
		"7419U": "#a0616b",
		"7420U": "#a4596a",
		"7421U": "#7a4a59",
		"7422U": "#f7d3d9",
		"7423U": "#df758f",
		"7424U": "#d4567e",
		"7425U": "#ba5b74",
		"7426U": "#b1546b",
		"7427U": "#9b4c58",
		"7428U": "#825d69",
		"7429U": "#e9cad7",
		"7430U": "#e0b3c5",
		"7431U": "#d69fb5",
		"7432U": "#be7e96",
		"7433U": "#b36c84",
		"7434U": "#a6657c",
		"7435U": "#895369",
		"7436U": "#ebd4e6",
		"7437U": "#d3b7d6",
		"7438U": "#ce97d3",
		"7439U": "#be9fc5",
		"7440U": "#ad8eb3",
		"7441U": "#a880cb",
		"7442U": "#9660bf",
		"7443U": "#dfddeb",
		"7444U": "#bcbee0",
		"7445U": "#a8a5c9",
		"7446U": "#9493cd",
		"7447U": "#756a8b",
		"7448U": "#695f6e",
		"7449U": "#5b4a56",
		"7450U": "#bcc4db",
		"7451U": "#92aee5",
		"7452U": "#8d9be0",
		"7453U": "#88aade",
		"7454U": "#7597b8",
		"7455U": "#6573b0",
		"7456U": "#7c85ba",
		"7457U": "#c6e5ed",
		"7458U": "#6baac3",
		"7459U": "#5292ad",
		"7460U": "#0090c4",
		"7461U": "#4493c5",
		"7462U": "#51779c",
		"7463U": "#51667e",
		"7464U": "#a8dbd8",
		"7465U": "#4ec6b7",
		"7466U": "#00b2bc",
		"7467U": "#00a9b3",
		"7468U": "#3b738f",
		"7469U": "#366a86",
		"7470U": "#447280",
		"7471U": "#80e1d8",
		"7472U": "#6fbfbb",
		"7473U": "#5fa79a",
		"7474U": "#468d97",
		"7475U": "#6f9092",
		"7476U": "#57767b",
		"7477U": "#5d737d",
		"7478U": "#a0e8c2",
		"7479U": "#33ca7e",
		"7480U": "#00c27e",
		"7481U": "#00bc6d",
		"7482U": "#29ab72",
		"7483U": "#56735e",
		"7484U": "#446c5d",
		"7485U": "#e1ebd4",
		"7486U": "#b9e49b",
		"7487U": "#8ade77",
		"7488U": "#63cd58",
		"7489U": "#7fb072",
		"7490U": "#7a9d6a",
		"7491U": "#808d64",
		"7492U": "#c3d092",
		"7493U": "#bdc89c",
		"7494U": "#a3b596",
		"7495U": "#7e8b59",
		"7496U": "#728246",
		"7497U": "#878374",
		"7498U": "#717660",
		"7499U": "#f4edca",
		"7500U": "#e7dcba",
		"7501U": "#decead",
		"7502U": "#c5ab85",
		"7503U": "#9d9576",
		"7504U": "#917f71",
		"7505U": "#887466",
		"7506U": "#f3e4c4",
		"7507U": "#fddcb2",
		"7508U": "#dfb487",
		"7509U": "#d4a479",
		"7510U": "#ba8861",
		"7511U": "#9f7250",
		"7512U": "#926644",
		"7513U": "#e8baac",
		"7514U": "#d8a896",
		"7515U": "#bf8e7c",
		"7516U": "#9d6e5c",
		"7517U": "#8b604f",
		"7518U": "#7c6d6b",
		"7519U": "#6e635e",
		"7520U": "#edc1b7",
		"7521U": "#c3a095",
		"7522U": "#a8746e",
		"7523U": "#a67775",
		"7524U": "#a1706a",
		"7525U": "#97776d",
		"7526U": "#8f5a4e",
		"7527U": "#dcd8cc",
		"7528U": "#d3c9c0",
		"7529U": "#c0b4aa",
		"7530U": "#ac9f95",
		"7531U": "#887d74",
		"7532U": "#71665d",
		"7533U": "#675d53",
		"7534U": "#d6d1c4",
		"7535U": "#c2bdad",
		"7536U": "#b1ab9a",
		"7537U": "#b3b8b1",
		"7538U": "#a5a9a3",
		"7539U": "#9c9f9e",
		"7540U": "#6d7076",
		"7541U": "#e3e8e9",
		"7542U": "#b3c5cb",
		"7543U": "#b0b8be",
		"7544U": "#9da6ae",
		"7545U": "#7b858e",
		"7546U": "#676f79",
		"7547U": "#5a5f69",
		"8003U": "#b3a59a",
		"801U": "#009cc7",
		"802U": "#66d74d",
		"8021U": "#b0a4a1",
		"803U": "#ffe63c",
		"804U": "#ffa055",
		"805U": "#ff5b65",
		"806U": "#ff2a9d",
		"8062U": "#ad989e",
		"807U": "#d12bb2",
		"808U": "#00af91",
		"809U": "#e5e334",
		"810U": "#ffcb3c",
		"8100U": "#afa6b2",
		"811U": "#ff785c",
		"812U": "#ff3f76",
		"813U": "#e12ca4",
		"814U": "#8568c8",
		"8201U": "#95a7b5",
		"8281U": "#9facab",
		"8321U": "#a4aca3",
		"871U": "#ac946b",
		"872U": "#ae946f",
		"873U": "#ae906e",
		"874U": "#b39376",
		"875U": "#b59077",
		"876U": "#b48a72",
		"877U": "#b4b6b9",
		Black2U: Black2U,
		Black3U: Black3U,
		Black4U: Black4U,
		Black5U: Black5U,
		Black6U: Black6U,
		Black7U: Black7U,
		BlackU: BlackU,
		Blue072U: Blue072U,
		CoolGray1U: CoolGray1U,
		CoolGray10U: CoolGray10U,
		CoolGray11U: CoolGray11U,
		CoolGray2U: CoolGray2U,
		CoolGray3U: CoolGray3U,
		CoolGray4U: CoolGray4U,
		CoolGray5U: CoolGray5U,
		CoolGray6U: CoolGray6U,
		CoolGray7U: CoolGray7U,
		CoolGray8U: CoolGray8U,
		CoolGray9U: CoolGray9U,
		GreenU: GreenU,
		"HEXACHROME®BlackU": "#524f4d",
		"HEXACHROME®CyanU": "#0097d1",
		"HEXACHROME®GreenU": "#00b166",
		"HEXACHROME®MagentaU": "#df3e91",
		"HEXACHROME®OrangeU": "#ff7e38",
		"HEXACHROME®YellowU": "#ffe210",
		Orange021U: Orange021U,
		ProcessBlackU: ProcessBlackU,
		ProcessBlueU: ProcessBlueU,
		ProcessCyanU: ProcessCyanU,
		ProcessMagentaU: ProcessMagentaU,
		ProcessYellowU: ProcessYellowU,
		PurpleU: PurpleU,
		Red032U: Red032U,
		ReflexBlueU: ReflexBlueU,
		RhodamineRedU: RhodamineRedU,
		RubineRedU: RubineRedU,
		VioletU: VioletU,
		WarmGray1U: WarmGray1U,
		WarmGray10U: WarmGray10U,
		WarmGray11U: WarmGray11U,
		WarmGray2U: WarmGray2U,
		WarmGray3U: WarmGray3U,
		WarmGray4U: WarmGray4U,
		WarmGray5U: WarmGray5U,
		WarmGray6U: WarmGray6U,
		WarmGray7U: WarmGray7U,
		WarmGray8U: WarmGray8U,
		WarmGray9U: WarmGray9U,
		WarmRedU: WarmRedU,
		Yellow012U: Yellow012U,
		YellowU: YellowU
	};

	const Red$3 = [
		"#ED0A3F"
	];
	const Maroon$2 = [
		"#C32148"
	];
	const Scarlet$1 = [
		"#FD0E35"
	];
	const Bittersweet = [
		"#FE6F5E"
	];
	const Orange$3 = [
		"#FF8866"
	];
	const Maize = [
		"#F2C649"
	];
	const Goldenrod = [
		"#FCD667"
	];
	const Dandelion = [
		"#FED85D"
	];
	const Yellow$3 = [
		"#FBE870"
	];
	const Canary = [
		"#FFFF99"
	];
	const Inchworm = [
		"#AFE313"
	];
	const Asparagus = [
		"#7BA05B"
	];
	const Fern = [
		"#63B76C"
	];
	const Green$3 = [
		"#3AA655"
	];
	const Shamrock = [
		"#33CC99"
	];
	const Aquamarine$1 = [
		"#95E0E8"
	];
	const Cerulean = [
		"#02A4D3"
	];
	const Cornflower = [
		"#93CCEA"
	];
	const Denim = [
		"#1560BD"
	];
	const Periwinkle = [
		"#C3CDE6"
	];
	const Indigo$2 = [
		"#4F69C6"
	];
	const Manatee = [
		"#8D90A1"
	];
	const Wisteria = [
		"#C9A0DC"
	];
	const Fuchsia$1 = [
		"#C154C1"
	];
	const Orchid$2 = [
		"#E29CD2"
	];
	const Plum$1 = [
		"#8E3179"
	];
	const Thistle$1 = [
		"#EBB0D7"
	];
	const Mulberry = [
		"#C8509B"
	];
	const Eggplant = [
		"#614051"
	];
	const Magenta$2 = [
		"#F653A6"
	];
	const Cerise = [
		"#DA3287"
	];
	const Razzmatazz = [
		"#E30B5C"
	];
	const Carmine$1 = [
		"#E62E6B"
	];
	const Blush = [
		"#DB5079"
	];
	const Mauvelous = [
		"#F091A9"
	];
	const Salmon$1 = [
		"#FF91A4"
	];
	const Mahogany = [
		"#CA3435"
	];
	const Melon = [
		"#FEBAAD"
	];
	const Brown$3 = [
		"#AF593E"
	];
	const Sepia$1 = [
		"#9E5B40"
	];
	const Beaver = [
		"#926F5B"
	];
	const Tumbleweed = [
		"#DEA681"
	];
	const Tan$2 = [
		"#D99A6C"
	];
	const Peach$1 = [
		"#FFD0B9"
	];
	const Apricot$1 = [
		"#FDD5B1"
	];
	const Almond = [
		"#EED9C4"
	];
	const Shadow = [
		"#837050"
	];
	const Timberwolf = [
		"#D9D6CF"
	];
	const Silver$1 = [
		"#C9C0BB"
	];
	const Copper = [
		"#DA8A67"
	];
	const Black$2 = [
		"#000000"
	];
	const Gray$1 = [
		"#8B8680"
	];
	const Sunglow = [
		"#FFCC33"
	];
	const Frostbite = [
		"#E936A7"
	];
	const Banana = [
		"#FFD12A"
	];
	const Blueberry = [
		"#4F86F7"
	];
	const Cherry = [
		"#DA2647"
	];
	const Chocolate$2 = [
		"#BD8260"
	];
	const Coconut = [
		"#FEFEFE"
	];
	const Daffodil = [
		"#FFFF31"
	];
	const Dirt = [
		"#9B7653"
	];
	const Eucalyptus = [
		"#44D7A8"
	];
	const Grape = [
		"#6F2DA8"
	];
	const Lemon = [
		"#FFFF38"
	];
	const Licorice = [
		"#1A1110"
	];
	const Lilac$1 = [
		"#DB91EF"
	];
	const Lime$2 = [
		"#B2F302"
	];
	const Lumber = [
		"#FFE4CD"
	];
	const Pine = [
		"#45A27D"
	];
	const Rose$2 = [
		"#FF5050"
	];
	const Shampoo = [
		"#FFCFF1"
	];
	const Smoke = [
		"#738276"
	];
	const Soap = [
		"#CEC8EF"
	];
	const Strawberry$1 = [
		"#FC5A8D"
	];
	const Tulip = [
		"#FF878D"
	];
	const Amethyst = [
		"#64609A"
	];
	const Citrine = [
		"#933709"
	];
	const Emerald = [
		"#14A989"
	];
	const Jade = [
		"#469A84"
	];
	const Jasper = [
		"#D05340"
	];
	const Malachite = [
		"#469496"
	];
	const Moonstone = [
		"#3AA8C1"
	];
	const Onyx = [
		"#353839"
	];
	const Peridot = [
		"#ABAD48"
	];
	const Ruby = [
		"#AA4069"
	];
	const Sapphire = [
		"#2D5DA1"
	];
	var CRAYOLA = {
		Red: Red$3,
		Maroon: Maroon$2,
		Scarlet: Scarlet$1,
		"Brick Red": [
		"#C62D42"
	],
		"English Vermilion": [
		"#CC474B"
	],
		"Madder Lake": [
		"#CC3336"
	],
		"Permanent Geranium Lake": [
		"#E12C2C"
	],
		"Maximum Red": [
		"#D92121"
	],
		"Indian Red": [
		"#B94E48"
	],
		"Orange-Red": [
		"#FF5349"
	],
		"Sunset Orange": [
		"#FE4C40"
	],
		Bittersweet: Bittersweet,
		"Dark Venetian Red": [
		"#B33B24"
	],
		"Venetian Red": [
		"#CC553D"
	],
		"Light Venetian Red": [
		"#E6735C"
	],
		"Vivid Tangerine": [
		"#FF9980"
	],
		"Middle Red": [
		"#E58E73"
	],
		"Burnt Orange": [
		"#FF7F49"
	],
		"Red-Orange": [
		"#FF681F"
	],
		Orange: Orange$3,
		"Macaroni and Cheese": [
		"#FFB97B"
	],
		"Middle Yellow Red": [
		"#ECB176"
	],
		"Mango Tango": [
		"#E77200"
	],
		"Yellow-Orange": [
		"#FFAE42"
	],
		"Maximum Yellow Red": [
		"#F2BA49"
	],
		"Banana Mania": [
		"#FBE7B2"
	],
		Maize: Maize,
		"Orange-Yellow": [
		"#F8D568"
	],
		Goldenrod: Goldenrod,
		Dandelion: Dandelion,
		Yellow: Yellow$3,
		"Green-Yellow": [
		"#F1E788"
	],
		"Middle Yellow": [
		"#FFEB00"
	],
		"Olive Green": [
		"#B5B35C"
	],
		"Spring Green": [
		"#ECEBBD"
	],
		"Maximum Yellow": [
		"#FAFA37"
	],
		Canary: Canary,
		"Lemon Yellow": [
		"#FFFF9F"
	],
		"Maximum Green Yellow": [
		"#D9E650"
	],
		"Middle Green Yellow": [
		"#ACBF60"
	],
		Inchworm: Inchworm,
		"Light Chrome Green": [
		"#BEE64B"
	],
		"Yellow-Green": [
		"#C5E17A"
	],
		"Maximum Green": [
		"#5E8C31"
	],
		Asparagus: Asparagus,
		"Granny Smith Apple": [
		"#9DE093"
	],
		Fern: Fern,
		"Middle Green": [
		"#4D8C57"
	],
		Green: Green$3,
		"Medium Chrome Green": [
		"#6CA67C"
	],
		"Forest Green": [
		"#5FA777"
	],
		"Sea Green": [
		"#93DFB8"
	],
		Shamrock: Shamrock,
		"Mountain Meadow": [
		"#1AB385"
	],
		"Jungle Green": [
		"#29AB87"
	],
		"Caribbean Green": [
		"#00CC99"
	],
		"Tropical Rain Forest": [
		"#00755E"
	],
		"Middle Blue Green": [
		"#8DD9CC"
	],
		"Pine Green": [
		"#01786F"
	],
		"Maximum Blue Green": [
		"#30BFBF"
	],
		"Robin's Egg Blue": [
		"#00CCCC"
	],
		"Teal Blue": [
		"#008080"
	],
		"Light Blue": [
		"#8FD8D8"
	],
		Aquamarine: Aquamarine$1,
		"Turquoise Blue": [
		"#6CDAE7"
	],
		"Outer Space": [
		"#2D383A"
	],
		"Sky Blue": [
		"#76D7EA"
	],
		"Middle Blue": [
		"#7ED4E6"
	],
		"Blue-Green": [
		"#0095B7"
	],
		"Pacific Blue": [
		"#009DC4"
	],
		Cerulean: Cerulean,
		"Maximum Blue": [
		"#47ABCC"
	],
		"Blue (I)": [
		"#4997D0"
	],
		"Cerulean Blue": [
		"#339ACC"
	],
		Cornflower: Cornflower,
		"Green-Blue": [
		"#2887C8"
	],
		"Midnight Blue": [
		"#00468C"
	],
		"Navy Blue": [
		"#0066CC"
	],
		Denim: Denim,
		"Blue (III)": [
		"#0066FF"
	],
		"Cadet Blue": [
		"#A9B2C3"
	],
		Periwinkle: Periwinkle,
		"Blue (II)": [
		"#4570E6"
	],
		"Wild Blue Yonder": [
		"#7A89B8"
	],
		Indigo: Indigo$2,
		Manatee: Manatee,
		"Cobalt Blue": [
		"#8C90C8"
	],
		"Celestial Blue": [
		"#7070CC"
	],
		"Blue Bell": [
		"#9999CC"
	],
		"Maximum Blue Purple": [
		"#ACACE6"
	],
		"Violet-Blue": [
		"#766EC8"
	],
		"Blue-Violet": [
		"#6456B7"
	],
		"Ultramarine Blue": [
		"#3F26BF"
	],
		"Middle Blue Purple": [
		"#8B72BE"
	],
		"Purple Heart": [
		"#652DC1"
	],
		"Royal Purple": [
		"#6B3FA0"
	],
		"Violet (II)": [
		"#8359A3"
	],
		"Medium Violet": [
		"#8F47B3"
	],
		Wisteria: Wisteria,
		"Lavender (I)": [
		"#BF8FCC"
	],
		"Vivid Violet": [
		"#803790"
	],
		"Maximum Purple": [
		"#733380"
	],
		"Purple Mountains' Majesty": [
		"#D6AEDD"
	],
		Fuchsia: Fuchsia$1,
		"Pink Flamingo": [
		"#FC74FD"
	],
		"Violet (I)": [
		"#732E6C"
	],
		"Brilliant Rose": [
		"#E667CE"
	],
		Orchid: Orchid$2,
		Plum: Plum$1,
		"Medium Rose": [
		"#D96CBE"
	],
		Thistle: Thistle$1,
		Mulberry: Mulberry,
		"Red-Violet": [
		"#BB3385"
	],
		"Middle Purple": [
		"#D982B5"
	],
		"Maximum Red Purple": [
		"#A63A79"
	],
		"Jazzberry Jam": [
		"#A50B5E"
	],
		Eggplant: Eggplant,
		Magenta: Magenta$2,
		Cerise: Cerise,
		"Wild Strawberry": [
		"#FF3399"
	],
		"Lavender (II)": [
		"#FBAED2"
	],
		"Cotton Candy": [
		"#FFB7D5"
	],
		"Carnation Pink": [
		"#FFA6C9"
	],
		"Violet-Red": [
		"#F7468A"
	],
		Razzmatazz: Razzmatazz,
		"Pig Pink": [
		"#FDD7E4"
	],
		Carmine: Carmine$1,
		Blush: Blush,
		"Tickle Me Pink": [
		"#FC80A5"
	],
		Mauvelous: Mauvelous,
		Salmon: Salmon$1,
		"Middle Red Purple": [
		"#A55353"
	],
		Mahogany: Mahogany,
		Melon: Melon,
		"Pink Sherbert": [
		"#F7A38E"
	],
		"Burnt Sienna": [
		"#E97451"
	],
		Brown: Brown$3,
		Sepia: Sepia$1,
		"Fuzzy Wuzzy": [
		"#87421F"
	],
		Beaver: Beaver,
		Tumbleweed: Tumbleweed,
		"Raw Sienna": [
		"#D27D46"
	],
		"Van Dyke Brown": [
		"#664228"
	],
		Tan: Tan$2,
		"Desert Sand": [
		"#EDC9AF"
	],
		Peach: Peach$1,
		"Burnt Umber": [
		"#805533"
	],
		Apricot: Apricot$1,
		Almond: Almond,
		"Raw Umber": [
		"#665233"
	],
		Shadow: Shadow,
		"Raw Sienna (I)": [
		"#E6BC5C"
	],
		Timberwolf: Timberwolf,
		"Gold (I)": [
		"#92926E"
	],
		"Gold (II)": [
		"#E6BE8A"
	],
		Silver: Silver$1,
		Copper: Copper,
		"Antique Brass": [
		"#C88A65"
	],
		Black: Black$2,
		"Charcoal Gray": [
		"#736A62"
	],
		Gray: Gray$1,
		"Blue-Gray": [
		"#C8C8CD"
	],
		"Radical Red": [
		"#FF355E"
	],
		"Wild Watermelon": [
		"#FD5B78"
	],
		"Outrageous Orange": [
		"#FF6037"
	],
		"Atomic Tangerine": [
		"#FF9966"
	],
		"Neon Carrot": [
		"#FF9933"
	],
		Sunglow: Sunglow,
		"Laser Lemon": [
		"#FFFF66"
	],
		"Unmellow Yellow": [
		"#FFFF66"
	],
		"Electric Lime": [
		"#CCFF00"
	],
		"Screamin' Green": [
		"#66FF66"
	],
		"Magic Mint": [
		"#AAF0D1"
	],
		"Blizzard Blue": [
		"#50BFE6"
	],
		"Shocking Pink": [
		"#FF6EFF"
	],
		"Razzle Dazzle Rose": [
		"#EE34D2"
	],
		"Hot Magenta": [
		"#FF00CC"
	],
		"Purple Pizzazz": [
		"#FF00CC"
	],
		"Sizzling Red": [
		"#FF3855"
	],
		"Red Salsa": [
		"#FD3A4A"
	],
		"Tart Orange": [
		"#FB4D46"
	],
		"Orange Soda": [
		"#FA5B3D"
	],
		"Bright Yellow": [
		"#FFAA1D"
	],
		"Yellow Sunshine": [
		"#FFF700"
	],
		"Slimy Green": [
		"#299617"
	],
		"Green Lizard": [
		"#A7F432"
	],
		"Denim Blue": [
		"#2243B6"
	],
		"Blue Jeans": [
		"#5DADEC"
	],
		"Plump Purple": [
		"#5946B2"
	],
		"Purple Plum": [
		"#9C51B6"
	],
		"Sweet Brown": [
		"#A83731"
	],
		"Brown Sugar": [
		"#AF6E4D"
	],
		"Eerie Black": [
		"#1B1B1B"
	],
		"Black Shadows": [
		"#BFAFB2"
	],
		"Fiery Rose": [
		"#FF5470"
	],
		"Sizzling Sunrise": [
		"#FFDB00"
	],
		"Heat Wave": [
		"#FF7A00"
	],
		"Lemon Glacier": [
		"#FDFF00"
	],
		"Spring Frost": [
		"#87FF2A"
	],
		"Absolute Zero": [
		"#0048BA"
	],
		"Winter Sky": [
		"#FF007C"
	],
		Frostbite: Frostbite,
		"Alloy Orange": [
		"#C46210"
	],
		"B'dazzled Blue": [
		"#2E5894"
	],
		"Big Dip O' Ruby": [
		"#9C2542"
	],
		"Bittersweet Shimmer": [
		"#BF4F51"
	],
		"Blast Off Bronze": [
		"#A57164"
	],
		"Cyber Grape": [
		"#58427C"
	],
		"Deep Space Sparkle": [
		"#4A646C"
	],
		"Gold Fusion": [
		"#85754E"
	],
		"Illuminating Emerald": [
		"#319177"
	],
		"Metallic Seaweed": [
		"#0A7E8C"
	],
		"Metallic Sunburst": [
		"#9C7C38"
	],
		"Razzmic Berry": [
		"#8D4E85"
	],
		"Sheen Green": [
		"#8FD400"
	],
		"Shimmering Blush": [
		"#D98695"
	],
		"Sonic Silver": [
		"#757575"
	],
		"Steel Blue": [
		"#0081AB"
	],
		"Aztec Gold": [
		"#C39953"
	],
		"Burnished Brown": [
		"#A17A74"
	],
		"Cerulean Frost": [
		"#6D9BC3"
	],
		"Cinnamon Satin": [
		"#CD607E"
	],
		"Copper Penny": [
		"#AD6F69"
	],
		"Cosmic Cobalt": [
		"#2E2D88"
	],
		"Glossy Grape": [
		"#AB92B3"
	],
		"Granite Gray": [
		"#676767"
	],
		"Green Sheen": [
		"#6EAEA1"
	],
		"Lilac Luster": [
		"#AE98AA"
	],
		"Misty Moss": [
		"#BBB477"
	],
		"Mystic Maroon": [
		"#AD4379"
	],
		"Pearly Purple": [
		"#B768A2"
	],
		"Pewter Blue": [
		"#8BA8B7"
	],
		"Polished Pine": [
		"#5DA493"
	],
		"Quick Silver": [
		"#A6A6A6"
	],
		"Rose Dust": [
		"#9E5E6F"
	],
		"Rusty Red": [
		"#DA2C43"
	],
		"Shadow Blue": [
		"#778BA5"
	],
		"Shiny Shamrock": [
		"#5FA778"
	],
		"Steel Teal": [
		"#5F8A8B"
	],
		"Sugar Plum": [
		"#914E75"
	],
		"Twilight Lavender": [
		"#8A496B"
	],
		"Wintergreen Dream": [
		"#56887D"
	],
		"Baby Powder": [
		"#FEFEFA"
	],
		Banana: Banana,
		Blueberry: Blueberry,
		"Bubble Gum": [
		"#FFD3F8"
	],
		"Cedar Chest": [
		"#C95A49"
	],
		Cherry: Cherry,
		Chocolate: Chocolate$2,
		Coconut: Coconut,
		Daffodil: Daffodil,
		Dirt: Dirt,
		Eucalyptus: Eucalyptus,
		"Fresh Air": [
		"#A6E7FF"
	],
		Grape: Grape,
		"Jelly Bean": [
		"#DA614E"
	],
		"Leather Jacket": [
		"#253529"
	],
		Lemon: Lemon,
		Licorice: Licorice,
		Lilac: Lilac$1,
		Lime: Lime$2,
		Lumber: Lumber,
		"New Car": [
		"#214FC6"
	],
		Pine: Pine,
		Rose: Rose$2,
		Shampoo: Shampoo,
		Smoke: Smoke,
		Soap: Soap,
		Strawberry: Strawberry$1,
		Tulip: Tulip,
		Amethyst: Amethyst,
		Citrine: Citrine,
		Emerald: Emerald,
		Jade: Jade,
		Jasper: Jasper,
		"Lapis Lazuli": [
		"#436CB9"
	],
		Malachite: Malachite,
		Moonstone: Moonstone,
		Onyx: Onyx,
		Peridot: Peridot,
		"Pink Pearl": [
		"#B07080"
	],
		"Rose Quartz": [
		"#BD559C"
	],
		Ruby: Ruby,
		Sapphire: Sapphire,
		"Smokey Topaz": [
		"#832A0D"
	],
		"Tiger's Eye": [
		"#B56917"
	],
		"Baseball Mitt (Burnt Sienna)": [
		"#E97451"
	],
		"Bubble Bath (Tickle Me Pink)": [
		"#FC80A5"
	],
		"Earthworm (Brick Red)": [
		"#C62D42"
	],
		"Flower Shop (Wisteria)": [
		"#C9A0DC"
	],
		"Fresh Air (Sky Blue)": [
		"#76D7EA"
	],
		"Grandma's Perfume (Orange)": [
		"#FF8833"
	],
		"Koala Tree (Jungle Green)": [
		"#29AB87"
	],
		"Pet Shop (Brown)": [
		"#AF593E"
	],
		"Pine Tree (Pine Green)": [
		"#01786F"
	],
		"Saw Dust (Peach)": [
		"#FFCBA4"
	],
		"Sharpening Pencils (Goldenrod)": [
		"#FCD667"
	],
		"Smell the Roses (Red)": [
		"#ED0A3F"
	],
		"Sunny Day (Yellow)": [
		"#FBE870"
	],
		"Wash the Dog (Dandelion)": [
		"#FED85D"
	],
		"Alien Armpit": [
		"#84DE02"
	],
		"Big Foot Feet": [
		"#E88E5A"
	],
		"Booger Buster": [
		"#DDE26A"
	],
		"Dingy Dungeon": [
		"#C53151"
	],
		"Gargoyle Gas": [
		"#FFDF46"
	],
		"Giant's Club": [
		"#B05C52"
	],
		"Magic Potion": [
		"#FF4466"
	],
		"Mummy's Tomb": [
		"#828E84"
	],
		"Ogre Odor": [
		"#FD5240"
	],
		"Pixie Powder": [
		"#391285"
	],
		"Princess Perfume": [
		"#FF85CF"
	],
		"Sasquatch Socks": [
		"#FF4681"
	],
		"Sea Serpent": [
		"#4BC7CF"
	],
		"Smashed Pumpkin": [
		"#FF6D3A"
	],
		"Sunburnt Cyclops": [
		"#FF404C"
	],
		"Winter Wizard": [
		"#A0E6FF"
	]
	};

	/* src\svelte\color-lists.html generated by Svelte v2.13.5 */

	function list_1({ colorlists, colorlistsIndex }) {
		return colorlists[colorlistsIndex].list;
	}

	function data$8() {
	  return {
	    colorlists: [
	      { name: 'Web Color',
	        list: parser(WEBCOLOR) },
	      { name: 'GOOGLE MATERIAL',
	        list: Object.keys(MATERIALCOLOR).reduce((ary, key) => {
	          MATERIALCOLOR[key].forEach((color, i) => {
	            let name = key;
	            if (i === 0)      name += 50;
	            else if (i < 10)  name += i * 100;
	            else if (i >= 10) name += ['A100', 'A200', 'A400', 'A700'][i % 10];
	            ary.push({ name, color });
	          });
	          return ary
	        }, []) },
	      { name: 'RAL',
	        list: parser(RALCOLOUR) },
	      { name: 'CRAYOLA',
	        list: parser(CRAYOLA) },
	      { name: 'PANTONE® Goe™ Coated',
	        list: pantone(GOE_COATED) },
	      { name: 'PANTONE® Goe™ Uncoated',
	        list: pantone(GOE_UNCOATED) },
	      { name: 'PANTONE® solid Coated',
	        list: pantone(SOLID_COATED) },
	      { name: 'PANTONE® solid Uncoated',
	        list: pantone(SOLID_UNCOATED) },
	      { name: 'JIS EN',
	        list: parser(JISCOLOR_EN) },
	      { name: 'JIS JA',
	        list: parser(JISCOLOR_JA) },
	    ],
	    colorlistsIndex: 0
	  }
	}
	function oncreate$5() {
	  const colortips = this.refs.colortips;
	  colortips.addEventListener('click', (e) => {
	    const el = e.target;
	    if (el.classList.contains('tip')) {
	      const [name, color] = el.title.split(' : ');
	      this.fire('colorpick', { current: { name, color: new Color$1(color) } });
	    }
	  });
	  colortips.addEventListener('contextmenu', (e) => {
	    e.preventDefault();
	    const el = e.target;
	    if (el.classList.contains('tip')) {
	      const [name, color] = el.title.split(' : ');
	      store.fire('menu_open', e, {
	        name,
	        color: new Color$1(color)
	      }, 'tip');
	    }
	  });
	  colortips.addEventListener('dblclick', (e) => {
	    e.preventDefault();
	    const el = e.target;
	    if (el.classList.contains('tip')) {
	      const [name, color] = el.title.split(' : ');

	      store.fire('cards.ADD_CARD', {
	        name,
	        color: new Color$1(color)
	      });
	    }
	  });
	}
	function parser (list, temp) {
	  return Object.keys(list).map(key => ({
	    name: temp ? temp(key, list[key]) : key,
	    color: list[key][0]
	  }))
	}
	function pantone (list) {
	  return Object.keys(list).map(key => ({
	    name: `${key}`,
	    color: list[key]
	  }))
	}

	const file$7 = "src\\svelte\\color-lists.html";

	function create_main_fragment$7(component, ctx) {
		var div, select, text_1, div_1, div_2, div_3;

		var each_value = ctx.colorlists;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$2(component, get_each_context$2(ctx, each_value, i));
		}

		function change_handler(event) {
			component.set({colorlistsIndex: +this.value});
		}

		var each_value_1 = ctx.list;

		var each_1_blocks = [];

		for (var i = 0; i < each_value_1.length; i += 1) {
			each_1_blocks[i] = create_each_block_1(component, get_each_1_context(ctx, each_value_1, i));
		}

		return {
			c: function create() {
				div = createElement("div");
				select = createElement("select");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				text_1 = createText("\r\n\r\n");
				div_1 = createElement("div");
				div_2 = createElement("div");
				div_3 = createElement("div");

				for (var i = 0; i < each_1_blocks.length; i += 1) {
					each_1_blocks[i].c();
				}
				addListener(select, "change", change_handler);
				select.className = "svelte-z7pkpf";
				addLoc(select, file$7, 1, 2, 48);
				div.id = "colorlists";
				div.className = "select-wrapper svelte-z7pkpf";
				addLoc(div, file$7, 0, 0, 0);
				div_3.className = "scrollbar-content svelte-z7pkpf";
				addLoc(div_3, file$7, 10, 4, 327);
				div_2.className = "scrollbar-body svelte-z7pkpf";
				addLoc(div_2, file$7, 9, 2, 293);
				div_1.className = "colortips scrollbar-wrapper svelte-z7pkpf";
				setStyle(div_1, "flex", "1");
				addLoc(div_1, file$7, 8, 0, 231);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, select);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(select, null);
				}

				insert(target, text_1, anchor);
				insert(target, div_1, anchor);
				append(div_1, div_2);
				append(div_2, div_3);

				for (var i = 0; i < each_1_blocks.length; i += 1) {
					each_1_blocks[i].m(div_3, null);
				}

				component.refs.colortips = div_3;
			},

			p: function update(changed, ctx) {
				if (changed.colorlists) {
					each_value = ctx.colorlists;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$2(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block$2(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(select, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}

				if (changed.list) {
					each_value_1 = ctx.list;

					for (var i = 0; i < each_value_1.length; i += 1) {
						const child_ctx = get_each_1_context(ctx, each_value_1, i);

						if (each_1_blocks[i]) {
							each_1_blocks[i].p(changed, child_ctx);
						} else {
							each_1_blocks[i] = create_each_block_1(component, child_ctx);
							each_1_blocks[i].c();
							each_1_blocks[i].m(div_3, null);
						}
					}

					for (; i < each_1_blocks.length; i += 1) {
						each_1_blocks[i].d(1);
					}
					each_1_blocks.length = each_value_1.length;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				destroyEach(each_blocks, detach);

				removeListener(select, "change", change_handler);
				if (detach) {
					detachNode(text_1);
					detachNode(div_1);
				}

				destroyEach(each_1_blocks, detach);

				if (component.refs.colortips === div_3) component.refs.colortips = null;
			}
		};
	}

	// (3:4) {#each colorlists as data, index}
	function create_each_block$2(component, ctx) {
		var option, text_value = ctx.data.name, text;

		return {
			c: function create() {
				option = createElement("option");
				text = createText(text_value);
				option.__value = ctx.index;
				option.value = option.__value;
				option.className = "svelte-z7pkpf";
				addLoc(option, file$7, 3, 6, 151);
			},

			m: function mount(target, anchor) {
				insert(target, option, anchor);
				append(option, text);
			},

			p: function update(changed, ctx) {
				if ((changed.colorlists) && text_value !== (text_value = ctx.data.name)) {
					setData(text, text_value);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(option);
				}
			}
		};
	}

	// (12:6) {#each list as {name, color}
	function create_each_block_1(component, ctx) {
		var div, div_title_value;

		return {
			c: function create() {
				div = createElement("div");
				div.className = "tip svelte-z7pkpf";
				div.title = div_title_value = ctx.name+' : '+ctx.color;
				setStyle(div, "background-color", ctx.color);
				addLoc(div, file$7, 12, 8, 420);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
			},

			p: function update(changed, ctx) {
				if ((changed.list) && div_title_value !== (div_title_value = ctx.name+' : '+ctx.color)) {
					div.title = div_title_value;
				}

				if (changed.list) {
					setStyle(div, "background-color", ctx.color);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}
			}
		};
	}

	function get_each_context$2(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.data = list[i];
		child_ctx.each_value = list;
		child_ctx.index = i;
		return child_ctx;
	}

	function get_each_1_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.name = list[i].name;
		child_ctx.color = list[i].color;
		child_ctx.each_value_1 = list;
		child_ctx.each_index = i;
		return child_ctx;
	}

	function Color_lists(options) {
		this._debugName = '<Color_lists>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this.refs = {};
		this._state = assign(data$8(), options.data);
		this._recompute({ colorlists: 1, colorlistsIndex: 1 }, this._state);
		if (!('colorlists' in this._state)) console.warn("<Color_lists> was created without expected data property 'colorlists'");
		if (!('colorlistsIndex' in this._state)) console.warn("<Color_lists> was created without expected data property 'colorlistsIndex'");
		this._intro = true;

		this._fragment = create_main_fragment$7(this, this._state);

		this.root._oncreate.push(() => {
			oncreate$5.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}
	}

	assign(Color_lists.prototype, protoDev);

	Color_lists.prototype._checkReadOnly = function _checkReadOnly(newState) {
		if ('list' in newState && !this._updatingReadonlyProperty) throw new Error("<Color_lists>: Cannot set read-only property 'list'");
	};

	Color_lists.prototype._recompute = function _recompute(changed, state) {
		if (changed.colorlists || changed.colorlistsIndex) {
			if (this._differs(state.list, (state.list = list_1(state)))) changed.list = true;
		}
	};

	/* src\svelte\context-menu.html generated by Svelte v2.13.5 */

	function modelsEntries$1({ $cardViewModels }) {
		return Object.entries($cardViewModels);
	}

	function data$9() {
	  return {
	    mode: false,
	    activeCard: null,
	    copys: ['hex', 'rgb', 'hsl'],
	    sizes: [120, 240, 360],
	  }
	}
	var methods$6 = {
	  // submenuVisible (el) {
	  //   const {submenu} = this.refs
	  //   submenu.style.display = 'block'
	  //   const rect = el.getBoundingClientRect()
	  //   styler(submenu, {
	  //     left: rect.left + rect.width,
	  //     top: rect.top,
	  //   })
	  // },
	  add () {
	    store.fire('cards.ADD_CARD', this.get().activeCard);
	  },
	  edit () {
	    this.cardComponent.edit();
	  },
	  duplicate () {
	    const selects = this.root.selectable.selects;
	    // const howmany = selects.length
	    if (selects.length) {
	      store.fire('cards.DUPLICATE_CARD', selects.map((select) => select.index));
	    }
	    // // reselect
	    // const {cards} = store.get()
	    // this.root.selectable.reset()
	    // for (let i = cards.length - 1; i >= cards.length - howmany; i--) {
	    //   this.root.selectable.select(i)
	    // }
	  },
	  remove () {
	    const selects = this.root.selectable.selects;
	    if (selects.length) {
	      store.fire('cards.REMOVE_CARD', selects.map((select) => select.index));
	    }
	  },
	  reverse () {
	    const selects = this.root.selectable.selects;
	    if (selects.length) {
	      store.fire('cards.TOGGLE_TEXTMODE', selects.map((select) => select.index));
	    }
	  },

	  copyColor (model) {
	    copyTextToClipboard(this.get().activeCard.color[model]());
	  },
	  viewModelChenge (event) {
	    const { cardViewModels } = this.store.get();
	    cardViewModels[event[0]] = !event[1];
	    this.store.set({ cardViewModels }, true);
	  },
	};

	function oncreate$6() {
	  console.log('menu-render');
	  const {
	    menu,
	    // submenu
	  } = this.refs;

	  const menuHide = (e) => {
	    store.fire('menu_close');
	  };

	  store.on('menu_open', (e, cardComponent, mode) => {
	    menu.style.display = 'block';
	    let x = e.clientX;
	    let y = e.clientY;
	    const rect = menu.getBoundingClientRect();
	    if (window.innerWidth < rect.width + x) {
	      x -= rect.width;
	    }
	    if (window.innerHeight < rect.height + y) {
	      y -= rect.height;
	    }
	    styler(menu, {
	      left: x,
	      top: y,
	    });

	    // 'tip' or 'card'
	    const activeCard = mode === 'card' ? cardComponent.get().card : cardComponent;
	    this.set({ mode, activeCard });
	    this.cardComponent = cardComponent;


	    window.addEventListener('blur', menuHide);
	    document.addEventListener('click', menuHide);
	  });

	  store.on('menu_close', (e) => {
	    menu.style.display = 'none';
	    // submenu.style.display = 'none'
	    this.set({ mode: false });
	    window.removeEventListener('blur', menuHide);
	    document.removeEventListener('click', menuHide);
	  });
	}
	const file$8 = "src\\svelte\\context-menu.html";

	function create_main_fragment$8(component, ctx) {
		var div, text, hr, text_1;

		function select_block_type(ctx) {
			if (ctx.mode == 'tip') return create_if_block$2;
			if (ctx.mode == 'card') return create_if_block_1$2;
			return null;
		}

		var current_block_type = select_block_type(ctx);
		var if_block = current_block_type && current_block_type(component, ctx);

		var if_block_2 = (ctx.activeCard) && create_if_block_2(component, ctx);

		return {
			c: function create() {
				div = createElement("div");
				if (if_block) if_block.c();
				text = createText("\r\n  ");
				hr = createElement("hr");
				text_1 = createText("\r\n  ");
				if (if_block_2) if_block_2.c();
				addLoc(hr, file$8, 27, 2, 772);
				div.className = "context-menu";
				addLoc(div, file$8, 0, 0, 0);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				if (if_block) if_block.m(div, null);
				append(div, text);
				append(div, hr);
				append(div, text_1);
				if (if_block_2) if_block_2.m(div, null);
				component.refs.menu = div;
			},

			p: function update(changed, ctx) {
				if (current_block_type !== (current_block_type = select_block_type(ctx))) {
					if (if_block) if_block.d(1);
					if_block = current_block_type && current_block_type(component, ctx);
					if (if_block) if_block.c();
					if (if_block) if_block.m(div, text);
				}

				if (ctx.activeCard) {
					if (if_block_2) {
						if_block_2.p(changed, ctx);
					} else {
						if_block_2 = create_if_block_2(component, ctx);
						if_block_2.c();
						if_block_2.m(div, null);
					}
				} else if (if_block_2) {
					if_block_2.d(1);
					if_block_2 = null;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				if (if_block) if_block.d();
				if (if_block_2) if_block_2.d();
				if (component.refs.menu === div) component.refs.menu = null;
			}
		};
	}

	// (2:2) {#if mode == 'tip'}
	function create_if_block$2(component, ctx) {
		var p, text;

		function click_handler(event) {
			component.add();
		}

		return {
			c: function create() {
				p = createElement("p");
				text = createText("ADD CARD");
				addListener(p, "click", click_handler);
				p.className = "menuitem";
				addLoc(p, file$8, 2, 4, 64);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
				append(p, text);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(p);
				}

				removeListener(p, "click", click_handler);
			}
		};
	}

	// (4:26) 
	function create_if_block_1$2(component, ctx) {
		var p, i, text, text_1, p_1, i_1, text_2, text_3, p_2, i_2, text_4, text_5, p_3, i_3, text_6;

		function click_handler(event) {
			component.edit();
		}

		function click_handler_1(event) {
			component.duplicate();
		}

		function click_handler_2(event) {
			component.reverse();
		}

		function click_handler_3(event) {
			component.remove();
		}

		return {
			c: function create() {
				p = createElement("p");
				i = createElement("i");
				text = createText("\r\n      RENAME");
				text_1 = createText("\r\n    ");
				p_1 = createElement("p");
				i_1 = createElement("i");
				text_2 = createText("\r\n      DUPLICATE");
				text_3 = createText("\r\n    ");
				p_2 = createElement("p");
				i_2 = createElement("i");
				text_4 = createText("\r\n      FILL/TEXT");
				text_5 = createText("\r\n    ");
				p_3 = createElement("p");
				i_3 = createElement("i");
				text_6 = createText("\r\n      DELETE");
				i.className = "fas fa-edit fa-fw";
				addLoc(i, file$8, 5, 6, 193);
				addListener(p, "click", click_handler);
				p.className = "menuitem";
				addLoc(p, file$8, 4, 4, 147);
				i_1.className = "fas fa-copy fa-fw";
				addLoc(i_1, file$8, 9, 6, 307);
				addListener(p_1, "click", click_handler_1);
				p_1.className = "menuitem";
				addLoc(p_1, file$8, 8, 4, 256);
				i_2.className = "fas fa-sync fa-fw";
				addLoc(i_2, file$8, 13, 6, 422);
				addListener(p_2, "click", click_handler_2);
				p_2.className = "menuitem";
				addLoc(p_2, file$8, 12, 4, 373);
				i_3.className = "fas fa-times fa-fw";
				addLoc(i_3, file$8, 17, 6, 536);
				addListener(p_3, "click", click_handler_3);
				p_3.className = "menuitem";
				addLoc(p_3, file$8, 16, 4, 488);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
				append(p, i);
				append(p, text);
				insert(target, text_1, anchor);
				insert(target, p_1, anchor);
				append(p_1, i_1);
				append(p_1, text_2);
				insert(target, text_3, anchor);
				insert(target, p_2, anchor);
				append(p_2, i_2);
				append(p_2, text_4);
				insert(target, text_5, anchor);
				insert(target, p_3, anchor);
				append(p_3, i_3);
				append(p_3, text_6);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(p);
				}

				removeListener(p, "click", click_handler);
				if (detach) {
					detachNode(text_1);
					detachNode(p_1);
				}

				removeListener(p_1, "click", click_handler_1);
				if (detach) {
					detachNode(text_3);
					detachNode(p_2);
				}

				removeListener(p_2, "click", click_handler_2);
				if (detach) {
					detachNode(text_5);
					detachNode(p_3);
				}

				removeListener(p_3, "click", click_handler_3);
			}
		};
	}

	// (30:4) {#each copys as model}
	function create_each_block$3(component, ctx) {
		var p, text, text_1_value = ctx.activeCard.color[ctx.model](), text_1;

		return {
			c: function create() {
				p = createElement("p");
				text = createText("COPY: ");
				text_1 = createText(text_1_value);
				p._svelte = { component, ctx };

				addListener(p, "click", click_handler$1);
				p.className = "menuitem";
				addLoc(p, file$8, 30, 6, 832);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
				append(p, text);
				append(p, text_1);
			},

			p: function update(changed, _ctx) {
				ctx = _ctx;
				if ((changed.activeCard || changed.copys) && text_1_value !== (text_1_value = ctx.activeCard.color[ctx.model]())) {
					setData(text_1, text_1_value);
				}

				p._svelte.ctx = ctx;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(p);
				}

				removeListener(p, "click", click_handler$1);
			}
		};
	}

	// (29:2) {#if activeCard}
	function create_if_block_2(component, ctx) {
		var each_anchor;

		var each_value = ctx.copys;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$3(component, get_each_context$3(ctx, each_value, i));
		}

		return {
			c: function create() {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each_anchor = createComment();
			},

			m: function mount(target, anchor) {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(target, anchor);
				}

				insert(target, each_anchor, anchor);
			},

			p: function update(changed, ctx) {
				if (changed.copys || changed.activeCard) {
					each_value = ctx.copys;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$3(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block$3(component, child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(each_anchor.parentNode, each_anchor);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}
			},

			d: function destroy$$1(detach) {
				destroyEach(each_blocks, detach);

				if (detach) {
					detachNode(each_anchor);
				}
			}
		};
	}

	function get_each_context$3(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.model = list[i];
		child_ctx.each_value = list;
		child_ctx.model_index = i;
		return child_ctx;
	}

	function click_handler$1(event) {
		const { component, ctx } = this._svelte;

		component.copyColor(ctx.model);
	}

	function Context_menu(options) {
		this._debugName = '<Context_menu>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this.refs = {};
		this._state = assign(assign(this.store._init(["cardViewModels"]), data$9()), options.data);
		this.store._add(this, ["cardViewModels"]);
		this._recompute({ $cardViewModels: 1 }, this._state);
		if (!('$cardViewModels' in this._state)) console.warn("<Context_menu> was created without expected data property '$cardViewModels'");
		if (!('mode' in this._state)) console.warn("<Context_menu> was created without expected data property 'mode'");
		if (!('activeCard' in this._state)) console.warn("<Context_menu> was created without expected data property 'activeCard'");
		if (!('copys' in this._state)) console.warn("<Context_menu> was created without expected data property 'copys'");
		this._intro = true;

		this._handlers.destroy = [removeFromStore];

		this._fragment = create_main_fragment$8(this, this._state);

		this.root._oncreate.push(() => {
			oncreate$6.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}
	}

	assign(Context_menu.prototype, protoDev);
	assign(Context_menu.prototype, methods$6);

	Context_menu.prototype._checkReadOnly = function _checkReadOnly(newState) {
		if ('modelsEntries' in newState && !this._updatingReadonlyProperty) throw new Error("<Context_menu>: Cannot set read-only property 'modelsEntries'");
	};

	Context_menu.prototype._recompute = function _recompute(changed, state) {
		if (changed.$cardViewModels) {
			if (this._differs(state.modelsEntries, (state.modelsEntries = modelsEntries$1(state)))) changed.modelsEntries = true;
		}
	};

	/* src\svelte\modal.html generated by Svelte v2.13.5 */

	const file$9 = "src\\svelte\\modal.html";

	function create_main_fragment$9(component, ctx) {
		var div, text, div_1, slot_content_header = component._slotted.header, slot_content_header_after, text_1, button, text_2, text_3, hr, text_4, slot_content_default = component._slotted.default, slot_content_default_before;

		function click_handler(event) {
			component.fire("close");
		}

		function click_handler_1(event) {
			component.fire("close");
		}

		return {
			c: function create() {
				div = createElement("div");
				text = createText("\r\n\r\n");
				div_1 = createElement("div");
				text_1 = createText("\r\n  ");
				button = createElement("button");
				text_2 = createText("✖️");
				text_3 = createText("\r\n  ");
				hr = createElement("hr");
				text_4 = createText("\r\n  ");
				addListener(div, "click", click_handler);
				div.className = "modal-background svelte-1tnlq1e";
				addLoc(div, file$9, 0, 0, 0);
				addListener(button, "click", click_handler_1);
				button.className = "close-btn svelte-1tnlq1e";
				addLoc(button, file$9, 4, 2, 119);
				addLoc(hr, file$9, 5, 2, 185);
				div_1.className = "modal svelte-1tnlq1e";
				addLoc(div_1, file$9, 2, 0, 65);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				insert(target, text, anchor);
				insert(target, div_1, anchor);

				if (slot_content_header) {
					append(div_1, slot_content_header);
					append(div_1, slot_content_header_after || (slot_content_header_after = createComment()));
				}

				append(div_1, text_1);
				append(div_1, button);
				append(button, text_2);
				append(div_1, text_3);
				append(div_1, hr);
				append(div_1, text_4);

				if (slot_content_default) {
					append(div_1, slot_content_default_before || (slot_content_default_before = createComment()));
					append(div_1, slot_content_default);
				}
			},

			p: noop,

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(div, "click", click_handler);
				if (detach) {
					detachNode(text);
					detachNode(div_1);
				}

				if (slot_content_header) {
					reinsertBefore(slot_content_header_after, slot_content_header);
				}

				removeListener(button, "click", click_handler_1);

				if (slot_content_default) {
					reinsertAfter(slot_content_default_before, slot_content_default);
				}
			}
		};
	}

	function Modal(options) {
		this._debugName = '<Modal>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign({}, options.data);
		this._intro = true;

		this._slotted = options.slots || {};

		this._fragment = create_main_fragment$9(this, this._state);

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);
		}
	}

	assign(Modal.prototype, protoDev);

	Modal.prototype._checkReadOnly = function _checkReadOnly(newState) {
	};

	/* src\svelte\save-modal.html generated by Svelte v2.13.5 */

	function colorlist (cards) {
	  return cards
	    .map((card) => new Color$1(card.color).toJSON())
	    .reduce((result, card) => {
	      if (!~result.indexOf(card)) {
	        result.push(card);
	      }
	      return result
	    }, [])
	}

	function listContains({ list, value }) {
		return list.some(({ paletteName }) => paletteName === value);
	}

	function data$a() {
	  return {
	    list: [],
	    value: '',
	  }
	}
	var methods$7 = {
	  getList () {
	    return this.store.dataList('palette').map(({ paletteName, cards }) => {
	      const palette = colorlist(cards);
	      return {
	        paletteName,
	        palette,
	        cardsLength: cards.length,
	      }
	    })
	  },
	  load (paletteName, loadFlg) {
	    this.store.load('palette', paletteName);
	    this.root.cardsPosition();
	    this.set({
	      value: paletteName,
	    });
	  },
	  remove (paletteName) {
	    this.store.remove('palette', paletteName);
	    const { list } = this.get();
	    list.splice(list.findIndex((item) => item.paletteName === paletteName), 1);
	    this.set({ list });
	  },
	  save (value) {
	    if (!value) {
	      value = 'Palette';
	      const { list } = this.get();
	      let i = 0;
	      while (list.some(({ paletteName }) => value === paletteName)) {
	        value =  'Palette ' + (++i);
	      }
	    }
	    this.store.set({ paletteName: value });
	    this.store.save('palette', value);
	    this.set({
	      list: this.getList(),
	    });
	  },
	};

	function oncreate$7() {
	  this.set({
	    list: this.getList(),
	  });
	}
	const file$a = "src\\svelte\\save-modal.html";

	function create_main_fragment$a(component, ctx) {
		var text, h3, text_1, text_2, text_3, hr, text_4, div, div_1, text_5, text_6, input, input_updating = false, text_7, button, text_8, i, text_11;

		var each_value = ctx.list;

		var each_blocks = [];

		for (var i_1 = 0; i_1 < each_value.length; i_1 += 1) {
			each_blocks[i_1] = create_each_block$4(component, get_each_context$4(ctx, each_value, i_1));
		}

		function input_input_handler() {
			input_updating = true;
			component.set({ value: input.value });
			input_updating = false;
		}

		function select_block_type(ctx) {
			if (ctx.listContains) return create_if_block$3;
			return create_if_block_1$3;
		}

		var current_block_type = select_block_type(ctx);
		var if_block = current_block_type(component, ctx);

		function click_handler_3(event) {
			component.save(ctx.value);
		}

		var modal = new Modal({
			root: component.root,
			store: component.store,
			slots: { default: createFragment(), header: createFragment() }
		});

		modal.on("close", function(event) {
			component.fire('close');
		});

		return {
			c: function create() {
				text = createText("\r\n  ");
				h3 = createElement("h3");
				text_1 = createText("Save & Load");
				text_2 = createText("\r\n\r\n  ");

				for (var i_1 = 0; i_1 < each_blocks.length; i_1 += 1) {
					each_blocks[i_1].c();
				}

				text_3 = createText("\r\n\r\n  ");
				hr = createElement("hr");
				text_4 = createText("\r\n\r\n  ");
				div = createElement("div");
				div_1 = createElement("div");
				text_5 = createText("Save as:");
				text_6 = createText("\r\n    ");
				input = createElement("input");
				text_7 = createText("\r\n    ");
				button = createElement("button");
				if_block.c();
				text_8 = createText("\r\n      ");
				i = createElement("i");
				text_11 = createText("\r\n");
				modal._fragment.c();
				setAttribute(h3, "slot", "header");
				addLoc(h3, file$a, 1, 2, 36);
				addLoc(hr, file$a, 27, 2, 791);
				div_1.className = "svelte-vuh5st";
				addLoc(div_1, file$a, 30, 4, 838);
				addListener(input, "input", input_input_handler);
				input.placeholder = "Palette Name";
				setStyle(input, "flex", "1");
				input.className = "svelte-vuh5st";
				addLoc(input, file$a, 31, 4, 863);
				i.className = "fa fa-plus-square";
				addLoc(i, file$a, 38, 6, 1129);
				addListener(button, "click", click_handler_3);
				setStyle(button, "background-color", (ctx.listContains?'aquamarine':'dodgerblue'));
				button.className = "svelte-vuh5st";
				addLoc(button, file$a, 32, 4, 931);
				div.className = "footer button-set svelte-vuh5st";
				addLoc(div, file$a, 29, 2, 801);
			},

			m: function mount(target, anchor) {
				append(modal._slotted.default, text);
				append(modal._slotted.header, h3);
				append(h3, text_1);
				append(modal._slotted.default, text_2);

				for (var i_1 = 0; i_1 < each_blocks.length; i_1 += 1) {
					each_blocks[i_1].m(modal._slotted.default, null);
				}

				append(modal._slotted.default, text_3);
				append(modal._slotted.default, hr);
				append(modal._slotted.default, text_4);
				append(modal._slotted.default, div);
				append(div, div_1);
				append(div_1, text_5);
				append(div, text_6);
				append(div, input);

				input.value = ctx.value ;

				append(div, text_7);
				append(div, button);
				if_block.m(button, null);
				append(button, text_8);
				append(button, i);
				append(modal._slotted.default, text_11);
				modal._mount(target, anchor);
			},

			p: function update(changed, _ctx) {
				ctx = _ctx;
				if (changed.list || changed.$paletteName) {
					each_value = ctx.list;

					for (var i_1 = 0; i_1 < each_value.length; i_1 += 1) {
						const child_ctx = get_each_context$4(ctx, each_value, i_1);

						if (each_blocks[i_1]) {
							each_blocks[i_1].p(changed, child_ctx);
						} else {
							each_blocks[i_1] = create_each_block$4(component, child_ctx);
							each_blocks[i_1].c();
							each_blocks[i_1].m(text_3.parentNode, text_3);
						}
					}

					for (; i_1 < each_blocks.length; i_1 += 1) {
						each_blocks[i_1].d(1);
					}
					each_blocks.length = each_value.length;
				}

				if (!input_updating && changed.value) input.value = ctx.value ;

				if (current_block_type !== (current_block_type = select_block_type(ctx))) {
					if_block.d(1);
					if_block = current_block_type(component, ctx);
					if_block.c();
					if_block.m(button, text_8);
				}

				if (changed.listContains) {
					setStyle(button, "background-color", (ctx.listContains?'aquamarine':'dodgerblue'));
				}
			},

			d: function destroy$$1(detach) {
				destroyEach(each_blocks, detach);

				removeListener(input, "input", input_input_handler);
				if_block.d();
				removeListener(button, "click", click_handler_3);
				modal.destroy(detach);
			}
		};
	}

	// (4:2) {#each list as {paletteName, palette, cardsLength}
	function create_each_block$4(component, ctx) {
		var div, div_1, text_value = ctx.paletteName, text, text_2, div_2, text_4, div_3, text_5_value = ctx.palette.length, text_5, text_7, div_4, text_8_value = ctx.cardsLength, text_8, text_10, div_5, button, i, div_class_value;

		var each_value_1 = ctx.palette;

		var each_blocks = [];

		for (var i_1 = 0; i_1 < each_value_1.length; i_1 += 1) {
			each_blocks[i_1] = create_each_block_1$1(component, get_each_context_1(ctx, each_value_1, i_1));
		}

		return {
			c: function create() {
				div = createElement("div");
				div_1 = createElement("div");
				text = createText(text_value);
				text_2 = createText("\r\n    ");
				div_2 = createElement("div");

				for (var i_1 = 0; i_1 < each_blocks.length; i_1 += 1) {
					each_blocks[i_1].c();
				}

				text_4 = createText("\r\n    ");
				div_3 = createElement("div");
				text_5 = createText(text_5_value);
				text_7 = createText("\r\n    ");
				div_4 = createElement("div");
				text_8 = createText(text_8_value);
				text_10 = createText("\r\n    ");
				div_5 = createElement("div");
				button = createElement("button");
				i = createElement("i");
				div_1._svelte = { component, ctx };

				addListener(div_1, "click", click_handler$2);
				div_1.className = "name svelte-vuh5st";
				addLoc(div_1, file$a, 5, 4, 219);

				div_2._svelte = { component, ctx };

				addListener(div_2, "click", click_handler_1);
				div_2.className = "palette button-set svelte-vuh5st";
				addLoc(div_2, file$a, 8, 4, 305);
				div_3.className = "color-num svelte-vuh5st";
				addLoc(div_3, file$a, 13, 4, 499);
				div_4.className = "color-num svelte-vuh5st";
				addLoc(div_4, file$a, 16, 4, 564);
				i.className = "fa fa-minus-square";
				addLoc(i, file$a, 21, 8, 701);

				button._svelte = { component, ctx };

				addListener(button, "click", click_handler_2);
				button.className = "svelte-vuh5st";
				addLoc(button, file$a, 20, 6, 652);
				div_5.className = "btns svelte-vuh5st";
				addLoc(div_5, file$a, 19, 4, 626);
				div.className = div_class_value = "listitem button-set " + (ctx.paletteName == ctx.$paletteName ? 'active':'') + " svelte-vuh5st";
				addLoc(div, file$a, 4, 2, 136);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, div_1);
				append(div_1, text);
				append(div, text_2);
				append(div, div_2);

				for (var i_1 = 0; i_1 < each_blocks.length; i_1 += 1) {
					each_blocks[i_1].m(div_2, null);
				}

				append(div, text_4);
				append(div, div_3);
				append(div_3, text_5);
				append(div, text_7);
				append(div, div_4);
				append(div_4, text_8);
				append(div, text_10);
				append(div, div_5);
				append(div_5, button);
				append(button, i);
			},

			p: function update(changed, _ctx) {
				ctx = _ctx;
				if ((changed.list) && text_value !== (text_value = ctx.paletteName)) {
					setData(text, text_value);
				}

				div_1._svelte.ctx = ctx;

				if (changed.list) {
					each_value_1 = ctx.palette;

					for (var i_1 = 0; i_1 < each_value_1.length; i_1 += 1) {
						const child_ctx = get_each_context_1(ctx, each_value_1, i_1);

						if (each_blocks[i_1]) {
							each_blocks[i_1].p(changed, child_ctx);
						} else {
							each_blocks[i_1] = create_each_block_1$1(component, child_ctx);
							each_blocks[i_1].c();
							each_blocks[i_1].m(div_2, null);
						}
					}

					for (; i_1 < each_blocks.length; i_1 += 1) {
						each_blocks[i_1].d(1);
					}
					each_blocks.length = each_value_1.length;
				}

				div_2._svelte.ctx = ctx;
				if ((changed.list) && text_5_value !== (text_5_value = ctx.palette.length)) {
					setData(text_5, text_5_value);
				}

				if ((changed.list) && text_8_value !== (text_8_value = ctx.cardsLength)) {
					setData(text_8, text_8_value);
				}

				button._svelte.ctx = ctx;
				if ((changed.list || changed.$paletteName) && div_class_value !== (div_class_value = "listitem button-set " + (ctx.paletteName == ctx.$paletteName ? 'active':'') + " svelte-vuh5st")) {
					div.className = div_class_value;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(div_1, "click", click_handler$2);

				destroyEach(each_blocks, detach);

				removeListener(div_2, "click", click_handler_1);
				removeListener(button, "click", click_handler_2);
			}
		};
	}

	// (10:6) {#each palette as color}
	function create_each_block_1$1(component, ctx) {
		var div;

		return {
			c: function create() {
				div = createElement("div");
				div.className = "tip svelte-vuh5st";
				setStyle(div, "background-color", ctx.color);
				addLoc(div, file$a, 10, 8, 408);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
			},

			p: function update(changed, ctx) {
				if (changed.list) {
					setStyle(div, "background-color", ctx.color);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}
			}
		};
	}

	// (34:6) {#if listContains}
	function create_if_block$3(component, ctx) {
		var text;

		return {
			c: function create() {
				text = createText("Overwrite");
			},

			m: function mount(target, anchor) {
				insert(target, text, anchor);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(text);
				}
			}
		};
	}

	// (36:6) {:else}
	function create_if_block_1$3(component, ctx) {
		var text;

		return {
			c: function create() {
				text = createText("New Save");
			},

			m: function mount(target, anchor) {
				insert(target, text, anchor);
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(text);
				}
			}
		};
	}

	function get_each_context$4(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.paletteName = list[i].paletteName;
		child_ctx.palette = list[i].palette;
		child_ctx.cardsLength = list[i].cardsLength;
		child_ctx.each_value = list;
		child_ctx.each_index = i;
		return child_ctx;
	}

	function click_handler$2(event) {
		const { component, ctx } = this._svelte;

		component.load(ctx.paletteName);
	}

	function get_each_context_1(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.color = list[i];
		child_ctx.each_value_1 = list;
		child_ctx.color_index = i;
		return child_ctx;
	}

	function click_handler_1(event) {
		const { component, ctx } = this._svelte;

		component.load(ctx.paletteName);
	}

	function click_handler_2(event) {
		const { component, ctx } = this._svelte;

		component.remove(ctx.paletteName);
	}

	function Save_modal(options) {
		this._debugName = '<Save_modal>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this._state = assign(assign(this.store._init(["paletteName"]), data$a()), options.data);
		this.store._add(this, ["paletteName"]);
		this._recompute({ list: 1, value: 1 }, this._state);
		if (!('list' in this._state)) console.warn("<Save_modal> was created without expected data property 'list'");
		if (!('value' in this._state)) console.warn("<Save_modal> was created without expected data property 'value'");
		if (!('$paletteName' in this._state)) console.warn("<Save_modal> was created without expected data property '$paletteName'");
		this._intro = true;

		this._handlers.destroy = [removeFromStore];

		this._fragment = create_main_fragment$a(this, this._state);

		this.root._oncreate.push(() => {
			oncreate$7.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}
	}

	assign(Save_modal.prototype, protoDev);
	assign(Save_modal.prototype, methods$7);

	Save_modal.prototype._checkReadOnly = function _checkReadOnly(newState) {
		if ('listContains' in newState && !this._updatingReadonlyProperty) throw new Error("<Save_modal>: Cannot set read-only property 'listContains'");
	};

	Save_modal.prototype._recompute = function _recompute(changed, state) {
		if (changed.list || changed.value) {
			if (this._differs(state.listContains, (state.listContains = listContains(state)))) changed.listContains = true;
		}
	};

	/* src\svelte\app.html generated by Svelte v2.13.5 */

	const sort = [
	  { name: '---', value: 'none' },
	  { name: 'Random', value: 'random' },
	  { name: 'Hue', value: 'hue' },
	  { name: 'Hue(∠)', value: 'deg' },
	  { name: 'S(HSL)', value: 'saturationl' },
	  { name: 'L(HSL)', value: 'lightness' },
	  { name: 'S(HSV)', value: 'saturationv' },
	  { name: 'V(HSV)', value: 'value' },
	  { name: 'C(HCG)', value: 'chroma' },
	  { name: 'G(HCG)', value: 'gray' },
	  { name: 'W(HWB)', value: 'white' },
	  { name: 'B(HWB)', value: 'wblack' },
	  { name: 'C(CMYK)', value: 'cyan' },
	  { name: 'M(CMYK)', value: 'magenta' },
	  { name: 'Y(CMYK)', value: 'yellow' },
	  { name: 'K(CMYK)', value: 'black' },
	  { name: 'Grayscale', value: 'grayscale' },
	  { name: 'Contrast', value: 'contrast' },
	];

	function textColor$3({ $bgColor }) {
		return $bgColor.isDark() ? '#fff' : '#000';
	}

	function bgColor({ $bgColor, $grayscale }) {
		return $grayscale ? $bgColor.grayscale() : $bgColor;
	}

	function placeholder({ current }) {
		return new Color$1(current.color).nearColorName();
	}

	function data$b() {
	  return {
	    showSubmenu: false,
	    showModal: false,
	    current: {
	      name: '',
	      color: Color$1.random(),
	    },
	    memo: null,
	    sort,
	  }
	}
	var methods$8 = {
	  history () {
	    console.log('');
	  },
	  addCard (current, textMode) {
	    const { name, color } = current;
	    if (!name) {
	      current.name = `(${new Color$1(color).nearColorName()})`;
	    }
	    this.store.fire('cards.ADD_CARD', Object.assign({ textMode }, current));
	    this.set({ current: { name: '', color } });
	  },
	  sortZindex (sortXY) {
	    const state = this.store.get();
	    const { cards, bgColor } = state;
	    const sort = state[sortXY];
	    if (typeof bgColor[sort] === 'function') {
	      this.store.set({
	        cards: cards
	          .sort((a, b) => {
	            const colorA = a.color[sort]();
	            const colorB = b.color[sort]();
	            return colorA - colorB
	          })
	          .map((card, i) => {
	            card.zIndex = i;
	            return card
	          })
	          .sort((a, b) => a.index - b.index),
	      });
	    }
	  },
	  cardsPosition (sortXY, value) {
	    if (sortXY && value) {
	      this.store.set({ [sortXY]: value });
	    }
	    const { cards } = this.store.get();
	    cards.forEach((card, i) => {
	      cards[i] = this.store.cardPosition(card);
	    });
	    this.store.set({ cards });
	    this.store.memo();
	  },
	  setBgColor (color) {
	    const { bgColor } = this.store.get();
	    const coloraplha1 = bgColor.alphaBlending(color);
	    this.store.set({ bgColor: coloraplha1 });
	  },
	  reverse () {
	    const selects = this.selectable.selects;
	    const cards = selects.length ? selects : this.store.get().cards;
	    const indexs = cards.map((card) => card.index);
	    store.fire('cards.TOGGLE_TEXTMODE', indexs);
	  },
	  remove () {
	    const selects = this.selectable.selects;
	    if (selects.length) {
	      store.fire('cards.REMOVE_CARD', selects.map((select) => select.index));
	    } else {
	      this.store.set({ cards: [] });
	      this.store.memo();
	    }
	  },
	  viewModelChenge (model, bool) {
	    const { cardViewModels } = this.store.get();
	    cardViewModels[model] = !bool;
	    this.store.set({ cardViewModels }, true);
	  },
	};

	function oncreate$8() {
	  this.refs.name.addEventListener('focus', function (e) {
	    if (!this.value) {
	      this.value = this.placeholder;
	      this.selectionStart = 0;
	      this.selectionEnd = this.placeholder.length;
	    }
	  });
	  const box = this.refs.box;
	  const cardSize = 120;
	  const colorsWidth = 320;
	  const byer = (sort, card, dirctionflg) => {
	    let by;
	    switch (sort) {
	      case null:
	      case undefined:
	      case 'none':
	      case 'random':
	        return Math.random()
	      case 'deg':
	        return (card.color.hue() - 90) * Math.PI / 180
	      case 'grayscale':
	        by = card.color.grayscale().lightness();
	        break
	      case 'contrast':
	        by = (this.store.get().bgColor[sort](card.color) - 1) / 20;
	        break
	      default:
	        const max = sort === 'hue' ? 360 : 100;
	        by = card.color[sort]() / max;
	        break
	    }
	    return dirctionflg ? by : 1 - by
	  };
	  // card position init
	  store.cardPosition = (card) => {
	    const rect = box.getBoundingClientRect();
	    const { sortX, sortY } = this.store.get();
	    const maxW = rect.width - cardSize - colorsWidth;
	    const maxH = rect.height - cardSize;

	    if (sortX === 'deg' || sortY === 'deg') {
	      // Circle
	      const deg = sortX === 'deg' ? byer(sortX, card) : byer(sortY, card);
	      const radius = sortY === 'deg' ? byer(sortX, card, true) : byer(sortY, card, true);
	      const maxR = Math.min(maxW, maxH) / 2;
	      // console.log('deg', card.color.hsl(),  deg)
	      card.left = Math.round(maxR * Math.cos(deg) * radius + maxR + colorsWidth);
	      card.top = Math.round(maxR * Math.sin(deg) * radius + maxR);
	    } else {
	      if (card.left == null || sortX !== 'none') {
	        card.left = Math.round((maxW) * byer(sortX, card) + colorsWidth);
	      }
	      if (card.top == null || sortY !== 'none') {
	        card.top = Math.round((maxH) * byer(sortY, card));
	      }
	    }
	    return card
	  };
	  // Selectable
	  this.selectable = new Selectable(this.refs.box, {
	    filter: '.card',
	    start: (e, position) => {
	      this.store.fire('menu_close');
	    },
	    selected: (e) => {
	      const selects = this.selectable.selects;
	      const { memo, current } = this.get();

	      if (selects.length === 1) {
	        const { name, color } = store.get().cards[selects[0].index];
	        this.set({ current: { name, color } });
	        if (!memo) {
	          this.set({ memo: current });
	        }
	      }

	      if (!selects.length && memo) {
	        this.set({ current: memo, memo: null });
	      }
	    },
	  });

	  this.store.on('selectAll', () => {
	    this.selectable.selectAll();
	  });
	  this.store.on('delete', () => {
	    this.remove();
	  });
	  this.cardsPosition();
	}
	const file$b = "src\\svelte\\app.html";

	function create_main_fragment$b(component, ctx) {
		var div, div_1, button, i, text_1, button_1, i_1, text_3, button_2, i_2, text_5, button_3, i_3, text_7, button_4, i_4, text_9, button_5, i_5, text_11, text_13, div_2, div_3, button_6, text_14, text_15, ladel, select, select_updating = false, text_17, div_4, button_7, text_18, text_19, ladel_1, select_1, select_1_updating = false, text_22, hr, text_23, div_5, div_6, input, input_updating = false, text_25, div_7, button_8, text_26, text_28, div_8, button_9, text_29, text_31, div_9, button_10, text_32, text_34, colorpicker_updating = {}, text_35, hr_1, text_36, text_37, div_10, text_38, a, i_6, text_41, div_11, text_43, text_44, if_block_1_anchor;

		function click_handler(event) {
			component.set({ showModal: true });
		}

		function click_handler_1(event) {
			component.store.undo();
		}

		function click_handler_2(event) {
			component.store.redo();
		}

		function click_handler_3(event) {
			component.set({showSubmenu: !ctx.showSubmenu});
		}

		function click_handler_4(event) {
			component.reverse();
		}

		function click_handler_5(event) {
			component.remove();
		}

		var if_block = (ctx.showSubmenu) && create_if_block$4(component, ctx);

		function click_handler_6(event) {
			component.sortZindex('sortX');
		}

		var each_value_1 = ctx.sort;

		var each_blocks = [];

		for (var i_7 = 0; i_7 < each_value_1.length; i_7 += 1) {
			each_blocks[i_7] = create_each_block_1$2(component, get_each_context_1$1(ctx, each_value_1, i_7));
		}

		function select_change_handler() {
			select_updating = true;
			component.store.set({ sortX: selectValue(select) });
			select_updating = false;
		}

		function change_handler(event) {
			component.cardsPosition('sortX', this.value);
		}

		function click_handler_7(event) {
			component.sortZindex('sortY');
		}

		var each_value_2 = ctx.sort;

		var each_1_blocks = [];

		for (var i_7 = 0; i_7 < each_value_2.length; i_7 += 1) {
			each_1_blocks[i_7] = create_each_block_2(component, get_each_1_context$1(ctx, each_value_2, i_7));
		}

		function select_1_change_handler() {
			select_1_updating = true;
			component.store.set({ sortY: selectValue(select_1) });
			select_1_updating = false;
		}

		function change_handler_1(event) {
			component.cardsPosition('sortY', this.value);
		}

		function input_input_handler() {
			input_updating = true;
			ctx.current.name = input.value;
			component.set({ current: ctx.current });
			input_updating = false;
		}

		function click_handler_8(event) {
			component.addCard(ctx.current, true);
		}

		function click_handler_9(event) {
			component.addCard(ctx.current);
		}

		function click_handler_10(event) {
			component.setBgColor(ctx.current.color);
		}

		var colorpicker_initial_data = {
		 	bgColor: ctx.$bgColor,
		 	model: ctx.$pickermodel
		 };
		if (ctx.current.color !== void 0) {
			colorpicker_initial_data.color = ctx.current.color;
			colorpicker_updating.color = true;
		}
		var colorpicker = new Color_picker({
			root: component.root,
			store: component.store,
			data: colorpicker_initial_data,
			_bind(changed, childState) {
				var newState = {};
				if (!colorpicker_updating.color && changed.color) {
					ctx.current.color = childState.color;
					newState.current = ctx.current;
				}
				component._set(newState);
				colorpicker_updating = {};
			}
		});

		component.root._beforecreate.push(() => {
			colorpicker._bind({ color: 1 }, colorpicker.get());
		});

		colorpicker.on("modelChange", function(event) {
			component.store.set({pickermodel: event}, true);
		});
		colorpicker.on("setBgColor", function(event) {
			component.setBgColor(ctx.current.color);
		});

		var colorlists = new Color_lists({
			root: component.root,
			store: component.store
		});

		colorlists.on("colorpick", function(event) {
			component.set({current: event.current});
		});

		function mouseleave_handler(event) {
			component.set({showSubmenu: false});
		}

		var each_value_3 = ctx.$cards;

		var each_2_blocks = [];

		for (var i_7 = 0; i_7 < each_value_3.length; i_7 += 1) {
			each_2_blocks[i_7] = create_each_block_3(component, get_each_2_context(ctx, each_value_3, i_7));
		}

		var contextmenu = new Context_menu({
			root: component.root,
			store: component.store
		});

		var if_block_1 = (ctx.showModal) && create_if_block_1$4(component, ctx);

		return {
			c: function create() {
				div = createElement("div");
				div_1 = createElement("div");
				button = createElement("button");
				i = createElement("i");
				text_1 = createText("\r\n    ");
				button_1 = createElement("button");
				i_1 = createElement("i");
				text_3 = createText("\r\n    ");
				button_2 = createElement("button");
				i_2 = createElement("i");
				text_5 = createText("\r\n    ");
				button_3 = createElement("button");
				i_3 = createElement("i");
				text_7 = createText("\r\n    ");
				button_4 = createElement("button");
				i_4 = createElement("i");
				text_9 = createText("\r\n    ");
				button_5 = createElement("button");
				i_5 = createElement("i");
				text_11 = createText("\r\n    ");
				if (if_block) if_block.c();
				text_13 = createText("\r\n\r\n  \r\n  ");
				div_2 = createElement("div");
				div_3 = createElement("div");
				button_6 = createElement("button");
				text_14 = createText("X");
				text_15 = createText("\r\n    ");
				ladel = createElement("ladel");
				select = createElement("select");

				for (var i_7 = 0; i_7 < each_blocks.length; i_7 += 1) {
					each_blocks[i_7].c();
				}

				text_17 = createText("\r\n\r\n    ");
				div_4 = createElement("div");
				button_7 = createElement("button");
				text_18 = createText("Y");
				text_19 = createText("\r\n    ");
				ladel_1 = createElement("ladel");
				select_1 = createElement("select");

				for (var i_7 = 0; i_7 < each_1_blocks.length; i_7 += 1) {
					each_1_blocks[i_7].c();
				}

				text_22 = createText("\r\n\r\n  ");
				hr = createElement("hr");
				text_23 = createText("\r\n\r\n  ");
				div_5 = createElement("div");
				div_6 = createElement("div");
				input = createElement("input");
				text_25 = createText("\r\n    ");
				div_7 = createElement("div");
				button_8 = createElement("button");
				text_26 = createText("➕");
				text_28 = createText("\r\n    ");
				div_8 = createElement("div");
				button_9 = createElement("button");
				text_29 = createText("➕");
				text_31 = createText("\r\n    ");
				div_9 = createElement("div");
				button_10 = createElement("button");
				text_32 = createText("BG");
				text_34 = createText("\r\n\r\n  ");
				colorpicker._fragment.c();
				text_35 = createText("\r\n  ");
				hr_1 = createElement("hr");
				text_36 = createText("\r\n  ");
				colorlists._fragment.c();
				text_37 = createText("\r\n\r\n\r\n  ");
				div_10 = createElement("div");
				text_38 = createText("2018 © techa\r\n    ");
				a = createElement("a");
				i_6 = createElement("i");
				text_41 = createText("\r\n\r\n");
				div_11 = createElement("div");

				for (var i_7 = 0; i_7 < each_2_blocks.length; i_7 += 1) {
					each_2_blocks[i_7].c();
				}

				text_43 = createText("\r\n\r\n");
				contextmenu._fragment.c();
				text_44 = createText("\r\n\r\n");
				if (if_block_1) if_block_1.c();
				if_block_1_anchor = createComment();
				i.className = "fas fa-hdd";
				addLoc(i, file$b, 3, 6, 199);
				addListener(button, "click", click_handler);
				button.title = "Save & Load";
				addLoc(button, file$b, 2, 4, 123);
				i_1.className = "fas fa-undo";
				addLoc(i_1, file$b, 6, 6, 302);
				addListener(button_1, "click", click_handler_1);
				button_1.title = "Undo: ctrl+z";
				addLoc(button_1, file$b, 5, 4, 246);
				i_2.className = "fas fa-redo";
				addLoc(i_2, file$b, 10, 6, 431);
				addListener(button_2, "click", click_handler_2);
				button_2.title = "Redo: ctrl+shift+z";
				addLoc(button_2, file$b, 9, 4, 369);
				i_3.className = "fas fa-eye";
				addLoc(i_3, file$b, 14, 6, 592);
				addListener(button_3, "click", click_handler_3);
				button_3.title = "Card Color Models Visible";
				addLoc(button_3, file$b, 13, 4, 498);
				i_4.className = "fas fa-sync fa-fw";
				addLoc(i_4, file$b, 17, 6, 692);
				addListener(button_4, "click", click_handler_4);
				button_4.title = "Reverse";
				addLoc(button_4, file$b, 16, 4, 639);
				i_5.className = "fas fa-trash";
				addLoc(i_5, file$b, 20, 6, 797);
				addListener(button_5, "click", click_handler_5);
				button_5.title = "Delete";
				addLoc(button_5, file$b, 19, 4, 746);
				div_1.className = "tool-box svelte-1afgjyw";
				addLoc(div_1, file$b, 1, 2, 95);
				addListener(button_6, "click", click_handler_6);
				addLoc(button_6, file$b, 47, 9, 1650);
				addLoc(div_3, file$b, 47, 4, 1645);
				addListener(select, "change", select_change_handler);
				if (!('$sortX' in ctx)) component.root._beforecreate.push(select_change_handler);
				addListener(select, "change", change_handler);
				addLoc(select, file$b, 49, 6, 1773);
				ladel.className = "select-wrapper";
				setStyle(ladel, "flex", "1 1 auto");
				addLoc(ladel, file$b, 48, 4, 1711);
				addListener(button_7, "click", click_handler_7);
				addLoc(button_7, file$b, 56, 9, 1991);
				addLoc(div_4, file$b, 56, 4, 1986);
				addListener(select_1, "change", select_1_change_handler);
				if (!('$sortY' in ctx)) component.root._beforecreate.push(select_1_change_handler);
				addListener(select_1, "change", change_handler_1);
				addLoc(select_1, file$b, 58, 6, 2114);
				ladel_1.className = "select-wrapper";
				setStyle(ladel_1, "flex", "1 1 auto");
				addLoc(ladel_1, file$b, 57, 4, 2052);
				div_2.className = "button-set border radius svelte-1afgjyw";
				addLoc(div_2, file$b, 46, 2, 1601);
				hr.className = "svelte-1afgjyw";
				addLoc(hr, file$b, 66, 2, 2335);
				addListener(input, "input", input_input_handler);
				input.placeholder = ctx.placeholder;
				setStyle(input, "color", ctx.textColor);
				input.className = "svelte-1afgjyw";
				addLoc(input, file$b, 70, 6, 2420);
				div_6.className = "svelte-1afgjyw";
				addLoc(div_6, file$b, 69, 4, 2407);
				addListener(button_8, "click", click_handler_8);
				button_8.title = "Add Card: text";
				setStyle(button_8, "color", ctx.current.color);
				button_8.className = "svelte-1afgjyw";
				addLoc(button_8, file$b, 73, 6, 2535);
				div_7.className = "svelte-1afgjyw";
				addLoc(div_7, file$b, 72, 4, 2522);
				addListener(button_9, "click", click_handler_9);
				button_9.title = "Add Card: fill";
				setStyle(button_9, "color", (ctx.current.color.isDark()?'#fff':'#000'));
				setStyle(button_9, "background-color", ctx.current.color);
				button_9.className = "svelte-1afgjyw";
				addLoc(button_9, file$b, 79, 6, 2700);
				div_8.className = "svelte-1afgjyw";
				addLoc(div_8, file$b, 78, 4, 2687);
				addListener(button_10, "click", click_handler_10);
				button_10.title = "set Background Color";
				button_10.className = "svelte-1afgjyw";
				addLoc(button_10, file$b, 84, 9, 2907);
				div_9.className = "svelte-1afgjyw";
				addLoc(div_9, file$b, 84, 4, 2902);
				div_5.className = "top-input-wrapper button-set border radius svelte-1afgjyw";
				addLoc(div_5, file$b, 68, 2, 2345);
				hr_1.className = "svelte-1afgjyw";
				addLoc(hr_1, file$b, 93, 2, 3221);
				i_6.className = "fab fa-github fa-fw";
				addLoc(i_6, file$b, 99, 53, 3421);
				a.href = "https://github.com/techa/color-factory";
				a.className = "svelte-1afgjyw";
				addLoc(a, file$b, 99, 4, 3372);
				div_10.className = "links svelte-1afgjyw";
				setStyle(div_10, "color", ctx.textColor);
				addLoc(div_10, file$b, 97, 2, 3296);
				addListener(div, "mouseleave", mouseleave_handler);
				div.id = "controller";
				setStyle(div, "color", ctx.textColor);
				div.className = "svelte-1afgjyw";
				addLoc(div, file$b, 0, 0, 0);
				div_11.id = "box";
				setStyle(div_11, "background-color", ctx.bgColor);
				div_11.className = "svelte-1afgjyw";
				addLoc(div_11, file$b, 103, 0, 3482);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, div_1);
				append(div_1, button);
				append(button, i);
				append(div_1, text_1);
				append(div_1, button_1);
				append(button_1, i_1);
				append(div_1, text_3);
				append(div_1, button_2);
				append(button_2, i_2);
				append(div_1, text_5);
				append(div_1, button_3);
				append(button_3, i_3);
				append(div_1, text_7);
				append(div_1, button_4);
				append(button_4, i_4);
				append(div_1, text_9);
				append(div_1, button_5);
				append(button_5, i_5);
				append(div_1, text_11);
				if (if_block) if_block.m(div_1, null);
				append(div, text_13);
				append(div, div_2);
				append(div_2, div_3);
				append(div_3, button_6);
				append(button_6, text_14);
				append(div_2, text_15);
				append(div_2, ladel);
				append(ladel, select);

				for (var i_7 = 0; i_7 < each_blocks.length; i_7 += 1) {
					each_blocks[i_7].m(select, null);
				}

				selectOption(select, ctx.$sortX);

				append(div_2, text_17);
				append(div_2, div_4);
				append(div_4, button_7);
				append(button_7, text_18);
				append(div_2, text_19);
				append(div_2, ladel_1);
				append(ladel_1, select_1);

				for (var i_7 = 0; i_7 < each_1_blocks.length; i_7 += 1) {
					each_1_blocks[i_7].m(select_1, null);
				}

				selectOption(select_1, ctx.$sortY);

				append(div, text_22);
				append(div, hr);
				append(div, text_23);
				append(div, div_5);
				append(div_5, div_6);
				append(div_6, input);
				component.refs.name = input;

				input.value = ctx.current.name;

				append(div_5, text_25);
				append(div_5, div_7);
				append(div_7, button_8);
				append(button_8, text_26);
				append(div_5, text_28);
				append(div_5, div_8);
				append(div_8, button_9);
				append(button_9, text_29);
				append(div_5, text_31);
				append(div_5, div_9);
				append(div_9, button_10);
				append(button_10, text_32);
				append(div, text_34);
				colorpicker._mount(div, null);
				append(div, text_35);
				append(div, hr_1);
				append(div, text_36);
				colorlists._mount(div, null);
				append(div, text_37);
				append(div, div_10);
				append(div_10, text_38);
				append(div_10, a);
				append(a, i_6);
				insert(target, text_41, anchor);
				insert(target, div_11, anchor);

				for (var i_7 = 0; i_7 < each_2_blocks.length; i_7 += 1) {
					each_2_blocks[i_7].m(div_11, null);
				}

				component.refs.box = div_11;
				insert(target, text_43, anchor);
				contextmenu._mount(target, anchor);
				insert(target, text_44, anchor);
				if (if_block_1) if_block_1.m(target, anchor);
				insert(target, if_block_1_anchor, anchor);
			},

			p: function update(changed, _ctx) {
				ctx = _ctx;
				if (ctx.showSubmenu) {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block$4(component, ctx);
						if_block.c();
						if_block.m(div_1, null);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				if (changed.sort) {
					each_value_1 = ctx.sort;

					for (var i_7 = 0; i_7 < each_value_1.length; i_7 += 1) {
						const child_ctx = get_each_context_1$1(ctx, each_value_1, i_7);

						if (each_blocks[i_7]) {
							each_blocks[i_7].p(changed, child_ctx);
						} else {
							each_blocks[i_7] = create_each_block_1$2(component, child_ctx);
							each_blocks[i_7].c();
							each_blocks[i_7].m(select, null);
						}
					}

					for (; i_7 < each_blocks.length; i_7 += 1) {
						each_blocks[i_7].d(1);
					}
					each_blocks.length = each_value_1.length;
				}

				if (!select_updating && changed.$sortX) selectOption(select, ctx.$sortX);

				if (changed.sort) {
					each_value_2 = ctx.sort;

					for (var i_7 = 0; i_7 < each_value_2.length; i_7 += 1) {
						const child_ctx = get_each_1_context$1(ctx, each_value_2, i_7);

						if (each_1_blocks[i_7]) {
							each_1_blocks[i_7].p(changed, child_ctx);
						} else {
							each_1_blocks[i_7] = create_each_block_2(component, child_ctx);
							each_1_blocks[i_7].c();
							each_1_blocks[i_7].m(select_1, null);
						}
					}

					for (; i_7 < each_1_blocks.length; i_7 += 1) {
						each_1_blocks[i_7].d(1);
					}
					each_1_blocks.length = each_value_2.length;
				}

				if (!select_1_updating && changed.$sortY) selectOption(select_1, ctx.$sortY);
				if (!input_updating && changed.current) input.value = ctx.current.name;
				if (changed.placeholder) {
					input.placeholder = ctx.placeholder;
				}

				if (changed.textColor) {
					setStyle(input, "color", ctx.textColor);
				}

				if (changed.current) {
					setStyle(button_8, "color", ctx.current.color);
					setStyle(button_9, "color", (ctx.current.color.isDark()?'#fff':'#000'));
					setStyle(button_9, "background-color", ctx.current.color);
				}

				var colorpicker_changes = {};
				if (changed.$bgColor) colorpicker_changes.bgColor = ctx.$bgColor;
				if (changed.$pickermodel) colorpicker_changes.model = ctx.$pickermodel;
				if (!colorpicker_updating.color && changed.current) {
					colorpicker_changes.color = ctx.current.color;
					colorpicker_updating.color = ctx.current.color !== void 0;
				}
				colorpicker._set(colorpicker_changes);
				colorpicker_updating = {};

				if (changed.textColor) {
					setStyle(div_10, "color", ctx.textColor);
					setStyle(div, "color", ctx.textColor);
				}

				if (changed.$cards) {
					each_value_3 = ctx.$cards;

					for (var i_7 = 0; i_7 < each_value_3.length; i_7 += 1) {
						const child_ctx = get_each_2_context(ctx, each_value_3, i_7);

						if (each_2_blocks[i_7]) {
							each_2_blocks[i_7].p(changed, child_ctx);
						} else {
							each_2_blocks[i_7] = create_each_block_3(component, child_ctx);
							each_2_blocks[i_7].c();
							each_2_blocks[i_7].m(div_11, null);
						}
					}

					for (; i_7 < each_2_blocks.length; i_7 += 1) {
						each_2_blocks[i_7].d(1);
					}
					each_2_blocks.length = each_value_3.length;
				}

				if (changed.bgColor) {
					setStyle(div_11, "background-color", ctx.bgColor);
				}

				if (ctx.showModal) {
					if (!if_block_1) {
						if_block_1 = create_if_block_1$4(component, ctx);
						if_block_1.c();
						if_block_1.m(if_block_1_anchor.parentNode, if_block_1_anchor);
					}
				} else if (if_block_1) {
					if_block_1.d(1);
					if_block_1 = null;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(button, "click", click_handler);
				removeListener(button_1, "click", click_handler_1);
				removeListener(button_2, "click", click_handler_2);
				removeListener(button_3, "click", click_handler_3);
				removeListener(button_4, "click", click_handler_4);
				removeListener(button_5, "click", click_handler_5);
				if (if_block) if_block.d();
				removeListener(button_6, "click", click_handler_6);

				destroyEach(each_blocks, detach);

				removeListener(select, "change", select_change_handler);
				removeListener(select, "change", change_handler);
				removeListener(button_7, "click", click_handler_7);

				destroyEach(each_1_blocks, detach);

				removeListener(select_1, "change", select_1_change_handler);
				removeListener(select_1, "change", change_handler_1);
				removeListener(input, "input", input_input_handler);
				if (component.refs.name === input) component.refs.name = null;
				removeListener(button_8, "click", click_handler_8);
				removeListener(button_9, "click", click_handler_9);
				removeListener(button_10, "click", click_handler_10);
				colorpicker.destroy();
				colorlists.destroy();
				removeListener(div, "mouseleave", mouseleave_handler);
				if (detach) {
					detachNode(text_41);
					detachNode(div_11);
				}

				destroyEach(each_2_blocks, detach);

				if (component.refs.box === div_11) component.refs.box = null;
				if (detach) {
					detachNode(text_43);
				}

				contextmenu.destroy(detach);
				if (detach) {
					detachNode(text_44);
				}

				if (if_block_1) if_block_1.d(detach);
				if (detach) {
					detachNode(if_block_1_anchor);
				}
			}
		};
	}

	// (34:6) {#each Object.entries($cardViewModels) as [model, bool]}
	function create_each_block$5(component, ctx) {
		var p, label, input, input_checked_value, text, text_1_value = ctx.model.toUpperCase(), text_1;

		return {
			c: function create() {
				p = createElement("p");
				label = createElement("label");
				input = createElement("input");
				text = createText("\r\n          ");
				text_1 = createText(text_1_value);
				input._svelte = { component, ctx };

				addListener(input, "click", click_handler$3);
				setAttribute(input, "type", "checkbox");
				input.checked = input_checked_value = ctx.bool;
				addLoc(input, file$b, 36, 10, 1386);
				addLoc(label, file$b, 35, 8, 1367);
				p.className = "menuitem";
				addLoc(p, file$b, 34, 6, 1337);
			},

			m: function mount(target, anchor) {
				insert(target, p, anchor);
				append(p, label);
				append(label, input);
				append(label, text);
				append(label, text_1);
			},

			p: function update(changed, _ctx) {
				ctx = _ctx;
				input._svelte.ctx = ctx;
				if ((changed.Object || changed.$cardViewModels) && input_checked_value !== (input_checked_value = ctx.bool)) {
					input.checked = input_checked_value;
				}

				if ((changed.Object || changed.$cardViewModels) && text_1_value !== (text_1_value = ctx.model.toUpperCase())) {
					setData(text_1, text_1_value);
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(p);
				}

				removeListener(input, "click", click_handler$3);
			}
		};
	}

	// (23:4) {#if showSubmenu}
	function create_if_block$4(component, ctx) {
		var div, p, i, text, text_1, p_1, i_1, text_2, text_3, hr, text_4;

		function click_handler(event) {
			component.store.set({grayscale: !ctx.$grayscale}, true);
		}

		function click_handler_1(event) {
			component.store.set({textvisible: !ctx.$textvisible}, true);
		}

		var each_value = ctx.Object.entries(ctx.$cardViewModels);

		var each_blocks = [];

		for (var i_2 = 0; i_2 < each_value.length; i_2 += 1) {
			each_blocks[i_2] = create_each_block$5(component, get_each_context$5(ctx, each_value, i_2));
		}

		function mouseleave_handler(event) {
			component.set({showSubmenu: false});
		}

		return {
			c: function create() {
				div = createElement("div");
				p = createElement("p");
				i = createElement("i");
				text = createText("\r\n        Filter Grayscale");
				text_1 = createText("\r\n      ");
				p_1 = createElement("p");
				i_1 = createElement("i");
				text_2 = createText("\r\n        Card Text Visible");
				text_3 = createText("\r\n      ");
				hr = createElement("hr");
				text_4 = createText("\r\n      ");

				for (var i_2 = 0; i_2 < each_blocks.length; i_2 += 1) {
					each_blocks[i_2].c();
				}
				i.className = "fas fa-filter fa-fw";
				addLoc(i, file$b, 25, 8, 1018);
				addListener(p, "click", click_handler);
				p.className = "menuitem";
				addLoc(p, file$b, 24, 6, 940);
				i_1.className = "fas fa-font fa-fw";
				addLoc(i_1, file$b, 29, 8, 1181);
				addListener(p_1, "click", click_handler_1);
				p_1.className = "menuitem";
				addLoc(p_1, file$b, 28, 6, 1099);
				hr.className = "svelte-1afgjyw";
				addLoc(hr, file$b, 32, 6, 1261);
				addListener(div, "mouseleave", mouseleave_handler);
				div.className = "submenu";
				addLoc(div, file$b, 23, 4, 869);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, p);
				append(p, i);
				append(p, text);
				append(div, text_1);
				append(div, p_1);
				append(p_1, i_1);
				append(p_1, text_2);
				append(div, text_3);
				append(div, hr);
				append(div, text_4);

				for (var i_2 = 0; i_2 < each_blocks.length; i_2 += 1) {
					each_blocks[i_2].m(div, null);
				}
			},

			p: function update(changed, _ctx) {
				ctx = _ctx;
				if (changed.Object || changed.$cardViewModels) {
					each_value = ctx.Object.entries(ctx.$cardViewModels);

					for (var i_2 = 0; i_2 < each_value.length; i_2 += 1) {
						const child_ctx = get_each_context$5(ctx, each_value, i_2);

						if (each_blocks[i_2]) {
							each_blocks[i_2].p(changed, child_ctx);
						} else {
							each_blocks[i_2] = create_each_block$5(component, child_ctx);
							each_blocks[i_2].c();
							each_blocks[i_2].m(div, null);
						}
					}

					for (; i_2 < each_blocks.length; i_2 += 1) {
						each_blocks[i_2].d(1);
					}
					each_blocks.length = each_value.length;
				}
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(p, "click", click_handler);
				removeListener(p_1, "click", click_handler_1);

				destroyEach(each_blocks, detach);

				removeListener(div, "mouseleave", mouseleave_handler);
			}
		};
	}

	// (51:8) {#each sort as {name, value}}
	function create_each_block_1$2(component, ctx) {
		var option, text_value = ctx.name, text, option_value_value;

		return {
			c: function create() {
				option = createElement("option");
				text = createText(text_value);
				option.__value = option_value_value = ctx.value;
				option.value = option.__value;
				option.className = "svelte-1afgjyw";
				addLoc(option, file$b, 51, 10, 1899);
			},

			m: function mount(target, anchor) {
				insert(target, option, anchor);
				append(option, text);
			},

			p: function update(changed, ctx) {
				if ((changed.sort) && text_value !== (text_value = ctx.name)) {
					setData(text, text_value);
				}

				if ((changed.sort) && option_value_value !== (option_value_value = ctx.value)) {
					option.__value = option_value_value;
				}

				option.value = option.__value;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(option);
				}
			}
		};
	}

	// (60:8) {#each sort as {name, value}}
	function create_each_block_2(component, ctx) {
		var option, text_value = ctx.name, text, option_value_value;

		return {
			c: function create() {
				option = createElement("option");
				text = createText(text_value);
				option.__value = option_value_value = ctx.value;
				option.value = option.__value;
				option.className = "svelte-1afgjyw";
				addLoc(option, file$b, 60, 10, 2240);
			},

			m: function mount(target, anchor) {
				insert(target, option, anchor);
				append(option, text);
			},

			p: function update(changed, ctx) {
				if ((changed.sort) && text_value !== (text_value = ctx.name)) {
					setData(text, text_value);
				}

				if ((changed.sort) && option_value_value !== (option_value_value = ctx.value)) {
					option.__value = option_value_value;
				}

				option.value = option.__value;
			},

			d: function destroy$$1(detach) {
				if (detach) {
					detachNode(option);
				}
			}
		};
	}

	// (105:2) {#each $cards as card, index}
	function create_each_block_3(component, ctx) {

		var colorcard_initial_data = {
		 	card: ctx.card,
		 	index: ctx.index
		 };
		var colorcard = new Color_card({
			root: component.root,
			store: component.store,
			data: colorcard_initial_data
		});

		return {
			c: function create() {
				colorcard._fragment.c();
			},

			m: function mount(target, anchor) {
				colorcard._mount(target, anchor);
			},

			p: function update(changed, ctx) {
				var colorcard_changes = {};
				if (changed.$cards) colorcard_changes.card = ctx.card;
				colorcard._set(colorcard_changes);
			},

			d: function destroy$$1(detach) {
				colorcard.destroy(detach);
			}
		};
	}

	// (112:0) {#if showModal}
	function create_if_block_1$4(component, ctx) {

		var savemodal = new Save_modal({
			root: component.root,
			store: component.store
		});

		savemodal.on("close", function(event) {
			component.set({ showModal: false });
		});

		return {
			c: function create() {
				savemodal._fragment.c();
			},

			m: function mount(target, anchor) {
				savemodal._mount(target, anchor);
			},

			d: function destroy$$1(detach) {
				savemodal.destroy(detach);
			}
		};
	}

	function get_each_context$5(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.model = list[i][0];
		child_ctx.bool = list[i][1];
		child_ctx.each_value = list;
		child_ctx.each_index = i;
		return child_ctx;
	}

	function click_handler$3(event) {
		const { component, ctx } = this._svelte;

		component.viewModelChenge(ctx.model, ctx.bool);
	}

	function get_each_context_1$1(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.name = list[i].name;
		child_ctx.value = list[i].value;
		child_ctx.each_value_1 = list;
		child_ctx.each_index_1 = i;
		return child_ctx;
	}

	function get_each_1_context$1(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.name = list[i].name;
		child_ctx.value = list[i].value;
		child_ctx.each_value_2 = list;
		child_ctx.each_index_2 = i;
		return child_ctx;
	}

	function get_each_2_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.card = list[i];
		child_ctx.each_value_3 = list;
		child_ctx.index = i;
		return child_ctx;
	}

	function App(options) {
		this._debugName = '<App>';
		if (!options || (!options.target && !options.root)) throw new Error("'target' is a required option");
		init(this, options);
		this.refs = {};
		this._state = assign(assign(assign({ Object : Object }, this.store._init(["bgColor","grayscale","textvisible","cardViewModels","sortX","sortY","pickermodel","cards"])), data$b()), options.data);
		this.store._add(this, ["bgColor","grayscale","textvisible","cardViewModels","sortX","sortY","pickermodel","cards"]);
		this._recompute({ $bgColor: 1, $grayscale: 1, current: 1 }, this._state);
		if (!('$bgColor' in this._state)) console.warn("<App> was created without expected data property '$bgColor'");
		if (!('$grayscale' in this._state)) console.warn("<App> was created without expected data property '$grayscale'");
		if (!('current' in this._state)) console.warn("<App> was created without expected data property 'current'");

		if (!('showSubmenu' in this._state)) console.warn("<App> was created without expected data property 'showSubmenu'");
		if (!('$textvisible' in this._state)) console.warn("<App> was created without expected data property '$textvisible'");

		if (!('$cardViewModels' in this._state)) console.warn("<App> was created without expected data property '$cardViewModels'");
		if (!('$sortX' in this._state)) console.warn("<App> was created without expected data property '$sortX'");
		if (!('sort' in this._state)) console.warn("<App> was created without expected data property 'sort'");
		if (!('$sortY' in this._state)) console.warn("<App> was created without expected data property '$sortY'");

		if (!('$pickermodel' in this._state)) console.warn("<App> was created without expected data property '$pickermodel'");

		if (!('$cards' in this._state)) console.warn("<App> was created without expected data property '$cards'");
		if (!('showModal' in this._state)) console.warn("<App> was created without expected data property 'showModal'");
		this._intro = true;

		this._handlers.destroy = [removeFromStore];

		this._fragment = create_main_fragment$b(this, this._state);

		this.root._oncreate.push(() => {
			oncreate$8.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}
	}

	assign(App.prototype, protoDev);
	assign(App.prototype, methods$8);

	App.prototype._checkReadOnly = function _checkReadOnly(newState) {
		if ('textColor' in newState && !this._updatingReadonlyProperty) throw new Error("<App>: Cannot set read-only property 'textColor'");
		if ('bgColor' in newState && !this._updatingReadonlyProperty) throw new Error("<App>: Cannot set read-only property 'bgColor'");
		if ('placeholder' in newState && !this._updatingReadonlyProperty) throw new Error("<App>: Cannot set read-only property 'placeholder'");
	};

	App.prototype._recompute = function _recompute(changed, state) {
		if (changed.$bgColor) {
			if (this._differs(state.textColor, (state.textColor = textColor$3(state)))) changed.textColor = true;
		}

		if (changed.$bgColor || changed.$grayscale) {
			if (this._differs(state.bgColor, (state.bgColor = bgColor(state)))) changed.bgColor = true;
		}

		if (changed.current) {
			if (this._differs(state.placeholder, (state.placeholder = placeholder(state)))) changed.placeholder = true;
		}
	};

	/* eslint  no-new: 0 */

	new App({
	  target: document.querySelector('#root'),
	  store,
	});

}());
//# sourceMappingURL=bundle.js.map
