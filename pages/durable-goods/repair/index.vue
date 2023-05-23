<template>
  <div id="durable-goods-repair-detail-page">
    <PageHeader text="ส่งซ่อมครุภัณฑ์" btnText="เพิ่มการส่งซ่อมครุภัณฑ์" createRoute="/durable-goods/repair/create/" :total="total"/>
    <DurableGoodsRepairTable :items="items" :getActionIconList="getActionIconList" :isLoading="isLoading"/>
    <Pagination/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      DurableGoodsRepairTable: () => import('~/components/DurableGoodsRepairTable.vue'),
      Pagination: () => import('~/components/Pagination.vue'),
    },
    data () {
      return {
        isLoading: true,
        count: 0,
        total: 0,
        items: [],
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'equipment/getListRequestFilter', query: { ...this.$route.query, types: 'REPAIR', isOwner: true }, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'edit', action: `/durable-goods/repair/${item.id}/` },
          // { type: 'confirm', icon: 'delete', action: () => { console.log('Confirm') } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #durable-goods-repair-detail-page {
  }
</style>