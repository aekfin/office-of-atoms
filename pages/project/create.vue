<template>
  <div id="project-create-page">
    <PageHeader text="การเพิ่มโครงการ"/>
    <v-form ref="form" v-model="valid" lazyValidation class="mt-8">
      <v-container>
        <v-row>
          <div class="year-of-budget">
            <v-select v-model="form.year" :items="years" itemValue="id" itemText="name" label="ปีงบประมาณ" required/>
          </div>
          <v-select v-model="form.projectRoot" :items="items" itemValue="id" itemText="name" label="เลือกโครงการงบประมาณ" required :disabled="!form.year"/>
        </v-row>
        <v-row>
          <div class="selector-project">
            <v-select v-model="form.project" :items="items" itemValue="id" itemText="name" label="โครงการ" required :disabled="!form.projectRoot"/>
          </div>
          <v-text-field v-model="form.code" name="code" label="เลขที่โครงการ" disabled/>
          <v-text-field v-model="form.code" name="code" label="เลขที่คุมสัญญา" disabled/>
        </v-row>
        <v-row>
          <InputDatePicker :value.sync="form.datetimeStart" label="วันเริ่มโครงการ" disabled/>
          <InputDatePicker :value.sync="form.datetimeVendorStart" label="วันเริ่มสัญญา" disabled/>
          <InputDatePicker :value.sync="form.datetimeVendorEnd" label="วันสิ้นสัญญา" disabled/>
          <div class="selector-vendor">
            <v-select v-model="form.vendor" :items="items" itemValue="id" itemText="name" label="บริษัทคู่สัญญา" required/>
          </div>
        </v-row>
        <v-row>
          <AttachFileBtn class="mt-12"/>
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
          vendor: null,
          datetimeStart: '',
          datetimeVendorStart: '',
          datetimeVendorEnd: ''
        },
        items: [
          { id: 1, name: 'Foo' },
          { id: 2, name: 'Bar' },
          { id: 3, name: 'Fizz' },
          { id: 4, name: 'Buzz' }
        ],
        years: [
          { id: 1, name: '2022' },
          { id: 2, name: '2021' },
          { id: 3, name: '2020' },
          { id: 4, name: '2019' }
        ],
      }
    }
  }
</script>

<style lang="scss">
  #project-create-page {
    .row {
      justify-content: space-between;
      gap: 40px;

      .selector-project {
        width: 50%;
      }

      .year-of-budget {
        width: 200px;
      }

      .selector-vendor {
        flex-grow: 1;
      }
    }
  }
</style>