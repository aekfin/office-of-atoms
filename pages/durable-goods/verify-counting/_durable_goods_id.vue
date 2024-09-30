<template>
  <div id="management-parcel-detail-page">
    <PageHeader :text="'การแก้ไขผู้ครอบครอง'" hideTotal/>
    <Loading v-if="isLoading"/>
    <v-form v-else ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row>
          <v-col>
            <DurableGoodsOwner :organization.sync="ouId" :department.sync="departmentId" :user.sync="ownerId" :disabled="isCreate" @ouChange="onOuChange">
            </DurableGoodsOwner> 
          </v-col>
        </v-row>
      </v-container>
      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/durable-goods/verify-counting/')">ย้อนกลับ</v-btn>
          <v-btn elevation="2" large color="success" @click="onSubmit">บันทึก</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
    },
    data () {
      return {
        valid: true,
        isLoading: false,
        form: {
          typeId: null,
          parcelName: '',
          classifier: '',
          quantity: 0,
          price: '',
        },
        defaultItems: [],
        ouId: '',
        departmentId: '',
        ownerId: '',
      }
    },
    computed: {
    },
    mounted () {
      this.getData()
    },
    methods: {
      async getData () {
        try {
          this.isLoading = true
          
        const { data } = await this.$store.dispatch('http', { apiPath: 'equipment/getEquipments/status/'+this.$route.params.durable_goods_id })
        
          this.ouId = data.organization.id
          this.departmentId = data.department.id
          this.ownerId = data.owner.id

          this.isLoading = false
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      async onSubmit () {
        const valid = this.$refs.form.validate()
        try {
          if (valid) {
            this.isLoading = true
            const apiPath = 'equipment/updateOwner'
            const method = 'patch'
            console.log('this.ouId',this.ouId);
            console.log('this.departmentId',this.departmentId);
            console.log('this.ownerId',this.ownerId);
            const form = {id: this.$route.params.durable_goods_id, ouId: this.ouId, departmentId: this.departmentId, ownerId: this.ownerId }
            const { data } = await this.$store.dispatch('http', { method, apiPath, data: form})
            await this.$store.dispatch('snackbar', { text: 'แก้ไขผู้ครอบครองสำเร็จ' })
            this.$router.push('/durable-goods/verify-counting/')
            return Promise.resolve(data)
          } else {
            return Promise.resolve()
          }
        } catch (err) { return Promise.reject(err) }
      },
    }
  }
</script>

<style lang="scss">
  #management-parcel-detail-page {

  }
</style>