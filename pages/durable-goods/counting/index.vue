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
        <CountingDurableTable :items.sync="items" @changeStatus="onChangeStatus"/>
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
            <div class="mb-3">ทั้งหมด {{ total || 0 }} รายการ</div>
            <CountingDurableTable :items="waitingItems"/>
            <!-- <Pagination/> -->
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
        waitingItems: [],
        total: 0,
        errorText: '',
        formExpand: [0, 1],
      }
    },
    async mounted () {
      await this.$nextTick()
      if (this.$refs.search) this.$refs.search.focus()
    },
    methods: {
      async onChangeStatus (content) {
        this.onSave(content)
      },
      async changeSearch (val) {
        try {
          const { data } = await this.$store.dispatch('http', { apiPath: 'equipment/getEquipments/statusAndDepartment?status=NEW&status=RETURNED', query: { equipmentNumber: this.number } })
          if (data.content && data.content.length) {
            this.items = [...this.items, data.content[0]]
            this.errorText = ''
            this.onSave(data.content[0])
          } else {
            this.errorText = this.number
          }
          this.number = ''
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      async onSave (content) {
        await this.$store.dispatch('snackbar', { text: `ตรวจนับครุภัณฑ์เลขที่ "${content.number}" สำเร็จ` })
      }
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