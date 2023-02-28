<template>
  <div id="parcel-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มวัสดุคงคลัง' : 'การแก้ไขวัสดุคงคลัง'" hideTotal/>
    <Loading v-if="isLoading"/>
    <v-form v-else ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row>
          <v-col :cols="8">
            <SelectDropdown :value.sync="form.projectId" itemValue="id" itemText="projectName" label="โครงการ *" apiPath="Project/getListProject" :rules="projectRules" required :disabled="!isCreate"/>
          </v-col>
          <v-col :cols="4">
            <InputDatePicker :value.sync="form.dateEntry" label="วันที่รับเข้า *" :rules="dateEntryRules" required :disabled="!isCreate"/>
          </v-col>
        </v-row>
        <h4 class="text-h5"><b>เลือกวัสดุคงคลัง</b></h4>
        <v-container class="form-container">
          <v-row v-for="(parcel, i) in form.itemParcels" :key="i" class="mt-2" align="baseline">
            <div class="mr-4">{{ i + 1 }}.</div>
            <SelectDropdown v-if="isCreate" :value.sync="form.itemParcels[i].parcelMasterId" itemValue="id" itemText="name" label="วัสดุคงคลัง *" apiPath="parcel/getListParcelMaster" :rules="parcelRules" required/>
            <v-text-field v-else v-model="form.itemParcels[i].parcelMasterName" class="ml-4 parcel-name" label="วัสดุคงคลัง *" :disabled="!isCreate"/>
            <v-text-field v-model="form.itemParcels[i].price" class="ml-4" label="ราคา *" type="number" :rules="priceRules" required :disabled="!isCreate"/>
            <v-text-field v-model="form.itemParcels[i].quantity" class="ml-4" label="จำนวน *" type="number" :rules="quantityRules" required :disabled="!isCreate"/>
            <v-btn v-if="form.itemParcels.length > 1 && isCreate" class="ml-2" icon @click="removeParcel(i)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-row>
          <v-row v-if="isCreate" class="mt-5">
            <v-btn block rounded outlined @click="addParcel()">เพิ่มวัสดุคงคลัง</v-btn>
          </v-row>
        </v-container>
      </v-container>
      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/parcel/overall/')">ย้อนหลับ</v-btn>
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
              price: '',
              quantity: ''
            }
          ],
        },
        projectRules: [
          v => !!v || 'โปรดเลือกโครงการ',
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
            dateEntry: data.dateEntry || new Date(),
            itemParcels: [
              {
                parcelMasterId: null,
                parcelMasterName: data.parcelMasterName,
                price: data.price,
                quantity: data.quantity
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
            parcelMasterId: 0,
            price: '',
            quantity: ''
          }
        )
      },
      removeParcel (i) {
        this.form.itemParcels.splice(i, 1)
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
    .form-container {
      .select-dropdown, .parcel-name {
        width: 50%;
      }
    }
  }
</style>