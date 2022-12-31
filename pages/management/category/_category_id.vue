<template>
  <div id="category-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มหมวดหมู่' : 'การแก้ไขหมวดหมู่'" hideTotal/>
    <v-form ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row>
          <h3 class="text-h5"><b>หมวดหมู่หลัก</b></h3>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="form.name" name="name" label="ชื่อหมวดหลัก *" :rules="nameRules" required/>
          </v-col>
        </v-row>
      </v-container>
      <v-expansion-panels v-model="formExpand" class="form-expansion-panels" flat multiple>
        <v-expansion-panel>
          <v-expansion-panel-header>หมวดหมู่ย่อย</v-expansion-panel-header>
          <v-expansion-panel-content class="pl-3 pr-3">
            <v-container>
              <v-row v-for="(subcategory, i) in subcategoryList" :key="i" align="baseline">
                <div class="mr-4">{{ i + 1 }}.</div>
                <v-text-field v-model="subcategoryList[i].name" name="name" label="ชื่อหมวดย่อย *" :rules="nameRules" required/>
                <v-btn v-if="subcategoryList.length > 1" class="ml-2" icon color="red" @click="removeSubcategory(i)">
                  <v-icon>mdi-close-circle</v-icon>
                </v-btn>
              </v-row>
              <v-row class="mt-5">
                <v-btn block rounded outlined @click="addSubcategory">เพิ่มหมวดหมู่ย่อย</v-btn>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/management/category/')">ย้อนหลับ</v-btn>
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
          name: '',
        },
        formExpand: [0],
        subcategoryList: [
          { name: '' }
        ],
        nameRules: [
          v => !!v || 'โปรดใส่ชื่อ',
        ],
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.category_id === 'create'
      },
    },
    methods: {
      addSubcategory () {
        this.subcategoryList.push({ name: '' })
      },
      removeSubcategory (i) {
        this.subcategoryList.splice(i, 1)
      },
      onSubmit () {
        this.$refs.form.validate()
      },
    },
  }
</script>

<style lang="scss">
  #category-detail-page {
  }
</style>