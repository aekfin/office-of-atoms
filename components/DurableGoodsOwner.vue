<template>
  <v-row class="durable-goods-owner">
    <v-col :cols="12">
      <div class="text-h5"><b>ผู้ครอบครอง</b></div>
    </v-col>
    <v-col :cols="12" :md="4">
      <SelectDropdown :value.sync="organizationId" label="กอง *" itemText="ouName" :rules="ouRules" required :disabled="disabled" apiPath="Orgchart/getOrganizations" @select="$emit('ouChange', $event)"/>
    </v-col>
    <v-col :cols="12" :md="4">
      <SelectDropdown :value.sync="departmentId" label="กลุ่ม *" itemText="departmentName" :rules="departmentRules" required :disabled="disabled" apiPath="Orgchart/getDepartments"/>
    </v-col>
    <v-col :cols="12" :md="4">
      <SelectDropdown :value.sync="userId" label="บุคคล" :itemText="$fn.getName" required :disabled="!organizationId || !departmentId || disabled" :items="userList" apiPath="user/listUsers"
        :query="{ departmentId: departmentId, ouId: organizationId }"/>
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
    },
    data () {
      return {
        organizationId: this.organization,
        departmentId: this.department,
        userId: this.user,
        ouRules: [
          v => !!v || 'โปรดเลือกกอง',
        ],
        departmentRules: [
          v => !!v || 'โปรดเลือกกลุ่ม',
        ],
      }
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