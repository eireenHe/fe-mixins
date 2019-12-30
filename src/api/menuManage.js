import request from '@/utils/request'

export function getMenuNode(params) {
  return request({
    url: '/sqlConfig/queryCommonSql',
    method: 'post',
    data: params
  })
}
