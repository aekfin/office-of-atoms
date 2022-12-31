<template>
  <div id="management-parcel-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มค่าเริ่มต้นพัสดุ' : 'การแก้ไขค่าเริ่มต้นพัสดุ'" hideTotal/>
    <v-form ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row>
          <v-col :cols="6">
            <v-text-field v-model="form.name" name="name" label="ชื่อ *" :rules="nameRules" required/>
          </v-col>
          <v-col :cols="3">
            <v-select v-model="form.category" :items="categoryList" itemValue="id" itemText="name" label="หมวดหมู่หลัก *" :rules="cateogryRules" required/>
          </v-col>
          <v-col :cols="3">
            <v-select v-model="form.subcategory" :items="subcategoryList" itemValue="id" itemText="name" label="หมวดหมู่ย่อย *" :rules="subcateogryRules" required :disabled="!form.category"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="2">
            <v-select v-model="form.year" :items="yearList" itemValue="id" itemText="name" label="ปี *" :rules="yearRules" required/>
          </v-col>
          <v-col :cols="4">
            <v-text-field v-model="form.price" label="ราคากลาง" type="number"/>
          </v-col>
          <v-col :cols="6">
            <v-textarea v-model="form.note" label="คำอธิบายเพิ่มเติม" :rows="3"/>
          </v-col>
        </v-row>
      </v-container>
      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/management/parcel/')">ย้อนหลับ</v-btn>
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
        form: {
          type: null,
          name: '',
          category: null,
          subcategory: null,
          year: (new Date()).getFullYear(),
          price: '',
          note: '',
        },
        categoryList: [
          { id: 1, name: 'โทรศัพท์มือถือ' }
        ],
        subcategoryList: [
          { id: 1, name: 'Nokia' }
        ],
        typeList: [
          { id: 1, name: 'พัสดุ' },
          { id: 2, name: 'ครุภัณฑ์' }
        ],
        typeRules: [
          v => !!v || 'โปรดใส่ประเภท',
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
          v => !!v || 'โปรดใส่ปี',
        ],
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.parcel_id === 'create'
      },
      yearList () {
        return new Array(5).fill().map((_val, i) => {
          const year = (new Date()).getFullYear()
          const name = year + i - 2
          return { id: name, name }
        })
      }
    },
    methods: {
      onSubmit () {
        this.$refs.form.validate()
      },
    }
  }
</script>

<style lang="scss">
  #management-parcel-detail-page {

  }
</style>