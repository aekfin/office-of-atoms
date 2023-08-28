<template>
  <div id="durable-goods-repair-table">
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading">
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.user_fk.thaiFristName="{ item }">{{ item.user_fk.thaiFristName }} {{ item.user_fk.thaiLastName }}</template>
      <template #item.dateBorrow="{ item }">
        <div>{{ item.dateBorrow ? $fn.displayDate(item.dateBorrow) : '-' }}</div>
      </template>
      <template #item.dateApprove="{ item }">
        <div>{{ item.dateApprove ? $fn.displayDate(item.dateApprove) : '-' }}</div>
      </template>
      <template #item.equipmentNumber="{ item }">
        <span>{{ item.equipments[0].number }}</span>
      </template>
      <template #item.equipment="{ item }">
        <span>{{ item.equipments[0].name }}</span>
      </template>
      <template #item.organization.ouName="{ item }">
        <OwnerColumn :item="item.equipments[0]"/>
      </template>
      <template #item.status="{ item }">
        <v-chip :color="repairColor[getRepairLabel(item)]">{{ getRepairLabel(item) }}</v-chip>
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
          { text: 'ผู้ขอส่งซ่อมครุภัณฑ์', value: 'user_fk.thaiFristName' },
          { text: 'วันที่ส่งซ่อม', value: 'dateBorrow', width: '120px', align: 'center' },
          { text: 'วันที่ซ่อม', value: 'dateApprove', width: '120px', align: 'center' },
          { text: 'เลขที่ครุภัณฑ์', value: 'equipmentNumber', width: '150px', align: 'center' },
          { text: 'ครุภัณฑ์', value: 'equipment', width: '160px', align: 'center' },
          { text: 'ผู้ครอบครอง', value: 'organization.ouName', width: '120px', align: 'center' },
          { text: 'สถานะการซ่อม', value: 'status', align: 'center', width: '140px' },
          { text: 'เครื่องมือ', value: 'action', width: '120px', align: 'center' },
        ],
        repairColor: {
          'สำเร็จ': 'success',
          'ไม่สำเร็จ': 'error',
          'รอซ่อม': 'warning',
          'รอซ่อมภายนอก': 'secondary',
          'รอส่งซ่อมภายนอก': 'primary',
        },
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
      getRepairLabel (item) {
        if (item.status === 'PENDING') {
          if (item.remarks) return 'รอส่งซ่อมภายนอก'
          else return 'รอซ่อม'
        } else if (item.status === 'SUCCESS') {
          if (item.stepRepair) return 'รอซ่อมภายนอก'
          else if (item.canRepair) return 'สำเร็จ'
          else return 'ไม่สำเร็จ'
        }
      },
    },
  }
</script>

<style lang="scss">
  #durable-goods-repair-table {
  }
</style>