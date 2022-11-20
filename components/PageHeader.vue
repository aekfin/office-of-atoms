<template>
  <div class="page-header flex justify-between">
    <h2 class="text-3xl font-bold">
      <slot>{{ text }}</slot>
    </h2>
    <slot v-if="btnText" name="btn">
      <v-btn elevation="2" large color="success" @click="$emit('create')">
        <NLink v-if="createRoute" :to="createRoute" class="text-white">{{ btnText }}</NLink>
        <div v-else>{{ btnText }}</div>
      </v-btn>
    </slot>
  </div>
</template>

<script>
  export default {
    props: {
      text: { type: String, required: true },
      btnText: { type: String },
      createRoute: { type: [String, Object] }
    }
  }
</script>

<style lang="scss">
  .page-header {
  }
</style>