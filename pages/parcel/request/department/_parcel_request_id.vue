<template>
  <div id="parcel-request-detail-page">
    <PageHeader :text="'อนุมัติการเบิกวัสดุคงคลัง (ภายในกลุ่ม)'" hideTotal/>
    <Loading v-if="isLoading"/>
    <ParcelWithdrawForm v-else :item="item" :viewMode="!isCreate" backPath="/parcel/request/department/" @approve="onApprove" @reject="onReject"/>
  </div>
</template>

<script>
  import _ from 'lodash'
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
        originalItems: null,
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
          const { data } = await this.$store.dispatch('http', { apiPath: 'parcel/department/getPickUp', query: { id: this.$route.params.parcel_request_id } })
          this.item = data
          this.originalItems = _.cloneDeep(this.item)
          this.isLoading = false
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      async submitChanged (form) {
        try{
          const isChanged = !_.isEqual(this.originalItems.items, form.pickUpItems)
          if (isChanged) {
            const data = {
              editItems: form.pickUpItems,
              pickUpId: this.$route.params.parcel_request_id,
              remark: this.item.description
            }
            await this.$store.dispatch('http', { method: 'post', apiPath: 'parcel/department/editPickUp', data })
          }
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      async onApprove (flow, form) {
        try{
          this.isLoading = true
          // await this.submitChanged(form)
          const { data } = await this.$store.dispatch('http', { method: 'get', apiPath: 'parcel/department/approve', query: { flowId: flow.id } })
          await this.$store.dispatch('snackbar', { text: 'อนุมัติการเบิกวัสดุคงคลังสำเร็จ' })
          await this.getData()
          this.$store.commit('TOGGLE_NOTI')
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async onReject (flow, form) {
        try{
          this.isLoading = true
          // await this.submitChanged(form)
          const { data } = await this.$store.dispatch('http', { method: 'get', apiPath: 'parcel/department/reject', query: { flowId: flow.id } })
          await this.$store.dispatch('snackbar', { text: 'ไม่อนุมัติการเบิกวัสดุคงคลังสำเร็จ' })
          await this.getData()
          this.$store.commit('TOGGLE_NOTI')
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