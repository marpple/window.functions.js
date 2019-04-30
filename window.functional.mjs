// window.functions.js
// Project Lead - Indong Yoo
// Maintainers - Joeun Ha, Jeongik Park
// (c) 2017 Marpple. MIT Licensed.

const _identity = function(v) { return v }, _idtt = _identity;
const _noop = function() {};
const _keys = function(obj) { return obj ? Object.keys(obj) : [] };
const _mr = function() { return arguments.__mr = true, arguments };
const pipe = function() {
  var fs = arguments, len = fs.length;
  return function(res) {
    var i = -1;
    while (++i < len) res = res && res.__mr ? fs[i].apply(null, res) : fs[i](res);
    return res;
  }
};

const _go = function() {
  var i = 0, fs = arguments, len = fs.length, res = arguments[0];
  while (++i < len) res = res && res.__mr ? fs[i].apply(null, res) : fs[i](res);
  return res;
};

const _tap = function() {
  var pipe = _pipe.apply(null, arguments);
  return function() {
    var a = arguments;
    return pipe(a = a.length > 1 ? (a.__mr = true && a) : a[0]), a;
  }
};

const _each = function f(data, iter) {
  if (!iter) return function(data2) { return f(data2, data) };
  var i = -1, len = data && data.length, keys = typeof len == 'number' ? null : _keys(data);
  if (keys && (len = keys.length))
    while (++i < len) iter(data[keys[i]]);
  else
    while (++i < len) iter(data[i]);
  return data;
};

const _map = function f(data, iter) {
  if (!iter) return function(data2) { return f(data2, data) };
  var i = -1, len = data && data.length, keys = typeof len == 'number' ? null : _keys(data), res = [];
  if (keys && (len = keys.length))
    while (++i < len) res[i] = iter(data[keys[i]]);
  else
    while (++i < len) res[i] = iter(data[i]);
  return res;
};

const _flatmap = function f(data, iter) {
  if (!iter) return function(data2) { return f(data2, data) };
  var i = -1, len = data && data.length, keys = typeof len == 'number' ? null : _keys(data), res = [], evd;

  if (keys && (len = keys.length))
    while (++i < len) Array.isArray(evd = iter(data[keys[i]])) ? res.push.apply(res, evd) : res.push(evd);
  else
    while (++i < len) Array.isArray(evd = iter(data[i])) ? res.push.apply(res, evd) : res.push(evd);
  return res;
}, _mapcat = _flatmap;

const _filter = function f(data, iter) {
  if (!iter) return function(data2) { return f(data2, data) };
  var i = -1, len = data && data.length, keys = typeof len == 'number' ? null : _keys(data), res = [];
  if (keys && (len = keys.length))
    while (++i < len) { if (iter(data[keys[i]])) res.push(data[keys[i]]); }
  else
    while (++i < len) { if (iter(data[i])) res.push(data[i]); }
  return res;
};

const _reject = function f(data, iter) {
  if (!iter) return function(data2) { return f(data2, data) };
  var i = -1, len = data && data.length, keys = typeof len == 'number' ? null : _keys(data), res = [];
  if (keys && (len = keys.length))
    while (++i < len) { if (!iter(data[keys[i]])) res.push(data[keys[i]]); }
  else
    while (++i < len) { if (!iter(data[i])) res.push(data[i]); }
  return res;
};

const _reduce = function f(data, iter, init) {
  if (typeof data == "function") return function(data2) { return f(data2, data, iter) };
  var i = -1, len = data && data.length, keys = typeof len == 'number' ? null : _keys(data),
    res = init === undefined ? data[keys ? keys[++i] : ++i] : _clone(init);
  if (keys && (len = keys.length))
    while (++i < len) res = iter(res, data[keys[i]]);
  else
    while (++i < len) res = iter(res, data[i]);
  return res;
};

const _find = function f(data, iter) {
  if (!iter) return function(arr2) { return f(arr2, data) };
  var i = -1, len = data && data.length, keys = typeof len == 'number' ? null : _keys(data);
  if (keys && (len = keys.length))
    while (++i < len) { if (iter(data[keys[i]])) return data[keys[i]]; }
  else
    while (++i < len) { if (iter(data[i])) return data[i]; }
};

const _findval = function f(data, iter) {
  if (!iter) return function(arr2) { return f(arr2, data) };
  var i = -1, len = data && data.length, keys = typeof len == 'number' ? null : _keys(data), evd;
  if (keys && (len = keys.length))
    while (++i < len) { if (evd = iter(data[keys[i]]) !== 'undefined') return evd; }
  else
    while (++i < len) { if (evd = iter(data[i])) return evd; }
};

const _sum = function f(data, iter) {
  if (!iter) {
    if (typeof data == 'function') return function(arr2) { return f(arr2, data) };
    iter = w._idtt;
  }
  var i = 0, len = data && data.length, keys = typeof len == 'number' ? null : _keys(data);
  if (keys) len = keys.length;
  if (len == 0) return;
  if (keys) {
    var res = iter(data[keys[0]]);
    while (++i < len) res += iter(data[keys[i]]);
  } else {
    var res = iter(data[0]);
    while (++i < len) res += iter(data[i]);
  }
  return res;
};

const _has = function(obj, key) {
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

const _extend = function() { return bexdf(setter, arguments); };
const _defaults = function() { return bexdf(dsetter, arguments); };

const _clone = function(obj) {
  return !obj || typeof obj != 'object' ? obj : Array.isArray(obj) ? obj.slice() : _extend({}, obj);
};

const _curryr = function(f) {
  return function(b, a) {
    return arguments.length == 2 ? f(b, a) : function(a) { return f(a, b) };
  };
};
const _lt = _curryr(function(a, b) { return a < b; });
const _lte = _curryr(function(a, b) { return a <= b; });
const _gt = _curryr(function(a, b) { return a > b; });
const _gte = _curryr(function(a, b) { return a >= b; });
const _add = _curryr(function(a, b) { return a + b; });
const _sub = _curryr(function(a, b) { return a - b; });

export {
  _identity, _idtt,
  _noop,
  _keys,
  _mr,
  pipe,
  _go,
  _tap,
  _each,
  _map,
  _flatmap, _mapcat,
  _filter,
  _reject,
  _reduce,
  _find,
  _findval,
  _sum,
  _has,
  _extend,
  _defaults,
  _clone,
  _curryr,
  _lt,
  _lte,
  _gt,
  _gte,
  _add,
  _sub,
}