<template>
  <v-dialog v-model="val" contentClass="confirm-dialog" :width="width">
    <v-card>
      <v-card-title class="text-h5 justify-space-between">
        <div>{{ title }}</div>
        <v-btn icon @click="val = false">
          <i class="material-icons">close</i>
        </v-btn>
      </v-card-title>
      <v-card-text class="black--text pt-2 text-body-1">
        <slot>{{ text }}</slot>
      </v-card-text>
      <v-card-actions v-if="!hideAction" class="justify-end">
        <v-btn color="grey" text @click="val = false">{{ closeText }}</v-btn>
        <v-btn v-if="!hideSubmit" :color="submitColor" :loading="buttonLoading" @click="onConfirm">{{ confirmText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> 
</template>

<script>
  export default {
    props: {
      value: { type: Boolean, required: true },
      title: { type: String },
      text: { type: String },
      hideAction: { type: Boolean },
      hideSubmit: { type: Boolean },
      closeText: { type: String, default: 'ยกเลิก' },
      confirmText: { type: String, default: 'ยืนยัน' },
      width: { type: String, default: '480' },
      customConfirm: { type: Function },
      submitColor: { type: String, default: 'success' },
      buttonLoading: { type: Boolean },
      notCloseDialog: { type: Boolean },
    },
    data () {
      return {
        val: this.value
      }
    },
    watch: {
      'value' (val) {
        this.val = val
      },
      'val' (val) {
        this.$emit('update:value', val)
      },
    },
    methods: {
      onConfirm () {
        if (this.customConfirm) {
          this.customConfirm()
        } else {
          this.$emit('submit')
          if (!this.notCloseDialog) this.val = false
        }
      },
    },
  }
</script>

<style lang="scss">
  .confirm-dialog {
  }
</style>