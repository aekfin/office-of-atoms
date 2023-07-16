<template>
  <v-row class="number-durable-good">
    <v-col :cols="12" :md="3">
      <v-text-field v-model="number" label="เลขที่ครุภัณฑ์" :disabled="disabled" @input="changeQuery"/>
    </v-col>
    <v-col :cols="12" :md="3">
      <v-text-field v-model="serialNumber" label="หมายเลขซีเรียล" :disabled="disabled" @input="changeQuery"/>
    </v-col>
    <v-col :cols="12" :md="3">
      <v-text-field v-model="assetNumber" label="เลขที่สินทรัพย์" :disabled="disabled" @input="changeQuery"/>
    </v-col>
    <v-col :cols="12" :md="3">
      <v-text-field v-model="assetSubNumber" label="เลขที่สินทรัพย์ย่อย" :disabled="disabled" @input="changeQuery"/>
    </v-col>
    <v-col :cols="12" :md="3">
      <v-text-field v-model="assetNumberAorWor" label="เลขที่สินทรัพย์ อว." :disabled="disabled" @input="changeQuery"/>
    </v-col>
    <v-col :cols="12" :md="3">
      <v-text-field v-model="numberSubAorWor" label="เลขที่ อว.ย่อย." :disabled="disabled" @input="changeQuery"/>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    props: {
      propNumber: { type: String },
      propAssetNumber: { type: String },
      propAssetNumberAorWor: { type: String },
      propSerialNumber: { type: String },
      propAssetSubNumber: { type: String },
      propNumberSubAorWor: { type: String },
      disabled: { type: Boolean },
    },
    data () {
      return {
        number: this.propNumber || '',
        assetNumber: this.propAssetNumber || '',
        assetNumberAorWor: this.propAssetNumberAorWor || '',
        serialNumber: this.propSerialNumber || '',
        assetSubNumber: this.propAssetSubNumber || '',
        numberSubAorWor: this.propNumberSubAorWor || '',
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
        this.serialNumber = item.propSerialNumber
        this.assetSubNumber = item.propAssetSubNumber
        this.numberSubAorWor = item.propNumberSubAorWor
      },
      changeQuery () {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          const query = [
            { key: 'equipmentNumber', val: this.number },
            { key: 'assetNumber', val: this.assetNumber },
            { key: 'assetNumberAorWor', val: this.assetNumberAorWor },
            { key: 'serialNumber', val: this.serialNumber },
            { key: 'assetSubNumber', val: this.assetSubNumber },
            { key: 'numberSubAorWor', val: this.numberSubAorWor },
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