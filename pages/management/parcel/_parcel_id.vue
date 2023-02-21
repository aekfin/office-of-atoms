<template>
  <div id="management-parcel-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มค่าเริ่มต้นพัสดุ' : 'การแก้ไขค่าเริ่มต้นพัสดุ'" hideTotal/>
    <v-form ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row>
          <v-col :cols="4" alignSelf="center">
            <AutocompleteDropdown v-if="isCreate" :value.sync="form.typeId" itemValue="id" itemText="name" label="ประเภท *" :rules="typeRules" apiPath="parcel/getListParcelType"
              searchApiPath="parcel/getParcelType" required noFilter @select="onSelectType"/>
            <v-text-field v-else v-model="form.type" label="ประเภท *" required disabled/>
          </v-col>
          <v-col :cols="4">
            <AutocompleteDropdown v-if="isCreate" :value.sync="form.brandId" :items="brandList" itemValue="id" itemText="name" label="ยี่ห้อ *" :rules="brandRules" required :disabled="disabledBrand" @select="onSelectBrand"/>
            <v-text-field v-else v-model="form.brand" label="ยี่ห้อ *" required disabled/>
          </v-col>
          <v-col :cols="4">
            <AutocompleteDropdown v-if="isCreate" :value.sync="form.modeId" :items="modelList" itemValue="id" itemText="name" label="รุ่น *" :rules="modelRules" required :disabled="disabledModel"/>
            <v-text-field v-else v-model="form.model" label="รุ่น *" required disabled/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="8">
            <v-text-field v-model="form.parcelName" name="parcel-name" label="ชื่อ *" :rules="nameRules" required/>
          </v-col>
          <v-col :cols="4">
            <v-text-field v-model="form.classifier" label="หน่วย *" name="unit" :rules="classifierRules" required/>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-if="isCreate" :cols="5">
            <v-text-field v-model="form.price" label="ราคากลาง *" type="number" :rules="priceRules" required/>
          </v-col>
          <v-col :cols="3">
            <v-text-field v-model="form.quantity" label="จำนวน *" type="number" :rules="quantityRules" required :disabled="!isCreate"/>
          </v-col>
        </v-row>
      </v-container>
      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/management/parcel/')">ย้อนหลับ</v-btn>
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
        form: {
          typeId: null,
          brandId: null,
          modeId: null,
          parcelName: '',
          classifier: '',
          quantity: 0,
          price: '',
        },
        brandList: [],
        modelList: [],
        nameRules: [
          v => !!v || 'โปรดใส่ชื่อ',
        ],
        typeRules: [
          v => !!v || 'โปรดเลือกประเภท',
        ],
        brandRules: [
          v => !!v || 'โปรดเลือกยี่ห้อ',
        ],
        modelRules: [
          v => !!v || 'โปรดเลือกรุ่น',
        ],
        classifierRules: [
          v => !!v || 'โปรดใส่หน่วย',
        ],
        priceRules: [
          v => !!v || 'โปรดใส่ราคากลาง',
        ],
        quantityRules: [
          v => !!v || 'โปรดใส่จำนวน',
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
          const { data } = await this.$store.dispatch('http', { apiPath: 'parcel/getParcelMaster', query: { ...this.$route.query, id: this.$route.params.parcel_id } })
          this.form = {
            ...data,
            parcelName: data.name
          }
          this.isLoading = false
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      onSelectType ({ val, item }) {
        if (item) {
          this.brandList = item.listBrands
        } else {
          this.brandList = []
          this.modelList = []
        }
      },
      onSelectBrand ({ val, item }) {
        this.modelList = item?.listModels || []
      },
      async onSubmit () {
        const valid = this.$refs.form.validate()
        try {
          if (valid) {
            const apiPath = this.isCreate ? 'parcel/importMasterAndStock' : ''
            const method = this.isCreate ? 'post' : 'patch'
            const form = { data: [{ ...this.form }] }
            const { data } = await this.$store.dispatch('http', { method, apiPath, data: form })
            await this.$store.dispatch('snackbar', { text: this.isCreate ? 'สร้างค่าเริ่มต้นพัสดุสำเร็จ' : 'แก้ไขค่าเริ่มต้นพัสดุสำเร็จ' })
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