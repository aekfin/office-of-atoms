<template>
  <div id="management-goods-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มพัสดุ - ครุภัณฑ์' : 'การแก้ไขพัสดุ - ครุภัณฑ์'"/>
    <v-form ref="form" v-model="valid" lazyValidation class="mt-8">
      <v-container>
        <v-row>
          <v-col :cols="3">
            <v-select v-model="form.type" :items="typeList" itemValue="id" itemText="name" label="ประเภท *" :rules="typeRules" required/>
          </v-col>
          <v-col :cols="9">
            <v-text-field v-model="form.name" name="name" label="ชื่อ *" :rules="nameRules" required/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="5">
            <v-select v-model="form.category" :items="categoryList" itemValue="id" itemText="name" label="หมวดหมู่หลัก *" :rules="cateogryRules" required/>
          </v-col>
          <v-col :cols="5">
            <v-select v-model="form.subcategory" :items="subcategoryList" itemValue="id" itemText="name" label="หมวดหมู่ย่อย *" :rules="subcateogryRules" required/>
          </v-col>
          <v-col :cols="2">
            <v-select v-model="form.year" :items="yearList" itemValue="id" itemText="name" label="ปี *" :rules="yearRules" required/>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea v-model="form.note" label="คำอธิบายเพิ่มเติม"/>
          </v-col>
        </v-row>
      </v-container>
      <v-container class="mt-12">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/management/goods/')">ย้อนหลับ</v-btn>
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
        return this.$route.params.good_id === 'create'
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
  #management-goods-detail-page {

  }
</style>