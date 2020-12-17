
import { get, post } from '../request'
import { addPrefix, getHost, getPrefix, hostList } from './common'

export const UpsertDirectionalPromotion = (action, params) => post(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/updateDirectionalPromotion?action=' + action),
  params,
  true,
)

export const GetDirectionalPromotionList = (params) => get(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/loadDirectionalPromotionList'),
  params,
  true,
)

export const UpdateDirectionalPromotionList = (action, params) => post(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/updateDirectionalPromoteList?action=' + action),
  params,
  true,
)

export const listProductByIds = (params) => post(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/pub/api/listProductByIds'),
  params,
  true,
)
export const getRelativeProductionByIDs = (params) => post(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/getRelativeProductionByIDs'),
  params,
  true,
)
export const updateDirectionalPromotionProd = (params) => post(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/updateDirectionalPromotionProd'),
  params,
  true,
)
export const deleteDirectionalPromotionProd = (params) => post(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/delDirectionalPromotionProd'),
  params,
  true,
)
export const addDirectionalPromotionProd = (params) => post(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/addDirectionalPromotionProd'),
  params,
  true,
)

export const getRelativeProductionByFilter = (params) => get(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/getRelativeProductionByFilter'),
  params,
  true,
)
export const getRelativeProductionByStatus = (params) => get(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/getRelativeProductionByStatus'),
  params,
  true,
)

/**
 * @description 获取p4p帐号
 */
export const loadP4PAcc = () => get(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/loadP4pAcc'),
  { tipInfo: 'yes' },
  true,
)

/**
 * @description 更新P4P账户信息
 * @param {object} params
 */
export const updateP4pAcc = (params) => post(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/updateP4pAcc'),
  params,
  true,
)
