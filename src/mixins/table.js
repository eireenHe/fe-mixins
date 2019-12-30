export default {
	data() {
		return {
			loading: false,
			submitting: false,
			stopLoading: false,
			dialogVisible: false,
			currentType: '',
			currentEntity: {},
			total: 0,
			currentPage: 1,
			currentSize: 15,
			tableData: [],
			title: '',
		};
	},
	methods: {
		handleSelectionChange(val) {
			this.ids = [];
			val.forEach((value) => {
				this.ids.push(value.id)
			})
		},
		handleSizeChange(currentSize) {
			this.currentSize = currentSize
			this.getList()
		},
		handleCurrentChange(currentPage) {
			this.currentPage = currentPage
			this.getList()
		},
		handleSearch() {
			this.getList()
		},
		handleDialog(type, title, row) {
			this.currentType = type
			this.title = title
			this.dialogVisible = true
			if (type !== 'add') {
				for (let key in row) {
					for (let fk in this.form) {
						if (fk === key) {
							this.form[fk] = row[key]
						}
					}
					// 特别处理
					this.form['id'] = row.id
					if (['spuId', 'businessPhase', 'channel'].includes(key)) {
						this.form[key] = [row[key]]
					}
				}
			} else {
				for (let fk in this.form) {
					this.form[fk] = ''
				}
			}
		},
		cancel() {
			this.dialogVisible = false
		},
		handleSave(params) {
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.submitting = true
					if (this.currentType !== 'edit') {
						this.request.add(params)
							.then(() => {
								this.submitting = false
								this.dialogVisible = false
								this.getList()
							})
							.catch((error) => {
								this.submitting = false
								console.log(error)
								console.log('handleSave failed')
							})
					} else {
						this.request.update(this.form)
							.then(() => {
								this.submitting = false
								this.dialogVisible = false
								this.getList()
							})
							.catch((error) => {
								this.submitting = false
								console.log(error)
								console.log('handleSave failed')
							})
					}
				}
			});
		},
		getList() {
			this.loading = true
			this.searchForm.pageNum = this.currentPage
			this.searchForm.pageSize = this.currentSize
			this.request.list(this.searchForm)
				.then((res) => {
					this.loading = false
					this.tableData = res.data.list
					this.total = res.data.total
				})
				.catch((error) => {
					this.loading = false
					console.log(error)
					console.log('getList failed')
				})
		},
		handleDelete(row, title) {
			this.$confirm(title, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				let params = {}
				if (row.id) {
					this.currentEntity = row
					this.stopLoading = true
					params.id = row.id
				} else {
					params.ids = []
					row.routeInfos.forEach((item, index) => {
						params.ids.push(item.id)
					})
				}
				this.del(params)
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				})
			})
		},
		del(params) {
			this.request.del(params)
				.then(() => {
					this.stopLoading = false
					this.getList()
				})
				.catch((error) => {
					this.stopLoading = false
					console.log(error)
					console.log('deleteCommon failed')
				})
		},
		toggleStatus(params, tag) {
			this.$confirm(tag, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.request.updateStatus(params)
					.then((res) => {
						this.$message({
							type: 'success',
							message: '状态更新成功!'
						});
						this.currentPage = 1
						this.getList()
					})
					.catch(() => {
						console.log('updateSwitch failed')
					})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消更新'
				});
			})
		},
		handleReset(formName) {
			this.$refs[formName].resetFields();
			this.getList()
		}
	}
}
