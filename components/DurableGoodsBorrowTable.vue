<template>
  <div id="durable-goods-borrow-table">
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading">
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.user_fk.thaiFristName="{ item }">{{ item.user_fk.thaiFristName }} {{ item.user_fk.thaiLastName }}</template>
      <template #item.dateBorrow="{ item }">
        <div>{{ item.dateBorrow ? $fn.displayDate(item.dateBorrow) : '-' }}</div>
      </template>
      <template #item.dateReturn="{ item }">
        <div>{{ item.dateReturn ? $fn.displayDate(item.dateReturn) : '-' }}</div>
      </template>
      <template #item.status="{ item }">
        <v-chip :color="$store.state.approveStatusColor[item.status]">{{ $store.state.approveStatus[item.status] }}</v-chip>
      </template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
    props: {
      items: { type: Array, required: true },
      getActionIconList: { type: Function, required: true },
      isApprover: { type: Boolean },
      isLoading: { type: Boolean },
    },
    data () {
      return {
        dialog: false,
        selectedWithdrawParcel: null,
        headers: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'ผู้ขอยืมครุภัณฑ์', value: 'user_fk.thaiFristName' },
          { text: 'วันที่ยืม', value: 'dateBorrow', width: '140px', align: 'center' },
          { text: 'วันที่คืน', value: 'dateReturn', width: '140px', align: 'center' },
          { text: 'ครุภัณฑ์', value: 'equipment', width: '160px', align: 'center' },
          { text: 'สถานะการยืม - คืน', value: 'status', width: '160px', align: 'center' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        parcelHeaders: [
          { text: 'ลำดับ', value: 'number', width: '80px', align: 'center' },
          { text: 'ชื่อ', value: 'name' },
          { text: 'จุดประสงค์', value: 'countWithdraw', width: '160px', align: 'center' },
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