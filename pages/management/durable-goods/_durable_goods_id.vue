<template>
  <div id="summary-durable-goods-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มค่าเริ่มต้นครุภัณฑ์' : 'การแก้ไขค่าเริ่มต้นครุภัณฑ์'" hideTotal :btnText="isCreate ? '' : 'ครุภัณฑ์ย่อย'" :createRoute="createRoute" :logRoute="isCreate ? '':logRoute"/>
    <Loading v-if="isLoading"/>
    <v-form v-else ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row>
          <v-col :cols="12" :md="3">
            <InputDatePicker :value.sync="form.inspectionDate" label="วันที่ตรวจรับ *" :rules="inspectionDateRules" required :disabled="!isCreate" @change="getEquipmentNumber"/>
          </v-col>
          <v-col v-if="!isCreate" :cols="12" :md="3">
            <v-switch v-model="form.disable" label="สามารถยืมได้" :trueValue="'0'" :falseValue="'1'"/>
          </v-col>
        </v-row>

        <DurableGoodsOwner :organization="form.organizationId" :department.sync="form.departmentId" :user.sync="form.ownerId"  @ouChange="onOuChange"/>

        <div class="text-h5 mt-5 mb-2"><b>เลือกครุภัณฑ์</b></div>
        <CategoryDurableGood :cols="3" :initCategory="initCategory" @change="({ form }) => categoryForm = form" @changeMajor="getEquipmentNumber">
          <template #default>
            <v-col :cols="12" :md="isCreate ? 6 : 9">
              <v-text-field v-model="form.name" name="name" label="ชื่อครุภัณฑ์ *" :rules="nameRules" required/>
            </v-col>
            <v-col v-if="isCreate" :cols="12" :md="3">
              <v-text-field v-model="form.quantity" name="quantity" label="จำนวน *" type="number" :rules="quantityRules" required @change="onQuantityChange"/>
            </v-col>
          </template>
        </CategoryDurableGood>
        <v-row>
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
        <div class="text-h6 mt-2 mb-2 d-flex justify-space-between">
          <b>รายละเอียดเฉพาะของครุภัณฑ์</b>
        </div>
        <v-row v-for="(detail, j) in form.detailList" :key="j">
          <v-col :cols="12" md>
            <div class="d-flex align-center">
              <div v-if="isCreate" class="mr-4">{{ j + 1 }}.</div>
              <v-text-field v-model="detail.number" name="code" label="เลขที่ครุภัณฑ์ *" required disabled/>
            </div>
          </v-col>
          <v-col :cols="12" :md="3">
            <v-text-field v-model="detail.serialNumber" label="หมายเลขซีเรียล" :disabled="!isCreate || !form.organizationId"/>
          </v-col>
          <v-col :cols="12" :md="3">
            <v-text-field v-model="detail.assetNumber" label="เลขที่สินทรัพย์" :disabled="!form.organizationId"/>
          </v-col>
          <v-col :cols="12" :md="3">
            <v-text-field v-model="detail.assetSubNumber" label="เลขที่สินทรัพย์ย่อย" required :disabled="!form.organizationId"/>
          </v-col>
          <v-col :cols="12" :md="3">
            <v-text-field v-model="detail.assetNumberAorWor" label="เลขที่สินทรัพย์ อว." required :disabled="!form.organizationId"/>
          </v-col>
          <v-col :cols="12" :md="3">
            <v-text-field v-model="detail.numberSubAorWor" label="เลขที่ อว.ย่อย" required :disabled="!form.organizationId"/>
          </v-col>
        </v-row>
      </v-container>

      <AttachmentDurableGoods v-if="!isCreate" ref="attachmentDurableGoods"/>

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
      AttachmentDurableGoods: () => import('~/components/AttachmentDurableGoods.vue'),
    },
    data () {
      return {
        valid: true,
        isLoading: false,
        isNumberLoading: false,
        form: {
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
          quantity: 1,
          detailList: [this.getDetail()],
          disable: false,
        },
        categoryForm: {},
        initCategory: {},
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
          v => !!v  || 'โปรดใส่อัตราเสื่อมสภาพ',
          v => v >= 1 || 'กรุณาใส่ค่ามากกว่า 0',
          v => /^[0-9]+$/.test(v) || 'กรุณาใส่ค่ามากกว่า 0' ,
        ],
        classifierRules: [
          v => !!v || 'โปรดใส่หน่วย',
        ],
        priceRules: [
          v => !!v || 'โปรดใส่ราคากลาง',
          v => v >= 1 || 'กรุณาใส่ค่ามากกว่า 0',
          v => /^[0-9]+$/.test(v) || 'กรุณาใส่ค่ามากกว่า 0' ,
        ],
        inspectionDateRules: [
          v => !!v || 'โปรดใส่วันที่ตรวจรับ',
        ],
        quantityRules: [
          v => v > 0 ||'โปรดใส่จำนวนครุภัณฑ์',
        ],
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.durable_goods_id === 'create'
      },
      createRoute () {
        return { path: `/durable-goods/overall/${this.$route.params.durable_goods_id}/sub/create/`, query: { backPath: this.$route.path } }
      },
      logRoute () {
        return { apiPath: 'equipment/getLogEquipment', query: { id: this.$route.params.durable_goods_id } }
      },
    },
    mounted () {
      if (!this.isCreate) this.getData()
    },
    methods: {
      getDetail (data = {}) {
        return {
          number: data.number || '',
          assetNumber: data.assetNumber || '',
          assetNumberAorWor: data.assetNumberAorWor || '',
          serialNumber: data.serialNumber || '',
          numberSubAorWor: data.numberSubAorWor || '',
          assetSubNumber: data.assetSubNumber || '',
        }
      },
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
            detailList: [this.getDetail(data)],
            disable: data.disable || false,
            quantity: 1,
          }
          if (data.majorCategory) {
            this.initCategory = {
              majorCategory: data.majorCategory,
              subCategory: data.subCategory,
              type: data.type,
              brand: data.brand,
              model: data.model,
            }
          }
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      onOuChange ({ val }) {
        this.form.organizationId = val
        this.getEquipmentNumber()
      },
      onQuantityChange () {
        const quantity = this.form.quantity
        const count = this.form.detailList.length
        if (count < quantity) {
          for (let i = count; i < this.form.quantity; i++) {
            this.form.detailList.push(this.getDetail())
          }
        } else {
          this.form.detailList = this.form.detailList.slice(0, quantity)
        }
        this.getEquipmentNumber()
      },
      async getEquipmentNumber () {
        try {
          const ouId = this.form.organizationId
          const quantity = this.form.quantity
          const mejorCategoryId = this.categoryForm?.majorCategoryId
          const inspectionDate = this.$fn.convertInspectionDate(this.form.inspectionDate)
          if (ouId && quantity && mejorCategoryId && inspectionDate) {
            this.isNumberLoading = true
            const query = { ouId, quantity, registrationType: 1, moneyType: 'BUDGET', mejorCategoryId, inspectionDate, count: 0 }
            const { data } = await this.$store.dispatch('http', { apiPath: `equipment/genEquipmentNumber` , query })
            data?.forEach((number, i) => {
              this.form.detailList[i].number = number
            })
            this.isNumberLoading = false
          }
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      convertDetail () {
        return {
          equmentNumbers: this.form.detailList.map(detail => detail.number),
          assetNumber: this.form.detailList.map(detail => detail.assetNumber),
          assetNumberAorWor: this.form.detailList.map(detail => detail.assetNumberAorWor),
          serialNumbers: this.form.detailList.map(detail => detail.serialNumber),
          numberSubAorWor: this.form.detailList.map(detail => detail.numberSubAorWor),
          assetSubNumber: this.form.detailList.map(detail => detail.assetSubNumber),
        }
      },
      async onSubmit () {
        try {
          const valid = this.$refs.form.validate()
          if (valid) {
            if (this.isCreate) await this.onCreate()
            else await this.onEdit()
            if (!this.isCreate) {
              if (this.$refs.attachmentDurableGoods) await this.$refs.attachmentDurableGoods.upload()
              await this.getData()
            }
          }
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      async onCreate () {
        try {
          const form = {
            departmentId: this.form.departmentId,
            organizationId: this.form.organizationId,
            inspectionDate: this.$fn.convertDateToString(this.form.inspectionDate),
            equipments: [
              {
                name: this.form.name,
                year: this.form.year,
                price: this.form.price,
                description: this.form.description,
                depreciation_rate: this.form.depreciation_rate,
                classifier: this.form.classifier,
                ownerId: this.form.ownerId,
                quantity: this.form.quantity,
                ...this.convertDetail()
              }
            ]
          }
          const { data } = await this.$store.dispatch('http', { method: 'post', apiPath: 'equipment/import', data: form })
          await Promise.all(
            data.map((item) => {
              this.$store.dispatch('http', { method: 'post', apiPath: 'equipment/equipmentxCategory', data: { ...this.categoryForm, id: item.id } })
            })
          )
          await this.$store.dispatch('snackbar', { text: 'เพิ่มครุภัณฑ์สำเร็จ' })
          this.$router.push('/management/durable-goods/')
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async onEdit () {
        try {
          const equipmentDetail = this.form?.detailList?.[0] || {}
          const form = {
            ...this.form,
            ...this.categoryForm,
            ...equipmentDetail,
          }
          console.log('Edit form ',form);
          
          const { data } = await this.$store.dispatch('http', { method: 'patch', apiPath: 'equipment/Edit', data: form })
          if (data?.status?.code == 200){
            await this.$store.dispatch('snackbar', { text: 'แก้ไขครุภัณฑ์สำเร็จ' })
          }
          else {
            await this.$store.dispatch('snackbar', { text: 'แก้ไขครุภัณฑ์ไม่สำเร็จ' })
          }
          
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
    }
  }
</script>

<style lang="scss">
  #summary-durable-goods-detail-page {
  }
</style>