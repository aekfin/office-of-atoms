<template>
  <div id="login-page">
    <v-card elevation="1">
      <v-form ref="form" v-model="valid">
        <v-container>
          <v-row class="mb-12">
            <v-text-field v-model="form.username" name="username" :rules="usernameRules" label="รหัสผู้ใช้งาน" required outlined/>
            <v-text-field v-model="form.password" name="password" :rules="passwordRules" label="รหัสผ่าน" required outlined/>
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
        form: {
          username: '',
          password: ''
        },
        usernameRules: [
          v => !!v || 'โปรดใส่รหัสผู้ใช้งาน'
        ],
        passwordRules: [
          v => !!v || 'โปรดใส่รหัสผ่าน'
        ]
      }
    },
    methods: {
      login () {
        this.$refs.form.validate()
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
      padding: 120px 40px 40px 40px;
    }
  }
</style>