
import { get, post } from '../request'
import { addPrefix, getHost, getPrefix, hostList } from './common'

// 查询橱窗产品
export const queryWindowProduct = (params) => get(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/listMyShowWin'),
  params,
)

// 添加橱窗产品
export const addWindowProduct = (data) => post(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/updateShowWin?method=add'),
  data,
  true,
)

// 替换橱窗产品
export const replaceWindowProduct = (data) => post(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/updateShowWin?method=replace'),
  data,
  true,
)

// 排序橱窗产品
export const sortWindowProduct = (data) => post(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/updateShowWin?method=sort'),
  data,
  true,
)

// 删除橱窗产品
export const removeWindowProduct = (data) => post(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/updateShowWin?method=remove'),
  data,
  true,
)
