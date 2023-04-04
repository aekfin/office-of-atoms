<template>
  <div id="durable-goods-counting-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มการตรวจนับครุภัณฑ์' : 'การแก้ไขการตรวจนับครุภัณฑ์'" hideTotal/>
    <div class="mt-10">
      <v-text-field ref="search" v-model="number" label="ค้นหาด้วย เลขที่ครุภัณฑ์" @change="changeSearch"/>
      <div v-if="errorText" class="d-flex aligns-center" style="color: red;">
        <i class="material-icons" v-text="`error`"/>
        <b class="ml-2">ไม่พบครุภัณฑ์ "{{ errorText }}"</b>
      </div>
      <div class="text-h5 mt-5 mb-5"><b>ตารางตรวจนับครุภัณฑ์</b></div>
      <div class="goods-card-wrapper">
        <v-data-table :headers="headers" :items="items" :itemsPerPage="Infinity" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading">
          <template #item.majorCategory="{ item }">
            <EquipmentColumn :item="item"/>
          </template>
          <template #item.organization="{ item }">
            <OwnerColumn :item="item"/>
          </template>
          <template #item.status="{ index }">
          <v-select v-model="items[index].status" :items="statusList" itemText="name" itemValue="id" appendIcon="keyboard_arrow_down">
              <template #selection="{ item }">
                <span class="d-flex justify-center" style="width: 100%;">{{ item.name }}</span>
              </template>
            </v-select>
          </template>
          <template #item.action="item">
            <ActionIconList :list="getActionIconList(item)"/>
          </template>
        </v-data-table>
      </div>
      <v-container class="mt-10">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/durable-goods/counting/')">ย้อนกลับ</v-btn>
          <v-btn class="ml-4" elevation="2" large color="success" @click="onSubmit">{{ 'ยืนยัน' }}</v-btn>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      EquipmentColumn: () => import('~/components/EquipmentColumn.vue'),
      OwnerColumn: () => import('~/components/OwnerColumn.vue'),
    },
    data () {
      return {
        isLoading: false,
        number: null,
        items: [],
        headers: [
          { text: 'เลขที่ครุภัณฑ์', value: 'number', width: '128px', align: 'center' },
          { text: 'ชื่อครุภัณฑ์', value: 'name' },
          { text: 'หมวดหมู่', value: 'majorCategory', width: '120px', align: 'center' },
          { text: 'ผู้ครอบครอง', value: 'organization', width: '120px', align: 'center' },
          { text: 'สถานะ', value: 'status', width: '200px', align: 'center' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        errorText: '',
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.counting_id === 'create'
      },
      statusList () {
        const statusList = this.$store.state.durableGoodStatus
        return Object.keys(statusList).map(key => ({ id: key, name: statusList[key] }))
      },
    },
    async mounted () {
      await this.$nextTick()
      if (this.$refs.search) this.$refs.search.focus()
    },
    methods: {
      removeDurableGoods (i) {
        this.items.splice(i, 1)
      },
      getActionIconList ({ index }) {
        return [
          { type: 'button', icon: 'delete', action: () => { this.removeDurableGoods(index) } },
        ]
      },
      async changeSearch (val) {
        try {
          const { data } = await this.$store.dispatch('http', { apiPath: 'equipment/getEquipments/statusAndDepartment?status=NEW&status=RETURNED', query: { equipmentNumber: this.number } })
          if (data.content && data.content.length) {
            this.items = [...this.items, data.content[0]]
            this.errorText = ''
          } else {
            this.errorText = this.number
          }
          this.number = ''
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      onSubmit () {
      }
    },
  }
</script>

<style lang="scss">
  #durable-goods-counting-detail-page {
    .text-body {
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 8px
    }
  }
</style>