<template>
  <div id="report-page">
    <PageHeader text="รายงานทั้งหมด" hideTotal/>
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
          <h4 class="text-xl mb-2"><b>รายงานการจำหน่ายครุภัณฑ์</b></h4>
          <ExportReportButton apiPath="report/sale" name="รายงานการจำหน่ายครุภัณฑ์"/>
        </v-col>
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานวัสดุคงคลัง</b></h4>
          <ExportReportButton apiPath="report/pacelAll" name="รายงานวัสดุคงคลัง"/>
        </v-col>
        <v-col :col="12" :md="4">
          <h4 class="text-xl mb-2"><b>รายงานเบิกจ่ายวัสดุคงคลังตามหน่วยงาน</b></h4>
          <ExportReportButton apiPath="report/pacelWithOu" name="รายงานเบิกจ่ายวัสดุคงคลังตามหน่วยงาน"/>
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
  }
</script>

<style lang="scss">
  #report-page {
   h4 {
      font-size: 18px;
    }
  }
</style>