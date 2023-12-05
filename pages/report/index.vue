<template>
  <div id="report-page">
    <PageHeader text="รายงานทั้งหมด" hideTotal/>
    <v-container>
      <div class="mt-10">
        <SelectDropdown :value.sync="selectedId" :items="reportList" label="ประเภทของรายงาน" @select="onSelectReport"/>
      </div>
      <div class="mt-5">
        <PageHeader text="" hideTotal :filters="selectedFilters"/>
      </div>
      <div class="mt-10">
        <ExportReportButton v-if="selectedReport" :apiPath="selectedReport.apiPath" :name="selectedReport.name"/>
      </div>

      <v-row class="mt-10">
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานการยืมคืนครุภัณฑ์</b></h4>
          <ExportReportButton apiPath="report/borrowAndReturn" name="รายงานการยืมคืนครุภัณฑ์"/>
        </v-col>
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานการโอนย้ายครุภัณฑ์</b></h4>
          <ExportReportButton apiPath="report/transfer" name="รายงานการโอนย้ายครุภัณฑ์"/>
        </v-col>
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานการรับบริจาคครุภัณฑ์</b></h4>
          <ExportReportButton apiPath="report/donate" name="รายงานการรับบริจาคครุภัณฑ์"/>
        </v-col>
      </v-row>

      <v-row class="mt-10">
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานครุภัณฑ์ชนGFMIS</b></h4>
          <ExportReportButton apiPath="report/equipment" name="รายงานครุภัณฑ์ชนGFMIS"/>
        </v-col>
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานการจำหน่ายครุภัณฑ์</b></h4>
          <ExportReportButton apiPath="report/sale" name="รายงานการจำหน่ายครุภัณฑ์"/>
        </v-col>
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานตรวจนับครุภัณฑ์</b></h4>
          <ExportReportButton apiPath="report/checkEquipmentReport" name="รายงานตรวจนับครุภัณฑ์"/>
        </v-col>
      </v-row>

      <v-row class="mt-10">
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานส่งซ่อมครุภัณฑ์</b></h4>
          <ExportReportButton apiPath="report/repairReport" name="รายงานส่งซ่อมครุภัณฑ์"/>
        </v-col>
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานทะเบียนคุมทรัพย์สิน <small>(ต้องระบุเลขที่ครุภัณฑ์)</small></b></h4>
          <ExportReportButton apiPath="report/equipment-detail" name="รายงานทะเบียนคุมทรัพย์สิน"/>
        </v-col>
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานสินทรัพย์ที่มีการจำหน่ายพร้อมค่าเสื่อม</b></h4>
          <ExportReportButton apiPath="report/saleReportAndDepreciation" name="รายงานสินทรัพย์ที่มีการจำหน่ายพร้อมค่าเสื่อม"/>
        </v-col>
      </v-row>

      <v-row class="mt-10">
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานการรอคืนหลักประกัน</b></h4>
          <ExportReportButton apiPath="report/project" name="รายงานการรอคืนหลักประกัน"/>
        </v-col>
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานสถิติการจัดซื้อจัดจ้าง</b></h4>
          <ExportReportButton apiPath="report/procurementSummary" name="รายงานสถิติการจัดซื้อจัดจ้าง"/>
        </v-col>
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานโครงการจัดซื้อจัดจ้างที่ยังไม่เสร็จสิ้น</b></h4>
          <ExportReportButton apiPath="report/procurementSummary-non-complete" name="รายงานโครงการจัดซื้อจัดจ้างที่ยังไม่เสร็จสิ้น"/>
        </v-col>
      </v-row>

      <v-row class="mt-10">
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานติดตามสถานะการดำเนินการโครงการ</b></h4>
          <ExportReportButton apiPath="report/procurementSummary" name="รายงานติดตามสถานะการดำเนินการโครงการ"/>
        </v-col>
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานโครงการที่ได้รับการจัดซื้อจัดจ้าง</b></h4>
          <ExportReportButton apiPath="report/procurementSummary" name="รายงานโครงการที่ได้รับการจัดซื้อจัดจ้าง"/>
        </v-col>
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>แบบทะเบียนครุภัณฑ์ แสดงรายละเอียด</b></h4>
          <ExportReportButton apiPath="report/equipmentGF" name="แบบทะเบียนครุภัณฑ์ แสดงรายละเอียด"/>
        </v-col>
      </v-row>

      <v-row class="mt-10">
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายการครุภัณฑ์</b></h4>
          <ExportReportButton apiPath="report/equipmentRFID" name="รายการครุภัณฑ์"/>
        </v-col>
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานโครงการ</b></h4>
          <ExportReportButton apiPath="report/projectWithEquipment" name="รายงานโครงการ"/>
        </v-col>
      </v-row>

    </v-container>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      ExportReportButton: () => import('~/components/ExportReportButton.vue'),
    },
    data () {
      return {
        selectedId: 1,
        selectedReport: null,
        selectedFilters: [],
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
            param: 'equipmentNumber',
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
            param: 'ouId',
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
        ],
      }
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
</style>