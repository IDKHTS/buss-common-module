import { get, post } from '@/common/request'
import { addPrefix, getHost, getPrefix, hostList } from '@/common/api/common'
export const queryDiscountCoupon = (params) => get(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/getDiscountCouponList'),
  params,
)

export const upsertDiscountCoupon = (params, action) => post(
  addPrefix(getHost(hostList.dssx), getPrefix(hostList.dssx), '/usr/api/updateDiscountCoupon?action=' + action),
  params,
)
