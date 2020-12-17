import { get, post } from '../request'
import { addPrefix, getHost, getPrefix, hostList } from './common'
export function loadSketch (params) {
  return get(addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/loadSketch'), params, true)
}

export function updateSketch (data) {
  return post(
    addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/updateSketch'),
    data,
    true,
  )
}

export function deleteSketch (data) {
  return post(
    addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/updateSketch?commit=1'),
    data,
    true,
  )
}
