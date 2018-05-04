/* 目前nuxt 版本如果不高于 1.0.0 并不支持vuex的方法，因此获取相对于的东西只能通过this.$store.state来获取
   如果nuxt框架为 1.0.0以上，vuex属性状态这里可以优化

*/
import Vue from 'vue'
// import { mapState } from 'vuex'

Vue.mixin({
  computed: {
    user() {
      return this.$store.state.option.user
    }
  }
})
