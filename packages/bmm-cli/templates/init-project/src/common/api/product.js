import { get, post } from '../request'
import { addPrefix, getHost, getPrefix, hostList } from './common'

export const queryProductGroups = (params) => {
  return get(
    addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/listProductGroup'),
    params,
    true,
  )
}

export const queryAllProduct = (params) => {
  return get(
    addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/pub/api/listInternalProduct'),
    params,
    true,
  )
}

export const queryMyProductMsg = (params) => {
  return get(
    addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/listMyProduct'),
    params,
    true,
  )
}

export const updateProduct = (params, action) => post(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/updateProduct?method=' + action),
  params,
)
