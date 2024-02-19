<template>
  <div id="durable-goods-verify-counting-detail-page">
    <PageHeader text="ประวัติการตรวจนับครุภัณฑ์" :total="total" :filters="filters"/>
    <div class="mt-10">
      <v-data-table :headers="headers" :items="items" :itemsPerPage="Infinity" disableSort hideDefaultFooter class="elevation-1" :loading="isLoading">
        <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
        <template #item.majorCategory="{ item }">
          <EquipmentColumn :item="item"/>
        </template>
        <template #item.organization="{ item }">
          <OwnerColumn :item="item"/>
        </template>
        <template #item.status_counting="{ item }">
          <div>{{ item.status_counting || 'ยังไม่ตรวจนับ' }}</div>
        </template>
        <template #item.checkDate="{ item }">
          <div>{{ $fn.displayDateTime(item.checkDate) }}</div>
        </template>
      </v-data-table>
      <Pagination/>
    </div>
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
        isLoading: false,
        count: 0,
        total: 0,
        items: [],
        dialog: false,
        headers: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'เลขที่ครุภัณฑ์', value: 'number', width: '128px', align: 'center' },
          { text: 'ชื่อครุภัณฑ์', value: 'name' },
          // { text: 'หมวดหมู่', value: 'majorCategory', width: '120px', align: 'center' },
          { text: 'ผู้ครอบครอง', value: 'organization', width: '120px', align: 'center' },
          { text: 'สถานะการตรวจนับ', value: 'status_counting', width: '220px', align: 'center' },
          { text: 'ตรวจนับเมื่อ', value: 'checkDate', width: '160px', align: 'center' },
        ]
      }
    },
    computed: {
      filters () {
        return [
          { type: 'textField',param: 'equipmentName',name: 'ชื่อครุภัณฑ์', },
          { type: 'datePicker',param: 'checkDate',name: 'วันที่ตรวจนับ' },
          { param: 'ouId', name: 'กอง', itemText: 'ouName', apiPath: 'Orgchart/getOrganizations' },
          { param: 'departmentId', name: 'กลุ่ม', itemText: 'departmentName', apiPath: 'Orgchart/getDepartments' },
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
          const apiPath = `equipment/getListHistoryCheckStock/`
          const { data } = await this.$store.dispatch('getListPagination', { apiPath, query: { ...this.$route.query, isCheck: true }, context: this })
          this.isLoading = false
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