/**
 * 使用方式
 * 在需要调用提示弹窗的地方写上以下逻辑：
 * import dialog from '@/common/dialog'
 * dialog.info('message....')
 *
 * 提示(无按钮交互)
 * info
 * warning
 * success
 * error
 *
 * 提示对话框(有确定)
 * errConfirm
 *
*/

// import { Message, Modal } from 'ant-design-vue'
import { Logger } from '@/common/logger'
// import { openExamFinishTip } from '@/common/mode/exam-mode'
const logger = new Logger('common/dialog')
// 部分 error type 显示的替换原因
const errorTypeAlternativeReason = {
  1301: '登录超时，请重新登录',
  '-1': '未知接口格式',
  '-2': '网络错误，请稍后再试',
  '-3': '请求超时',
}

//  排除的 error type
const excludeErrorTypes = [
  -4, // 手动中断请求
]

// 部分 data code 前面加入提示语
const dataCodeInsertion = {
  301: '登录超时',
}

// 排除的 code
const excludeCodes = [
  403, 413, // 预览模式不允许更改
]

function info (msg) {
  Message.info(msg)
}

function warning (msg) {
  Message.warning(msg)
}

function success (msg) {
  Message.success(msg)
}

/**
* 显示错误提示的静态方法
* @param err 'request().then(sucCallBack, errCallBack)' errCallBack的参数
*              {type: 1, data: {data: xhrResponse}}
* @param option . {moduleName: '', funcName: '', text: ''}}
* @returns {string} e.g. [测试模块(MyFunction)] 提示语, 错误码: 1, 原因, arg-err, param is nil
*/
function error (err, option) {
  if (!err) {
    return ''
  }
  option = option || {}

  const reasons = []

  // ------------ 检查 type
  /**
   * 错误类型 errType
   * err.type > 0，业务逻辑错误或业务逻辑非默认情况; type < 0, 请求错误，或接口响应数据格式不符合预期
   *
   * -2: 请求错误
   * -1: 请求正常，接口没有返回code
   * 1: 请求正常 业务逻辑错误
   * 102: http 拦截器 response reject
   * 1301: 登录信息过期
   */
  const errType = err.type

  if (excludeErrorTypes.indexOf(errType) > -1) {
    // 部分 error type 不显示提示
    logger.log('ignore the error because error type is', errType)
    return ''
  }

  if (errorTypeAlternativeReason[errType]) {
    reasons.push(errorTypeAlternativeReason[errType])
    const reason = reasons.join(' ')
    /* TODO: 加上 url */
    return Message.error(reason)
  }

  // ------------ 检查 code
  // const requestResponse = err.data || {}  // 旧项目会多一层
  const xhrResponse = err.data || {}
  const code = typeof xhrResponse.code !== 'undefined' ? xhrResponse.code : ''

  if (excludeCodes.indexOf(code) > -1) {
    // 部分 code 不显示提示
    logger.log('ignore the error because code is', code)
    return ''
  }

  if (code === 440) {
    logger.log('考试已结束')
    // DSSX.exam = DSSX.exam || {}
    // let openExamFinishTip = DSSX.exam.openExamFinishTip

    // if (typeof openExamFinishTip === 'function') {
    //   openExamFinishTip()
    // }

    return ''
  }

  // ------------ 读取组装原因
  dataCodeInsertion[code] && reasons.push(dataCodeInsertion[code])

  xhrResponse.msg && reasons.push(xhrResponse.msg.toString())
  xhrResponse.dmsg && reasons.push(xhrResponse.dmsg.toString())

  // ------------ 组装提示文本
  const moduleName = (option.moduleName || '').trim()
  const funcName = (option.funcName || '').trim()
  const text = (option.text || '').trim()

  if (!moduleName && !funcName && !text && !reasons.length) {
    return ''
  }

  const reason = reasons.join(' ')
  return Message.error(formatText(moduleName, funcName, text, code, reason))
}

function formatText (moduleName, funcName, text, code, reason) {
  const list = [
    funcName ? ('[' + (moduleName || '') + '(' + funcName + ')]')
      : (moduleName ? '[' + moduleName + ']' : ''),
    text ? (text + ', ') : '',
    '错误码：',
    code,
    reason ? (', 原因：' + reason) : '',
  ]
  return list.join('')
}

function errConfirm (option) {
  const defaultOption = {
    content: option.content,

    prefixCls: option.prefixCls || '',
    /** 对话框是否可见 */
    visible: option.visible || true,
    /** 确定按钮 loading */
    confirmLoading: option.confirmLoading || true,
    /** 标题 */
    title: option.title || '错误提示',
    /** 是否显示右上角的关闭按钮 */
    closable: option.closable || true,
    closeIcon: option.closeIcon,
    /** 点击确定回调 */
    // onOk: (e: React.MouseEvent<any>) => void,
    /** 点击模态框右上角叉、取消按钮、Props.maskClosable 值为 true 时的遮罩层或键盘按下 Esc 时的回调 */
    // onCancel: (e: React.MouseEvent<any>) => void,
    // afterClose: PropTypes.func.def(noop),
    /** 垂直居中 */
    centered: option.centered || false,
    /** 宽度 */
    width: option.width || 520,
    /** 底部内容 */
    footer: option.footer,
    /** 确认按钮文字 */
    okText: option.okText || '确定',
    /** 确认按钮类型 */
    // okType: ButtonType ,
    /** 取消按钮文字 */
    cancelText: option.cancelText || '取消',
    icon: option.icon,
    /** 点击蒙层是否允许关闭 */
    maskClosable: option.maskClosable || true,
    /** 强制渲染 Modal */
    forceRender: option.forceRender || false,
    // okButtonProps: PropTypes.object,
    // cancelButtonProps: PropTypes.object,
    destroyOnClose: option.destroyOnClose || false,
    wrapClassName: option.wrapClassName || '',
    maskTransitionName: option.maskTransitionName || '',
    transitionName: option.transitionName || '',
    // getContainer: PropTypes.func,
    zIndex: option.zIndex || 1000,
    // bodyStyle: PropTypes.object,
    // maskStyle: PropTypes.object,
    mask: option.mask || true,
    keyboard: option.keyboard || true,
    // wrapProps: PropTypes.object,
    focusTriggerAfterClose: option.focusTriggerAfterClose || false,
  }
  // Modal.confirm(defaultOption)
}

export default {
  info,
  success,
  warning,
  error,
  errConfirm,
}
