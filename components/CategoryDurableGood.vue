<template>
  <v-row class="category-durable-good">
    <v-col :cols="12" :md="cols"> 
      <SelectDropdown :value.sync="form.majorCategoryId" :label="`หมวดหมู่พัสดุ ${noRules ? '' : '*'}`" apiPath="equipment/category/getMejorCategorys?pageSize=1000" :items="majorCategoryItems" :rules="!noRules && categoryRule || []" required :disabled="disabled" @select="onChangeCategory"/>
    </v-col>
    <v-col :cols="12" :md="cols">
      <SelectDropdown :value.sync="form.subCategoryId" :label="`ประเภทพัสดุ ${noRules ? '' : '*'}`" :items="subCategoryItems" :rules="!noRules && subcategoryRule || []" required :disabled="disabled || !form.majorCategoryId || isLoadingSubCategory" :forceLoading="isLoadingSubCategory" @select="onChangeSubCategory"/>
    </v-col>
    <v-col :cols="12" :md="cols">
      <SelectDropdown :value.sync="form.typeId" :label="`รายการครุภัณฑ์ ${noRules ? '' : '*'}`" :items="typeItems" :rules="!noRules && typeRule || []" required :disabled="disabled || !form.subCategoryId || isLoadingType" :forceLoading="isLoadingType" @select="onChangeType"/>
    </v-col>
    <!-- <v-col :cols="12" :md="cols">
      <SelectDropdown :value.sync="form.brandId" :label="`ยี่ห้อ ${noRules ? '' : '*'}`" :items="brandItems" :rules="!noRules && brandRule || []" required :disabled="disabled || !form.typeId || isLoadingBrand" :forceLoading="isLoadingBrand" @select="onChangeBrand"/>
    </v-col>
    <v-col :cols="12" :md="cols">
      <SelectDropdown :value.sync="form.modelId" :label="`รุ่น ${noRules ? '' : '*'}`" :items="modelItems" :rules="!noRules && modelRule || []" required :disabled="disabled || !form.brandId || isLoadingModel" :forceLoading="isLoadingModel" @select="onChangeModel"/>
    </v-col> -->
    <v-col :cols="12" :md="cols">
      <SelectDropdown :value.sync="form.brandId" :label="`ยี่ห้อ ${noRules ? '' : '*'}`" apiPath="equipment/category/brands?pageSize=1000" :items="brandItems" :rules="!noRules && brandRule || []" required :disabled="disabled || isLoadingBrand" :forceLoading="isLoadingBrand" />
    </v-col>
    <v-col :cols="12" :md="cols">
      <SelectDropdown :value.sync="form.modelId" :label="`รุ่น ${noRules ? '' : '*'}`" apiPath="equipment/category/models?pageSize=1000" :items="modelItems" :rules="!noRules && modelRule || []" required :disabled="disabled || isLoadingModel" :forceLoading="isLoadingModel" />
    </v-col>
    <slot :categoryForm="form"/>
  </v-row>
</template>

<script>
  import _ from 'lodash'
  import categoryMixins from '~/mixins/categoryMixins.js'
  export default {
    mixins: [categoryMixins],
    props: {
      cols: { type: Number, default: 3 },
      disabled: { type: Boolean },
      initForm: { type: Object },
      initCategory: { type: Object },
      noRules: { type: Boolean },
      itemEquipment: { type: Object },
    },
    watch: {
      async 'initForm' (val, oldVal) {
        this.setForm()
      }
    },
    mounted () {
      this.setForm()
      if (!_.isEmpty(this.initCategory)) this.onInitCategory()
    },
    methods: {
      async setForm () {
        console.log('this.initForm',this.initForm);
        if (!_.isEmpty(this.initForm)) {
          try {
            this.form = this.initForm
            const res = await Promise.all([
              this.onChangeCategory({ val: this.form.majorCategoryId, reset: false }),
              this.onChangeSubCategory({ val: this.form.subCategoryId, reset: false }),
              this.onChangeType({ val: this.form.typeId, reset: false }),
              this.onChangeBrand({ val: this.form.brandId, reset: false }),
            ])
            return Promise.resolve(res)
          } catch (err) { return Promise.reject(err) }
        }
      },
      onInitCategory () {
        console.log('this.initCategory this.initCategory',this.initCategory);
        this.form = {
          majorCategoryId: this.initCategory.majorCategory?.id,
          subCategoryId: this.initCategory.subCategory?.id,
          typeId: this.initCategory.type?.id,
          brandId: this.initCategory.brand?.id,
          modelId: this.initCategory.model?.id,
        }
        this.majorCategoryItems = [this.initCategory.majorCategory]
        this.subCategoryItems = [this.initCategory.subCategory]
        this.typeItems = [this.initCategory.type]
        this.brandItems = [this.initCategory.brand]
        this.modelItems = [this.initCategory.model]
        console.log('this.majorCategoryItems',this.majorCategoryItems);
        console.log('this.subCategoryItems',this.majorCategoryItems);
        console.log('this.typeItems',this.typeItems);
        console.log('this.brandItems',this.brandItems);
        console.log('this.modelItems',this.modelItems);
        this.$emit('change', { form: this.form })
      },
    }
  }
</script>

<style lang="scss">
  .category-durable-good {
  }
</style>