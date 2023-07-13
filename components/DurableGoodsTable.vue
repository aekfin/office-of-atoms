<template>
  <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="durable-goods-table elevation-1 mt-6" :loading="isLoading">
    <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
    <template #item.price="{ item }">{{ $fn.getPrice(item.price) }}</template>
    <template #item.majorCategory="{ item }">
      <EquipmentColumn :item="item"/>
    </template>
    <template #item.organization.ouName="{ item }">
      <OwnerColumn :item="item"/>
    </template>
    <template #item.dateEntry="{ item }">
      <div>{{ $fn.displayDate(item.dateEntry) }}</div>
    </template>
    <template #item.action="{ item }">
      <ActionIconList :list="getActionIconList(item)"/>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    components: {
      EquipmentColumn: () => import('~/components/EquipmentColumn.vue'),
      OwnerColumn: () => import('~/components/OwnerColumn.vue'),
    },
    props: {
      items: { type: Array, required: true },
      isLoading: { type: Boolean },
      getActionIconList: { type: Function },
    },
    data () {
      const headers = [
        { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
        { text: 'โครงการ', value: 'project.projectName' },
        { text: 'ชื่อครุภัณฑ์', value: 'name', width: '180px' },
        { text: 'หมวดหมู่', value: 'majorCategory', width: '120px', align: 'center' },
        { text: 'ราคา', value: 'price', align: 'center', width: '120px' },
        { text: 'ผู้ครอบครอง', value: 'organization.ouName', width: '120px', align: 'center' },
        { text: 'วันที่รับเข้า', value: 'dateEntry', align: 'center', width: '140px' },
      ]
      if (this.getActionIconList) headers.push({ text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' })
      return {
        headers
      }
    },
  }
</script>

<style lang="scss">
  .durable-goods-table {
  }
</style>