<template lang="jade">
.content
  el-header
    el-row(type="flex", justify="space-between")
      el-col(:span="6" style='width:auto;')
        span.logo()
          .title 征信中心
          i(class="fa fa-bars",@click="toggleSideBar",:class="{'menu-opend':sidebar.opened,'menu-folded':!sidebar.opened}")
      el-col.t-right(:span="12")
        //- el-button(type="text",@click="toogleScreen")    
          i(class="fa menu-btn",:class="{'fa-expand':!isFullScreen,'fa-compress':isFullScreen}")
        el-dropdown.navbar-dropdown(:hide-on-click="false")
          .el-dropdown-link
            //- img.heading-avatar(src="~@/assets/account.gif") 
            span {{ name || '未知' }}
            i.el-icon-caret-bottom
          el-dropdown-menu(slot="dropdown")
            el-dropdown-item(@click.native="changePwd")
              i.fa.fa-unlock
              span 修改密码
            el-dropdown-item(@click.native="logout")
              i.fa.fa-sign-out
              span 退出
   el-dialog(title="修改密码" width='390px', :visible.sync="isShowPw", :close-on-click-modal="false", :close-on-press-escape="false", :show-close="false")
      el-form(:model="passwordForm", :rules="rules", ref='passwordForm', label-width="100px", label-position="left", style="margin-top:30px;")
          el-form-item(label="输入旧密码:" prop="oldPwd")
              el-input(v-model="passwordForm.oldPwd", type="password", placeholder="请输入旧密码")
          el-form-item(label="输入新密码:" prop="newPwd")
              el-input(v-model="passwordForm.newPwd", type="password", placeholder="不少于8位字符，请勿与旧密码相同",  @keyup.native="checkIntensity")
          el-form-item(label="确认密码:" prop='newPwdRe')
              el-input(v-model="passwordForm.newPwdRe", type="password", placeholder="不少于8位字符，请勿与旧密码相同" @keyup.enter.native="submit('passwordForm')")
          el-form-item(label="密码强度:")
              .detectionBtn
                  span(:class="{weak: isShoWeak}") 弱
                  span(:class="{middle: isShowMiddle}") 中
                  span(:class="{better: isShowBetter}") 强
      div(slot="footer" ,class="dialog-footer")
          el-button(type="default", @click="resetForm('passwordForm')", style="margin-right: 10px;" v-if='!isMustChange') 取消
          el-button(type="primary", :loading='submitting' @click="submit('passwordForm')") 确定
</template>

<script>
const checkStrong = (val) => {
  var modes = 0
  if (val.length < 6) return 0
  if (/\d/.test(val)) modes++ // 数字
  if (/[a-z]/.test(val)) modes++ // 小写
  if (/[A-Z]/.test(val)) modes++ // 大写
  if (/\W/.test(val)) modes++ // 特殊字符
  if (val.length > 26) return 4
  return modes
}
import { mapGetters } from 'vuex'

