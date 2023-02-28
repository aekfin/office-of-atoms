<template>
  <div id="log-list-page">
    <PageHeader text="รายงานผู้ใช้ระบบ"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6">
      <template #item.datetimeCreate="{ item }">
        <div class="text-center">{{ $moment(item.datetimeCreate).format('DD-MM-YYYY, HH:MM:SS') }}</div>
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
          { text: 'รายละเอียด', value: 'description' },
          { text: 'วัน - เวลา', value: 'datetimeCreate', align: 'center', width: '200px' },
          { text: 'ผู้ทำรายการ', value: 'name', align: 'center', width: '280px' },
        ],
        items: [
          {
            id: 1,
            description: 'เพิ่มข้อมูลวัสดุคงคลัง',
            datetimeCreate: '2022-12-25T11:12:41.065Z',
            name: 'นาย ก'
          },
        ],
      }
    },
  }
</script>

<style lang="scss">
  #log-list-page{
  }
</style>