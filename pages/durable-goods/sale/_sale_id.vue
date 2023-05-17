<template>
  <div id="durable-goods-sale-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มการจำหน่ายครุภัณฑ์' : 'การแก้ไขการจำหน่ายครุภัณฑ์'" hideTotal/>
    <Loading v-if="isLoading"/>

    <v-form v-else ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row>
          <v-col :cols="12" :md="6">
            <InputDatePicker :value.sync="form.dateSale" label="วันที่จำหน่ายครุภัณฑ์ *" :rules="datetimesaleRules" required :disabled="!isCreate"/>
          </v-col>
          <v-col :cols="12">
            <v-textarea v-model="form.description" label="หมายเหตุ" :rows="4" :disabled="!isCreate"/>
          </v-col>
        </v-row>
      </v-container>

      <h5 class="text-h5 mt-5"><b>{{ `เลือกครุภัณฑ์ที่ต้องการจำหน่าย` }}</b></h5>
      <v-container>
        <NumberDurableGood :propNumber="propNumber" :propAssetNumber="propAssetNumber" :propAssetNumberAorWor="propAssetNumberAorWor" :disabled="!isCreate" @change="numberQuery = $event"/>
        <v-row>
          <v-col :cols="12" :md="8">
            <SelectDropdown v-if="isCreate" :value.sync="form.itemId" itemValue="id" itemText="name" label="ครุภัณฑ์ *" :rules="durableGoodsRules" :apiPath="`equipment/getEquipments/statusAndDepartment?status=NEW&status=RETURNED`"
              :query="numberQuery" :disabled="!isCreate" @select="onSelectDurableGoods"/>
            <v-text-field v-else-if="form.item" v-model="form.item.name" label="ครุภัณฑ์ *" disabled/>
          </v-col>
          <v-col :cols="12" :md="4">
            <SelectDropdown :value.sync="form.distribution_method" :items="distributionList" itemValue="id" itemText="name" label="วิธีการจำหน่าย *" :rules="distributionTypeRules" :disabled="!isCreate"/>            
          </v-col>
          <v-col :cols="12" :md="4">
            <v-text-field v-model="form.price" label="ราคาจำหน่าย" type="number" required :disabled="!isCreate"/>
          </v-col>
          <v-col :cols="12" :md="8">
            <v-text-field v-model="form.buyer" label="ผู้ซื้อ" required :disabled="!isCreate"/>
          </v-col>
        </v-row>
      </v-container>

      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/durable-goods/sale/')">ย้อนกลับ</v-btn>
          <v-btn v-if="isCreate" class="ml-4" elevation="2" large color="success" @click="onSubmit">{{ `จำหน่ายครุภัณฑ์` }}</v-btn>
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
    },
    data () {
      return {
        valid: true,
        form: {
          dateSale: '',
          description: '',
          buyer: '',
          price: '',
          itemId: null,
          distribution_method: '',
        },
        item: null,
        isLoading: false,
        datetimesaleRules: [
          v => !!v || `โปรดใส่วันที่จำหน่าย`,
        ],
        datetimeReturnRules: [
          v => !!v || 'โปรดใส่วันที่คืน',
        ],
        durableGoodsRules: [
          v => !!v || 'โปรดเลือกครุภัณฑ์',
        ],
        distributionTypeRules: [
          v => !!v || 'โปรดเลือกวิธีการจำหน่าย',
        ],
        distributionList: [
          { id: 'บริจาค', name: 'บริจาค' },
          { id: 'ขาย', name: 'ขาย' },
          { id: 'สูญหาย', name: 'สูญหาย' },
          { id: 'เสื่อมสภาพ', name: 'เสื่อมสภาพ' },
          { id: 'ทำลาย', name: 'ทำลาย' },
          { id: 'อื่นๆ', name: 'อื่นๆ' },
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
      if (!this.isCreate) await this.getData()
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
      setForm () {
        const data = this.item ? { ...this.item, ...this.item.equipmentSale } : {}
        this.form = {
          dateSale: data?.dateSale || new Date(),
          description: data?.description || '',
          buyer: data?.buyer || '',
          price: data?.price || '',
          distribution_method: data?.distribution_method || '',
          itemId: data?.id || null,
          item: data || null,
        }
      },
      onSelectDurableGoods ({ item }) {
        this.form.price = item.price
      },
      async onSubmit () {
        const valid = this.$refs.form.validate()
        if (valid) {
          try {
            const form = { ...this.form }
            form.dateSale = this.$fn.convertDateToString(form.dateSale)
            const { data } = await this.$store.dispatch('http', { method: 'post', apiPath: 'equipment/sale', data: form, query: this.$route.query, context: this })
            await this.$store.dispatch('snackbar', { text: 'จำหน่ายครุภัณฑ์สำเร็จ' })
            this.$router.push('/durable-goods/sale/')
            return Promise.resolve(data)
          } catch (err) { return Promise.reject(err) }
        }

      },
    }
  }
</script>

<style lang="scss">
  #durable-goods-sale-detail-page {
  }
</style>