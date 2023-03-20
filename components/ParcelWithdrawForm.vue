<template>
  <div class="parcel-withdraw">
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
          <v-col :cols="12" :md="6">
            <InputDatePicker :value.sync="form.datePickUp" label="วันที่เบิกวัสดุคงคลัง *" :rules="datetimeWithdrawRules" required :disabled="viewMode"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12">
            <v-textarea v-model="form.description" label="หมายเหตุ" :rows="4" :disabled="viewMode"/>
          </v-col>
        </v-row>  
      </v-container>

      <h2 class="text-h5 mt-5"><b>เลือกวัสดุคงคลังที่ต้องการเบิก</b></h2>
      <v-container>
        <v-expansion-panels v-model="formExpand" class="form-expansion-panels" flat multiple>
          <v-expansion-panel v-for="(parcel, i) in form.pickUpItems" :key="i" accordion>
            <v-expansion-panel-header v-if="!viewMode" class="text-h6">
              <div class="d-flex align-center">
                <div>วัสดุคงคลัง ชิ้นที่ {{ i + 1 }}.</div>
                <v-btn v-if="form.pickUpItems.length > 1 && i === form.pickUpItems.length - 1" class="ml-5" icon @click.stop="removeParcel(i)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container>
                <v-row class="mt-0 mb-5">
                  <v-col :cols="12" :md="5">
                    <SelectDropdown v-if="!viewMode" :value.sync="form.pickUpItems[i].typeId" itemValue="id" itemText="name" label="ประเภท *" apiPath="parcel/getListParcelType" :rules="typeRules" required/>
                    <v-text-field v-else v-model="form.pickUpItems[i].type" label="ประเภท *" disabled/> 
                  </v-col>
                  <v-col :cols="12" :md="7">
                    <v-text-field v-if="viewMode" v-model="form.pickUpItems[i].name" label="วัสดุคงคลัง *" disabled/>
                    <SelectDropdown v-else :value.sync="form.pickUpItems[i].parcelMasterId" itemValue="id" itemText="name" label="วัสดุคงคลัง *" :rules="parcelRules" apiPath="parcel/searchParcelMaster"
                      :query="getParcelQuery(form.pickUpItems[i])" :disabled="viewMode || !form.pickUpItems[i].typeId"/>
                  </v-col>
                  <v-col v-if="viewMode" :cols="12" :md="5" class="pt-0">
                    <v-text-field v-model="form.pickUpItems[i].quantityFixed" label="จำนวนเบิก *" required disabled/>
                  </v-col>
                  <v-col :cols="12" :md="viewMode ? 7 : 5" class="pt-0">
                    <div class="d-flex align-baseline">
                      <v-text-field v-if="showQuantity(form.pickUpItems[i])" v-model="form.pickUpItems[i].quantity" :label="viewMode ? 'จำนวนจ่าย *' : 'จำนวนเบิก *'"
                        :rules="countWithdrawRules(form.pickUpItems[i])" required :disabled="viewMode && !canChangeQuantity"/>
                      <div v-if="showRemain" class="ml-5 text-remaining">คงเหลือ : {{ form.pickUpItems[i].remain || 0 }}</div>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-row v-if="!viewMode">
          <v-btn block rounded outlined @click="addParcel">เพิ่มวัสดุคงคลัง</v-btn>
        </v-row>
      </v-container>

      <v-container class="mt-8">
        <v-row v-if="isApprover" justify="end">
          <v-btn large plain @click="$router.push(backPath)">ย้อนกลับ</v-btn>
          <v-btn v-if="!isReject" class="mr-4" elevation="2" large outlined color="error" @click="onReject">ไม่อนุมัติ</v-btn>
          <v-btn v-if="!isReject" elevation="2" large color="success" @click="onApprove">อนุมัติ</v-btn>
        </v-row>
        <v-row v-else justify="end">
          <v-btn v-if="viewMode" large plain @click="$router.push(backPath)">ย้อนกลับ</v-btn>
          <v-btn v-else large plain @click="$router.push(backPath)">ย้อนกลับ</v-btn>
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
    },
    props: {
      item: { type: Object },
      viewMode: { type: Boolean },
      backPath: { type: String, default: '/parcel/withdraw/' },
      cannotApprove: { type: Boolean },
    },
    data () {
      return {
        valid: true,
        form: null,
        remaining: 0,
        parcelRules: [
          v => !!v || 'โปรดเลือกวัสดุคงคลัง',
        ],
        typeRules: [
          v => !!v || 'โปรดเลือกประเภท',
        ],
        step: 1,
        formExpand: [0],
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
      canEdit () {
        return this.item?.canEdit === 'true'
      },
      canChangeQuantity () {
        return this.canEdit && this.isApprover
      },
      showRemain () {
        return this.viewMode && this.canEdit
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
          datePickUp: this.item?.datePickUp || new Date(),
          pickUpItems: this.item?.items
            ? this.item.items.map(item => {
              const { type } = item
              return { ...item, typeId: type.id, type: type.name, quantityFixed: item.quantity, quantity: item.numberOfApproved || item.quantity }
            })
            : [
              {
                parcelMasterId: 0,
                quantity: 0,
                typeId: '',
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
        this.formExpand = [ ...this.formExpand, this.formExpand.length ]
      },
      removeParcel (i) {
        this.form.pickUpItems.splice(i, 1)
      },
      getParcelQuery (parcel) {
        return { typeId: parcel.typeId }
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
      showQuantity (item) {
        return !this.viewMode || this.canChangeQuantity || item.numberOfApproved
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
        const valid = this.$refs.form.validate()
        if (valid) this.$emit('approve', this.currentFlow, this.form)
      },
      onReject () {
        const valid = this.$refs.form.validate()
        if (valid) this.$emit('reject', this.currentFlow, this.form)
      },
      countWithdrawRules (item) {
        return this.showRemain ? [item.remain >= item.quantity || 'จำนวนวัสดุคงคลังไม่เพียงพอ'] : [v => !!v || `โปรดใส่จำนวน${this.viewMode ? 'จ่าย' : 'เบิก'}`]
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
      min-width: 120px;
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