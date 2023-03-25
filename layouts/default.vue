<template>
  <v-app id="default-layout">
    <v-navigation-drawer v-model="drawer" color="#F5F5F5" clipped fixed app>
      <v-list>
        <div v-for="(menu, i) in leftMenus" :key="i">
          <v-list-item v-if="menu.children">
            <v-expansion-panels tile flat multiple :value="expands">
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <div class="text-base">{{ menu.title }}</div>
                  <template #actions>
                    <i class="material-icons">keyboard_arrow_down</i>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-list-item v-for="child in menu.children" :key="child.title" :to=" child.to" router :exactPath="child.exactPath || false">
                    <v-list-item-content>
                      <v-list-item-title>
                        <span>{{ child.title }}</span>
                        <v-badge v-if="child.parcelBadge && parcelNotiCount" class="ml-2 mr-2" color="red" :content="parcelNotiCount"/>
                        <v-badge v-if="child.durableGoodsBadge && equipmentCount" class="ml-2 mr-2" color="red" :content="equipmentCount"/>
                      </v-list-item-title>
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
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
        <i class="material-icons">menu</i>
      </v-app-bar-nav-icon>
      <v-toolbar-title>
        <div class="title-header">
          <img src="~/assets/images/logo.png" alt="logo" width="48px">
          <div class="header-text">{{ title }}</div>
        </div>
      </v-toolbar-title>
      <v-spacer/>
      <v-btn icon @click="$router.push(parcelNotiCount ? `/parcel/request/${externalCount ? '' : 'department/'}` : 'durable-goods/request/')">
        <v-badge overlap color="red" icon :content="notiCount" :value="!!notiCount">
          <i class="material-icons">notifications</i>
        </v-badge>
      </v-btn>
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
    <SnackBarMessage/>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  component: {
    ProfileNavBar: () => import('~/components/ProfileNavBar.vue'),
    SnackBarMessage: () => import('~/components/SnackBarMessage.vue')
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
      return `ระบบบริหารจัดการวัสดุคงคลัง-ครุภัณฑ์ | ${this.$store.state?.role}`
    },
    leftMenus () {
      return this.$store.getters.isAdmin
        ? this.$store.state.leftMenus
        : this.$store.state.leftMenus.filter(menu => menu.to !== '/management/')
    },
    externalCount () {
      return this.$store.state.approveRequest?.totalElements || 0
    },
    internalCount () {
      return this.$store.state.approveRequestDepartment?.totalElements || 0
    },
    equipmentCount () {
      return this.$store.state.approveEquipmentRequest?.totalElements || 0
    },
    parcelNotiCount () {
      return this.externalCount + this.internalCount
    },
    notiCount () {
      return this.parcelNotiCount + this.equipmentCount
    },
  },
  watch: {
    '$store.state.approveRequestTrigger' () {
      this.getNoti()
    }
  },
  async mounted () {
    try {
      await this.checkAuthen()
      await this.checkRoute()
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  },
  methods: {
    async checkAuthen () {
      try {
        const authToken = window.localStorage.authToken
        if (authToken) {
          await this.$store.dispatch('http', { apiPath: 'oauth/valify-token' })
          const { data: profile } = await this.$store.dispatch('http', { apiPath: 'user/getUserbytoken' })
          const { data: role } = await this.$store.dispatch('http', { apiPath: 'roles/getRoles' })
          this.$store.commit('SET_STATE', { name: 'userProfile', val: profile})
          this.$store.commit('SET_STATE', { name: 'role', val: role})
          await this.getNoti()
          this.isLoading = false
          this.$store.commit('SET_STATE', { name: 'isFullLoading', val: false })
        } else {
          this.resetToken()
        }
        return Promise.resolve()
      } catch (err) {
        this.resetToken()
        return Promise.reject(err)
      }
    },
    async getNoti () {
      try {
        const [{ data: approveRequest }, { data: approveRequestDepartment }, { data: approveEquipmentRequest }] = await Promise.all([
          this.$store.dispatch('http', { apiPath: 'parcel/getListPickUp', query: this.$route.query, context: this }),
          this.$store.dispatch('http', { apiPath: 'parcel/department/getListPickUp', query: this.$route.query, context: this }),
          this.$store.dispatch('http', { apiPath: 'equipment/getListRequest', query: { ...this.$route.query,  }, context: this }),
        ])
        this.$store.commit('SET_STATE', { name: 'approveRequest', val: approveRequest })
        this.$store.commit('SET_STATE', { name: 'approveRequestDepartment', val: approveRequestDepartment })
        this.$store.commit('SET_STATE', { name: 'approveEquipmentRequest', val: approveEquipmentRequest })
        return Promise.resolve()
      } catch (err) {
        return Promise.reject(err)
      }
    },
    async checkRoute () {
      try {
        if (!this.$store.getters.isAdmin && (this.$route.path.includes('management') || this.$route.path.includes('management/user'))) {
          this.$router.replace('/')
        }
      } catch (err) {
        return Promise.reject(err)
      }
    },
    resetToken () {
      this.$router.replace('/login/')
    },
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

        .text-base {
          font-size: 1rem;
        }
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

    .title-header {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    @media only screen and (max-width: 426px) {
      .header-text {
        display: none;
      }
    }
  }
</style>
