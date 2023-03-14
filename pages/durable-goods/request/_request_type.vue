<template>
  <div id="durable-goods-request-page">
    <v-tabs class="tabs-underline mb-10" exact exactPath fixedTabs>
      <v-tab :to="{ path: '/durable-goods/request/' }">
        <div>การยืม</div>
        <v-badge v-if="equipmentCount" class="ml-2 mr-2" color="red" :content="equipmentCount"/>
      </v-tab>
      <v-tab :to="{ path: '/durable-goods/request/return/' }">
        <div>การคืน</div>
      </v-tab>
      <v-tab :to="{ path: '/durable-goods/request/withdraw/' }">
        <div>การเบิก</div>
      </v-tab>
      <v-tab :to="{ path: '/durable-goods/request/transfer/' }">
        <div>การโอนย้าย</div>
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
      title () {
        return `ครุภัณฑ์ที่รออนุมัติ${this.name}`
      },
      equipmentCount () {
        return this.$store.state.approveEquipmentRequest?.totalElements || 0
      },
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'equipment/getListRequest', query: { ...this.$route.query }, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'mdi-pencil', action: `/durable-goods/request/approval/${item.id}/` },
          // { type: 'confirm', icon: 'mdi-delete', action: () => { console.log('Confirm') } },
        ]
      },
    },
  }
</script>

<style lang="scss">
  #durable-goods-request-page {
  }
</style>