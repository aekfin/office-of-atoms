<template>
  <div id="index-page">
    <v-row class="mt-5" justify="center" align="center">
      <img class="login-index-img" src="~/assets/images/logo.png" alt="logo">
    </v-row>
  </div>
</template>

<script>
  export default {
    name: 'IndexPage'
  }
</script>

<style lang="scss">
  #index-page {
    img.login-index-img {
      width: 480px;
    }

    @media only screen and (max-width: 426px) {
      img.login-index-img {
        width: 320px;
      }
    }
  }
</style>
