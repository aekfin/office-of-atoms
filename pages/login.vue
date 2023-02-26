<template>
  <div id="login-page">
    <v-card elevation="1">
      <img class="logo" src="~/assets/images/logo.png" alt="logo" width="200px">
      <v-form ref="form" v-model="valid" lazyValidation>
        <v-container>
          <v-row class="mb-8">
            <v-text-field v-model="form.username" name="email" :rules="usernameRules" label="E-Mail ผู้ใช้งาน" required outlined/>
            <v-text-field v-model="form.password" label="รหัสผ่าน" :type="seePassword ? 'text' : 'password'" :rules="passwordRules" required outlined class="mt-2">
              <template #append><v-icon @click="seePassword = !seePassword" v-text="`mdi-eye${seePassword ? '-off' : ''}`"/></template>
            </v-text-field>
          </v-row>
          <v-row>
            <v-btn class="w-full" elevation="2" color="primary" x-large @click.stop="login">ลงชื่อเข้าใช้</v-btn>
            <div class="w-full text-center mt-4">
              <NLink class="hover:underline" to="/forgot-password/">ลืมรหัสผ่าน</NLink>
            </div>
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
        seePassword: false,
        form: {
          username: '',
          password: ''
        },
        usernameRules: [
          v => v ? this.$fn.checkEmailFormat(v) || 'โปรดใส่ E-Mail ให้ถูกต้อง' : 'โปรดใส่ E-Mail ผู้ใช้งาน'
        ],
        passwordRules: [
          v => !!v || 'โปรดใส่รหัสผ่าน'
        ]
      }
    },
    mounted () {
      localStorage.removeItem('authToken')
    },
    methods: {
      async login () {
        try {
          if (this.$refs.form.validate()) {
            const { res, data } = await this.$store.dispatch('http', { method: 'post', apiPath: 'oauth/authorize', data: this.form })
            localStorage.setItem('authToken', data.jwttoken)
            this.$axios.setHeader('Authorization', `Bearer ${data.jwttoken}`)
            this.$router.push('/')
            return Promise.resolve(data)
          }
          return Promise.resolve()
        } catch (err) {
          console.log(err)
          return Promise.reject(err)
        }
      }
    }
  }
</script>

<style lang="scss">
  #login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .v-card {
      width: 400px;
      height: 480px;
      padding: 140px 40px 40px 40px;

      .logo {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -45%);
      }
    }
  }
</style>