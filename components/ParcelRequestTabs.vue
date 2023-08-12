<template>
  <v-tabs class="parcel-request-tabs tabs-underline mb-10" exact exactPath>
    <v-tab :to="{ path: `/parcel/${isAll ? 'all-' : ''}request/` }">
      <div>เบิกวัสดุคงคลัง</div>
      <v-badge v-if="externalCount && !isAll" class="ml-2 mr-2" color="red" :content="externalCount"/>
    </v-tab>
    <v-tab :to="{ path: `/parcel/${isAll ? 'all-' : ''}request/department/` }">
      <div>ภายในกลุ่ม</div>
      <v-badge v-if="internalCount && !isAll" class="ml-2 mr-2" color="red" :content="internalCount"/>
    </v-tab>
  </v-tabs>
</template>

<script>
  export default {
    props: {
      isAll: { type: Boolean },
    },
    computed: {
      externalCount () {
        return this.$store.state.approveRequest?.totalElements || 0
      },
      internalCount () {
        return this.$store.state.approveRequestDepartment?.totalElements || 0
      }
    },
  }
</script>

<style lang="scss">
  .parcel-request-tabs {
  }
</style>