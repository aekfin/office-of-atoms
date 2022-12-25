<template>
  <div id="category-list-page">
    <v-tabs v-model="activeTab" color="black" class="mb-6">
      <v-tab>หมวดหมู่หลัก</v-tab>
      <v-tab>หมวดหมู่ย่อย</v-tab>
    </v-tabs>
    <div v-if="isCategory">
      <v-data-table :headers="categoryHeaders" :items="categoryItems" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1">
        <template #item.action="{ item }">
          <NLink :to="`/management/category/${item.id}/`"><v-icon>mdi-pencil</v-icon></NLink>
          <v-icon>mdi-delete</v-icon>
        </template>
      </v-data-table>
    </div>
    <div v-else-if="isSubCategory">
      <v-data-table :headers="subCategoryHeaders" :items="subCategoryItems" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1">
        <template #item.action="{ item }">
          <NLink :to="`/management/category/sub/${item.id}/`"><v-icon>mdi-pencil</v-icon></NLink>
          <v-icon>mdi-delete</v-icon>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        activeTab: 0,
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
            name: 'Nokia N95',
            category: 'โทรศัพท์มือถือ',
            countParcel: 5,
            countDurableGoods: 2,
          },
        ],
      }
    },
    computed: {
      isCategory () {
        return this.activeTab === 0
      },
      isSubCategory () {
        return this.activeTab === 1
      },
    }
  }
</script>

<style lang="scss">
  #category-list-page {
  }
</style>