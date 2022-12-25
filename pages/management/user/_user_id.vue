<template>
  <div id="management-user-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มบุคลากร' : 'การแก้ไขบุคลากร'"/>
    <v-form ref="form" v-model="valid" lazyValidation class="mt-8">
      <v-container>
        <v-row>
          <UploadImage class="mt-4" :image.sync="form.image"/>
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
            <v-select v-model="form.role" :items="items" itemValue="id" itemText="name" label="สิทธ์การใช้งาน *" :rules="roleRules" multiple required/>
          </v-col>
        </v-row>
      </v-container>
      <v-expansion-panels v-model="formExpand" class="form-expansion-panels" flat multiple>
        <v-expansion-panel>
          <v-expansion-panel-header>ข้อมูลติดต่อ</v-expansion-panel-header>
          <v-expansion-panel-content>
              <v-row>
                <v-col>
                  <v-text-field v-model="form.tel" name="tel" type="tel" label="เบอร์โทรศัพท์"/>
                </v-col>
                <v-col>
                  <v-text-field v-model="form.email" name="email" label="E-Mail"/>
                </v-col>
              </v-row>
              <v-textarea v-model="form.address" name="address" label="ที่อยู่"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
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
          role: [],
          tel: '',
          email: '',
          address: ''
        },
        formExpand: [0],
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
          v => !!v && v.length || 'โปรดใส่สิทธ์การใช้งาน',
        ],
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.user_id === 'create'
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
  #management-user-detail-page {
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
  }
</style>