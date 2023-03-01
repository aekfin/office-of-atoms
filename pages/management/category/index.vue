<template>
  <div id="category-list-page">
    <v-tabs v-model="tabIndex" class="tabs-underline mb-10" fixedTabs>
      <v-tab v-for="tab in tabs" :key="tab.text">{{ tab.text }}</v-tab>
    </v-tabs>
    <PageHeader :text="tabActive.text" :btnText="tabActive.btnText" :unit="tabActive.unit" :total="total" @create="openCreateDialog"/>
    <v-data-table :headers="categoryHeaders" :items="items" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading">
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
    <Pagination/>

    <v-dialog v-model="createDialog" :key="tabIndex" width="720">
      <v-card>
        <v-card-title class="text-h5 justify-space-between">
          <div>{{ tabActive.btnText }}</div>
          <v-btn icon @click="closeCreateDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="black--text">
          <div>
            <v-form ref="form" v-model="valid" lazyValidation>
              <SelectDropdown v-if="tabIndex > 0" :value.sync="form.category" label="หมวดหมู่ *" apiPath="parcel/getListParcelType" :rules="categoryRule" required/>
              <SelectDropdown v-if="tabIndex > 1" :value.sync="form.category2" label="หมวดหมู่ย่อย *" apiPath="parcel/getListParcelType" :rules="subcategoryRule" required :disabled="!form.category"/>
              <SelectDropdown v-if="tabIndex > 2" :value.sync="form.category3" label="ประเภท *" apiPath="parcel/getListParcelType" :rules="typeRule" required :disabled="!form.category2"/>
              <SelectDropdown v-if="tabIndex > 3" :value.sync="form.category4" label="ยี่ห้อ *" apiPath="parcel/getListParcelType" :rules="brandRule" required :disabled="!form.category3"/>
              <v-text-field v-model="form.name" :label="categoryName" :rules="categoryNameRule" required/>
            </v-form>
          </div>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer/>
          <v-btn color="grey" text large @click="createDialog = false">ยกเลิก</v-btn>
          <v-btn color="success" large @click="onCreate">{{ tabActive.btnText }}</v-btn>
        </v-card-actions>
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
        tabIndex: 0,
        tabs: [
          { text: 'หมวดหมู่', btnText: 'เพิ่มหมวดหมู่', unit: 'หมวด' },
          { text: 'หมวดหมู่ย่อย', btnText: 'เพิ่มหมวดย่อย', unit: 'หมวด' },
          { text: 'ประเภท', btnText: 'เพิ่มประเภท', unit: 'ประเภท' },
          { text: 'ยี่ห้อ', btnText: 'เพิ่มยี่ห้อ', unit: 'ยี่ห้อ' },
          { text: 'รุ่น', btnText: 'เพิ่มรุ่น', unit: 'รุ่น' },
        ],
        isLoading: true,
        total: 0,
        count: 0,
        categoryHeaders: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'ชื่อหมวดหมู่', value: 'name' },
        ],
        items: [],
        createDialog: false,
        valid: true,
        form: {
          name: '',
        },
        categoryRule: [
          v => !!v || 'โปรดเลือกหมวดหมู่',
        ],
        subcategoryRule: [
          v => !!v || 'โปรดเลือกหมวดหมู่ย่อย',
        ],
        typeRule: [
          v => !!v || 'โปรดเลือกประเภท',
        ],
        brandRule: [
          v => !!v || 'โปรดเลือกยี่ห้อ',
        ],
      }
    },
    computed: {
      tabActive () {
        return this.tabs[this.tabIndex || 0]
      },
      categoryName () {
        return `ชื่อ${this.tabActive.text} *`
      },
      categoryNameRule () {
        return [
          v => !!v || `โปรดใส่ชื่อ${this.tabActive.text}`,
        ]
      },
    },
    watch: {
      'tabIndex' () {
        this.resetForm()
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
      resetForm () {
        this.form = {
          name: ''
        }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'mdi-pencil', action: `/management/category/${item.id}/` },
        ]
      },
      openCreateDialog () {
        this.createDialog = true
      },
      closeCreateDialog () {
        this.createDialog = false
      },
      onCreate () {
        const valid = this.$refs.form.validate()
        if (valid) this.createDialog = false
      },
    }
  }
</script>

<style lang="scss">
  #category-list-page {
  }
</style>