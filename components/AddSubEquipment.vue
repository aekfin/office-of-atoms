<template>
  <div class="add-sub-equipment">
    <h5 class="text-h5 mb-4"><b>เพิ่มครุภัณฑ์ย่อย</b></h5>
    <CategoryDurableGood :cols="3" @change="({ form }) => categoryForm = form">
      <template #default>
        <v-col :cols="12" :md="9">
          <v-text-field v-model="name" name="name" label="ชื่อครุภัณฑ์ย่อย *" :rules="nameRules" required/>
        </v-col>
      </template>
    </CategoryDurableGood>
    <v-row>
      <v-col :cols="12" :md="3">
        <div class="d-flex align-center">
          <v-text-field v-model="number" name="code" label="เลขที่ครุภัณฑ์ *"/>
        </div>
      </v-col>
      <v-col :cols="12" :md="3">
        <v-text-field v-model="serialNumber" label="หมายเลขซีเรียล"/>
      </v-col>
      <v-col :cols="12" :md="3">
        <v-text-field v-model="assetNumber" label="เลขที่สินทรัพย์"/>
      </v-col>
      <v-col :cols="12" :md="3">
        <v-text-field v-model="assetNumberAorWor" label="เลขที่สินทรัพย์ อว."/>
      </v-col>
        </v-row>
  </div>
</template>

<script>
  export default {
    components: {
      CategoryDurableGood: () => import('~/components/CategoryDurableGood.vue'),
    },
    data () {
      return {
        name: '',
        number: '',
        serialNumber: '',
        assetNumber: '',
        assetNumberAorWor: '',
        categoryForm: {},
        nameRules: [
          v => !!v || 'โปรดใส่ชื่อ',
        ],
      }
    }
  }
</script>

<style lang="scss">
  .add-sub-equipment {
  }
</style>