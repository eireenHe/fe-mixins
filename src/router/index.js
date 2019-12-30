import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '../views/layout/Layout'

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  {
    path: '/404',
    component: () =>
        import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    hidden: true,
    children: [
      {
        path: 'default',
        name: 'Default',
        component: () =>
          import('@/views/default/index')
      },
      {
        path: 'home',
        name: 'Home',
        component: () =>
            import('@/views/dashboard/index')
      }
    ]
  },
  {
    path: '/supplier',
    component: Layout,
    redirect: '/list',
    hidden: true,
    children: [{
      path: 'list',
      name: 'supplierList',
      component: () =>
          import('@/views/supplier/list')
    }]
  },
  {
    path: '/productType',
    component: Layout,
    redirect: '/list',
    hidden: true,
    children: [{
      path: 'list',
      name: 'productTypeList',
      component: () =>
          import('@/views/productType/list')
    }]
  },
]
export const asyncRouterMap = [
  {
    path: '/supplier',
    component: Layout,
    redirect: '/list',
    hidden: true,
    children: [{
      path: 'list',
      name: 'supplierList',
      component: () =>
          import('@/views/supplier/list')
    }]
  },
  {
    path: '/productType',
    component: Layout,
    redirect: '/list',
    hidden: true,
    children: [{
      path: 'list',
      name: 'productTypeList',
      component: () =>
          import('@/views/productType/list')
    }]
  },
  {
    path: '/menuManage',
    component: Layout,
    redirect: '/menuManage/list',
    name: 'MenuManage',
    meta: {
      title: 'MenuManage',
      icon: '',
      roles: ['admin']
    },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () =>
            import('@/views/menuManage/list'),
        meta: {
          title: '菜单列表',
          icon: '',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
