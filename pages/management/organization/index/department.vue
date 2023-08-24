<template>
  <div id="department-page">
    <PageHeader text="บริหารกอง" hideTotal btnText="เพิ่มกอง"/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
    },
  }
</script>

<style lang="scss">
  #department-page {
  }
</style>