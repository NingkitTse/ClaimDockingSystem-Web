import request from "@/utils/request"

export function getEntityInfos(param) {
	return request({
		url: '/entity/infos',
		method: 'get',
		params: param,
	})
}