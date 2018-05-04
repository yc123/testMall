import Vue from 'vue'
import { Message, Breadcrumb, BreadcrumbItem, Tree, Pagination, Upload, Dialog, DatePicker } from 'element-ui'

Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Tree)
Vue.use(Pagination)
Vue.use(Upload)
Vue.use(Dialog)
Vue.use(DatePicker)

Vue.prototype.$message = Message
