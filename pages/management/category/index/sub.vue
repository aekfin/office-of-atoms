<template>
  <div id="subcategory-list-page">
    <PageHeader text="หมวดหมู่ย่อย" btnText="เพิ่มหมวดหมู่ย่อย" createRoute="/management/category/sub/create/"/>
    <v-data-table :headers="subCategoryHeaders" :items="subCategoryItems" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6">
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
        subCategoryHeaders: [
          { text: 'ชื่อ', value: 'name' },
          { text: 'หมวดหมู่หลัก', value: 'category', width: '280px', align: 'center' },
          { text: 'จำนวนพัสดุ', value: 'countParcel', align: 'center', width: '140px' },
          { text: 'จำนวนครุภัณฑ์', value: 'countDurableGoods', align: 'center', width: '140px' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' }
        ],
        subCategoryItems: [
          {
            id: 1,
            name: 'Nokia',
            category: 'โทรศัพท์มือถือ',
            countParcel: 5,
            countDurableGoods: 2,
          },
        ],
      }
    },
    methods: {
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'mdi-pencil', action: `/management/category/sub/${item.id}/` },
          { type: 'confirm', icon: 'mdi-delete', action: () => { console.log('Confirm') } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #subcategory-list-page {
  }
</style>