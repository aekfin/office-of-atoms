<template>
  <div class="parcel-withdraw">
    <v-stepper v-if="viewMode && item" v-model="step" class="mt-10 mb-10" altLabels>
      <v-stepper-header>
        <v-stepper-step :step="1" color="success" complete>ยื่นเบิก</v-stepper-step>
        <template v-for="flow in item.flows">
          <v-divider :key="flow.id"/>
          <v-stepper-step :key="flow.id" :step="flow.orderApprove + 1" :color="isColor(flow)" :complete="isComplete(flow)">
            <v-tooltip bottom :disabled="!getApproverText(flow)">
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ getStepText(flow) }}</span>
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
          <!-- <v-col :cols="6">
            <v-text-field v-model="form.code" label="เลขที่เอกสาร" :disabled="viewMode"/>
          </v-col> -->
          <v-col :cols="6">
            <InputDatePicker :value.sync="form.withdrawDate" label="วันที่เบิกพัสดุ *" :rules="datetimeWithdrawRules" required :disabled="viewMode"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12">
            <v-textarea v-model="form.description" label="หมายเหตุ" :rows="4" :disabled="viewMode"/>
          </v-col>
        </v-row>  
      </v-container>

      <h2 class="text-h5 mt-5"><b>เลือกพัสดุที่ต้องการเบิก</b></h2>
      <v-container>
        <v-row v-for="(parcel, i) in form.pickUpItems" :key="i" class="mt-0 mb-5">
          <v-col cols="auto" class="align-self-center">{{ i + 1 }}.</v-col>
          <v-col :cols="10">
            <TypeBrandModelSearch :type.sync="form.pickUpItems[i].type" :brand.sync="form.pickUpItems[i].brand" :model.sync="form.pickUpItems[i].model" :viewMode="viewMode"/>
          </v-col>
          <v-col cols="auto" class="align-self-center">
            <v-btn v-if="form.pickUpItems.length > 1 && !viewMode" icon @click="removeContact(i)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
          <v-col :cols="6" class="pl-12 pt-0">
            <v-text-field v-if="viewMode" v-model="form.pickUpItems[i].name" label="พัสดุ *" disabled/>
            <SelectDropdown v-else :value.sync="form.pickUpItems[i].parcelMasterId" itemValue="id" itemText="name" label="พัสดุ *" :rules="parcelRules" apiPath="parcel/searchParcelMaster"
              :query="getParcelQuery(form.pickUpItems[i])" reloadOnClick :disabled="viewMode || !form.pickUpItems[i].type"/>
          </v-col>
          <v-col :cols="viewMode && canEdit ? 5 : 4" class="pt-0">
            <div class="d-flex align-baseline">
              <v-text-field v-model="form.pickUpItems[i].quantity" label="จำนวนเบิก *" :rules="countWithdrawRules" required :disabled="viewMode && !canEdit"/>
              <div v-if="viewMode && canEdit" class="ml-5 text-remaining">คงเหลือ : {{ remaining }}</div>
            </div>
          </v-col>
        </v-row>
        <v-row v-if="!viewMode">
          <v-btn block rounded outlined @click="addParcel">เพิ่มพัสดุ</v-btn>
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
          <!-- <v-btn v-if="!viewMode" elevation="2" large outlined color="success" @click="onSave">บันทึก</v-btn> -->
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
      TypeBrandModelSearch: () => import('~/components/TypeBrandModelSearch.vue'),
    },
    props: {
      item: { type: Object },
      viewMode: { type: Boolean },
      backPath: { type: String, default: '/parcel/withdraw/' },
    },
    data () {
      return {
        valid: true,
        form: null,
        remaining: 0,
        parcelRules: [
          v => !!v || 'โปรดเลือกพัสดุ',
        ],
        countWithdrawRules: [
          v => !!v || 'โปรดใส่จำนวนเบิก',
        ],
        step: 1,
      }
    },
    computed: {
      currentFlow () {
        return this.item?.flows?.find(flow => flow?.status === 'PENDING') || null
      },
      isApprover () {
        return this.currentFlow?.canApprove === 'true'
      },
      isReject () {
        return this.item && this.item.status === 'REJECT'
      },
      canEdit () {
        return this.item?.canEdit === 'true'
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
          withdrawDate: new Date(),
          pickUpItems: this.item?.items || [
            {
              parcelMasterId: 0,
              quantity: 0,
              type: '',
              brand: '',
              model: '',
            }
          ]
        }
        const index = this.item?.flows?.findIndex(flow => ['PENDING', 'REJECT'].includes(flow?.status)) || 0
        this.step = index + 2
      },
      addParcel () {
        this.form.pickUpItems.push(
          {
            parcelMasterId: 0,
            quantity: 0,
            type: '',
            brand: '',
            model: '',
          }
        )
      },
      removeContact (i) {
        this.form.pickUpItems.splice(i, 1)
      },
      getParcelQuery (parcel) {
        return { typeId: parcel.type, brandId: parcel.brand, modelId: parcel.model }
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
      onSave () {
        const valid = this.$refs.form.validate()
        if (valid) this.$emit('save', this.form)
      },
      onSubmit () {
        const valid = this.$refs.form.validate()
        if (valid) this.$emit('submit', this.form)
      },
      onApprove () {
        this.$emit('approve', this.currentFlow, this.form)
      },
      onReject () {
        this.$emit('reject', this.currentFlow, this.form)
      },
    }
  }
</script>

<style lang="scss">
  .parcel-withdraw {
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