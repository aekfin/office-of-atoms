<template>
  <div id="durable-goods-return-table">
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading">
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.user_fk.thaiFristName="{ item }">{{ item.user_fk.thaiFristName }} {{ item.user_fk.thaiLastName }}</template>
      <template #item.dateBorrow="{ item }">
        <div>{{ item.dateBorrow ? $fn.displayDate(item.dateBorrow) : '-' }}</div>
      </template>
      <template #item.dateApprove="{ item }">
        <div>{{ item.dateApprove ? $fn.displayDate(item.dateApprove) : '-' }}</div>
      </template>
      <template #item.equipment="{ item }">
        <!-- <span>{{ item.equipments[0].name }}</span> -->
        <span v-if="item && item.equipments && item.equipments.length > 0">{{ item.equipments[0].name }}</span>
      </template>
      <template  #item.organization.ouName="{ item }">
        <OwnerColumn v-if="item && item.equipments && item.equipments.length > 0" :item="item.equipments[0]"/>
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
    components: {
      OwnerColumn: () => import('~/components/OwnerColumn.vue'),
    },
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
          { text: 'ผู้ขอเบิกครุภัณฑ์', value: 'user_fk.thaiFristName' },
          { text: 'วันที่เบิก', value: 'dateBorrow', width: '120px', align: 'center' },
          { text: 'วันที่อนุมัติ', value: 'dateApprove', width: '120px', align: 'center' },
          { text: 'ครุภัณฑ์', value: 'equipment', width: '220px', align: 'center' },
          { text: 'ผู้ครอบครอง', value: 'organization.ouName', width: '120px', align: 'center' },
          { text: 'สถานะการเบิก', value: 'status', width: '140px', align: 'center' },
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
  #durable-goods-return-table {
  }
</style>