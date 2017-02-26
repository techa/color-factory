(function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var riot_1 = createCommonjsModule(function (module, exports) {
/* Riot v3.3.1, @license MIT */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.riot = global.riot || {})));
}(commonjsGlobal, (function (exports) { 'use strict';

var __TAGS_CACHE = [];
var __TAG_IMPL = {};
var GLOBAL_MIXIN = '__global_mixin';
var ATTRS_PREFIX = 'riot-';
var REF_DIRECTIVES = ['ref', 'data-ref'];
var IS_DIRECTIVE = 'data-is';
var CONDITIONAL_DIRECTIVE = 'if';
var LOOP_DIRECTIVE = 'each';
var LOOP_NO_REORDER_DIRECTIVE = 'no-reorder';
var SHOW_DIRECTIVE = 'show';
var HIDE_DIRECTIVE = 'hide';
var T_STRING = 'string';
var T_OBJECT = 'object';
var T_UNDEF  = 'undefined';
var T_FUNCTION = 'function';
var XLINK_NS = 'http://www.w3.org/1999/xlink';
var XLINK_REGEX = /^xlink:(\w+)/;
var WIN = typeof window === T_UNDEF ? undefined : window;
var RE_SPECIAL_TAGS = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?|opt(?:ion|group))$/;
var RE_SPECIAL_TAGS_NO_OPTION = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?)$/;
var RE_RESERVED_NAMES = /^(?:_(?:item|id|parent)|update|root|(?:un)?mount|mixin|is(?:Mounted|Loop)|tags|refs|parent|opts|trigger|o(?:n|ff|ne))$/;
var RE_SVG_TAGS = /^(altGlyph|animate(?:Color)?|circle|clipPath|defs|ellipse|fe(?:Blend|ColorMatrix|ComponentTransfer|Composite|ConvolveMatrix|DiffuseLighting|DisplacementMap|Flood|GaussianBlur|Image|Merge|Morphology|Offset|SpecularLighting|Tile|Turbulence)|filter|font|foreignObject|g(?:lyph)?(?:Ref)?|image|line(?:arGradient)?|ma(?:rker|sk)|missing-glyph|path|pattern|poly(?:gon|line)|radialGradient|rect|stop|svg|switch|symbol|text(?:Path)?|tref|tspan|use)$/;
var RE_HTML_ATTRS = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g;
var CASE_SENSITIVE_ATTRIBUTES = { 'viewbox': 'viewBox' };
var RE_BOOL_ATTRS = /^(?:disabled|checked|readonly|required|allowfullscreen|auto(?:focus|play)|compact|controls|default|formnovalidate|hidden|ismap|itemscope|loop|multiple|muted|no(?:resize|shade|validate|wrap)?|open|reversed|seamless|selected|sortable|truespeed|typemustmatch)$/;
var IE_VERSION = (WIN && WIN.document || {}).documentMode | 0;

/**
 * Check whether a DOM node must be considered a part of an svg document
 * @param   { String } name -
 * @returns { Boolean } -
 */
function isSVGTag(name) {
  return RE_SVG_TAGS.test(name)
}

/**
 * Check Check if the passed argument is undefined
 * @param   { String } value -
 * @returns { Boolean } -
 */
function isBoolAttr(value) {
  return RE_BOOL_ATTRS.test(value)
}

/**
 * Check if passed argument is a function
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isFunction(value) {
  return typeof value === T_FUNCTION
}

/**
 * Check if passed argument is an object, exclude null
 * NOTE: use isObject(x) && !isArray(x) to excludes arrays.
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isObject(value) {
  return value && typeof value === T_OBJECT // typeof null is 'object'
}

/**
 * Check if passed argument is undefined
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isUndefined(value) {
  return typeof value === T_UNDEF
}

/**
 * Check if passed argument is a string
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isString(value) {
  return typeof value === T_STRING
}

/**
 * Check if passed argument is empty. Different from falsy, because we dont consider 0 or false to be blank
 * @param { * } value -
 * @returns { Boolean } -
 */
function isBlank(value) {
  return isUndefined(value) || value === null || value === ''
}

/**
 * Check if passed argument is a kind of array
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isArray(value) {
  return Array.isArray(value) || value instanceof Array
}

/**
 * Check whether object's property could be overridden
 * @param   { Object }  obj - source object
 * @param   { String }  key - object property
 * @returns { Boolean } -
 */
function isWritable(obj, key) {
  var descriptor = Object.getOwnPropertyDescriptor(obj, key);
  return isUndefined(obj[key]) || descriptor && descriptor.writable
}

/**
 * Check if passed argument is a reserved name
 * @param   { String } value -
 * @returns { Boolean } -
 */
function isReservedName(value) {
  return RE_RESERVED_NAMES.test(value)
}

var check = Object.freeze({
	isSVGTag: isSVGTag,
	isBoolAttr: isBoolAttr,
	isFunction: isFunction,
	isObject: isObject,
	isUndefined: isUndefined,
	isString: isString,
	isBlank: isBlank,
	isArray: isArray,
	isWritable: isWritable,
	isReservedName: isReservedName
});

/**
 * Shorter and fast way to select multiple nodes in the DOM
 * @param   { String } selector - DOM selector
 * @param   { Object } ctx - DOM node where the targets of our search will is located
 * @returns { Object } dom nodes found
 */
function $$(selector, ctx) {
  return (ctx || document).querySelectorAll(selector)
}

/**
 * Shorter and fast way to select a single node in the DOM
 * @param   { String } selector - unique dom selector
 * @param   { Object } ctx - DOM node where the target of our search will is located
 * @returns { Object } dom node found
 */
function $(selector, ctx) {
  return (ctx || document).querySelector(selector)
}

/**
 * Create a document fragment
 * @returns { Object } document fragment
 */
function createFrag() {
  return document.createDocumentFragment()
}

/**
 * Create a document text node
 * @returns { Object } create a text node to use as placeholder
 */
function createDOMPlaceholder() {
  return document.createTextNode('')
}

/**
 * Create a generic DOM node
 * @param   { String } name - name of the DOM node we want to create
 * @param   { Boolean } isSvg - should we use a SVG as parent node?
 * @returns { Object } DOM node just created
 */
function mkEl(name, isSvg) {
  return isSvg ?
    document.createElementNS('http://www.w3.org/2000/svg', 'svg') :
    document.createElement(name)
}

/**
 * Get the outer html of any DOM node SVGs included
 * @param   { Object } el - DOM node to parse
 * @returns { String } el.outerHTML
 */
function getOuterHTML(el) {
  if (el.outerHTML)
    { return el.outerHTML }
  // some browsers do not support outerHTML on the SVGs tags
  else {
    var container = mkEl('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

/**
 * Set the inner html of any DOM node SVGs included
 * @param { Object } container - DOM node where we'll inject new html
 * @param { String } html - html to inject
 */
function setInnerHTML(container, html) {
  if (!isUndefined(container.innerHTML))
    { container.innerHTML = html; }
    // some browsers do not support innerHTML on the SVGs tags
  else {
    var doc = new DOMParser().parseFromString(html, 'application/xml');
    var node = container.ownerDocument.importNode(doc.documentElement, true);
    container.appendChild(node);
  }
}

/**
 * Remove any DOM attribute from a node
 * @param   { Object } dom - DOM node we want to update
 * @param   { String } name - name of the property we want to remove
 */
function remAttr(dom, name) {
  dom.removeAttribute(name);
}

/**
 * Get the value of any DOM attribute on a node
 * @param   { Object } dom - DOM node we want to parse
 * @param   { String } name - name of the attribute we want to get
 * @returns { String | undefined } name of the node attribute whether it exists
 */
function getAttr(dom, name) {
  return dom.getAttribute(name)
}

/**
 * Set any DOM attribute
 * @param { Object } dom - DOM node we want to update
 * @param { String } name - name of the property we want to set
 * @param { String } val - value of the property we want to set
 */
function setAttr(dom, name, val) {
  var xlink = XLINK_REGEX.exec(name);
  if (xlink && xlink[1])
    { dom.setAttributeNS(XLINK_NS, xlink[1], val); }
  else
    { dom.setAttribute(name, val); }
}

/**
 * Insert safely a tag to fix #1962 #1649
 * @param   { HTMLElement } root - children container
 * @param   { HTMLElement } curr - node to insert
 * @param   { HTMLElement } next - node that should preceed the current node inserted
 */
function safeInsert(root, curr, next) {
  root.insertBefore(curr, next.parentNode && next);
}

/**
 * Minimize risk: only zero or one _space_ between attr & value
 * @param   { String }   html - html string we want to parse
 * @param   { Function } fn - callback function to apply on any attribute found
 */
function walkAttrs(html, fn) {
  if (!html)
    { return }
  var m;
  while (m = RE_HTML_ATTRS.exec(html))
    { fn(m[1].toLowerCase(), m[2] || m[3] || m[4]); }
}

/**
 * Walk down recursively all the children tags starting dom node
 * @param   { Object }   dom - starting node where we will start the recursion
 * @param   { Function } fn - callback to transform the child node just found
 * @param   { Object }   context - fn can optionally return an object, which is passed to children
 */
function walkNodes(dom, fn, context) {
  if (dom) {
    var res = fn(dom, context);
    var next;
    // stop the recursion
    if (res === false) { return }

    dom = dom.firstChild;

    while (dom) {
      next = dom.nextSibling;
      walkNodes(dom, fn, res);
      dom = next;
    }
  }
}

var dom = Object.freeze({
	$$: $$,
	$: $,
	createFrag: createFrag,
	createDOMPlaceholder: createDOMPlaceholder,
	mkEl: mkEl,
	getOuterHTML: getOuterHTML,
	setInnerHTML: setInnerHTML,
	remAttr: remAttr,
	getAttr: getAttr,
	setAttr: setAttr,
	safeInsert: safeInsert,
	walkAttrs: walkAttrs,
	walkNodes: walkNodes
});

var styleNode;
var cssTextProp;
var byName = {};
var remainder = [];
var needsInject = false;

// skip the following code on the server
if (WIN) {
  styleNode = (function () {
    // create a new style element with the correct type
    var newNode = mkEl('style');
    setAttr(newNode, 'type', 'text/css');

    // replace any user node or insert the new one into the head
    var userNode = $('style[type=riot]');
    if (userNode) {
      if (userNode.id) { newNode.id = userNode.id; }
      userNode.parentNode.replaceChild(newNode, userNode);
    }
    else { document.getElementsByTagName('head')[0].appendChild(newNode); }

    return newNode
  })();
  cssTextProp = styleNode.styleSheet;
}

/**
 * Object that will be used to inject and manage the css of every tag instance
 */
var styleManager = {
  styleNode: styleNode,
  /**
   * Save a tag style to be later injected into DOM
   * @param { String } css - css string
   * @param { String } name - if it's passed we will map the css to a tagname
   */
  add: function add(css, name) {
    if (name) { byName[name] = css; }
    else { remainder.push(css); }
    needsInject = true;
  },
  /**
   * Inject all previously saved tag styles into DOM
   * innerHTML seems slow: http://jsperf.com/riot-insert-style
   */
  inject: function inject() {
    if (!WIN || !needsInject) { return }
    needsInject = false;
    var style = Object.keys(byName)
      .map(function(k) { return byName[k] })
      .concat(remainder).join('\n');
    if (cssTextProp) { cssTextProp.cssText = style; }
    else { styleNode.innerHTML = style; }
  }
};

/**
 * The riot template engine
 * @version v3.0.2
 */
/**
 * riot.util.brackets
 *
 * - `brackets    ` - Returns a string or regex based on its parameter
 * - `brackets.set` - Change the current riot brackets
 *
 * @module
 */

/* global riot */

var brackets = (function (UNDEF) {

  var
    REGLOB = 'g',

    R_MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,

    R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'/g,

    S_QBLOCKS = R_STRINGS.source + '|' +
      /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
      /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source,

    UNSUPPORTED = RegExp('[\\' + 'x00-\\x1F<>a-zA-Z0-9\'",;\\\\]'),

    NEED_ESCAPE = /(?=[[\]()*+?.^$|])/g,

    FINDBRACES = {
      '(': RegExp('([()])|'   + S_QBLOCKS, REGLOB),
      '[': RegExp('([[\\]])|' + S_QBLOCKS, REGLOB),
      '{': RegExp('([{}])|'   + S_QBLOCKS, REGLOB)
    },

    DEFAULT = '{ }';

  var _pairs = [
    '{', '}',
    '{', '}',
    /{[^}]*}/,
    /\\([{}])/g,
    /\\({)|{/g,
    RegExp('\\\\(})|([[({])|(})|' + S_QBLOCKS, REGLOB),
    DEFAULT,
    /^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/,
    /(^|[^\\]){=[\S\s]*?}/
  ];

  var
    cachedBrackets = UNDEF,
    _regex,
    _cache = [],
    _settings;

  function _loopback (re) { return re }

  function _rewrite (re, bp) {
    if (!bp) { bp = _cache; }
    return new RegExp(
      re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : ''
    )
  }

  function _create (pair) {
    if (pair === DEFAULT) { return _pairs }

    var arr = pair.split(' ');

    if (arr.length !== 2 || UNSUPPORTED.test(pair)) {
      throw new Error('Unsupported brackets "' + pair + '"')
    }
    arr = arr.concat(pair.replace(NEED_ESCAPE, '\\').split(' '));

    arr[4] = _rewrite(arr[1].length > 1 ? /{[\S\s]*?}/ : _pairs[4], arr);
    arr[5] = _rewrite(pair.length > 3 ? /\\({|})/g : _pairs[5], arr);
    arr[6] = _rewrite(_pairs[6], arr);
    arr[7] = RegExp('\\\\(' + arr[3] + ')|([[({])|(' + arr[3] + ')|' + S_QBLOCKS, REGLOB);
    arr[8] = pair;
    return arr
  }

  function _brackets (reOrIdx) {
    return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _cache[reOrIdx]
  }

  _brackets.split = function split (str, tmpl, _bp) {
    // istanbul ignore next: _bp is for the compiler
    if (!_bp) { _bp = _cache; }

    var
      parts = [],
      match,
      isexpr,
      start,
      pos,
      re = _bp[6];

    isexpr = start = re.lastIndex = 0;

    while ((match = re.exec(str))) {

      pos = match.index;

      if (isexpr) {

        if (match[2]) {
          re.lastIndex = skipBraces(str, match[2], re.lastIndex);
          continue
        }
        if (!match[3]) {
          continue
        }
      }

      if (!match[1]) {
        unescapeStr(str.slice(start, pos));
        start = re.lastIndex;
        re = _bp[6 + (isexpr ^= 1)];
        re.lastIndex = start;
      }
    }

    if (str && start < str.length) {
      unescapeStr(str.slice(start));
    }

    return parts

    function unescapeStr (s) {
      if (tmpl || isexpr) {
        parts.push(s && s.replace(_bp[5], '$1'));
      } else {
        parts.push(s);
      }
    }

    function skipBraces (s, ch, ix) {
      var
        match,
        recch = FINDBRACES[ch];

      recch.lastIndex = ix;
      ix = 1;
      while ((match = recch.exec(s))) {
        if (match[1] &&
          !(match[1] === ch ? ++ix : --ix)) { break }
      }
      return ix ? s.length : recch.lastIndex
    }
  };

  _brackets.hasExpr = function hasExpr (str) {
    return _cache[4].test(str)
  };

  _brackets.loopKeys = function loopKeys (expr) {
    var m = expr.match(_cache[9]);

    return m
      ? { key: m[1], pos: m[2], val: _cache[0] + m[3].trim() + _cache[1] }
      : { val: expr.trim() }
  };

  _brackets.array = function array (pair) {
    return pair ? _create(pair) : _cache
  };

  function _reset (pair) {
    if ((pair || (pair = DEFAULT)) !== _cache[8]) {
      _cache = _create(pair);
      _regex = pair === DEFAULT ? _loopback : _rewrite;
      _cache[9] = _regex(_pairs[9]);
    }
    cachedBrackets = pair;
  }

  function _setSettings (o) {
    var b;

    o = o || {};
    b = o.brackets;
    Object.defineProperty(o, 'brackets', {
      set: _reset,
      get: function () { return cachedBrackets },
      enumerable: true
    });
    _settings = o;
    _reset(b);
  }

  Object.defineProperty(_brackets, 'settings', {
    set: _setSettings,
    get: function () { return _settings }
  });

  /* istanbul ignore next: in the browser riot is always in the scope */
  _brackets.settings = typeof riot !== 'undefined' && riot.settings || {};
  _brackets.set = _reset;

  _brackets.R_STRINGS = R_STRINGS;
  _brackets.R_MLCOMMS = R_MLCOMMS;
  _brackets.S_QBLOCKS = S_QBLOCKS;

  return _brackets

})();

/**
 * @module tmpl
 *
 * tmpl          - Root function, returns the template value, render with data
 * tmpl.hasExpr  - Test the existence of a expression inside a string
 * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
 */

var tmpl = (function () {

  var _cache = {};

  function _tmpl (str, data) {
    if (!str) { return str }

    return (_cache[str] || (_cache[str] = _create(str))).call(data, _logErr)
  }

  _tmpl.hasExpr = brackets.hasExpr;

  _tmpl.loopKeys = brackets.loopKeys;

  // istanbul ignore next
  _tmpl.clearCache = function () { _cache = {}; };

  _tmpl.errorHandler = null;

  function _logErr (err, ctx) {

    err.riotData = {
      tagName: ctx && ctx.__ && ctx.__.tagName,
      _riot_id: ctx && ctx._riot_id  //eslint-disable-line camelcase
    };

    if (_tmpl.errorHandler) { _tmpl.errorHandler(err); }
    else if (
      typeof console !== 'undefined' &&
      typeof console.error === 'function'
    ) {
      if (err.riotData.tagName) {
        console.error('Riot template error thrown in the <%s> tag', err.riotData.tagName);
      }
      console.error(err);
    }
  }

  function _create (str) {
    var expr = _getTmpl(str);

    if (expr.slice(0, 11) !== 'try{return ') { expr = 'return ' + expr; }

    return new Function('E', expr + ';')    // eslint-disable-line no-new-func
  }

  var
    CH_IDEXPR = String.fromCharCode(0x2057),
    RE_CSNAME = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\u2057(\d+)~):/,
    RE_QBLOCK = RegExp(brackets.S_QBLOCKS, 'g'),
    RE_DQUOTE = /\u2057/g,
    RE_QBMARK = /\u2057(\d+)~/g;

  function _getTmpl (str) {
    var
      qstr = [],
      expr,
      parts = brackets.split(str.replace(RE_DQUOTE, '"'), 1);

    if (parts.length > 2 || parts[0]) {
      var i, j, list = [];

      for (i = j = 0; i < parts.length; ++i) {

        expr = parts[i];

        if (expr && (expr = i & 1

            ? _parseExpr(expr, 1, qstr)

            : '"' + expr
                .replace(/\\/g, '\\\\')
                .replace(/\r\n?|\n/g, '\\n')
                .replace(/"/g, '\\"') +
              '"'

          )) { list[j++] = expr; }

      }

      expr = j < 2 ? list[0]
           : '[' + list.join(',') + '].join("")';

    } else {

      expr = _parseExpr(parts[1], 0, qstr);
    }

    if (qstr[0]) {
      expr = expr.replace(RE_QBMARK, function (_, pos) {
        return qstr[pos]
          .replace(/\r/g, '\\r')
          .replace(/\n/g, '\\n')
      });
    }
    return expr
  }

  var
    RE_BREND = {
      '(': /[()]/g,
      '[': /[[\]]/g,
      '{': /[{}]/g
    };

  function _parseExpr (expr, asText, qstr) {

    expr = expr
          .replace(RE_QBLOCK, function (s, div) {
            return s.length > 2 && !div ? CH_IDEXPR + (qstr.push(s) - 1) + '~' : s
          })
          .replace(/\s+/g, ' ').trim()
          .replace(/\ ?([[\({},?\.:])\ ?/g, '$1');

    if (expr) {
      var
        list = [],
        cnt = 0,
        match;

      while (expr &&
            (match = expr.match(RE_CSNAME)) &&
            !match.index
        ) {
        var
          key,
          jsb,
          re = /,|([[{(])|$/g;

        expr = RegExp.rightContext;
        key  = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1];

        while (jsb = (match = re.exec(expr))[1]) { skipBraces(jsb, re); }

        jsb  = expr.slice(0, match.index);
        expr = RegExp.rightContext;

        list[cnt++] = _wrapExpr(jsb, 1, key);
      }

      expr = !cnt ? _wrapExpr(expr, asText)
           : cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0];
    }
    return expr

    function skipBraces (ch, re) {
      var
        mm,
        lv = 1,
        ir = RE_BREND[ch];

      ir.lastIndex = re.lastIndex;
      while (mm = ir.exec(expr)) {
        if (mm[0] === ch) { ++lv; }
        else if (!--lv) { break }
      }
      re.lastIndex = lv ? expr.length : ir.lastIndex;
    }
  }

  // istanbul ignore next: not both
  var // eslint-disable-next-line max-len
    JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').',
    JS_VARNAME = /[,{][\$\w]+(?=:)|(^ *|[^$\w\.{])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g,
    JS_NOPROPS = /^(?=(\.[$\w]+))\1(?:[^.[(]|$)/;

  function _wrapExpr (expr, asText, key) {
    var tb;

    expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
      if (mvar) {
        pos = tb ? 0 : pos + match.length;

        if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
          match = p + '("' + mvar + JS_CONTEXT + mvar;
          if (pos) { tb = (s = s[pos]) === '.' || s === '(' || s === '['; }
        } else if (pos) {
          tb = !JS_NOPROPS.test(s.slice(pos));
        }
      }
      return match
    });

    if (tb) {
      expr = 'try{return ' + expr + '}catch(e){E(e,this)}';
    }

    if (key) {

      expr = (tb
          ? 'function(){' + expr + '}.call(this)' : '(' + expr + ')'
        ) + '?"' + key + '":""';

    } else if (asText) {

      expr = 'function(v){' + (tb
          ? expr.replace('return ', 'v=') : 'v=(' + expr + ')'
        ) + ';return v||v===0?v:""}.call(this)';
    }

    return expr
  }

  _tmpl.version = brackets.version = 'v3.0.2';

  return _tmpl

})();

var observable$1 = function(el) {

  /**
   * Extend the original object or create a new empty one
   * @type { Object }
   */

  el = el || {};

  /**
   * Private variables
   */
  var callbacks = {},
    slice = Array.prototype.slice;

  /**
   * Public Api
   */

  // extend the el object adding the observable methods
  Object.defineProperties(el, {
    /**
     * Listen to the given `event` ands
     * execute the `callback` each time an event is triggered.
     * @param  { String } event - event id
     * @param  { Function } fn - callback function
     * @returns { Object } el
     */
    on: {
      value: function(event, fn) {
        if (typeof fn == 'function')
          { (callbacks[event] = callbacks[event] || []).push(fn); }
        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Removes the given `event` listeners
     * @param   { String } event - event id
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    off: {
      value: function(event, fn) {
        if (event == '*' && !fn) { callbacks = {}; }
        else {
          if (fn) {
            var arr = callbacks[event];
            for (var i = 0, cb; cb = arr && arr[i]; ++i) {
              if (cb == fn) { arr.splice(i--, 1); }
            }
          } else { delete callbacks[event]; }
        }
        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Listen to the given `event` and
     * execute the `callback` at most once
     * @param   { String } event - event id
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    one: {
      value: function(event, fn) {
        function on() {
          el.off(event, on);
          fn.apply(el, arguments);
        }
        return el.on(event, on)
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Execute all callback functions that listen to
     * the given `event`
     * @param   { String } event - event id
     * @returns { Object } el
     */
    trigger: {
      value: function(event) {
        var arguments$1 = arguments;


        // getting the arguments
        var arglen = arguments.length - 1,
          args = new Array(arglen),
          fns,
          fn,
          i;

        for (i = 0; i < arglen; i++) {
          args[i] = arguments$1[i + 1]; // skip first argument
        }

        fns = slice.call(callbacks[event] || [], 0);

        for (i = 0; fn = fns[i]; ++i) {
          fn.apply(el, args);
        }

        if (callbacks['*'] && event != '*')
          { el.trigger.apply(el, ['*', event].concat(args)); }

        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    }
  });

  return el

};

/**
 * Specialized function for looping an array-like collection with `each={}`
 * @param   { Array } list - collection of items
 * @param   {Function} fn - callback function
 * @returns { Array } the array looped
 */
function each(list, fn) {
  var len = list ? list.length : 0;

  for (var i = 0, el; i < len; ++i) {
    el = list[i];
    // return false -> current item was removed by fn during the loop
    if (fn(el, i) === false)
      { i--; }
  }
  return list
}

/**
 * Check whether an array contains an item
 * @param   { Array } array - target array
 * @param   { * } item - item to test
 * @returns { Boolean } -
 */
function contains(array, item) {
  return array.indexOf(item) !== -1
}

/**
 * Convert a string containing dashes to camel case
 * @param   { String } str - input string
 * @returns { String } my-string -> myString
 */
function toCamel(str) {
  return str.replace(/-(\w)/g, function (_, c) { return c.toUpperCase(); })
}

/**
 * Faster String startsWith alternative
 * @param   { String } str - source string
 * @param   { String } value - test string
 * @returns { Boolean } -
 */
function startsWith(str, value) {
  return str.slice(0, value.length) === value
}

/**
 * Helper function to set an immutable property
 * @param   { Object } el - object where the new property will be set
 * @param   { String } key - object key where the new property will be stored
 * @param   { * } value - value of the new property
 * @param   { Object } options - set the propery overriding the default options
 * @returns { Object } - the initial object
 */
function defineProperty(el, key, value, options) {
  Object.defineProperty(el, key, extend({
    value: value,
    enumerable: false,
    writable: false,
    configurable: true
  }, options));
  return el
}

/**
 * Extend any object with other properties
 * @param   { Object } src - source object
 * @returns { Object } the resulting extended object
 *
 * var obj = { foo: 'baz' }
 * extend(obj, {bar: 'bar', foo: 'bar'})
 * console.log(obj) => {bar: 'bar', foo: 'bar'}
 *
 */
function extend(src) {
  var obj, args = arguments;
  for (var i = 1; i < args.length; ++i) {
    if (obj = args[i]) {
      for (var key in obj) {
        // check if this property of the source object could be overridden
        if (isWritable(src, key))
          { src[key] = obj[key]; }
      }
    }
  }
  return src
}

var misc = Object.freeze({
	each: each,
	contains: contains,
	toCamel: toCamel,
	startsWith: startsWith,
	defineProperty: defineProperty,
	extend: extend
});

var settings$1 = extend(Object.create(brackets.settings), {
  skipAnonymousTags: true
});

var EVENTS_PREFIX_REGEX = /^on/;

/**
 * Trigger DOM events
 * @param   { HTMLElement } dom - dom element target of the event
 * @param   { Function } handler - user function
 * @param   { Object } e - event object
 */
function handleEvent(dom, handler, e) {
  var ptag = this.__.parent,
    item = this.__.item;

  if (!item)
    { while (ptag && !item) {
      item = ptag.__.item;
      ptag = ptag.__.parent;
    } }

  // override the event properties
  if (isWritable(e, 'currentTarget')) { e.currentTarget = dom; }
  if (isWritable(e, 'target')) { e.target = e.srcElement; }
  if (isWritable(e, 'which')) { e.which = e.charCode || e.keyCode; }

  e.item = item;

  handler.call(this, e);

  if (!e.preventUpdate) {
    var p = getImmediateCustomParentTag(this);
    // fixes #2083
    if (p.isMounted) { p.update(); }
  }
}

/**
 * Attach an event to a DOM node
 * @param { String } name - event name
 * @param { Function } handler - event callback
 * @param { Object } dom - dom node
 * @param { Tag } tag - tag instance
 */
function setEventHandler(name, handler, dom, tag) {
  var eventName,
    cb = handleEvent.bind(tag, dom, handler);

  if (!dom.addEventListener) {
    dom[name] = cb;
    return
  }

  // avoid to bind twice the same event
  dom[name] = null;

  // normalize event name
  eventName = name.replace(EVENTS_PREFIX_REGEX, '');

  // cache the callback directly on the DOM node
  if (!dom._riotEvents) { dom._riotEvents = {}; }

  if (dom._riotEvents[name])
    { dom.removeEventListener(eventName, dom._riotEvents[name]); }

  dom._riotEvents[name] = cb;
  dom.addEventListener(eventName, cb, false);
}

/**
 * Update dynamically created data-is tags with changing expressions
 * @param { Object } expr - expression tag and expression info
 * @param { Tag } parent - parent for tag creation
 */
function updateDataIs(expr, parent) {
  var tagName = tmpl(expr.value, parent),
    conf, isVirtual, head, ref;

  if (expr.tag && expr.tagName === tagName) {
    expr.tag.update();
    return
  }

  isVirtual = expr.dom.tagName === 'VIRTUAL';
  // sync _parent to accommodate changing tagnames
  if (expr.tag) {

    // need placeholder before unmount
    if(isVirtual) {
      head = expr.tag.__.head;
      ref = createDOMPlaceholder();
      head.parentNode.insertBefore(ref, head);
    }

    expr.tag.unmount(true);
  }

  expr.impl = __TAG_IMPL[tagName];
  conf = {root: expr.dom, parent: parent, hasImpl: true, tagName: tagName};
  expr.tag = initChildTag(expr.impl, conf, expr.dom.innerHTML, parent);
  each(expr.attrs, function (a) { return setAttr(expr.tag.root, a.name, a.value); });
  expr.tagName = tagName;
  expr.tag.mount();
  if (isVirtual)
    { makeReplaceVirtual(expr.tag, ref || expr.tag.root); } // root exist first time, after use placeholder

  // parent is the placeholder tag, not the dynamic tag so clean up
  parent.__.onUnmount = function() {
    var delName = expr.tag.opts.dataIs,
      tags = expr.tag.parent.tags,
      _tags = expr.tag.__.parent.tags;
    arrayishRemove(tags, delName, expr.tag);
    arrayishRemove(_tags, delName, expr.tag);
    expr.tag.unmount();
  };
}

/**
 * Update on single tag expression
 * @this Tag
 * @param { Object } expr - expression logic
 * @returns { undefined }
 */
function updateExpression(expr) {
  if (this.root && getAttr(this.root,'virtualized')) { return }

  var dom = expr.dom,
    attrName = expr.attr,
    isToggle = contains([SHOW_DIRECTIVE, HIDE_DIRECTIVE], attrName),
    value = tmpl(expr.expr, this),
    isValueAttr = attrName === 'riot-value',
    isVirtual = expr.root && expr.root.tagName === 'VIRTUAL',
    parent = dom && (expr.parent || dom.parentNode),
    old;

  if (expr.bool)
    { value = value ? attrName : false; }
  else if (isUndefined(value) || value === null)
    { value = ''; }

  if (expr._riot_id) { // if it's a tag
    if (expr.isMounted) {
      expr.update();

    // if it hasn't been mounted yet, do that now.
    } else {
      expr.mount();

      if (isVirtual)
        { makeReplaceVirtual(expr, expr.root); }

    }
    return
  }

  old = expr.value;
  expr.value = value;

  if (expr.update) {
    expr.update();
    return
  }

  if (expr.isRtag && value) { return updateDataIs(expr, this) }
  if (old === value) { return }
  // no change, so nothing more to do
  if (isValueAttr && dom.value === value) { return }

  // textarea and text nodes have no attribute name
  if (!attrName) {
    // about #815 w/o replace: the browser converts the value to a string,
    // the comparison by "==" does too, but not in the server
    value += '';
    // test for parent avoids error with invalid assignment to nodeValue
    if (parent) {
      // cache the parent node because somehow it will become null on IE
      // on the next iteration
      expr.parent = parent;
      if (parent.tagName === 'TEXTAREA') {
        parent.value = value;                    // #1113
        if (!IE_VERSION) { dom.nodeValue = value; }  // #1625 IE throws here, nodeValue
      }                                         // will be available on 'updated'
      else { dom.nodeValue = value; }
    }
    return
  }

  // remove original attribute
  if (!expr.isAttrRemoved || !value) {
    remAttr(dom, attrName);
    expr.isAttrRemoved = true;
  }

  // event handler
  if (isFunction(value)) {
    setEventHandler(attrName, value, dom, this);
  // show / hide
  } else if (isToggle) {
    if (attrName === HIDE_DIRECTIVE) { value = !value; }
    dom.style.display = value ? '' : 'none';
  // field value
  } else if (isValueAttr) {
    dom.value = value;
  // <img src="{ expr }">
  } else if (startsWith(attrName, ATTRS_PREFIX) && attrName !== IS_DIRECTIVE) {
    attrName = attrName.slice(ATTRS_PREFIX.length);
    if (CASE_SENSITIVE_ATTRIBUTES[attrName])
      { attrName = CASE_SENSITIVE_ATTRIBUTES[attrName]; }
    if (value != null)
      { setAttr(dom, attrName, value); }
  } else {
    if (expr.bool) {
      dom[attrName] = value;
      if (!value) { return }
    }

    if (value === 0 || value && typeof value !== T_OBJECT) {
      setAttr(dom, attrName, value);
    }
  }
}

/**
 * Update all the expressions in a Tag instance
 * @this Tag
 * @param { Array } expressions - expression that must be re evaluated
 */
function updateAllExpressions(expressions) {
  each(expressions, updateExpression.bind(this));
}

var IfExpr = {
  init: function init(dom, tag, expr) {
    remAttr(dom, CONDITIONAL_DIRECTIVE);
    this.tag = tag;
    this.expr = expr;
    this.stub = document.createTextNode('');
    this.pristine = dom;

    var p = dom.parentNode;
    p.insertBefore(this.stub, dom);
    p.removeChild(dom);

    return this
  },
  update: function update() {
    var newValue = tmpl(this.expr, this.tag);

    if (newValue && !this.current) { // insert
      this.current = this.pristine.cloneNode(true);
      this.stub.parentNode.insertBefore(this.current, this.stub);

      this.expressions = [];
      parseExpressions.apply(this.tag, [this.current, this.expressions, true]);
    } else if (!newValue && this.current) { // remove
      unmountAll(this.expressions);
      if (this.current._tag) {
        this.current._tag.unmount();
      } else if (this.current.parentNode)
        { this.current.parentNode.removeChild(this.current); }
      this.current = null;
      this.expressions = [];
    }

    if (newValue) { updateAllExpressions.call(this.tag, this.expressions); }
  },
  unmount: function unmount() {
    unmountAll(this.expressions || []);
    delete this.pristine;
    delete this.parentNode;
    delete this.stub;
  }
};

var RefExpr = {
  init: function init(dom, parent, attrName, attrValue) {
    this.dom = dom;
    this.attr = attrName;
    this.rawValue = attrValue;
    this.parent = parent;
    this.hasExp = tmpl.hasExpr(attrValue);
    this.firstRun = true;

    return this
  },
  update: function update() {
    var value = this.rawValue;
    if (this.hasExp)
      { value = tmpl(this.rawValue, this.parent); }

    // if nothing changed, we're done
    if (!this.firstRun && value === this.value) { return }

    var customParent = this.parent && getImmediateCustomParentTag(this.parent);

    // if the referenced element is a custom tag, then we set the tag itself, rather than DOM
    var tagOrDom = this.tag || this.dom;

    // the name changed, so we need to remove it from the old key (if present)
    if (!isBlank(this.value) && customParent)
      { arrayishRemove(customParent.refs, this.value, tagOrDom); }

    if (isBlank(value)) {
      // if the value is blank, we remove it
      remAttr(this.dom, this.attr);
    } else {
      // add it to the refs of parent tag (this behavior was changed >=3.0)
      if (customParent) { arrayishAdd(
        customParent.refs,
        value,
        tagOrDom,
        // use an array if it's a looped node and the ref is not an expression
        null,
        this.parent.__.index
      ); }
      // set the actual DOM attr
      setAttr(this.dom, this.attr, value);
    }

    this.value = value;
    this.firstRun = false;
  },
  unmount: function unmount() {
    var tagOrDom = this.tag || this.dom;
    var customParent = this.parent && getImmediateCustomParentTag(this.parent);
    if (!isBlank(this.value) && customParent)
      { arrayishRemove(customParent.refs, this.value, tagOrDom); }
    delete this.dom;
    delete this.parent;
  }
};

/**
 * Convert the item looped into an object used to extend the child tag properties
 * @param   { Object } expr - object containing the keys used to extend the children tags
 * @param   { * } key - value to assign to the new object returned
 * @param   { * } val - value containing the position of the item in the array
 * @param   { Object } base - prototype object for the new item
 * @returns { Object } - new object containing the values of the original item
 *
 * The variables 'key' and 'val' are arbitrary.
 * They depend on the collection type looped (Array, Object)
 * and on the expression used on the each tag
 *
 */
function mkitem(expr, key, val, base) {
  var item = base ? Object.create(base) : {};
  item[expr.key] = key;
  if (expr.pos) { item[expr.pos] = val; }
  return item
}

/**
 * Unmount the redundant tags
 * @param   { Array } items - array containing the current items to loop
 * @param   { Array } tags - array containing all the children tags
 */
function unmountRedundant(items, tags) {
  var i = tags.length,
    j = items.length;

  while (i > j) {
    i--;
    remove.apply(tags[i], [tags, i]);
  }
}


/**
 * Remove a child tag
 * @this Tag
 * @param   { Array } tags - tags collection
 * @param   { Number } i - index of the tag to remove
 */
function remove(tags, i) {
  tags.splice(i, 1);
  this.unmount();
  arrayishRemove(this.parent, this, this.__.tagName, true);
}

/**
 * Move the nested custom tags in non custom loop tags
 * @this Tag
 * @param   { Number } i - current position of the loop tag
 */
function moveNestedTags(i) {
  var this$1 = this;

  each(Object.keys(this.tags), function (tagName) {
    var tag = this$1.tags[tagName];
    if (isArray(tag))
      { each(tag, function (t) {
        moveChildTag.apply(t, [tagName, i]);
      }); }
    else
      { moveChildTag.apply(tag, [tagName, i]); }
  });
}

/**
 * Move a child tag
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Tag } nextTag - instance of the next tag preceding the one we want to move
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function move(root, nextTag, isVirtual) {
  if (isVirtual)
    { moveVirtual.apply(this, [root, nextTag]); }
  else
    { safeInsert(root, this.root, nextTag.root); }
}

/**
 * Insert and mount a child tag
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Tag } nextTag - instance of the next tag preceding the one we want to insert
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function insert(root, nextTag, isVirtual) {
  if (isVirtual)
    { makeVirtual.apply(this, [root, nextTag]); }
  else
    { safeInsert(root, this.root, nextTag.root); }
}

/**
 * Append a new tag into the DOM
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function append(root, isVirtual) {
  if (isVirtual)
    { makeVirtual.call(this, root); }
  else
    { root.appendChild(this.root); }
}

/**
 * Manage tags having the 'each'
 * @param   { HTMLElement } dom - DOM node we need to loop
 * @param   { Tag } parent - parent tag instance where the dom node is contained
 * @param   { String } expr - string contained in the 'each' attribute
 * @returns { Object } expression object for this each loop
 */
function _each(dom, parent, expr) {

  // remove the each property from the original tag
  remAttr(dom, LOOP_DIRECTIVE);

  var mustReorder = typeof getAttr(dom, LOOP_NO_REORDER_DIRECTIVE) !== T_STRING || remAttr(dom, LOOP_NO_REORDER_DIRECTIVE),
    tagName = getTagName(dom),
    impl = __TAG_IMPL[tagName],
    parentNode = dom.parentNode,
    placeholder = createDOMPlaceholder(),
    child = getTag(dom),
    ifExpr = getAttr(dom, CONDITIONAL_DIRECTIVE),
    tags = [],
    oldItems = [],
    hasKeys,
    isLoop = true,
    isAnonymous = !__TAG_IMPL[tagName],
    isVirtual = dom.tagName === 'VIRTUAL';

  // parse the each expression
  expr = tmpl.loopKeys(expr);
  expr.isLoop = true;

  if (ifExpr) { remAttr(dom, CONDITIONAL_DIRECTIVE); }

  // insert a marked where the loop tags will be injected
  parentNode.insertBefore(placeholder, dom);
  parentNode.removeChild(dom);

  expr.update = function updateEach() {
    // get the new items collection
    var items = tmpl(expr.val, parent),
      frag = createFrag(),
      isObject$$1 = !isArray(items) && !isString(items),
      root = placeholder.parentNode;

    // object loop. any changes cause full redraw
    if (isObject$$1) {
      hasKeys = items || false;
      items = hasKeys ?
        Object.keys(items).map(function (key) {
          return mkitem(expr, items[key], key)
        }) : [];
    } else {
      hasKeys = false;
    }

    if (ifExpr) {
      items = items.filter(function(item, i) {
        if (expr.key && !isObject$$1)
          { return !!tmpl(ifExpr, mkitem(expr, item, i, parent)) }

        return !!tmpl(ifExpr, extend(Object.create(parent), item))
      });
    }

    // loop all the new items
    each(items, function(item, i) {
      // reorder only if the items are objects
      var
        doReorder = mustReorder && typeof item === T_OBJECT && !hasKeys,
        oldPos = oldItems.indexOf(item),
        isNew = oldPos === -1,
        pos = !isNew && doReorder ? oldPos : i,
        // does a tag exist in this position?
        tag = tags[pos],
        mustAppend = i >= oldItems.length,
        mustCreate =  doReorder && isNew || !doReorder && !tag;

      item = !hasKeys && expr.key ? mkitem(expr, item, i) : item;

      // new tag
      if (mustCreate) {
        tag = new Tag$1(impl, {
          parent: parent,
          isLoop: isLoop,
          isAnonymous: isAnonymous,
          tagName: tagName,
          root: dom.cloneNode(isAnonymous),
          item: item,
          index: i,
        }, dom.innerHTML);

        // mount the tag
        tag.mount();

        if (mustAppend)
          { append.apply(tag, [frag || root, isVirtual]); }
        else
          { insert.apply(tag, [root, tags[i], isVirtual]); }

        if (!mustAppend) { oldItems.splice(i, 0, item); }
        tags.splice(i, 0, tag);
        if (child) { arrayishAdd(parent.tags, tagName, tag, true); }
      } else if (pos !== i && doReorder) {
        // move
        if (contains(items, oldItems[pos])) {
          move.apply(tag, [root, tags[i], isVirtual]);
          // move the old tag instance
          tags.splice(i, 0, tags.splice(pos, 1)[0]);
          // move the old item
          oldItems.splice(i, 0, oldItems.splice(pos, 1)[0]);
        } else { // remove
          remove.apply(tags[i], [tags, i]);
          oldItems.splice(i, 1);
        }

        // update the position attribute if it exists
        if (expr.pos) { tag[expr.pos] = i; }

        // if the loop tags are not custom
        // we need to move all their custom tags into the right position
        if (!child && tag.tags) { moveNestedTags.call(tag, i); }
      }

      // cache the original item to use it in the events bound to this node
      // and its children
      tag.__.item = item;
      tag.__.index = i;
      tag.__.parent = parent;

      if (!mustCreate) { tag.update(item); }
    });

    // remove the redundant tags
    unmountRedundant(items, tags);

    // clone the items array
    oldItems = items.slice();

    root.insertBefore(frag, placeholder);
  };

  expr.unmount = function() {
    each(tags, function(t) { t.unmount(); });
  };

  return expr
}

/**
 * Walk the tag DOM to detect the expressions to evaluate
 * @this Tag
 * @param   { HTMLElement } root - root tag where we will start digging the expressions
 * @param   { Array } expressions - empty array where the expressions will be added
 * @param   { Boolean } mustIncludeRoot - flag to decide whether the root must be parsed as well
 * @returns { Object } an object containing the root noode and the dom tree
 */
function parseExpressions(root, expressions, mustIncludeRoot) {
  var this$1 = this;

  var tree = {parent: {children: expressions}};

  walkNodes(root, function (dom, ctx) {
    var type = dom.nodeType, parent = ctx.parent, attr, expr, tagImpl;
    if (!mustIncludeRoot && dom === root) { return {parent: parent} }

    // text node
    if (type === 3 && dom.parentNode.tagName !== 'STYLE' && tmpl.hasExpr(dom.nodeValue))
      { parent.children.push({dom: dom, expr: dom.nodeValue}); }

    if (type !== 1) { return ctx } // not an element

    var isVirtual = dom.tagName === 'VIRTUAL';

    // loop. each does it's own thing (for now)
    if (attr = getAttr(dom, LOOP_DIRECTIVE)) {
      if(isVirtual) { setAttr(dom, 'loopVirtual', true); } // ignore here, handled in _each
      parent.children.push(_each(dom, this$1, attr));
      return false
    }

    // if-attrs become the new parent. Any following expressions (either on the current
    // element, or below it) become children of this expression.
    if (attr = getAttr(dom, CONDITIONAL_DIRECTIVE)) {
      parent.children.push(Object.create(IfExpr).init(dom, this$1, attr));
      return false
    }

    if (expr = getAttr(dom, IS_DIRECTIVE)) {
      if (tmpl.hasExpr(expr)) {
        parent.children.push({isRtag: true, expr: expr, dom: dom, attrs: [].slice.call(dom.attributes)});
        return false
      }
    }

    // if this is a tag, stop traversing here.
    // we ignore the root, since parseExpressions is called while we're mounting that root
    tagImpl = getTag(dom);
    if(isVirtual) {
      if(getAttr(dom, 'virtualized')) {dom.parentElement.removeChild(dom); } // tag created, remove from dom
      if(!tagImpl && !getAttr(dom, 'virtualized') && !getAttr(dom, 'loopVirtual'))  // ok to create virtual tag
        { tagImpl = { tmpl: dom.outerHTML }; }
    }

    if (tagImpl && (dom !== root || mustIncludeRoot)) {
      if(isVirtual && !getAttr(dom, IS_DIRECTIVE)) { // handled in update
        // can not remove attribute like directives
        // so flag for removal after creation to prevent maximum stack error
        setAttr(dom, 'virtualized', true);

        var tag = new Tag$1({ tmpl: dom.outerHTML },
          {root: dom, parent: this$1},
          dom.innerHTML);
        parent.children.push(tag); // no return, anonymous tag, keep parsing
      } else {
        var conf = {root: dom, parent: this$1, hasImpl: true};
        parent.children.push(initChildTag(tagImpl, conf, dom.innerHTML, this$1));
        return false
      }
    }

    // attribute expressions
    parseAttributes.apply(this$1, [dom, dom.attributes, function(attr, expr) {
      if (!expr) { return }
      parent.children.push(expr);
    }]);

    // whatever the parent is, all child elements get the same parent.
    // If this element had an if-attr, that's the parent for all child elements
    return {parent: parent}
  }, tree);

  return { tree: tree, root: root }
}

/**
 * Calls `fn` for every attribute on an element. If that attr has an expression,
 * it is also passed to fn.
 * @this Tag
 * @param   { HTMLElement } dom - dom node to parse
 * @param   { Array } attrs - array of attributes
 * @param   { Function } fn - callback to exec on any iteration
 */
function parseAttributes(dom, attrs, fn) {
  var this$1 = this;

  each(attrs, function (attr) {
    var name = attr.name, bool = isBoolAttr(name), expr;

    if (contains(REF_DIRECTIVES, name)) {
      expr =  Object.create(RefExpr).init(dom, this$1, name, attr.value);
    } else if (tmpl.hasExpr(attr.value)) {
      expr = {dom: dom, expr: attr.value, attr: attr.name, bool: bool};
    }

    fn(attr, expr);
  });
}

/*
  Includes hacks needed for the Internet Explorer version 9 and below
  See: http://kangax.github.io/compat-table/es5/#ie8
       http://codeplanet.io/dropping-ie8/
*/

var reHasYield  = /<yield\b/i;
var reYieldAll  = /<yield\s*(?:\/>|>([\S\s]*?)<\/yield\s*>|>)/ig;
var reYieldSrc  = /<yield\s+to=['"]([^'">]*)['"]\s*>([\S\s]*?)<\/yield\s*>/ig;
var reYieldDest = /<yield\s+from=['"]?([-\w]+)['"]?\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig;
var rootEls = { tr: 'tbody', th: 'tr', td: 'tr', col: 'colgroup' };
var tblTags = IE_VERSION && IE_VERSION < 10 ? RE_SPECIAL_TAGS : RE_SPECIAL_TAGS_NO_OPTION;
var GENERIC = 'div';


/*
  Creates the root element for table or select child elements:
  tr/th/td/thead/tfoot/tbody/caption/col/colgroup/option/optgroup
*/
function specialTags(el, tmpl, tagName) {

  var
    select = tagName[0] === 'o',
    parent = select ? 'select>' : 'table>';

  // trim() is important here, this ensures we don't have artifacts,
  // so we can check if we have only one element inside the parent
  el.innerHTML = '<' + parent + tmpl.trim() + '</' + parent;
  parent = el.firstChild;

  // returns the immediate parent if tr/th/td/col is the only element, if not
  // returns the whole tree, as this can include additional elements
  if (select) {
    parent.selectedIndex = -1;  // for IE9, compatible w/current riot behavior
  } else {
    // avoids insertion of cointainer inside container (ex: tbody inside tbody)
    var tname = rootEls[tagName];
    if (tname && parent.childElementCount === 1) { parent = $(tname, parent); }
  }
  return parent
}

/*
  Replace the yield tag from any tag template with the innerHTML of the
  original tag in the page
*/
function replaceYield(tmpl, html) {
  // do nothing if no yield
  if (!reHasYield.test(tmpl)) { return tmpl }

  // be careful with #1343 - string on the source having `$1`
  var src = {};

  html = html && html.replace(reYieldSrc, function (_, ref, text) {
    src[ref] = src[ref] || text;   // preserve first definition
    return ''
  }).trim();

  return tmpl
    .replace(reYieldDest, function (_, ref, def) {  // yield with from - to attrs
      return src[ref] || def || ''
    })
    .replace(reYieldAll, function (_, def) {        // yield without any "from"
      return html || def || ''
    })
}

/**
 * Creates a DOM element to wrap the given content. Normally an `DIV`, but can be
 * also a `TABLE`, `SELECT`, `TBODY`, `TR`, or `COLGROUP` element.
 *
 * @param   { String } tmpl  - The template coming from the custom tag definition
 * @param   { String } html - HTML content that comes from the DOM element where you
 *           will mount the tag, mostly the original tag in the page
 * @param   { Boolean } checkSvg - flag needed to know if we need to force the svg rendering in case of loop nodes
 * @returns { HTMLElement } DOM element with _tmpl_ merged through `YIELD` with the _html_.
 */
function mkdom(tmpl, html, checkSvg) {
  var match   = tmpl && tmpl.match(/^\s*<([-\w]+)/),
    tagName = match && match[1].toLowerCase(),
    el = mkEl(GENERIC, checkSvg && isSVGTag(tagName));

  // replace all the yield tags with the tag inner html
  tmpl = replaceYield(tmpl, html);

  /* istanbul ignore next */
  if (tblTags.test(tagName))
    { el = specialTags(el, tmpl, tagName); }
  else
    { setInnerHTML(el, tmpl); }

  return el
}

/**
 * Another way to create a riot tag a bit more es6 friendly
 * @param { HTMLElement } el - tag DOM selector or DOM node/s
 * @param { Object } opts - tag logic
 * @returns { Tag } new riot tag instance
 */
function Tag$2(el, opts) {
  // get the tag properties from the class constructor
  var ref = this;
  var name = ref.name;
  var tmpl = ref.tmpl;
  var css = ref.css;
  var attrs = ref.attrs;
  var onCreate = ref.onCreate;
  // register a new tag and cache the class prototype
  if (!__TAG_IMPL[name]) {
    tag$1(name, tmpl, css, attrs, onCreate);
    // cache the class constructor
    __TAG_IMPL[name].class = this.constructor;
  }

  // mount the tag using the class instance
  mountTo(el, name, opts, this);
  // inject the component css
  if (css) { styleManager.inject(); }

  return this
}

/**
 * Create a new riot tag implementation
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   tmpl - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
function tag$1(name, tmpl, css, attrs, fn) {
  if (isFunction(attrs)) {
    fn = attrs;

    if (/^[\w\-]+\s?=/.test(css)) {
      attrs = css;
      css = '';
    } else
      { attrs = ''; }
  }

  if (css) {
    if (isFunction(css))
      { fn = css; }
    else
      { styleManager.add(css); }
  }

  name = name.toLowerCase();
  __TAG_IMPL[name] = { name: name, tmpl: tmpl, attrs: attrs, fn: fn };

  return name
}

/**
 * Create a new riot tag implementation (for use by the compiler)
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   tmpl - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
function tag2$1(name, tmpl, css, attrs, fn) {
  if (css)
    { styleManager.add(css, name); }

  var exists = !!__TAG_IMPL[name];
  __TAG_IMPL[name] = { name: name, tmpl: tmpl, attrs: attrs, fn: fn };

  if (exists && util.hotReloader)
    { util.hotReloader(name); }

  return name
}

/**
 * Mount a tag using a specific tag implementation
 * @param   { * } selector - tag DOM selector or DOM node/s
 * @param   { String } tagName - tag implementation name
 * @param   { Object } opts - tag logic
 * @returns { Array } new tags instances
 */
function mount$1(selector, tagName, opts) {
  var tags = [];

  function pushTagsTo(root) {
    if (root.tagName) {
      var riotTag = getAttr(root, IS_DIRECTIVE);

      // have tagName? force riot-tag to be the same
      if (tagName && riotTag !== tagName) {
        riotTag = tagName;
        setAttr(root, IS_DIRECTIVE, tagName);
      }

      var tag$$1 = mountTo(root, riotTag || root.tagName.toLowerCase(), opts);

      if (tag$$1)
        { tags.push(tag$$1); }
    } else if (root.length)
      { each(root, pushTagsTo); } // assume nodeList
  }

  // inject styles into DOM
  styleManager.inject();

  if (isObject(tagName)) {
    opts = tagName;
    tagName = 0;
  }

  var elem;
  var allTags;

  // crawl the DOM to find the tag
  if (isString(selector)) {
    selector = selector === '*' ?
      // select all registered tags
      // & tags found with the riot-tag attribute set
      allTags = selectTags() :
      // or just the ones named like the selector
      selector + selectTags(selector.split(/, */));

    // make sure to pass always a selector
    // to the querySelectorAll function
    elem = selector ? $$(selector) : [];
  }
  else
    // probably you have passed already a tag or a NodeList
    { elem = selector; }

  // select all the registered and mount them inside their root elements
  if (tagName === '*') {
    // get all custom tags
    tagName = allTags || selectTags();
    // if the root els it's just a single tag
    if (elem.tagName)
      { elem = $$(tagName, elem); }
    else {
      // select all the children for all the different root elements
      var nodeList = [];

      each(elem, function (_el) { return nodeList.push($$(tagName, _el)); });

      elem = nodeList;
    }
    // get rid of the tagName
    tagName = 0;
  }

  pushTagsTo(elem);

  return tags
}

// Create a mixin that could be globally shared across all the tags
var mixins = {};
var globals = mixins[GLOBAL_MIXIN] = {};
var _id = 0;

/**
 * Create/Return a mixin by its name
 * @param   { String }  name - mixin name (global mixin if object)
 * @param   { Object }  mix - mixin logic
 * @param   { Boolean } g - is global?
 * @returns { Object }  the mixin logic
 */
function mixin$1(name, mix, g) {
  // Unnamed global
  if (isObject(name)) {
    mixin$1(("__unnamed_" + (_id++)), name, true);
    return
  }

  var store = g ? globals : mixins;

  // Getter
  if (!mix) {
    if (isUndefined(store[name]))
      { throw new Error('Unregistered mixin: ' + name) }

    return store[name]
  }

  // Setter
  store[name] = isFunction(mix) ?
    extend(mix.prototype, store[name] || {}) && mix :
    extend(store[name] || {}, mix);
}

/**
 * Update all the tags instances created
 * @returns { Array } all the tags instances
 */
function update$1() {
  return each(__TAGS_CACHE, function (tag$$1) { return tag$$1.update(); })
}

function unregister$1(name) {
  delete __TAG_IMPL[name];
}


var core = Object.freeze({
	Tag: Tag$2,
	tag: tag$1,
	tag2: tag2$1,
	mount: mount$1,
	mixin: mixin$1,
	update: update$1,
	unregister: unregister$1
});

// counter to give a unique id to all the Tag instances
var __uid = 0;

/**
 * We need to update opts for this tag. That requires updating the expressions
 * in any attributes on the tag, and then copying the result onto opts.
 * @this Tag
 * @param   {Boolean} isLoop - is it a loop tag?
 * @param   { Tag }  parent - parent tag node
 * @param   { Boolean }  isAnonymous - is it a tag without any impl? (a tag not registered)
 * @param   { Object }  opts - tag options
 * @param   { Array }  instAttrs - tag attributes array
 */
function updateOpts(isLoop, parent, isAnonymous, opts, instAttrs) {
  // isAnonymous `each` tags treat `dom` and `root` differently. In this case
  // (and only this case) we don't need to do updateOpts, because the regular parse
  // will update those attrs. Plus, isAnonymous tags don't need opts anyway
  if (isLoop && isAnonymous) { return }

  var ctx = !isAnonymous && isLoop ? this : parent || this;
  each(instAttrs, function (attr) {
    if (attr.expr) { updateAllExpressions.call(ctx, [attr.expr]); }
    opts[toCamel(attr.name)] = attr.expr ? attr.expr.value : attr.value;
  });
}


/**
 * Tag class
 * @constructor
 * @param { Object } impl - it contains the tag template, and logic
 * @param { Object } conf - tag options
 * @param { String } innerHTML - html that eventually we need to inject in the tag
 */
function Tag$1(impl, conf, innerHTML) {
  if ( impl === void 0 ) impl = {};
  if ( conf === void 0 ) conf = {};


  var opts = extend({}, conf.opts),
    parent = conf.parent,
    isLoop = conf.isLoop,
    isAnonymous = !!conf.isAnonymous,
    skipAnonymous = settings$1.skipAnonymousTags && isAnonymous,
    item = cleanUpData(conf.item),
    index = conf.index, // available only for the looped nodes
    instAttrs = [], // All attributes on the Tag when it's first parsed
    implAttrs = [], // expressions on this type of Tag
    expressions = [],
    root = conf.root,
    tagName = conf.tagName || getTagName(root),
    isVirtual = tagName === 'virtual',
    propsInSyncWithParent = [],
    dom;

  // make this tag observable
  if (!skipAnonymous) { observable$1(this); }
  // only call unmount if we have a valid __TAG_IMPL (has name property)
  if (impl.name && root._tag) { root._tag.unmount(true); }

  // not yet mounted
  this.isMounted = false;

  defineProperty(this, '__', {
    isAnonymous: isAnonymous,
    instAttrs: instAttrs,
    innerHTML: innerHTML,
    tagName: tagName,
    index: index,
    isLoop: isLoop,
    // these vars will be needed only for the virtual tags
    virts: [],
    tail: null,
    head: null,
    parent: null,
    item: null
  });

  // create a unique id to this tag
  // it could be handy to use it also to improve the virtual dom rendering speed
  defineProperty(this, '_riot_id', ++__uid); // base 1 allows test !t._riot_id
  defineProperty(this, 'root', root);
  extend(this, { opts: opts }, item);
  // protect the "tags" and "refs" property from being overridden
  defineProperty(this, 'parent', parent || null);
  defineProperty(this, 'tags', {});
  defineProperty(this, 'refs', {});

  dom = isLoop && isAnonymous ? root : mkdom(impl.tmpl, innerHTML, isLoop);

  /**
   * Update the tag expressions and options
   * @param   { * }  data - data we want to use to extend the tag properties
   * @returns { Tag } the current tag instance
   */
  defineProperty(this, 'update', function tagUpdate(data) {
    var nextOpts = {},
      canTrigger = this.isMounted && !skipAnonymous;

    updateOpts.apply(this, [isLoop, parent, isAnonymous, nextOpts, instAttrs]);
    if (this.isMounted && isFunction(this.shouldUpdate) && !this.shouldUpdate(data, nextOpts)) { return this }

    // make sure the data passed will not override
    // the component core methods
    data = cleanUpData(data);

    // inherit properties from the parent, but only for isAnonymous tags
    if (isLoop && isAnonymous) { inheritFrom.apply(this, [this.parent, propsInSyncWithParent]); }
    extend(this, data);
    extend(opts, nextOpts);
    if (canTrigger) { this.trigger('update', data); }
    updateAllExpressions.call(this, expressions);
    if (canTrigger) { this.trigger('updated'); }

    return this

  }.bind(this));

  /**
   * Add a mixin to this tag
   * @returns { Tag } the current tag instance
   */
  defineProperty(this, 'mixin', function tagMixin() {
    var this$1 = this;

    each(arguments, function (mix) {
      var instance,
        props = [],
        obj;

      mix = isString(mix) ? mixin$1(mix) : mix;

      // check if the mixin is a function
      if (isFunction(mix)) {
        // create the new mixin instance
        instance = new mix();
      } else { instance = mix; }

      var proto = Object.getPrototypeOf(instance);

      // build multilevel prototype inheritance chain property list
      do { props = props.concat(Object.getOwnPropertyNames(obj || instance)); }
      while (obj = Object.getPrototypeOf(obj || instance))

      // loop the keys in the function prototype or the all object keys
      each(props, function (key) {
        // bind methods to this
        // allow mixins to override other properties/parent mixins
        if (key !== 'init') {
          // check for getters/setters
          var descriptor = Object.getOwnPropertyDescriptor(instance, key) || Object.getOwnPropertyDescriptor(proto, key);
          var hasGetterSetter = descriptor && (descriptor.get || descriptor.set);

          // apply method only if it does not already exist on the instance
          if (!this$1.hasOwnProperty(key) && hasGetterSetter) {
            Object.defineProperty(this$1, key, descriptor);
          } else {
            this$1[key] = isFunction(instance[key]) ?
              instance[key].bind(this$1) :
              instance[key];
          }
        }
      });

      // init method will be called automatically
      if (instance.init)
        { instance.init.bind(this$1)(); }
    });
    return this
  }.bind(this));

  /**
   * Mount the current tag instance
   * @returns { Tag } the current tag instance
   */
  defineProperty(this, 'mount', function tagMount() {
    var this$1 = this;

    var _parent = this.__.parent;
    root._tag = this; // keep a reference to the tag just created

    // Read all the attrs on this instance. This give us the info we need for updateOpts
    parseAttributes.apply(parent, [root, root.attributes, function (attr, expr) {
      if (!isAnonymous && RefExpr.isPrototypeOf(expr)) { expr.tag = this$1; }
      attr.expr = expr;
      instAttrs.push(attr);
    }]);

    // update the root adding custom attributes coming from the compiler
    implAttrs = [];
    walkAttrs(impl.attrs, function (k, v) { implAttrs.push({name: k, value: v}); });
    parseAttributes.apply(this, [root, implAttrs, function (attr, expr) {
      if (expr) { expressions.push(expr); }
      else { setAttr(root, attr.name, attr.value); }
    }]);

    // children in loop should inherit from true parent
    if (_parent && isAnonymous) { inheritFrom.apply(this, [_parent, propsInSyncWithParent]); }

    // initialiation
    updateOpts.apply(this, [isLoop, parent, isAnonymous, opts, instAttrs]);

    // add global mixins
    var globalMixin = mixin$1(GLOBAL_MIXIN);

    if (globalMixin && !skipAnonymous) {
      for (var i in globalMixin) {
        if (globalMixin.hasOwnProperty(i)) {
          this$1.mixin(globalMixin[i]);
        }
      }
    }

    if (impl.fn) { impl.fn.call(this, opts); }

    if (!skipAnonymous) { this.trigger('before-mount'); }

    // parse layout after init. fn may calculate args for nested custom tags
    parseExpressions.apply(this, [dom, expressions, isAnonymous]);

    this.update(item);

    if (!isAnonymous) {
      while (dom.firstChild) { root.appendChild(dom.firstChild); }
    }

    defineProperty(this, 'root', root);
    defineProperty(this, 'isMounted', true);

    if (skipAnonymous) { return }

    // if it's not a child tag we can trigger its mount event
    if (!this.parent) {
      this.trigger('mount');
    }
    // otherwise we need to wait that the parent "mount" or "updated" event gets triggered
    else {
      var p = getImmediateCustomParentTag(this.parent);
      p.one(!p.isMounted ? 'mount' : 'updated', function () {
        this$1.trigger('mount');
      });
    }

    return this

  }.bind(this));

  /**
   * Unmount the tag instance
   * @param { Boolean } mustKeepRoot - if it's true the root node will not be removed
   * @returns { Tag } the current tag instance
   */
  defineProperty(this, 'unmount', function tagUnmount(mustKeepRoot) {
    var this$1 = this;

    var el = this.root,
      p = el.parentNode,
      ptag,
      tagIndex = __TAGS_CACHE.indexOf(this);

    if (!skipAnonymous) { this.trigger('before-unmount'); }

    // clear all attributes coming from the mounted tag
    walkAttrs(impl.attrs, function (name) {
      if (startsWith(name, ATTRS_PREFIX))
        { name = name.slice(ATTRS_PREFIX.length); }
      remAttr(root, name);
    });

    // remove this tag instance from the global virtualDom variable
    if (tagIndex !== -1)
      { __TAGS_CACHE.splice(tagIndex, 1); }

    if (p || isVirtual) {
      if (parent) {
        ptag = getImmediateCustomParentTag(parent);

        if (isVirtual) {
          Object.keys(this.tags).forEach(function (tagName) {
            arrayishRemove(ptag.tags, tagName, this$1.tags[tagName]);
          });
        } else {
          arrayishRemove(ptag.tags, tagName, this);
          if(parent !== ptag) // remove from _parent too
            { arrayishRemove(parent.tags, tagName, this); }
        }
      } else {
        while (el.firstChild) { el.removeChild(el.firstChild); }
      }

      if (p)
        { if (!mustKeepRoot) {
          p.removeChild(el);
        } else {
          // the riot-tag and the data-is attributes aren't needed anymore, remove them
          remAttr(p, IS_DIRECTIVE);
        } }
    }

    if (this.__.virts) {
      each(this.__.virts, function (v) {
        if (v.parentNode) { v.parentNode.removeChild(v); }
      });
    }

    // allow expressions to unmount themselves
    unmountAll(expressions);
    each(instAttrs, function (a) { return a.expr && a.expr.unmount && a.expr.unmount(); });

    // custom internal unmount function to avoid relying on the observable
    if (this.__.onUnmount) { this.__.onUnmount(); }

    if (!skipAnonymous) {
      this.trigger('unmount');
      this.off('*');
    }

    defineProperty(this, 'isMounted', false);

    delete this.root._tag;

    return this

  }.bind(this));
}

/**
 * Detect the tag implementation by a DOM node
 * @param   { Object } dom - DOM node we need to parse to get its tag implementation
 * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
 */
function getTag(dom) {
  return dom.tagName && __TAG_IMPL[getAttr(dom, IS_DIRECTIVE) ||
    getAttr(dom, IS_DIRECTIVE) || dom.tagName.toLowerCase()]
}

/**
 * Inherit properties from a target tag instance
 * @this Tag
 * @param   { Tag } target - tag where we will inherit properties
 * @param   { Array } propsInSyncWithParent - array of properties to sync with the target
 */
function inheritFrom(target, propsInSyncWithParent) {
  var this$1 = this;

  each(Object.keys(target), function (k) {
    // some properties must be always in sync with the parent tag
    var mustSync = !isReservedName(k) && contains(propsInSyncWithParent, k);

    if (isUndefined(this$1[k]) || mustSync) {
      // track the property to keep in sync
      // so we can keep it updated
      if (!mustSync) { propsInSyncWithParent.push(k); }
      this$1[k] = target[k];
    }
  });
}

/**
 * Move the position of a custom tag in its parent tag
 * @this Tag
 * @param   { String } tagName - key where the tag was stored
 * @param   { Number } newPos - index where the new tag will be stored
 */
function moveChildTag(tagName, newPos) {
  var parent = this.parent,
    tags;
  // no parent no move
  if (!parent) { return }

  tags = parent.tags[tagName];

  if (isArray(tags))
    { tags.splice(newPos, 0, tags.splice(tags.indexOf(this), 1)[0]); }
  else { arrayishAdd(parent.tags, tagName, this); }
}

/**
 * Create a new child tag including it correctly into its parent
 * @param   { Object } child - child tag implementation
 * @param   { Object } opts - tag options containing the DOM node where the tag will be mounted
 * @param   { String } innerHTML - inner html of the child node
 * @param   { Object } parent - instance of the parent tag including the child custom tag
 * @returns { Object } instance of the new child tag just created
 */
function initChildTag(child, opts, innerHTML, parent) {
  var tag = new Tag$1(child, opts, innerHTML),
    tagName = opts.tagName || getTagName(opts.root, true),
    ptag = getImmediateCustomParentTag(parent);
  // fix for the parent attribute in the looped elements
  defineProperty(tag, 'parent', ptag);
  // store the real parent tag
  // in some cases this could be different from the custom parent tag
  // for example in nested loops
  tag.__.parent = parent;

  // add this tag to the custom parent tag
  arrayishAdd(ptag.tags, tagName, tag);

  // and also to the real parent tag
  if (ptag !== parent)
    { arrayishAdd(parent.tags, tagName, tag); }

  // empty the child node once we got its template
  // to avoid that its children get compiled multiple times
  opts.root.innerHTML = '';

  return tag
}

/**
 * Loop backward all the parents tree to detect the first custom parent tag
 * @param   { Object } tag - a Tag instance
 * @returns { Object } the instance of the first custom parent tag found
 */
function getImmediateCustomParentTag(tag) {
  var ptag = tag;
  while (ptag.__.isAnonymous) {
    if (!ptag.parent) { break }
    ptag = ptag.parent;
  }
  return ptag
}

/**
 * Trigger the unmount method on all the expressions
 * @param   { Array } expressions - DOM expressions
 */
function unmountAll(expressions) {
  each(expressions, function(expr) {
    if (expr instanceof Tag$1) { expr.unmount(true); }
    else if (expr.unmount) { expr.unmount(); }
  });
}

/**
 * Get the tag name of any DOM node
 * @param   { Object } dom - DOM node we want to parse
 * @param   { Boolean } skipDataIs - hack to ignore the data-is attribute when attaching to parent
 * @returns { String } name to identify this dom node in riot
 */
function getTagName(dom, skipDataIs) {
  var child = getTag(dom),
    namedTag = !skipDataIs && getAttr(dom, IS_DIRECTIVE);
  return namedTag && !tmpl.hasExpr(namedTag) ?
                namedTag :
              child ? child.name : dom.tagName.toLowerCase()
}

/**
 * With this function we avoid that the internal Tag methods get overridden
 * @param   { Object } data - options we want to use to extend the tag instance
 * @returns { Object } clean object without containing the riot internal reserved words
 */
function cleanUpData(data) {
  if (!(data instanceof Tag$1) && !(data && isFunction(data.trigger)))
    { return data }

  var o = {};
  for (var key in data) {
    if (!RE_RESERVED_NAMES.test(key)) { o[key] = data[key]; }
  }
  return o
}

/**
 * Set the property of an object for a given key. If something already
 * exists there, then it becomes an array containing both the old and new value.
 * @param { Object } obj - object on which to set the property
 * @param { String } key - property name
 * @param { Object } value - the value of the property to be set
 * @param { Boolean } ensureArray - ensure that the property remains an array
 * @param { Number } index - add the new item in a certain array position
 */
function arrayishAdd(obj, key, value, ensureArray, index) {
  var dest = obj[key];
  var isArr = isArray(dest);
  var hasIndex = !isUndefined(index);

  if (dest && dest === value) { return }

  // if the key was never set, set it once
  if (!dest && ensureArray) { obj[key] = [value]; }
  else if (!dest) { obj[key] = value; }
  // if it was an array and not yet set
  else {
    if (isArr) {
      var oldIndex = dest.indexOf(value);
      // this item never changed its position
      if (oldIndex === index) { return }
      // remove the item from its old position
      if (oldIndex !== -1) { dest.splice(oldIndex, 1); }
      // move or add the item
      if (hasIndex) {
        dest.splice(index, 0, value);
      } else {
        dest.push(value);
      }
    } else { obj[key] = [dest, value]; }
  }
}

/**
 * Removes an item from an object at a given key. If the key points to an array,
 * then the item is just removed from the array.
 * @param { Object } obj - object on which to remove the property
 * @param { String } key - property name
 * @param { Object } value - the value of the property to be removed
 * @param { Boolean } ensureArray - ensure that the property remains an array
*/
function arrayishRemove(obj, key, value, ensureArray) {
  if (isArray(obj[key])) {
    var index = obj[key].indexOf(value);
    if (index !== -1) { obj[key].splice(index, 1); }
    if (!obj[key].length) { delete obj[key]; }
    else if (obj[key].length === 1 && !ensureArray) { obj[key] = obj[key][0]; }
  } else
    { delete obj[key]; } // otherwise just delete the key
}

/**
 * Check whether a DOM node is in stub mode, useful for the riot 'if' directive
 * @param   { Object }  dom - DOM node we want to parse
 * @returns { Boolean } -
 */
function isInStub(dom) {
  while (dom) {
    if (dom.inStub)
      { return true }
    dom = dom.parentNode;
  }
  return false
}

/**
 * Mount a tag creating new Tag instance
 * @param   { Object } root - dom node where the tag will be mounted
 * @param   { String } tagName - name of the riot tag we want to mount
 * @param   { Object } opts - options to pass to the Tag instance
 * @param   { Object } ctx - optional context that will be used to extend an existing class ( used in riot.Tag )
 * @returns { Tag } a new Tag instance
 */
function mountTo(root, tagName, opts, ctx) {
  var impl = __TAG_IMPL[tagName],
    implClass = __TAG_IMPL[tagName].class,
    tag = ctx || (implClass ? Object.create(implClass.prototype) : {}),
    // cache the inner HTML to fix #855
    innerHTML = root._innerHTML = root._innerHTML || root.innerHTML;

  // clear the inner html
  root.innerHTML = '';

  var conf = { root: root, opts: opts };
  if (opts && opts.parent) { conf.parent = opts.parent; }

  if (impl && root) { Tag$1.apply(tag, [impl, conf, innerHTML]); }

  if (tag && tag.mount) {
    tag.mount(true);
    // add this tag to the virtualDom variable
    if (!contains(__TAGS_CACHE, tag)) { __TAGS_CACHE.push(tag); }
  }

  return tag
}

/**
 * makes a tag virtual and replaces a reference in the dom
 * @this Tag
 * @param { tag } the tag to make virtual
 * @param { ref } the dom reference location
 */
function makeReplaceVirtual(tag, ref) {
  var frag = createFrag();
  makeVirtual.call(tag, frag);
  ref.parentNode.replaceChild(frag, ref);
}

/**
 * Adds the elements for a virtual tag
 * @this Tag
 * @param { Node } src - the node that will do the inserting or appending
 * @param { Tag } target - only if inserting, insert before this tag's first child
 */
function makeVirtual(src, target) {
  var this$1 = this;

  var head = createDOMPlaceholder(),
    tail = createDOMPlaceholder(),
    frag = createFrag(),
    sib, el;

  this.__.head = this.root.insertBefore(head, this.root.firstChild);
  this.__.tail = this.root.appendChild(tail);

  el = this.__.head;

  while (el) {
    sib = el.nextSibling;
    frag.appendChild(el);
    this$1.__.virts.push(el); // hold for unmounting
    el = sib;
  }

  if (target)
    { src.insertBefore(frag, target.__.head); }
  else
    { src.appendChild(frag); }
}

/**
 * Move virtual tag and all child nodes
 * @this Tag
 * @param { Node } src  - the node that will do the inserting
 * @param { Tag } target - insert before this tag's first child
 */
function moveVirtual(src, target) {
  var this$1 = this;

  var el = this.__.head,
    frag = createFrag(),
    sib;

  while (el) {
    sib = el.nextSibling;
    frag.appendChild(el);
    el = sib;
    if (el === this$1.__.tail) {
      frag.appendChild(el);
      src.insertBefore(frag, target.__.head);
      break
    }
  }
}

/**
 * Get selectors for tags
 * @param   { Array } tags - tag names to select
 * @returns { String } selector
 */
function selectTags(tags) {
  // select all tags
  if (!tags) {
    var keys = Object.keys(__TAG_IMPL);
    return keys + selectTags(keys)
  }

  return tags
    .filter(function (t) { return !/[^-\w]/.test(t); })
    .reduce(function (list, t) {
      var name = t.trim().toLowerCase();
      return list + ",[" + IS_DIRECTIVE + "=\"" + name + "\"]"
    }, '')
}


var tags = Object.freeze({
	getTag: getTag,
	inheritFrom: inheritFrom,
	moveChildTag: moveChildTag,
	initChildTag: initChildTag,
	getImmediateCustomParentTag: getImmediateCustomParentTag,
	unmountAll: unmountAll,
	getTagName: getTagName,
	cleanUpData: cleanUpData,
	arrayishAdd: arrayishAdd,
	arrayishRemove: arrayishRemove,
	isInStub: isInStub,
	mountTo: mountTo,
	makeReplaceVirtual: makeReplaceVirtual,
	makeVirtual: makeVirtual,
	moveVirtual: moveVirtual,
	selectTags: selectTags
});

/**
 * Riot public api
 */
var settings = settings$1;
var util = {
  tmpl: tmpl,
  brackets: brackets,
  styleManager: styleManager,
  vdom: __TAGS_CACHE,
  styleNode: styleManager.styleNode,
  // export the riot internal utils as well
  dom: dom,
  check: check,
  misc: misc,
  tags: tags
};

// export the core props/methods
var Tag$$1 = Tag$2;
var tag$$1 = tag$1;
var tag2$$1 = tag2$1;
var mount$$1 = mount$1;
var mixin$$1 = mixin$1;
var update$$1 = update$1;
var unregister$$1 = unregister$1;
var observable = observable$1;

var riot$1 = extend({}, core, {
  observable: observable$1,
  settings: settings,
  util: util,
});

exports.settings = settings;
exports.util = util;
exports.Tag = Tag$$1;
exports.tag = tag$$1;
exports.tag2 = tag2$$1;
exports.mount = mount$$1;
exports.mixin = mixin$$1;
exports.update = update$$1;
exports.unregister = unregister$$1;
exports.observable = observable;
exports['default'] = riot$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
});

var riot$1 = unwrapExports(riot_1);

var index$1 = createCommonjsModule(function (module) {
'use strict';

/**
 * Diff Match and Patch
 *
 * Copyright 2006 Google Inc.
 * http://code.google.com/p/google-diff-match-patch/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Computes the difference between two texts to create a patch.
 * Applies the patch onto another text, allowing for errors.
 * @author fraser@google.com (Neil Fraser)
 */

/**
 * Class containing the diff, match and patch methods.
 * @constructor
 */
function diff_match_patch() {

  // Defaults.
  // Redefine these in your program to override the defaults.

  // Number of seconds to map a diff before giving up (0 for infinity).
  this.Diff_Timeout = 1.0;
  // Cost of an empty edit operation in terms of edit characters.
  this.Diff_EditCost = 4;
  // At what point is no match declared (0.0 = perfection, 1.0 = very loose).
  this.Match_Threshold = 0.5;
  // How far to search for a match (0 = exact location, 1000+ = broad match).
  // A match this many characters away from the expected location will add
  // 1.0 to the score (0.0 is a perfect match).
  this.Match_Distance = 1000;
  // When deleting a large block of text (over ~64 characters), how close do
  // the contents have to be to match the expected contents. (0.0 = perfection,
  // 1.0 = very loose).  Note that Match_Threshold controls how closely the
  // end points of a delete need to match.
  this.Patch_DeleteThreshold = 0.5;
  // Chunk size for context length.
  this.Patch_Margin = 4;

  // The number of bits in an int.
  this.Match_MaxBits = 32;
}


//  DIFF FUNCTIONS


/**
 * The data structure representing a diff is an array of tuples:
 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
 */
var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0;

/** @typedef {{0: number, 1: string}} */
diff_match_patch.Diff;


/**
 * Find the differences between two texts.  Simplifies the problem by stripping
 * any common prefix or suffix off the texts before diffing.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {boolean=} opt_checklines Optional speedup flag. If present and false,
 *     then don't run a line-level diff first to identify the changed areas.
 *     Defaults to true, which does a faster, slightly less optimal diff.
 * @param {number} opt_deadline Optional time when the diff should be complete
 *     by.  Used internally for recursive calls.  Users should set DiffTimeout
 *     instead.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 */
diff_match_patch.prototype.diff_main = function(text1, text2, opt_checklines,
    opt_deadline) {
  // Set a deadline by which time the diff must be complete.
  if (typeof opt_deadline == 'undefined') {
    if (this.Diff_Timeout <= 0) {
      opt_deadline = Number.MAX_VALUE;
    } else {
      opt_deadline = (new Date).getTime() + this.Diff_Timeout * 1000;
    }
  }
  var deadline = opt_deadline;

  // Check for null inputs.
  if (text1 == null || text2 == null) {
    throw new Error('Null input. (diff_main)');
  }

  // Check for equality (speedup).
  if (text1 == text2) {
    if (text1) {
      return [[DIFF_EQUAL, text1]];
    }
    return [];
  }

  if (typeof opt_checklines == 'undefined') {
    opt_checklines = true;
  }
  var checklines = opt_checklines;

  // Trim off common prefix (speedup).
  var commonlength = this.diff_commonPrefix(text1, text2);
  var commonprefix = text1.substring(0, commonlength);
  text1 = text1.substring(commonlength);
  text2 = text2.substring(commonlength);

  // Trim off common suffix (speedup).
  commonlength = this.diff_commonSuffix(text1, text2);
  var commonsuffix = text1.substring(text1.length - commonlength);
  text1 = text1.substring(0, text1.length - commonlength);
  text2 = text2.substring(0, text2.length - commonlength);

  // Compute the diff on the middle block.
  var diffs = this.diff_compute_(text1, text2, checklines, deadline);

  // Restore the prefix and suffix.
  if (commonprefix) {
    diffs.unshift([DIFF_EQUAL, commonprefix]);
  }
  if (commonsuffix) {
    diffs.push([DIFF_EQUAL, commonsuffix]);
  }
  this.diff_cleanupMerge(diffs);
  return diffs;
};


/**
 * Find the differences between two texts.  Assumes that the texts do not
 * have any common prefix or suffix.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {boolean} checklines Speedup flag.  If false, then don't run a
 *     line-level diff first to identify the changed areas.
 *     If true, then run a faster, slightly less optimal diff.
 * @param {number} deadline Time when the diff should be complete by.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_compute_ = function(text1, text2, checklines,
    deadline) {
  var diffs;

  if (!text1) {
    // Just add some text (speedup).
    return [[DIFF_INSERT, text2]];
  }

  if (!text2) {
    // Just delete some text (speedup).
    return [[DIFF_DELETE, text1]];
  }

  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  var i = longtext.indexOf(shorttext);
  if (i != -1) {
    // Shorter text is inside the longer text (speedup).
    diffs = [[DIFF_INSERT, longtext.substring(0, i)],
             [DIFF_EQUAL, shorttext],
             [DIFF_INSERT, longtext.substring(i + shorttext.length)]];
    // Swap insertions for deletions if diff is reversed.
    if (text1.length > text2.length) {
      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
    }
    return diffs;
  }

  if (shorttext.length == 1) {
    // Single character string.
    // After the previous speedup, the character can't be an equality.
    return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
  }

  // Check to see if the problem can be split in two.
  var hm = this.diff_halfMatch_(text1, text2);
  if (hm) {
    // A half-match was found, sort out the return data.
    var text1_a = hm[0];
    var text1_b = hm[1];
    var text2_a = hm[2];
    var text2_b = hm[3];
    var mid_common = hm[4];
    // Send both pairs off for separate processing.
    var diffs_a = this.diff_main(text1_a, text2_a, checklines, deadline);
    var diffs_b = this.diff_main(text1_b, text2_b, checklines, deadline);
    // Merge the results.
    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
  }

  if (checklines && text1.length > 100 && text2.length > 100) {
    return this.diff_lineMode_(text1, text2, deadline);
  }

  return this.diff_bisect_(text1, text2, deadline);
};


/**
 * Do a quick line-level diff on both strings, then rediff the parts for
 * greater accuracy.
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} deadline Time when the diff should be complete by.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_lineMode_ = function(text1, text2, deadline) {
  // Scan the text on a line-by-line basis first.
  var a = this.diff_linesToChars_(text1, text2);
  text1 = a.chars1;
  text2 = a.chars2;
  var linearray = a.lineArray;

  var diffs = this.diff_main(text1, text2, false, deadline);

  // Convert the diff back to original text.
  this.diff_charsToLines_(diffs, linearray);
  // Eliminate freak matches (e.g. blank lines)
  this.diff_cleanupSemantic(diffs);

  // Rediff any replacement blocks, this time character-by-character.
  // Add a dummy entry at the end.
  diffs.push([DIFF_EQUAL, '']);
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  while (pointer < diffs.length) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        break;
      case DIFF_EQUAL:
        // Upon reaching an equality, check for prior redundancies.
        if (count_delete >= 1 && count_insert >= 1) {
          // Delete the offending records and add the merged ones.
          diffs.splice(pointer - count_delete - count_insert,
                       count_delete + count_insert);
          pointer = pointer - count_delete - count_insert;
          var a = this.diff_main(text_delete, text_insert, false, deadline);
          for (var j = a.length - 1; j >= 0; j--) {
            diffs.splice(pointer, 0, a[j]);
          }
          pointer = pointer + a.length;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
        break;
    }
    pointer++;
  }
  diffs.pop();  // Remove the dummy entry at the end.

  return diffs;
};


/**
 * Find the 'middle snake' of a diff, split the problem in two
 * and return the recursively constructed diff.
 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} deadline Time at which to bail if not yet complete.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_bisect_ = function(text1, text2, deadline) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  var max_d = Math.ceil((text1_length + text2_length) / 2);
  var v_offset = max_d;
  var v_length = 2 * max_d;
  var v1 = new Array(v_length);
  var v2 = new Array(v_length);
  // Setting all elements to -1 is faster in Chrome & Firefox than mixing
  // integers and undefined.
  for (var x = 0; x < v_length; x++) {
    v1[x] = -1;
    v2[x] = -1;
  }
  v1[v_offset + 1] = 0;
  v2[v_offset + 1] = 0;
  var delta = text1_length - text2_length;
  // If the total number of characters is odd, then the front path will collide
  // with the reverse path.
  var front = (delta % 2 != 0);
  // Offsets for start and end of k loop.
  // Prevents mapping of space beyond the grid.
  var k1start = 0;
  var k1end = 0;
  var k2start = 0;
  var k2end = 0;
  for (var d = 0; d < max_d; d++) {
    // Bail out if deadline is reached.
    if ((new Date()).getTime() > deadline) {
      break;
    }

    // Walk the front path one step.
    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
      var k1_offset = v_offset + k1;
      var x1;
      if (k1 == -d || (k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
        x1 = v1[k1_offset + 1];
      } else {
        x1 = v1[k1_offset - 1] + 1;
      }
      var y1 = x1 - k1;
      while (x1 < text1_length && y1 < text2_length &&
             text1.charAt(x1) == text2.charAt(y1)) {
        x1++;
        y1++;
      }
      v1[k1_offset] = x1;
      if (x1 > text1_length) {
        // Ran off the right of the graph.
        k1end += 2;
      } else if (y1 > text2_length) {
        // Ran off the bottom of the graph.
        k1start += 2;
      } else if (front) {
        var k2_offset = v_offset + delta - k1;
        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
          // Mirror x2 onto top-left coordinate system.
          var x2 = text1_length - v2[k2_offset];
          if (x1 >= x2) {
            // Overlap detected.
            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
          }
        }
      }
    }

    // Walk the reverse path one step.
    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
      var k2_offset = v_offset + k2;
      var x2;
      if (k2 == -d || (k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
        x2 = v2[k2_offset + 1];
      } else {
        x2 = v2[k2_offset - 1] + 1;
      }
      var y2 = x2 - k2;
      while (x2 < text1_length && y2 < text2_length &&
             text1.charAt(text1_length - x2 - 1) ==
             text2.charAt(text2_length - y2 - 1)) {
        x2++;
        y2++;
      }
      v2[k2_offset] = x2;
      if (x2 > text1_length) {
        // Ran off the left of the graph.
        k2end += 2;
      } else if (y2 > text2_length) {
        // Ran off the top of the graph.
        k2start += 2;
      } else if (!front) {
        var k1_offset = v_offset + delta - k2;
        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
          var x1 = v1[k1_offset];
          var y1 = v_offset + x1 - k1_offset;
          // Mirror x2 onto top-left coordinate system.
          x2 = text1_length - x2;
          if (x1 >= x2) {
            // Overlap detected.
            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
          }
        }
      }
    }
  }
  // Diff took too long and hit the deadline or
  // number of diffs equals number of characters, no commonality at all.
  return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
};


/**
 * Given the location of the 'middle snake', split the diff in two parts
 * and recurse.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} x Index of split point in text1.
 * @param {number} y Index of split point in text2.
 * @param {number} deadline Time at which to bail if not yet complete.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_bisectSplit_ = function(text1, text2, x, y,
    deadline) {
  var text1a = text1.substring(0, x);
  var text2a = text2.substring(0, y);
  var text1b = text1.substring(x);
  var text2b = text2.substring(y);

  // Compute both diffs serially.
  var diffs = this.diff_main(text1a, text2a, false, deadline);
  var diffsb = this.diff_main(text1b, text2b, false, deadline);

  return diffs.concat(diffsb);
};


/**
 * Split two texts into an array of strings.  Reduce the texts to a string of
 * hashes where each Unicode character represents one line.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {{chars1: string, chars2: string, lineArray: !Array.<string>}}
 *     An object containing the encoded text1, the encoded text2 and
 *     the array of unique strings.
 *     The zeroth element of the array of unique strings is intentionally blank.
 * @private
 */
diff_match_patch.prototype.diff_linesToChars_ = function(text1, text2) {
  var lineArray = [];  // e.g. lineArray[4] == 'Hello\n'
  var lineHash = {};   // e.g. lineHash['Hello\n'] == 4

  // '\x00' is a valid character, but various debuggers don't like it.
  // So we'll insert a junk entry to avoid generating a null character.
  lineArray[0] = '';

  /**
   * Split a text into an array of strings.  Reduce the texts to a string of
   * hashes where each Unicode character represents one line.
   * Modifies linearray and linehash through being a closure.
   * @param {string} text String to encode.
   * @return {string} Encoded string.
   * @private
   */
  function diff_linesToCharsMunge_(text) {
    var chars = '';
    // Walk the text, pulling out a substring for each line.
    // text.split('\n') would would temporarily double our memory footprint.
    // Modifying text would create many large strings to garbage collect.
    var lineStart = 0;
    var lineEnd = -1;
    // Keeping our own length variable is faster than looking it up.
    var lineArrayLength = lineArray.length;
    while (lineEnd < text.length - 1) {
      lineEnd = text.indexOf('\n', lineStart);
      if (lineEnd == -1) {
        lineEnd = text.length - 1;
      }
      var line = text.substring(lineStart, lineEnd + 1);
      lineStart = lineEnd + 1;

      if (lineHash.hasOwnProperty ? lineHash.hasOwnProperty(line) :
          (lineHash[line] !== undefined)) {
        chars += String.fromCharCode(lineHash[line]);
      } else {
        chars += String.fromCharCode(lineArrayLength);
        lineHash[line] = lineArrayLength;
        lineArray[lineArrayLength++] = line;
      }
    }
    return chars;
  }

  var chars1 = diff_linesToCharsMunge_(text1);
  var chars2 = diff_linesToCharsMunge_(text2);
  return {chars1: chars1, chars2: chars2, lineArray: lineArray};
};


/**
 * Rehydrate the text in a diff from a string of line hashes to real lines of
 * text.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @param {!Array.<string>} lineArray Array of unique strings.
 * @private
 */
diff_match_patch.prototype.diff_charsToLines_ = function(diffs, lineArray) {
  for (var x = 0; x < diffs.length; x++) {
    var chars = diffs[x][1];
    var text = [];
    for (var y = 0; y < chars.length; y++) {
      text[y] = lineArray[chars.charCodeAt(y)];
    }
    diffs[x][1] = text.join('');
  }
};


/**
 * Determine the common prefix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the start of each
 *     string.
 */
diff_match_patch.prototype.diff_commonPrefix = function(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerstart = 0;
  while (pointermin < pointermid) {
    if (text1.substring(pointerstart, pointermid) ==
        text2.substring(pointerstart, pointermid)) {
      pointermin = pointermid;
      pointerstart = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};


/**
 * Determine the common suffix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of each string.
 */
diff_match_patch.prototype.diff_commonSuffix = function(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 ||
      text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerend = 0;
  while (pointermin < pointermid) {
    if (text1.substring(text1.length - pointermid, text1.length - pointerend) ==
        text2.substring(text2.length - pointermid, text2.length - pointerend)) {
      pointermin = pointermid;
      pointerend = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};


/**
 * Determine if the suffix of one string is the prefix of another.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of the first
 *     string and the start of the second string.
 * @private
 */
diff_match_patch.prototype.diff_commonOverlap_ = function(text1, text2) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  // Eliminate the null case.
  if (text1_length == 0 || text2_length == 0) {
    return 0;
  }
  // Truncate the longer string.
  if (text1_length > text2_length) {
    text1 = text1.substring(text1_length - text2_length);
  } else if (text1_length < text2_length) {
    text2 = text2.substring(0, text1_length);
  }
  var text_length = Math.min(text1_length, text2_length);
  // Quick check for the worst case.
  if (text1 == text2) {
    return text_length;
  }

  // Start by looking for a single character match
  // and increase length until no match is found.
  // Performance analysis: http://neil.fraser.name/news/2010/11/04/
  var best = 0;
  var length = 1;
  while (true) {
    var pattern = text1.substring(text_length - length);
    var found = text2.indexOf(pattern);
    if (found == -1) {
      return best;
    }
    length += found;
    if (found == 0 || text1.substring(text_length - length) ==
        text2.substring(0, length)) {
      best = length;
      length++;
    }
  }
};


/**
 * Do the two texts share a substring which is at least half the length of the
 * longer text?
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {Array.<string>} Five element Array, containing the prefix of
 *     text1, the suffix of text1, the prefix of text2, the suffix of
 *     text2 and the common middle.  Or null if there was no match.
 * @private
 */
diff_match_patch.prototype.diff_halfMatch_ = function(text1, text2) {
  if (this.Diff_Timeout <= 0) {
    // Don't risk returning a non-optimal diff if we have unlimited time.
    return null;
  }
  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
    return null;  // Pointless.
  }
  var dmp = this;  // 'this' becomes 'window' in a closure.

  /**
   * Does a substring of shorttext exist within longtext such that the substring
   * is at least half the length of longtext?
   * Closure, but does not reference any external variables.
   * @param {string} longtext Longer string.
   * @param {string} shorttext Shorter string.
   * @param {number} i Start index of quarter length substring within longtext.
   * @return {Array.<string>} Five element Array, containing the prefix of
   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
   *     of shorttext and the common middle.  Or null if there was no match.
   * @private
   */
  function diff_halfMatchI_(longtext, shorttext, i) {
    // Start with a 1/4 length substring at position i as a seed.
    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
    var j = -1;
    var best_common = '';
    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
    while ((j = shorttext.indexOf(seed, j + 1)) != -1) {
      var prefixLength = dmp.diff_commonPrefix(longtext.substring(i),
                                               shorttext.substring(j));
      var suffixLength = dmp.diff_commonSuffix(longtext.substring(0, i),
                                               shorttext.substring(0, j));
      if (best_common.length < suffixLength + prefixLength) {
        best_common = shorttext.substring(j - suffixLength, j) +
            shorttext.substring(j, j + prefixLength);
        best_longtext_a = longtext.substring(0, i - suffixLength);
        best_longtext_b = longtext.substring(i + prefixLength);
        best_shorttext_a = shorttext.substring(0, j - suffixLength);
        best_shorttext_b = shorttext.substring(j + prefixLength);
      }
    }
    if (best_common.length * 2 >= longtext.length) {
      return [best_longtext_a, best_longtext_b,
              best_shorttext_a, best_shorttext_b, best_common];
    } else {
      return null;
    }
  }

  // First check if the second quarter is the seed for a half-match.
  var hm1 = diff_halfMatchI_(longtext, shorttext,
                             Math.ceil(longtext.length / 4));
  // Check again based on the third quarter.
  var hm2 = diff_halfMatchI_(longtext, shorttext,
                             Math.ceil(longtext.length / 2));
  var hm;
  if (!hm1 && !hm2) {
    return null;
  } else if (!hm2) {
    hm = hm1;
  } else if (!hm1) {
    hm = hm2;
  } else {
    // Both matched.  Select the longest.
    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
  }

  // A half-match was found, sort out the return data.
  var text1_a, text1_b, text2_a, text2_b;
  if (text1.length > text2.length) {
    text1_a = hm[0];
    text1_b = hm[1];
    text2_a = hm[2];
    text2_b = hm[3];
  } else {
    text2_a = hm[0];
    text2_b = hm[1];
    text1_a = hm[2];
    text1_b = hm[3];
  }
  var mid_common = hm[4];
  return [text1_a, text1_b, text2_a, text2_b, mid_common];
};


/**
 * Reduce the number of edits by eliminating semantically trivial equalities.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupSemantic = function(diffs) {
  var changes = false;
  var equalities = [];  // Stack of indices where equalities are found.
  var equalitiesLength = 0;  // Keeping our own length var is faster in JS.
  /** @type {?string} */
  var lastequality = null;
  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
  var pointer = 0;  // Index of current position.
  // Number of characters that changed prior to the equality.
  var length_insertions1 = 0;
  var length_deletions1 = 0;
  // Number of characters that changed after the equality.
  var length_insertions2 = 0;
  var length_deletions2 = 0;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {  // Equality found.
      equalities[equalitiesLength++] = pointer;
      length_insertions1 = length_insertions2;
      length_deletions1 = length_deletions2;
      length_insertions2 = 0;
      length_deletions2 = 0;
      lastequality = diffs[pointer][1];
    } else {  // An insertion or deletion.
      if (diffs[pointer][0] == DIFF_INSERT) {
        length_insertions2 += diffs[pointer][1].length;
      } else {
        length_deletions2 += diffs[pointer][1].length;
      }
      // Eliminate an equality that is smaller or equal to the edits on both
      // sides of it.
      if (lastequality && (lastequality.length <=
          Math.max(length_insertions1, length_deletions1)) &&
          (lastequality.length <= Math.max(length_insertions2,
                                           length_deletions2))) {
        // Duplicate record.
        diffs.splice(equalities[equalitiesLength - 1], 0,
                     [DIFF_DELETE, lastequality]);
        // Change second copy to insert.
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        // Throw away the equality we just deleted.
        equalitiesLength--;
        // Throw away the previous equality (it needs to be reevaluated).
        equalitiesLength--;
        pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
        length_insertions1 = 0;  // Reset the counters.
        length_deletions1 = 0;
        length_insertions2 = 0;
        length_deletions2 = 0;
        lastequality = null;
        changes = true;
      }
    }
    pointer++;
  }

  // Normalize the diff.
  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
  this.diff_cleanupSemanticLossless(diffs);

  // Find any overlaps between deletions and insertions.
  // e.g: <del>abcxxx</del><ins>xxxdef</ins>
  //   -> <del>abc</del>xxx<ins>def</ins>
  // e.g: <del>xxxabc</del><ins>defxxx</ins>
  //   -> <ins>def</ins>xxx<del>abc</del>
  // Only extract an overlap if it is as big as the edit ahead or behind it.
  pointer = 1;
  while (pointer < diffs.length) {
    if (diffs[pointer - 1][0] == DIFF_DELETE &&
        diffs[pointer][0] == DIFF_INSERT) {
      var deletion = diffs[pointer - 1][1];
      var insertion = diffs[pointer][1];
      var overlap_length1 = this.diff_commonOverlap_(deletion, insertion);
      var overlap_length2 = this.diff_commonOverlap_(insertion, deletion);
      if (overlap_length1 >= overlap_length2) {
        if (overlap_length1 >= deletion.length / 2 ||
            overlap_length1 >= insertion.length / 2) {
          // Overlap found.  Insert an equality and trim the surrounding edits.
          diffs.splice(pointer, 0,
              [DIFF_EQUAL, insertion.substring(0, overlap_length1)]);
          diffs[pointer - 1][1] =
              deletion.substring(0, deletion.length - overlap_length1);
          diffs[pointer + 1][1] = insertion.substring(overlap_length1);
          pointer++;
        }
      } else {
        if (overlap_length2 >= deletion.length / 2 ||
            overlap_length2 >= insertion.length / 2) {
          // Reverse overlap found.
          // Insert an equality and swap and trim the surrounding edits.
          diffs.splice(pointer, 0,
              [DIFF_EQUAL, deletion.substring(0, overlap_length2)]);
          diffs[pointer - 1][0] = DIFF_INSERT;
          diffs[pointer - 1][1] =
              insertion.substring(0, insertion.length - overlap_length2);
          diffs[pointer + 1][0] = DIFF_DELETE;
          diffs[pointer + 1][1] =
              deletion.substring(overlap_length2);
          pointer++;
        }
      }
      pointer++;
    }
    pointer++;
  }
};


/**
 * Look for single edits surrounded on both sides by equalities
 * which can be shifted sideways to align the edit to a word boundary.
 * e.g: The c<ins>at c</ins>ame. -> The <ins>cat </ins>came.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupSemanticLossless = function(diffs) {
  /**
   * Given two strings, compute a score representing whether the internal
   * boundary falls on logical boundaries.
   * Scores range from 6 (best) to 0 (worst).
   * Closure, but does not reference any external variables.
   * @param {string} one First string.
   * @param {string} two Second string.
   * @return {number} The score.
   * @private
   */
  function diff_cleanupSemanticScore_(one, two) {
    if (!one || !two) {
      // Edges are the best.
      return 6;
    }

    // Each port of this function behaves slightly differently due to
    // subtle differences in each language's definition of things like
    // 'whitespace'.  Since this function's purpose is largely cosmetic,
    // the choice has been made to use each language's native features
    // rather than force total conformity.
    var char1 = one.charAt(one.length - 1);
    var char2 = two.charAt(0);
    var nonAlphaNumeric1 = char1.match(diff_match_patch.nonAlphaNumericRegex_);
    var nonAlphaNumeric2 = char2.match(diff_match_patch.nonAlphaNumericRegex_);
    var whitespace1 = nonAlphaNumeric1 &&
        char1.match(diff_match_patch.whitespaceRegex_);
    var whitespace2 = nonAlphaNumeric2 &&
        char2.match(diff_match_patch.whitespaceRegex_);
    var lineBreak1 = whitespace1 &&
        char1.match(diff_match_patch.linebreakRegex_);
    var lineBreak2 = whitespace2 &&
        char2.match(diff_match_patch.linebreakRegex_);
    var blankLine1 = lineBreak1 &&
        one.match(diff_match_patch.blanklineEndRegex_);
    var blankLine2 = lineBreak2 &&
        two.match(diff_match_patch.blanklineStartRegex_);

    if (blankLine1 || blankLine2) {
      // Five points for blank lines.
      return 5;
    } else if (lineBreak1 || lineBreak2) {
      // Four points for line breaks.
      return 4;
    } else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
      // Three points for end of sentences.
      return 3;
    } else if (whitespace1 || whitespace2) {
      // Two points for whitespace.
      return 2;
    } else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
      // One point for non-alphanumeric.
      return 1;
    }
    return 0;
  }

  var pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
        diffs[pointer + 1][0] == DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      var equality1 = diffs[pointer - 1][1];
      var edit = diffs[pointer][1];
      var equality2 = diffs[pointer + 1][1];

      // First, shift the edit as far left as possible.
      var commonOffset = this.diff_commonSuffix(equality1, edit);
      if (commonOffset) {
        var commonString = edit.substring(edit.length - commonOffset);
        equality1 = equality1.substring(0, equality1.length - commonOffset);
        edit = commonString + edit.substring(0, edit.length - commonOffset);
        equality2 = commonString + equality2;
      }

      // Second, step character by character right, looking for the best fit.
      var bestEquality1 = equality1;
      var bestEdit = edit;
      var bestEquality2 = equality2;
      var bestScore = diff_cleanupSemanticScore_(equality1, edit) +
          diff_cleanupSemanticScore_(edit, equality2);
      while (edit.charAt(0) === equality2.charAt(0)) {
        equality1 += edit.charAt(0);
        edit = edit.substring(1) + equality2.charAt(0);
        equality2 = equality2.substring(1);
        var score = diff_cleanupSemanticScore_(equality1, edit) +
            diff_cleanupSemanticScore_(edit, equality2);
        // The >= encourages trailing rather than leading whitespace on edits.
        if (score >= bestScore) {
          bestScore = score;
          bestEquality1 = equality1;
          bestEdit = edit;
          bestEquality2 = equality2;
        }
      }

      if (diffs[pointer - 1][1] != bestEquality1) {
        // We have an improvement, save it back to the diff.
        if (bestEquality1) {
          diffs[pointer - 1][1] = bestEquality1;
        } else {
          diffs.splice(pointer - 1, 1);
          pointer--;
        }
        diffs[pointer][1] = bestEdit;
        if (bestEquality2) {
          diffs[pointer + 1][1] = bestEquality2;
        } else {
          diffs.splice(pointer + 1, 1);
          pointer--;
        }
      }
    }
    pointer++;
  }
};

// Define some regex patterns for matching boundaries.
diff_match_patch.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
diff_match_patch.whitespaceRegex_ = /\s/;
diff_match_patch.linebreakRegex_ = /[\r\n]/;
diff_match_patch.blanklineEndRegex_ = /\n\r?\n$/;
diff_match_patch.blanklineStartRegex_ = /^\r?\n\r?\n/;

/**
 * Reduce the number of edits by eliminating operationally trivial equalities.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupEfficiency = function(diffs) {
  var changes = false;
  var equalities = [];  // Stack of indices where equalities are found.
  var equalitiesLength = 0;  // Keeping our own length var is faster in JS.
  /** @type {?string} */
  var lastequality = null;
  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
  var pointer = 0;  // Index of current position.
  // Is there an insertion operation before the last equality.
  var pre_ins = false;
  // Is there a deletion operation before the last equality.
  var pre_del = false;
  // Is there an insertion operation after the last equality.
  var post_ins = false;
  // Is there a deletion operation after the last equality.
  var post_del = false;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {  // Equality found.
      if (diffs[pointer][1].length < this.Diff_EditCost &&
          (post_ins || post_del)) {
        // Candidate found.
        equalities[equalitiesLength++] = pointer;
        pre_ins = post_ins;
        pre_del = post_del;
        lastequality = diffs[pointer][1];
      } else {
        // Not a candidate, and can never become one.
        equalitiesLength = 0;
        lastequality = null;
      }
      post_ins = post_del = false;
    } else {  // An insertion or deletion.
      if (diffs[pointer][0] == DIFF_DELETE) {
        post_del = true;
      } else {
        post_ins = true;
      }
      /*
       * Five types to be split:
       * <ins>A</ins><del>B</del>XY<ins>C</ins><del>D</del>
       * <ins>A</ins>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<ins>C</ins>
       * <ins>A</del>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<del>C</del>
       */
      if (lastequality && ((pre_ins && pre_del && post_ins && post_del) ||
                           ((lastequality.length < this.Diff_EditCost / 2) &&
                            (pre_ins + pre_del + post_ins + post_del) == 3))) {
        // Duplicate record.
        diffs.splice(equalities[equalitiesLength - 1], 0,
                     [DIFF_DELETE, lastequality]);
        // Change second copy to insert.
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        equalitiesLength--;  // Throw away the equality we just deleted;
        lastequality = null;
        if (pre_ins && pre_del) {
          // No changes made which could affect previous entry, keep going.
          post_ins = post_del = true;
          equalitiesLength = 0;
        } else {
          equalitiesLength--;  // Throw away the previous equality.
          pointer = equalitiesLength > 0 ?
              equalities[equalitiesLength - 1] : -1;
          post_ins = post_del = false;
        }
        changes = true;
      }
    }
    pointer++;
  }

  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
};


/**
 * Reorder and merge like edit sections.  Merge equalities.
 * Any edit section can move as long as it doesn't cross an equality.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupMerge = function(diffs) {
  diffs.push([DIFF_EQUAL, '']);  // Add a dummy entry at the end.
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  var commonlength;
  while (pointer < diffs.length) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_EQUAL:
        // Upon reaching an equality, check for prior redundancies.
        if (count_delete + count_insert > 1) {
          if (count_delete !== 0 && count_insert !== 0) {
            // Factor out any common prefixies.
            commonlength = this.diff_commonPrefix(text_insert, text_delete);
            if (commonlength !== 0) {
              if ((pointer - count_delete - count_insert) > 0 &&
                  diffs[pointer - count_delete - count_insert - 1][0] ==
                  DIFF_EQUAL) {
                diffs[pointer - count_delete - count_insert - 1][1] +=
                    text_insert.substring(0, commonlength);
              } else {
                diffs.splice(0, 0, [DIFF_EQUAL,
                                    text_insert.substring(0, commonlength)]);
                pointer++;
              }
              text_insert = text_insert.substring(commonlength);
              text_delete = text_delete.substring(commonlength);
            }
            // Factor out any common suffixies.
            commonlength = this.diff_commonSuffix(text_insert, text_delete);
            if (commonlength !== 0) {
              diffs[pointer][1] = text_insert.substring(text_insert.length -
                  commonlength) + diffs[pointer][1];
              text_insert = text_insert.substring(0, text_insert.length -
                  commonlength);
              text_delete = text_delete.substring(0, text_delete.length -
                  commonlength);
            }
          }
          // Delete the offending records and add the merged ones.
          if (count_delete === 0) {
            diffs.splice(pointer - count_insert,
                count_delete + count_insert, [DIFF_INSERT, text_insert]);
          } else if (count_insert === 0) {
            diffs.splice(pointer - count_delete,
                count_delete + count_insert, [DIFF_DELETE, text_delete]);
          } else {
            diffs.splice(pointer - count_delete - count_insert,
                count_delete + count_insert, [DIFF_DELETE, text_delete],
                [DIFF_INSERT, text_insert]);
          }
          pointer = pointer - count_delete - count_insert +
                    (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
        } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
          // Merge this equality with the previous one.
          diffs[pointer - 1][1] += diffs[pointer][1];
          diffs.splice(pointer, 1);
        } else {
          pointer++;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
        break;
    }
  }
  if (diffs[diffs.length - 1][1] === '') {
    diffs.pop();  // Remove the dummy entry at the end.
  }

  // Second pass: look for single edits surrounded on both sides by equalities
  // which can be shifted sideways to eliminate an equality.
  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
  var changes = false;
  pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
        diffs[pointer + 1][0] == DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      if (diffs[pointer][1].substring(diffs[pointer][1].length -
          diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
        // Shift the edit over the previous equality.
        diffs[pointer][1] = diffs[pointer - 1][1] +
            diffs[pointer][1].substring(0, diffs[pointer][1].length -
                                        diffs[pointer - 1][1].length);
        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
        diffs.splice(pointer - 1, 1);
        changes = true;
      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) ==
          diffs[pointer + 1][1]) {
        // Shift the edit over the next equality.
        diffs[pointer - 1][1] += diffs[pointer + 1][1];
        diffs[pointer][1] =
            diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
            diffs[pointer + 1][1];
        diffs.splice(pointer + 1, 1);
        changes = true;
      }
    }
    pointer++;
  }
  // If shifts were made, the diff needs reordering and another shift sweep.
  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
};


/**
 * loc is a location in text1, compute and return the equivalent location in
 * text2.
 * e.g. 'The cat' vs 'The big cat', 1->1, 5->8
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @param {number} loc Location within text1.
 * @return {number} Location within text2.
 */
diff_match_patch.prototype.diff_xIndex = function(diffs, loc) {
  var chars1 = 0;
  var chars2 = 0;
  var last_chars1 = 0;
  var last_chars2 = 0;
  var x;
  for (x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_INSERT) {  // Equality or deletion.
      chars1 += diffs[x][1].length;
    }
    if (diffs[x][0] !== DIFF_DELETE) {  // Equality or insertion.
      chars2 += diffs[x][1].length;
    }
    if (chars1 > loc) {  // Overshot the location.
      break;
    }
    last_chars1 = chars1;
    last_chars2 = chars2;
  }
  // Was the location was deleted?
  if (diffs.length != x && diffs[x][0] === DIFF_DELETE) {
    return last_chars2;
  }
  // Add the remaining character length.
  return last_chars2 + (loc - last_chars1);
};


/**
 * Convert a diff array into a pretty HTML report.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} HTML representation.
 */
diff_match_patch.prototype.diff_prettyHtml = function(diffs) {
  var html = [];
  var pattern_amp = /&/g;
  var pattern_lt = /</g;
  var pattern_gt = />/g;
  var pattern_para = /\n/g;
  for (var x = 0; x < diffs.length; x++) {
    var op = diffs[x][0];    // Operation (insert, delete, equal)
    var data = diffs[x][1];  // Text of change.
    var text = data.replace(pattern_amp, '&amp;').replace(pattern_lt, '&lt;')
        .replace(pattern_gt, '&gt;').replace(pattern_para, '&para;<br>');
    switch (op) {
      case DIFF_INSERT:
        html[x] = '<ins style="background:#e6ffe6;">' + text + '</ins>';
        break;
      case DIFF_DELETE:
        html[x] = '<del style="background:#ffe6e6;">' + text + '</del>';
        break;
      case DIFF_EQUAL:
        html[x] = '<span>' + text + '</span>';
        break;
    }
  }
  return html.join('');
};


/**
 * Compute and return the source text (all equalities and deletions).
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Source text.
 */
diff_match_patch.prototype.diff_text1 = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_INSERT) {
      text[x] = diffs[x][1];
    }
  }
  return text.join('');
};


/**
 * Compute and return the destination text (all equalities and insertions).
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Destination text.
 */
diff_match_patch.prototype.diff_text2 = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_DELETE) {
      text[x] = diffs[x][1];
    }
  }
  return text.join('');
};


/**
 * Compute the Levenshtein distance; the number of inserted, deleted or
 * substituted characters.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {number} Number of changes.
 */
diff_match_patch.prototype.diff_levenshtein = function(diffs) {
  var levenshtein = 0;
  var insertions = 0;
  var deletions = 0;
  for (var x = 0; x < diffs.length; x++) {
    var op = diffs[x][0];
    var data = diffs[x][1];
    switch (op) {
      case DIFF_INSERT:
        insertions += data.length;
        break;
      case DIFF_DELETE:
        deletions += data.length;
        break;
      case DIFF_EQUAL:
        // A deletion and an insertion is one substitution.
        levenshtein += Math.max(insertions, deletions);
        insertions = 0;
        deletions = 0;
        break;
    }
  }
  levenshtein += Math.max(insertions, deletions);
  return levenshtein;
};


/**
 * Crush the diff into an encoded string which describes the operations
 * required to transform text1 into text2.
 * E.g. =3\t-2\t+ing  -> Keep 3 chars, delete 2 chars, insert 'ing'.
 * Operations are tab-separated.  Inserted text is escaped using %xx notation.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Delta text.
 */
diff_match_patch.prototype.diff_toDelta = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    switch (diffs[x][0]) {
      case DIFF_INSERT:
        text[x] = '+' + encodeURI(diffs[x][1]);
        break;
      case DIFF_DELETE:
        text[x] = '-' + diffs[x][1].length;
        break;
      case DIFF_EQUAL:
        text[x] = '=' + diffs[x][1].length;
        break;
    }
  }
  return text.join('\t').replace(/%20/g, ' ');
};


/**
 * Given the original text1, and an encoded string which describes the
 * operations required to transform text1 into text2, compute the full diff.
 * @param {string} text1 Source string for the diff.
 * @param {string} delta Delta text.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @throws {!Error} If invalid input.
 */
diff_match_patch.prototype.diff_fromDelta = function(text1, delta) {
  var diffs = [];
  var diffsLength = 0;  // Keeping our own length var is faster in JS.
  var pointer = 0;  // Cursor in text1
  var tokens = delta.split(/\t/g);
  for (var x = 0; x < tokens.length; x++) {
    // Each token begins with a one character parameter which specifies the
    // operation of this token (delete, insert, equality).
    var param = tokens[x].substring(1);
    switch (tokens[x].charAt(0)) {
      case '+':
        try {
          diffs[diffsLength++] = [DIFF_INSERT, decodeURI(param)];
        } catch (ex) {
          // Malformed URI sequence.
          throw new Error('Illegal escape in diff_fromDelta: ' + param);
        }
        break;
      case '-':
        // Fall through.
      case '=':
        var n = parseInt(param, 10);
        if (isNaN(n) || n < 0) {
          throw new Error('Invalid number in diff_fromDelta: ' + param);
        }
        var text = text1.substring(pointer, pointer += n);
        if (tokens[x].charAt(0) == '=') {
          diffs[diffsLength++] = [DIFF_EQUAL, text];
        } else {
          diffs[diffsLength++] = [DIFF_DELETE, text];
        }
        break;
      default:
        // Blank tokens are ok (from a trailing \t).
        // Anything else is an error.
        if (tokens[x]) {
          throw new Error('Invalid diff operation in diff_fromDelta: ' +
                          tokens[x]);
        }
    }
  }
  if (pointer != text1.length) {
    throw new Error('Delta length (' + pointer +
        ') does not equal source text length (' + text1.length + ').');
  }
  return diffs;
};


//  MATCH FUNCTIONS


/**
 * Locate the best instance of 'pattern' in 'text' near 'loc'.
 * @param {string} text The text to search.
 * @param {string} pattern The pattern to search for.
 * @param {number} loc The location to search around.
 * @return {number} Best match index or -1.
 */
diff_match_patch.prototype.match_main = function(text, pattern, loc) {
  // Check for null inputs.
  if (text == null || pattern == null || loc == null) {
    throw new Error('Null input. (match_main)');
  }

  loc = Math.max(0, Math.min(loc, text.length));
  if (text == pattern) {
    // Shortcut (potentially not guaranteed by the algorithm)
    return 0;
  } else if (!text.length) {
    // Nothing to match.
    return -1;
  } else if (text.substring(loc, loc + pattern.length) == pattern) {
    // Perfect match at the perfect spot!  (Includes case of null pattern)
    return loc;
  } else {
    // Do a fuzzy compare.
    return this.match_bitap_(text, pattern, loc);
  }
};


/**
 * Locate the best instance of 'pattern' in 'text' near 'loc' using the
 * Bitap algorithm.
 * @param {string} text The text to search.
 * @param {string} pattern The pattern to search for.
 * @param {number} loc The location to search around.
 * @return {number} Best match index or -1.
 * @private
 */
diff_match_patch.prototype.match_bitap_ = function(text, pattern, loc) {
  if (pattern.length > this.Match_MaxBits) {
    throw new Error('Pattern too long for this browser.');
  }

  // Initialise the alphabet.
  var s = this.match_alphabet_(pattern);

  var dmp = this;  // 'this' becomes 'window' in a closure.

  /**
   * Compute and return the score for a match with e errors and x location.
   * Accesses loc and pattern through being a closure.
   * @param {number} e Number of errors in match.
   * @param {number} x Location of match.
   * @return {number} Overall score for match (0.0 = good, 1.0 = bad).
   * @private
   */
  function match_bitapScore_(e, x) {
    var accuracy = e / pattern.length;
    var proximity = Math.abs(loc - x);
    if (!dmp.Match_Distance) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy;
    }
    return accuracy + (proximity / dmp.Match_Distance);
  }

  // Highest score beyond which we give up.
  var score_threshold = this.Match_Threshold;
  // Is there a nearby exact match? (speedup)
  var best_loc = text.indexOf(pattern, loc);
  if (best_loc != -1) {
    score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
    // What about in the other direction? (speedup)
    best_loc = text.lastIndexOf(pattern, loc + pattern.length);
    if (best_loc != -1) {
      score_threshold =
          Math.min(match_bitapScore_(0, best_loc), score_threshold);
    }
  }

  // Initialise the bit arrays.
  var matchmask = 1 << (pattern.length - 1);
  best_loc = -1;

  var bin_min, bin_mid;
  var bin_max = pattern.length + text.length;
  var last_rd;
  for (var d = 0; d < pattern.length; d++) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from 'loc' we can stray at this
    // error level.
    bin_min = 0;
    bin_mid = bin_max;
    while (bin_min < bin_mid) {
      if (match_bitapScore_(d, loc + bin_mid) <= score_threshold) {
        bin_min = bin_mid;
      } else {
        bin_max = bin_mid;
      }
      bin_mid = Math.floor((bin_max - bin_min) / 2 + bin_min);
    }
    // Use the result from this iteration as the maximum for the next.
    bin_max = bin_mid;
    var start = Math.max(1, loc - bin_mid + 1);
    var finish = Math.min(loc + bin_mid, text.length) + pattern.length;

    var rd = Array(finish + 2);
    rd[finish + 1] = (1 << d) - 1;
    for (var j = finish; j >= start; j--) {
      // The alphabet (s) is a sparse hash, so the following line generates
      // warnings.
      var charMatch = s[text.charAt(j - 1)];
      if (d === 0) {  // First pass: exact match.
        rd[j] = ((rd[j + 1] << 1) | 1) & charMatch;
      } else {  // Subsequent passes: fuzzy match.
        rd[j] = (((rd[j + 1] << 1) | 1) & charMatch) |
                (((last_rd[j + 1] | last_rd[j]) << 1) | 1) |
                last_rd[j + 1];
      }
      if (rd[j] & matchmask) {
        var score = match_bitapScore_(d, j - 1);
        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (score <= score_threshold) {
          // Told you so.
          score_threshold = score;
          best_loc = j - 1;
          if (best_loc > loc) {
            // When passing loc, don't exceed our current distance from loc.
            start = Math.max(1, 2 * loc - best_loc);
          } else {
            // Already passed loc, downhill from here on in.
            break;
          }
        }
      }
    }
    // No hope for a (better) match at greater error levels.
    if (match_bitapScore_(d + 1, loc) > score_threshold) {
      break;
    }
    last_rd = rd;
  }
  return best_loc;
};


