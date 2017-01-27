(function () {
'use strict';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var riot = createCommonjsModule(function (module, exports) {
/* Riot v2.6.7, @license MIT */

(function(window, undefined) {
  'use strict';
var riot = { version: 'v2.6.7', settings: {} },
  // be aware, internal usage
  // ATTENTION: prefix the global dynamic variables with `__`

  // counter to give a unique id to all the Tag instances
  __uid = 0,
  // tags instances cache
  __virtualDom = [],
  // tags implementation cache
  __tagImpl = {},

  /**
   * Const
   */
  GLOBAL_MIXIN = '__global_mixin',

  // riot specific prefixes
  RIOT_PREFIX = 'riot-',
  RIOT_TAG = RIOT_PREFIX + 'tag',
  RIOT_TAG_IS = 'data-is',

  // for typeof == '' comparisons
  T_STRING = 'string',
  T_OBJECT = 'object',
  T_UNDEF  = 'undefined',
  T_FUNCTION = 'function',
  XLINK_NS = 'http://www.w3.org/1999/xlink',
  XLINK_REGEX = /^xlink:(\w+)/,
  // special native tags that cannot be treated like the others
  SPECIAL_TAGS_REGEX = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?|opt(?:ion|group))$/,
  RESERVED_WORDS_BLACKLIST = /^(?:_(?:item|id|parent)|update|root|(?:un)?mount|mixin|is(?:Mounted|Loop)|tags|parent|opts|trigger|o(?:n|ff|ne))$/,
  // SVG tags list https://www.w3.org/TR/SVG/attindex.html#PresentationAttributes
  SVG_TAGS_LIST = ['altGlyph', 'animate', 'animateColor', 'circle', 'clipPath', 'defs', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence', 'filter', 'font', 'foreignObject', 'g', 'glyph', 'glyphRef', 'image', 'line', 'linearGradient', 'marker', 'mask', 'missing-glyph', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'switch', 'symbol', 'text', 'textPath', 'tref', 'tspan', 'use'],

  // version# for IE 8-11, 0 for others
  IE_VERSION = (window && window.document || {}).documentMode | 0,

  // detect firefox to fix #1374
  FIREFOX = window && !!window.InstallTrigger;
/* istanbul ignore next */
riot.observable = function(el) {

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
   * Private Methods
   */

  /**
   * Helper function needed to get and loop all the events in a string
   * @param   { String }   e - event string
   * @param   {Function}   fn - callback
   */
  function onEachEvent(e, fn) {
    var es = e.split(' '), l = es.length, i = 0;
    for (; i < l; i++) {
      var name = es[i];
      if (name) fn(name, i);
    }
  }

  /**
   * Public Api
   */

  // extend the el object adding the observable methods
  Object.defineProperties(el, {
    /**
     * Listen to the given space separated list of `events` and
     * execute the `callback` each time an event is triggered.
     * @param  { String } events - events ids
     * @param  { Function } fn - callback function
     * @returns { Object } el
     */
    on: {
      value: function(events, fn) {
        if (typeof fn != 'function')  return el

        onEachEvent(events, function(name, pos) {
          (callbacks[name] = callbacks[name] || []).push(fn);
          fn.typed = pos > 0;
        });

        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Removes the given space separated list of `events` listeners
     * @param   { String } events - events ids
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    off: {
      value: function(events, fn) {
        if (events == '*' && !fn) callbacks = {};
        else {
          onEachEvent(events, function(name, pos) {
            if (fn) {
              var arr = callbacks[name];
              for (var i = 0, cb; cb = arr && arr[i]; ++i) {
                if (cb == fn) arr.splice(i--, 1);
              }
            } else delete callbacks[name];
          });
        }
        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Listen to the given space separated list of `events` and
     * execute the `callback` at most once
     * @param   { String } events - events ids
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    one: {
      value: function(events, fn) {
        function on() {
          el.off(events, on);
          fn.apply(el, arguments);
        }
        return el.on(events, on)
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Execute all callback functions that listen to
     * the given space separated list of `events`
     * @param   { String } events - events ids
     * @returns { Object } el
     */
    trigger: {
      value: function(events) {

        // getting the arguments
        var arglen = arguments.length - 1,
          args = new Array(arglen),
          fns;

        for (var i = 0; i < arglen; i++) {
          args[i] = arguments[i + 1]; // skip first argument
        }

        onEachEvent(events, function(name, pos) {

          fns = slice.call(callbacks[name] || [], 0);

          for (var i = 0, fn; fn = fns[i]; ++i) {
            if (fn.busy) continue
            fn.busy = 1;
            fn.apply(el, fn.typed ? [name].concat(args) : args);
            if (fns[i] !== fn) { i--; }
            fn.busy = 0;
          }

          if (callbacks['*'] && name != '*')
            el.trigger.apply(el, ['*', name].concat(args));

        });

        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    }
  });

  return el

}
/* istanbul ignore next */
;(function(riot) {

/**
 * Simple client-side router
 * @module riot-route
 */


var RE_ORIGIN = /^.+?\/\/+[^\/]+/,
  EVENT_LISTENER = 'EventListener',
  REMOVE_EVENT_LISTENER = 'remove' + EVENT_LISTENER,
  ADD_EVENT_LISTENER = 'add' + EVENT_LISTENER,
  HAS_ATTRIBUTE = 'hasAttribute',
  REPLACE = 'replace',
  POPSTATE = 'popstate',
  HASHCHANGE = 'hashchange',
  TRIGGER = 'trigger',
  MAX_EMIT_STACK_LEVEL = 3,
  win = typeof window != 'undefined' && window,
  doc = typeof document != 'undefined' && document,
  hist = win && history,
  loc = win && (hist.location || win.location), // see html5-history-api
  prot = Router.prototype, // to minify more
  clickEvent = doc && doc.ontouchstart ? 'touchstart' : 'click',
  started = false,
  central = riot.observable(),
  routeFound = false,
  debouncedEmit,
  base, current, parser, secondParser, emitStack = [], emitStackLevel = 0;

/**
 * Default parser. You can replace it via router.parser method.
 * @param {string} path - current path (normalized)
 * @returns {array} array
 */
function DEFAULT_PARSER(path) {
  return path.split(/[/?#]/)
}

/**
 * Default parser (second). You can replace it via router.parser method.
 * @param {string} path - current path (normalized)
 * @param {string} filter - filter string (normalized)
 * @returns {array} array
 */
function DEFAULT_SECOND_PARSER(path, filter) {
  var re = new RegExp('^' + filter[REPLACE](/\*/g, '([^/?#]+?)')[REPLACE](/\.\./, '.*') + '$'),
    args = path.match(re);

  if (args) return args.slice(1)
}

/**
 * Simple/cheap debounce implementation
 * @param   {function} fn - callback
 * @param   {number} delay - delay in seconds
 * @returns {function} debounced function
 */
function debounce(fn, delay) {
  var t;
  return function () {
    clearTimeout(t);
    t = setTimeout(fn, delay);
  }
}

/**
 * Set the window listeners to trigger the routes
 * @param {boolean} autoExec - see route.start
 */
function start(autoExec) {
  debouncedEmit = debounce(emit, 1);
  win[ADD_EVENT_LISTENER](POPSTATE, debouncedEmit);
  win[ADD_EVENT_LISTENER](HASHCHANGE, debouncedEmit);
  doc[ADD_EVENT_LISTENER](clickEvent, click);
  if (autoExec) emit(true);
}

/**
 * Router class
 */
function Router() {
  this.$ = [];
  riot.observable(this); // make it observable
  central.on('stop', this.s.bind(this));
  central.on('emit', this.e.bind(this));
}

function normalize(path) {
  return path[REPLACE](/^\/|\/$/, '')
}

function isString(str) {
  return typeof str == 'string'
}

/**
 * Get the part after domain name
 * @param {string} href - fullpath
 * @returns {string} path from root
 */
function getPathFromRoot(href) {
  return (href || loc.href)[REPLACE](RE_ORIGIN, '')
}

/**
 * Get the part after base
 * @param {string} href - fullpath
 * @returns {string} path from base
 */
function getPathFromBase(href) {
  return base[0] == '#'
    ? (href || loc.href || '').split(base)[1] || ''
    : (loc ? getPathFromRoot(href) : href || '')[REPLACE](base, '')
}

function emit(force) {
  // the stack is needed for redirections
  var isRoot = emitStackLevel == 0, first;
  if (MAX_EMIT_STACK_LEVEL <= emitStackLevel) return

  emitStackLevel++;
  emitStack.push(function() {
    var path = getPathFromBase();
    if (force || path != current) {
      central[TRIGGER]('emit', path);
      current = path;
    }
  });
  if (isRoot) {
    while (first = emitStack.shift()) first(); // stack increses within this call
    emitStackLevel = 0;
  }
}

function click(e) {
  if (
    e.which != 1 // not left click
    || e.metaKey || e.ctrlKey || e.shiftKey // or meta keys
    || e.defaultPrevented // or default prevented
  ) return

  var el = e.target;
  while (el && el.nodeName != 'A') el = el.parentNode;

  if (
    !el || el.nodeName != 'A' // not A tag
    || el[HAS_ATTRIBUTE]('download') // has download attr
    || !el[HAS_ATTRIBUTE]('href') // has no href attr
    || el.target && el.target != '_self' // another window or frame
    || el.href.indexOf(loc.href.match(RE_ORIGIN)[0]) == -1 // cross origin
  ) return

  if (el.href != loc.href
    && (
      el.href.split('#')[0] == loc.href.split('#')[0] // internal jump
      || base[0] != '#' && getPathFromRoot(el.href).indexOf(base) !== 0 // outside of base
      || base[0] == '#' && el.href.split(base)[0] != loc.href.split(base)[0] // outside of #base
      || !go(getPathFromBase(el.href), el.title || doc.title) // route not found
    )) return

  e.preventDefault();
}

/**
 * Go to the path
 * @param {string} path - destination path
 * @param {string} title - page title
 * @param {boolean} shouldReplace - use replaceState or pushState
 * @returns {boolean} - route not found flag
 */
function go(path, title, shouldReplace) {
  // Server-side usage: directly execute handlers for the path
  if (!hist) return central[TRIGGER]('emit', getPathFromBase(path))

  path = base + normalize(path);
  title = title || doc.title;
  // browsers ignores the second parameter `title`
  shouldReplace
    ? hist.replaceState(null, title, path)
    : hist.pushState(null, title, path);
  // so we need to set it manually
  doc.title = title;
  routeFound = false;
  emit();
  return routeFound
}

/**
 * Go to path or set action
 * a single string:                go there
 * two strings:                    go there with setting a title
 * two strings and boolean:        replace history with setting a title
 * a single function:              set an action on the default route
 * a string/RegExp and a function: set an action on the route
 * @param {(string|function)} first - path / action / filter
 * @param {(string|RegExp|function)} second - title / action
 * @param {boolean} third - replace flag
 */
prot.m = function(first, second, third) {
  if (isString(first) && (!second || isString(second))) go(first, second, third || false);
  else if (second) this.r(first, second);
  else this.r('@', first);
};

/**
 * Stop routing
 */
prot.s = function() {
  this.off('*');
  this.$ = [];
};

/**
 * Emit
 * @param {string} path - path
 */
prot.e = function(path) {
  this.$.concat('@').some(function(filter) {
    var args = (filter == '@' ? parser : secondParser)(normalize(path), normalize(filter));
    if (typeof args != 'undefined') {
      this[TRIGGER].apply(null, [filter].concat(args));
      return routeFound = true // exit from loop
    }
  }, this);
};

/**
 * Register route
 * @param {string} filter - filter for matching to url
 * @param {function} action - action to register
 */
prot.r = function(filter, action) {
  if (filter != '@') {
    filter = '/' + normalize(filter);
    this.$.push(filter);
  }
  this.on(filter, action);
};

var mainRouter = new Router();
var route = mainRouter.m.bind(mainRouter);

/**
 * Create a sub router
 * @returns {function} the method of a new Router object
 */
route.create = function() {
  var newSubRouter = new Router();
  // assign sub-router's main method
  var router = newSubRouter.m.bind(newSubRouter);
  // stop only this sub-router
  router.stop = newSubRouter.s.bind(newSubRouter);
  return router
};

/**
 * Set the base of url
 * @param {(str|RegExp)} arg - a new base or '#' or '#!'
 */
route.base = function(arg) {
  base = arg || '#';
  current = getPathFromBase(); // recalculate current path
};

/** Exec routing right now **/
route.exec = function() {
  emit(true);
};

/**
 * Replace the default router to yours
 * @param {function} fn - your parser function
 * @param {function} fn2 - your secondParser function
 */
route.parser = function(fn, fn2) {
  if (!fn && !fn2) {
    // reset parser for testing...
    parser = DEFAULT_PARSER;
    secondParser = DEFAULT_SECOND_PARSER;
  }
  if (fn) parser = fn;
  if (fn2) secondParser = fn2;
};

/**
 * Helper function to get url query as an object
 * @returns {object} parsed query
 */
route.query = function() {
  var q = {};
  var href = loc.href || current;
  href[REPLACE](/[?&](.+?)=([^&]*)/g, function(_, k, v) { q[k] = v; });
  return q
};

/** Stop routing **/
route.stop = function () {
  if (started) {
    if (win) {
      win[REMOVE_EVENT_LISTENER](POPSTATE, debouncedEmit);
      win[REMOVE_EVENT_LISTENER](HASHCHANGE, debouncedEmit);
      doc[REMOVE_EVENT_LISTENER](clickEvent, click);
    }
    central[TRIGGER]('stop');
    started = false;
  }
};

/**
 * Start routing
 * @param {boolean} autoExec - automatically exec after starting if true
 */
route.start = function (autoExec) {
  if (!started) {
    if (win) {
      if (document.readyState == 'complete') start(autoExec);
      // the timeout is needed to solve
      // a weird safari bug https://github.com/riot/route/issues/33
      else win[ADD_EVENT_LISTENER]('load', function() {
        setTimeout(function() { start(autoExec); }, 1);
      });
    }
    started = true;
  }
};

/** Prepare the router **/
route.base();
route.parser();

riot.route = route;
})(riot);
/* istanbul ignore next */

/**
 * The riot template engine
 * @version v2.4.2
 */
/**
 * riot.util.brackets
 *
 * - `brackets    ` - Returns a string or regex based on its parameter
 * - `brackets.set` - Change the current riot brackets
 *
 * @module
 */

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
    if (!bp) bp = _cache;
    return new RegExp(
      re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : ''
    )
  }

  function _create (pair) {
    if (pair === DEFAULT) return _pairs

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
    if (!_bp) _bp = _cache;

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
          !(match[1] === ch ? ++ix : --ix)) break
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
    if (!str) return str

    return (_cache[str] || (_cache[str] = _create(str))).call(data, _logErr)
  }

  _tmpl.haveRaw = brackets.hasRaw;

  _tmpl.hasExpr = brackets.hasExpr;

  _tmpl.loopKeys = brackets.loopKeys;

  // istanbul ignore next
  _tmpl.clearCache = function () { _cache = {}; };

  _tmpl.errorHandler = null;

  function _logErr (err, ctx) {

    if (_tmpl.errorHandler) {

      err.riotData = {
        tagName: ctx && ctx.root && ctx.root.tagName,
        _riot_id: ctx && ctx._riot_id  //eslint-disable-line camelcase
      };
      _tmpl.errorHandler(err);
    }
  }

  function _create (str) {
    var expr = _getTmpl(str);

    if (expr.slice(0, 11) !== 'try{return ') expr = 'return ' + expr;

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

          )) list[j++] = expr;

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

        while (jsb = (match = re.exec(expr))[1]) skipBraces(jsb, re);

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
        if (mm[0] === ch) ++lv;
        else if (!--lv) break
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
          if (pos) tb = (s = s[pos]) === '.' || s === '(' || s === '[';
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

  _tmpl.version = brackets.version = 'v2.4.2';

  return _tmpl

})();

/*
  lib/browser/tag/mkdom.js

  Includes hacks needed for the Internet Explorer version 9 and below
  See: http://kangax.github.io/compat-table/es5/#ie8
       http://codeplanet.io/dropping-ie8/
*/
var mkdom = (function _mkdom() {
  var
    reHasYield  = /<yield\b/i,
    reYieldAll  = /<yield\s*(?:\/>|>([\S\s]*?)<\/yield\s*>|>)/ig,
    reYieldSrc  = /<yield\s+to=['"]([^'">]*)['"]\s*>([\S\s]*?)<\/yield\s*>/ig,
    reYieldDest = /<yield\s+from=['"]?([-\w]+)['"]?\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig;
  var
    rootEls = { tr: 'tbody', th: 'tr', td: 'tr', col: 'colgroup' },
    tblTags = IE_VERSION && IE_VERSION < 10
      ? SPECIAL_TAGS_REGEX : /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?)$/;

  /**
   * Creates a DOM element to wrap the given content. Normally an `DIV`, but can be
   * also a `TABLE`, `SELECT`, `TBODY`, `TR`, or `COLGROUP` element.
   *
   * @param   { String } templ  - The template coming from the custom tag definition
   * @param   { String } [html] - HTML content that comes from the DOM element where you
   *           will mount the tag, mostly the original tag in the page
   * @param   { Boolean } checkSvg - flag needed to know if we need to force the svg rendering in case of loop nodes
   * @returns {HTMLElement} DOM element with _templ_ merged through `YIELD` with the _html_.
   */
  function _mkdom(templ, html, checkSvg) {
    var
      match   = templ && templ.match(/^\s*<([-\w]+)/),
      tagName = match && match[1].toLowerCase(),
      el = mkEl('div', checkSvg && isSVGTag(tagName));

    // replace all the yield tags with the tag inner html
    templ = replaceYield(templ, html);

    /* istanbul ignore next */
    if (tblTags.test(tagName))
      el = specialTags(el, templ, tagName);
    else
      setInnerHTML(el, templ);

    el.stub = true;

    return el
  }

  /*
    Creates the root element for table or select child elements:
    tr/th/td/thead/tfoot/tbody/caption/col/colgroup/option/optgroup
  */
  function specialTags(el, templ, tagName) {
    var
      select = tagName[0] === 'o',
      parent = select ? 'select>' : 'table>';

    // trim() is important here, this ensures we don't have artifacts,
    // so we can check if we have only one element inside the parent
    el.innerHTML = '<' + parent + templ.trim() + '</' + parent;
    parent = el.firstChild;

    // returns the immediate parent if tr/th/td/col is the only element, if not
    // returns the whole tree, as this can include additional elements
    if (select) {
      parent.selectedIndex = -1;  // for IE9, compatible w/current riot behavior
    } else {
      // avoids insertion of cointainer inside container (ex: tbody inside tbody)
      var tname = rootEls[tagName];
      if (tname && parent.childElementCount === 1) parent = $(tname, parent);
    }
    return parent
  }

  /*
    Replace the yield tag from any tag template with the innerHTML of the
    original tag in the page
  */
  function replaceYield(templ, html) {
    // do nothing if no yield
    if (!reHasYield.test(templ)) return templ

    // be careful with #1343 - string on the source having `$1`
    var src = {};

    html = html && html.replace(reYieldSrc, function (_, ref, text) {
      src[ref] = src[ref] || text;   // preserve first definition
      return ''
    }).trim();

    return templ
      .replace(reYieldDest, function (_, ref, def) {  // yield with from - to attrs
        return src[ref] || def || ''
      })
      .replace(reYieldAll, function (_, def) {        // yield without any "from"
        return html || def || ''
      })
  }

  return _mkdom

})();

/**
 * Convert the item looped into an object used to extend the child tag properties
 * @param   { Object } expr - object containing the keys used to extend the children tags
 * @param   { * } key - value to assign to the new object returned
 * @param   { * } val - value containing the position of the item in the array
 * @returns { Object } - new object containing the values of the original item
 *
 * The variables 'key' and 'val' are arbitrary.
 * They depend on the collection type looped (Array, Object)
 * and on the expression used on the each tag
 *
 */
function mkitem(expr, key, val) {
  var item = {};
  item[expr.key] = key;
  if (expr.pos) item[expr.pos] = val;
  return item
}

/**
 * Unmount the redundant tags
 * @param   { Array } items - array containing the current items to loop
 * @param   { Array } tags - array containing all the children tags
 */
function unmountRedundant(items, tags) {

  var i = tags.length,
    j = items.length,
    t;

  while (i > j) {
    t = tags[--i];
    tags.splice(i, 1);
    t.unmount();
  }
}

/**
 * Move the nested custom tags in non custom loop tags
 * @param   { Object } child - non custom loop tag
 * @param   { Number } i - current position of the loop tag
 */
function moveNestedTags(child, i) {
  Object.keys(child.tags).forEach(function(tagName) {
    var tag = child.tags[tagName];
    if (isArray(tag))
      each(tag, function (t) {
        moveChildTag(t, tagName, i);
      });
    else
      moveChildTag(tag, tagName, i);
  });
}

/**
 * Adds the elements for a virtual tag
 * @param { Tag } tag - the tag whose root's children will be inserted or appended
 * @param { Node } src - the node that will do the inserting or appending
 * @param { Tag } target - only if inserting, insert before this tag's first child
 */
function addVirtual(tag, src, target) {
  var el = tag._root, sib;
  tag._virts = [];
  while (el) {
    sib = el.nextSibling;
    if (target)
      src.insertBefore(el, target._root);
    else
      src.appendChild(el);

    tag._virts.push(el); // hold for unmounting
    el = sib;
  }
}

/**
 * Move virtual tag and all child nodes
 * @param { Tag } tag - first child reference used to start move
 * @param { Node } src  - the node that will do the inserting
 * @param { Tag } target - insert before this tag's first child
 * @param { Number } len - how many child nodes to move
 */
function moveVirtual(tag, src, target, len) {
  var el = tag._root, sib, i = 0;
  for (; i < len; i++) {
    sib = el.nextSibling;
    src.insertBefore(el, target._root);
    el = sib;
  }
}

/**
 * Insert a new tag avoiding the insert for the conditional tags
 * @param   {Boolean} isVirtual [description]
 * @param   { Tag }  prevTag - tag instance used as reference to prepend our new tag
 * @param   { Tag }  newTag - new tag to be inserted
 * @param   { HTMLElement }  root - loop parent node
 * @param   { Array }  tags - array containing the current tags list
 * @param   { Function }  virtualFn - callback needed to move or insert virtual DOM
 * @param   { Object } dom - DOM node we need to loop
 */
function insertTag(isVirtual, prevTag, newTag, root, tags, virtualFn, dom) {
  if (isInStub(prevTag.root)) return
  if (isVirtual) virtualFn(prevTag, root, newTag, dom.childNodes.length);
  else root.insertBefore(prevTag.root, newTag.root); // #1374 some browsers reset selected here
}


/**
 * Manage tags having the 'each'
 * @param   { Object } dom - DOM node we need to loop
 * @param   { Tag } parent - parent tag instance where the dom node is contained
 * @param   { String } expr - string contained in the 'each' attribute
 */
function _each(dom, parent, expr) {

  // remove the each property from the original tag
  remAttr(dom, 'each');

  var mustReorder = typeof getAttr(dom, 'no-reorder') !== T_STRING || remAttr(dom, 'no-reorder'),
    tagName = getTagName(dom),
    impl = __tagImpl[tagName] || { tmpl: getOuterHTML(dom) },
    useRoot = SPECIAL_TAGS_REGEX.test(tagName),
    root = dom.parentNode,
    ref = document.createTextNode(''),
    child = getTag(dom),
    isOption = tagName.toLowerCase() === 'option', // the option tags must be treated differently
    tags = [],
    oldItems = [],
    hasKeys,
    isVirtual = dom.tagName == 'VIRTUAL';

  // parse the each expression
  expr = tmpl.loopKeys(expr);

  // insert a marked where the loop tags will be injected
  root.insertBefore(ref, dom);

  // clean template code
  parent.one('before-mount', function () {

    // remove the original DOM node
    dom.parentNode.removeChild(dom);
    if (root.stub) root = parent.root;

  }).on('update', function () {
    // get the new items collection
    var items = tmpl(expr.val, parent),
      // create a fragment to hold the new DOM nodes to inject in the parent tag
      frag = document.createDocumentFragment();

    // object loop. any changes cause full redraw
    if (!isArray(items)) {
      hasKeys = items || false;
      items = hasKeys ?
        Object.keys(items).map(function (key) {
          return mkitem(expr, key, items[key])
        }) : [];
    }

    // loop all the new items
    var i = 0,
      itemsLength = items.length;

    for (; i < itemsLength; i++) {
      // reorder only if the items are objects
      var
        item = items[i],
        _mustReorder = mustReorder && typeof item == T_OBJECT && !hasKeys,
        oldPos = oldItems.indexOf(item),
        pos = ~oldPos && _mustReorder ? oldPos : i,
        // does a tag exist in this position?
        tag = tags[pos];

      item = !hasKeys && expr.key ? mkitem(expr, item, i) : item;

      // new tag
      if (
        !_mustReorder && !tag // with no-reorder we just update the old tags
        ||
        _mustReorder && !~oldPos || !tag // by default we always try to reorder the DOM elements
      ) {

        tag = new Tag(impl, {
          parent: parent,
          isLoop: true,
          hasImpl: !!__tagImpl[tagName],
          root: useRoot ? root : dom.cloneNode(),
          item: item
        }, dom.innerHTML);

        tag.mount();

        if (isVirtual) tag._root = tag.root.firstChild; // save reference for further moves or inserts
        // this tag must be appended
        if (i == tags.length || !tags[i]) { // fix 1581
          if (isVirtual)
            addVirtual(tag, frag);
          else frag.appendChild(tag.root);
        }
        // this tag must be insert
        else {
          insertTag(isVirtual, tag, tags[i], root, tags, addVirtual, dom);
          oldItems.splice(i, 0, item);
        }

        tags.splice(i, 0, tag);
        pos = i; // handled here so no move
      } else tag.update(item, true);

      // reorder the tag if it's not located in its previous position
      if (
        pos !== i && _mustReorder &&
        tags[i] // fix 1581 unable to reproduce it in a test!
      ) {
        // #closes 2040 PLEASE DON'T REMOVE IT!
        // there are no tests for this feature
        if (contains(items, oldItems[i]))
          insertTag(isVirtual, tag, tags[i], root, tags, moveVirtual, dom);

        // update the position attribute if it exists
        if (expr.pos)
          tag[expr.pos] = i;
        // move the old tag instance
        tags.splice(i, 0, tags.splice(pos, 1)[0]);
        // move the old item
        oldItems.splice(i, 0, oldItems.splice(pos, 1)[0]);
        // if the loop tags are not custom
        // we need to move all their custom tags into the right position
        if (!child && tag.tags) moveNestedTags(tag, i);
      }

      // cache the original item to use it in the events bound to this node
      // and its children
      tag._item = item;
      // cache the real parent tag internally
      defineProperty(tag, '_parent', parent);
    }

    // remove the redundant tags
    unmountRedundant(items, tags);

    // insert the new nodes
    root.insertBefore(frag, ref);
    if (isOption) {

      // #1374 FireFox bug in <option selected={expression}>
      if (FIREFOX && !root.multiple) {
        for (var n = 0; n < root.length; n++) {
          if (root[n].__riot1374) {
            root.selectedIndex = n;  // clear other options
            delete root[n].__riot1374;
            break
          }
        }
      }
    }

    // set the 'tags' property of the parent tag
    // if child is 'undefined' it means that we don't need to set this property
    // for example:
    // we don't need store the `myTag.tags['div']` property if we are looping a div tag
    // but we need to track the `myTag.tags['child']` property looping a custom child node named `child`
    if (child) parent.tags[tagName] = tags;

    // clone the items array
    oldItems = items.slice();

  });

}
/**
 * Object that will be used to inject and manage the css of every tag instance
 */
var styleManager = (function(_riot) {

  if (!window) return { // skip injection on the server
    add: function () {},
    inject: function () {}
  }

  var styleNode = (function () {
    // create a new style element with the correct type
    var newNode = mkEl('style');
    setAttr(newNode, 'type', 'text/css');

    // replace any user node or insert the new one into the head
    var userNode = $('style[type=riot]');
    if (userNode) {
      if (userNode.id) newNode.id = userNode.id;
      userNode.parentNode.replaceChild(newNode, userNode);
    }
    else document.getElementsByTagName('head')[0].appendChild(newNode);

    return newNode
  })();

  // Create cache and shortcut to the correct property
  var cssTextProp = styleNode.styleSheet,
    stylesToInject = '';

  // Expose the style node in a non-modificable property
  Object.defineProperty(_riot, 'styleNode', {
    value: styleNode,
    writable: true
  });

  /**
   * Public api
   */
  return {
    /**
     * Save a tag style to be later injected into DOM
     * @param   { String } css [description]
     */
    add: function(css) {
      stylesToInject += css;
    },
    /**
     * Inject all previously saved tag styles into DOM
     * innerHTML seems slow: http://jsperf.com/riot-insert-style
     */
    inject: function() {
      if (stylesToInject) {
        if (cssTextProp) cssTextProp.cssText += stylesToInject;
        else styleNode.innerHTML += stylesToInject;
        stylesToInject = '';
      }
    }
  }

})(riot);


function parseNamedElements(root, tag, childTags, forceParsingNamed) {

  walk(root, function(dom) {
    if (dom.nodeType == 1) {
      dom.isLoop = dom.isLoop ||
                  (dom.parentNode && dom.parentNode.isLoop || getAttr(dom, 'each'))
                    ? 1 : 0;

      // custom child tag
      if (childTags) {
        var child = getTag(dom);

        if (child && !dom.isLoop)
          childTags.push(initChildTag(child, {root: dom, parent: tag}, dom.innerHTML, tag));
      }

      if (!dom.isLoop || forceParsingNamed)
        setNamed(dom, tag, []);
    }

  });

}

function parseExpressions(root, tag, expressions) {

  function addExpr(dom, val, extra) {
    if (tmpl.hasExpr(val)) {
      expressions.push(extend({ dom: dom, expr: val }, extra));
    }
  }

  walk(root, function(dom) {
    var type = dom.nodeType,
      attr;

    // text node
    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue);
    if (type != 1) return

    /* element */

    // loop
    attr = getAttr(dom, 'each');

    if (attr) { _each(dom, tag, attr); return false }

    // attribute expressions
    each(dom.attributes, function(attr) {
      var name = attr.name,
        bool = name.split('__')[1];

      addExpr(dom, attr.value, { attr: bool || name, bool: bool });
      if (bool) { remAttr(dom, name); return false }

    });

    // skip custom tags
    if (getTag(dom)) return false

  });

}
function Tag(impl, conf, innerHTML) {

  var self = riot.observable(this),
    opts = inherit(conf.opts) || {},
    parent = conf.parent,
    isLoop = conf.isLoop,
    hasImpl = conf.hasImpl,
    item = cleanUpData(conf.item),
    expressions = [],
    childTags = [],
    root = conf.root,
    tagName = root.tagName.toLowerCase(),
    attr = {},
    propsInSyncWithParent = [],
    dom;

  // only call unmount if we have a valid __tagImpl (has name property)
  if (impl.name && root._tag) root._tag.unmount(true);

  // not yet mounted
  this.isMounted = false;
  root.isLoop = isLoop;

  // keep a reference to the tag just created
  // so we will be able to mount this tag multiple times
  root._tag = this;

  // create a unique id to this tag
  // it could be handy to use it also to improve the virtual dom rendering speed
  defineProperty(this, '_riot_id', ++__uid); // base 1 allows test !t._riot_id

  extend(this, { parent: parent, root: root, opts: opts}, item);
  // protect the "tags" property from being overridden
  defineProperty(this, 'tags', {});

  // grab attributes
  each(root.attributes, function(el) {
    var val = el.value;
    // remember attributes with expressions only
    if (tmpl.hasExpr(val)) attr[el.name] = val;
  });

  dom = mkdom(impl.tmpl, innerHTML, isLoop);

  // options
  function updateOpts() {
    var ctx = hasImpl && isLoop ? self : parent || self;

    // update opts from current DOM attributes
    each(root.attributes, function(el) {
      var val = el.value;
      opts[toCamel(el.name)] = tmpl.hasExpr(val) ? tmpl(val, ctx) : val;
    });
    // recover those with expressions
    each(Object.keys(attr), function(name) {
      opts[toCamel(name)] = tmpl(attr[name], ctx);
    });
  }

  function normalizeData(data) {
    for (var key in item) {
      if (typeof self[key] !== T_UNDEF && isWritable(self, key))
        self[key] = data[key];
    }
  }

  function inheritFrom(target) {
    each(Object.keys(target), function(k) {
      // some properties must be always in sync with the parent tag
      var mustSync = !RESERVED_WORDS_BLACKLIST.test(k) && contains(propsInSyncWithParent, k);

      if (typeof self[k] === T_UNDEF || mustSync) {
        // track the property to keep in sync
        // so we can keep it updated
        if (!mustSync) propsInSyncWithParent.push(k);
        self[k] = target[k];
      }
    });
  }

  /**
   * Update the tag expressions and options
   * @param   { * }  data - data we want to use to extend the tag properties
   * @param   { Boolean } isInherited - is this update coming from a parent tag?
   * @returns { self }
   */
  defineProperty(this, 'update', function(data, isInherited) {

    // make sure the data passed will not override
    // the component core methods
    data = cleanUpData(data);
    // inherit properties from the parent in loop
    if (isLoop) {
      inheritFrom(self.parent);
    }
    // normalize the tag properties in case an item object was initially passed
    if (data && isObject(item)) {
      normalizeData(data);
      item = data;
    }
    extend(self, data);
    updateOpts();
    self.trigger('update', data);
    update(expressions, self);

    // the updated event will be triggered
    // once the DOM will be ready and all the re-flows are completed
    // this is useful if you want to get the "real" root properties
    // 4 ex: root.offsetWidth ...
    if (isInherited && self.parent)
      // closes #1599
      self.parent.one('updated', function() { self.trigger('updated'); });
    else rAF(function() { self.trigger('updated'); });

    return this
  });

  defineProperty(this, 'mixin', function() {
    each(arguments, function(mix) {
      var instance,
        props = [],
        obj;

      mix = typeof mix === T_STRING ? riot.mixin(mix) : mix;

      // check if the mixin is a function
      if (isFunction(mix)) {
        // create the new mixin instance
        instance = new mix();
      } else instance = mix;

      var proto = Object.getPrototypeOf(instance);

      // build multilevel prototype inheritance chain property list
      do props = props.concat(Object.getOwnPropertyNames(obj || instance));
      while (obj = Object.getPrototypeOf(obj || instance))

      // loop the keys in the function prototype or the all object keys
      each(props, function(key) {
        // bind methods to self
        // allow mixins to override other properties/parent mixins
        if (key != 'init') {
          // check for getters/setters
          var descriptor = Object.getOwnPropertyDescriptor(instance, key) || Object.getOwnPropertyDescriptor(proto, key);
          var hasGetterSetter = descriptor && (descriptor.get || descriptor.set);

          // apply method only if it does not already exist on the instance
          if (!self.hasOwnProperty(key) && hasGetterSetter) {
            Object.defineProperty(self, key, descriptor);
          } else {
            self[key] = isFunction(instance[key]) ?
              instance[key].bind(self) :
              instance[key];
          }
        }
      });

      // init method will be called automatically
      if (instance.init) instance.init.bind(self)();
    });
    return this
  });

  defineProperty(this, 'mount', function() {

    updateOpts();

    // add global mixins
    var globalMixin = riot.mixin(GLOBAL_MIXIN);

    if (globalMixin)
      for (var i in globalMixin)
        if (globalMixin.hasOwnProperty(i))
          self.mixin(globalMixin[i]);

    // children in loop should inherit from true parent
    if (self._parent && self._parent.root.isLoop) {
      inheritFrom(self._parent);
    }

    // initialiation
    if (impl.fn) impl.fn.call(self, opts);

    // parse layout after init. fn may calculate args for nested custom tags
    parseExpressions(dom, self, expressions);

    // mount the child tags
    toggle(true);

    // update the root adding custom attributes coming from the compiler
    // it fixes also #1087
    if (impl.attrs)
      walkAttributes(impl.attrs, function (k, v) { setAttr(root, k, v); });
    if (impl.attrs || hasImpl)
      parseExpressions(self.root, self, expressions);

    if (!self.parent || isLoop) self.update(item);

    // internal use only, fixes #403
    self.trigger('before-mount');

    if (isLoop && !hasImpl) {
      // update the root attribute for the looped elements
      root = dom.firstChild;
    } else {
      while (dom.firstChild) root.appendChild(dom.firstChild);
      if (root.stub) root = parent.root;
    }

    defineProperty(self, 'root', root);

    // parse the named dom nodes in the looped child
    // adding them to the parent as well
    if (isLoop)
      parseNamedElements(self.root, self.parent, null, true);

    // if it's not a child tag we can trigger its mount event
    if (!self.parent || self.parent.isMounted) {
      self.isMounted = true;
      self.trigger('mount');
    }
    // otherwise we need to wait that the parent event gets triggered
    else self.parent.one('mount', function() {
      // avoid to trigger the `mount` event for the tags
      // not visible included in an if statement
      if (!isInStub(self.root)) {
        self.parent.isMounted = self.isMounted = true;
        self.trigger('mount');
      }
    });
  });


  defineProperty(this, 'unmount', function(keepRootTag) {
    var el = root,
      p = el.parentNode,
      ptag,
      tagIndex = __virtualDom.indexOf(self);

    self.trigger('before-unmount');

    // remove this tag instance from the global virtualDom variable
    if (~tagIndex)
      __virtualDom.splice(tagIndex, 1);

    if (p) {

      if (parent) {
        ptag = getImmediateCustomParentTag(parent);
        // remove this tag from the parent tags object
        // if there are multiple nested tags with same name..
        // remove this element form the array
        if (isArray(ptag.tags[tagName]))
          each(ptag.tags[tagName], function(tag, i) {
            if (tag._riot_id == self._riot_id)
              ptag.tags[tagName].splice(i, 1);
          });
        else
          // otherwise just delete the tag instance
          ptag.tags[tagName] = undefined;
      }

      else
        while (el.firstChild) el.removeChild(el.firstChild);

      if (!keepRootTag)
        p.removeChild(el);
      else {
        // the riot-tag and the data-is attributes aren't needed anymore, remove them
        remAttr(p, RIOT_TAG_IS);
        remAttr(p, RIOT_TAG); // this will be removed in riot 3.0.0
      }

    }

    if (this._virts) {
      each(this._virts, function(v) {
        if (v.parentNode) v.parentNode.removeChild(v);
      });
    }

    self.trigger('unmount');
    toggle();
    self.off('*');
    self.isMounted = false;
    delete root._tag;

  });

  // proxy function to bind updates
  // dispatched from a parent tag
  function onChildUpdate(data) { self.update(data, true); }

  function toggle(isMount) {

    // mount/unmount children
    each(childTags, function(child) { child[isMount ? 'mount' : 'unmount'](); });

    // listen/unlisten parent (events flow one way from parent to children)
    if (!parent) return
    var evt = isMount ? 'on' : 'off';

    // the loop tags will be always in sync with the parent automatically
    if (isLoop)
      parent[evt]('unmount', self.unmount);
    else {
      parent[evt]('update', onChildUpdate)[evt]('unmount', self.unmount);
    }
  }


  // named elements available for fn
  parseNamedElements(dom, this, childTags);

}
/**
 * Attach an event to a DOM node
 * @param { String } name - event name
 * @param { Function } handler - event callback
 * @param { Object } dom - dom node
 * @param { Tag } tag - tag instance
 */
function setEventHandler(name, handler, dom, tag) {

  dom[name] = function(e) {

    var ptag = tag._parent,
      item = tag._item,
      el;

    if (!item)
      while (ptag && !item) {
        item = ptag._item;
        ptag = ptag._parent;
      }

    // cross browser event fix
    e = e || window.event;

    // override the event properties
    if (isWritable(e, 'currentTarget')) e.currentTarget = dom;
    if (isWritable(e, 'target')) e.target = e.srcElement;
    if (isWritable(e, 'which')) e.which = e.charCode || e.keyCode;

    e.item = item;

    // prevent default behaviour (by default)
    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;
    }

    if (!e.preventUpdate) {
      el = item ? getImmediateCustomParentTag(ptag) : tag;
      el.update();
    }

  };

}


/**
 * Insert a DOM node replacing another one (used by if- attribute)
 * @param   { Object } root - parent node
 * @param   { Object } node - node replaced
 * @param   { Object } before - node added
 */
function insertTo(root, node, before) {
  if (!root) return
  root.insertBefore(before, node);
  root.removeChild(node);
}

/**
 * Update the expressions in a Tag instance
 * @param   { Array } expressions - expression that must be re evaluated
 * @param   { Tag } tag - tag instance
 */
function update(expressions, tag) {

  each(expressions, function(expr, i) {

    var dom = expr.dom,
      attrName = expr.attr,
      value = tmpl(expr.expr, tag),
      parent = expr.parent || expr.dom.parentNode;

    if (expr.bool) {
      value = !!value;
    } else if (value == null) {
      value = '';
    }

    // #1638: regression of #1612, update the dom only if the value of the
    // expression was changed
    if (expr.value === value) {
      return
    }
    expr.value = value;

    // textarea and text nodes has no attribute name
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
          if (!IE_VERSION) dom.nodeValue = value;  // #1625 IE throws here, nodeValue
        }                                         // will be available on 'updated'
        else dom.nodeValue = value;
      }
      return
    }

    // ~~#1612: look for changes in dom.value when updating the value~~
    if (attrName === 'value') {
      if (dom.value !== value) {
        dom.value = value;
        setAttr(dom, attrName, value);
      }
      return
    } else {
      // remove original attribute
      remAttr(dom, attrName);
    }

    // event handler
    if (isFunction(value)) {
      setEventHandler(attrName, value, dom, tag);

    // if- conditional
    } else if (attrName == 'if') {
      var stub = expr.stub,
        add = function() { insertTo(stub.parentNode, stub, dom); },
        remove = function() { insertTo(dom.parentNode, dom, stub); };

      // add to DOM
      if (value) {
        if (stub) {
          add();
          dom.inStub = false;
          // avoid to trigger the mount event if the tags is not visible yet
          // maybe we can optimize this avoiding to mount the tag at all
          if (!isInStub(dom)) {
            walk(dom, function(el) {
              if (el._tag && !el._tag.isMounted)
                el._tag.isMounted = !!el._tag.trigger('mount');
            });
          }
        }
      // remove from DOM
      } else {
        stub = expr.stub = stub || document.createTextNode('');
        // if the parentNode is defined we can easily replace the tag
        if (dom.parentNode)
          remove();
        // otherwise we need to wait the updated event
        else (tag.parent || tag).one('updated', remove);

        dom.inStub = true;
      }
    // show / hide
    } else if (attrName === 'show') {
      dom.style.display = value ? '' : 'none';

    } else if (attrName === 'hide') {
      dom.style.display = value ? 'none' : '';

    } else if (expr.bool) {
      dom[attrName] = value;
      if (value) setAttr(dom, attrName, attrName);
      if (FIREFOX && attrName === 'selected' && dom.tagName === 'OPTION') {
        dom.__riot1374 = value;   // #1374
      }

    } else if (value === 0 || value && typeof value !== T_OBJECT) {
      // <img src="{ expr }">
      if (startsWith(attrName, RIOT_PREFIX) && attrName != RIOT_TAG) {
        attrName = attrName.slice(RIOT_PREFIX.length);
      }
      setAttr(dom, attrName, value);
    }

  });

}
/**
 * Specialized function for looping an array-like collection with `each={}`
 * @param   { Array } els - collection of items
 * @param   {Function} fn - callback function
 * @returns { Array } the array looped
 */
function each(els, fn) {
  var len = els ? els.length : 0;

  for (var i = 0, el; i < len; i++) {
    el = els[i];
    // return false -> current item was removed by fn during the loop
    if (el != null && fn(el, i) === false) i--;
  }
  return els
}

/**
 * Detect if the argument passed is a function
 * @param   { * } v - whatever you want to pass to this function
 * @returns { Boolean } -
 */
function isFunction(v) {
  return typeof v === T_FUNCTION || false   // avoid IE problems
}

/**
 * Get the outer html of any DOM node SVGs included
 * @param   { Object } el - DOM node to parse
 * @returns { String } el.outerHTML
 */
function getOuterHTML(el) {
  if (el.outerHTML) return el.outerHTML
  // some browsers do not support outerHTML on the SVGs tags
  else {
    var container = mkEl('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

/**
 * Set the inner html of any DOM node SVGs included
 * @param { Object } container - DOM node where we will inject the new html
 * @param { String } html - html to inject
 */
function setInnerHTML(container, html) {
  if (typeof container.innerHTML != T_UNDEF) container.innerHTML = html;
  // some browsers do not support innerHTML on the SVGs tags
  else {
    var doc = new DOMParser().parseFromString(html, 'application/xml');
    container.appendChild(
      container.ownerDocument.importNode(doc.documentElement, true)
    );
  }
}

/**
 * Checks wether a DOM node must be considered part of an svg document
 * @param   { String }  name - tag name
 * @returns { Boolean } -
 */
function isSVGTag(name) {
  return ~SVG_TAGS_LIST.indexOf(name)
}

/**
 * Detect if the argument passed is an object, exclude null.
 * NOTE: Use isObject(x) && !isArray(x) to excludes arrays.
 * @param   { * } v - whatever you want to pass to this function
 * @returns { Boolean } -
 */
function isObject(v) {
  return v && typeof v === T_OBJECT         // typeof null is 'object'
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
 * Convert a string containing dashes to camel case
 * @param   { String } string - input string
 * @returns { String } my-string -> myString
 */
function toCamel(string) {
  return string.replace(/-(\w)/g, function(_, c) {
    return c.toUpperCase()
  })
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
 * Set any DOM/SVG attribute
 * @param { Object } dom - DOM node we want to update
 * @param { String } name - name of the property we want to set
 * @param { String } val - value of the property we want to set
 */
function setAttr(dom, name, val) {
  var xlink = XLINK_REGEX.exec(name);
  if (xlink && xlink[1])
    dom.setAttributeNS(XLINK_NS, xlink[1], val);
  else
    dom.setAttribute(name, val);
}

/**
 * Detect the tag implementation by a DOM node
 * @param   { Object } dom - DOM node we need to parse to get its tag implementation
 * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
 */
function getTag(dom) {
  return dom.tagName && __tagImpl[getAttr(dom, RIOT_TAG_IS) ||
    getAttr(dom, RIOT_TAG) || dom.tagName.toLowerCase()]
}
/**
 * Add a child tag to its parent into the `tags` object
 * @param   { Object } tag - child tag instance
 * @param   { String } tagName - key where the new tag will be stored
 * @param   { Object } parent - tag instance where the new child tag will be included
 */
function addChildTag(tag, tagName, parent) {
  var cachedTag = parent.tags[tagName];

  // if there are multiple children tags having the same name
  if (cachedTag) {
    // if the parent tags property is not yet an array
    // create it adding the first cached tag
    if (!isArray(cachedTag))
      // don't add the same tag twice
      if (cachedTag !== tag)
        parent.tags[tagName] = [cachedTag];
    // add the new nested tag to the array
    if (!contains(parent.tags[tagName], tag))
      parent.tags[tagName].push(tag);
  } else {
    parent.tags[tagName] = tag;
  }
}

/**
 * Move the position of a custom tag in its parent tag
 * @param   { Object } tag - child tag instance
 * @param   { String } tagName - key where the tag was stored
 * @param   { Number } newPos - index where the new tag will be stored
 */
function moveChildTag(tag, tagName, newPos) {
  var parent = tag.parent,
    tags;
  // no parent no move
  if (!parent) return

  tags = parent.tags[tagName];

  if (isArray(tags))
    tags.splice(newPos, 0, tags.splice(tags.indexOf(tag), 1)[0]);
  else addChildTag(tag, tagName, parent);
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
  var tag = new Tag(child, opts, innerHTML),
    tagName = getTagName(opts.root),
    ptag = getImmediateCustomParentTag(parent);
  // fix for the parent attribute in the looped elements
  tag.parent = ptag;
  // store the real parent tag
  // in some cases this could be different from the custom parent tag
  // for example in nested loops
  tag._parent = parent;

  // add this tag to the custom parent tag
  addChildTag(tag, tagName, ptag);
  // and also to the real parent tag
  if (ptag !== parent)
    addChildTag(tag, tagName, parent);
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
  while (!getTag(ptag.root)) {
    if (!ptag.parent) break
    ptag = ptag.parent;
  }
  return ptag
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
 * Get the tag name of any DOM node
 * @param   { Object } dom - DOM node we want to parse
 * @returns { String } name to identify this dom node in riot
 */
function getTagName(dom) {
  var child = getTag(dom),
    namedTag = getAttr(dom, 'name'),
    tagName = namedTag && !tmpl.hasExpr(namedTag) ?
                namedTag :
              child ? child.name : dom.tagName.toLowerCase();

  return tagName
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
          src[key] = obj[key];
      }
    }
  }
  return src
}

/**
 * Check whether an array contains an item
 * @param   { Array } arr - target array
 * @param   { * } item - item to test
 * @returns { Boolean } Does 'arr' contain 'item'?
 */
function contains(arr, item) {
  return ~arr.indexOf(item)
}

/**
 * Check whether an object is a kind of array
 * @param   { * } a - anything
 * @returns {Boolean} is 'a' an array?
 */
function isArray(a) { return Array.isArray(a) || a instanceof Array }

/**
 * Detect whether a property of an object could be overridden
 * @param   { Object }  obj - source object
 * @param   { String }  key - object property
 * @returns { Boolean } is this property writable?
 */
function isWritable(obj, key) {
  var props = Object.getOwnPropertyDescriptor(obj, key);
  return typeof obj[key] === T_UNDEF || props && props.writable
}


/**
 * With this function we avoid that the internal Tag methods get overridden
 * @param   { Object } data - options we want to use to extend the tag instance
 * @returns { Object } clean object without containing the riot internal reserved words
 */
function cleanUpData(data) {
  if (!(data instanceof Tag) && !(data && typeof data.trigger == T_FUNCTION))
    return data

  var o = {};
  for (var key in data) {
    if (!RESERVED_WORDS_BLACKLIST.test(key)) o[key] = data[key];
  }
  return o
}

/**
 * Walk down recursively all the children tags starting dom node
 * @param   { Object }   dom - starting node where we will start the recursion
 * @param   { Function } fn - callback to transform the child node just found
 */
function walk(dom, fn) {
  if (dom) {
    // stop the recursion
    if (fn(dom) === false) return
    else {
      dom = dom.firstChild;

      while (dom) {
        walk(dom, fn);
        dom = dom.nextSibling;
      }
    }
  }
}

/**
 * Minimize risk: only zero or one _space_ between attr & value
 * @param   { String }   html - html string we want to parse
 * @param   { Function } fn - callback function to apply on any attribute found
 */
function walkAttributes(html, fn) {
  var m,
    re = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g;

  while (m = re.exec(html)) {
    fn(m[1].toLowerCase(), m[2] || m[3] || m[4]);
  }
}

/**
 * Check whether a DOM node is in stub mode, useful for the riot 'if' directive
 * @param   { Object }  dom - DOM node we want to parse
 * @returns { Boolean } -
 */
function isInStub(dom) {
  while (dom) {
    if (dom.inStub) return true
    dom = dom.parentNode;
  }
  return false
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
 * Simple object prototypal inheritance
 * @param   { Object } parent - parent object
 * @returns { Object } child instance
 */
function inherit(parent) {
  return Object.create(parent || null)
}

/**
 * Get the name property needed to identify a DOM node in riot
 * @param   { Object } dom - DOM node we need to parse
 * @returns { String | undefined } give us back a string to identify this dom node
 */
function getNamedKey(dom) {
  return getAttr(dom, 'id') || getAttr(dom, 'name')
}

/**
 * Set the named properties of a tag element
 * @param { Object } dom - DOM node we need to parse
 * @param { Object } parent - tag instance where the named dom element will be eventually added
 * @param { Array } keys - list of all the tag instance properties
 */
function setNamed(dom, parent, keys) {
  // get the key value we want to add to the tag instance
  var key = getNamedKey(dom),
    isArr,
    // add the node detected to a tag instance using the named property
    add = function(value) {
      // avoid to override the tag properties already set
      if (contains(keys, key)) return
      // check whether this value is an array
      isArr = isArray(value);
      // if the key was never set
      if (!value)
        // set it once on the tag instance
        parent[key] = dom;
      // if it was an array and not yet set
      else if (!isArr || isArr && !contains(value, dom)) {
        // add the dom node into the array
        if (isArr)
          value.push(dom);
        else
          parent[key] = [value, dom];
      }
    };

  // skip the elements with no named properties
  if (!key) return

  // check whether this key has been already evaluated
  if (tmpl.hasExpr(key))
    // wait the first updated event only once
    parent.one('mount', function() {
      key = getNamedKey(dom);
      add(parent[key]);
    });
  else
    add(parent[key]);

}

/**
 * Faster String startsWith alternative
 * @param   { String } src - source string
 * @param   { String } str - test string
 * @returns { Boolean } -
 */
function startsWith(src, str) {
  return src.slice(0, str.length) === str
}

/**
 * requestAnimationFrame function
 * Adapted from https://gist.github.com/paulirish/1579671, license MIT
 */
var rAF = (function (w) {
  var raf = w.requestAnimationFrame    ||
            w.mozRequestAnimationFrame || w.webkitRequestAnimationFrame;

  if (!raf || /iP(ad|hone|od).*OS 6/.test(w.navigator.userAgent)) {  // buggy iOS6
    var lastTime = 0;

    raf = function (cb) {
      var nowtime = Date.now(), timeout = Math.max(16 - (nowtime - lastTime), 0);
      setTimeout(function () { cb(lastTime = nowtime + timeout); }, timeout);
    };
  }
  return raf

})(window || {});

/**
 * Mount a tag creating new Tag instance
 * @param   { Object } root - dom node where the tag will be mounted
 * @param   { String } tagName - name of the riot tag we want to mount
 * @param   { Object } opts - options to pass to the Tag instance
 * @returns { Tag } a new Tag instance
 */
function mountTo(root, tagName, opts) {
  var tag = __tagImpl[tagName],
    // cache the inner HTML to fix #855
    innerHTML = root._innerHTML = root._innerHTML || root.innerHTML;

  // clear the inner html
  root.innerHTML = '';

  if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML);

  if (tag && tag.mount) {
    tag.mount();
    // add this tag to the virtualDom variable
    if (!contains(__virtualDom, tag)) __virtualDom.push(tag);
  }

  return tag
}
/**
 * Riot public api
 */

// share methods for other riot parts, e.g. compiler
riot.util = { brackets: brackets, tmpl: tmpl };

/**
 * Create a mixin that could be globally shared across all the tags
 */
riot.mixin = (function() {
  var mixins = {},
    globals = mixins[GLOBAL_MIXIN] = {},
    _id = 0;

  /**
   * Create/Return a mixin by its name
   * @param   { String }  name - mixin name (global mixin if object)
   * @param   { Object }  mixin - mixin logic
   * @param   { Boolean } g - is global?
   * @returns { Object }  the mixin logic
   */
  return function(name, mixin, g) {
    // Unnamed global
    if (isObject(name)) {
      riot.mixin('__unnamed_'+_id++, name, true);
      return
    }

    var store = g ? globals : mixins;

    // Getter
    if (!mixin) {
      if (typeof store[name] === T_UNDEF) {
        throw new Error('Unregistered mixin: ' + name)
      }
      return store[name]
    }
    // Setter
    if (isFunction(mixin)) {
      extend(mixin.prototype, store[name] || {});
      store[name] = mixin;
    }
    else {
      store[name] = extend(store[name] || {}, mixin);
    }
  }

})();

/**
 * Create a new riot tag implementation
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   html - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
riot.tag = function(name, html, css, attrs, fn) {
  if (isFunction(attrs)) {
    fn = attrs;
    if (/^[\w\-]+\s?=/.test(css)) {
      attrs = css;
      css = '';
    } else attrs = '';
  }
  if (css) {
    if (isFunction(css)) fn = css;
    else styleManager.add(css);
  }
  name = name.toLowerCase();
  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn };
  return name
};

/**
 * Create a new riot tag implementation (for use by the compiler)
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   html - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
riot.tag2 = function(name, html, css, attrs, fn) {
  if (css) styleManager.add(css);
  //if (bpair) riot.settings.brackets = bpair
  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn };
  return name
};

/**
 * Mount a tag using a specific tag implementation
 * @param   { String } selector - tag DOM selector
 * @param   { String } tagName - tag implementation name
 * @param   { Object } opts - tag logic
 * @returns { Array } new tags instances
 */
riot.mount = function(selector, tagName, opts) {

  var els,
    allTags,
    tags = [];

  // helper functions

  function addRiotTags(arr) {
    var list = '';
    each(arr, function (e) {
      if (!/[^-\w]/.test(e)) {
        e = e.trim().toLowerCase();
        list += ',[' + RIOT_TAG_IS + '="' + e + '"],[' + RIOT_TAG + '="' + e + '"]';
      }
    });
    return list
  }

  function selectAllTags() {
    var keys = Object.keys(__tagImpl);
    return keys + addRiotTags(keys)
  }

  function pushTags(root) {
    if (root.tagName) {
      var riotTag = getAttr(root, RIOT_TAG_IS) || getAttr(root, RIOT_TAG);

      // have tagName? force riot-tag to be the same
      if (tagName && riotTag !== tagName) {
        riotTag = tagName;
        setAttr(root, RIOT_TAG_IS, tagName);
        setAttr(root, RIOT_TAG, tagName); // this will be removed in riot 3.0.0
      }
      var tag = mountTo(root, riotTag || root.tagName.toLowerCase(), opts);

      if (tag) tags.push(tag);
    } else if (root.length) {
      each(root, pushTags);   // assume nodeList
    }
  }

  // ----- mount code -----

  // inject styles into DOM
  styleManager.inject();

  if (isObject(tagName)) {
    opts = tagName;
    tagName = 0;
  }

  // crawl the DOM to find the tag
  if (typeof selector === T_STRING) {
    if (selector === '*')
      // select all the tags registered
      // and also the tags found with the riot-tag attribute set
      selector = allTags = selectAllTags();
    else
      // or just the ones named like the selector
      selector += addRiotTags(selector.split(/, */));

    // make sure to pass always a selector
    // to the querySelectorAll function
    els = selector ? $$(selector) : [];
  }
  else
    // probably you have passed already a tag or a NodeList
    els = selector;

  // select all the registered and mount them inside their root elements
  if (tagName === '*') {
    // get all custom tags
    tagName = allTags || selectAllTags();
    // if the root els it's just a single tag
    if (els.tagName)
      els = $$(tagName, els);
    else {
      // select all the children for all the different root elements
      var nodeList = [];
      each(els, function (_el) {
        nodeList.push($$(tagName, _el));
      });
      els = nodeList;
    }
    // get rid of the tagName
    tagName = 0;
  }

  pushTags(els);

  return tags
};

/**
 * Update all the tags instances created
 * @returns { Array } all the tags instances
 */
riot.update = function() {
  return each(__virtualDom, function(tag) {
    tag.update();
  })
};

/**
 * Export the Virtual DOM
 */
riot.vdom = __virtualDom;

/**
 * Export the Tag constructor
 */
riot.Tag = Tag;
  // support CommonJS, AMD & browser
  /* istanbul ignore next */
  if (typeof exports === T_OBJECT)
    module.exports = riot;
  else if (typeof define === T_FUNCTION && typeof define.amd !== T_UNDEF)
    define(function() { return riot });
  else
    window.riot = riot;

})(typeof window != 'undefined' ? window : void 0);
});

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
    this.redoStack = [];
    this.currentPatches = [];

    this.stringify = typeof initialState !== 'string';
    this.currentState = JSON.parse(JSON.stringify(initialState));
    this.stateChange = typeof stateChange === 'function' ? stateChange : function () {};

    this.undoMax = 50;
  }

  undo () {
    var patches = this.undoStack.pop();
    if (!patches) {
      return
    }
    this.redoStack.push(this.currentPatches);
    this.currentPatches = patches;
    this.restoreState();
    return this.currentState
  }
  redo () {
    var patches = this.redoStack.pop();
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

    var newState = applyPatches(this.currentPatches, this.currentStateText);
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

/**
 * http://www.color-sample.com/popular/jiscolor/en/
 * (.+)\n\s(#[a-f\d]+)\s(.+?)\s[\w ]+
 *   ['$2', '$1', '$3'],
 */
const jiscolor_en = [
  ['#EF454A', 'Vermilion', 'バーミリオン'],
  ['#662B2C', 'Maroon', 'マルーン'],
  ['#EA9198', 'Pink', 'ピンク'],
  ['#533638', 'Bordeaux', 'ボルドー'],
  ['#DF3447', 'Tomato Red', 'トマトレッド'],
  ['#DF3447', 'Red', 'レッド'],
  ['#FF7F8F', 'Coral Red', 'コーラルレッド'],
  ['#C67A85', 'Old Rose', 'オールドローズ'],
  ['#442E31', 'Burgundy', 'バーガンディー'],
  ['#DF334E', 'Poppy Red', 'ポピーレッド'],
  ['#CE2143', 'Signal red', 'シグナルレッド'],
  ['#EE8EA0', 'Rose Pink', 'ローズピンク'],
  ['#DB3561', 'Rose', 'ローズ'],
  ['#80273F', 'Wine Red', 'ワインレッド'],
  ['#BE0039', 'Carmine', 'カーマイン'],
  ['#AE2B52', 'Cochineal Red', 'コチニールレッド'],
  ['#CA4775', 'Rose Red', 'ローズレッド'],
  ['#B90B50', 'Ruby Red', 'ルビーレッド'],
  ['#D35889', 'Cherry Pink', 'チェリーピンク'],
  ['#BB004B', 'Strawberry', 'ストロベリー'],
  ['#D13A84', 'Magenta', 'マゼンタ'],
  ['#C69CC5', 'Orchid', 'オーキッド'],
  ['#A757A8', 'Purple', 'パープル'],
  ['#C29DC8', 'Lilac', 'ライラック'],
  ['#9A8A9F', 'Lavender', 'ラベンダー'],
  ['#855896', 'Mauve', 'モーブ'],
  ['#4B474D', 'Charcoal Grey', 'チャコールグレイ'],
  ['#6D696F', 'Steel Grey', 'スチールグレイ'],
  ['#714C99', 'Violet', 'バイオレット'],
  ['#8865B2', 'Heliotrope', 'ヘリオトロープ'],
  ['#433171', 'Pansy', 'パンジー'],
  ['#7967C3', 'Wistaria', 'ウイスタリア'],
  ['#304285', 'Oriental Blue', 'オリエンタルブルー'],
  ['#384D98', 'Ultramarine Blue', 'ウルトラマリンブルー'],
  ['#343D55', 'Navy Blue', 'ネービーブルー'],
  ['#252A35', 'Midnight Blue', 'ミッドナイトブルー'],
  ['#6E82AD', 'Hyacinth', 'ヒヤシンス'],
  ['#3A4861', 'Prussian Blue', 'プルシャンブルー'],
  ['#3A4861', 'Iron Blue', 'アイアンブルー'],
  ['#515356', 'Slate Grey', 'スレートグレイ'],
  ['#5A7993', 'Sax Blue', 'サックスブルー'],
  ['#A3BACD', 'Baby Blue', 'ベビーブルー'],
  ['#0062A0', 'Cobalt Blue', 'コバルトブルー'],
  ['#89BDDE', 'Sky Blue', 'スカイブルー'],
  ['#B3B8BB', 'Sky Grey', 'スカイグレイ'],
  ['#006FAB', 'Blue', 'ブルー'],
  ['#87AFC5', 'Horizon Blue', 'ホリゾンブルー'],
  ['#0073A2', 'Cerulean Blue', 'セルリアンブルー'],
  ['#009CD1', 'Cyan', 'シアン'],
  ['#00526B', 'Marine Blue', 'マリンブルー'],
  ['#009DBF', 'Turquoise Blue', 'ターコイズブルー'],
  ['#006E7B', 'Peacock Blue', 'ピーコックブルー'],
  ['#3D8E95', 'Nile Blue', 'ナイルブルー'],
  ['#007D7F', 'Peacock Green', 'ピーコックグリーン'],
  ['#00483A', 'Billiard Green', 'ビリヤードグリーン'],
  ['#006D56', 'Viridian', 'ビリジアン'],
  ['#2A7762', 'Forest Green', 'フォレストグリーン'],
  ['#00A474', 'Emerald Green', 'エメラルドグリーン'],
  ['#09C289', 'Cobalt Green', 'コバルトグリーン'],
  ['#007E4E', 'Malachite Green', 'マラカイトグリーン'],
  ['#204537', 'Bottle Green', 'ボトルグリーン'],
  ['#009A57', 'Green', 'グリーン'],
  ['#58CE91', 'Mint Green', 'ミントグリーン'],
  ['#A2D29E', 'Apple Green', 'アップルグリーン'],
  ['#4C6733', 'Ivy Green', 'アイビーグリーン'],
  ['#97B64D', 'Sea Green', 'シーグリーン'],
  ['#89983B', 'Leaf Green', 'リーフグリーン'],
  ['#737C3E', 'Grass Green', 'グラスグリーン'],
  ['#C0D136', 'Chartreuse Green', 'シャトルーズグリーン'],
  ['#575531', 'Olive Green', 'オリーブグリーン'],
  ['#D9CA00', 'Lemon Yellow', 'レモンイエロー'],
  ['#F4D500', 'Jaune Brillant', 'ジョンブリアン'],
  ['#F4D500', 'Yellow', 'イエロー'],
  ['#EDD634', 'Canary Yellow', 'カナリヤ'],
  ['#5C5424', 'Olive', 'オリーブ'],
  ['#655F47', 'Olive Drab', 'オリーブドラブ'],
  ['#F6BF00', 'Chrome Yellow', 'クロムイエロー'],
  ['#E4D3A2', 'Cream Yellow', 'クリームイエロー'],
  ['#765B1B', 'Raw umber', 'ローアンバー'],
  ['#EEC063', 'Naples Yellow', 'ネープルスイエロー'],
  ['#FFA400', 'Marigold', 'マリーゴールド'],
  ['#DFC291', 'Leghorn', 'レグホーン'],
  ['#B8883B', 'Yellow Ocher', 'イエローオーカー'],
  ['#DED2BF', 'Ivory', 'アイボリー'],
  ['#57462D', 'Burnt Umber', 'バーントアンバー'],
  ['#483C2C', 'Sepia', 'セピア'],
  ['#7A592F', 'Bronze', 'ブロンズ'],
  ['#BCA78D', 'Beige', 'ベージュ'],
  ['#F09629', 'Mandarin Orange', 'マンダリンオレンジ'],
  ['#E89A3C', 'Golden Yellow', 'ゴールデンイエロー'],
  ['#AA7A40', 'Amber', 'アンバー'],
  ['#C09567', 'Buff', 'バフ'],
  ['#EF810F', 'Orange', 'オレンジ'],
  ['#F5CDA6', 'Ecru Beige', 'エクルベイジュ'],
  ['#9E6C3F', 'Tan', 'タン'],
  ['#D89F6D', 'Apricot', 'アプリコット'],
  ['#9F7C5C', 'Cork', 'コルク'],
  ['#B1632A', 'Raw Sienna', 'ローシェンナ'],
  ['#6D4C33', 'Brown', 'ブラウン'],
  ['#E8BDA5', 'Peach', 'ピーチ'],
  ['#704B38', 'Cocoa Brown', 'ココアブラウン'],
  ['#F6A57D', 'Blond', 'ブロンド'],
  ['#A36851', 'Khaki', 'カーキー'],
  ['#EFBAA8', 'Nail Pink', 'ネールピンク'],
  ['#C55431', 'Carrot Orange', 'キャロットオレンジ'],
  ['#A2553C', 'Burnt Sienna', 'バーントシェンナ'],
  ['#503830', 'Chocolate', 'チョコレート'],
  ['#F9C9B9', 'Shell Pink', 'シェルピンク'],
  ['#FD5A2A', 'Chinese Red', 'チャイニーズレッド'],
  ['#FF9E8C', 'Salmon pink', 'サーモンピンク'],
  ['#A95045', 'Terracotta', 'テラコッタ'],
  ['#FEC6C5', 'Baby Pink', 'ベビーピンク'],
  ['#DE3838', 'Scarlet', 'スカーレット'],
  ['#8C8080', 'Rose Grey', 'ローズグレイ'],
  ['#F0F0F0', 'Snow White', 'スノーホワイト'],
  ['#F0F0F0', 'White', 'ホワイト'],
  ['#AAAAAA', 'Pearl Grey', 'パールグレイ'],
  ['#9C9C9C', 'Silver Grey', 'シルバーグレイ'],
  ['#8F8F8F', 'Ash Grey', 'アッシュグレイ'],
  ['#767676', 'Grey', 'グレイ'],
  ['#212121', 'Black', 'ブラック'],
  ['#212121', 'Lamp Black', 'ランプブラック'],
];

const jiscolor_ja = [
  ['#EF454A', '朱色', 'しゅいろ'],
  ['#94474B', '蘇芳', 'すおう'],
  ['#E38089', '桃色', 'ももいろ'],
  ['#DF828A', '紅梅色', 'こうばいいろ'],
  ['#AD3140', '臙脂', 'えんじ'],
  ['#FF7F8F', '珊瑚色', 'さんごいろ'],
  ['#FBDADE', '桜色', 'さくらいろ'],
  ['#9E2236', '茜色', 'あかねいろ'],
  ['#E64B6B', '韓紅', 'からくれない'],
  ['#B81A3E', '紅赤', 'べにあか'],
  ['#D53E62', '薔薇色', 'ばらいろ'],
  ['#BE0032', '赤', 'あか'],
  ['#FA9CB8', '鴇色', 'ときいろ'],
  ['#BE003F', '紅色', 'べにいろ'],
  ['#CF4078', '躑躅色', 'つつじいろ'],
  ['#DA508F', '赤紫', 'あかむらさき'],
  ['#C94093', '牡丹色', 'ぼたんいろ'],
  ['#C573B2', '菖蒲色', 'あやめいろ'],
  ['#473946', '茄子紺', 'なすこん'],
  ['#422C41', '紫紺', 'しこん'],
  ['#765276', '古代紫', 'こだいむらさき'],
  ['#A757A8', '紫', 'むらさき'],
  ['#614876', '江戸紫', 'えどむらさき'],
  ['#665971', '鳩羽色', 'はとばいろ'],
  ['#744B98', '菖蒲色', 'しょうぶいろ'],
  ['#714C99', '菫色', 'すみれいろ'],
  ['#7445AA', '青紫', 'あおむらさき'],
  ['#9883C9', '藤紫', 'ふじむらさき'],
  ['#A294C8', '藤色', 'ふじいろ'],
  ['#69639A', '藤納戸', 'ふじなんど'],
  ['#353573', '紺藍', 'こんあい'],
  ['#292934', '鉄紺', 'てつこん'],
  ['#4347A2', '桔梗色', 'ききょういろ'],
  ['#3A3C4F', '勝色', 'かちいろ'],
  ['#384D98', '群青色', 'ぐんじょういろ'],
  ['#435AA0', '杜若色', 'かきつばたいろ'],
  ['#343D55', '紺色', 'こんいろ'],
  ['#3A4861', '紺青', 'こんじょう'],
  ['#27477A', '瑠璃紺', 'るりこん'],
  ['#89ACD7', '勿忘草色', 'わすれなぐさいろ'],
  ['#72777D', '鉛色', 'なまりいろ'],
  ['#00519A', '瑠璃色', 'るりいろ'],
  ['#223546', '濃藍', 'こいあい'],
  ['#2B618F', '縹色', 'はなだいろ'],
  ['#2B4B65', '藍色', 'あいいろ'],
  ['#006AB6', '青', 'あお'],
  ['#89BDDE', '空色', 'そらいろ'],
  ['#007BC3', '露草色', 'つゆくさいろ'],
  ['#576D79', '藍鼠', 'あいねず'],
  ['#9DCCE0', '水色', 'みずいろ'],
  ['#7EB1C1', '甕覗き', 'かめのぞき'],
  ['#73B3C1', '白群', 'びゃくぐん'],
  ['#00687C', '納戸色', 'なんどいろ'],
  ['#00859B', '浅葱色', 'あさぎいろ'],
  ['#53A8B7', '新橋色', 'しんばしいろ'],
  ['#6D969C', '水浅葱', 'みずあさぎ'],
  ['#608A8E', '錆浅葱', 'さびあさぎ'],
  ['#008E94', '青緑', 'あおみどり'],
  ['#24433E', '鉄色', 'てついろ'],
  ['#6AA89D', '青竹色', 'あおたけいろ'],
  ['#00A37E', '若竹色', 'わかたけいろ'],
  ['#00533E', '萌葱色', 'もえぎいろ'],
  ['#6DA895', '青磁色', 'せいじいろ'],
  ['#007B50', '常磐色', 'ときわいろ'],
  ['#005638', '深緑', 'ふかみどり'],
  ['#00B66E', '緑', 'みどり'],
  ['#3C6754', '千歳緑', 'ちとせみどり'],
  ['#4D8169', '緑青色', 'ろくしょういろ'],
  ['#BADBC7', '白緑', 'びゃくろく'],
  ['#6E7972', '利休鼠', 'りきゅうねずみ'],
  ['#687E52', '松葉色', 'まつばいろ'],
  ['#A9C087', '若葉色', 'わかばいろ'],
  ['#737C3E', '草色', 'くさいろ'],
  ['#97A61E', '萌黄', 'もえぎ'],
  ['#AAB300', '若草色', 'わかくさいろ'],
  ['#BBC000', '黄緑', 'きみどり'],
  ['#7C7A37', '苔色', 'こけいろ'],
  ['#C2BD3D', '鶸色', 'ひわいろ'],
  ['#706C3E', '鶯色', 'うぐいすいろ'],
  ['#D6C949', '黄檗色', 'きはだいろ'],
  ['#C0BA7F', '抹茶色', 'まっちゃいろ'],
  ['#EDD60E', '中黄', 'ちゅうき'],
  ['#E3C700', '蒲公英色', 'たんぽぽいろ'],
  ['#E3C700', '黄色', 'きいろ'],
  ['#EAD56B', '刈安色', 'かりやすいろ'],
  ['#716B4A', '海松色', 'みるいろ'],
  ['#6A5F37', '鶯茶', 'うぐいすちゃ'],
  ['#EDAE00', '鬱金色', 'うこんいろ'],
  ['#FFBB00', '向日葵色', 'ひまわりいろ'],
  ['#F8A900', '山吹色', 'やまぶきいろ'],
  ['#C8A65D', '芥子色', 'からしいろ'],
  ['#B47700', '金茶', 'きんちゃ'],
  ['#B8883B', '黄土色', 'おうどいろ'],
  ['#C5B69E', '砂色', 'すないろ'],
  ['#DED2BF', '象牙色', 'ぞうげいろ'],
  ['#EBE7E1', '胡粉色', 'ごふんいろ'],
  ['#F4BD6B', '卵色', 'たまごいろ'],
  ['#EB8400', '蜜柑色', 'みかんいろ'],
  ['#6B3E08', '褐色', 'かっしょく'],
  ['#9F6C31', '土色', 'つちいろ'],
  ['#AA7A40', '琥珀色', 'こはくいろ'],
  ['#847461', '朽葉色', 'くちばいろ'],
  ['#5D5245', '煤竹色', 'すすたけいろ'],
  ['#D4A168', '小麦色', 'こむぎいろ'],
  ['#EAE0D5', '生成り色', 'きなりいろ'],
  ['#EF810F', '橙色', 'だいだいいろ'],
  ['#D89F6D', '杏色', 'あんずいろ'],
  ['#FAA55C', '柑子色', 'こうじいろ'],
  ['#B1632A', '黄茶', 'きちゃ'],
  ['#6D4C33', '茶色', 'ちゃいろ'],
  ['#F1BB93', '肌色', 'はだいろ'],
  ['#B0764F', '駱駝色', 'らくだいろ'],
  ['#816551', '灰茶', 'はいちゃ'],
  ['#564539', '焦茶', 'こげちゃ'],
  ['#D86011', '黄赤', 'きあか'],
  ['#998D86', '茶鼠', 'ちゃねずみ'],
  ['#B26235', '代赭', 'たいしゃ'],
  ['#704B38', '栗色', 'くりいろ'],
  ['#3E312B', '黒茶', 'くろちゃ'],
  ['#865C4B', '桧皮色', 'ひわだいろ'],
  ['#B64826', '樺色', 'かばいろ'],
  ['#DB5C35', '柿色', 'かきいろ'],
  ['#EB6940', '黄丹', 'おうに'],
  ['#914C35', '煉瓦色', 'れんがいろ'],
  ['#B5725C', '肉桂色', 'にっけいいろ'],
  ['#624035', '錆色', 'さびいろ'],
  ['#E65226', '赤橙', 'あかだいだい'],
  ['#8D3927', '赤錆色', 'あかさびいろ'],
  ['#AD4E39', '赤茶', 'あかちゃ'],
  ['#EA4E31', '金赤', 'きんあか'],
  ['#693C34', '海老茶', 'えびちゃ'],
  ['#905D54', '小豆色', 'あずきいろ'],
  ['#863E33', '弁柄色', 'べんがらいろ'],
  ['#6D3A33', '紅海老茶', 'べにえびちゃ'],
  ['#7A453D', '鳶色', 'とびいろ'],
  ['#D1483E', '鉛丹色', 'えんたんいろ'],
  ['#9E413F', '紅樺色', 'べにかばいろ'],
  ['#EF4644', '紅緋', 'べにひ'],
  ['#F0F0F0', '白', 'しろ'],
  ['#9C9C9C', '銀鼠', 'ぎんねず'],
  ['#838383', '鼠色', 'ねずみいろ'],
  ['#767676', '灰色', 'はいいろ'],
  ['#343434', '墨', 'すみ'],
  ['#2A2A2A', '鉄黒', 'てつぐろ'],
  ['#2A2A2A', '黒', 'くろ'],
];

const material_color = {
  Red: ['#ffebee', '#ffcdd2', '#ef9a9a', '#e57373', '#ef5350', '#f44336', '#e53935', '#d32f2f', '#c62828', '#b71c1c', '#ff8a80', '#ff5252', '#ff1744', '#d50000'],
  Pink: ['#fce4ec', '#f8bbd0', '#f48fb1', '#f06292', '#ec407a', '#e91e63', '#d81b60', '#c2185b', '#ad1457', '#880e4f', '#ff80ab', '#ff4081', '#f50057', '#c51162'],
  Purple: ['#f3e5f5', '#e1bee7', '#ce93d8', '#ba68c8', '#ab47bc', '#9c27b0', '#8e24aa', '#7b1fa2', '#6a1b9a', '#4a148c', '#ea80fc', '#e040fb', '#d500f9', '#aa00ff'],
  DeepPurple: ['#ede7f6', '#d1c4e9', '#b39ddb', '#9575cd', '#7e57c2', '#673ab7', '#5e35b1', '#512da8', '#4527a0', '#311b92', '#b388ff', '#7c4dff', '#651fff', '#6200ea'],
  Indigo: ['#e8eaf6', '#c5cae9', '#9fa8da', '#7986cb', '#5c6bc0', '#3f51b5', '#3949ab', '#303f9f', '#283593', '#1a237e', '#8c9eff', '#536dfe', '#3d5afe', '#304ffe'],
  Blue: ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1', '#82b1ff', '#448aff', '#2979ff', '#2962ff'],
  LightBlue: ['#e1f5fe', '#b3e5fc', '#81d4fa', '#4fc3f7', '#29b6f6', '#03a9f4', '#039be5', '#0288d1', '#0277bd', '#01579b', '#80d8ff', '#40c4ff', '#00b0ff', '#0091ea'],
  Cyan: ['#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064', '#84ffff', '#18ffff', '#00e5ff', '#00b8d4'],
  Teal: ['#e0f2f1', '#b2dfdb', '#80cbc4', '#4db6ac', '#26a69a', '#009688', '#00897b', '#00796b', '#00695c', '#004d40', '#a7ffeb', '#64ffda', '#1de9b6', '#00bfa5'],
  Green: ['#e8f5e9', '#c8e6c9', '#a5d6a7', '#81c784', '#66bb6a', '#4caf50', '#43a047', '#388e3c', '#2e7d32', '#1b5e20', '#b9f6ca', '#69f0ae', '#00e676', '#00c853'],
  LightGreen: ['#f1f8e9', '#dcedc8', '#c5e1a5', '#aed581', '#9ccc65', '#8bc34a', '#7cb342', '#689f38', '#558b2f', '#33691e', '#ccff90', '#b2ff59', '#76ff03', '#64dd17'],
  Lime: ['#f9fbe7', '#f0f4c3', '#e6ee9c', '#dce775', '#d4e157', '#cddc39', '#c0ca33', '#afb42b', '#9e9d24', '#827717', '#f4ff81', '#eeff41', '#c6ff00', '#aeea00'],
  Yellow: ['#fffde7', '#fff9c4', '#fff59d', '#fff176', '#ffee58', '#ffeb3b', '#fdd835', '#fbc02d', '#f9a825', '#f57f17', '#ffff8d', '#ffff00', '#ffea00', '#ffd600'],
  Amber: ['#fff8e1', '#ffecb3', '#ffe082', '#ffd54f', '#ffca28', '#ffc107', '#ffb300', '#ffa000', '#ff8f00', '#ff6f00', '#ffe57f', '#ffd740', '#ffc400', '#ffab00'],
  Orange: ['#fff3e0', '#ffe0b2', '#ffcc80', '#ffb74d', '#ffa726', '#ff9800', '#fb8c00', '#f57c00', '#ef6c00', '#e65100', '#ffd180', '#ffab40', '#ff9100', '#ff6d00'],
  DeepOrange: ['#fbe9e7', '#ffccbc', '#ffab91', '#ff8a65', '#ff7043', '#ff5722', '#f4511e', '#e64a19', '#d84315', '#bf360c', '#ff9e80', '#ff6e40', '#ff3d00', '#dd2c00'],
  Brown: ['#efebe9', '#d7ccc8', '#bcaaa4', '#a1887f', '#8d6e63', '#795548', '#6d4c41', '#5d4037', '#4e342e', '#3e2723'],
  Grey: ['#fafafa', '#f5f5f5', '#eeeeee', '#e0e0e0', '#bdbdbd', '#9e9e9e', '#757575', '#616161', '#424242', '#212121'],
  BlueGrey: ['#eceff1', '#cfd8dc', '#b0bec5', '#90a4ae', '#78909c', '#607d8b', '#546e7a', '#455a64', '#37474f', '#263238'],
};
const materialcolor = Object.keys(material_color).reduce((ary, key) => {
  const val = material_color[key];
  val.forEach((hex, i) => {
    let num;
    switch (i) {
      case 0:
        num = 50;
        break
      case 10:
        num = 'A100';
        break
      case 11:
        num = 'A200';
        break
      case 12:
        num = 'A400';
        break
      case 13:
        num = 'A700';
        break
      default:
        num = i * 100;
        break
    }
    ary.push([hex, `${key} ${num}`]);
  });
  return ary
}, []);

/* eslint camelcase:0, no-cond-assign:0  */
class Rgb extends Array {
  constructor (r, g, b) {
    super(r, g, b);
    this.r = r;
    this.g = g;
    this.b = b;
  }
  toString () {
    return `rgb(${this.r}, ${this.g}, ${this.b})`
  }
}
class Rgba extends Array {
  constructor (r, g, b, a) {
    a = a == null ? 1 : a;
    super(r, g, b, a);
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
  toString () {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
  }
}
class Hsl extends Array {
  constructor (h, s, l) {
    super(h, s, l);
    this.h = h;
    this.s = s;
    this.l = l;
  }
  toString () {
    return `hsl(${Math.round(this.h)}, ${Math.round(this.s)}%, ${Math.round(this.l)}%)`
  }
}
class Hsla extends Array {
  constructor (h, s, l, a) {
    a = a == null ? 1 : a;
    super(h, s, l, a);
    this.h = h;
    this.s = s;
    this.l = l;
    this.a = a;
  }
  toString () {
    return `hsla(${Math.round(this.h)}, ${Math.round(this.s)}%, ${Math.round(this.l)}%, ${this.a})`
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
  constructor (param, g, b) {
    this.setColor(param, g, b)

    ;[['r', 'g', 'b'], ['red', 'green', 'blue']].forEach((keys) => {
      keys.forEach((key, i) => {
        Object.defineProperty(this, key, {
          get () {
            return this.rgb[i]
          },
          set (val) {
            this.rgb[i] = Math.min(Math.max(0, Math.round(val)), 255);
            this.setParams(this.rgb, rgb2hsl(...this.rgb));
            this.toHex();
            return this
          }
        });
      });
    })
    ;['h', 'hue'].forEach((key) => {
      Object.defineProperty(this, key, {
        get () {
          return Math.round(this.hsl[0])
        },
        set (val) {
          while (val < 0) {
            val += 360;
          }
          this.hsl[0] = Math.round(val % 360);
          this.setParams(hsl2rgb(...this.hsl), this.hsl);
          this.toHex();
          return this
        }
      });
    })
    ;[['s', 'l'], ['saturation', 'lightness']].forEach((keys) => {
      keys.forEach((key, i) => {
        Object.defineProperty(this, key, {
          get () {
            return Math.round(this.hsl[i + 1])
          },
          set (val) {
            this.hsl[i + 1] = Math.min(Math.max(0, Math.round(val)), 100);
            this.setParams(hsl2rgb(...this.hsl), this.hsl);
            this.toHex();
            return this
          }
        });
      });
    });
  }

  setColor (param, g, b) {
    this.a = 1;
    let rgb, hsl;
    if (typeof param === 'string') {
      let result;
      if (result = hex2rgb(param)) {
        // hex #000
        rgb = result;
        this.hex = param;
      } else if (result = /^rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})(?:, ?(1|0?\.\d{1,2}))?\)$/.exec(param)) {
        // rgb rgba(255,0,0,0.7)
        rgb = result.slice(1).map(h => +h);
        this.a = +(rgb[3] || 1);
      } else if (result = /^rgba?\((\d{1,3})%, ?(\d{1,3})%, ?(\d{1,3})%(?:, ?(1|0?\.\d{1,2}))?\)$/.exec(param)) {
        // rgb% rgb(100%, 0%, 20%)
        rgb = result.slice(1).map(h => Math.floor(h / 100 * 255));
        this.a = +(result[3] || 1);
      } else if (result = /^hsla?\((\d{1,3}), ?(\d{1,3})%, ?(\d{1,3})%(?:, ?(1|0?\.\d{1,2}))?\)$/.exec(param)) {
        // hsl hsla(240,100%,50%, 0.4)
        hsl = result.slice(1).map(h => +h);
        this.a = +(result[3] || 1);
      } else {
        return TypeError('Color argment string ' + param)
      }
    } else if (typeof param === 'number') {
      rgb = [param, g, b];
    } else if (Array.isArray(param)) {
      rgb = param;
    }

    if (!hsl) {
      hsl = rgb2hsl(rgb);
    }
    if (!rgb) {
      rgb = hsl2rgb(hsl);
    }

    this.hsv = rgb2hsv(rgb);

    this.setParams(rgb, hsl);
    if (!this.hex) {
      this.toHex();
    }

    [webcolor, jiscolor_en, jiscolor_ja].some((colorlist) => {
      this.name = this.findColorName(colorlist);
      return this.name
    });
    this.name = this.name || nearName(this.hex);
  }

  setParams (rgb, hsl) {
    const rgba = rgb;
    const hsla = hsl;
    rgba[3] = this.a;
    hsla[3] = this.a;
    this.rgb  = new Rgb(...rgb);
    this.rgba = new Rgba(...rgba);
    this.hsl  = new Hsl(...hsl);
    this.hsla = new Hsla(...hsla);
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
Color.jiscolor_en = jiscolor_en;
Color.jiscolor_ja = jiscolor_ja;
Color.materialcolor = materialcolor;

function nearName (hex) {
  const rgb = hex2rgb(hex);
  let nearest = [];
  let minscore = Infinity;[webcolor, jiscolor_en, jiscolor_ja].forEach((colorlist) => {
    colorlist.forEach(([_hex, name]) => {
      const _rgb = hex2rgb(_hex);
      const score = _rgb.reduce((p, c, i) => p + Math.abs(rgb[i] - c), 0);
      if (minscore > score) {
        minscore = score;
        nearest = [[_hex, name, _rgb, score]];
      } else if (minscore === score) {
        minscore = score;
        nearest.push([_hex, name, _rgb]);
      }
    });
  });
  return nearest
  // const hsl = rgb2hsl(...rgb)
  // let nearestName = []
  // nearest.forEach(([_hex, name, _rgb]) => {
  //   const _hsl = rgb2hsl(..._rgb)
  //   const score = Math.abs(_hsl[0] - hsl[0])
  //   if (minscore >= score) {
  //     minscore = score
  //     nearestName = [_hex, name]
  //   }
  // })
  // return nearestName
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
    .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => r + r + g + g + b + b)
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
    g = r.g || r[1];
    b = r.b || r[2];
    r = r.r || r[0];
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
    g = r.g || r[1];
    b = r.b || r[2];
    r = r.r || r[0];
  }
  r /= 255;
  g /= 255;
  b /= 255;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var d = max - min;
  var h;
  var l = (max + min) / 2;
  var s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  switch (max) {
    case min:
      h = s = 0;
      break
    case r:
      // h = (g - b) / d + (g < b ? 6 : 0); h /= 6
      h = 60 * (g - b) / d + 0;
      break
    case g:
      // h = (b - r) / d + 2; h /= 6
      h = 60 * (b - r) / d + 120;
      break
    case b:
      // h = (r - g) / d + 4; h /= 6
      h = 60 * (b - r) / d + 240;
      break
  }

  s *= 100;
  l *= 100;

  // return [Math.round(h), Math.round(s), Math.round(l)]
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
 * @returns
 *
 * @see http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 * @see http://www.petitmonte.com/javascript/rgb_hsl_convert.html
 * @see http://d.hatena.ne.jp/ja9/20100907/1283840213
 * @see https://ja.wikipedia.org/wiki/HLS色空間
 */
function hsl2rgb (h, s, l) {
  var r, g, b;
  if (arguments.length === 1) {
    s = h.s || h[1];
    l = h.l || h[2];
    h = h.h || h[0];
  }

  while (h < 0) {
    h += 360;
  }
  h %= 360;
  s = Math.max(0, Math.min(s, 100));
  l = Math.max(0, Math.min(l, 100));
  h /= 360;
  s /= 100;
  l /= 100;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);
  return [r, g, b]
}

/**
 * RGB色空間からHSV色空間へ変換する
 *
 * @export
 * @param {number} r 0-255
 * @param {number} g 0-255
 * @param {number} b 0-255
 * @returns {object}  {h, s, v}
 */
function rgb2hsv (r, g, b) {
  if (arguments.length === 1) {
    g = r.g || r[1];
    b = r.b || r[2];
    r = r.r || r[0];
  }
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = max;
  let s = (max === 0 ? 0 : d / max);
  let v = max / 255;

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

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  v = Math.round(v * 100);
  return [h, s, v]
}

/**
 * HSV(HSB)色空間からRGB色空間へ変換する
 *
 * @export
 * @param {any} h  (hue)       : 色相/色合い   0-360度の値
 * @param {any} s  (saturation): 彩度/鮮やかさ 0-100%の値
 * @param {any} v  (Value)     : 明度/明るさ   0-100%の値
 * @returns
 *
 * @see http://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
 */

const storage = window.localStorage;

class Store {
  constructor () {
    riot.observable(this);
    this.palette = [];
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
        }
      ];
    }

    this.cards.forEach((param) => {
      param.color = new Color(param.color);
    });

    this.undo = new Undo(this.getState());

    this.on('undo', (param) => {
      const state = this.undo.undo();
      console.log('undo_state', state);
      if (!state) {
        return
      }
      this.cards = state.cards;
      this.box.style.backgroundColor = state.bgColor;
      this.trigger('cards_changed', this.cards);
    });
    this.on('redo', (param) => {
      const state = this.undo.redo();
      console.log('redo_state', state);
      if (!state) {
        return
      }
      this.cards = state.cards;
      this.box.style.backgroundColor = state.bgColor;
      this.trigger('cards_changed', this.cards);
    });

    // CARDS
    this.on('add_card', (param) => {
      this.cards.push(param);
      this.trigger('cards_changed', this.cards);
    });
    this.on('remove_card', (index) => {
      this.cards.pop();
      this.trigger('cards_changed', this.cards);
    });

    this.on('card_forward', (index) => {
      this.cards.push(this.cards.splice(index, 1)[0]);
      this.trigger('cards_changed', this.cards);
    });

    this.on('duplicate_card', () => {
      const newCard = Object.assign({}, this.cards[this.cards.length - 1]);
      newCard.x += 10;
      newCard.y += 10;
      this.trigger('add_card', newCard);
    });

    this.on('card_moved', (x, y) => {
      let card = this.cards[this.cards.length - 1];
      if (card.x !== x || card.y !== y) {
        card.x = x;
        card.y = y;
        this.trigger('cards_changed', this.cards);
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

riot.tag2('app', '<div id="colors"> <div id="form_add"> <input id="color_hex" placeholder="#000000, Black" onsubmit="{addCard_btn}"> <button id="add_btn" onclick="{addCard_btn}">➕</button> </div> <div id="pallete"> <color-tip each="{palette}"></color-tip> </div> <color-lists></color-lists> </div> <div id="box"> <color-card each="{card, i in cards}"></color-card> </div> <context-menu></context-menu>', '#colors { width: 320px; position: absolute; margin:0; padding: 20px; top:0; left:0; } #box { width: 100%; height: 100%; background: #1f2532; } #form_add { margin: 10px 0; display: flex; flex-direction: row;} #color_hex { flex: 1 1 auto; height: 42px; padding: 8px 5px; border-width: 1px 0 1px 1px; border-style: solid; border-top-left-radius: 4px; border-bottom-left-radius: 4px;} #add_btn { height: 42px; text-align: center; border-width: 1px; border-style: solid; border-top-right-radius: 4px; border-bottom-right-radius: 4px;}', '', function(opts) {
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
      this.cards = cards;
      this.palette = palette();
      this.update();
    });

    this.addCard_btn = () => {
      const text = /^(#?(?:[a-f\d]{3}|[a-f\d]{6}))(?:\s*\W\s*(.+))/i.exec(this.color_hex.value);
      if (text) {
        store.trigger('add_card', {
          name: (text[2] || '').trim(),
          color: new Color(text[1])
        });
        this.color_hex.value = '';
      }
    };

    this.on('mount', ()=> {
      const box = store.box = document.getElementById('box');
      const bgColor = store.getItem('bgColor') || '#1f2532';
      this.box.style.backgroundColor = bgColor;

      store.on('set_bgColor', (color) => {
        const textcolor = color.lightness < 35 ? '#eee' : '#111';
        this.colors.style.color = textcolor;

      });

      store.trigger('set_bgColor', new Color(bgColor));
    });
});

riot.tag2('color-card', '<div class="card" riot-style="background-color: {color};"> <span class="cardtext"><b>{name}</b><br>{color}</span> </div>', '.card { position: absolute; width: 100px; height: 100px; margin: auto; text-align:center; font-size:12px; background: #323a45; } .card.active { z-index: 100; } .cardtext { width: 100px; height: 100px; vertical-align:middle; white-space: pre-wrap; display: table-cell; }', '', function(opts) {
    Object.assign(this, this.card);

    const on = 'addEventListener';

    this.on('mount', ()=> {
      const card = this.root.getElementsByClassName('card')[0];
      const rect = this.rect =  this.box.getBoundingClientRect();

      const grid = 5;
      function snap (n) {
        return Math.round(n / grid) * grid
      }

      let beforePositionX = card.style.left = snap(this.x || ((rect.width - 100 - 320) * Math.random() + 320)) + 'px';
      let beforePositionY = card.style.top = snap(this.y || ((rect.height - 100) * Math.random())) + 'px';

      if (this.color.lightness < 40) {
        card.style.color = '#eee';
      }

      movable(card, {
        parent: this.box,
        grid,
        onDragStart: (x, y) => {
          beforePositionX = x;
          beforePositionY = y;
          store.trigger('card_forward', this.i);
        },
        onDrag: (x, y) => {
          this.x = x;
          this.y = y;
        },
        onDragEnd: (x, y) => {
          if (x < 320) {
            x = beforePositionX;
            y = beforePositionY;
          }
          store.trigger('card_moved', x, y);
          return [x, y]
        },
      });

      card[on]('dblclick', (e) => {
        store.trigger('set_bgColor', this.color);
      });
      card[on]('contextmenu', (e) => {

        e.preventDefault();
        store.trigger('menu_open', e, this);
      });
    });
});

riot.tag2('color-tip', '<div class="tip" title="{title}" riot-style="background-color: {color};"></div>', '.tip{ width: 20px; height: 20px; margin:0; padding:0; display:inline-block; }', '', function(opts) {
    this.title = this.name + ' : ' + this.color;
    const on = 'addEventListener';
    this.on('mount', () => {
      const tip = this.root.getElementsByClassName('tip')[0];
      tip[on]('click', (e) => {
        store.trigger('add_card', Object.assign({}, this._item));
      });

      tip[on]('contextmenu', (e) => {
        e.preventDefault();
        store.trigger('menu_open', e, this, true);
      });
    });
});

riot.tag2('color-lists', '<select name="colorlists" id="colorlists" onchange="{colorListLord}"> <option value="webcolor">Web Color</option> <option value="jiscolor_ja">JIS JA</option> <option value="jiscolor_en">JIS EN</option> <option value="materialcolor">GOOGLE MATERIAL</option> </select> <color-tip each="{colorlists}"></color-tip>', '#colorlists { width: 280px; font-size: 20px; margin: 10px 0; display: block; } #colorlists option { background: #fff; color: #111; } #colorlists option:hover { background: aquamarine; }', '', function(opts) {
    const colorlists = {
      webcolor: Color.webcolor.map(val => ({
        name: val[1],
        color: new Color(val[0])
      })),
      jiscolor_en: Color.jiscolor_en.map(val => ({
        name: val[1],
        color: new Color(val[0])
      })),
      jiscolor_ja: Color.jiscolor_ja.map(val => ({
        name: `${val[1]}\n(${val[2]})`,
        color: new Color(val[0])
      })),
      materialcolor: Color.materialcolor.map(val => ({
        name: val[1],
        color: new Color(val[0])
      })),
    };

    this.colorlists = colorlists.webcolor;

    this.colorListLord = (e) => {
      this.colorlists = colorlists[e.target.value];
    };
});

riot.tag2('context-menu', '<div id="menu" show="{isTipMenuOpen || isCardMenuOpen}"> <p class="menuitem" onclick="{addCard}" show="{isTipMenuOpen}">ADD CARD</p> <p class="menuitem" onclick="{removeCard}" show="{isCardMenuOpen}">DELETE</p> <p class="menuitem" onclick="{duplicateCard}" show="{isCardMenuOpen}">DUPLICATE</p> <p class="menuitem" onclick="{setBgColor}">SET BACKGROUND</p> <p class="menuitem" onclick="{copyHex}">COPY HEX</p> <p class="menuitem" onclick="{copyRgb}">COPY RGB</p> </div>', '#menu { position: absolute; font-size:12px; background: #fff; border: solid 1px silver; } .menuitem { min-width: 100px; padding: 4px; margin: 0; } .menuitem:hover, .menuitem:active { background: aquamarine; }', '', function(opts) {

    function copyTextToClipboard (textVal) {

      var copyFrom = document.createElement('textarea');

      copyFrom.textContent = textVal;

      var bodyElm = document.getElementsByTagName('body')[0];

      bodyElm.appendChild(copyFrom);

      copyFrom.select();

      var retVal = document.execCommand('copy');

      bodyElm.removeChild(copyFrom);

      return retVal
    }

    this.isCardMenuOpen = false;
    this.isTipMenuOpen = false;

    let activeCard;

    this.addCard = () => {
      store.trigger('add_card', activeCard);
    };
    this.removeCard = () => {
      store.trigger('remove_card');
    };
    this.duplicateCard = () => {
      store.trigger('duplicate_card');
    };
    this.setBgColor = () => {
      store.trigger('set_bgColor', activeCard.color);
    };
    this.copyHex = () => {
      copyTextToClipboard(activeCard.color);
    };
    this.copyRgb = () => {
      copyTextToClipboard(activeCard.color.rgb);
    };

    const menuHide = (e) => {
      this.isCardMenuOpen = false;
      this.isTipMenuOpen = false;
      this.update();
    };

    store.on('menu_open', (e, card, tip) => {
      this.menu.style.left = e.clientX + 'px';
      this.menu.style.top = e.clientY + 'px';

      activeCard = card;

      if (tip) {
        this.isTipMenuOpen = true;
      } else {
        this.isCardMenuOpen = true;
      }

      window.addEventListener('blur', menuHide);
      document.addEventListener('click', menuHide);
      this.update();
    });
});

riot.mount('#root', 'app');

}());
//# sourceMappingURL=bundle.js.map
