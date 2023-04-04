<template>
  <div class="export-report-button" @click="onExportReport">
    <v-btn color="secondary" outlined elevation="2">
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
      text: { type: String, default: 'Export Report' },
    },
    methods: {
      async onExportReport () {
        try {
          const { data } = await this.$store.dispatch('http', { apiPath: 'report/donate' })
          window.open(data, '_blank');
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
    justify-content: flex-end;

    .v-btn {
      text-transform: none;
    }
  }
</style>