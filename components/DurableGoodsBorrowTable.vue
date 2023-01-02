<template>
  <div id="durable-goods-borrow-table">
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6">
      <template #item.datetimeWithdraw="{ item }">
        <div>{{ $moment(item.datetimeWithdraw).format('DD-MM-YYYY, HH:mm') }}</div>
      </template>
      <template #item.datetimeApprove="{ item }">
        <div>{{ $moment(item.datetimeApprove).format('DD-MM-YYYY, HH:mm') }}</div>
      </template>
      <template #item.status="{ item }">
        <v-chip :color="$store.state.approveStatusColor[item.status]">{{ $store.state.approveStatus[item.status] }}</v-chip>
      </template>
      <template #item.countParcel="{ item }">
        <div class="flex items-center justify-center">
          <div>{{ item.countParcel }}</div>
          <v-btn icon @click="openDialog(item)">
            <v-icon>mdi-information-outline</v-icon>
          </v-btn>
        </div>
      </template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" width="640">
      <v-card v-if="selectedWithdrawParcel">
        <v-card-title class="text-h5 flex justify-between">
          <b>พัสดุ</b>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="black--text">
          <div class="mt-2">ทั้งหมด {{ selectedWithdrawParcel.countParcel }} ชนิด</div>
          <v-data-table :headers="parcelHeaders" :items="selectedWithdrawParcel.parcelList" :itemsPerPage="20" disableSort hideDefaultFooter class="mt-3">
            <template #item.number="{ index }">{{ index + 1 }}.</template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      items: { type: Array, required: true },
      getActionIconList: { type: Function, required: true },
      isApprover: { type: Boolean },
    },
    data () {
      return {
        dialog: false,
        selectedWithdrawParcel: null,
        headers: [
          { text: 'เลขที่เอกสาร', value: 'code', width: '160px', align: 'center' },
          { text: 'วันที่ยืม', value: 'datetimeWithdraw', width: '140px', align: 'center' },
          { text: 'วันที่คืน', value: 'datetimeApprove', width: '140px', align: 'center' },
          { text: 'จำนวนครุภัณฑ์', value: 'countParcel', width: '160px', align: 'center' },
          { text: 'สถานะการยืม - คืน', value: 'status', width: '160px', align: 'center' },
          { text: 'หมายเหตุ', value: 'note', width: '160px', align: 'center' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        parcelHeaders: [
          { text: 'ลำดับ', value: 'number', width: '80px', align: 'center' },
          { text: 'ชื่อ', value: 'name' },
          { text: 'จำนวนเบิก', value: 'countWithdraw', width: '120px', align: 'center' },
          { text: 'จำนวนจ่าย', value: 'countPaid', width: '120px', align: 'center' },
        ],
      }
    },
    methods: {
      openDialog (item) {
        this.selectedWithdrawParcel = item
        this.dialog = true
      },
      closeDialog () {
        this.dialog = false
      },
    },
  }
</script>

<style lang="scss">
  #durable-goods-borrow-table {
  }
</style>