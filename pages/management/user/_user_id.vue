<template>
  <div id="management-user-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มบุคลากร' : 'การแก้ไขบุคลากร'" hideTotal/>
    <Loading v-if="isLoading"/>
    <v-form v-else ref="form" v-model="valid" lazyValidation class="mt-4 relative">
      <v-container>
        <v-row>
          <v-col v-if="!isCreate" :cols="12">
            <v-text-field v-model="form.employeeId" name="code" label="รหัสพนักงาน *" :rules="codeRules" required :disabled="disabled || !isCreate"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" :md="6">
            <v-text-field v-model="form.thaiFristName" label="ชื่อ *" :rules="fistNameThRules" required :disabled="disabled"/>
          </v-col>
          <v-col :cols="12" :md="6">
            <v-text-field v-model="form.thaiLastName" label="นามสกุล *" :rules="lastNameThRules" required :disabled="disabled"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" :md="6">
            <v-text-field v-model="form.engFristName" label="ชื่อ (Eng) *" :rules="fistNameEnRules" required :disabled="disabled"/>
          </v-col>
          <v-col :cols="12" :md="6">
            <v-text-field v-model="form.engLastName" label="นามสกุล (Eng) *" :rules="lastNameEnRules" required :disabled="disabled"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" :md="6">
            <SelectDropdown :value.sync="form.positionId" label="ตำแหน่ง *" :rules="positionRules" itemText="positionName" required apiPath="Orgchart/getPositions" :disabled="disabled" @loaded="positionList = $event"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" :md="6">
            <SelectDropdown :value.sync="form.ouId" label="กอง *" itemText="ouName" :rules="ouRules" required apiPath="Orgchart/getOrganizations" :disabled="disabled"/>
          </v-col>
          <v-col :cols="12" :md="6">
            <SelectDropdown :value.sync="form.departmentId" label="กลุ่ม *" itemText="departmentName" :rules="departmentRules" required apiPath="Orgchart/getDepartments" :disabled="disabled || disabledByPosition"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" :md="6">
            <v-text-field v-model="form.username" label="E-Mail ผู้ใช้งาน *" :rules="usernameRules" name="email" required :disabled="disabled || !isCreate"/>
          </v-col>
          <v-col :cols="12" :md="6">
            <SelectDropdown :value.sync="form.roleName" :items="roleList" label="สิทธ์การใช้งาน *" :rules="roleRules" multiple required :disabled="disabled"/>
          </v-col>
          <!-- <v-col :cols="6">
            <v-text-field v-model="form.password" label="รหัสผ่าน *" :type="seePassword ? 'text' : 'password'" :rules="passwordRules" required :disabled="disabled">
              <template #append>
                <i class="material-icons pointer" @click="seePassword = !seePassword" v-text="seePassword ? 'password' : 'remove_red_eye'"/>
              </template>
            </v-text-field>
          </v-col> -->
        </v-row>
      </v-container>
      <v-expansion-panels v-model="formExpand" class="form-expansion-panels" flat multiple accordion>
        <v-expansion-panel>
          <v-expansion-panel-header>
            ข้อมูลติดต่อ
            <template #actions>
              <i class="material-icons">keyboard_arrow_down</i>
            </template>
          </v-expansion-panel-header>
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
          <v-btn large plain @click="$router.push('/management/user/')">ย้อนกลับ</v-btn>
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
      Loading: () => import('~/components/Loading.vue'),
    },
    data () {
      return {
        valid: true,
        isLoading: false,
        form: {
          employeeId: '',
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
        disabledByPosition: false,
        formExpand: [0],
        roleList: [
          'ADMIN',
          'TREASURY',
          'TREASURY_MANAGER',
          'STAFF',
          'USER',
        ],
        seePassword: false,
        positionList: [],
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
        ouRules: [
          v => !!v || 'โปรดใส่กอง',
        ],
        departmentRules: [
          v => !!v || this.disabledByPosition || 'โปรดใส่กลุ่ม',
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
    watch: {
      'form.positionId' (val) {
        const position = this.positionList.find(position => position.id == val)
        if (position?.positionName === 'ผ.อ. กองงาน') {
          this.form.departmentId = null
          this.disabledByPosition = true
        } else {
          this.disabledByPosition = false
        }     
      }
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
            departmentId: data.departmentMaster?.id || null,
            positionId: data.positionMaster.id
          }
          if (!data.departmentMaster) {
            this.positionList = [data.positionMaster]
            this.disabledByPosition = true
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
            const form = { ...this.form }
            if (!this.isCreate) {
              form.organizationMaster = this.form.ouId
              form.departmentMaster = this.form.departmentId
              form.positionMaster = this.form.positionId
            }
            form.email = this.form.username
            if (this.disabledByPosition) {
              delete form.departmentId
            }
            const { data } = await this.$store.dispatch('http', { method, apiPath, data: form })
            if(data.code == '200'){
              await this.$store.dispatch('snackbar', { text: this.isCreate ? 'สร้างบุคลากรสำเร็จ' : 'แก้ไขบุคลากรสำเร็จ' })
            }else{
              await this.$store.dispatch('snackbar', { text: this.isCreate ? 'สร้างบุคลากรไม่สำเร็จ' : 'แก้ไขบุคลากรไม่สำเร็จ' })
            }
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