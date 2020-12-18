/**
 * 每个pages下的页面都需引入这个文件初始化，用于浏览器和登陆的拦截
 * 使用方式，在main.js引入
   import { init } from '../../common/init'
   init(() => {
     // 挂载vue实例
      Vue.config.productionTip = false
      new Vue({
          router,
          store,
          render: h => h(App),
        }).$mount('#app')
    })
 *注：使用这种方式是为了确保vue实例挂载前能获取完配置参数及用户信息
*/

import { chromeonly } from './chromeonly'
import { permissionInit } from 'bmm-config-init'
// import { trainingMissionInit } from './training-mission/training-mission'

const isMock = process.env.VUE_APP_MOCK

// if (isMock === 'true') {
//   require('../../mock')
// }

export function init () {
  chromeonly()
  permissionInit()
  // trainingMissionInit()
}
