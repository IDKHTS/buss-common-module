import * as util from './util'
import { Logger } from 'bmm-logger'
import { queryDssxConfig, queryDssxUInfo, querySSOUinfo } from './api/login'
import { GlobalData } from './global-data'
import { eventBus, listenType,isDoneInit } from './event-bus'
// import dialog from '@/common/dialog'
const domainConfig = require('../domain-config-local')

const logger = new Logger('common/permission')
const globalData = GlobalData
const REQUEST_SSO_API = false
/**
 * @typedef {object} DSSX
 * @property {object} APP_CONFIG - 后端返回的配置
 * @property {object} uinfo - 当前登录用户的信息 （ps: 明确要读当前登录的用户的信息时才使用这个，否则请使用currUser）
 * @property {object} stuInfo - 预览模式时，查看的学生信息，否则为空
 * @property {object} currUser - 当前实训平台使用的用户的信息（预览模式时，为查看的学生的信息），页面显示的状态（用户昵称之类）请读这个字段
 * @property {object} userPermission - 当前登录用户的权限
 * @property {object} host - 相关域名
 * @property {object} attr - 属性(不推荐再拓展新的字段)，目前用在控制国际站状态及相关信息
 * @property {Array} previewBlackList
 * @property {object} noLoginPage
 * @property {object} appProp - 应用属性, font-end application properties
 * @property {TrainingMission} TrainingMission - TrainingMission, 实训任务
 */

// 应用错误
// 若 AppError.fatalError 为 true，将中止应用
const AppError = {
  fatalError: false,
  fatalErrorSet: {
    LoadAppConfig: false,
    LoadSso: false,
    MissingSsoUserInfo: false,
    MissingAppUserInfo: false,
  },
}

/**
 * 获取登陆权限的初始化
*/
async function permissionInit () {
  try {
    const res = await queryDssxConfig()
    globalData.DSSX_CONFIG = res.data
    logger.log('get DSSX_CONFIG', globalData.DSSX_CONFIG)
  } catch (err) {
    logger.error(err)
    AppError.fatalError = true
    AppError.fatalErrorSet.LoadAppConfig = true
    appFatalErrorHandler()
    return
  }

  setApiBlackList()
  setDssxConfig()

  if (REQUEST_SSO_API) {
    initApiRequest()
  } else {
    initJsRequest()
  }
}

/**
   * 预览模式下接口黑名单
   * 针对post接口
   * 预览模式下拦截器会将该请求的post body内容置空
   */
function setApiBlackList () {
  globalData.DSSX.previewBlackList = [
    '/usr/api/updateDecoTmpl', // 旺铺装修模板
    '/usr/api/updateCpnyInfo', // 公司信息
    '/usr/api/updateProduct', // 更新产品
    '/usr/api/addProduct', // 添加产品
    '/usr/api/addCreditOrder', // 添加信保订单
    '/usr/api/updateOrder', // 修改信保订单
    '/usr/api/addQuotation', // 增加报价单
  ]
}

/**
   * 配置后端接口域名
   */
function setDssxConfig () {
  globalData.DSSX.APP_CONFIG = globalData.DSSX_CONFIG
  if (!globalData.DSSX.APP_CONFIG) {
    logger.error('cannot not found APP config')
    AppError.fatalError = true
    AppError.fatalErrorSet.LoadAppConfig = true
    return
  }

  const host = globalData.DSSX.APP_CONFIG.host
  const map = host.srvList

  if (!globalData.DSSX.APP_CONFIG) {
    logger.error('cannot not found APP srvList')
    AppError.fatalError = true
    AppError.fatalErrorSet.LoadAppConfig = true
    return
  }

  const o = {
    main: map.dssx,
    main_en: map.dssx_en,
    course: map.course,
    kuxiao: map.kuxiao,
    fs: map.fs,
    sso: map.sso,
    protocol: host.protocol || '',
    previewModHostDomain: host.previewModeDomain || '', // 'dev.gdy.io',  预览模式的域名 - dsalbbpxxx.dev.gdy.io
  }
  globalData.DSSX.host = util.extend({}, globalData.DSSX.host, o)
  logger.log('set dssxConfig:', globalData.DSSX)
}

/**
 * 接口方式获取config（新）然后再请求uinfo
 */
