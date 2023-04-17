<template>
  <div id="durable-goods-counting-detail-page">
    <PageHeader text="การตรวจนับครุภัณฑ์" hideTotal/>
    <div class="mt-10">
      <v-text-field ref="search" v-model="number" label="ค้นหาด้วย เลขที่ครุภัณฑ์" @change="changeSearch"/>
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
            <CountingDurableTable :items="waitingItems" :paginationIndex="waitingPaginationIndex" :isLoading="isWaitingLoading"/>
            <Pagination v-if="waitingPagination" :pagination="waitingPagination" :isState="false" @change="onChangeWaitingTablePage"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
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
      }
    },
    computed: {
      apiPath () {
        return 'equipment/getEquipments/statusAndDepartment?status=NEW&status=RETURNED'
      },
      checkedApiPath () {
        return 'equipment/getEquipments/statusAndDepartment?status=NEW&status=RETURNED&status=WAIT_SALE&status=LOST'
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
      async onChangeStatus (content) {
        this.onSave(content)
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
          await this.$store.dispatch('http', { apiPath: 'equipment/checkStock', query: { id: content.id, status: content.status } })
          await this.$store.dispatch('snackbar', { text: `ตรวจนับครุภัณฑ์เลขที่ "${content.number}" สำเร็จ` })
          await Promise.all([
            this.getCheckedList(),
            this.getUnCheckedList()
          ])
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
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