/**
 * Initialise the alphabet for the Bitap algorithm.
 * @param {string} pattern The text to encode.
 * @return {!Object} Hash of character locations.
 * @private
 */
diff_match_patch.prototype.match_alphabet_ = function(pattern) {
  var s = {};
  for (var i = 0; i < pattern.length; i++) {
    s[pattern.charAt(i)] = 0;
  }
  for (var i = 0; i < pattern.length; i++) {
    s[pattern.charAt(i)] |= 1 << (pattern.length - i - 1);
  }
  return s;
};


//  PATCH FUNCTIONS


/**
 * Increase the context until it is unique,
 * but don't let the pattern expand beyond Match_MaxBits.
 * @param {!diff_match_patch.patch_obj} patch The patch to grow.
 * @param {string} text Source text.
 * @private
 */
diff_match_patch.prototype.patch_addContext_ = function(patch, text) {
  if (text.length == 0) {
    return;
  }
  var pattern = text.substring(patch.start2, patch.start2 + patch.length1);
  var padding = 0;

  // Look for the first and last matches of pattern in text.  If two different
  // matches are found, increase the pattern length.
  while (text.indexOf(pattern) != text.lastIndexOf(pattern) &&
         pattern.length < this.Match_MaxBits - this.Patch_Margin -
         this.Patch_Margin) {
    padding += this.Patch_Margin;
    pattern = text.substring(patch.start2 - padding,
                             patch.start2 + patch.length1 + padding);
  }
  // Add one chunk for good luck.
  padding += this.Patch_Margin;

  // Add the prefix.
  var prefix = text.substring(patch.start2 - padding, patch.start2);
  if (prefix) {
    patch.diffs.unshift([DIFF_EQUAL, prefix]);
  }
  // Add the suffix.
  var suffix = text.substring(patch.start2 + patch.length1,
                              patch.start2 + patch.length1 + padding);
  if (suffix) {
    patch.diffs.push([DIFF_EQUAL, suffix]);
  }

  // Roll back the start points.
  patch.start1 -= prefix.length;
  patch.start2 -= prefix.length;
  // Extend the lengths.
  patch.length1 += prefix.length + suffix.length;
  patch.length2 += prefix.length + suffix.length;
};


