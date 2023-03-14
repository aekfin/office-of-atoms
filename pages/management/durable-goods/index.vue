<template>
  <div id="durable-goods-page">
    <PageHeader text="ค่าเริ่มต้นครุภัณฑ์" btnText="เพิ่มค่าเริ่มต้นครุภัณฑ์" createRoute="/management/durable-goods/create/" :total="total"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading" :total="total">
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.price="{ item }">{{ $fn.getPrice(item.price) }}</template>
      <template #item.majorCategory="{ item }">
        <EquipmentColumn :item="item"/>
      </template>
      <template #item.organization.ouName="{ item }">
        <v-menu open-on-hover top offset-y>
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" icon v-on="on">
              <v-icon>mdi-information-outline</v-icon>
            </v-btn>
          </template>
          <v-list class="goods-list">
            <v-list-item>
              <v-list-item-title>กอง : <b>{{ item.organization.ouName }}</b></v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>กลุ่ม : <b>{{ item.department.departmentName }}</b></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template #item.status="{ item }">
        <v-chip :color="$store.state.durableGoodStatusColor[item.status]">{{ $store.state.durableGoodStatus[item.status] }}</v-chip>
      </template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
    <Pagination/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      ActionIconList: () => import('~/components/ActionIconList.vue'),
      EquipmentColumn: () => import('~/components/EquipmentColumn.vue'),
      Pagination: () => import('~/components/Pagination.vue'),
    },
    data () {
      return {
        isLoading: true,
        count: 0,
        total: 0,
        items: [],
        headers: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'เลขที่ครุภัณฑ์', value: 'number', width: '160px', align: 'center' },
          { text: 'ชื่อครุภัณฑ์', value: 'name' },
          { text: 'หมวดหมู่', value: 'majorCategory', width: '160px', align: 'center' },
          { text: 'ราคากลาง', value: 'price', align: 'center', width: '120px' },
          { text: 'ผู้ครอบครอง', value: 'organization.ouName', width: '160px', align: 'center' },
          { text: 'สถานะ', value: 'status', align: 'center', width: '100px' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
      }
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'equipment/getEquipments', query: this.$route.query, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'mdi-pencil', action: `/management/durable-goods/${item.id}/` },
          // { type: 'confirm', icon: 'mdi-delete', action: () => { console.log('Confirm') } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #durable-goods-page {
  }

  .goods-list.v-list {
    .v-list-item {
      min-height: 36px;
    }
  }
</style>