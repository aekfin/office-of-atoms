<template>
  <div id="parcel-page">
    <PageHeader text="ค่าเริ่มต้นวัสดุคงคลัง" btnText="เพิ่มค่าเริ่มต้นวัสดุคงคลัง" createRoute="/management/parcel/create/" :total="total" :filters="filters"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter 
    class="elevation-1 mt-6" :loading="isLoading"   >
  
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.price="{ item }">{{ $fn.getPrice(item.price || 0) }}</template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
    <Pagination/>
    <ConfirmDialog :value.sync="deleteDialog" title="แจ้งเตือน" text="ยืนยันจะทำการลบค่าเริ่มต้นวัสดุคงคลังหรือไม่" @submit="onDelete"/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      ActionIconList: () => import('~/components/ActionIconList.vue'),
      Pagination: () => import('~/components/Pagination.vue'),
    },
    data () {
      return {
        isLoading: true,
        total: 0,
        count: 0,
        search: '',
        deleteDialog: false,
        itemDelete: '',
        headers: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'ชื่อวัสดุคงคลัง', value: 'name' },
          { text: 'ประเภท', value: 'type', width: '160px', align: 'center' },
          { text: 'จำนวน', value: 'quantity', align: 'center', width: '140px' },
          { text: 'หน่วย', value: 'classifier', align: 'center', width: '120px' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        items: [],
        filters: [
          {
            type: 'textField',
            param: 'name',
            name: 'ชื่อวัสดุคงคลัง',
          },
          {
            name: 'ประเภท',
            param: 'typeId',
            apiPath: 'parcel/getListParcelType',
          }
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'parcel/getLogImportParcelMasters', query: { ...this.$route.query, pageSize: 10 }, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async onDelete () {
        try {
          console.log('this.itemDelete ',this.itemDelete)
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', {apiPath: '/parcel/deleteParcelMasters/'+this.itemDelete})
          await this.getList()
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      handleDeleteAction (item) {
        this.deleteDialog = true
        console.log('id ',item);
        this.itemDelete = item
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'edit', action: `/management/parcel/${item.id}/` },
          { type: 'delete', icon: 'delete', action: () => { this.handleDeleteAction(item.masterId) } },
          // { type: 'confirm', icon: 'delete', action: () => { console.log('Confirm') } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #parcel-page {
  }
</style>