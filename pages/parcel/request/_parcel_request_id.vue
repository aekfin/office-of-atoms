<template>
  <div id="parcel-request-detail-page">
    <PageHeader :text="'อนุมัติการเบิกพัสดุ'" hideTotal/>
    <Loading v-if="isLoading"/>
    <ParcelWithdrawForm v-else :item="item" :viewMode="!isCreate" @approve="onApprove"/>
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
        isLoading: true,
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