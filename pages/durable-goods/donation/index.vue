<template>
  <div id="durable-goods-donation-page">
    <PageHeader text="การรับบริจาคครุภัณฑ์" btnText="เพิ่มการรับบริจาคครุภัณฑ์" createRoute="/durable-goods/donation/create/" :total="total" :filters="filters"/>
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
      <template #item.subEquipments="{ item }">
        <SubEquipmentColumn :item="item"/>
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
      SubEquipmentColumn: () => import('~/components/SubEquipmentColumn.vue'),
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
          { text: 'เลขที่เอกสาร', value: 'equipmentDonation.documentNumber', width: '160px', align: 'center' },
          { text: 'ชื่อผู้บริจาค', value: 'equipmentDonation.donator' },
          { text: 'เลขที่ครุภัณฑ์', value: 'number', width: '160px', align: 'center' },
          { text: 'ชื่อครุภัณฑ์', value: 'name' },
          { text: 'หมวดหมู่', value: 'majorCategory', width: '160px', align: 'center' },
          { text: 'ราคากลาง', value: 'price', align: 'center', width: '120px' },
          { text: 'ผู้ครอบครอง', value: 'organization.ouName', width: '120px', align: 'center' },
          { text: 'ครุภัณฑ์ย่อย', value: 'subEquipments', width: '120px', align: 'center' },
          { text: 'วันที่รับเข้า', value: 'dateEntry', align: 'center', width: '140px' },
          { text: 'เครื่องมือ', value: 'action', width: '120px', align: 'center' },
        ],
        filters: [
          { type: 'textField',param: 'equipmentNumber',name: 'เลขที่ครุภัณฑ์', },
          { type: 'textField',param: 'equipmentName',name: 'ชื่อครุภัณฑ์', },
          { 
            name: 'หมวดหมู่',
            param: 'majorCategoryId',
            apiPath: 'equipment/category/getMejorCategorys', 
          },
          { type: 'textField',param: 'price',name: 'ราคากลาง', },
          {
            id: 4,
            name: 'ประเภท',
            param: 'typeId',
            apiPath: 'parcel/getListParcelType',
          },
          { 
            name: 'ยี่ห้อ',
            param: 'brandId',
            apiPath: 'equipment/category/brands',
          },
          { 
            name: 'รุ่น',
            param: 'modelId',
            apiPath: 'equipment/category/models'
          },
          { 
            type: 'textField',
            param: 'price',
            name: 'ราคากลาง'
          },
          { type: 'textField',param: 'ouName',name: 'ผู้ครอบครอง' },
          { type: 'datePicker',param: 'dateEntry',name: 'วันที่รับเข้า' },
          { type: 'number',param: 'yearMin',name: 'ปีงบประมาณเริ่มต้น' },
          { type: 'number',param: 'yearMax',name: 'ปีงบประมาณสิ้นสุด' },
          { type: 'textField',param: 'status',name: 'สถานะ' }
        ]

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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'equipment/getEquipments/status', query: { ...this.$route.query, status: 'DONATE' }, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'edit', action: `/durable-goods/donation/${item.id}/` },
          // { type: 'confirm', icon: 'delete', action: () => { console.log('Confirm') } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #durable-goods-donation-page {
  }
</style>