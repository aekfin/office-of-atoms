<template>
  <div id="project-page">
    <PageHeader text="โครงการ" btnText="เพิ่มโครงการ" createRoute="/project/create/"/>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :itemsPerPage="20"
      disableSort
      hideDefaultFooter
      class="elevation-1 mt-6"
    >
      <template #item.datetimeStart="{ item }">
        {{ $moment(item).format('DD-MM-YYYY') }}
      </template>
      <template #item.datetimeStartVendor="{ item }">
        {{ $moment(item).format('DD-MM-YYYY') }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue')
    },
    data () {
      return {
        page: 1,
        pageCount: 0,
        itemsPerPage: 10,
        headers: [
          { text: 'เลขที่โครงการ', value: 'code', width: '140px', align: 'center' },
          { text: 'ชื่อโครงการ', value: 'name', width: '28%' },
          { text: 'คู่สัญญา', value: 'vendor', align: 'center' },
          { text: 'วันเริ่มโครงการ', value: 'datetimeStart', width: '140px', align: 'center' },
          { text: 'วันเริ่มสัญญา', value: 'datetimeStartVendor', width: '140px', align: 'center' },
          { text: 'เครื่องมือ', width: '140px', align: 'center' },
        ],
        desserts: [
          {
            code: '6500000001',
            name: 'ชื่อโครงการ 1',
            vendor: 'บริษัท A',
            datetimeStart: new Date(),
            datetimeStartVendor: new Date(),
          },
          {
            code: '6500000002',
            name: 'ชื่อโครงการ 2',
            vendor: 'บริษัท B',
            datetimeStart: new Date(),
            datetimeStartVendor: new Date(),
          },
          {
            code: '6500000003',
            name: 'ชื่อโครงการ 3',
            vendor: 'บริษัท C',
            datetimeStart: new Date(),
            datetimeStartVendor: new Date(),
          },
          {
            code: '6500000004',
            name: 'ชื่อโครงการ 4',
            vendor: 'บริษัท D',
            datetimeStart: new Date(),
            datetimeStartVendor: new Date(),
          }
        ],
      }
    },
  }
</script>

<style lang="scss">
  #project-page {
  }
</style>