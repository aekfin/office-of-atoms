<template>
  <div id="user-page">
    <PageHeader text="บริหารบุคลากร" btnText="เพิ่มบุคลากร" createRoute="/management/user/create/" :filters="filters" :total="total"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading">
      <template #item.order="{ index }">{{ index + 1 }}</template>
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
        search: '',
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
            param: 'position',
            name: 'ตำแหน่ง',
            options: [
              { id: 1, name: 'ตำแหน่ง ก' },
              { id: 2, name: 'ตำแหน่ง ข' },
            ]
          },
          {
            param: 'organization',
            name: 'กอง',
            options: [
              { id: 1, name: 'กอง ก' },
              { id: 2, name: 'กอง ข' },
            ]
          },
          {
            param: 'department',
            name: 'กลุ่ม',
            options: [
              { id: 1, name: 'กลุ่ม ก' },
              { id: 2, name: 'กลุ่ม ข' },
            ]
          }
        ],
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
            const { data } = await this.$store.dispatch('http', { method: 'delete', apiPath: `user/${item.id}` })
            await this.$store.dispatch('snackbar', { text: 'ลบบุคลากรสำเร็จ' })
            await this.getList()
            return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'mdi-pencil', action: `/management/user/${item.id}/` },
          { type: 'confirm', icon: 'mdi-delete', action: () => { this.deleteUser(item) } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #user-page {
  }
</style>