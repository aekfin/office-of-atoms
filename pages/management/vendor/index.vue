<template>
  <div id="vendor-page">
    <PageHeader text="บริหารคู่สัญญา" btnText="เพิ่มคู่สัญญา" createRoute="/management/vendor/create/" :total="total" :filters="filters" unit="คู่สัญญา"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading"  >
     
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
    <Pagination/>
    <ConfirmDialog :value.sync="errorDialog" title="แจ้งเตือน" text="ไม่สามารถลบบุคลากรได้ เนื่องจากมีการใช้บุคลากรนี้ไปแล้ว" hideSubmit closeText="รับทราบ"/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      ActionIconList: () => import('~/components/ActionIconList.vue'),
      Pagination: () => import('~/components/Pagination.vue'),
      ConfirmDialog: () => import('~/components/ConfirmDialog.vue'),
    },
    data () {
      return {
        isLoading: true,
        count: 0,
        total: 0,
        search: '',
        headers: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'รหัสบริษัท', value: 'companyNumber', align: 'center', width: '200px' },
          { text: 'ชื่อบริษัท', value: 'companyName' },
          { text: 'ที่อยู่บริษัท', value: 'companyAddress', width: '240px' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        items: [],
        filters: [
          {
            type: 'textField',
            param: 'companyName',
            name: 'ชื่อบริษัท',
          },
          {
            type: 'textField',
            param: 'companyAddress',
            name: 'ที่อยู่บริษัท'
          },
          {
            type: 'textField',
            param: 'companyNumber',
            name: 'รหัสบริษัท',
           
          }
        ],
      }
    },
    head () {
      return {
        title: 'บริหารบุคลากร'
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'Project/getListCompany', query: this.$route.query, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async deleteUser (item) {
        try {
            const { data } = await this.$store.dispatch('http', { apiPath: `Project/delete/company/${item.id}` })
            if (data?.status?.code == 400) this.errorDialog = true
            else await this.$store.dispatch('snackbar', { text: 'ลบบุคลากรสำเร็จ' })
            await this.getList()
            return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'edit', action: `/management/vendor/${item.id}/` },
          { type: 'confirm', icon: 'delete', action: () => { this.deleteUser(item) } },
        ]
      },
    },
  }
</script>

<style lang="scss">
  #vendor-page {
  }
</style>