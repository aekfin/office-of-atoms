<template>
  <div id="parcel-page">
    <PageHeader text="บริหารพัสดุ" btnText="เพิ่มพัสดุ" createRoute="/parcel/overall/create/"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6">
      <template #item.datetimeCreate="{ item }">
        <div>{{ $moment(item.datetimeCreate).format('DD-MM-YYYY') }}</div>
      </template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
    },
    data () {
      return {
        headers: [
          { text: 'เลขที่โครงการ', value: 'projectCode', width: '160px', align: 'center' },
          { text: 'โครงการ', value: 'projectName' },
          { text: 'พัสดุ', value: 'parcelName' },
          { text: 'จำนวนรับเข้าคลัง', value: 'count', width: '160px', align: 'center' },
          { text: 'วันที่รับเข้า', value: 'datetimeCreate', width: '140px', align: 'center' },
          { text: 'คงเหลือ', value: 'total', width: '100px', align: 'center' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        items: [
          {
            id: 1,
            projectCode: '65000000001',
            projectName: 'โครงการ 1',
            parcelName: 'ปากกาเจล',
            count: 8,
            datetimeCreate: new Date(),
            total: 40,
          },
        ],
      }
    },
    methods: {
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'mdi-pencil', action: `/parcel/overall/${item.id}/` },
          { type: 'confirm', icon: 'mdi-delete', action: () => { console.log('Confirm') } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #parcel-page {
  }
</style>