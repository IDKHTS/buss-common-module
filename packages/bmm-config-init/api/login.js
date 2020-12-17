
import { get } from '../request'
import { addPrefix, getHost, getPrefix, hostList } from './common'

export const queryDssxConfig = (params) => get(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/pub/api/dssx_config'),
  params,
)

export const queryDssxUInfo = (params) => get(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/pub/api/dssx_uinfo'),
  params,
)

export const querySSOUinfo = (host, params) => get(
  addPrefix(getHost(hostList.sso), getPrefix(hostList.sso), '/sso/api/uinfo'),
  params,
)

export const logout = (params) => get(
  addPrefix(getHost(hostList.sso), getPrefix(hostList.sso), '/sso/api/logout'),
  params,
  true,
)
