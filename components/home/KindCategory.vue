<template>
  <div class="kind-category" @mouseleave="hideChildrenLayout()">
    <ul class="kind-main list-unstyled">
      <li v-for="kind in kindsToShow" class="kind-main-item" :class="{active: kind.id==activeKindId}"
        @mouseenter="showChildrenLayout(kind)">
        <nuxt-link :to="`/product/kind/${kind.id}`">
          <span>{{ kind.nameCn }}</span>
          <i class="iconfont icon-arrow-right icon-sm pull-right"></i>
        </nuxt-link>
      </li>
      <li class="kind-main-item item-more"  @mouseenter="hideChildrenLayout()">
        <nuxt-link to="/product/kind/home">
          <span>查看更多器件分类</span>
        </nuxt-link>
      </li>
    </ul>
    <!-- 子类目 -->
    <transition name="fade" mode="out-in">
      <div v-if="activeKindId" class="kind-children">
        <div v-for="(kind, index) in kindsToShow" :key="index"
             v-if="kind.id==activeKindId" class="kind-children-layout">
          <empty-box v-if="!kind.fetching && kind.children && !kind.children.length"></empty-box>
          <loading-box v-else-if="kind.fetching" color="rgba(80, 120, 203, 0.9)"></loading-box>
          <div class="kind-children-item-wrap" v-else>
            <dl class="kind-children-item dl-horizontal" v-for="c in kind.children">
              <dt>
                <nuxt-link :to="`/product/kind/${c.id}`">
                  <span>{{ c.nameCn }}</span><i class="pull-right iconfont icon-arrow-right icon-sm"></i>
                </nuxt-link>
              </dt>
              <dd>
                <ul class="list-unstyled list-inline">
                  <li v-for="h in c.children">
                    <nuxt-link :to="`/product/kind/${h.id}`">
                      <span>{{ h.nameCn }}</span>
                    </nuxt-link>
                  </li>
                </ul>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  export default {
    name: 'kind-category',
    data () {
      return {
        activeKindId: 0
  //      kinds: {}
      }
    },
    methods: {
      showChildrenLayout (kind) {
        if (!kind.leaf) {
          this.activeKindId = kind.id
          if (!kind.children) {
            this.$emit('loadchild', kind.id)
          }
        }
      },
      hideChildrenLayout () {
        this.activeKindId = null
      }
    },
//    mounted () {
//      this.$http.get(`/api/product/kind/0/children_all`)
//        .then(response => {
//          this.kinds = response
//        })
//    },
    computed: {
      kinds () {
        return this.$store.state.product.kind.kinds
      },
      kindsToShow () {
        // 只显示前13个根类目
        if (this.kinds.data) {
          return this.kinds.data.slice(0, 13)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~assets/scss/variables';
  .kind-children .kind-children-layout{
    padding: 15px 0 0 0;
  }
  .kind-category {
    position: absolute;
    width: 200px;
    height: 477px;

    .kind-main {
      margin: 0;
      padding: 0;
      z-index: 10;

      .kind-main-item {
        height: 34.1px;
        line-height: 34.1px;
        padding: 0 10px 0 20px;
        background: rgba(80, 120, 203, 0.9);
        display: block;

        > a {
          color: #fff;

          > .iconfont {
            opacity: 0;
          }
        }

        &.item-more {
          background-color: #4c66bb;
          font-weight: bold;
          font-size: 12px;
        }

        &.active,&:hover {
          background-color: #a0b2eb;

          > a {
            font-weight: bold;

            > .iconfont {
              opacity: 1;
            }
          }
        }
      }
    }

    .kind-children {
      position: absolute;
      top: 0;
      left: 200px;
      z-index: 9;
      box-shadow: 1px 0 3px #666;

      .kind-children-layout {
        background-color: #fff;
        width: 990px;
        height: 477px;
        font-size: 12px;
        overflow-y: auto;
        a {
            color: #000;
        }
        a:hover {
         color: #ff0006;
        }
        .kind-children-item-wrap {
          height: 100%;
          width: 100%;

          .kind-children-item {
            margin-bottom: $md-pad;

            dt {
              span {
                width: 90%;
                display: inline-block;
                font-weight: bold;
                overflow: hidden;
                clear: left;
                text-align: right;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              i{
                font-size: 12px;
              }
            }

            dd {
              ul {
                margin: 0;
                padding: 0;

                li {
                  border-left: $border;
                  margin-bottom: $pad;

                  span {
                    margin: 0 $sm-pad;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
