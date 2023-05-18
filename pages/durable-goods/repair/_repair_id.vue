<template>
  <div id="durable-goods-repair-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มการส่งซ่อมครุภัณฑ์' : 'การแก้ไขการส่งซ่อมครุภัณฑ์'" hideTotal/>
    <Loading v-if="isLoading"/>

    <v-form v-else ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row>
          <v-col :cols="12" :md="4">
            <InputDatePicker :value.sync="form.dateRepair" label="วันที่ส่งซ่อม *" :rules="dateRepairRules" required :disabled="!isCreate"/>
          </v-col>
        </v-row>

        <NumberDurableGood :propNumber="form.item && form.item.number || ''" :disabled="!isCreate" @change="numberQuery = $event"/>

        <v-row>
          <v-col :cols="12">
            <SelectDropdown v-if="isCreate" :value.sync="form.itemId" itemValue="id" itemText="name" label="ครุภัณฑ์ *" :rules="durableGoodsRules" :apiPath="`equipment/getEquipments/statusAndDepartment?status=NEW&status=RETURNED`"
              :query="numberQuery" :disabled="!isCreate"/>
            <v-text-field v-else-if="form.item" v-model="form.item.name" label="ครุภัณฑ์ *" disabled/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12">
            <v-textarea v-model="form.description" label="หมายเหตุ" :rows="4" :disabled="!isCreate"/>
          </v-col>
        </v-row>

        <DurableGoodsOwner title="ผู้รับผิดชอบ" :organization.sync="form.organizationId" :department.sync="form.departmentId" :user.sync="form.userRepairId"
          :disabled="!isCreate" onlyUser :userList="form.userList"/>
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
      InputDatePicker: () => import('~/components/InputDatePicker.vue'),
      DurableGoodsOwner: () => import('~/components/DurableGoodsOwner.vue'),
      Loading: () => import('~/components/Loading.vue'),
      NumberDurableGood: () => import('~/components/NumberDurableGood.vue'),
      SelectDropdown: () => import('~/components/SelectDropdown.vue'),
      ConfirmDialog: () => import('~/components/ConfirmDialog.vue'),
    },
    data () {
      return {
        valid: true,
        item: null,
        form: {
          dateRepair: new Date(),
          description: '',
          itemId: null,
          userRepairId: '',
          userList: [],
          organizationId: '',
          departmentId: '',
        },
        isLoading: false,
        dateRepairRules: [
          v => !!v || `โปรดใส่วันที่ส่งซ่อม`,
        ],
        durableGoodsRules: [
          v => !!v || 'โปรดเลือกครุภัณฑ์',
        ],
        numberQuery: {},
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
          const { data } = await this.$store.dispatch('http', { apiPath: `equipment/getRequestDetail`, query: { id: this.$route.params.repair_id, ...this.$route.query } })
          const { data: user } = await this.$store.dispatch('http', { apiPath: `user/getUser`, query: { id: data.user.id, ...this.$route.query } })
          this.item = { ...data, user }
          this.isLoading = false
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      setForm () {
        const data = this.item
        this.form = {
          dateRepair: data?.dateBorrow ? this.$fn.convertStringToDate(data?.dateBorrow) : new Date(),
          description: data?.description || '',
          itemId: data?.items?.[0]?.equipment?.id || null,
          item: data?.items?.[0]?.equipment || null,
          userRepairId: data?.user?.id || '',
          userList: data?.user ? [data?.user] : [],
          organizationId: data?.user?.organizationMaster?.id || '',
          departmentId: data?.user?.departmentMaster?.id || '',
        }
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
            const form = {
              ...this.form,
              dateRepair: this.$fn.convertDateToString(this.form.dateRepair)
            }
            const { data } = await this.$store.dispatch('http', { method: 'post', apiPath: `equipment/repair/`, query: { ...this.$route.query }, data: form })
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