import { get } from '../request'
import { addPrefix, getHost, getPrefix, hostList } from './common'

export function queryTask (params) {
  return get(addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/queryTask'), params, true)
}
export function syncTask (params) {
  return get(addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/syncTask'), params, true)
}
