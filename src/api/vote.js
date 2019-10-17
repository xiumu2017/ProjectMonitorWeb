import request from '@/utils/request'
import axios from 'axios'

export function create(params) {
  return request({
    url: '/vote/create',
    method: 'post',
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

export function del(params) {
  axios.delete('', request.defaults).then(res => {
    console.log(res)
  })
}
