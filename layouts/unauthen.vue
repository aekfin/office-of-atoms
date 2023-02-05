<template>
  <v-app id="unauthen-layout">
    <Nuxt/>
    <SnackBarMessage/>
  </v-app>
</template>

<script>
  export default {
    component: {
      SnackBarMessage: () => import('~/components/SnackBarMessage.vue')
    },
  }
</script>

<style lang="scss">
  #unauthen-layout {
    background-color: #BBDEFB;

    .v-label.theme--light{
      color: #222831;
    }
  }
</style>