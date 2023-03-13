<template>
  <div class="durable-goods-borrow-form">
    <v-stepper v-if="viewMode && item" v-model="step" class="mt-10 mb-10" altLabels>
      <v-stepper-header>
        <v-stepper-step :step="1" color="success" complete>ยื่นเบิก</v-stepper-step>
        <template v-for="flow in item.flows">
          <v-divider :key="flow.id"/>
          <v-stepper-step :key="flow.id" :step="flow.orderApprove + 1" :color="isColor(flow)" :complete="isComplete(flow)">
            <v-tooltip bottom :disabled="!getApproverText(flow)">
              <template #activator="{ on, attrs }">
                <div v-bind="attrs" class="text-center" v-on="on">
                  <div>{{ getStepText(flow) }}</div>
                  <div v-if="flow.position" class="mt-2" style="font-size: 0.9rem">{{ flow.position }}</div>
                </div>
              </template>
              <span>{{ getApproverText(flow) }}</span>
            </v-tooltip>
          </v-stepper-step>
        </template>
      </v-stepper-header>
    </v-stepper>

    <v-form v-if="form" ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row>
          <v-col :cols="6">
            <InputDatePicker :value.sync="form.dateBorrow" label="วันที่ยืมครุภัณฑ์ *" :rules="datetimeBorrowRules" required :disabled="viewMode"/>
          </v-col>
          <!-- <v-col :cols="4">
            <InputDatePicker :value.sync="form.dateReturn" label="วันที่ต้องคืน ครุภัณฑ์ *" :rules="datetimeReturnRules" required :disabled="viewMode"/>
          </v-col> -->
        </v-row>
        <v-row>
          <v-col :cols="12">
            <v-textarea v-model="form.description" label="หมายเหตุ" :rows="4" :disabled="viewMode"/>
          </v-col>
        </v-row>
      </v-container>

      <h5 class="text-h5 mt-5"><b>เลือกครุภัณฑ์ที่ต้องการยืม</b></h5>
      <v-container class="mt-2">
        <CategoryDurableGood :initForm="initCategoryForm" :disabled="viewMode" noRules @change="({ form }) => categoryForm = form"/>
        <v-row>
          <v-col>
            <v-text-field v-if="viewMode" v-model="form.item.equipment.name" label="ครุภัณฑ์ *" disabled/>
            <SelectDropdown v-else :value.sync="form.itemId" itemValue="id" itemText="name" label="ครุภัณฑ์ *" :rules="durableGoodsRules" apiPath="equipment/getEquipments" :disabled="viewMode"/>
          </v-col>
        </v-row>
      </v-container>

      <v-container class="mt-8">
        <v-row v-if="isApprover" justify="end">
          <v-btn large plain @click="$router.push(backPath)">ย้อนหลับ</v-btn>
          <v-btn v-if="!isReject" class="mr-4" elevation="2" large outlined color="error" @click="onReject">ไม่อนุมัติ</v-btn>
          <v-btn v-if="!isReject" elevation="2" large color="success" @click="onApprove">อนุมัติ</v-btn>
        </v-row>
        <v-row v-else justify="end">
          <v-btn v-if="viewMode" large outlined :elevation="2" @click="$router.push(backPath)">ย้อนหลับ</v-btn>
          <v-btn v-else large plain @click="$router.push(backPath)">ย้อนหลับ</v-btn>
          <v-btn v-if="!viewMode" class="ml-4" elevation="2" large color="success" @click="onSubmit">ยื่นขอเบิก</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
  export default {
    components: {
      SelectDropdown: () => import('~/components/SelectDropdown.vue'),
      InputDatePicker: () => import('~/components/InputDatePicker.vue'),
      CategoryDurableGood: () => import('~/components/CategoryDurableGood.vue'),
    },
    props: {
      item: { type: Object },
      viewMode: { type: Boolean },
      backPath: { type: String, default: '/durable-goods/borrow/' },
      cannotApprove: { type: Boolean },
    },
    data () {
      return {
        valid: true,
        form: null,
        datetimeBorrowRules: [
          v => !!v || 'โปรดใส่วันที่ยืม',
        ],
        datetimeReturnRules: [
          v => !!v || 'โปรดใส่วันที่คืน',
        ],
        durableGoodsRules: [
          v => !!v || 'โปรดเลือกครุภัณฑ์',
        ],
        step: 1,
        categoryForm: {},
        initCategoryForm: {},
      }
    },
    computed: {
      currentFlow () {
        return this.item?.flows?.find(flow => flow?.status === 'PENDING') || null
      },
      isApprover () {
        return !this.cannotApprove && this.currentFlow?.canApprove === 'true'
      },
      isReject () {
        return this.item && this.item.status === 'REJECT'
      },
    },
    watch: {
      'item' () {
        this.setForm()
      }
    },
    mounted () {
      this.setForm()
    },
    methods: {
      setForm () {
        this.form = {
          description: this.item?.description || '',
          dateBorrow: this.item?.dateBorrow || new Date(),
          itemId: this.item?.items?.[0]?.equipment?.id || null,
          item: this.item?.items?.[0] || null
        }
        if (this.item) this.setCategoryForm()
        const index = this.item?.flows?.findIndex(flow => ['PENDING', 'REJECT'].includes(flow?.status)) || 0
        this.step = index + 2
      },
      setCategoryForm () {
        const data = this.item?.items?.[0]
        this.initCategoryForm = {
          majorCategoryId: data.majorCategory.id,
          subCategoryId: data.subCategory.id,
          typeId: data.type.id,
          brandId: data.brand.id,
          modelId: data.model.id,
        }
      },
      getApproverText (flow) {
        return flow?.emails?.reduce((str, email, i) => `${str}${i > 0 ? ', ' : ''}${email}`, 'ผู้อนุมัติ : ') || false
      },
      getStepText (flow) {
        return this.$store.state.approveStatus[flow?.status || 'PENDING']
      },
      isColor (item) {
        return this.$store.state.approveStatusColor[item?.status] || 'grey'
      },
      isComplete (item) {
        return item?.status === 'APPROVE'
      },
      onSubmit () {
        const valid = this.$refs.form.validate()
        if (valid) this.$emit('submit', this.form)
      },
      onApprove () {
        const valid = this.$refs.form.validate()
        if (valid) this.$emit('approve', this.currentFlow, this.form)
      },
      onReject () {
        const valid = this.$refs.form.validate()
        if (valid) this.$emit('reject', this.currentFlow, this.form)
      },
    }
  }
</script>

<style lang="scss">
  .durable-goods-borrow-form {
    .v-stepper {
      .v-stepper__header {
        margin: 0 auto;

        .v-stepper__step {
          .v-stepper__step__step {
            width: 40px;
            height: 40px;
          }
        }

        .v-divider {
          margin-top: 45px;
        }
      }
    }

    .text-remaining {
      width: max-content;
    }

    @media (max-width: 768px) {
      .v-stepper {
        .v-stepper__header {
          padding: 0;
        }
      }
    }
  }
</style>