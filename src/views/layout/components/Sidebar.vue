<template lang="jade">
  scroll-bar
    el-menu(mode="vertical",:default-active="activeUrl",:collapse="isCollapse",background-color="#222324",text-color="#8e8e8e",active-text-color="rgb(64, 158, 255)",:router="true")
      div.menu-wrapper(v-for="(menu,index) in async_menus", :key="index", v-if='menu["show"]')
        el-menu-item.submenu-title-noDropdown(v-if="!!menu['url']", :index="menu.url", :route="menu.url")
          i(:class="'menu-i-icon ' + menu.icon")
          span(slot="title") {{ menu.title }}
        el-submenu(v-else, :index="menu.title")
          template(slot="title")
            i(:class="'menu-i-icon ' + menu.icon")
            span(slot="title") {{ menu.title }}
          el-menu-item(:index="submenu.url", :route="submenu.url",v-for="(submenu, subIndex) in menu.submenus", :key="subIndex", v-if='submenu.show' ) {{ submenu.title }}
</template>

<script>
import { mapGetters } from 'vuex'
import ScrollBar from '@/components/ScrollBar'
import { queryMenus } from '@/api/login'
import { getCookie } from '@/utils/auth'

export default {
  data() {
    return {
      async_menus: [
        {
          url: '/home',
          icon: 'fa fa-home',
          title: '首页',
          show: false
        },
        {
          url: '/supplier/list',
          icon: 'fa fa-address-book',
          title: '供应商管理',
          show: false
        },
        {
          url: '/productType/list',
          icon: 'fa fa-sitemap',
          title: '征信产品类型管理',
          show: false
        },
        {
          url: '/creditProduction/list',
          icon: 'fa fa-cubes',
          title: '征信产品管理',
          show: false
        },
        {
          url: '/dataSearch/list',
          icon: 'fa fa-th',
          title: '数据批量查询',
          show: false
        },
        {
          url: '/switchConfig/list',
          icon: 'fa fa-toggle-on',
          title: '征信产品时效配置',
          show: false
        },
        // {
        //   url: '',
        //   icon: 'fa fa-list',
        //   title: '菜单管理',
        //   submenus: [
        //     {
        //       url: '/menuManage/list',
        //       icon: '',
        //       title: '菜单列表'
        //     }
        //   ]
        // }
      ]
    }
  },
  components: {
    ScrollBar
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    activeUrl() {
      if (this.$route.meta.hidden) {
        // 如果当前路由不在菜单中，默认选中的是当前路由所在组的第一个路由
        // 此逻辑不完善，如有需要则在当前路由的meta中具体指定
        const m = this.$route.path.substr(1)
        const cur = this.addRouters[0].children.filter(v => v.path === m)[0]
        const par = this.addRouters[0].children.filter(v => v.meta.title === cur.meta.title.split('-')[0])[0]
        return par.path
      } else {
        return this.$route.path
      }
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    async getMenus() {
      var params = {
        appCode: this.$store.state.app.appCode,
        token: getCookie('accessToken')
      }
      var response = await queryMenus(params)
      if (response && response.data && response.data.sysOperationDTOList && response.data.sysOperationDTOList.length) {
          for (var sidebarMenu of this.async_menus) {
          if (sidebarMenu.submenus && sidebarMenu.submenus.length) {
            for (var submenu of sidebarMenu.submenus) {
              if (localStorage.getItem('rs').includes(submenu.url)) {
                submenu.show = true
                sidebarMenu.show = true
              }
            }
          } else {
            if (localStorage.getItem('rs').includes(sidebarMenu.url)) {
              sidebarMenu.show = true
            }
          }
        }
      }
    }
  },
  mounted() {
    this.getMenus()
  }
}
</script>
<style lang='stylus'>
  .fa
    width 17px
    font-size 17px
    margin-left -1px
</style>
