<template>
  <v-row class="category-durable-good">
    <v-col :cols="cols">
      <SelectDropdown :value.sync="form.majorCategoryId" label="หมวดหมู่ *" apiPath="equipment/category/getMejorCategorys" :rules="categoryRule" required @select="onChangeCategory"/>
    </v-col>
    <v-col :cols="cols">
      <SelectDropdown :value.sync="form.subCategoryId" label="หมวดหมู่ย่อย *" :items="subCategoryItems" :rules="subcategoryRule" required :disabled="!form.majorCategoryId || isLoadingSubCategory" :forceLoading="isLoadingSubCategory" @select="onChangeSubCategory"/>
    </v-col>
    <v-col :cols="cols">
      <SelectDropdown :value.sync="form.typeId" label="ประเภท *" :items="typeItems" :rules="typeRule" required :disabled="!form.subCategoryId || isLoadingType" :forceLoading="isLoadingType" @select="onChangeType"/>
    </v-col>
    <v-col :cols="cols">
      <SelectDropdown :value.sync="form.brandId" label="ยี่ห้อ *" :items="brandItems" :rules="brandRule" required :disabled="!form.typeId || isLoadingBrand" :forceLoading="isLoadingBrand" @select="onChangeBrand"/>
    </v-col>
    <v-col :cols="cols">
      <SelectDropdown :value.sync="form.modelId" label="รุ่น *" :items="modelItems" :rules="modelRule" required :disabled="!form.brandId || isLoadingModel" :forceLoading="isLoadingModel" @select="onChangeModel"/>
    </v-col>
    <slot :categoryForm="form"/>
  </v-row>
</template>

<script>
  import categoryMixins from '~/mixins/categoryMixins.js'
  export default {
    mixins: [categoryMixins],
    props: {
      cols: { type: Number, default: 4 },
    },
  }
</script>

<style lang="scss">
  .category-durable-good {
  }
</style>