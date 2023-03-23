<template>
  <v-dialog :key="refreshDialogKey" v-model="createDialog" class="category-dialog" width="720">
    <v-card>
      <v-card-title class="text-h5 justify-space-between">
        <div>{{ tabActive.btnText }}</div>
        <v-btn icon @click="createDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="black--text pt-2">
        <div>
          <v-form ref="form" v-model="valid" lazyValidation>
            <SelectDropdown v-if="tabIndex > 0" :value.sync="form.majorCategoryId" label="หมวดหมู่พัสดุ *" apiPath="equipment/category/getMejorCategorys" :rules="categoryRule" required @select="onChangeCategory"/>
            <SelectDropdown v-if="tabIndex > 1" :value.sync="form.subCategoryId" label="ประเภทพัสดุ *" :items="subCategoryItems" :rules="subcategoryRule" required :disabled="!form.majorCategoryId || isLoadingSubCategory" :forceLoading="isLoadingSubCategory" @select="onChangeSubCategory"/>
            <SelectDropdown v-if="tabIndex > 2" :value.sync="form.typeId" label="รายการครุภัณฑ์ *" :items="typeItems" :rules="typeRule" required :disabled="!form.subCategoryId || isLoadingType" :forceLoading="isLoadingType" @select="onChangeType"/>
            <SelectDropdown v-if="tabIndex > 3" :value.sync="form.brandId" label="ยี่ห้อ *" :items="brandItems" :rules="brandRule" required :disabled="!form.typeId || isLoadingBrand" :forceLoading="isLoadingBrand" @select="onChangeBrand"/>
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
</template>

<script>
  import categoryMixins from '~/mixins/categoryMixins.js'
  export default {
    mixins: [categoryMixins],
    props: {
      dialog: { type: Boolean, required: true },
      tabActive: { type: Object, required: true },
      tabIndex: { type: [Number, String], required: true },
    },
    data () {
      return {
        refreshDialogKey: false,
        createDialog: this.dialog,
        valid: true,
      }
    },
    computed: {
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
      'createDialog' (val) {
        if (!val) {
          this.resetForm()
          this.refreshDialogKey = !this.refreshDialogKey
        }
        this.$emit('update:dialog', val)
      },
      'dialog' (val) {
        this.createDialog = val
      },
      'tabIndex' () {
        this.resetForm()
        this.refreshDialogKey = !this.refreshDialogKey
      },
    },
    methods: {
      async onCreate () {
        const valid = this.$refs.form.validate()
        if (valid) this.$emit('create', this.form)
      },
    },
  }
</script>

<style lang="scss">
  .category-dialog {
  }
</style>