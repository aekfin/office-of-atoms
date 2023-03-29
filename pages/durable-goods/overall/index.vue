<template>
  <div id="durable-goods-page">
    <PageHeader text="บริหารครุภัณฑ์" btnText="เพิ่มครุภัณฑ์" createRoute="/durable-goods/overall/create/" :total="total"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading">
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.price="{ item }">{{ $fn.getPrice(item.price) }}</template>
      <template #item.majorCategory="{ item }">
        <EquipmentColumn :item="item"/>
      </template>
      <template #item.organization.ouName="{ item }">
        <OwnerColumn :item="item"/>
      </template>
      <template #item.dateEntry="{ item }">
        <div>{{ $fn.displayDate(item.dateEntry) }}</div>
      </template>
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
      EquipmentColumn: () => import('~/components/EquipmentColumn.vue'),
      OwnerColumn: () => import('~/components/OwnerColumn.vue'),
      Pagination: () => import('~/components/Pagination.vue'),
    },
    data () {
      return {
        headers: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'โครงการ', value: 'project.projectName' },
          { text: 'ชื่อครุภัณฑ์', value: 'name', width: '180px' },
          { text: 'หมวดหมู่', value: 'majorCategory', width: '120px', align: 'center' },
          { text: 'ราคา', value: 'price', align: 'center', width: '120px' },
          { text: 'ผู้ครอบครอง', value: 'organization.ouName', width: '120px', align: 'center' },
          { text: 'วันที่รับเข้า', value: 'dateEntry', align: 'center', width: '140px' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        isLoading: true,
        count: 0,
        total: 0,
        items: [],
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'equipment/project/getEquipments', query: this.$route.query, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'edit', action: `/durable-goods/overall/${item.id}/` },
          // { type: 'confirm', icon: 'delete', action: () => { console.log('Confirm') } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #durable-goods-page {
  }
</style>