/**
 * Compute a list of patches to turn text1 into text2.
 * Use diffs if provided, otherwise compute it ourselves.
 * There are four ways to call this function, depending on what data is
 * available to the caller:
 * Method 1:
 * a = text1, b = text2
 * Method 2:
 * a = diffs
 * Method 3 (optimal):
 * a = text1, b = diffs
 * Method 4 (deprecated, use method 3):
 * a = text1, b = text2, c = diffs
 *
 * @param {string|!Array.<!diff_match_patch.Diff>} a text1 (methods 1,3,4) or
 * Array of diff tuples for text1 to text2 (method 2).
 * @param {string|!Array.<!diff_match_patch.Diff>} opt_b text2 (methods 1,4) or
 * Array of diff tuples for text1 to text2 (method 3) or undefined (method 2).
 * @param {string|!Array.<!diff_match_patch.Diff>} opt_c Array of diff tuples
 * for text1 to text2 (method 4) or undefined (methods 1,2,3).
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 */
diff_match_patch.prototype.patch_make = function(a, opt_b, opt_c) {
  var text1, diffs;
  if (typeof a == 'string' && typeof opt_b == 'string' &&
      typeof opt_c == 'undefined') {
    // Method 1: text1, text2
    // Compute diffs from text1 and text2.
    text1 = /** @type {string} */(a);
    diffs = this.diff_main(text1, /** @type {string} */(opt_b), true);
    if (diffs.length > 2) {
      this.diff_cleanupSemantic(diffs);
      this.diff_cleanupEfficiency(diffs);
    }
  } else if (a && typeof a == 'object' && typeof opt_b == 'undefined' &&
      typeof opt_c == 'undefined') {
    // Method 2: diffs
    // Compute text1 from diffs.
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(a);
    text1 = this.diff_text1(diffs);
  } else if (typeof a == 'string' && opt_b && typeof opt_b == 'object' &&
      typeof opt_c == 'undefined') {
    // Method 3: text1, diffs
    text1 = /** @type {string} */(a);
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(opt_b);
  } else if (typeof a == 'string' && typeof opt_b == 'string' &&
      opt_c && typeof opt_c == 'object') {
    // Method 4: text1, text2, diffs
    // text2 is not used.
    text1 = /** @type {string} */(a);
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(opt_c);
  } else {
    throw new Error('Unknown call format to patch_make.');
  }

  if (diffs.length === 0) {
    return [];  // Get rid of the null case.
  }
  var patches = [];
  var patch = new diff_match_patch.patch_obj();
  var patchDiffLength = 0;  // Keeping our own length var is faster in JS.
  var char_count1 = 0;  // Number of characters into the text1 string.
  var char_count2 = 0;  // Number of characters into the text2 string.
  // Start with text1 (prepatch_text) and apply the diffs until we arrive at
  // text2 (postpatch_text).  We recreate the patches one by one to determine
  // context info.
  var prepatch_text = text1;
  var postpatch_text = text1;
  for (var x = 0; x < diffs.length; x++) {
    var diff_type = diffs[x][0];
    var diff_text = diffs[x][1];

    if (!patchDiffLength && diff_type !== DIFF_EQUAL) {
      // A new patch starts here.
      patch.start1 = char_count1;
      patch.start2 = char_count2;
    }

    switch (diff_type) {
      case DIFF_INSERT:
        patch.diffs[patchDiffLength++] = diffs[x];
        patch.length2 += diff_text.length;
        postpatch_text = postpatch_text.substring(0, char_count2) + diff_text +
                         postpatch_text.substring(char_count2);
        break;
      case DIFF_DELETE:
        patch.length1 += diff_text.length;
        patch.diffs[patchDiffLength++] = diffs[x];
        postpatch_text = postpatch_text.substring(0, char_count2) +
                         postpatch_text.substring(char_count2 +
                             diff_text.length);
        break;
      case DIFF_EQUAL:
        if (diff_text.length <= 2 * this.Patch_Margin &&
            patchDiffLength && diffs.length != x + 1) {
          // Small equality inside a patch.
          patch.diffs[patchDiffLength++] = diffs[x];
          patch.length1 += diff_text.length;
          patch.length2 += diff_text.length;
        } else if (diff_text.length >= 2 * this.Patch_Margin) {
          // Time for a new patch.
          if (patchDiffLength) {
            this.patch_addContext_(patch, prepatch_text);
            patches.push(patch);
            patch = new diff_match_patch.patch_obj();
            patchDiffLength = 0;
            // Unlike Unidiff, our patch lists have a rolling context.
            // http://code.google.com/p/google-diff-match-patch/wiki/Unidiff
            // Update prepatch text & pos to reflect the application of the
            // just completed patch.
            prepatch_text = postpatch_text;
            char_count1 = char_count2;
          }
        }
        break;
    }

    // Update the current character count.
    if (diff_type !== DIFF_INSERT) {
      char_count1 += diff_text.length;
    }
    if (diff_type !== DIFF_DELETE) {
      char_count2 += diff_text.length;
    }
  }
  // Pick up the leftover patch if not empty.
  if (patchDiffLength) {
    this.patch_addContext_(patch, prepatch_text);
    patches.push(patch);
  }

  return patches;
};


