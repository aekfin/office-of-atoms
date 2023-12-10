<template>
  <v-dialog :key="refreshDialogKey" v-model="createDialog" class="category-dialog" width="720">
    <v-card>
      <v-card-title class="text-h5 justify-space-between">
        <div>{{ title }}</div>
        <v-btn icon @click="createDialog = false">
          <i class="material-icons">close</i>
        </v-btn>
      </v-card-title>
      <v-card-text class="black--text pt-2">
        <div>
          <v-form ref="form" v-model="valid" lazyValidation>
            <SelectDropdown v-if="tabIndex > 0" :value.sync="form.majorCategoryId" label="หมวดหมู่พัสดุ *" apiPath="equipment/category/getMejorCategorys" :items="majorCategoryItems" :rules="categoryRule" required  @select="onChangeCategory"/>
            <SelectDropdown v-if="tabIndex > 1" :value.sync="form.subCategoryId" label="ประเภทพัสดุ *" :items="subCategoryItems" :rules="subcategoryRule" required :disabled=" !form.majorCategoryId || isLoadingSubCategory" :forceLoading="isLoadingSubCategory" @select="onChangeSubCategory"/>
            <SelectDropdown v-if="tabIndex > 2" :value.sync="form.typeId" label="รายการครุภัณฑ์ *" :items="typeItems" :rules="typeRule" required :disabled="isEdit || !form.subCategoryId || isLoadingType" :forceLoading="isLoadingType" @select="onChangeType"/>
            <SelectDropdown v-if="tabIndex > 3" :value.sync="form.brandId" label="ยี่ห้อ *" :items="brandItems" :rules="brandRule" required :disabled="isEdit || !form.typeId || isLoadingBrand" :forceLoading="isLoadingBrand" @select="onChangeBrand"/>
            <v-text-field v-model="form.name" :label="categoryName" :rules="categoryNameRule" required/>
            <template v-if="tabIndex > 3">
              <AttachFileBtn :value.sync="uploadingFiles" :attachments="files" accept="image/gif, image/jpeg, image/png, image/webp" :limit="1" :multiple="false" btnLabel="แนบรูปเพิ่มเติม" showImage @removeAttachment="onRemoveFile"/>
            </template>
          </v-form>
        </div>
      </v-card-text>
      <v-card-actions class="pb-5">
        <v-spacer/>
        <v-btn color="grey" text large @click="createDialog = false">ยกเลิก</v-btn>
        <v-btn color="success" large @click="onSubmit">{{ title }}</v-btn>
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
      editItem: { type: Object },
    },
    data () {
      return {
        refreshDialogKey: false,
        createDialog: this.dialog,
        valid: true,
        uploadingFiles: [],
        files: [],
        removeFiles: [],
      }
    },
    computed: {
      isEdit () {
        return !!this.editItem
      },
      title () {
        return `${this.isEdit ? 'แก้ไข' : 'เพิ่ม' }${ this.tabActive.btnText }`
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
      'createDialog' (val) {
        if (!val) {
          this.resetForm()
          this.uploadingFiles = []
          this.files = []
          this.removeFiles = []
          this.refreshDialogKey = !this.refreshDialogKey
        }
        this.$emit('update:dialog', val)
      },
      'dialog' (val) {
        this.createDialog = val
      },
      'editItem' (val) {
        if (val) this.setForm()
      },
      'tabIndex' () {
        this.resetForm()
        this.uploadingFiles = []
        this.files = []
        this.removeFiles = []
        this.refreshDialogKey = !this.refreshDialogKey
      },
    },
    methods: {
      async setForm () {
        if (this.editItem) {
          this.form = {}
          if (this.editItem.majorCategory) {
            this.form.majorCategoryId = this.editItem.majorCategory.id
            this.majorCategoryItems = [this.editItem.majorCategory]
          }
          if (this.editItem.subCategory) {
            this.form.subCategoryId = this.editItem.subCategory.id
            this.subCategoryItems = [this.editItem.subCategory]
          }
          if (this.editItem.type) {
            this.form.typeId = this.editItem.type.id
            this.typeItems = [this.editItem.type]
          }
          if (this.editItem.brand) {
            this.form.brandId = this.editItem.brand.id
            this.brandItems = [this.editItem.brand]
          }
          this.form.id = this.editItem.id
          this.form.name = this.editItem.name
        }
        const { data } = await this.$store.dispatch('http', { apiPath: `equipment/category/model/${this.editItem.id}` })
        this.files = data.fileInfo
      },
      async onSubmit () {
        const valid = this.$refs.form.validate()
        if (valid) {
          this.$emit(this.isEdit ? 'edit' : 'create', { form: this.form, uploadingFiles: this.uploadingFiles, removeFiles: this.removeFiles })
        }
      },
      onRemoveFile (attach) {
        this.removeFiles.push(attach)
      },
    },
  }
</script>

<style lang="scss">
  .category-dialog {
  }
</style>