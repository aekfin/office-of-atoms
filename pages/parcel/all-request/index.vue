<template>
  <div id="parcel-request-parent-page">
    <ParcelRequestTabs isAll/>
    <NChild/>
  </div>
</template>

<script>
  export default {
    components: {
      ParcelRequestTabs: () => import('~/components/ParcelRequestTabs.vue'),
    }
  }
</script>

<style lang="scss">
  #parcel-request-parent-page {
  }
</style>