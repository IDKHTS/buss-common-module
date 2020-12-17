import { Logger } from '@/common/logger'
import { GlobalData } from '@/store/global-data'
const logger = new Logger('common/util')

const store = {
  isDebug: false,
  mockSrvTime: NaN, // mock 当前时间，默认值要为 NaN
}
store.isDebug = !!queryString('ds_debug')
store.isDebug && initializeDebugInfo()

/**
 * @description 获取token
 * @returns {string}
 */
export function getToken () {
  // 只能从接口返回的数据获取,不从cookie和url拿
  return sget(GlobalData, 'DSSX.appProp.token')
  // return getCookie('token')
}

/**
 * @description 获取cookie某个key的值
 * @param {string} [key] key的名称
 * @returns {string}
 */
export function getCookie (key) {
  const cookies = document.cookie.split('; ')
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split('=')
    if (key === cookie[0]) {
      return unescape(cookie[1] || '')
    }
  }
  return ''
}

/**
 * @description 本地存储
 * @param {*} contentTemp 需要存储的内容
 * @param {string} [sessionKey]  自定义存入的key
 * @returns {string}
 */
export function setTempStorage (contentTemp, sessionKey) {
  if (!sessionKey) {
    logger.error('sessionKey is invalid:', sessionKey)
    return
  }
  const keyTemp = 'ALIBABA_NEXT_' + sessionKey
  let fail = true
  let tryAgain = false
  while (fail || tryAgain) {
    try {
      window.sessionStorage.setItem(keyTemp, JSON.stringify(contentTemp))
      fail = false
    } catch (e) {
      logger.error('sessionStorage error:', e)
      window.sessionStorage.clear()
      tryAgain = fail
      fail = false
    }
  }
  return keyTemp
}

/**
 * @description 读取本地存储
 * @param keyTemp 对应的key
 */
export function getTempStorage (keyTemp) {
  keyTemp = 'ALIBABA_NEXT_' + keyTemp
  const contentTemp = window.sessionStorage.getItem(keyTemp)
  if (!contentTemp) {
    return ''
  }
  let parseObj = ''
  try {
    parseObj = JSON.parse(contentTemp)
  } catch (e) {
    logger.error(e)
  }
  return parseObj
}

export function removeTempStorage (keyTemp) {
  window.sessionStorage.removeItem(keyTemp)
}

/**
 * @description 函数节流
 * @param func 原本执行函数
 * @param wait 间隔毫秒
 * @returns {Function} 包裹函数
 */
