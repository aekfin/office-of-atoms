<template>
  <div id="parcel-withdraw-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มการเบิกวัสดุคงคลัง' : 'การแก้ไขการเบิกวัสดุคงคลัง'" hideTotal :reportApiPath="isCreate ? '' : 'parcel/getPickUpDocument'" reportName="ใบเบิกวัสดุคงคลัง" :reportQuery="reportQuery"/>
    <div v-if="!isCreate" class="d-flex justify-end mt-3">
      <ExportReportButton apiPath="parcel/getPickUpDocument" name="เอกสารประกอบการเบิกวัสดุคงคลัง" text="เอกสารประกอบการเบิกวัสดุคงคลัง" :query="reportQuery"/>
    </div>
    <Loading v-if="isLoading"/>
    <ParcelWithdrawForm v-else :item="item" :viewMode="!isCreate" cannotApprove @submit="onSubmit"/>
    <ConfirmDialog :value.sync="dialog" title="แจ้งเตือน" text="ไม่สามารถขอเบิกได้ เนื่องจากในกองหรือกลุ่มของท่านไม่มีผู้ที่มีสิทธิ์อนุมัติได้" hideSubmit closeText="รับทราบ"/>
    <ConfirmDialog :value.sync="dialogCheckQty" title="แจ้งเตือน" text="ไม่สามารถขอเบิกได้ เนื่องจากระบุจำนวนเบิกไม่ถูกต้อง" hideSubmit closeText="รับทราบ"/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      ParcelWithdrawForm: () => import('~/components/ParcelWithdrawForm.vue'),
      Loading: () => import('~/components/Loading.vue'),
      ConfirmDialog: () => import('~/components/ConfirmDialog.vue'),
      ExportReportButton: () => import('~/components/ExportReportButton.vue'),
    },
    data () {
      return {
        isLoading: false,
        item: null,
        dialog: false,
        dialogCheckQty: false
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.parcel_withdraw_id === 'create'
      },
      reportQuery () {
        return { parcelRequestId: this.$route.params.parcel_withdraw_id }
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
      async onSubmit (form) {
        try{
          const formData = { ...form }          
          console.log('formData ',formData)
          for(let i=0; i < formData.pickUpItems.length; i++){
            if(parseInt(formData.pickUpItems[i].quantity) < 0){
              this.dialogCheckQty = true
            }
          }
          if(!this.dialogCheckQty){
            formData.datePickUp = this.$fn.convertDateToString(formData.datePickUp)
            const { data } = await this.$store.dispatch('http', { method: 'post', apiPath: 'parcel/pickup', data: formData })
            if (data.status.code == 400) {
              await this.$store.dispatch('snackbar', { text: `Error ${data.status.code}: ${data.status.description}`, props: { color: 'red', top: true } })
              this.dialog = true
            } else {
              await this.$store.dispatch('snackbar', { text: 'ยื่นขอเบิกวัสดุคงคลังสำเร็จ' })
              this.$router.push('/parcel/withdraw/')
            }
          }
        } catch (err) { return Promise.reject(err) }
      },
    }
  }
</script>

<style lang="scss">
  #parcel-withdraw-detail-page {
  }
</style>