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
                  _context2.next = 22;
                  break;
                }

                _context2.next = 4;
                return funcWrapper(cacheConfig.expire, resolverFuncArgs);

              case 4:
                cacheConfig.expire = _context2.sent;
                _context2.next = 7;
                return funcWrapper(cacheConfig.cacheKey, resolverFuncArgs);

              case 7:
                cacheKey = _context2.sent;

                props = cache.get(cacheKey);

                if (!(props === null)) {
                  _context2.next = 20;
                  break;
                }

                props = {};
                _context2.t0 = regeneratorRuntime.keys(config.props);

              case 12:
                if ((_context2.t1 = _context2.t0()).done) {
                  _context2.next = 19;
                  break;
                }

                propsKey = _context2.t1.value;
                _context2.next = 16;
                return funcWrapper(config.props[propsKey], resolverFuncArgs);

              case 16:
                props[propsKey] = _context2.sent;
                _context2.next = 12;
                break;

              case 19:
                cache.put(cacheKey, props, cacheConfig.expire);

              case 20:
                _context2.next = 31;
                break;

              case 22:
                props = {};
                _context2.t2 = regeneratorRuntime.keys(config.props);

              case 24:
                if ((_context2.t3 = _context2.t2()).done) {
                  _context2.next = 31;
                  break;
                }

                _propsKey = _context2.t3.value;
                _context2.next = 28;
                return funcWrapper(config.props[_propsKey], resolverFuncArgs);

              case 28:
                props[_propsKey] = _context2.sent;
                _context2.next = 24;
                break;

              case 31:
                // get config
                rule = void 0;
                info = resolverFuncArgs[3];

                if (!(info.fieldName in config.rules)) {
                  _context2.next = 47;
                  break;
                }

                rule = config.rules[info.fieldName];

                if (!(typeof rule === 'boolean')) {
                  _context2.next = 38;
                  break;
                }

                _context2.next = 45;
                break;

              case 38:
                if (!(typeof rule === 'function')) {
                  _context2.next = 44;
                  break;
                }

                _context2.next = 41;
                return funcWrapper(rule, [props]);

              case 41:
                rule = _context2.sent;
                _context2.next = 45;
                break;

              case 44:
                rule = true;

              case 45:
                _context2.next = 48;
                break;

              case 47:
                rule = true;

              case 48:
                if (!rule) {
                  _context2.next = 52;
                  break;
                }

                return _context2.abrupt('return', resolverFunc.apply(undefined, resolverFuncArgs));

              case 52:
                return _context2.abrupt('return', null);

              case 53:
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