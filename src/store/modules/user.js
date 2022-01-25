import storage from 'store'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome, objGet } from '@/utils/util'
import  roleObj from '@/config/roles'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
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
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.result
          storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    SyncInfo({ commit }, userInfo) {
      return new Promise((resolve, reject) => {

        const result = userInfo
        console.log('result userInfo ', userInfo);
        if (objGet(result, 'roles.permissions.length') > 0) {
          // const role = JSON.parse(JSON.stringify(result.roles))
          const role = result.roles
          role.permissions = result.roles.permissions
          role.permissions.map(per => {
            if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
              const action = per.actionEntitySet.map(action => { return action.action })
              per.actionList = action
            }
          })
          role.permissionList = role.permissions.map(permission => { return permission.permissionId })
          commit('SET_ROLES', result.role)
          commit('SET_INFO', result)
        } else {
          reject(new Error('getInfo: roles must be a non-null array !'))
        }

        commit('SET_NAME', { name: result.name, welcome: welcome() })
        commit('SET_AVATAR', result.avatar)
        console.log('result ',result);
        resolve({
          data:result
        })

      })
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          resolve()
        }).catch((err) => {
          console.log('logout fail:', err)
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          reject('退出失败')
        }).finally(() => {
          console.log('finally');
        })
      })
    }

  }
}

export default user
