// 取消 全局注册 过于方法的原因是因为，有可能在调用该方法时候，过滤器未注册，导致页面会有一定时间内展示时间戳
import Vue from 'vue'

const filters = {
  date: (date) => {
    if (date) {
      const d = new Date(Number(date))
      const year = d.getFullYear()
      const monthTemp = d.getMonth() + 1
      const month = monthTemp < 10 ? '0' + monthTemp : '' + monthTemp
      const day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate() + ' '
      return year + '-' + month + '-' + day
    } else {
      return '-'
    }
  }
}

for (let key in filters) {
  Vue.filter(key, filters[key])
}
