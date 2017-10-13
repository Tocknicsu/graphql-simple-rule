import {
  defaultFieldResolver
} from 'graphql'
import { Cache } from 'memory-cache'

import _ from 'lodash'
import uuid from 'uuid'
import defaults from 'defaults'
import waitUntil from 'wait-until-promise'

const funcWrapper = async (obj, args) => {
  if (typeof obj === 'function') {
    return await obj(...args)
  }
  return obj
}

export const RuleHelper = (rules, fields) => {
  return _.mapValues(fields, (field) => {
    return {
      ...field,
      resolve: rules(field.resolve)
    }
  })
}

export default (config) => {
  // cache will following this rule
  const cachePool = new Cache()
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
  return (func) => {
    // custom resolver or defaultFieldResolver
    const resolverFunc = func ? func : defaultFieldResolver
    return async (...resolverFuncArgs) => {
      let props = null
      // check enable cache or not
      if (cacheConfig.enable) {
        cacheConfig.expire = await funcWrapper(cacheConfig.expire, resolverFuncArgs)
        // get the cache
        const cacheKey = await funcWrapper(cacheConfig.key, resolverFuncArgs)
        let cache = cachePool.get(cacheKey)
        if (cache === null) {
          cachePool.put(cacheKey, {
            props: {},
            done: false
          })
          props = {}
          for (let propsKey in config.props) {
            props[propsKey] = await funcWrapper(config.props[propsKey], resolverFuncArgs)
          }
          cachePool.put(cacheKey, {
            done: true,
            props
          }, cacheConfig.expire)
        } else {
          await waitUntil(() => {
            cache = cachePool.get(cacheKey)
            return cache.done
          }, cacheConfig.expire, 1)
          props = cache.props
        }
      } else {
        props = {}
        for (let propsKey in config.props) {
          props[propsKey] = await funcWrapper(config.props[propsKey], resolverFuncArgs)
        }
      }
      // get config
      let rule
      const info = resolverFuncArgs[3]
      if (info.fieldName in config.rules) {
         rule = config.rules[info.fieldName]
        if (typeof rule === 'boolean') {
        } else if (typeof rule === 'function') {
          rule = await funcWrapper(rule, [props])
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
