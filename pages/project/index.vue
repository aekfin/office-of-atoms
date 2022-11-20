<template>
  <div id="project-page">
    <PageHeader text="โครงการ" btnText="เพิ่มโครงการ" createRoute="/project/create/"/>
    <v-data-table
      :headers="headers"
      :items="items"
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
      <template #item.action="{ item }">
        <NLink :to="`/project/${item.id}/`"><v-icon>mdi-pencil</v-icon></NLink>
        <v-icon>mdi-delete</v-icon>
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
        headers: [
          { text: 'เลขที่โครงการ', value: 'code', width: '140px', align: 'center' },
          { text: 'ชื่อโครงการ', value: 'name', width: '28%' },
          { text: 'คู่สัญญา', value: 'vendor', align: 'center' },
          { text: 'วันเริ่มโครงการ', value: 'datetimeStart', width: '140px', align: 'center' },
          { text: 'วันเริ่มสัญญา', value: 'datetimeStartVendor', width: '140px', align: 'center' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        items: [
          {
            id: 1,
            code: '6500000001',
            name: 'ชื่อโครงการ 1',
            vendor: 'บริษัท A',
            datetimeStart: new Date(),
            datetimeStartVendor: new Date(),
          },
          {
            id: 2,
            code: '6500000002',
            name: 'ชื่อโครงการ 2',
            vendor: 'บริษัท B',
            datetimeStart: new Date(),
            datetimeStartVendor: new Date(),
          },
          {
            id: 3,
            code: '6500000003',
            name: 'ชื่อโครงการ 3',
            vendor: 'บริษัท C',
            datetimeStart: new Date(),
            datetimeStartVendor: new Date(),
          },
          {
            id: 4,
            code: '6500000004',
            name: 'ชื่อโครงการ 4',
            vendor: 'บริษัท D',
            datetimeStart: new Date(),
            datetimeStartVendor: new Date(),
          }
        ],
      }
    }
  }
</script>

<style lang="scss">
  #project-page {
  }
</style>