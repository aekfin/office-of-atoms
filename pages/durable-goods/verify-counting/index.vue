<template>
  <div id="durable-goods-verify-counting-detail-page">
    <PageHeader text="ยืนยันการตรวจนับครุภัณฑ์" :total="total" :filters="filters"/>
    <div class="mt-10">
      <CountingDurableTable :items.sync="items" :paginationIndex="$store.state.paginationIndex || 0" :isLoading="isLoading" hasAction @approveCounting="onApproveCounting"/>
      <Pagination/>
    </div>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      CountingDurableTable: () => import('~/components/CountingDurableTable.vue'),
      Pagination: () => import('~/components/Pagination.vue'),
    },
    data () {
      return {
        isLoading: false,
        count: 0,
        total: 0,
        items: [],
        dialog: false,
      }
    },
    computed: {
      filters () {
        return [
          { param: 'ouId', name: 'กอง', itemText: 'ouName', apiPath: 'Orgchart/getOrganizations' },
          { param: 'departmentId', name: 'กลุ่ม', itemText: 'departmentName', apiPath: 'Orgchart/getDepartments' },
          { param: 'ownerId', name: 'บุคคล', itemText: this.$fn.getName, apiPath: 'user/listUsers' },
        ]
      },
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
          const apiPath = `equipment/getEquipments/treasury?${this.$store.getters.durableGoodCountableQuery}`
          const { data } = await this.$store.dispatch('getListPagination', { apiPath, query: { ...this.$route.query, isCheck: true }, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async onApproveCounting (item) {
        try {
          const { data } = await this.$store.dispatch('http', { apiPath: 'equipment/confirm', query: { id: item.id } })
          await this.$store.dispatch('snackbar', { text: `ยืนยันการตรวจนับครุภัณฑ์เลขที่ "${item.number}" สำเร็จ` })
          await this.getList()
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
    },
  }
</script>

<style lang="scss">
  #durable-goods-verify-counting-detail-page {
    padding-bottom: 20px;

    .text-body {
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 8px
    }
  }
</style>