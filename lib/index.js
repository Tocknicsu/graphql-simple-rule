'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _memoryCache = require('memory-cache');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _defaults = require('defaults');

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (config) {
  // cache will following this rule
  var cache = new _memoryCache.Cache();
  config = (0, _defaults2.default)(config, {
    props: {},
    rules: {},
    cache: {
      enable: true,
      key: _uuid2.default.v4(),
      expire: 60000
    }
  });
  var cacheConfig = (0, _defaults2.default)(config.cache, {
    enable: true,
    key: _uuid2.default.v4(),
    expire: 60000
  });
  cacheConfig.expire = typeof cacheConfig.expire === 'function' ? cacheConfig.expire.apply(cacheConfig, _toConsumableArray(resolverFuncArgs)) : cacheConfig.expire;
  return function (func) {
    // custom resolver or defaultFieldResolver
    var resolverFunc = func ? func : _graphql.defaultFieldResolver;
    return function () {
      for (var _len = arguments.length, resolverFuncArgs = Array(_len), _key = 0; _key < _len; _key++) {
        resolverFuncArgs[_key] = arguments[_key];
      }

      var props = null;
      // check enable cache or not
      if (cacheConfig.enable) {
        // get the cache
        var cacheKey = typeof cacheConfig.key === 'function' ? cacheConfig.key.apply(cacheConfig, resolverFuncArgs) : cacheConfig.key;
        props = cache.get(cacheKey);
        if (props === null) {
          props = _lodash2.default.mapValues(config.props, function (func) {
            return func.apply(undefined, resolverFuncArgs);
          });
          cache.put(cacheKey, props, cacheConfig.expire);
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