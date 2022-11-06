<template>
  <VApp>
    <VNavigationDrawer v-model="drawer" clipped fixed app>
      <VList>
        <VListItem v-for="(menu, i) in leftMenus" :key="i" :to="menu.hasChild ? '' : menu.to" router exact>
          <VListItemContent :class="menu.parent ? 'ml-7' : ''">
            <VListItemTitle>{{ menu.title }}</VListItemTitle>
          </VListItemContent>
        </VListItem>
      </VList>
    </VNavigationDrawer>
    <VAppBar clippedLeft fixed app>
      <VAppBarNavIcon @click.stop="drawer = !drawer"/>
      <VToolbarTitle v-text="title" />
      <VSpacer/>
    </VAppBar>
    <VMain>
      <VContainer>
        <Nuxt/>
      </VContainer>
    </VMain>
    <VFooter absolute app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </VFooter>
  </VApp>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      drawer: true,
      leftMenus: [
        {
          id: 1,
          title: 'หนักหลัก',
          to: '/'
        },
        {
          id: 2,
          title: 'โครงการ',
          to: '/project/'
        },
        {
          id: 3,
          title: 'พัสดุ-ครุภัณฑ์',
          to: '/goods/',
          hasChild: true
        },
        {
          id: 4,
          title: 'บริหารพัสดุ-ครุภัณฑ์',
          to: '/goods/',
          parent: 3
        },
        {
          id: 5,
          title: 'เบิกพัสดุ',
          to: '/goods/withdraw/',
          parent: 3
        },
        {
          id: 6,
          title: 'ยืม-คืน ครุภัณฑ์',
          to: '/goods/borrow/',
          parent: 3
        },
        {
          id: 7,
          title: 'ตรวจนับ ครุภัณฑ์',
          to: '/goods/count/',
          parent: 3
        },
        {
          id: 8,
          title: 'ผู้ดูแลระบบ',
          to: '/management/',
          hasChild: true
        },
        {
          id: 9,
          title: 'บริหารขั้นตอนอนุมัติ',
          to: '/management/approval/',
          parent: 8
        },
        {
          id: 10,
          title: 'บริหารบุคลากร',
          to: '/management/staff/',
          parent: 8
        },
        {
          id: 11,
          title: 'บริหารผู้ใช้ระบบ',
          to: '/management/user/',
          parent: 8
        },
        {
          id: 12,
          title: 'ค่าเริ่มต้น พัสดุ-ครุภัณฑ์',
          to: '/management/goods/',
          parent: 8
        },
        {
          id: 13,
          title: 'บริหารคู่สัญญา',
          to: '/management/vendor/',
          parent: 8
        },
        {
          id: 14,
          title: 'รายงานการใช้งานระบบ',
          to: '/management/report/',
          parent: 8
        }
      ]
    }
  },
  computed: {
    title () {
      return 'ระบบบริหารจัดการครุภัณฑ์ทางอิเลกทรอนิกส์'
    }
  }
}
</script>
