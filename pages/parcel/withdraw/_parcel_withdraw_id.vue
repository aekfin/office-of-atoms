<template>
  <div id="parcel-withdraw-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มการเบิกพัสดุ' : 'การแก้ไขการเบิกพัสดุ'" hideTotal/>
    <ParcelWithdrawForm :item="item" :viewMode="!isCreate" @onSave="onSave" @submit="onSubmit"/>
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
    computed: {
      isCreate () {
        return this.$route.params.parcel_withdraw_id === 'create'
      },
    },
    mounted () {
      if (!this.isCreate) this.getData()
    },
    methods: {
      async getData () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: 'parcel/getPickUp', query: { id: this.$route.params.parcel_withdraw_id } })
          this.item = data
          this.isLoading = false
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      onSave (form) {
        console.log('Save', form)
      },
      async onSubmit (form) {
        try{
          await this.$store.dispatch('http', { method: 'post', apiPath: 'parcel/pickup', data: form })
          await this.$store.dispatch('snackbar', { text: 'ยื่นขอเบิกพัสดุสำเร็จ' })
        } catch (err) { return Promise.reject(err) }
      },
    }
  }
</script>

<style lang="scss">
  #parcel-withdraw-detail-page {
  }
</style>