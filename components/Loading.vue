<template>
  <div :class="{ loading: true, overlay }">
    <v-progress-circular :size="100" :width="12" color="primary" indeterminate/>
    <div class="text-loading mt-5">Loading...</div>
  </div>
</template>

<script>
  export default {
    props: {
      overlay: { type: Boolean }
    }
  }
</script>

<style lang="scss">
  .loading {
    width: 100%;
    text-align: center;
    padding-top: 60px;
    padding-bottom: 60px;

    &.overlay {
      position: absolute;
      width: calc(100% - 140px);
      height: calc(100% - 140px);
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      background-color: rgba(#fff, 0.75);
      z-index: 4;
    }

    .text-loading {
      font-size: 24px;
    }
  }
</style>