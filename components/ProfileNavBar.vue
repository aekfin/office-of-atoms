<template>
  <div class="profile-nav-bar">
    <v-menu offset-y :nudge-bottom="12" :min-width="320">
      <template #activator="{ on, attrs }">
        <div class="profile-button" v-bind="attrs" v-on="on">
          <div class="profile-image mr-3" :style="`background-image: url(${require('~/assets/images/14992789.jpg')}`"/>
          <div class="profile-name mr-2">John Doe</div>
          <v-icon class="profile-icon">mdi-chevron-down</v-icon>
        </div>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" link>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        items: [
          { title: 'Click Me' },
          { title: 'Click Me' },
          { title: 'Click Me' },
          { title: 'Click Me 2' }
        ]
      }
    }
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