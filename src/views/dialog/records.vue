	<template lang='jade'>
	.container
		el-dialog(title='查询记录', :visible.sync='visible' @close='closeDialog' v-if='showRecords' @opened='openDialog')
			el-form(label-position='top')
				el-form-item(style='width:120px;')
					el-input(v-model='searchForm.detailId' type='text' placeholder='查询编号' clearable)
				el-form-item(style='width:150px;')
					el-input(v-model='searchForm.productCode' type='text' placeholder='产品代码' clearable)
				el-form-item(style='width:200px;')
					el-input(v-model='searchForm.productName' type='text' placeholder='产品名称' clearable)
				el-form-item(style='width:20%;')
					el-select(v-model='searchForm.status' placeholder='调取状态' clearable)
						el-option(label='成功', :value='0')
						el-option(label='失败', :value='-1')
				el-form-item(style='width:20%;')
					el-select(v-model='searchForm.prescription' placeholder='时效要求' clearable)
						//- el-option(label='标准' value='0')
						el-option(label='更新' value='1')
						el-option(label='存量' value='2')
				el-form-item(style='vertical-align:top;')
					el-date-picker(type='datetimerange' range-separator='至' start-placeholder='开始日期' end-placeholder='结束日期' format='yyyy-MM-dd HH:mm' v-model='searchTime')
				el-form-item
					el-button(type='primary' size='small' icon='el-icon-search' @click='searchList') 查询
				el-form-item(style='display:inline-flex;vertical-align:top;')
					el-button(type='primary' size='small', icon='el-icon-download', :loading='exportting' @click='exportRes') 导出筛选结果
			el-table(:data='tableData' v-loading='loading' element-loading-text='拼命加载中' border)
				el-table-column(v-for='{prop, label, minWidth} in tableHead', :prop='prop', :label='label', :min-width='minWidth', :key='prop')
					template(slot-scope='scope')
						template(v-if='prop==="status"') {{scope.row[prop] | fixTaskStatus}}
						template(v-else-if='prop==="prescription"') {{scope.row[prop] | fixPrescription}}
						template(v-else-if='prop==="requestParamter"')
							span(v-html="scope.row[prop].replace('手机号', '<br>手机号').replace('姓名', '<br>姓名')")
						template(v-else) {{scope.row[prop]}}
			el-pagination(@size-change='handleSizeChange' @current-change='handleCurrentChange', :current-page='currentPage', :page-sizes='[10, 25, 50]', :page-size='currentSize' layout='sizes, prev, pager, next, total', :total='total')
	</template>
	<script>
		import { getRecords, exportReport } from '@/api/dataSearch'
		import filters from '@/filters'
		export default {
			filters: filters,
			props: {
				showRecords: {
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
					visible: this.showRecords,
					searchTime: ['', ''],
					searchForm: {
						batchId: '',
						detailId: '',
						productName: '',
						status: '',
						prescription: '',
						startTime: '',
						endTime: '',
						pageNum: 1,
						pageSize: 10,
					},
					loading: false,
					total: 0,
					currentPage: 1,
					currentSize: 10,
					tableHead: [
						{ prop: 'id', label: '查询编号', minWidth: '100px' },
						{ prop: 'dataId', label: '数据编号', minWidth: '100px' },
						{ prop: 'productNameCode', label: '产品名称 | 产品代码', minWidth: '230px' },
						{ prop: 'requestParamter', label: '查询要件', minWidth: '230px' },
						{ prop: 'prescription', label: '实际时效', minWidth: '100px' },
						{ prop: 'status', label: '调取状态', minWidth: '100px' },
						{ prop: 'errorMsg', label: '失败原因', minWidth: '120px' },
						{ prop: 'updateTime', label: '调取时间', minWidth: '180px' }
					],
					tableData: [],
					exportting: false
				}
			},
			methods: {
				init() {
					this.searchTime = ['', '']
					this.searchForm = {
						batchId: '',
						detailId: '',
						productName: '',
						status: '',
						prescription: '',
						startTime: '',
						endTime: '',
						pageNum: 1,
						pageSize: 10,
					}
					this.loading = false
					this.total = 0
					this.currentPage = 1,
					this.currentSize = 10
					this.tableData = []
					this.exportting = false
				},
				openDialog() {
					this.getRecordsDetail()
				},
	 			closeDialog() {
	 				this.init()
					this.$emit('update:showRecords', false)
				},
				searchList() {
					this.searchForm.pageNum = 1
					this.searchForm.pageSize = 10
					this.getRecordsDetail()
				},
				getRecordsDetail() {
					this.tableData = []
					this.loading = true
					this.searchForm .batchId = this.batchId
					if(!this.searchTime) {
						this.searchTime = ['', '']
					}
					this.searchForm.startTime = filters.fixTimeStamp(new Date(this.searchTime[0]).getTime()) + (this.searchTime[0] ? ':00' : '')
					this.searchForm.endTime = filters.fixTimeStamp(new Date(this.searchTime[1]).getTime()) + (this.searchTime[1] ? ':00' : '')
					this.searchForm.pageNum = this.currentPage
					this.searchForm.pageSize = this.currentSize
					getRecords(this.searchForm)
						.then((res) => {
							this.loading = false
							this.total = res.data.total
							this.tableData = res.data.list
						})
						.catch((error) => {
							this.loading = false
							console.log('getRecords failed:::', error)
						})
				},
				handleSizeChange(currentSize) {
					this.currentSize = currentSize
					this.getRecordsDetail()
				},
				handleCurrentChange(currentPage) {
					this.currentPage = currentPage
					this.getRecordsDetail()
				},
				exportRes() {
					var params = {}
					for (let key in this.searchForm) {
						if (!['pageSize', 'pageNum'].includes(key)) {
							params[key] = this.searchForm[key]
						}
					}
					this.exportting = true
					this.$axios({
						method: 'post',
						url: '/openapi/v1.1/exportExcel',
						params,
						responseType: 'blob'
					}).then(response => {
						let url = window.URL.createObjectURL(new Blob([response.data]))
						let link = document.createElement('a')
						link.style.display = 'none'
						link.href = url
						link.setAttribute('download', decodeURI(response.headers['content-disposition'].split('attachment;filename=')[1]))
						document.body.appendChild(link)
						link.click()
						this.exportting = false
					}).catch((error) => {
						this.exportting = false
						console.log('export failed:::', error)
					})
				}
			},
			watch: {
				showRecords() {
					this.visible = this.showRecords
				}
			},
			created() {
				this.init()
			}
		}
	</script>
	<style lang='stylus' scoped>
	.container
		>>>.el-dialog
			margin-top 10vh !important
			width 75%
			max-width 960px
			.el-dialog__body
				padding 5px 20px
				table
					border none
					tr
						th
							padding 5px 10px
				.el-form
					margin-bottom 20px
					padding 10px
					padding-top 20px
					border 1px solid #eee
					background #fafafa
					.el-form-item
						margin 0 10px 15px 0
						display inline-block
						.el-input
							width 100%
						.el-input__inner:focus
							border-color #67C23A
						.el-button
							padding 11px 15px
							font-size 14px
	</style>