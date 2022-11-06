<template>
  <VApp id="default-layout">
    <VNavigationDrawer v-model="drawer" clipped fixed app>
      <VList>
        <div v-for="(menu, i) in $store.state.leftMenus" :key="i">
          <VListItem v-if="menu.children">
            <VExpansionPanels tile flat :value.sync="menu.expand">
              <VExpansionPanel>
                <VExpansionPanelHeader>
                  <div class="text-base">{{ menu.title }}</div>
                </VExpansionPanelHeader>
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
      drawer: true
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
