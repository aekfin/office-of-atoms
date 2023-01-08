<template>
  <div class="durable-goods-borrow-form">
    <v-form ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row v-if="isDisabled">
          <v-col :cols="6">
            <v-text-field v-model="form.code" label="เลขที่เอกสาร" disabled/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="4">
            <InputDatePicker :value.sync="form.datetimeBorrow" label="วันที่ยืม ครุภัณฑ์ *" :rules="datetimeBorrowRules" required :disabled="isDisabled"/>
          </v-col>
          <v-col :cols="4">
            <InputDatePicker :value.sync="form.datetimeReturn" label="วันที่ต้องคืน ครุภัณฑ์ *" :rules="datetimeReturnRules" required :disabled="isDisabled"/>
          </v-col>
          <v-col :cols="4">
            <v-text-field v-model="form.agency" label="หน่วยงาน *" :rules="agencyRules" required :disabled="isDisabled"/>
          </v-col>
        </v-row>  
      </v-container>
      <v-expansion-panels v-model="formExpand" class="form-expansion-panels mt-5" flat multiple>
        <v-expansion-panel>
          <v-expansion-panel-header class="pb-0">เลือกครุภัณฑ์ที่ต้องการยืม</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container>
              <v-row v-for="(durableGoods, i) in durableGoodsBorrowList" :key="i" class="mt-0">
                <v-col :cols="6">
                  <div class="flex align-baseline">
                    <div class="mr-5">{{ i + 1 }}.</div>
                    <v-select v-model="durableGoods.durableGoods" :items="durableGoodsList" itemValue="id" itemText="name" label="ครุภัณฑ์" :rules="durableGoodsRules" :disabled="isDisabled"/>
                  </div>
                </v-col>
                <v-col :cols="6">
                  <v-text-field v-model="form.note" label="จุดประสงค์ *" :rules="noteRules" required :disabled="isDisabled"/>
                </v-col>
              </v-row>
              <v-row v-if="!isDisabled">
                <v-btn block rounded outlined @click="addDurableGoods">เพิ่มครุภัณฑ์</v-btn>
              </v-row>
            </v-container>
          </v-expansion-panel-content> 
        </v-expansion-panel>  
      </v-expansion-panels>
      <v-container class="mt-8">
        <v-row v-if="isApprover" justify="end">
          <v-btn large plain @click="$router.push('/durable-goods/request/')">ย้อนหลับ</v-btn>
          <v-btn elevation="2" large color="success" @click="onApprove">อนุมัติ</v-btn>
        </v-row>
        <v-row v-else justify="end">
          <v-btn v-if="isDisabled" large outlined :elevation="2" @click="$router.push('/durable-goods/withdraw/')">ย้อนหลับ</v-btn>
          <v-btn v-else large plain @click="$router.push('/durable-goods/withdraw/')">ย้อนหลับ</v-btn>
          <v-btn v-if="!isDisabled" elevation="2" large outlined color="success" @click="onSave">บันทึก</v-btn>
          <v-btn v-if="!isDisabled" class="ml-4" elevation="2" large color="success" @click="onSubmit">ยื่นขอเบิก</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
  export default {
    props: {
      viewMode: { type: Boolean },
      isApprover: { type: Boolean },
      step: { type: Number, default: 1 }
    },
    data () {
      return {
        valid: true,
        formExpand: [0],
        durableGoodsBorrowList: [],
        durableGoodsList: [
          { id: 1, name: 'โทรศัพท์มือถือ Nokia N95' },
          { id: 2, name: 'คอมพิวเตอร์' },
          { id: 3, name: 'แท็บเล็ต' },
          { id: 4, name: 'หนังสือ' },
        ],
        form: {
          code: '51-1002511-25',
          datetimeBorrow: new Date(),
          datetimeReturn: '',
          agency: '',
        },
        datetimeBorrowRules: [
          v => !!v || 'โปรดใส่วันที่ยืม',
        ],
        datetimeReturnRules: [
          v => !!v || 'โปรดใส่วันที่คืน',
        ],
        agencyRules: [
          v => !!v || 'โปรดใส่หน่วยงาน',
        ],
        durableGoodsRules: [
          v => !!v || 'โปรดเลือกครุภัณฑ์',
        ],
        noteRules: [
          v => !!v || 'โปรดเลือกครุภัณฑ์',
        ],
      }
    },
    computed: {
      isDisabled () {
        return this.viewMode
      },
    },
    mounted () {
      this.addDurableGoods()
    },
    methods: {
      addDurableGoods () {
        this.durableGoodsBorrowList.push({ durableGoods: null, note: '' })
      },
      removeContact (i) {
        this.durableGoodsBorrowList.splice(i, 1)
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
  .durable-goods-borrow-form {
  }
</style>