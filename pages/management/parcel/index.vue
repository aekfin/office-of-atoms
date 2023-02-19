<template>
  <div id="parcel-page">
    <PageHeader text="ค่าเริ่มต้นพัสดุ" btnText="เพิ่มค่าเริ่มต้นพัสดุ" createRoute="/management/parcel/create/" :total="total"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading">
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.price="{ item }">{{ $fn.getPrice(item.price || 0) }}</template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
    <Pagination/>
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
        headers: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'ชื่อ', value: 'name' },
          { text: 'ประเภท', value: 'typeName', width: '160px', align: 'center' },
          { text: 'ยี่ห้อ', value: 'brandName', width: '160px', align: 'center' },
          { text: 'รุ่น', value: 'modelName', width: '160px', align: 'center' },
          { text: 'ราคากลาง', value: 'price', align: 'center', width: '120px' },
          { text: 'จำนวน', value: 'count', align: 'center', width: '100px' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        items: [
          {
            id: 1,
            type: 1,
            name: 'โทรศัพท์มือถือ Nokia N95',
            category: 'โทรศัพท์มือถือ',
            subcategory: 'Nokia',
            count: 15,
            price: 1000,
          },
        ],
        types: {
          '1': 'พัสดุ',
          '2': 'ครุภัณฑ์'
        }
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'parcel/getListParcelMaster', query: this.$route.query, context: this })
          console.log(data)
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'mdi-pencil', action: `/management/parcel/${item.id}/` },
          { type: 'confirm', icon: 'mdi-delete', action: () => { console.log('Confirm') } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #parcel-page {
  }
</style>