import { $http } from '@/utils/request'

/**
 * 校验用户名密码，返回是否需要验证指纹
 * @param data
 * @returns {Promise<unknown>}
 */
 export const checkFinger = (data) => {
  return post('/user/login/checkFinger', data, {

  })
}

/**
 * 校验通过后登录
 * @param data
 * @returns {Promise<unknown>}
 */
export const login = (data) => {
  return $http.post('/user/login', data, {
  })
}

/**
 * 关机
 */
export const shutDown = () => {
  // return post('/shutdown')
  return $http.post('/platform/shutdown')
}

/**
 * 关闭指纹仪
 */
export const closeFingerDevice = () => {
  return $http.get('/fingerprint/closeDevice', )
}

export function getInfo (userId) {
  return $http.get('/user/' + userId)
}

export function getCurrentUserNav () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

export function logout () {
  return new Promise((resolve,reject)=>{
    console.log(432);
    $http.get('/logout').then((res)=>{
      resolve(res)
    }).catch((err)=>{
      console.log(222);
      reject(err)
    })
  })
  
  // $http.get('/logout')
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}
