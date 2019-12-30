<template lang="jade">
    div.login-page
        div.login-bg
        div.login-panel
            h2.login-panel-title 登录
            el-form(label-width="80px", autoComplete="on", :model="loginForm", :rules="loginRules", ref="loginForm")
                el-form-item(label="用户名:", prop="userName")
                    el-input(type="text", v-model="loginForm.userName", auto-complete="off", placeholder="请输入用户名")
                el-form-item(label="密码:", prop="userPwd")
                    el-input(type="password", v-model="loginForm.userPwd", auto-complete="off", @keyup.enter.native="login", placeholder="请输入密码")
                el-form-item
                    el-button.login-form-button(type="primary",:loading="loading", @click.native="login") 登录
</template>

<script>
import { getCookie } from '@/utils/auth'
export default {
  data() {
    return {
      loginForm: {
        appCode: this.$store.state.app.appCode,
        userName: getCookie('usernumber'),
        userPwd: ''
      },
      loginRules: {
        userName: [{ required: true, message: '请输入用户名！' }],
        userPwd: [{ required: true, message: '请输入密码！' }]
      },
      loading: false
    }
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.loginForm.userPwd === '123456') {
            this.$store.commit('SET_REPWD', true)
          } else {
            this.$store.commit('SET_REPWD', null)
          }
          this.loginForm.userPwd = this.$md5(this.loginForm.userPwd)
          this.$store.dispatch('Login', this.loginForm).then((res) => {
            this.loading = false
            this.initRolesAndUser(res)
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.loading = false
          return false
        }
      })
    },
    initRolesAndUser(res) {
      if (getCookie('accessToken')) {
        var user = {
          username: getCookie('username'),
          token: getCookie('accessToken')
        }
        localStorage.setItem('u', JSON.stringify(user))
        var roles = ['/default']
        if (res.sysOperationDTOList) {
          for (var item of res.sysOperationDTOList) {
            if (item.operateType === 1) {
              roles.push(item.operateUrl)
            } else if (item.operateType === 0) {
              roles.push(item.operateCode)
            }
          }
        }
        localStorage.setItem('rs', JSON.stringify(roles))
        if (roles.length > 1) {
          this.$router.push('/home')
        } else {
          this.$router.push('/default')
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$bg: "~@/assets/bg.jpg";
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
}

.login-bg {
  background: url($bg) center center no-repeat;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-width: 100vw;
  min-height: 100vh;
}

.login-panel {
  width: 100%;
  max-width: 400px;
  position: relative;
  background-color: #122b3b;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  margin: 20px;
  padding: 20px;
}
.logo{
  position: absolute;
  left: 50%;
  transform: translate(-50%, -200%)
}

.login-panel-title {
  text-align: center;
  margin: 10px 0 20px;
  font-size: 1.3rem;
  color: #606266;
  font-weight: 600;
}

.login-panel-text-row {
  margin: 10px 0;
}

.login-form-button {
  width: calc(100% - 60px);
  display: block;
}

.el-button--primary {
  background-color: #347ebc;
  border-color: #347ebc;
  font-weight: 700;
  font-size: 1rem;
  &:hover {
    opacity: 0.8;
  }
}
</style>
