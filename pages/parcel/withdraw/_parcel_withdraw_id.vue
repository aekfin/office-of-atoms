<template>
  <div id="parcel-withdraw-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มการเบิกพัสดุ' : 'การแก้ไขการเบิกพัสดุ'" hideTotal/>
    <ParcelWithdrawForm :viewMode="!isCreate" @onSave="onSave" @submit="onSubmit"/>
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
        isRequested: true,
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.parcel_withdraw_id === 'create'
      },
    },
    methods: {
      onSave (form) {
        console.log('Save', form)
      },
      onSubmit (form) {
        console.log('Submit', form)
      },
    }
  }
</script>

<style lang="scss">
  #parcel-withdraw-detail-page {
  }
</style>