<template>
  <v-dialog v-model="val" contentClass="log-dialog" width="800">
    <v-card>
      <v-card-title class="text-h5 justify-space-between">
        <div><b>{{ title }}</b></div>
        <v-btn icon @click="val = false">
          <i class="material-icons">close</i>
        </v-btn>
      </v-card-title>
      <v-card-text class="black--text pt-2 text-body-1">
        <Loading v-if="isLoading"/>
        <template v-else>
          <v-data-table v-if="logList.length" :headers="headers" :items="logList" :itemsPerPage="Infinity" disableSort hideDefaultFooter class="elevation-1 mt-2" :loading="isLoading">
            <!-- <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template> -->
            <template #item.order="{ index }">{{ index + 1 }}</template>
            <template #item.createdDate="{ item }">
              <div>{{ $fn.displayDateTime(item.createdDate.replace('T', '')) }}</div>
            </template>
          </v-data-table>
          <div v-else class="text-center text-h6 pt-5 pb-8">{{ emptyText }}</div>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog> 
</template>

<script>
  export default {
    component: {
      Loading: () => import('~/components/Loading.vue'),
    },
    props: {
      value: { type: Boolean, required: true },
      logRoute: { type: Object },
      title: { type: String, default: 'ประวัติการแก้ไข' },
      emptyText: { type: String, default: 'ไม่พบประวัติการแก้ไข' },
    },
    data () {
      return {
        val: this.value,
        logList: [],
        isLoading: true,
        headers: [
          { text: 'ครั้งที่', value: 'order', width: '80px', align: 'center' },
          { text: 'แก้ไขเมื่อ', value: 'createdDate', width: '160px' },
          { text: 'แก้ไขโดย', value: 'createdBy' },
        ]
      }
    },
    watch: {
      'value' (val) {
        this.val = val
        if (this.val) this.getLog()
      },
      'val' (val) {
        this.$emit('update:value', val)
      },
    },
    methods: {
      async getLog () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', this.logRoute)
          this.logList = data
          this.isLoading = false
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
    },
  }
</script>

<style lang="scss">
  .log-dialog {
  }
</style>