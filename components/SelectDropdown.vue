<template>
  <div class="select-dropdown">
    <v-select ref="selector" v-model="val" :items="list" :itemValue="itemValue" :itemText="itemText" :label="label" :rules="rules" :required="required" :disabled="disabled" :loading="isLoading">
      <template #append-item>
        <div v-if="!!pagination" v-show="isShowLoading" id="bottom-of-scroll" v-intersect="onIntersect" class="pt-5 pb-5 text-center">Loading...</div>
      </template>
    </v-select>
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
      required: { type: Boolean },
      disabled: { type: Boolean },
    },
    data () {
      return {
        val: this.value,
        list: this.items || [],
        pagination: null,
        isLoading: false,
        initScroll: false,
      }
    },
    computed: {
      isShowLoading () {
        return this.pagination && this.pagination.last === false
      }
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
    },
    mounted () {
      if (this.apiPath) this.getList()
    },
    methods: {
      async getList (more = false) {
        try {
          this.isLoading = true
          const pageNo = more ? this.pagination.number + 1 : 0
          const { data } = await this.$store.dispatch('http', { apiPath: this.apiPath, query: { pageNo, pageSize: 7 } })
          if (data.content) {
            this.pagination = data
            this.list = more ? [ ...this.list, ...data.content ] : data.content 
          } else {
            this.list = data
          }
          this.isLoading = false
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      onIntersect (entries, observer, isIntersecting) {
        if (this.pagination && isIntersecting && this.pagination.last === false && !this.isLoading) {
          this.getList(true)
        }
      },
    },
  }
</script>

<style lang="scss">
  .select-dropdown {
    width: 100%;
  }
</style>