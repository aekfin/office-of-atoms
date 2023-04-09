<template>
  <div id="durable-goods-verify-counting-detail-page">
    <PageHeader text="ยืนยันการตรวจนับครุภัณฑ์"/>
    <div class="mt-10">
      <CountingDurableTable :items.sync="items" :isLoading="isLoading" @changeStatus="onChangeStatus"/>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        isLoading: false,
        items: [],
      }
    },
    methods: {
      async onChangeStatus (content) {
        this.onSave(content)
      },
      async onSave (content) {
        await this.$store.dispatch('snackbar', { text: `ตรวจนับครุภัณฑ์เลขที่ "${content.number}" สำเร็จ` })
      }
    },
  }
</script>

<style lang="scss">
  #durable-goods-verify-counting-detail-page {
    padding-bottom: 20px;

    .text-body {
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 8px
    }
  }
</style>