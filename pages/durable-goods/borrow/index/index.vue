<template>
  <div id="durable-goods-borrow-page">
    <PageHeader text="การยืมครุภัณฑ์" btnText="เพิ่มการยืมครุภัณฑ์" createRoute="/durable-goods/borrow/create/" :total="total"/>
    <ExportReportButton apiPath="report/borrowAndReturn" name="รายงานการยืมคืนครุภัณฑ์"/>
    <DurableGoodsBorrowTable :items="items" :isLoading="isLoading" :getActionIconList="getActionIconList"/>
    <Pagination/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      ExportReportButton: () => import('~/components/ExportReportButton.vue'),
      DurableGoodsBorrowTable: () => import('~/components/DurableGoodsBorrowTable.vue'),
    },
    data () {
      return {
        isLoading: false,
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'equipment/getListRequestFilter', query: { ...this.$route.query, isOwner: true, types: 'BORROW' }, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'edit', action: `/durable-goods/borrow/${item.id}/` },
          // { type: 'confirm', icon: 'delete', action: () => { console.log('Confirm') } },
        ]
      },
    },
  }
</script>

<style lang="scss">
  #durable-goods-borrow-page {
  }
</style>