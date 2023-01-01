<template>
  <div id="parcel-withdraw-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มการเบิกพัสดุ' : 'การแก้ไขการเบิกพัสดุ'" hideTotal/>
    <v-form ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row>
          <v-col :cols="6">
            <InputDatePicker :value.sync="form.datetimeWithdraw" label="วันที่เบิกพัสดุ *" :rules="datetimeWithdrawRules" required/>
          </v-col>
          <v-col :cols="6">
            <v-text-field v-model="form.agency" label="หน่วยงาน *" :rules="agencyRules" required/>
          </v-col>
        </v-row>  
      </v-container>
      <v-expansion-panels v-model="formExpand" class="form-expansion-panels mt-4" flat multiple>
        <v-expansion-panel>
          <v-expansion-panel-header>เลือกพัสดุที่ต้องการเบิก</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container>
              <v-row v-for="(parcel, i) in parcelWithdrawList" :key="i" class="mt-0">
                <v-col :cols="6">
                  <div class="flex align-baseline">
                    <div class="mr-5">{{ i + 1 }}.</div>
                    <v-select v-model="parcel.parcel" :items="parcelList" itemValue="id" itemText="name" label="พัสดุ" :rules="parcelRules"/>
                  </div>
                </v-col>
                <v-col :cols="3">
                  <v-text-field v-model="form.countWithdraw" label="จำนวนเบิก *" :rules="countWithdrawRules" required/>
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
              <v-row>
                <v-btn block rounded outlined @click="addParcel">เพิ่มพัสดุ</v-btn>
              </v-row>
            </v-container>
          </v-expansion-panel-content> 
        </v-expansion-panel>  
      </v-expansion-panels>
      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/parcel/withdraw/')">ย้อนหลับ</v-btn>
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
      InputDatePicker: () => import('~/components/InputDatePicker.vue'),
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
      isCreate () {
        return this.$route.params.parcel_withdraw_id === 'create'
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
      onSubmit () {
        this.$refs.form.validate()
      },
    }
  }
</script>

<style lang="scss">
  #parcel-withdraw-detail-page {
  }
</style>