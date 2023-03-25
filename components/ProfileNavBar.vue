<template>
  <div class="profile-nav-bar">
    <v-menu offset-y :nudge-bottom="12" :min-width="320">
      <template #activator="{ on, attrs }">
        <div class="profile-button" v-bind="attrs" v-on="on">
          <!-- <div class="profile-image mr-3" :style="`background-image: url(${require('~/assets/images/14992789.jpg')}`"/> -->
          <div v-if="user" class="profile-name mr-2">{{ user.thaiFristName }} {{ user.thaiLastName }}</div>
          <i class="material-icons">keyboard_arrow_down</i>
        </div>
      </template>
      <v-list>
        <v-list-item inactive>
          <v-list-item-title><b class="mr-2">ตำแหน่ง :</b>{{ $store.state.userProfile?.positionMaster?.positionName }}</v-list-item-title>
        </v-list-item>
        <v-list-item v-for="(item, index) in items" :key="index" @click="onClick(item)">
          <v-list-item-title class="d-flex">
            <i v-if="item.icon" class="material-icons profile-icon mr-2 text-black" v-text="item.icon"/>
            <span>{{ item.title }}</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    computed: {
      user () {
        return this.$store.state.userProfile
      },
      items () {
        return [
          {
            title: 'Profile',
            icon: 'account_circle',
            to: `/management/user/${this.user?.id}/`
          },
          {
            title: 'Logout',
            icon: 'logout',
            to: '/login/',
            external: true,
          },
        ]
      }
    },
    methods: {
      onClick (item) {
        if (item.external) window.location = item.to
        else this.$router.push(item.to)
      }
    },
  }
</script>

<style lang="scss">
  .profile-nav-bar {
    .profile-button {
      padding: 0 16px;
      display: flex;
      align-items: center;
      cursor: pointer;
  
      .profile-image {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-size: cover;
        background-position: center;
      }
  
      .profile-name {
        font-size: 18px;
        max-width: 240px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>