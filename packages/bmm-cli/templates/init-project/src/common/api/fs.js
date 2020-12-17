
import { get } from '../request'
import { addPrefix, getHost, getPrefix, hostList } from './common'

export const sameCheck = (params) => {
  return get(addPrefix(getHost(hostList.fs), getPrefix(hostList.fs), '/usr/api/fileStatus'), params, true)
}
