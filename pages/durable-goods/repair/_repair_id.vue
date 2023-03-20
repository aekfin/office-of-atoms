<template>
  <div id="durable-goods-repair-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มการส่งซ่อมครุภัณฑ์' : 'การแก้ไขการส่งซ่อมครุภัณฑ์'" hideTotal/>
    <Loading v-if="isLoading"/>

    <v-form v-else ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <CategoryDurableGood :initForm="initCategoryForm" noRules :disabled="!isCreate" @change="onChangeCategory"/>
        <v-row>
          <v-col :cols="12">
            <SelectDropdown v-if="isCreate" :value.sync="form.itemId" itemValue="id" itemText="name" label="ครุภัณฑ์ *" :rules="durableGoodsRules" apiPath="equipment/getEquipmentsAndFilter"
              :query="categoryForm" :disabled="!isCreate"/>
            <v-text-field v-else v-model="form.itemName" label="ครุภัณฑ์ *" disabled/>
          </v-col>
        </v-row>
      </v-container>

      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/durable-goods/repair/')">ย้อนกลับ</v-btn>
          <v-btn v-if="isCreate" class="ml-4" elevation="2" large color="success" @click="onSubmit">{{ `ส่งซ่อมครุภัณฑ์` }}</v-btn>
          <v-btn v-else class="ml-4" elevation="2" large color="success" @click="onRepair">{{ `ซ่อมครุภัณฑ์แล้ว` }}</v-btn>
        </v-row>
      </v-container>
    </v-form>
    <ConfirmDialog :value.sync="dialog" title="แจ้งเตือน" :text="errorText" hideSubmit closeText="รับทราบ"/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      Loading: () => import('~/components/Loading.vue'),
      CategoryDurableGood: () => import('~/components/CategoryDurableGood.vue'),
      SelectDropdown: () => import('~/components/SelectDropdown.vue'),
      ConfirmDialog: () => import('~/components/ConfirmDialog.vue'),
    },
    data () {
      return {
        valid: true,
        form: {
          dateSale: '',
          description: '',
          buyer: '',
          price: '',
          itemId: null
        },
        isLoading: false,
        datetimerepairRules: [
          v => !!v || `โปรดใส่วันที่ส่งซ่อม`,
        ],
        datetimeReturnRules: [
          v => !!v || 'โปรดใส่วันที่คืน',
        ],
        durableGoodsRules: [
          v => !!v || 'โปรดเลือกครุภัณฑ์',
        ],
        categoryForm: {},
        initCategoryForm: {},
        errorText: 'ไม่สามารถขอส่งซ่อมได้ เนื่องจากในกองหรือกลุ่มของท่านไม่มีผู้ที่มีสิทธิ์อนุมัติได้',
        dialog: false,
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.repair_id === 'create'
      },
    },
    watch: {
      'item' () {
        this.setForm()
      }
    },
    async mounted () {
      if (!this.isCreate) await this.getData()
      this.setForm()
    },
    methods: {
      async getData () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: `equipment/getEquipments/status/${this.$route.params.repair_id}`, query: this.$route.query })
          this.item = data
          this.initCategoryForm = {
            majorCategoryId: data.majorCategory.id,
            subCategoryId: data.subCategory.id,
            typeId: data.type.id,
            brandId: data.brand.id,
            modelId: data.model.id,
          }
          this.isLoading = false
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      setForm () {
        this.form = {
          itemId: null,
          itemName: this.item?.name || null,
        }
      },
      onChangeCategory ({ form }) {
        this.categoryForm = { ...form }
        this.form.itemId = null
      },
      async onRepair () {
        const valid = this.$refs.form.validate()
        if (valid) {
          try {
            const { data } = await this.$store.dispatch('http', { apiPath: `equipment/returnFromRepair/${this.$route.params.repair_id}`, query: { ...this.$route.query }, context: this })
            await this.$store.dispatch('snackbar', { text: 'ซ่อมครุภัณฑ์สำเร็จ' })
            this.$router.push('/durable-goods/repair/')
            return Promise.resolve(data)
          } catch (err) { return Promise.reject(err) }
        }
      },
      async onSubmit () {
        const valid = this.$refs.form.validate()
        if (valid) {
          try {
            const { data } = await this.$store.dispatch('http', { apiPath: `equipment/repair/${this.form.itemId}`, query: { ...this.$route.query }, context: this })
            if (data.status?.code == 400) {
              this.errorText = data.status.description.includes('invalid with status') ? 'ไม่สามารถขอส่งซ่อมได้ เนื่องจากครุภัณฑ์ดังกล่าวอยู่ในระหว่างการรออนุมัติอยู่หรืออื่นๆอยู่' : 'ไม่สามารถขอส่งซ่อมได้ เนื่องจากในกองหรือกลุ่มของท่านไม่มีผู้ที่มีสิทธิ์อนุมัติได้'
              this.dialog = true
            } else {
              await this.$store.dispatch('snackbar', { text: 'ส่งซ่อมครุภัณฑ์สำเร็จ' })
              this.$router.push('/durable-goods/repair/')
            }
            return Promise.resolve(data)
          } catch (err) { return Promise.reject(err) }
        }

      },
    }
  }
</script>

<style lang="scss">
  #durable-goods-repair-detail-page {
  }
</style>