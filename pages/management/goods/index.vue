<template>
  <div id="goods-page">
    <PageHeader text="ค่าเริ่มต้น พัสดุ - ครุภัณฑ์" btnText="เพิ่มพัสดุ - ครุภัณฑ์" createRoute="/management/goods/create/"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6">
      <template #item.type="{ item }">{{ types[item.type] }}</template>
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
          { text: 'รูปแบบ', value: 'type', align: 'center', width: '100px' },
          { text: 'ชื่อ', value: 'name', width: '25%' },
          { text: 'หมวดหมู่หลัก', value: 'category', width: '200px', align: 'center' },
          { text: 'หมวดหมู่ย่อย', value: 'subcategory', width: '200px', align: 'center' },
          { text: 'จำนวน', value: 'count', align: 'center', width: '120px' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        items: [
          {
            id: 1,
            type: 1,
            name: 'โทรศัพท์มือถือ Nokia N95',
            category: 'โทรศัพท์มือถือ',
            subcategory: 'Nokia',
            count: 10,
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
          { type: 'link', icon: 'mdi-pencil', action: `/management/goods/${item.id}/` },
          { type: 'confirm', icon: 'mdi-delete', action: () => { console.log('Confirm') } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #goods-page {
  }
</style>