<template>
  <v-tabs class="parcel-request-tabs tabs-underline mb-10" exact exactPath>
    <v-tab :to="{ path: '/parcel/request/' }">ภายนอกกลุ่ม</v-tab>
    <v-tab :to="{ path: '/parcel/request/department/' }">ภายในกลุ่ม</v-tab>
  </v-tabs>
</template>

<script>
  export default {
  }
</script>

<style lang="scss">
  .parcel-request-tabs {
  }
</style>