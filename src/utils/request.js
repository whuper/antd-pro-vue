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

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}


// 异常拦截处理器
const errorHandler = (error,reject) => {
  if (error.response) {
    notification.error({
      message: 'error',
      description: codeMessage[error.response.status]
    })
    error.info = codeMessage[error.response.status]
    switch (error.response.status) {
      // 未登录
      case 401:
        //清空用户信息
        goodStorage.remove('user')
        vm.$router.push('/login')
        break
      case 403:
        break
      case 404:

        // 请求丢失
        break
      case 500:
        break
      default:
        reject(error)
        break
    }
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
        config.params[now] = now;
        if(config.params.pageNo){ // 统一修改pageNo 参数为 page
          config.params.page = config.params.pageNo;
          delete config.params.pageNo;
        }
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
/**
 * {
 *   data: any,
 *   result: boolean,
 *   msg: string.
 * }
 */
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
        const resData = responseData.data;
        if(resData.result){
          resolve(resData.data) // 正确情况下直接返回data
        }else{
          reject(resData.msg)
        }
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