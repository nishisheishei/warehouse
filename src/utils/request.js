import axios from 'axios'
import store from '@/store'
import JSONbig from 'json-bigint'

/**
 * axios.create 用于创建一个 axios 实例，该文件实例和 axios 的功能一样的，也可以说是克隆了
 *
 * 这样的好处是： 可以拥有多个不同的请求函数，而他们的配置可以是不一样的
 * 例如：有些项目可能会涉及到使用不同的接口路径
 */
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 线上地址
  // baseURL: 'http://toutiao.course.itcast.cn'  // 本地地址
})

/**
 * 处理后端返回数据中数字超出 JavaScript 安全整数范围
 */
request.defaults.transformResponse = [function (data) {
  try {
    // 如果是 json 格式字符串，那就转换并返回给后续使用
    return JSONbig.parse(data)
  } catch (err) {
    // 报错就意味着 data 不是 json 格式字符串，这里就直接原样返回给后续使用
    return data
  }
}]

// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent

  // 判断是否登录 如果登录了，则统一给接口添加用户 token
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }

  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Do something with response data

  // 如果响应结果对象中有 data ，则直接返回这个 data 数据
  // 如果响应结果对象中没有 data ，则不作任何处理，直接原样返回
  return response.data.data || response.data
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

export default request