async function initApiRequest () {
  try {
    const res = await querySSOUinfo()
    const code = res && res.code
    if (code === undefined) {
      return Promise.reject(new Error('code is not exit'))
    }
    if (code === 301) {
      logger.log('当前未登陆，正在跳转登陆页面...')
      const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
      const encodeUrl = encodeURIComponent(url)
      const jumpToUrl = `${globalData.DSSX.host.protocol}//${globalData.DSSX.host.sso}/sso/index.html?url=${encodeUrl}`
      window.location.href = jumpToUrl
      console.log('301 jumpToUrl', jumpToUrl)
      return Promise.reject(new Error('not login'))
    }
    logger.log('get sso uinfo success!', res)
    globalData.UINFO = res.UINFO
    globalData.SRV_TIME = res.SRV_TIME
    globalData.ONLOAD_TIME = res.ONLOAD_TIME
  } catch (err) {
    AppError.fatalError = true
    AppError.fatalErrorSet.LoadSso = true
    AppError.fatalErrorSet.MissingSsoUserInfo = true
    appFatalErrorHandler()
    logger.error(err)
    return
  }
  try {
    const timestamp = Date.now()
    const res = await queryDssxUInfo(
      {
        selector: 'ALL',
        timestamp,
        token: globalData.UINFO.token || '',
      })

    logger.log('get G_DSSX_UINFO:', res)
    globalData.G_DSSX_UINFO = res
  } catch (err) {
    AppError.fatalError = true
    AppError.fatalErrorSet.MissingAppUserInfo = true
    appFatalErrorHandler()
    logger.error(err)
    return
  }
  uInfoHandle()
}

/**
 * jsonp方式获取config（旧），返回的js文件执行就会在window对象注册几个变量UINFO、SRV_TIME、ONLOAD_TIME
 * 再请求uinfo
 */
function initJsRequest () {
  const host = globalData.DSSX.host
  var ssouinfoUrl = (host.protocol || '') + '//' + host.sso + '/sso/api/uinfo.js?user=1&selector=basic'
  const script = document.createElement('script')
  script.src = ssouinfoUrl
  script.onload = async () => {
    logger.log('get sso uinfo success!')
    globalData.UINFO = window.UINFO
    globalData.SRV_TIME = window.SRV_TIME
    globalData.ONLOAD_TIME = window.ONLOAD_TIME
    logger.log('get UINFO:', globalData.UINFO)
    try {
      const timestamp = Date.now()
      const res = await queryDssxUInfo(
        {
          selector: 'ALL',
          timestamp,
          token: globalData.UINFO.token || '',
        })
      globalData.G_DSSX_UINFO = res.data
      logger.log('get G_DSSX_UINFO:', globalData.G_DSSX_UINFO)
    } catch (err) {
      AppError.fatalError = true
      AppError.fatalErrorSet.MissingAppUserInfo = true
      appFatalErrorHandler()
      logger.error(err)
      return
    }
    uInfoHandle()
  }
  script.onerror = () => {
    AppError.fatalError = true
    AppError.fatalErrorSet.LoadSso = false
    appFatalErrorHandler()
    logger.error('load sso uinfo fail')
  }
  document.body.appendChild(script)
}

/**
   * @description 用户信息的处理
   */
