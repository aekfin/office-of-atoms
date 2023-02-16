<template>
  <div id="category-list-page">
    <PageHeader text="ประเภท พัสดุ - ครุภัณฑ์" btnText="เพิ่มประเภท" createRoute="/management/category/create/"/>
    <v-data-table :headers="categoryHeaders" :items="categoryItems" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6">
      <template #item.countSubCategory="{ item }">
        <div class="d-flex align-center justify-center">
          <div>{{ item.countSubCategory }}</div>
          <v-btn icon @click="openDialog(item)">
            <v-icon>mdi-information-outline</v-icon>
          </v-btn>
        </div>
      </template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" width="480">
      <v-card>
        <v-card-title class="text-h5 justify-space-between">
          <div>หมวดหมู่ย่อย</div>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="black--text">
          <div class="mt-2">ทั้งหมด {{ selectedSubcategory.length }} หมวด</div>
          <div class="">
            <v-data-table :headers="subcategoryHeaders" :items="selectedSubcategory" :itemsPerPage="20" disableSort hideDefaultFooter class="mt-3">
              <template #item.number="{ index }">{{ index + 1 }}.</template>
            </v-data-table>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
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
            countSubCategory: 4,
            countParcel: 5,
            countDurableGoods: 2,
            subcategory: [
              { id: 1, name: 'Nokia' },
              { id: 2, name: 'Apple' },
              { id: 3, name: 'Samsung' },
              { id: 4, name: 'One Plus' },
            ]
          },
        ],
        subcategoryHeaders: [
          { text: 'ลำดับ', value: 'number', width: '80px', align: 'center' },
          { text: 'ชื่อ', value: 'name' },
        ],
        selectedSubcategory: [],
        dialog: false,
      }
    },
    methods: {
      openDialog (item) {
        this.selectedSubcategory = item.subcategory
        this.dialog = true
      },
      closeDialog () {
        this.dialog = false
      },
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