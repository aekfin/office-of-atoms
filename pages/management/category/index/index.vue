<template>
  <div id="category-list-page">
    <v-data-table :headers="categoryHeaders" :items="categoryItems" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1">
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
    components: {
      ActionIconList: () => import('~/components/ActionIconList.vue'),
    },
    data () {
      return {
        categoryHeaders: [
          { text: 'ชื่อ', value: 'name' },
          { text: 'จำนวนหมวดหมู่ย่อย', value: 'countSubCategory', align: 'center', width: '200px' },
          { text: 'จำนวนพัสดุ', value: 'countParcel', align: 'center', width: '140px' },
          { text: 'จำนวนครุภัณฑ์', value: 'countDurableGoods', align: 'center', width: '140px' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' }
        ],
        categoryItems: [
          {
            id: 1,
            name: 'โทรศัพท์มือถือ',
            countSubCategory: 1,
            countParcel: 5,
            countDurableGoods: 2,
          },
        ],
      }
    },
    methods: {
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'mdi-pencil', action: `/management/category/${item.id}/` },
          { type: 'confirm', icon: 'mdi-delete', action: () => { console.log('Confirm') } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #category-list-page {
  }
</style>