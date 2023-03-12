<template>
  <div id="management-durable-goods-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มค่าเริ่มต้นครุภัณฑ์' : 'การแก้ไขค่าเริ่มต้นครุภัณฑ์'" hideTotal/>
    <v-form ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <CategoryDurableGood :cols="3">
          <template>
            <v-col :cols="isCreate ? 9 : 5">
              <v-text-field v-model="form.name" name="name" label="ชื่อครุภัณฑ์ *" :rules="nameRules" required/>
            </v-col>
            <v-col v-if="!isCreate" :cols="4">
              <v-text-field v-model="form.code" name="code" label="เลขที่ครุภัณฑ์ *" :rules="codeRules" required disabled/>
            </v-col>
          </template>
        </CategoryDurableGood>
        <v-row>
          <v-col :cols="4">
            <v-text-field v-model="form.price" label="ราคากลาง *" type="number" :rules="priceRules" required/>
          </v-col>
          <v-col :cols="2">
            <v-text-field v-model="form.year" label="ปี *" :rules="yearRules" type="number" required/>
          </v-col>
          <v-col :cols="6">
            <v-textarea v-model="form.note" label="คำอธิบายเพิ่มเติม" :rows="3"/>
          </v-col>
        </v-row>
      </v-container>
      <v-expansion-panels v-model="formExpand" class="form-expansion-panels" flat multiple>
        <v-expansion-panel>
          <v-expansion-panel-header>อัตราเสื่อมสภาพ</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container>
              <v-row v-for="(deterioration, i) in deteriorationList" :key="i" align="baseline" class="pl-8">
                <div class="mr-10">ปีที่ {{ i + 1 }}</div>
                <div class="d-flex items-baseline">
                  <div class="deterioration">
                    <v-text-field v-model="deteriorationList[i]" label="" type="number" :rules="deteriorationRules"/>
                  </div>
                  <div class="ml-2 align-self-center">%</div>
                  <v-btn v-if="deteriorationList.length > 1" class="ml-2" icon @click="removeDeterioration(i)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </v-row>
              <v-row class="mt-5">
                <v-btn block rounded outlined @click="addDeterioration">เพิ่มอัตราเสื่อมสภาพต่อปี</v-btn>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/management/durable-goods/')">ย้อนหลับ</v-btn>
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
    },
    data () {
      return {
        valid: true,
        form: {
          code: '',
          name: '',
          category: null,
          subcategory: null,
          year: (new Date()).getFullYear() + 543,
          price: '',
          note: '',
        },
        formExpand: [0],
        deteriorationList: [
          ''
        ],
        categoryList: [
          { id: 1, name: 'โทรศัพท์มือถือ' }
        ],
        subcategoryList: [
          { id: 1, name: 'Nokia' }
        ],
        typeList: [
          { id: 1, name: 'วัสดุคงคลัง' },
          { id: 2, name: 'ครุภัณฑ์' }
        ],
        codeRules: [
          v => !!v || 'โปรดใส่เลขที่ครุภัณฑ์',
        ],
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
        priceRules: [
          v => !!v || v === 0 || 'โปรดใส่ราคากลาง',
        ],
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.durable_goods_id === 'create'
      },
    },
    methods: {
      addDeterioration () {
        this.deteriorationList.push('')
      },
      removeDeterioration (i) {
        this.deteriorationList.splice(i, 1)
      },
      onSubmit () {
        this.$refs.form.validate()
      },
    }
  }
</script>

<style lang="scss">
  #management-durable-goods-detail-page {
    .deterioration {
      input {
        text-align: right;
      }
    }
  }
</style>