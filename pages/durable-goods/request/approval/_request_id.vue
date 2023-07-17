<template>
  <div id="durable-goods-request-detail-page">
    <PageHeader :text="`อนุมัติการ${type}ครุภัณฑ์`" hideTotal/>
    <Loading v-if="isLoading"/>
    <DurableGoodsTransferForm v-else-if="type === 'โอนย้าย'" :item="item" :viewMode="!isCreate" isApprover :backPath="backPath" :type="type" @approve="onApprove" @reject="onReject"/>
    <DurableGoodsBorrowForm v-else :item="item" :viewMode="!isCreate" isApprover :backPath="backPath" :type="type" @approve="onApprove" @reject="onReject"/>
  </div>
</template>

<script>
  import _ from 'lodash'
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      DurableGoodsBorrowForm: () => import('~/components/DurableGoodsBorrowForm.vue'),
      Loading: () => import('~/components/Loading.vue'),
      DurableGoodsTransferForm: () => import('~/components/DurableGoodsTransferForm.vue'),
    },
    data () {
      return {
        isLoading: false,
        item: null,
        originalItems: null,
        durableGoodRequestParams: {
          'BORROW': '',
          'RETURN': 'return',
          'REQUISITION': 'withdraw',
          'TRANSFER': 'transfer',
        },
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.request_id === 'create'
      },
      type () {
        return this.$store.state.durableGoodTypes[this.item?.type || 'BORROW']
      },
      backPath () {
        return `/durable-goods/request/${this.durableGoodRequestParams[this.item?.type || 'BORROW']}`
      },
    },
    mounted () {
      if (!this.isCreate) this.getData()
    },
    methods: {
      async getData () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: 'equipment/getRequestDetail', query: { id: this.$route.params.request_id } })
          this.item = data
          this.originalItems = _.cloneDeep(this.item)
          this.isLoading = false
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      async onApprove (flow, form) {
        try{
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { method: 'get', apiPath: 'equipment/approve', query: { flowId: flow.id } })
          await this.$store.dispatch('snackbar', { text: 'อนุมัติการเบิกครุภัณฑ์สำเร็จ' })
          await this.getData()
          this.$store.commit('TOGGLE_NOTI')
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async onReject (flow, form) {
        try{
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { method: 'get', apiPath: 'equipment/reject', query: { flowId: flow.id } })
          await this.$store.dispatch('snackbar', { text: 'ไม่อนุมัติการเบิกครุภัณฑ์สำเร็จ' })
          await this.getData()
          this.$store.commit('TOGGLE_NOTI')
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
    }
  }
</script>

<style lang="scss">
  #durable-goods-request-detail-page {
  }
</style>