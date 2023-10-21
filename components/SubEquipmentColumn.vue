<template>
  <div class="sub-equipment-column">
    <v-btn icon @click="dialog = true">
      <i class="material-icons">info_outline</i>
    </v-btn>

    <v-dialog v-model="dialog" contentClass="sub-equipment-column-dialog" width="800">
      <v-card>
        <v-card-title class="text-h5 justify-space-between">
          <div><b>ครุภัณฑ์ย่อย</b></div>
          <v-btn icon @click="dialog = false">
            <i class="material-icons">close</i>
          </v-btn>
        </v-card-title>
        <v-card-text class="black--text pt-2 text-body-1">
          <div v-if="equipment"><b>ชื่อครุภัณฑ์:</b> {{ equipment.name }}</div>
          <Loading v-if="isLoading"/>
          <template v-else>
            <v-data-table v-if="subEquipments.length" :headers="headers" :items="subEquipments" :itemsPerPage="Infinity" disableSort hideDefaultFooter class="elevation-1 mt-2" :loading="isLoading"></v-data-table>
            <div v-else class="text-center text-h6 pt-5 pb-8">ไม่มีครุภัณฑ์ย่อย</div>
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      item: { type: Object, required: true }
    },
    data () {
      return {
        dialog: false,
        isLoading: true,
        equipment: null,
        subEquipments: [],
        headers: [
          { text: 'เลขที่ครุภัณฑ์ย่อย', value: 'number', width: '160px' },
          { text: 'ชื่อครุภัณฑ์ย่อย', value: 'name' },
        ]
      }
    },
    watch: {
      'dialog' (val) {
        if (val) this.getSubEquipment()
      },
    },
    methods: {
      async getSubEquipment () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: 'equipment/getSubEquipments', query: { equipmentId: this.item.id } })
          this.equipment = data.equipment
          this.subEquipments = data.subEquipmentModel || []
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
    },
  }
</script>

<style lang="scss">
  .sub-equipment-column {
  }
</style>