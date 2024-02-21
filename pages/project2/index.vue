<template>
  <div id="project-page">
    <PageHeader text="โครงการ" btnText="เพิ่มโครงการ" createRoute="/project/create/" :total="total" :filters="filters" unit="โครงการ"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter 
    class="elevation-1 mt-6" :loading="isLoading"  >
     
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.projectStartDate="{ item }">
        {{ $fn.displayDate(item.projectStartDate) }}
      </template>
      <template #item.contractStartDate="{ item }">
        {{ $fn.displayDate(item.contractStartDate) }}
      </template>
      <template #item.action="{ item }">
        <ActionIconList :list="getActionIconList(item)"/>
      </template>
    </v-data-table>
    <Pagination/>
    <ConfirmDialog :value.sync="errorDialog" title="แจ้งเตือน" text="ไม่สามารถลบโครงการได้ เนื่องจากมีการใช้โครงการนี้ไปแล้ว" hideSubmit closeText="รับทราบ"/>
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
        errorDialog: false,
        count: 0,
        total: 0,
        headers: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'เลขที่โครงการ', value: 'projectNumber', width: '140px', align: 'center' },
          { text: 'ชื่อโครงการ', value: 'projectName', width: '28%' },
          { text: 'เลขที่สัญญา', value: 'contractNumber', align: 'center' },
          { text: 'วันเริ่มโครงการ', value: 'projectStartDate', width: '140px', align: 'center' },
          { text: 'วันเริ่มสัญญา', value: 'contractStartDate', width: '140px', align: 'center' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        items: [],
        filters: [
          // {
          //   type: 'textField',
          //   name: 'เลขที่โครงการ',
          //   param: 'projectNumber',
          // },
          {
            type: 'textField',
            name: 'ชื่อโครงการ',
            param: 'projectName',
          },
          {
            type: 'textField',
            name: 'เลขที่สัญญา',
            param: 'contractNumber',
          },
          {
            type: 'textField',
            name: 'ปีงบประมาณ',
            param: 'year',
          },
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

          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'Project/getListProject', query: { ...this.$route.query, pageSize: 10, expiringSoon: true,depositRefunds: false}, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async removeProject (item) {
        try {
          const { data } = await this.$store.dispatch('http', { apiPath: `Project/delete/${item.id}` })
          if (data?.status?.code == 400) this.errorDialog = true
          else await this.$store.dispatch('snackbar', { text: 'ลบโครงการสำเร็จ' })
          await this.getList()
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'edit', action: `/project2/${item.id}/` },
          // { type: 'confirm', icon: 'delete', action: () => { this.removeProject(item) } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #project-page {
  }
</style>