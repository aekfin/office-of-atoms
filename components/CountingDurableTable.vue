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
      <template #item.status="{ index }">
        <v-select v-model="items[index].status" :items="statusList" itemText="name" itemValue="id" appendIcon="keyboard_arrow_down" @change="$emit('changeStatus', items[index])">
          <template #selection="{ item }">
            <span class="d-flex justify-center" style="width: 100%;">{{ item.name }}</span>
          </template>
        </v-select>
      </template>
    </v-data-table>
  </div>
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
      paginationIndex: { type: Number, default: 0 },
    },
    data () {
      return {
        headers: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'เลขที่ครุภัณฑ์', value: 'number', width: '128px', align: 'center' },
          { text: 'ชื่อครุภัณฑ์', value: 'name' },
          { text: 'หมวดหมู่', value: 'majorCategory', width: '120px', align: 'center' },
          { text: 'ผู้ครอบครอง', value: 'organization', width: '120px', align: 'center' },
          { text: 'สถานะ', value: 'status', width: '200px', align: 'center' },
        ],
      }
    },
    computed: {
      statusList () {
        const statusList = this.$store.state.durableGoodStatus
        return Object.keys(statusList).map(key => ({ id: key, name: statusList[key] }))
      },
    },
    methods: {
    }
  }
</script>

<style lang="scss">
  .counting-durable-table {

  }
</style>