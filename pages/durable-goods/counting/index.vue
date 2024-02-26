<template>
  <div id="durable-goods-counting-detail-page">
    <PageHeader text="การตรวจนับครุภัณฑ์" hideTotal/>
    <div class="mt-10">
      <v-text-field ref="search" v-model="number" label="โปรดใส่ เลขที่ครุภัณฑ์" @change="changeSearch"/>
      <div v-if="errorText" class="d-flex aligns-center" style="color: red;">
        <i class="material-icons" v-text="`error`"/>
        <b class="ml-2">ไม่พบครุภัณฑ์ "{{ errorText }}"</b>
      </div>
      <div class="text-h5 mt-10 mb-5"><b>ครุภัณฑ์ที่ตรวจนับแล้ว</b></div>
      <div class="goods-card-wrapper">
        <div class="mb-3">ทั้งหมด {{ total || 0 }} รายการ</div>
        <CountingDurableTable :items.sync="items" canEdit :paginationIndex="paginationIndex" :isLoading="isLoading" @changeStatus="onChangeStatus"/>
        <Pagination v-if="pagination" :pagination="pagination" :isState="false" @change="onChangePage"/>
      </div>
      <v-expansion-panels v-model="formExpand" class="form-expansion-panels mt-10" flat multiple accordion>
        <v-expansion-panel accordion>
          <v-expansion-panel-header>
            <span>ครุภัณฑ์ที่รอตรวจนับทั้งหมด</span>
            <template #actions>
              <i class="material-icons">keyboard_arrow_down</i>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="mb-3">ทั้งหมด {{ waitingTotal || 0 }} รายการ</div>
            <CountingDurableTable :items="waitingItems" canEdit :paginationIndex="waitingPaginationIndex" :isLoading="isWaitingLoading" @changeStatus="onChangeStatus"/>
            <Pagination v-if="waitingPagination" :pagination="waitingPagination" :isState="false" @change="onChangeWaitingTablePage"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
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
                  <SelectDropdown :value.sync="organizationId" :label="`กอง ${onlyUser ? '' : '*'}`" itemText="ouName" :rules="ouRules" required :disabled="disabled" apiPath="Orgchart/getOrganizations" @select="onSelectOu"/>
                </v-col>
              </v-row>
              <v-row>
                <v-col :cols="12">
                  <SelectDropdown :value.sync="departmentId" :label="`กลุ่ม ${onlyUser ? '' : '*'}`" itemText="departmentName" :rules="departmentRules" required :disabled="disabled" apiPath="Orgchart/getDepartments" @select="onSelectDepartment"/>
                </v-col>
              </v-row>
              <v-row>
                <v-col :cols="12">
                  <v-text-field v-model="location" label="สถานที่ *" :rules="nameRule" required/>
                </v-col>
              </v-row>
            </v-form>
          </div>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer/>
          <v-btn color="grey" text large @click="dialog = false">ยกเลิก</v-btn>
          <v-btn color="success" large @click="onSave(rowData)">{{ title }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      SelectDropdown: () => import('~/components/SelectDropdown.vue'),
    },
    data () {
      return {
        isLoading: false,
        number: null,
        items: [],
        pagination: null,
        paginationIndex: 0,
        total: 0,
        isWaitingLoading: false,
        waitingItems: [],
        waitingPagination: null,
        waitingPaginationIndex: 0,
        waitingTotal: 0,
        errorText: '',
        formExpand: [0, 1],
        form: { name: '' },
        dialog: false,
        organizationId: '',
        departmentId: '',
        location: '',
        rowData: {},
      }
    },
    computed: {
      title () {
        return 'แก้ไข'
      },
      apiPath () {
        return 'equipment/getEquipments/statusAndDepartment?status=NEW&status=RETURNED'
      },
      checkedApiPath () {
        return `equipment/getEquipments/statusAndDepartment?${this.$store.getters.durableGoodCountableQuery}`
      },
    },
    async mounted () {
      await this.$nextTick()
      if (this.$refs.search) this.$refs.search.focus()
      this.getCheckedList()
      this.getUnCheckedList()
    },
    methods: {
      async getCheckedList (query = {}) {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: this.checkedApiPath, query: { ...query, isCheck: true } })
          this.items = data.content
          console.log('this.items ',this.items);
          this.pagination = data
          this.paginationIndex = data.pageable.pageSize * data.number
          this.total = data.totalElements
          this.isLoading = false
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      async getUnCheckedList (query = {}) {
        try {
          this.isWaitingLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: this.apiPath, query: { ...query, isUnCheck: true } })
          this.waitingItems = data.content
          this.waitingPagination = data
          this.waitingPaginationIndex = data.pageable.pageSize * data.number
          this.waitingTotal = data.totalElements
          this.isWaitingLoading = false
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      onChangeWaitingTablePage (number) {
        this.getUnCheckedList({ pageNo: number || 0 })
      },
      onChangePage (number) {
        this.getCheckedList({ pageNo: number || 0 })
      },
      async onChangeStatus (data) {
        
        this.organizationId = data.organization.id
        this.departmentId = data.department.id
        this.location = data.location
        this.dialog = true
        // this.onSave(content)
        this.rowData = data
        
      },
      async changeSearch (val) {
        try {
          if (val) {
            const { data } = await this.$store.dispatch('http', { apiPath: this.apiPath, query: { equipmentNumber: this.number, isUnCheck: true } })
            if (data.content && data.content.length) {
              this.errorText = ''
              this.onSave(data.content[0])
            } else {
              this.errorText = this.number
            }
            this.number = ''
          }
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      async onSave (content) {
         try {
           await this.$store.dispatch('http', { apiPath: 'equipment/checkStock', query: { id: content.id, status: content.status, status_counting: content.status_counting
          , organizationId: this.organizationId, departmentId: this.departmentId, location: this.location} })
           await this.$store.dispatch('snackbar', { text: `ตรวจนับครุภัณฑ์เลขที่ "${content.number}" สำเร็จ` })
           await Promise.all([
             this.getCheckedList(),
             this.getUnCheckedList()
           ])
           this.dialog = false
           return Promise.resolve()
         } catch (err) {
           return Promise.reject(err)
         }
      },
      onSelectOu (data) {
        this.organizationId = data.item.id
      },
      onSelectDepartment (data) {
        this.departmentId = data.item.id
      },
    },
  }
</script>

<style lang="scss">
  #durable-goods-counting-detail-page {
    padding-bottom: 20px;

    .text-body {
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 8px
    }
  }
</style>