<template>
  <div class="parcel-withdraw">
    <v-stepper v-if="isDisabled" v-model="step" class="mt-10 mb-10" altLabels>
      <v-stepper-header>
        <v-stepper-step :step="1" color="success" complete>ยื่นเบิก</v-stepper-step>
        <v-divider/>
        <v-stepper-step :step="2" :color="step === 2 ? 'warning' : step === 3 ? 'success' : 'grey'" :complete="step === 3">การอนุมัติ</v-stepper-step>
      </v-stepper-header>
    </v-stepper>
    <v-form ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row v-if="isDisabled">
          <v-col :cols="6">
            <v-text-field v-model="form.code" label="เลขที่เอกสาร" disabled/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="6">
            <InputDatePicker :value.sync="form.datetimeWithdraw" label="วันที่เบิกพัสดุ *" :rules="datetimeWithdrawRules" required :disabled="isDisabled"/>
          </v-col>
          <v-col :cols="6">
            <v-text-field v-model="form.agency" label="หน่วยงาน *" :rules="agencyRules" required :disabled="isDisabled"/>
          </v-col>
        </v-row>  
      </v-container>
      <v-expansion-panels v-model="formExpand" class="form-expansion-panels mt-5" flat multiple>
        <v-expansion-panel>
          <v-expansion-panel-header class="pb-0">เลือกพัสดุที่ต้องการเบิก</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container>
              <v-row v-for="(parcel, i) in parcelWithdrawList" :key="i" class="mt-0">
                <v-col :cols="6">
                  <div class="flex align-baseline">
                    <div class="mr-5">{{ i + 1 }}.</div>
                    <v-select v-model="parcel.parcel" :items="parcelList" itemValue="id" itemText="name" label="พัสดุ" :rules="parcelRules" :disabled="isDisabled"/>
                  </div>
                </v-col>
                <v-col :cols="3">
                  <v-text-field v-model="form.countWithdraw" label="จำนวนเบิก *" :rules="countWithdrawRules" required :disabled="isDisabled"/>
                </v-col>
                <v-col :cols="3">
                  <div class="flex align-baseline">
                    <v-text-field v-model="form.countPaid" label="จำนวนจ่าย *" disabled/>
                    <v-btn v-if="parcelWithdrawList.length > 1" icon color="red" @click="removeContact(i)">
                      <v-icon>mdi-close-circle</v-icon>
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
              <v-row v-if="!isDisabled">
                <v-btn block rounded outlined @click="addParcel">เพิ่มพัสดุ</v-btn>
              </v-row>
            </v-container>
          </v-expansion-panel-content> 
        </v-expansion-panel>  
      </v-expansion-panels>
      <v-container class="mt-8">
        <v-row v-if="isApprover" justify="end">
          <v-btn large plain @click="$router.push('/parcel/request/')">ย้อนหลับ</v-btn>
          <v-btn elevation="2" large color="success" @click="onApprove">อนุมัติ</v-btn>
        </v-row>
        <v-row v-else justify="end">
          <v-btn v-if="isDisabled" large outlined :elevation="2" @click="$router.push('/parcel/withdraw/')">ย้อนหลับ</v-btn>
          <v-btn v-else large plain @click="$router.push('/parcel/withdraw/')">ย้อนหลับ</v-btn>
          <v-btn v-if="!isDisabled" elevation="2" large outlined color="success" @click="onSave">บันทึก</v-btn>
          <v-btn v-if="!isDisabled" class="ml-4" elevation="2" large color="success" @click="onSubmit">ยื่นขอเบิก</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
  export default {
    components: {
      InputDatePicker: () => import('~/components/InputDatePicker.vue'),
    },
    props: {
      viewMode: { type: Boolean },
      isApprover: { type: Boolean },
      step: { type: Number, default: 1 }
    },
    data () {
      return {
        valid: true,
        formExpand: [0],
        parcelWithdrawList: [],
        parcelList: [
          { id: 1, name: 'โทรศัพท์มือถือ Nokia N95' },
          { id: 2, name: 'คอมพิวเตอร์' },
          { id: 3, name: 'แท็บเล็ต' },
          { id: 4, name: 'หนังสือ' },
        ],
        form: {
          code: '51-1002511-25',
          datetimeWithdraw: new Date(),
          agency: '',
        },
        datetimeWithdrawRules: [
          v => !!v || 'โปรดใส่วันเริ่มโครงการ',
        ],
        agencyRules: [
          v => !!v || 'โปรดใส่หน่วยงาน',
        ],
        parcelRules: [
          v => !!v || 'โปรดเลือกพัสดุ',
        ],
        countWithdrawRules: [
          v => !!v || 'โปรดใส่จำนวนเบิก',
        ],
      }
    },
    computed: {
      isDisabled () {
        return this.viewMode
      },
    },
    mounted () {
      this.addParcel()
    },
    methods: {
      addParcel () {
        this.parcelWithdrawList.push({ parcel: null, countWithdraw: '', countPaid: '' })
      },
      removeContact (i) {
        this.parcelWithdrawList.splice(i, 1)
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
        this.$emit('approve', this.form)
      },
    }
  }
</script>

<style lang="scss">
  .parcel-withdraw {
    .v-stepper {
      .v-stepper__header {
        padding: 0 20%;

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

    @media (max-width: 768px) {
      .v-stepper {
        .v-stepper__header {
          padding: 0;
        }
      }
    }
  }
</style>