<template>
  <div id="category-page">
    <v-tabs v-model="activeTab" color="black" class="mb-6">
      <v-tab>หมวดหมู่หลัก</v-tab>
      <v-tab>หมวดหมู่ย่อย</v-tab>
    </v-tabs>
    <NChild/>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        activeTab: 0
      }
    },
    watch: {
      '$route.path' () {
        this.setActiveTab()
      },
      'activeTab' (val) {
        this.$router.push({ path: `/management/category/${val === 1 ? 'sub/' : ''}` })
      }
    },
    mounted () {
      this.setActiveTab()
    },
    methods: {
      setActiveTab () {
        this.activeTab = this.$route.path.includes('/management/category/sub') ? 1 : 0
      }
    }
  }
</script>

<style lang="scss">
  #category-page {
  }
</style>