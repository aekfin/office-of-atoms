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
      <AutocompleteDropdown :value.sync="modelId" :items="modelList" itemValue="id" itemText="name" label="รุ่น *" :disabled="!brandId || viewMode"/>
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
      item: { type: Object },
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
          this.typeList = [this.item._type]
          this.brandList = [this.item._brand]
          this.modelList = [this.item._model]
        }
        this.typeId = this.type || ''
        this.brandId = this.brand || ''
        this.modelId = this.model || ''
      },
      onSelectType ({ val, item }) {
        if (item) {
          this.brandList = item.listBrands
        } else {
          this.brandList = []
          this.modelList = []
        }
        this.brandId = ''
        this.modelId = ''
      },
      onSelectBrand ({ val, item }) {
        this.modelList = item?.listModels || []
        this.modelId = ''
      },
    }
  }
</script>

<style lang="scss">
  .type-brand-model-search {
  }
</style>