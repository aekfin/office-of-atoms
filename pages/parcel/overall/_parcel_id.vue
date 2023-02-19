<template>
  <div id="parcel-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มพัสดุ' : 'การแก้ไขพัสดุ'" hideTotal/>
    <v-form ref="form" v-model="valid" lazyValidation class="mt-4">
      <v-container>
        <v-row>
          <v-col :cols="8">
            <SelectDropdown :value.sync="form.projectId" itemValue="id" itemText="projectName" label="โครงการ *" apiPath="Project/getListProject" :rules="projectRules" required/>
          </v-col>
          <v-col :cols="4">
            <InputDatePicker :value.sync="form.dateEntry" label="วันที่รับเข้า *" :rules="dateEntryRules" required/>
          </v-col>
        </v-row>
        <v-expansion-panels v-model="formExpand" class="form-expansion-panels" flat multiple>
          <v-expansion-panel>
            <v-expansion-panel-header>เลือกพัสดุ</v-expansion-panel-header>
            <v-expansion-panel-content class="pl-4">
              <v-container>
                <v-row v-for="(parcel, i) in form.itemParcels" :key="i" align="baseline">
                  <div class="mr-4">{{ i + 1 }}.</div>
                  <SelectDropdown :value.sync="form.itemParcels[i].parcelMasterId" itemValue="id" itemText="name" label="พัสดุ *" apiPath="parcel/getListParcelMaster" :rules="parcelRules" required/>
                  <v-text-field v-model="form.itemParcels[i].price" class="ml-4" label="ราคา *" type="number" :rules="priceRules" required/>
                  <v-text-field v-model="form.itemParcels[i].quantity" class="ml-4" label="จำนวน *" type="number" :rules="quantityRules" required/>
                  <v-btn v-if="form.itemParcels.length > 1" class="ml-2" icon @click="removeParcel(ร)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-row>
                <v-row class="mt-5">
                  <v-btn block rounded outlined @click="addParcel()">เพิ่มพัสดุ</v-btn>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-container>
      <v-container class="mt-8">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/parcel/overall/')">ย้อนหลับ</v-btn>
          <v-btn elevation="2" large color="success" @click="onSubmit">บันทึก</v-btn>
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
    },
    data () {
      return {
        valid: true,
        form: {
          projectId: null,
          dateEntry: new Date(),
          itemParcels: [
            {
              parcelMasterId: 0,
              price: '',
              quantity: ''
            }
          ],
        },
        formExpand: [0],
        projectRules: [
          v => !!v || 'โปรดเลือกโครงการ',
        ],
        parcelRules: [
          v => !!v || 'โปรดเลือกพัสดุ',
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
    methods: {
      addParcel () {
        this.form.itemParcels.push(
          {
            parcelMasterId: 0,
            price: '',
            quantity: ''
          }
        )
      },
      removeBrand (i) {
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
            await this.$store.dispatch('snackbar', { text: this.isCreate ? 'สร้างโครงการ-พัสดุสำเร็จ' : 'แก้ไขประเภทสร้างโครงการ-พัสดุสำเร็จ' })
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
    .form-expansion-panels {
      .select-dropdown {
        width: 50%;
      }
    }
  }
</style>