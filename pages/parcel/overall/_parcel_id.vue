<template>
  <div id="parcel-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มวัสดุคงคลัง' : 'การแก้ไขวัสดุคงคลัง'" hideTotal/>
    <Loading v-if="isLoading"/>
    <v-form v-else ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row>
          <v-col :cols="12" :md="8">
            <SelectDropdown v-if="isCreate" :value.sync="form.projectId" itemValue="id" itemText="projectName" label="โครงการ *" apiPath="Project/getListProject" :rules="projectRules" required :disabled="!isCreate"/>
            <v-text-field v-else v-model="form.projectName" label="โครงการ *" disabled/>
          </v-col>
          <v-col :cols="12" :md="4">
            <InputDatePicker :value.sync="form.dateEntry" label="วันที่รับเข้า *" :rules="dateEntryRules" required :disabled="!isCreate"/>
          </v-col>
        </v-row>
        <h4 class="text-h5 mt-5"><b>เลือกวัสดุคงคลัง</b></h4>
        <v-container>
          <v-expansion-panels v-model="formExpand" class="form-expansion-panels" flat multiple>
            <v-expansion-panel v-for="(parcel, i) in form.itemParcels" :key="i" accordion>
              <v-expansion-panel-header v-if="isCreate" class="text-h6">
                <div class="d-flex align-center">
                  <div>วัสดุคงคลัง ชิ้นที่ {{ i + 1 }}.</div>
                  <v-btn v-if="form.itemParcels.length > 1 && i === form.itemParcels.length - 1" class="ml-5" icon @click.stop="removeParcel(i)">
                    <i class="material-icons">delete</i>
                  </v-btn>
                </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-container>
                  <v-row>
                    <v-col :cols="12" md="4">
                      <AutocompleteDropdown v-if="isCreate" :value.sync="form.itemParcels[i].typeId" itemValue="id" itemText="name" label="ประเภท *" :rules="typeRules" apiPath="parcel/getListParcelType"
                        searchApiPath="parcel/getParcelType" required noFilter/>
                      <v-text-field v-else v-model="form.itemParcels[i].type" label="ประเภท *" disabled/>
                    </v-col>
                    <v-col :cols="12" md="8">
                      <SelectDropdown v-if="isCreate" :value.sync="form.itemParcels[i].parcelMasterId" itemValue="id" itemText="name" label="วัสดุคงคลัง *" apiPath="parcel/searchParcelMaster"
                        :query="getParcelQuery(form.itemParcels[i])" :rules="parcelRules" required :disabled="!form.itemParcels[i].typeId"/>
                      <v-text-field v-else v-model="form.itemParcels[i].parcelMasterName" label="วัสดุคงคลัง *" disabled/>
                    </v-col>
                    <v-col :cols="12" md="4">
                      <v-text-field v-model="form.itemParcels[i].price" label="ราคา *" type="number" :rules="priceRules" required :disabled="!isCreate"/>
                    </v-col>
                    <v-col :cols="12" md="4">
                      <v-text-field v-model="form.itemParcels[i].quantity" label="จำนวน *" type="number" :rules="quantityRules" required :disabled="!isCreate"/>
                    </v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-row v-if="isCreate" class="mt-5">
            <v-btn block rounded outlined @click="addParcel()">เพิ่มวัสดุคงคลัง</v-btn>
          </v-row>
        </v-container>
      </v-container>
      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/parcel/overall/')">ย้อนกลับ</v-btn>
          <v-btn v-if="isCreate" elevation="2" large color="success" @click="onSubmit">บันทึก</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      InputDatePicker: () => import('~/components/InputDatePicker.vue'),
      AutocompleteDropdown: () => import('~/components/AutocompleteDropdown.vue'),
      SelectDropdown: () => import('~/components/SelectDropdown.vue'),
      Loading: () => import('~/components/Loading.vue'),
    },
    data () {
      return {
        valid: true,
        isLoading: false,
        form: {
          projectId: null,
          dateEntry: new Date(),
          itemParcels: [
            {
              parcelMasterId: null,
              typeId: null,
              price: '',
              quantity: ''
            }
          ],
        },
        projectRules: [
          v => !!v || 'โปรดเลือกโครงการ',
        ],
        typeRules: [
          v => !!v || 'โปรดเลือกประเภท',
        ],
        parcelRules: [
          v => !!v || 'โปรดเลือกวัสดุคงคลัง',
        ],
        priceRules: [
          v => !!v || 'โปรดใส่ราคา',
        ],
        quantityRules: [
          v => !!v || 'โปรดใส่จำนวน',
        ],
        dateEntryRules: [
          v => !!v || 'โปรดใส่วันที่รับเข้า',
        ],
        formExpand: [0],
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.parcel_id === 'create'
      },
    },
    mounted () {
      if (!this.isCreate) this.getData()
    },
    methods: {
      async getData () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('http', { apiPath: 'parcel/getParcelProject', query: { id: this.$route.params.parcel_id } })
          this.form = {
            projectId: data.id,
            projectName: data.projectName,
            dateEntry: data.dateEntry || new Date(),
            itemParcels: [
              {
                parcelMasterId: null,
                parcelMasterName: data.parcelMasterName,
                price: data.price,
                quantity: data.quantity,
                type: data.type,
              }
            ],
          }
          this.isLoading = false
          return Promise.resolve()
        } catch (err) {
          return Promise.reject(err)
        }
      },
      addParcel () {
        this.form.itemParcels.push(
          {
            parcelMasterId: null,
            type: null,
            price: '',
            quantity: ''
          }
        )
        this.formExpand = [ ...this.formExpand, this.formExpand.length ]
      },
      removeParcel (i) {
        this.form.itemParcels.splice(i, 1)
      },
      getParcelQuery (parcel) {
        return parcel?.typeId ? { typeId: parcel.typeId } : {}
      },
      async onSubmit () {
        const valid = this.$refs.form.validate()
        if (valid) {
          try {
            const apiPath = this.isCreate ? 'parcel/import' : ''
            const method = this.isCreate ? 'post' : 'patch'
            const form = {
              ...this.form,
              dateEntry: this.$fn.convertDateToString(this.form.dateEntry)
            }
            const { data } = await this.$store.dispatch('http', { method, apiPath, data: form })
            await this.$store.dispatch('snackbar', { text: this.isCreate ? 'สร้างโครงการ-วัสดุคงคลังสำเร็จ' : 'แก้ไขประเภทสร้างโครงการ-วัสดุคงคลังสำเร็จ' })
            if (this.isCreate) this.$router.push('/parcel/overall/')
            return Promise.resolve(data)
          } catch (err) { return Promise.reject(err) }
        } else {
          this.formExpand = [0]
        }
      },
    }
  }
</script>

<style lang="scss">
  #parcel-detail-page {
  }
</style>