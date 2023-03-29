<template>
  <div class="autocomplete-dropdown">
    <v-autocomplete ref="selector" v-model="val" :items="list" :itemValue="itemValue" :itemText="itemText" :label="label" :rules="rules" :required="required" :disabled="disabled || disabledOnload"
      :readonly="readonly" :loading="isLoading || isSearchLoading" :noFilter="noFilter" :hideNoData="isSearchLoading" :searchInput.sync="search" appendIcon="keyboard_arrow_down" @change="onChange">
      <template #append-item>
        <div v-if="!!pagination && !searchChanged" v-show="isShowLoading" id="bottom-of-scroll" v-intersect="onIntersect" class="pt-5 pb-5 text-center">Loading...</div>
      </template>
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
      items: { type: Array, default: () => [] },
      apiPath: { type: String },
      query: { type: Object, default: () => ({}) },
      searchApiPath: { type: String },
      searchQuery: { type: Object, default: () => ({}) },
      required: { type: Boolean },
      disabled: { type: Boolean },
      readonly: { type: Boolean },
      noFilter: { type: Boolean },
      notCallMounted: { type: Boolean },
    },
    data () {
      return {
        val: this.value,
        search: '',
        searchChanged: '',
        list: this.items || [],
        pagination: null,
        isLoading: false,
        isSearchLoading: false,
        initScroll: false,
        timeout: null,
        disabledOnload: false,
      }
    },
    computed: {
      isShowLoading () {
        return this.pagination && this.pagination.last === false
      },
    },
    watch: {
      'value' (val) {
        this.val = val
      },
      'val' (val) {
        this.$emit('update:value', val)
      },
      'items' (val) {
        this.list = val
      },
      'search' (val) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.searchChanged = val
          this.onSearch()
        }, 1000)
      },
      async 'query' (val, oldVal) {
        if (!_.isEqual(val, oldVal)) {
          this.disabledOnload = true
          this.val = null
          await this.getList()
          this.disabledOnload = false
        }
      },
    },
    mounted () {
      if (this.apiPath && !this.notCallMounted) this.getList()
    },
    methods: {
      async getList (more = false) {
        try {
          this.isLoading = true
          const pageNo = more ? this.pagination.number + 1 : 0
          const { data } = await this.$store.dispatch('http', { apiPath: this.apiPath, query: { ...this.query, pageNo, pageSize: 7 } })
          if (data.content) {
            this.pagination = data
            this.list = more || this.items.length ? [ ...this.items, ...this.list, ...data.content ] : data.content 
          } else {
            this.list = data
          }
          const item = this.list.find(item => item[this.itemValue] == this.val)
          if (!item) this.val = null
          this.isLoading = false
          this.$emit('loaded', this.list)
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      onIntersect (entries, observer, isIntersecting) {
        if (this.pagination && isIntersecting && this.pagination.last === false && !this.isLoading) {
          this.getList(true)
        }
      },
      onChange (val) {
        const item = this.list.find(item => item[this.itemValue] == val)
        this.$emit('select', { val, item })
      },
      async onSearch () {
        const item = this.list.find(item => item[this.itemValue] == this.val)
        const isSameKeyword = item && (this.search === item[this.itemText])
        if (this.apiPath && !this.isSearchLoading && !isSameKeyword) {
          try {
            this.isSearchLoading = true
            if (this.searchApiPath && this.search) {
              const { data } = await this.$store.dispatch('http', { apiPath: this.searchApiPath, query: { ...this.searchQuery, name: this.search } })
              this.list = data
            } else {
              await this.getList()
            }
            this.isSearchLoading = false
            return Promise.resolve()
          } catch (err) {
            return Promise.reject(err)
          }
        }
      },
    },
  }
</script>

<style lang="scss">
  .autocomplete-dropdown {
    width: 100%;
  }
</style>