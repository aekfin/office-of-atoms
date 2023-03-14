<template>
  <div id="durable-goods-borrow-detail-page">
    <PageHeader :text="isCreate ? 'การยืม - คืน ครุภัณฑ์' : 'การแก้ไขการยืม - คืน ครุภัณฑ์'" hideTotal/>
    <Loading v-if="isLoading"/>
    <DurableGoodsBorrowForm v-else :item="item" :viewMode="!isCreate" cannotApprove @submit="onSubmit"/>
    <ConfirmDialog :value.sync="dialog" title="แจ้งเตือน" :text="errorText" hideSubmit closeText="รับทราบ"/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      DurableGoodsBorrowForm: () => import('~/components/DurableGoodsBorrowForm.vue'),
      Loading: () => import('~/components/Loading.vue'),
    },
    data () {
      return {
        isLoading: false,
        item: null,
        dialog: false,
        errorText: 'ไม่สามารถขอยืมได้ เนื่องจากในกองหรือกลุ่มของท่านไม่มีผู้ที่มีสิทธิ์อนุมัติได้',
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.borrow_id === 'create'
      },
    },
    mounted () {
      if (!this.isCreate) this.getData()
    },
    methods: {
      async getData () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: 'equipment/getRequestDetail', query: { id: this.$route.params.borrow_id } })
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
          formData.dateBorrow = this.$fn.convertDateToString(formData.dateBorrow)
          const { data } = await this.$store.dispatch('http', { method: 'post', apiPath: 'equipment/borrow', data: formData })
          if (data.status.code == 400) {
            await this.$store.dispatch('snackbar', { text: `Error ${data.status.code}: ${data.status.description}`, props: { color: 'red', top: true } })
            this.errorText = data.status.description.includes('invalid with status') ? 'ไม่สามารถขอยืมได้ เนื่องจากครุภัณฑ์ดังกล่าวอยู่ในระหว่างการรออนุมัติหรือถูกยืมไปแล้ว' : 'ไม่สามารถขอยืมได้ เนื่องจากในกองหรือกลุ่มของท่านไม่มีผู้ที่มีสิทธิ์อนุมัติได้'
            this.dialog = true
          } else {
            await this.$store.dispatch('snackbar', { text: 'ยื่นขอเบิกวัสดุคงคลังสำเร็จ' })
            this.$router.push('/durable-goods/borrow/')
          }
        } catch (err) { return Promise.reject(err) }
      },
    }
  }
</script>

<style lang="scss">
  #durable-goods-borrow-detail-page {
  }
</style>