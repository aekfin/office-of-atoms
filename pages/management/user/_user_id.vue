<template>
  <div id="management-user-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มบุคลากร' : 'การแก้ไขบุคลากร'" hideTotal/>
    <v-form ref="form" v-model="valid" lazyValidation class="mt-4 relative">
      <v-container>
        <v-row>
          <v-col :cols="6">
            <v-text-field v-model="form.employeeId" name="code" label="รหัสพนักงาน *" :rules="codeRules" required :disabled="disabled"/>
          </v-col>
          <v-col :cols="6">
            <v-text-field v-model="form.thaiId" label="รหัสบัตรประชาชน *" :rules="idCardRules" required :disabled="disabled"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="6">
            <v-text-field v-model="form.thaiFristName" label="ชื่อ *" :rules="fistNameThRules" required :disabled="disabled"/>
          </v-col>
          <v-col :cols="6">
            <v-text-field v-model="form.thaiLastName" label="นามสกุล *" :rules="lastNameThRules" required :disabled="disabled"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="6">
            <v-text-field v-model="form.engFristName" label="ชื่อ (Eng) *" :rules="fistNameEnRules" required :disabled="disabled"/>
          </v-col>
          <v-col :cols="6">
            <v-text-field v-model="form.engLastName" label="นามสกุล (Eng) *" :rules="lastNameEnRules" required :disabled="disabled"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="6">
            <SelectDropdown :value.sync="form.positionId" label="ตำแหน่ง *" :rules="positionRules" itemText="positionName" required apiPath="Orgchart/getPositions" :disabled="disabled"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="6">
            <SelectDropdown :value.sync="form.ouId" label="กอง *" itemText="ouName" :rules="divisionRules" required apiPath="Orgchart/getOrganizations" :disabled="disabled"/>
          </v-col>
          <v-col :cols="6">
            <SelectDropdown :value.sync="form.departmentId" label="กลุ่ม *" itemText="departmentName" :rules="groupRules" required apiPath="Orgchart/getDepartments" :disabled="disabled"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="6">
            <v-text-field v-model="form.username" label="E-Mail ผู้ใช้งาน *" :rules="usernameRules" name="email" required :disabled="disabled"/>
          </v-col>
          <v-col :cols="6">
            <SelectDropdown :value.sync="form.roleName" :items="roleList" label="สิทธ์การใช้งาน *" :rules="roleRules" multiple required :disabled="disabled"/>
          </v-col>
          <!-- <v-col :cols="6">
            <v-text-field v-model="form.password" label="รหัสผ่าน *" :type="seePassword ? 'text' : 'password'" :rules="passwordRules" required :disabled="disabled">
              <template #append><v-icon @click="seePassword = !seePassword" v-text="`mdi-eye${seePassword ? '-off' : ''}`"/></template>
            </v-text-field>
          </v-col> -->
        </v-row>
      </v-container>
      <v-expansion-panels v-model="formExpand" class="form-expansion-panels" flat multiple>
        <v-expansion-panel>
          <v-expansion-panel-header>ข้อมูลติดต่อ</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field v-model="form.phone" name="tel" type="tel" label="เบอร์โทรศัพท์" :disabled="disabled"/>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-textarea v-model="form.address" name="address" label="ที่อยู่" :disabled="disabled"/>
                </v-col>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-container v-if="!disabled" class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/management/user/')">ย้อนหลับ</v-btn>
          <v-btn elevation="2" large color="success" @click="onSubmit">บันทึก</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      // UploadImage: () => import('~/components/UploadImage.vue'),
      SelectDropdown: () => import('~/components/SelectDropdown.vue'),
    },
    data () {
      return {
        valid: true,
        form: {
          employeeId: '',
          thaiId: '',
          thaiFristName: '',
          thaiLastName: '',
          engFristName: '',
          engLastName: '',
          username: '',
          password: '',
          ouId: null,
          departmentId: null,
          positionId: null,
          roleName: '',
          phone: '',
          email: '',
          address: ''
        },
        formExpand: [0],
        items: [
          { id: 1, name: 'Foo' },
          { id: 2, name: 'Bar' },
          { id: 3, name: 'Fizz' },
          { id: 4, name: 'Buzz' },
          { id: 5, name: 'Foo' },
          { id: 6, name: 'Bar' },
          { id: 7, name: 'Fizz' },
          { id: 8, name: 'Buzz' },
          { id: 9, name: 'Foo' },
          { id: 10, name: 'Bar' },
          { id: 11, name: 'Fizz' },
          { id: 12, name: 'Buzz' },
          { id: 13, name: 'Foo' },
          { id: 14, name: 'Bar' },
          { id: 15, name: 'Fizz' },
          { id: 16, name: 'Buzz' },
        ],
        roleList: [
          'ADMIN',
          'USER'
        ],
        seePassword: false,
        codeRules: [
          v => !!v || 'โปรดใส่รหัสพนักงาน',
        ],
        idCardRules: [
          v => v ? v.length === 13 || 'โปรดใส่รหัสบัตรประชาชนให้ครบ 13 หลัก' : 'โปรดใส่รหัสบัตรประชาชน',
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
          v => v ? this.$fn.checkEmailFormat(v) || 'โปรดใส่ E-Mail ให้ถูกต้อง' : 'โปรดใส่ E-Mail ผู้ใช้งาน'
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
      disabled () {
        return !this.$store.getters.isAdmin
      },
    },
    mounted () {
      if (!this.isCreate) this.getData()
    },
    methods: {
      async getData () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: 'user/getUser', query: { id: this.$route.params.user_id } })
          this.form = {
            ...data,
            ouId: data.organizationMaster.id,
            departmentId: data.departmentMaster.id,
            positionId: data.positionMaster.id
          }
          this.isLoading = false
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      async onSubmit () {
        const valid = this.$refs.form.validate()
        try {
          if (valid) {
            const apiPath = this.isCreate ? 'oauth/register' : 'user/update'
            const method = this.isCreate ? 'post' : 'patch'
            if (!this.isCreate) {
              this.form.organizationMaster = this.form.ouId
              this.form.departmentMaster = this.form.departmentId
              this.form.positionMaster = this.form.positionId
            }
            this.form.email = this.form.username
            const { data } = await this.$store.dispatch('http', { method, apiPath, data: this.form })
            await this.$store.dispatch('snackbar', { text: this.isCreate ? 'สร้างบุคลากรสำเร็จ' : 'แก้ไขบุคลากรสำเร็จ' })
            if (this.isCreate) this.$router.push('/management/user/')
            return Promise.resolve(data)
          } else {
            this.formExpand = [0]
            return Promise.resolve()
          }
        } catch (err) { return Promise.reject(err) }
      },
    }
  }
</script>

<style lang="scss">
  #management-user-detail-page {
  }
</style>