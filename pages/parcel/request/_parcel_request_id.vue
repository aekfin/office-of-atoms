<template>
  <div id="parcel-request-detail-page">
    <PageHeader :text="'อนุมัติการเบิกพัสดุ'" hideTotal/>
    <Loading v-if="isLoading"/>
    <ParcelWithdrawForm v-else :item="item" :viewMode="!isCreate" @approve="onApprove" @reject="onReject"/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      ParcelWithdrawForm: () => import('~/components/ParcelWithdrawForm.vue'),
      Loading: () => import('~/components/Loading.vue'),
    },
    data () {
      return {
        isLoading: false,
        item: null,
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.parcel_request_id === 'create'
      },
    },
    mounted () {
      if (!this.isCreate) this.getData()
    },
    methods: {
      async getData () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: 'parcel/getPickUp', query: { id: this.$route.params.parcel_request_id } })
          this.item = data
          this.isLoading = false
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      async onApprove (flow) {
        try{
          const { data } = await this.$store.dispatch('http', { method: 'get', apiPath: 'parcel/approve', query: { flowId: flow.id } })
          await this.$store.dispatch('snackbar', { text: 'อนุมัติการเบิกพัสดุสำเร็จ' })
          await this.getData()
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async onReject (flow) {
        try{
          const { data } = await this.$store.dispatch('http', { method: 'get', apiPath: 'parcel/reject', query: { flowId: flow.id } })
          await this.$store.dispatch('snackbar', { text: 'ไม่อนุมัติการเบิกพัสดุสำเร็จ' })
          await this.getData()
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
    }
  }
</script>

<style lang="scss">
  #parcel-request-detail-page {
  }
</style>