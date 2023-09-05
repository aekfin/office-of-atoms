<template>
  <div id="durable-goods-page">
    <PageHeader text="บริหารครุภัณฑ์" btnText="เพิ่มครุภัณฑ์" createRoute="/durable-goods/overall/create/" :total="total" :filters="filters" reportApiPath="report/depreciation" name="รายงานค่าเสื่อมครุภัณฑ์"/>
    <DurableGoodsTable :items="items" :isLoading="isLoading" :getActionIconList="getActionIconList"/>
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
        isLoading: true,
        count: 0,
        total: 0,
        items: [],
        filters: [
          {
            type: 'textField',
            name: 'ชื่อโครงการ',
            param: 'projectName',
          },
          {
            type: 'textField',
            name: 'ชื่อครุภัณฑ์',
            param: 'equipmentName',
          },
          {
            name: 'กลุ่ม',
            param: 'ouId',
            apiPath: 'Orgchart/getOrganizations',
            itemText: 'ouName',
          },
          {
            name: 'กอง',
            param: 'departmentId',
            apiPath: 'Orgchart/getDepartments',
            itemText: 'departmentName',
          },
          {
            name: 'ประเภททะเบียนครุภัณฑ์',
            param: 'registrationType',
            options: [
              { id: '1', name: 'มาตราฐาน' },
              { id: '2', name: 'ต่ำกว่าเกณฑ์' },
            ]
          },
        ],
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'equipment/project/getEquipments', query: this.$route.query, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'edit', action: `/durable-goods/overall/${item.id}/` },
          // { type: 'confirm', icon: 'delete', action: () => { console.log('Confirm') } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #durable-goods-page {
  }
</style>