
import { get } from '../request'
import { addPrefix, getHost, getPrefix, hostList } from './common'

// 获取交易力真实数据
export const queryTradingPowerData = () => get(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/loadSupplierStarTradingPower'),
)

// 获取店铺星等级数据
export const querySupplierStar = () => get(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/loadSupplierStar'),
)
