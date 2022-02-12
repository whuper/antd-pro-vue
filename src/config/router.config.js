// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'
import CommonLayout from '@/layouts/CommonLayout'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home'},
    // redirect: '/dashboard/workplace',
    redirect: '/admin',
    children: [
      // 管理员
      {
        path: '/admin',
        name: 'admin',
        component: RouteView,
        redirect: '/list/user-list',
        meta: { title: '管理员操作', icon: 'check-circle-o'},
        children: [
          {
            path: '/list/user-list',
            name: 'UserList',
            component: () => import('@/views/newp/UserList'),
            meta: { title: '帐号管理'}
          },
          {
            path: '/list/device-list',
            name: 'Devicelist',
            component: () => import('@/views/demo/DeviceList'),
            meta: { title: '装置管理'}
          },
          {
            path: '/list/syc-config',
            name: 'SycConfig',
            component: () => import('@/views/newp/SycConfig'),
            meta: { title: '系统设置'}
          }
        ]
      },
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: CommonLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
