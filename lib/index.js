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

var _waitUntilPromise = require('wait-until-promise');

var _waitUntilPromise2 = _interopRequireDefault(_waitUntilPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var funcWrapper = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(obj, args) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(typeof obj === 'function')) {
              _context.next = 4;
              break;
            }

            _context.next = 3;
            return obj.apply(undefined, _toConsumableArray(args));

          case 3:
            return _context.abrupt('return', _context.sent);

          case 4:
            return _context.abrupt('return', obj);

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function funcWrapper(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = function (config) {
  // cache will following this rule
  var cachePool = new _memoryCache.Cache();
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
  return function (func) {
    // custom resolver or defaultFieldResolver
    var resolverFunc = func ? func : _graphql.defaultFieldResolver;
    return function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        for (var _len = arguments.length, resolverFuncArgs = Array(_len), _key = 0; _key < _len; _key++) {
          resolverFuncArgs[_key] = arguments[_key];
        }

        var props, cacheKey, propsKey, _propsKey, rule, info;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                props = null;
                // check enable cache or not

                if (!cacheConfig.enable) {
                  _context2.next = 28;
                  break;
                }

                _context2.next = 4;
                return funcWrapper(cacheConfig.expire, resolverFuncArgs);

              case 4:
                cacheConfig.expire = _context2.sent;
                _context2.next = 7;
                return funcWrapper(cacheConfig.key, resolverFuncArgs);

              case 7:
                cacheKey = _context2.sent;

                cache = cachePool.get(cacheKey);

                if (!(cache === null)) {
                  _context2.next = 23;
                  break;
                }

                cachePool.put(cacheKey, {
                  props: {},
                  done: false
                });
                props = {};
                _context2.t0 = regeneratorRuntime.keys(config.props);

              case 13:
                if ((_context2.t1 = _context2.t0()).done) {
                  _context2.next = 20;
                  break;
                }

                propsKey = _context2.t1.value;
                _context2.next = 17;
                return funcWrapper(config.props[propsKey], resolverFuncArgs);

              case 17:
                props[propsKey] = _context2.sent;
                _context2.next = 13;
                break;

              case 20:
                cachePool.put(cacheKey, props, cacheConfig.expire);
                _context2.next = 26;
                break;

              case 23:
                _context2.next = 25;
                return (0, _waitUntilPromise2.default)(function () {
                  cache = cachePool.get(cacheKey);
                  return cache.done;
                }, Infinity, 1);

              case 25:
                props = cache.props;

              case 26:
                _context2.next = 37;
                break;

              case 28:
                props = {};
                _context2.t2 = regeneratorRuntime.keys(config.props);

              case 30:
                if ((_context2.t3 = _context2.t2()).done) {
                  _context2.next = 37;
                  break;
                }

                _propsKey = _context2.t3.value;
                _context2.next = 34;
                return funcWrapper(config.props[_propsKey], resolverFuncArgs);

              case 34:
                props[_propsKey] = _context2.sent;
                _context2.next = 30;
                break;

              case 37:
                // get config
                rule = void 0;
                info = resolverFuncArgs[3];

                if (!(info.fieldName in config.rules)) {
                  _context2.next = 53;
                  break;
                }

                rule = config.rules[info.fieldName];

                if (!(typeof rule === 'boolean')) {
                  _context2.next = 44;
                  break;
                }

                _context2.next = 51;
                break;

              case 44:
                if (!(typeof rule === 'function')) {
                  _context2.next = 50;
                  break;
                }

                _context2.next = 47;
                return funcWrapper(rule, [props]);

              case 47:
                rule = _context2.sent;
                _context2.next = 51;
                break;

              case 50:
                rule = true;

              case 51:
                _context2.next = 54;
                break;

              case 53:
                rule = true;

              case 54:
                if (!rule) {
                  _context2.next = 58;
                  break;
                }

                return _context2.abrupt('return', resolverFunc.apply(undefined, resolverFuncArgs));

              case 58:
                return _context2.abrupt('return', null);

              case 59:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      return function () {
        return _ref2.apply(this, arguments);
      };
    }();
  };
};