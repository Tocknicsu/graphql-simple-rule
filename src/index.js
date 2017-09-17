import {
  defaultFieldResolver
} from 'graphql'
import { Cache } from 'memory-cache'

import _ from 'lodash'

export default (config) => {
  // cache will following this rule
  const cache = new Cache()
  return (func) => {
    // custom resolver or defaultFieldResolver
    const resolverFunc = func ? func : defaultFieldResolver
    return (...resolverFuncArgs) => {
      const [obj, args, context, info] = resolverFuncArgs
      let props = null
      // check enable cache or not
      if (config.cache.enable) {
        // get the cache
        const cacheKey = config.cache.key(...resolverFuncArgs)
        props = cache.get(cacheKey)
        if (props === null) {
          props = _.mapValues(config.props, (func) => func(...resolverFuncArgs))
          cache.put(cacheKey, props, config.cache.expire(...resolverFuncArgs))
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
