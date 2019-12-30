import Vue from 'vue'

import Element from 'element-ui'
import './styles/element-variables.scss'
import './styles/app.scss'
import './styles/libs/font-awesome-4.7.0/css/font-awesome.min.css'
import './styles/libs/iconfont.css'
// import contentmenu from 'v-contextmenu'
// import 'v-contextmenu/dist/index.css'
import echarts from 'echarts'
import { Multipane, MultipaneResizer } from 'vue-multipane'

import App from '@/App'
import router from '@/router'
import store from '@/store'

import '@/permission' // permission control
import md5 from 'js-md5'
import axios from 'axios'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

// Sentry.init({
//   dsn: 'http://6e4ca407b344434c995dec5cdf70ad46@femonitor.mljr.com/17',
//   integrations: [
//     new Integrations.Vue({
//       Vue,
//       attachProps: true
//     })
//   ]
// })

Vue.prototype.$axios = axios

Vue.use(Element)
// Vue.use(contentmenu)
Vue.component('multipane', Multipane)
Vue.component('multipane-resizer', MultipaneResizer)

Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.prototype.$md5 = md5

Vue.prototype.toHtml= function (value) {
	if (!value) {
		return value
	}
  if (value.includes(',')) {
    return `<br/>${value}`
  } else {
    return value
  }
}
Vue.prototype.filterToWan = function (num) {
  if (num < 9999) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + ',') || num || '0'
  }
  if (num) {
    var newNum = (num.toString().slice(0, num.toString().length - 4)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + ',')
    return `${newNum}<i style='font-size:18px;'>万</i>`
  }
}
// 按钮权限控制
Vue.directive('has', {
  bind: function(el, binding) {
    if (!Vue.prototype.$_has(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
})
// 权限检查方法
Vue.prototype.$_has = function(value) {
  var isExist = false
  var buttonpermsStr = JSON.parse(localStorage.getItem('rs'))
  if (buttonpermsStr === undefined || buttonpermsStr === null) {
    return false
  }
  for (let i = 0; i < buttonpermsStr.length; i++) {
    if (buttonpermsStr.indexOf(value) > -1) {
      isExist = true
      break
    }
  }
  return isExist
}
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
