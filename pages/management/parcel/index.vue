<template>
  <div id="parcel-page">
    <PageHeader text="ค่าเริ่มต้นพัสดุ" btnText="เพิ่มค่าเริ่มต้นพัสดุ" createRoute="/management/parcel/create/"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6">
      <template #item.price="{ item }">{{ $fn.getPrice(item.price) }}</template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      ActionIconList: () => import('~/components/ActionIconList.vue'),
    },
    data () {
      return {
        headers: [
          { text: 'ชื่อ', value: 'name', width: '25%' },
          { text: 'หมวดหมู่หลัก', value: 'category', width: '200px', align: 'center' },
          { text: 'หมวดหมู่ย่อย', value: 'subcategory', width: '200px', align: 'center' },
          { text: 'ราคากลาง', value: 'price', align: 'center', width: '120px' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        items: [
          {
            id: 1,
            type: 1,
            name: 'โทรศัพท์มือถือ Nokia N95',
            category: 'โทรศัพท์มือถือ',
            subcategory: 'Nokia',
            price: 1000,
          },
        ],
        types: {
          '1': 'พัสดุ',
          '2': 'ครุภัณฑ์'
        }
      }
    },
    methods: {
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'mdi-pencil', action: `/management/parcel/${item.id}/` },
          { type: 'confirm', icon: 'mdi-delete', action: () => { console.log('Confirm') } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #parcel-page {
  }
</style>