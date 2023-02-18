<template>
  <div class="autocomplete-dropdown">
    <v-autocomplete ref="selector" v-model="val" :items="list" :itemValue="itemValue" :itemText="itemText" :label="label" :rules="rules" :required="required" :disabled="disabled"
      :loading="isLoading" :noFilter="noFilter" :searchInput.sync="search">
      <template #append-item>
        <div v-if="!!pagination" v-show="isShowLoading" id="bottom-of-scroll" v-intersect="onIntersect" class="pt-5 pb-5 text-center">Loading...</div>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
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
      noFilter: { type: Boolean },
    },
    data () {
      return {
        val: this.value,
        search: '',
        list: this.items || [],
        pagination: null,
        isLoading: false,
        initScroll: false,
        timeout: null,
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
        const item = this.list.find(item => item.id == val)
        this.$emit('select', { val, item })
      },
      'items' (val) {
        this.list = val
      },
      'search' () {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.onSearch()
        }, 1000)
      }
    },
    mounted () {
      if (this.apiPath) this.getList()
    },
    methods: {
      async getList (more = false) {
        try {
          this.isLoading = true
          const pageNo = more ? this.pagination.number + 1 : 0
          const { data } = await this.$store.dispatch('http', { apiPath: this.apiPath, query: { ...this.query, pageNo, pageSize: 7 } })
          if (data.content) {
            this.pagination = data
            this.list = more ? [ ...this.list, ...data.content ] : data.content 
          } else {
            this.list = data
          }
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
      async onSearch () {
        if (this.apiPath && !this.isLoading) {
          try {
            if (this.searchApiPath && this.search) {
              this.isLoading = true
              const { data } = await this.$store.dispatch('http', { apiPath: this.searchApiPath, query: { ...this.searchQuery, name: this.search } })
              this.list = data
              this.isLoading = false
            } else {
              await this.getList()
            }
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