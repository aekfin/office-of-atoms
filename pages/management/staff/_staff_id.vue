<template>
  <div id="project-create-page">
    <PageHeader :text="isCreate ? 'การเพิ่มบุคลากร' : 'การแก้ไขบุคลากร'"/>
    <v-form ref="form" v-model="valid" lazyValidation class="mt-8">
      <v-container>
        <v-row>
          <div class="image-uploader-wrapper">
            <div class="mt-8 image-uploader" :style="{ backgroundImage: `url('${previewImage}')` }" @click="onUploadImage">
              <div :class="`filter-upload${previewImage ? '' : ' is-show'}`">
                <v-icon color="white">mdi-image</v-icon>
                <div class="text-white text-lg">อัพโหลดรูปภาพ</div>
              </div>
            </div>
            <input v-show="false" ref="uploadImage" type="file" accept="image/*" @change="onChangeImage">
          </div>
          <v-col>
            <v-text-field v-model="form.code" name="code" label="รหัสพนักงาน *" :rules="codeRules" required/>
            <v-text-field v-model="form.fistNameTh" label="ชื่อ *" :rules="fistNameThRules" required/>
            <v-text-field v-model="form.fistNameEn" label="ชื่อ (Eng) *" :rules="fistNameEnRules" required/>
            <v-select v-model="form.division" :items="items" itemValue="id" itemText="name" label="กอง *" :rules="divisionRules" required/>
            <v-text-field v-model="form.username" label="รหัสผู้ใช้งาน *" :rules="usernameRules" required/>
            <v-text-field v-model="form.password" label="รหัสผ่าน *" :type="seePassword ? 'text' : 'password'" :rules="passwordRules" required>
              <template #append><v-icon @click="seePassword = !seePassword" v-text="`mdi-eye${seePassword ? '-off' : ''}`"/></template>
            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="form.idCard" label="รหัสบัตรประชาชน *" :rules="idCardRules" required/>
            <v-text-field v-model="form.lastNameTh" label="นามสกุล *" :rules="lastNameThRules" required/>
            <v-text-field v-model="form.lastNameEn" label="นามสกุล (Eng) *" :rules="lastNameEnRules" required/>
            <v-select v-model="form.group" :items="items" itemValue="id" itemText="name" label="กลุ่ม *" :rules="groupRules" required/>
            <v-select v-model="form.position" :items="items" itemValue="id" itemText="name" label="ตำแหน่ง *" :rules="positionRules" required/>
            <v-select v-model="form.role" :items="items" itemValue="id" itemText="name" label="สิทธ์การใช้งาน *" :rules="roleRules" required/>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <h3 class="text-xl font-bold mb-2">ข้อมูลติดต่อ</h3>
        <v-row>
          <v-col>
            <v-text-field v-model="form.tel" name="tel" label="เบอร์โทรศัพท์"/>
          </v-col>
          <v-col>
            <v-text-field v-model="form.email" name="email" label="E-Mail"/>
          </v-col>
        </v-row>
        <v-textarea v-model="form.address" name="address" label="ที่อยู่"/>
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
    },
    data () {
      return {
        valid: true,
        previewImage: '',
        form: {
          code: '',
          idCard: '',
          fistNameTh: '',
          lastNameTh: '',
          fistNameEn: '',
          lastNameEn: '',
          username: '',
          password: '',
          division: null,
          group: null,
          position: null,
          role: null,
          tel: '',
          email: '',
          address: ''
        },
        items: [
          { id: 1, name: 'Foo' },
          { id: 2, name: 'Bar' },
          { id: 3, name: 'Fizz' },
          { id: 4, name: 'Buzz' }
        ],
        seePassword: false,
        codeRules: [
          v => !!v || 'โปรดใส่รหัสพนักงาน',
        ],
        idCardRules: [
          v => !!v || 'โปรดใส่รหัสบัตรประชาชน',
        ],
        fistNameThRules: [
          v => !!v || 'โปรดใส่ชื่อ',
        ],
        lastNameThRules: [
          v => !!v || 'โปรดใส่นามสกุล',
        ],
        fistNameEnRules: [
          v => !!v || 'โปรดใส่ชื่อ (Eng)',
        ],
        lastNameEnRules: [
          v => !!v || 'โปรดใส่นามสกุล (Eng)',
        ],
        usernameRules: [
          v => !!v || 'โปรดใส่รหัสผู้ใช้งาน',
        ],
        passwordRules: [
          v => !!v || 'โปรดใส่รหัสผ่าน',
        ],
        divisionRules: [
          v => !!v || 'โปรดใส่กอง',
        ],
        groupRules: [
          v => !!v || 'โปรดใส่กลุ่ม',
        ],
        positionRules: [
          v => !!v || 'โปรดใส่ตำแหน่ง',
        ],
        roleRules: [
          v => !!v || 'โปรดใส่สิทธ์การใช้งาน',
        ],
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.staff_id === 'create'
      },
    },
    methods: {
      onSave () {
        this.$refs.form.validate()
      },
      onUploadImage () {
       if (this.$refs.uploadImage) this.$refs.uploadImage.click()
      },
      onChangeImage ({ target: { files } }) {
        const reader = new FileReader()
        reader.readAsDataURL(files[0])
        reader.onload = () => {
          this.previewImage = reader.result
        }
      },
    }
  }
</script>

<style lang="scss">
  #project-create-page {
    .row {
      justify-content: space-between;
      gap: 40px;

      .selector-project {
        width: 50%;
      }

      .year-of-budget {
        width: 200px;
      }

      .selector-vendor {
        flex-grow: 1;
      }
    }

    .image-uploader-wrapper {
      width: 200px;

      .image-uploader {
        background-color: #9E9E9E;
        transition-duration: 0.3s;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        cursor: pointer;
        background-position: center;
        background-size: cover;
        overflow: hidden;

        .filter-upload {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-flow: column;
          opacity: 0;
          width: 100%;
          height: 100%;
          transition-duration: 0.3s;

          &.is-show {
            opacity: 100;
            background-color: rgba(0, 0, 0, 0);;
          }

          &:hover {
            opacity: 100;
            background-color: rgba(0, 0, 0, 0.5);
          }
        }

        i {
          font-size: 64px;
        }
      }
    }
  }
</style>