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
              <DurableGoodsOwner :organization.sync="ouId" :department.sync="departmentId" :hideUser="true" :disabled="false" @ouChange="onOuChange">
              </DurableGoodsOwner>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <h5 class="text-h5 mt-5"><b>{{ `เลือกครุภัณฑ์ที่ต้องการ${type}` }}</b>
      </h5>
      <!-- <v-container class="mt-2">
        <div v-if="isWithdraw && !viewMode || isVisibleProject === 'on'" >
          <v-col :cols="12" :md="12">
            <SelectDropdown :value.sync="projectId" itemValue="id" itemText="projectName" label="เลือกโครงการ *" apiPath="Project/getListProject" :rules="projectRules" @select="onSelectProject"/>
          </v-col>
          <WithdrawDurableGoodsTable v-if="projectId" class="mt-6" :items="durableGoodsWithdraw" :isLoading="isWithdrawLoading" :selectList="selectedWithdraw" :List4="List4"/>
        </div>
        <template v-else-if="isVisibleEquipment !== 'off'">
          <div>
            <v-text-field v-model="form.number" label="เลขที่ครุภัณฑ์" :disabled="toggleEdit()" @change="onChangeNumber"/>
            <CategoryDurableGood :key="categoryKey" :initCategory="initCategoryForm" :disabled="toggleEdit()" noRules :itemEquipment="itemEquipment"
            @change="onChangeCategory">
              <v-col :cols="12" :md="9">
                  <v-text-field v-if="viewMode && !onCategoryChange" v-model="form.item.equipment.name" label="ครุภัณฑ์ *" :disabled="toggleEdit()"/>
                <SelectDropdown  v-else :value.sync="form.itemId" itemValue="id" itemText="name" label="ครุภัณฑ์ *" :rules="durableGoodsRules" :items="equipmentList" :apiPath="apiPath"
                  :query="{ ...categoryForm, ...ownerForm }" :disabled="toggleEdit()" @select="onChangeEquipment"/>
              </v-col>
            </CategoryDurableGood>
          </div>
        </template>
      </v-container> -->
      <v-container class="mt-2">
        <v-expansion-panels v-model="formExpand" class="form-expansion-panels" flat multiple>
            <v-expansion-panel v-for="(item, i) in form.items" :key="i" accordion>
              <v-expansion-panel-header class="text-h6">
                <div class="d-flex align-center">
                  <div>ครุภัณฑ์ รายการที่ {{ i + 1 }}.</div>
                  <v-btn v-if="form.items.length > 1 && i === form.items.length - 1 && !viewMode" class="ml-5" icon @click.stop="removeDurableGoods(i)">
                    <i class="material-icons">delete</i>
                  </v-btn>
                </div>
                <template #actions>
                  <i class="material-icons">keyboard_arrow_down</i>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-container>
                  <v-text-field v-model="form.numberList[i]" label="เลขที่ครุภัณฑ์" :disabled="toggleEdit()" @keyup="onChangeNumber($event,i)"/>
                  <CategoryDurableGood :key="categoryKey" :initCategory="listInitCategoryForm[i]?.initCategoryForm" :itemEquipment="listItemEquipment[i]?.itemEquipment"  :disabled="toggleEdit()" noRules
                  @change="onChangeCategory($event,i)">
                    <v-col :cols="12" :md="9">
                        <v-text-field v-if="viewMode && !onCategoryChange[i]" :key="categoryChangeKey" v-model="form.nameList[i]" label="ครุภัณฑ์ *" :disabled="toggleEdit()"/>
                      <SelectDropdown v-else  :value.sync="form.itemId[i]" itemValue="id" itemText="name" label="ครุภัณฑ์ *" :rules="durableGoodsRules" :items="equipmentList" :apiPath="apiPath"
                        :query="{ ...categoryForm, ...ownerForm }" :disabled="toggleEdit()" @select="onChangeEquipment($event,i)"/>
                    </v-col>
                  </CategoryDurableGood>
                  <!-- <CategoryDurableGood :cols="3" :initCategory="initCategory" @change="res => form.equipments[i].categoryForm = res.form" @changeMajor="setNumberAllEquipments" @changeModel="onChangeModel" @changeDepreciationYear="val => changeDepreciationYear(i, val)">
                    <template #default>
                      <v-col :cols="12" :md="isCreate ? 6 : 9">
                        <v-text-field v-model="form.equipments[i].name" name="name" label="ชื่อครุภัณฑ์" />
                      </v-col>
                      <v-col v-if="isCreate" :cols="12" :md="3">
                        <v-text-field v-model="form.equipments[i].quantity" name="quantity" label="จำนวน *" type="number" :rules="quantityRules" required @change="onQuantityChange(form.equipments[i])"/>
                      </v-col>
                    </template>
                  </CategoryDurableGood> -->
                  <v-row v-if="isBorrow && !viewMode"  class="mb-5">
                    <v-btn block rounded outlined @click="addDurableGoods()">เพิ่มครุภัณฑ์</v-btn>
                  </v-row>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
      </v-container>

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
          <!-- <v-btn v-if="isVisibleProject === 'on'" class="ml-4" elevation="2" large color="success" @click="onEditWithdraw">บันทึกa</v-btn> -->
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
      SelectDropdown: () => import('~/components/SelectDropdown.vue'),
      InputDatePicker: () => import('~/components/InputDatePicker.vue'),
      CategoryDurableGood: () => import('~/components/CategoryDurableGood.vue'),
      AttachFileBtn: () => import('~/components/AttachFileBtn.vue'),
    },
    props: {
      item: { type: Object },
      // itemEquipment: { type: Object },
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
          items: [
            {
              name: '',
              number: '',
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
          itemId: [],
          numberList: [],
          nameList: [],
        },
        numberListOriginal: [],
        nameListOriginal: [],
        itemIdOriginal: [],
        equipmentXRequestIdOriginalList:[],
        equipmentXRequestIdList:[],
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
        isWithdrawLoading: false,
        durableGoodsWithdraw: [],
        selectedWithdraw: [],
        attachFiles: [],
        files: [],
        removeFiles: [],
        equipmentList: [],
        categoryKey: false,
        categoryChangeKey: false,
        onCategoryChange: [false],
        isVisibleProject: null,
        isVisibleEquipment: null,
        oldItem: [],
        formExpand: [0],
        List4: [],
        listItemEquipment: [
          { itemEquipment: {} },
        ],
        listInitCategoryForm: [
        { initCategoryForm: {} },
        ],
        initCategoryForm: {},
        listItemEquipmentOriginal: [
          { itemEquipment: {} },
        ],
        listInitCategoryFormOriginal: [
        { initCategoryForm: {} },
        ],
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
      // console.log('this.item before this.form',this.form);
      // console.log('this.item before set form',this.item);
      // console.log('this.item ouId',this.item?.items?.[0]?.equipment?.organizationMaster.id);
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
        this.oldItem = this.item?.items;

        this.form = {
          description: this.item?.description || '',
          dateBorrow: this.item?.dateBorrow || new Date(),
          dueDate: this.item?.dueDate || getDueDate(),
          itemId:[],
          numberList: [],
          nameList:[],
          item: this.item?.items?.[0] || null,
          items: this.item?.items || [
            {
                equipment: {},
                majorCategory: {},
                subCategory: {},
                type: {},
                brand: {},
                model: {}
            }
          ],
          organization: this.item?.items?.[0]?.equipment?.organizationMaster || {},
          department: this.item?.items?.[0]?.equipment?.departmentMaster || {},
          owner: this.item?.items?.[0]?.equipment?.owner || {},
          number: this.item?.items?.[0]?.equipment?.number || '',
          borrowId: this.item?.borrowId,
          equipmentRequestId: this.item?.id,
          equipmentXRequestId: this.item?.items?.[0].equipmentXRequestId,
          equipments: [
            {
              name: '',
              number: '',
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
        }
        if(this.item){
          this.ouId =  this.item?.items?.[0]?.equipment?.organizationMaster.id || this.item.ouId
          this.departmentId = this.item?.items?.[0]?.equipment?.departmentMaster.id || this.item.departmentId

          // console.log('this.item BorrowFormss',this.item);
          for(let i = 0; i<this.item.items.length; i++){
            this.listItemEquipment[i] = {itemEquipment: this.item.items[i].equipment}
            this.listInitCategoryForm[i] = {initCategoryForm: this.item.items[i]}

            this.form.numberList[i] = this.item.items[i].equipment.number
            this.form.nameList[i] = this.item.items[i].equipment.name
            // this.form.itemId[i] = this.item.items[i].equipment.id

            this.listItemEquipmentOriginal[i] = {itemEquipment: this.item.items[i].equipment}
            this.listInitCategoryFormOriginal[i] = {initCategoryForm: this.item.items[i]}

            this.numberListOriginal[i] = this.item.items[i].equipment.number
            this.nameListOriginal[i] = this.item.items[i].equipment.name
            this.itemIdOriginal[i] = this.item.items[i].equipment.id

            this.equipmentXRequestIdOriginalList[i] = this.item.items[i].equipmentXRequestId

            this.onCategoryChange[i] = false
            this.formExpand = [ ...this.formExpand, this.formExpand.length ]
          }
          // console.log('this.listItemEquipment BorrowFormss', this.listItemEquipment);
          // console.log('this.onCategoryChange BorrowFormss', this.onCategoryChange);
          // console.log('this.form BorrowFormss', this.form);

          // console.log('this.listItemEquipmentOriginal BorrowFormss', this.listItemEquipmentOriginal);
          // console.log('this.listInitCategoryFormOriginal BorrowFormss', this.listInitCategoryFormOriginal);

          this.categoryKey = !this.categoryKey;

        }


        // console.log('this.formกกก ',this.form );
        if (this.item) this.setCategoryForm()
        const index = this.item?.flows?.findIndex(flow => ['PENDING', 'REJECT'].includes(flow?.status)) || 0
        this.step = index + 2
        this.files = this.item?.returnedFile?.files || []
      },
      setCategoryForm (category) {
        this.initCategoryForm = category || this.item?.items?.[0]
      },
      onChangeCategory ({ form, trigger },index) {

        // console.log('onChangeCategory index', index)
        if (trigger) {
          // this.categoryForm = { ...form }
          // this.form.itemId = null
          // this.onCategoryChange = true
          this.onCategoryChange[index] = true
          this.categoryChangeKey = !this.categoryChangeKey;
        }
      },
      onChangeEquipment (val,index) {
        // console.log('check index', index)
        // console.log('check val', val)



        // console.log('this.listInitCategoryForm Before', this.listInitCategoryForm)
        this.listItemEquipment[index] = {itemEquipment: val.item}


        this.initCategoryForm = {}
        this.initCategoryForm.majorCategory = val.item.majorCategory
        this.initCategoryForm.subCategory = val.item.subCategory
        this.initCategoryForm.type = val.item.type
        this.initCategoryForm.brand = val.item.brand
        this.initCategoryForm.model = val.item.model

        this.listInitCategoryForm[index] = {initCategoryForm: this.initCategoryForm}

        // console.log('this.listItemEquipment ', this.listItemEquipment)
        // console.log('this.listInitCategoryForm After', this.listInitCategoryForm)

        this.categoryKey = !this.categoryKey;

        // console.log('check val before this.form', this.form)
        this.form.numberList = this.form.numberList.filter(item => item !== null);
        this.form.numberList.splice(index, 1, val?.item?.number);

        this.form.itemId[index] = val?.item?.id
        // this.form.itemId = this.form.itemId.filter(item => item !== null);
        // this.form.itemId.splice(index, 1, val?.item?.id);

        // console.log('this.listItemEquipment ', this.listItemEquipment)
        // console.log('this.listInitCategoryForm ', this.listInitCategoryForm)
        // console.log('this.form ', this.form)
        
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
      async onChangeNumber (val,index) {
        // this.ownerForm = { ...this.ownerForm, equipmentNumber: val }
        // console.log('index ',index);
        // console.log('val ',val);
        // console.log('target._value ',val.target._value);

        
        // console.log('this.numberListOriginal ',this.numberListOriginal);
        //   console.log('this.nameListOriginal ',this.nameListOriginal);
        //   console.log('this.listItemEquipmentOriginal ',this.listItemEquipmentOriginal);
        //   console.log('this.listInitCategoryFormOriginal ',this.listInitCategoryFormOriginal);

        let checkIndex = -1;
        for(let i = 0;i<this.numberListOriginal.length;i++){
          if(val.target._value === this.numberListOriginal[i]){
            checkIndex = i;
          }
        }
        if(checkIndex < 0){
          try {
            // this.isWithdrawLoading = true
            const { data } = await this.$store.dispatch('http', { apiPath: this.apiPath, query: { pageSize: 1000, equipmentNumber: val.target._value} })
            // console.log('target._value data',data);
            // console.log(' data.content[0]', data.content[0]);

            // console.log('this.listInitCategoryForm Before', this.listInitCategoryForm)
            this.listItemEquipment[index] = {itemEquipment:  data.content[0]}


            this.initCategoryForm = {}
            this.initCategoryForm.majorCategory =  data.content[0]?.majorCategory || {}
            this.initCategoryForm.subCategory =  data.content[0]?.subCategory || {}
            this.initCategoryForm.type =  data.content[0]?.type || {}
            this.initCategoryForm.brand =  data.content[0]?.brand || {}
            this.initCategoryForm.model =  data.content[0]?.model || {},

            this.listInitCategoryForm[index] = {initCategoryForm: this.initCategoryForm}

            // console.log('this.listItemEquipment ', this.listItemEquipment)
            // console.log('this.listInitCategoryForm After', this.listInitCategoryForm)

            this.categoryKey = !this.categoryKey;

            // console.log('check val before this.form', this.form)
            this.form.numberList = this.form.numberList.filter(item => item !== null);
            this.form.numberList.splice(index, 1,  data?.content[0]?.number || val.target._value);

            this.form.nameList[index] = data?.content[0]?.name || ''

            this.form.itemId = this.form.itemId.filter(item => item !== null);
            this.form.itemId.splice(index, 1, data?.content[0]?.id || '');

            // console.log('this.form ', this.form)
              return Promise.resolve()
          } catch (err) { return Promise.reject(err) }
        }else{
          try {
           
            this.listItemEquipment[index] = this.listItemEquipmentOriginal[checkIndex]

            this.listInitCategoryForm[index] = this.listInitCategoryFormOriginal[checkIndex]

            this.categoryKey = !this.categoryKey;

            // console.log('check val before this.form', this.form)
            this.form.numberList = this.form.numberList.filter(item => item !== null);
            this.form.numberList.splice(index, 1,  this.numberListOriginal[checkIndex]);

            this.form.nameList[index] = this.nameListOriginal[checkIndex]
            
            
            this.form.itemId = this.form.itemId.filter(item => item !== null);
            this.form.itemId.splice(index, 1, this.itemIdOriginal[checkIndex]);

            // console.log('this.form ', this.form)
              return Promise.resolve()
          } catch (err) { return Promise.reject(err) }
        }
      },
      onSubmit () {
        const valid = this.$refs.form.validate()
        if (this.isWithdraw) {
          this.form.selected = this.durableGoodsWithdraw.filter((goods, i) => this.selectedWithdraw[i])
        }
        // console.log('onSubmit valid ',valid);
        // console.log('this.departmentId ',this.departmentId);
        if (valid) {
          const formData = { ...this.form }
          formData.ouId = this.ouId;
          formData.departmentId = this.departmentId;
          // console.log('onSubmit formData ',formData);
          this.$emit('submit', formData)
        }
      },
      onEdit () {
        const valid = this.$refs.form.validate()
        if (valid) {
          this.form.itemId = this.listItemEquipment.map(item => item.itemEquipment.id);
          const formData = { ...this.form }
          formData.ouId = this.ouId;
          formData.departmentId = this.departmentId;

          // formData.itemId = formData.itemId.filter(id => !this.itemIdOriginal.includes(id));
          // console.log('onEdit this.itemIdOriginal bbbbbbbbbbbb ',this.itemIdOriginal);          
          // console.log('onEdit formData.itemId bbbbbbbbbbbbbb',formData.itemId);
          for(let i=formData.itemId.length; i>=0;i--){
            if(formData.itemId[i] == this.itemIdOriginal[i]){
              formData.itemId.splice(i, 1);
              this.equipmentXRequestIdOriginalList.splice(i, 1);
            }
          }
          formData.equipmentXRequestIdList = this.equipmentXRequestIdOriginalList;
          // console.log('onEdit this.itemIdOriginal ',this.itemIdOriginal);
          // console.log('onEdit this.equipmentXRequestIdOriginalList ',this.equipmentXRequestIdOriginalList);
          // console.log('onEdit formData.itemId ',formData.itemId);
          // console.log('onEdit formData ',formData);
          this.$emit('edit', formData)
        }
      },
      onEditWithdraw () {
        const valid = this.$refs.form.validate()
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
        this.form.items.push(
          {
              equipment: {},
              majorCategory: {},
              subCategory: {},
              type: {},
              brand: {},
              model: {}
          }
        )
        this.listInitCategoryForm.push({})
        this.listItemEquipment.push({})
        // console.log('this.listInitCategoryForm ,,',this.listInitCategoryForm);
        this.formExpand = [ ...this.formExpand, this.formExpand.length ]
        // this.setNumberAllEquipments()
      },
      removeDurableGoods (i) {
        // console.log('removeDurableGoods ',i)
        this.form.items.splice(i, 1)
        this.form.itemId.splice(i, 1)
      },
      // setNumberAllEquipments () {
      //   this.form.equipments.forEach(equipment => {
      //     this.getEquipmentNumber(equipment)
      //   })
      // },

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
