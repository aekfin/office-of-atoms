<template>
  <div id="durable-good-sub-detail">
    <PageHeader text="ครุภัณฑ์ย่อย" hideTotal/>
    <Loading v-if="isLoading || !equipment"/>
    <v-form v-else ref="form" v-model="valid" lazyValidation>
      <v-expansion-panels v-model="formExpand" class="form-expansion-panels" flat multiple>
        <v-expansion-panel accordion>
          <v-expansion-panel-header class="text-h5">
            รายละเอียดครุภัณฑ์หลัก
            <template #actions>
              <i class="material-icons">keyboard_arrow_down</i>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container>
              <v-row>
                <v-col :cols="12" :md="3">
                  <b>กอง</b>
                  <div class="mt-2">{{ equipment.organizationMaster.ouName }}</div>
                </v-col>
                <v-col :cols="12" :md="3">
                  <b>กลุ่ม</b>
                  <div class="mt-2">{{ equipment.departmentMaster.departmentName }}</div>
                </v-col>
                <v-col v-if="equipment.owner" :cols="12" :md="4">
                  <b>บุคคล:</b>
                  <div class="mt-2">{{ equipment.owner.name }}</div>
                </v-col>
              </v-row>
              <v-row>
                <v-col :cols="12" :md="3">
                  <b>เลขที่ครุภัณฑ์</b>
                  <div class="mt-2">{{ equipment.number || '-' }}</div>
                </v-col>
                <v-col :cols="12" :md="3">
                  <b>หมายเลขซีเรียล</b>
                  <div class="mt-2">{{ equipment.serialNumber || '-' }}</div>
                </v-col>
                <v-col :cols="12" :md="3">
                  <b>เลขที่สินทรัพย์</b>
                  <div class="mt-2">{{ equipment.assetNumber || '-' }}</div>
                </v-col>
                <v-col :cols="12" :md="3">
                  <b>เลขที่สินทรัพย์ อว.</b>
                  <div class="mt-2">{{ equipment.assetNumberAorWor || '-' }}</div>
                </v-col>
                <v-col :cols="12" :md="3">
                  <b>หมวดหมู่พัสดุ</b>
                  <div class="mt-2">{{ equipment.equipmentxMajorCategory.majorCategory.name }}</div>
                </v-col>
                <v-col :cols="12" :md="3">
                  <b>ประเภทพัสดุ</b>
                  <div class="mt-2">{{ equipment.equipmentxMajorCategory.subCategory.name }}</div>
                </v-col>
                <v-col :cols="12" :md="3">
                  <b>รายการครุภัณฑ์</b>
                  <div class="mt-2">{{ equipment.equipmentxMajorCategory.type.name }}</div>
                </v-col>
                <v-col :cols="12" :md="3">
                  <b>ยี่ห้อ</b>
                  <div class="mt-2">{{ equipment.equipmentxMajorCategory.brand.name }}</div>
                </v-col>
                <v-col :cols="12" :md="3">
                  <b>รุ่น</b>
                  <div class="mt-2">{{ equipment.equipmentxMajorCategory.model.name }}</div>
                </v-col>
                <v-col :cols="12" :md="9">
                  <b>ชื่อครุภัณฑ์</b>
                  <div class="mt-2">{{ equipment.name }}</div>
                </v-col>
                <v-col :cols="12" :md="3">
                  <b>ราคา</b>
                  <div class="mt-2">{{ $fn.getPrice(equipment.price) }}</div>
                </v-col>
                <v-col :cols="12" :md="3">
                  <b>ปี</b>
                  <div class="mt-2">{{ equipment.year }}</div>
                </v-col>
                <v-col :cols="12" :md="3">
                  <b>หน่วย</b>
                  <div class="mt-2">{{ equipment.classifier }}</div>
                </v-col>
                <v-col :cols="12" :md="3">
                  <b>อัตราเสื่อมสภาพต่อปี</b>
                  <div class="mt-2">{{ equipment.depreciation_rate }}%</div>
                </v-col>
                <v-col :cols="12">
                  <b>คำอธิบายเพิ่มเติม</b>
                  <div class="mt-2">{{ equipment.description || '-' }}</div>
                </v-col>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <h5 class="text-h5 mt-5"><b>ครุภัณฑ์ย่อย</b></h5>
      <v-container class="mt-2">
        <div v-for="(subEquipment, i) in subEquipments" :key="i" class="sub-equipment">
          <h6 class="text-h6 mb-4"><b>ครุภัณฑ์ย่อยที่ {{ i + 1 }}.</b></h6>
          <v-row>
            <v-col :cols="12" :md="9">
              <v-text-field v-model="subEquipment.name" name="name" label="ชื่อครุภัณฑ์ย่อย *" :rules="nameRules" required/>
            </v-col>
            <v-col :cols="12" :md="3">
              <v-text-field v-model="subEquipment.classifier" name="unit" label="หน่วย *" :rules="classifierRules" required/>
            </v-col>
            <v-col :cols="12" :md="3">
              <div class="d-flex align-center">
                <v-text-field v-model="subEquipment.number" name="code" label="เลขที่ครุภัณฑ์ *" :rules="numberRules" :loading="isLoadingNumber" disabled/>
              </div>
            </v-col>
            <v-col :cols="12" :md="3">
              <v-text-field v-model="subEquipment.serialNumber" label="หมายเลขซีเรียล"/>
            </v-col>
            <v-col :cols="12" :md="3">
              <v-text-field v-model="subEquipment.assetNumber" label="เลขที่สินทรัพย์"/>
            </v-col>
            <v-col :cols="12" :md="3">
              <v-text-field v-model="subEquipment.assetNumberAorWor" label="เลขที่สินทรัพย์ อว."/>
            </v-col>
          </v-row>
        </div>
        <v-row class="mt-5 mb-5">
          <v-btn block rounded outlined @click="addSubEquipment">เพิ่มครุภัณฑ์ย่อย</v-btn>
        </v-row>
      </v-container>

      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push($route.query.backPath)">ย้อนกลับ</v-btn>
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
        isLoading: false,
        isLoadingNumber: false,
        equipment: null,
        formExpand: [0],
        subEquipments: [],
        nameRules: [
          v => !!v || 'โปรดใส่ชื่อ',
        ],
        classifierRules: [
          v => !!v || 'โปรดใส่หน่วย',
        ],
        numberRules: [
          v => !!v || 'โปรดใส่เลขที่ครุภัณฑ์',
        ],
      }
    },
    computed: {
      durableGoodsId () {
        return this.$route.params.durable_goods_id
      }
    },
    mounted () {
      this.getSubEquipment()
    },
    methods: {
      addSubEquipment () {
        this.subEquipments.push(
          {
            name: '',
            number: '',
            classifier: '',
            serialNumber: '',
            assetNumber: '',
            assetNumberAorWor: '',
          }
        )
        this.getSubEquipmentNumber()
      },
      async getSubEquipment () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: 'equipment/getSubEquipments', query: { equipmentId: this.durableGoodsId } })
          this.equipment = data.equipment
          this.subEquipments = data.subEquipmentModel
          if (!this.subEquipments.length) this.addSubEquipment()
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async getSubEquipmentNumber () {
        try {
          this.isLoadingNumber = true
          const query = { equipmentId: this.durableGoodsId, quantity: this.subEquipments.length }
          const { data } = await this.$store.dispatch('http', { apiPath: 'equipment/genSubEquipmentNumber', query })
          this.subEquipments.forEach((subEquipment, i) => {
            if (!subEquipment.number) subEquipment.number = data[i]
          })
          this.isLoadingNumber = false
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      async onSubmit () {
        try {
          const creates = this.subEquipments.filter(equipment => !equipment.id)
          const edits = this.subEquipments.filter(equipment => equipment.id)
          if (creates.length) {
            const createData = { equipmentId: this.durableGoodsId, subEquipments: creates }
            await this.$store.dispatch('http', { method: 'post', apiPath: 'equipment/importSubEquipment', data: createData })
          }
          if (edits.length) {
            await Promise.all(edits.map(edit => this.$store.dispatch('http', { method: 'patch', apiPath: 'equipment/editSubEquipment', data: edit })))
          }
          await this.getSubEquipment()
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
    },
  }
</script>

<style lang="scss">
  #durable-good-sub-detail {
    .sub-equipment {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
</style>