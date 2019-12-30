<template lang='jade'>
  .container
    el-form(ref='searchForm', :model='searchForm')
      el-form-item(prop='name')
        el-input(placeholder='供应商名称' type='text' v-model='searchForm.name' maxlength='10' clearable)
      el-form-item(prop='status')
        el-select(v-model='searchForm.status' placeholder='使用状态' filterable clearable)
          el-option(v-for='(item, index) of statusArray', :label='item.value', :value='item.key', :key='index')
      el-form-item(style='width:auto')
        el-button(@click='handleReset("searchForm")') 重置
        el-button(type='primary' icon='el-icon-search' @click='handleSearch') 查询
      el-form-item(style='width:auto')
        el-button(type='success' icon='el-icon-plus' @click='handleDialog("add", "添加供应商")') 添加供应商
    .table
      el-table(:data='tableData' v-loading='loading' element-loading-text='拼命加载中' border)
        el-table-column(v-for='{prop, label, minWidth} in tableHead', :prop='prop', :label='label', :min-width='minWidth', :key='prop')
          template(slot-scope='scope')
            template(v-if='prop==="status"')
              el-tag(v-if='scope.row.status' type='success') 合作中
              el-tag(v-else type='danger') 已停用
            template(v-else) {{scope.row[prop]}}
        el-table-column(fixed='right' label='操作' min-width='150px')
          template(slot-scope='scope')
            el-button(size='mini' @click='handleDialog("edit", "编辑供应商", scope.row)') 编辑
            el-button(size='mini' @click='handleStatus(scope.row)')
              span(v-if='scope.row.status') 停用
              span(v-else) 启用
      el-pagination(@size-change='handleSizeChange' @current-change='handleCurrentChange', :current-page.sync='currentPage', :page-sizes='[10, 25, 50]', :page-size='currentSize' layout='sizes, prev, pager, next, total, jumper', :total='total')
    el-dialog(:title='title', :visible.sync='dialogVisible' width='500px')
      el-form(:model='form', v-if='dialogVisible', :rules='formRules' ref='form' label-width='110px')
        el-form-item(label='供应商名称' prop='name')
          el-input(placeholder='请输入供应商名称' type='text' v-model='form.name' maxlength='10' clearable)
        el-form-item(label='供应商代码' prop='code')
          el-input(placeholder='请输入供应商代码' type='text' v-model='form.code' maxlength='10' clearable)
      .dialog-footer(slot='footer')
        el-button(size='small' @click='cancel') 取消
        el-button(size='small' @click='handleSave(form)', :loading='submitting' type='primary', :disabled='submitting') 保存
</template>
<script>
  import Table from '@/mixins/table'
  import { getSuppliers, createSupplier, updateSupplier, updateStatus } from '@/api/supplier'
  export default {
    name: 'list',
    mixins: [Table],
    data() {
      return {
        request: {
          list: getSuppliers,
          add: createSupplier,
          update: updateSupplier,
          updateStatus: updateStatus
        },
        currentPage: 1,
        currentSize: 10,
        loading: false,
        total: 0,
        searchForm: {
          name: '',
          status: ''
        },
        statusArray: [
          {
            key: 1,
            value: '合作中'
          },
          {
            key: 0,
            value: '已停用'
          }
        ],
        tableHead: [
          { prop: 'name', label: '供应商名称', minWidth: '200px' },
          { prop: 'code', label: '供应商代码', minWidth: '150px' },
          { prop: 'createTime', label: '接入时间', minWidth: '200px' },
          { prop: 'status', label: '使用状态', minWidth: '160px' },
        ],
        form: {
          name: '',
          code: ''
        },
        formRules: {
          name: [
            { required: true, message: '请输入供应商名称', trigger: 'change' }
          ],
          code: [
            { required: true, message: '请输入供应商代码', trigger: 'change' },
            { pattern: /^[0-9a-zA-Z]+$/, message: '只能输入字母和数字', trigger: 'change' }
          ],
        }
      }
    },
    methods: {
      handleStatus(row) {
        const params = {
          id: row.id
        }
        let tag = ''
        if (row.status) {
          tag = `是否禁用名称为 ${row.name} 的供应商？`
          params.status = 0
        } else {
          tag = `是否启用名称为 ${row.name} 的供应商？`
          params.status = 1
        }
        this.toggleStatus(params, tag)
      }
    },
    created() {
      this.handleSearch()
    }
  }
</script>
<style lang='stylus' scoped>
  .container
    .el-form
      background #fff
      padding 20px 15px 0 15px
      box-shadow 1px 1px 3px #dedede
      .el-form-item
        display inline-block
        width 220px
        margin-right 10px
    .table
      padding 20px 15px 1px 15px
      background #fff
      margin-top 20px
      box-shadow -1px -1px 3px #eee
      .el-table
        font-size 13px
        >>>td,
        >>>th
          color #666
          padding 8px 0
    >>>.el-dialog
      .el-dialog__body
        padding 20px 20px 0 20px
        .el-form
          box-shadow none
          padding 0 15px 10px 15px
          .el-form-item
            display inline-block
            width 360px
            .el-input
              width 250px
            .el-select
              width 250px
              .el-input
                width 250px
</style>

