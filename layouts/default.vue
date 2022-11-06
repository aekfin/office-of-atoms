<template>
  <VApp id="default-layout">
    <VNavigationDrawer v-model="drawer" clipped fixed app>
      <VList>
        <div v-for="(menu, i) in leftMenus" :key="i">
          <VListItem v-if="menu.children">
            <VExpansionPanels tile flat :value.sync="menu.expand">
              <VExpansionPanel>
                <VExpansionPanelHeader>{{ menu.title }}</VExpansionPanelHeader>
                <VExpansionPanelContent>
                  <VListItem v-for="child in menu.children" :key="child.title" :to=" child.to" router exact>
                    <VListItemContent>
                      <VListItemTitle>{{ child.title }}</VListItemTitle>
                    </VListItemContent>
                  </VListItem>
                </VExpansionPanelContent>
              </VExpansionPanel>
            </VExpansionPanels>
          </VListItem>
          <VListItem v-else :to=" menu.to" router exact>
            <VListItemContent>
              <VListItemTitle>{{ menu.title }}</VListItemTitle>
            </VListItemContent>
          </VListItem>
        </div>
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
          title: 'หนักหลัก',
          to: '/'
        },
        {
          title: 'โครงการ',
          to: '/project/'
        },
        {
          title: 'พัสดุ-ครุภัณฑ์',
          to: '/goods/',
          expand: 0,
          children: [
            {
              title: 'บริหารพัสดุ-ครุภัณฑ์',
              to: '/goods/'
            },
            {
              title: 'เบิกพัสดุ',
              to: '/goods/withdraw/'
            },
            {
              title: 'ยืม-คืน ครุภัณฑ์',
              to: '/goods/borrow/'
            },
            {
              title: 'ตรวจนับ ครุภัณฑ์',
              to: '/goods/count/'
            }
          ]
        },
        {
          title: 'ผู้ดูแลระบบ',
          to: '/management/',
          children: [
            {
              title: 'บริหารขั้นตอนอนุมัติ',
              to: '/management/approval/'
            },
            {
              title: 'บริหารบุคลากร',
              to: '/management/staff/'
            },
            {
              title: 'บริหารผู้ใช้ระบบ',
              to: '/management/user/'
            },
            {
              title: 'ค่าเริ่มต้น พัสดุ-ครุภัณฑ์',
              to: '/management/goods/'
            },
            {
              title: 'บริหารคู่สัญญา',
              to: '/management/vendor/'
            },
            {
              title: 'รายงานการใช้งานระบบ',
              to: '/management/report/'
            }
          ]
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

<style lang="scss">
  #default-layout {
    .v-navigation-drawer {
      .v-expansion-panel-header {
        padding: 0;
      }

      .v-expansion-panel-content {
        .v-expansion-panel-content__wrap {
          padding-left: 0;
          padding-right: 0;

          a.v-list-item {
            padding-left: 24px;
          }
        }
      }
    }
  }
</style>
