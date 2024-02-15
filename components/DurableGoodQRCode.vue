<template>
  <div class="durable-good-qr-code">
    <v-btn outlined elevation="2" color="black" @click="val = true">
      <i class="material-icons">qr_code_2</i>
      <span class="ml-1">QR Code</span>
    </v-btn>
    <v-dialog v-model="val" contentClass="durable-good-qr-code-dialog" width="400">
      <v-card>
        <v-card-title class="text-h5 justify-space-between">
          <div><b>QR Code ของครุภัณฑ์</b></div>
          <v-btn icon @click="val = false">
            <i class="material-icons">close</i>
          </v-btn>
        </v-card-title>
        <v-card-text class="black--text pt-2 text-body-1">
          <Loading v-if="isLoading"/>
          <template v-else>
            <div class="text-center">
              <img ref="imageQRCode" :src="qrcode" alt="qr_code">
            </div>
          </template>
          <div class="centered-text"><b>{{ `${equipment.number}` }}</b></div>
        </v-card-text>
        
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    component: {
      Loading: () => import('~/components/Loading.vue'),
    },
    props: {
      equipment: { type: Object, required: true },
    },
    data () {
      return {
        val: false,
        qrcode: null,
        isLoading: true,
      }
    },
    watch: {
      'val' (val) {
        if (val) this.getQRCode()
      },
    },
    methods: {
      async getQRCode () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: `equipment/getEquipmentQrCode`, query: { id: this.equipment.id }})
          this.qrcode = data
          this.isLoading = false
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
    },
  }
</script>

<style lang="scss">
  .durable-good-qr-code {
  }

  .durable-good-qr-code-dialog {
  }

  .centered-text {
    text-align: center; 
  }
</style>