<template>
  <div id="login-page">
    <VCard elevation="1">
      <VForm v-model="valid">
        <VContainer>
          <VRow>
            <VTextField v-model="form.username" :rules="nameRules" label="รหัสผู้ใช้งาน" required outlined/>
            <VTextField v-model="form.password" :rules="nameRules" label="รหัสผ่าน" required outlined/>
            <VCheckbox v-model="form.loginAsAdmin" class="mt-0" label="ลงชื่อเข้าใช้ด้วยสิทธิ์ผู้ดูแลระบบ" />
          </VRow>
          <VRow>
            <VBtn class="w-full" elevation="2" color="primary" x-large>ลงชื่อเข้าใช้</VBtn>
            <div class="w-full text-center mt-4">
              <NLink class="hover:underline" to="/forgot-password/">ลืมรหัสผ่าน</NLink>
            </div>
          </VRow>
        </VContainer>
      </VForm>      
    </VCard>
  </div>
</template>

<script>
  export default {
    layout: 'unauthen',
    data () {
      return {
        form: {
          username: '',
          password: '',
          loginAsAdmin: false
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
      padding: 120px 40px 40px 40px;
    }
  }
</style>