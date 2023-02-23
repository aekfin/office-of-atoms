<template>
  <div id="parcel-page">
    <PageHeader text="บริหารพัสดุ" btnText="เพิ่มพัสดุ" createRoute="/parcel/overall/create/"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6">
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.dateEntry="{ item }">
        <div>{{ $moment(item.datetimeCreate).format('DD-MM-YYYY') }}</div>
      </template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
    },
    data () {
      return {
        isLoading: true,
        headers: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'โครงการ', value: 'projectName' },
          { text: 'กอง', value: 'ouName', width: '180px' },
          { text: 'พัสดุ', value: 'parcelMasterName', width: '180px' },
          { text: 'จำนวนรับเข้าคลัง', value: 'quantity', width: '160px', align: 'center' },
          { text: 'วันที่รับเข้า', value: 'dateEntry', width: '140px', align: 'center' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'parcel/getListParcelProject', query: this.$route.query, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'mdi-pencil', action: `/parcel/overall/${item.id}/` },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #parcel-page {
  }
</style>