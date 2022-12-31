<template>
  <div id="durable-goods-page">
    <PageHeader text="บริหารครุภัณฑ์" btnText="เพิ่มครุภัณฑ์" createRoute="/durable-goods/create/"/>
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
          { text: 'เลขที่ครุภัณฑ์', value: 'durableGoodsCode', width: '160px', align: 'center' },
          { text: 'ครุภัณฑ์', value: 'durableGoodsName', align: 'center' },
          { text: 'ค่าเสื่อมคงเหลือ', value: 'depreciation', width: '140px', align: 'center' },
          { text: 'ผู้ครอบครอง', value: 'owner', width: '180px', align: 'center' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        items: [
          {
            id: 1,
            projectCode: '65000000001',
            projectName: 'โครงการ 1',
            durableGoodsCode: '75000000001',
            durableGoodsName: 'ปากกาเจล',
            depreciation: '25%',
            owner: 'นาย ก'
          },
        ],
      }
    },
    methods: {
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'mdi-pencil', action: `/durable-goods/${item.id}/` },
          { type: 'confirm', icon: 'mdi-delete', action: () => { console.log('Confirm') } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #durable-goods-page {
  }
</style>