import request from "@/utils/request"

export function getEntityInfos(data) {
  return request({
    url: '/entity/infos',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data,
  })
}

export function modifyEntityInfo(data) {
  return request({
    url: '/entity/info',
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data,
  })
}
