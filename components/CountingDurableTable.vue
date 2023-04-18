<template>
  <div class="counting-durable-table">
    <v-data-table :headers="headers" :items="items" :itemsPerPage="Infinity" disableSort hideDefaultFooter class="elevation-1" :loading="isLoading">
      <template #item.order="{ index }">{{ paginationIndex + index + 1 }}</template>
      <template #item.majorCategory="{ item }">
        <EquipmentColumn :item="item"/>
      </template>
      <template #item.organization="{ item }">
        <OwnerColumn :item="item"/>
      </template>
      <template #item.status="{ index, item }">
        <v-select v-if="canEdit && !item.isApprove" v-model="items[index].status" :items="statusList" itemText="name" itemValue="id" appendIcon="keyboard_arrow_down" @change="$emit('changeStatus', items[index])">
          <template #selection="res">
            <span class="d-flex justify-center" style="width: 100%;">{{ res.item.name }}</span>
          </template>
        </v-select>
        <v-chip v-else :color="$store.state.durableGoodStatusColor[item.status]">{{ $store.state.durableGoodStatus[item.status || 'NEW'] }}</v-chip>
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
      EquipmentColumn: () => import('~/components/EquipmentColumn.vue'),
      ActionIconList: () => import('~/components/ActionIconList.vue'),
      OwnerColumn: () => import('~/components/OwnerColumn.vue'),
    },
    props: {
      items: { type: Array, required: true },
      isLoading: { type: Boolean },
      paginationIndex: { type: Number, default: 0 },
      canEdit: { type: Boolean },
      hasAction: { type: Boolean },
    },
    data () {
      const headers = [
        { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
        { text: 'เลขที่ครุภัณฑ์', value: 'number', width: '128px', align: 'center' },
        { text: 'ชื่อครุภัณฑ์', value: 'name' },
        { text: 'หมวดหมู่', value: 'majorCategory', width: '120px', align: 'center' },
        { text: 'ผู้ครอบครอง', value: 'organization', width: '120px', align: 'center' },
        { text: 'สถานะ', value: 'status', width: '200px', align: 'center' },
      ]
      if (this.hasAction) headers.push({ text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' })
      return {
        headers
      }
    },
    computed: {
      statusList () {
        const acceptStatusList = ['NEW', 'WAIT_SALE', 'LOST']
        const statusList = this.$store.state.durableGoodStatus
        const filteredStatusList = Object.keys(statusList).filter(key => acceptStatusList.includes(key))
        return filteredStatusList.map(key => ({ id: key, name: statusList[key] }))
      },
    },
    methods: {
      getActionIconList (item) {
        const notConfirm = [
          { type: 'confirm', confirmText: 'คุณยืนยันการตรวจนับครุภัณฑ์นี้หรือไม่ ?', confirmBtnColor: 'success', icon: 'check_circle', action: () => { this.$emit('approveCounting', item) } },
        ]
        const confirm = [
          { type: 'btn', icon: 'check_circle', iconColor: 'success' },
        ]
        return item.isApprove ? confirm : notConfirm
      },
    }
  }
</script>

<style lang="scss">
  .counting-durable-table {

  }
</style>