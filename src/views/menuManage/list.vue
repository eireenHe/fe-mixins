<template lang='jade'>
  .content
    el-tree.menuTree(ref='tree', :data='nodeData', :default-expand-all='true', :expand-on-click-node='false', :props='defaultProps' @node-contextmenu='showContextmenu')
      span.custom-tree-node(slot-scope='{ node, data }')
        span {{node.label}}
        span
          //- i.fa.fa-plus(@click='addNode(node, data)')
          i.fa.fa-pencil-square-o(@click='editNode(node, data)')
          i.fa.fa-trash(@click='deleteNode(node, data)')
    v-contextmenu(ref='contextmenu')
      v-contextmenu-item(@click='addNode("child")') 添加子节点
      v-contextmenu-item(@click='addNode("up")') 添加上方节点
      v-contextmenu-item(@click='addNode("down")') 添加下方节点
    el-dialog(title='编辑节点', :visible.sync='showEidtDialog')
      el-form.demo-ruleForm(:model='editForm', :rules='rules' ref='editForm' label-width='100px')
          el-form-item(label='菜单名字' prop='label')
            el-input(type='text' v-model='editForm.label')
          el-form-item(style='text-align:right;margin-bottom:0;')
            el-button(size='small' @click='showEidtDialog=false') 取消
            el-button(size='small' type='primary', :loading='submitting') 保存
</template>
<script>
import { getMenuNode } from '@/api/menuManage'
export default {
  data() {
    return {
      nodeData: [
        {
          label: '首页'
        },
        {
          label: '配置中心',
          children: [
            {
              label: '业务流程管理'
            },
            {
              label: '规则包管理'
            },
            {
              label: '接口管理'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      curentNode: {},
      showEidtDialog: false,
      editForm: {
        label: ''
      },
      rules: {
        label: [{ required: true, message: '请输入菜单名字', trigger: 'blur' }]
      },
      submitting: false
    }
  },
  methods: {
    showContextmenu(event, value, node, element) {
      this.$refs.contextmenu.show({
        top: event.clientY,
        left: event.clientX
      })
      this.curentNode = node
    },
    addNode(type) {
      console.log(this.curentNode)
      console.log(type)
    },
    editNode(node, data) {
      this.showEidtDialog = true
      this.editForm.label = node.data.label
    },
    deleteNode() {
      this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  created() {
    getMenuNode()
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log('get menu node failed:::', error)
      })
  }
}
</script>
<style lang='stylus'>
.content
  background #fff
  padding 20px 30px
  min-height calc(100vh - 100px)
  .menuTree
    font-size 14px
    .fa
      margin-left 5px
      font-size 14px
    .fa-plus, .fa-pencil-square-o
      color #409eff
    // .fa-pencil-square-o
    //   color #67c23a
    .fa-trash
      color #f56c6c
</style>