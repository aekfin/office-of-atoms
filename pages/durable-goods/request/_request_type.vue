<template>
  <div id="durable-goods-request-page">
    <v-tabs class="tabs-underline mb-10" exact exactPath fixedTabs showArrows>
      <v-tab :to="{ path: '/durable-goods/request/' }">
        <div>การยืม</div>
        <v-badge v-if="borrowCount" class="ml-2 mr-2" color="red" :content="borrowCount"/>
      </v-tab>
      <v-tab :to="{ path: '/durable-goods/request/return/' }">
        <div>การคืน</div>
        <v-badge v-if="returnCount" class="ml-2 mr-2" color="red" :content="returnCount"/>
      </v-tab>
      <v-tab :to="{ path: '/durable-goods/request/withdraw/' }">
        <div>การเบิก</div>
        <v-badge v-if="withdrawCount" class="ml-2 mr-2" color="red" :content="withdrawCount"/>
      </v-tab>
      <v-tab :to="{ path: '/durable-goods/request/transfer/' }">
        <div>การโอนย้าย</div>
        <v-badge v-if="transferCount" class="ml-2 mr-2" color="red" :content="transferCount"/>
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
        }
        return list[this.$route.params.request_type] || 'การยืม'
      },
      typeComponentList () {
        const list = {
          'return': 'Return',
          'withdraw': 'Withdraw',
          'transfer': 'Transfer',
        }
        return `DurableGoods${list[this.$route.params.request_type] || 'Borrow'}Table`
      },
      apiPathQuery () {
        const list = {
          'return': 'RETURN',
          'withdraw': 'REQUISITION',
          'transfer': 'TRANSFER',          
        }
        return { types: list[this.$route.params.request_type] || 'BORROW' }
      },
      title () {
        return `ครุภัณฑ์ที่รออนุมัติ${this.name}`
      },
      equipmentCount () {
        return this.$store.state.approveEquipmentRequest?.totalElements || 0
      },
      borrowCount () {
        return this.$store.state.approveEquipmentBORROW?.totalElements || 0
      },
      returnCount () {
        return this.$store.state.approveEquipmentRETURN?.totalElements || 0
      },
      withdrawCount () {
        return this.$store.state.approveEquipmentREQUISITION?.totalElements || 0
      },
      transferCount () {
        return this.$store.state.approveEquipmentTRANSFER?.totalElements || 0
      },
    },
    watch: {
      '$route.query' () {
        this.getList()
      }
    },
    async mounted () {
      await this.getList()
      await this.getCounts()
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
      async getCounts () {
        try {
          this.isLoading = true
          if (this.$store.state.approveEquipmentBORROW === null) {
            const { data: val } = await this.$store.dispatch('http', { apiPath: 'equipment/getListRequestFilter', query: { ...this.$route.query, types: 'BORROW' } })
            this.$store.commit('SET_STATE', { name: `approveEquipmentBORROW`, val })
          }
          if (this.$store.state.approveEquipmentRETURN === null) {
            const { data: val } = await this.$store.dispatch('http', { apiPath: 'equipment/getListRequestFilter', query: { ...this.$route.query, types: 'RETURN' } })
            this.$store.commit('SET_STATE', { name: `approveEquipmentRETURN`, val })
          }
          if (this.$store.state.approveEquipmentREQUISITION === null) {
            const { data: val } = await this.$store.dispatch('http', { apiPath: 'equipment/getListRequestFilter', query: { ...this.$route.query, types: 'REQUISITION' } })
            this.$store.commit('SET_STATE', { name: `approveEquipmentREQUISITION`, val })
          }
          if (this.$store.state.approveEquipmentTRANSFER === null) {
            const { data: val } = await this.$store.dispatch('http', { apiPath: 'equipment/getListRequestFilter', query: { ...this.$route.query, types: 'TRANSFER' } })
            this.$store.commit('SET_STATE', { name: `approveEquipmentTRANSFER`, val })
          }
          this.isLoading = false
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'edit', action: `/durable-goods/request/approval/${item.id}/` },
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