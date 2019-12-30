<template>
  <section class="app-main" style="min-height: 100%">
    <div class="el-main">
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
      </transition>
      <transition  name="fade-transform" mode="out-in">
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </transition>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>
