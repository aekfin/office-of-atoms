<template>
  <v-data-table :headers="headers" :items="items" :itemsPerPage="1000" disableSort hideDefaultFooter class="withdraw-durable-goods-table elevation-1" :loading="isLoading">
    <template #item.selector="{ index }">
      <input v-model="selectList[index]" type="checkbox">
    </template>
    <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
    <template #item.price="{ item }">{{ $fn.getPrice(item.price) }}</template>
    <template #item.typeOfSource="{ item }">{{ sourceList[item.typeOfSource] || '-' }}</template>
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
      selectList: { type: Array },
    },
    data () {
      const headers = [
        { text: '', value: 'selector', width: '50px', align: 'center' },
        { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
        { text: 'ชื่อครุภัณฑ์', value: 'name' },
        { text: 'ที่มา', value: 'typeOfSource', width: '140px', align: 'center' },
      ]
      headers.push({ text: 'หมวดหมู่', value: 'majorCategory', width: '120px', align: 'center' })
      headers.push({ text: 'วันที่รับเข้า', value: 'dateEntry', align: 'center', width: '140px' })
      if (this.getActionIconList) headers.push({ text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' })
      return {
        headers,
        sourceList: {
          'REPAIR': 'การส่งซ่อม',
          'COUNTING': 'การตรวจนับ',
        },
      }
    },
  }
</script>

<style lang="scss">
  .withdraw-durable-goods-table {
  }
</style>