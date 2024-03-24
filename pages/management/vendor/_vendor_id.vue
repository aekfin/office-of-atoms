<template>
  <div id="project-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มคู่สัญญา' : 'การแก้ไขคู่สัญญา'" hideTotal/>
    <Loading v-if="isLoading"/>
    <v-form v-else ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row>
          <!-- <v-col cols="auto">
            <UploadImage class="mt-4" :image.sync="form.image"/>
          </v-col> -->
          <v-col :cols="12" :md="8">
            <v-text-field v-model="form.companyNumber" name="code" label="เลขประจำตัวผู้เสียภาษี *"  :rules="rules" required :loading="companyNumberLoading"
            @blur="checkCompanyNumber"/>
          </v-col>
          <v-col :cols="12" :md="4">
            <SelectDropdown :value.sync="form.companyType" :items="typeList" label="ประเภทผู้ขาย *" :rules="typeRules" required/>
          </v-col>
          <v-col :cols="12">
            <v-text-field v-model="form.companyName" label="ชื่อผู้ขาย/บริษัท *" :rules="nameRules" required/>
          </v-col>
          <v-col :cols="12">
            <v-textarea v-model="form.companyAddress" name="address" label="ที่อยู่ *" :rules="addressRules" required/>
          </v-col>
          <v-col :cols="12">
            <v-text-field v-model="form.companyPhone" label="เบอร์โทรศัพท์ *" :rules="contactTelRules"/>
          </v-col>
          <v-col :cols="12">
            <v-text-field v-model="form.serviceType" name="service" label="การบริการ"/>
          </v-col>
          <v-col :cols="12">
            <v-text-field v-model="form.warrantytype" name="warranty" label="การรับประกัน"/>
          </v-col>
        </v-row>
      </v-container>
      <v-expansion-panels v-model="formExpand" class="form-expansion-panels" flat multiple>
        <v-expansion-panel>
          <v-expansion-panel-header>
            ข้อมูลติดต่อ
            <template #actions>
              <i class="material-icons">keyboard_arrow_down</i>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div v-for="(contact, i) in form.contractPersons" :key="i">
              <v-container>
                <v-row class="contract-row">
                  <div class="contract-persons">
                    <v-row>
                      <v-col class="d-flex">
                        <div :md="7" class="self-center mr-5">{{ i + 1 }}.</div>
                        <v-text-field v-model="contact.name" label="ชื่อ - นามสกุล *" :rules="contactNameRules"/>
                      </v-col>
                      <v-col :md="5" class="d-flex">
                        <v-text-field v-model="contact.position" name="code" label="ตำแหน่ง *" :rules="contactPositionRules" required/>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col :md="7">
                        <v-text-field v-model="contact.email" class="pl-8" label="E-mail *" :rules="contactEmailRules"/>
                      </v-col>
                      <v-col :md="5">
                        <v-text-field v-model="contact.phone" label="เบอร์โทรศัพท์ *" :rules="contactTelRules"/>
                      </v-col>
                    </v-row>
                  </div>
                  <v-btn v-if="form.contractPersons.length > 1" class="ml-2" icon @click="removeContact(i)">
                    <i class="material-icons">delete</i>
                  </v-btn>
                </v-row>
              </v-container>
            </div>
            <v-row>
              <v-btn block rounded outlined @click="addContact">เพิ่มผู้ติดต่อ</v-btn>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/management/vendor/')">ย้อนกลับ</v-btn>
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
      // UploadImage: () => import('~/components/UploadImage.vue'),
      SelectDropdown: () => import('~/components/SelectDropdown.vue'),
    },
    data () {
      return {
        valid: true,
        isLoading: false,
        originalCompanyNumber: '',
        form: {
          companyNumber: '',
          companyName: '',
          companyAddress: '',
          companyPhone: '',
          companyType: '',
          serviceType: '',
          warrantytype: '',
          contractPersons: [
            { name: '', position: '', email: '', phone: '' }
          ]
        },
        typeList: [
          { id: 'corporation', name: 'นิติบุคคล' },
          { id: 'person', name: 'บุคคลธรรมดา' },
        ],
        formExpand: [0],
        validCompanyNumber: true,
        validCompanyNumberEmpty: true,
        companyNumberLoading: false,
        typeRules: [
          v => !!v || 'โปรดเลือกประเภทผู้ขาย',
        ],
        codeRules: [
        v => !!v || 'โปรดใส่รหัสผู้ขาย',
          // v => v ? this.$fn.validCompanyNumber || 'รหัสผู้ขายซ้ำ' : 'โปรดใส่รหัสผู้ขาย'
        ],
        nameRules: [
          v => !!v || 'โปรดใส่ชื่อผู้ขาย/บริษัท',
        ],
        addressRules: [
          v => !!v || 'โปรดใส่ที่อยู่',
        ],
        contactNameRules: [
          v => !!v || 'โปรดใส่ชื่อ - นามสกุล',
          v => /^[a-zA-Zก-๏\s]+$/.test(v) || 'กรุณากรอกชื่อ-นามสกุลเป็นตัวอักษรเท่านั้น'
        ],
        contactTelRules: [
          v => !!v || 'โปรดใส่เบอร์โทรศัพท์',
          v => /^\d+$/.test(v) || 'กรุณากรอกเบอร์โทรศัพท์เป็นตัวตัวเลขเท่านั้น'
        ],
        contactPositionRules: [
          v => !!v || 'โปรดใส่ตำแหน่ง',
          v => /^[a-zA-Zก-๏\s]+$/.test(v) || 'กรุณากรอกตำแหน่งเป็นตัวอักษรเท่านั้น'
        ],
        contactEmailRules: [
          v => v ? this.$fn.checkEmailFormat(v) || 'โปรดใส่ E-Mail ให้ถูกต้อง' : 'โปรดใส่ E-Mail'
        ],
        rules: [
          v => !!v || 'โปรดใส่รหัสผู้ขาย'
        ]
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.vendor_id === 'create'
      },
    },
    mounted () {
      if (!this.isCreate) this.getData()
    },
    methods: {
      async getData () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: 'Project/getcompany', query: { id: this.$route.params.vendor_id } })
          this.originalCompanyNumber = data.companyNumber
          this.form = data
          this.isLoading = false
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      addContact () {
        const newContact = { name: '', position: '', email: '', tel: '' }
        this.form.contractPersons = [ ...this.form.contractPersons, newContact ]
      },
      removeContact (i) {
        this.form.contractPersons.splice(i, 1)
      },
      async checkCompanyNumber () {
        if (this.form.companyNumber && this.originalCompanyNumber !== this.form.companyNumber) {
          try {
            this.companyNumberLoading = true
            const { data } = await this.$store.dispatch('http', { apiPath: 'Project/checkCompany', query: { companyNumber: this.form.companyNumber } })
            this.validCompanyNumber = data.data === false
            this.companyNumberLoading = false
            if (data === true) {
              this.rules = ['รหัสผู้ขายซ้ำ']
            } else {
              this.rules = [];
            }
            return Promise.resolve()
          } catch (err) { return Promise.reject(err) } 
        }else{
          this.rules = ['โปรดใส่รหัสผู้ขาย']
        }
      },
      async onSubmit () {
        const valid = this.$refs.form.validate()
        try {
          if (valid) {
            const apiPath = this.isCreate ? 'Project/addcompany' : 'Project/updateCompany'
            const method = this.isCreate ? 'post' : 'patch'
            const { data } = await this.$store.dispatch('http', { method, apiPath, data: this.form })
            await this.$store.dispatch('snackbar', { text: this.isCreate ? 'สร้างคู่สัญญาสำเร็จ' : 'แก้ไขคู่สัญญาสำเร็จ' })
            if (this.isCreate) this.$router.push('/management/vendor/')
            else await this.getData()
            return Promise.resolve(data)
          } else {
            this.formExpand = [0]
            return Promise.resolve()
          }
        } catch (err) { return Promise.reject(err) }
      },
    }
  }
</script>

<style lang="scss">
  #project-detail-page {
    .contract-row {
      flex-wrap: nowrap;
      align-items: baseline;
      margin-bottom: 20px;

      .contract-persons {
        width: calc(100% - 60px);
      }

      @media only screen and (max-width: 426px) {
        .contract-persons {
          width: 100%;
        }
      }
    }
  }
</style>