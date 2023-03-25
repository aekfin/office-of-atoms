<template>
  <div id="login-page">
    <v-card elevation="1">
      <img class="logo" src="~/assets/images/logo.png" alt="logo">
      <v-form ref="form" v-model="valid" lazyValidation>
        <v-container>
          <v-row :class="isError ? '' : 'mb-8'">
            <v-text-field v-model="form.username" name="email" :rules="usernameRules" label="E-Mail ผู้ใช้งาน" required outlined/>
            <v-text-field v-model="form.password" label="รหัสผ่าน" :type="seePassword ? 'text' : 'password'" :rules="passwordRules" required outlined class="mt-2">
              <template #append>
                <i class="material-icons pointer" @click="seePassword = !seePassword" v-text="seePassword ? 'password' : 'remove_red_eye'"/>
              </template>
            </v-text-field>
            <v-alert v-if="isError" style="width: 100%;" dense outlined type="error">
              <strong>Email</strong> หรือ <strong>รหัสผ่าน </strong>ไม่ถูกต้อง
            </v-alert>
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
        ],
        isError: false,
      }
    },
    mounted () {
      localStorage.removeItem('authToken')
      this.$store.commit('SET_STATE', { name: 'userProfile', val: null })
      this.$store.commit('SET_STATE', { name: 'role', val: null })
        this.$store.commit('SET_STATE', { name: 'approveRequest', val: null })
        this.$store.commit('SET_STATE', { name: 'approveRequestDepartment', val: null })
    },
    methods: {
      async login () {
        try {
          if (this.$refs.form.validate()) {
            this.isError = false
            const { res, data } = await this.$store.dispatch('http', { method: 'post', apiPath: 'oauth/authorize', data: this.form })
            localStorage.setItem('authToken', data.jwttoken)
            this.$axios.setHeader('Authorization', `Bearer ${data.jwttoken}`)
            this.$router.push('/')
            return Promise.resolve(data)
          }
          return Promise.resolve()
        } catch (err) {
          this.isError = true
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
      height: 500px;
      padding: 140px 40px 40px 40px;

      .logo {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -45%);
        width: 200px;
      }
    }

    @media only screen and (max-width: 426px) {
      .v-card {
        width: 320px;
        height: 420px;
        padding: 96px 40px 40px 40px;

        .logo {
          width: 140px;
        }
      }
    }
  }
</style>