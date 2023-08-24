<template>
  <div id="organization-page">
    <PageHeader text="บริหารกอง" hideTotal btnText="เพิ่มกอง"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="Infinity" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading">
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
    },
    data () {
      return {
        isLoading: true,
        count: 0,
        total: 0,
        items: [],
        headers: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'ชื่อกอง', value: 'ouName' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
      }
    },
    watch: {
      '$route.query' () {
        this.getList()
      }
    },
    mounted () {
      this.getList()
    },
    methods: {
      async getList () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: 'Orgchart/getOrganizations', query: this.$route.query })
          this.items = data
          this.count = data.length
          this.total = data.length
          this.$store.commit('SET_STATE', { name: 'paginationIndex', val: 0 })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'btn', icon: 'edit', action: () => { console.log('click') } },
        ]
      },
    },
  }
</script>

<style lang="scss">
  #organization-page {
  }
</style>