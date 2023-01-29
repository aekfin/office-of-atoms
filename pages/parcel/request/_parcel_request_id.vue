<template>
  <div id="parcel-request-detail-page">
    <PageHeader :text="'อนุมัติการเบิกพัสดุ'" hideTotal/>
    <ParcelWithdrawForm viewMode isApprover :step="2" @approve="onApprove"/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      ParcelWithdrawForm: () => import('~/components/ParcelWithdrawForm.vue'),
    },
    methods: {
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