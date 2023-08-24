<template>
  <div id="organization-page">
    <PageHeader text="บริหารกลุ่ม" hideTotal btnText="เพิ่มกลุ่ม"/>
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
  #organization-page {
  }
</style>