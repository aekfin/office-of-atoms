<template>
  <div id="durable-goods-summary-page">
    <PageHeader class="mb-6" text="ครุภัณฑ์ทั้งหมด" :total="total"/>
    <v-btn v-if="selectorListObject.length" class="d-flex align-center mb-3" outlined elevation="2" color="black" @click="onExportQRCode">
      <i class="material-icons">qr_code_2</i>
      <div class="ml-1">QR Code ({{ selectorListObject.length }})</div>
    </v-btn>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1" :loading="isLoading">
      <template #header.order>
        <div class="d-flex align-center">
          <i :key="refreshKey" class="material-icons pointer" @click="onSelectAll" v-html="isSelectAll ? 'check_box' : isIndeterminate ? 'indeterminate_check_box' : 'check_box_outline_blank'"/>
          <div class="ml-2">ลำดับ</div>
        </div>
      </template>
      <template #item.order="{ index }">
        <div class="d-flex align-center">
          <i :key="refreshKey" class="material-icons pointer " @click="onSelect(index)" v-html="selectorList[index] ? 'check_box' : 'check_box_outline_blank'"/>
          <div class="ml-3">{{ $store.state.paginationIndex + index + 1 }}</div>
        </div>
      </template>
      <template #item.price="{ item }">{{ $fn.getPrice(item.price) }}</template>
      <template #item.majorCategory="{ item }">
        <EquipmentColumn :item="item"/>
      </template>
      <template #item.organization.ouName="{ item }">
        <OwnerColumn :item="item"/>
      </template>
      <template #item.status="{ item }">
        <v-chip :color="$store.state.durableGoodStatusColor[item.status]">{{ $store.state.durableGoodStatus[item.status] }}</v-chip>
      </template>
      <template #item.subEquipments="{ item }">
        <SubEquipmentColumn :item="item"/>
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
      EquipmentColumn: () => import('~/components/EquipmentColumn.vue'),
      OwnerColumn: () => import('~/components/OwnerColumn.vue'),
      SubEquipmentColumn: () => import('~/components/SubEquipmentColumn.vue'),
      Pagination: () => import('~/components/Pagination.vue'),
    },
    data () {
      return {
        isLoading: true,
        count: 0,
        total: 0,
        items: [],
        originalHeaders: [
          { text: 'ลำดับ', value: 'order', width: '120px', align: 'center' },
          { text: 'เลขที่ครุภัณฑ์', value: 'number', width: '160px', align: 'center' },
          { text: 'ชื่อครุภัณฑ์', value: 'name' },
          { text: 'หมวดหมู่', value: 'majorCategory', width: '160px', align: 'center' },
          { text: 'ราคากลาง', value: 'price', align: 'center', width: '120px' },
          { text: 'ผู้ครอบครอง', value: 'organization.ouName', width: '120px', align: 'center' },
          { text: 'ครุภัณฑ์ย่อย', value: 'subEquipments', width: '120px', align: 'center' },
          { text: 'สถานะ', value: 'status', align: 'center', width: '160px' },
        ],
        headers: [],
        selectorList: [],
        refreshKey: false,
        isSelectAll: false,
        isIndeterminate: false,
        selectorListObject: [],
      }
    },
    watch: {
      '$route.query' () {
        this.getList()
      },
      '$store.getters.isTreasury' () {
        this.setHeader()
      },
    },
    mounted () {
      this.getList()
      this.setHeader()
    },
    methods: {
      async getList () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'equipment/getEquipments', query: this.$route.query, context: this })
          this.selectorList = this.items?.map(item => false) || []
          this.setAllCheckbox()
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      setAllCheckbox () {
        this.isSelectAll = this.selectorList.every(item => item)
        this.isIndeterminate = this.selectorList.some(item => item)
        this.selectorListObject = this.items.filter((item, i) => this.selectorList[i])
      },
      onSelect (index) {
        this.selectorList[index] = !this.selectorList[index]
        this.setAllCheckbox()
        this.refreshKey = !this.refreshKey
      },
      onSelectAll () {
        const val = !this.isSelectAll
        this.selectorList = this.selectorList.map(c => val)
        this.setAllCheckbox()
      },
      setHeader () {
        this.headers = this.originalHeaders
        this.headers.push({ text: 'เครื่องมือ', value: 'action', width: '120px', align: 'center' })
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'edit', action: `/durable-goods/summary/${item.id}/` },
          // { type: 'confirm', icon: 'delete', action: () => { console.log('Confirm') } },
        ]
      },
      async onExportQRCode () {
        try {
          const ids = this.selectorListObject.map(item => item.id)
          const { data } = await this.$store.dispatch('http', { method: 'post', apiPath: 'equipment/getEquipmentPdfForQrCode', data: { ids } })
          var win = window.open()
          win.document.write(`<iframe src="${data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`)
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
    }
  }
</script>

<style lang="scss">
  #durable-goods-summary-page {
    .material-icons {
      user-select: none;
    }
  }
</style>