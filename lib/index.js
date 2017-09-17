'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _memoryCache = require('memory-cache');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (config) {
  // cache will following this rule
  var cache = new _memoryCache.Cache();
  return function (func) {
    // custom resolver or defaultFieldResolver
    var resolverFunc = func ? func : _graphql.defaultFieldResolver;
    return function () {
      for (var _len = arguments.length, resolverFuncArgs = Array(_len), _key = 0; _key < _len; _key++) {
        resolverFuncArgs[_key] = arguments[_key];
      }

      var obj = resolverFuncArgs[0],
          args = resolverFuncArgs[1],
          context = resolverFuncArgs[2],
          info = resolverFuncArgs[3];

      var props = null;
      // check enable cache or not
      if (config.cache.enable) {
        var _config$cache;

        // get the cache
        var cacheKey = (_config$cache = config.cache).key.apply(_config$cache, resolverFuncArgs);
        props = cache.get(cacheKey);
        if (props === null) {
          var _config$cache2;

          props = _lodash2.default.mapValues(config.props, function (func) {
            return func.apply(undefined, resolverFuncArgs);
          });
          cache.put(cacheKey, props, (_config$cache2 = config.cache).expire.apply(_config$cache2, resolverFuncArgs));
        }
      } else {
        props = _lodash2.default.mapValues(config.props, function (func) {
          return func.apply(undefined, resolverFuncArgs);
        });
      }
      // get config
      var rule = void 0;
      if (info.fieldName in config.rules) {
        rule = config.rules[info.fieldName];
        if (typeof rule === 'boolean') {} else if (typeof rule === 'function') {
          rule = rule(props);
        } else {
          rule = true;
        }
      } else {
        rule = true;
      }
      if (rule) {
        return resolverFunc.apply(undefined, resolverFuncArgs);
      } else {
        return null;
      }
    };
  };
};