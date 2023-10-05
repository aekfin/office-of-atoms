<template>
  <div id="project-create-page">
    <PageHeader :text="isCreate ? 'การเพิ่มโครงการ' : 'การแก้ไขโครงการ'" hideTotal :logRoute="logRoute"/>
    <Loading v-if="isLoading && !project"/>
    <v-form v-else ref="form" v-model="valid" class="mt-4">
      <v-container>
        <v-row justify="end">
          <span v-if="!isCreate && project">
            <b v-if="project.depositRefunds" class="success--text">คืนเงินประกันแล้ว</b>
            <span v-else>
              <v-btn color="primary" @click="onDepositRefund">คืนเงินประกัน</v-btn>
            </span>
          </span>
        </v-row>
        <v-row>
          <v-col :cols="12">
            <v-btn color="secondary" @click="manualMode = !manualMode">{{ manualMode ? 'เลือกจากรายชื่อโครงการ' : 'กรอกชื่อโครงการด้วยตัวเอง' }}</v-btn>
          </v-col>
        </v-row>
        <v-row v-if="manualMode">
          <v-col :cols="12" :md="10">
            <v-text-field v-model="form.projectName" label="โครงการ *" :rules="projectUserRules" required/>
          </v-col>
        </v-row>
        <v-row v-else-if="isCreate || editMode">
          <v-col :cols="12" :md="2">
            <v-text-field v-model="year" label="ปีงบประมาณ *" :rules="yearRules" type="number"/>
          </v-col>
          <v-col :cols="12" :md="4" class="d-flex align-center">
            <v-row class="flex-nowrap" align="baseline">
              <v-text-field v-model="budgetStart" class="cost-field" label="งบประมาณต่ำสุด *" :rules="budgetStartRules" type="number"/>
              <div class="mr-3 ml-3 text-h5">-</div>
              <v-text-field v-model="budgetEnd" class="cost-field" label="งบประมาณสูงสุด *" :rules="budgetEndRules" type="number" :disabled="!budgetStart"/>
            </v-row>
          </v-col>
          <v-col :cols="12" :md="6">
            <ProjectDropdown v-model="form.projectName" itemValue="projectName" itemText="projectName" label="โครงการ *" :apiPath="propjectApiPath" :query="projectQuery"
              :rules="projectRules" isProject required :disabled="!year || !budgetStart || !budgetEnd" @select="onSelectProject"/>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col :cols="12" :md="10">
            <v-text-field v-model="form.projectName" label="โครงการ *" :rules="projectUserRules" required disabled/>
          </v-col>
          <v-col class="d-flex align-center" cols="auto">
            <v-btn block outlined @click="onEditProject">เลือกโครงการอื่น</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" :md="4">
            <v-text-field v-model="form.projectNumber" label="เลขที่โครงการ *" :rules="codeRules" :disabled="disabledInfo"/>
          </v-col>
          <v-col :cols="12" :md="4">
            <v-text-field v-model="form.contractNumber" label="เลขที่ใบสั่งซื้อ/จ้าง หรือเลขที่สัญญา *" :rules="contractNumberRules" :disabled="disabledInfo"/>
          </v-col>
          <v-col :cols="12" :md="4">
            <v-text-field v-model="form.contractControlNumber" label="เลขที่คุมสัญญา *" :rules="contractControlNumberRules" :disabled="disabledInfo"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" :lg="3" :md="6">
            <InputDatePicker :value.sync="form.projectStartDate" label="วันเริ่มโครงการ *" :rules="datetimeStartRules" :disabled="disabledInfo"/>
          </v-col>
          <v-col :cols="12" :lg="3" :md="6">
            <InputDatePicker :value.sync="form.contractStartDate" label="วันลงนามสัญญา *" :rules="datetimeCompanyStartRules" :disabled="disabledInfo"/>
          </v-col>
          <v-col :cols="12" :lg="3" :md="6">
            <InputDatePicker :value.sync="form.contractEndDate" label="วันสิ้นสัญญา *" :rules="datetimeCompanyEndRules" :disabled="disabledInfo"/>
          </v-col>
          <v-col :cols="12" :lg="3" :md="6">
            <InputDatePicker :value.sync="form.warrantyEndDate" label="วันที่สิ้นสุดการรับประกัน *" :rules="warrantyEndDateRules" required :disabled="disabledInfo"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" :lg="4" :md="6">
            <v-text-field v-model="form.budget" label="งบประมาณโครงการ *" type="number" :rules="budgetRules"/>
          </v-col>
          <v-col :cols="12" :lg="4" :md="6">
            <SelectDropdown :value.sync="form.format" :items="formatList" itemValue="id" itemText="name" label="รูปแบบ *" :rules="formatRules"/>
          </v-col>
          <v-col :cols="12" :lg="4" :md="6">
            <SelectDropdown :value.sync="form.type" :items="typeList" itemValue="id" itemText="name" label="วีธี รูปแบบงาน *" :rules="contactPositionRules"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" :md="6">
            <v-text-field v-model="form.responsibleAgency" label="หน่วยงานรับผิดชอบ"/>
          </v-col>
          <v-col :cols="12" :md="6">
            <v-text-field v-model="form.responsibleMan" label="ชื่อผู้รับผิดชอบ"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" :md="6">
            <v-textarea v-model="form.detailedWorkMoney" label="รายละเอียดงาน งวดงาน/เงิน"/>
          </v-col>
          <v-col :cols="12" :md="6">
            <v-textarea v-model="form.detailedWork" label="รายละเอียดงานในแต่ล่ะงวด"/>
          </v-col>
        </v-row>
        <v-row class="mt-10 mb-5">
          <h3 class="text-h5"><b>รายละเอียดรายการวัสดุ/ครุภัณฑ์ที่ต้องส่งมอบในแต่ละงวด</b></h3>
        </v-row>
        <div v-for="i in 5" :key="i" class="mb-3">
          <div style="font-size: 20px"><b>งวดที่ {{ i }}</b></div>
          <v-row>
            <v-col :cols="12" :md="6">
              <v-text-field v-model="form[`period${i}`]" label="รายละเอียดรายการวัสดุ/ครุภัณฑ์"/>
            </v-col>
            <v-col :cols="12" :md="3">
              <InputDatePicker :value.sync="form[`period${i}Date`]" label="วันที่ส่งมอบ"/>
            </v-col>
          </v-row>
        </div>
      </v-container>

      <v-expansion-panels v-model="formExpand" class="form-expansion-panels mt-10" flat multiple>
        <v-expansion-panel>
          <v-expansion-panel-header>
            เลือกบริษัทคู่สัญญา
            <template #actions>
              <i class="material-icons">keyboard_arrow_down</i>
            </template>
          </v-expansion-panel-header>
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
                  <v-row v-for="(contact, i) in form.directors" :key="i" class="pl-2 pr-3 mb-3" align="baseline">
                    <div class="prefix-wrapper">
                      <div class="mr-5">{{ i + 1 }}.</div>
                      <v-text-field v-model="contact.description" label="ตำแหน่ง *" :rules="positionRules"/>
                    </div>
                    <v-text-field v-model="contact.name" class="company-name" label="ชื่อ-นามสกุล *" :rules="contactNameRules"/>
                    <v-text-field v-model="contact.mobile" class="phone" label="เบอร์โทรศัพท์"/>
                    <v-text-field v-model="contact.email" class="email" label="E-Mail"/>
                    <v-btn v-if="form.directors.length > 1" icon @click="removeContact(i)">
                      <i class="material-icons">delete</i>
                    </v-btn>
                  </v-row>
                  <v-row v-if="form.directors.length < 15" class="mt-4">
                    <v-btn block rounded outlined @click="addContact">เพิ่มผู้ติดต่อ</v-btn>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header>
            คณะกรรมการตรวจรับพัสดุ / ผู้ตรวจรับพัสดุ
            <template #actions>
              <i class="material-icons">keyboard_arrow_down</i>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container>
              <v-row>
                <v-col class="mt-2">
                  <v-row v-for="(contact, i) in form.committees" :key="i" class="pl-2 pr-3 mb-3" align="baseline">
                    <div class="prefix-wrapper">
                      <div class="mr-5">{{ i + 1 }}.</div>
                      <SelectDropdown :value.sync="contact.description" :items="companyPositionList" itemValue="id" itemText="name" label="ประเภทคณะกรรมการ *" :rules="contactPositionRules"/>
                    </div>
                    <v-text-field v-model="contact.name" class="company-name" label="ชื่อ-นามสกุล *" :rules="contactNameRules"/>
                    <v-text-field v-model="contact.mobile" class="phone" label="เบอร์โทรศัพท์"/>
                    <v-text-field v-model="contact.email" class="email" label="E-Mail"/>
                    <v-btn v-if="form.committees.length > 1" icon @click="removeCommittee(i)">
                      <i class="material-icons">delete</i>
                    </v-btn>
                  </v-row>
                  <v-row class="mt-4">
                    <v-btn block rounded outlined @click="addCommittee">เพิ่มกรรมการ</v-btn>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header>
            แนบเอกสารเพิ่มเติม
            <template #actions>
              <i class="material-icons">keyboard_arrow_down</i>
            </template>
          </v-expansion-panel-header>
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
          <v-btn large plain @click="$router.push('/project/')">ย้อนกลับ</v-btn>
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
      ProjectDropdown: () => import('~/components/ProjectDropdown.vue'),
      Loading: () => import('~/components/Loading.vue'),
    },
    data () {
      return {
        valid: true,
        isLoading: false,
        manualMode: false,
        editMode: false,
        project: null,
        year: '2563',
        budgetStart: '0',
        budgetEnd: '100000',
        form: {
          projectName: '',
          projectNumber: '',
          contractNumber: '',
          contractControlNumber: '',
          projectStartDate: '',
          contractStartDate: '',
          contractEndDate: '',
          warrantyEndDate: '',
          contractCompanyId: null,
          directors: [],
          committees: [],
          ouId: null,
          departmentId: null,
          type: '',
          detailedWorkMoney: '',
          detailedWork: '',
          detailsOfItems: '',
          format: null,
          budget: '',
          responsibleMan : '',
          period1: '',
          period1Date: '',
          period2: '',
          period2Date: '',
          period3: '',
          period3Date: '',
          period4: '',
          period4Date: '',
          period5: '',
          period5Date: '',
        },
        attachFiles: [],
        removeFile: [],
        formExpand: [0, 1, 2],
        companyPositionList: [
          { id: 'ประธานกรรมการ', name: 'ประธานกรรมการ' },
          { id: 'กรรมการ', name: 'กรรมการ' },
          { id: 'กรรมการเลขานุการ', name: 'กรรมการเลขานุการ' },
          { id: 'ผู้ช่วยกรรมการและเลขานุการ', name: 'ผู้ช่วยกรรมการและเลขานุการ' },
        ],
        typeList: [
          { id: 'e-Bidding', name: 'e-Bidding' },
          { id: 'e-market', name: 'e-market' },
          { id: 'งานจ้างออกแบบหรือควบคุมงานก่อสร้างโดยวิธีคัดเลือก', name: 'งานจ้างออกแบบหรือควบคุมงานก่อสร้างโดยวิธีคัดเลือก' },
          { id: 'งานจ้างออกแบบหรือควบคุมงานก่อสร้างโดยวิธีประกวดแบบ', name: 'งานจ้างออกแบบหรือควบคุมงานก่อสร้างโดยวิธีประกวดแบบ' },
          { id: 'งานจ้างออกแบบหรือควบคุมงานก่อสร้างโดยวิธีประกาศเชิญชวนทั่วไป', name: 'งานจ้างออกแบบหรือควบคุมงานก่อสร้างโดยวิธีประกาศเชิญชวนทั่วไป' },
          { id: 'งานจ้างออกแบบหรือควบคุมงานก่อสร้างโดยวิธีเฉพาะเจาะจง', name: 'งานจ้างออกแบบหรือควบคุมงานก่อสร้างโดยวิธีเฉพาะเจาะจง' },
          { id: 'จ้างที่ปรึกษาโดยวิธีคัดเลือก', name: 'จ้างที่ปรึกษาโดยวิธีคัดเลือก' },
          { id: 'จ้างที่ปรึกษาโดยวิธีประกาศเชิญชวนทั่วไป', name: 'จ้างที่ปรึกษาโดยวิธีประกาศเชิญชวนทั่วไป' },
          { id: 'จ้างที่ปรึกษาโดยวิธีเฉพาะเจาะจง', name: 'จ้างที่ปรึกษาโดยวิธีเฉพาะเจาะจง' },
          { id: 'วิธีคัดเลือก', name: 'วิธีคัดเลือก' },
          { id: 'วิธีเฉพาะเจาะจง', name: 'วิธีเฉพาะเจาะจง' },
          { id: 'วิธีเฉพาะเจาะจง(ข)', name: 'วิธีเฉพาะเจาะจง(ข)' },
          { id: 'สอบราคา', name: 'สอบราคา' },
        ],
        formatList: [
          { id: 'ซื้อ', name: 'ซื้อ' },
          { id: 'จ้าง', name: 'จ้าง' },
          { id: 'เช่า', name: 'เช่า' },
        ],
        yearRules: [
          v => !!v || 'โปรดใส่ปีงบประมาณ',
        ],
        budgetStartRules: [
          v => isNaN(parseInt(v)) ? 'โปรดใส่งบประมาณต่ำสุด' : parseInt(v) >= 0 || 'ต้องมากกว่าหรือเท่ากับ 0'
        ],
        budgetEndRules: [
          v => isNaN(parseInt(v)) ? 'โปรดใส่งบประมาณสูงสุด' : parseInt(v) > parseInt(this.budgetStart) || 'ต้องมากกว่างบประมาณต่ำสุด',
        ],
        budgetRules: [
          v => !!v || 'โปรดใส่งบประมาณโครงการ',
        ],
        formatRules: [
          v => !!v || 'โปรดใส่เลือกรูปแบบ',
        ],
        projectRules: [
          v => !!v || 'โปรดเลือกโครงการ',
        ],
        projectUserRules: [
          v => !!v || 'โปรดใส่โครงการ',
        ],
        codeRules: [
          v => !!v || 'โปรดใส่เลขที่โครงการ',
        ],
        contractNumberRules: [
          v => !!v || 'โปรดใส่เลขที่ใบสั่งซื้อ/จ้าง หรือเลขที่สัญญา',
        ],
        contractControlNumberRules: [
          v => !!v || 'โปรดใส่เลขที่คุมสัญญา',
        ],
        datetimeStartRules: [
          v => !!v || 'โปรดใส่วันเริ่มโครงการ',
        ],
        datetimeCompanyStartRules: [
          v => !!v || 'โปรดใส่วันลงนามสัญญา',
        ],
        datetimeCompanyEndRules: [
          v => !!v || 'โปรดใส่วันสิ้นสัญญา',
        ],
        warrantyEndDateRules: [
          v => !!v || 'โปรดใส่วันที่สิ้นสุดการรับประกัน',
        ],
        companyRules: [
          v => !!v || 'โปรดใส่บริษัทคู่สัญญา',
        ],
        contactPositionRules: [
          v => !!v || 'โปรดใส่ประเภทคณะกรรมการ',
        ],
        positionRules: [
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
      propjectApiPath () {
        return 'thirdParty/project-detail-v2'
      },
      projectQuery () {
        return { year: this.year || 2563, budgetStart: this.budgetStart || 0, budgetEnd: this.budgetEnd || 0 }
      },
      logRoute () {
        return { apiPath: 'Project/getLogProject', query: { id: this.$route.params.project_id } }
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
      else this.addCommittee()
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
            contractEndDate: this.$fn.convertStringToDate(data.contractEndDate),
            warrantyEndDate: data.warrantyEndDate ? this.$fn.convertStringToDate(data.warrantyEndDate) : '',
            period1Date: data.period1Date ? this.$fn.convertStringToDate(data.period1Date) : '',
            period2Date: data.period2Date ? this.$fn.convertStringToDate(data.period2Date) : '',
            period3Date: data.period3Date ? this.$fn.convertStringToDate(data.period3Date) : '',
            period4Date: data.period4Date ? this.$fn.convertStringToDate(data.period4Date) : '',
            period5Date: data.period5Date ? this.$fn.convertStringToDate(data.period5Date) : '',
          }
          this.isLoading = false
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      addContact () {
        const newContact = {
          description: '',
          name: '',
          email: '',
          mobile: '',
        }
        this.form.directors = [ ...this.form.directors, newContact ]
      },
      removeContact (i) {
        this.form.directors.splice(i, 1)
      },
      addCommittee () {
        const newContact = {
          description: '',
          name: '',
          email: '',
          mobile: '',
        }
        this.form.committees = [ ...this.form.committees, newContact ]
      },
      removeCommittee (i) {
        this.form.committees.splice(i, 1)
      },
      onEditProject () {
        this.form.projectName = ''
        this.editMode = true
      },
      onSelectProject ({ val, item }) {
        const getDate = date => date && date.setFullYear(date.getFullYear() - 543) || ''
        if (item) {
          this.form.projectName = item.projectName
          this.form.projectNumber = item.projectNumber
          this.form.contractNumber = item.contractNumber
          this.form.projectStartDate = item.projectStartDate ? this.$fn.convertStringToDate(item.projectStartDate) : ''
          this.form.contractStartDate = item.contractStartDate ? this.$fn.convertStringToDate(item.contractStartDate) : ''
          this.form.contractEndDate = item.contractEndDate ? this.$fn.convertStringToDate(item.contractEndDate) : ''
          getDate(this.form.projectStartDate)
          getDate(this.form.contractStartDate)
          getDate(this.form.contractEndDate)
        }
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
      async onDepositRefund () {
        try {
          await this.$store.dispatch('http', { apiPath: 'Project/deposit-refunds', query: { projectId: this.$route.params.project_id } })
          await this.$store.dispatch('snackbar', { text: 'คืนเงินประกันสำเร็จ' })
          await this.getData()
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      async onSubmit () {
        const valid = this.$refs.form.validate()
        if (valid) {
          try {
            const form = { ...this.form }
            form.projectStartDate = this.$fn.convertDateToString(form.projectStartDate)
            form.contractStartDate = this.$fn.convertDateToString(form.contractStartDate)
            form.contractEndDate = this.$fn.convertDateToString(form.contractEndDate)
            form.warrantyEndDate = this.$fn.convertDateToString(form.warrantyEndDate)
            form.period1Date = form.period1Date ? this.$fn.convertDateToString(form.period1Date) : ''
            form.period2Date = form.period2Date ? this.$fn.convertDateToString(form.period2Date) : ''
            form.period3Date = form.period3Date ? this.$fn.convertDateToString(form.period3Date) : ''
            form.period4Date = form.period4Date ? this.$fn.convertDateToString(form.period4Date) : ''
            form.period5Date = form.period5Date ? this.$fn.convertDateToString(form.period5Date) : ''
            if (!this.isCreate) this.setEditForm(form)
            const apiPath = this.isCreate ? 'Project/addProjectV2' : 'Project/updateProjectV2'
            const method = this.isCreate ? 'post' : 'patch'
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
          this.formExpand = [0, 1, 2]
        }
      }
    },
  }
</script>

<style lang="scss">
  #project-create-page {
    .row {
      flex-wrap: nowrap;
      gap: 20px;

      .prefix-wrapper {
        width: 30%;
        display: flex;
        align-items: baseline;
      }

      .company-name {
        width: 40%;
      }

      .phone {
        width: 15%
      }

      .email {
        width: 20%
      }

      .cost-field {
        input {
          text-align: center;
        }
      }
    }

    @media only screen and (max-width: 426px) {
      .row{
        flex-wrap: wrap;

        .prefix-wrapper, .company-name, .phone, .email {
          width: 100%;
        }
      }
    }
  }
</style>