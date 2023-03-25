<template>
  <div id="parcel-withdraw-page">
    <PageHeader text="การเบิกวัสดุคงคลัง (ภายในกลุ่ม)" btnText="เพิ่มการเบิกวัสดุคงคลัง" createRoute="/parcel/withdraw/department/create/" :total="total"/>
    <ParcelWithdrawTable :items="items" :getActionIconList="getActionIconList" :isLoading="isLoading" apiPath="parcel/department/getPickUp"/>
    <Pagination/>
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'parcel/department/getListPickUp', query: { ...this.$route.query, isOwner: true }, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'edit', action: `/parcel/withdraw/department/${item.id}/` },
          // { type: 'confirm', icon: 'delete', action: () => { console.log('Confirm') } },
        ]
      },
    },
  }
</script>

<style lang="scss">
  #parcel-withdraw-page {
  }
</style>