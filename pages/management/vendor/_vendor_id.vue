<template>
  <div id="project-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มคู่สัญญา' : 'การแก้ไขคู่สัญญา'"/>
    <v-form ref="form" v-model="valid" lazyValidation class="mt-8">
      <v-container>
        <v-row>
          <v-col cols="auto">
            <UploadImage class="mt-4" :image.sync="form.image"/>
          </v-col>
          <v-col cols="7" class="ml-6">
            <v-text-field v-model="form.code" name="code" label="รหัสพนักงาน *" :rules="codeRules" required/>
            <v-text-field v-model="form.name" label="ชื่อ *" :rules="nameRules" required/>
            <v-textarea v-model="form.address" name="address" label="ที่อยู่ *" :rules="addressRules" required/>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <h3 class="text-2xl font-bold mb-2">ข้อมูลติดต่อ</h3>
        <v-row>
          <v-col>
            <v-text-field v-model="form.contact" name="contact" label="ผู้ติดต่อ"/>
            <v-text-field v-model="form.contactPosition" name="contactPosition" label="ตำแหน่งผู้ติดต่อ"/>
            <v-text-field v-model="form.warranty" type="number" name="warranty" label="การรับประกัน"/>
          </v-col>
          <v-col>
            <v-text-field v-model="form.tel" name="tel" type="tel" label="เบอร์โทรศัพท์"/>
            <v-text-field v-model="form.service" name="service" label="การบริการ"/>
          </v-col>
        </v-row>
      </v-container>
      <v-container class="mt-6">
        <v-row justify="end">
          <v-btn elevation="2" large color="success" @click="onSave">บันทึก</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      UploadImage: () => import('~/components/UploadImage.vue'),
    },
    data () {
      return {
        valid: true,
        form: {
          image: '',
          code: '',
          name: '',
          address: '',
          contact: '',
          contactPosition: '',
          tel: '',
          service: '',
          warranty: ''
        },
        codeRules: [
          v => !!v || 'โปรดใส่รหัสพนักงาน',
        ],
        nameRules: [
          v => !!v || 'โปรดใส่รหัสบัตรประชาชน',
        ],
        addressRules: [
          v => !!v || 'โปรดใส่ที่อยู่',
        ],
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.vendor_id === 'create'
      },
    },
    methods: {
      onSave () {
        this.$refs.form.validate()
      },
    }
  }
</script>

<style lang="scss">
  #project-detail-page {
  }
</style>