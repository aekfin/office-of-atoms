<template>
  <div id="parcel-summary-page">
    <PageHeader text="วัสดุคงคลังทั้งหมด" :total="total"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading">
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.price="{ item }">{{ $fn.getPrice(item.price || 0) }}</template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
    <Pagination/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      Pagination: () => import('~/components/Pagination.vue'),
    },
    data () {
      return {
        isLoading: true,
        total: 0,
        count: 0,
        originalHeaders: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'ชื่อวัสดุคงคลัง', value: 'name' },
          { text: 'ประเภท', value: 'type', width: '160px', align: 'center' },
          { text: 'หน่วย', value: 'classifier', align: 'center', width: '120px' },
          { text: 'จำนวน', value: 'quantity', align: 'center', width: '140px' },
        ],
        headers: [],
        items: [],
      }
    },
    watch: {
      '$route.query' () {
        this.getList()
      },
      '$store.getters.isTreasury' () {
        this.setHeader()
      },
    },
    mounted () {
      this.getList()
      this.setHeader()
    },
    methods: {
      async getList () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'parcel/getListParcelMaster', query: this.$route.query, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      setHeader () {
        this.headers = this.originalHeaders
        if (this.$store.getters.isTreasury) this.headers.push({ text: 'เครื่องมือ', value: 'action', width: '120px', align: 'center' })
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'edit', action: `/parcel/summary/${item.id}/` },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #parcel-summary-page {
  }
</style>