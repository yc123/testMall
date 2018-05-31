<template>
  <div class="com-mobile-header">
    <a @click="goLastPage"><i class="iconfont icon-fanhui"></i></a>
    <p>
      {{title}}
    </p>
  </div>
</template>
<script>
  export default {
    props: {
      title: {
        default: '优软商城',
        type: String
      }
    }
  }
</script>
