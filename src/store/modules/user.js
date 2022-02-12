import storage from 'store'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome, objGet } from '@/utils/util'
import { translateRole } from '@/config/roles'
import { goodStorage } from '@/utils/storage'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: {},
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      console.log('roles', roles)
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      goodStorage.set('user', info)
      state.info = info
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          commit('SET_TOKEN', response.id)
          commit('SET_INFO', response)
          commit('SET_NAME', { name: response.userName })
          commit('SET_ROLES', translateRole(response))
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    SyncInfo({ commit }, userInfo) {
      return new Promise((resolve, reject) => {

        const result = userInfo
        commit('SET_ROLES', translateRole(userInfo))
        commit('SET_INFO', result)
        commit('SET_NAME', { name: result.userName })
        resolve({
          data: Object.assign(result, { role: translateRole(userInfo) })
        })

      })
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_INFO', null)
          storage.remove(ACCESS_TOKEN)
          resolve()
        }).catch((err) => {
          console.log('logout fail:', err)
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          reject('退出失败')
        }).finally(() => {
          console.log('finally')
        })
      })
    }

  }
}

export default user
