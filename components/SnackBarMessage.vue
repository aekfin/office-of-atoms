<template>
  <div class="snack-bar-message">
    <v-snackbar v-model="snackbar" :timeout="4000" :elevation="20" v-bind="$store.state.snackbarProps">
      <slot>
        <div class="text-center" v-html="$store.state.snackbarText"/>
      </slot>
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        snackbar: this.$store.state.snackbarVisible
      }
    },
    watch: {
      '$store.state.snackbarVisible' (val) {
        this.snackbar = val
      },
      'snackbar' (val) {
        if (!val) this.$store.commit('SET_STATE', { name: 'snackbarVisible', val: false })
      },
    },
  }
</script>

<style lang="scss">
  .snack-bar-message {
  }
</style>