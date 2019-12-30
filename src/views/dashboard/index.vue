<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎访问征信中心</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters(['name', 'roles']),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    text-align: center;
  }
  &-text {
    font-size: 26px;
    line-height: 46px;
  }
}
</style>
