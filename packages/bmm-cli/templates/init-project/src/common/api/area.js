import { get } from '../request'
import { addPrefix, getHost, getPrefix, hostList } from './common'

export const area = () => get(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/pub/api/area'),
)
