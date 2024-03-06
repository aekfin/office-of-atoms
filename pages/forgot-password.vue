<template>
  <div id="forgot-password">
    <v-card elevation="1">
      <v-form ref="form" v-model="valid">
        <v-container>
          <v-row class="justify-center mb-8">
            <div class="text-2xl font-bold">ลืมรหัสผ่าน ?</div>
          </v-row>
          <v-row>
            <v-text-field v-model="form.email" name="email" :rules="usernameRules" label="E-Mail ผู้ใช้งาน" required outlined/>
          </v-row>
          <v-row class="send-btn">
            <v-btn class="w-full" elevation="2" color="primary" x-large @click="login">ส่งลิงค์ไปที่ E-Mail</v-btn>
          </v-row>
        </v-container>
      </v-form>      
    </v-card>
  </div>
</template>

<script>
  export default {
    layout: 'unauthen',
    data () {
      return {
        valid: false,
        form: {
          email: ''
        },
        usernameRules: [
          v => !!v || 'โปรดใส่ E-Mail ผู้ใช้งาน'
        ],
      }
    },
    methods: {
      async login () {
        const valid = this.$refs.form.validate()
        if (valid) {
          try {
            const form = { ...this.form }
            const { data } = await this.$store.dispatch('http', { method: 'patch', apiPath: 'oauth/resetPassword', data: form })
            await this.$store.dispatch('snackbar', { text: 'ส่งลิงค์ไปที่ E-Mail สำเร็จ' })
            
            return Promise.resolve(data)
          } catch (err) { return Promise.reject(err) }
        }
      },
    }
  }
</script>

<style lang="scss">
  #forgot-password {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .v-card {
      width: 400px;
      height: 480px;
      padding: 100px 40px 40px 40px;

      .send-btn {
        margin-top: 100px;
      }
    }
  }
</style>