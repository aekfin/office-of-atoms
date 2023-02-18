<template>
  <div id="category-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มประเภท พัสดุ - ครุภัณฑ์' : 'การแก้ไขประเภท พัสดุ - ครุภัณฑ์'" hideTotal/>
    <v-form ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row>
          <h3 class="text-h5"><b>ประเภท</b></h3>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="form.typeName" label="ชื่อประเภท *" :rules="typeNameRules" required/>
          </v-col>
        </v-row>
      </v-container>
      <h3 class="text-h6 pl-4 mt-2 mb-5"><b>ยี่ห้อ</b></h3>
      <div class="pl-4 pr-4">
        <v-container>
          <v-row v-for="(brand, i) in form.brands" :key="i" align="baseline" class="brand-row elevation-4">
            <div class="mr-4">{{ i + 1 }}.</div>
            <v-text-field v-model="form.brands[i].brandName" label="ชื่อยี่ห้อ *" :rules="brandNameRules" required/>
            <v-btn v-if="form.brands.length > 1" class="remove-brand-icon" icon @click="removeBrand(i)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-expansion-panels v-model="form.brands[i].expand" class="form-expansion-panels form-expansion-brands" flat multiple>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <h3 class="text-h6"><b>รุ่น</b></h3>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pl-4">
                  <v-container>
                    <v-row v-for="(model, j) in brand.models" :key="j" align="baseline">
                      <div class="mr-4">{{ i + 1 }}.{{ j + 1 }}</div>
                      <v-text-field v-model="brand.models[j]" label="ชื่อรุ่น *" :rules="modelNameRules" required/>
                      <v-btn v-if="brand.models.length > 1" class="ml-2" icon @click="removeModel(brand.models, j)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-row>
                    <v-row class="mt-5">
                      <v-btn block rounded outlined @click="addModel(brand.models)">เพิ่มรุ่น</v-btn>
                    </v-row>
                  </v-container>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>
          <v-row class="mt-5">
            <v-btn block rounded outlined @click="addBrand">เพิ่มยี่ห้อ</v-btn>
          </v-row>
        </v-container>
      </div>
      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/management/category/')">ย้อนหลับ</v-btn>
          <v-btn elevation="2" large color="success" @click="onSubmit">บันทึก</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
    },
    data () {
      return {
        valid: true,
        form: {
          typeName: '',
          brands: [
            {
              brandName: '',
              expand: [0],
              models: [
                ''
              ]
            },
          ],
        },
        typeNameRules: [
          v => !!v || 'โปรดใส่ชื่อประเภท',
        ],
        brandNameRules: [
          v => !!v || 'โปรดใส่ชื่อยี่ห้อ',
        ],
        modelNameRules: [
          v => !!v || 'โปรดใส่ชื่อรุ่น',
        ],
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.category_id === 'create'
      },
    },
    mounted () {
      if (!this.isCreate) this.getData()
    },
    methods: {
      async getData () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: 'parcel/getTypeBrandByModelId', query: { ...this.$route.query, modelId: this.$route.params.category_id } })
          console.log(data)
          // this.form = 
          this.isLoading = false
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      addBrand () {
        this.form.brands.push(
          {
            brandName: '',
            expand: [0],
            models: [
              ''
            ]
          },
        )
      },
      removeBrand (i) {
        this.form.brands.splice(i, 1)
      },
      addModel (models) {
        models.push('')
      },
      removeModel (brands, j) {
        brands.splice(j, 1)
      },
      async onSubmit () {
        const valid = this.$refs.form.validate()
        if (valid) {
          try {
            const apiPath = this.isCreate ? 'parcel/import/typeBandModel' : ''
            const method = 'post'
            const { data } = await this.$store.dispatch('http', { method, apiPath, data: this.form })
            await this.$store.dispatch('snackbar', { text: this.isCreate ? 'สร้างประเภท พัสดุ - ครุภัณฑ์ สำเร็จ' : 'แก้ไขประเภท  พัสดุ - ครุภัณฑ์ สำเร็จ' })
            return Promise.resolve(data)
          } catch (err) { return Promise.reject(err) }
        }
      },
    },
  }
</script>

<style lang="scss">
  #category-detail-page {
    .form-expansion-brands {
      padding: 0 28px;
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0px;
      }

      button.v-expansion-panel-header {
        padding: 0 !important;
        min-height: auto;
      }
    }

    .brand-row {
      position: relative;
      background-color: white;
      padding: 20px;
      padding-right: 32px;
      margin-bottom: 28px;
      border-radius: 20px;

      .remove-brand-icon {
        position: absolute;
        top: 10px;
        right: 8px;
      }
    }
  }
</style>