/**
 * Given an array of patches, return another array that is identical.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 */
diff_match_patch.prototype.patch_deepCopy = function(patches) {
  // Making deep copies is hard in JavaScript.
  var patchesCopy = [];
  for (var x = 0; x < patches.length; x++) {
    var patch = patches[x];
    var patchCopy = new diff_match_patch.patch_obj();
    patchCopy.diffs = [];
    for (var y = 0; y < patch.diffs.length; y++) {
      patchCopy.diffs[y] = patch.diffs[y].slice();
    }
    patchCopy.start1 = patch.start1;
    patchCopy.start2 = patch.start2;
    patchCopy.length1 = patch.length1;
    patchCopy.length2 = patch.length2;
    patchesCopy[x] = patchCopy;
  }
  return patchesCopy;
};


/**
 * Merge a set of patches onto the text.  Return a patched text, as well
 * as a list of true/false values indicating which patches were applied.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @param {string} text Old text.
 * @return {!Array.<string|!Array.<boolean>>} Two element Array, containing the
 *      new text and an array of boolean values.
 */
diff_match_patch.prototype.patch_apply = function(patches, text) {
  if (patches.length == 0) {
    return [text, []];
  }

  // Deep copy the patches so that no changes are made to originals.
  patches = this.patch_deepCopy(patches);

  var nullPadding = this.patch_addPadding(patches);
  text = nullPadding + text + nullPadding;

  this.patch_splitMax(patches);
  // delta keeps track of the offset between the expected and actual location
  // of the previous patch.  If there are patches expected at positions 10 and
  // 20, but the first patch was found at 12, delta is 2 and the second patch
  // has an effective expected position of 22.
  var delta = 0;
  var results = [];
  for (var x = 0; x < patches.length; x++) {
    var expected_loc = patches[x].start2 + delta;
    var text1 = this.diff_text1(patches[x].diffs);
    var start_loc;
    var end_loc = -1;
    if (text1.length > this.Match_MaxBits) {
      // patch_splitMax will only provide an oversized pattern in the case of
      // a monster delete.
      start_loc = this.match_main(text, text1.substring(0, this.Match_MaxBits),
                                  expected_loc);
      if (start_loc != -1) {
        end_loc = this.match_main(text,
            text1.substring(text1.length - this.Match_MaxBits),
            expected_loc + text1.length - this.Match_MaxBits);
        if (end_loc == -1 || start_loc >= end_loc) {
          // Can't find valid trailing context.  Drop this patch.
          start_loc = -1;
        }
      }
    } else {
      start_loc = this.match_main(text, text1, expected_loc);
    }
    if (start_loc == -1) {
      // No match found.  :(
      results[x] = false;
      // Subtract the delta for this failed patch from subsequent patches.
      delta -= patches[x].length2 - patches[x].length1;
    } else {
      // Found a match.  :)
      results[x] = true;
      delta = start_loc - expected_loc;
      var text2;
      if (end_loc == -1) {
        text2 = text.substring(start_loc, start_loc + text1.length);
      } else {
        text2 = text.substring(start_loc, end_loc + this.Match_MaxBits);
      }
      if (text1 == text2) {
        // Perfect match, just shove the replacement text in.
        text = text.substring(0, start_loc) +
               this.diff_text2(patches[x].diffs) +
               text.substring(start_loc + text1.length);
      } else {
        // Imperfect match.  Run a diff to get a framework of equivalent
        // indices.
        var diffs = this.diff_main(text1, text2, false);
        if (text1.length > this.Match_MaxBits &&
            this.diff_levenshtein(diffs) / text1.length >
            this.Patch_DeleteThreshold) {
          // The end points match, but the content is unacceptably bad.
          results[x] = false;
        } else {
          this.diff_cleanupSemanticLossless(diffs);
          var index1 = 0;
          var index2;
          for (var y = 0; y < patches[x].diffs.length; y++) {
            var mod = patches[x].diffs[y];
            if (mod[0] !== DIFF_EQUAL) {
              index2 = this.diff_xIndex(diffs, index1);
            }
            if (mod[0] === DIFF_INSERT) {  // Insertion
              text = text.substring(0, start_loc + index2) + mod[1] +
                     text.substring(start_loc + index2);
            } else if (mod[0] === DIFF_DELETE) {  // Deletion
              text = text.substring(0, start_loc + index2) +
                     text.substring(start_loc + this.diff_xIndex(diffs,
                         index1 + mod[1].length));
            }
            if (mod[0] !== DIFF_DELETE) {
              index1 += mod[1].length;
            }
          }
        }
      }
    }
  }
  // Strip the padding off.
  text = text.substring(nullPadding.length, text.length - nullPadding.length);
  return [text, results];
};


