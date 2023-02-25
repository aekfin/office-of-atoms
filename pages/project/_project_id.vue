<template>
  <div id="project-create-page">
    <PageHeader :text="isCreate ? 'การเพิ่มโครงการ' : 'การแก้ไขโครงการ'" hideTotal/>
    <Loading v-if="isLoading && !project"/>
    <v-form v-else ref="form" v-model="valid" class="mt-4">
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
            <v-text-field v-model="form.projectName" label="โครงการ *" :rules="projectRules" required/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="3">
            <v-text-field v-model="form.projectNumber" label="เลขที่โครงการ *" :rules="codeRules" :disabled="disabledInfo"/>
          </v-col>
          <v-col :cols="3">
            <v-text-field v-model="form.contractNumber" label="เลขที่คุมสัญญา *" :rules="contractNumberRules" :disabled="disabledInfo"/>
          </v-col>
          <v-col :cols="2">
            <InputDatePicker :value.sync="form.projectStartDate" label="วันเริ่มโครงการ *" :rules="datetimeStartRules" :disabled="disabledInfo"/>
          </v-col>
          <v-col :cols="2">
            <InputDatePicker :value.sync="form.contractStartDate" label="วันเริ่มสัญญา *" :rules="datetimeCompanyStartRules" :disabled="disabledInfo"/>
          </v-col>
          <v-col :cols="2">
            <InputDatePicker :value.sync="form.contractEndDate" label="วันสิ้นสัญญา *" :rules="datetimeCompanyEndRules" :disabled="disabledInfo"/>
          </v-col>
        </v-row>
      </v-container>
      <v-expansion-panels v-model="formExpand" class="form-expansion-panels mt-10" flat multiple>
        <v-expansion-panel>
          <v-expansion-panel-header>เลือกบริษัทคู่สัญญา</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container>
              <v-row class="pl-3 pr-3">
                <SelectDropdown :value.sync="form.contractCompanyId" label="บริษัทคู่สัญญา*" itemText="companyName" :rules="companyRules" apiPath="Project/getListCompany" required/>
              </v-row>
              <v-row v-if="form.contractCompanyId" class="pl-3 pr-3">
                <v-col class="mt-2">
                  <v-row class="mb-2">
                    <div class="text-lg font-bold">รายชื่อผู้ติดต่อ</div>
                  </v-row>
                  <v-row v-for="(contact, i) in form.directors" :key="i" class="flex-nowrap pl-2 pr-3 mb-3" align="baseline">
                    <div class="prefix-wrapper mr-5">
                      <div class="mr-5">{{ i + 1 }}.</div>
                      <v-select v-model="contact.description" :items="companyPositionList" itemValue="id" itemText="name" label="ตำแหน่ง" :rules="contactPositionRules"/>
                    </div>
                    <v-text-field v-model="contact.name" class="cpmpany-name" label="ชื่อ-นามสกุล" :rules="contactNameRules"/>
                    <v-btn v-if="form.directors.length > 1" icon @click="removeContact(i)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-row>
                  <v-row v-if="form.directors.length < 15">
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
                  <AttachFileBtn :value.sync="attachFiles" :attachments="form.fileInfo" @removeAttachment="onRemoveAttachment"/>
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
      SelectDropdown: () => import('~/components/SelectDropdown.vue'),
      Loading: () => import('~/components/Loading.vue'),
    },
    data () {
      return {
        valid: true,
        isLoading: false,
        project: null,
        form: {
          year: null,
          projectRoot: null,
          projectName: null,
          projectNumber: '',
          contractNumber: '',
          projectStartDate: '',
          contractStartDate: '',
          contractEndDate: '',
          contractCompanyId: null,
          directors: [],
        },
        attachFiles: [],
        removeFile: [],
        formExpand: [0, 1],
        companyPositionList: [
          { id: 'กรรมการร่าง TOR', name: 'กรรมการร่าง TOR' },
          { id: 'กรรมการพิจารณาโครงการ', name: 'กรรมการพิจารณาโครงการ' },
          { id: 'กรรมการตรวจรับ', name: 'กรรมการตรวจรับ' },
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
        contractNumberRules: [
          v => !!v || 'โปรดใส่เลขที่คุมสัญญา',
        ],
        datetimeStartRules: [
          v => !!v || 'โปรดใส่วันเริ่มโครงการ',
        ],
        datetimeCompanyStartRules: [
          v => !!v || 'โปรดใส่วันเริ่มสัญญา',
        ],
        datetimeCompanyEndRules: [
          v => !!v || 'โปรดใส่วันสิ้นสัญญา',
        ],
        companyRules: [
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
        return !this.form.projectName
      },
    },
    watch: {
      'form.contractCompanyId' (val) {
        if (val && this.form.directors.length === 0) {
          this.addContact()
        }
      }
    },
    mounted () {
      if (!this.isCreate) this.getData()
    },
    methods: {
      async getData () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: 'Project/getProject', query: { id: this.$route.params.project_id } })
          this.project = data
          this.form = {
            ...data,
            contractCompanyId: data.contractCompany.id,
            projectStartDate: this.$fn.convertStringToDate(data.projectStartDate),
            contractStartDate: this.$fn.convertStringToDate(data.contractStartDate),
            contractEndDate: this.$fn.convertStringToDate(new Date()),
          }
          this.isLoading = false
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      addContact () {
        const newContact = {
          description: null,
          name: null,
        }
        this.form.directors = [ ...this.form.directors, newContact ]
      },
      removeContact (i) {
        this.form.directors.splice(i, 1)
      },
      onRemoveAttachment (attach) {
        this.removeFile.push(attach)
      },
      async uploadFiles (id = this.project.id) {
        try {
          let data = new FormData()
          for (const file of this.attachFiles) {
            data.append('file', file)
          }
          data.append('projectId', id)
          const res = await this.$store.dispatch('http', { method: 'post', apiPath: 'Project/uploadFile', data })
          return Promise.resolve(res)
        } catch (err) { return Promise.reject(err) }
      },
      setEditForm (form) {
        delete form.contractCompany
        delete form.fileInfo
        form.removeFile = this.removeFile
      },
      async onSubmit () {
        const valid = this.$refs.form.validate()
        if (valid) {
          try {
            const form = { ...this.form }
            form.projectStartDate = this.$fn.convertDateToString(form.projectStartDate)
            form.contractStartDate = this.$fn.convertDateToString(form.contractStartDate)
            form.contractEndDate = this.$fn.convertDateToString(form.contractEndDate)
            if (!this.isCreate) this.setEditForm(form)
            const apiPath = this.isCreate ? 'Project/addProjectV2' : 'Project/updateProjectV2'
            const method = this.isCreate ? 'post' : 'put'
            const res = await this.$store.dispatch('http', { method, apiPath, data: form })
            if (this.attachFiles.length) await this.uploadFiles(res.data.id)
            this.attachFiles = []
            this.removeFile = []
            await this.$store.dispatch('snackbar', { text: this.isCreate ? 'สร้างโครงการสำเร็จ' : 'แก้ไขโครงการสำเร็จ' })
            if (this.isCreate) this.$router.push('/project/')
            else await this.getData()
            return Promise.resolve(res)
          } catch (err) {
            console.log(err)
            return Promise.reject(err)
          }
        } else {
          this.formExpand = [0, 1]
        }
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

      .cpmpany-name {
        width: 60%;
      }
    }
  }
</style>