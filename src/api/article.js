/**
 * 文章相关接口封装模块
 */

//  获取推荐列表数据
import request from '@/utils/request'

export const getArticles = ({
  channelId, // 频道
  timestamp, // 时间戳（用于分页）
  withTop // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: {
      channel_id: channelId,
      timestamp,
      with_top: withTop
    }
  })
}

// 对文章不喜欢
export const dislikesArticle = articleId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      // 不喜欢文章的id
      target: articleId
    }
  })
}
