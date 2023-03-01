<template>
  <div id="type-parcel-page">
    <PageHeader text="ประเภทวัสดุคงคลัง" btnText="เพิ่มประเภท" unit="ประเภท" :total="total"/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
    },
    data () {
      return {
        isLoading: true,
        total: 0,
        count: 0,
      }
    },
  }
</script>

<style lang="scss">
  #type-parcel-page {
  }
</style>