/**
 * Add some padding on text start and end so that edges can match something.
 * Intended to be called only from within patch_apply.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {string} The padding string added to each side.
 */
diff_match_patch.prototype.patch_addPadding = function(patches) {
  var paddingLength = this.Patch_Margin;
  var nullPadding = '';
  for (var x = 1; x <= paddingLength; x++) {
    nullPadding += String.fromCharCode(x);
  }

  // Bump all the patches forward.
  for (var x = 0; x < patches.length; x++) {
    patches[x].start1 += paddingLength;
    patches[x].start2 += paddingLength;
  }

  // Add some padding on start of first diff.
  var patch = patches[0];
  var diffs = patch.diffs;
  if (diffs.length == 0 || diffs[0][0] != DIFF_EQUAL) {
    // Add nullPadding equality.
    diffs.unshift([DIFF_EQUAL, nullPadding]);
    patch.start1 -= paddingLength;  // Should be 0.
    patch.start2 -= paddingLength;  // Should be 0.
    patch.length1 += paddingLength;
    patch.length2 += paddingLength;
  } else if (paddingLength > diffs[0][1].length) {
    // Grow first equality.
    var extraLength = paddingLength - diffs[0][1].length;
    diffs[0][1] = nullPadding.substring(diffs[0][1].length) + diffs[0][1];
    patch.start1 -= extraLength;
    patch.start2 -= extraLength;
    patch.length1 += extraLength;
    patch.length2 += extraLength;
  }

  // Add some padding on end of last diff.
  patch = patches[patches.length - 1];
  diffs = patch.diffs;
  if (diffs.length == 0 || diffs[diffs.length - 1][0] != DIFF_EQUAL) {
    // Add nullPadding equality.
    diffs.push([DIFF_EQUAL, nullPadding]);
    patch.length1 += paddingLength;
    patch.length2 += paddingLength;
  } else if (paddingLength > diffs[diffs.length - 1][1].length) {
    // Grow last equality.
    var extraLength = paddingLength - diffs[diffs.length - 1][1].length;
    diffs[diffs.length - 1][1] += nullPadding.substring(0, extraLength);
    patch.length1 += extraLength;
    patch.length2 += extraLength;
  }

  return nullPadding;
};


/**
 * Look through the patches and break up any which are longer than the maximum
 * limit of the match algorithm.
 * Intended to be called only from within patch_apply.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 */
diff_match_patch.prototype.patch_splitMax = function(patches) {
  var patch_size = this.Match_MaxBits;
  for (var x = 0; x < patches.length; x++) {
    if (patches[x].length1 <= patch_size) {
      continue;
    }
    var bigpatch = patches[x];
    // Remove the big old patch.
    patches.splice(x--, 1);
    var start1 = bigpatch.start1;
    var start2 = bigpatch.start2;
    var precontext = '';
    while (bigpatch.diffs.length !== 0) {
      // Create one of several smaller patches.
      var patch = new diff_match_patch.patch_obj();
      var empty = true;
      patch.start1 = start1 - precontext.length;
      patch.start2 = start2 - precontext.length;
      if (precontext !== '') {
        patch.length1 = patch.length2 = precontext.length;
        patch.diffs.push([DIFF_EQUAL, precontext]);
      }
      while (bigpatch.diffs.length !== 0 &&
             patch.length1 < patch_size - this.Patch_Margin) {
        var diff_type = bigpatch.diffs[0][0];
        var diff_text = bigpatch.diffs[0][1];
        if (diff_type === DIFF_INSERT) {
          // Insertions are harmless.
          patch.length2 += diff_text.length;
          start2 += diff_text.length;
          patch.diffs.push(bigpatch.diffs.shift());
          empty = false;
        } else if (diff_type === DIFF_DELETE && patch.diffs.length == 1 &&
                   patch.diffs[0][0] == DIFF_EQUAL &&
                   diff_text.length > 2 * patch_size) {
          // This is a large deletion.  Let it pass in one chunk.
          patch.length1 += diff_text.length;
          start1 += diff_text.length;
          empty = false;
          patch.diffs.push([diff_type, diff_text]);
          bigpatch.diffs.shift();
        } else {
          // Deletion or equality.  Only take as much as we can stomach.
          diff_text = diff_text.substring(0,
              patch_size - patch.length1 - this.Patch_Margin);
          patch.length1 += diff_text.length;
          start1 += diff_text.length;
          if (diff_type === DIFF_EQUAL) {
            patch.length2 += diff_text.length;
            start2 += diff_text.length;
          } else {
            empty = false;
          }
          patch.diffs.push([diff_type, diff_text]);
          if (diff_text == bigpatch.diffs[0][1]) {
            bigpatch.diffs.shift();
          } else {
            bigpatch.diffs[0][1] =
                bigpatch.diffs[0][1].substring(diff_text.length);
          }
        }
      }
      // Compute the head context for the next patch.
      precontext = this.diff_text2(patch.diffs);
      precontext =
          precontext.substring(precontext.length - this.Patch_Margin);
      // Append the end context for this patch.
      var postcontext = this.diff_text1(bigpatch.diffs)
                            .substring(0, this.Patch_Margin);
      if (postcontext !== '') {
        patch.length1 += postcontext.length;
        patch.length2 += postcontext.length;
        if (patch.diffs.length !== 0 &&
            patch.diffs[patch.diffs.length - 1][0] === DIFF_EQUAL) {
          patch.diffs[patch.diffs.length - 1][1] += postcontext;
        } else {
          patch.diffs.push([DIFF_EQUAL, postcontext]);
        }
      }
      if (!empty) {
        patches.splice(++x, 0, patch);
      }
    }
  }
};


/**
 * Take a list of patches and return a textual representation.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {string} Text representation of patches.
 */
diff_match_patch.prototype.patch_toText = function(patches) {
  var text = [];
  for (var x = 0; x < patches.length; x++) {
    text[x] = patches[x];
  }
  return text.join('');
};


/**
 * Parse a textual representation of patches and return a list of Patch objects.
 * @param {string} textline Text representation of patches.
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 * @throws {!Error} If invalid input.
 */
diff_match_patch.prototype.patch_fromText = function(textline) {
  var patches = [];
  if (!textline) {
    return patches;
  }
  var text = textline.split('\n');
  var textPointer = 0;
  var patchHeader = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;
  while (textPointer < text.length) {
    var m = text[textPointer].match(patchHeader);
    if (!m) {
      throw new Error('Invalid patch string: ' + text[textPointer]);
    }
    var patch = new diff_match_patch.patch_obj();
    patches.push(patch);
    patch.start1 = parseInt(m[1], 10);
    if (m[2] === '') {
      patch.start1--;
      patch.length1 = 1;
    } else if (m[2] == '0') {
      patch.length1 = 0;
    } else {
      patch.start1--;
      patch.length1 = parseInt(m[2], 10);
    }

    patch.start2 = parseInt(m[3], 10);
    if (m[4] === '') {
      patch.start2--;
      patch.length2 = 1;
    } else if (m[4] == '0') {
      patch.length2 = 0;
    } else {
      patch.start2--;
      patch.length2 = parseInt(m[4], 10);
    }
    textPointer++;

    while (textPointer < text.length) {
      var sign = text[textPointer].charAt(0);
      try {
        var line = decodeURI(text[textPointer].substring(1));
      } catch (ex) {
        // Malformed URI sequence.
        throw new Error('Illegal escape in patch_fromText: ' + line);
      }
      if (sign == '-') {
        // Deletion.
        patch.diffs.push([DIFF_DELETE, line]);
      } else if (sign == '+') {
        // Insertion.
        patch.diffs.push([DIFF_INSERT, line]);
      } else if (sign == ' ') {
        // Minor equality.
        patch.diffs.push([DIFF_EQUAL, line]);
      } else if (sign == '@') {
        // Start of next patch.
        break;
      } else if (sign === '') {
        // Blank line?  Whatever.
      } else {
        // WTF?
        throw new Error('Invalid patch mode "' + sign + '" in: ' + line);
      }
      textPointer++;
    }
  }
  return patches;
};


/**
 * Class representing one patch operation.
 * @constructor
 */
diff_match_patch.patch_obj = function() {
  /** @type {!Array.<!diff_match_patch.Diff>} */
  this.diffs = [];
  /** @type {?number} */
  this.start1 = null;
  /** @type {?number} */
  this.start2 = null;
  /** @type {number} */
  this.length1 = 0;
  /** @type {number} */
  this.length2 = 0;
};


/**
 * Emmulate GNU diff's format.
 * Header: @@ -382,8 +481,9 @@
 * Indicies are printed as 1-based, not 0-based.
 * @return {string} The GNU diff string.
 */
diff_match_patch.patch_obj.prototype.toString = function() {
  var coords1, coords2;
  if (this.length1 === 0) {
    coords1 = this.start1 + ',0';
  } else if (this.length1 == 1) {
    coords1 = this.start1 + 1;
  } else {
    coords1 = (this.start1 + 1) + ',' + this.length1;
  }
  if (this.length2 === 0) {
    coords2 = this.start2 + ',0';
  } else if (this.length2 == 1) {
    coords2 = this.start2 + 1;
  } else {
    coords2 = (this.start2 + 1) + ',' + this.length2;
  }
  var text = ['@@ -' + coords1 + ' +' + coords2 + ' @@\n'];
  var op;
  // Escape the body of the patch with %xx notation.
  for (var x = 0; x < this.diffs.length; x++) {
    switch (this.diffs[x][0]) {
      case DIFF_INSERT:
        op = '+';
        break;
      case DIFF_DELETE:
        op = '-';
        break;
      case DIFF_EQUAL:
        op = ' ';
        break;
    }
    text[x + 1] = op + encodeURI(this.diffs[x][1]) + '\n';
  }
  return text.join('').replace(/%20/g, ' ');
};


// The following export code was added by @ForbesLindesay
module.exports = diff_match_patch;
module.exports['diff_match_patch'] = diff_match_patch;
module.exports['DIFF_DELETE'] = DIFF_DELETE;
module.exports['DIFF_INSERT'] = DIFF_INSERT;
module.exports['DIFF_EQUAL'] = DIFF_EQUAL;
});

const dmp = new index$1();

function makePatches (oldContent, newContent) {
  return dmp.patch_make(oldContent, newContent)
}
function applyPatches (patches, content) {
  return dmp.patch_apply(patches, content)[0]
}
function reversePatches (patches) {
  patches = dmp.patch_deepCopy(patches).reverse();
  patches.forEach((patch) => {
    patch.diffs.forEach((diff) => {
      diff[0] = -diff[0];
    });
  });
  return patches
}

class Undo {
  constructor (initialState, stateChange) {
    this.undoStack = [];
    this.currentPatches = [];
    this.redoStack = [];

    this.stringify = typeof initialState !== 'string';
    this.currentStateText = JSON.stringify(initialState);
    this.currentState = JSON.parse(this.currentStateText);
    this.stateChange = typeof stateChange === 'function' ? stateChange : function () {};

    this.undoMax = 50;
  }

  undo () {
    const patches = this.undoStack.pop();
    if (!patches) {
      return
    }
    this.redoStack.push(this.currentPatches);
    this.currentPatches = patches;
    this.restoreState();
    return this.currentState
  }
  redo () {
    const patches = this.redoStack.pop();
    if (!patches) {
      return
    }
    this.undoStack.push(this.currentPatches);
    this.currentPatches = patches;
    this.restoreState(true);
    return this.currentState
  }

  saveState (newState, typing) {
    let currentTime, lastTime;

    const newStateText = JSON.stringify(newState);
    const currentStateText = this.currentStateText = JSON.stringify(this.currentState);

    return new Promise((resolve, reject) => {
      console.log('saveState', currentStateText !== newStateText, makePatches(currentStateText, newStateText));
      if (currentStateText !== newStateText) {
        this.redoStack.length = 0;

        currentTime = Date.now();
        if (!typing || (typing && currentTime - lastTime > 1000)) {
          this.undoStack.push(makePatches(currentStateText, newStateText));
          while (this.undoStack.length > this.undoMax) {
            this.undoStack.shift();
          }
        }

        this.currentState = JSON.parse(newStateText);
        lastTime = currentTime;
        this.stateChange();
      }
    })
  }

  restoreState (isForward) {
    if (!isForward) {
      this.currentPatches = reversePatches(this.currentPatches);
    }

    const newState = applyPatches(this.currentPatches, this.currentStateText);
    this.currentState = JSON.parse(newState);
    this.stateChange();
  }
}

/*
console.log(
  JSON.stringify(JSON.parse(
    JSON.stringify(webcolor).toLowerCase()
  ), null, 2).replace(/"(\w+)": "(#\w+)",?/g, `$1: '$2',`)
)
*/
// http://htmlcolorcodes.com/color-names/
const webcolor = [ // eslint-disable-line
  // Red HTML Color Names
  ['#CD5C5C', 'IndianRed'],
  ['#F08080', 'LightCoral'],
  ['#FA8072', 'Salmon'],
  ['#E9967A', 'DarkSalmon'],
  ['#FFA07A', 'LightSalmon'],
  ['#DC143C', 'Crimson'],
  ['#FF0000', 'Red'],
  ['#B22222', 'FireBrick'],
  ['#8B0000', 'DarkRed'],
  // Pink HTML Color Names
  ['#FFC0CB', 'Pink'],
  ['#FFB6C1', 'LightPink'],
  ['#FF69B4', 'HotPink'],
  ['#FF1493', 'DeepPink'],
  ['#C71585', 'MediumVioletRed'],
  ['#DB7093', 'PaleVioletRed'],
  // Orange HTML Color Names
  ['#FF7F50', 'Coral'],
  ['#FF6347', 'Tomato'],
  ['#FF4500', 'OrangeRed'],
  ['#FF8C00', 'DarkOrange'],
  ['#FFA500', 'Orange'],
  // Yellow HTML Color Names
  ['#FFD700', 'Gold'],
  ['#FFFF00', 'Yellow'],
  ['#FFFFE0', 'LightYellow'],
  ['#FFFACD', 'LemonChiffon'],
  ['#FAFAD2', 'LightGoldenrodYellow'],
  ['#FFEFD5', 'PapayaWhip'],
  ['#FFE4B5', 'Moccasin'],
  ['#FFDAB9', 'PeachPuff'],
  ['#EEE8AA', 'PaleGoldenrod'],
  ['#F0E68C', 'Khaki'],
  ['#BDB76B', 'DarkKhaki'],
  // Purple HTML Color Names
  ['#E6E6FA', 'Lavender'],
  ['#D8BFD8', 'Thistle'],
  ['#DDA0DD', 'Plum'],
  ['#EE82EE', 'Violet'],
  ['#DA70D6', 'Orchid'],
  ['#FF00FF', 'Fuchsia'],
  ['#FF00FF', 'Magenta'],
  ['#BA55D3', 'MediumOrchid'],
  ['#9370DB', 'MediumPurple'],
  ['#663399', 'RebeccaPurple'],
  ['#8A2BE2', 'BlueViolet'],
  ['#9400D3', 'DarkViolet'],
  ['#9932CC', 'DarkOrchid'],
  ['#8B008B', 'DarkMagenta'],
  ['#800080', 'Purple'],
  ['#4B0082', 'Indigo'],
  ['#6A5ACD', 'SlateBlue'],
  ['#483D8B', 'DarkSlateBlue'],
  ['#7B68EE', 'MediumSlateBlue'],
  // Green HTML Color Names
  ['#ADFF2F', 'GreenYellow'],
  ['#7FFF00', 'Chartreuse'],
  ['#7CFC00', 'LawnGreen'],
  ['#00FF00', 'Lime'],
  ['#32CD32', 'LimeGreen'],
  ['#98FB98', 'PaleGreen'],
  ['#90EE90', 'LightGreen'],
  ['#00FA9A', 'MediumSpringGreen'],
  ['#00FF7F', 'SpringGreen'],
  ['#3CB371', 'MediumSeaGreen'],
  ['#2E8B57', 'SeaGreen'],
  ['#228B22', 'ForestGreen'],
  ['#008000', 'Green'],
  ['#006400', 'DarkGreen'],
  ['#9ACD32', 'YellowGreen'],
  ['#6B8E23', 'OliveDrab'],
  ['#808000', 'Olive'],
  ['#556B2F', 'DarkOliveGreen'],
  ['#66CDAA', 'MediumAquamarine'],
  ['#8FBC8B', 'DarkSeaGreen'],
  ['#20B2AA', 'LightSeaGreen'],
  ['#008B8B', 'DarkCyan'],
  ['#008080', 'Teal'],
  // Blue HTML Color Names
  ['#00FFFF', 'Aqua'],
  ['#00FFFF', 'Cyan'],
  ['#E0FFFF', 'LightCyan'],
  ['#AFEEEE', 'PaleTurquoise'],
  ['#7FFFD4', 'Aquamarine'],
  ['#40E0D0', 'Turquoise'],
  ['#48D1CC', 'MediumTurquoise'],
  ['#00CED1', 'DarkTurquoise'],
  ['#5F9EA0', 'CadetBlue'],
  ['#4682B4', 'SteelBlue'],
  ['#B0C4DE', 'LightSteelBlue'],
  ['#B0E0E6', 'PowderBlue'],
  ['#ADD8E6', 'LightBlue'],
  ['#87CEEB', 'SkyBlue'],
  ['#87CEFA', 'LightSkyBlue'],
  ['#00BFFF', 'DeepSkyBlue'],
  ['#1E90FF', 'DodgerBlue'],
  ['#6495ED', 'CornflowerBlue'],
  ['#4169E1', 'RoyalBlue'],
  ['#0000FF', 'Blue'],
  ['#0000CD', 'MediumBlue'],
  ['#00008B', 'DarkBlue'],
  ['#000080', 'Navy'],
  ['#191970', 'MidnightBlue'],
  // Brown HTML Color Names
  ['#FFF8DC', 'Cornsilk'],
  ['#FFEBCD', 'BlanchedAlmond'],
  ['#FFE4C4', 'Bisque'],
  ['#FFDEAD', 'NavajoWhite'],
  ['#F5DEB3', 'Wheat'],
  ['#DEB887', 'BurlyWood'],
  ['#D2B48C', 'Tan'],
  ['#BC8F8F', 'RosyBrown'],
  ['#F4A460', 'SandyBrown'],
  ['#DAA520', 'Goldenrod'],
  ['#B8860B', 'DarkGoldenrod'],
  ['#CD853F', 'Peru'],
  ['#D2691E', 'Chocolate'],
  ['#8B4513', 'SaddleBrown'],
  ['#A0522D', 'Sienna'],
  ['#A52A2A', 'Brown'],
  ['#800000', 'Maroon'],
  // White HTML Color Names
  ['#FFFFFF', 'White'],
  ['#FFFAFA', 'Snow'],
  ['#F0FFF0', 'HoneyDew'],
  ['#F5FFFA', 'MintCream'],
  ['#F0FFFF', 'Azure'],
  ['#F0F8FF', 'AliceBlue'],
  ['#F8F8FF', 'GhostWhite'],
  ['#F5F5F5', 'WhiteSmoke'],
  ['#FFF5EE', 'SeaShell'],
  ['#F5F5DC', 'Beige'],
  ['#FDF5E6', 'OldLace'],
  ['#FFFAF0', 'FloralWhite'],
  ['#FFFFF0', 'Ivory'],
  ['#FAEBD7', 'AntiqueWhite'],
  ['#FAF0E6', 'Linen'],
  ['#FFF0F5', 'LavenderBlush'],
  ['#FFE4E1', 'MistyRose'],
  // Gray HTML Color Names
  ['#DCDCDC', 'Gainsboro'],
  ['#D3D3D3', 'LightGray'],
  ['#C0C0C0', 'Silver'],
  ['#A9A9A9', 'DarkGray'],
  ['#808080', 'Gray'],
  ['#696969', 'DimGray'],
  ['#778899', 'LightSlateGray'],
  ['#708090', 'SlateGray'],
  ['#2F4F4F', 'DarkSlateGray'],
  ['#000000', 'Black'],
];

/* eslint camelcase:0, no-cond-assign:0  */
const MAX = { r: 255, g: 255, b: 255, h: 360, s: 100, l: 100 };
const RGB_HSL_KEYS = [['r', 'g', 'b'], ['red', 'green', 'blue'], ['h', 's', 'l'], ['hue', 'saturation', 'lightness']];

const round = Math.round;
const abs = Math.abs;
const mMin = Math.min;
const mMax = Math.max;
const floor = Math.floor;


function hueModi (h) {
  while (h < 0) h += 360;
  return h % 360
}

function clamp (n, max, min) {
  return mMax(min || 0, mMin(n, max))
}

function clamp01 (n) {
  return mMax(0, mMin(n, 1))
}

function regReplace (main, obj, space) {
  let source = main.source;
  for (let key in obj) {
    const objsource = obj[key].source.replace(/^\^|\$$/, '');
    source = source.replace(new RegExp(key, 'g'), objsource);
  }
  if (space) {
    source = source.replace(new RegExp(' ', 'g'), '\\s*');
  }
  return new RegExp(source, main.toString().match(/[gimuy]*$/)[0])
}

const parsers = (function () {
  const N255 = /^(?:25[0-5]|2[0-4]\d|1\d\d|\d?\d)$/, // 0~255
        hue = /^(?:[-+]\d+)$/, // degree
        per = /^(?:100%|\d?\d%)$/, // 0%~100%
        alpha = /^(?:0|0?\.\d+|1(?:\.0*)?)$/, // 0~1
        rgbNum = regReplace(/^(?:N255|per)$/, {N255, per});

  const regs = {
    rgb: /rgb\((rgbNum), (rgbNum), (rgbNum)\)/,
    rgba: /rgba\((rgbNum), (rgbNum), (rgbNum), (alpha)\)/,
    hsl: /hsl\((hue), (per), (per)\)/,
    hsla: /hsla\((hue), (per), (per), (alpha)\)/,
    hsv: /hsv\((hue), (per), (per)\)/,
    hsva: /hsva\((hue), (per), (per), (alpha)\)/
  };
  for (let key in regs) {
    regs[key] = regReplace(regs[key], {rgbNum, hue, per, alpha}, true);
  }

  return Object.assign(regs, {
    N255,
    hue,
    per,
    alpha,
    rgbNum,
    hex3: /^#?([\da-fA-F]{1})([\da-fA-F]{1})([\da-fA-F]{1})$/,
    hex4: /^#?([\da-fA-F]{1})([\da-fA-F]{1})([\da-fA-F]{1})([\da-fA-F]{1})$/,
    hex6: /^#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/,
    hex8: /^#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/
  })
})();

function string2object (text) {
  text = text.trim().toLowerCase();

  if (text === 'transparent') {
    return {r: 0, g: 0, b: 0, a: 0, format: 'name'}
  }

  // color functions. [rgb, rgba, hsl, hsla, hsv, hsva]
  const fns = Object.keys(parsers);
  for (let i = 0; i < 6; i++) {
    const key = fns[i],
          reg = parsers[key],
          match = reg.exec(text);

    if (match) {
      const obj = {};
      for (let j = 0; j < key.length; j++) {
        obj[key[j]] = match[j + 1];
      }
      return obj
    }
  }

  // color hex. [hex8, hex6, hex4, hex3]
  const hexs = fns.reverse();
  for (let i = 0; i < 4; i++) {
    const key = hexs[i],
          reg = parsers[key],
          match = reg.exec(text);

    if (match) {
      let rgb = match.slice(1, 4).map(n => {
        if (i > 1) {
          n += n;
        }
        return parseInt(n, 16)
      });

      const obj = {};
      for (let j = 0; j < 3; j++) {
        obj['rgb'[j]] = rgb[j];
      }

      if (match[4]) {
        obj.a = parseInt(match[4], 16) / 255;
      }

      return obj
    }
  }

  throw new Error(`Invalid arguments text`)
}

/**
 * RGB & RGBA & HSL & HSLA
 *
 * @class ColorParams
 * @extends {Array}
 */
class ColorParams extends Array {
  /**
   * Creates an instance of ColorParams.
   *
   * @param {string} type
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} a
   *
   * @memberOf ColorParams
   */
  constructor (type, r, g, b, a) {
    // create empty Array
    super();
    this.type = type;
    for (let i = 0; i < 3; i++) {
      const chara = type.charAt(i);
      Object.defineProperty(this, chara, {
        get () {
          return this[i]
        },
        set (val) {
          if (chara === 'h') {
            val = hueModi(val);
          }
          this[i] = clamp(round(val), MAX[chara]);
        }
      });
      // set init value
      const arg = arguments[i + 1];
      this[chara] = typeof arg === 'number' ? arg : r[chara] || r[i] || 0;
    }
    // set alpha
    if (type.charAt(3)) {
      Object.defineProperty(this, 'a', {
        get () {
          return this[3]
        },
        set (val) {
          this[3] = clamp01(val);
        }
      });
      // set init value
      this.a = a || r.a || r[3] || g || 1;
    }
  }
  // @returns css string
  toString () {
    const a = this.a == null ? ')' : `, ${this[3]})`;
    const percent = this.type.startsWith('hsl') ? '%' : '';
    return this.type + `(${this[0]}, ${this[1] + percent}, ${this[2] + percent}` + a
  }
}

/**
 * Color
 *
 * @export
 * @class Color
 * @see https://github.com/carloscabo/colz/blob/master/public/js/colz.class.js#L72
 */
class Color {
  constructor (param, g, b, a) {
    RGB_HSL_KEYS.forEach((keys, i) => {
      keys.forEach((key, j) => {
        Object.defineProperty(this, key, {
          get () {
            return round(i < 2 ? this.rgb[j] : this.hsl[j])
          },
          set (val) {
            if (i < 2) {
              this.rgb[key[0]] = val;
              this.setParams(this.rgb, rgb2hsl(...this.rgb));
            } else {
              this.hsl[key[0]] = val;
              this.setParams(hsl2rgb(...this.hsl), this.hsl);
            }
            this.hex = rgb2hex(this.rgb);
          }
        });
      });
    });
    this.setColor(param, g, b, a, true);
  }

  setColor (param, g, b, a, init) {
    if (!init && param instanceof Color) return param
    this.a = 1;
    let rgb, hsl;

    switch ({}.toString.call(param).slice(8, -1)) {
      case 'String':
        let result;
        if (result = hex2rgb(param)) {
          // hex #000
          rgb = result;
          if (param.charAt(0) !== '#') param = '#' + param;
          this.hex = param;
        } else if (result = /^(rgb|hsl)a?\((\d{1,3})(%?), ?(\d{1,3})(%?), ?(\d{1,3})(%?)(?:, ?(0|1|0?\.\d{1,2}))?\)$/.exec(param)) {
          const data = [+result[2], +result[4], +result[6]];
          const percent = result[3] + result[5] + result[7];
          if (result[1] === 'rgb') {
            if (percent === '%%%') {
              // %を処理
              rgb = data.map(h => floor(h / 100 * 255));
            } else if (!percent) {
              rgb = data;
            } else {
              throw new Error("ERROR! Don't mix up integer and percentage notation. 整数と割合を混在しないでください")
            }
          } else if (result[1] === 'hsl' && percent === '%%') {
            hsl = data;
          }
          if (result[8]) this.a = +('0' + result[8]);
        } else if (this.hex = (webcolor.find((arg) => new RegExp(`^${param}$`, 'i').test(arg[1])) || [null, ''])[0]) {
          rgb = hex2rgb(this.hex);
        } else {
          throw new Error('ERROR! Color string ' + param)
        }
        break
      case 'Number':
        if (typeof g === 'number' && typeof b === 'number') {
          rgb = [param, g, b];
        } else if (g == null && b == null) {
          hsl = [param, 100, 50];
        }
        break
      case 'Array':
        rgb = param;
        break
      case 'Object':
        if (param instanceof Color) {
          rgb = hex2rgb(param.hex);
        } else if (typeof param.r === 'number' && typeof param.g === 'number' && typeof param.b === 'number') {
          rgb = [param.r, param.g, param.b];
        } else if (typeof param.h === 'number' && typeof param.s === 'number' && typeof param.l === 'number') {
          hsl = [param.h, param.s, param.l];
        }
        if (typeof param.a === 'number') {
          this.a = param.a;
        }
        break
      case 'Undefined':
      case 'Null':
        this.hex = randomHex();
        rgb = hex2rgb(this.hex);
        break
      default:
        throw new TypeError('new Color arguments ERROR!' + arguments)
    }

    if (!hsl) {
      hsl = rgb2hsl(rgb);
    }
    if (!rgb) {
      rgb = hsl2rgb(hsl);
    }

    this.hsv = rgb2hsv(rgb);

    this.setParams(rgb, hsl);
    return this
  }

  setParams (rgb, hsl) {
    this.rgb = new ColorParams('rgb', ...rgb);
    this.rgba = new ColorParams('rgba', ...rgb, this.a);
    this.hsl = new ColorParams('hsl', ...hsl);
    this.hsla = new ColorParams('hsla', ...hsl, this.a);
    if (!this.hex) {
      this.toHex();
    }
  }

  getNearWebColor (score, hex) {
    const [color, name] = nearName(this.hex);
    return color ? name : hex ? this.hex : ''
  }

  findColorName (colorlist) {
    return (colorlist.find((arg) => arg[0] === this.hex.toUpperCase()) || [0, ''])[1]
  }
  /**
   * hsl変換を経由することで安定したHEXを出力する
   */
  toHex () {
    return (this.hex = rgb2hex(hsl2rgb(this.hsl)))
  }

  toString () {
    return this.hex
  }
  toJSON () {
    return this.hex
  }
}

Color.webcolor = webcolor;

/**
 * colorlistの内からhexに一番近いデータと返す
 *
 * @export
 * @param {string} hex
 * @param {array}  colorlist [colorlist=webcolor]
 * @returns {array}  [_hex, name, _rgb, _score]
 */
function nearName (hex, colorlist = webcolor) {
  const rgb = hex2rgb(hex);
  let nearest = [];
  let minscore = Infinity;

  colorlist.forEach(([_hex, name]) => {
    const _rgb = hex2rgb(_hex);
    const score = _rgb.reduce((p, c, i) => p + abs(rgb[i] - c), 0);
    if (minscore > score) {
      minscore = score;
      nearest = [[_hex, name, _rgb, score]];
    } else if (minscore === score) {
      minscore = score;
      nearest.push([_hex, name, _rgb, score]);
    }
  });
  if (nearest.length === 1) {
    return [...nearest[0], rgb2hex(hsl2rgb(rgb2hsl(...nearest[0][2])))]
  }
  const hsl = rgb2hsl(...rgb);
  let nearestName = [];
  minscore = Infinity;
  nearest.forEach(([_hex, name, _rgb, score]) => {
    const _hsl = rgb2hsl(_rgb);
    const _score = score - abs(_hsl[0] - hsl[0]);
    if (minscore > _score) {
      minscore = score;
      nearestName = [_hex, name, _rgb, _score];
    }
  });
  return nearestName
}

const schemeNames = {
  Complementary: [180],
  Opornent: [120],
  Analogous: [-30, 30],
  SplitComplementary: [150, -150],
  Triadic: [120, 240],
  Tretradic: [60, 180, 240],
  AccentedAnalogous: [-30, 30, 180]
};

/**
 * Base color から生成した配色配列を返す
 *
 * @export
 * @param {any}           basecolor  Base color
 * @param {string|number} angle
 * @returns {array}
 */


/**
 * return: Sorted colors in order of strong contrast.
 * colorsをコントラストが強い順に並び替えして返す
 *
 * @export
 * @param {any}          basecolor  Base color
 * @param {string|Color} colors     Color or color hex string
 * @returns {array}                 Sorted contrastColors array. strongest contrast color first
 */


function randomHex () {
  return '#' + Math.random().toString(16).slice(2, 8)
}

/**
 * カラーコード変換
 *
 * @param {string} hex
 * @returns {array}  [r,g,b]
 * @see http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 */
function hex2rgb (hex) {
  const result = hex
    .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, '$1$1$2$2$3$3')
    .match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return result ? result.slice(1).map(h => parseInt(h, 16)) : null
}



/**
 * カラーコード変換
 *
 * @export
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string} hex
 */
