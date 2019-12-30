import axios from 'axios'
import router from '@/router'
import {
  Notification,
  MessageBox
} from 'element-ui'
import store from '../store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // progress bar style
import { getToken, delCookie } from '@/utils/auth'
NProgress.configure({
  showSpinner: false
}) // NProgress Configuration
// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  // timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  NProgress.start()
  if (store.getters.token) {
    config.headers['token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  if (store.state.app.appCode) {
    config.headers['appCode'] = store.state.app.appCode
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */
    NProgress.done()
    const res = response.data
    if (!response.request.responseURL.includes('sso') && parseInt(res.code) !== 0) {
      if (res.code === '401') {
        localStorage.clear()
        delCookie('token')
        delCookie('accessToken')
        router.push({ name: 'login' })
      } else {
        Notification({
          message: res.message || res.msg,
          type: 'error',
          title: '错误'
        })
      }
      return Promise.reject('error')
    } else if (response.request.responseURL.includes('sso') && res.errorCode !== '0000') {
      if (res.errorCode === '401') {
        localStorage.clear()
        delCookie('token')
        delCookie('accessToken')
        router.push({ name: 'login' })
      } else {
        Notification({
          title: '错误',
          message: res.errorMsg,
          type: 'warning'
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    NProgress.done()
    console.dir(error) // for debug
    Notification({
      title: '错误',
      message: (error.response && error.response.data && error.response.data.msg) || error.msg || error.message || '异常错误',
      type: 'error'
    })
    return Promise.reject(error)
  }
)

export default service
