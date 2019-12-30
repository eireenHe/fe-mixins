<template lang='jade'>
.container
	el-dialog(:title='currentStep==="one"?"编辑批量查询任务":"确认批量查询任务"', :visible.sync='visible' @close='closeDialog' @opened='openDialog' v-if='showEdit', :show-close='false', :close-on-click-modal	='false', :close-on-press-escape='false')
		el-form(v-if='currentStep==="one"' label-position='top', :model='editForm', :rules='rules' ref='editForm')
			el-form-item(label='选择需要查询的数据产品（最多选10个）' prop='productNameCodes')
				el-select(placeholder='供应商 | 产品名称 | 产品代码' v-model='editForm.productNameCodes' multiple :multiple-limit='10' filterable :filter-method='productFilter')
					el-option(v-for='{ supplierWithProductNameCode, productId } of filterProducts', :label='supplierWithProductNameCode', :value='productId', :key='productId')
			el-form-item(label='需提供的查询要件')
				table.expendTable
					tr
						th 必需查询要件
						th 非必需查询要件
					tr
						td(v-for='item in conditions', :key='item.necessary') {{item.queryParameters}}
			el-form-item(label='模板文件（至少选择一个数据产品）')
				el-button(type='primary' size='mini' style='display:inherit;', :loading='downloading', :disabled='!editForm.productNameCodes.length' @click='downloadTemplate') 下载
			el-form-item(label='上传填写完成的模板文件（新建时必选）' prop='fileList')
				el-upload.upload-demo(ref='upload', :limit='1', :file-list='editForm.fileList', :auto-upload='false' action='/openapi/v1.1/importExcel', :data='editRealParams' accept='.xls,.xlsx', :on-success='uploadSuccess', :on-error='uploadError')
					el-button(type='primary' size='mini' slot='trigger' style='margin-top:-7px;') 选择文件
			el-form-item(label='时效要求' prop='prescription')
				el-radio(:label='0' v-model='editForm.prescription') 标准
				el-radio(:label='1' v-model='editForm.prescription') 更新
		el-form.demo-table-expand(v-else label-position='top')
			el-form-item(style='font-weight:700;')
				li
					span 批次号：
					span {{taskInfo.batchId}}
			el-form-item(label='已选择数据产品')
				span {{taskInfo.productNameCodes}}
			el-form-item(label='任务记录数')
				li
					span 有效记录：
					span {{taskInfo.effectiveRecord}}
				li
					span 异常记录：
					span {{taskInfo.abnormalRecord}}
		span.dialog-footer(v-if='currentStep==="one"' slot='footer')
			el-button(@click='closeDialog', :disabled='submitting || saving') 取消
			el-button(type='primary', :disabled='loadParams || submitting', :loading='saving' @click='submitSave') 保存
			el-button(type='primary', :disabled='loadParams || saving', :loading='submitting' @click='submitEdit') 提交任务
		span.dialog-footer(v-else slot='footer')
			el-button(@click='currentStep="one"', :disabled='submitting') 取消
			el-button(type='primary', :loading='submitting' @click='confirm') 确定
