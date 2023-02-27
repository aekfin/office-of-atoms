<template>
  <v-row class="type-brand-model-search">
    <v-col :cols="4">
      <AutocompleteDropdown :value.sync="typeId" itemValue="id" itemText="name" label="ประเภท *" apiPath="parcel/getListParcelType" :disabled="viewMode" :notCallMounted="viewMode"
        :items="typeList" searchApiPath="parcel/getParcelType" noFilter @select="onSelectType"/>
    </v-col>
    <v-col :cols="4">
      <AutocompleteDropdown :value.sync="brandId" :items="brandList" itemValue="id" itemText="name" label="ยี่ห้อ *" :disabled="!typeId || viewMode" @select="onSelectBrand"/>
    </v-col>
    <v-col :cols="4">
      <AutocompleteDropdown :value.sync="modelId" :items="modelList" itemValue="id" itemText="name" label="รุ่น *" :disabled="!typeId || viewMode"/>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    components: {
      AutocompleteDropdown: () => import('~/components/AutocompleteDropdown.vue'),
    },
    props: {
      type: { type: [String, Number] },
      brand: { type: [String, Number] },
      model: { type: [String, Number] },
      viewMode: { type: Boolean },
    },
    data () {
      return {
        typeId: '',
        brandId: '',
        modelId: '',
        typeList: [],
        brandList: [],
        modelList: [],
        typeRules: [
          v => !!v || 'โปรดเลือกประเภท',
        ],
        brandRules: [
          v => !!v || 'โปรดเลือกยี่ห้อ',
        ],
        modelRules: [
          v => !!v || 'โปรดเลือกรุ่น',
        ],
      }
    },
    watch: {
      'type' () {
        this.setData()
      },
      'brand' () {
        this.setData()
      },
      'model' () {
        this.setData()
      },
      'typeId' (val) {
        this.$emit('update:type', val)
      },
      'brandId' (val) {
        this.$emit('update:brand', val)
      },
      'modelId' (val) {
        this.$emit('update:model', val)
      },
    },
    mounted () {
      this.setData()
    },
    methods: {
      setData () {
        if (this.viewMode) {
          this.typeList = [this.type]
          this.brandList = [this.brand]
          this.modelList = [this.model]
          this.typeId = this.type?.id || ''
          this.brandId = this.brand?.id || ''
          this.modelId = this.model?.id || ''
        } else {
          this.typeId = this.type || ''
          this.brandId = this.brand || ''
          this.modelId = this.model || ''
        }
      },
      onSelectType ({ val, item }) {
        if (item) {
          this.brandList = item.listBrands
        } else {
          this.brandId = ''
          this.modelId = ''
          this.brandList = []
          this.modelList = []
        }
      },
      onSelectBrand ({ val, item }) {
        this.modelList = item?.listModels || []
      },
    }
  }
</script>

<style lang="scss">
  .type-brand-model-search {
  }
</style>