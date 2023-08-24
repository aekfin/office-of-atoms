<template>
  <div id="department-page">
    <PageHeader text="บริหารกลุ่ม" hideTotal btnText="เพิ่มกลุ่ม" @create="onCreate"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="Infinity" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading">
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" width="720" contentClass="type-parcel-dialog">
      <v-card>
        <v-card-title class="text-h5 justify-space-between">
          <div>{{ title }}</div>
          <v-btn icon @click="dialog = false">
            <i class="material-icons">close</i>
          </v-btn>
        </v-card-title>
        <v-card-text class="black--text">
          <div class="mt-3">
            <v-form ref="form" v-model="valid" lazyValidation>
              <v-row>
                <v-col :cols="12">
                  <v-text-field v-model="form.name" label="ชื่อกลุ่ม *" :rules="nameRule" required/>
                </v-col>
              </v-row>
            </v-form>
          </div>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer/>
          <v-btn color="grey" text large @click="dialog = false">ยกเลิก</v-btn>
          <v-btn color="success" large @click="onSubmit">{{ title }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
    },
    data () {
      return {
        isLoading: true,
        count: 0,
        total: 0,
        items: [],
        dialog: false,
        form: { name: '' },
        isCreate: true,
        valid: false,
        headers: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'ชื่อกอง', value: 'departmentName' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        nameRule: [
          v => !!v || 'โปรดใส่ชื่อกลุ่ม',
        ],
      }
    },
    computed: {
      title () {
        return this.isCreate ? 'เพิ่มกลุ่ม' : 'แก้ไขกลุ่ม'
      },
    },
    watch: {
      '$route.query' () {
        this.getList()
      }
    },
    mounted () {
      this.getList()
    },
    methods: {
      async getList () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: 'Orgchart/getDepartments', query: this.$route.query })
          this.items = data
          this.count = data.length
          this.total = data.length
          this.$store.commit('SET_STATE', { name: 'paginationIndex', val: 0 })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'btn', icon: 'edit', action: () => { this.onEdit(item) } },
        ]
      },
      onCreate () {
        this.isCreate = true
        this.form = { name: '' }
        this.dialog = true
      },
      onEdit (item) {
        this.isCreate = false
        this.form = { id: item.id, name: item.departmentName }
        this.dialog = true
      },
      async onSubmit () {
        const valid = this.$refs.form.validate()
        if (valid) {
          try {
            if (this.isCreate) {
              await this.$store.dispatch('http', { method: 'post', apiPath: 'Orgchart/addDepartments', data: { names: [this.form.name] } })
            } else {
              await this.$store.dispatch('http', { method: 'patch', apiPath: `Orgchart/editDepartment/${this.form.id}`, query: { newName: this.form.name } })
            }
            await this.$store.dispatch('snackbar', { text: `${this.title}สำเร็จ` })
            this.dialog = false
            await this.getList()
            return Promise.resolve()
          } catch (err) {
            return Promise.reject(err)
          }
        }

      },
    },
  }
</script>

<style lang="scss">
  #department-page {
  }
</style>