export function throttle (func, wait) {
  let context, args, timeout, result
  let previous = 0
  const later = function () {
    previous = new Date()
    timeout = null
    result = func.apply(context, args)
  }
  return function () {
    const now = new Date()
    const remaining = wait - (now - previous)
    context = this
    args = arguments
    if (remaining <= 0) {
      clearTimeout(timeout)
      timeout = null
      previous = now
      result = func.apply(context, args)
    } else if (!timeout) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}

/**
 * @description 函数防抖
 * @param func 原本执行函数
 * @param wait 间隔毫秒
 * @param immediate 配置回调函数是在一个时间区间的最开始执行（immediate为true），还是最后执行（immediate为false）
 * @returns {Function} 包裹函数
 */
export function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    const last = Date.now() - timestamp

    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function () {
    context = this
    args = arguments
    timestamp = Date.now()
    const callNow = immediate && !timeout
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
* @description 安全地访问结构体内的属性
* @param obj 要访问的结构体
* @param path 路径
* @param defaultValue 默认值
* @returns {Function} 结果值为 undefined 或 null 返回默认值，结果值为 0, "", false, NaN 这类 falsy 值会被返回
*/
export function sget (obj, path, defaultValue) {
  const keyList = path.toString().split('.')
  const keyLength = keyList.length

  let result = obj
  if (keyLength > 0) {
    for (let i = 0; i < keyLength; i++) {
      if (result == null) {
        break
      }
      result = result[keyList[i]]
    }
  }

  return result == null ? defaultValue : result
}

/**
 * @description 获取URL参数
 * @param  {string} name - 参数名
 * @return {string}
 */
export function queryString (name) {
  const result = window.location.search.match(new RegExp('[?&]' + name + '=([^&]+)', 'i'))
  if (!result) {
    return ''
  }
  return decodeURIComponent(result[1])
}

/**
 * delUrlSearchParam
 * @param {string} url
 * @param {string} key
 * @return {string}
 */
export function delUrlSearchParam (url, key) {
  if (typeof url !== 'string') {
    return ''
  }
  url = url.trim()

  if (!key) {
    return url
  }

  let left = url.indexOf('?')
  let right = url.indexOf('#')

  if (right === -1) {
    right = url.length
  }
  if (left === -1 || left > right) {
    url = url.slice(0, right) + '?' + url.slice(right)
    left = right
    right++
  }
  const search = url.slice(left + 1, right)

  if (search.length === 0) {
    return url
  }

  key = encodeURIComponent(key)
  let result
  const reg = new RegExp('&' + key + '=[^&]+', 'ig')
  const paramsStr = search[0] === '&' ? search : '&' + search // &a=b&c=d&key=value
  result = paramsStr.replace(reg, '')
  result && (result = result.slice(1)) // a=b&c=d

  url = url.slice(0, left + 1) + result + url.slice(right)
  return url
}

/**
* formatDate
* @param {Date|String|Number} time
* @param {String} format - eg: 'yyyy-MM-dd hh:mm', 'yyyy-MM-dd'
* @return {*}
*/
export function formatDate (time, format) {
  const date = new Date(time)
  const o = {
    'M+': date.getMonth() + 1, // 月
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季
    S: date.getMilliseconds(), // 毫秒
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (const k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}

export function extend (target) {
  for (let i = 1, ii = arguments.length; i < ii; i++) {
    const obj = arguments[i]
    if (obj && target instanceof Object) {
      const keys = Object.keys(obj)
      for (let j = 0, jj = keys.length; j < jj; j++) {
        const key = keys[j]
        target[key] = obj[key]
      }
    }
  }
  return target
}

/**
   * 获取服务器现在的时间
   * @return {Date}
   */
export function getServerCurrentTime () {
  const DSSX = GlobalData.DSSX
  const appProp = DSSX.appProp || {}
  let s = isNaN(store.mockSrvTime) ? appProp.srvTime : store.mockSrvTime
  if (undefined === s || s === null) {
    s = Date.now()
  }
  const onload = appProp.onLoadTime == null ? s : appProp.onLoadTime
  return new Date(new Date().getTime() - onload + s)
}

export function initializeDebugInfo () {
  // init mock server time
  let mockSrvTime = queryString('ds_srv_time')
  if (mockSrvTime) {
    if (!isNaN(+mockSrvTime)) {
      // 如果是数字的字符串，转换成 Number
      mockSrvTime = +mockSrvTime
    }
    store.mockSrvTime = new Date(mockSrvTime).getTime()
  }
}

/**
* handle301
*/
export function handle301 () {
  // if (!DSSX.util.pageRequireLogin()) {
  //     return;
  // }

  var ssoPath = GlobalData.DSSX.host.protocol + '//' + GlobalData.DSSX.host.sso + '/sso/'
  var curLink = delUrlSearchParam(window.location.href, 'token') // http://dssxs.dyfchk2.kuxiao.cn/usr/api/quotePage?rfqId=594f40fee3051933997db7a1&"
  var redirectLink = ssoPath + '?url=' + encodeURIComponent(curLink)
  return jumpPage(redirectLink)
}

/**
* jumpPage
* @param {string} url
*/
export function jumpPage (url) {
  if (store.isDebug) {
    logger.log('[common.util] jump page cancelled', url)
  } else {
    logger.log('[common.util] jump page to:', url)
    window.location.href = url
  }
}
