<template>
  <div id="parcel-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มพัสดุ' : 'การแก้ไขพัสดุ'" hideTotal/>
    <v-form ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>

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
          name: '',
        }
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.parcel_id === 'create'
      },
    },
    methods: {
      onSubmit () {
        this.$refs.form.validate()
      },
    }
  }
</script>

<style lang="scss">
  #parcel-detail-page {
  }
</style>