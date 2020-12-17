/**
 * eventBus
 * 使用方式：以登录为例
 * import { eventBus, listenType } from '@/common/event-bus'
 * 注册监听事件：
   eventBus.on(listenType.login, () => {
        // 你的代码逻辑
    })
 * 触发回调：
   eventBus.emit(listenType.login)
 * 是否需要注销监听事件和是否只监听一次事件根据实际需要来定
 * 详见官方文档 https://github.com/developit/mitt#emit
*/

/**
 * 官方示例
  import mitt from 'mitt'
  const emitter = mitt()

  // listen to an event
  emitter.on('foo', e => console.log('foo', e) )

  // listen to all events
  emitter.on('*', (type, e) => console.log(type, e) )

  // fire an event
  emitter.emit('foo', { a: 'b' })

  // clearing all events
  emitter.all.clear()

  // working with handler references:
  function onFoo() {}
  emitter.on('foo', onFoo)   // listen
  emitter.off('foo', onFoo)  // unlisten

*/
import mitt from 'mitt'
import { GlobalData } from './global-data'
import * as util from './util'

/**
 * eventBus 实例属性
 * @property all A Map of event names to registered handler functions.
 * @function on (type:string | symbol , handler:Function)
 * @function off (type:string | symbol , handler:Function)
 * @function emit (type:string | symbol , args:any?)
*/
export const eventBus = mitt()

export const listenType = {
  login: 'login',
  area: 'area',
}

export function isDoneInit () {
  return new Promise((resolve, reject) => {
    // 获取全局登录信息
    const logined = util.sget(GlobalData.DSSX, 'appProp.logined', false)

    // 全局有登录信息，说明已经登录
    if (logined) {
      resolve(true)
    } else {
      const cb = () => {
        eventBus.off(listenType.login, cb)
        resolve(true)
      }
      // 若没有，应该监听登录事件，在登录完成后回调函数中做业务
      eventBus.on(listenType.login, cb)
    }
  })
}
