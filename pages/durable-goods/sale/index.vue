<template>
  <div id="durable-goods-sale-detail-page">
    <PageHeader text="จำหน่ายครุภัณฑ์" btnText="เพิ่มการจำหน่ายครุภัณฑ์" createRoute="/durable-goods/sale/create/" :total="total" :filters="filters"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading">
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.price="{ item }">{{ $fn.getPrice(item.equipmentSale.price || item.price) }}</template>
      <template #item.majorCategory="{ item }">
        <EquipmentColumn :item="item"/>
      </template>
      <template #item.organization.ouName="{ item }">
        <OwnerColumn :item="item"/>
      </template>
      <template #item.status="{ item }">
        <v-chip :color="$store.state.durableGoodStatusColor[item.status]">{{ $store.state.durableGoodStatus[item.status] }}</v-chip>
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
      ActionIconList: () => import('~/components/ActionIconList.vue'),
      EquipmentColumn: () => import('~/components/EquipmentColumn.vue'),
      OwnerColumn: () => import('~/components/OwnerColumn.vue'),
      Pagination: () => import('~/components/Pagination.vue'),
    },
    data () {
      return {
        isLoading: true,
        count: 0,
        total: 0,
        items: [],
        headers: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'เลขที่เอกสาร', value: 'documentNumber', width: '160px', align: 'center' },
          { text: 'เลขที่ครุภัณฑ์', value: 'number', width: '160px', align: 'center' },
          { text: 'ชื่อครุภัณฑ์', value: 'name' },
          { text: 'หมวดหมู่', value: 'majorCategory', width: '160px', align: 'center' },
          { text: 'ราคาจำหน่าย', value: 'price', align: 'center', width: '140px' },
          { text: 'ผู้ครอบครอง', value: 'organization.ouName', width: '120px', align: 'center' },
          { text: 'สถานะ', value: 'status', align: 'center', width: '120px' },
          { text: 'เครื่องมือ', value: 'action', width: '120px', align: 'center' },
        ],
        filters: [
          {
            type: 'textField',
            name: 'ชื่อครุภัณฑ์',
            param: 'equipmentName',
          },
          {
            type: 'textField',
            name: 'เลขที่ครุภัณฑ์',
            param: 'equipmentNumber',
          },
          {
            type: 'textField',
            name: 'เลขที่สินทรัพย์',
            param: 'assetNumber',
          },
          {
            type: 'textField',
            name: 'เลขที่สินทรัพย์ อว.',
            param: 'assetNumberAorWor',
          },
          {
            name: 'กลุ่ม',
            param: 'ouId',
            apiPath: 'Orgchart/getOrganizations',
            itemText: 'ouName',
          },
          {
            name: 'กอง',
            param: 'departmentId',
            apiPath: 'Orgchart/getDepartments',
            itemText: 'departmentName',
          },
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'equipment/getEquipments/status', query: { ...this.$route.query, status: 'SALE' }, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async deleteSale (itemIds) {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { method: 'post', apiPath: 'equipment/un-sale', data: { itemIds } })
          await this.getList()
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'edit', action: `/durable-goods/sale/${item.id}/` },
          { type: 'confirm', icon: 'delete', action: () => { this.deleteSale([item.id]) } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #durable-goods-sale-detail-page {
  }
</style>