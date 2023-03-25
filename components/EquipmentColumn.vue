<template>
  <v-menu class="equipment-column" open-on-hover top offset-y>
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" icon v-on="on">
        <i class="material-icons">info_outline</i>
      </v-btn>
    </template>
    <v-list class="goods-list">
      <v-list-item>
        <v-list-item-title>หมวดหมู่ : <b>{{ item.majorCategory.name }}</b></v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>หมวดหมู่ย่อย : <b>{{ item.subCategory.name }}</b></v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>ประเภท : <b>{{ item.type.name }}</b></v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>ยี่ห้อ : <b>{{ item.brand.name }}</b></v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>รุ่น : <b>{{ item.model.name }}</b></v-list-item-title>
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
  .equipment-column {
  }
</style>