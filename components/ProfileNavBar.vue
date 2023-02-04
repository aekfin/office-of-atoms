<template>
  <div class="profile-nav-bar">
    <v-menu offset-y :nudge-bottom="12" :min-width="320">
      <template #activator="{ on, attrs }">
        <div class="profile-button" v-bind="attrs" v-on="on">
          <!-- <div class="profile-image mr-3" :style="`background-image: url(${require('~/assets/images/14992789.jpg')}`"/> -->
          <div v-if="user" class="profile-name mr-2">{{ user.thaiFristName }} {{ user.thaiLastName }}</div>
          <v-icon class="profile-icon">mdi-chevron-down</v-icon>
        </div>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" link :to="item.to">
          <v-list-item-title>
            <v-icon v-if="item.icon" class="profile-icon mr-1" v-text="item.icon"/>
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
            icon: 'mdi-account',
            to: `/management/user/${this.user?.id}/`
          },
          {
            title: 'Logout',
            icon: 'mdi-logout',
            to: '/login/'
          },
        ]
      }
    },
    methods: {
      onClick () {
        console.log('AAA')
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