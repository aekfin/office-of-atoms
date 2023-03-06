<template>
  <div id="parcel-request-page">
    <PageHeader text="วัสดุคงคลังที่รออนุมัติ (ภายนอกกลุ่ม)" :total="total"/>
    <ParcelWithdrawTable :items="items" :getActionIconList="getActionIconList" :isLoading="isLoading"/>
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'parcel/getListPickUp', query: this.$route.query, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'mdi-pencil', action: `/parcel/request/${item.id}/` },
        ]
      },
    },
  }
</script>

<style lang="scss">
  #parcel-request-page {
  }
</style>