function rgb2hex (r, g, b) {
  if (arguments.length === 1) {
    g = r.g || r[1] || 0;
    b = r.b || r[2] || 0;
    r = r.r || r[0] || 0;
  }
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

/**
 * RGB色空間からHSL色空間へ変換する
 *
 * @export
 * @param {number} r 0-255
 * @param {number} g 0-255
 * @param {number} b 0-255
 * @returns {Array.<number>}  [h, s, l] h: 0-360 , s: 0-100 , l: 0-100
 *
 * @see http://www.petitmonte.com/javascript/rgb_hsl_convert.html
 * @see https://ja.wikipedia.org/wiki/HLS色空間
 */
function rgb2hsl (r, g, b) {
  if (arguments.length === 1) {
    g = r.g || r[1] || 0;
    b = r.b || r[2] || 0;
    r = r.r || r[0] || 0;
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        d = max - min;
  let h,
      l = (max + min) / 2,
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  switch (max) {
    case min:
      h = s = 0;
      break
    case r:
      h = (g - b) / d + (g < b ? 6 : 0); h /= 6;
      break
    case g:
      h = (b - r) / d + 2; h /= 6;
      break
    case b:
      h = (r - g) / d + 4; h /= 6;
      break
  }

  h *= 360;
  s *= 100;
  l *= 100;
  return [h, s, l]
}

function hue2rgb (p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}
/**
 * HSL色空間からRGB色空間へ変換する
 *
 * @export
 * @param {number} h  (hue)       : 色相    0-360度の値
 * @param {number} s  (saturation): 彩度    0-100%の値   彩度は100%が純色となり、彩度を落としていくと徐々に灰色になります
 * @param {number} l  (lightness) : 明度    0-100%の値   明度は中間の50%が純色で0%になると黒色、100%は白色となります
 * @returns {Array.<number>}  [r, g, b]
 *
 * @see http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 * @see http://www.petitmonte.com/javascript/rgb_hsl_convert.html
 * @see http://d.hatena.ne.jp/ja9/20100907/1283840213
 * @see https://ja.wikipedia.org/wiki/HLS色空間
 */
function hsl2rgb (h, s, l) {
  let r, g, b;
  if (arguments.length === 1) {
    s = h.s || h[1] || 0;
    l = h.l || h[2] || 0;
    h = h.h || h[0] || 0;
  }

  h = hueModi(h);
  s = clamp(s, 100);
  l = clamp(l, 100);
  h /= 360;
  s /= 100;
  l /= 100;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s,
          p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  r = round(r * 255);
  g = round(g * 255);
  b = round(b * 255);
  return [r, g, b]
}

/**
 * RGB色空間からHSV色空間へ変換する
 *
 * @export
 * @param {number} r 0-255
 * @param {number} g 0-255
 * @param {number} b 0-255
 * @returns {Array.<number>}  [h, s, l] h: 0-360 , s: 0-100 , l: 0-100
 */
function rgb2hsv (r, g, b) {
  if (arguments.length === 1) {
    g = r.g || r[1] || 0;
    b = r.b || r[2] || 0;
    r = r.r || r[0] || 0;
  }
  const max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        d = max - min;
  let h = max,
      s = (max === 0 ? 0 : d / max),
      v = max / 255;

  switch (max) {
    case min:
      h = 0;
      break
    case r:
      h = (g - b) + d * (g < b ? 6 : 0); h /= 6 * d;
      break
    case g:
      h = (b - r) + d * 2; h /= 6 * d;
      break
    case b:
      h = (r - g) + d * 4; h /= 6 * d;
      break
  }

  h = round(h * 360);
  s = round(s * 100);
  v = round(v * 100);
  return [h, s, v]
}

/**
 * HSV(HSB)色空間からRGB色空間へ変換する
 *
 * @export
 * @param {number} h  (hue)       : 色相/色合い   0-360度の値
 * @param {number} s  (saturation): 彩度/鮮やかさ 0-100%の値
 * @param {number} v  (Value)     : 明度/明るさ   0-100%の値
 * @returns
 *
 * @see http://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
 */


function sRGB (num) {
  num /= 255;
  return (num <= 0.03928) ? num / 12.92 : Math.pow((num + 0.055) / 1.055, 2.4)
}

/**
 * Relative Luminance: 相対輝度
 *
 * @param {array} rgb
 * @returns {number}   0~1
 * @see https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
 */
function luminance ([r, g, b]) {
  return 0.2126 * sRGB(r) + 0.7152 * sRGB(g) + 0.0722 * sRGB(b)
}

/**
 * color1とcolor2のコントラスト比を計算
 *
 * @export
 * @param {array|Color} color1  rgb color array
 * @param {array|Color} color2  rgb color array
 * @returns {object}
 *
 * @see https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast
 * @see https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
 * @see http://waic.jp/docs/WCAG20/Overview.html#visual-audio-contrast
 */
function contrastRatio (color1, color2) {
  const l = [
    luminance(color1),
    luminance(color2),
  ];
  const [l1, l2] = l.sort((a, b) => b - a);

  // 1～21
  const cr = (l1 + 0.05) / (l2 + 0.05);
  return {
    sort: l[0] - l[1],
    // WCAG version 2 contrast ratio
    cr,
    // 評価
    // 通常のテキスト（14ポイント）
    aa: cr >= 4.5,
    aaa: cr >= 7,
    // 大きなテキスト（18ポイント、太字、中国語、日本語および韓国語）
    AA: cr >= 3,
    AAA: cr >= 4.5
  }
}

const storage = window.sessionStorage;

class Store {
  constructor () {
    riot$1.observable(this);
    // storage.clear()
    if (storage) {
      this.cards = this.getItem('cards');
    }
    if (!this.cards) {
      this.cards = [
        {
          name: 'turquoise',
          color: '#40E0D0'
        },
        {
          name: 'salmon',
          color: '#FA8072'
        },
        {
          name: 'red',
          color: '#ff5555'
        },
        {
          name: 'red2',
          color: '#fc0e49'
        },
        {
          name: 'red3',
          color: '#fe3265'
        },
        {
          name: 'yellow',
          color: '#FFD54F'
        },
        {
          name: 'teal',
          color: '#11c1b0'
        },
        {
          name: 'navy',
          color: '#1f2532'
        },
        {
          name: 'light',
          color: '#7F8C9A'
        },
        {
          name: 'dark',
          color: '#323a45'
        },
        {
          name: 'ivy',
          color: '#514a56'
        },
        {
          name: 'purple',
          color: '#a234d5'
        },
        {
          name: 'red4',
          color: '#d74059'
        },
      ];
    }

    this.cards.forEach((param, index) => {
      param.color = new Color(param.color);
      param.zIndex = index;
    });

    this.undo = new Undo(this.getState());

    this.on('undo', () => {
      const state = this.undo.undo();
      console.log('undo_state', state);
      if (!state) {
        return
      }
      this.cards = state.cards;
      this.box.style.backgroundColor = state.bgColor;
    });
    this.on('redo', () => {
      const state = this.undo.redo();
      console.log('redo_state', state);
      if (!state) {
        return
      }
      this.cards = state.cards;
      this.box.style.backgroundColor = state.bgColor;
    });

    // CARDS
    this.on('add_card', (param) => {
      param.color = new Color(param.color);
      param.zIndex = this.cards.length;
      this.cards.push(param);
      this.trigger('cards_changed', this.cards);
    });
    this.on('remove_card', (index = this.cards.length - 1) => {
      this.trigger('remove_card_animation', index, () => {
        this.cards.splice(index, 1);
        this.trigger('cards_changed', this.cards);
      });
    });

    this.on('card_forward', (index) => {
      const currIndex = +this.cards[index].zIndex;
      this.cards.forEach((card, i) => {
        if (i === index) {
          card.zIndex = this.cards.length - 1;
        } else if (card.zIndex > currIndex) {
          --card.zIndex;
        }
      });
      this.trigger('cards_changed', this.cards);
    });

    this.on('duplicate_card', (index) => {
      const newCard = Object.assign({}, this.cards[index]);
      newCard.x += 10;
      newCard.y += 10;
      this.trigger('add_card', newCard);
    });

    this.on('set_card_size', (index, w, h = w) => {
      let card = this.cards[index];
      if (card.width !== w || card.height !== h) {
        card.width = w;
        card.height = h;
        this.trigger('cards_changed', this.cards);
      }
    });

    this.on('card_moved', (index, x, y) => {
      let card = this.cards[index];
      if (card.x !== x || card.y !== y) {
        card.x = x;
        card.y = y;
        this.trigger('cards_changed', this.cards);
      }
    });
    this.on('card_select', (index, bool) => {
      if (bool) {
        this.cards[index].selected = true;
      } else {
        delete this.cards[index].selected;
      }
    });

    this.on('cards_changed', () => {
      this.save();
      this.undo.saveState(this.getState());
    });

    // BACKGROUND
    this.on('set_bgColor', (color) => {
      this.box.style.backgroundColor = color;
      this.setItem('bgColor', color);
      this.undo.saveState(this.getState());
    });
  }

  getState () {
    return {
      cards: this.cards,
      bgColor: this.box && this.box.style.backgroundColor || 'rgb(31, 37, 50)'
    }
  }

  getItem (key) {
    const val = storage.getItem(key);
    return val ? JSON.parse(val) : val
  }
  setItem (key, value) {
    storage.setItem(key, JSON.stringify(value));
  }
  save () {
    this.setItem('cards', this.cards);
  }
}

var store = new Store();

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
      percent: false,
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

    this.handleRect = {width: 0, height: 0, left: 0, top: 0};

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
    this.left = this.handleRect.left + this.vectorX;
    this.top  = this.handleRect.top + this.vectorY;

    if (this.options.percent) {
      this.percentLeft = this.percentage(this.left, 'width');
      this.percentTop  = this.percentage(this.top, 'height');
    }

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
function on (el, eventNames, callback, useCapture) {
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
  constructor (options) {
    this.options = Object.assign({
      containment: (options.nodeName ? options : document.body),
      handle: null,
      // start: noop,
      // drag: noop,
      // stop: noop
    }, options || {});

    // イベント登録
    this._event = {
      mdown: (e) => { this.mdown(e); },
      mmove: (e) => { this.mmove(e); },
      mup: (e) => { this.mup(e); },
    };
    on(options.handle || options.containment, 'mousedown touchstart', this._event.mdown);

    this.position = new PositionManager(options);

    this._clickFlg = false;
  }

  destroy () {
    off(0, 'mousedown touchstart', this._event.mdown);
  }

  // マウスが押された際の関数
  mdown (e, handle) {
    const {options, position} = this;
    // マウス座標を保存
    position.set(e, true, handle);

    if (options.start) {
      options.start(e, position, handle);
    }
    on(0, 'mouseup touchcancel touchend', this._event.mup);
    on(0, 'mousemove touchmove', this._event.mmove);
    this._clickFlg = true;
  }
  // マウスカーソルが動いたときに発火
  mmove (e) {
    const {options, position} = this;
    // マウスが動いたベクトルを保存
    position.set(e);
    // フリックしたときに画面を動かさないようにデフォルト動作を抑制
    e.preventDefault();

    if (options.drag) {
      options.drag(e, position);
    }
    // カーソルが外れたとき発火
    on(0, 'mouseleave touchleave', this._event.mup);
    this._clickFlg = false;
  }
  // マウスボタンが上がったら発火
  mup (e) {
    const {options, position} = this;
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
    super(Object.assign({
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


function hitChecker (rect1, rect2, tolerance) {
  return tolerance === 'fit' ? fitHit(rect1, rect2) : touchHit(rect1, rect2)
}

function fitHit (rect1, rect2) {
  const [x, y, w, h] = ['left', 'top', 'width', 'height'];
  // rect1 x1-----------------------------------------------x1+w1
  // rect2          x2---------------x2+w2
  if (
    rect1[x] <= rect2[x] && rect2[x] + rect2[w] <= rect1[x] + rect1[w] &&
    rect1[y] <= rect2[y] && rect2[y] + rect2[h] <= rect1[y] + rect1[h]
  ) {
    return true
  }
  return false
}
function touchHit (rect1, rect2) {
  const [x, y, w, h] = ['left', 'top', 'width', 'height'];
  // rect1                x1---------------------------x1+w1
  // rect2 x2---------------------------------x2+w2
  if (
    rect2[x] <= rect1[x] && rect1[x] <= rect2[x] + rect2[w] &&
    rect2[y] <= rect1[y] && rect1[y] <= rect2[y] + rect2[h]
  ) {
    return true
  }
  // rect1 x1---------------------------------x1+w1
  // rect2               x2----------------------------------------x2+w2
  if (
    rect1[x] <= rect2[x] && rect2[x] <= rect1[x] + rect1[w] &&
    rect1[y] <= rect2[y] && rect2[y] <= rect1[y] + rect1[h]
  ) {
    return true
  }
  return false
}


class Selectable extends MousePosition {
  constructor (element, options) {
    super(Object.assign({
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

    this.selectorString = opts.filter + opts.cancel.replace(/(\w+),?/g, ':not($1)');
    this.children = [];
    this.childrenRects = [];
    this.selectElements = [];
  }


  select (i, e) {
    const opts = this.options;
    if (!e) {
      this.children = Array.from(opts.containment.querySelectorAll(this.selectorString));
    }
    const child = this.children[i];
    child.classList.add(opts.selectedClass);

    const indexOf = this.selectElements.indexOf(child);
    if (indexOf === -1) {
      this.selectElements.push(child);
    }
    // Callback
    if (opts.selecting) {
      opts.selecting(e, this.position, child, i);
    }
  }
  selectAll (e) {
    this.children.forEach((child, i) => {
      this.select(i, e);
    });
  }
  unselect (i, e) {
    const opts = this.options;
    if (!e) {
      this.children = Array.from(opts.containment.querySelectorAll(this.selectorString));
    }
    const child = this.children[i];
    child.classList.remove(opts.selectedClass);

    const indexOf = this.selectElements.indexOf(child);
    if (indexOf > -1) {
      this.selectElements.splice(indexOf, 1);
    }
    // Callback
    if (opts.unselecting) {
      opts.unselecting(e, this.position, child, i);
    }
  }
  unselectAll (e) {
    this.selectElements.length = 0;
    this.children.forEach((child, i) => {
      this.unselect(i, e);
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
    return {left, top, width, height}
  }

  mdown (e, handle) {
    super.mdown(e, handle);
    const el = this.options.containment;
    const {position, helper} = this;
    // array init
    this.children = Array.from(el.querySelectorAll(this.selectorString));
    this.childrenRects = this.children.map((el) => el.getBoundingClientRect());
    // 追加
    el.appendChild(helper);
    helper.style.left = position.startX + 'px';
    helper.style.top  = position.startY + 'px';
    helper.style.width  = '0px';
    helper.style.height = '0px';
    this.unselectAll(e);
  }

  // マウスカーソルが動いたときに発火
  mmove (e) {
    super.mmove(e);
    const opts = this.options;
    const {position, helper} = this;
    // 選択範囲のRectデータ
    const helperRect = this.helperRect(position);

    // 選択範囲内の要素にクラスを追加。範囲外の要素からクラスを削除
    this.childrenRects.forEach((rect2, i) => {
      if (hitChecker(helperRect, rect2, opts.tolerance)) {
        this.select(i, e);
      } else {
        this.unselect(i, e);
      }
    });
    // Callback
    if (opts.selected) {
      opts.selected(e, position, helper, this.selectElements);
    }
    // マウスが動いた場所にhelper要素を動かす
    Object.assign(position, helperRect);
    position.setPosition(e, helper);
  }
  // マウスボタンが上がったら発火
  mup (e) {
    super.mup(e);
      // helper要素を消す
    this.options.containment.removeChild(this.helper);
  }
}

riot$1.tag2('app', '<div id="colors" ref="colors"> <color-picker size="280" oncolorchange="{colorchange}" simple=""></color-picker> <div id="form_add"> <button id="color_type" onclick="{color_typeChange}">{color_type.toUpperCase()}</button> <input id="color_hex" ref="color_hex" placeholder="#000000" onsubmit="{addCard_btn}" oninput="{color_hexInput}"> <button id="add_btn" onclick="{addCard_btn}">➕</button> </div> <div id="pallete"> <color-tip each="{palette}"></color-tip> </div> <hr> <color-lists></color-lists> </div> <div id="box" ref="box"> <color-card each="{card, i in cards}"></color-card> </div> <context-menu></context-menu>', '.ui-selectable-helper { position: absolute; z-index: 100; border: 1px dotted black; } #colors { width: 320px; height: 100vh; position: absolute; margin:0; padding: 20px; top:0; left:0; } #box { width: 100%; height: 100%; background: #1f2532; } #form_add { margin: 10px 0; display: flex; flex-direction: row;} #color_type { text-align: center; width: 42px; height: 42px; border-width: 1px 0 1px 1px; border-style: solid; border-top-left-radius: 4px; border-bottom-left-radius: 4px;} #color_hex { flex: 1 1 auto; height: 42px; padding: 8px 5px; border-width: 1px 0 1px 1px; border-style: solid;} #add_btn { width: 42px; height: 42px; text-align: center; border-width: 1px; border-style: solid; border-top-right-radius: 4px; border-bottom-right-radius: 4px;}', '', function(opts) {

    this.cards = store.cards;
    const palette = () => {
      return this.cards.map((arg) => arg).sort((a, b) => {
        return a.color.lightness - b.color.lightness
      }).sort((a, b) => {
        return a.color.hue - b.color.hue
      })
    };
    this.palette = palette();
    store.on('cards_changed', (cards) => {

      this.palette = palette();
      this.update();
    });

    const COLOR_TYPE = ['hex', 'rgb', 'hsl'];
    let colortypeindex = 0;
    this.color_type = COLOR_TYPE[colortypeindex];
    this.placeholder = ['#000000', 'rgb(0, 0, 0)', 'hsl(0, 0%, 0%)'];
    this.color_typeChange = () => {
      ++colortypeindex;
      colortypeindex %= COLOR_TYPE.length;
      this.color_type = COLOR_TYPE[colortypeindex];

      this.refs.color_hex.value = this.tags['color-picker'].color.toString(this.color_type);
    };

    const validationRegExp = /^(#?[a-f\d]{3}(?:[a-f\d]{3})?)(?:\s*\W?\s(.+))?/i;
    this.addCard_btn = () => {
      const text = validationRegExp.exec(this.refs.color_hex.value);
      if (text) {
        store.trigger('add_card', {
          name: (text[2] || '').trim(),
          color: text[1],
        });
        this.refs.color_hex.value = '';
      }
    };
    this.color_hexInput = (e) => {
      const value = this.refs.color_hex.value;
      const text = validationRegExp.exec(value);
      if (text) {
        this.tags['color-picker'].color = new Color(text[1]);
      }
    };

    this.colorchange = (color) => {
      this.refs.color_hex.value = color.toString(this.color_type);
    };

    this.on('mount', () => {
      store.box = this.refs.box;
      const bgColor = store.getItem('bgColor') || '#1f2532';
      this.refs.box.style.backgroundColor = bgColor;

      store.on('set_bgColor', (color) => {
        const textcolor = color.lightness < 35 ? '#eee' : '#111';
        this.refs.colors.style.color = textcolor;
      });

      store.trigger('set_bgColor', new Color(bgColor));

      this.selectable = new Selectable(this.refs.box, {
        filter: '.card',
        selectedClass: 'card_selected',
        tolerance: 'fit',
        start: (e, position) => {
          store.trigger('menu_close');
        },
        selecting: (e, position, el, index) => {
          store.trigger('card_select', index, true);
        },
        unselecting: (e, position, el, index) => {
          store.trigger('card_select', index, false);
        },
      });
    });
});

var tinycolor = createCommonjsModule(function (module) {
// TinyColor v1.4.1
// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License

(function(Math) {

var trimLeft = /^\s+/,
    trimRight = /\s+$/,
    tinyCounter = 0,
    mathRound = Math.round,
    mathMin = Math.min,
    mathMax = Math.max,
    mathRandom = Math.random;

function tinycolor (color, opts) {

    color = (color) ? color : '';
    opts = opts || { };

    // If input is already a tinycolor, return itself
    if (color instanceof tinycolor) {
       return color;
    }
    // If we are called as a function, call using new instead
    if (!(this instanceof tinycolor)) {
        return new tinycolor(color, opts);
    }

    var rgb = inputToRGB(color);
    this._originalInput = color,
    this._r = rgb.r,
    this._g = rgb.g,
    this._b = rgb.b,
    this._a = rgb.a,
    this._roundA = mathRound(100*this._a) / 100,
    this._format = opts.format || rgb.format;
    this._gradientType = opts.gradientType;

    // Don't let the range of [0,255] come back in [0,1].
    // Potentially lose a little bit of precision here, but will fix issues where
    // .5 gets interpreted as half of the total, instead of half of 1
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
    if (this._r < 1) { this._r = mathRound(this._r); }
    if (this._g < 1) { this._g = mathRound(this._g); }
    if (this._b < 1) { this._b = mathRound(this._b); }

    this._ok = rgb.ok;
    this._tc_id = tinyCounter++;
}

tinycolor.prototype = {
    isDark: function() {
        return this.getBrightness() < 128;
    },
    isLight: function() {
        return !this.isDark();
    },
    isValid: function() {
        return this._ok;
    },
    getOriginalInput: function() {
      return this._originalInput;
    },
    getFormat: function() {
        return this._format;
    },
    getAlpha: function() {
        return this._a;
    },
    getBrightness: function() {
        //http://www.w3.org/TR/AERT#color-contrast
        var rgb = this.toRgb();
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    },
    getLuminance: function() {
        //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        var rgb = this.toRgb();
        var RsRGB, GsRGB, BsRGB, R, G, B;
        RsRGB = rgb.r/255;
        GsRGB = rgb.g/255;
        BsRGB = rgb.b/255;

        if (RsRGB <= 0.03928) {R = RsRGB / 12.92;} else {R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);}
        if (GsRGB <= 0.03928) {G = GsRGB / 12.92;} else {G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);}
        if (BsRGB <= 0.03928) {B = BsRGB / 12.92;} else {B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);}
        return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
    },
    setAlpha: function(value) {
        this._a = boundAlpha(value);
        this._roundA = mathRound(100*this._a) / 100;
        return this;
    },
    toHsv: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
    },
    toHsvString: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
        return (this._a == 1) ?
          "hsv("  + h + ", " + s + "%, " + v + "%)" :
          "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
    },
    toHsl: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
    },
    toHslString: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
        return (this._a == 1) ?
          "hsl("  + h + ", " + s + "%, " + l + "%)" :
          "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
    },
    toHex: function(allow3Char) {
        return rgbToHex(this._r, this._g, this._b, allow3Char);
    },
    toHexString: function(allow3Char) {
        return '#' + this.toHex(allow3Char);
    },
    toHex8: function(allow4Char) {
        return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
    },
    toHex8String: function(allow4Char) {
        return '#' + this.toHex8(allow4Char);
    },
    toRgb: function() {
        return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
    },
    toRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
          "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
    },
    toPercentageRgb: function() {
        return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
    },
    toPercentageRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
          "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
    },
    toName: function() {
        if (this._a === 0) {
            return "transparent";
        }

        if (this._a < 1) {
            return false;
        }

        return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
    },
    toFilter: function(secondColor) {
        var hex8String = '#' + rgbaToArgbHex(this._r, this._g, this._b, this._a);
        var secondHex8String = hex8String;
        var gradientType = this._gradientType ? "GradientType = 1, " : "";

        if (secondColor) {
            var s = tinycolor(secondColor);
            secondHex8String = '#' + rgbaToArgbHex(s._r, s._g, s._b, s._a);
        }

        return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
    },
    toString: function(format) {
        var formatSet = !!format;
        format = format || this._format;

        var formattedString = false;
        var hasAlpha = this._a < 1 && this._a >= 0;
        var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");

        if (needsAlphaFormat) {
            // Special case for "transparent", all other non-alpha formats
            // will return rgba when there is transparency.
            if (format === "name" && this._a === 0) {
                return this.toName();
            }
            return this.toRgbString();
        }
        if (format === "rgb") {
            formattedString = this.toRgbString();
        }
        if (format === "prgb") {
            formattedString = this.toPercentageRgbString();
        }
        if (format === "hex" || format === "hex6") {
            formattedString = this.toHexString();
        }
        if (format === "hex3") {
            formattedString = this.toHexString(true);
        }
        if (format === "hex4") {
            formattedString = this.toHex8String(true);
        }
        if (format === "hex8") {
            formattedString = this.toHex8String();
        }
        if (format === "name") {
            formattedString = this.toName();
        }
        if (format === "hsl") {
            formattedString = this.toHslString();
        }
        if (format === "hsv") {
            formattedString = this.toHsvString();
        }

        return formattedString || this.toHexString();
    },
    clone: function() {
        return tinycolor(this.toString());
    },

    _applyModification: function(fn, args) {
        var color = fn.apply(null, [this].concat([].slice.call(args)));
        this._r = color._r;
        this._g = color._g;
        this._b = color._b;
        this.setAlpha(color._a);
        return this;
    },
    lighten: function() {
        return this._applyModification(lighten, arguments);
    },
    brighten: function() {
        return this._applyModification(brighten, arguments);
    },
    darken: function() {
        return this._applyModification(darken, arguments);
    },
    desaturate: function() {
        return this._applyModification(desaturate, arguments);
    },
    saturate: function() {
        return this._applyModification(saturate, arguments);
    },
    greyscale: function() {
        return this._applyModification(greyscale, arguments);
    },
    spin: function() {
        return this._applyModification(spin, arguments);
    },

    _applyCombination: function(fn, args) {
        return fn.apply(null, [this].concat([].slice.call(args)));
    },
    analogous: function() {
        return this._applyCombination(analogous, arguments);
    },
    complement: function() {
        return this._applyCombination(complement, arguments);
    },
    monochromatic: function() {
        return this._applyCombination(monochromatic, arguments);
    },
    splitcomplement: function() {
        return this._applyCombination(splitcomplement, arguments);
    },
    triad: function() {
        return this._applyCombination(triad, arguments);
    },
    tetrad: function() {
        return this._applyCombination(tetrad, arguments);
    }
};

// If input is an object, force 1 into "1.0" to handle ratios properly
// String input requires "1.0" as input, so 1 will be treated as 1
tinycolor.fromRatio = function(color, opts) {
    if (typeof color == "object") {
        var newColor = {};
        for (var i in color) {
            if (color.hasOwnProperty(i)) {
                if (i === "a") {
                    newColor[i] = color[i];
                }
                else {
                    newColor[i] = convertToPercentage(color[i]);
                }
            }
        }
        color = newColor;
    }

    return tinycolor(color, opts);
};

// Given a string or object, convert that input to RGB
// Possible string inputs:
//
//     "red"
//     "#f00" or "f00"
//     "#ff0000" or "ff0000"
//     "#ff000000" or "ff000000"
//     "rgb 255 0 0" or "rgb (255, 0, 0)"
//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
//
function inputToRGB(color) {

    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;
    var format = false;

    if (typeof color == "string") {
        color = stringInputToObject(color);
    }

    if (typeof color == "object") {
        if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = convertToPercentage(color.s);
            v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s, v);
            ok = true;
            format = "hsv";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = convertToPercentage(color.s);
            l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s, l);
            ok = true;
            format = "hsl";
        }

        if (color.hasOwnProperty("a")) {
            a = color.a;
        }
    }

    a = boundAlpha(a);

    return {
        ok: ok,
        format: color.format || format,
        r: mathMin(255, mathMax(rgb.r, 0)),
        g: mathMin(255, mathMax(rgb.g, 0)),
        b: mathMin(255, mathMax(rgb.b, 0)),
        a: a
    };
}


// Conversion Functions
// --------------------

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToRgb`
// Handle bounds / percentage checking to conform to CSS color spec
// <http://www.w3.org/TR/css3-color/>
// *Assumes:* r, g, b in [0, 255] or [0, 1]
// *Returns:* { r, g, b } in [0, 255]
function rgbToRgb(r, g, b){
    return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255
    };
}

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
function rgbToHsl(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h: h, s: s, l: l };
}

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hslToRgb(h, s, l) {
    var r, g, b;

    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);

    function hue2rgb(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    if(s === 0) {
        r = g = b = l; // achromatic
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
function rgbToHsv(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
 function hsvToRgb(h, s, v) {

    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);

    var i = Math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHex`
// Converts an RGB color to hex
// Assumes r, g, and b are contained in the set [0, 255]
// Returns a 3 or 6 character hex
function rgbToHex(r, g, b, allow3Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    // Return a 3 character hex if possible
    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }

    return hex.join("");
}

// `rgbaToHex`
// Converts an RGBA color plus alpha transparency to hex
// Assumes r, g, b are contained in the set [0, 255] and
// a in [0, 1]. Returns a 4 or 8 character rgba hex
function rgbaToHex(r, g, b, a, allow4Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16)),
        pad2(convertDecimalToHex(a))
    ];

    // Return a 4 character hex if possible
    if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }

    return hex.join("");
}

// `rgbaToArgbHex`
// Converts an RGBA color to an ARGB Hex8 string
// Rarely used, but required for "toFilter()"
function rgbaToArgbHex(r, g, b, a) {

    var hex = [
        pad2(convertDecimalToHex(a)),
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    return hex.join("");
}

// `equals`
// Can be called with any tinycolor input
tinycolor.equals = function (color1, color2) {
    if (!color1 || !color2) { return false; }
    return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
};

tinycolor.random = function() {
    return tinycolor.fromRatio({
        r: mathRandom(),
        g: mathRandom(),
        b: mathRandom()
    });
};


// Modification Functions
// ----------------------
// Thanks to less.js for some of the basics here
// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

function desaturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s -= amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function saturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s += amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function greyscale(color) {
    return tinycolor(color).desaturate(100);
}

function lighten (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

function brighten(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var rgb = tinycolor(color).toRgb();
    rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
    rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
    rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
    return tinycolor(rgb);
}

function darken (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l -= amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

// Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
// Values outside of this range will be wrapped into this range.
function spin(color, amount) {
    var hsl = tinycolor(color).toHsl();
    var hue = (hsl.h + amount) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    return tinycolor(hsl);
}

// Combination Functions
// ---------------------
// Thanks to jQuery xColor for some of the ideas behind these
// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

function complement(color) {
    var hsl = tinycolor(color).toHsl();
    hsl.h = (hsl.h + 180) % 360;
    return tinycolor(hsl);
}

function triad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
    ];
}

function tetrad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
    ];
}

function splitcomplement(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
        tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
    ];
}

function analogous(color, results, slices) {
    results = results || 6;
    slices = slices || 30;

    var hsl = tinycolor(color).toHsl();
    var part = 360 / slices;
    var ret = [tinycolor(color)];

    for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(tinycolor(hsl));
    }
    return ret;
}

function monochromatic(color, results) {
    results = results || 6;
    var hsv = tinycolor(color).toHsv();
    var h = hsv.h, s = hsv.s, v = hsv.v;
    var ret = [];
    var modification = 1 / results;

    while (results--) {
        ret.push(tinycolor({ h: h, s: s, v: v}));
        v = (v + modification) % 1;
    }

    return ret;
}

// Utility Functions
// ---------------------

tinycolor.mix = function(color1, color2, amount) {
    amount = (amount === 0) ? 0 : (amount || 50);

    var rgb1 = tinycolor(color1).toRgb();
    var rgb2 = tinycolor(color2).toRgb();

    var p = amount / 100;

    var rgba = {
        r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
        g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
        b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
        a: ((rgb2.a - rgb1.a) * p) + rgb1.a
    };

    return tinycolor(rgba);
};


// Readability Functions
// ---------------------
// <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)

// `contrast`
// Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
tinycolor.readability = function(color1, color2) {
    var c1 = tinycolor(color1);
    var c2 = tinycolor(color2);
    return (Math.max(c1.getLuminance(),c2.getLuminance())+0.05) / (Math.min(c1.getLuminance(),c2.getLuminance())+0.05);
};

// `isReadable`
// Ensure that foreground and background color combinations meet WCAG2 guidelines.
// The third argument is an optional Object.
//      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
//      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
// If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.

// *Example*
//    tinycolor.isReadable("#000", "#111") => false
//    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
tinycolor.isReadable = function(color1, color2, wcag2) {
    var readability = tinycolor.readability(color1, color2);
    var wcag2Parms, out;

    out = false;

    wcag2Parms = validateWCAG2Parms(wcag2);
    switch (wcag2Parms.level + wcag2Parms.size) {
        case "AAsmall":
        case "AAAlarge":
            out = readability >= 4.5;
            break;
        case "AAlarge":
            out = readability >= 3;
            break;
        case "AAAsmall":
            out = readability >= 7;
            break;
    }
    return out;

};

// `mostReadable`
// Given a base color and a list of possible foreground or background
// colors for that base, returns the most readable color.
// Optionally returns Black or White if the most readable color is unreadable.
// *Example*
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
tinycolor.mostReadable = function(baseColor, colorList, args) {
    var bestColor = null;
    var bestScore = 0;
    var readability;
    var includeFallbackColors, level, size;
    args = args || {};
    includeFallbackColors = args.includeFallbackColors ;
    level = args.level;
    size = args.size;

    for (var i= 0; i < colorList.length ; i++) {
        readability = tinycolor.readability(baseColor, colorList[i]);
        if (readability > bestScore) {
            bestScore = readability;
            bestColor = tinycolor(colorList[i]);
        }
    }

    if (tinycolor.isReadable(baseColor, bestColor, {"level":level,"size":size}) || !includeFallbackColors) {
        return bestColor;
    }
    else {
        args.includeFallbackColors=false;
        return tinycolor.mostReadable(baseColor,["#fff", "#000"],args);
    }
};


// Big List of Colors
// ------------------
// <http://www.w3.org/TR/css3-color/#svg-color>
var names = tinycolor.names = {
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "0ff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000",
    blanchedalmond: "ffebcd",
    blue: "00f",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    burntsienna: "ea7e5d",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "0ff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkgrey: "a9a9a9",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkslategrey: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1e90ff",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "f0f",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    grey: "808080",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgray: "d3d3d3",
    lightgreen: "90ee90",
    lightgrey: "d3d3d3",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslategray: "789",
    lightslategrey: "789",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "0f0",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "f0f",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370db",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "db7093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    rebeccapurple: "663399",
    red: "f00",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    slategrey: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    wheat: "f5deb3",
    white: "fff",
    whitesmoke: "f5f5f5",
    yellow: "ff0",
    yellowgreen: "9acd32"
};

// Make it easy to access colors via `hexNames[hex]`
var hexNames = tinycolor.hexNames = flip(names);


// Utilities
// ---------

// `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
function flip(o) {
    var flipped = { };
    for (var i in o) {
        if (o.hasOwnProperty(i)) {
            flipped[o[i]] = i;
        }
    }
    return flipped;
}

