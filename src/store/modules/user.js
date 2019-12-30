import {
  login,
  logout,
  changePwd
} from '@/api/login'
import {
  getToken,
  removeToken,
  setCookie,
  delCookie
} from '@/utils/auth'

const user = {
  state: {
    name: '',
    token: getToken(),
    roles: [],
    rePwd: null
  },

  mutations: {
    SET_NAME(state, name) {
      state.name = name
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_ROLES(state, roles) {
      state.roles = roles
    },
    SET_REPWD(state, rePwd) {
      state.rePwd = rePwd
    }
  },

  actions: {
    // 用户名登录，获取用户信息
    Login({
      commit
    }, loginForm) {
      return new Promise((resolve, reject) => {
        login(loginForm).then(response => {
          const data = response.data
          commit('SET_NAME', loginForm.username)
          commit('SET_TOKEN', data.token)
          // commit('SET_ROLES', data.roles)
          // setToken(data.token)
          setCookie('username', data.userEmployeeDTO.userName)
          setCookie('usernumber', data.userEmployeeDTO.userNumber)
          setCookie('accessToken', data.token)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({
      commit,
      state
    }, params) {
      return new Promise((resolve, reject) => {
        logout(params).then(() => {
          localStorage.clear()
          removeToken()
          delCookie('usernumber')
          delCookie('username')
          delCookie('accessToken')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        localStorage.clear()
        removeToken()
        delCookie('usernumber')
        delCookie('accessToken')
        delCookie('username')
        resolve()
      })
    },

    // 修改密码
    ChangePwd({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        changePwd(params).then(response => {
          localStorage.clear()
          removeToken()
          delCookie('usernumber')
          delCookie('accessToken')
          delCookie('username')
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
