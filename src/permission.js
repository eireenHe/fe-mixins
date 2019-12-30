import router from './router'
import store from './store'
import { queryMenus } from '@/api/login'
import { getCookie } from '@/utils/auth'

const whiteList = ['/login']
async function hasPermission() {
  if (!getCookie('accessToken') || !(getCookie('accessToken').length > 2)) {
    return
  }
  var user = {
    username: getCookie('username'),
    token: getCookie('accessToken')
  }
  localStorage.setItem('u', JSON.stringify(user))
  var params = {
    appCode: store.state.app.appCode,
    token: getCookie('accessToken')
  }
  try {
    var response = await queryMenus(params)
    if (response.data.resetPwdFlag === 1) {
      store.commit('SET_REPWD', true)
    } else {
      store.commit('SET_REPWD', null)
    }
    var permissionRoutes = ['/default']
    if (response && response.data && response.data.sysOperationDTOList) {
      for (var item of response.data.sysOperationDTOList) {
        if (item.operateType === 1) {
          permissionRoutes.push(item.operateUrl)
        } else if (item.operateType === 0) {
          permissionRoutes.push(item.operateCode)
        }
      }
    }
    localStorage.setItem('rs', JSON.stringify(permissionRoutes))
    if (permissionRoutes.length > 1) {
      if (localStorage.getItem('historyPath')) {
        router.push(localStorage.getItem('historyPath'))
      } else {
        router.push('/home')
      }
    } else {
      router.push('/default')
    }
  } catch (error) {
    console.log(error)
  }
}
hasPermission()
// 单点登录
router.beforeEach((to, from, next) => {
  if (getCookie('accessToken') && getCookie('accessToken').length > 2) {
    // 已登录
    if (localStorage.getItem('rs')) {
      if (JSON.parse(localStorage.getItem('rs')).includes(to.path)) {
        localStorage.setItem('historyPath', to.path)
        next()
      } else {
        next('/default')
      }
    } else {
      hasPermission()
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
