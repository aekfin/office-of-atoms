<template>
  <div class="pagination mt-7">
    <v-pagination v-model="page" :length="totalPages" nextIcon="keyboard_arrow_right" prevIcon="keyboard_arrow_left" @input="onInput"/>
  </div>
</template>

<script>
  export default {
    props: {
      pagination: { type: Object, default () { return this.$store.state.pagination } },
      isState: { type: Boolean, default: true },
    },
    data () {
      return {
        page: (this.pagination?.number || 0) + 1,
        totalPages: this.pagination?.totalPages || 1,
      }
    },
    watch: {
      '$store.state.pagination' (val, oldVal) {
        if (this.isState) this.setPagination(val)
      },
      'pagination' (val) {
        this.setPagination(val)
      }
    },
    methods: {
      onInput (val) {
        if (this.isState) {
          this.$router.push({ query: { ...this.$route.query, pageNo: val - 1 } })
        }
        this.$emit('change', val - 1)
      },
      setPagination (pagination) {
        this.page = (pagination?.number || 0) + 1
        this.totalPages = pagination?.totalPages || 1
      }
    }
  }
</script>

<style lang="scss">
  .pagination {
  }
</style>