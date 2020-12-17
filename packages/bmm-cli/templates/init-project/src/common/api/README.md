不同模块需要接口，都应该在 api 目录下创建自己的接口文件，用自己的接口文件去统一管理 api,
ep:

```
import { get } from '../request'
import { addPrefix, getHost, getPrefix, hostList } from './common'

export const sameCheck = (params) => {
  return get(addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/fileStatus'), params, true)
}


```
接口拼接请尽量使用这样的方式：addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/fileStatus')
若是有变动就可以统一改函数addPrefix/getHost/getPrefix，不用每个接口都改