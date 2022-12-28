<template>
  <div id="user-page">
    <PageHeader text="บริหารบุคลากร" btnText="เพิ่มบุคลากร" createRoute="/management/user/create/" :filters="filters"/>
    <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="elevation-1 mt-6">
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
        search: '',
        headers: [
          { text: 'รหัสพนักงาน', value: 'code', align: 'center' },
          { text: 'ชื่อ', value: 'fistName', width: '16%' },
          { text: 'นามสกุล', value: 'lastName', width: '20%' },
          { text: 'ตำแหน่ง', value: 'position', align: 'center' },
          { text: 'กอง', value: 'division', align: 'center' },
          { text: 'กลุ่ม', value: 'group', align: 'center' },
          { text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' },
        ],
        items: [
          {
            id: 1,
            code: '6500000001',
            fistName: 'นาย ก',
            lastName: 'บริษัท A',
            position: 'ตำแหน่ง ก',
            division: 'กอง ก',
            group: 'กลุ่ม ก'
          },
        ],
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
            param: 'division',
            name: 'กอง',
            options: [
              { id: 1, name: 'กอง ก' },
              { id: 2, name: 'กอง ข' },
            ]
          },
          {
            param: 'group',
            name: 'กลุ่ม',
            options: [
              { id: 1, name: 'กลุ่ม ก' },
              { id: 2, name: 'กลุ่ม ข' },
            ]
          }
        ],
      }
    },
    methods: {
      getActionIconList (item) {
        return [
          { type: 'link', icon: 'mdi-pencil', action: `/management/user/${item.id}/` },
          { type: 'confirm', icon: 'mdi-delete', action: () => { console.log('Confirm') } },
        ]
      }
    }
  }
</script>

<style lang="scss">
  #user-page {
  }
</style>