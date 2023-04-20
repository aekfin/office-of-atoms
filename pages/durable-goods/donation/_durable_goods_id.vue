<template>
  <div id="durable-goods-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มการรับบริจาคครุภัณฑ์' : 'การแก้ไขการรับบริจาคครุภัณฑ์'" hideTotal/>
    <Loading v-if="isLoading"/>
    <v-form v-else ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row>
          <v-col :cols="12" :md="3">
            <InputDatePicker :value.sync="form.dateEntry" label="วันที่รับเข้า *" :rules="dateEntryRules" required :disabled="!isCreate"/>
          </v-col>
          <v-col :cols="12" :md="3">
            <InputDatePicker :value.sync="form.inspectionDate" label="วันที่ตรวจรับ *" :rules="inspectionDateRules" required :disabled="!isCreate"/>
          </v-col>
        </v-row>

        <DurableGoodsOwner class="mt-5" :organization="form.organizationId" :department.sync="form.departmentId" :user.sync="form.ownerId" :userList="form.ownerList" :disabled="!isCreate" @ouChange="onOuChange"/>

        <div class="text-h5 mt-5"><b>เลือกครุภัณฑ์</b></div>
        <v-container>
          <v-expansion-panels v-model="formExpand" class="form-expansion-panels" flat multiple>
            <v-expansion-panel v-for="(equipment, i) in form.equipments" :key="i" accordion>
              <v-expansion-panel-header v-if="isCreate" class="text-h6">
                <div class="d-flex align-center">
                  <div>ครุภัณฑ์ รายการที่ {{ i + 1 }}.</div>
                  <v-btn v-if="form.equipments.length > 1 && i === form.equipments.length - 1" class="ml-5" icon @click.stop="removeDurableGoods(i)">
                    <i class="material-icons">delete</i>
                  </v-btn>
                </div>
                <template #actions>
                  <i class="material-icons">keyboard_arrow_down</i>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-container>
                  <v-row>
                    <v-col :cols="12" :md="6">
                      <v-text-field v-model="form.equipments[i].donator" label="ผู้บริจาค *" :rules="donatorRules" required :disabled="!isCreate"/>
                    </v-col>
                    <v-col :cols="12" :md="6">
                      <SelectDropdown :value.sync="form.equipments[i].userId" label="ผู้รับผิดชอบ *" :itemText="$fn.getName" :rules="userRules" required :disabled="!isCreate"
                        :items="form.equipments[i].userList" apiPath="user/listUsers"/>
                    </v-col>
                  </v-row>
                  <CategoryDurableGood :cols="3" :disabled="!isCreate" :initForm="initCategoryForm" @change="res => form.equipments[i].categoryForm = res.form">
                    <template #default>
                      <v-col :cols="12" :md="isCreate ? 6 : 9">
                        <v-text-field v-model="form.equipments[i].name" name="name" label="ชื่อครุภัณฑ์ *" :rules="nameRules" required :disabled="!isCreate"/>
                      </v-col>
                      <v-col v-if="isCreate" :cols="12" :md="3">
                        <v-text-field v-model="form.equipments[i].quantity" name="quantity" label="จำนวน *" type="number" :rules="quantityRules" required @change="onQuantityChange(form.equipments[i])"/>
                      </v-col>
                    </template>
                  </CategoryDurableGood>
                  <v-row>
                    <v-col :cols="6" :md="4">
                      <v-text-field v-model="form.equipments[i].price" label="ราคา *" type="number" :rules="priceRules" required :disabled="!isCreate"/>
                    </v-col>
                    <v-col :cols="6" :md="2">
                      <v-text-field v-model="form.equipments[i].year" label="ปี *" :rules="yearRules" type="number" required :disabled="!isCreate"/>
                    </v-col>
                    <v-col :cols="6" :md="3">
                      <v-text-field v-model="form.equipments[i].classifier" label="หน่วย *" :rules="classifierRules" name="unit" required :disabled="!isCreate"/>
                    </v-col>
                    <v-col :cols="6" :md="3" class="depreciation">
                      <v-text-field v-model="form.equipments[i].depreciation_rate" label="อัตราเสื่อมสภาพต่อปี *" :rules="deteriorationRules" :rows="3" type="number" suffix="%" :disabled="!isCreate"/>
                    </v-col>
                    <v-col :cols="12" class="pt-0">
                      <v-textarea v-model="form.equipments[i].description" class="pt-0" label="คำอธิบายเพิ่มเติม" :rows="4" :disabled="!isCreate"/>
                    </v-col>
                  </v-row>

                  <div class="text-h6 mt-2 mb-2 d-flex justify-space-between">
                    <b>รายละเอียดเฉพาะของครุภัณฑ์</b>
                  </div>
                  <v-row v-for="(detail, j) in form.equipments[i].detailList" :key="j">
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
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-row v-if="isCreate" class="mt-5 mb-5">
            <v-btn block rounded outlined @click="addDurableGoods()">เพิ่มครุภัณฑ์</v-btn>
          </v-row>
        </v-container>
      </v-container>

      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/durable-goods/donation/')">ย้อนกลับ</v-btn>
          <v-btn v-if="isCreate" elevation="2" large color="success" @click="onSubmit">บันทึก</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      Loading: () => import('~/components/Loading.vue'),
      DurableGoodsOwner: () => import('~/components/DurableGoodsOwner.vue'),
      CategoryDurableGood: () => import('~/components/CategoryDurableGood.vue'),
    },
    data () {
      return {
        valid: true,
        isLoading: false,
        initCategoryForm: {},
        form: {
          dateEntry: new Date(),
          inspectionDate: new Date(),
          equipments: [
            {
              assetNumber: '',
              assetNumberAorWor: '',
              name: '',
              year: (new Date()).getFullYear() + 543,
              price: '',
              description: '',
              depreciation_rate: '',
              classifier: '',
              categoryForm: {},
              donator: '',
              userId: null,
              quantity: 1,
              detailList: [this.getDetail()]
            }
          ],
          organizationId: null,
          departmentId: null,
          ownerId: null,
          ownerList: [],
        },
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
          v => !!v || v === 0 || 'โปรดใส่ราคา',
        ],
        ouRules: [
          v => !!v || 'โปรดใส่กอง',
        ],
        departmentRules: [
          v => !!v || 'โปรดใส่กลุ่ม',
        ],
        projectRules: [
          v => !!v || 'โปรดเลือกโครงการ',
        ],
        dateEntryRules: [
          v => !!v || 'โปรดใส่วันที่รับเข้า',
        ],
        donatorRules: [
          v => !!v || 'โปรดใส่ผู้บริจาค',
        ],
        userRules: [
          v => !!v || 'โปรดใส่ผู้รับผิดชอบ',
        ],
        inspectionDateRules: [
          v => !!v || 'โปรดใส่วันที่ตรวจรับ',
        ],
        quantityRules: [
          v => !!v || 'โปรดใส่จำนวน',
        ],
        formExpand: [0],
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
      addDurableGoods () {
        this.form.equipments.push(
          {
            assetNumber: '',
            assetNumberAorWor: '',
            name: '',
            year: (new Date()).getFullYear() + 543,
            price: '',
            description: '',
            depreciation_rate: '',
            classifier: '',
            categoryForm: {},
            donator: '',
            userId: null,
            quantity: 1,
            detailList: [this.getDetail()]
          }
        )
        this.formExpand = [ ...this.formExpand, this.formExpand.length ]
        this.setNumberAllEquipments()
      },
      removeDurableGoods (i) {
        this.form.equipments.splice(i, 1)
      },
      setNumberAllEquipments () {
        this.form.equipments.forEach(equipment => {
          this.getEquipmentNumber(equipment)
        })
      },
      onOuChange ({ val }) {
        this.form.organizationId = val
        this.setNumberAllEquipments()
      },
      onQuantityChange (equipment) {
        const quantity = equipment.quantity
        const count = equipment.detailList.length
        if (count < quantity) {
          for (let i = count; i < equipment.quantity; i++) {
            equipment.detailList.push(this.getDetail())
          }
        } else {
          equipment.detailList = equipment.detailList.slice(0, quantity)
        }
        this.getEquipmentNumber(equipment)
      },
      async getEquipmentNumber (equipment) {
        try {
          const ouId = this.form.organizationId
          const quantity = equipment.quantity
          if (ouId && quantity) {
            this.isNumberLoading = true
            const { data } = await this.$store.dispatch('http', { apiPath: `equipment/genEquipmentNumber` , query: { ouId, quantity } })
            data?.forEach((number, i) => {
              equipment.detailList[i].number = number
            })
            this.isNumberLoading = false
          }
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      async getData () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: `equipment/getEquipments/status/${this.$route.params.durable_goods_id}` })
          this.form = {
            ...data,
            equipments: [
              {
                ...data,
                donator: data.equipmentDonation.donator,
                userId: data.equipmentDonation.keeper.id,
                userList: [data.equipmentDonation.keeper],
                detailList: [this.getDetail(data)]
              }
            ],
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
      convertDetail (equipment) {
        return {
          equmentNumbers: equipment.detailList.map(detail => detail.number),
          assetNumber: equipment.detailList.map(detail => detail.assetNumber),
          assetNumberAorWor: equipment.detailList.map(detail => detail.assetNumberAorWor),
          serialNumbers: equipment.detailList.map(detail => detail.serialNumber),
        }
      },
      getMapCategory (item) {
        const equipment = this.form.equipments.find(equipment => equipment.name === item.name) || this.form.equipments[0]
        return equipment.categoryForm
      },
      async onSubmit () {
        const valid = this.$refs.form.validate()
        if (valid) {
          try {
            const form = {
              ...this.form,
              equipments: this.form.equipments.map(equipment => ({ ...equipment, ownerId: this.form.ownerId, ...this.convertDetail(equipment) })),
              dateEntry: this.$fn.convertDateToString(this.form.dateEntry),
              inspectionDate: this.$fn.convertDateToString(this.form.inspectionDate),
            }
            const { data } = await this.$store.dispatch('http', { method: 'post', apiPath: 'equipment/import/donation', data: form })
            await Promise.all(
              data.map((item) => {
                this.$store.dispatch('http', { method: 'post', apiPath: 'equipment/equipmentxCategory', data: { ...this.getMapCategory(item), id: item.id } })
              })
            )
            await this.$store.dispatch('snackbar', { text: 'เพิ่มการรับบริจาคครุภัณฑ์สำเร็จ' })
            this.$router.push('/durable-goods/donation/')
            return Promise.resolve(data)
          } catch (err) { return Promise.reject(err) }
        }
      },
    }
  }
</script>

<style lang="scss">
  #durable-goods-detail-page {
  }
</style>