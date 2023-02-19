<template>
  <div id="category-list-page">
    <PageHeader text="ประเภท พัสดุ - ครุภัณฑ์" btnText="เพิ่มประเภท" createRoute="/management/category/create/"/>
    <v-data-table :headers="categoryHeaders" :items="items" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading">
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.countBrands="{ item }">
        <div class="d-flex align-center justify-center">
          <div>{{ item.listBrands.length || 1 }}</div>
          <v-btn icon @click="openBrandDialog(item)">
            <v-icon>mdi-information-outline</v-icon>
          </v-btn>
        </div>
      </template>
      <template #item.countModels="{ item }">
        <div class="d-flex align-center justify-center">
          <div>{{ getCountModels(item) }}</div>
          <v-btn icon @click="openModelDialog(item)">
            <v-icon>mdi-information-outline</v-icon>
          </v-btn>
        </div>
      </template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
    <Pagination/>

    <v-dialog v-model="brandDialog" width="720">
      <v-card v-if="selectedType">
        <v-card-title class="text-h5 justify-space-between">
          <div>รายละเอียดยี่ห้อ</div>
          <v-btn icon @click="closeBrandDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="black--text">
          <div class="mt-2">ทั้งหมด {{ selectedType.listBrands.length }} ยี่ห้อ</div>
          <v-data-table :headers="brandHeaders" :items="selectedType.listBrands" disableSort hideDefaultFooter class="mt-3" height="250px" :itemsPerPage="-1">
            <template #item.number="{ index }">{{ index + 1 }}.</template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modelDialog" width="720">
      <v-card v-if="selectedType">
        <v-card-title class="text-h5 justify-space-between">
          <div>รายละเอียดรุ่น</div>
          <v-btn icon @click="closeModelDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="black--text">
          <div class="mt-2">ทั้งหมด {{ getCountModels(selectedType) }} รุ่น</div>
          <v-data-table :headers="modelHeaders" :items="getModels(selectedType)" disableSort hideDefaultFooter class="mt-3" height="250px" :itemsPerPage="-1">
            <template #item.number="{ index }">{{ index + 1 }}.</template>
          </v-data-table>
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
      Pagination: () => import('~/components/Pagination.vue'),
    },
    data () {
      return {
        isLoading: true,
        categoryHeaders: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'ชื่อ', value: 'name' },
          { text: 'จำนวนยี่ห้อ', value: 'countBrands', align: 'center', width: '200px' },
          { text: 'จำนวนรุ่น', value: 'countModels', align: 'center', width: '200px' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' }
        ],
        items: [],
        brandHeaders: [
          { text: 'ลำดับ', value: 'number', width: '80px', align: 'center' },
          { text: 'ชื่อ', value: 'name' },
        ],
        modelHeaders: [
          { text: 'ลำดับ', value: 'number', width: '80px', align: 'center' },
          { text: 'ชื่อ', value: 'name' },
          { text: 'ยี่ห้อ', value: 'brandName' }          
        ],
        selectedType: null,
        brandDialog: false,
        modelDialog: false,
      }
    },
    mounted () {
      this.getList()
    },
    methods: {
      async getList () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'parcel/getListParcelType', query: this.$route.query, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getCountModels (item) {
        return item.listBrands.reduce((count, brand) => count + brand.listModels.length, 0)
      },
      getModels (selectedType) {
        return selectedType.listBrands.reduce((models, brand) => {
          return [ ...models, ...(brand.listModels.map(model => ({ ...model, brandName: brand.name }))) ]
        }, [])
      },
      openBrandDialog (item) {
        this.selectedType = item
        this.brandDialog = true
      },
      closeBrandDialog () {
        this.brandDialog = false
      },
      openModelDialog (item) {
        this.selectedType = item
        this.modelDialog = true
      },
      closeModelDialog () {
        this.modelDialog = false
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'mdi-pencil', action: `/management/category/${item.id}/` },
          // { type: 'confirm', icon: 'mdi-delete', action: () => { console.log('Confirm') } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #category-list-page {
  }
</style>