import { get, post, del, put } from '../request'
import { addPrefix, getHost, getPrefix, hostList } from './common'
export const initSTProduct = (params) => get(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/initSTProduct'),
  params,
)
export const queryShipGood = (params) => get(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/getSTProductsList'),
  params,
)
export const queryShipTemplate = (params) => get(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/getShippingTemplateList'),
  params,
)

export const upsertShippingTemplate = (params, action) => post(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/updateShippingTemplate?action=' + action),
  params,
)

export const deleteShipTemplate = (params) => del(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/deleteShippingTemplate'),
  params,
)

export const updateProductTemplate = (params) => put(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/updateProductTemplate'),
  params,
)

export const queryShipCarrier = (params) => get(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/pub/api/getShippingCarrier?carrier=' + params),
)
