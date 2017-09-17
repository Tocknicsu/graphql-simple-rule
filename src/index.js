import {
  defaultFieldResolver
} from 'graphql'
import { Cache } from 'memory-cache'

import _ from 'lodash'
import uuid from 'uuid'

export default (config) => {
  // cache will following this rule
  const cache = new Cache()
  config = defaults(config, {
    props: {},
    rules: {},
    cache: {
      enable: true,
      key: uuid.v4(),
      expire: 60000
    }
  })
  let cacheConfig = defaults(config.cache, {
    enable: true,
    key: uuid.v4(),
    expire: 60000
  })
  cacheConfig.expire = typeof cacheConfig.expire === 'function' ? cacheConfig.expire(...resolverFuncArgs) : cacheConfig.expire
  return (func) => {
    // custom resolver or defaultFieldResolver
    const resolverFunc = func ? func : defaultFieldResolver
    return (...resolverFuncArgs) => {
      let props = null
      // check enable cache or not
      if (cacheConfig.enable) {
        // get the cache
        const cacheKey = typeof cacheConfig.key === 'function' ? cacheConfig.key(...resolverFuncArgs) : cacheConfig.key
        props = cache.get(cacheKey)
        if (props === null) {
          props = _.mapValues(config.props, (func) => func(...resolverFuncArgs))
          cache.put(cacheKey, props, cacheConfig.expire)
        }
      } else {
        props = _.mapValues(config.props, (func) => func(...resolverFuncArgs))
      }
      // get config
      let rule
      if (info.fieldName in config.rules) {
         rule = config.rules[info.fieldName]
        if (typeof rule === 'boolean') {
        } else if (typeof rule === 'function') {
          rule = rule(props)
        } else {
          rule = true
        }
      } else {
        rule = true
      }
      if (rule) {
        return resolverFunc(...resolverFuncArgs)
      } else {
        return null
      }
    }
  }
}
