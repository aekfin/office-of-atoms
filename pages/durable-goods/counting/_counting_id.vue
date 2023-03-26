<template>
  <div id="durable-goods-counting-detail-page">
    <PageHeader :text="isCreate ? 'การเพิ่มการตรวจนับครุภัณฑ์' : 'การแก้ไขการตรวจนับครุภัณฑ์'" hideTotal/>
    <v-form ref="form" v-model="valid" lazyValidation class="mt-10">
      <v-autocomplete ref="search" v-model="form.number" label="เลขที่ครุภัณฑ์"/>
      <div class="text-h5 mt-5 mb-5"><b>ตรวจนับครุภัณฑ์</b></div>
      <div class="goods-card-wrapper">
        <v-card v-for="(item, i) in form.items" :key="i"  class="goods-card" elevation="2">
          <div v-if="i > 0 && i === form.items.length - 1" class="close-wrapper">
            <v-btn color="secondary" icon @click.stop="removeDurableGoods(i)">
              <i class="material-icons">close</i>
            </v-btn>
          </div>
          <v-card-text class="text-black">
            <v-row align="center" class="mx-0">
              <v-col :cols="8">
                <div class="text-body">{{ item.name }}</div>
              </v-col>
              <v-col :cols="4" class="pr-8">
                <SelectDropdown :value.sync="form.items[i].status" label="สถานะ" :disabled="!isCreate" :items="statusList"/>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
      <v-container class="mt-10">
        <v-row justify="end">
          <v-btn large plain @click="$router.push('/durable-goods/counting/')">ย้อนกลับ</v-btn>
          <v-btn class="ml-4" elevation="2" large color="success" @click="onSubmit">{{ 'ยืนยัน' }}</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
    },
    data () {
      return {
        valid: true,
        form: {
          number: null,
          items: [
            { name: 'Aek', status: 1 },
            { name: 'Dom', status: 1 },
            { name: 'Bob', status: 1 },
          ],
        },
        statusList: [
          { id: 1, name: 'ปกติ' },
          { id: 2, name: 'ชำรุด' },
        ]
      }
    },
    computed: {
      isCreate () {
        return this.$route.params.counting_id === 'create'
      },
    },
    async mounted () {
      await this.$nextTick()
      if (this.$refs.search) this.$refs.search.focus()
    },
    methods: {
      removeDurableGoods (i) {
        this.form.items.splice(i, 1)
      },
      onSubmit () {
      }
    },
  }
</script>

<style lang="scss">
  #durable-goods-counting-detail-page {
    .text-body {
      font-size: 1rem;
    }


    .goods-card-wrapper {
      display: flex;
      flex-flow: column;
      gap: 20px;

      .goods-card {
        position: relative;

        .v-card__text {
          padding-top: 24px;
          padding-bottom: 12px;
        }

        .close-wrapper {
          position: absolute;
          top: 4px;
          right: 8px;
        }

        &:last-child {
          margin-bottom: 0px;
        }
      }
    }
  }
</style>