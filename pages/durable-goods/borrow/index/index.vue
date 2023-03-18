<template>
  <div id="durable-goods-borrow-page">
    <PageHeader text="การยืมครุภัณฑ์" btnText="เพิ่มการยืมครุภัณฑ์" createRoute="/durable-goods/borrow/create/" :total="total"/>
    <DurableGoodsBorrowTable :items="items" :isLoading="isLoading" :getActionIconList="getActionIconList"/>
    <Pagination/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
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
          { type: 'link', icon: 'mdi-pencil', action: `/durable-goods/borrow/${item.id}/` },
          // { type: 'confirm', icon: 'mdi-delete', action: () => { console.log('Confirm') } },
        ]
      },
    },
  }
</script>

<style lang="scss">
  #durable-goods-borrow-page {
  }
</style>