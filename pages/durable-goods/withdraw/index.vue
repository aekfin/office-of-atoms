<template>
  <div id="durable-goods-withdraw-page">
    <PageHeader text="การเบิกครุภัณฑ์" btnText="เพิ่มการเบิกครุภัณฑ์" createRoute="/durable-goods/withdraw/create/" :total="total" :filters="filters"/>
    <DurableGoodsWithdrawTable :items="items" :isLoading="isLoading" :getActionIconList="getActionIconList"/>
    <Pagination/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      DurableGoodsWithdrawTable: () => import('~/components/DurableGoodsWithdrawTable.vue'),
      Pagination: () => import('~/components/Pagination.vue'),
    },
    data () {
      return {
        isLoading: false,
        count: 0,
        total: 0,
        items: [],
        filters: [
          { type: 'textField',param: 'equipmentName',name: 'ครุภัณฑ์', },
          { type: 'textField',param: 'firstName',name: 'ผู้ขอเบิกครุภัณฑ์', },
          { type: 'textField',param: 'ouName',name: 'ผู้ครอบครอง', },
          { type: 'textField',param: 'status',name: 'สถานะการเบิก', },
          { type: 'datePicker',param: 'dateBorrow',name: 'วันที่เบิก' },
          { type: 'datePicker',param: 'dateApprove',name: 'วันที่อนุมัติ' },
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'equipment/getListRequestFilter', query: { ...this.$route.query, isOwner: true, types: 'REQUISITION', pageSize: 10 }, context: this })
          
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'edit', action: `/durable-goods/withdraw/${item.id}/` },
          // { type: 'confirm', icon: 'delete', action: () => { console.log('Confirm') } },
        ]
      },
    },
  }
</script>

<style lang="scss">
  #durable-goods-withdraw-page {
  }
</style>