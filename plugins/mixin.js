/* 目前nuxt 版本如果不高于 1.0.0 并不支持vuex的方法，因此获取相对于的东西只能通过this.$store.state来获取
   如果nuxt框架为 1.0.0以上，vuex属性状态这里可以优化

*/
import BScroll from 'better-scroll'
import Vue from 'vue'
// import { mapState } from 'vuex'

Vue.mixin({
  computed: {
    user() {
      return this.$store.state.option.user
    },
    sortEnterprises () {
      if (this.user.data.enterprises) {
        let ens = this.user.data.enterprises.slice()
        if (ens && ens.length) {
          ens.sort(function (a, b) {
            return b.lastLoginTime - a.lastLoginTime
          })
        }
        return ens
      } else {
        return ''
      }
    },
    // 判断是否erp嵌入
    isInFrame () {
      if (this.$route.query.type === 'erp') {
        this.$store.commit('option/ADD_COOKIES', 'type=erp;')
        return true
      } else {
        let cookies = this.$store.state.option.cookies
        let cookieArr = cookies.split(';')
        let cookieObj = {}
        for (let i = 0; i < cookieArr.length; i++) {
          if (cookieArr[i].indexOf('=') > -1) {
            let tmpArr = cookieArr[i].split('=')
            cookieObj[tmpArr[0].trim()] = tmpArr[1].trim()
          }
        }
        return cookieObj.type === 'erp'
      }
    }
  },
  methods: {
    goLastPage: function () {
      window.history.back(-1)
    },
    preventTouchMove (e) {
      e.preventDefault()
    },
    stopPropagation: function (e) {
      if (e) {
        e.stopPropagation()
      }
    },
    _initscroll() {
      if (!this.initSctoll) {
        this.initSctoll = new BScroll(this.$refs.mobileModalBox, {
          click: true
        })
      } else {
        this.initSctoll.refresh()
      }
    }
  }
})
