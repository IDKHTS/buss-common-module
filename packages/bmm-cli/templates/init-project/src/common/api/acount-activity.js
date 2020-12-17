import { get, post } from '../request'
import { addPrefix, getHost, getPrefix, hostList } from './common'

export const queryAcountActivity = (params) => get(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/acount_activity'),
  params,
)

export const addAcountActivity = (params) => post(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/acount_activity'),
  params,
)
