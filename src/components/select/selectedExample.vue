<template>
  <div>
<!--    <Select :list="ji" />-->
  </div>
</template>

<script>
  import Select from './Select'

  export default {
    components: {Select},
    data () {
      return {
        ji: [
          'じ',
          'ぢ'
        ]
      }
    }
  }
</script>

<style scoped type="text/css"></style>
