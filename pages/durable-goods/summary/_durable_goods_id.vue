<template>
  <div id="summary-durable-goods-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มค่าเริ่มต้นครุภัณฑ์' : 'การแก้ไขค่าเริ่มต้นครุภัณฑ์'" hideTotal/>
    <Loading v-if="isLoading"/>
    <v-form v-else ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-col :cols="12" :md="3">
          <InputDatePicker :value.sync="form.inspectionDate" label="วันที่ตรวจรับ *" :rules="inspectionDateRules" required :disabled="!isCreate"/>
        </v-col>

        <DurableGoodsOwner :organization="form.organizationId" :department.sync="form.departmentId" :user.sync="form.ownerId" :disabled="!isCreate" @ouChange="onOuChange"/>

        <div class="text-h5 mt-5 mb-2"><b>เลือกครุภัณฑ์</b></div>
        <CategoryDurableGood :cols="3" :disabled="!isCreate" :initForm="initCategoryForm" @change="({ form }) => categoryForm = form">
          <template #default>
            <v-col :cols="12" :md="isCreate ? 6 : 9">
              <v-text-field v-model="form.name" name="name" label="ชื่อครุภัณฑ์ *" :rules="nameRules" required :disabled="!isCreate"/>
            </v-col>
            <v-col v-if="isCreate" :cols="12" :md="3">
              <v-text-field v-model="form.quantity" name="quantity" label="จำนวน *" type="number" :rules="quantityRules" required @change="onQuantityChange"/>
            </v-col>
          </template>
        </CategoryDurableGood>
        <v-row>
          <v-col :cols="12" :md="4">
            <v-text-field v-model="form.price" label="ราคากลาง *" type="number" :rules="priceRules" required :disabled="!isCreate"/>
          </v-col>
          <v-col :cols="12" :md="2">
            <v-text-field v-model="form.year" label="ปี *" :rules="yearRules" type="number" required :disabled="!isCreate"/>
          </v-col>
          <v-col :cols="12" :md="3">
            <v-text-field v-model="form.classifier" label="หน่วย *" :rules="classifierRules" name="unit" required :disabled="!isCreate"/>
          </v-col>
          <v-col :cols="12" :md="3" class="depreciation">
            <v-text-field v-model="form.depreciation_rate" label="อัตราเสื่อมสภาพต่อปี *" :rules="deteriorationRules" :rows="3" type="number" suffix="%" :disabled="!isCreate"/>
          </v-col>
          <v-col :cols="12" class="pt-0">
            <v-textarea v-model="form.description" class="pt-0" label="คำอธิบายเพิ่มเติม" :rows="4" :disabled="!isCreate"/>
          </v-col>
        </v-row>
        <div class="text-h6 mt-2 mb-2 d-flex justify-space-between">
          <b>รายละเอียดเฉพาะของครุภัณฑ์</b>
        </div>
        <v-row v-for="(detail, j) in form.detailList" :key="j">
          <v-col :cols="12" :md="3">
            <div class="d-flex align-center">
              <div v-if="isCreate" class="mr-4">{{ j + 1 }}.</div>
              <v-text-field v-model="detail.number" name="code" label="เลขที่ครุภัณฑ์ *" required disabled/>
            </div>
          </v-col>
          <v-col :cols="12" :md="3">
            <v-text-field v-model="detail.serialNumber" label="หมายเลขซีเรียล" :disabled="!isCreate || !form.organizationId"/>
          </v-col>
          <v-col :cols="12" :md="3">
            <v-text-field v-model="detail.assetNumber" label="เลขที่สินทรัพย์" :disabled="!isCreate || !form.organizationId"/>
          </v-col>
          <v-col :cols="12" :md="3">
            <v-text-field v-model="detail.assetNumberAorWor" label="เลขที่สินทรัพย์ อว." required :disabled="!isCreate || !form.organizationId"/>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-if="!isCreate">
        <h5 class="text-h5 mt-2 mb-4"><b>รูปครุภัณฑ์</b></h5>
        <AttachFileBtn :value.sync="uploadingImageFiles" :attachments="imageFiles" accept="image/gif, image/jpeg, image/png, image/webp" :limit="2" showImage :multiple="false" @removeAttachment="onRemoveFile"/>
        <h5 class="text-h5 mt-10 mb-4"><b>เอกสารครุภัณฑ์</b></h5>
        <AttachFileBtn :value.sync="uploadingFiles" :attachments="files" accept="*" :limit="2" :multiple="false" @removeAttachment="onRemoveFile"/>
      </v-container>

      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/durable-goods/summary/')">ย้อนกลับ</v-btn>
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
        },
        categoryForm: {},
        initCategoryForm: {},
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
        quantityRules: [
          v => v > 0 ||'โปรดใส่จำนวนครุภัณฑ์',
        ],
        uploadingImageFiles: [],
        imageFiles: [],
        uploadingFiles: [],
        files: [],
        removeFiles: [],
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
      getDetail (data = {}) {
        return {
          number: data.number || '',
          assetNumber: data.assetNumber || '',
          assetNumberAorWor: data.assetNumberAorWor || '',
          serialNumber: data.serialNumber || '',
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
            detailList: [this.getDetail(data)]
          }
          this.initCategoryForm = {
            majorCategoryId: data.majorCategory.id,
            subCategoryId: data.subCategory.id,
            typeId: data.type.id,
            brandId: data.brand.id,
            modelId: data.model.id,
          }
          await this.getAttachments()
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async getAttachments () {
        try {
          const { data: files } = await this.$store.dispatch('http', { apiPath: `equipment/getUploadFile/${this.$route.params.durable_goods_id}` })
          const images = []
          const others = []
          files.forEach(file => {
            if (['.gif', '.jfif', '.pjpeg', '.jpeg', '.pjp', 'jpg', '.png', '.webp'].some(type => file.filename.includes(type)) && images.length < 2) {
              images.push(file)
            } else {
              others.push(file)
            }
          })
          this.imageFiles = images
          this.files = others
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      onRemoveFile (attach) {
        this.removeFiles.push(attach)
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
      async getEquipmentNumber (equipment) {
        try {
          const ouId = this.form.organizationId
          const quantity = this.form.quantity
          if (ouId && quantity) {
            this.isNumberLoading = true
            const { data } = await this.$store.dispatch('http', { apiPath: `equipment/genEquipmentNumber` , query: { ouId, quantity } })
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
        }
      },
      async deleteFiles () {
        try {
          await Promise.all(this.removeFiles.map(file => this.$axios({ method: 'delete', url: file })))
          this.removeFiles = []
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      async uploadFiles () {
        try {
          const files = [...this.uploadingImageFiles, ...this.uploadingFiles]
          let data = new FormData()
          for (const file of files) {
            data.append('file', file)
          }
          data.append('equipmentId', this.$route.params.durable_goods_id)
          await this.$store.dispatch('http', { method: 'post', apiPath: 'equipment/uploadFile', data })
          this.uploadingImageFiles = []
          this.uploadingFiles = []
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      async onSubmit () {
        try {
          const valid = this.$refs.form.validate()
          if (valid) {
            if (this.isCreate) await this.onCreate()
            else await this.onEdit()
          }
          if (!this.isCreate) {
            if (this.uploadingImageFiles.length || this.uploadingFiles.length) await this.uploadFiles()
            if (this.removeFiles.length) await this.deleteFiles()
            await this.getData()
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
          await this.$store.dispatch('http', { method: 'post', apiPath: 'equipment/equipmentxCategory', data: { ...this.categoryForm, id: data[0].id } })
          await this.$store.dispatch('snackbar', { text: 'เพิ่มครุภัณฑ์สำเร็จ' })
          this.$router.push('/durable-goods/summary/')
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async onEdit () {
        try {
          // const form = {
          //   ...this.form,
          //   ...this.categoryForm,
          //   inspectionDate: this.$fn.convertDateToString(this.form.inspectionDate),
          // }
          // const { data } = await this.$store.dispatch('http', { method: 'put', apiPath: 'equipment/Edit', data: form })
          await this.$store.dispatch('snackbar', { text: 'แก้ไขครุภัณฑ์สำเร็จ' })
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