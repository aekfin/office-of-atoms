<template>
  <div id="management-parcel-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มค่าเริ่มต้นวัสดุคงคลัง' : 'การแก้ไขค่าเริ่มต้นวัสดุคงคลัง'" hideTotal/>
    <Loading v-if="isLoading"/>
    <v-form v-else ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row>
          <v-col :cols="12" :md="4" alignSelf="center">
            <AutocompleteDropdown :value.sync="form.typeId" :items="defaultItems" itemValue="id" itemText="name" label="ประเภท *" :rules="typeRules" apiPath="parcel/getListParcelType"
              searchApiPath="parcel/getParcelType" required noFilter/>
          </v-col>
          <v-col :cols="12" :md="8">
            <v-text-field v-model="form.name" label="ชื่อ *" :rules="nameRules" required/>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-if="isCreate" :cols="12" :md="4">
            <v-text-field v-model="form.price" label="ราคากลาง *" type="number" :rules="priceRules" required/>
          </v-col>
          <v-col :cols="12" :md="4">
            <v-text-field v-model="form.quantity" label="จำนวน *" type="number" :rules="quantityRules"  required/>
          </v-col>
          <v-col :cols="12" :md="4">
            <v-text-field v-model="form.classifier" label="หน่วย *" name="unit" :rules="classifierRules" required/>
          </v-col>
        </v-row>
      </v-container>
      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/management/parcel/')">ย้อนกลับ</v-btn>
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
      AutocompleteDropdown: () => import('~/components/AutocompleteDropdown.vue'),
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
        nameRules: [
          v => !!v || 'โปรดใส่ชื่อ',
        ],
        typeRules: [
          v => !!v || 'โปรดเลือกประเภท',
        ],
        classifierRules: [
          v => !!v || 'โปรดใส่หน่วย',
          v => v >= 1 || 'กรุณาใส่ค่ามากกว่า 0',
          v => /^[0-9]+$/.test(v) || 'กรุณาใส่ค่ามากกว่า 0' ,
        ],
        priceRules: [
          v => !!v || 'โปรดใส่ราคากลาง',
          v => v >= 1 || 'กรุณาใส่ค่ามากกว่า 0',
          v => /^[0-9]+$/.test(v) || 'กรุณาใส่ค่ามากกว่า 0' ,

        ],
        quantityRules: [
          v => !!v || 'โปรดใส่จำนวน',
          v => v >= 1 || 'กรุณาใส่ค่ามากกว่า 0',
          v => /^[0-9]+$/.test(v) || 'กรุณาใส่ค่ามากกว่า 0' ,
        
        ],
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.parcel_id === 'create'
      },
      disabledBrand () {
        return !this.form.typeId || !this.brandList.length
      },
      disabledModel () {
        return !this.form.brandId || !this.modelList.length
      },
    },
    mounted () {
      if (!this.isCreate) this.getData()
    },
    methods: {
      async getData () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: 'parcel/getLogImportParcelMasterById', query: { ...this.$route.query, id: this.$route.params.parcel_id } })
          this.form = {
            ...data,
            id: data.masterId,
            parcelMasterId: data.id,
          }
          this.defaultItems = [{ id: data.typeId, name: data.type }]
          this.isLoading = false
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      async onSubmit () {
        const valid = this.$refs.form.validate()
        try {
          if (valid) {
            const apiPath = this.isCreate ? 'parcel/importMasterAndStock' : 'parcel/editParcelMasters'
            const method = this.isCreate ? 'post' : 'patch'
            this.form.parcelName = this.form.name
            let form = this.isCreate ? { data: [{ ...this.form }] } : { ...this.form }
            const { data } = await this.$store.dispatch('http', { method, apiPath, data: form })
            if (!this.isCreate) await this.$store.dispatch('http', { method: 'patch', apiPath: 'parcel/editQuatityLogImportParcelMasters', data: { editQuantity: this.form.quantity, parcelMasterId: this.form.parcelMasterId } })
            await this.$store.dispatch('snackbar', { text: this.isCreate ? 'สร้างค่าเริ่มต้นวัสดุคงคลังสำเร็จ' : 'แก้ไขค่าเริ่มต้นวัสดุคงคลังสำเร็จ' })
            if (this.isCreate) this.$router.push('/management/parcel/')
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