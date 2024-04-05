<template>
  <div id="durable-goods-repair-detail-page">
    <PageHeader text="ส่งซ่อมครุภัณฑ์" btnText="เพิ่มการส่งซ่อมครุภัณฑ์" createRoute="/durable-goods/repair/create/" :total="total" :filters="filters"/>
    <DurableGoodsRepairTable :items="items" :getActionIconList="getActionIconList" :isLoading="isLoading"/>
    <Pagination/>    
    <ConfirmDialog :value.sync="deleteDialog" title="แจ้งเตือน" text="ยืนยันจะทำการลบส่งซ่อมครุภัณฑ์หรือไม่" @submit="onDelete"/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      DurableGoodsRepairTable: () => import('~/components/DurableGoodsRepairTable.vue'),
      Pagination: () => import('~/components/Pagination.vue'),
    },
    data () {
      return {
        isLoading: true,
        count: 0,
        total: 0,
        items: [],
        deleteDialog: false,
        itemDelete: '',
        filters: [
          { type: 'textField',param: 'firstName',name: 'ผู้ขอส่งซ่อมครุภัณฑ์', },
          { type: 'textField',param: 'number',name: 'เลขที่ครุภัณฑ์'},
          { type: 'datePicker',param: 'dateBorrow',name: 'วันที่ส่งซ่อม', },
          { type: 'datePicker',param: 'dateApprove',name: 'วันที่ซ่อม', },
          { type: 'textField',param: 'equipmentName',name: 'ครุภัณฑ์' },
          { type: 'textField',param: 'ouName',name: 'ผู้ครอบครอง' },
          // {
          //   name: 'สถานะ',
          //   param: 'status',
          //   options: this.$store.getters.durableGoodSelectableOptions,
          // },
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'equipment/getListRequestFilter', query: { ...this.$route.query, types: 'REPAIR', isOwner: true }, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async onDelete () {
        // try {
        //   this.isLoading = true
        //   const { data } = await this.$store.dispatch('http', { method: 'get', apiPath: 'equipment/deleteEquipments/'+this.itemDelete})
        //   await this.getList()
        //   return Promise.resolve(data)
        // } catch (err) { return Promise.reject(err) }
      },
      handleDeleteAction (item) {
        this.deleteDialog = true
        this.itemDelete = item
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'edit', action: `/durable-goods/repair/${item.id}/` },
          { type: 'delete', icon: 'delete', disable: (item.status != 'PENDING' ? true : false), action: () => { this.handleDeleteAction(item.id) } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #durable-goods-repair-detail-page {
  }
</style>