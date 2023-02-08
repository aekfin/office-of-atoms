<template>
  <div id="project-create-page">
    <PageHeader :text="isCreate ? 'การเพิ่มโครงการ' : 'การแก้ไขโครงการ'" hideTotal/>
    <v-form ref="form" v-model="valid" class="mt-4">
      <v-container>
        <v-row>
          <!-- <v-col :cols="2">
            <v-select v-model="form.year" :items="years" itemValue="id" itemText="name" label="ปีงบประมาณ *" :rules="yearRules" required/>
          </v-col>
          <v-col :cols="4">
            <v-select v-model="form.projectRoot" :items="items" itemValue="id" itemText="name" label="เลือกโครงการงบประมาณ *" :rules="projectRootRules" required :disabled="!form.year"/>
          </v-col>
          <v-col :cols="6">
            <v-select v-model="form.project" :items="items" itemValue="id" itemText="name" label="โครงการ *" :rules="projectRules" required :disabled="!form.projectRoot"/>
          </v-col> -->
          <v-col :cols="12">
            <v-text-field v-model="form.project" label="โครงการ *" :rules="projectRules" required/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="3">
            <v-text-field v-model="form.code" name="code" label="เลขที่โครงการ *" :rules="codeRules" :disabled="disabledInfo"/>
          </v-col>
          <v-col :cols="3">
            <v-text-field v-model="form.contractControlNumber" name="code" label="เลขที่คุมสัญญา *" :rules="contractControlNumberRules" :disabled="disabledInfo"/>
          </v-col>
          <v-col :cols="2">
            <InputDatePicker :value.sync="form.datetimeStart" label="วันเริ่มโครงการ *" :rules="datetimeStartRules" :disabled="disabledInfo"/>
          </v-col>
          <v-col :cols="2">
            <InputDatePicker :value.sync="form.datetimeVendorStart" label="วันเริ่มสัญญา *" :rules="datetimeVendorStartRules" :disabled="disabledInfo"/>
          </v-col>
          <v-col :cols="2">
            <InputDatePicker :value.sync="form.datetimeVendorEnd" label="วันสิ้นสัญญา *" :rules="datetimeVendorEndRules" :disabled="disabledInfo"/>
          </v-col>
        </v-row>
      </v-container>
      <v-expansion-panels v-model="formExpand" class="form-expansion-panels mt-5" flat multiple>
        <v-expansion-panel>
          <v-expansion-panel-header>เลือกบริษัทคู่สัญญา</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container>
              <v-row class="pl-3 pr-3">
                <v-select v-model="form.vendor" :items="items" itemValue="id" itemText="name" label="บริษัทคู่สัญญา*" :rules="vendorRules" required/>
              </v-row>
              <v-row v-if="form.vendor" class="pl-3 pr-3">
                <v-col class="mt-2">
                  <v-row class="mb-2">
                    <div class="text-lg font-bold">รายชื่อผู้ติดต่อ</div>
                  </v-row>
                  <v-row v-for="(contact, i) in form.vendorContactList" :key="i" class="flex-nowrap pl-2 pr-3 mb-3" align="baseline">
                    <div class="prefix-wrapper mr-5">
                      <div class="mr-5">{{ i + 1 }}.</div>
                      <v-select v-model="contact.position" :items="vendorPositionList" itemValue="id" itemText="name" label="ตำแหน่ง" :rules="contactPositionRules"/>
                    </div>
                    <v-select v-model="contact.name" :items="vendorNameList" class="vendor-name" itemValue="id" itemText="name" label="ชื่อ-นามสกุล" :rules="contactNameRules"/>
                    <v-btn v-if="form.vendorContactList.length > 1" icon color="red" @click="removeContact(i)">
                      <v-icon>mdi-close-circle</v-icon>
                    </v-btn>
                  </v-row>
                  <v-row v-if="form.vendorContactList.length < 15">
                    <v-btn block rounded outlined @click="addContact">เพิ่มผู้ติดต่อ</v-btn>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>แนบเอกสารเพิ่มเติม</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container>
                <v-row>
                  <AttachFileBtn/>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
      </v-expansion-panels>
      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/project/')">ย้อนหลับ</v-btn>
          <v-btn elevation="2" large color="success" @click="onSubmit">บันทึก</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
  export default {
    components: {
      InputDatePicker: () => import('~/components/InputDatePicker.vue'),
      PageHeader: () => import('~/components/PageHeader.vue'),
      AttachFileBtn: () => import('~/components/AttachFileBtn.vue'),
    },
    data () {
      return {
        valid: true,
        form: {
          year: null,
          projectRoot: null,
          project: null,
          code: '',
          contractControlNumber: '',
          datetimeStart: '',
          datetimeVendorStart: '',
          datetimeVendorEnd: '',
          vendor: null,
          vendorContactList: [],
        },
        formExpand: [0, 1],
        items: [
          { id: 1, name: 'Foo' },
          { id: 2, name: 'Bar' },
          { id: 3, name: 'Fizz' },
          { id: 4, name: 'Buzz' }
        ],
        vendorNameList: [
          { id: 1, name: 'ชื่อ A นามสกุล A' },
          { id: 2, name: 'ชื่อ B นามสกุล B' },
          { id: 3, name: 'ชื่อ C นามสกุล C' },
        ],
        vendorPositionList: [
          { id: 1, name: 'กรรมการร่าง TOR' },
          { id: 2, name: 'กรรมการพิจารณาโครงการ' },
          { id: 3, name: 'กรรมการตรวจรับ' },
        ],
        years: [
          { id: 1, name: '2022' },
          { id: 2, name: '2021' },
          { id: 3, name: '2020' },
          { id: 4, name: '2019' }
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
        codeRules: [
          v => !!v || 'โปรดใส่เลขที่โครงการ',
        ],
        contractControlNumberRules: [
          v => !!v || 'โปรดใส่เลขที่คุมสัญญา',
        ],
        datetimeStartRules: [
          v => !!v || 'โปรดใส่วันเริ่มโครงการ',
        ],
        datetimeVendorStartRules: [
          v => !!v || 'โปรดใส่วันเริ่มสัญญา',
        ],
        datetimeVendorEndRules: [
          v => !!v || 'โปรดใส่วันสิ้นสัญญา',
        ],
        vendorRules: [
          v => !!v || 'โปรดใส่บริษัทคู่สัญญา',
        ],
        contactPositionRules: [
          v => !!v || 'โปรดใส่ตำแหน่ง',
        ],
        contactNameRules: [
          v => !!v || 'โปรดเลือกผู้ติดต่อ',
        ],
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.project_id === 'create'
      },
      disabledInfo () {
        return !this.form.project
      },
    },
    watch: {
      'form.vendor' (val) {
        if (val && this.form.vendorContactList.length === 0) {
          this.addContact()
        }
      }
    },
    methods: {
      addContact () {
        const newContact = {
          position: null,
          name: null,
        }
        this.form.vendorContactList = [ ...this.form.vendorContactList, newContact ]
      },
      removeContact (i) {
        this.form.vendorContactList.splice(i, 1)
      },
      onSubmit () {
        const valid = this.$refs.form.validate()
      }
    },
  }
</script>

<style lang="scss">
  #project-create-page {
    .row {
      .prefix-wrapper {
        width: 40%;
        display: flex;
        align-items: baseline;
      }

      .vendor-name {
        width: 60%;
      }
    }
  }
</style>