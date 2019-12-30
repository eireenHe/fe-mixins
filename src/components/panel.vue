<template>
  <div class="el-panel">
    <div class="el-panel-header with-border" v-if="title || $slots.header">
      <slot name="header"><h3 class="el-panel-title" v-text="title" v-if="title"></h3></slot>
    </div>
    <div class="el-panel-body">
      <slot name="body" v-if="$slots.body">
        暂无内容显示
      </slot>
      <slot v-else>
      </slot>
    </div>
    <div class="el-panel-footer" v-text="footer" v-if="footer">
    </div>
  </div>
</template>
<script type="text/javascript">
  export default{
    name: 'elpanel',
    props: {
      title: {
        type: String
      },
      footer: {
        type: String
      }
    }
  }
</script>
<style scoped>
  .el-panel{
    /* box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04); */
    border: 1px solid #ddd;
  }

  .el-panel {
    position: relative;
    background: #ffffff;
    /*border-top: 3px solid #d2d6de;*/
    margin-bottom: 20px;
    width: 100%;
    /* box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1); */
  }

  .el-panel .overlay.dark,
  .overlay-wrapper .overlay.dark {
    background: rgba(0, 0, 0, 0.5);
  }
  .el-panel-header:before,
  .el-panel-body:before,
  .el-panel-footer:before,
  .el-panel-header:after,
  .el-panel-body:after,
  .el-panel-footer:after {
    content: " ";
    display: table;
  }
  .el-panel-header:after,
  .el-panel-body:after,
  .el-panel-footer:after {
    clear: both;
  }
  .el-panel-header {
    color: #444;
    background: #f2f2f2;
    display: block;
    padding: 15px;
    position: relative;
  }
  .el-panel-header.with-border {
    border-bottom: 1px solid #ddd;
  }
  .collapsed-box .el-panel-header.with-border {
    border-bottom: none;
  }
  .el-panel-header > .fa,
  .el-panel-header > .glyphicon,
  .el-panel-header > .ion,
  .el-panel-header .el-panel-title {
    display: inline-block;
    font-size: 16px;
    margin: 0;
    line-height: 1;
  }
  .el-panel-header > .fa,
  .el-panel-header > .glyphicon,
  .el-panel-header > .ion {
    margin-right: 5px;
  }
  .el-panel-header > .el-panel-tools {
    position: absolute;
    right: 10px;
    top: 5px;
  }
  .el-panel-header > .el-panel-tools [data-toggle="tooltip"] {
    position: relative;
  }
  .el-panel-header > .el-panel-tools.pull-right .dropdown-menu {
    right: 0;
    left: auto;
  }
  .el-panel-header > .el-panel-tools .dropdown-menu > li > a {
    color: #444!important;
  }

  .el-panel-body {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
    padding: 20px;
  }

  .el-panel-footer {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
    border-top: 1px solid #f4f4f4;
    padding: 10px;
    background-color: #ffffff;
  }
</style>
