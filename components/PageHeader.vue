<template>
  <div class="page-header">
    <div class="d-flex justify-space-between">
      <h2 class="text-h4">
        <b>
          <slot>{{ text }}</slot>
        </b>
      </h2>
      <slot v-if="btnText" name="btn">
        <v-btn elevation="2" large color="success" @click="$emit('create')">
          <NLink v-if="createRoute" :to="createRoute" class="text-white">{{ btnText }}</NLink>
          <div v-else>{{ btnText }}</div>
        </v-btn>
      </slot>
    </div>
    <div v-if="!hideTotal" class="mt-4">ทั้งหมด {{ total || 0 }} {{ unit }}</div>
    <div v-if="filters.length" class="filter-wrapper">
      <div class="filter-results">
        <div v-if="currentFilters.length">กรองโดย:</div>
        <v-chip v-for="current in currentFilters" :key="current.param" close @click:close="onClearFilter(current)">{{ getFilterLabel(current) }}</v-chip>
      </div>
      <div class="btn-wrapper">
        <v-btn elevation="2" large outlined @click="dialog = !dialog">
          <v-icon>mdi-filter-outline</v-icon>
          <div>กรองข้อมูล</div>
        </v-btn>
      </div>
    </div>
    <v-dialog v-model="dialog" width="800" contentClass="filter-dialog">
      <v-card>
        <v-card-title>
          <div class="d-flex w-full justify-space-between">
            <h3 class="text-2xl font-bold">กรองข้อมูลด้วย</h3>
            <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" class="mt-5">
            <v-container>
              <v-row v-for="filter in filters" :key="filter.param">
                <template v-if="form">
                  <v-select v-model="form[filter.param]" :items="filter.options" itemValue="id" itemText="name" :label="filter.name"/>
                </template>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <div class="d-flex justify-end w-full">
            <v-btn plain @click="dialog = false">ยกเลิก</v-btn>
            <v-btn depressed color="secondary" @click="onApply">นำมาใช้</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      text: { type: String, required: true },
      btnText: { type: String },
      createRoute: { type: [String, Object] },
      unit: { type: String, default: 'ชิ้น' },
      filters: { type: Array, default: () => [] },
      total: { type: Number },
      hideTotal: { type: Boolean },
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
        return this.form ? Object.entries(this.form).map(([param, val]) => ({ param, val })).filter(form => form?.val) : []
      }
    },
    mounted () {
      this.setForm()
    },
    methods: {
      setValue (param) {
        const val = this.$route.query?.[param]
        const convertArray = () => val.split(',').map(v => parseInt(v))
        return val ? val.includes(',') ? convertArray() : parseInt(val) : null
      },
      setForm () {
        this.form = this.filters.reduce((form, filter) => ({ ...form, [filter.param]: this.setValue(filter.param) }), {})
      },
      getFilterLabel (current) {
        const filter = this.filters.find(filter => filter.param === current.param)
        const val = filter.options.find(option => `${option.id}` === `${current.val}`)
        return `${filter.name}: ${val.name}`
      },
      onClearFilter (current) {
        const query = { ...this.$route.query }
        if (query[current.param]) {
          this.form[current.param] = null
          delete query[current.param]
        }
        this.$router.push({ query })
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
    .filter-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;

      .filter-results {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }
    }
  }

  .filter-dialog {
    .v-card {
      padding: 8px;
    }
  }
</style>