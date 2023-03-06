<template>
  <v-tabs class="parcel-withdraw-tabs tabs-underline mb-10" exact exactPath>
    <v-tab :to="{ path: '/parcel/withdraw/' }">ภายนอกกลุ่ม</v-tab>
    <v-tab :to="{ path: '/parcel/withdraw/department/' }">ภายในกลุ่ม</v-tab>
  </v-tabs>
</template>

<script>
  export default {
  }
</script>

<style lang="scss">
  .parcel-withdraw-tabs {
  }
</style>