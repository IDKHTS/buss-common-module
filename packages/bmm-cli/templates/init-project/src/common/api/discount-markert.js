import { get, post } from '../request'
import { addPrefix, getHost, getPrefix, hostList } from './common'

export const queryDiscountMarketList = (params) => get(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/getDiscountMarketList'),
  params,
  true,
)

export const addDiscountMarketActivity = (params) => post(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/addDiscountMarketActivity?action=insert'),
  params,
  true,
)
