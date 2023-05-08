<template>
  <div id="durable-good-sub-detail">
    <PageHeader :text="isCreate ? 'การเพิ่มครุภัณฑ์ย่อย' : 'การแก้ไขครุภัณฑ์ย่อย'" hideTotal/>
    <v-form ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <h5 class="text-h5 mb-4"><b>รายละเอียดครุภัณฑ์หลัก</b></h5>
      </v-container>

      <v-container>
        <AddSubEquipment/>
      </v-container>

      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push($route.query.backPath)">ย้อนกลับ</v-btn>
          <v-btn v-if="isCreate" elevation="2" large color="success" @click="onSubmit">บันทึก</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      AddSubEquipment: () => import('~/components/AddSubEquipment.vue'),
    },
    data () {
      return {
        valid: true,
        isLoading: false,
        equipment: null,
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.sub_id === 'create'
      },
    },
    mounted () {
      this.getEquipment()
    },
    methods: {
      async getEquipment () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: `equipment/${this.$route.params.durable_goods_id}` })
          this.equipment = data
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      async onSubmit () {

      },
    },
  }
</script>

<style lang="scss">
  #durable-good-sub-detail {
  }
</style>