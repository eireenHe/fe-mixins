<template lang='jade'>
.container
	el-dialog(:title='currentStep==="one"?"新建批量查询任务":"确认批量查询任务"', :visible.sync='visible' @close='closeDialog' @opened='beforeOpen' v-if='showNew', :show-close='false', :close-on-click-modal	='false', :close-on-press-escape='false')
		el-form(v-if='currentStep==="one"' label-position='top', :model='newForm', :rules='rules' ref='newForm')
			el-form-item(label='选择需要查询的数据产品（最多选10个）' prop='productNameCodes')
				//- 远程搜索
				//- el-select(placeholder='供应商 | 产品名称 | 产品代码' v-model='newForm.productNameCodes', :loading='searching' filterable multiple remote :reserve-keyword='true', :remote-method='getProductsData')
				//- 	el-option(v-for='item in products', :label='item.supplierWithProductNameCode', :value='item.productId', :key='item.productId')
				el-select(placeholder='供应商 | 产品名称 | 产品代码' v-model='newForm.productNameCodes' multiple, :multiple-limit='10' filterable :filter-method='productFilter')
					el-option(v-for='{ supplierWithProductNameCode, productId } of filterProducts', :label='supplierWithProductNameCode', :value='productId', :key='productId')
			el-form-item(label='需提供的查询要件')
				table.expendTable
					tr
						th 必需查询要件
						th 非必需查询要件
					tr
						td(v-for='item in conditions', :key='item.necessary') {{item.queryParameters}}
			el-form-item(label='模板文件（至少选择一个数据产品）')
				el-button(type='primary' size='mini' style='display:inherit;', :loading='downloading', :disabled='!newForm.productNameCodes.length' @click='downloadTemplate') 下载
			el-form-item(label='上传填写完成的模板文件（新建时必选）' prop='fileList')
				el-upload.upload-demo(ref='upload', :limit='1', :file-list='newForm.fileList', :auto-upload='false' action='/openapi/v1.1/importExcel', :data='newRealParams' accept='.xls,.xlsx', :on-success='uploadSuccess', :on-error='uploadError')
					el-button(type='primary' size='mini' slot='trigger' style='margin-top:-7px;') 选择文件
			el-form-item(label='时效要求' prop='prescription')
				el-radio(label='0' v-model='newForm.prescription') 标准
				el-radio(label='1' v-model='newForm.prescription') 更新
		el-form.demo-table-expand(v-else label-position='top')
			el-form-item
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
			el-button(type='primary', :disabled='submitting', :loading='saving' @click='submitSave') 保存
			el-button(type='primary',:disabled='saving', :loading='submitting' @click='submitNew') 新建批量查询任务
		span.dialog-footer(v-else slot='footer')
			el-button(@click='cancelExcute', :disabled='submitting') 取消
			el-button(type='primary', :loading='submitting' @click='confirm') 确定
</template>
<script>
	import { getProducts, getProductsParameters, executeTasks, saveBatchTask } from '@/api/dataSearch'
	import { Notification } from 'element-ui'
	export default {
		props: {
			showNew: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				visible: this.showNew,
				currentStep: 'one',
				searching: false,
				products: [],
				filterProducts: [],
				newForm: {
					productNameCodes: [],
					fileList: [],
					prescription: '',
					userName: localStorage.getItem('u') && JSON.parse(localStorage.getItem('u')).username
				},
				newRealParams: {},
				rules: {
					productNameCodes: [{ required: true, message: '请选择数据产品', trigger: 'change' }],
					prescription: [{ required: true, message: '请选择时效', trigger: 'change' }]
				},
				conditions: [],
				downloading: false,
				submitting: false,
				taskInfo: '',
				saving: false
			}
		},
		methods: {
			closeDialog() {
				this.reset()
				this.$refs['newForm'].resetFields()
				this.$emit('update:showNew', false)
			},
			beforeOpen() {
				this.reset()
				this.$refs['newForm'].resetFields()
			},
			getProductsData(value) {
				this.searching = true
				getProducts({ 'productName': '' })
					.then((res => {
						this.products = res.data
						this.filterProducts = res.data
						this.searching = false
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
				if (!this.newForm.productNameCodes.length) {
					return false
				}
				getProductsParameters(this.newForm.productNameCodes)
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
					data: this.newForm.productNameCodes,
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
			submitNew() {
				this.newForm.fileList = this.$refs.upload.uploadFiles
				this.submitting = true
				let productNameCodes = ''
				for (let code of this.newForm.productNameCodes) {
					for (let item of this.products) {
						if (item.productId === code) {
							productNameCodes += item.productNameCode + ';'
						}
					}
				}
				for (let i in this.newForm) {
					if (i === 'productNameCodes') {
						this.newRealParams[i] = productNameCodes
					} else {
						if (i != 'fileList') {
							this.newRealParams[i] = this.newForm[i]
						}
					}
				}
				if (this.taskInfo && this.taskInfo.batchId) {
					this.newRealParams.batchId = this.taskInfo.batchId
				}
				// 新建必须选择文件
				if (!this.newRealParams.file) {
					this.$refs['newForm'].rules.fileList = [{ required: true, message: '请上传文件', trigger: 'blur' }]
				}
				this.$refs['newForm'].validate((valid) => {
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
					this.newForm.fileList = []
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
				this.$refs['newForm'].rules.fileList = []
				this.$refs['newForm'].validate((valid) => {
					if (valid) {
						this.saving = true
						let productNameCodes = ''
						for (let code of this.newForm.productNameCodes) {
							for (let item of this.products) {
								if (item.productId === code) {
									productNameCodes += item.productNameCode + ';'
								}
							}
						}
						let params = {
							batchId: this.taskInfo.batchId,
							prescription: Number(this.newForm.prescription),
							productNameCode: productNameCodes,
							userName: localStorage.getItem('u') && JSON.parse(localStorage.getItem('u')).username
						} 
						saveBatchTask(params)
							.then((res) => {
								this.currentStep = 'one'
								this.saving = false
								this.$refs['newForm'].resetFields()
								this.reset()
								this.$emit('newSuccess')
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
				this.$emit('newSuccess')
				this.currentStep = 'one'
				var params = {
					batchId: this.taskInfo.batchId,
					userName: localStorage.getItem('u') && JSON.parse(localStorage.getItem('u')).username
				}
				executeTasks(params)
					.then((res => {
						// this.currentStep = 'one'
						// this.submitting = false
						this.$emit('newSuccess')
					}))
					.catch((error) => {
						// this.submitting = false
						console.log('executeTasks failed:::', error)
					})
			},
			cancelExcute() {
				this.currentStep = 'one'
				this.taskInfo = ''
			},
			reset() {
				this.currentStep = 'one'
				this.newForm = {
					productNameCodes: [],
					fileList: [],
					prescription: '',
					userName: localStorage.getItem('u') && JSON.parse(localStorage.getItem('u')).username
				}
				this.taskInfo = ''
				this.newRealParams = {}
			}
		},
		watch: {
			showNew() {
				this.visible = this.showNew
			},
			'newForm.productNameCodes'() {
				this.getProductsParams()
			}
		},
		created() {
			this.reset()
			this.getProductsData()
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