<template>
  <div id="durable-goods-page">
    <PageHeader text="ค่าเริ่มต้นครุภัณฑ์" btnText="เพิ่มค่าเริ่มต้นครุภัณฑ์" createRoute="/management/durable-goods/create/" :filters="filters" :total="total"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter 
    class="elevation-1 mt-6" :loading="isLoading"  >
   
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.price="{ item }">{{ $fn.getPrice(item.price) }}</template>
      <template #item.majorCategory="{ item }">
        <EquipmentColumn :item="item"/>
      </template>
      <template #item.organization.ouName="{ item }">
        <OwnerColumn :item="item"/>
      </template>
      <template #item.status="{ item }">
        <v-chip :color="$store.state.durableGoodStatusColor[item.status]">{{ $store.state.durableGoodStatus[item.status] }}</v-chip>
      </template>
      <template #item.subEquipments="{ item }">
        <SubEquipmentColumn :item="item"/>
      </template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
    <Pagination/>
    <ConfirmDialog :value.sync="deleteDialog" title="แจ้งเตือน" text="ยืนยันจะทำการลบค่าเริ่มต้นครุภัณฑ์หรือไม่" @submit="onDelete"/>
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
        search: '',
        deleteDialog: false,
        itemDelete: '',
        headers: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'เลขที่ครุภัณฑ์', value: 'number', width: '160px', align: 'center' },
          { text: 'ชื่อครุภัณฑ์', value: 'name', width: '200px' },
          { text: 'หมวดหมู่', value: 'majorCategory', width: '160px', align: 'center' },
          { text: 'ราคากลาง', value: 'price', align: 'center', width: '120px' },
          { text: 'ผู้ครอบครอง', value: 'organization.ouName', width: '120px', align: 'center' },
          { text: 'ครุภัณฑ์ย่อย', value: 'subEquipments', width: '120px', align: 'center' },
          { text: 'สถานะ', value: 'status', align: 'center', width: '100px' },
          { text: 'เครื่องมือ', value: 'action', width: '120px', align: 'center' },
        ],
        filters: [
          { type: 'textField',param: 'number',name: 'เลขที่ครุภัณฑ์' },
          { type: 'textField',param: 'name',name: 'ชื่อครุภัณฑ์' },
          { 
            name: 'หมวดหมู่',
            param: 'majorCategoryId',
            apiPath: 'equipment/category/getMejorCategorys', 
          },
          {
            name: 'รายการครุภัณฑ์',
            param: 'typeId',
            apiPath: 'equipment/category/types',
          },
          { 
            name: 'ยี่ห้อ',
            param: 'brandId',
            apiPath: 'equipment/category/brands',},

          { 
            name: 'รุ่น',
            param: 'modelId',
            apiPath: 'equipment/category/models'
          },
          { type: 'textField',param: 'ouName',name: 'ผู้ครอบครอง' },
          // { type: 'textField',param: 'status',name: 'สถานะ' }
          {
            name: 'สถานะ',
            param: 'status',
            options: this.$store.getters.durableGoodSelectableOptions,
          },
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'equipment/getEquipments', query: { ...this.$route.query, pageSize: 10 }, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async onDelete () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { method: 'get', apiPath: '/equipment/deleteEquipments/'+this.itemDelete})
          await this.getList()
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      handleDeleteAction (item) {
        this.deleteDialog = true
        this.itemDelete = item
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'edit', action: `/management/durable-goods/${item.id}/` },
          { type: 'delete', icon: 'delete', disable: (item.status != 'RESERVE' ? true : false), action: () => { this.handleDeleteAction(item.id) } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #durable-goods-page {
  }
</style>