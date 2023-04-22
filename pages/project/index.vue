<template>
  <div id="project-page">
    <PageHeader text="โครงการ" btnText="เพิ่มโครงการ" createRoute="/project/create/" :total="total" unit="โครงการ"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading">
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
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      ActionIconList: () => import('~/components/ActionIconList.vue'),
      Pagination: () => import('~/components/Pagination.vue'),
    },
    data () {
      return {
        isLoading: true,
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'Project/getListProject', query: { ...this.$route.query }, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async removeProject (item) {
        try {
          await this.$store.dispatch('http', { method: 'delete', apiPath: `Project/${item.id}` })
          await this.$store.dispatch('snackbar', { text: 'ลบโครงการสำเร็จ' })
          await this.getList()
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'edit', action: `/project/${item.id}/` },
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