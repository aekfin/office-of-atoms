<template>
  <div id="project-create-page">
    <PageHeader :text="isCreate ? 'การเพิ่มบุคลากร' : 'การแก้ไขบุคลากร'"/>
    <v-form ref="form" v-model="valid" lazyValidation class="mt-8">
      <v-container>
        <v-row>
          <div style="width: 200px;">
            <div class="mt-8" style="background-color: grey; width: 200px; height: 200px; border-radius: 50%;"/>
          </div>
          <v-col>
            <v-text-field v-model="form.code" name="code" label="รหัสพนักงาน*" required/>
            <v-text-field v-model="form.fistNameTh" label="ชื่อ*" required/>
            <v-text-field v-model="form.fistNameEn" label="ชื่อ (Eng)"/>
            <v-select v-model="form.division" :items="items" itemValue="id" itemText="name" label="กอง"/>
            <v-text-field v-model="form.username" label="รหัสผู้ใช้งาน"/>
            <v-text-field v-model="form.password" label="รหัสผ่าน" :type="seePassword ? 'text' : 'password'">
              <template #append><v-icon @click="seePassword = !seePassword" v-text="`mdi-eye${seePassword ? '-off' : ''}`"/></template>
            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="form.idCard" label="รหัสบัตรประชาชน*"/>
            <v-text-field v-model="form.lastNameTh" label="นามสกุล"/>
            <v-text-field v-model="form.lastNameEn" label="นามสกุล (Eng)"/>
            <v-select v-model="form.group" :items="items" itemValue="id" itemText="name" label="กลุ่ม"/>
            <v-select v-model="form.position" :items="items" itemValue="id" itemText="name" label="ตำแหน่ง"/>
            <v-select v-model="form.role" :items="items" itemValue="id" itemText="name" label="สิทธ์การใช้งาน"/>
          </v-col>
        </v-row>
        <v-row class="mt-12" justify="end">
          <v-btn elevation="2" large color="success">บันทึก</v-btn>
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
          role: null
        },
        items: [
          { id: 1, name: 'Foo' },
          { id: 2, name: 'Bar' },
          { id: 3, name: 'Fizz' },
          { id: 4, name: 'Buzz' }
        ],
        seePassword: false
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.staff_id === 'create'
      }
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
  }
</style>