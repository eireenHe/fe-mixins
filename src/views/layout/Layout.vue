<template>
	<div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
		<sidebar class="sidebar-container"></sidebar>
		<div class="main-container">
			<navbar></navbar>
			<app-main></app-main>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Navbar, Sidebar, AppMain } from './components'
import { getCookie } from '@/utils/auth'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    initUser() {
      if (getCookie('accessToken')) {
        var user = {
          username: getCookie('username'),
          token: getCookie('accessToken')
        }
        localStorage.setItem('u', JSON.stringify(user))
      }
    }
  },
  created() {
    this.initUser()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.el-container {
  height: 100%;
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
