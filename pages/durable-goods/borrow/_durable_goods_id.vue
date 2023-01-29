<template>
  <div id="durable-goods-borrow-detail-page">
    <PageHeader :text="isCreate ? 'การยืม-คืน ครุภัณฑ์' : 'การแก้ไขการยืม-คืน ครุภัณฑ์'" hideTotal/>
    <DurableGoodsBorrowForm :viewMode="!isCreate" @onSave="onSave" @submit="onSubmit"/>
  </div>
</template>

<script>
  export default {
    components: {
      PageHeader: () => import('~/components/PageHeader.vue'),
      DurableGoodsBorrowForm: () => import('~/components/DurableGoodsBorrowForm.vue'),
    },
    computed: {
      isCreate () {
        return this.$route.params.durable_goods_id === 'create'
      },
    },
    methods: {
      onSave (form) {
        console.log('Save', form)
      },
      onSubmit (form) {
        console.log('Submit', form)
      },
    }
  }
</script>

<style lang="scss">
  #durable-goods-borrow-detail-page {
  }
</style>