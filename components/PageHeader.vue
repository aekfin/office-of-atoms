<template>
  <div class="page-header">
    <div class="header-wrapper">
      <h2 class="text-h4">
        <b>
          <slot>{{ text }}</slot>
        </b>
        <v-btn v-if="logRoute" elevation="2" outlined class="ml-3" color="grey" @click="logDialog = true">ประวัติการแก้ไข</v-btn>
      </h2>
      <!-- <slot name="btn" >
        <v-btn v-if="btnText" elevation="2" large color="success" @click="$emit('create')">
          <NLink v-if="createRoute" :to="createRoute" class="text-white">{{ btnText }}</NLink>
          <div v-else>{{ btnText }}</div>
        </v-btn>
      </slot> -->
      <NLink v-if="createRoute" :to="createRoute" class="text-white">        
        <slot name="btn" >
          <v-btn v-if="btnText" elevation="2" large color="success" @click="$emit('create')">
            {{ btnText }}
          </v-btn>
        </slot>
      </NLink>
      <div v-else><slot name="btn" >
          <v-btn v-if="btnText" elevation="2" large color="success" @click="$emit('create')">
            {{ btnText }}
          </v-btn>
        </slot>
      </div>

    </div>
    <div v-if="!hideTotal" class="mt-4">ทั้งหมด {{ total || 0 }} {{ unit }}</div>
    <div v-if="filters.length" class="filter-wrapper mt-3">
      <div class="btn-wrapper">
        <v-badge :content="currentFilters.length" bordered overlap color="primary" :value="!!currentFilters.length">
          <v-btn elevation="2" outlined color="primary" @click="dialog = !dialog">
            <i class="material-icons">filter_alt</i>
            <div>กรองข้อมูล</div>
          </v-btn>
        </v-badge>
      </div>
      <div class="export-report-button">
        <ExportReportButton v-if="reportApiPath1" :apiPath="reportApiPath1" :name="reportName1" :text="exportText1" :query="reportQuery"/>
        <ExportReportButton v-if="reportApiPath2" :apiPath="reportApiPath2" :name="reportName2" :text="exportText2" :query="reportQuery"/>
        <ExportReportButton v-if="reportApiPath" :apiPath="reportApiPath" :name="reportName" :text="exportText" :query="reportQuery"/>
      </div>
    </div>
    <v-dialog v-model="dialog" width="1000" contentClass="filter-dialog">
      <v-card>
        <v-card-title>
          <div class="d-flex w-full justify-space-between">
            <h3 class="text-2xl font-bold">กรองข้อมูลด้วย</h3>
            <v-btn icon @click="dialog = false"><i class="material-icons">close</i></v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" class="mt-5" @submit.prevent>
            <v-container class="pt-0 pb-0">
              <v-row>
                <v-col v-for="filter in filters" :key="filter.param" class="pt-0 pb-0" :cols="12" :md="filter.md || 6">
                  <template v-if="form">
                    <v-text-field v-if="filter.type === 'textField'" v-model="form[filter.param]" :label="filter.name"/>
                    <v-text-field v-else-if="filter.type === 'number'" v-model="form[filter.param]" :label="filter.name" type="number"/>
                    <v-switch v-else-if="filter.type === 'switch'" v-model="form[filter.param]" :label="filter.name"/>
                    <div v-else-if="filter.type === 'space'"/>
                    <InputDatePicker v-else-if="filter.type === 'datePicker'" :value.sync="form[filter.param]" :label="filter.name"/>
                    <SelectDropdown v-else :value.sync="form[filter.param]" :items="filter.options || []" :apiPath="filter.apiPath" itemValue="id" :itemText="filter.itemText || 'name'"
                      :lazy="!isCurrentFilters(filter)" :label="filter.name" clearable :query="{ pageSize: 999 }" @loaded="filter.options = $event"/>
                  </template>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <div class="d-flex justify-end w-full">
            <v-btn plain @click="onClear">ล้างข้อมูล</v-btn>
            <v-btn color="primary" @click="onApply">นำมาใช้</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <LogDialog :value.sync="logDialog" :logRoute="logRoute"/>
  </div>
</template>

<script>
  export default {
    component: {
      SelectDropdown: () => import('~/components/SelectDropdown.vue'),
      ExportReportButton: () => import('~/components/ExportReportButton.vue'),
      InputDatePicker: () => import('~/components/InputDatePicker.vue'),
      LogDialog: () => import('~/components/LogDialog.vue'),
    },
    props: {
      text: { type: String, required: true },
      btnText: { type: String },
      createRoute: { type: [String, Object] },
      unit: { type: String, default: 'รายการ' },
      filters: { type: Array, default: () => [] },
      total: { type: Number },
      hideTotal: { type: Boolean },
      reportApiPath: { type: String, default: '' },
      reportName: { type: String, default: 'รายงาน' },
      exportText: { type: String },
      reportApiPath1: { type: String, default: '' },
      reportName1: { type: String, default: 'รายงาน' },
      exportText1: { type: String },
      reportApiPath2: { type: String, default: '' },
      reportName2: { type: String, default: 'รายงาน' },
      exportText2: { type: String },
      logRoute: { type: Object },
      reportQuery: { type: Object, default: () => {} },
    },
    data () {
      return {
        search: '',
        form: null,
        dialog: false,
        logDialog: false,
      }
    },
    computed: {
      currentFilters () {
        return this.form ? Object.entries(this.form).map(([param, val]) => ({ param, val })).filter(form => this.$route.query?.[form?.param]) : []
      }
    },
    watch: {
      '$route.query' () {
        this.setForm()
      },
      'dialog' (val) {
        this.setForm()
      },
    },
    mounted () {
      this.setForm()
    },
    methods: {
      isCurrentFilters (filter) {
        return this.currentFilters.some(f => f.param === filter.param)
      },
      setValue (param) {
        let val = this.$route.query?.[param]
        const isDate = param?.toLowerCase()?.includes('date')
        const convertArray = () => val.split(',').map(v => v)
        if (isDate) {
          return val ? this.$fn.convertStringToDate(val) : ''
        } else {
          return val ? val.includes(',') ? convertArray() : parseInt(val) || val : null
        }
      },
      setForm () {
        this.form = this.filters.reduce((form, filter) => ({ ...form, [filter.param]: this.setValue(filter.param) }), {})
      },
      onClear () {
        this.$router.push({ query: {} })
        this.dialog = false
      },
      onApply () {
        const query = Object.entries(this.form).reduce((form, [key, val]) => {
          const isDate = key?.toLowerCase()?.includes('date')
          val = isDate && val ? this.$fn.convertDateToString(val).substring(0, 10) : val
          return val ? { ...form, [key]: val } : form
        }, {})
        this.$router.push({ query })
        this.dialog = false
      },
    }
  }
</script>

<style lang="scss">
  .page-header {
    .header-wrapper {
      display: flex;
      justify-content: space-between;
    }

    .filter-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    @media only screen and (max-width: 426px) {
      .header-wrapper {
        flex-flow: column;
        gap: 12px;
      }
    }
  }

  .filter-dialog {
    .v-card {
      padding: 8px;
    }
  }
</style>