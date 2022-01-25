import axios from 'axios'
import vm from '../main'

// import { baseApi } from '../config'

import store from '@/store'
// store.js exposes a simple API for cross-browser local storage:
// import storage from 'store'
import notification from 'ant-design-vue/es/notification'
// import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { goodStorage } from "@/utils/storage";
const baseApi = process.env.VUE_APP_API_BASE_URL


const instance = axios.create({
  // API 请求的默认前缀
  baseURL: baseApi,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})


// 异常拦截处理器
const errorHandler = (error,reject) => {
  if (error.response) {
    // 从 localstorage 获取 token
    const token = goodStorage.get(ACCESS_TOKEN)
    switch (error.response.status) {
      // 未登录
      case 401:
        notification.error({
          message: 'error',
          description: '您还未登录!!'
        })
        error.info = '您还未登录'
        //清空用户信息
        goodStorage.remove("user");
        // vm.$router.push('/login')
        break
      case 403:
        notification.error({
          message: 'error',
          description: '登录失效!!'
        })
        error.info = '登录失效'
        break
      case 404:
        // Toast.fail('资源不存在');
        error.info = '资源不存在'
        // 请求丢失
        break
      case 500:
        notification.error({
          message: 'error',
          description: '服务端异常，请系统管理员'
        })
        error.info = '服务端异常，请系统管理员'
        // 请求丢失
        break
      default:
        reject(error)
        break
    }
    /*     if (token) {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
        } */

  }
  reject(error)
}


// 请求拦截器 添加token， 判断登录之类操作
instance.interceptors.request.use(
  config => {

    // config.headers['token'] = sessionStorage.getItem('token') || ''

    // 如果get请求有缓存
    if (config.method === 'get') {
      const now = `${Date.now()}`
      if (config.params) {
        config.params[now] = now
      } else {
        const hasParams = config.url.includes('?')
        config.url = config.url + (hasParams ? '&' : '?') + `${now}=${now}`
      }
    }

    /*     if (config.loading === true) {
          vm.$loading.hide() */
    // vm.$loading.show()
    // }

    return config
  }
  //, errorHandler
)

// 响应拦截器，对返回数据进行预处理
instance.interceptors.response.use(
  response => {
    if (!response.data.result && response.data.msg) {
      notification.error({
        message: 'error',
        description: response.data.msg
      })
    }
    // vm.$loading.hide()
    return response
  }
  //, errorHandler
)
/**
 *  请求封装
 * @param {*} options
 */
const request = (options = {}) => {
  return new Promise((resolve, reject) => {
    instance(options)
      .then((responseData) => {
        resolve(responseData.data)

      }, (err)=>{
        errorHandler(err,reject)
      }
      )
  })
}

const get = (url, params = {}, options = {}) => {
  return request({
    url,
    method: 'get',
    params,
    ...options
  })
}

const put = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'put',
    data,
    ...options
  })
}

const post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'post',
    data,
    ...options
  })
}

const del = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'delete',
    data,
    ...options
  })
}
  // 将获取cancelToken的方法绑定到每个方法上面，方便调用的时候使用
  ;[request, get, post, put, del, instance].forEach(item => {
    item.getCancelToken = () => {
      return axios.CancelToken
    }
  })

/**
 * request 对请求进行二次包装，处理了异常编码
 * get
 * set
 * axios 对axios进行包装之后的原生实例
 */
export { instance as axios, baseApi }
export const $http = { request, get, post, put, del }