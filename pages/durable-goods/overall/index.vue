<template>
  <div id="durable-goods-page">
    <PageHeader text="บริหารครุภัณฑ์" btnText="เพิ่มครุภัณฑ์" createRoute="/durable-goods/overall/create/" :total="total" :filters="filters" 
      reportApiPath="report/depreciation" reportName="รายงานค่าเสื่อมครุภัณฑ์" exportText="รายงานค่าเสื่อมครุภัณฑ์"
      reportApiPath1="report/equipmentGF?registrationType=1" reportName1="พิมพ์ RFID มาตราฐาน" exportText1="พิมพ์ RFID มาตราฐาน"
      reportApiPath2="report/equipmentGF?registrationType=2" reportName2="พิมพ์ RFID ต่ำกว่าเกณฑ์" exportText2="พิมพ์ RFID ต่ำกว่าเกณฑ์"/>
      <!-- reportName="พิมพ์ RFID มาตราฐาน" exportText="รายงานค่าเสื่อมครุภัณฑ์"
      reportName="พิมพ์ RFID ต่ำกว่าเกณฑ์" exportText="รายงานค่าเสื่อมครุภัณฑ์" -->
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
            type: 'textField',
            name: 'เลขที่ครุภัณฑ์',
            param: 'equipmentNumber',
          },
          {
            type: 'textField',
            name: 'เลขที่สินทรัพย์',
            param: 'assetNumber',
          },
          {
            type: 'textField',
            name: 'เลขที่สินทรัพย์ อว.',
            param: 'assetNumberAorWor',
          },
          {
            type: 'textField',
            name: 'เลขที่สั่งซื้อสั่งจ้าง/เลขที่สัญญา',
            param: 'contractNumber',
          },
          {
            name: 'หมวดหมู่พัสดุ',
            param: 'majorCategoryId',
            apiPath: 'equipment/category/getMejorCategorys',
          },
          {
            name: 'ประเภทพัสดุ',
            param: 'subCategoryId',
            apiPath: 'equipment/category/getSubCategorys',
          },
          {
            name: 'รายการครุภัณฑ์',
            param: 'typeId',
            apiPath: 'equipment/category/types',
          },
          {
            name: 'ยี่ห้อ',
            param: 'brandId',
            apiPath: 'equipment/category/brands',
          },
          {
            name: 'รุ่น',
            param: 'modelId',
            apiPath: 'equipment/category/models',
          },
          {
            name: 'สถานะ',
            param: 'status',
            options: this.$store.getters.durableGoodSelectableOptions,
          },
          {
            name: 'กอง',
            param: 'ouId',
            apiPath: 'Orgchart/getOrganizations',
            itemText: 'ouName',
          },
          {
            name: 'กลุ่ม',
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
          { type: 'number',param: 'year',name: 'ปีงบประมาณ' },
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
          { type: 'confirm', icon: 'delete', action: () => { console.log('Confirm') } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #durable-goods-page {
  }
</style>