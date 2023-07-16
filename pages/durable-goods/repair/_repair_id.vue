<template>
  <div id="durable-goods-repair-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มการส่งซ่อมครุภัณฑ์' : 'จัดการการซ่อมครุภัณฑ์'" hideTotal/>
    <Loading v-if="isLoading"/>
    <template v-else>
      <v-stepper v-if="!isCreate && item" v-model="step" class="mt-10 mb-10" altLabels>
        <v-stepper-header>
          <v-stepper-step :step="1" color="success" complete completeIcon="check" editIcon="edit">{{ `ยื่นการส่งซ่อม` }}</v-stepper-step>
          <template v-for="flow in item.flows">
            <v-divider :key="flow.id"/>
            <v-stepper-step :key="flow.id" :step="flow.orderApprove + 1" :color="isColor(flow)" :complete="isComplete(flow)" completeIcon="check" editIcon="edit">
              <v-tooltip bottom :disabled="!getApproverText(flow)">
                <template #activator="{ on, attrs }">
                  <div v-bind="attrs" class="text-center" v-on="on">
                    <div>{{ getStepText(flow) }}</div>
                    <div v-if="flow.position" class="mt-2" style="font-size: 0.9rem">{{ flow.position }}</div>
                  </div>
                </template>
                <span>{{ getApproverText(flow) }}</span>
              </v-tooltip>
            </v-stepper-step>
          </template>
        </v-stepper-header>
      </v-stepper>

      <v-form ref="form" v-model="valid" lazyValidation class="mt-4">
        <v-container>
          <v-row>
            <v-col :cols="12" :md="4">
              <InputDatePicker :value.sync="form.dateRepair" label="วันที่ส่งซ่อม *" :rules="dateRepairRules" required :disabled="!isCreate"/>
            </v-col>
          </v-row>

          <NumberDurableGood ref="numberDurableGood" :propNumber="form.item && form.item.number || ''" :disabled="!isCreate" @change="numberQuery = $event"/>

          <v-row>
            <v-col :cols="12">
              <SelectDropdown v-if="isCreate" :value.sync="form.itemId" itemValue="id" itemText="name" label="ครุภัณฑ์ *" :rules="durableGoodsRules" :apiPath="`equipment/getEquipments/statusAndDepartment?status=NEW&status=RETURNED`"
                :query="numberQuery" :disabled="!isCreate" @select="getWarranty"/>
              <v-text-field v-else-if="form.item" v-model="form.item.name" label="ครุภัณฑ์ *" disabled/>
              <div>
                <v-alert v-if="warranty === true" border="left" color="success" dark>ครุภัณฑ์ อยู่ในระยะประกัน</v-alert>
                <v-alert v-else-if="warranty === false" border="left" color="error" dark>ครุภัณฑ์ ไม่อยู่ในระยะประกัน</v-alert>
                <v-alert v-else-if="warranty && warranty !== null" color="secondary" border="left" dark>ครุภัณฑ์ ไม่ระบุระยะประกัน</v-alert>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col :cols="12">
              <v-textarea v-model="form.description" label="หมายเหตุ" :rows="4" :disabled="!isCreate"/>
            </v-col>
          </v-row>

          <DurableGoodsOwner v-if="isCreate" title="หน่วยงานรับซ่อม" :organization.sync="form.organizationId" :department.sync="form.departmentId" :user.sync="form.userRepairId"
            :disabled="!isCreate" onlyUser :userList="form.userList"/>

          <v-row v-if="item">
            <v-col>
              <b class="mr-1" style="font-size: 18px;">สถานะการซ่อม : </b>
              <v-chip :color="repairColor[getRepairLabel(item)]">{{ getRepairLabel(item) }}</v-chip>
            </v-col>
          </v-row>

          <v-row v-if="item && item.remarks">
            <v-col :cols="12">
              <div class="text-h5"><b>เหตุผล</b></div>
            </v-col>
            <v-col :cols="12">
              <v-textarea v-model="item.remarks" label="เหตุผล" :rows="4" disabled/>
            </v-col>
          </v-row>
        </v-container>

        <v-container class="mt-8">
          <v-row justify="end">
            <v-btn large plain @click="$router.push(isRequester || isCreate ? '/durable-goods/repair/' : '/durable-goods/request/repair/')">ย้อนกลับ</v-btn>
            <v-btn v-if="isCreate" class="ml-4" elevation="2" large color="success" @click="onSubmit">{{ `ส่งซ่อมครุภัณฑ์` }}</v-btn>
            <template v-else-if="isApprover">
              <v-btn class="mr-4" elevation="2" large color="error" @click="() => { onConfirm('ซ่อมไม่ได้') }">ซ่อมไม่ได้</v-btn>
              <v-btn elevation="2" large color="success" @click="() => { onConfirm('ซ่อมสำเร็จ') }">ซ่อมสำเร็จ</v-btn>
            </template>
            <template v-else-if="isRequester && isNotRepair">
              <v-btn class="mr-4" elevation="2" large color="error" @click="() => { onConfirm('ไม่ส่งซ่อมภายนอก') }">ไม่ส่งซ่อมภายนอก</v-btn>
              <v-btn class="mr-4" elevation="2" large color="success" @click="() => { onConfirm('ส่งซ่อมภายนอก') }">ส่งซ่อมภายนอก</v-btn>
            </template>
          </v-row>
        </v-container>
      </v-form>
    </template>

    <ConfirmDialog :value.sync="dialog" title="แจ้งเตือน" :text="errorText" hideSubmit closeText="รับทราบ"/>
    <ConfirmDialog :value.sync="confirmDialog" :title="`ยืนยันการ${repairedText}`" :customConfirm="onAction" :submitColor="submitColor" :confirmText="repairedText">
      <v-form ref="confirmForm" v-model="confirmValid" lazyValidation>
        <v-row>
          <v-col :cols="12">
            <v-textarea v-model="reasonRepair" :label="`เหตุผล ${requireReason ? '*' : ''}`" :rows="4" :rules="requireReason ? reasonRepairRules : []"/>
          </v-col>
        </v-row>
      </v-form>
    </ConfirmDialog>
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
        confirmValid: true,
        step: 1,
        item: null,
        reasonRepair: '',
        warranty: null,
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
        reasonRepairRules: [
          v => !!v || 'โปรดใส่เหตุผล',
        ],
        numberQuery: {},
        errorText: 'ไม่สามารถขอส่งซ่อมได้ เนื่องจากในกองหรือกลุ่มของท่านไม่มีผู้ที่มีสิทธิ์อนุมัติได้',
        dialog: false,
        confirmDialog: false,
        repairedText: '',
        repairColor: {
          'สำเร็จ': 'success',
          'ไม่สำเร็จ': 'error',
          'รอซ่อมภายนอก': 'secondary',
          'รอซ่อม': 'warning',
        },
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.repair_id === 'create'
      },
      currentFlow () {
        return this.item?.flows?.find(flow => flow?.status === 'PENDING') || null
      },
      isRequester () {
        return this.$store.state.userProfile?.id === this.item?.user?.id
      },
      isApprover () {
        return this.currentFlow?.canApprove === 'true'
      },
      isReject () {
        return this.item && this.item.status === 'REJECT'
      },
      isNotRepair () {
        return this.item?.canRepair === false && this.item?.status === 'PENDING'
      },
      requireReason () {
        return ['ซ่อมไม่ได้', 'ส่งซ่อมภายนอก', 'ไม่ส่งซ่อมภายนอก'].includes(this.repairedText)
      },
      submitColor () {
        return ['ซ่อมไม่ได้', 'ไม่ส่งซ่อมภายนอก'].includes(this.repairedText) ? 'error' : 'success'
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
      getApproverText (flow) {
        return flow?.emails?.reduce((str, email, i) => `${str}${i > 0 ? ', ' : ''}${email}`, 'ผู้อนุมัติ : ') || false
      },
      getStepText (flow) {
        return this.$store.state.approveStatus[flow?.status || 'PENDING']
      },
      isColor (item) {
        return this.$store.state.approveStatusColor[item?.status] || 'grey'
      },
      isComplete (item) {
        return item?.status === 'APPROVE'
      },
      getRepairLabel (item) {
        if (item.status === 'PENDING') {
          if (item.remarks) return 'รอซ่อมภายนอก'
          else return 'รอซ่อม'
        } else if (item.status === 'SUCCESS') {
          if (item.canRepair) return 'สำเร็จ'
          else return 'ไม่สำเร็จ'
        }
      },
      async getData () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: `equipment/getRequestDetail`, query: { id: this.$route.params.repair_id, ...this.$route.query } })
          this.item = { ...data }
          await this.getWarranty({ item: this.item })
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
      async getWarranty ({ item }) {
        try {
          if (item && this.$refs.numberDurableGood) this.$refs.numberDurableGood.onlyUpdateFields(item)
          const { data } = await this.$store.dispatch('http', { apiPath: `equipment/project/Warranty/${item.id}`, query: this.$route.query })
          this.warranty = data?.status?.code == 200 ? data?.data : ' '
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      onConfirm (repairedText = '') {
        const valid = this.$refs.form.validate()
        if (valid) {
          this.reasonRepair = this.item.remarks || ''
          this.confirmDialog = true
          this.repairedText = repairedText
        }
      },
      async onAction () {
        this.isLoading = true
        this.confirmDialog = false
        if (this.repairedText === 'ซ่อมสำเร็จ') await this.onRepair()
        else if (this.repairedText === 'ส่งซ่อมภายนอก') await this.onExternaRepair()
        else if (this.repairedText === 'ไม่ส่งซ่อมภายนอก') await this.onExternalReject()
        else await this.onReject()
        await this.getData()
        this.isLoading = false
      },
      async onRepair () {
        const valid = this.$refs.confirmForm.validate()
        if (valid) {
          try {
            const query = {
              flowId: this.item.flows[0].id,
              canRepair: true,
              reasonRepair: this.reasonRepair,
            }
            const { data } = await this.$store.dispatch('http', { apiPath: 'equipment/approve', query: { ...this.$route.query, ...query } })
            await this.$store.dispatch('snackbar', { text: 'ซ่อมครุภัณฑ์สำเร็จ' })
            return Promise.resolve(data)
          } catch (err) { return Promise.reject(err) }
        }
      },
      async onReject () {
        const valid = this.$refs.confirmForm.validate()
        if (valid) {
          try {
            const query = {
              flowId: this.item.flows[0].id,
              canRepair: false,
              reasonRepair: this.reasonRepair,
            }
            const { data } = await this.$store.dispatch('http', { apiPath: 'equipment/approve', query: { ...this.$route.query, ...query } })
            await this.$store.dispatch('snackbar', { text: 'ซ่อมครุภัณฑ์ไม่สำเร็จ' })
            return Promise.resolve(data)
          } catch (err) { return Promise.reject(err) }
        }
      },
      async onExternaRepair () {
        const valid = this.$refs.confirmForm.validate()
        if (valid) {
          try {
            const query = {
              id: this.item.id,
              canRepair: true,
              reasonRepair: this.reasonRepair,
            }
            const { data } = await this.$store.dispatch('http', { apiPath: 'equipment/outSourceRepair', query: { ...this.$route.query, ...query } })
            await this.$store.dispatch('snackbar', { text: 'ส่งซ่อมครุภัณฑ์ภายนอกสำเร็จ' })
            return Promise.resolve(data)
          } catch (err) { return Promise.reject(err) }
        }
      },
      async onExternalReject () {
        const valid = this.$refs.confirmForm.validate()
        if (valid) {
          try {
            const query = {
              id: this.item.id,
              canRepair: false,
              reasonRepair: this.reasonRepair,
              updateStatus: 'WAIT_SALE',
            }
            const { data } = await this.$store.dispatch('http', { apiPath: 'equipment/outSourceRepair', query: { ...this.$route.query, ...query } })
            await this.$store.dispatch('snackbar', { text: 'ไม่ส่งซ่อมครุภัณฑ์ภายนอกสำเร็จ' })
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
            const { data } = await this.$store.dispatch('http', { method: 'post', apiPath: `equipment/repair`, query: { ...this.$route.query }, data: form })
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