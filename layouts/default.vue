<template>
  <v-app id="default-layout">
    <v-navigation-drawer v-model="drawer" color="#F5F5F5" clipped fixed app>
      <v-list>
        <div v-for="(menu, i) in $store.state.leftMenus" :key="i">
          <v-list-item v-if="menu.children">
            <v-expansion-panels tile flat multiple :value="expands">
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <div class="text-base">{{ menu.title }}</div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-list-item v-for="child in menu.children" :key="child.title" :to=" child.to" router :exactPath="child.exactPath || false">
                    <v-list-item-content>
                      <v-list-item-title>{{ child.title }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-list-item>
          <v-list-item v-else :to=" menu.to" router>
            <v-list-item-content>
              <v-list-item-title>{{ menu.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="#0288D1" clippedLeft fixed dark app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title v-text="title" />
      <v-spacer/>
      <ProfileNavBar/>
    </v-app-bar>
    <v-main>
      <v-container class="mt-7 mb-10 pl-12 pr-12">
        <Nuxt/>
      </v-container>
    </v-main>
    <v-footer color="#0288D1" dark>
      <div style="transform: translateX(256px)">
        <span>&copy; {{ new Date().getFullYear() }}</span>
      </div>
    </v-footer>
    <FullLoading v-if="$store.state.isFullLoading"/>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  middleware: 'auth',
  component: {
    ProfileNavBar: () => import('~/components/ProfileNavBar.vue')
  },
  data () {
    return {
      drawer: true,
      expands: [0, 1, 2, 3, 4],
      isLoading: true,
    }
  },
  head () {
    return {
      title: this.title
    }
  },
  computed: {
    title () {
      return 'ระบบบริหารจัดการครุภัณฑ์ทางอิเลกทรอนิกส์'
    },
  },
  mounted () {
    this.checkAuthen()
  },
  methods: {
    async checkAuthen () {
      try {
        if (window.localStorage.authToken) {
          this.$store.commit('SET_STATE', { name: 'isFullLoading', val: false })
          const { data } = await this.$store.dispatch('http', { apiPath: 'oauth/test' })
          this.isLoading = false
        } else {
          this.$router.replace('/login/')
        }
        return Promise.resolve()
      } catch (err) { return Promise.reject(err) }
    }
  },
}
</script>

<style lang="scss">
  #default-layout {
    background-color: #FAFAFA;

    .v-label.theme--light{
      color: #222831;
    }

    .v-navigation-drawer {
      .v-expansion-panel-header {
        padding: 0;
      }

      .v-expansion-panel {
        background-color: transparent;

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
  }
</style>
