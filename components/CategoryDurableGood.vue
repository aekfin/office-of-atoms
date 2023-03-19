<template>
  <v-row class="category-durable-good">
    <v-col :cols="12" :md="cols">
      <SelectDropdown :value.sync="form.majorCategoryId" label="หมวดหมู่ *" apiPath="equipment/category/getMejorCategorys" :rules="!noRules && categoryRule" required :disabled="disabled" @select="onChangeCategory"/>
    </v-col>
    <v-col :cols="12" :md="cols">
      <SelectDropdown :value.sync="form.subCategoryId" label="หมวดหมู่ย่อย *" :items="subCategoryItems" :rules="!noRules && subcategoryRule" required :disabled="disabled || !form.majorCategoryId || isLoadingSubCategory" :forceLoading="isLoadingSubCategory" @select="onChangeSubCategory"/>
    </v-col>
    <v-col :cols="12" :md="cols">
      <SelectDropdown :value.sync="form.typeId" label="ประเภท *" :items="typeItems" :rules="!noRules && typeRule" required :disabled="disabled || !form.subCategoryId || isLoadingType" :forceLoading="isLoadingType" @select="onChangeType"/>
    </v-col>
    <v-col :cols="12" :md="cols">
      <SelectDropdown :value.sync="form.brandId" label="ยี่ห้อ *" :items="brandItems" :rules="!noRules && brandRule" required :disabled="disabled || !form.typeId || isLoadingBrand" :forceLoading="isLoadingBrand" @select="onChangeBrand"/>
    </v-col>
    <v-col :cols="12" :md="cols">
      <SelectDropdown :value.sync="form.modelId" label="รุ่น *" :items="modelItems" :rules="!noRules && modelRule" required :disabled="disabled || !form.brandId || isLoadingModel" :forceLoading="isLoadingModel" @select="onChangeModel"/>
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
      cols: { type: Number, default: 4 },
      disabled: { type: Boolean },
      initForm: { type: Object },
      noRules: { type: Boolean },
    },
    watch: {
      async 'initForm' () {
        this.setForm()
      }
    },
    mounted () {
      this.setForm()
    },
    methods: {
      async setForm () {
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
      }
    }
  }
</script>

<style lang="scss">
  .category-durable-good {
  }
</style>