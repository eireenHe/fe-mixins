var filters = {
  fixTimeStamp(date) {
    if (!date) {
      return ''
    }
    var time = new Date(date)
    var YYYY = time.getFullYear()
    var MM = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1)
    var DD = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
    var HH = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
    var mm = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
    return YYYY + '-' + MM + '-' + DD + ' ' + HH + ':' + mm
  },
  fixStatus(code) {
    var codeMap = {
      0: '待执行',
      1: '进行中',
      2: '已完成'
    }
    return codeMap[code] || code
  },
  fixTaskStatus(code) {
    var codeMap = {
      0: '成功',
      '-1': '失败'
    }
    return codeMap[code] || code
  },
  fixPrescription(code) {
    var codeMap = {
      0: '标准',
      1: '更新',
      2: '存量'
    }
    return codeMap[code] || code
  },
  fixUnit(code) {
    var codeMap = {
      1: '分钟',
      2: '小时',
      3: '天',
      4: '月',
      5: '年'
    }
    return codeMap[code] || code
  },
  fixCategory(num) {
    var numMap = {
      1: '自然人',
      2: '车辆',
      3: '设备',
      4: '驾驶证',
      5: '影像件',
      6: '业务信息'
    }
    return numMap[num] || code
  }
}
export default filters
