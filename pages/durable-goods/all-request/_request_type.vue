<template>
  <div id="durable-goods-request-page">
    <v-tabs class="tabs-underline mb-10" exact exactPath fixedTabs showArrows>
      <v-tab :to="{ path: '/durable-goods/all-request/' }">
        <div>การยืม</div>
      </v-tab>
      <v-tab :to="{ path: '/durable-goods/all-request/return/' }">
        <div>การคืน</div>
      </v-tab>
      <v-tab :to="{ path: '/durable-goods/all-request/withdraw/' }">
        <div>การเบิก</div>
      </v-tab>
      <v-tab :to="{ path: '/durable-goods/all-request/transfer/' }">
        <div>การโอนย้าย</div>
      </v-tab>
      <v-tab :to="{ path: '/durable-goods/all-request/repair/' }">
        <div>การส่งซ่อม</div>
      </v-tab>
    </v-tabs>
    <PageHeader :text="title" :total="total"/>
    <Component :is="typeComponentList" :items="items" :isLoading="isLoading" :getActionIconList="getActionIconList"/>
    <Pagination/>
    <NChild/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      DurableGoodsBorrowTable: () => import('~/components/DurableGoodsBorrowTable.vue'),
      DurableGoodsReturnTable: () => import('~/components/DurableGoodsReturnTable.vue'),
      DurableGoodsWithdrawTable: () => import('~/components/DurableGoodsWithdrawTable.vue'),
      DurableGoodsTransferTable: () => import('~/components/DurableGoodsTransferTable.vue'),
      DurableGoodsRepairTable: () => import('~/components/DurableGoodsRepairTable.vue'),
    },
    data () {
      return {
        isLoading: false,
        count: 0,
        total: 0,
        items: [],
      }
    },
    computed: {
      name () {
        const list = {
          'return': 'การคืน',
          'withdraw': 'การเบิก',
          'transfer': 'การโอนย้าย',
          'repair': 'การส่งซ่อม',
        }
        return list[this.$route.params.request_type] || 'การยืม'
      },
      typeComponentList () {
        const list = {
          'return': 'Return',
          'withdraw': 'Withdraw',
          'transfer': 'Transfer',
          'repair': 'Repair',
        }
        return `DurableGoods${list[this.$route.params.request_type] || 'Borrow'}Table`
      },
      apiPathQuery () {
        const list = {
          'return': 'RETURN',
          'withdraw': 'REQUISITION',
          'transfer': 'TRANSFER',
          'repair': 'REPAIR',
        }
        return { types: list[this.$route.params.request_type] || 'BORROW' }
      },
      title () {
        return `ครุภัณฑ์ที่อนุมัติ${this.name}ทั้งหมด`
      },
    },
    watch: {
      '$route.query' () {
        this.getList()
      }
    },
    async mounted () {
      await this.getList()
    },
    methods: {
      async getList () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'equipment/getListRequestFilter', query: { ...this.$route.query, ...this.apiPathQuery }, context: this })
          const { types } = this.apiPathQuery
          this.$store.commit('SET_STATE', { name: `approveEquipment${types}`, val: data })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        const path = this.$route.params.request_type === 'repair' ? `/durable-goods/repair/${item.id}/` : `/durable-goods/request/approval/${item.id}/`
        const query = { 'from': 'all-request' }
        const action = { path, query }
        return [
          { type: 'link', icon: 'edit', action },
          // { type: 'confirm', icon: 'delete', action: () => { console.log('Confirm') } },
        ]
      },
    },
  }
</script>

<style lang="scss">
  #durable-goods-request-page {
  }
</style>