<template>
  <div class="select-dropdown">
    <v-select ref="selector" v-model="val" :items="list" :itemValue="itemValue" :itemText="itemText" :label="label" :rules="rules" :required="required" :disabled="disabled" :loading="isLoading"
      @focus="onFocus">
      <template #append-item>
        <div id="bottom-of-scroll"/>
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
      async onFocus () {
        await this.$nextTick()
        setTimeout(() => {
          const menu = this.$refs?.selector?.$refs?.menu?.$refs?.content
          if (!this.initScroll && menu) {
            menu.addEventListener('scroll', e => this.onScroll(e, menu))
            this.initScroll = true
          }
        }, 250)
      },
      async getList (more = false) {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: this.apiPath })
          this.list = data.content || data
          if (data.content) this.pagination = data
          this.isLoading = false
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      onScroll (e, menu) {
        const bottom = menu.querySelector('#bottom-of-scroll')?.offsetTop
        if (bottom && (menu.offsetHeight + e.target.scrollTop > bottom)) {
          if (!this.isLoading) this.getList(true)
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