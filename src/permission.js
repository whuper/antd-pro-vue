import router from './router'
import store from './store'
import { goodStorage } from "@/utils/storage";
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['login', 'register', 'registerResult'] // no redirect allowList
const loginRoutePath = '/user/login'
const defaultRoutePath = '/dashboard/workplace'


router.beforeEach((to, from, next) => {

  console.log('beforeEach## ',to);
  var isLogging = false
  NProgress.start() // start progress bar
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`)
  /* has token */
  // if (storage.get(ACCESS_TOKEN)) {
  console.log('to.path ', to.path);
  if (to.path === loginRoutePath) {
    isLogging = true
    next()
    // next({ path: defaultRoutePath })
    NProgress.done()
  } else {
    // check login user.roles is null
    console.log('store.getters.roles ##1', store.getters.roles)
    if (!store.getters.roles || !store.getters.roles.id) {
      // request login userInfo
      console.log('生成权限菜单');
      store
        .dispatch('SyncInfo') //src\store\modules\user.js
        .then(res => {
          const roles = res.data && res.data.roles
          // generate dynamic router
          store.dispatch('GenerateRoutes', { roles }).then(() => {
            // 根据roles权限生成可访问的路由表
            // 动态添加可访问路由表
            // VueRouter@3.5.0+ New API
            store.getters.addRouters.forEach(r => {
              router.addRoute(r)
            })
            // 请求带有 redirect 重定向时，登录自动重定向到该地址
            const redirect = decodeURIComponent(from.query.redirect || to.path)
            if (to.path === redirect) {
              // set the replace: true so the navigation will not leave a history record
              next({ ...to, replace: true })
            } else {
              // 跳转到目的路由
              next({ path: redirect })
            }
          })
        })
        .catch((err) => {
          console.log('SyncInfo err', err);
          notification.error({
            message: '错误',
            description: '请求用户信息失败，请重试'
          })
          // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
          store.dispatch('Logout').then(() => {
            if (!isLogging) {
              next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            }
          })
        })
    } else {
      next()
    }
  }
  // }
  /* else {
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      console.log('在免登录名单，直接进入');
      next()
    } else {
      console.log('没有权限，回到login');
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  } */
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
