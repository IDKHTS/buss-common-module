import { get } from '../request'
import { addPrefix, getHost, getPrefix, hostList } from './common'

export const loadAccInfo = (params) => {
  return get(
    addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/loadAccInfo'),
    params,
    true,
  )
}
