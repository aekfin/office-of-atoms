<template>
  <div id="parcel-withdraw-page">
    <PageHeader text="การเบิกวัสดุคงคลัง" btnText="เพิ่มการเบิกวัสดุคงคลัง" createRoute="/parcel/withdraw/create/" :total="total"/>
    <ParcelWithdrawTable :items="items" :getActionIconList="getActionIconList" :isLoading="isLoading"/>    
    <Pagination/>
    <ConfirmDialog :value.sync="deleteDialog" title="แจ้งเตือน" text="ยืนยันจะทำการลบการเบิกวัสดุคงคลังหรือไม่" @submit="onDelete"/>
  </div>
</template>

<script>
  export default {
    components: {
      ParcelWithdrawTable: () => import('~/components/ParcelWithdrawTable.vue'),
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'parcel/getListPickUp', query: { ...this.$route.query, isOwner: true }, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async onDelete () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', {apiPath: 'parcel/deletePickUpWithdraw/'+this.itemDelete})
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
          { type: 'link', icon: 'edit', action: `/parcel/withdraw/${item.id}/` },
          { type: 'delete', icon: 'delete', disable: (item.status != 'PENDING' ? true : false), action: () => { this.handleDeleteAction(item.id) } },
        ]
      },
    },
  }
</script>

<style lang="scss">
  #parcel-withdraw-page {
  }
</style>