export default {
  data() {
    const validateNew = (rule, value, callback) => {
      if (value.length < 8) {
        return callback(new Error('不得小于8位字符！'))
      } else if (value === this.passwordForm.oldPwd) {
        return callback(new Error('新密码不能与旧密码相同！'))
      } else if (checkStrong(value) < 3) {
        return callback(
          new Error('密码至少包括大小写字母、数字、特殊符号其中三种，例如 Mljr.com')
        )
      }
      return callback()
    }
    const validateConfirm = (rule, value, callback) => {
      if (value !== this.passwordForm.newPwd) {
        return callback(new Error('确认密码和新密码不一致！'))
      }
      return callback()
    }
    return {
      isFullScreen: false,
      name: localStorage.getItem('u') && JSON.parse(localStorage.getItem('u')).username,
      passwordForm: {
        oldPwd: '',
        newPwd: '',
        newPwdRe: ''
      },
      rules: {
        oldPwd: [{ required: true, message: '请输入旧密码' }],
        newPwd: [
          { required: true, message: '请输入新密码' },
          { validator: validateNew, trigger: 'blur' }
        ],
        newPwdRe: [
          { required: true, message: '请输入确认密码' },
          { validator: validateConfirm, trigger: 'blur' }
        ]
      },
      isShowPw: false,
      isShoWeak: false,
      isShowMiddle: false,
      isShowBetter: false,
      isMustChange: false,
      submitting: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'rePwd'
    ]),
    isRePwd() {
      return this.$store.state.user.rePwd
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      var params = {
        token: JSON.parse(localStorage.getItem('u')).token,
        appCode: this.$store.state.app.appCode
      }
      this.$store.dispatch('LogOut', params).then((res) => {
        location.reload()
      }).catch(() => {
        this.$store.dispatch('FedLogOut').then(() => {
          location.reload()
        })
      })
    },
    checkIntensity() {
      var num = checkStrong(this.passwordForm.newPwd)
      switch (num) {
        case 1:
          this.isShoWeak = true
          this.isShowMiddle = false
          this.isShowBetter = false
          break
        case 2:
          this.isShoWeak = false
          this.isShowMiddle = true
          this.isShowBetter = false
          break
        case 3:
        case 4:
          this.isShoWeak = false
          this.isShowMiddle = false
          this.isShowBetter = true
          break
        case 0:
          this.isShoWeak = false
          this.isShowMiddle = false
          this.isShowBetter = false
          break
        default:
          this.isShoWeak = true
          this.isShowMiddle = false
          this.isShowBetter = false
          break
      }
    },
    changePwd() {
      this.isShowPw = true
      this.passwordForm.oldPwd = ''
      this.passwordForm.newPwd = ''
      this.passwordForm.newPwdRe = ''
    },
    resetForm(formName) {
      this.$refs[formName] && this.$refs[formName].resetFields()
      this.isMustChange = false
      this.isShowPw = false
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitting = true
          const params = {
            appCode: this.$store.state.app.appCode,
            userPwd: this.$md5(this.passwordForm.oldPwd),
            changePwd: this.$md5(this.passwordForm.newPwd),
          };
          this.$store.dispatch('ChangePwd', params).then((res) => {
            this.$notify({
              type: 'success',
              title: '提示',
              message: '密码修改成功！',
            });
            this.$store.commit('SET_REPWD', null);
            this.resetForm(formName);
            this.isMustChange = false;
            this.isShowPw = false;
            this.submitting = false;
            this.$router.push('/login');
          }).catch((error) => {
            this.submitting = false;
            console.log(error);
          });
        } else {
          return false;
        }
      });
    },
    toogleScreen() {
      this.isFullScreen = !this.isFullScreen
      if (this.isFullScreen) {
        this.requestFullScreen()
      } else {
        this.exitFullscreen()
      }
    },
    requestFullScreen() {
      var de = document.documentElement
      if (de.requestFullscreen) {
        de.requestFullscreen()
      } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen()
      } else if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen()
      }
    },
    exitFullscreen() {
      var de = document
      if (de.exitFullscreen) {
        de.exitFullscreen()
      } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen()
      } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen()
      }
    }
  },
  // 处理单点登录时强制修改密码
  watch: {
    isRePwd(nv, ov) {
      if (nv) {
        this.isMustChange = true
        this.isShowPw = true
      } else {
        this.isMustChange = false
        this.isShowPw = false
      }
    }
  },
  created() {
    this.isShoWeak = false
    this.isShowMiddle = false
    this.isShowBetter = false
    if (this.rePwd) {
      this.isMustChange = true
      this.isShowPw = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-header {
  height: 49px !important;
  line-height: 50px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.8);
  background-color: #111;
  position: fixed !important;
  width: 100% !important;
  .el-dropdown-link:hover {
    height: 48px !important;
  }
  .menu-btn {
    color: #ccc;
  }
}

.el-form-item {
  margin-bottom: 35px;
}

.logo {
  margin-right: 20px;
  display: inline-block;
  text-align: left;
  font-size: 20px;
  color: rgb(34, 34, 34);
  img {
      margin-top: 20px;
      width: 150px;
      // transform: scale(.8);
  }
  .title {
    display: inline-block;
    font-size: 16px;
    font-weight: 500;
    width: 135px;
    text-align: left;
    color: #fff;
  }
  .fa-bars {
      margin-left: 25px;
      cursor: pointer;
      color: #ccc;
  }
  .menu-opend {
      transform: rotate(0deg);
      transition: transform 0.5s;
  }
  .menu-folded {
      transform: rotate(90deg);
      transition: transform 0.5s;
  }
}
.t-right {
  text-align: right;
}
.heading-avatar {
  width: 30px;
  height: 30px;
  border-radius: 30px;
  margin-right: 10px;
  border: 1px solid #ddd;
  overflow: hidden;
}
.el-dropdown {
  color: #ccc;
}
.el-dropdown-link {
  cursor: pointer;
  height: 50px;
  line-height: 50px;
  padding: 0 15px;
  min-width: 50px;
  text-align: center;
  margin-left: 20px;
  span {
    margin-right: 5px;
    font-weight: 500;
  }
  i {
    font-size: 18px;
  }
  img {
    vertical-align: middle;
  }
  &:hover {
    color: #fff;
  }
}
.detectionBtn{
  span{
      display: inline-block;
      width: 60px;
      height: 20px;
      line-height: 20px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: #fff;
      margin-right: 5px;
      text-align: center;
  }
  .weak{
      background: red;
      color: #fff
  }
  .middle{
      background: yellow;
      color: #fff
  }
  .better{
      background: green;
      color: #fff
  }
}
.el-dialog{
  .el-input{
    width: 255px;
  }
}
</style>

