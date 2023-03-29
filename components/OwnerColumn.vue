<template>
  <v-menu class="owner-column" open-on-hover top offset-y>
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" icon v-on="on">
        <i class="material-icons">info_outline</i>
      </v-btn>
    </template>
    <v-list class="goods-list">
      <v-list-item v-if="showTitle">
        <v-list-item-title><b>ผู้ครอบครอง</b></v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>กอง : <b>{{ item.organization.ouName }}</b></v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>กลุ่ม : <b>{{ item.department.departmentName }}</b></v-list-item-title>
      </v-list-item>
      <v-list-item v-if="item.owner">
        <v-list-item-title>บุคคล : <b>{{ item.owner && $fn.getName(item.owner) || '-' }}</b></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    props: {
      item: { type: Object, required: true },
      showTitle: { type: Boolean },
    },
  }
</script>

<style lang="scss">
  .owner-column {
  }
</style>