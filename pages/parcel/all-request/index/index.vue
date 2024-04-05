<template>
  <div id="parcel-request-page">
    <PageHeader text="วัสดุคงคลังที่รออนุมัติ" :total="total"/>
    <ParcelWithdrawTable :items="items" :getActionIconList="getActionIconList" :isLoading="isLoading"/>
    <Pagination/>
    <ConfirmDialog :value.sync="deleteDialog" title="แจ้งเตือน" text="ยืนยันจะทำการลบวัสดุคงคลังที่รออนุมัติหรือไม่" @submit="onDelete"/>
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
        isLoading: false,
        count: 0,
        total: 0,
        items: [],
        deleteDialog: false,        
        itemDelete: '',
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'parcel/getListAllPickUp', query: this.$route.query, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async onDelete () {
        // try {
        //   this.isLoading = true
        //   const { data } = await this.$store.dispatch('http', {apiPath: 'parcel/deletePickUpWithdraw/'+this.itemDelete})
        //   await this.getList()
        //   return Promise.resolve(data)
        // } catch (err) { return Promise.reject(err) }
      },
      handleDeleteAction (item) {
        this.deleteDialog = true
        this.itemDelete = item
      },
      getActionIconList (item) {
        const action = { path: `/parcel/all-request/${item.id}/` }
        return [
          { type: 'link', icon: 'edit', action },
          { type: 'delete', icon: 'delete', disable: (item.status != 'PENDING' ? true : false), action: () => { this.handleDeleteAction(item.id) } },
        ]
      },
    },
  }
</script>

<style lang="scss">
  #parcel-request-page {
  }
</style>