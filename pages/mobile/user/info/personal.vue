<template>
  <info :info="user.data"></info>
</template>
<script>
  import {Info} from '~components/mobile'
  export default {
    layout: 'mobile',
    components: {
      Info
    }
  }
</script>
