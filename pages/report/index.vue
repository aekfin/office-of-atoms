<template>
  <div id="report-page">
    <PageHeader text="รายงานทั้งหมด" hideTotal :filters="filters"/>
    <v-container class="mt-10">
      <v-row>
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
          <h4 class="text-xl mb-2"><b>รายงานทะเบียนคุมทรัพย์สิน <small>(ต้องระบุเลขที่ครุภัณฑ์)</small></b></h4>
          <ExportReportButton apiPath="report/equipment-detail" name="รายงานทะเบียนคุมทรัพย์สิน"/>
        </v-col>
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานการจำหน่ายครุภัณฑ์</b></h4>
          <ExportReportButton apiPath="report/sale" name="รายงานการจำหน่ายครุภัณฑ์"/>
        </v-col>
      </v-row>
      <v-row class="mt-10">
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานวัสดุคงคลัง</b></h4>
          <ExportReportButton apiPath="report/pacelAll" name="รายงานวัสดุคงคลัง"/>
        </v-col>
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานเบิกจ่ายวัสดุคงคลังตามหน่วยงาน</b></h4>
          <ExportReportButton apiPath="report/pacelWithOu" name="รายงานเบิกจ่ายวัสดุคงคลังตามหน่วยงาน"/>
        </v-col>
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานการรอคืนหลักประกัน</b></h4>
          <ExportReportButton apiPath="report/project" name="รายงานการรอคืนหลักประกัน"/>
        </v-col>
      </v-row>
      <v-row class="mt-10">
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานสรุปผลจัดซื้อจัดจ้าง</b></h4>
          <ExportReportButton apiPath="report/procurementSummary" name="รายงานสรุปผลจัดซื้อจัดจ้าง"/>
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