<template>
  <div id="type-parcel-page">
    <PageHeader text="ประเภทวัสดุคงคลัง" btnText="เพิ่มประเภท" unit="ประเภท" :total="total" @create="openCreateDialog"/>
    <v-data-table :headers="typeHeaders" :items="items" disableSort hideDefaultFooter class="elevation-1 mt-6" :loading="isLoading">
      <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
    </v-data-table>
    <Pagination/>

    <v-dialog v-if="createDialog" v-model="createDialog" width="720">
      <v-card>
        <v-card-title class="text-h5 justify-space-between">
          <div>เพิ่มประเภทวัสดุคงคลัง</div>
          <v-btn icon @click="closeCreateDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="black--text">
          <div class="mt-3">
            <v-form ref="form" v-model="valid" lazyValidation>
              <v-text-field v-model="form.typeName[0]" label="ชื่อวัสดุคงคลัง *" :rules="typeNameRule" required/>
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
        typeHeaders: [
          { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
          { text: 'ชื่อประเภท', value: 'name' },
        ],
        createDialog: false,
        valid: true,
        form: null,
        typeNameRule: [
          v => !!v || 'โปรดใส่ชื่อวัสดุคงคลัง',
        ],
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
          typeName: [
            ''
          ]
        }
      },
      async getList () {
        try {
          this.isLoading = true
          const { data } = await this.$store.dispatch('getListPagination', { apiPath: 'parcel/getListParcelType', query: this.$route.query, context: this })
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