<template>
  <div class="action-icon-list">
    <ActionIcon v-for="(item, i) in list" :key="i" :item="item"/>
  </div>
</template>

<script>
  export default {
    components: {
      ActionIcon: () => import('~/components/ActionIcon.vue')
    },
    props: {
      list: { type: Array, required: true },
    }
  }
</script>

<style lang="scss">
  .action-icon-list {
    display: flex;
    justify-content: center;
  }
</style>