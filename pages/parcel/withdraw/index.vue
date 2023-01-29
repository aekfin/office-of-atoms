<template>
  <div id="parcel-withdraw-page">
    <PageHeader text="การเบิกพัสดุ" btnText="เพิ่มการเบิกพัสดุ" createRoute="/parcel/withdraw/create/"/>
    <ParcelWithdrawTable :items="items" :getActionIconList="getActionIconList"/>
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
            agency: 'หน่วยงาน A',
            status: 1,
            countParcel: 5,
            parcelList: [
              { id: 1, name: 'โทรศัพท์ Nokia N95', countWithdraw: 10, countPaid: 10 },
              { id: 1, name: 'โทรศัพท์ Nokia N95', countWithdraw: 10, countPaid: 10 },
            ],
          },
          {
            id: 2,
            code: '65-000000001',
            datetimeWithdraw: new Date(),
            datetimeApprove: new Date(),
            agency: 'หน่วยงาน B',
            status: 2,
            countParcel: 4,
            parcelList: [
              { id: 1, name: 'โทรศัพท์ Samsung C', countWithdraw: 5, countPaid: 5 },
            ],
          },
          {
            id: 3,
            code: '65-000000001',
            datetimeWithdraw: new Date(),
            datetimeApprove: new Date(),
            agency: 'หน่วยงาน C',
            status: 3,
            countParcel: 1,
            parcelList: [
              { id: 1, name: 'โทรศัพท์ One Plus', countWithdraw: 8, countPaid: 8 },
            ],
          },
          {
            id: 4,
            code: '65-000000001',
            datetimeWithdraw: new Date(),
            datetimeApprove: new Date(),
            agency: 'หน่วยงาน D',
            status: 4,
            countParcel: 3,
            parcelList: [
              { id: 1, name: 'โทรศัพท์ Nokia N91', countWithdraw: 20, countPaid: 20 },
            ],
          },
        ],
      }
    },
    methods: {
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'mdi-pencil', action: `/parcel/withdraw/${item.id}/` },
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