// Return a valid alpha value [0,1] with all invalid values being set to 1
function boundAlpha(a) {
    a = parseFloat(a);

    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }

    return a;
}

// Take input from [0, n] and return it as [0, 1]
function bound01(n, max) {
    if (isOnePointZero(n)) { n = "100%"; }

    var processPercent = isPercentage(n);
    n = mathMin(max, mathMax(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
        n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if ((Math.abs(n - max) < 0.000001)) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
}

// Force a number between 0 and 1
function clamp01(val) {
    return mathMin(1, mathMax(0, val));
}

// Parse a base-16 hex value into a base-10 integer
function parseIntFromHex(val) {
    return parseInt(val, 16);
}

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
function isOnePointZero(n) {
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
}

// Check to see if string passed in is a percentage
function isPercentage(n) {
    return typeof n === "string" && n.indexOf('%') != -1;
}

// Force a hex value to have 2 characters
function pad2(c) {
    return c.length == 1 ? '0' + c : '' + c;
}

// Replace a decimal with it's percentage value
function convertToPercentage(n) {
    if (n <= 1) {
        n = (n * 100) + "%";
    }

    return n;
}

// Converts a decimal to a hex value
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
// Converts a hex value to a decimal
function convertHexToDecimal(h) {
    return (parseIntFromHex(h) / 255);
}

var matchers = (function() {

    // <http://www.w3.org/TR/css3-values/#integers>
    var CSS_INTEGER = "[-\\+]?\\d+%?";

    // <http://www.w3.org/TR/css3-values/#number-value>
    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

    // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren
    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

    return {
        CSS_UNIT: new RegExp(CSS_UNIT),
        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
        hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
        hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    };
})();

// `isValidCSSUnit`
// Take in a single string / number and check to see if it looks like a CSS unit
// (see `matchers` above for definition).
function isValidCSSUnit(color) {
    return !!matchers.CSS_UNIT.exec(color);
}

// `stringInputToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
function stringInputToObject(color) {

    color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
    var named = false;
    if (names[color]) {
        color = names[color];
        named = true;
    }
    else if (color == 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }

    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    var match;
    if ((match = matchers.rgb.exec(color))) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    if ((match = matchers.rgba.exec(color))) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    if ((match = matchers.hsl.exec(color))) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    if ((match = matchers.hsla.exec(color))) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    if ((match = matchers.hsv.exec(color))) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    if ((match = matchers.hsva.exec(color))) {
        return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    if ((match = matchers.hex8.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex6.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
        };
    }
    if ((match = matchers.hex4.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            a: convertHexToDecimal(match[4] + '' + match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex3.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            format: named ? "name" : "hex"
        };
    }

    return false;
}

function validateWCAG2Parms(parms) {
    // return valid WCAG2 parms for isReadable.
    // If input parms are invalid, return {"level":"AA", "size":"small"}
    var level, size;
    parms = parms || {"level":"AA", "size":"small"};
    level = (parms.level || "AA").toUpperCase();
    size = (parms.size || "small").toLowerCase();
    if (level !== "AA" && level !== "AAA") {
        level = "AA";
    }
    if (size !== "small" && size !== "large") {
        size = "small";
    }
    return {"level":level, "size":size};
}

// Node: Export function
if (typeof module !== "undefined" && module.exports) {
    module.exports = tinycolor;
}
// AMD/requirejs: Define the module
else if (typeof define === 'function' && define.amd) {
    define(function () {return tinycolor;});
}
// Browser: Expose to window
else {
    window.tinycolor = tinycolor;
}

})(Math);
});

riot$1.tag2('color-card', '<div class="card animated bounceIn" ref="card" riot-style="background-color: {color}; color: {textColor}; width: {width}px; height: {height}px; left: {x}px; top: {y}px; z-index: {+card.zIndex};"> <div class="cardtext"><b>{name}</b><br>{color}</div> </div>', '.card { position: absolute; text-align:center; font-size:12px; display: flex; align-items: center; justify-content: center; } .card.card_selected { outline: 1px dashed black; box-shadow: 0 0 0 1px white; } .card.active { z-index: 100; } .cardtext { white-space: pre-wrap; user-select: none; -ms-user-select: none; -webkit-user-select: none; -moz-user-select: none; }', '', function(opts) {

    this.width = 120;
    this.height = 120;
    Object.assign(this, this.card);

    this.textColor = tinycolor.mostReadable(this.color, ['#eee', '#111']);

    function snap (n, grid = 5) {
      return Math.round(n / grid) * grid
    }

    const colorsWidth = 320;

    this.rectSetter = (init) => {
      this.width = this.card.width || 120;
      this.height = this.card.height || 120;

      const rect = this.parent.refs.box.getBoundingClientRect();
      const maxW = rect.width - this.width;
      const maxH = rect.height - this.height;

      const card = this.refs.card;
      if (init && (+this.card.x < colorsWidth || !this.card.y)) {

        this.x = snap((maxW - colorsWidth) * Math.random() + colorsWidth);
        this.y = snap((maxH) * Math.random());
      } else {
        this.x = Math.min(Math.max(colorsWidth, this.card.x), maxW);
        this.y = Math.min(Math.max(0, this.card.y), maxH);
      }
      card.style.left = this.x + 'px';
      card.style.top  = this.y + 'px';
    };

    this.one('update', () => {
      this.refs.card.classList.remove('animated', 'bounceIn');
    });

    store.on('remove_card_animation', (index, cb) => {
      let timer;
      if (this.i === index) {
        this.refs.card.classList.add('animated', 'bounceOut');
        const style = window.getComputedStyle(this.refs.card);
        const delay = parseFloat(style.animationDuration) + parseFloat(style.animationDelay);
        timer = setTimeout(() => {
          cb();
          clearTimeout(timer);
        }, delay * 1000 | 0);
      }
    });

    this.on('mount', () => {
      const card = this.refs.card;
      this.rectSetter(true);

      let cards, cardRects;

      this.movable = new Movable(card, {
        containment: this.parent.refs.box,
        grid: 5,
        axis: 'shift',
        start: (e, position) => {
          e.stopPropagation();

          store.trigger('card_forward', this.i);
          if (card.classList.contains('card_selected')) {
            cards = this.parent.selectable.selectElements;
          } else {
            this.parent.selectable.unselectAll();
            cards = [];
          }
          cardRects = cards.map((el) => el.getBoundingClientRect());
        },
        drag: (e, position, el) => {
          cards.forEach((cardEl, i) => {
            if (card !== cardEl) {
              const cardRect = cardRects[i];
              cardEl.style.left = position.adjust(cardRect.left + position.vectorX, 'width', cardRect) + 'px';
              cardEl.style.top  = position.adjust(cardRect.top  + position.vectorY, 'height', cardRect) + 'px';
            }
          });
        },
        stop: (e, position, el) => {
          let x = position.left;
          let y = position.top;
          if (x < colorsWidth) {
            x = position.left = position.startLeft;
            y = position.top  = position.startTop;
          }
          position.setPosition(e);
          this.x = x;
          this.y = y;
          store.trigger('card_moved', this.i, x, y);
        },
        click: (e, position, el) => {
          this.parent.selectable.select(this.i);
        },
      });

      card.addEventListener('contextmenu', (e) => {

        e.preventDefault();
        store.trigger('menu_open', e, this, 'card');
      }, false);
    });
});

const IndianRed = ["#CD5C5C"];
const LightCoral = ["#F08080"];
const Salmon = ["#FA8072"];
const DarkSalmon = ["#E9967A"];
const LightSalmon = ["#FFA07A"];
const Crimson = ["#DC143C"];
const Red = ["#FF0000"];
const FireBrick = ["#B22222"];
const DarkRed = ["#8B0000"];
const Pink = ["#FFC0CB"];
const LightPink = ["#FFB6C1"];
const HotPink = ["#FF69B4"];
const DeepPink = ["#FF1493"];
const MediumVioletRed = ["#C71585"];
const PaleVioletRed = ["#DB7093"];
const Coral = ["#FF7F50"];
const Tomato = ["#FF6347"];
const OrangeRed = ["#FF4500"];
const DarkOrange = ["#FF8C00"];
const Orange = ["#FFA500"];
const Gold = ["#FFD700"];
const Yellow = ["#FFFF00"];
const LightYellow = ["#FFFFE0"];
const LemonChiffon = ["#FFFACD"];
const LightGoldenrodYellow = ["#FAFAD2"];
const PapayaWhip = ["#FFEFD5"];
const Moccasin = ["#FFE4B5"];
const PeachPuff = ["#FFDAB9"];
const PaleGoldenrod = ["#EEE8AA"];
const Khaki = ["#F0E68C"];
const DarkKhaki = ["#BDB76B"];
const Lavender = ["#E6E6FA"];
const Thistle = ["#D8BFD8"];
const Plum = ["#DDA0DD"];
const Violet = ["#EE82EE"];
const Orchid = ["#DA70D6"];
const Fuchsia = ["#FF00FF"];
const Magenta = ["#FF00FF"];
const MediumOrchid = ["#BA55D3"];
const MediumPurple = ["#9370DB"];
const RebeccaPurple = ["#663399"];
const BlueViolet = ["#8A2BE2"];
const DarkViolet = ["#9400D3"];
const DarkOrchid = ["#9932CC"];
const DarkMagenta = ["#8B008B"];
const Purple = ["#800080"];
const Indigo = ["#4B0082"];
const SlateBlue = ["#6A5ACD"];
const DarkSlateBlue = ["#483D8B"];
const MediumSlateBlue = ["#7B68EE"];
const GreenYellow = ["#ADFF2F"];
const Chartreuse = ["#7FFF00"];
const LawnGreen = ["#7CFC00"];
const Lime = ["#00FF00"];
const LimeGreen = ["#32CD32"];
const PaleGreen = ["#98FB98"];
const LightGreen = ["#90EE90"];
const MediumSpringGreen = ["#00FA9A"];
const SpringGreen = ["#00FF7F"];
const MediumSeaGreen = ["#3CB371"];
const SeaGreen = ["#2E8B57"];
const ForestGreen = ["#228B22"];
const Green = ["#008000"];
const DarkGreen = ["#006400"];
const YellowGreen = ["#9ACD32"];
const OliveDrab = ["#6B8E23"];
const Olive = ["#808000"];
const DarkOliveGreen = ["#556B2F"];
const MediumAquamarine = ["#66CDAA"];
const DarkSeaGreen = ["#8FBC8B"];
const LightSeaGreen = ["#20B2AA"];
const DarkCyan = ["#008B8B"];
const Teal = ["#008080"];
const Aqua = ["#00FFFF"];
const Cyan = ["#00FFFF"];
const LightCyan = ["#E0FFFF"];
const PaleTurquoise = ["#AFEEEE"];
const Aquamarine = ["#7FFFD4"];
const Turquoise = ["#40E0D0"];
const MediumTurquoise = ["#48D1CC"];
const DarkTurquoise = ["#00CED1"];
const CadetBlue = ["#5F9EA0"];
const SteelBlue = ["#4682B4"];
const LightSteelBlue = ["#B0C4DE"];
const PowderBlue = ["#B0E0E6"];
const LightBlue = ["#ADD8E6"];
const SkyBlue = ["#87CEEB"];
const LightSkyBlue = ["#87CEFA"];
const DeepSkyBlue = ["#00BFFF"];
const DodgerBlue = ["#1E90FF"];
const CornflowerBlue = ["#6495ED"];
const RoyalBlue = ["#4169E1"];
const Blue = ["#0000FF"];
const MediumBlue = ["#0000CD"];
const DarkBlue = ["#00008B"];
const Navy = ["#000080"];
const MidnightBlue = ["#191970"];
const Cornsilk = ["#FFF8DC"];
const BlanchedAlmond = ["#FFEBCD"];
const Bisque = ["#FFE4C4"];
const NavajoWhite = ["#FFDEAD"];
const Wheat = ["#F5DEB3"];
const BurlyWood = ["#DEB887"];
const Tan = ["#D2B48C"];
const RosyBrown = ["#BC8F8F"];
const SandyBrown = ["#F4A460"];
const Goldenrod = ["#DAA520"];
const DarkGoldenrod = ["#B8860B"];
const Peru = ["#CD853F"];
const Chocolate = ["#D2691E"];
const SaddleBrown = ["#8B4513"];
const Sienna = ["#A0522D"];
const Brown = ["#A52A2A"];
const Maroon = ["#800000"];
const White = ["#FFFFFF"];
const Snow = ["#FFFAFA"];
const HoneyDew = ["#F0FFF0"];
const MintCream = ["#F5FFFA"];
const Azure = ["#F0FFFF"];
const AliceBlue = ["#F0F8FF"];
const GhostWhite = ["#F8F8FF"];
const WhiteSmoke = ["#F5F5F5"];
const SeaShell = ["#FFF5EE"];
const Beige = ["#F5F5DC"];
const OldLace = ["#FDF5E6"];
const FloralWhite = ["#FFFAF0"];
const Ivory = ["#FFFFF0"];
const AntiqueWhite = ["#FAEBD7"];
const Linen = ["#FAF0E6"];
const LavenderBlush = ["#FFF0F5"];
const MistyRose = ["#FFE4E1"];
const Gainsboro = ["#DCDCDC"];
const LightGray = ["#D3D3D3"];
const Silver = ["#C0C0C0"];
const DarkGray = ["#A9A9A9"];
const Gray = ["#808080"];
const DimGray = ["#696969"];
const LightSlateGray = ["#778899"];
const SlateGray = ["#708090"];
const DarkSlateGray = ["#2F4F4F"];
const Black = ["#000000"];
var WEBCOLOR = {
	IndianRed: IndianRed,
	LightCoral: LightCoral,
	Salmon: Salmon,
	DarkSalmon: DarkSalmon,
	LightSalmon: LightSalmon,
	Crimson: Crimson,
	Red: Red,
	FireBrick: FireBrick,
	DarkRed: DarkRed,
	Pink: Pink,
	LightPink: LightPink,
	HotPink: HotPink,
	DeepPink: DeepPink,
	MediumVioletRed: MediumVioletRed,
	PaleVioletRed: PaleVioletRed,
	Coral: Coral,
	Tomato: Tomato,
	OrangeRed: OrangeRed,
	DarkOrange: DarkOrange,
	Orange: Orange,
	Gold: Gold,
	Yellow: Yellow,
	LightYellow: LightYellow,
	LemonChiffon: LemonChiffon,
	LightGoldenrodYellow: LightGoldenrodYellow,
	PapayaWhip: PapayaWhip,
	Moccasin: Moccasin,
	PeachPuff: PeachPuff,
	PaleGoldenrod: PaleGoldenrod,
	Khaki: Khaki,
	DarkKhaki: DarkKhaki,
	Lavender: Lavender,
	Thistle: Thistle,
	Plum: Plum,
	Violet: Violet,
	Orchid: Orchid,
	Fuchsia: Fuchsia,
	Magenta: Magenta,
	MediumOrchid: MediumOrchid,
	MediumPurple: MediumPurple,
	RebeccaPurple: RebeccaPurple,
	BlueViolet: BlueViolet,
	DarkViolet: DarkViolet,
	DarkOrchid: DarkOrchid,
	DarkMagenta: DarkMagenta,
	Purple: Purple,
	Indigo: Indigo,
	SlateBlue: SlateBlue,
	DarkSlateBlue: DarkSlateBlue,
	MediumSlateBlue: MediumSlateBlue,
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
	Olive: Olive,
	DarkOliveGreen: DarkOliveGreen,
	MediumAquamarine: MediumAquamarine,
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
	PowderBlue: PowderBlue,
	LightBlue: LightBlue,
	SkyBlue: SkyBlue,
	LightSkyBlue: LightSkyBlue,
	DeepSkyBlue: DeepSkyBlue,
	DodgerBlue: DodgerBlue,
	CornflowerBlue: CornflowerBlue,
	RoyalBlue: RoyalBlue,
	Blue: Blue,
	MediumBlue: MediumBlue,
	DarkBlue: DarkBlue,
	Navy: Navy,
	MidnightBlue: MidnightBlue,
	Cornsilk: Cornsilk,
	BlanchedAlmond: BlanchedAlmond,
	Bisque: Bisque,
	NavajoWhite: NavajoWhite,
	Wheat: Wheat,
	BurlyWood: BurlyWood,
	Tan: Tan,
	RosyBrown: RosyBrown,
	SandyBrown: SandyBrown,
	Goldenrod: Goldenrod,
	DarkGoldenrod: DarkGoldenrod,
	Peru: Peru,
	Chocolate: Chocolate,
	SaddleBrown: SaddleBrown,
	Sienna: Sienna,
	Brown: Brown,
	Maroon: Maroon,
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
	Gray: Gray,
	DimGray: DimGray,
	LightSlateGray: LightSlateGray,
	SlateGray: SlateGray,
	DarkSlateGray: DarkSlateGray,
	Black: Black
};

const Vermilion = ["#EF454A","バーミリオン"];
const Maroon$1 = ["#662B2C","マルーン"];
const Pink$1 = ["#EA9198","ピンク"];
const Bordeaux = ["#533638","ボルドー"];
const Red$1 = ["#DF3447","レッド"];
const Burgundy = ["#442E31","バーガンディー"];
const Rose = ["#DB3561","ローズ"];
const Carmine = ["#BE0039","カーマイン"];
const Strawberry = ["#BB004B","ストロベリー"];
const Magenta$1 = ["#D13A84","マゼンタ"];
const Orchid$1 = ["#C69CC5","オーキッド"];
const Purple$1 = ["#A757A8","パープル"];
const Lilac = ["#C29DC8","ライラック"];
const Lavender$1 = ["#9A8A9F","ラベンダー"];
const Mauve = ["#855896","モーブ"];
const Violet$1 = ["#714C99","バイオレット"];
const Heliotrope = ["#8865B2","ヘリオトロープ"];
const Pansy = ["#433171","パンジー"];
const Wistaria = ["#7967C3","ウイスタリア"];
const Hyacinth = ["#6E82AD","ヒヤシンス"];
const Blue$1 = ["#006FAB","ブルー"];
const Cyan$1 = ["#009CD1","シアン"];
const Viridian = ["#006D56","ビリジアン"];
const Green$1 = ["#009A57","グリーン"];
const Yellow$1 = ["#F4D500","イエロー"];
const Olive$1 = ["#5C5424","オリーブ"];
const Marigold = ["#FFA400","マリーゴールド"];
const Leghorn = ["#DFC291","レグホーン"];
const Ivory$1 = ["#DED2BF","アイボリー"];
const Sepia = ["#483C2C","セピア"];
const Bronze = ["#7A592F","ブロンズ"];
const Beige$1 = ["#BCA78D","ベージュ"];
const Amber = ["#AA7A40","アンバー"];
const Buff = ["#C09567","バフ"];
const Orange$1 = ["#EF810F","オレンジ"];
const Tan$1 = ["#9E6C3F","タン"];
const Apricot = ["#D89F6D","アプリコット"];
const Cork = ["#9F7C5C","コルク"];
const Brown$1 = ["#6D4C33","ブラウン"];
const Peach = ["#E8BDA5","ピーチ"];
const Blond = ["#F6A57D","ブロンド"];
const Khaki$1 = ["#A36851","カーキー"];
const Chocolate$1 = ["#503830","チョコレート"];
const Terracotta = ["#A95045","テラコッタ"];
const Scarlet = ["#DE3838","スカーレット"];
const White$1 = ["#F0F0F0","ホワイト"];
const Grey = ["#767676","グレイ"];
const Black$1 = ["#212121","ブラック"];
var JISCOLOR_EN = {
	Vermilion: Vermilion,
	Maroon: Maroon$1,
	Pink: Pink$1,
	Bordeaux: Bordeaux,
	Red: Red$1,
	Burgundy: Burgundy,
	Rose: Rose,
	Carmine: Carmine,
	Strawberry: Strawberry,
	Magenta: Magenta$1,
	Orchid: Orchid$1,
	Purple: Purple$1,
	Lilac: Lilac,
	Lavender: Lavender$1,
	Mauve: Mauve,
	Violet: Violet$1,
	Heliotrope: Heliotrope,
	Pansy: Pansy,
	Wistaria: Wistaria,
	Hyacinth: Hyacinth,
	Blue: Blue$1,
	Cyan: Cyan$1,
	Viridian: Viridian,
	Green: Green$1,
	Yellow: Yellow$1,
	Olive: Olive$1,
	Marigold: Marigold,
	Leghorn: Leghorn,
	Ivory: Ivory$1,
	Sepia: Sepia,
	Bronze: Bronze,
	Beige: Beige$1,
	Amber: Amber,
	Buff: Buff,
	Orange: Orange$1,
	Tan: Tan$1,
	Apricot: Apricot,
	Cork: Cork,
	Brown: Brown$1,
	Peach: Peach,
	Blond: Blond,
	Khaki: Khaki$1,
	Chocolate: Chocolate$1,
	Terracotta: Terracotta,
	Scarlet: Scarlet,
	White: White$1,
	Grey: Grey,
	Black: Black$1,
	"Tomato Red": ["#DF3447","トマトレッド"],
	"Coral Red": ["#FF7F8F","コーラルレッド"],
	"Old Rose": ["#C67A85","オールドローズ"],
	"Poppy Red": ["#DF334E","ポピーレッド"],
	"Signal red": ["#CE2143","シグナルレッド"],
	"Rose Pink": ["#EE8EA0","ローズピンク"],
	"Wine Red": ["#80273F","ワインレッド"],
	"Cochineal Red": ["#AE2B52","コチニールレッド"],
	"Rose Red": ["#CA4775","ローズレッド"],
	"Ruby Red": ["#B90B50","ルビーレッド"],
	"Cherry Pink": ["#D35889","チェリーピンク"],
	"Charcoal Grey": ["#4B474D","チャコールグレイ"],
	"Steel Grey": ["#6D696F","スチールグレイ"],
	"Oriental Blue": ["#304285","オリエンタルブルー"],
	"Ultramarine Blue": ["#384D98","ウルトラマリンブルー"],
	"Navy Blue": ["#343D55","ネービーブルー"],
	"Midnight Blue": ["#252A35","ミッドナイトブルー"],
	"Prussian Blue": ["#3A4861","プルシャンブルー"],
	"Iron Blue": ["#3A4861","アイアンブルー"],
	"Slate Grey": ["#515356","スレートグレイ"],
	"Sax Blue": ["#5A7993","サックスブルー"],
	"Baby Blue": ["#A3BACD","ベビーブルー"],
	"Cobalt Blue": ["#0062A0","コバルトブルー"],
	"Sky Blue": ["#89BDDE","スカイブルー"],
	"Sky Grey": ["#B3B8BB","スカイグレイ"],
	"Horizon Blue": ["#87AFC5","ホリゾンブルー"],
	"Cerulean Blue": ["#0073A2","セルリアンブルー"],
	"Marine Blue": ["#00526B","マリンブルー"],
	"Turquoise Blue": ["#009DBF","ターコイズブルー"],
	"Peacock Blue": ["#006E7B","ピーコックブルー"],
	"Nile Blue": ["#3D8E95","ナイルブルー"],
	"Peacock Green": ["#007D7F","ピーコックグリーン"],
	"Billiard Green": ["#00483A","ビリヤードグリーン"],
	"Forest Green": ["#2A7762","フォレストグリーン"],
	"Emerald Green": ["#00A474","エメラルドグリーン"],
	"Cobalt Green": ["#09C289","コバルトグリーン"],
	"Malachite Green": ["#007E4E","マラカイトグリーン"],
	"Bottle Green": ["#204537","ボトルグリーン"],
	"Mint Green": ["#58CE91","ミントグリーン"],
	"Apple Green": ["#A2D29E","アップルグリーン"],
	"Ivy Green": ["#4C6733","アイビーグリーン"],
	"Sea Green": ["#97B64D","シーグリーン"],
	"Leaf Green": ["#89983B","リーフグリーン"],
	"Grass Green": ["#737C3E","グラスグリーン"],
	"Chartreuse Green": ["#C0D136","シャトルーズグリーン"],
	"Olive Green": ["#575531","オリーブグリーン"],
	"Lemon Yellow": ["#D9CA00","レモンイエロー"],
	"Jaune Brillant": ["#F4D500","ジョンブリアン"],
	"Canary Yellow": ["#EDD634","カナリヤ"],
	"Olive Drab": ["#655F47","オリーブドラブ"],
	"Chrome Yellow": ["#F6BF00","クロムイエロー"],
	"Cream Yellow": ["#E4D3A2","クリームイエロー"],
	"Raw umber": ["#765B1B","ローアンバー"],
	"Naples Yellow": ["#EEC063","ネープルスイエロー"],
	"Yellow Ocher": ["#B8883B","イエローオーカー"],
	"Burnt Umber": ["#57462D","バーントアンバー"],
	"Mandarin Orange": ["#F09629","マンダリンオレンジ"],
	"Golden Yellow": ["#E89A3C","ゴールデンイエロー"],
	"Ecru Beige": ["#F5CDA6","エクルベイジュ"],
	"Raw Sienna": ["#B1632A","ローシェンナ"],
	"Cocoa Brown": ["#704B38","ココアブラウン"],
	"Nail Pink": ["#EFBAA8","ネールピンク"],
	"Carrot Orange": ["#C55431","キャロットオレンジ"],
	"Burnt Sienna": ["#A2553C","バーントシェンナ"],
	"Shell Pink": ["#F9C9B9","シェルピンク"],
	"Chinese Red": ["#FD5A2A","チャイニーズレッド"],
	"Salmon pink": ["#FF9E8C","サーモンピンク"],
	"Baby Pink": ["#FEC6C5","ベビーピンク"],
	"Rose Grey": ["#8C8080","ローズグレイ"],
	"Snow White": ["#F0F0F0","スノーホワイト"],
	"Pearl Grey": ["#AAAAAA","パールグレイ"],
	"Silver Grey": ["#9C9C9C","シルバーグレイ"],
	"Ash Grey": ["#8F8F8F","アッシュグレイ"],
	"Lamp Black": ["#212121","ランプブラック"]
};

var JISCOLOR_JA = {
	"朱色": ["#EF454A","しゅいろ"],
	"蘇芳": ["#94474B","すおう"],
	"桃色": ["#E38089","ももいろ"],
	"紅梅色": ["#DF828A","こうばいいろ"],
	"臙脂": ["#AD3140","えんじ"],
	"珊瑚色": ["#FF7F8F","さんごいろ"],
	"桜色": ["#FBDADE","さくらいろ"],
	"茜色": ["#9E2236","あかねいろ"],
	"韓紅": ["#E64B6B","からくれない"],
	"紅赤": ["#B81A3E","べにあか"],
	"薔薇色": ["#D53E62","ばらいろ"],
	"赤": ["#BE0032","あか"],
	"鴇色": ["#FA9CB8","ときいろ"],
	"紅色": ["#BE003F","べにいろ"],
	"躑躅色": ["#CF4078","つつじいろ"],
	"赤紫": ["#DA508F","あかむらさき"],
	"牡丹色": ["#C94093","ぼたんいろ"],
	"菖蒲色": ["#744B98","しょうぶいろ"],
	"茄子紺": ["#473946","なすこん"],
	"紫紺": ["#422C41","しこん"],
	"古代紫": ["#765276","こだいむらさき"],
	"紫": ["#A757A8","むらさき"],
	"江戸紫": ["#614876","えどむらさき"],
	"鳩羽色": ["#665971","はとばいろ"],
	"菫色": ["#714C99","すみれいろ"],
	"青紫": ["#7445AA","あおむらさき"],
	"藤紫": ["#9883C9","ふじむらさき"],
	"藤色": ["#A294C8","ふじいろ"],
	"藤納戸": ["#69639A","ふじなんど"],
	"紺藍": ["#353573","こんあい"],
	"鉄紺": ["#292934","てつこん"],
	"桔梗色": ["#4347A2","ききょういろ"],
	"勝色": ["#3A3C4F","かちいろ"],
	"群青色": ["#384D98","ぐんじょういろ"],
	"杜若色": ["#435AA0","かきつばたいろ"],
	"紺色": ["#343D55","こんいろ"],
	"紺青": ["#3A4861","こんじょう"],
	"瑠璃紺": ["#27477A","るりこん"],
	"勿忘草色": ["#89ACD7","わすれなぐさいろ"],
	"鉛色": ["#72777D","なまりいろ"],
	"瑠璃色": ["#00519A","るりいろ"],
	"濃藍": ["#223546","こいあい"],
	"縹色": ["#2B618F","はなだいろ"],
	"藍色": ["#2B4B65","あいいろ"],
	"青": ["#006AB6","あお"],
	"空色": ["#89BDDE","そらいろ"],
	"露草色": ["#007BC3","つゆくさいろ"],
	"藍鼠": ["#576D79","あいねず"],
	"水色": ["#9DCCE0","みずいろ"],
	"甕覗き": ["#7EB1C1","かめのぞき"],
	"白群": ["#73B3C1","びゃくぐん"],
	"納戸色": ["#00687C","なんどいろ"],
	"浅葱色": ["#00859B","あさぎいろ"],
	"新橋色": ["#53A8B7","しんばしいろ"],
	"水浅葱": ["#6D969C","みずあさぎ"],
	"錆浅葱": ["#608A8E","さびあさぎ"],
	"青緑": ["#008E94","あおみどり"],
	"鉄色": ["#24433E","てついろ"],
	"青竹色": ["#6AA89D","あおたけいろ"],
	"若竹色": ["#00A37E","わかたけいろ"],
	"萌葱色": ["#00533E","もえぎいろ"],
	"青磁色": ["#6DA895","せいじいろ"],
	"常磐色": ["#007B50","ときわいろ"],
	"深緑": ["#005638","ふかみどり"],
	"緑": ["#00B66E","みどり"],
	"千歳緑": ["#3C6754","ちとせみどり"],
	"緑青色": ["#4D8169","ろくしょういろ"],
	"白緑": ["#BADBC7","びゃくろく"],
	"利休鼠": ["#6E7972","りきゅうねずみ"],
	"松葉色": ["#687E52","まつばいろ"],
	"若葉色": ["#A9C087","わかばいろ"],
	"草色": ["#737C3E","くさいろ"],
	"萌黄": ["#97A61E","もえぎ"],
	"若草色": ["#AAB300","わかくさいろ"],
	"黄緑": ["#BBC000","きみどり"],
	"苔色": ["#7C7A37","こけいろ"],
	"鶸色": ["#C2BD3D","ひわいろ"],
	"鶯色": ["#706C3E","うぐいすいろ"],
	"黄檗色": ["#D6C949","きはだいろ"],
	"抹茶色": ["#C0BA7F","まっちゃいろ"],
	"中黄": ["#EDD60E","ちゅうき"],
	"蒲公英色": ["#E3C700","たんぽぽいろ"],
	"黄色": ["#E3C700","きいろ"],
	"刈安色": ["#EAD56B","かりやすいろ"],
	"海松色": ["#716B4A","みるいろ"],
	"鶯茶": ["#6A5F37","うぐいすちゃ"],
	"鬱金色": ["#EDAE00","うこんいろ"],
	"向日葵色": ["#FFBB00","ひまわりいろ"],
	"山吹色": ["#F8A900","やまぶきいろ"],
	"芥子色": ["#C8A65D","からしいろ"],
	"金茶": ["#B47700","きんちゃ"],
	"黄土色": ["#B8883B","おうどいろ"],
	"砂色": ["#C5B69E","すないろ"],
	"象牙色": ["#DED2BF","ぞうげいろ"],
	"胡粉色": ["#EBE7E1","ごふんいろ"],
	"卵色": ["#F4BD6B","たまごいろ"],
	"蜜柑色": ["#EB8400","みかんいろ"],
	"褐色": ["#6B3E08","かっしょく"],
	"土色": ["#9F6C31","つちいろ"],
	"琥珀色": ["#AA7A40","こはくいろ"],
	"朽葉色": ["#847461","くちばいろ"],
	"煤竹色": ["#5D5245","すすたけいろ"],
	"小麦色": ["#D4A168","こむぎいろ"],
	"生成り色": ["#EAE0D5","きなりいろ"],
	"橙色": ["#EF810F","だいだいいろ"],
	"杏色": ["#D89F6D","あんずいろ"],
	"柑子色": ["#FAA55C","こうじいろ"],
	"黄茶": ["#B1632A","きちゃ"],
	"茶色": ["#6D4C33","ちゃいろ"],
	"肌色": ["#F1BB93","はだいろ"],
	"駱駝色": ["#B0764F","らくだいろ"],
	"灰茶": ["#816551","はいちゃ"],
	"焦茶": ["#564539","こげちゃ"],
	"黄赤": ["#D86011","きあか"],
	"茶鼠": ["#998D86","ちゃねずみ"],
	"代赭": ["#B26235","たいしゃ"],
	"栗色": ["#704B38","くりいろ"],
	"黒茶": ["#3E312B","くろちゃ"],
	"桧皮色": ["#865C4B","ひわだいろ"],
	"樺色": ["#B64826","かばいろ"],
	"柿色": ["#DB5C35","かきいろ"],
	"黄丹": ["#EB6940","おうに"],
	"煉瓦色": ["#914C35","れんがいろ"],
	"肉桂色": ["#B5725C","にっけいいろ"],
	"錆色": ["#624035","さびいろ"],
	"赤橙": ["#E65226","あかだいだい"],
	"赤錆色": ["#8D3927","あかさびいろ"],
	"赤茶": ["#AD4E39","あかちゃ"],
	"金赤": ["#EA4E31","きんあか"],
	"海老茶": ["#693C34","えびちゃ"],
	"小豆色": ["#905D54","あずきいろ"],
	"弁柄色": ["#863E33","べんがらいろ"],
	"紅海老茶": ["#6D3A33","べにえびちゃ"],
	"鳶色": ["#7A453D","とびいろ"],
	"鉛丹色": ["#D1483E","えんたんいろ"],
	"紅樺色": ["#9E413F","べにかばいろ"],
	"紅緋": ["#EF4644","べにひ"],
	"白": ["#F0F0F0","しろ"],
	"銀鼠": ["#9C9C9C","ぎんねず"],
	"鼠色": ["#838383","ねずみいろ"],
	"灰色": ["#767676","はいいろ"],
	"墨": ["#343434","すみ"],
	"鉄黒": ["#2A2A2A","てつぐろ"],
	"黒": ["#2A2A2A","くろ"]
};

