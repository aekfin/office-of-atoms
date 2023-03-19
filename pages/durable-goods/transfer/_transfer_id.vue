<template>
  <div id="durable-goods-transfer-detail-page">
    <PageHeader :text="isCreate ? 'การโอนย้ายครุภัณฑ์' : 'การแก้ไขการโอนย้ายครุภัณฑ์'" hideTotal/>
    <Loading v-if="isLoading"/>
    <DurableGoodsTransferForm v-else :item="item" :viewMode="!isCreate" type="โอนย้าย" cannotApprove backPath="/durable-goods/transfer/" @submit="onSubmit"/>
    <ConfirmDialog :value.sync="dialog" title="แจ้งเตือน" :text="errorText" hideSubmit closeText="รับทราบ"/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      DurableGoodsTransferForm: () => import('~/components/DurableGoodsTransferForm.vue'),
      Loading: () => import('~/components/Loading.vue'),
      ConfirmDialog: () => import('~/components/ConfirmDialog.vue'),
    },
    data () {
      return {
        isLoading: false,
        item: null,
        dialog: false,
        errorText: 'ไม่สามารถขอโอนย้ายได้ เนื่องจากในกองหรือกลุ่มของท่านไม่มีผู้ที่มีสิทธิ์อนุมัติได้',
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.transfer_id === 'create'
      },
    },
    mounted () {
      if (!this.isCreate) this.getData()
    },
    methods: {
      async getData () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: 'equipment/getRequestDetail', query: { id: this.$route.params.transfer_id } })
          this.item = data
          this.isLoading = false
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      getErrorText (description) {
        return description.includes('invalid with status')
          ? 'ไม่สามารถขอโอนย้ายได้ เนื่องจากครุภัณฑ์ดังกล่าวอยู่ในระหว่างการรออนุมัติหรือถูกยืมหรือถูกเบิกไปแล้ว'
          : description.includes(`this equipment can't Requisition owner is not treasury`)
            ? 'ไม่สามารถขอโอนย้ายได้ เนื่องจากครุภัณฑ์นี้ไม่ใช่ของกองคลัง'
            : 'ไม่สามารถขอโอนย้ายได้ เนื่องจากในกองหรือกลุ่มของท่านไม่มีผู้ที่มีสิทธิ์อนุมัติได้'
      },
      async onSubmit (form) {
        try{
          const formData = { ...form }
          formData.dateTransfer = this.$fn.convertDateToString(formData.dateBorrow)
          const { data } = await this.$store.dispatch('http', { method: 'post', apiPath: 'equipment/transfer', data: formData })
          if (data.status.code == 400) {
            await this.$store.dispatch('snackbar', { text: `Error ${data.status.code}: ${data.status.description}`, props: { color: 'red', top: true } })
            this.errorText = this.getErrorText(data.status.description)
            this.dialog = true
          } else {
            await this.$store.dispatch('snackbar', { text: 'ยื่นขอโอนย้ายวัสดุคงคลังสำเร็จ' })
            this.$router.push('/durable-goods/transfer/')
          }
        } catch (err) { return Promise.reject(err) }
      },
    } 
  }
</script>

<style lang="scss">
  #durable-goods-transfer-detail-page {
  }
</style>