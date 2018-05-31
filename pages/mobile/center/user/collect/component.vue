<template>
  <div class="mobile-center">
    <div class="com-mobile-header">
      <a @click="goLastPage"><i class="iconfont icon-fanhui"></i></a>
      <p>器件收藏</p>
    </div>
    <div class="mobile-fix-content" id="mobileFixContent">
      <ul v-if="compList && compList.length">
        <li :key="comp.componentid" v-for="comp in compList" @click="goUrl('/mobile/brand/componentDetail/' + comp.componentinfo.uuid)">
          <div class="fl">
            <p>型号：<span v-text="comp.componentinfo.code"></span></p>
            <p>品牌：<span v-text="comp.componentinfo.brand.nameCn"></span></p>
            <p>产品描述：<span v-text="comp.componentinfo.kind.nameCn"></span></p>
          </div>
          <div class="vir"></div>
          <div class="fr">
            <i class="iconfont icon-shoucang" @click="cancelFocus(comp, $event)"></i>
            <a class="sa-pub" @click="compInquiry(comp, $event)">立即询价</a>
          </div>
        </li>
      </ul>
      <empty-status :type="'collect'" :showLink="true" :text="'抱歉，暂无器件收藏'" v-else></empty-status>
    </div>
    <remind-box :title="remindText" :timeoutCount="timeoutCount"></remind-box>
    <pull-up :fixId="'mobileFixContent'" :searchMore="fetching" :allPage="allPage" :page="page" @pullUpAction="onPullUpAction"></pull-up>
    <publish-supplier-seek :product="componentSeekObj" :showPublishBox="showPublishBox" @cancelAction="showPublishBox = false" @remindAction="onRemind"></publish-supplier-seek>
  </div>
</template>
<script>
  import { RemindBox, PullUp, EmptyStatus } from '~components/mobile/common'
  import { PublishSupplierSeek } from '~components/mobile/applyPurchase'
  export default {
    middleware: 'authenticated',
    layout: 'mobileNoHeader',
    data () {
      return {
        remindText: '',
        timeoutCount: 0,
        page: 1,
        count: 10,
        isChange: false,
        compList: [],
        componentSeekObj: {
          standard: 1,
          cmpCode: '',
          pbranden: '',
          spec: null,
          kind: ''
        },
        showPublishBox: false
      }
    },
    watch: {
      'compCollectList.data': {
        handler: function (val) {
          if (this.isChange) {
            this.compList = val.content
            this.isChange = false
          } else {
            this.compList = [...this.compList, ...val.content]
          }
        },
        immediate: true
      }
    },
    computed: {
      compCollectList () {
        return this.$store.state.product.common.collectList
      },
      fetching () {
        return this.compCollectList.fetching
      },
      allPage () {
        return Math.floor(this.compCollectList.data.totalElements / this.compCollectList.data.size) + Math.floor(this.compCollectList.data.totalElements % this.compCollectList.data.size > 0 ? 1 : 0)
      }
    },
    fetch ({ store }) {
      return Promise.all([
        // 获取器件收藏列表
        store.dispatch('product/saveStores', { count: 10, page: 1, type: 'component' })
      ])
    },
    components: {
      RemindBox,
      PullUp,
      PublishSupplierSeek,
      EmptyStatus
    },
    methods: {
      onRemind: function (str) {
        this.remindText = str
        this.timeoutCount++
      },
      cancelFocus: function (item, event) {
        event.stopPropagation()
        this.$http.delete('/trade/collection/' + item.id)
          .then(response => {
            this.onRemind('取消收藏成功')
            this.isChange = true
            this.page = 1
            this.reloadList()
          }, err => {
            this.onRemind(err.response.data || '取消收藏失败')
          })
      },
      reloadList: function () {
        this.$store.dispatch('product/saveStores', { page: this.page, count: this.count, type: 'component' })
      },
      onPullUpAction: function () {
        this.page++
        this.reloadList()
      },
      compInquiry: function (item, e) {
        if (e) {
          e.stopPropagation()
        }
        this.componentSeekObj.cmpCode = item.componentinfo.code
        this.componentSeekObj.pbranden = item.componentinfo.brand.nameCn
        this.componentSeekObj.spec = null
        this.componentSeekObj.kind = item.componentinfo.kind.nameCn
        this.componentSeekObj = JSON.parse(JSON.stringify(this.componentSeekObj))
        this.showPublishBox = true
      },
      goUrl: function (url) {
        console.log(url)
        this.$router.push(url)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mobile-fix-content {
    ul {
      width: 7.1rem;
      margin: 0 auto;
      li {
        height: 1.8rem;
        border-radius: .05rem;
        border: 1px solid #ccc;
        margin: .25rem 0 0 0;
        position: relative;
        background: #fff;
        .fl {
          width: 4.71rem;
          color: #666;
          padding: .25rem .1rem .25rem .23rem;
          p {
            font-size: .3rem;
            line-height: .42rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span {
              color: #333;
            }
          }
        }
        .vir {
          position: absolute;
          top: .28rem;
          bottom: .28rem;
          right: 2.36rem;
          border-right: .01rem dashed #9f9f9f;
        }
        .fr {
          width: 2.34rem;
          text-align: center;
          i {
            display: block;
            color: #ff7800;
            font-size: .5rem;
            width: .6rem;
            height: .6rem;
            line-height: .6rem;
            text-align: center;
            margin: .29rem auto .1rem;
          }
          .sa-pub {
            display: block;
            width: 1.7rem;
            height: .47rem;
            line-height: .47rem;
            text-align: center;
            font-size: .26rem;
            color: #fff;
            background: #008bf7;
            margin: 0 auto;
            border-radius: .05rem;
          }
        }
      }
    }
  }
</style>
