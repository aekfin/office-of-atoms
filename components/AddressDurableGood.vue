<template>
  <v-row class="col col-12">
    <v-col :cols="12" :md="cols">
      <SelectDropdown :value.sync="form.companyProvince" label="จังหวัด *" apiPath="Orgchart/getListProvince?pageSize=1000" :items="companyProvinceItems" :rules="provinceRules" required :disabled="disabled" @select="onChangeProvince"/>
    </v-col>
    <v-col :cols="12" :md="cols">
      <SelectDropdown :value.sync="form.companyDistrict" label="อำเภอ/เขต *" :items="companyDistrictItems" :rules="districtRules" required :disabled="disabled || !form.companyProvince || isLoadingcompanyDistrict" :forceLoading="isLoadingcompanyDistrict" @select="onChangeDistrict"/>
    </v-col>
    <v-col :cols="12" :md="cols">
      <SelectDropdown :value.sync="form.companySubDistrict" label="ตำบล/แขวง *" :items="companySubDistrictItems" :rules="subDistrictRules" required :disabled="disabled || !form.companyDistrict || isLoadingcompanySubDistrict" :forceLoading="isLoadingcompanySubDistrict" @select="onChangeSubDistrict"/>
    </v-col>
    <v-col :cols="12" :md="cols">
      <v-text-field v-model="form.companyPostcode" name="companyPostcode" label="รหัสไปรษณีย์ *" disabled :rules="postcodeRules" required/>
    </v-col>
    <slot :categoryForm="form"/>
  </v-row>
</template>

<script>
  import _ from 'lodash'
  import addressMixins from '~/mixins/addressMixins.js'
  export default {
    mixins: [addressMixins],
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
              this.onChangeProvince({ val: this.form.companyProvince, reset: false }),
              this.onChangeDistrict({ val: this.form.companyDistrict, reset: false }),
              this.onChangeSubDistrict({ val: this.form.companySubDistrict, reset: false }),
            ])
            return Promise.resolve(res)
          } catch (err) { return Promise.reject(err) }
        }
      },
      onInitCategory () {
        console.log('this.initCategory this.initCategory',this.initCategory);
        this.form = {
          companyProvince: this.initCategory.province?.id,
          companyDistrict: this.initCategory.district?.id,
          companySubDistrict: this.initCategory.subDistrict?.id,
          companyPostcode: this.initCategory.subDistrict?.zipCode,
        }
        this.companyProvinceItems = [this.initCategory.province]
        this.companyDistrictItems = [this.initCategory.district]
        this.companySubDistrictItems = [this.initCategory.subDistrict]
        console.log('this.companyProvinceItems',this.companyProvinceItems);
        console.log('this.companyDistrictItems',this.companyDistrictItems);
        console.log('this.companySubDistrictItems',this.companySubDistrictItems);
        this.$emit('change', { form: this.form })
      },
    }
  }
</script>

<style lang="scss">
  .category-durable-good {
  }
</style>