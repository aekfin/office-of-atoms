<template>
  <div id="category-list-page">
    <v-tabs v-model="tabIndex" class="tabs-underline mb-10" fixedTabs showArrows>
      <v-tab v-for="tab in tabs" :key="tab.text">{{ tab.text }}</v-tab>
    </v-tabs>
    <PageHeader :text="tabActive.text" :btnText="`เพิ่ม${tabActive.btnText}`" :unit="tabActive.unit" :total="total" :filters="filters" @create="createDialog = true"/>
    <v-data-table :headers="categoryHeaders" :items="items" disableSort hideDefaultFooter class="elevation-1 mt-6" 
    :loading="isLoading" >
      
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
    <Pagination/>
    <CategoryDialog :dialog.sync="createDialog" :tabActive="tabActive" :tabIndex="tabIndex" :editItem="editItem" @create="onCreate" @edit="onEdit"/>
    <ConfirmDialog :value.sync="errorDialog" title="แจ้งเตือน" :text="`ไม่สามารถลบ${tabActive.text}ได้ เนื่องจากมีการใช้${tabActive.text}นี้ไปแล้ว`" hideSubmit closeText="รับทราบ"/>
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
      const tabIndex = this.$route.query?.tabIndex ? parseInt(this.$route.query?.tabIndex) : 0
      return {
        tabIndex,
        tabs: [
          {
            text: 'หมวดหมู่พัสดุ',
            btnText: 'หมวดหมู่พัสดุ',
            unit: 'หมวด',
            apiPath: 'equipment/category/getMejorCategorys',
            postApiPath: 'equipment/category/addMajorCategory',
            editApiPath: 'equipment/category/mejorCategory',
            deleteApiPath: 'equipment/category/delete-mejorCategory',
            searchApiPath: 'equipment/category/mejorCategory/search',
          },
          {
            text: 'ประเภทพัสดุ',
            btnText: 'ประเภทพัสดุ',
            unit: 'ประเภท',
            apiPath: 'equipment/category/getSubCategorys',
            postApiPath: 'equipment/category/addSubCategory',
            editApiPath: 'equipment/category/subCategory',
            deleteApiPath: 'equipment/category/delete-subCategory',
            searchApiPath: 'equipment/category/subCategory/search',
          },
          {
            text: 'รายการครุภัณฑ์',
            btnText: 'รายการครุภัณฑ์',
            unit: 'รายการ',
            apiPath: 'equipment/category/types',
            postApiPath: 'equipment/category/addType',
            editApiPath: 'equipment/category/type',
            deleteApiPath: 'equipment/category/delete-type',
            searchApiPath: 'equipment/category/type/search',
          },
          {
            text: 'ยี่ห้อ',
            btnText: 'ยี่ห้อ',
            unit: 'ยี่ห้อ',
            apiPath: 'equipment/category/brands',
            postApiPath: 'equipment/category/addBrand',
            editApiPath: 'equipment/category/Brand',
            deleteApiPath: 'equipment/category/delete-brand',
            searchApiPath: 'equipment/category/brand/search',
          },
          {
            text: 'รุ่น',
            btnText: 'รุ่น',
            unit: 'รุ่น',
            apiPath: 'equipment/category/models',
            postApiPath: 'equipment/category/addModel',
            editApiPath: 'equipment/category/Model',
            deleteApiPath: 'equipment/category/delete-model',
            searchApiPath: 'equipment/category/model/search',
          },
        ],
        editItem: null,
        isLoading: true,
        total: 0,
        count: 0,
        items: [],
        createDialog: false,
        errorDialog: false,
       
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
        if (this.tabIndex > 3) headers.push({ text: `ชื่อ${this.tabs[3].text}`, value: 'brand.name', width: '200px' })
        if (this.tabIndex > 2) headers.push({ text: `ชื่อ${this.tabs[2].text}`, value: 'type.name', width: '200px' })
        if (this.tabIndex > 1) headers.push({ text: `ชื่อ${this.tabs[1].text}`, value: 'subCategory.name', width: '240px' })
        if (this.tabIndex > 0) headers.push({ text: `ชื่อ${this.tabs[0].text}`, value: 'majorCategory.name', width: '240px' })
        headers.push({ text: `เครื่องมือ`, value: 'action', width: '100px' })
        return headers
      },
      filters () {
        const filters = [{ type: 'textField', name: 'ชื่อหมวดหมู่พัสดุ', param: 'majorCategoryName' }]
        if (this.tabIndex > 0) filters.push({ type: 'textField', name: 'ชื่อประเภทพัสดุ', param: 'subCategoryName' })
        if (this.tabIndex > 1) filters.push({ type: 'textField', name: 'ชื่อรายการครุภัณฑ์', param: 'typeName' })
        if (this.tabIndex > 2) filters.push({ type: 'textField', name: 'ชื่อยี่ห้อ', param: 'brandName' })
        if (this.tabIndex > 3) filters.push({ type: 'textField', name: 'ชื่อรุ่น', param: 'modelName' })
        //const filters = [{ type: 'textField', name: `ชื่อ${this.tabActive.text}`, param: 'search', md: '12' }]
        return filters
      },
    },
    watch: {
      'tabIndex' (val) {
        this.$router.push({ query: { tabIndex: val } })
      },
      '$route.query' () {
        this.getList()
      },
      'createDialog' (val) {
        if (!val) this.editItem = null
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
        const action = () => {
          this.editItem = item
          this.createDialog = true
        } 
        return [
          { type: 'button', icon: 'edit', action },
          { type: 'confirm', icon: 'delete', action: () => { this.onDelete(item) } },
        ]
      },
      async onDelete (item) {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: `${this.tabActive.deleteApiPath}/${item.id}` })
          if (data?.status?.code == 400) this.errorDialog = true
          else await this.$store.dispatch('snackbar', { text: `ลบ${this.tabActive.text}สำเร็จ` })
          await this.getList()
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      async onCreate ({ form, uploadingFiles, removeFiles }) {
        try {
          const apiPath = this.tabActive.postApiPath
          const { data } = await this.$store.dispatch('http', { method: 'post', apiPath, data: { ...form, names: [form.name] }, query: this.$route.query })
          
          if (data?.status?.code == 400){
            await this.$store.dispatch('snackbar', { text: `สร้าง${this.tabActive.text}ไม่สำเร็จ` , props: { color: 'red' }})
          }
          else {
            await this.onFileImage({ id: data?.[0]?.id, uploadingFiles, removeFiles })
            this.createDialog = false
            await this.getList()
            await this.$store.dispatch('snackbar', { text: `สร้าง${this.tabActive.text}สำเร็จ` })
          }


         
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async onEdit ({ form, uploadingFiles, removeFiles }) {
        try {
          let { editApiPath } = this.tabActive
          editApiPath = editApiPath && form.id && `${this.tabActive.editApiPath}/${form.id}`
          if (editApiPath) await this.$store.dispatch('http', { method: 'patch', apiPath: editApiPath, data: { name: form.name } })
          if (uploadingFiles?.length) await this.onFileImage({ id: form.id, uploadingFiles, removeFiles })
          if (removeFiles?.length) await this.onFileImage({ id: form.id, uploadingFiles, removeFiles })
          this.createDialog = false
          await this.$store.dispatch('snackbar', { text: `แก้ไข${this.tabActive.text}สำเร็จ` })
          await this.getList()
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      async onFileImage ({ id, uploadingFiles, removeFiles }) {
        try {
          if (uploadingFiles?.length) {
            const files = uploadingFiles
            let data = new FormData()
            for (const file of files) {
              data.append('file', file)
            }
            data.append('modelId', id)
            await this.$store.dispatch('http', { method: 'post', apiPath: 'equipment/uploadFileModel', data })
          }
          if (removeFiles?.length) {
            await Promise.all(removeFiles.map(file => this.$axios({ method: 'delete', url: `${file}/delete`.replace('/frs/webservice', '') })))
          }
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
    }
  }
</script>

<style lang="scss">
  #category-list-page {
  }
</style>