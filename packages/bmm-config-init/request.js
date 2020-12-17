import axios from 'axios'
// import { getToken } from './util/index'
// import { banUpdate } from './mode/preview-mode'
import * as util from './util'

// 请求拦截器
axios.interceptors.request.use(
  config => config,
  error => Promise.reject(error),
)

// 响应拦截器
axios.interceptors.response.use(codeItcptSuc, err => Promise.reject(err))

// code的处理
function codeItcptSuc (response) {
  let code = NaN
  code = util.sget(response, 'data.code')

  // 预览模式的code
  if (code === 403 || code === 413) {
    // 引入预览模式
    // banUpdate(code === 403 ? '预览模式只能查看，不能进行修改操作。' : '无权限访问')
    // err type, 102: http 拦截器 response reject
    const err = {
      type: 102,
      data: response,
    }
    return Promise.reject(err)
  }

  // 重定向code
  if (code === 301) {
    util.handle301(util.sget(response, 'data.data', ''))
    const err = {
      // type === 1301 登录信息过期
      type: 1301,
      data: response,
    }
    return Promise.reject(err)
  }

  // 正常code
  if (code === 0) {
    return Promise.resolve(response)
  }

  // 其他异常的code
  const err = {
    // type === 1 请求正常 业务逻辑错误
    type: 1,
    data: response,
  }
  return Promise.reject(err)
}

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {boolean} needLogin [是否需要登陆]
 */
export function get (url, params, needLogin) {
  params = processParams(params, { needLogin: needLogin })
  return axios.get(url, { params: params })
    .then(
      res => Promise.resolve(res.data),
      err => Promise.reject(err.data),
    )
//   return new Promise((resolve, reject) => {
//     axios
//       .get(url, {
//         params: params,
//       })
//       .then(res => {
//         resolve(res.data)
//       })
//       .catch(err => {
//         reject(err.data)
//       })
//   })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求的内容]
 * @param {boolean} needLogin [是否需要登陆]
 */
export function post (url, params, needLogin) {
  params = processParams(params, { needLogin: needLogin })
  return axios.post(url, params)
    .then(
      res => Promise.resolve(res.data),
      err => Promise.reject(err.data),
    )
  // return new Promise((resolve, reject) => {
  //   axios
  //     .post(url, params)
  //     .then(res => {
  //       resolve(res.data)
  //     })
  //     .catch(err => {
  //       reject(err.data)
  //     })
  // })
}

function processParams (argParams, option) {
  if (!option) {
    return argParams
  }

  if (typeof argParams === 'object' && argParams != null) {
    option.needLogin && (argParams.token = util.getToken())
  } else {
    /* TODO: 处理不是 object 的其他的格式 */
    argParams = option.needLogin ? { token: util.getToken() } : null
  }

  return argParams
}

/**
 * del方法，对应delete请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {boolean} needLogin [是否需要登陆]
 */
export function del (url, params, needLogin) {
  params = processParams(params, { needLogin: needLogin })
  return axios.get(url, { params: params })
    .then(
      res => Promise.resolve(res.data),
      err => Promise.reject(err.data),
    )
  // return new Promise((resolve, reject) => {
  //   axios
  //     .delete(url, {
  //       params: params,
  //     })
  //     .then(res => {
  //       resolve(res.data)
  //     })
  //     .catch(err => {
  //       reject(err.data)
  //     })
  // })
}

/**
 * put方法，对应pus请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求的内容]
 * @param {boolean} needLogin [是否需要登陆]
 */
export function put (url, params, needLogin) {
  params = processParams(params, { needLogin: needLogin })
  return new Promise((resolve, reject) => {
    axios
      .put(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
