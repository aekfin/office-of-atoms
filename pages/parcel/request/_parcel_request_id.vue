<template>
  <div id="parcel-request-detail-page">
    <PageHeader :text="'อนุมัติการเบิกพัสดุ'" hideTotal/>
    <ParcelWithdrawForm :item="item" :viewMode="!isCreate" @approve="onApprove"/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      ParcelWithdrawForm: () => import('~/components/ParcelWithdrawForm.vue'),
    },
    data () {
      return {
        isLoading: true,
        item: null,
      }
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
      onApprove (form) {
        console.log('Submit', form)
      },
    }
  }
</script>

<style lang="scss">
  #parcel-request-detail-page {
  }
</style>