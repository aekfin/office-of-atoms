<template>
  <div id="category-list-page">
    <v-tabs v-model="tabIndex" class="tabs-underline mb-10" fixedTabs>
      <v-tab v-for="tab in tabs" :key="tab.text">{{ tab.text }}</v-tab>
    </v-tabs>
    <PageHeader :text="tabActive.text" :btnText="tabActive.btnText" :unit="tabActive.unit" :total="total" @create="createDialog = true"/>
    <v-data-table :headers="categoryHeaders" :items="items" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading">
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
    <Pagination/>
    <CategoryDialog :dialog.sync="createDialog" :tabActive="tabActive" :tabIndex="tabIndex" @create="onCreate"/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      ActionIconList: () => import('~/components/ActionIconList.vue'),
      Pagination: () => import('~/components/Pagination.vue'),
      CategoryDialog: () => import('~/components/CategoryDialog.vue'),
    },
    data () {
      return {
        tabIndex: 0,
        tabs: [
          {
            text: 'หมวดหมู่',
            btnText: 'เพิ่มหมวดหมู่',
            unit: 'หมวด',
            apiPath: 'equipment/category/getMejorCategorys',
            postApiPath: 'equipment/category/addMajorCategory'
          },
          {
            text: 'หมวดหมู่ย่อย',
            btnText: 'เพิ่มหมวดย่อย',
            unit: 'หมวด',
            apiPath: 'equipment/category/getSubCategorys',
            postApiPath: 'equipment/category/addSubCategory'
          },
          {
            text: 'ประเภท',
            btnText: 'เพิ่มประเภท',
            unit: 'ประเภท',
            apiPath: 'equipment/category/types',
            postApiPath: 'equipment/category/addType'
          },
          {
            text: 'ยี่ห้อ',
            btnText: 'เพิ่มยี่ห้อ',
            unit: 'ยี่ห้อ',
            apiPath: 'equipment/category/brands',
            postApiPath: 'equipment/category/addBrand'
          },
          {
            text: 'รุ่น',
            btnText: 'เพิ่มรุ่น',
            unit: 'รุ่น',
            apiPath: 'equipment/category/models',
            postApiPath: 'equipment/category/addModel'
          },
        ],
        isLoading: true,
        total: 0,
        count: 0,
        items: [],
        createDialog: false,
      }
    },
    computed: {
      tabActive () {
        return this.tabs[this.tabIndex || 0]
      },
      categoryHeaders () {
        const headers = [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: `ชื่อ${this.tabActive.text}`, value: 'name' },
        ]
        if (this.tabIndex > 3) headers.push({ text: `ชื่อ${this.tabs[3].text}`, value: 'brandName', width: '160px' })
        if (this.tabIndex > 2) headers.push({ text: `ชื่อ${this.tabs[2].text}`, value: 'typeName', width: '160px' })
        if (this.tabIndex > 1) headers.push({ text: `ชื่อ${this.tabs[1].text}`, value: 'subCategoryName', width: '200px' })
        if (this.tabIndex > 0) headers.push({ text: `ชื่อ${this.tabs[0].text}`, value: 'majorCategoryName', width: '200px' })
        return headers
      },
    },
    watch: {
      'tabIndex' () {
        this.getList()
      },
      '$route.query' () {
        this.getList()
      },
    },
    mounted () {
      this.getList()
    },
    methods: {
      async getList () {
        try {
          this.isLoading = true
          this.items = []
          this.total = 0
          this.count = 0
          const apiPath = this.tabActive.apiPath
          const { data } = await this.$store.dispatch('getListPagination', { apiPath, query: this.$route.query, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'mdi-pencil', action: `/management/category/${item.id}/` },
        ]
      },
      async onCreate (form) {
        try {
          const apiPath = this.tabActive.postApiPath
          const { data } = await this.$store.dispatch('http', { method: 'post', apiPath, data: { ...form, names: [form.name] }, query: this.$route.query })
          this.createDialog = false
          await this.getList()
          await this.$store.dispatch('snackbar', { text: this.isCreate ? 'สร้างค่าเริ่มต้นวัสดุคงคลังสำเร็จ' : 'แก้ไขค่าเริ่มต้นวัสดุคงคลังสำเร็จ' })
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
    }
  }
</script>

<style lang="scss">
  #category-list-page {
  }
</style>