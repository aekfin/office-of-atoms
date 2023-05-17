<template>
  <v-row class="durable-goods-owner">
    <v-col :cols="12">
      <div class="text-h5"><b>{{ title }}</b></div>
    </v-col>
    <v-col :cols="12" :md="4">
      <SelectDropdown :value.sync="organizationId" :label="`กอง ${onlyUser ? '' : '*'}`" itemText="ouName" :rules="ouRules" required :disabled="disabled" apiPath="Orgchart/getOrganizations" @select="$emit('ouChange', $event)"/>
    </v-col>
    <v-col :cols="12" :md="4">
      <SelectDropdown :value.sync="departmentId" :label="`กลุ่ม ${onlyUser ? '' : '*'}`" itemText="departmentName" :rules="departmentRules" required :disabled="disabled" apiPath="Orgchart/getDepartments"/>
    </v-col>
    <v-col :cols="12" :md="4">
      <SelectDropdown :value.sync="userId" :label="`บุคคล ${onlyUser ? '*' : ''}`" :itemText="$fn.getName" required :disabled="disabledUser" :items="userList" apiPath="user/listUsers"
         :rules="userRules" :query="{ departmentId: departmentId, ouId: organizationId }"/>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    components: {
      SelectDropdown: () => import('~/components/SelectDropdown.vue'),
    },
    props: {
      organization: { type: [Number, String], default: '' },
      department: { type: [Number, String], default: '' },
      user: { type: [Number, String], default: '' },
      userList: { type: Array, default: () => [] },
      disabled: { type: Boolean },
      title: { type: String, default: 'ผู้ครอบครอง' },
      onlyUser: { type: Boolean },
    },
    data () {
      return {
        organizationId: this.organization,
        departmentId: this.department,
        userId: this.user,
        ouRules: [
          v => this.onlyUser || !!v || 'โปรดเลือกกอง',
        ],
        departmentRules: [
          v => this.onlyUser || !!v || 'โปรดเลือกกลุ่ม',
        ],
        userRules: [
          v => !this.onlyUser || !!v || 'โปรดเลือกบุคคล',
        ],
      }
    },
    computed: {
      disabledUser () {
        return (!this.onlyUser && (!this.organizationId || !this.departmentId)) || this.disabled
      },
    },
    watch: {
      'organization' (val) {
        this.organizationId = val
      },
      'department' (val) {
        this.departmentId = val
      },
      'user' (val) {
        this.userId = val
      },
      'organizationId' (val) {
        this.userId = null
        this.$emit('update:organization', val)
      },
      'departmentId' (val) {
        this.userId = null
        this.$emit('update:department', val)
      },
      'userId' (val) {
        this.$emit('update:user', val)
      },
    },
  }
</script>

<style lang="scss">
  .durable-goods-owner {
  }
</style>