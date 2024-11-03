<template>
  <div class="durable-goods-borrow-form">
    <v-stepper v-if="viewMode && item" v-model="step" class="mt-10 mb-10" altLabels>
      <v-stepper-header>
        <v-stepper-step :step="1" color="success" complete completeIcon="check" editIcon="edit">{{ `ยื่นการ${type}` }}</v-stepper-step>
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

    <v-form v-if="form" ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row>
          <v-col :cols="12" :md="4">
            <InputDatePicker :value.sync="form.dateBorrow" :label="`วันที่${type}ครุภัณฑ์ *`" :rules="datetimeBorrowRules" required :disabled="viewMode && !forEdit"/>
          </v-col>
          <v-col v-if="type === 'ยืม'" :cols="12" :md="4">
            <InputDatePicker :value.sync="form.dueDate" label="วันที่ต้องคืนครุภัณฑ์ *" :rules="datetimeReturnRules" required :disabled="viewMode && !forEdit"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12">
            <v-textarea v-model="form.description" label="หมายเหตุ" :rows="4" :disabled="viewMode && !forEdit"/>
          </v-col>
        </v-row>
      </v-container>

      <template v-if="!hideOwner">
        <!-- <h5 class="text-h5 mt-5"><b>{{ `ผู้ครอบครอง` }}</b></h5> -->
        <v-container>
          <v-row>
            <!-- <v-col :cols="12" :md="6">
              <v-text-field v-if="viewMode" v-model="form.organization.ouName" label="กอง" :disabled="viewMode"/>
              <SelectDropdown v-else :value.sync="organizationId" apiPath="Orgchart/getOrganizations" itemValue="id" itemText="ouName" label="กอง" @select="onSelectOrganization"/>
            </v-col>
            <v-col :cols="12" :md="6">
              <v-text-field v-if="viewMode" v-model="form.department.departmentName" label="กลุ่ม" :disabled="viewMode"/>
              <SelectDropdown v-else :value.sync="departmentId" apiPath="Orgchart/getDepartments" itemValue="id" itemText="departmentName" label="กลุ่ม" @select="onSelectDepartment"/>
            </v-col> -->
            <!-- <v-col :cols="12" :md="6">
              <v-text-field v-if="viewMode  && !forEdit" v-model="form.organization.ouName" label="กอง" :disabled="viewMode  && !forEdit"/>
              <SelectDropdown v-else :value.sync="form.organization.id" apiPath="Orgchart/getOrganizations" itemValue="id" itemText="ouName" label="กอง" @select="onSelectOrganization"/>
            </v-col>
            <v-col :cols="12" :md="6">
              <v-text-field v-if="viewMode  && !forEdit" v-model="form.department.departmentName" label="กลุ่ม" :disabled="viewMode && !forEdit"/>
              <SelectDropdown v-else :value.sync="form.department.id" apiPath="Orgchart/getDepartments" itemValue="id" itemText="departmentName" label="กลุ่ม" @select="onSelectDepartment"/>
            </v-col> -->
            <v-col>
              <DurableGoodsOwner :organization.sync="ouId" :department.sync="departmentId" :hideUser="true"  @ouChange="onOuChange">
              </DurableGoodsOwner> 
            </v-col>
          </v-row>
        </v-container>
      </template>

      <!-- <h5 class="text-h5 mt-5"><b>{{ `เลือกครุภัณฑ์ที่ต้องการ${type}` }}</b></h5> -->
      <h5 v-else class="text-h5 mt-5"><b>รายการครุภัณฑ์</b></h5>
      <v-container class="mt-2"> 
        <template>
          <!-- <div> -->
          <div v-for="(equipment, i) in equipments" :key="i">            
            <div>ครุภัณฑ์ รายการที่ {{ i + 1 }}.</div>    
            <!-- <v-text-field v-model="form.number" label="เลขที่ครุภัณฑ์" :disabled="toggleEdit()" @change="onChangeNumber"/> -->
            <EquipmentNumberDropdown v-model="equipment.initCategoryFormList.equipment.number" itemValue="number" itemText="number" label="เลขที่ครุภัณฑ์ *" apiPath="equipment/equipmentByKeyword" 
                    :rules="ouNameRules" required :majorCategoryId="form.majorCategoryId" :subCategoryId="form.subCategoryId" :typeId="form.typeId" @select="onSelectEquipmentNumber"/>                
            <CategoryDurableGood :key="categoryKey" :initCategory="equipment.initCategoryFormList" :disabled="true" noRules :itemEquipment="itemEquipment" 
            @change="onChangeCategory">
              <v-col :cols="12" :md="9">
                  <v-text-field v-if="viewMode && !onCategoryChange" v-model="equipment.initCategoryFormList.equipment.name" label="ครุภัณฑ์ *" :disabled="true"/>
                
              </v-col>
            </CategoryDurableGood>
          </div>
        </template>
      </v-container>

      <!-- <h5 class="text-h5 mt-5"><b>{{ `เลือกครุภัณฑ์ที่ต้องการ${type}` }}</b></h5>
      <v-container class="mt-2"> 
        <template>
          <div>
            <EquipmentNumberDropdown v-model="form.number" itemValue="number" itemText="number" label="เลขที่ครุภัณฑ์ *" apiPath="equipment/equipmentByKeyword" 
                    :rules="ouNameRules" required :majorCategoryId="form.majorCategoryId" :subCategoryId="form.subCategoryId" :typeId="form.typeId" @select="onSelectEquipmentNumber"/>                
            <CategoryDurableGood :key="categoryKey" :initCategory="initCategoryForm" :disabled="true" noRules :itemEquipment="itemEquipment" 
            @change="onChangeCategory">
              <v-col :cols="12" :md="9">
                  <v-text-field v-if="viewMode && !onCategoryChange" v-model="form.item.equipment.name" label="ครุภัณฑ์ *" :disabled="true"/>
                <SelectDropdown  v-else :value.sync="form.itemId" itemValue="id" itemText="name" label="ครุภัณฑ์ *" :rules="durableGoodsRules" :items="equipmentList" :apiPath="apiPath"
                  :query="{ ...categoryForm, ...ownerForm }" :disabled="toggleEdit()" @select="onChangeEquipment"/>
              </v-col>
            </CategoryDurableGood>
          </div>
        </template>
      </v-container> -->

      <v-container v-if="isReturned">
        <AttachFileBtn :value.sync="attachFiles" :attachments="files" accept="*" :multiple="false" :disabled="!isApprover" @removeAttachment="onRemoveFile"/>
      </v-container>

      <v-container class="mt-8">
        <v-row v-if="isApprover" justify="end">
          <v-btn large plain @click="$router.push(backPath)">ย้อนกลับ</v-btn>
          <v-btn v-if="!isReject" class="mr-4" elevation="2" large outlined color="error" @click="onReject">ไม่อนุมัติ</v-btn>
          <v-btn v-if="!isReject" elevation="2" large color="success" @click="onApprove">อนุมัติ</v-btn>
        </v-row>
        <v-row v-else justify="end">
          <v-btn v-if="viewMode" large plain @click="$router.push(backPath)">ย้อนกลับ</v-btn>
          <v-btn v-else large plain @click="$router.push(backPath)">ย้อนกลับ</v-btn>
          <v-btn v-if="!viewMode" class="ml-4" elevation="2" large color="success" @click="onSubmit">{{ `ยื่นขอ${type}` }}</v-btn>          
          <v-btn v-if="isVisibleProject === 'on'" class="ml-4" elevation="2" large color="success" @click="onEditWithdraw">บันทึก</v-btn>
          <v-btn v-if="viewMode && forEdit" class="ml-4" elevation="2" large color="success" @click="onEdit">บันทึก</v-btn>
          <!-- <v-btn elevation="2" large color="success" @click="onSubmit">บันทึก</v-btn> -->
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
  export default {
    components: {
      // SelectDropdown: () => import('~/components/SelectDropdown.vue'),
      InputDatePicker: () => import('~/components/InputDatePicker.vue'),
      CategoryDurableGood: () => import('~/components/CategoryDurableGood.vue'),
      AttachFileBtn: () => import('~/components/AttachFileBtn.vue'),
      EquipmentNumberDropdown: () => import('~/components/EquipmentNumberDropdown.vue'),
    },
    props: {
      item: { type: Object },
      itemEquipment: { type: Object },
      viewMode: { type: Boolean },
      forEdit: { type: Boolean },
      backPath: { type: String, default: '/durable-goods/borrow/' },
      cannotApprove: { type: Boolean },
      type: { type: String, default: 'ยืม' },
      apiPath: { type: String, default: 'equipment/getEquipmentsAndFilter?status=NEW&status=RETURNED' },
      hideOwner: { type: Boolean },
      isWithdraw: { type: Boolean },
      requisitionStatus: { type: String },
      isBorrow: { type: Boolean },
    },
    data () {
      return {
        valid: true,
        form: {          
          equipments: [
            {
              name: '',
              year: (new Date()).getFullYear() + 543,
              price: '',
              description: '',
              depreciation_rate: '',
              classifier: '',
              categoryForm: {},
              quantity: 1,
              registrationType: '1',
              moneyType: 'BUDGET',
              detailList: [this.getDetail()]
            }
          ],
        },
        equipments: [],
        projectId: null,
        datetimeBorrowRules: [
          v => !!v || `โปรดใส่วันที่${this.type}`,
        ],
        datetimeReturnRules: [
          v => !!v || 'โปรดใส่วันที่คืน',
        ],
        durableGoodsRules: [
          v => !!v || 'โปรดเลือกครุภัณฑ์',
        ],
        projectRules: [
          v => !!v || 'โปรดเลือกโครงการ',
        ],
        step: 1,
        organizationId: null,
        departmentId: null,
        ouId: null,
        ownerForm: {},
        categoryForm: {},
        initCategoryForm: {},
        isWithdrawLoading: false,
        durableGoodsWithdraw: [],
        selectedWithdraw: [],
        attachFiles: [],
        files: [],
        removeFiles: [],
        equipmentList: [],
        categoryKey: false,        
        onCategoryChange: false,
        isVisibleProject: null,
        isVisibleEquipment: null,
        oldItem: [],
        formExpand: [0],        
        List4: [],
      }
    },
    computed: {
      currentFlow () {
        return this.item?.flows?.find(flow => flow?.status === 'PENDING') || null
      },
      isApprover () {
        return !this.cannotApprove && this.currentFlow?.canApprove === 'true'
      },
      isReject () {
        return this.item && this.item.status === 'REJECT'
      },
      isReturned () {
        return this.type === 'คืน'
      },
    },
    watch: {
      'item' () {
        this.setForm()
      }
    },
    mounted () {
      
      this.setForm()
    },
    created () {
      if (!this.form.item) {
        this.form.item = {};
      }
      if (!this.form.item.equipment) {
        this.form.item.equipment = {};
      }
      if (!this.form.item.equipment.name) {
        this.form.item.equipment.name = '';
      }
      console.log('this.item before set form',this.item);
      console.log('this.item ouId',this.item?.items?.[0]?.equipment?.organizationMaster.id);
      if(this.item){
        this.ouId =  this.item?.items?.[0]?.equipment?.organizationMaster.id || this.item.ouId
        this.departmentId = this.item?.items?.[0]?.equipment?.departmentMaster.id || this.item.departmentId
      }
      
      if (this.item) this.setCategoryForm()
    },
    methods: {
      setForm () {
        const getDueDate = () => {
          const date = new Date()
          date.setDate(date.getDate() + 7)
          return date
        }

        console.log('this.item withdraw',this.item);
        console.log('this.form.equipmentsหหหห',this.equipments);
        if(this.item){
          for(let i = 0;i<this.item.items.length;i++){
            console.log('test i',this.item.items[i].equipment.number);
            const setData = this.item.items[i].equipment;
            this.equipments.push(
              {
                initCategoryFormList: this.item?.items?.[i]
              }
            )            
          }
        }

        console.log('this.equipments withdraw',this.equipments);
        
        console.log('this.item BorrowForm',this.item);
          this.oldItem = this.item?.items;
        this.form = {
          description: this.item?.description || '',
          dateBorrow: this.item?.dateBorrow || new Date(),
          dueDate: this.item?.dueDate || getDueDate(),
          itemId: this.item?.items?.[0]?.equipment?.id || null,
          item: this.item?.items?.[0] || null,
          organization: this.item?.items?.[0]?.equipment?.organizationMaster || {},
          department: this.item?.items?.[0]?.equipment?.departmentMaster || {},
          owner: this.item?.items?.[0]?.equipment?.owner || {},
          number: this.item?.items?.[0]?.equipment?.number || '',
          borrowId: this.item?.borrowId,
          equipmentRequestId: this.item?.id, 
          equipmentXRequestId: this.item?.items?.[0].equipmentXRequestId,
          majorCategoryId: this.item?.items?.[0].majorCategory.id,
          subCategoryId: this.item?.items?.[0].subCategory.id,
          typeId: this.item?.items?.[0].type.id,
        }
        if(this.item){
          this.ouId =  this.item?.items?.[0]?.equipment?.organizationMaster.id || this.item.ouId
          this.departmentId = this.item?.items?.[0]?.equipment?.departmentMaster.id || this.item.departmentId
        }
        
        
        console.log('this.form ',this.form ); 
        if (this.item) this.setCategoryForm()
        const index = this.item?.flows?.findIndex(flow => ['PENDING', 'REJECT'].includes(flow?.status)) || 0
        this.step = index + 2
        this.files = this.item?.returnedFile?.files || []
      },
      setCategoryForm (category) {
        this.initCategoryForm = category || this.item?.items?.[0]
      },
      onChangeCategory ({ form, trigger }) {
        if (trigger) {
          this.categoryForm = { ...form }
          // this.form.itemId = null
          this.onCategoryChange = true
        }
      },
      onChangeEquipment (val) {
        this.itemEquipment = val.item
        this.initCategoryForm.majorCategory = this.itemEquipment.majorCategory
        this.initCategoryForm.subCategory = this.itemEquipment.subCategory
        this.initCategoryForm.type = this.itemEquipment.type
        this.initCategoryForm.brand = this.itemEquipment.brand
        this.initCategoryForm.model = this.itemEquipment.model
        this.categoryKey = !this.categoryKey;
        
        this.form.number = val?.item?.number
        this.form.itemId = val?.item?.id
      },      
      getApproverText (flow) { 
        return flow?.emails?.reduce((str, email, i) => `${str}${i > 0 ? ', ' : ''}${email}`, 'ผู้อนุมัติ : ') || false
      },
      toggleEdit () {
        return this.forEdit ? !this.forEdit : this.viewMode
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
      async onSelectProject ({ val, item }) {
        try {
          this.isWithdrawLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: 'equipment/project/getEquipmentsByProjectId', query: { pageSize: 1000, projectId: val } })
          this.durableGoodsWithdraw = data
          this.selectedWithdraw = data.map(item => true)
          this.isWithdrawLoading = false
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      onSelectOrganization ({ item }) {
        this.ownerForm.organizationId = item.id
      },
      onSelectDepartment ({ item }) {
        this.ownerForm.departmentId = item.id
      },
      onChangeNumber (val) {
        
        console.log('onChangeNumber this.ownerForm sssssssssssssssssssssssss')
        this.ownerForm = { ...this.ownerForm, equipmentNumber: val }
        console.log('onChangeNumber this.ownerForm ',this.ownerForm)
      },
      onSubmit () {
        const valid = this.$refs.form.validate()
        if (this.isWithdraw) {
          this.form.selected = this.durableGoodsWithdraw.filter((goods, i) => this.selectedWithdraw[i])
        }
        if (valid) { 
          const formData = { ...this.form }
          formData.ouId = this.ouId;
          this.$emit('submit', formData)
        }
      },
      onEdit () {
        const valid = this.$refs.form.validate()
        if (this.isWithdraw) {
          this.form.selected = this.durableGoodsWithdraw.filter((goods, i) => this.selectedWithdraw[i])
        }
        if (valid) {
          const formData = { ...this.form }
          formData.ouId = this.ouId;
          this.$emit('edit', formData)
        }
      },
      onEditWithdraw () {
        const valid = this.$refs.form.validate()
        if (this.isWithdraw) {
          this.form.selected = this.durableGoodsWithdraw.filter((goods, i) => this.selectedWithdraw[i])
        }
        if (valid) {
          const formData = { ...this.form }
          formData.ouId = this.ouId;
          formData.oldItem = this.oldItem;
          this.$emit('edit', formData)
        }
      },
      async onApprove () {
        const valid = this.$refs.form.validate()
        if (this.attachFiles.length) await this.uploadFiles()
        if (valid) this.$emit('approve', this.currentFlow, this.form)
      },
      async onReject () {
        const valid = this.$refs.form.validate()
        if (this.attachFiles.length) await this.uploadFiles()
        if (valid) this.$emit('reject', this.currentFlow, this.form)
      },
      onRemoveFile (attach) {
        this.removeFiles.push(attach)
      },
      async uploadFiles () {
        try {
          let data = new FormData()
          for (const file of this.attachFiles) {
            data.append('file', file)
          }
          data.append('equipmentRequestId', this.item.id)
          const res = await this.$store.dispatch('http', { method: 'post', apiPath: 'equipment/returnedDocument', data })
          return Promise.resolve(res)
        } catch (err) { return Promise.reject(err) }
      },      
      onOuChange ({ val }) {
        this.ouId = val
      },
      onChooseNewEquipment () {
        // ChooseNewEquipment
        this.isVisibleProject = 'on';
        this.isVisibleEquipment = 'off';
      },      
      getDetail (data = {}) {
        return {
          number: data.number || '',
          assetNumber: data.assetNumber || '',
          assetNumberAorWor: data.assetNumberAorWor || '',
          serialNumber: data.serialNumber || '',
          numberSubAorWor: data.numberSubAorWor || '',
          assetSubNumber: data.assetSubNumber || '',
        }
      },
      addDurableGoods () {
        this.form.equipments.push(
          {
            name: '',
            year: (new Date()).getFullYear() + 543,
            price: '',
            description: '',
            depreciation_rate: '',
            classifier: '',
            categoryForm: {},
            quantity: 1,
            registrationType: '1',
            moneyType: 'BUDGET',
            detailList: [this.getDetail()]
          }
        )
        this.formExpand = [ ...this.formExpand, this.formExpand.length ]
        this.setNumberAllEquipments()
      },      
      removeDurableGoods (i) {
        this.form.equipments.splice(i, 1)
      },
      onSelectEquipmentNumber (data ) {
        console.log('onSelectEquipmentNumber  ', data)
        if(data.item){
          this.initCategoryForm.majorCategory = data.item?.majorCategory
          this.initCategoryForm.subCategory = data.item?.subCategory
          this.initCategoryForm.type = data.item?.type
          this.initCategoryForm.brand = data.item?.brand
          this.initCategoryForm.model = data.item?.model

          this.form.item.equipment.name = data.item?.name

          this.categoryKey = !this.categoryKey;
        }
        
      },

    }
  }
</script>

<style lang="scss">
  .durable-goods-borrow-form {
    .v-stepper {
      .v-stepper__header {
        margin: 0 auto;

        .v-stepper__step {
          .v-stepper__step__step {
            width: 40px;
            height: 40px;
          }
        }

        .v-divider {
          margin-top: 45px;
        }
      }
    }

    .text-remaining {
      width: max-content;
    }

    @media (max-width: 768px) {
      .v-stepper {
        .v-stepper__header {
          padding: 0;
        }
      }
    }
  }
</style>