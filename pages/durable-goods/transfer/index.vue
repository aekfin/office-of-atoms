<template>
  <div id="durable-goods-transfer-detail-page">
    <PageHeader text="การโอนย้ายครุภัณฑ์" btnText="เพิ่มการโอนย้ายครุภัณฑ์" createRoute="/durable-goods/transfer/create/" :total="total" :filters="filters"/>
    <DurableGoodsTransferTable :items="items" :isLoading="isLoading" :getActionIconList="getActionIconList"/>
    <Pagination/>
    <ConfirmDialog :value.sync="deleteDialog" title="แจ้งเตือน" text="ยืนยันจะทำการลบการโอนย้ายครุภัณฑ์หรือไม่" @submit="onDelete"/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      DurableGoodsTransferTable: () => import('~/components/DurableGoodsTransferTable.vue'),
      Pagination: () => import('~/components/Pagination.vue'),
    },
    data () {
      return {
        isLoading: false,
        count: 0,
        total: 0,
        items: [],
        deleteDialog: false,
        itemDelete: '',
        filters: [
          { type: 'textField',param: 'number',name: 'เลขที่ครุภัณฑ์', },
          { type: 'textField',param: 'equipmentName',name: 'รายการครุภัณฑ์', },
          {
            name: 'ประเภท',
            param: 'subCategoryId',
            apiPath: 'equipment/category/getSubCategorys',
          },
          {
            name: 'ครุภัณฑ์',
            param: 'typeId',
            apiPath: 'equipment/category/types',
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'equipment/getListRequestFilter', query: { ...this.$route.query, isOwner: true, types: 'TRANSFER' }, context: this })
          console.log('getList data',data)
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async onDelete () {
        console.log('this.itemDelete ',this.itemDelete);
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', {apiPath: 'equipment/deleteTransfer/'+this.itemDelete})
          if('400' === data.status.code){
            await this.$store.dispatch('snackbar', { text: `Error : ${data.status.description}`, props: { color: 'red', top: true } })
          }
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
          { type: 'link', icon: 'edit', action: `/durable-goods/transfer/${item.id}/` },
          { type: 'delete', icon: 'delete', disable: (item.status != 'PENDING' ? true : false), action: () => { this.handleDeleteAction(item.id) } },
          // { type: 'confirm', icon: 'delete', action: () => { console.log('Confirm') } },
        ]
      },
    },
  }
</script>

<style lang="scss">
  #durable-goods-transfer-detail-page {
  }
</style>