const Red$2 = ["#ffebee","#ffcdd2","#ef9a9a","#e57373","#ef5350","#f44336","#e53935","#d32f2f","#c62828","#b71c1c","#ff8a80","#ff5252","#ff1744","#d50000"];
const Pink$2 = ["#fce4ec","#f8bbd0","#f48fb1","#f06292","#ec407a","#e91e63","#d81b60","#c2185b","#ad1457","#880e4f","#ff80ab","#ff4081","#f50057","#c51162"];
const Purple$2 = ["#f3e5f5","#e1bee7","#ce93d8","#ba68c8","#ab47bc","#9c27b0","#8e24aa","#7b1fa2","#6a1b9a","#4a148c","#ea80fc","#e040fb","#d500f9","#aa00ff"];
const DeepPurple = ["#ede7f6","#d1c4e9","#b39ddb","#9575cd","#7e57c2","#673ab7","#5e35b1","#512da8","#4527a0","#311b92","#b388ff","#7c4dff","#651fff","#6200ea"];
const Indigo$1 = ["#e8eaf6","#c5cae9","#9fa8da","#7986cb","#5c6bc0","#3f51b5","#3949ab","#303f9f","#283593","#1a237e","#8c9eff","#536dfe","#3d5afe","#304ffe"];
const Blue$2 = ["#e3f2fd","#bbdefb","#90caf9","#64b5f6","#42a5f5","#2196f3","#1e88e5","#1976d2","#1565c0","#0d47a1","#82b1ff","#448aff","#2979ff","#2962ff"];
const LightBlue$1 = ["#e1f5fe","#b3e5fc","#81d4fa","#4fc3f7","#29b6f6","#03a9f4","#039be5","#0288d1","#0277bd","#01579b","#80d8ff","#40c4ff","#00b0ff","#0091ea"];
const Cyan$2 = ["#e0f7fa","#b2ebf2","#80deea","#4dd0e1","#26c6da","#00bcd4","#00acc1","#0097a7","#00838f","#006064","#84ffff","#18ffff","#00e5ff","#00b8d4"];
const Teal$1 = ["#e0f2f1","#b2dfdb","#80cbc4","#4db6ac","#26a69a","#009688","#00897b","#00796b","#00695c","#004d40","#a7ffeb","#64ffda","#1de9b6","#00bfa5"];
const Green$2 = ["#e8f5e9","#c8e6c9","#a5d6a7","#81c784","#66bb6a","#4caf50","#43a047","#388e3c","#2e7d32","#1b5e20","#b9f6ca","#69f0ae","#00e676","#00c853"];
const LightGreen$1 = ["#f1f8e9","#dcedc8","#c5e1a5","#aed581","#9ccc65","#8bc34a","#7cb342","#689f38","#558b2f","#33691e","#ccff90","#b2ff59","#76ff03","#64dd17"];
const Lime$1 = ["#f9fbe7","#f0f4c3","#e6ee9c","#dce775","#d4e157","#cddc39","#c0ca33","#afb42b","#9e9d24","#827717","#f4ff81","#eeff41","#c6ff00","#aeea00"];
const Yellow$2 = ["#fffde7","#fff9c4","#fff59d","#fff176","#ffee58","#ffeb3b","#fdd835","#fbc02d","#f9a825","#f57f17","#ffff8d","#ffff00","#ffea00","#ffd600"];
const Amber$1 = ["#fff8e1","#ffecb3","#ffe082","#ffd54f","#ffca28","#ffc107","#ffb300","#ffa000","#ff8f00","#ff6f00","#ffe57f","#ffd740","#ffc400","#ffab00"];
const Orange$2 = ["#fff3e0","#ffe0b2","#ffcc80","#ffb74d","#ffa726","#ff9800","#fb8c00","#f57c00","#ef6c00","#e65100","#ffd180","#ffab40","#ff9100","#ff6d00"];
const DeepOrange = ["#fbe9e7","#ffccbc","#ffab91","#ff8a65","#ff7043","#ff5722","#f4511e","#e64a19","#d84315","#bf360c","#ff9e80","#ff6e40","#ff3d00","#dd2c00"];
const Brown$2 = ["#efebe9","#d7ccc8","#bcaaa4","#a1887f","#8d6e63","#795548","#6d4c41","#5d4037","#4e342e","#3e2723"];
const Grey$1 = ["#fafafa","#f5f5f5","#eeeeee","#e0e0e0","#bdbdbd","#9e9e9e","#757575","#616161","#424242","#212121"];
const BlueGrey = ["#eceff1","#cfd8dc","#b0bec5","#90a4ae","#78909c","#607d8b","#546e7a","#455a64","#37474f","#263238"];
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

const Beige$2 = ["#D0B084",1001];
const Ivory$2 = ["#E1CC4F",1014];
const Curry = ["#9D9101",1027];
const Vermilion$1 = ["#CB2821",2002];
const Cored = ["#B32821",3016];
const Rose$1 = ["#E63244",3017];
const Luminous = ["#FE0000",3026];
const Telemagenta = ["#CF3476",4010];
const braun = ["#45322E",8017];
const Cream = ["#FDF4E3",9001];
const schwarz = ["#1E1E1E",9017];
var RALCOLOUR = {
	Beige: Beige$2,
	Ivory: Ivory$2,
	Curry: Curry,
	Vermilion: Vermilion$1,
	Cored: Cored,
	Rose: Rose$1,
	Luminous: Luminous,
	Telemagenta: Telemagenta,
	braun: braun,
	Cream: Cream,
	schwarz: schwarz,
	"Green beige": ["#CDBA88",1000],
	"Sand yellow": ["#D2AA6D",1002],
	"Signal yellow": ["#F9A800",1003],
	"Golden yellow": ["#CDA434",1004],
	"Honey yellow": ["#CB8E00",1005],
	"Maize yellow": ["#E29000",1006],
	"Daffodil yellow": ["#DC9D00",1007],
	"Brown beige": ["#AF804F",1011],
	"Lemon yellow": ["#C7B446",1012],
	"Oyster white": ["#E3D9C6",1013],
	"Light ivory": ["#E6D690",1015],
	"Sulfur yellow": ["#EDFF21",1016],
	"Saffron yellow": ["#F5D033",1017],
	"Zinc yellow": ["#F8F32B",1018],
	"Grey beige": ["#9E9764",1019],
	"Olive yellow": ["#999950",1020],
	"Rape yellow": ["#F3DA0B",1021],
	"Traffic yellow": ["#FAD201",1023],
	"Ochre yellow": ["#AEA04B",1024],
	"Luminous yellow": ["#FFFF00",1026],
	"Melon yellow": ["#F4A900",1028],
	"Broom yellow": ["#D6AE01",1032],
	"Dahlia yellow": ["#F3A505",1033],
	"Pastel yellow": ["#EFA94A",1034],
	"Pearl beige": ["#6A5D4D",1035],
	"Pearl gold": ["#705335",1036],
	"Sun yellow": ["#F39F18",1037],
	"Yellow orange": ["#ED760E",2000],
	"Red orange": ["#C93C20",2001],
	"Pastel orange": ["#FF7514",2003],
	"Pure orange": ["#F44611",2004],
	"Luminous orange": ["#FF2301",2005],
	"Luminous bright orange": ["#FFA420",2007],
	"Bright red orange": ["#F75E25",2008],
	"Traffic orange": ["#F54021",2009],
	"Signal orange": ["#D84B20",2010],
	"Deep orange": ["#EC7C26",2011],
	"Salmon range": ["#E55137",2012],
	"Pearl orange": ["#C35831",2013],
	"Flame red": ["#AF2B1E",3000],
	"Signal red": ["#A52019",3001],
	"Carmine red": ["#A2231D",3002],
	"Ruby red": ["#9B111E",3003],
	"Purple red": ["#75151E",3004],
	"Wine red": ["#5E2129",3005],
	"Black red": ["#412227",3007],
	"Oxide red": ["#642424",3009],
	"Brown red": ["#781F19",3011],
	"Beige red": ["#C1876B",3012],
	"Tomato red": ["#A12312",3013],
	"Antique pink": ["#D36E70",3014],
	"Light pink": ["#EA899A",3015],
	"Strawberry red": ["#D53032",3018],
	"Traffic red": ["#CC0605",3020],
	"Salmon pink": ["#D95030",3022],
	"Luminous red": ["#F80000",3024],
	"Raspberry red": ["#C51D34",3027],
	"Pure  red": ["#CB3234",3028],
	"Orient red": ["#B32428",3031],
	"Pearl ruby red": ["#721422",3032],
	"Pearl pink": ["#B44C43",3033],
	"Red lilac": ["#6D3F5B",4001],
	"Red violet": ["#922B3E",4002],
	"Heather violet": ["#DE4C8A",4003],
	"Claret violet": ["#641C34",4004],
	"Blue lilac": ["#6C4675",4005],
	"Traffic purple": ["#A03472",4006],
	"Purple violet": ["#4A192C",4007],
	"Signal violet": ["#924E7D",4008],
	"Pastel violet": ["#A18594",4009],
	"Pearl violet": ["#8673A1",4011],
	"Pearl black berry": ["#6C6874",4012],
	"Violet blue": ["#354D73",5000],
	"Green blue": ["#1F3438",5001],
	"Ultramarine blue": ["#20214F",5002],
	"Saphire blue": ["#1D1E33",5003],
	"Black blue": ["#18171C",5004],
	"Signal blue": ["#1E2460",5005],
	"Brillant blue": ["#3E5F8A",5007],
	"Grey blue": ["#26252D",5008],
	"Azure blue": ["#025669",5009],
	"Gentian blue": ["#0E294B",5010],
	"Steel blue": ["#231A24",5011],
	"Light blue": ["#3B83BD",5012],
	"Cobalt blue": ["#1E213D",5013],
	"Pigeon blue": ["#606E8C",5014],
	"Sky blue": ["#2271B3",5015],
	"Traffic blue": ["#063971",5017],
	"Turquoise blue": ["#3F888F",5018],
	"Capri blue": ["#1B5583",5019],
	"Ocean blue": ["#1D334A",5020],
	"Water blue": ["#256D7B",5021],
	"Night blue": ["#252850",5022],
	"Distant blue": ["#49678D",5023],
	"Pastel blue": ["#5D9B9B",5024],
	"Pearl gentian blue": ["#2A6478",5025],
	"Pearl night blue": ["#102C54",5026],
	"Patina green": ["#316650",6000],
	"Emerald green": ["#287233",6001],
	"Leaf green": ["#2D572C",6002],
	"Olive green": ["#424632",6003],
	"Blue green": ["#1F3A3D",6004],
	"Moss green": ["#2F4538",6005],
	"Grey olive": ["#3E3B32",6006],
	"Bottle green": ["#343B29",6007],
	"Brown green": ["#39352A",6008],
	"Fir green": ["#31372B",6009],
	"Grass green": ["#35682D",6010],
	"Reseda green": ["#587246",6011],
	"Black green": ["#343E40",6012],
	"Reed green": ["#6C7156",6013],
	"Yellow olive": ["#47402E",6014],
	"Black olive": ["#3B3C36",6015],
	"Turquoise green": ["#1E5945",6016],
	"May green": ["#4C9141",6017],
	"Yellow green": ["#57A639",6018],
	"Pastel green": ["#BDECB6",6019],
	"Chrome green": ["#2E3A23",6020],
	"Pale green": ["#89AC76",6021],
	"Olive drab": ["#25221B",6022],
	"Traffic green": ["#308446",6024],
	"Fern green": ["#3D642D",6025],
	"Opal green": ["#015D52",6026],
	"Light green": ["#84C3BE",6027],
	"Pine green": ["#2C5545",6028],
	"Mint green": ["#20603D",6029],
	"Signal green": ["#317F43",6032],
	"Mint turquoise": ["#497E76",6033],
	"Pastel turquoise": ["#7FB5B5",6034],
	"Pearl green": ["#1C542D",6035],
	"Pearl opal green": ["#193737",6036],
	"Pure green": ["#008F39",6037],
	"Luminous green": ["#00BB2D",6038],
	"Squirrel grey": ["#78858B",7000],
	"Silver grey": ["#8A9597",7001],
	"Olive grey": ["#7E7B52",7002],
	"Moss grey": ["#6C7059",7003],
	"Signal grey": ["#969992",7004],
	"Mouse grey": ["#646B63",7005],
	"Beige grey": ["#6D6552",7006],
	"Khaki grey": ["#6A5F31",7008],
	"Green grey": ["#4D5645",7009],
	"Tarpaulin grey": ["#4C514A",7010],
	"Iron grey": ["#434B4D",7011],
	"Basalt grey": ["#4E5754",7012],
	"Brown grey": ["#464531",7013],
	"Slate grey": ["#434750",7015],
	"Anthracite grey": ["#293133",7016],
	"Black grey": ["#23282B",7021],
	"Umbra grey": ["#332F2C",7022],
	"Concrete grey": ["#686C5E",7023],
	"Graphite grey": ["#474A51",7024],
	"Granite grey": ["#2F353B",7026],
	"Stone grey": ["#8B8C7A",7030],
	"Blue grey": ["#474B4E",7031],
	"Pebble grey": ["#B8B799",7032],
	"Cement grey": ["#7D8471",7033],
	"Yellow grey": ["#8F8B66",7034],
	"Light grey": ["#D7D7D7",7035],
	"Platinum grey": ["#7F7679",7036],
	"Dusty grey": ["#7D7F7D",7037],
	"Agate grey": ["#B5B8B1",7038],
	"Quartz grey": ["#6C6960",7039],
	"Window grey": ["#9DA1AA",7040],
	"Traffic grey A": ["#8D948D",7042],
	"Traffic grey B": ["#4E5452",7043],
	"Silk grey": ["#CAC4B0",7044],
	"Telegrey 1": ["#909090",7045],
	"Telegrey 2": ["#82898F",7046],
	"Telegrey 4": ["#D0D0D0",7047],
	"Pearl mouse grey": ["#898176",7048],
	"Green brown": ["#826C34",8000],
	"Ochre brown": ["#955F20",8001],
	"Signal brown": ["#6C3B2A",8002],
	"Clay brown": ["#734222",8003],
	"Copper brown": ["#8E402A",8004],
	"Fawn brown": ["#59351F",8007],
	"Olive brown": ["#6F4F28",8008],
	"Nut brown": ["#5B3A29",8011],
	"Red brown": ["#592321",8012],
	"Sepia brown": ["#382C1E",8014],
	"Chestnut brown": ["#633A34",8015],
	"Mahogany brown": ["#4C2F27",8016],
	"Grey brown": ["#403A3A",8019],
	"Black brown": ["#212121",8022],
	"Orange brown": ["#A65E2E",8023],
	"Beige brown": ["#79553D",8024],
	"Pale brown": ["#755C48",8025],
	"Terra brown": ["#4E3B31",8028],
	"Pearl copper": ["#763C28",8029],
	"Grey white": ["#E7EBDA",9002],
	"Signal white": ["#F4F4F4",9003],
	"Signal black": ["#282828",9004],
	"Jet black": ["#0A0A0A",9005],
	"White aluminium": ["#A5A5A5",9006],
	"Grey aluminium": ["#8F8F8F",9007],
	"Pure white": ["#FFFFFF",9010],
	"Graphite black": ["#1C1C1C",9011],
	"Traffic white": ["#F6F6F6",9016],
	"Papyrus white": ["#D7D7D7",9018],
	"Pearl light grey": ["#9C9C9C",9022],
	"Pearl dark grey": ["#828282",9023]
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
	YellowC: YellowC,
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
	"HEXACHROME®BlackC": "#202121",
	"HEXACHROME®CyanC": "#008fd0",
	"HEXACHROME®GreenC": "#00b04a",
	"HEXACHROME®MagentaC": "#de0090",
	"HEXACHROME®OrangeC": "#ff7c00",
	"HEXACHROME®YellowC": "#ffe000"
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
	YellowU: YellowU,
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
	"HEXACHROME®BlackU": "#524f4d",
	"HEXACHROME®CyanU": "#0097d1",
	"HEXACHROME®GreenU": "#00b166",
	"HEXACHROME®MagentaU": "#df3e91",
	"HEXACHROME®OrangeU": "#ff7e38",
	"HEXACHROME®YellowU": "#ffe210"
};

riot$1.tag2('color-tip', '<div class="tip" title="{title}" riot-style="background-color: {color};"></div>', '.tip{ width: 20px; height: 20px; margin:0; padding:0; display:inline-block; }', 'class="tip"', function(opts) {
    this.title = this.name + ' : ' + this.color;
});

riot$1.tag2('color-lists', '<div class="wrapper"> <select name="colorlists" id="colorlists" onchange="{colorListLord}"> <option each="{colorlistData}" value="{name}">{name}</option> </select> <div class="scrollbar-wrapper"> <div class="scrollbar-body"> <div ref="colortips" class="scrollbar-content"> <color-tip each="{colorlists}"></color-tip> </div> </div> </div> </div>', '#colorlists { width: 280px; font-size: 20px; margin: 10px 0; display: block; } #colorlists option { background: #fff; color: #111; } #colorlists option:hover { background: aquamarine; } .wrapper { position: relative; height: calc(100% - 420px); margin: 0; } .scrollbar-wrapper { position: relative; height: 100%; overflow: hidden; } .scrollbar-body { width: calc(100% + 17px); height: 100%; overflow-y: scroll; } .scrollbar-content { display: flex; flex-wrap: wrap; }', '', function(opts) {

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
    this.colorlistData = [
      { name: 'Web Color',
        list: parser(WEBCOLOR) },
      { name: 'JIS EN',
        list: parser(JISCOLOR_EN) },
      { name: 'JIS JA',
        list: parser(JISCOLOR_JA) },
      { name: 'GOOGLE MATERIAL',
        list: Object.keys(MATERIALCOLOR).reduce((ary, key) => {
          MATERIALCOLOR[key].forEach((color, i) => {
            let name = key;
            if (i === 0)      name += 50;
            else if (i < 10)  name += i * 100;
            else if (i >= 10) name += ['A100', 'A200', 'A400', 'A700'][i % 10];
            ary.push({name, color});
          });
          return ary
        }, []) },
      { name: 'RAL',
        list: parser(RALCOLOUR) },
      { name: 'PANTONE® Goe™ Coated',
        list: pantone(GOE_COATED) },
      { name: 'PANTONE® Goe™ Uncoated',
        list: pantone(GOE_UNCOATED) },
      { name: 'PANTONE® solid Coated',
        list: pantone(SOLID_COATED) },
      { name: 'PANTONE® solid Uncoated',
        list: pantone(SOLID_UNCOATED) },
    ];

    this.colorlists = this.colorlistData[0].list;

    this.colorListLord = (e) => {
      this.colorlists = this.colorlistData.find(({name}) => name === e.target.value).list;
    };

    this.on('mount', () => {
      this.refs.colortips.addEventListener('click', (e) => {
        const el = e.target;
        if (el.classList.contains('tip')) {
          const [name, color] = el.title.split(' : ');
          store.trigger('add_card', {name, color});
        }
      });
      this.refs.colortips.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const el = e.target;
        if (el.classList.contains('tip')) {
          const [name, color] = el.title.split(' : ');
          store.trigger('menu_open', e, {name, color: tinycolor(color)}, 'tip');
        }
      });
    });
});

riot$1.tag2('context-menu', '<div id="menu" ref="menu" show="{mode}"> <p class="menuitem" onclick="{addCard}" if="{mode == \'tip\'}">ADD CARD</p> <p class="menuitem" onclick="{removeCard}" if="{mode == \'card\'}">DELETE</p> <p class="menuitem" onclick="{duplicateCard}" if="{mode == \'card\'}">DUPLICATE</p> <p class="menuitem" onclick="{setBgColor}">SET BACKGROUND</p> <p class="menuitem"> <span>COPY:</span> <span each="{key in copys}" class="menuitem" onclick="{copyColor}">{key}</span> </p> <p class="menuitem" if="{mode == \'card\'}"> <span>SIZE:</span> <span each="{key in sizes}" class="menuitem" onclick="{setSize}">{key}</span> </p> </div>', '#menu { position: absolute; font-size:12px; background: #fff; border: solid 1px silver; z-index: 100; } .menuitem { min-width: 100px; padding: 4px; margin: 0; } .menuitem:hover, .menuitem:active { background: aquamarine; } .menuitem .menuitem:hover { font-weight: bold; }', '', function(opts) {


    function copyTextToClipboard (textVal) {

      const copyFrom = document.createElement('textarea');

      copyFrom.textContent = textVal;

      const bodyElm = document.getElementsByTagName('body')[0];

      bodyElm.appendChild(copyFrom);

      copyFrom.select();

      const retVal = document.execCommand('copy');

      bodyElm.removeChild(copyFrom);

      return retVal
    }

    this.mode = false;

    let activeCard;

    this.addCard = () => {
      store.trigger('add_card', activeCard);
    };
    this.removeCard = () => {
      const selectElements = this.parent.selectable.selectElements;
      if (selectElements.length) {
        store.cards.forEach((card, i) => {
          if (card.selected) {
            store.trigger('remove_card', i);
          }
        });
        selectElements.length = 0;
      } else {
        store.trigger('remove_card', activeCard.i);
      }
    };
    this.duplicateCard = () => {
      store.trigger('duplicate_card', activeCard.i);
    };
    this.setBgColor = () => {
      store.trigger('set_bgColor', activeCard.color);
    };

    this.copys = 'HEX,RGB,HSL'.split(',');

    this.copyColor = (e) => {
      const key = e.target.textContent.toLowerCase();
      copyTextToClipboard(activeCard.color.toString(key));
    };

    this.sizes = [120, 240, 360];

    this.setSize = (e) => {
      store.trigger('set_card_size', activeCard.i, +e.target.textContent);
      activeCard.rectSetter();
    };

    const menuHide = (e) => {
      store.trigger('menu_close');
    };
    store.on('menu_close', (e) => {
      this.mode = false;
      this.update();
    });

    store.on('menu_open', (e, card, mode) => {
      this.refs.menu.style.left = e.clientX + 'px';
      this.refs.menu.style.top = e.clientY + 'px';

      activeCard = card;

      this.mode = mode;

      window.addEventListener('blur', menuHide);
      document.addEventListener('click', menuHide);
      this.update();
    });
});

riot$1.tag2('color-picker', '<div class="color-picker" riot-style="width: {opts.size}px; height: {opts.size}px;"> <div class="color-wheel"> <canvas class="wheel-canvas" ref="wheel" width="{wheelRadius}" height="{wheelRadius}"></canvas> <div class="color-handle" ref="hue_handle"></div> </div> <div class="color-spectrum" riot-style="{spectrumStyle}"> <canvas class="spectrum-canvas" ref="spectrum" width="{spectrumEdge}" height="{spectrumEdge}"></canvas> <div class="color-handle" ref="spectrum_handle"></div> </div> <div class="color-alpha" if="{opts.alpha}"></div> </div>', '.color-picker { position: relative; padding: 5px; text-align: center; } .color-wheel, .color-spectrum { } .color-spectrum { position: absolute; } .color-handle { position: absolute; width: 10px; height: 10px; top: 0; left: 0; border: 1px solid black; border-radius: 5px; text-align: left; pointer-events: none; } .color-handle::before { content: \'\'; position: absolute; width: 8px; height: 8px; border: 1px solid white; border-radius: 4px; } .color-alpha { height: 16px; margin: 5px; background-color: #fff; background-image: linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%, #ddd), linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%, #ddd); background-size: 8px 8px; background-position:0 0, 4px 4px; background-repeat: repeat; }', '', function(opts) {

    const size = this.size = opts.size || 300;
    const wheelRadius = this.wheelRadius = size - 10;
    const wheelWidth = 20;
    const center = wheelRadius / 2;
    const radius = wheelRadius / 2 - wheelWidth;
    const edge = this.spectrumEdge = (radius / Math.sqrt(2) | 0) * 2 - 10;
    const boxp = center - edge / 2;

    this.spectrumStyle = `width: ${edge}px; height: ${edge}px; left: ${boxp + 5}px; top: ${boxp + 5}px;`;

    this.color = opts.color ? tinycolor(opts.color) : tinycolor.random();
    this.textColor = tinycolor.mostReadable(this.color, ['#eee', '#111']);

    const canvases = {
      wheel: {
        positionTest: (position) => {
          const x = center - position.x,
                y = center - position.y,
                r = Math.hypot(x, y);
          return radius <= r && r <= center
        },
        setColor: (position) => {
          const x = center - position.x,
                y = center - position.y;

          const hsl = this.color.toHsl();
          const hue = Math.round(Math.atan2(y, x) / Math.PI * 180) - 90;
          hsl.h = hue < 0 ? 360 + hue : hue;

          this.color = tinycolor(hsl);
          opts.oncolorchange(this.color);
          canvases.wheel.setPosition(hsl.h);

          this.spectrumColor = this.color;
          canvases.spectrum.draw();
        },
        setPosition: (hue) => {
          hue = hue == null ? this.color.toHsl().h : hue;
          const [mx, my] = positionRd(radius + wheelWidth / 2, hue);
          this.refs.hue_handle.style.left = mx + 'px';
          this.refs.hue_handle.style.top = my  + 'px';
        },
        draw: () => {
          const context = this.refs.wheel.getContext('2d');
          context.clearRect(0, 0, size, size);
          for (let i = 0; i < 360; i++) {
            context.beginPath();

            context.fillStyle = `hsl(${i}, 100%, 50%)`;

            context.moveTo(...positionRd(radius, i));
            context.lineTo(...positionRd(center, i));
            context.lineTo(...positionRd(center, i + 1.5));
            context.lineTo(...positionRd(radius, i + 1.5));
            context.closePath();
            context.fill();
          }
        }
      },

      spectrum: {
        positionTest: (position) => {
          const x = position.x,
                y = position.y;
          return (edge >= x && x >= 0 && edge >= y && y >= 0)
        },
        setColor: (position) => {
          const x = Math.max(0, Math.min(position.x, edge - 1)),
                y = Math.max(0, Math.min(position.y, edge - 1));

          const [r, g, b] = this.refs.spectrum.getContext('2d').getImageData(x, y, 1, 1).data;

          this.color = tinycolor({r, g, b});
          opts.oncolorchange(this.color);
          canvases.spectrum.setPosition();
        },
        setPosition: () => {
          const hsv = this.color.toHsv();
          this.refs.spectrum_handle.style.left = edge * hsv.s - 5 + 'px';
          this.refs.spectrum_handle.style.top = edge - (edge * hsv.v) - 5 + 'px';
        },
        draw: (hue) => {
          const context = this.refs.spectrum.getContext('2d');

          context.clearRect(0, 0, edge, edge);

          context.fillStyle = `hsl(${this.color.toHsl().h | 0}, 100%, 50%)`;
          context.fillRect(0, 0, edge, edge);

          const whiteGrd = context.createLinearGradient(0, 0, edge, 0);
          whiteGrd.addColorStop(0.01, 'rgba(255, 255, 255, 1.000)');
          whiteGrd.addColorStop(0.99, 'rgba(255, 255, 255, 0.000)');

          context.fillStyle = whiteGrd;
          context.fillRect(0, 0, edge, edge);

          const blackGrd = context.createLinearGradient(0, 0, 0, edge);
          blackGrd.addColorStop(0.01, 'rgba(0, 0, 0, 0.000)');
          blackGrd.addColorStop(0.99, 'rgba(0, 0, 0, 1.000)');

          context.fillStyle = blackGrd;
          context.fillRect(0, 0, edge, edge);
        }
      },

      alpha: {
        setColor: (position) => {
          const x = Math.max(0, Math.min(position.x, edge - 1)),
                y = Math.max(0, Math.min(position.y, edge - 1));

          const [r, g, b] = this.refs.spectrum.getContext('2d').getImageData(x, y, 1, 1).data;

          this.color = tinycolor({r, g, b});
          opts.oncolorchange(this.color);
          canvases.spectrum.setPosition();
        },
      }
    };

    this.on('update', () => {
      this.textColor = tinycolor.mostReadable(this.color, ['#eee', '#111']);
    });

    this.on('mount', () => {

      ['wheel', 'spectrum'].forEach((type) => {
        const canvas = canvases[type];
        canvas.draw();
        canvas.setPosition();

        return new MousePosition({
          containment: this.refs[type],
          start: (e, position) => {
            if (canvas.positionTest(position)) {
              canvas.setColor(position);
            }
          },
          drag: (e, position) => {
            canvas.setColor(position);
          },
        })
      });
    });

    function positionRd (r, deg) {
      const d = (deg - 90) / 180 * Math.PI;
      return [
        Math.floor((center + r * Math.cos(d)) * 100) / 100,
        Math.floor((center + r * Math.sin(d)) * 100) / 100,
      ]
    }
});

function keydownHandler (handler) {
  return function (e) {
    if (
      e.which !== 17 && // Ctrl
      e.which !== 91 && // Cmd
      e.which !== 18 && // Alt
      e.which !== 16 // Shift
    ) {
      handler(e);
    }
  }
}



class RiotManager {
  constructor (options) {
    this.options = Object.assign({
      defaultMode: 'default'
    }, options || {});

    this.mode = [];
    this.stores = options.stores || [];
    this.onMode(this.options.defaultMode)

    ;['on', 'one', 'off', 'trigger'].forEach((api) => {
      this[api] = (...args) => {
        this.stores.forEach((store) => {
          store[api].apply(store, args);
        });
      };
    });
  }
  addStore (store) {
    this.stores.push(store);
  }

  modeCheck (modeStr) {
    return modeStr.split(' ').some((mode) => this.mode.indexOf(mode) > -1)
  }
  onMode (modeStr) {
    return modeStr.split(' ').reduce((added, mode) => {
      if (this.mode.indexOf(mode) === -1) {
        this.mode.push(mode);
        added.push(mode);
      }
      return added
    }, [])
  }
  offMode (modeStr) {
    return modeStr.split(' ').reduce((removed, mode) => {
      const index = this.mode.indexOf(mode);
      if (index > -1) {
        this.mode.splice(index, 1);
        removed.push(mode);
      }
      return removed
    }, [])
  }
}



class RiotKeyManager extends RiotManager {
  constructor (options, keymapsData) {
    super(options);
    this.options = Object.assign({
      element: window,
    }, this.options);

    this.keymaps = [];

    if (keymapsData) {
      this.addKeymaps(keymapsData);
    }

    // ADD Event
    this.options.element.addEventListener('keydown', keydownHandler((e) => {
      const inputTags = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
      if (inputTags) {
        // brackets
        return
      }
      this.keymaps.some((keymap) => {
        const action = this.getAction(e, keymap);
        if (action) {
          let returnBoolean = false;
          try {
            returnBoolean = this.trigger(action, e);
          } catch (error) {
            console.error(error.message, error.stack);
          }
          // if (returnBoolean) {
          //   e.preventDefault()
          // }
          // return returnBoolean
          e.preventDefault();
          return true
        }
      });
    }));
  }

  getAction (e, keymap) {
    const {key, action, mode} = keymap;
    if (!this.modeCheck(mode)) return
    if (e.shiftKey !== /\bshift\b/i.test(key)) return
    if (e.ctrlKey !== /\bctrl\b/i.test(key)) return
    if (e.altKey !== /\balt\b/i.test(key)) return
    // if (e.shiftKey !== key.includes('shift')) return
    // if (e.ctrlKey !== key.includes('ctrl')) return
    // if (e.altKey !== key.includes('alt')) return
    if (e.metaKey !== /\bcommand\b|\bcmd\b/i.test(key)) return

    const eKey = e.key.replace('Arrow', '').toLowerCase(),
          keyReg = keymap.key.replace(/\b(shift|ctrl|alt|command|cmd)[-+]/ig, '');
    console.log(keyReg, eKey);
    if (!new RegExp(`${keyReg}$`).test(eKey)) return

    // var keyCode = e.charCode || e.keyCode
    // var keyCodeChar = String.fromCharCode(keyCode).toLowerCase()
    // let actioncb = typeof action === 'string' ? listenerMap[action] : action
    return action
  }

  addKeymaps (keymapsData) {
    if (Array.isArray(keymapsData)) {
      keymapsData.forEach((keymaps) => {
        this.addKeymap(this.options.defaultMode, keymaps);
      });
    } else {
      Object.keys(keymapsData).forEach((key) => {
        this.addKeymap(key, keymapsData[key]);
      });
    }
  }
  addKeymap (modeStr, keymaps) {
    keymaps.forEach((keymap) => {
      keymap.mode = modeStr;
      this.keymaps.push(keymap);
    });
  }
}

const keyManager = new RiotKeyManager({});

keyManager.addStore(store);
keyManager.addKeymap('default', [
  { key: 'ctrl+z',
    action: 'undo',
    mode: 'default' },
  { key: 'ctrl+y',
    action: 'redo',
    mode: 'default' },
  { key: 'ctrl+shift+z',
    action: 'redo',
    mode: 'default' },
]);

riot$1.mount('#root', 'app');

}());
//# sourceMappingURL=bundle.js.map