</template>
<script>
	import { getProducts, getProductsParameters, executeTasks, getBatchInfo, saveBatchTask } from '@/api/dataSearch'
	import { Notification } from 'element-ui'
	export default {
		props: {
			showEdit: {
				type: Boolean,
				default: false
			},
			batchId: {
				type: Number,
				default: ''
			}
		},
		data() {
			return {
				visible: this.showEdit,
				currentStep: 'one',
				searching: false,
				products: [],
				filterProducts: [],
				editForm: {
					batchId: '',
					productNameCodes: [],
					fileList: [],
					prescription: '',
					userName: localStorage.getItem('u') && JSON.parse(localStorage.getItem('u')).username
				},
				editRealParams: {},
				rules: {
					productNameCodes: [{ required: true, message: '请选择数据产品', trigger: 'change' }],
					prescription: [{ required: true, message: '请选择时效', trigger: 'change' }]
				},
				conditions: [],
				downloading: false,
				submitting: false,
				taskInfo: '',
				loadParams: true,
				saving: false
			}
		},
		methods: {
			openDialog() {
				this.getProductsData()
			},
			closeDialog() {
				this.loadParams = true
				this.$emit('update:showEdit', false)
			},
			getFormParams() {
				this.loadParams = true
				this.editForm = {
					batchId: '',
					productNameCodes: [],
					fileList: [],
					prescription: '',
					userName: localStorage.getItem('u') && JSON.parse(localStorage.getItem('u')).username
				},
				getBatchInfo({ 'batchId': this.batchId })
					.then((res) => {
						this.loadParams = false
						this.editForm.productNameCodes = res.data.productIdList
						this.editForm.prescription = res.data.prescription
					})
					.catch((error) => {
						this.loadParams = false
						console.log('getFormParams failed:::', error)
					})
			},
			getProductsData(value) {
				this.searching = true
				getProducts({ 'productName': '' })
					.then((res => {
						this.products = res.data
						this.filterProducts = res.data
						this.searching = false
						this.getFormParams()
					}))
					.catch((error) => {
						this.searching = false
						console.log('getProducts failed:::', error)
					})
			},
			productFilter(val) {
				if (val) {
					this.filterProducts = []
					for (let item of this.products) {
						if (item.supplierWithProductNameCode.includes(val)) {
							this.filterProducts.push(item)
						}
					}
				} else {
					this.filterProducts = this.products
				}
			},
			getProductsParams() {
				this.conditions = []
				if (!this.editForm.productNameCodes.length) {
					return false
				}
				getProductsParameters(this.editForm.productNameCodes)
					.then((res) => {
						if (res.data.length) {
							this.conditions = res.data
						}
					})
					.catch((error) => {
						console.log('getProductsParameters failed:::', error)
					})
			},
			downloadTemplate() {
				this.downloading = true
				this.$axios({
					method: 'post',
					url: '/openapi/v1.1/exportExcelTemplate',
					data: this.editForm.productNameCodes,
					responseType: 'blob'
				}).then(response => {
					let url = window.URL.createObjectURL(new Blob([response.data]))
					let link = document.createElement('a')
					link.style.display = 'none'
					link.href = url
					link.setAttribute('download', decodeURI(response.headers['content-disposition'].split('attachment;filename=')[1]))
					document.body.appendChild(link)
					link.click()
					this.downloading = false
				}).catch((error) => {
					this.downloading = false
					console.log('export failed:::', error)
				})
			},
			submitEdit() {
				this.editForm.fileList = this.$refs.upload.uploadFiles
				this.submitting = true
				let productNameCodes = ''
				for (let code of this.editForm.productNameCodes) {
					for (let item of this.products) {
						if (item.productId === code) {
							productNameCodes += item.productNameCode + ';'
						}
					}
				}
				for (let i in this.editForm) {
					if (i === 'productNameCodes') {
						this.editRealParams[i] = productNameCodes
					} else {
						if (i != 'fileList') {
							this.editRealParams[i] = this.editForm[i]
						}
					}
				}
				this.editRealParams.batchId = this.batchId
				// 新建必须选择文件
				if (!this.editRealParams.file) {
					this.$refs['editForm'].rules.fileList = [{ required: true, message: '请上传文件', trigger: 'blur' }]
				}
				this.$refs['editForm'].validate((valid) => {
					if (valid) {
						this.$refs.upload.submit()
					} else {
						console.log('error submit!!')
						this.submitting = false
						return false
					}
				})
			},
			uploadSuccess(response) {
				this.submitting = false
				if (response.code === 0) {
					this.editForm.fileList = []
					this.$refs.upload.uploadFiles = []
					this.currentStep = 'two'
					this.taskInfo = response.data
				} else {
					Notification({
						message: response.message,
						type: 'error',
						title: '错误'
					})
				}
			},
			uploadError() {},
			submitSave() {
				this.$refs['editForm'].rules.fileList = []
				this.$refs['editForm'].validate((valid) => {
					if (valid) {
						this.saving = true
						let productNameCodes = ''
						for (let code of this.editForm.productNameCodes) {
							for (let item of this.products) {
								if (item.productId === code) {
									productNameCodes += item.productNameCode + ';'
								}
							}
						}
						let params = {
							batchId: this.batchId,
							prescription: this.editForm.prescription,
							productNameCode: productNameCodes,
							userName: localStorage.getItem('u') && JSON.parse(localStorage.getItem('u')).username
						}
						saveBatchTask(params)
							.then((res) => {
								this.currentStep = 'one'
								this.saving = false
								this.$emit('editSuccess')
							})
							.catch(() => {
								this.saving = false
								console.log('saveBatchTask failed')
							})
					} else {
						console.log('error save!!')
						return false
					}
				})
			},
			confirm() {
				// this.submitting = true
				this.$emit('editSuccess')
				this.currentStep = 'one'
				var params = {
					batchId: this.taskInfo.batchId,
					userName: localStorage.getItem('u') && JSON.parse(localStorage.getItem('u')).username
				}
				executeTasks(params)
					.then((res) => {
						// this.currentStep = 'one'
						// this.submitting = false
						this.$emit('editSuccess')
					})
					.catch((error) => {
						// this.submitting = false
						console.log('executeTasks failed:::', error)
					})
			}
		},
		watch: {
			showEdit() {
				this.visible = this.showEdit
			},
			'editForm.productNameCodes'() {
				this.getProductsParams()
			}
		}
	}
</script>
<style lang='stylus' scoped>
.container
	>>>.el-dialog
		margin-top 10vh !important
		.el-dialog__body
			padding 5px 20px
			.el-form-item
				margin-bottom 30px
				&:last-child
					margin-bottom 0
				.el-upload
					display inline-block
				.el-upload-list
					vertical-align bottom
					display inline-block
					width auto
					margin-left 10px
				.el-upload-list__item
					margin-top 0
			.el-form-item__label
				padding 0
				line-height 30px
			.el-form-item__content
				line-height 30px
			table
				border 1px solid #DCDFE6
				text-align left
				tr
					th
						background #f2f2f2
						padding 0 10px
						color #666
						border-bottom 1px solid #DCDFE6
						&:first-child
							border-right 1px solid #DCDFE6
					td
						width auto
						padding 10px
						line-height 20px
						&:first-child
							border-right 1px solid #DCDFE6
		.el-select
			width 100%
			.el-input
				width 100%
		.demo-table-expand
			.el-form-item
				margin-top 20px
			li
				list-style none
</style>