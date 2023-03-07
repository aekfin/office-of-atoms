<template>
  <div id="parcel-withdraw-table">
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading">
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.user_fk.thaiFristName="{ item }">{{ item.user_fk.thaiFristName }} {{ item.user_fk.thaiLastName }}</template>
      <template #item.datePickUp="{ item }">
        <div>{{ item.datePickUp ? $fn.displayDate(item.datePickUp) : '-' }}</div>
      </template>
      <template #item.dateApprove="{ item }">
        <div>{{ item.dateApprove ? $fn.displayDate(item.dateApprove) : '-' }}</div>
      </template>
      <template #item.status="{ item }">
        <v-chip :color="$store.state.approveStatusColor[item.status]">{{ $store.state.approveStatus[item.status] }}</v-chip>
      </template>
      <template #item.parcel="{ item }">
        <div class="d-flex align-center justify-center">
          <v-btn icon @click="openDialog(item)">
            <v-icon>mdi-information-outline</v-icon>
          </v-btn>
        </div>
      </template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" width="720">
      <v-card>
        <v-card-title class="text-h5 d-flex justify-space-between">
          <b>วัสดุคงคลัง</b>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="black--text">
          <div class="mt-2">ทั้งหมด {{ selectedWithdrawParcel && selectedWithdrawParcel.items.length || 0 }} ชนิด</div>
          <v-data-table :headers="parcelHeaders" :items="selectedWithdrawParcel && selectedWithdrawParcel.items || []" :itemsPerPage="20" disableSort hideDefaultFooter class="mt-3" :loading="isLoadingDialog">
            <template #item.number="{ index }">{{ index + 1 }}.</template>
            <template #item.numberOfApproved="{ item }">{{ item.numberOfApproved || '-' }}</template>
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
      isLoading: { type: Boolean },
      apiPath: { type: String, default: 'parcel/getPickUp' },
      isDepartment: { type: Boolean },
    },
    data () {
      return {
        dialog: false,
        selectedWithdrawParcel: null,
        isLoadingDialog: true,
        headers: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'ผู้ขอเบิกวัสดุคงคลัง', value: 'user_fk.thaiFristName' },
          { text: 'วันที่เบิก', value: 'datePickUp', width: '140px', align: 'center' },
          { text: 'วันที่อนุมัติ', value: 'dateApprove', width: '140px', align: 'center' },
          { text: 'วัสดุคงคลัง', value: 'parcel', width: '160px', align: 'center' },
          { text: 'สถานะการเบิก', value: 'status', width: '160px', align: 'center' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        parcelHeaders: [
          { text: 'ลำดับ', value: 'number', width: '80px', align: 'center' },
          { text: 'ชื่อวัสดุคงคลัง', value: 'name' },
          { text: 'ประเภท', value: 'type.name', width: '160px' },
          { text: 'จำนวนเบิก', value: 'quantity', width: '120px', align: 'center' },
          { text: 'จำนวนจ่าย', value: 'numberOfApproved', width: '120px', align: 'center' },
        ],
      }
    },
    watch: {
      'dialog' (val) {
        if (!val && this.selectedWithdrawParcel) this.selectedWithdrawParcel.items = []
      },
    },
    methods: {
      async openDialog (item) {
        try {
          this.dialog = true
          this.isLoadingDialog = true
          const { data } = await this.$store.dispatch('http', { apiPath: this.apiPath, query: { id: item.id } })
          this.selectedWithdrawParcel = data
          this.isLoadingDialog = false
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      closeDialog () {
        this.dialog = false
      },
    },
  }
</script>

<style lang="scss">
  #parcel-withdraw-table {
  }
</style>