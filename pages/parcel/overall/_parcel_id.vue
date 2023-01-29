<template>
  <div id="parcel-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มพัสดุ' : 'การแก้ไขพัสดุ'" hideTotal/>
    <v-form ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row>
          <v-col :cols="2">
            <v-select v-model="form.year" :items="years" itemValue="id" itemText="name" label="ปีงบประมาณ *" :rules="yearRules" required/>
          </v-col>
          <v-col :cols="4">
            <v-select v-model="form.projectRoot" :items="items" itemValue="id" itemText="name" label="เลือกโครงการงบประมาณ *" :rules="projectRootRules" required :disabled="!form.year"/>
          </v-col>
          <v-col :cols="6">
            <v-select v-model="form.project" :items="items" itemValue="id" itemText="name" label="โครงการ *" :rules="projectRules" required :disabled="!form.projectRoot"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="3">
            <v-select v-model="form.category" :items="categoryList" itemValue="id" itemText="name" label="หมวดหมู่หลัก *" :rules="categoryRules" required/>
          </v-col>
          <v-col :cols="3">
            <v-select v-model="form.subcategory" :items="subcategoryList" itemValue="id" itemText="name" label="หมวดหมู่ย่อย *" :rules="subcategoryRules" required :disabled="!form.category"/>
          </v-col>
          <v-col :cols="6">
            <v-select v-model="form.parcel" :items="parcelList" itemValue="id" itemText="name" label="พัสดุ *" :rules="parcelRules" required :disabled="!form.subcategory"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="6">
            <v-text-field v-model="form.count" :rules="countRules" label="จำนวนรับเข้าคลัง *"/>
          </v-col>
          <v-col :cols="6">
            <InputDatePicker :value.sync="form.datetimeCreate" label="วันที่รับเข้า *" :rules="datetimeCreateRules" required/>
          </v-col>
        </v-row>
      </v-container>
      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/parcel/overall/')">ย้อนหลับ</v-btn>
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
        form: {
          year: null,
          projectRoot: null,
          project: null,
          category: null,
          subcategory: null,
          parcel: null,
          count: '',
          datetimeCreate: new Date(),
        },
        years: [
          { id: 1, name: '2022' },
          { id: 2, name: '2021' },
          { id: 3, name: '2020' },
          { id: 4, name: '2019' }
        ],
        items: [
          { id: 1, name: 'Foo' },
          { id: 2, name: 'Bar' },
          { id: 3, name: 'Fizz' },
          { id: 4, name: 'Buzz' }
        ],
        categoryList: [
          { id: 1, name: 'โทรศัพท์มือถือ' },
          { id: 2, name: 'สมุดบันทึก' },
          { id: 3, name: 'จอคอมพิวเตอร์' },
        ],
        subcategoryList: [
          { id: 1, name: 'Nokia' },
          { id: 2, name: 'Samsung' },
          { id: 3, name: 'Apple' },
        ],
        parcelList: [
          { id: 1, name: 'โทรศัพท์ Nokia รุ่น 1' },
          { id: 2, name: 'โทรศัพท์ Samsung รุ่น 1' },
          { id: 3, name: 'โทรศัพท์ Apple รุ่น 1' },          
        ],
        yearRules: [
          v => !!v || 'โปรดเลือกปีงบประมาณ',
        ],
        projectRootRules: [
          v => !!v || 'โปรดเลือกโครงการงบประมาณ',
        ],
        projectRules: [
          v => !!v || 'โปรดเลือกโครงการ',
        ],
        categoryRules: [
          v => !!v || 'โปรดเลือกหมวดหมู่หลัก',
        ],
        subcategoryRules: [
          v => !!v || 'โปรดเลือกหมวดหมู่ย่อย',
        ],
        parcelRules: [
          v => !!v || 'โปรดเลือกพัสดุ',
        ],
        countRules: [
          v => !!v || 'โปรดเลือกพัสดุ',
        ],
        datetimeCreateRules: [
          v => !!v || 'โปรดใส่วันที่รับเข้า',
        ],
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.parcel_id === 'create'
      },
    },
    methods: {
      onSubmit () {
        this.$refs.form.validate()
      },
    }
  }
</script>

<style lang="scss">
  #parcel-detail-page {
  }
</style>