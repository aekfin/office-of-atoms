<template>
  <v-data-table :headers="headers" :items="items" class="elevation-1">
    <template #item.index="{ index }">{{ index + 1 }}</template>
    <template #item.name="{ item }">{{ item.name }}</template>
    <template #item.quantity="{ item }">{{ item.quantity }}</template>
  </v-data-table>
</template>

<script>
export default {
  name: 'SubEquipmentTable',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data () {
    return {
      headers: [
        { text: 'ลำดับ', value: 'index' },
        { text: 'ชื่อ', value: 'name' },
        { text: 'จำนวน', value: 'quantity' },
      ],
    };
  },
};
</script>
