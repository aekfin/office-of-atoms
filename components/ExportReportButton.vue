<template>
  <div class="export-report-button">
    <v-btn color="secondary" outlined elevation="2" @click="onExportReport">
      <slot>
        <div>{{ text }}</div>
      </slot>
    </v-btn>
  </div>
</template>

<script>
  export default {
    props: {
      apiPath: { type: String, required: true },
      query: { type: Object, default: () => {} },
      text: { type: String, default: 'Export Report' },
      name: { type: String, default: 'รายงาน' },
    },
    methods: {
      async onExportReport () {
        try {
          const query = { ...this.query, ...this.$route.query }
          delete query.pageNo
          const { data } = await this.$store.dispatch('http', { apiPath: this.apiPath, query })
          console.log('report ',data);
          const a = document.createElement('a')
          if(data.excel){
            a.href = data.excel
          }else{
            a.href = data
          }
          a.download = `${this.name}-${this.$fn.reportDate(new Date())}`
          a.click()
          // window.open(data, '_blank')
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
    }
  }
</script>

<style lang="scss">
  .export-report-button {
    display: flex;
    padding-right: 1%;
    .v-btn {
      text-transform: none;
    }
  }
</style>