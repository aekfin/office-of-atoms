<template>
  <div id="forgot-password">
    <v-card elevation="1">
      <v-form ref="form" v-model="valid">
        <v-container>
          <v-row class="justify-center mb-8">
            <div class="text-2xl font-bold">ลืมรหัสผ่าน ?</div>
          </v-row>
          <v-row>
            <v-text-field v-model="form.username" name="username" :rules="usernameRules" label="E-Mail ผู้ใช้งาน" required outlined/>
          </v-row>
          <v-row class="send-btn">
            <v-btn class="w-full" elevation="2" color="primary" x-large @click.stop="login">ส่งลิงค์ไปที่ E-Mail</v-btn>
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
          username: ''
        },
        usernameRules: [
          v => !!v || 'โปรดใส่รหัสผู้ใช้งาน'
        ],
      }
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