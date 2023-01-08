<template>
  <div id="durable-goods-request-page">
    <PageHeader text="ครุภัณฑ์ที่รออนุมัติ"/>
    <DurableGoodsBorrowTable :items="items" :getActionIconList="getActionIconList"/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
    },
    data () {
      return {
        items: [
          {
            id: 1,
            code: '65-000000001',
            datetimeWithdraw: new Date(),
            datetimeApprove: new Date(),
            status: 1,
            countDurableGoods: 5,
            agency: 'หน่วย ก',
            durableGoodsList: [
              { id: 1, name: 'โทรศัพท์ Nokia N95', countWithdraw: 10, countPaid: 10 },
              { id: 1, name: 'โทรศัพท์ Nokia N95', countWithdraw: 10, countPaid: 10 },
            ],
          },
          {
            id: 2,
            code: '65-000000001',
            datetimeWithdraw: new Date(),
            datetimeApprove: new Date(),
            status: 2,
            countDurableGoods: 4,
            agency: 'หน่วย ข',
            durableGoodsList: [
              { id: 1, name: 'โทรศัพท์ Samsung C', countWithdraw: 5, countPaid: 5 },
            ],
          },
          {
            id: 3,
            code: '65-000000001',
            datetimeWithdraw: new Date(),
            datetimeApprove: new Date(),
            status: 3,
            countDurableGoods: 1,
            agency: 'หน่วย ค',
            durableGoodsList: [
              { id: 1, name: 'โทรศัพท์ One Plus', countWithdraw: 8, countPaid: 8 },
            ],
          },
          {
            id: 4,
            code: '65-000000001',
            datetimeWithdraw: new Date(),
            datetimeApprove: new Date(),
            agency: 'หน่วย ง',
            status: 4,
            countDurableGoods: 3,
            durableGoodsList: [
              { id: 1, name: 'โทรศัพท์ Nokia N91', countWithdraw: 20, countPaid: 20 },
            ],
          },
        ],
      }
    },
    methods: {
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'mdi-pencil', action: `/durable-goods/request/${item.id}/` },
          { type: 'confirm', icon: 'mdi-delete', action: () => { console.log('Confirm') } },
        ]
      },
    },
  }
</script>

<style lang="scss">
  #parcel-withdraw-page {
  }
</style>