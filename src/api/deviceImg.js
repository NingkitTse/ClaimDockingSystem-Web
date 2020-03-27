import request from "@/utils/request"

export function getEntityInfos(data) {
  return request({
    url: '/device-img/infos',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data,
  })
}

export function uploadDeviceImg(data) {
  return request({
    url: '/device-img/info',
    method: 'post',
    headers: {
    },
    data,
  })
}

export function deleteDeviceImg(data) {
  return request({
    url: '/device-img/info',
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    data,
  })
}