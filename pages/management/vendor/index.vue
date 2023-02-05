<template>
  <div id="vendor-page">
    <PageHeader text="บริหารคู่สัญญา" btnText="เพิ่มคู่สัญญา" createRoute="/management/vendor/create/" :total="total"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading">
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      ActionIconList: () => import('~/components/ActionIconList.vue'),
    },
    data () {
      return {
        isLoading: true,
        count: 0,
        total: 0,
        headers: [
          { text: 'รหัสบริษัท', value: 'companyNumber', align: 'center', width: '200px' },
          { text: 'ชื่อบริษัท', value: 'companyName' },
          { text: 'ที่อยู่บริษัท', value: 'companyAddress', width: '240px' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        items: [
          {
            id: 1,
            code: '6500000001',
            name: 'นาย ก',
            address: '11/22 คอนโด A'
          },
        ],
      }
    },
    head () {
      return {
        title: 'บริหารบุคลากร'
      }
    },
    mounted () {
      this.getList()
    },
    methods: {
      async getList () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: 'Project/getListCompany' })
          this.items = data.content
          this.total = data.numberOfElements
          this.count = data.content.length
          this.isLoading = false
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'mdi-pencil', action: `/management/vendor/${item.id}/` },
          { type: 'confirm', icon: 'mdi-delete', action: () => { console.log('Confirm') } },
        ]
      },
    },
  }
</script>

<style lang="scss">
  #vendor-page {
  }
</style>