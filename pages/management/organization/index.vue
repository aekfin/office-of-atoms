<template>
  <div id="organization-page">
    <v-tabs class="parcel-request-tabs tabs-underline mb-10" exact exactPath>
      <v-tab :to="{ path: `/management/organization/` }">
        <div>กอง</div>
      </v-tab>
      <v-tab :to="{ path: `/management/organization/department/` }">
        <div>กลุ่ม</div>
      </v-tab>
    </v-tabs>
    <NChild/>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tabIndex: 0,
      }
    },
    methods: {
    }
  }
</script>

<style lang="scss">
  #organization-page {
  }
</style>