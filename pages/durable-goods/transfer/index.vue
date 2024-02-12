<template>
  <div id="durable-goods-transfer-detail-page">
    <PageHeader text="การโอนย้ายครุภัณฑ์" btnText="เพิ่มการโอนย้ายครุภัณฑ์" createRoute="/durable-goods/transfer/create/" :total="total" :filters="filters"/>
    <DurableGoodsTransferTable :items="items" :isLoading="isLoading" :getActionIconList="getActionIconList"/>
    <Pagination/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      DurableGoodsTransferTable: () => import('~/components/DurableGoodsTransferTable.vue'),
      Pagination: () => import('~/components/Pagination.vue'),
    },
    data () {
      return {
        isLoading: false,
        count: 0,
        total: 0,
        items: [],
        filters: [
          { type: 'textField',param: 'number',name: 'เลขที่ครุภัณฑ์', },
          { type: 'textField',param: 'equipmentName',name: 'ชื่อครุภัณฑ์', },
          {
            name: 'ประเภท',
            param: 'subCategoryId',
            apiPath: 'equipment/category/getSubCategorys',
          }, 
          {
            name: 'ครุภัณฑ์',
            param: 'typeId',
            apiPath: 'equipment/category/types',
          },
        ]
      }
    },
    watch: {
      '$route.query' () {
        this.getList()
      }
    },
    mounted () {
      this.getList()
    },
    methods: {
      async getList () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'equipment/getListRequestFilter', query: { ...this.$route.query, isOwner: true, types: 'TRANSFER' }, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'edit', action: `/durable-goods/transfer/${item.id}/` },
          // { type: 'confirm', icon: 'delete', action: () => { console.log('Confirm') } },
        ]
      },
    },
  }
</script>

<style lang="scss">
  #durable-goods-transfer-detail-page {
  }
</style>