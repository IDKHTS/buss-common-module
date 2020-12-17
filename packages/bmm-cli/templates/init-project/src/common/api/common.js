import { Logger } from '@/common/logger'
import * as util from '@/common/util'
import { GlobalData } from '@/store/global-data'

const domainConfig = require('../../../config/domain-config-local')

const logger = new Logger('common/api/common')

export const hostList = {
  ars: 'ars',
  course: 'course',
  dssx: 'dssx',
  dssx_en: 'dssx_en',
  fs: 'fs',
  kuxiao: 'kuxiao',
  sso: 'sso',

  // 临时调用主域配置
  // main: 'main',
}
/**
 * 为api请求加上域名及前缀
 * 若为开发环境，因为要实现本地代理转发，不用加域名，只需加上前缀即可，webpack根据不同前缀转发到不同域名;
 * 若为生产环境，不需要加前缀，只需加域名，返回一个完整的url请求
 * */
export const addPrefix = (host, prefix, path) => {
  if (process.env.NODE_ENV === 'production') {
    return (host ? domainConfig.protocolProd + '//' + host : '') + path
  }
  return '/' + prefix + path
}

// 开发环境无需获取域名
export const getHost = (hostType) => {
  if (process.env.NODE_ENV === 'production') {
    if (hostType === hostList.dssx) {
      return ''
    }

    // 临时调用主域配置
    // if (hostType === hostList.main) {
    //   hostType = hostList.dssx
    // }

    // hostType = 'srvList.' + hostType + '.host'
    // const host = util.sget(domainConfig, hostType, '')
    hostType = 'DSSX.host.' + hostType
    const host = util.sget(GlobalData, hostType, '')
    if (host === '') {
      logger.error('host is empty')
    }
    return host
  }
  return ''
}

// 生产环境无需获取前缀
export const getPrefix = (hostType) => {
  if (process.env.NODE_ENV === 'production') {
    return ''
  }
  const prefix = util.sget(domainConfig, 'srvList.' + hostType + '.prefix', '')
  if (prefix === '') {
    logger.error('prefix is empty')
  }
  return prefix
}
