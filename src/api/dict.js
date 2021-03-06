import request from '@/utils/request'
// import qs from 'qs'

export function getDictList(param) {
  // console.log(param)
  // debugger
  return request({
    url: '/sys-dict/infos',
    method: 'get',
    params: param
  })
}

export function getDeptListByParentPostcode({parentPostcode}) {
  // console.log(param)
  // debugger
  return request({
    url: `/dept/infos/child/${parentPostcode}`,
    method: 'get',
  })
}

export function getDeptList() {
  return request({
    url: `/dept/infos`,
    method: 'get',
  })
}

export function getDeptInfo(postcode) {
  return request({
    url: `/dept/info/${postcode}`,
    method: "get"
  })
}