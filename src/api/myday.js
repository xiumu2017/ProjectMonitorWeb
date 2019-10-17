import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/myday/list',
    method: 'get',
    params
  })
}

export function doAdd(params) {
  return request({
    url: '/myday/doAdd',
    method: 'get',
    params
  })
}

export function getTypeList(params) {
  return request({
    url: '/myday/getTypeList',
    method: 'get',
    params
  })
}
