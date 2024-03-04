<template>
  <div id="parcel-withdraw-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มการเบิกวัสดุคงคลัง (ภายในกลุ่ม)' : 'การแก้ไขการเบิกวัสดุคงคลัง (ภายในกลุ่ม)'" hideTotal/>
    <Loading v-if="isLoading"/>
    <ParcelWithdrawForm v-else :item="item" :viewMode="!isCreate" backPath="/parcel/withdraw/department/" cannotApprove @submit="onSubmit" :privateEdit="true" :disabledRemain="disabledRemain"/>
    <ConfirmDialog :value.sync="dialog" title="แจ้งเตือน" :text="warningText" hideSubmit closeText="รับทราบ"/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      ParcelWithdrawForm: () => import('~/components/ParcelWithdrawForm.vue'),
      Loading: () => import('~/components/Loading.vue'),
      ConfirmDialog: () => import('~/components/ConfirmDialog.vue'),
    },
    data () {
      return {
        isLoading: false,
        item: null,
        dialog: false,
        warningText: 'Error',
        disabledRemain: false
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
          const { data } = await this.$store.dispatch('http', { apiPath: 'parcel/department/getPickUp', query: { id: this.$route.params.parcel_withdraw_id } })
          this.item = data
          this.isLoading = false
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      async submitChanged (form) {
        try{
          console.log('submitChanged form', form);
          const data = {
            editItems: form.pickUpItems,
            pickUpId: this.$route.params.parcel_withdraw_id,
            remark: form.description
          }
          console.log('submitChanged ', data);
          const { res } = await this.$store.dispatch('http', { method: 'post', apiPath: 'parcel/department/editPickupDepartment', data })
          console.log('res sssssssssssssssss', res);
          if (res.data.status.code == 400) {
            console.log('4000000000000000000000000 ');
            this.warningText = res.data.status.description.includes('out of stock') ? 'ไม่สามารถขอเบิกได้ เนื่องจากไม่มีวัสดุคงคลังเหลือ กรุณาเบิกจากภายนอกกลุ่มแทน' : 'ไม่สามารถขอเบิกได้ เนื่องจากในกองหรือกลุ่มของท่านไม่มีผู้ที่มีสิทธิ์อนุมัติได้'
            this.dialog = true
          } else {
            await this.$store.dispatch('snackbar', { text: 'แก้ไขการเบิกวัสดุคงคลังสำเร็จ' })
            this.$router.push('/parcel/withdraw/department/')
          }
          
        } catch (err) { return Promise.reject(err) }
      },
      async onSubmit (form) {
        if(this.isCreate){
          try{
            const formData = { ...form }
            formData.datePickUp = this.$fn.convertDateToString(formData.datePickUp)
            const { data } = await this.$store.dispatch('http', { method: 'post', apiPath: 'parcel/department/pickup', data: formData })
            if (data.status.code == 400) {
              await this.$store.dispatch('snackbar', { text: `Error ${data.status.code}: ${data.status.description}`, props: { color: 'red', top: true } })
              this.warningText = data.status.description.includes('Stock not found') ? 'ไม่สามารถขอเบิกได้ เนื่องจากไม่มีวัสดุคงคลังเหลือ กรุณาเบิกจากภายนอกกลุ่มแทน' : 'ไม่สามารถขอเบิกได้ เนื่องจากในกองหรือกลุ่มของท่านไม่มีผู้ที่มีสิทธิ์อนุมัติได้'
              this.dialog = true
            } else {
              await this.$store.dispatch('snackbar', { text: 'ยื่นขอเบิกวัสดุคงคลังสำเร็จ' })
              this.$router.push('/parcel/withdraw/department/')
            }
          } catch (err) { return Promise.reject(err) }
        }else{
          this.submitChanged(form)
        }
      },
    }
  }
</script>

<style lang="scss">
  #parcel-withdraw-detail-page {
  }
</style>