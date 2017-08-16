// window.functions.js
// Project Lead - Indong Yoo
// Maintainers - Joeun Ha, Jeongik Park
// (c) 2017 Marpple. MIT Licensed.
(function(w) {
  w._identity = w._idtt = function(v) { return v };
  w._noop = function() {};
  w._keys = function(obj) { return obj ? Object.keys(obj) : [] };
  w._mr = function() { return arguments._mr = true, arguments };

  w._pipe = function() {
    var fs = arguments, len = fs.length;
    return function(res) {
      var i = -1;
      while (++i < len) res = res && res._mr ? fs[i].apply(null, res) : fs[i](res);
      return res;
    }
  };

  w._go = function() {
    var i = 0, fs = arguments, len = fs.length, res = arguments[0];
    while (++i < len) res = res && res._mr ? fs[i].apply(null, res) : fs[i](res);
    return res;
  };

  w._tap = function() {
    var pipe = _pipe.apply(null, arguments);
    return function() {
      var a = arguments;
      return pipe(a = a.length > 1 ? (a._mr = true && a) : a[0]), a;
    }
  };

  w._each = function f(arr, iter) {
    if (!iter) return function(arr2) { return f(arr2, arr) };
    var i = -1, len = arr && arr.length;
    while (++i < len) iter(arr[i]);
    return arr;
  };

  w._oeach = function f(obj, iter) {
    if (!iter) return function(obj2) { return f(obj2, obj) };
    var i = -1, keys = _keys(obj), len = keys.length;
    while (++i < len) iter(obj[keys[i]]);
    return obj;
  };

  w._map = function f(arr, iter) {
    if (!iter) return function(arr2) { return f(arr2, arr) };
    var i = -1, len = arr && arr.length, res = [];
    while (++i < len) res[i] = iter(arr[i]);
    return res;
  };

  w._omap = function f(obj, iter) {
    if (!iter) return function(obj2) { return f(obj2, obj) };
    var i = -1, keys = _keys(obj), len = keys.length, res = [];
    while (++i < len) res[i] = iter(obj[keys[i]]);
    return res;
  };

  w._flatmap = w._mapcat = function f(arr, iter) {
    if (!iter) return function(arr2) { return f(arr2, arr) };
    var i = -1, len = arr && arr.length, res = [], evd;
    while (++i < len) Array.isArray(evd = iter(arr[i])) ? res.push.apply(res, evd) : res.push(evd);
    return res;
  };

  w._oflatmap = w._omapcat = function f(obj, iter) {
    if (!iter) return function(obj2) { return f(obj2, obj) };
    var i = -1, keys = _keys(obj), len = keys.length, res = [], evd;
    while (++i < len) Array.isArray(evd = iter(obj[keys[i]])) ? res.push.apply(res, evd) : res.push(evd);
    return res;
  };

  w._filter = function f(arr, iter) {
    if (!iter) return function(arr2) { return f(arr2, arr) };
    var i = -1, len = arr && arr.length, res = [];
    while (++i < len) if (iter(arr[i])) res.push(arr[i]);
    return res;
  };

  w._ofilter = function f(obj, iter) {
    if (!iter) return function(obj2) { return f(obj2, obj) };
    var i = -1, keys = _keys(obj), len = keys.length, res = [];
    while (++i < len) if (iter(obj[keys[i]])) res.push(obj[keys[i]]);
    return res;
  };

  w._reject = function f(arr, iter) {
    if (!iter) return function(arr2) { return f(arr2, arr) };
    var i = -1, len = arr && arr.length, res = [];
    while (++i < len) if (!iter(arr[i])) res.push(arr[i]);
    return res;
  };

  w._oreject = function f(obj, iter) {
    if (!iter) return function(obj2) { return f(obj2, obj) };
    var i = -1, keys = _keys(obj), len = keys.length, res = [];
    while (++i < len) if (!iter(obj[keys[i]])) res.push(obj[keys[i]]);
    return res;
  };

  w._reduce = function f(arr, iter, init) {
    if (typeof arr == "function") return function(arr2) { return f(arr2, arr, iter) };
    var i = -1, len = arr && arr.length, res = init === undefined ? arr[++i] : _clone(init);
    while (++i < len) res = iter(res, arr[i]);
    return res;
  };

  w._oreduce = function f(obj, iter, init) {
    if (typeof obj == "function") return function(obj2) { return f(obj2, obj, iter) };
    var i = -1, keys = _keys(obj), len = keys.length, res = init === undefined ? obj[keys[++i]] : _clone(init);
    while (++i < len) res = iter(res, obj[keys[i]]);
    return res;
  };

  w._find = function f(arr, iter) {
    if (!iter) return function(arr2) { return f(arr2, arr) };
    var i = -1, len = arr && arr.length;
    while (++i < len) if (iter(arr[i])) return arr[i];
  };

  w._ofind = function f(obj, iter) {
    if (!iter) return function(obj2) { return f(obj2, obj) };
    var i = -1, keys = _keys(obj), len = keys.length;
    while (++i < len) if (iter(obj[keys[i]])) return obj[keys[i]];
  };

  w._has = function(obj, key) {
    return obj != null && Object.hasOwnProperty.call(obj, key);
  };

  function bexdf(setter, args) {
    for (var i = 1, len = args.length, obj1 = args[0]; i < len; i++)
      if (obj1 && args[i]) setter(obj1, args[i]);
    if (obj1) delete obj1._memoize;
    return obj1;
  }
  function setter(r, s) { for (var key in s) r[key] = s[key]; }
  function dsetter(r, s) { for (var key in s) if (!_has(r, key)) r[key] = s[key]; }

  w._extend = function() { return bexdf(setter, arguments); };
  w._defaults = function() { return bexdf(dsetter, arguments); };

  w._clone = function(obj) {
    if (!obj || typeof obj != 'object') return obj;
    return Array.isArray(obj) ? obj.slice() : _extend({}, obj);
  };
})(typeof global == 'object' ? global : window);
