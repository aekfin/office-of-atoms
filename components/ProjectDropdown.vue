<template>
  <div class="project-dropdown">
    <v-autocomplete ref="selector" v-model="val" :items="list" :itemValue="itemValue" :itemText="itemText" :label="label" :rules="rules" :required="required" :disabled="disabled"
      :loading="isLoading" noFilter :searchInput.sync="search">
    </v-autocomplete>    
  </div>
</template>

<script>
  import _ from 'lodash'
  export default {
    props: {
      value: { type: [String, Number, Array], require: true },
      label: { type: String },
      itemValue: { type: String, default: 'id' },
      itemText: { type: String, default: 'name' },
      rules: { type: Array, default: () => [] },
      apiPath: { type: String },
      query: { type: Object, default: () => ({}) },
      required: { type: Boolean },
      disabled: { type: Boolean },
      readonly: { type: Boolean },
    },
    data () {
      return {
        val: this.value,
        search: '',
        list: this.items || [],
        pagination: null,
        isLoading: false,
        timeout: null,
      }
    },
    watch: {
      'value' (val) {
        this.val = val
      },
      'val' (val) {
        this.$emit('update:value', val)
        const item = this.list.find(item => item[this.itemValue] == val)
        this.$emit('select', { val, item })
      },
      'items' (val) {
        this.list = val
      },
      'search' () {
        if (this.val !== this.search) {
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            this.list = []
            this.getList()
          }, 1000)
        }
      },
      'query' (val, oldVal) {
        if (!_.isEqual(val, oldVal)) {
          this.getList()
        }
      }
    },
    mounted () {
      if (this.apiPath) this.getList()
    },
    methods: {
      async getList (more = false) {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: this.apiPath, query: { ...this.query, keyword: this.search || 1 } })
          this.list = data.content
          this.isLoading = false
          this.$emit('loaded', this.list)
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
    }
  }
</script>

<style lang="scss">
  .project-dropdown {
  }
</style>