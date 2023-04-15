<template>
  <div id="management-durable-goods-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มค่าเริ่มต้นครุภัณฑ์' : 'การแก้ไขค่าเริ่มต้นครุภัณฑ์'" hideTotal/>
    <Loading v-if="isLoading"/>
    <v-form v-else ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-col :cols="12" :md="3">
          <InputDatePicker :value.sync="form.inspectionDate" label="วันที่ตรวจรับ *" :rules="inspectionDateRules" required :disabled="!isCreate"/>
        </v-col>
        <CategoryDurableGood :cols="3" :disabled="!isCreate" :initForm="initCategoryForm" @change="({ form }) => categoryForm = form">
          <template #default>
            <v-col v-if="!isCreate" :cols="12" :md="4">
              <v-text-field v-model="form.number" name="code" label="เลขที่ครุภัณฑ์ *" required disabled/>
            </v-col>
            <v-col :cols="12" :md="isCreate ? 9 : 5">
              <v-text-field v-model="form.name" name="name" label="ชื่อครุภัณฑ์ *" :rules="nameRules" required :disabled="!isCreate"/>
            </v-col>
          </template>
        </CategoryDurableGood>
        <v-row>
          <v-col :cols="12" :md="6">
            <v-text-field v-model="form.assetNumber" label="เลขที่สินทรัพย์" :disabled="!isCreate"/>
          </v-col>
          <v-col :cols="12" :md="6">
            <v-text-field v-model="form.assetNumberAorWor" label="เลขที่สินทรัพย์ อว." required :disabled="!isCreate"/>
          </v-col>
          <v-col :cols="12" :md="4">
            <v-text-field v-model="form.price" label="ราคากลาง *" type="number" :rules="priceRules" required/>
          </v-col>
          <v-col :cols="12" :md="2">
            <v-text-field v-model="form.year" label="ปี *" :rules="yearRules" type="number" required/>
          </v-col>
          <v-col :cols="12" :md="3">
            <v-text-field v-model="form.classifier" label="หน่วย *" :rules="classifierRules" name="unit" required/>
          </v-col>
          <v-col :cols="12" :md="3" class="depreciation">
            <v-text-field v-model="form.depreciation_rate" label="อัตราเสื่อมสภาพต่อปี *" :rules="deteriorationRules" :rows="3" type="number" suffix="%"/>
          </v-col>
          <v-col :cols="12" class="pt-0">
            <v-textarea v-model="form.description" class="pt-0" label="คำอธิบายเพิ่มเติม" :rows="4"/>
          </v-col>
        </v-row>
        <DurableGoodsOwner :organization.sync="form.organizationId" :department.sync="form.departmentId" :user.sync="form.ownerId" :disabled="!isCreate"/>
      </v-container>
      <!-- <v-expansion-panels v-model="formExpand" class="form-expansion-panels" flat multiple>
        <v-expansion-panel>
          <v-expansion-panel-header>อัตราเสื่อมสภาพ</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container>
              <v-row v-for="(deterioration, i) in deteriorationList" :key="i" align="baseline" class="pl-8">
                <div class="mr-10">ปีที่ {{ i + 1 }}</div>
                <div class="d-flex items-baseline">
                  <div class="deterioration">
                    <v-text-field v-model="deteriorationList[i]" label="" type="number" :rules="deteriorationRules" suffix="%"/>
                  </div>
                  <v-btn v-if="deteriorationList.length > 1" class="ml-2 align-self-center" icon @click="removeDeterioration(i)">
                    <i class="material-icons">delete</i>
                  </v-btn>
                </div>
              </v-row>
              <v-row class="mt-5">
                <v-btn block rounded outlined @click="addDeterioration">เพิ่มอัตราเสื่อมสภาพต่อปี</v-btn>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels> -->

      <v-container v-if="isCreate" class="mt-2">
        <h5 class="text-h5 mb-4"><b>รูปครุภัณฑ์</b></h5>
        <AttachFileBtn :value.sync="attachFiles" accept="image/*" @removeAttachment="onRemoveAttachment"/>
      </v-container>

      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/management/durable-goods/')">ย้อนกลับ</v-btn>
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
      CategoryDurableGood: () => import('~/components/CategoryDurableGood.vue'),
      DurableGoodsOwner: () => import('~/components/DurableGoodsOwner.vue'),
      AttachFileBtn: () => import('~/components/AttachFileBtn.vue'),
    },
    data () {
      return {
        valid: true,
        isLoading: false,
        form: {
          assetNumber: '',
          assetNumberAorWor: '',
          name: '',
          year: (new Date()).getFullYear() + 543,
          price: '',
          description: '',
          depreciation_rate: '',
          classifier: '',
          organizationId: null,
          departmentId: null,
          ownerId: null,
          inspectionDate: new Date(),
        },
        categoryForm: {},
        initCategoryForm: {},
        formExpand: [0],
        deteriorationList: [
          ''
        ],
        categoryList: [
          { id: 1, name: 'โทรศัพท์มือถือ' }
        ],
        subcategoryList: [
          { id: 1, name: 'Nokia' }
        ],
        typeList: [
          { id: 1, name: 'วัสดุคงคลัง' },
          { id: 2, name: 'ครุภัณฑ์' }
        ],
        nameRules: [
          v => !!v || 'โปรดใส่ชื่อ',
        ],
        cateogryRules: [
          v => !!v || 'โปรดใส่หมวดหมู่หลัก',
        ],
        subcateogryRules: [
          v => !!v || 'โปรดใส่หมวดหมู่ย่อย',
        ],
        yearRules: [
          v => v ? `${v}`.length === 4 || 'ตัวอย่าง: 2566' : 'โปรดใส่ปี',
        ],
        deteriorationRules: [
          v => !!v || v === 0 || 'โปรดใส่อัตราเสื่อมสภาพ',
        ],
        classifierRules: [
          v => !!v || 'โปรดใส่หน่วย',
        ],
        priceRules: [
          v => !!v || v === 0 || 'โปรดใส่ราคากลาง',
        ],
        inspectionDateRules: [
          v => !!v || 'โปรดใส่วันที่ตรวจรับ',
        ],
        attachFiles: [],
        removeFile: [],
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.durable_goods_id === 'create'
      },
    },
    mounted () {
      if (!this.isCreate) this.getData()
    },
    methods: {
      async getData () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: `equipment/${this.$route.params.durable_goods_id}` })
          this.form = {
            ...data,
            organizationId: data.organization.id,
            departmentId: data.department.id,
            ownerId: data.owner?.id || null,
            ownerList: data.owner && [data.owner] || [],
          }
          this.initCategoryForm = {
            majorCategoryId: data.majorCategory.id,
            subCategoryId: data.subCategory.id,
            typeId: data.type.id,
            brandId: data.brand.id,
            modelId: data.model.id,
          }
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      addDeterioration () {
        this.deteriorationList.push('')
      },
      removeDeterioration (i) {
        this.deteriorationList.splice(i, 1)
      },
      onRemoveAttachment (attach) {
        this.removeFile.push(attach)
      },
      onSubmit () {
        const valid = this.$refs.form.validate()
        if (valid) {
          if (this.isCreate) this.onCreate()
          else this.onEdit()
        }
      },
      async onCreate () {
        try {
          const form = {
            departmentId: this.form.departmentId,
            organizationId: this.form.organizationId,
            inspectionDate: this.$fn.convertDateToString(this.form.inspectionDate),
            equipments: [
              {
                assetNumber: this.form.assetNumber,
                assetNumberAorWor: this.form.assetNumberAorWor,
                name: this.form.name,
                year: this.form.year,
                price: this.form.price,
                description: this.form.description,
                depreciation_rate: this.form.depreciation_rate,
                classifier: this.form.classifier,
                ownerId: this.form.ownerId,
              }
            ]
          }
          const { data } = await this.$store.dispatch('http', { method: 'post', apiPath: 'equipment/import', data: form })
          await this.$store.dispatch('http', { method: 'post', apiPath: 'equipment/equipmentxCategory', data: { ...this.categoryForm, id: data[0].id } })
          await this.$store.dispatch('snackbar', { text: 'เพิ่มค่าเริ่มต้นครุภัณฑ์สำเร็จ' })
          this.$router.push('/management/durable-goods/')
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async onEdit () {
        try {
          const form = {
            ...this.form,
            ...this.categoryForm,
            inspectionDate: this.$fn.convertDateToString(this.form.inspectionDate),
          }
          const { data } = await this.$store.dispatch('http', { method: 'put', apiPath: 'equipment/Edit', data: form })
          await this.$store.dispatch('snackbar', { text: 'แก้ไขค่าเริ่มต้นครุภัณฑ์สำเร็จ' })
          await this.getData()
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
    }
  }
</script>

<style lang="scss">
  #management-durable-goods-detail-page {
  }
</style>