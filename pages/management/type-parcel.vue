<template>
  <div id="type-parcel-page">
    <PageHeader text="ประเภทวัสดุคงคลัง" btnText="เพิ่มประเภท" unit="ประเภท" :total="total" :filters="filters" @create="openCreateDialog"/>
    <v-data-table :headers="typeHeaders" :items="items" disableSort hideDefaultFooter class="elevation-1 mt-6" 
    :loading="isLoading"  >
      
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
      <template #item.minimumStock="{ item }">{{ item.minimumStock || 0 }} ชิ้น</template>
    </v-data-table>
    <Pagination/>

    <ConfirmDialog :value.sync="errorDialog" title="แจ้งเตือน" text="ไม่สามารถลบประเภทวัสดุคงคลังได้ เนื่องจากมีการใช้ประเภทวัสดุคงคลังนี้ไปแล้ว" hideSubmit closeText="รับทราบ"/>

    <v-dialog v-if="createDialog" v-model="createDialog" width="720" contentClass="type-parcel-dialog">
      <v-card>
        <v-card-title class="text-h5 justify-space-between">
          <div>เพิ่มประเภทวัสดุคงคลัง</div>
          <v-btn icon @click="closeCreateDialog">
            <i class="material-icons">close</i>
          </v-btn>
        </v-card-title>
        <v-card-text class="black--text">
          <div class="mt-3">
            <v-form ref="form" v-model="valid" lazyValidation>
              <v-row>
                <v-col :cols="12" :md="9">
                  <v-text-field v-model="form.types[0].typeName" label="ชื่อวัสดุคงคลัง *" :rules="typeNameRule" required/>
                </v-col>
                <v-col :cols="12" :md="3">
                  <v-text-field v-model="form.types[0].minimumStock" class="minimum-stock" label="ขั้นต่ำ *" :rules="minimumStockRule" suffix="ชิ้น" type="number"  :min="1" required />
                </v-col>
              </v-row>
            </v-form>
          </div>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer/>
          <v-btn color="grey" text large @click="createDialog = false">ยกเลิก</v-btn>
          <v-btn color="success" large @click="onCreate">เพิ่มประเภท</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      Pagination: () => import('~/components/Pagination.vue'),
    },
    data () {
      return {
        isLoading: true,
        total: 0,
        count: 0,
        items: [],
        search: '',
        typeHeaders: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'ชื่อประเภท', value: 'name' },
          { text: 'ขั้นต่ำ', value: 'minimumStock', width: '100px', align: 'center' },
        ],
        createDialog: false,
        errorDialog: false,
        valid: true,
        form: null,
        typeNameRule: [
          v => !!v || 'โปรดใส่ชื่อวัสดุคงคลัง',
        ],
        minimumStockRule: [
          v => !!v || v === 0 || 'โปรดใส่ขั้นต่ำสำหรับการแจ้งเตือน',
          v => /^[0-9]+$/.test(v) || 'กรุณาใส่ค่ามากกว่าหรือเท่ากับ 0' 
        ],
        filters: [
          {
            type: 'textField',
            param: 'name',
            name: 'ชื่อประเภท',
          },
          {
            type:"textField",
            param: 'minimumStock',
            name: 'ขั้นต่ำ'
          }
        ]
      }
    },
    watch: {
      '$route.query' () {
        this.getList()
      },
      createDialog (val) {
        if (!val) {
          this.setForm()
        }
      },
    },
    mounted () {
      this.setForm()
      this.getList()
    },
    methods: {
      setForm () {
        this.form = {
          types: [
            {
              typeName: '',
              minimumStock: 0,
            }
          ]
        }
      },
     
      async getList () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'parcel/getListParcelType', query: { ...this.$route.query, pageSize: 10 }, context: this })
          this.isLoading = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
      openCreateDialog () {
        this.createDialog = true
      },
      closeCreateDialog () {
        this.createDialog = false
      },
      async onDelete (item) {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: 'Orgchart/deleteDepartment', query: { departmentId: item.id } })
          if (data?.status?.code == 400) this.errorDialog = true
          else await this.$store.dispatch('snackbar', { text: 'ลบประเภทวัสดุคงคลังสำเร็จ' })
          await this.getList()
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      async onCreate () {
        const valid = this.$refs.form.validate()
        if (valid) {
          try {
            const { data } = await this.$store.dispatch('http', { method: 'post', apiPath: 'parcel/import/types', data: this.form })
            await this.$store.dispatch('snackbar', { text: 'สร้างประเภทวัสดุคงคลังสำเร็จ' })
            this.createDialog = false
            await this.getList()
            return Promise.resolve(data)
          } catch (err) {
            return Promise.reject(err)
          }
        }
      },
    }
  }
</script>

<style lang="scss">
  #type-parcel-page {
  }
</style>