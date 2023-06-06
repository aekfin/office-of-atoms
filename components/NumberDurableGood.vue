<template>
  <v-row class="number-durable-good">
    <v-col :cols="12" :md="4">
      <v-text-field v-model="number" label="เลขที่ครุภัณฑ์" :disabled="disabled" @input="changeQuery"/>
    </v-col>
    <v-col :cols="12" :md="4">
      <v-text-field v-model="assetNumber" label="เลขที่สินทรัพย์" :disabled="disabled" @input="changeQuery"/>
    </v-col>
    <v-col :cols="12" :md="4">
      <v-text-field v-model="assetNumberAorWor" label="เลขที่สินทรัพย์ อว." :disabled="disabled" @input="changeQuery"/>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    props: {
      propNumber: { type: String },
      propAssetNumber: { type: String },
      propAssetNumberAorWor: { type: String },
      disabled: { type: Boolean },
    },
    data () {
      return {
        number: this.propNumber || '',
        assetNumber: this.propAssetNumber || '',
        assetNumberAorWor: this.propAssetNumberAorWor || '',
        timeout: null,
      }
    },
    watch: {
      'propNumber' (val) {
        this.number = val
      },
      'propAssetNumber' (val) {
        this.assetNumber = val
      },
      'propAssetNumberAorWor' (val) {
        this.assetNumberAorWor = val
      },
    },
    methods: {
      onlyUpdateFields (item) {
        this.number = item.number
        this.assetNumber = item.assetNumber
        this.assetNumberAorWor = item.assetNumberAorWor
      },
      changeQuery () {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          const query = [
            { key: 'equipmentNumber', val: this.number },
            { key: 'assetNumber', val: this.assetNumber },
            { key: 'assetNumberAorWor', val: this.assetNumberAorWor },
          ].reduce((obj, item) => item.val ? { ...obj, [item.key]: item.val } : obj, {})
          this.$emit('change', query)
        }, 1000)
      }
    }
  }
</script>

<style lang="scss">
  .number-durable-good {
  }
</style>