<template>
  <div id="user-page">
    <PageHeader text="บริหารบุคลากร" btnText="เพิ่มบุคลากร" createRoute="/management/user/create/" :total="total" :filters="filters"  unit="คน"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" 
      disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading"
     >
      
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
        headers: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'รหัสพนักงาน', value: 'employeeId' },
          { text: 'ชื่อ', value: 'thaiFristName' },
          { text: 'นามสกุล', value: 'thaiLastName' },
          { text: 'E-Mail', value: 'email' },
          { text: 'เบอร์โทร', value: 'phone', align: 'center', width: '160px' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        items: [],
        filters: [
          {
            type: 'textField',
            param: 'thaiFristName',
            name: 'ชื่อ',
           
          },
          {
            type: 'textField',
            param: 'thaiLastName',
            name: 'นามสกุล'
          },
          {
            type: 'textField',
            param: 'employeeId',
            name: 'รหัสพนักงาน',
           
          },
          {
            type: 'textField',
            param: 'email',
            name: 'E-Mail',
           
          }
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
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'user/listUsers', query: this.$route.query, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async deleteUser (item) {
        try {
            const { data } = await this.$store.dispatch('http', { apiPath: `user/delete/${item.id}` })
            if (data?.status?.code == 400) this.errorDialog = true
            else await this.$store.dispatch('snackbar', { text: 'ลบบุคลากรสำเร็จ' })
            await this.getList()
            return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'edit', action: `/management/user/${item.id}/` },
          { type: 'confirm', icon: 'delete', action: () => { this.deleteUser(item) } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #user-page {
  }
</style>