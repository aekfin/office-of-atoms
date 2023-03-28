<template>
  <v-row class="number-durable-good">
    <v-col :cols="12" :md="4">
      <v-text-field v-model="number" label="เลขที่ครุภัณฑ์" :disabled="disabled"/>
    </v-col>
    <v-col :cols="12" :md="4">
      <v-text-field v-model="number1" label="เลขที่สินทรัพย์" :disabled="disabled"/>
    </v-col>
    <v-col :cols="12" :md="4">
      <v-text-field v-model="number2" label="เลขที่สินทรัพย์ อว." :disabled="disabled"/>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    props: {
      propNumber: { type: String },
      propNumber1: { type: String },
      propNumber2: { type: String },
      disabled: { type: Boolean },
    },
    data () {
      return {
        number: this.propNumber || '',
        number1: this.propNumber1 || '',
        number2: this.propNumber2 || '',
        timeout: null,
      }
    },
    watch: {
      'propNumber' (val) {
        this.number = val
      },
      'propNumber1' (val) {
        this.number1 = val
      },
      'propNumber2' (val) {
        this.number2 = val
      },
      'number' () {
        this.changeQuery()
      },
      'number1' () {
        this.changeQuery()
      },
      'number2' () {
        this.changeQuery()
      }
    },
    methods: {
      changeQuery () {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          const query = [
            { key: 'number', val: this.number },
            { key: 'number1', val: this.number1 },
            { key: 'number2', val: this.number2 },
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