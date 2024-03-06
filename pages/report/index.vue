<template>
  <div id="report-page">
    <PageHeader text="รายงานทั้งหมด" hideTotal/>
    <v-container>
      <div class="mt-10">
        <SelectDropdown :value.sync="group" :items="reportGroup" label="ประเภทของรายงาน"/>
      </div>
      <div class="mt-10">
        <AutocompleteDropdown :value.sync="selectedId" :items="displayReportList" label="เลือกรายงาน" @select="onSelectReport"/>
      </div>
      <div class="mt-5">
        <PageHeader text="" hideTotal :filters="selectedFilters"/>
      </div>
      <div class="mt-10 report-button">
        <ExportReportButton v-if="selectedReport" :apiPath="selectedReport.apiPath" :name="selectedReport.name"/>
        <template>
          <div v-if="showBtn">
            <v-btn color="secondary" outlined elevation="2" @click="onDisplayTable">
              <slot>
                <div>แสดงข้อมูล</div>
              </slot>
            </v-btn>
          </div>
        </template>
      </div>
      <div class="mt-10">
        <ReportTable v-if="selectedReport" :columnList="columnList" :valueList="valueList" :showTable="showTable"/>
      </div>
    </v-container>
  </div>
</template>

<script>
import ReportTable from '~/components/ReportTable.vue'

  export default {
    components: {
    PageHeader: () => import('~/components/PageHeader.vue'),
    ExportReportButton: () => import('~/components/ExportReportButton.vue'),
    ReportTable: () => import('~/components/ReportTable.vue'),
},
    data () {
      return {
        isLoading: false,
        group: 0,
        selectedId: 1,
        selectedReport: null,
        selectedFilters: [],
        reportGroup: [
          { id: 0, name: 'ทั้งหมด', types: [] },
          { id: 1, name: 'หมวดหมู่วัสดุคงคลัง', types: [1, 2, 3, 4] },
          { id: 2, name: 'หมวดหมู่ครุภัณฑ์', types: [5, 6, 7, 8, 14, 15, 16, 17, 18, 19, 20, 21, 22] },
          { id: 3, name: 'จัดซื้อจัดจ้าง', types: [10, 11] },
          { id: 4, name: 'แผนงาน โครงการ', types: [9, 12, 13] },
        ],
        columnList: [],
        valueList: [],
        showTable: false,
        showBtn: false,
        reportList: [
          {
            id: 1,
            name: 'รายงานวัสดุคงคลัง',
            apiPath: 'report/pacelAll',
            filters: [2, 3, 4, 5],
          },
          {
            id: 2,
            name: 'รายงานเบิกจ่ายวัสดุคงคลังตามหน่วยงาน',
            apiPath: 'report/pacelWithOu',
            filters: [2, 3, 4, 5, 14],
          },
          {
            id: 3,
            name: 'รายงานตรวจนับวัสดุคงคลัง',
            apiPath: 'report/pacelVerificationReport',
            filters: [4, 5],
          },
          {
            id: 4,
            name: 'รายงานพัสดุถึงจุดสั่งชื้อ',
            apiPath: 'report/parcelMinnimumStock',
            filters: [4, 5],
          },
          {
            id: 5,
            name: 'รายงานการยืมคืนครุภัณฑ์',
            apiPath: 'report/borrowAndReturn',
            filters: [2, 3, 14, 15, 6, 17, 18],
          },
          {
            id: 6,
            name: 'รายงานการโอนย้ายครุภัณฑ์',
            apiPath: 'report/transfer',
            filters: [2, 3, 14, 15, 6, 7, 8],
          },
          {
            id: 7,
            name: 'รายงานการจำหน่ายครุภัณฑ์',
            apiPath: 'report/sale',
            filters: [2, 3, 20, 15, 6, 7, 19, 21],
          },
          {
            id: 8,
            name: 'รายงานการรอคืนหลักประกัน',
            apiPath: 'report/project',
            filters: [2, 3, 22, 23, 24, 25, 26],
          },
          {
            id: 9,
            name: 'รายงานโครงการ',
            apiPath: 'report/projectWithEquipment',
            filters: [2, 3, 22, 27, 26, 28],
          },
          {
            id: 10,
            name: 'รายงานสถิติการจัดซื้อจัดจ้าง',
            apiPath: 'report/procurementSummary',
            filters: [2, 3, 22, 26, 29, 23],
          },
          {
            id: 11,
            name: 'รายงานโครงการจัดซื้อจัดจ้างที่ยังไม่เสร็จสิ้น',
            apiPath: 'report/procurementSummary-non-complete',
            filters: [2, 3, 22, 26, 29, 23],
          },
          {
            id: 12,
            name: 'รายงานติดตามสถานะการดำเนินการโครงการ',
            apiPath: 'report/procurementSummary',
            filters: [2, 3, 22, 26, 29, 23],
          },
          {
            id: 13,
            name: 'รายงานโครงการที่ได้รับการจัดซื้อจัดจ้าง',
            apiPath: 'report/procurementSummary',
            filters: [2, 3, 22, 26, 29, 23],
          },
          {
            id: 14,
            name: 'รายงานสินทรัพย์ที่มีการจำหน่ายพร้อมค่าเสื่อม',
            apiPath: 'report/saleReportAndDepreciation',
            filters: [2, 3, 20, 15, 19, 21, 6, 7],
          },
          {
            id: 15,
            name: 'รายงานการรับบริจาคครุภัณฑ์',
            apiPath: 'report/donate',
            filters: [2, 3, 20, 15, 30, 31, 6],
          },
          {
            id: 16,
            name: 'รายงานค่าเสื่อมครุภัณฑ์',
            apiPath: 'report/depreciation',
            filters: [2, 3, 20, 15, 6, 7, 8],
          },
          {
            id: 17,
            name: 'รายงานครุภัณฑ์ชนGFMIS',
            apiPath: 'report/equipment',
            filters: [2, 3, 14, 15, 7, 8, 9, 10, 11, 12, 13],
          },
          {
            id: 18,
            name: 'รายการครุภัณฑ์',
            apiPath: 'report/equipmentRFID',
            filters: [2, 3, 14, 15, 7, 8, 9, 10, 11, 12, 13],
          },
          {
            id: 19,
            name: 'รายงานส่งซ่อมครุภัณฑ์',
            apiPath: 'report/repairReport',
            filters: [2, 3, 14, 15, 7, 8, 9, 10, 11, 12, 13],
          },
          {
            id: 20,
            name: 'แบบทะเบียนครุภัณฑ์ แสดงรายละเอียด',
            apiPath: 'report/equipmentGF',
            filters: [2, 3, 14, 15, 7, 8, 9, 10, 11, 12, 13],
          },
          {
            id: 21,
            name: 'รายงานทะเบียนคุมทรัพย์สิน (ต้องระบุเลขที่ครุภัณฑ์)',
            apiPath: 'report/equipmentGF',
            filters: [32],
          },
          {
            id: 22,
            name: 'รายงานตรวจนับครุภัณฑ์',
            apiPath: 'report/checkEquipmentReport ',
            filters: [20, 15, 32],
          },
        ],
        filterList: [
          {
            id: 1,
            type: 'space',
          },
          {
            id: 2,
            type: 'datePicker',
            name: 'วันที่เริ่ม',
            param: 'startDate',
          },
          {
            id: 3,
            type: 'datePicker',
            name: 'วันที่สิ้นสุด',
            param: 'endDate',
          },
          {
            id: 4,
            name: 'ประเภทวัสดุคงคลัง',
            param: 'type',
            apiPath: 'parcel/getListParcelType',
          },
          {
            id: 5,
            type: 'textField',
            name: 'ชื่อวัสดุ',
            param: 'name',
          },
          {
            id: 6,
            type: 'textField',
            name: 'เลขที่ครุภัณฑ์',
            param: 'number',
          },
          {
            id: 7,
            type: 'textField',
            name: 'เลขที่สินทรัพย์',
            param: 'assetNumber',
          },
          {
            id: 8,
            type: 'textField',
            name: 'เลขที่สินทรัพย์ อว.',
            param: 'assetNumberAorWor',
          },
          {
            id: 9,
            name: 'หมวดหมู่พัสดุ',
            param: 'majorCategoryId',
            apiPath: 'equipment/category/getMejorCategorys',
          },
          {
            id: 10,
            name: 'ประเภทพัสดุ',
            param: 'subCategoryId',
            apiPath: 'equipment/category/getSubCategorys',
          },
          {
            id: 11,
            name: 'รายการครุภัณฑ์',
            param: 'typeId',
            apiPath: 'equipment/category/types',
          },
          {
            id: 12,
            name: 'ยี่ห้อ',
            param: 'brandId',
            apiPath: 'equipment/category/brands',
          },
          {
            id: 13,
            name: 'รุ่น',
            param: 'modelId',
            apiPath: 'equipment/category/models',
          },
          {
            id: 14,
            name: 'กอง',
            param: 'organizationId',
            apiPath: 'Orgchart/getOrganizations',
            itemText: 'ouName',
          },
          {
            id: 15,
            name: 'กลุ่ม',
            param: 'departmentId',
            apiPath: 'Orgchart/getDepartments',
            itemText: 'departmentName',
          },
          {
            id: 16,
            type: 'textField',
            name: 'ปีงบประมาณ',
            param: 'year',
          },
          {
            id: 17,
            type: 'textField',
            name: 'รหัสการยืม',
            param: 'borrowId',
          },
          {
            id: 18,
            name: 'สถานะ',
            param: 'status',
            options: this.$store.getters.durableGoodSelectableOptions,
          },
          {
            id: 19,
            type: 'textField',
            name: 'เลขที่หนังสือ',
            param: 'bookNumber',
          },
          {
            id: 20,
            name: 'กอง',
            param: 'ouId',
            apiPath: 'Orgchart/getOrganizations',
            itemText: 'ouName',
          },
          {
            id: 21,
            name: 'วิธีการจำหน่าย',
            param: 'distributionMethod',
            options: this.$store.state.distributionList,
          },
          {
            id: 22,
            type: 'textField',
            name: 'ชื่อโครงการ',
            param: 'projectName',
          },
          {
            id: 23,
            type: 'textField',
            name: 'เลขที่สั่งซื้อสั่งจ้าง/เลขที่สัญญา',
            param: 'contractNumber',
          },
          {
            id: 24,
            type: 'textField',
            name: 'ชื่อผู้รับผิดชอบ',
            param: 'responsibleMan',
          },
          {
            id: 25,
            type: 'textField',
            name: 'รายละเอียดงานในแต่ล่ะงวด',
            param: 'DetailedWork',
          },
          {
            id: 26,
            name: 'วีธี รูปแบบงาน',
            param: 'type',
            options: this.$store.state.projectTypeList,
          },
          {
            id: 27,
            type: 'textField',
            name: 'เลขที่คุมสัญญา',
            param: 'contractControlNumber',
          },
          {
            id: 28,
            name: 'รูปแบบ',
            param: 'format',
            options: this.$store.state.projectFormatList
          },
          {
            id: 29,
            type: 'textField',
            name: 'งบประมาณโครงการ',
            param: 'budget',
          },
          {
            id: 30,
            type: 'textField',
            name: 'เลขที่เอกสาร',
            param: 'documentNumber',
          },
          {
            id: 31,
            type: 'textField',
            name: 'ผู้บริจาค',
            param: 'donator',
          },
          {
            id: 32,
            type: 'textField',
            name: 'เลขที่ครุภัณฑ์',
            param: 'equipmentNumber',
          },
        ],
      }
    },
    computed: {
      displayReportList () {
        const selectedGroup = this.reportGroup.find(group => group.id === this.group)
        return this.group === 0 ? this.reportList : this.reportList.filter(report => selectedGroup?.types?.includes(report.id))
      },
    },
    mounted () {
      this.onSelectReport({ val: 1, item: this.reportList[0] })
    },
    methods: {
      onSelectReport ({ val, item }) {
        this.selectedId = val
        this.selectedReport = item
        this.selectedFilters = this.selectedReport?.filters.map(id => this.filterList.find(filter => filter.id === id)) || []
        this.$router.push({ query: {} })

        if(this.selectedReport.id == 1 || this.selectedReport.id == 2 ){
          this.showBtn = false;
          this.showTable = false;
        }else{
          this.showBtn = true;
        }
      },
      async onDisplayTable () {
        this.isLoading = true
          const query = { ...this.query, ...this.$route.query }
          delete query.pageNo
          const { data } = await this.$store.dispatch('http', { apiPath: this.selectedReport.apiPath, query })
          if(data.headers){           
            this.columnList = data.headers;
            this.valueList = data.dataTable;
            this.showTable = true;
          }else{
            this.showTable = false;
          }
          this.isLoading = false
      },
    },
  }
</script>

<style lang="scss">
  #report-page {
   h4 {
      font-size: 18px;
    }
  }
  .report-button {
    display: flex;
    div {
      padding-right: 1%;
    }
  }
</style>