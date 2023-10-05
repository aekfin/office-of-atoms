<template>
  <div id="report-page">
    <PageHeader text="รายงานทั้งหมด" hideTotal :filters="filters"/>
    <v-container>
      <v-row class="mt-10">
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานวัสดุคงคลัง</b></h4>
          <ExportReportButton apiPath="report/pacelAll" name="รายงานวัสดุคงคลัง"/>
        </v-col>
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานเบิกจ่ายวัสดุคงคลังตามหน่วยงาน</b> <small>(กรองด้วยวันที่ได้)</small></h4>
          <ExportReportButton apiPath="report/pacelWithOu" name="รายงานเบิกจ่ายวัสดุคงคลังตามหน่วยงาน"/>
        </v-col>
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานตรวจนับวัสดุคงคลัง</b></h4>
          <ExportReportButton apiPath="report/pacelVerificationReport" name="รายงานตรวจนับวัสดุคงคลัง"/>
        </v-col>
      </v-row>

      <v-row class="mt-10">
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานพัสดุถึงจุดสั่งชื้อ</b></h4>
          <ExportReportButton apiPath="report/parcelMinnimumStock" name="รายงานพัสดุถึงจุดสั่งชื้อ"/>
        </v-col>
      </v-row>

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
        filters: [
          {
            type: 'textField',
            name: 'ปี',
            param: 'year',
          },
          {
            type: 'space',
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
            type: 'space',
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
            type: 'space',
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
            type: 'datePicker',
            name: 'วันที่เริ่ม',
            param: 'startDate',
          },
          {
            type: 'datePicker',
            name: 'วันที่สิ้นสุด',
            param: 'endDate',
          },
        ],
      }
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