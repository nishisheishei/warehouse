/**
 * 搜索相关数据接口
 */

import request from '@/utils/request'

//  获取搜索结果
export const getSearch = ({
  // 页数，不传默认为1
  page = 1,
  // 每页数量，不传每页数量由后端决定
  perPage = 10,
  // 搜索关键词
  q
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params: {
      page,
      per_page: perPage,
      q
    }
  })
}

// 获取联想建议（自动补全）
export const getSuggestion = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}
