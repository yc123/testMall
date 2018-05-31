<template>
  <div>
    <personal-material></personal-material>
  </div>
</template>
<script>
  import {PersonalMaterial} from '~components/personalMaterial'
  export default {
    middleware: 'authenticated',
    components: {
      PersonalMaterial
    }
  }
</script>
