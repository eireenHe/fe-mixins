<template lang='jade'>
    .container
        el-button(type='success' icon='el-icon-plus' @click='handleProductType("add", "添加征信产品类型")') 添加征信产品类型
        .table
            el-table(:data='tableData' v-loading='loading' element-loading-text='拼命加载中' border)
                el-table-column(v-for='{prop, label, minWidth} in tableHead', :prop='prop', :label='label', :min-width='minWidth', :key='prop')
                    template(slot-scope='scope')
                        template(v-if='prop==="status"')
                            el-tag(v-if='scope.row.status' type='success') 合作中
                            el-tag(v-else type='danger') 已停用
                        template(v-else) {{scope.row[prop]}}
                el-table-column(fixed='right' label='操作' min-width='160px')
                    template(slot-scope='scope')
                        el-button(size='mini' @click='handleProductType("edit", "编辑征信产品类型", scope.row)') 编辑
                        el-button(size='mini' @click='handleDelete(scope.row, "是否删除该产品类型？")', :loading="scope.row.id === currentEntity.id && stopLoading") 删除
            el-pagination(@size-change='handleSizeChange' @current-change='handleCurrentChange', :current-page.sync='currentPage', :page-sizes='[10, 25, 50]', :page-size='currentSize' layout='sizes, prev, pager, next, total, jumper', :total='total')
        el-dialog(:title='title', :visible.sync='dialogVisible' width='500px')
            el-form(v-if='dialogVisible', :model='form', :rules='formRules' ref='form' label-width='110px')
                el-form-item(label='产品类型层级' prop='level')
                    el-select(v-model='form.level' placeholder='请输入产品类型层级', :disabled='title==="编辑征信产品类型"' clearable)
                        el-option(v-for='(item, index) of levelArray', :label='item', :value='item', :key='index')
                el-form-item(v-if='form.level === "次要类型"' label='上级产品类型' prop='parentId')
                    el-select(v-model='form.parentId' placeholder='请输入上级产品类型' @change='handleLevel' clearable)
                        el-option(v-for='(item, index) of mainTypeArray', :label='item.name', :value='item.id', :key='index')
                el-form-item(label='产品类型名称' prop='name')
                    el-input(placeholder='请输入产品类型名称' type='text' v-model='form.name' maxlength='10' clearable)
                el-form-item(label='英文简称' prop='egShortName')
                    el-input(placeholder='请输入英文简称' type='text' v-model='form.egShortName' maxlength='5' clearable)
                el-form-item(label='英文全称' prop='egFullName')
                    el-input(placeholder='请输入英文全称' type='text' v-model='form.egFullName' maxlength='30' clearable)
                el-form-item(label='备注' prop='desc')
                    el-input(placeholder='请输入备注信息' type='textarea' v-model='form.desc' maxlength='50')
            .dialog-footer(slot='footer')
                el-button(size='small' @click='cancel') 取消
                el-button(size='small' @click='handleSave(form)', :loading='submitting' type='primary', :disabled='submitting') 保存
</template>
<script>
    import Common from '@/mixins/common'
    import Table from '@/mixins/table'
    import { getProductTypes, createProductType, updateProductType, deleteProductType } from '@/api/productType'
    import { getMainTypes } from '@/api/public'
    import filters from '@/filters'
    export default {
        name: 'list',
        mixins: [Common, Table],
        filters: filters,
        data() {
            return {
                request: {
                    list: getProductTypes,
                    add: createProductType,
                    update: updateProductType,
                    del: deleteProductType,
                    getMainTypes: getMainTypes
                },
                currentPage: 1,
                currentSize: 10,
                loading: false,
                total: 0,
                searchForm: {
                    name: '',
                    status: ''
                },
                levelArray: ['主要类型', '次要类型'],
                parentIdArray: [],
                tableHead: [
                    { prop: 'name', label: '类型名称', minWidth: '150px' },
                    { prop: 'level', label: '产品类型层级', minWidth: '150px' },
                    { prop: 'egShortName', label: '英文简称', minWidth: '120px' },
                    { prop: 'egFullName', label: '英文全称', minWidth: '200px' },
                    { prop: 'parentName', label: '上级产品类型名称', minWidth: '200px' },
                    { prop: 'desc', label: '备注', minWidth: '230px' },
                ],
                form: {
                    level: '',
                    parentId: '',
                    parentName: '',
                    name: '',
                    egShortName: '',
                    egFullName: '',
                    desc: ''
                },
                formRules: {
                    form: {},
                    level: [
                        { required: true, message: '请输入产品类型层级', trigger: 'change' }
                    ],
                    parentId: [
                        { required: true, message: '请输入上级产品类型', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '请输入产品类型名称', trigger: 'change' }
                    ],
                    egShortName: [
                        { required: true, message: '请输入英文简称', trigger: 'change' },
                        { pattern: /^[0-9a-zA-Z]+$/, message: '只能输入字母和数字', trigger: 'change' }
                    ],
                    egFullName: [
                        { required: true, message: '请输入英文全称', trigger: 'change' },
                        { pattern: /^[0-9a-zA-Z]+$/, message: '只能输入字母和数字', trigger: 'change' }
                    ],
                }
            }
        },
        methods: {
            handleProductType(type, title, row) {
                this.getMainTypesArray()
                this.handleDialog(type, title, row)
            },
            handleLevel() {
                let obj = {};
                obj = this.mainTypeArray.find((item)=>{
                    return item.id === this.form.parentId;
                });
                obj && (this.form.parentName = obj.name)
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
