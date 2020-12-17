/**
 * 使用方式
 * import { Logger } from '@/common/logger'
 * const logger = new Logger(你所处模块的名称)
 *
*/

const LOGGER = {
  debug: 0,
  log: 1,
  warn: 2,
  error: 3,
}

function canPrintLog (level) {
  const envLevel = process.env.VUE_APP_DEBUG_LEVEL
  if (LOGGER[level] < envLevel) return false
  return true
}

export class Logger {
  constructor (path) {
    this.debug = (function () {
      if (canPrintLog('debug')) {
        return console.debug.bind(this, `[debug] [${path}]`)
      }
      return () => { }
    }())

    this.log = (function () {
      if (canPrintLog('log')) {
        return console.log.bind(this, `[log] [${path}]`)
      }
      return () => { }
    }())

    this.warn = (function () {
      if (canPrintLog('warn')) {
        return console.warn.bind(this, `[warn] [${path}]`)
      }
      return () => { }
    }())

    this.error = (function () {
      if (canPrintLog('error')) {
        return console.error.bind(this, `[error] [${path}]`)
      }
      return () => { }
    }())
  }
}
