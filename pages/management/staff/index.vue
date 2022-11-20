<template>
  <div id="staff-page">
    <PageHeader text="บริหารบุคลากร" btnText="เพิ่มบุคลากร" createRoute="/management/staff/create/"/>
    <v-data-table
      :headers="headers"
      :items="items"
      :itemsPerPage="20"
      disableSort
      hideDefaultFooter
      class="elevation-1 mt-6"
    >
      <template #item.action="{ item }">
        <NLink :to="`/management/staff/${item.id}/`"><v-icon>mdi-pencil</v-icon></NLink>
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
          { text: 'รหัสพนักงาน', value: 'code', align: 'center' },
          { text: 'ชื่อ', value: 'fistName', width: '16%' },
          { text: 'นามสกุล', value: 'lastName', width: '20%' },
          { text: 'ตำแหน่ง', value: 'position', align: 'center' },
          { text: 'กอง', value: 'division', align: 'center' },
          { text: 'กลุ่ม', value: 'group', align: 'center' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        items: [
          {
            id: 1,
            code: '6500000001',
            fistName: 'นาย ก',
            lastName: 'บริษัท A',
            position: 'ตำแหน่ง ก',
            division: 'กอง ก',
            group: 'กลุ่ม ก'
          },
        ],
      }
    }
  }
</script>

<style lang="scss">
  #staff-page {
  }
</style>