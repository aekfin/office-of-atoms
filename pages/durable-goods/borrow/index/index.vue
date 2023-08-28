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
        const equipment = item?.equipments?.[0]
        const equipmentId = equipment?.id
        const query = equipmentId ? { equipmentId } : {}
        const returned = equipment.status === 'BORROWED' ? { type: 'link', icon: 'assignment_returned', action: { path: `/durable-goods/return/create/`, query } } : {}
        return [
          { type: 'link', icon: 'edit', action: `/durable-goods/borrow/${item.id}/` },
          returned,
        ]
      },
    },
  }
</script>

<style lang="scss">
  #durable-goods-borrow-page {
  }
</style>