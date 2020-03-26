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
