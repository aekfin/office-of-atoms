<template>
  <v-menu class="durable-good-number" open-on-hover top offset-y>
    <template #activator="{ on, attrs }">
      <div class="d-flex align-center justify-center">
        <div>{{ item.number }}</div>
        <v-btn v-bind="attrs" icon v-on="on">
          <i class="material-icons">info_outline</i>
        </v-btn>
      </div>
    </template>
    <v-list class="goods-list">
      <v-list-item>
        <v-list-item-title>หมวดหมู่ : <b>{{ item.majorCategory.name }}</b></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    props: {
      item: { type: Object, required: true }
    }
  }
</script>

<style lang="scss">
  .durable-good-number {
  }
</style>