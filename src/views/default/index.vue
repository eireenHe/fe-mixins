<template lang="jade">
div(class="default" v-cloak)
    h2 {{test}}

</template>

<script>
export default {
  name: 'Default',
  data() {
    return {
      test: '欢迎使用征信中心系统'
    }
  },
  computed: {},
  watch: {},
  updated() {},
  mounted() {
    this.initData()
  },
  methods: {
    initData() {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.default {
  margin: 0 auto;
  width: 600px;
  text-align: center;
  padding-top: 200px;
  h2 {
    font-size: 1.5em;
    font-weight: bold;
  }
}
</style>
