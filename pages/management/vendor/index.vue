<template>
  <div id="vendor-page">
    <PageHeader text="บริหารคู่สัญญา" btnText="เพิ่มคู่สัญญา" createRoute="/management/vendor/create/"/>
    <v-data-table
      :headers="headers"
      :items="items"
      :itemsPerPage="20"
      disableSort
      hideDefaultFooter
      class="elevation-1 mt-6"
    >
      <template #item.contact="{ item }">
        <div class="text-center">
          <v-icon>mdi-information-outline</v-icon>
        </div>
      </template>
      <template #item.attachment="{ item }">
        <div class="text-center">
          <v-icon>mdi-download</v-icon>
        </div>
      </template>
      <template #item.action="{ item }">
        <NLink :to="`/management/vendor/${item.id}/`"><v-icon>mdi-pencil</v-icon></NLink>
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
          { text: 'รหัสบริษัท', value: 'code', align: 'center', width: '200px' },
          { text: 'ชื่อบริษัท', value: 'name' },
          { text: 'ที่อยู่บริษัท', value: 'address', width: '280px' },
          { text: 'การติดต่อ', value: 'contact', width: '100px' },
          { text: 'ไฟล์แนบ', value: 'attachment', width: '100px' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        items: [
          {
            id: 1,
            code: '6500000001',
            name: 'นาย ก',
            address: '11/22 คอนโด A'
          },
        ],
      }
    },
    head () {
      return {
        title: 'บริหารบุคลากร'
      }
    },
  }
</script>

<style lang="scss">
  #vendor-page {
  }
</style>