function uInfoHandle () {
  appFatalErrorHandler()
  const APP_CONFIG = globalData.DSSX.APP_CONFIG || {}
  const DUINFO = globalData.G_DSSX_UINFO.DUINFO || {}
  const PINFO = globalData.G_DSSX_UINFO.PINFO || {}
  const dssxHost = globalData.DSSX.host

  const logonUser = util.extend({}, DUINFO)
  const attr = {
    isPreviewMode: false,
    state: '', // 国际站开通状态
    previewPrefix: '', // 预览模式的前缀
    previewModeHost: '', // 预览模式的域名
  }
  const appProp = {
    token: globalData.UINFO.token || '',
    srvTime: globalData.SRV_TIME,
    onLoadTime: globalData.ONLOAD_TIME,
    logined: false,
    sysMode: APP_CONFIG.sysMode || 'teach',
  }

  if (!loginHandle(logonUser, appProp.token)) {
    logger.warn('Not login', logonUser, appProp.token)
  } else {
    appProp.logined = true
  }

  // 是否是预览模式
  const isPreviewMode = attr.isPreviewMode = !!globalData.G_DSSX_UINFO.isPreviewMod

  let targetUser
  if (!isPreviewMode) {
    targetUser = logonUser
  } else {
    let usr = PINFO.stu
    if (!(usr && usr.id)) {
      logger.error('preview mod: cannot found student info')
      usr = {}
    }

    targetUser = {
      isShowAccountOpenTip: false, // 预览模式，不进行国际站状态提示
      uid: usr.id,
      usr: usr,
      tag: util.sget(usr, 'attrs.basic.tag', ''), // 预览对象的 tag 在 stu.attrs.basic.tag
    }
  }

  // 国际站开通状态
  attr.state = util.sget(targetUser, 'usr.attrs.basic.state', 'write_auth_info')

  // 预览模式前缀
  const previewPrefix = targetUser.tag || ''

  // 当前用户的预览模式前缀
  attr.previewPrefix = previewPrefix
  // 当前用户的预览模式的域名
  attr.previewModeHost = previewPrefix + '.' + dssxHost.previewModHostDomain

  globalData.DSSX.attr = attr
  globalData.DSSX.uinfo = logonUser
  globalData.DSSX.currUser = targetUser
  globalData.DSSX.userPermission = getRolePermissions(logonUser)
  isPreviewMode && (globalData.DSSX.stuInfo = targetUser)
  globalData.DSSX.appProp = appProp
  globalData.DSSX.noLoginPage = {
    '/ali-index.html': 1, // 前台首页
  }
  logger.log('update DSSX: ', globalData.DSSX)
  eventBus.emit(listenType.login)
}

/**
   * @description 登录拦截
   * @param info 用户信息
   * @param token token令牌
   */
function loginHandle (info, token) {
  if (AppError.fatalError) {
    return false
  }

  info = info || {}
  // 未登录
  if (!info.uid || !token) {
    logger.log(info, token)
    const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
    const encodeUrl = encodeURIComponent(url)
    const jumpToUrl = `${globalData.DSSX.host.protocol}//${globalData.DSSX.host.sso}/sso/index.html?url=${encodeUrl}`
    logger.log('未登陆，301 jumpToUrl ：', jumpToUrl)
    window.location.href = jumpToUrl
    return false
  }

  logger.log('已登陆', info.uid, token)
  // 实训角色为空，为受限用户，不能使用实训平台
  if (!info.trainingRole) {
    // 管理员，跳至管理页面
    if (info.role && info.role.indexOf('RCP_ADMIN') !== -1) {
      const pagePathName = '/manage.html'
      if (pagePathName === location.pathname) {
        return
      }
      logger.log('管理员，跳至管理页面')
      // window.location.href = pagePathName
      util.jumpPage(pagePathName)
    } else {
      logger.log('受限用户不能访问')

      // 其它，跳至受限页
      const pagePathName = '/buy-guidance.html'
      if (pagePathName === location.pathname) {
        return
      }
      // window.location.href = pagePathName
      util.jumpPage(pagePathName)
      return false
    }
  }
  return true
}

// 应用发生致命错误时进行处理；提示错误信息
function appFatalErrorHandler () {
  if (!globalData.G_DSSX_UINFO || !globalData.UINFO) {
    logger.error('Lack of necessary data')
    AppError.fatalError = true
    AppError.fatalErrorSet.MissingAppUserInfo = !globalData.G_DSSX_UINFO
    AppError.fatalErrorSet.MissingSsoUserInfo = !globalData.UINFO
  }

  if (!AppError.fatalError) {
    return
  }

  // 提示弹窗
  let msg = '发生致命错误，可能为网络问题、代码错误、或服务错误，请稍后重试'
  msg += JSON.stringify({ Error: AppError.fatalErrorSet, localTimeStamp: Date.now() })

  logger.error(msg)
  // todo : 抽离dialog
//   dialog.errConfirm({ content: msg })
}

// 用户权限判断
function getRolePermissions (logonUser) {
  const role = logonUser.role || []
  const permission = {
    P4P_TASK_COUNT: false,
    COURSE_CONFIG: false,
    SYSTEM_TASK_COUNT: false,
  }

  if (role.indexOf('RCP_ADMIN') !== -1) {
    permission.P4P_TASK_COUNT = true
    permission.COURSE_CONFIG = true
    permission.SYSTEM_TASK_COUNT = true
    permission.isAdmin = true
  }

  if (logonUser.isTeacher) {
    permission.P4P_TASK_COUNT = true
  }

  return permission
}

export { permissionInit,isDoneInit,GlobalData,domainConfig }
