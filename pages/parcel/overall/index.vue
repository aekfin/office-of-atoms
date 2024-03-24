<template>
  <div id="parcel-page">
    <PageHeader text="บริหารวัสดุคงคลัง" btnText="เพิ่มวัสดุคงคลัง" createRoute="/parcel/overall/create/" :total="total" :filters="filters"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading">
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.dateEntry="{ item }">
        <div>{{ $fn.displayDate(item.dateEntry) }}</div>
      </template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
    <Pagination/>
    <ConfirmDialog :value.sync="deleteDialog" title="แจ้งเตือน" text="ยืนยันจะทำการลบบริหารวัสดุคงคลังหรือไม่" @submit="onDelete"/>
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
        count: 0,
        total: 0,
        items: [],
        deleteDialog: false,        
        itemDelete: '',
        headers: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'โครงการ', value: 'projectName' },
          { text: 'กอง', value: 'ouName', width: '180px' },
          { text: 'วัสดุคงคลัง', value: 'parcelMasterName', width: '180px' },
          { text: 'จำนวนรับเข้าคลัง', value: 'quantity', width: '160px', align: 'center' },
          { text: 'วันที่รับเข้า', value: 'dateEntry', width: '140px', align: 'center' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        filters: [
          {
            type: 'textField',
            param: 'projectName',
            name: 'โครงการ',
          },
          {
            type:"textField",
            param: 'parcelMasterName',
            name: 'วัสดุคงคลัง'
          },          
          { type: 'number',param: 'yearMin',name: 'ปีงบประมาณเริ่มต้น' },
          { type: 'number',param: 'yearMax',name: 'ปีงบประมาณสิ้นสุด' }
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'parcel/getListParcelProject', query: this.$route.query, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async onDelete () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', {apiPath: 'parcel/deleteParcelProject/'+this.itemDelete})
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
          { type: 'link', icon: 'edit', action: `/parcel/overall/${item.id}/` },
          { type: 'delete', icon: 'delete', action: () => { this.handleDeleteAction(item.id) } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #parcel-page {
  }
</style>