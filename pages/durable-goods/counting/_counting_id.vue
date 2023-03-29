<template>
  <div id="durable-goods-counting-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มการตรวจนับครุภัณฑ์' : 'การแก้ไขการตรวจนับครุภัณฑ์'" hideTotal/>
    <v-form ref="form" v-model="valid" lazyValidation class="mt-10">
      <v-autocomplete ref="search" v-model="form.number" label="ค้นหาด้วย เลขที่ครุภัณฑ์ / เลขที่สินทรัพย์ / เลขที่สินทรัพย์ อว."/>
      <div class="text-h5 mt-5 mb-5"><b>ตารางตรวจนับครุภัณฑ์</b></div>
      <div class="goods-card-wrapper">
        <v-data-table :headers="headers" :items="form.items" :itemsPerPage="Infinity" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading">
          <template #item.majorCategory>
            <!-- <EquipmentColumn :item="item"/> -->
            <i class="material-icons">info_outline</i>
          </template>
          <template #item.organization>
            <!-- <OwnerColumn :item="item"/> -->
            <i class="material-icons">info_outline</i>
          </template>
          <template #item.status="{ index }">
          <v-select v-model="form.items[index].status" :items="statusList" itemText="name" itemValue="id" appendIcon="keyboard_arrow_down">
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
    </v-form>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      // EquipmentColumn: () => import('~/components/EquipmentColumn.vue'),
      // OwnerColumn: () => import('~/components/OwnerColumn.vue'),
    },
    data () {
      return {
        isLoading: false,
        valid: true,
        form: {
          number: null,
          items: [
            { name: 'คอมพิวเตอร์ MC', status: 1 },
            { name: 'Dom', status: 1 },
            { name: 'Bob', status: 1 },
          ],
        },
        statusList: [
          { id: 1, name: 'ปกติ' },
          { id: 2, name: 'ชำรุด' },
        ],
        headers: [
          { text: 'ชื่อครุภัณฑ์', value: 'name' },
          { text: 'หมวดหมู่', value: 'majorCategory', width: '120px', align: 'center' },
          { text: 'ผู้ครอบครอง', value: 'organization', width: '120px', align: 'center' },
          { text: 'สถานะ', value: 'status', width: '200px', align: 'center' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.counting_id === 'create'
      },
    },
    async mounted () {
      await this.$nextTick()
      if (this.$refs.search) this.$refs.search.focus()
    },
    methods: {
      removeDurableGoods (i) {
        this.form.items.splice(i, 1)
      },
      getActionIconList ({ index }) {
        return [
          { type: 'button', icon: 'delete', action: () => { this.removeDurableGoods(index) } },
        ]
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