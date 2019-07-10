import axios from 'axios'

/**
 * axios.create 用于创建一个 axios 实例，该文件实例和 axios 的功能一样的，也可以说是克隆了
 *
 * 这样的好处是： 可以拥有多个不同的请求函数，而他们的配置可以是不一样的
 * 例如：有些项目可能会涉及到使用不同的接口路径
 */
const request = axios.create({
  baseURL: 'http://toutiao.course.itcast.cn'
})

// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
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
