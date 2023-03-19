<template>
  <div id="durable-goods-withdraw-detail-page">
    <PageHeader :text="isCreate ? 'การเบิกครุภัณฑ์' : 'การแก้ไขการเบิกครุภัณฑ์'" hideTotal/>
    <Loading v-if="isLoading"/>
    <DurableGoodsBorrowForm v-else :item="item" :viewMode="!isCreate" type="เบิก" cannotApprove backPath="/durable-goods/withdraw/" @submit="onSubmit"/>
    <ConfirmDialog :value.sync="dialog" title="แจ้งเตือน" :text="errorText" hideSubmit closeText="รับทราบ"/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      DurableGoodsBorrowForm: () => import('~/components/DurableGoodsBorrowForm.vue'),
      Loading: () => import('~/components/Loading.vue'),
      ConfirmDialog: () => import('~/components/ConfirmDialog.vue'),
    },
    data () {
      return {
        isLoading: false,
        item: null,
        dialog: false,
        errorText: 'ไม่สามารถขอเบิกได้ เนื่องจากในกองหรือกลุ่มของท่านไม่มีผู้ที่มีสิทธิ์อนุมัติได้',
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.withdraw_id === 'create'
      },
    },
    mounted () {
      if (!this.isCreate) this.getData()
    },
    methods: {
      async getData () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: 'equipment/getRequestDetail', query: { id: this.$route.params.withdraw_id } })
          this.item = data
          this.isLoading = false
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      getErrorText (description) {
        return description.includes('invalid with status')
          ? 'ไม่สามารถขอเบิกได้ เนื่องจากครุภัณฑ์ดังกล่าวอยู่ในระหว่างการรออนุมัติหรือถูกเบิกไปแล้ว'
          : description.includes(`this equipment can't Requisition owner is not treasury`)
            ? 'ไม่สามารถขอเบิกได้ เนื่องจากครุภัณฑ์นี้ไม่ใช่ของกองคลัง'
            : 'ไม่สามารถขอเบิกได้ เนื่องจากในกองหรือกลุ่มของท่านไม่มีผู้ที่มีสิทธิ์อนุมัติได้'
      },
      async onSubmit (form) {
        try{
          const formData = { ...form }
          formData.dateBorrow = this.$fn.convertDateToString(formData.dateBorrow)
          formData.itemIds = [formData.itemId]
          const { data } = await this.$store.dispatch('http', { method: 'post', apiPath: 'equipment/requisition', data: formData })
          if (data.status.code == 400) {
            await this.$store.dispatch('snackbar', { text: `Error ${data.status.code}: ${data.status.description}`, props: { color: 'red', top: true } })
            this.errorText = this.getErrorText(data.status.description)
            this.dialog = true
          } else {
            await this.$store.dispatch('snackbar', { text: 'ยื่นขอเบิกวัสดุคงคลังสำเร็จ' })
            this.$router.push('/durable-goods/withdraw/')
          }
        } catch (err) { return Promise.reject(err) }
      },
    } 
  }
</script>

<style lang="scss">
  #durable-goods-withdraw-detail-page {
  }
</style>