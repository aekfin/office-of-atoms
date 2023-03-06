<template>
  <div id="parcel-withdraw-page">
    <PageHeader text="การเบิกวัสดุคงคลัง (ภายนอกกลุ่ม)" btnText="เพิ่มการเบิกวัสดุคงคลัง" createRoute="/parcel/withdraw/create/" :total="total"/>
    <ParcelWithdrawTable :items="items" :getActionIconList="getActionIconList" :isLoading="isLoading"/>
    <Pagination/>
  </div>
</template>

<script>
  export default {
    components: {
      ParcelWithdrawTabs: () => import('~/components/ParcelWithdrawTabs.vue'),
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'parcel/getListPickUp', query: { ...this.$route.query, isOwner: true }, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'mdi-pencil', action: `/parcel/withdraw/${item.id}/` },
          // { type: 'confirm', icon: 'mdi-delete', action: () => { console.log('Confirm') } },
        ]
      },
    },
  }
</script>

<style lang="scss">
  #parcel-withdraw-page {
  }
</style>