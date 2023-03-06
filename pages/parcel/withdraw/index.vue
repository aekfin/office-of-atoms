<template>
  <div id="parcel-withdraw-parent-page">
    <ParcelWithdrawTabs/>
    <NChild/>
  </div>
</template>

<script>
  export default {
    components: {
      ParcelWithdrawTabs: () => import('~/components/ParcelWithdrawTabs.vue'),
    }
  }
</script>

<style lang="scss">
  #parcel-withdraw-parent-page {
  }
</style>