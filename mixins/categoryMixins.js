export default {
  data () {
    return {
      form: {
        majorCategoryId: null,
        subCategoryId: null,
        typeId: null,
        brandId: null,
        modelId: null,
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
      modelRule: [
        v => !!v || 'โปรดเลือกรุ่น',
      ],
      majorCategoryItems: [],
      subCategoryItems: [],
      typeItems: [],
      brandItems: [],
      modelItems: [],
      isLoadingSubCategory: false,
      isLoadingType: false,
      isLoadingBrand: false,
      isLoadingModel: false,
    }
  },
  methods: {
    resetForm () {
      this.form = {
        majorCategoryId: null,
        subCategoryId: null,
        typeId: null,
        brandId: null,
        modelId: null,
      }
    },
    resetOnCategory () {
      this.form.subCategoryId = null
      this.form.typeId = null
      this.form.brandId = null
      this.form.modelId = null
      this.subCategoryItems = []
      this.typeItems = []
      this.brandItems = []
      this.modelItems = []
    },
    resetOnSubCategory () {
      this.form.typeId = null
      this.form.brandId = null
      this.form.modelId = null
      this.typeItems = []
      this.brandItems = []
      this.modelItems = []
    },
    resetOnType () {
      this.form.brandId = null
      this.form.modelId = null
      this.brandItems = []
      this.modelItems = []
    },
    resetOnBrand () {
      this.form.modelId = null
      this.modelItems = []
    },
    async onChangeCategory ({ val, reset = true }) {
      try {
        this.isLoadingSubCategory = true
        if (reset) this.resetOnCategory()
        const { data } = await this.$store.dispatch('http', { apiPath: `equipment/category/mejorCategory/${val}`, query: this.$route.query })
        this.subCategoryItems = data.subCategorys
        this.isLoadingSubCategory = false
        this.$emit('change', { form: this.form, trigger: 'category', val })
        return Promise.resolve(data)
      } catch (err) { return Promise.reject(err) }
    },
    async onChangeSubCategory ({ val, reset = true }) {
      try {
        this.isLoadingType = true
        if (reset) this.resetOnSubCategory()
        const { data } = await this.$store.dispatch('http', { apiPath: `equipment/category/subCategory/${val}`, query: this.$route.query })
        this.typeItems = data.types
        this.isLoadingType = false
        this.$emit('change', { form: this.form, trigger: 'subCategory', val })
        return Promise.resolve(data)
      } catch (err) { return Promise.reject(err) }
    },
    async onChangeType ({ val, reset = true }) {
      try {
        this.isLoadingBrand = true
        if (reset) this.resetOnType()
        const { data } = await this.$store.dispatch('http', { apiPath: `equipment/category/type/${val}`, query: this.$route.query })
        this.brandItems = data.brands
        this.isLoadingBrand = false
        this.$emit('change', { form: this.form, trigger: 'type', val })
        return Promise.resolve(data)
      } catch (err) { return Promise.reject(err) }
    },
    async onChangeBrand ({ val, reset = true }) {
      try {
        this.isLoadingModel = true
        if (reset) this.resetOnBrand()
        const { data } = await this.$store.dispatch('http', { apiPath: `equipment/category/brand/${val}`, query: this.$route.query })
        this.modelItems = data.models
        this.isLoadingModel = false
        this.$emit('change', { form: this.form, trigger: 'brand', val })
        return Promise.resolve(data)
      } catch (err) { return Promise.reject(err) }
    },
    async onChangeModel ({ val, reset = true }) {
      try {
        this.$emit('change', { form: this.form, trigger: 'model', val })
        return Promise.resolve()
      } catch (err) { return Promise.reject(err) }
    },
  },
}