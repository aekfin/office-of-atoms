export default {
  data () {
    return {
      form: {
        companyProvince: null,
        companyDistrict: null,
        companySubDistrict: null,
      },
      subDistrictRules: [
        v => !!v || 'โปรดใส่ ตำบล/แขวง',
      ],
      districtRules: [
        v => !!v || 'โปรดใส่ อำเถอ/แขวง',
      ],
      provinceRules: [
        v => !!v || 'โปรดใส่ จังหวัด',
      ],
      postcodeRules: [
        v => !!v || 'โปรดใส่รหัสไปรษณีย์',
      ],
      companyProvinceItems: [],
      companyDistrictItems: [],
      companySubDistrictItems: [],
      isLoadingcompanyDistrict: false,
      isLoadingcompanySubDistrict: false,
    }
  },
  methods: {
    resetForm () {
      this.form = {
        companyProvince: null,
        companyDistrict: null,
        companySubDistrict: null,
      }
      this.companyProvinceItems = []
      this.companyDistrictItems = []
      this.companySubDistrictItems = []
    },
    resetOnCategory () {
      this.form.subCategoryId = null
      this.form.typeId = null
      // this.form.brandId = null
      // this.form.modelId = null
      this.subCategoryItems = []
      this.typeItems = []
      // this.brandItems = []
      // this.modelItems = []
    },
    resetOnProvince () {
      this.form.companyDistrict = null
      this.form.companySubDistrict = null
      this.form.companyPostcode = null
      this.companyDistrictItems = []
      this.companySubDistrictItems = []
      this.companyPostcodeItems = []
    },
    resetOnDistrict () {
      this.form.companySubDistrict = null
      this.form.companyPostcode = null
      this.companySubDistrictItems = []
      this.companyPostcodeItems = []
    },
    resetOnSubDistrict () {
      this.form.companyPostcode = null
      this.companyPostcodeItems = []
    },
    async onChangeProvince ({ val, reset = true }) {
      try {
        this.isLoadingcompanyDistrict = true
        if (reset) this.resetOnProvince()
        const { data } = await this.$store.dispatch('http', { apiPath: `Orgchart/getProvinceById/${val}`, query: this.$route.query })
        console.log('data.district ',data.district);
        this.companyDistrictItems = data.district
        this.isLoadingcompanyDistrict = false
        return Promise.resolve(data)
      } catch (err) { return Promise.reject(err) }
    },      
    async onChangeDistrict ({ val, reset = true }) {
      try {
        this.isLoadingcompanySubDistrict = true
        if (reset) this.resetOnDistrict()
        const { data } = await this.$store.dispatch('http', { apiPath: `Orgchart/getDistrictById/${val}`, query: this.$route.query })
        this.companySubDistrictItems = data.subDistrict
        this.isLoadingcompanySubDistrict = false
        return Promise.resolve(data)
      } catch (err) { return Promise.reject(err) }
    },
    async onChangeSubDistrict ({ val, reset = true }) {
      try {
        this.isLoadingcompanySubDistrict = true
        if (reset) this.resetOnSubDistrict()
        const { data } = await this.$store.dispatch('http', { apiPath: `Orgchart/getSubDistrictById/${val}`, query: this.$route.query })
        console.log('onChangeSubDistrict data',data);
        this.form.companyPostcode = data.zipCode
        this.$emit('change', { form: this.form})
        this.isLoadingcompanySubDistrict = false
        return Promise.resolve(data)
      } catch (err) { return Promise.reject(err) }
    },     
  },
}