<template>
  <div class="page-header">
    <div class="header-wrapper">
      <h2 class="text-h4">
        <b>
          <slot>{{ text }}</slot>
        </b>
      </h2>
      <slot name="btn">
        <v-btn v-if="btnText" elevation="2" large color="success" @click="$emit('create')">
          <NLink v-if="createRoute" :to="createRoute" class="text-white">{{ btnText }}</NLink>
          <div v-else>{{ btnText }}</div>
        </v-btn>
      </slot>
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
      <ExportReportButton v-if="reportApiPath" :apiPath="reportApiPath" :name="reportName"/>
    </div>
    <v-dialog v-model="dialog" width="800" contentClass="filter-dialog">
      <v-card>
        <v-card-title>
          <div class="d-flex w-full justify-space-between">
            <h3 class="text-2xl font-bold">กรองข้อมูลด้วย</h3>
            <v-btn icon @click="dialog = false"><i class="material-icons">close</i></v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" class="mt-5">
            <v-container class="pt-0 pb-0">
              <v-row>
                <v-col v-for="filter in filters" :key="filter.param" class="pt-0 pb-0" :cols="12" :md="filter.md || 6">
                  <template v-if="form">
                    <v-text-field v-if="filter.type === 'textField'" :label="filter.name" v-model="form[filter.param]"/>
                    <v-switch v-if="filter.type === 'switch'" :label="filter.name" v-model="form[filter.param]"/>
                    <div v-else-if="filter.type === 'space'"/>
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
  </div>
</template>

<script>
  export default {
    component: {
      SelectDropdown: () => import('~/components/SelectDropdown.vue'),
      ExportReportButton: () => import('~/components/ExportReportButton.vue'),
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
    },
    data () {
      return {
        search: '',
        form: null,
        dialog: false,
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
        const val = this.$route.query?.[param]
        const convertArray = () => val.split(',').map(v => v)
        return val ? val.includes(',') ? convertArray() : parseInt(val) || val : null
      },
      setForm () {
        this.form = this.filters.reduce((form, filter) => ({ ...form, [filter.param]: this.setValue(filter.param) }), {})
      },
      onClear () {
        this.$router.push({ query: {} })
        this.dialog = false
      },
      onApply () {
        const query = Object.entries(this.form).reduce((form, [key, val]) => val ? { ...form, [key]: val } : form, {})
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