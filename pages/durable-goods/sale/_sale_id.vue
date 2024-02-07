<template>
  <div id="durable-goods-sale-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มการจำหน่ายครุภัณฑ์' : 'การแก้ไขการจำหน่ายครุภัณฑ์'" hideTotal/>
    <Loading v-if="isLoading"/>

    <v-form v-else ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row>
          <v-col :cols="12" :md="2">
            <v-text-field v-model="form.year" label="ปีงบประมาณ *" :rules="yearRules" type="number"/>
          </v-col>
          <v-col :cols="12" :md="3">
            <InputDatePicker :value.sync="form.dateSale" label="วันที่จำหน่ายครุภัณฑ์ *" :rules="datetimesaleRules" required/>
          </v-col>
          <v-col :cols="12" :md="3">
            <InputDatePicker :value.sync="form.dateDocument" label="วันที่เอกสาร *" :rules="isCreate ? datetimeDocumentRules : []" required :disabled="!isCreate"/>
          </v-col>
          <v-col :cols="12">
            <v-textarea v-model="form.description" label="หมายเหตุ" :rows="4"/>
          </v-col>
          <v-col :cols="12" :md="4">
            <SelectDropdown :value.sync="form.distribution_method" :items="$store.state.distributionList" itemValue="id" itemText="name" label="วิธีการจำหน่าย *" :rules="distributionTypeRules"/>            
          </v-col>
          <v-col :cols="12" :md="4">
            <v-text-field v-model="form.price" label="ราคาจำหน่าย" type="number" required/>
          </v-col>
          <v-col :cols="12" :md="4">
            <v-text-field v-model="form.buyer" label="ผู้ซื้อ / ผู้รับบริจาค" required/>
          </v-col>
          <v-col :cols="12" :md="4">
            <v-text-field v-model="form.bookNumber" label="เลขที่หนังสือ" required/>
          </v-col>
        </v-row>
      </v-container>

      <h5 class="text-h5 mt-5"><b>{{ `เลือกครุภัณฑ์ที่ต้องการจำหน่าย` }}</b></h5>
      <v-container>
        <NumberDurableGood ref="numberDurableGood" :propNumber="propNumber" :propAssetNumber="propAssetNumber" :propAssetNumberAorWor="propAssetNumberAorWor" :disabled="!isCreate" @change="changeInput($event)"/>
        <!-- <v-row>
          <v-col :cols="12" :md="8">
            <SelectDropdown v-if="isCreate" :value.sync="form.itemId" itemValue="id" itemText="name" label="ครุภัณฑ์" :apiPath="`equipment/getEquipments/statusAndDepartment?status=NEW&status=RETURNED`"
              :query="numberQuery" :disabled="!isCreate" @select="onSelectDurableGoods"/>
            <v-text-field v-else-if="form.item" v-model="form.item.name" label="ครุภัณฑ์ *" disabled/>
          </v-col>
        </v-row> -->
        <WithdrawDurableGoodsTable3 v-if="isCreate" :items="saleItems3" :selectList3="selectList3" :List4="List4" isSale :query="numberQuery" />
      </v-container>
      
      <v-container v-if="isCreate">
        <WithdrawDurableGoodsTable :items="saleItems" :selectList="selectList" :List4="List4" isSale/>
      </v-container>

   

      <v-container v-if="isCreate">
        <WithdrawDurableGoodsTable2 :items="saleItems2" :selectList2="selectList2" :List4="List4" isSale/>
      </v-container>

      <AttachFileBtn class="mt-8" accept="*" :multiple="false"/>

      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/durable-goods/sale/')">ย้อนกลับ</v-btn>
          <v-btn v-if="isCreate" class="ml-4" elevation="2" large color="success" :disabled="!List4.filter(e => e).length" @click="onSubmit">{{ `จำหน่ายครุภัณฑ์` }}</v-btn>
          <v-btn v-else class="ml-4" elevation="2" large color="success" @click="onEdit">{{ `บันทึก` }}</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      Loading: () => import('~/components/Loading.vue'),
      NumberDurableGood: () => import('~/components/NumberDurableGood.vue'),
      SelectDropdown: () => import('~/components/SelectDropdown.vue'),
      WithdrawDurableGoodsTable: () => import('~/components/WithdrawDurableGoodsTable.vue'),
      WithdrawDurableGoodsTable2: () => import('~/components/WithdrawDurableGoodsTable2.vue'),
      WithdrawDurableGoodsTable3: () => import('~/components/WithdrawDurableGoodsTable3.vue'),
      AttachFileBtn: () => import('~/components/AttachFileBtn.vue'),
    },
    data () {
      return {
        valid: true,
        form: {
          year: '',
          dateSale: new Date(),
          dateDocument: '',
          description: '',
          buyer: '',
          price: '',
          itemId: null,
          distribution_method: '',
          bookNumber: '',
        },
        item: null,
        isLoading: false,
        saleItems: [],
        selectList: [],
        saleItems2: [],
        selectList2: [],
        saleItems3: [],
        selectList3: [],
        List4: [],
        datetimesaleRules: [
          v => !!v || `โปรดใส่วันที่จำหน่าย`,
        ],
        datetimeDocumentRules: [
          v => !!v || `โปรดใส่วันที่เอกสาร`,
        ],
        datetimeReturnRules: [
          v => !!v || 'โปรดใส่วันที่คืน',
        ],
        distributionTypeRules: [
          v => !!v || 'โปรดเลือกวิธีการจำหน่าย',
        ],
        yearRules: [
          v => !!v || 'โปรดเลือกปีงบประมาณ',
        ],
        numberQuery: {},
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.sale_id === 'create'
      },
      propNumber () {
        return this.form.item && this.form.item.number || ''
      },
      propAssetNumberAorWor () {
        return this.form.item && this.form.item.assetNumberAorWor || ''
      },
      propAssetNumber () {
        return this.form.item && this.form.item.assetNumber || ''
      },
    },
    watch: {
      'item' () {
        this.setForm()
      }
    },
    async mounted () {
      if (this.isCreate) {
        this.getWaitSale() 
        this.getWaitSaleByTypeOfSource()
      }else await this.getData()
      this.setForm()
    },
    methods: {
      async getData () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: `equipment/getEquipments/status/${this.$route.params.sale_id}`, query: this.$route.query })
          this.item = data
          this.isLoading = false
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      async getWaitSale () {
        try {
          const { data } = await this.$store.dispatch('http', { apiPath: `equipment/wait-sale`, query: { ...this.$route.query, pageSize: 1000 } })
          this.saleItems = data.content
          // this.selectList = this.saleItems.map(item => false)
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      async getWaitSaleByTypeOfSource () {
        try {
          const { data } = await this.$store.dispatch('http', { apiPath: `equipment/wait-sale?typeOfSource=REPAIR`, query: { ...this.$route.query, pageSize: 1000 } })
          this.saleItems2 = data.content
          // this.selectList2 = this.saleItems2.map(item => false)
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      async statusAndDepartment (event) {        
        const entries = Object.entries(event);
        let  strParams = '';
        for (let index = 0; index < entries.length; index++) {          
          strParams += '&' + (entries[index][0] + '=' + entries[index][1]);
        }
        try {
          const { data } = await this.$store.dispatch('http', { apiPath: `equipment/getEquipments/statusAndDepartment?status=NEW&status=RETURNED`+strParams, query: { ...this.$route.query, pageSize: 1000 } })
          this.saleItems3 = data.content
          // this.selectList3 = this.saleItems3.map(item => false)
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      setForm () {
        const data = this.item ? { ...this.item, ...this.item.equipmentSale } : {}
        this.form = {
          id: this.$route.params.sale_id,
          year: data?.year || (new Date()).getFullYear() + 543,
          dateSale: data?.dateSale || new Date(),
          dateDocument: data?.dateDocument || '',
          description: data?.description || '',
          buyer: data?.buyer || '',
          price: data?.price || '',
          distribution_method: data?.distribution_method || '',
          itemId: data?.id || null,
          item: data || null,
          bookNumber: data?.bookNumber || '',
        }
      },
      onSelectDurableGoods ({ item }) {
        this.form.price = item.price
        // if (item && this.$refs.numberDurableGood) this.$refs.numberDurableGood.onlyUpdateFields(item)
        if (this.saleItems.every(goods => goods.id !== item.id)) {
          this.saleItems.push(item)
          this.selectList.push(true)
        }
      },
      async changeSearch (val) {
        try {
          if (val) {
            const { data } = await this.$store.dispatch('http', { apiPath: this.apiPath, query: { equipmentNumber: this.number, isUnCheck: true } })
            if (data.content && data.content.length) {
              this.errorText = ''
              this.onSave(data.content[0])
            } else {
              this.errorText = this.number
            }
            this.number = ''
          }
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      async onEdit () {
        const valid = this.$refs.form.validate()
        if (valid) {
          try {
            const form = { ...this.form }
            form.dateSale = this.$fn.convertDateToString(form.dateSale)
            const { data } = await this.$store.dispatch('http', { method: 'patch', apiPath: 'equipment/edit-sale', data: form, query: this.$route.query })
            await this.$store.dispatch('snackbar', { text: 'แก้ไขจำหน่ายครุภัณฑ์สำเร็จ' })
            await this.getData()
            this.setForm()
            return Promise.resolve(data)
          } catch (err) { return Promise.reject(err) }
        }
      },
      async onSubmit () {
        const valid = this.$refs.form.validate()
        if (valid) {
          try {
            const form = { ...this.form }
            form.dateSale = this.$fn.convertDateToString(form.dateSale)
            // form.itemIds = this.saleItems.filter((goods, i) => this.selectList[i]).map(item => item.id) //bakup
            form.itemIds = this.List4.map(item => item.id)
            const { data } = await this.$store.dispatch('http', { method: 'post', apiPath: 'equipment/sale', data: form, query: this.$route.query })
            await this.$store.dispatch('snackbar', { text: 'จำหน่ายครุภัณฑ์สำเร็จ' })
            this.$router.push('/durable-goods/sale/')
            return Promise.resolve(data)
          } catch (err) { return Promise.reject(err) }
        }
      },
      async changeInput (event) {
        this.statusAndDepartment(event)
      }
    }
  }
</script>

<style lang="scss">
  #durable-goods-sale-detail-page {
  }
</style>